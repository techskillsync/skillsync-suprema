import pandas as pd
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.model_selection import train_test_split
import tensorflow_hub as hub
import tensorflow as tf
from flask import Flask, request, jsonify
import openai
import os
import logging
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import re
import ssl
import nltk
import hashlib
import json
import time


ssl._create_default_https_context = ssl._create_unverified_context


nltk.download('stopwords')
nltk.download('wordnet')


logging.basicConfig(level=logging.INFO)

app = Flask(__name__)

openai.api_key = 'sk-proj-sScFMZr4GK3XaQ5mcYFYT3BlbkFJ1orIjm1gKSNT0q30KBMZ'


cache = {}


def load_data():
    logging.info("Loading data...")
    existing_resume_df = pd.read_csv('/Users/arjunsethi/Documents/Resume Enhancers/resume.csv')
    new_resume_df = pd.read_csv('/Users/arjunsethi/Documents/Resume Enhancers/new_resumes.csv')
    postings_df = pd.read_csv('/Users/arjunsethi/Documents/Resume Enhancers/postings.csv')
    logging.info("Data loaded successfully.")
    return existing_resume_df, new_resume_df, postings_df


def preprocess_text(text_series):
    logging.info("Preprocessing text...")
    text_series = text_series.fillna("")  
    text_series = text_series.apply(lambda x: re.sub(r'[^\w\s]', '', x.lower()))
    lemmatizer = WordNetLemmatizer()
    stop_words = set(stopwords.words('english'))
    text_series = text_series.apply(lambda x: ' '.join(
        lemmatizer.lemmatize(word) for word in x.split() if word not in stop_words
    ))
    return text_series


use = hub.load("https://tfhub.dev/google/universal-sentence-encoder/4")


def vectorize_text(text_series):
    logging.info("Vectorizing text...")
    embeddings = use(text_series.tolist()).numpy()
    return embeddings

def generate_labels(descriptions, resumes, max_retries=5, backoff_factor=2):
    logging.info("Generating labels...")
    labels = []

    for i, description in enumerate(descriptions):
        for j, resume in enumerate(resumes):
            key = hashlib.md5(f"{resume}{description}".encode()).hexdigest()

            if key in cache:
                relevance = cache[key]
            else:
                prompt = f"How relevant is this resume to the job description? {resume} {description}"
                
                for attempt in range(max_retries):
                    try:
                        response = openai.ChatCompletion.create(
                            model="gpt-3.5-turbo",
                            messages=[
                                {"role": "system", "content": "Analyze the relevance of the resume to the job description."},
                                {"role": "user", "content": prompt}
                            ]
                        )
                        relevance = response.choices[0].message['content'].strip()
                        cache[key] = relevance
                        break
                    except openai.error.APIError as e:
                        logging.error(f"APIError: {e}")
                        if attempt < max_retries - 1:
                            sleep_time = backoff_factor ** attempt
                            logging.info(f"Retrying in {sleep_time} seconds...")
                            time.sleep(sleep_time)
                        else:
                            logging.error("Max retries reached. Exiting...")
                            raise
                    except json.JSONDecodeError as e:
                        logging.error(f"JSONDecodeError: {e}")
                        raise
                    except Exception as e:
                        logging.error(f"Unexpected error: {e}")
                        raise

            if any(phrase in relevance.lower() for phrase in ['highly relevant', 'very relevant', 'extremely relevant']):
                labels.append(1)
            else:
                labels.append(0)

        logging.info(f"Processed {i + 1} descriptions.")
    
    with open('cache.json', 'w') as cache_file:
        json.dump(cache, cache_file)
    
    return labels


existing_resumes, new_resumes, postings = load_data()


new_resumes.columns = ['Category', 'Resume_str']


resumes = pd.concat([existing_resumes, new_resumes], ignore_index=True)


resumes['Resume_str'] = preprocess_text(resumes['Resume_str'])
postings['description'] = preprocess_text(postings['description'])


vectorized_resumes = vectorize_text(resumes['Resume_str'])
vectorized_postings = vectorize_text(postings['description'])


if os.path.exists('cache.json'):
    with open('cache.json', 'r') as cache_file:
        cache = json.load(cache_file)


