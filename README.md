
# APIS Backend (DEV)

This repository contains documentation for the **APIS Backend (DEV)** API, which supports functionalities such as user authentication, book management, and user actions.

## Base URLs
- Development: `http://localhost:8080`
- Production: `https://bookstorebackendapis.azurewebsites.net`

---

## Table of Contents
1. [Authentication](#authentication)
2. [Books](#books)
3. [Admin](#admin)
4. [Bookmarks](#bookmarks)

---

## Authentication

### **Register User**
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "username": "test",
    "password": "test",
    "role": "user"
  }
  ```
- **Response**: N/A

---

### **Login**
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "username": "test",
    "password": "test"
  }
  ```
- **Response**: N/A

---

### **Logout**
- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Headers**:
  ```text
  Authorization: Bearer <token>
  ```
- **Response**: N/A

---

## Books

### **Get All Books**
- **URL**: `/api/books/`
- **Method**: `GET`
- **Headers**:
  ```text
  Authorization: Bearer <token>
  ```
- **Response**: N/A

---

### **Get Book by ID**
- **URL**: `/api/books/search/{id}`
- **Method**: `GET`
- **Headers**:
  ```text
  Authorization: Bearer <token>
  ```
- **Response**: N/A

---

### **Search by Any Word**
- **URL**: `/api/books/search`
- **Method**: `GET`
- **Query Parameters**:
  - `query`: Search keyword
- **Headers**:
  ```text
  Authorization: Bearer <token>
  ```
- **Response**: N/A

---

## Admin

### **Create a New Book**
- **URL**: `/api/admin/create`
- **Method**: `POST`
- **Headers**:
  ```text
  Authorization: Bearer <token>
  ```
- **Payload**:
  ```json
  {
    "goodreads_book_id": 444,
    "best_book_id": 233,
    "work_id": 445,
    "books_count": 23,
    "title": "Sample Title"
  }
  ```

---

### **Update a Book**
- **URL**: `/api/admin/update/{id}`
- **Method**: `PUT`
- **Headers**:
  ```text
  Authorization: Bearer <token>
  ```
- **Payload**:
  ```json
  {
    "title": "Updated Title"
  }
  ```

---

### **Get All Books (Paginated)**
- **URL**: `/api/admin/read`
- **Method**: `GET`
- **Headers**: N/A
- **Response**: N/A

---

### **Delete a Book**
- **URL**: `/api/admin/delete/{id}`
- **Method**: `DELETE`
- **Headers**:
  ```text
  Authorization: Bearer <token>
  ```

---

## Users (Admin)

### **Get All Users**
- **URL**: `/api/admin/users`
- **Method**: `GET`
- **Headers**:
  ```text
  Authorization: Bearer <token>
  ```

---

### **Search User**
- **URL**: `/api/admin/searchUser`
- **Method**: `GET`
- **Query Parameters**:
  - `query`: Search keyword
- **Headers**:
  ```text
  Authorization: Bearer <token>
  ```

---

### **Update User**
- **URL**: `/api/admin/updateUser/{id}`
- **Method**: `PUT`
- **Payload**:
  ```json
  {
    "role": "user"
  }
  ```
- **Headers**:
  ```text
  Authorization: Bearer <token>
  ```

---

### **Delete a User**
- **URL**: `/api/admin/deleteUser/{id}`
- **Method**: `DELETE`
- **Headers**:
  ```text
  Authorization: Bearer <token>
  ```

---

## Bookmarks

### **Bookmark a Book**
- **URL**: `/api/users/{userId}/bookmarks/{bookId}`
- **Method**: `POST`
- **Headers**:
  ```text
  Authorization: Bearer <token>
  ```

---

### **Rate a Book**
- **URL**: `/api/users/{userId}/rate/{bookId}`
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "rating": 1
  }
  ```

---

### **Get User's Bookmarks**
- **URL**: `/api/users/{userId}/bookmarks`
- **Method**: `GET`
- **Headers**:
  ```text
  Authorization: Bearer <token>
  ```

---

## Authentication
All APIs require a Bearer token unless explicitly mentioned. To obtain a token, login using `/api/auth/login` with a valid user account.
