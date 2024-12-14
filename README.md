
# Book Rating and Recommendation API

This API provides endpoints for managing book ratings, user preferences, and generating book recommendations. It combines user feedback and tag-based filtering to deliver personalized recommendations. The backend is built using Flask and integrates content-based and collaborative filtering for recommendation generation.

## Endpoints

### POST `/rate`
Allows users to rate a book and optionally bookmark it.

#### URL
`/rate`

#### Method
`POST`

#### Request Body
```json
{
  "user_id": 1,
  "book_id": 101,
  "rating": 1,
  "is_bookmarked": 1
}
```
- **user_id**: The ID of the user.  
- **book_id**: The ID of the book.  
- **rating**: `1` for like, `-1` for dislike.  
- **is_bookmarked**: `1` for bookmarked, `0` for not bookmarked.  

#### Response
```json
{
  "message": "Rating and bookmark status saved"
}
```

---

### GET `/recommend`
Provides book recommendations based on user ratings.

#### URL
`/recommend`

#### Method
`GET`

#### Query Parameters
- **user_id**: The ID of the user.

#### Response
```json
[102, 103, 104, ...]
```

---

### POST `/preferences`
Allows users to set or update their preferred tags based on the books they have liked.

#### URL
`/preferences`

#### Method
`POST`

#### Request Body
```json
{
  "user_id": 1
}
```
- **user_id**: The ID of the user.  

#### Response
```json
{
  "message": "Preferences updated based on liked books"
}
```

---

### GET `/recommend_bundle`
Provides a bundle of recommended books based on user preferences, combining collaborative and content-based filtering.

#### URL
`/recommend_bundle`

#### Method
`GET`

#### Query Parameters
- **user_id**: The ID of the user.

#### Response
```json
[201, 202, 203, ...]
```

---

## Code Overview

The backend API is built using **Flask** and integrates several components for recommendation logic and data storage:

### Data Loading and Preprocessing
- **Books and Tags Data**: Books and associated tags are loaded from CSV files (`books.csv`, `tags.csv`, `book_tags.csv`).
- **Tag Processing**: Tags are grouped by `book_id` and concatenated into a single string for each book to facilitate content-based recommendations.
- **TF-IDF Vectorization**: A **TF-IDF Vectorizer** is used to compute feature vectors for the combined metadata (title, authors, and tags).

### Database Setup
- **SQLite Database**: The backend uses an SQLite database to store user ratings and preferences.
  - **Tables**:
    - `user_ratings`: Stores book ratings for users.
    - `user_preferences`: Stores preferred tags for users.
    - `bookmarks`: Stores bookmark status and ratings for users.

### Recommendation Logic
- **Content-Based Filtering**: Recommendations are generated using cosine similarity between books the user liked and all other books based on their features (title, authors, and tags).
- **Collaborative Filtering**: A **K-Nearest Neighbors (KNN)** model is used to find similar users and generate recommendations based on their ratings.
- **Tag-Based Filtering**: A combination of content-based recommendations and user preferences (tags) to generate book bundles.

### Key Components
- **UserRating**: Represents user ratings and bookmark status.
- **UserPreferences**: Stores user preferences based on book tags.
- **Bookmark**: Stores bookmark status for each user-book pair.
- **Book**: Represents the book data with metadata like title and authors.