import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.layers import Input, Dense, Lambda
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
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

# Bypass SSL verification
ssl._create_default_https_context = ssl._create_unverified_context

# Ensure NLTK stopwords and wordnet are downloaded
nltk.download('stopwords')
nltk.download('wordnet')

# Initialize logging
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)

# Load CSV files
def load_data():
    logging.info("Loading data...")
    resume_df = pd.read_csv('~/Documents/Resume Enhancers/resume.csv')
    postings_df = pd.read_csv('~/Documents/Resume Enhancers/postings.csv')
    logging.info("Data loaded successfully.")
    return resume_df, postings_df

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

openai.api_key = 'sk-proj-sScFMZr4GK3XaQ5mcYFYT3BlbkFJ1orIjm1gKSNT0q30KBMZ'

def generate_labels(descriptions, resumes):
    logging.info("Generating labels...")
    labels = []
    for i, description in enumerate(descriptions):
        for j, resume in enumerate(resumes):
            prompt = f"How relevant is this resume to the job description? {resume} {description}"
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Analyze the relevance of the resume to the job description."},
                    {"role": "user", "content": prompt}
                ]
            )
            relevance = response.choices[0].message['content'].strip()
            labels.append(1 if 'highly relevant' in relevance.lower() else 0)
        logging.info(f"Processed {i + 1} descriptions.")
    return labels

def build_siamese_model(input_shape):
    logging.info("Building Siamese network model...")
    input_layer = Input((input_shape,))
    
    x = Dense(128, activation='relu')(input_layer)
    x = Dense(64, activation='relu')(x)
    x = Dense(1, activation='sigmoid')(x)
    
    model = Model(inputs=input_layer, outputs=x)
    logging.info("Siamese network model built.")
    return model

# Load data and preprocess
resumes, postings = load_data()
resumes['Resume_str'] = preprocess_text(resumes['Resume_str'])
postings['description'] = preprocess_text(postings['description'])

# Vectorize resumes and job descriptions
vectorized_resumes, resume_vectorizer = vectorize_text(resumes['Resume_str'])
vectorized_postings, posting_vectorizer = vectorize_text(postings['description'])

# Generate labels and pairs for a small batch
sample_descriptions = postings['description'].head(5)  # Smaller batch for testing
sample_resumes = resumes['Resume_str'].head(5)
labels = generate_labels(sample_descriptions, sample_resumes)
sample_pairs = [(vectorized_resumes[i].toarray(), vectorized_postings[j].toarray())
                for i in range(len(sample_resumes)) for j in range(len(sample_descriptions))]

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
train_data = np.hstack((train_left, train_right))
test_data = np.hstack((test_left, test_right))

# Print data shapes and types
print("Train Data Shape:", train_data.shape)
print("Train Data Type:", type(train_data))
print("Train Labels Shape:", len(train_labels))
print("Train Labels Type:", type(train_labels))
print("Test Data Shape:", test_data.shape)
print("Test Data Type:", type(test_data))
print("Test Labels Shape:", len(test_labels))
print("Test Labels Type:", type(test_labels))

# Define Siamese Network assuming input shape based on doubled TF-IDF features
input_shape = train_data.shape[1]  # This would be 2 * 300 if each side has 300 features

model = build_siamese_model(input_shape)
model.compile(optimizer=Adam(0.001), loss='binary_crossentropy', metrics=['accuracy'])

# Train model
logging.info("Starting model training...")
model.fit(train_data, np.array(train_labels), validation_data=(test_data, np.array(test_labels)), batch_size=16, epochs=10)
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
