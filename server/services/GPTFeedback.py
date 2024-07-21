__all__ = ['GPT_feedback']

from flask import jsonify
from openai import OpenAI
import fitz

# Function to extract text from a PDF file
def _extract_text_from_pdf(pdf_file):
    try:
        doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

# Analyze a new resume using GPT-4
def _analyze_resume(resume_text):
    client = OpenAI(api_key = 'sk-proj-sScFMZr4GK3XaQ5mcYFYT3BlbkFJ1orIjm1gKSNT0q30KBMZ')
    
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a resume analysis assistant."},
                {"role": "user", "content": f"Analyze this resume and provide detailed feedback on how it can be improved:\n\n {resume_text}"}
            ]
        )
        
        gpt_feedback = response.choices[0].message.content
        return gpt_feedback
    except Exception as e:
        print(f"Error in resume analysis or GPT-4 feedback generation: {e}")
        return None, None 

def GPT_feedback(file):
    resume_text = _extract_text_from_pdf(file)
    feedback = _analyze_resume(resume_text)
    if feedback is not None:
        return feedback
    else:
        return "Error in resume analysis or GPT-4 feedback generation"