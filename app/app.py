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

# Select relevant features
df = df[['book_id', 'title', 'authors', 'average_rating']]

# Normalize the titles to lowercase
df['title'] = df['title'].str.lower()

# Combine title and authors into a single feature
df['combined_features'] = df['title'] + ' ' + df['authors']

# Initialize the TF-IDF Vectorizer
tfidf = TfidfVectorizer(stop_words='english')

# Fit and transform the combined features
tfidf_matrix = tfidf.fit_transform(df['combined_features'])

# Compute the cosine similarity matrix
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

# Set up the database
engine = create_engine('sqlite:///books.db')
Base = declarative_base()

class Book(Base):
    __tablename__ = 'books'
    id = Column(Integer, primary_key=True)
    book_id = Column(Integer, unique=True)
    title = Column(String)
    authors = Column(String)
    average_rating = Column(Float)
    vector = Column(LargeBinary)

Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

# Clear the database
session.query(Book).delete()
session.commit()

# Check for duplicates
duplicates = df[df.duplicated('book_id')]
print(f"Duplicate book IDs: {duplicates}")

# Remove duplicates
df = df.drop_duplicates('book_id')

# Store the vectors in the database
for i, row in df.iterrows():
    vector = pickle.dumps(tfidf_matrix[i].toarray())
    book = Book(book_id=row['book_id'], title=row['title'], authors=row['authors'], average_rating=row['average_rating'], vector=vector)
    print(f"Storing book: {row['title']} with ID: {row['book_id']}")  # Print the title and ID for debugging
    session.add(book)
session.commit()

def get_recommendations(book_id):
    # Get the book from the database
    book = session.query(Book).filter_by(book_id=book_id).first()
    if not book:
        print(f"Book with ID '{book_id}' not found in the database.")
        return []

    # Load the vector
    book_vector = pickle.loads(book.vector)

    # Compute the cosine similarity with all other books
    sim_scores = []
    for other_book in session.query(Book).all():
        other_vector = pickle.loads(other_book.vector)
        sim_score = cosine_similarity(book_vector, other_vector)[0][0]
        sim_scores.append((other_book.book_id, sim_score))

    # Sort the books based on the similarity scores
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    # Print similarity scores for debugging
    print(f"Similarity scores for book ID '{book_id}': {sim_scores}")

    # Get the IDs of the 10 most similar books
    recommendations = [book_id for book_id, score in sim_scores[1:11]]

    # Print recommendations for debugging
    print(f"Recommendations for book ID '{book_id}': {recommendations}")

    return recommendations

@app.route('/recommend', methods=['GET'])
def recommend():
    book_id = request.args.get('book_id')
    print(f"Received request for recommendations with book ID: {book_id}")
    if book_id:
        recommendations = get_recommendations(int(book_id))
        print(f"Recommendations: {recommendations}")
        return jsonify(recommendations)
    else:
        return jsonify({"error": "Please provide a book ID"}), 400

if __name__ == '__main__':
    app.run(debug=True)