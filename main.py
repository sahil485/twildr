from flask import Flask, request
from twython import Twython
import requests
from bs4 import BeautifulSoup
from geopy.geocoders import Nominatim
import numpy as np
import os
import nltk

root = os.path.dirname(os.path.abspath(__file__))
download_dir = os.path.join(root, 'nltk_data')
os.chdir(download_dir)
nltk.data.path.append(download_dir)


APP_KEY = "P07duQ7g378BP3TosSMzEnhVi"
ACCESS_TOKEN = "AAAAAAAAAAAAAAAAAAAAANSvkQEAAAAAyjbNKIiVtL9igt1g6HAKbQyFqTo%3DXk72oMpiARgeiWzJRjmvlQvKhnqU1nBrE39SVT3fXUoLxMQ2hD"

twitter = Twython(APP_KEY, access_token = ACCESS_TOKEN)

app = Flask(__name__)

@app.route("/")
def welcome():
    return "<h1>ENDPOINTS </h1>" \
           "<p> <b>/coords?city={city_name}&country={country_name}</b> - finds lat and long of specified country</p>" \
           "<p> <b>/woeid?lat={lattitude}&long={longitude}</b> - returns the WOEID of a place given the latitude and longitude</p>" \
           "<p> <b>/trends?place={place_name}&woeid={woeid}</b> - returns the top 50 trends for a place given the WOEID</p>" \
           "<p> <b>/articles?tag={tag}</b> - returns the top 3 linked articles/media from Google News given a certain tag </p>" \
            "<p> <b>/summarize?url={article_url}</b> returns 5-sentence summary of the top article returned by the /articles endpoint </p>"


@app.route('/coords', methods = ["GET"])
def get_coords():
    args = request.args
    city = args.get('city')
    country = args.get('country')
    geolocator = Nominatim(user_agent="main")

    location = geolocator.geocode(f"{city}, {country}")

    return {'latitude' : location.latitude, 'longitude' : location.longitude}

# woeid?lat=37.781157&long=-122.400612831116 - test w/ san francisco
@app.route('/woeid', methods = ["GET"])
def get_woeid():
    # get the city name from the query string
    args = request.args
    lat = args.get('lat')
    long = args.get('long')
    if not (lat or long):
        return "Please enter latitude or longitude coordinates in the query string (e.g. /?lat={lat}&long={long})"

    res = twitter.get_closest_trends(lat = lat, long = long)
    place = res[0]['name']
    city_woeid = res[0]['woeid']
    return {'place' : place, 'woeid' : city_woeid}


# trends?place=San%20Francisco&woeid=2487956 - test w/ san franscisco
@app.route('/trends', methods = ["GET"])
def trends():
    args = request.args
    place = args.get('place')
    woeid = args.get('woeid')

    if not woeid:
        return "Please enter a WOEID location identifier"

    res = twitter.get_place_trends(id = woeid)
    trend_dict = res[0]['trends']

    active_tweets = [{'name' : trend['name'], 'url' : trend['url'], 'query' : trend['query'], 'volume' : trend['tweet_volume']}
                     for trend in trend_dict if trend['tweet_volume'] is not None]

    return {'place' : place, 'active_tweets' : active_tweets}


@app.route('/articles', methods = ["GET"])
def articles():
    args = request.args
    tag = args.get('tag')

    res = requests.get(f'http://www.news.google.com/search?q={tag}')
    soup = BeautifulSoup(res.text, 'html.parser')

    results = soup.find_all("div", class_='NiLAwe y6IFtc R7GTQ keNKEd j7vNaf nID9nc')
    top_three = results[0:3]
    top_three = [entry.find('h3', class_='ipQwMb ekueJc RD0gLb') for entry in top_three]
    links = [[article.find('a').get_text(), article.find('a').get('href')] for article in top_three]

    # print(len(links))

    links = [[links[ind][0], f'http://news.google.com{links[ind][1][1:]}'] for ind in range(len(links))]

    return [{'name': links[i-1][0] , f"link {i}" : links[i-1][1]} for i in range(1, len(links) + 1)]


@app.route('/summarize', methods = ['GET'])
def get_text():
    args = request.args
    url = args.get('url')

    try:
        article = requests.get(url)
        soup = BeautifulSoup(article.text, 'html.parser')

        article_tags = soup.body.find_all('article')

        text = article_tags[0].find_all('p')

        all_text = ""
        for words in text:
            all_text += words.get_text()

        return summarize(all_text, 3)

    except Exception as e:
        return f"<p> {e} </p>" \
               f"Sorry, try again later"

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
    sentences = nltk.sent_tokenize(article)
    num_sentences = min(num_sentences, len(sentences))

    # Tokenize each sentence into words
    tokenized_sentences = [nltk.word_tokenize(s) for s in sentences]

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
        summary_sentences.append(sentences[max_index])
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
