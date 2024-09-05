import openai


openai.api_key = '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'  

def gpt_refine_matches(resume_keywords, job_description):
    prompt = f"""
    Based on the candidate's skills: {resume_keywords}, refine and summarize this job description to highlight key relevant details for the candidate:
    
    Job Description: {job_description}
    """
    
    response = openai.ChatCompletion.create(
        model="gpt-4o-mini-2024-07-18",  # Use the specified model version
        messages=[
            {"role": "system", "content": "You are a job recommendation assistant."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=150,  # Adjust the token limit based on expected output
        temperature=0.7  # Adjust creativity as needed
    )
    
    return response.choices[0].message['content'].strip()


from job_matching import matched_jobs, resume_keywords

for job in matched_jobs:
    refined_job_description = gpt_refine_matches(resume_keywords, job[0]['description'])
    print(f"Refined Job Description: {refined_job_description}")
