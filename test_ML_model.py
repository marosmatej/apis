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
try:
    print("Recommend Response:", recommend_response.json())
except requests.exceptions.JSONDecodeError:
    print("Recommend Response (raw):", recommend_response.text)

# Test the /preferences endpoint
preferences_url = "http://127.0.0.1:5000/preferences"
preferences_data = {
    "user_id": 1,
    "tags": ["science-fiction", "fantasy"]
}
preferences_response = requests.post(preferences_url, json=preferences_data)
print("Preferences Response:", preferences_response.json())

# Test the /recommend_bundle endpoint
recommend_bundle_url = "http://127.0.0.1:5000/recommend_bundle?user_id=1"
recommend_bundle_response = requests.get(recommend_bundle_url)
try:
    print("Recommend Bundle Response:", recommend_bundle_response.json())
except requests.exceptions.JSONDecodeError:
    print("Recommend Bundle Response (raw):", recommend_bundle_response.text)