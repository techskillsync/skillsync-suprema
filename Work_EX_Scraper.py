import pdfplumber
from docx import Document
import spacy
import re

nlp = spacy.load('en_core_web_sm')

def parse_pdf_resume(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text

def parse_docx_resume(file_path):
    doc = Document(file_path)
    text = ""
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text

def extract_work_experience(text):
    doc = nlp(text)
    experience_section = ""
    capture = False
    for sent in doc.sents:
        if re.search(r'\b(Experience|Employment History|Work History|Professional Experience)\b', sent.text, re.IGNORECASE):
            capture = True
        if re.search(r'\b(Education|Skills|Projects|Certifications|Awards|References)\b', sent.text, re.IGNORECASE):
            capture = False
        if capture:
            experience_section += sent.text + "\n"
    
    jobs = []
    job_pattern = re.compile(
        r'(?P<position>.+?)\s+at\s+(?P<company>.+?)\s+-\s+(?P<start_date>.+?)(?:\s*to\s*(?P<end_date>.+?)|\s*-\s*Present)\s*(?P<location>.+?)?\n(?P<description>.*?)\n\n',
        re.DOTALL | re.IGNORECASE
    )
    for match in job_pattern.finditer(experience_section):
        jobs.append({
            'position': match.group('position').strip(),
            'company': match.group('company').strip(),
            'start_date': match.group('start_date').strip(),
            'end_date': match.group('end_date').strip() if match.group('end_date') else 'Present',
            'location': match.group('location').strip() if match.group('location') else '',
            'description': match.group('description').strip()
        })
    return jobs

def parse_resume(file_path):
    if file_path.lower().endswith('.pdf'):
        resume_text = parse_pdf_resume(file_path)
    elif file_path.lower().endswith('.docx'):
        resume_text = parse_docx_resume(file_path)
    else:
        raise ValueError("Unsupported file format. Please upload a PDF or DOCX file.")

    return extract_work_experience(resume_text)

file_path = 'path/to/resume.pdf'  
work_experience = parse_resume(file_path)

for job in work_experience:
    print(f"Position: {job['position']}")
    print(f"Company: {job['company']}")
    print(f"Start Date: {job['start_date']}")
    print(f"End Date: {job['end_date']}")
    print(f"Location: {job['location']}")
    print(f"Description: {job['description']}")
    print('---')
