import subprocess
import tarfile
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import openai
from flask import Flask, request, jsonify
import os
import fitz  # PyMuPDF

# Function to patch tarfile's extractall method
def patch_tarfile():
    original_extractall = tarfile.TarFile.extractall
    
    def patched_extractall(self, path=".", members=None, *, numeric_owner=False):
        original_extractall(self, path, members, numeric_owner=numeric_owner)
    
    tarfile.TarFile.extractall = patched_extractall

# Apply the patch immediately
patch_tarfile()

# Run openai migrate
try:
    subprocess.run(["openai", "migrate"], check=True)
    print("Successfully migrated OpenAI codebase.")
except subprocess.CalledProcessError as e:
    print(f"Error during migration: {e}")
    exit(1)
except FileNotFoundError:
    print("OpenAI CLI not found. Please ensure OpenAI CLI is installed and in your PATH.")
    exit(1)

# Define file paths
resume_file_path = os.path.expanduser('~/Documents/resume.csv')
new_resume_file_path = os.path.expanduser('~/Documents/new_resumes.csv')
postings_file_path = os.path.expanduser('~/Documents/postings.csv')

# OpenAI API key
openai.api_key = 'sk-proj-sScFMZr4GK3XaQ5mcYFYT3BlbkFJ1orIjm1gKSNT0q30KBMZ'

# Load the CSV files and initialize TF-IDF vectorizer
try:
    print("Loading existing resumes...")
    existing_resume_df = pd.read_csv(resume_file_path)
    print("Loading new resumes...")
    new_resume_df = pd.read_csv(new_resume_file_path)
    
    # Renaming columns to match existing dataset
    new_resume_df.columns = ['Category', 'Resume_str']
    
    # Combine the existing resumes with the new resumes
    print("Combining existing and new resumes...")
    resume_df = pd.concat([existing_resume_df, new_resume_df], ignore_index=True)
    
    print("Loading job postings...")
    postings_df = pd.read_csv(postings_file_path)
    
    print("CSV files loaded successfully.")
    print("Resume DataFrame columns:", resume_df.columns)
    print("Postings DataFrame columns:", postings_df.columns)
except Exception as e:
    print(f"Error loading CSV files: {e}")

# Check for required columns
try:
    if 'Resume_str' not in resume_df.columns or 'Category' not in resume_df.columns:
        raise KeyError("Required columns 'Resume_str' or 'Category' are missing from resume CSV.")
except Exception as e:
    print(f"Error checking columns: {e}")

try:
    if 'description' not in postings_df.columns:
        raise KeyError("Required column 'description' is missing from postings CSV.")
except Exception as e:
    print(f"Error checking columns: {e}")

# Handle NaN values and extract text
try:
    print("Handling NaN values in resumes and job descriptions...")
    resume_df['Resume_str'] = resume_df['Resume_str'].fillna('')
    postings_df['description'] = postings_df['description'].fillna('')
    resumes_text = resume_df['Resume_str']
    job_descriptions_text = postings_df['description']
    print("Extracted resume and job description text successfully.")
except Exception as e:
    print(f"Error extracting resume or job description text: {e}")

# Clean and preprocess text
def clean_text(text):
    text = re.sub(r'\s+', ' ', text)  # Remove multiple spaces
    text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
    text = text.lower()  # Convert to lowercase
    return text

try:
    print("Cleaning resume text...")
    resumes_text = resumes_text.apply(clean_text)
    print("Cleaning job description text...")
    job_descriptions_text = job_descriptions_text.apply(clean_text)
    print("Cleaned text successfully.")
except Exception as e:
    print(f"Error cleaning text: {e}")

# Vectorize the text data using TF-IDF
try:
    print("Starting text vectorization...")
    vectorizer = TfidfVectorizer(stop_words='english')
    job_desc_tfidf = vectorizer.fit_transform(job_descriptions_text)
    resumes_tfidf = vectorizer.transform(resumes_text)
    print("Text vectorization successful.")
except Exception as e:
    print(f"Error in text vectorization: {e}")

# Calculate cosine similarity between job descriptions and resumes
def calculate_similarity(resume_tfidf, job_desc_tfidf):
    return cosine_similarity(resume_tfidf, job_desc_tfidf)

try:
    print("Calculating similarity scores...")
    similarity_scores = calculate_similarity(resumes_tfidf, job_desc_tfidf)
    print("Calculated similarity scores successfully.")
except Exception as e:
    print(f"Error calculating similarity scores: {e}")

# Print similarity scores for debugging
try:
    print("Similarity Scores Matrix:")
    print(similarity_scores)
except Exception as e:
    print(f"Error printing similarity scores: {e}")

# Function to extract text from a PDF file
def extract_text_from_pdf(pdf_file):
    try:
        print("Extracting text from uploaded PDF...")
        doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        print("Text extraction from PDF successful.")
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

# Function to analyze a new resume using the similarity scores and GPT-4
def analyze_resume(resume_text, job_desc_tfidf, vectorizer):
    try:
        print("Cleaning the uploaded resume text...")
        cleaned_resume = clean_text(resume_text)
        print("Vectorizing the cleaned resume text...")
        resume_tfidf = vectorizer.transform([cleaned_resume])
        print("Calculating similarity score for the uploaded resume...")
        similarity_scores = calculate_similarity(resume_tfidf, job_desc_tfidf)
        match_score = similarity_scores.max()  # Best match score
        best_match_index = similarity_scores.argmax()
        print(f"Match score for the uploaded resume: {match_score}")
        print(f"Best matching job description index: {best_match_index}")
        print(f"Similarity scores: {similarity_scores}")

        # Generate detailed feedback using GPT-4
        print("Generating feedback using GPT-4...")
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a resume analysis assistant."},
                {"role": "user", "content": f"Analyze this resume and provide detailed feedback on how it can be improved:\n\n{resume_text}"}
            ]
        )
        
        gpt_feedback = response['choices'][0]['message']['content']
        print("GPT-4 feedback generation successful.")
        return match_score, best_match_index, gpt_feedback
    except Exception as e:
        print(f"Error in resume analysis or GPT-4 feedback generation: {e}")
        return None, None, None

# Flask app setup
app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"})
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"})
    
    if file:
        resume_text = extract_text_from_pdf(file)
        match_score, best_match_index, feedback = analyze_resume(resume_text, job_desc_tfidf, vectorizer)
        if match_score is not None and feedback is not None:
            return jsonify({"match_score": match_score, "best_match_index": best_match_index, "feedback": feedback})
        else:
            return jsonify({"error": "Error in resume analysis or GPT-4 feedback generation"})

if __name__ == '__main__':
    app.run(port=5001)  
