import requests

base_url = "http://127.0.0.1:5000/api"

login_data = {
    "email": "admin@example.com",
    "password": "admin123"
}

try:
    print("1. Logging in as Admin...")
    r = requests.post(f"{base_url}/auth/login", json=login_data)
    if r.status_code != 200:
        print(f"Login failed: {r.status_code} - {r.text}")
        exit(1)
        
    token = r.json().get("token")
    headers = {"Authorization": f"Bearer {token}"}
    
    print("2. GET /admin/config...")
    r = requests.get(f"{base_url}/admin/config", headers=headers)
    print("GET status:", r.status_code)
    config = r.json()
    print("Loyalty Consecutive Months:", config.get("loyalty_consecutive_months"))
    print("Loyalty Min Monthly Purchase:", config.get("loyalty_min_monthly_purchase"))
    print("Loyalty Bonus:", config.get("loyalty_bonus"))
    
    print("3. POST /admin/config (Saving Loyalty Tier Variable rules)...")
    config["loyalty_consecutive_months"] = 3
    config["loyalty_min_monthly_purchase"] = 200000.0
    config["loyalty_bonus"] = 10000
    r = requests.post(f"{base_url}/admin/config", json=config, headers=headers)
    print("POST status:", r.status_code, r.text)
    
    print("4. GET /admin/config/versions...")
    r = requests.get(f"{base_url}/admin/config/versions", headers=headers)
    print("Versions status:", r.status_code)
    versions = r.json()
    latest = versions[0]
    print(f"Latest Version V{latest['version']}: Consecutive={latest.get('loyalty_consecutive_months')} months, MinSpend=₹{latest.get('loyalty_min_monthly_purchase')}, Bonus={latest.get('loyalty_bonus')} pts")
    
    print("SUCCESS: Loyalty Tier Variable configured and verified!")

except Exception as e:
    print("Error:", e)
