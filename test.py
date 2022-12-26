from bs4 import BeautifulSoup
import requests
import numpy as np
import nltk

article = requests.get("https://www.wired.com/story/how-to-use-physics-to-tell-if-that-steph-curry-video-is-real/")
soup = BeautifulSoup(article.text, 'html.parser')

article_tags = soup.body.find_all('article')

text = article_tags[-1].find_all('p')

all_text = ""
for words in text:
    # print(words.get_text())
    all_text += words.get_text()

sentences = nltk.sent_tokenize(all_text)
print(len(sentences))
print(sentences)


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

    print(tokenized_sentences)

    # Compute the word frequencies
    word_frequencies = compute_word_frequencies(tokenized_sentences)
    print(word_frequencies)

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
    #
    # # Concatenate the selected sentences to form the summary
    summary = " ".join(summary_sentences)
    return summary


print(summarize(all_text, 5))



# import torch
# from transformers import AutoTokenizer, AutoModelWithLMHead
#
# tokenizer = AutoTokenizer.from_pretrained('t5-small')
# model = AutoModelWithLMHead.from_pretrained('t5-small', return_dict = True)
#
# for entry in relevant:
#     inputs = tokenizer.encode('summarize: ' + entry[0], return_tensors='pt', max_length=512, truncation = True)
#     outputs = model.generate(inputs, max_length = 150, min_length = 50, num_beams = 2)
#
#     summary = tokenizer.decode(outputs[0])
#     print(summary)