from bs4 import BeautifulSoup
import requests
import urllib.parse

from requests_ip_rotator import ApiGateway

# Create gateway object and initialise in AWS
gateway = ApiGateway("https://www.glassdoor.com")
gateway.start()

# Assign gateway to session
session = requests.Session()
session.mount("https://www.glassdoor.com", gateway)


async def get_glassdoor_rating(company_name):
    print('Company name:', company_name)
    # Scrape Glassdoor for company rating:

    url = f'https://www.glassdoor.com/Search/results.htm?keyword={urllib.parse.quote(company_name)}'
    print(url)

    response = session.get(url)
    text = response.text
    print('Glassdoor text', text)
    soup = BeautifulSoup(text, 'html.parser')
    # Check if first result company name matches company name exactly

    # ! Needs to keep being updated
    # TODO: Update to a more robust selection
    first_result = soup.select_one(
        '[data-test="company-search-results"] a')
    #   first_result = soup.select_one('.company-search-result a')
    print('First Glassdoor result for', company_name, ':', first_result)

    if first_result and first_result.select_one('h3').text == company_name:
        rating = first_result.select_one('strong').text
        return rating

    return 'Not found'

if __name__ == '__main__':
    import asyncio
    import sys
    # Get company name from terminal args
    company_name = sys.argv[1]
    rating = asyncio.run(get_glassdoor_rating(company_name))
    print('Rating:', rating)
