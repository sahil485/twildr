from twython import Twython

APP_KEY = 'd2x43tfnwCQLkqzz11tG8O3P4'
ACCESS_TOKEN = 'AAAAAAAAAAAAAAAAAAAAANSvkQEAAAAAyjbNKIiVtL9igt1g6HAKbQyFqTo%3DXk72oMpiARgeiWzJRjmvlQvKhnqU1nBrE39SVT3fXUoLxMQ2hD'

twitter = Twython(APP_KEY, access_token=ACCESS_TOKEN)

twitter.search(q='drake')