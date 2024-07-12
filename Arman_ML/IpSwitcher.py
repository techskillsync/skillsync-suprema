import requests
from itertools import cycle

# List of proxies
proxies = [
    'http://134.209.29.120:3128',
    'http://103.101.193.38:1111',
    'http://101.255.158.42:8080',
    'http://130.61.120.213:8888'
]

# Create a cycle object to rotate through the proxies
proxy_pool = cycle(proxies)

url = 'http://example.com'

for i in range(10):
    proxy = next(proxy_pool)
    print(f"Request #{i+1} using proxy: {proxy}")
    try:
        response = requests.get(url, proxies={"http": proxy, "https": proxy})
        print(response.status_code)
    except requests.exceptions.ProxyError as e:
        print(f"Proxy error with {proxy}: {e}")
    except requests.exceptions.RequestException as e:
        print(f"Request error: {e}")
