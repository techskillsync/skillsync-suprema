import requests
from itertools import cycle

# List of proxies
proxies = [
    'https://101.160.176.116:3389'
    # 'http://130.61.120.213:8888'
]

# Create a cycle object to rotate through the proxies
proxy_pool = cycle(proxies)

url = 'http://example.com'

def fetch_with_proxy(url):
    proxy = next(proxy_pool)
    print(f"Using proxy: {proxy}")
    try:
        response = requests.get(url, proxies={"http": proxy, "https": proxy})
        return response
    except requests.exceptions.ProxyError as e:
        print(f"Proxy error with {proxy}: {e}")
        return None
    except requests.exceptions.RequestException as e:
        print(f"Request error: {e}")
        return None
