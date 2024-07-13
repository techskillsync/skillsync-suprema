import pandas as pd
import tensorflow_hub as hub
import torch
import torch.nn as nn
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

universal_sentence_encoder = hub.load("https://tfhub.dev/google/universal-sentence-encoder/4")
nltk.download('stopwords')
nltk.download('wordnet')

class SiameseNetwork(nn.Module):
	def __init__(self, input_size):
		super(SiameseNetwork, self).__init__()
		self.shared_network = nn.Sequential(
			nn.Linear(input_size, 256),
			nn.ReLU(),
			nn.BatchNorm1d(256),
			nn.Dropout(0.5),
			nn.Linear(256, 128),
			nn.ReLU(),
			nn.BatchNorm1d(128),
			nn.Dropout(0.5),
			nn.Linear(128, 64),
			nn.ReLU()
		)
		self.output_layer = nn.Linear(64, 1)

	def forward_one_side(self, x):
		return self.shared_network(x)

	def forward(self, input1, input2):
		output1 = self.forward_one_side(input1)
		output2 = self.forward_one_side(input2)
		distance = torch.abs(output1 - output2)
		output = torch.sigmoid(self.output_layer(distance))
		return output

model = SiameseNetwork(512)
model.load_state_dict(torch.load('10K_50EPC_siamese_network.pth', map_location=torch.device('cpu')))     
model.eval()

def preprocess_text(text_series):
	text_series = text_series.fillna("")  # Replace NaN with empty strings
	text_series = text_series.apply(lambda x: re.sub(r'[^\w\s]', '', x.lower()))
	lemmatizer = WordNetLemmatizer()
	stop_words = set(stopwords.words('english'))
	text_series = text_series.apply(lambda x: ' '.join(
		lemmatizer.lemmatize(word) for word in x.split() if word not in stop_words
	))
	return text_series

def vectorize_text(text_series):
	embeddings = universal_sentence_encoder(text_series.tolist()).numpy()
	return embeddings


def GetResumeAndPostingSimilarity(resume: str, job_posting: str) -> float:
	resume = preprocess_text(pd.Series(resume))
	job_posting = preprocess_text(pd.Series(job_posting))

	resume = vectorize_text(resume)
	job_posting = vectorize_text(job_posting)

	resume = torch.tensor(resume, dtype=torch.float32).flatten()
	job_posting = torch.tensor(job_posting, dtype=torch.float32).flatten()

	with torch.no_grad():
		similarity_score = model(resume.unsqueeze(0), job_posting.unsqueeze(0)).item()
	return similarity_score