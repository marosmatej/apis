from flask import Flask, request, jsonify
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy import create_engine, Column, Integer, String, Float, LargeBinary
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import pickle

app = Flask(__name__)

# Load the dataset
df = pd.read_csv('books.csv')

# Load the tags dataset
tags_df = pd.read_csv('tags.csv')
book_tags_df = pd.read_csv('book_tags.csv')

# Merge tags with books
book_tags_df = book_tags_df.merge(tags_df, left_on='tag_id', right_on='tag_id', how='left')

# Group tags by book_id and concatenate them into a single string
book_tags_df = book_tags_df.groupby('goodreads_book_id')['tag_name'].apply(lambda x: ' '.join(x)).reset_index()

# Merge the tags with the main books dataframe
df = df.merge(book_tags_df, left_on='book_id', right_on='goodreads_book_id', how='left')
df['tag_name'] = df['tag_name'].fillna('')  # Fill NaN values with an empty string

# Combine title, authors, and tags into a single feature
df['combined_features'] = df['title'] + ' ' + df['authors'] + ' ' + df['tag_name']

# Initialize the TF-IDF Vectorizer
tfidf_vectorizer = TfidfVectorizer()
tfidf_matrix = tfidf_vectorizer.fit_transform(df['combined_features'])

# Database setup
Base = declarative_base()

class UserRating(Base):
    __tablename__ = 'user_ratings'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    book_id = Column(Integer)
    rating = Column(Integer)  # 1 for like, -1 for dislike

engine = create_engine('sqlite:///books.db')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

def get_recommendations(user_id):
    # Get the user's ratings
    user_ratings = session.query(UserRating).filter_by(user_id=user_id).all()

    if not user_ratings:
        return []

    # Get the books the user liked
    liked_books = [rating.book_id for rating in user_ratings if rating.rating == 1]

    if not liked_books:
        return []

    # Get the feature vectors for the liked books
    liked_books_features = df[df['book_id'].isin(liked_books)]['combined_features']

    # Compute similarity scores between liked books and all books
    liked_books_matrix = tfidf_vectorizer.transform(liked_books_features)
    sim_scores = cosine_similarity(liked_books_matrix, tfidf_matrix)

    # Get the IDs of the most similar books
    sim_scores = sim_scores.flatten()
    similar_books_indices = sim_scores.argsort()[-10:][::-1]
    recommendations = df.iloc[similar_books_indices]['book_id'].tolist()

    return recommendations

@app.route('/rate', methods=['POST'])
def rate_book():
    data = request.json
    user_id = data['user_id']
    book_id = data['book_id']
    rating = data['rating']  # 1 for like, -1 for dislike

    user_rating = UserRating(user_id=user_id, book_id=book_id, rating=rating)
    session.add(user_rating)
    session.commit()

    return jsonify({"message": "Rating saved"}), 200

@app.route('/recommend', methods=['GET'])
def recommend():
    user_id = request.args.get('user_id')
    if user_id:
        recommendations = get_recommendations(int(user_id))
        return jsonify(recommendations)
    else:
        return jsonify({"error": "Please provide a user ID"}), 400

if __name__ == '__main__':
    app.run(debug=True)