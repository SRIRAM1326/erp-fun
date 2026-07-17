import requests

base_url = "http://127.0.0.1:5000/api"

# Login
login_data = {
    "email": "admin@example.com",
    "password": "admin123"
}

try:
    print("Attempting login...")
    r = requests.post(f"{base_url}/auth/login", json=login_data)
    if r.status_code != 200:
        print(f"Login failed: {r.status_code} - {r.text}")
        exit()
        
    token = r.json().get("token")
    headers = {
        "Authorization": f"Bearer {token}"
    }
    print("Login successful! Requesting /admin/products...")
    
    r = requests.get(f"{base_url}/admin/products", headers=headers)
    print(f"Status Code: {r.status_code}")
    print(f"Response: {r.text[:500]}")
except Exception as e:
    print(f"Error calling API: {e}")
