import requests
from bs4 import BeautifulSoup as bs


# query = name + street address + Location

query = "University of Toronto Bookstore College Street Location"
params = {
    "q": query,
    "tbm": "isch",
}

html = requests.get("https://www.google.com/search",params)
soup = bs(html.content,features="html.parser")

images = soup.select('div img')
images_url = images[0]['src']

# append images url to end of row

