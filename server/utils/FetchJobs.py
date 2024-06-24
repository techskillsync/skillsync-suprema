import requests
import os
from bs4 import BeautifulSoup
from supabase import create_client, Client
from datetime import datetime, timezone, timedelta

def upload_jobs_to_skillsync():
    url: str = os.environ.get("SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_SERVICE_KEY")
    
    if key is None:
        print("Supabase service key not found!")
        return
    
    supabase: Client = create_client(url, key)

    # Delete all rows in the table
    data, count = supabase.table('job_listings').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()

    # Add ~ 60 new job postings to the table
    job_postings = get_jobs_from_linkedin("Vancouver, British Columbia, Canada", "Software")
    for job in job_postings:
        data, count = supabase.table('job_listings').insert({
            "title": job['title'],
            "company": job['company'],
            "location": job['location'],
            "link": job['link'],
        }).execute()

def get_jobs_from_linkedin(location, keywords):
    url = f"https://www.linkedin.com/jobs/search/?keywords={keywords}&location={location}"
    response = requests.get(url)

    if response.status_code != 200:
        print("Request failed!")
        return
    
    soup = BeautifulSoup(response.content, "html.parser")

    job_listings_html = soup.find_all("div", class_="base-card--link")
    job_listings = []
    for job in job_listings_html:
        job_listings.append({
            'title': job.find("span", class_="sr-only").text.strip(),
            'company': job.find("h4", class_="base-search-card__subtitle").text.strip(),
            'location': job.find("span", class_="job-search-card__location").text.strip(),
            'link': job.find("a", class_="base-card__full-link").get("href")
        })

    # for job in job_listings:
    #     print(f"Title: {job['title']}\nCompany: {job['company']}\nLocation: {job['location']}\nLink: {job['link']}\n\n")
       
    return job_listings

if __name__ == "__main__":
    # Example usage
    location = "Vancouver, British Columbia, Canada"
    keywords = "Software Internship"
    jobs = get_jobs_from_linkedin(location, keywords)

    for job in jobs:
        print(f"Title: {job['title']}\nCompany: {job['company']}\nLocation: {job['location']}\nLink: {job['link']}\n\n")