import requests

# Test the /rate endpoint
rate_url = "http://127.0.0.1:5000/rate"
rate_data = {
    "user_id": 1,
    "book_id": 101,
    "rating": 1
}
rate_response = requests.post(rate_url, json=rate_data)
print("Rate Response:", rate_response.json())

# Test the /recommend endpoint
recommend_url = "http://127.0.0.1:5000/recommend?user_id=1"
recommend_response = requests.get(recommend_url)
print("Recommend Response:", recommend_response.json())