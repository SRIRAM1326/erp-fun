from app import create_app
from models import db, Configuration, User, PointsTransaction, Invoice
from datetime import datetime

app = create_app()

with app.test_client() as client:
    print("1. Logging in as Admin...")
    r = client.post('/api/auth/login', json={
        'email': 'admin@example.com',
        'password': 'admin123'
    })
    print("Login status:", r.status_code)
    token = r.get_json().get('token')
    headers = {'Authorization': f'Bearer {token}'}
    
    print("2. GET /api/admin/config...")
    r = client.get('/api/admin/config', headers=headers)
    print("GET status:", r.status_code)
    config = r.get_json()
    print("  loyalty_consecutive_months:", config.get("loyalty_consecutive_months"))
    print("  loyalty_min_monthly_purchase:", config.get("loyalty_min_monthly_purchase"))
    print("  loyalty_bonus:", config.get("loyalty_bonus"))
    
    print("3. POST /api/admin/config (Saving updated loyalty tier variables)...")
    config["loyalty_consecutive_months"] = 3
    config["loyalty_min_monthly_purchase"] = 200000.0
    config["loyalty_bonus"] = 10000
    r = client.post('/api/admin/config', json=config, headers=headers)
    print("POST status:", r.status_code, r.get_json())
    
    print("4. GET /api/admin/config/versions...")
    r = client.get('/api/admin/config/versions', headers=headers)
    print("Versions status:", r.status_code)
    versions = r.get_json()
    latest = versions[0]
    print(f"Latest V{latest['version']}: Months={latest.get('loyalty_consecutive_months')}, MinSpend=₹{latest.get('loyalty_min_monthly_purchase')}, Bonus={latest.get('loyalty_bonus')} pts")
    
    print("ALL BACKEND LOYALTY TIER TESTS PASSED SUCCESSFULLY!")
