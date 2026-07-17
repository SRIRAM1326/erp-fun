import requests

base_url = "http://127.0.0.1:5000/api"

# 1. Test Rep Access
print("Logging in as Representative (mr.kiranm@sales.com)...")
login_data = {
    "email": "mr.kiranm@sales.com",
    "password": "rep123"
}
try:
    r = requests.post(f"{base_url}/auth/login", json=login_data)
    if r.status_code == 200:
        token = r.json().get("token")
        headers = {"Authorization": f"Bearer {token}"}
        
        rep_eps = ["/rep/dashboard", "/rep/invoices"]
        for ep in rep_eps:
            r = requests.get(f"{base_url}{ep}", headers=headers)
            print(f"Rep Endpoint {ep:20} -> Status Code: {r.status_code}")
            if r.status_code == 500:
                print(f"  Error Response: {r.text[:500]}")
    else:
        print(f"Rep Login failed: {r.status_code} - {r.text}")
except Exception as e:
    print(f"Rep login error: {e}")

# 2. Test Buyer Access
print("\nLogging in as Buyer (j.j.electricalspudhur@example.com)...")
login_data = {
    "email": "j.j.electricalspudhur@example.com",
    "password": "buyer123"
}
try:
    r = requests.post(f"{base_url}/auth/login", json=login_data)
    if r.status_code == 200:
        token = r.json().get("token")
        headers = {"Authorization": f"Bearer {token}"}
        
        buyer_eps = ["/buyer/dashboard", "/buyer/history"]
        for ep in buyer_eps:
            r = requests.get(f"{base_url}{ep}", headers=headers)
            print(f"Buyer Endpoint {ep:20} -> Status Code: {r.status_code}")
            if r.status_code == 500:
                print(f"  Error Response: {r.text[:500]}")
    else:
        print(f"Buyer Login failed: {r.status_code} - {r.text}")
except Exception as e:
    print(f"Buyer login error: {e}")
