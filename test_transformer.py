from summarizer import Summarizer

print('starting')
body = 'Text body that you want to summarize with BERT'
body2 = 'Something else you want to summarize with BERT'
model = Summarizer()
result = model(body)
print(result)