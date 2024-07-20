import requests
from itertools import cycle
from bs4 import BeautifulSoup
from datetime import datetime, timedelta

proxies = []
proxy_pool = cycle(proxies)
last_updated = None

def refresh_proxies():
    global proxies
    global proxy_pool

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

def fetch_with_proxy(url) -> requests.Response|None:
    global last_updated

    if last_updated is None:
        last_updated = datetime.now()
        refresh_proxies()
    if datetime.now() - last_updated > timedelta(minutes=5):
        last_updated = datetime.now()
        refresh_proxies()

    proxy_index = 0
    while True:
        proxy = next(proxy_pool)
        print(f"Using proxy: {proxy}")
        try:
            response = requests.get(url, proxies={"http": proxy, "https": proxy}, timeout=3)
            return response
        except Exception as e:
            pass
        proxy_index += 1
        if proxy_index >= len(proxies):
            proxy_index = 0
            refresh_proxies()

if __name__ == "__main__":
    # Example usage
    resp = fetch_with_proxy('https://ca.linkedin.com/jobs/view/software-dev-engineer-ii-candidate-generation-cangen-at-amazon-3971537046?position=52&pageNum=0&refId=RGziekpWqtQ0anajMsrqkw%3D%3D&trackingId=oKZ8fq7tbctxVGI5oLLEcw%3D%3D&trk=public_jobs_jserp-result_search-card')
    if resp is not None:
        print(resp.content)
