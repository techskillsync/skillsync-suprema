import time
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from imblearn.over_sampling import SMOTE
import joblib
import re
import openai
from flask import Flask, request, jsonify
import os
import fitz  # PyMuPDF

# Define file paths
existing_resume_file_path = os.path.expanduser('~/Documents/resume.csv')
new_resume_file_path = os.path.expanduser('~/Documents/new_resumes.csv')  
postings_file_path = os.path.expanduser('~/Documents/postings.csv')
model_file_path = os.path.expanduser('~/Documents/resume_enhancer_model.pkl')
vectorizer_file_path = os.path.expanduser('~/Documents/resume_vectorizer.pkl')

# OpenAI API key
openai.api_key = 'sk-proj-sScFMZr4GK3XaQ5mcYFYT3BlbkFJ1orIjm1gKSNT0q30KBMZ'

# Load the CSV files
try:
    existing_resume_df = pd.read_csv(existing_resume_file_path)
    new_resume_df = pd.read_csv(new_resume_file_path)
    
    # Renaming columns to match existing dataset
    new_resume_df.columns = ['Category', 'Resume_str']
    
    # Combine the existing resumes with the new resumes
    resume_df = pd.concat([existing_resume_df, new_resume_df], ignore_index=True)
    
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

# Combine all job postings into a single string for keyword extraction
try:
    postings_df['description'] = postings_df['description'].fillna('')
    postings_text = " ".join(postings_df['description'])
    print("Combined job postings text successfully.")
except Exception as e:
    print(f"Error combining job postings text: {e}")

# Extract the text from resumes
try:
    resumes_text = resume_df['Resume_str']
    print("Extracted resume text successfully.")
except Exception as e:
    print(f"Error extracting resume text: {e}")

# Clean and preprocess text
def clean_text(text):
    text = re.sub(r'\s+', ' ', text)  # Remove multiple spaces
    text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
    text = text.lower()  # Convert to lowercase
    return text

try:
    resumes_text = resumes_text.apply(clean_text)
    postings_text = clean_text(postings_text)
    print("Cleaned text successfully.")
except Exception as e:
    print(f"Error cleaning text: {e}")

# Vectorize the text data using TF-IDF with n-grams
try:
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=5000)
    tfidf_matrix = vectorizer.fit_transform([postings_text] + resumes_text.tolist())
    print("Text vectorization successful.")
except Exception as e:
    print(f"Error in text vectorization: {e}")

# Extract feature names
try:
    feature_names = vectorizer.get_feature_names_out()
    print("Extracted feature names successfully.")
except Exception as e:
    print(f"Error extracting feature names: {e}")

# Get the TF-IDF score for each resume
try:
    resume_tfidf = tfidf_matrix[1:].toarray()
    print(f"Extracted TF-IDF scores successfully. Shape: {resume_tfidf.shape}")
except Exception as e:
    print(f"Error extracting TF-IDF scores: {e}")

# Convert TF-IDF scores to a DataFrame for easier manipulation
try:
    tfidf_df = pd.DataFrame(resume_tfidf, columns=feature_names)
    print("Converted TF-IDF scores to DataFrame successfully.")
except Exception as e:
    print(f"Error converting TF-IDF scores to DataFrame: {e}")

# Extract labels
try:
    labels = resume_df['Category']
    print("Extracted labels successfully. Shape: ", labels.shape)
except Exception as e:
    print(f"Error extracting labels: {e}")

# Balance the dataset using SMOTE
try:
    smote = SMOTE(random_state=42)
    X_resampled, y_resampled = smote.fit_resample(tfidf_df, labels)
    print(f"Balanced the dataset using SMOTE. Resampled shape: {X_resampled.shape}, {y_resampled.shape}")
except Exception as e:
    print(f"Error balancing the dataset: {e}")

# Split the data into training and testing sets
try:
    start_time = time.time()
    X_train, X_test, y_train, y_test = train_test_split(X_resampled, y_resampled, test_size=0.2, random_state=42)
    end_time = time.time()
    print(f"Split data into training and testing sets successfully in {end_time - start_time} seconds.")
    print(f"Training set shape: {X_train.shape}, {y_train.shape}")
    print(f"Testing set shape: {X_test.shape}, {y_test.shape}")
except Exception as e:
    print(f"Error splitting data: {e}")

# Train a Random Forest model
try:
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    print("Model training successful.")
except Exception as e:
    print(f"Error in model training: {e}")

# Evaluate the model
try:
    y_pred = model.predict(X_test)
    print("Model evaluation successful.")
    print("Accuracy:", accuracy_score(y_test, y_pred))
    print("Classification Report:\n", classification_report(y_test, y_pred))
except Exception as e:
    print(f"Error in model evaluation: {e}")

# Save the model and vectorizer
try:
    joblib.dump(model, model_file_path)
    joblib.dump(vectorizer, vectorizer_file_path)
    print("Model and vectorizer saved successfully.")
except Exception as e:
    print(f"Error saving model or vectorizer: {e}")

# Function to extract text from a PDF file
def extract_text_from_pdf(pdf_file):
    try:
        doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        print("Text extraction from PDF successful.")
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

# Function to analyze a new resume using the trained model and GPT-4
def analyze_resume(resume_text):
    try:
        new_resume_cleaned = clean_text(resume_text)
        new_resume_tfidf = vectorizer.transform([new_resume_cleaned])
        prediction = model.predict(new_resume_tfidf)[0]
        print("Resume analysis successful.")

        # Generate detailed feedback using GPT-4
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a resume analysis assistant."},
                {"role": "user", "content": f"Analyze this resume and provide detailed feedback on how it can be improved:\n\n{resume_text}"}
            ]
        )
        
        gpt_feedback = response['choices'][0]['message']['content']
        print("GPT-4 feedback generation successful.")
        return prediction, gpt_feedback
    except Exception as e:
        print(e)
        print(f"Error in resume analysis or GPT-4 feedback generation: {e}")
        return None, None

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
        print(resume_text)
        prediction, feedback = analyze_resume(resume_text)
        print(prediction)
        print(feedback)
        if prediction is not None and feedback is not None:
            return jsonify({"prediction": prediction, "feedback": feedback})
        else:
            return jsonify({"error": "Erroxr in resume analysis or GPT-4 feedback generation"})

if __name__ == '__main__':
    app.run(port=5001)  
