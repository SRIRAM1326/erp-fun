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
    
    # 1. Test Products Upload
    products_path = r"c:\Users\sriram\Downloads\erp-prd\Stock Summary.xlsx"
    print(f"Uploading products Excel: {products_path}...")
    with open(products_path, 'rb') as f:
        files = {'file': ('Stock Summary.xlsx', f, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')}
        r = requests.post(f"{base_url}/admin/upload/products", files=files, headers=headers)
        print(f"Products Upload Result: {r.status_code}")
        if r.status_code == 500:
            print(f"  Error: {r.text}")
            
    # 2. Test Invoices Upload
    invoices_path = r"c:\Users\sriram\Downloads\erp-prd\Sales Invoice Register_sales-person.xlsx"
    print(f"Uploading invoices Excel: {invoices_path}...")
    with open(invoices_path, 'rb') as f:
        files = {'file': ('Sales Invoice Register_sales-person.xlsx', f, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')}
        r = requests.post(f"{base_url}/admin/upload/invoices", files=files, headers=headers)
        print(f"Invoices Upload Result: {r.status_code}")
        if r.status_code == 500:
            print(f"  Error: {r.text}")
            
except Exception as e:
    print(f"Error: {e}")
