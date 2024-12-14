# Endpoints

## POST `/rate`
Allows users to rate a book.

### URL
`/rate`

### Method
`POST`

### Request Body
```json
{
  "user_id": 1,
  "book_id": 101,
  "rating": 1
}
```

- **user_id**: The ID of the user.  
- **book_id**: The ID of the book.  
- **rating**: `1` for like, `-1` for dislike.

### Response
```json
{
  "message": "Rating saved"
}
```

---

## GET `/recommend`
Provides book recommendations based on user ratings.

### URL
`/recommend`

### Method
`GET`

### Query Parameters
- **user_id**: The ID of the user.

### Response
```json
[102, 103, 104, ...]
