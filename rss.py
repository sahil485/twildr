import requests
from bs4 import BeautifulSoup

resp = requests.get('https://twitter-flask-372723.ue.r.appspot.com/articles?tag=soccer')

print(resp)