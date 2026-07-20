from app import create_app
import openpyxl
import io

app = create_app()

wb = openpyxl.Workbook()
ws = wb.active
ws.append(["Customer Code", "Customer Name", "Address", "City", "State", "Phone Number", "Mail"])

# Generate 100 customer rows to stress-test referral code uniqueness
for i in range(1, 101):
    ws.append([
        f"BATCH-{i:04d}",
        f"Store {i} Traders",
        f"{i} Market Rd",
        "Coimbatore",
        "Tamil Nadu",
        f"900000{i:04d}",
        f"store{i}@batch.com"
    ])

bytes_io = io.BytesIO()
wb.save(bytes_io)
bytes_io.seek(0)

with app.test_client() as client:
    print("Logging in as Admin...")
    r = client.post('/api/auth/login', json={'email': 'admin@example.com', 'password': 'admin123'})
    token = r.get_json().get('token')
    headers = {'Authorization': f'Bearer {token}'}

    print("Uploading batch of 100 customers...")
    r = client.post('/api/admin/upload/customers', data={'file': (bytes_io, 'Customer_Master_Batch_100.xlsx')}, content_type='multipart/form-data', headers=headers)
    print("Status:", r.status_code)
    print("Response:", r.get_json())
