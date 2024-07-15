import os
from dotenv import load_dotenv
current_file_path = os.path.abspath(__file__)
dotenv_path = os.path.join(os.path.dirname(current_file_path), '.env')
load_dotenv(dotenv_path)
import time, random
import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client
from dotenv import load_dotenv


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

def fill_out_linked_in_jobs(job_listings) -> list:
    """
    Args:
        job_listings (list): a list of job dicts
    
    Returns:
        job_listings (list): the same list with additional fields

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
     - logo_url
     - salary (will be null, todo)
     - due_date (will be null, todo)
    """

    # Use a while loop so we can cleanly remove the current element if it throws an error
    i = 0
    while i < len(job_listings):
        job = job_listings[i]

        time.sleep(2 + random.random())

        url = job['link']
        response = requests.get(url)
        try:
            if response.status_code != 200:
                raise Exception(f"Error on job {job['title']}, Response: {response.status_code}. ")

            soup = BeautifulSoup(response.content, "html.parser")

            description = soup.find("div", class_="show-more-less-html__markup").text.strip()
            # posting_url = soup.find("a", class_="sign-up-modal__company_webiste").get('href')
            posting_url = None
            salary = None # Todo
            due_date = None # Todo
            job['description'] = description
            job['posting_url'] = posting_url
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
        print("Request failed!")
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
            'date_posted': job.find("time", class_="job-search-card__listdate").get('datetime')
        })

    job_listings = job_listings[0:5]

    job_listings = fill_out_linked_in_jobs(job_listings)
    
    return job_listings

if __name__ == "__main__":
    upload_jobs_to_skillsync()
    # Example usage
    # location = "Vancouver, British Columbia, Canada"
    # keywords = "Software Internship"
    # jobs = get_jobs_from_linkedin(keywords, location)

    # for job in jobs:
    #     print(f"Title: {job['title']}\nCompany: {job['company']}\nLocation: {job['location']}\nLink: {job['link']}\n\n")