from flask import Flask, request
from flask_cors import CORS, cross_origin
from twython import Twython
from bs4 import BeautifulSoup
from geopy.geocoders import Nominatim
from dotenv import load_dotenv
import urllib
import json

import requests
import numpy as np
import os
import nltk

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

    # active_tweets = [
    #     {'name': trend['name'], 'url': trend['url'], 'query': trend['query'], 'volume': trend['tweet_volume']}
    #     for trend in trend_dict if trend['tweet_volume'] is not None]
    active_tweets = [
        {'name': trend['name'], 'url': trend['url'], 'query': trend['query'], 'volume': trend['tweet_volume']}
        for trend in trend_dict]

    return {'place': place, 'active_tweets': active_tweets}


@app.route('/articles', methods = ["GET"])
def get_articles():
    args = request.args
    tag = args.get('tag')
    tag = urllib.parse.quote(tag)
    resp = requests.get(f'http://www.news.google.com/rss/search?q={tag}')

    soup = BeautifulSoup(resp.content, features='xml')

    items = soup.find_all('item')

    items = items[0:3]

    articles = []

    for item in items:
        headline = item.find('title').get_text()
        link = item.find('link').get_text()
        title = headline.split("-")[0]
        source = headline.split("-")[-1]
        articles.append([title, link, source])
    # N x 3 array, where first entry is the name of the article, second is the link, third is the creator

    all_text = ""
    ind = -1

    for i in range(3):
        ind = i
        try:
            article = requests.get(articles[ind][1])
            soup = BeautifulSoup(article.text.strip(), 'html.parser')

            article_tags = soup.body.find_all('article')

            text = article_tags[0].find_all('p')

            for words in text:
                all_text += words.get_text()

        except Exception as e:
            continue

    first_summary = summarize(all_text, 3)

    return [{'summary': first_summary, 'name' : articles[ind][0], 'source' : articles[ind][2], f"link" : articles[ind][1]}, [{'name': articles[i][0] , 'source' : articles[i][2], f"link" : articles[i][1]} for i in range(len(articles)) if i != ind]]


def compute_word_frequencies(tokenized_sentences):
    word_freqs = dict()
    for sentence in tokenized_sentences:
        for word in sentence:
            if word in word_freqs:
                word_freqs[word] += 1
            else:
                word_freqs[word] = 1
    return word_freqs


def summarize(article, num_sentences):
    # Split the article into sentences
    # sentences = nltk.sent_tokenize(article.strip())
    sentences = article.strip().split(".")
    # num_sentences = min(num_sentences, len(sentences))

    print(len(sentences))

    # Tokenize each sentence into words
    tokenized_sentences = [nltk.word_tokenize(sentence) for sentence in sentences]

    # print(tokenized_sentences)

    # Compute the word frequencies
    word_frequencies = compute_word_frequencies(tokenized_sentences)
    # print(word_frequencies)

    # # Compute the importance of each sentence
    sentence_importances = []
    for s in tokenized_sentences:
        importance = 0
        for w in s:
            importance += word_frequencies[w]
        sentence_importances.append(importance)

    # # Select the top N most important sentences
    summary_sentences = []
    for i in range(num_sentences):
        max_index = np.asarray(sentence_importances).argmax()
        summary_sentences.append(f"{sentences[max_index]}.")
        sentence_importances[max_index] = -1
    # # Concatenate the selected sentences to form the summary
    summary = " ".join(summary_sentences)
    return summary


if __name__ == '__main__':
    app.run(debug = True)

    # pip list --format=freeze > requirements.txt
    # waitress-serve --listen=127.0.0.1:5000 main:app
    # gcloud app deploy app.yaml --project=twitter-flask-372723
    # gcloud app browse --project=twitter-flask-372723
