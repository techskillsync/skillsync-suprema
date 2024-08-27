from openai import OpenAI
import pandas as pd
import csv
import os


client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key="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"
)

def generate_synthetic_resume(prompt):
    
    completion = client.chat.completions.create(
        model="nvidia/nemotron-4-340b-instruct",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        top_p=0.9,
        max_tokens=1024,
        stream=True
    )

    
    generated_text = ""
    for chunk in completion:
        if chunk.choices[0].delta.content is not None:
            generated_text += chunk.choices[0].delta.content

    return generated_text

def load_resumes_from_csv(file_path, resume_column):
    df = pd.read_csv(file_path, on_bad_lines='skip', quoting=csv.QUOTE_ALL)
    resumes = df[resume_column].tolist()
    return df.columns, resumes

def generate_and_save_resumes(num_resumes, resume_prompts, output_file, headers):
    generated_resumes = []
    for i in range(num_resumes):
        prompt = resume_prompts[i % len(resume_prompts)]  
        synthetic_resume = generate_synthetic_resume(prompt)
        generated_resumes.append(synthetic_resume)
    
    
    with open(output_file, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(headers)  
        for resume in generated_resumes:
            writer.writerow([resume])  

resumes_csv_path = '/Users/arjunsethi/Documents/resume.csv'
new_resumes_csv_path = '/Users/arjunsethi/Documents/new_resumes.csv'


resume_column = 'Resume_str' 


headers, resumes = load_resumes_from_csv(resumes_csv_path, resume_column)
_, new_resumes = load_resumes_from_csv(new_resumes_csv_path, resume_column)


all_resumes = resumes + new_resumes


additional_prompts = [
    "Create a professional resume for a software engineer with 5 years of experience in full-stack development, proficient in Python, JavaScript, and cloud computing. Include sections for contact information, professional summary, work experience, education, skills, and certifications.",
    "Create a professional resume for a data scientist with 4 years of experience in machine learning, data analysis, and statistical modeling. Include sections for contact information, professional summary, work experience, education, skills, and certifications.",
    "Create a professional resume for a finance analyst with 3 years of experience in financial modeling, budgeting, and investment analysis. Include sections for contact information, professional summary, work experience, education, skills, and certifications.",
    "Create a professional resume for a marketing specialist with 4 years of experience in digital marketing, content creation, and SEO. Include sections for contact information, professional summary, work experience, education, skills, and certifications.",
    "Create a professional resume for a supply chain manager with 6 years of experience in logistics, operations, and inventory management. Include sections for contact information, professional summary, work experience, education, skills, and certifications.",
    "Create a professional resume for an operations manager with 7 years of experience in operations management, process improvement, and project management. Include sections for contact information, professional summary, work experience, education, skills, and certifications.",
    "Create a professional resume for a business technology consultant with 5 years of experience in business technology solutions, IT consulting, and project management. Include sections for contact information, professional summary, work experience, education, skills, and certifications.",
    "Create a professional resume for a mechanical engineer with 5 years of experience in product design, CAD, and manufacturing processes. Include sections for contact information, professional summary, work experience, education, skills, and certifications.",
    "Create a professional resume for an electrical engineer with 4 years of experience in circuit design, embedded systems, and power distribution. Include sections for contact information, professional summary, work experience, education, skills, and certifications.",
    "Create a professional resume for a civil engineer with 6 years of experience in structural engineering, project management, and construction. Include sections for contact information, professional summary, work experience, education, skills, and certifications.",
    "Create a professional resume for a chemist with 5 years of experience in laboratory research, chemical analysis, and material science. Include sections for contact information, professional summary, work experience, education, skills, and certifications.",
    "Create a professional resume for a biologist with 4 years of experience in biological research, data analysis, and field studies. Include sections for contact information, professional summary, work experience, education, skills, and certifications.",
    "Create a professional resume for a psychologist with 5 years of experience in clinical psychology, patient counseling, and psychological assessments. Include sections for contact information, professional summary, work experience, education, skills, and certifications.",
    "Create a professional resume for an economist with 6 years of experience in economic analysis, forecasting, and policy development. Include sections for contact information, professional summary, work experience, education, skills, and certifications."
]


all_prompts = all_resumes + additional_prompts


output_file_path = '/Users/arjunsethi/Documents/synthetic_resumes.csv'


num_resumes_to_generate = 1000 
generate_and_save_resumes(num_resumes_to_generate, all_prompts, output_file_path, headers)