labels = generate_labels(postings['description'], resumes['Resume_str'])
sample_pairs = [(vectorized_resumes[i], vectorized_postings[j])
                for i in range(len(resumes)) for j in range(len(postings))]


sample_pairs = [(np.array(left), np.array(right)) for left, right in sample_pairs]


train_pairs, test_pairs, train_labels, test_labels = train_test_split(sample_pairs, labels, test_size=0.2, random_state=42)
logging.info("Data split into training and testing sets.")


train_left = np.array([x[0] for x in train_pairs])
train_right = np.array([x[1] for x in train_pairs])
test_left = np.array([x[0] for x in test_pairs])
test_right = np.array([x[1] for x in test_pairs])


train_data = (torch.tensor(train_left, dtype=torch.float32), torch.tensor(train_right, dtype=torch.float32))
test_data = (torch.tensor(test_left, dtype=torch.float32), torch.tensor(test_right, dtype=torch.float32))

train_labels = torch.tensor(train_labels, dtype=torch.float32).unsqueeze(1)
test_labels = torch.tensor(test_labels, dtype=torch.float32).unsqueeze(1)

# Print data shapes and types for debugging
print("Train Data Shape:", (train_left.shape, train_right.shape))
print("Train Data Type:", (type(train_left), type(train_right)))
print("Train Labels Shape:", len(train_labels))
print("Train Labels Type:", type(train_labels))
print("Test Data Shape:", (test_left.shape, test_right.shape))
print("Test Data Type:", (type(test_left), type(test_right)))
print("Test Labels Shape:", len(test_labels))
print("Test Labels Type:", type(test_labels))


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


input_size = train_left.shape[1]


model = SiameseNetwork(input_size)
criterion = nn.BCELoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)


num_epochs = 20
batch_size = 16
early_stopping_patience = 3

train_dataset = torch.utils.data.TensorDataset(train_data[0], train_data[1], train_labels)
train_loader = torch.utils.data.DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
test_dataset = torch.utils.data.TensorDataset(test_data[0], test_data[1], test_labels)
test_loader = torch.utils.data.DataLoader(test_dataset, batch_size=batch_size, shuffle=False)

best_val_loss = float('inf')
patience_counter = 0

logging.info("Starting model training...")
for epoch in range(num_epochs):
    model.train()
    train_loss = 0.0
    for batch_idx, (left, right, labels) in enumerate(train_loader):
        optimizer.zero_grad()
        outputs = model(left, right)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        train_loss += loss.item()

    train_loss /= len(train_loader)

    model.eval()
    val_loss = 0.0
    with torch.no_grad():
        for batch_idx, (left, right, labels) in enumerate(test_loader):
            outputs = model(left, right)
            loss = criterion(outputs, labels)
            val_loss += loss.item()

    val_loss /= len(test_loader)

    logging.info(f"Epoch {epoch + 1}/{num_epochs}, Train Loss: {train_loss}, Validation Loss: {val_loss}")

    
    if val_loss < best_val_loss:
        best_val_loss = val_loss
        patience_counter = 0
        
        torch.save(model.state_dict(), 'siamese_network.pth')
        logging.info("Model saved.")
    else:
        patience_counter += 1
        if patience_counter >= early_stopping_patience:
            logging.info("Early stopping triggered.")
            break

logging.info("Model training completed.")


model.load_state_dict(torch.load('siamese_network.pth'))


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    resume_text = preprocess_text(pd.Series([data['resume']]))
    posting_text = preprocess_text(pd.Series([data['posting']]))

    vectorized_resume = vectorize_text(resume_text)
    vectorized_posting = vectorize_text(posting_text)

    vectorized_resume = torch.tensor(vectorized_resume, dtype=torch.float32).flatten()
    vectorized_posting = torch.tensor(vectorized_posting, dtype=torch.float32).flatten()

    model.eval()
    with torch.no_grad():
        similarity_score = model(vectorized_resume.unsqueeze(0), vectorized_posting.unsqueeze(0)).item()

    return jsonify({'similarity_score': similarity_score})

if __name__ == '__main__':
    app.run(debug=True)


   
