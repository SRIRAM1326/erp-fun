from app import create_app
import io

app = create_app()

with open(r'c:\Users\sriram\Downloads\erp-prd\Customer Master.xlsx', 'rb') as f:
    file_bytes = f.read()

with app.test_client() as client:
    print("1. Logging in as Admin...")
    r = client.post('/api/auth/login', json={'email': 'admin@example.com', 'password': 'admin123'})
    token = r.get_json().get('token')
    headers = {'Authorization': f'Bearer {token}'}

    print("2. Uploading real Customer Master.xlsx (947 rows)...")
    r = client.post('/api/admin/upload/customers', data={'file': (io.BytesIO(file_bytes), 'Customer Master.xlsx')}, content_type='multipart/form-data', headers=headers)
    print("Status:", r.status_code)
    res = r.get_json()
    print("Message:", res.get('message'))
    print("Summary:", res.get('summary'))
