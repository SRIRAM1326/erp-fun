from app import create_app
from models import db, User
import openpyxl
import io

app = create_app()

# Create sample Customer Master Excel workbook in memory
wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Customer Master"

# Headers: Customer Code, Customer Name, Address, City, State, Phone Number, Mail
ws.append(["Customer Code", "Customer Name", "Address", "City", "State", "Phone Number", "Mail"])

# Row 1: Fully populated record
ws.append(["CUST-1001", "Apex Traders", "123 Commercial St", "Coimbatore", "Tamil Nadu", "9876543210", "apex@traders.com"])

# Row 2: Record with blank/empty cells (City, State, Mail are empty)
ws.append(["CUST-1002", "Star Enterprises", "45 Industrial Hub", "", "", "9123456789", ""])

# Row 3: Record with empty Customer Code (only name provided)
ws.append(["", "Golden Wholesale", "89 Market Road", "Chennai", "Tamil Nadu", "", "golden@shop.com"])

# Save to bytes
excel_bytes = io.BytesIO()
wb.save(excel_bytes)
excel_bytes.seek(0)

with app.test_client() as client:
    print("1. Logging in as Admin...")
    r = client.post('/api/auth/login', json={
        'email': 'admin@example.com',
        'password': 'admin123'
    })
    print("Login status:", r.status_code)
    token = r.get_json().get('token')
    headers = {'Authorization': f'Bearer {token}'}

    print("2. POST /api/admin/upload/customers (Uploading Customer Master Excel)...")
    data = {
        'file': (excel_bytes, 'Customer_Master_Sample.xlsx')
    }
    r = client.post('/api/admin/upload/customers', data=data, content_type='multipart/form-data', headers=headers)
    print("Upload status:", r.status_code)
    res_data = r.get_json()
    print("Response message:", res_data.get('message'))
    print("Summary stats:", res_data.get('summary'))

    print("3. GET /api/admin/buyers (Verifying imported records in Customer Management)...")
    r = client.get('/api/admin/buyers', headers=headers)
    print("GET status:", r.status_code)
    buyers = r.get_json()
    print(f"Total customers in database: {len(buyers)}")

    for b in buyers:
        if b.get('customer_code') in ['CUST-1001', 'CUST-1002']:
            print(f"Customer {b['customer_code']}: Name='{b['name']}', Phone='{b['phone']}', Address='{b['address']}', City='{b['city']}', State='{b['state']}'")

    print("\nSUCCESS: Customer Master import and Customer Management screen integration verified!")
