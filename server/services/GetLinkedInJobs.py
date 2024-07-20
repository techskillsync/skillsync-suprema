"""
Some Notes:
LinkedIn does not give us all the information we want from our first search.
We need to follow each job's link to get the rest of the information.
The original search gives us:
    - title
    - company
    - location
    - link
    - date_posted
We will follow the link to get:
    - description
    - apply_url
    - num applicants
    - logo_url
    - salary (will be null, todo)
    - due_date (will be null, todo)

Now the problem is that it is too slow. In the future I should first return the results of the 
initial request then return the details as they come in.

The key to this problem is that LinkedIn randomly gives errors when sending GET requests.
This file has emphasis on measures to handle failed GET requests to LinkedIn.

The measures are implemented in custom_fetch().

Measure 1: Proxies (Not in use)
Wrap get requests in IpSwitcher's fetch_with_proxy().
This is not a good solution because the requests fail anyway and 96% of proxies are broken 
resulting in very long request times.

Measure 2: Flurry of GET requests (untested)
Send 7 GET requests at random short intervals and home one goes through.
This seems like it should not work but it actually works really well.

This is an interesting API link.
Im not using it because it seems not any faster and the number of applicants dont show
# https://ca.linkedin.com/jobs-guest/jobs/api/jobPosting/3960439646 (5 jobs - 17 seconds)
# 
"""

__all__ = ['get_linkedin_jobs']

import os
from dotenv import load_dotenv
current_file_path = os.path.abspath(__file__)
dotenv_path = os.path.join(os.path.dirname(current_file_path), '.env')
load_dotenv(dotenv_path)
import re, logging
import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client
from dotenv import load_dotenv

def get_linkedin_jobs(keywords:str, location:str) -> list[dict]:
    jobs = _shallow_linkedin_search(keywords, location)
    jobs = jobs[0:5]
    jobs = _fill_shallow_jobs(jobs)
    _upload_to_supabase(jobs)
    return jobs

def _shallow_linkedin_search(keywords:str, location:str) -> list[dict]:
    url = f"https://www.linkedin.com/jobs/search/?keywords={keywords}&location={location}"
    response = _custom_get(url)
    if not response.ok:
        logging.warning(" - 😵 shallow linkedin search failed, aborting search")
        logging.info(response)
        return []
    soup = BeautifulSoup(response.content, "html.parser")
    job_listings_html = soup.find_all("div", class_="base-card--link")
    job_listings = []

    for job in job_listings_html:
        job_entity = job.get('data-entity-urn')
        # Extract the job_id. I am sorry for such an awful line.
        linkedin_id = re.search(r'\d+', job_entity).group() if re.search(r'\d+', job_entity) else None

        job_listings.append({
            'linkedin_id': linkedin_id,
            'title': job.find("span", class_="sr-only").text.strip(),
            'company': job.find("h4", class_="base-search-card__subtitle").text.strip(),
            'location': job.find("span", class_="job-search-card__location").text.strip(),
            'link': job.find("a", class_="base-card__full-link").get("href"),
            'date_posted': job.find("time").get('datetime')
        })

    return job_listings

def _fill_shallow_jobs(job_listings:list) -> list[dict]:
    """
    Fetches each job posting to get more info. Removes job if it fails
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
            job = _fill_job(job)
            i+=1
        except requests.exceptions.HTTPError as http_err:
            logging.warning(' - ✋ linked refused all job requests')
            job_listings.pop(i)
        except Exception as e:
            logging.warning(f' - 🗑️ error parsing html, removing {job['title']}, {job['linkedin_id']}')
            logging.info(' - 🏃‍♂️‍➡️ fixing this parsing will make the script faster')
            logging.info(e)
            job_listings.pop(i)

    return job_listings

def _fill_job(job:dict) -> dict:
    """
    Args:
        job (dict): must have a 'link' key to a linkedIn job posting
    Returns:
        job (dict): the same dict with additional fields added
    """
    url = job['link']
    response = _custom_get(url)

    if response.status_code != 200:
        raise response.raise_for_status()

    soup = BeautifulSoup(response.content, "html.parser")

    # Get description
    description = soup.find("div", class_="show-more-less-html__markup").text.strip()

    # Get Num Applicants
    job_posting = soup.find("div", class_="top-card-layout__card").decode_contents()
    patterns = [
        r'\b\d{1,3} people clicked Apply\b',
        r'\bOver \d{1,3} people clicked Apply\b',
        r'\bOver \d{1,3} applicants\b',
        r'\b\d{1,3} applicants\b'
    ]
    combined_pattern = '|'.join(patterns)
    regex = re.compile(combined_pattern)
    # Below we find a string that matches LinkedIn's applicants text
    num_applicants_str_arr = regex.findall(job_posting)
    if len(num_applicants_str_arr) != 0:
        num_applicants_str = num_applicants_str_arr[0]
        # Here we remove everything but the numbers
        num_applicants = ''.join(re.findall(r'\d+', num_applicants_str))
    else:
        num_applicants = None

    # Get Apply URL
    apply_tag = soup.find("code", id="applyUrl")
    if apply_tag == None:
        apply_url = job['link']
    else:
        apply_url = apply_tag.contents[0].strip('"')

    # Get Icon URL
    logo_url = "https://picsum.photos/id/152/50" # The images are dynamically loaded so we cant get em easily

    job['description'] = description
    job['apply_url'] = apply_url
    job['num_applicants'] = num_applicants
    job['logo_url'] = logo_url

    return job


def _custom_get(url:str) -> requests.Response:
    for i in range(7):
        response = requests.get(url)
        if response.ok:
            break;
    return response

def _upload_to_supabase(jobs:list) -> int:
    url: str = os.environ.get("SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_SERVICE_KEY")

    if key is None:
        print(" - ❌ supabase service key not found!")
        print(" - 🤬 did not upload jobs to supabase")
        return

    supabase: Client = create_client(url, key)

    for job in jobs:
        data, count = supabase.table('job_listings').insert({
            "title": job['title'],
            "company": job['company'],
            "location": job['location'],
            "link": job['link'],
            "description": job.get('description'),
            "apply_url": job.get('apply_url'),
            "num_applicants": job.get('num_applicants'),
            "logo_url": job.get('logo_url'),
            "salary": job.get('salary'),
            "due_date": job.get('due_date'),
            "date_posted": job.get('date_posted')
        }).execute()

    print(f' - 📡 uploaded {len(jobs)} jobs to supabase')
    return len(jobs)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    keywords = "Software Internship"
    location = "Toronto, Canada"
    jobs = get_linkedin_jobs(keywords, location)

    # for job in jobs:
    #     print(f"LinkedInId {job['linkedin_id']}\nLink {job['link']}\n\n")

    for job in jobs:
        print(f"LinkedInId' {job['linkedin_id']}\nTitle {job['title']}\nDescription {job['description'][:10]}\nNum Applicants {job['num_applicants']}\nApply URL {job['apply_url']}\n")