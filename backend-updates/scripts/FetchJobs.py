"""
Some Notes:
LinkedIn does not give us all the information we want from our first search.
We need to follow each jobs link to get the rest of the information.
The original search gives us:
    - title
    - company
    - location
    - link
    - date_posted
We will follow the link to get:
    - description
    - posting_url
    - num applicants
    - logo_url
    - salary (will be null, todo)
    - due_date (will be null, todo)
"""

import os
from dotenv import load_dotenv
current_file_path = os.path.abspath(__file__)
dotenv_path = os.path.join(os.path.dirname(current_file_path), '.env')
load_dotenv(dotenv_path)
import time, random, re
import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client
from dotenv import load_dotenv
from IpSwitcher import fetch_with_proxy


def upload_jobs_to_skillsync(keywords:str, location:str) -> None:
    url: str = os.environ.get("SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_SERVICE_KEY")
    
    if key is None:
        print("Supabase service key not found!")
        return
    
    supabase: Client = create_client(url, key)

    # Add ~ 60 new job postings to the table
    job_postings = get_jobs_from_linkedin(location, keywords)
    for job in job_postings:
        data, count = supabase.table('job_listings').insert({
            "title": job['title'],
            "company": job['company'],
            "location": job['location'],
            "link": job['link'],
            "description": job.get('description'),
            "posting_url": job.get('posting_url'),
            "logo_url": job.get('logo_url'),
            "salary": job.get('salary'),
            "due_date": job.get('due_date'),
            "date_posted": job.get('date_posted')
        }).execute()
    print(f'uploaded {len(job_postings)} jobs to supabase')

def get_additional_info(job: dict) -> dict|None:
    """
    Args:
        job (dict): must have a 'link' key to a linkedIn job posting
    Returns:
        job (dict): the same dict with additional fields added
    """
    url = job['link']
    response = requests.get(url)

    if response.status_code != 200:
        raise Exception(f"Error on job {job['title']}, Response: {response.status_code}. ")

    soup = BeautifulSoup(response.content, "html.parser")

    # Get description
    description = soup.find("div", class_="show-more-less-html__markup").text.strip()

    # Get Num Applicants
    job_posting = soup.find("div", class_="top-card-layout__card")
    top_card = job_posting.find_all("div", class_="topcard__flavor-row")[1]
    num_applicants = top_card.find_all('span')[1].text.strip()

    # Get Apply URL
    posting_url = soup.find("code", id="applyUrl").contents[0].strip('"')

    # Get Icon URL
    logo_url = "https://picsum.photos/id/152/50" # The images are dynamically loaded so we cant get em easily

    job['description'] = description
    job['posting_url'] = posting_url
    job['num applicants'] = num_applicants
    job['logo_url'] = logo_url
    
    return job

def fill_out_linked_in_jobs(job_listings) -> list:
    """
    Args:
        job_listings (list): a list of job dicts
    
    Returns:
        job_listings (list): the same list with additional fields
    """

    # Use a while loop so we can cleanly remove the current element if it throws an error
    i = 0
    while i < len(job_listings):
        job = job_listings[i]
        try:
            job = get_additional_info(job)
            i+=1
        except Exception as e:
            print(f"{e} Removing from job_listings")
            job_listings.pop(i)
            print(i, len(job_listings))
    
    return job_listings

def get_jobs_from_linkedin(keywords: str, location: str) -> list:
    url = f"https://www.linkedin.com/jobs/search/?keywords={keywords}&location={location}"
    response = requests.get(url)

    if response.status_code != 200:
        print("Original Request failed!")
        print(response)
        return []

    soup = BeautifulSoup(response.content, "html.parser")

    job_listings_html = soup.find_all("div", class_="base-card--link")
    job_listings = []
    for job in job_listings_html:
        job_listings.append({
            'title': job.find("span", class_="sr-only").text.strip(),
            'company': job.find("h4", class_="base-search-card__subtitle").text.strip(),
            'location': job.find("span", class_="job-search-card__location").text.strip(),
            'link': job.find("a", class_="base-card__full-link").get("href"),
            'date_posted': job.find("time").get('datetime')
        })

    return job_listings

if __name__ == "__main__":
    location = "Vancouver, British Columbia, Canada"
    keywords = "Software Internship"
    jobs = get_jobs_from_linkedin(keywords, location)
    jobs = jobs[0:3]
    jobs = fill_out_linked_in_jobs(jobs)

    for job in jobs:
        print(f"Title {job['title']}\nDescription {job['description'][:10]}\nNum Applicants {job['num applicants']}\nPosting URL {job['posting_url']}")

    # Example usage
    # location = "Vancouver, British Columbia, Canada"
    # keywords = "Software Internship"
    # jobs = get_jobs_from_linkedin(keywords, location)
    # filled_out_jobs = fill_out_linked_in_jobs(jobs)

    # for job in jobs:
    #     print(f"Title: {job['title']}\n Company: {job['company']}\n Location: {job['location']}\n Link: {job['link']}\n Date Posted: {job['date_posted']}\n")