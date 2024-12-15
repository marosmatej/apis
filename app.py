import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy import create_engine, Column, Integer, String, Float, LargeBinary, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker
from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the dataset
df = pd.read_csv('books.csv')

# Load the tags dataset
tags_df = pd.read_csv('tags.csv')
book_tags_df = pd.read_csv('book_tags.csv')

# Merge tags with books
book_tags_df = book_tags_df.merge(tags_df, left_on='tag_id', right_on='tag_id', how='left')
book_tags_df = book_tags_df.groupby('goodreads_book_id')['tag_name'].apply(lambda x: ' '.join(x)).reset_index()
df = df.merge(book_tags_df, left_on='book_id', right_on='goodreads_book_id', how='left')
df['tag_name'] = df['tag_name'].fillna('')  # Fill NaN values with an empty string
df['combined_features'] = df['title'] + ' ' + df['authors'] + ' ' + df['tag_name']

# Initialize the TF-IDF Vectorizer
tfidf_vectorizer = TfidfVectorizer()
tfidf_matrix = tfidf_vectorizer.fit_transform(df['combined_features'])

# Database setup for local SQLite (vectors)
Base = declarative_base()

class UserRatingLocal(Base):
    __tablename__ = 'user_ratings'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    book_id = Column(Integer)
    rating = Column(Integer)
    is_bookmarked = Column(Integer)

class BookLocal(Base):
    __tablename__ = 'books'
    id = Column(Integer, primary_key=True)
    title = Column(String)
    authors = Column(String)

local_engine = create_engine('sqlite:///books_local.db')
Base.metadata.create_all(local_engine)
LocalSession = sessionmaker(bind=local_engine)
local_session = LocalSession()

# Azure database connection (user data)
azure_engine = create_engine("mssql+pyodbc://tomitimko:Timkotomi%@apiserverik.database.windows.net:1433/BookRecommendationsDB?driver=ODBC+Driver+18+for+SQL+Server&encrypt=yes&TrustServerCertificate=no&timeout=30")
AzureSession = sessionmaker(bind=azure_engine)
azure_session = AzureSession()

# Utility functions
def get_user_ratings_from_azure(user_id):
    """Fetch user ratings from the Azure database."""
    query = f"SELECT * FROM UserBooks WHERE user_id = {user_id}"
    user_ratings = pd.read_sql(query, azure_engine)
    return user_ratings

def get_user_item_matrix():
    """Build the user-item matrix from Azure user ratings."""
    user_ratings_df = pd.read_sql("SELECT * FROM UserBooks", azure_engine)
    user_ratings_df = user_ratings_df.groupby(['user_id', 'book_id'], as_index=False)['rating'].mean()
    user_item_matrix = user_ratings_df.pivot(index='user_id', columns='book_id', values='rating').fillna(0)
    return csr_matrix(user_item_matrix.values), user_item_matrix

def recommend_books_based_on_likes(user_id):
    """Recommend books based on likes (data from Azure, computation local)."""
    user_ratings = get_user_ratings_from_azure(user_id)

    liked_books = user_ratings[user_ratings['rating'] == 1]['book_id'].tolist()
    if not liked_books:
        return []

    liked_books_features = df[df['book_id'].isin(liked_books)]['combined_features']
    liked_books_matrix = tfidf_vectorizer.transform(liked_books_features)
    sim_scores = cosine_similarity(liked_books_matrix, tfidf_matrix)

    sim_scores = sim_scores.flatten()
    similar_books_indices = sim_scores.argsort()[-10:][::-1]
    recommendations = df.iloc[similar_books_indices]['book_id'].tolist()

    return recommendations[:5]

def recommend_books_collaborative(user_id):
    """Recommend bundles using collaborative filtering (Azure user data, local computation)."""
    user_item_matrix_sparse, user_item_matrix = get_user_item_matrix()

    model_knn = NearestNeighbors(metric='cosine', algorithm='brute')
    model_knn.fit(user_item_matrix_sparse)

    user_index = user_item_matrix.index.get_loc(user_id)
    n_neighbors = min(10, user_item_matrix.shape[0])
    distances, indices = model_knn.kneighbors(user_item_matrix_sparse[user_index], n_neighbors=n_neighbors)

    similar_users = indices.flatten()
    similar_users_ratings = user_item_matrix.iloc[similar_users].mean(axis=0)
    recommended_books = similar_users_ratings[similar_users_ratings > 0].sort_values(ascending=False).index.tolist()

    filtered_books = df[df['book_id'].isin(recommended_books)]

    bundle = filtered_books.head(7)['book_id'].tolist()
    return bundle

@app.route('/recommend_likes', methods=['GET'])
def recommend():
    user_id = request.args.get('user_id')
    logger.info(f"Received request for /recommend_likes with user_id: {user_id}")
    if user_id:
        recommendations = recommend_books_based_on_likes(int(user_id))
        logger.info(f"Recommendations for user_id {user_id}: {recommendations}")
        return jsonify(recommendations)
    else:
        logger.error("No user_id provided for /recommend_likes")
        return jsonify({"error": "Please provide a user ID"}), 400

@app.route('/recommend', methods=['GET'])
def recommend_bundle_endpoint():
    user_id = request.args.get('user_id')
    logger.info(f"Received request for /recommend with user_id: {user_id}")
    if user_id:
        bundle = recommend_books_collaborative(int(user_id))
        logger.info(f"Bundle recommendations for user_id {user_id}: {bundle}")
        return jsonify(bundle)
    else:
        logger.error("No user_id provided for /recommend")
        return jsonify({"error": "Please provide a user ID"}), 400

if __name__ == '__main__':
    app.run(debug=True)
