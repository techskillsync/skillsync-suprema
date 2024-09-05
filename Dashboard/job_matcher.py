import spacy
from collections import Counter


nlp = spacy.load("en_core_web_sm")


def extract_keywords(text):
    doc = nlp(text.lower())
    keywords = [token.text for token in doc if token.is_alpha and not token.is_stop and token.pos_ in ['NOUN', 'PROPN', 'ADJ']]
    return Counter(keywords)


def match_scraped_jobs(resume_keywords, scraped_jobs):
    matched_jobs = []
    for job in scraped_jobs:
        job_keywords = extract_keywords(job['description'])  
        match_score = sum((resume_keywords & job_keywords).values())  
        if match_score > 0:
            matched_jobs.append((job, match_score))
    return sorted(matched_jobs, key=lambda x: x[1], reverse=True)


saved_jobs = []
discarded_jobs = []

def swipe(job_id, direction, matched_jobs):
    if direction == 'right':
        saved_jobs.append(matched_jobs[job_id][0])  
        print(f"Job saved: {matched_jobs[job_id][0]['title']} at {matched_jobs[job_id][0]['company']}")
    elif direction == 'left':
        discarded_jobs.append(matched_jobs[job_id][0])
        print(f"Job discarded: {matched_jobs[job_id][0]['title']} at {matched_jobs[job_id][0]['company']}")


resume = """
Software Engineer with experience in Python, Django, and Machine Learning. Skilled in web development and data analysis.
"""
resume_keywords = extract_keywords(resume)


from scraper import scraped_jobs  


matched_jobs = match_scraped_jobs(resume_keywords, scraped_jobs)


swipe(0, 'right', matched_jobs)
swipe(1, 'left', matched_jobs)


print("Saved Jobs:", saved_jobs)
print("Discarded Jobs:", discarded_jobs)
