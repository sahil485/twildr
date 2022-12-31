from flask import Flask, request
from flask_cors import CORS, cross_origin
from twython import Twython
from bs4 import BeautifulSoup
from geopy.geocoders import Nominatim
from dotenv import load_dotenv
from unidecode import unidecode
from nltk.corpus import stopwords
import urllib
import json

import requests
import numpy as np
import os
import nltk

from summarizer import summarize

root = os.path.dirname(os.path.abspath(__file__))
download_dir = os.path.join(root, 'nltk_data')
os.chdir(download_dir)
nltk.data.path.append(download_dir)
load_dotenv()


APP_KEY = os.getenv('APP_KEY')
ACCESS_TOKEN = os.getenv('ACCESS_TOKEN')

twitter = Twython(APP_KEY, access_token=ACCESS_TOKEN)

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/")
def welcome():
    return "<h1>ENDPOINTS </h1>" \
           "<p> <b>/coords?city={city_name}&country={country_name}</b> - finds lat and long of specified country</p>" \
           "<p> <b>/trends?lat={latitude}&long={longitude}</b> - returns trends of a place given latitude and longitude</p>" \
           "<p> <b>/articles?tag={tag}</b> - returns the top 3 linked articles/media from Google News given a certain tag </p>" \
           "<p> <b>/ip</b> - returns the IP of the user </p>"


@app.route('/articles', methods = ["GET"])
def get_articles():
    args = request.args
    tag = args.get('tag')

    #for hashtags with multiple words in one, split on uppercase letters:
    split_tag = ""
    for ind, let in enumerate(tag):
        if let.isupper() and ind != 0 and ((tag[ind - 1] != " " and ind > 3) or tag[ind - 1] == "#"):
            split_tag += " "
        split_tag += let

    q_words = split_tag.split(" ")
    tag = urllib.parse.quote(split_tag)
    url = f'http://www.news.google.com/rss/search?q={tag}'
    resp = requests.get(url)

    soup = BeautifulSoup(resp.content, features='xml')

    items = soup.find_all('item')

    items = items[0:8]
    articles = []

    for item in items:
        headline = item.find('title').get_text()
        link = item.find('link').get_text()
        title = headline.split("-")[0]
        source = headline.split("-")[-1]
        articles.append([title, link, source])

    try:
        filtered = filter_titles(articles, q_words)
        if len(filtered) == 0:
            raise IndexError('force except')
        filtered = filtered[0:3]
        articles = filtered
    except IndexError:
        articles = articles[0:3]

    all_text = ""

    ind = 0

    google_url = url.replace('/rss', '')

    while ind< len(articles):

        article = requests.get(articles[ind][1])
        soup = BeautifulSoup(article.text.strip(), 'html.parser')

        try:
            article_tags = soup.body.find_all('article')
            text = article_tags[0].find_all('p')
            if len(text) == 0:
                raise IndexError("force except")
            for words in text:
                all_text += words.get_text()

        except IndexError:
            allowlist = ['p', 'div', 'a']

            text_elements = [t for t in soup.find_all(text=True) if t.parent.name in allowlist]
            for el in text_elements:
                all_text += f"{el.get_text()}. " if len(el.split(" ")) > 2 else ""

        summary = summarize(articles[ind][0],all_text, 3)

        summary = " ".join(summary)

        if len(summary.split(" ")) >= 30:
            summary = " ".join(summary.split())
            return [{'summary' : summary, 'article_name' : articles[ind][0], 'source' : articles[ind][2], 'source_link' : articles[ind][1]}, {'google_news_link' : google_url}]

        else: ind+=1

    return [{'summary': '', 'article_name': '', 'source': '',
             'source_link': ''}, {'google_news_link': google_url}]


def filter_titles(articles, q_words):
    valid = []
    for article in articles:
        for word in q_words:
            if word.casefold() in unidecode(article[0]).casefold() or word.casefold() in unidecode(article[2]).casefold():
                valid.append(article)
                break
    return valid


@app.route("/ip", methods=["GET"])
def get_my_ip():
    return requests.get('https://api.ipify.org').content.decode('utf8')


@app.route('/coords', methods = ["GET"])
def get_coords():
    args = request.args
    city = args.get('city')
    country = args.get('country')
    geolocator = Nominatim(user_agent="main")

    location = geolocator.geocode(f"{city}, {country}")

    return {'latitude' : location.latitude, 'longitude' : location.longitude}


# woeid?lat=37.781157&long=-122.400612831116 - test w/ san francisco
@app.route('/trends', methods = ["GET"])
def get_woeid():
    # get the city name from the query string
    args = request.args
    lat = args.get('lat')
    long = args.get('long')
    if not (lat or long):
        return "Please enter latitude or longitude coordinates in the query string (e.g. /?lat={lat}&long={long})"

    res = twitter.get_closest_trends(lat = lat, long = long)
    place = res[0]['name']
    woeid = res[0]['woeid']

    res = twitter.get_place_trends(id=woeid)
    trend_dict = res[0]['trends']

    active_tweets = [
        {'name': trend['name'], 'url': trend['url'], 'query': trend['query'], 'volume': trend['tweet_volume']}
        for trend in trend_dict]

    return {'place': place, 'active_tweets': active_tweets}


if __name__ == '__main__':
    app.run(debug = True)

    # pip list --format=freeze > requirements.txt
    # waitress-serve --listen=127.0.0.1:5000 main:app
    # gcloud app deploy app.yaml --project=twitter-flask-372723
    # gcloud app browse --project=twitter-flask-372723
