import threading
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def scrape_linkedin(keyword, location):
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

    search_url = f"https://www.linkedin.com/jobs/search/?keywords={keyword}&location={location}"
    driver.get(search_url)

    driver.implicitly_wait(10)

    def apply_filters():
        try:
            experience_filter = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, '//button[contains(@aria-label, "Experience Level filter.")]'))
            )
            experience_filter.click()

            internship_level = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, '//label[contains(@for, "experience-1")]'))
            )
            internship_level.click()

            apply_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, '//button[@aria-label="Apply current filters to show results"]'))
            )
            apply_button.click()

            time.sleep(5)

        except Exception as e:
            print(f"An error occurred while applying filters on LinkedIn: {e}")

    apply_filters()

    def scrape():
        jobs = []
        try:
            job_elements = WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located((By.CLASS_NAME, 'job-card-container'))
            )

            for job in job_elements:
                try:
                    title = job.find_element(By.CLASS_NAME, 'job-card-list__title').text
                    company = job.find_element(By.CLASS_NAME, 'job-card-container__company-name').text
                    location = job.find_element(By.CLASS_NAME, 'job-card-container__metadata-item').text
                    job_link = job.find_element(By.TAG_NAME, 'a').get_attribute('href')
                    jobs.append({
                        'title': title,
                        'company': company,
                        'location': location,
                        'link': job_link
                    })
                except Exception as e:
                    print(f"An error occurred while extracting job details from LinkedIn: {e}")

        except Exception as e:
            print(f"An error occurred while finding job elements on LinkedIn: {e}")

        return jobs

    job_list = scrape()

    for job in job_list:
        print(f"LinkedIn - Title: {job['title']}, Company: {job['company']}, Location: {job['location']}, Link: {job['link']}")

    driver.quit()

def scrape_indeed(keyword, location):
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

    search_url = f"https://www.indeed.com/jobs?q={keyword}&l={location}"
    driver.get(search_url)

    driver.implicitly_wait(10)

    def scrape():
        jobs = []
        try:
            job_elements = WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located((By.CLASS_NAME, 'result'))
            )

            for job in job_elements:
                try:
                    title = job.find_element(By.CLASS_NAME, 'jobTitle').text
                    company = job.find_element(By.CLASS_NAME, 'companyName').text
                    location = job.find_element(By.CLASS_NAME, 'companyLocation').text
                    job_link = job.find_element(By.CSS_SELECTOR, 'a').get_attribute('href')
                    jobs.append({
                        'title': title,
                        'company': company,
                        'location': location,
                        'link': job_link
                    })
                except Exception as e:
                    print(f"An error occurred while extracting job details from Indeed: {e}")

        except Exception as e:
            print(f"An error occurred while finding job elements on Indeed: {e}")

        return jobs

    job_list = scrape()

    for job in job_list:
        print(f"Indeed - Title: {job['title']}, Company: {job['company']}, Location: {job['location']}, Link: {job['link']}")

    driver.quit()

def scrape_glassdoor(keyword, location):
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

    search_url = f"https://www.glassdoor.com/Job/jobs.htm?sc.keyword={keyword}&locT=N&locId=113&locKeyword={location}"
    driver.get(search_url)

    driver.implicitly_wait(10)

    def scrape():
        jobs = []
        try:
            job_elements = WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located((By.CLASS_NAME, 'jl'))
            )

            for job in job_elements:
                try:
                    title = job.find_element(By.CLASS_NAME, 'jobLink').text
                    company = job.find_element(By.CLASS_NAME, 'jobEmpolyerName').text
                    location = job.find_element(By.CLASS_NAME, 'loc').text
                    job_link = job.find_element(By.CLASS_NAME, 'jobLink').get_attribute('href')
                    jobs.append({
                        'title': title,
                        'company': company,
                        'location': location,
                        'link': job_link
                    })
                except Exception as e:
                    print(f"An error occurred while extracting job details from Glassdoor: {e}")

        except Exception as e:
            print(f"An error occurred while finding job elements on Glassdoor: {e}")

        return jobs

    job_list = scrape()

    for job in job_list:
        print(f"Glassdoor - Title: {job['title']}, Company: {job['company']}, Location: {job['location']}, Link: {job['link']}")

    driver.quit()

fields = ["business internship", "engineering internship", "marketing internship", "psychology internship", "finance internship", "data science internship", "human resources internship", "sales internship", "graphic design internship", "consulting internship"]
location = "Canada"

threads = []

for field in fields:
    thread_linkedin = threading.Thread(target=scrape_linkedin, args=(field, location))
    threads.append(thread_linkedin)
    thread_linkedin.start()

    thread_indeed = threading.Thread(target=scrape_indeed, args=(field, location))
    threads.append(thread_indeed)
    thread_indeed.start()

    thread_glassdoor = threading.Thread(target=scrape_glassdoor, args=(field, location))
    threads.append(thread_glassdoor)
    thread_glassdoor.start()

for thread in threads:
    thread.join()
