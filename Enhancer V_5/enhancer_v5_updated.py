import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.layers import Input, Dense, Dropout, BatchNormalization, Lambda
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam, RMSprop
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
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

# Bypass SSL verification
ssl._create_default_https_context = ssl._create_unverified_context

# Ensure NLTK stopwords and wordnet are downloaded
nltk.download('stopwords')
nltk.download('wordnet')

# Initialize logging
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)

# Set OpenAI API key
openai.api_key = 'sk-proj-sScFMZr4GK3XaQ5mcYFYT3BlbkFJ1orIjm1gKSNT0q30KBMZ'

# Cache to store API results
cache = {}

# Load CSV files
def load_data():
    logging.info("Loading data...")
    existing_resume_df = pd.read_csv('~/Documents/Resume Enhancers/resume.csv')
    new_resume_df = pd.read_csv('~/Documents/Resume Enhancers/new_resumes.csv')
    postings_df = pd.read_csv('~/Documents/Resume Enhancers/postings.csv')
    logging.info("Data loaded successfully.")
    return existing_resume_df, new_resume_df, postings_df

# Preprocess text data
def preprocess_text(text_series):
    logging.info("Preprocessing text...")
    text_series = text_series.fillna("")  # Replace NaN with empty strings
    text_series = text_series.apply(lambda x: re.sub(r'[^\w\s]', '', x.lower()))
    lemmatizer = WordNetLemmatizer()
    stop_words = set(stopwords.words('english'))
    text_series = text_series.apply(lambda x: ' '.join(
        lemmatizer.lemmatize(word) for word in x.split() if word not in stop_words
    ))
    return text_series

# Vectorize text using TF-IDF
def vectorize_text(text):
    logging.info("Vectorizing text...")
    vectorizer = TfidfVectorizer(max_features=300)
    vectorized_text = vectorizer.fit_transform(text)
    return vectorized_text, vectorizer

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
                        if attempt < max_retries - 3:
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

# Load data and preprocess
existing_resumes, new_resumes, postings = load_data()

# Assuming new resumes have the same structure
new_resumes.columns = ['Category', 'Resume_str']

# Combine existing and new resumes
resumes = pd.concat([existing_resumes, new_resumes], ignore_index=True)

# Preprocess text data
resumes['Resume_str'] = preprocess_text(resumes['Resume_str'])
postings['description'] = preprocess_text(postings['description'])

# Vectorize resumes and job descriptions
vectorized_resumes, resume_vectorizer = vectorize_text(resumes['Resume_str'])
vectorized_postings, posting_vectorizer = vectorize_text(postings['description'])

# Load cache if exists
if os.path.exists('cache.json'):
    with open('cache.json', 'r') as cache_file:
        cache = json.load(cache_file)

# Generate labels and pairs for the entire dataset
labels = generate_labels(postings['description'], resumes['Resume_str'])
sample_pairs = [(vectorized_resumes[i].toarray(), vectorized_postings[j].toarray())
                for i in range(len(resumes)) for j in range(len(postings))]

# Ensure pairs are converted to numpy arrays
sample_pairs = [(np.array(left).flatten(), np.array(right).flatten()) for left, right in sample_pairs]

# Split the data into training and testing sets
train_pairs, test_pairs, train_labels, test_labels = train_test_split(sample_pairs, labels, test_size=0.2, random_state=42)
logging.info("Data split into training and testing sets.")

# Prepare data for training
train_left = np.array([x[0] for x in train_pairs])
train_right = np.array([x[1] for x in train_pairs])
test_left = np.array([x[0] for x in test_pairs])
test_right = np.array([x[1] for x in test_pairs])

# Combine train left and right for a single input array to the model
train_data = [train_left, train_right]
test_data = [test_left, test_right]

# Print data shapes and types for debugging
print("Train Data Shape:", (train_left.shape, train_right.shape))
print("Train Data Type:", (type(train_left), type(train_right)))
print("Train Labels Shape:", len(train_labels))
print("Train Labels Type:", type(train_labels))
print("Test Data Shape:", (test_left.shape, test_right.shape))
print("Test Data Type:", (type(test_left), type(test_right)))
print("Test Labels Shape:", len(test_labels))
print("Test Labels Type:", type(test_labels))

# Define and compile the Siamese Network
input_shape = train_left.shape[1]  # This would be 300 if each side has 300 features
model = build_siamese_model(input_shape)
model.compile(optimizer=Adam(learning_rate=0.001), loss='binary_crossentropy', metrics=['accuracy'])

# Early Stopping
early_stopping = tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)

# Train the model
logging.info("Starting model training...")
history = model.fit(train_data, np.array(train_labels), validation_data=(test_data, np.array(test_labels)), 
                    batch_size=16, epochs=20, callbacks=[early_stopping])
logging.info("Model training completed.")

# Save the model
model.save('siamese_network.h5')
logging.info("Model saved successfully.")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    resume_text = preprocess_text(pd.Series([data['resume']]))
    posting_text = preprocess_text(pd.Series([data['posting']]))

    vectorized_resume = resume_vectorizer.transform(resume_text).toarray().flatten()
    vectorized_posting = posting_vectorizer.transform(posting_text).toarray().flatten()

    combined_features = np.hstack((vectorized_resume, vectorized_posting))

    score = model.predict(combined_features.reshape(1, -1))[0][0]
    return jsonify({'similarity_score': float(score)})

if __name__ == '__main__':
    app.run(debug=True)
