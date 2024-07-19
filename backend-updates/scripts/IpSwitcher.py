import requests
from itertools import cycle
from bs4 import BeautifulSoup
from datetime import datetime, timedelta

# https://ca.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/linkedin-jobs?original_referer=https%3A%2F%2Fwww.google.com%2F&start=50
# https://ca.linkedin.com/jobs-guest/jobs/api/jobPosting/3963959943

proxies = []

def refresh_proxies():
    proxies = []
    # proxyscrape.com
    response = requests.get('https://api.proxyscrape.com/v3/free-proxy-list/get?request=displayproxies&country=us,ca&protocol=socks4,socks5&proxy_format=protocolipport&format=text&anonymity=Elite&timeout=2218')
    proxyscrape = response.content.decode()
    proxyscrape = proxyscrape.split('\r\n')
    for p in proxyscrape:
        proxies.append(p)

    # freeproxy.world
    url = "https://www.freeproxy.world/?type=socks4&anonymity=4&country=US&speed=&port=&page=1"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")
    table = soup.find('table')
    for tr in table.find_all('tr'):
        cells = tr.find_all(['td'])
        row = [cell.text.strip() for cell in cells]
        if len(row) == 0 or row[0] == '':
            continue
        # Make it look like: socks4://XX.XX.XX.X:PORT
        p = "socks4://" + row[0] + ":" + row[1]
        proxies.append(p)

proxy_pool = cycle(proxies)
datetime = datetime.now()

def fetch_with_proxy(url) -> requests.Response|None:
    proxy = next(proxy_pool)
    print(f"Using proxy: {proxy}")

    try:
        response = requests.get(url, proxies={"http": proxy, "https": proxy}, timeout=3)
        return response
    except requests.exceptions.ProxyError as e:
        # print(f"Proxy error with {proxy}: {e}")
        return None
    except requests.exceptions.RequestException as e:
        # print(f"Request error: {e}")
        return None

if __name__ == "__main__":
    i = 0
    for p in proxies:
        resp = fetch_with_proxy('https://icanhazip.com/')
        if resp is not None:
            print(resp.content)
            i+=1
    print(f"{i} of the proxies worked")
