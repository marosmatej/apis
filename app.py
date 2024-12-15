from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy import create_engine, Column, Integer, String, Float, LargeBinary, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker
from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

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
    is_bookmarked = Column(Integer)  # 1 for bookmarked, 0 for not bookmarked

class UserPreferences(Base):
    __tablename__ = 'user_preferences'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    tags = Column(String)  # Space-separated list of preferred tags

class Bookmark(Base):
    __tablename__ = 'bookmarks'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user_ratings.user_id'))
    book_id = Column(Integer, ForeignKey('user_ratings.book_id'))
    is_bookmarked = Column(Integer)  # 1 for bookmarked, 0 for not bookmarked
    rating = Column(Integer)  # 1 for like, -1 for dislike

class Book(Base):
    __tablename__ = 'books'
    id = Column(Integer, primary_key=True)
    title = Column(String)
    authors = Column(String)
    # Add other relevant fields

engine = create_engine('sqlite:///books.db')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

def get_user_item_matrix():
    user_ratings_df = pd.read_sql(session.query(UserRating).statement, session.bind)
    
    # Group by user_id and book_id, and take the mean of the ratings
    user_ratings_df = user_ratings_df.groupby(['user_id', 'book_id'], as_index=False)['rating'].mean()
    
    user_item_matrix = user_ratings_df.pivot(index='user_id', columns='book_id', values='rating').fillna(0)
    return csr_matrix(user_item_matrix.values), user_item_matrix

def recommend_books_based_on_likes(user_id):
    user_ratings = session.query(UserRating).filter_by(user_id=user_id).all()

    if not user_ratings:
        return []

    liked_books = [rating.book_id for rating in user_ratings if rating.rating == 1]

    if not liked_books:
        return []

    liked_books_features = df[df['book_id'].isin(liked_books)]['combined_features']
    liked_books_matrix = tfidf_vectorizer.transform(liked_books_features)
    sim_scores = cosine_similarity(liked_books_matrix, tfidf_matrix)

    sim_scores = sim_scores.flatten()
    similar_books_indices = sim_scores.argsort()[-10:][::-1]
    recommendations = df.iloc[similar_books_indices]['book_id'].tolist()

    return recommendations[:5]  # Return top 5 books

def recommend_bundle_collaborative(user_id):
    user_item_matrix_sparse, user_item_matrix = get_user_item_matrix()

    # Check if there are enough users for collaborative filtering
    if user_item_matrix.shape[0] < 2:
        return recommend_popular_books_from_genres(user_id)

    # Fit the NearestNeighbors model
    model_knn = NearestNeighbors(metric='cosine', algorithm='brute')
    model_knn.fit(user_item_matrix_sparse)

    # Find similar users
    user_index = user_item_matrix.index.get_loc(user_id)
    n_neighbors = min(10, user_item_matrix.shape[0])  # Adjust the number of neighbors
    distances, indices = model_knn.kneighbors(user_item_matrix_sparse[user_index], n_neighbors=n_neighbors)

    # Get book recommendations from similar users
    similar_users = indices.flatten()
    similar_users_ratings = user_item_matrix.iloc[similar_users].mean(axis=0)
    recommended_books = similar_users_ratings[similar_users_ratings > 0].sort_values(ascending=False).index.tolist()

    # Get the user's preferred genres
    user_preferences = session.query(UserPreferences).filter_by(user_id=user_id).first()
    if not user_preferences:
        return []

    preferred_genres = user_preferences.tags.split()

    # Filter recommended books by preferred genres
    filtered_books = df[df['book_id'].isin(recommended_books) & df['tag_name'].apply(lambda x: any(genre in x for genre in preferred_genres))]

    # Select a bundle of books (e.g., top 7 books)
    bundle = filtered_books.head(7)['book_id'].tolist()

    return bundle

def recommend_popular_books_from_genres(user_id):
    # Get the user's preferred genres
    user_preferences = session.query(UserPreferences).filter_by(user_id=user_id).first()
    if not user_preferences:
        return []

    preferred_genres = user_preferences.tags.split()

    # Filter books by preferred genres
    filtered_books = df[df['tag_name'].apply(lambda x: any(genre in x for genre in preferred_genres))]

    # Select a bundle of popular books (e.g., top 7 books)
    bundle = filtered_books.head(7)['book_id'].tolist()

    return bundle

def create_dataset():
    # Query user_ratings and books tables
    user_ratings_df = pd.read_sql(session.query(UserRating).statement, session.bind)
    books_df = pd.read_sql(session.query(Book).statement, session.bind)

    # Merge user_ratings with books
    merged_df = user_ratings_df.merge(books_df, left_on='book_id', right_on='id', suffixes=('_rating', '_book'))

    return merged_df

@app.route('/rate', methods=['POST'])
def rate_book():
    data = request.json
    user_id = data['user_id']
    book_id = data['book_id']
    rating = data['rating']  # 1 for like, -1 for dislike
    is_bookmarked = data.get('is_bookmarked', 0)  # Default to 0 if not provided

    user_rating = UserRating(user_id=user_id, book_id=book_id, rating=rating, is_bookmarked=is_bookmarked)
    session.add(user_rating)

    # Update or create a bookmark entry
    bookmark = session.query(Bookmark).filter_by(user_id=user_id, book_id=book_id).first()
    if bookmark:
        bookmark.is_bookmarked = is_bookmarked
        bookmark.rating = rating
    else:
        bookmark = Bookmark(user_id=user_id, book_id=book_id, is_bookmarked=is_bookmarked, rating=rating)
        session.add(bookmark)

    session.commit()

    return jsonify({"message": "Rating and bookmark status saved"}), 200

@app.route('/preferences', methods=['POST'])
def set_preferences():
    data = request.json
    user_id = data['user_id']

    # Retrieve the books the user has liked
    liked_books = session.query(UserRating).filter_by(user_id=user_id, rating=1).all()
    if not liked_books:
        return jsonify({"message": "No liked books found for the user"}), 400

    # Extract tags from the liked books
    liked_book_ids = [rating.book_id for rating in liked_books]
    liked_books_tags = df[df['book_id'].isin(liked_book_ids)]['tag_name'].str.split().explode().dropna().unique()

    # Convert tags to strings and filter out non-string values
    liked_books_tags = [str(tag) for tag in liked_books_tags if isinstance(tag, str)]

    # Update the user's preferences with the extracted tags
    user_preferences = session.query(UserPreferences).filter_by(user_id=user_id).first()
    if user_preferences:
        # Update the existing preferences
        current_tags = set(user_preferences.tags.split())
        updated_tags = current_tags.union(set(liked_books_tags))
        user_preferences.tags = ' '.join(updated_tags)
    else:
        # Create new preferences
        user_preferences = UserPreferences(user_id=user_id, tags=' '.join(liked_books_tags))
        session.add(user_preferences)

    session.commit()

    return jsonify({"message": "Preferences updated based on liked books"}), 200

@app.route('/recommend', methods=['GET'])
def recommend():
    user_id = request.args.get('user_id')
    if user_id:
        recommendations = recommend_books_based_on_likes(int(user_id))
        return jsonify(recommendations)
    else:
        return jsonify({"error": "Please provide a user ID"}), 400

@app.route('/recommend_bundle', methods=['GET'])
def recommend_bundle_endpoint():
    user_id = request.args.get('user_id')
    if user_id:
        bundle = recommend_bundle_collaborative(int(user_id))
        return jsonify(bundle)
    else:
        return jsonify({"error": "Please provide a user ID"}), 400

if __name__ == '__main__':
    app.run(debug=True)