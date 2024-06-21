import requests
from bs4 import BeautifulSoup

def get_jobs_from_linkedin(location, keywords):
    url = f"https://www.linkedin.com/jobs/search/?keywords={keywords}&location={location}"
    response = requests.get(url)
    
    if response.status_code == 200:
        # Process the response here
        print("Request successful!")

        # Parse the HTML content
        soup = BeautifulSoup(response.content, "html.parser")
        cleaned_soup = soup.prettify()

        # print(cleaned_soup)

        job_listings_html = soup.find_all("div", class_="base-card--link")
        job_listings = []
        for job in job_listings_html:
            job_listings.append({
                'title': job.find("span", class_="sr-only").text.strip(),
                'company': job.find("h4", class_="base-search-card__subtitle").text.strip(),
                'location': job.find("span", class_="job-search-card__location").text.strip(),
                'link': job.find("a", class_="base-card__full-link").get("href")
            })
        for job in job_listings:
            print(f"Title: {job['title']}\nCompany: {job['company']}\nLocation: {job['location']}\nLink: {job['link']}\n\n")
       
        print(len(job_listings))
        
    else:
        print("Request failed!")

# Example usage
location = "Vancouver, British Columbia, Canada"
keywords = "Software"
get_jobs_from_linkedin(location, keywords)
