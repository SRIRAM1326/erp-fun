import requests

base_url = "http://127.0.0.1:5000/api"

# Login
login_data = {
    "email": "admin@example.com",
    "password": "admin123"
}

try:
    print("Logging in...")
    r = requests.post(f"{base_url}/auth/login", json=login_data)
    if r.status_code != 200:
        print(f"Login failed: {r.status_code} - {r.text}")
        exit()
        
    token = r.json().get("token")
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    endpoints = [
        "/admin/config/versions",
        "/admin/reports/analytics",
        "/admin/config"
    ]
    
    for ep in endpoints:
        r = requests.get(f"{base_url}{ep}", headers=headers)
        print(f"Endpoint {ep:30} -> Status Code: {r.status_code}")
        if r.status_code == 500:
            print(f"  Error Response: {r.text[:500]}")
            
except Exception as e:
    print(f"Error: {e}")
