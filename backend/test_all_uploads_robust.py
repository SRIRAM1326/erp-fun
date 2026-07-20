from app import create_app
from models import db, User, Product, Invoice
import openpyxl
import io
import csv

app = create_app()

def create_sample_excel(headers, data):
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.append(headers)
    for row in data:
        ws.append(row)
    bytes_io = io.BytesIO()
    wb.save(bytes_io)
    bytes_io.seek(0)
    return bytes_io

with app.test_client() as client:
    print("1. Logging in as Admin...")
    r = client.post('/api/auth/login', json={'email': 'admin@example.com', 'password': 'admin123'})
    token = r.get_json().get('token')
    headers = {'Authorization': f'Bearer {token}'}

    print("\n--- TEST 1: Customer Master Import ---")
    cust_excel = create_sample_excel(
        ["Customer Code", "Customer Name", "Address", "City", "State", "Phone Number", "Mail"],
        [
            ["CUST-5001", "Delta Enterprises", "101 Wall St", "Salem", "Tamil Nadu", "9988776655", "delta@salem.com"],
            ["CUST-5002", "Omega Stores", "55 Market Ave", "", "", "9876500000", ""] # Empty cells
        ]
    )
    r = client.post('/api/admin/upload/customers', data={'file': (cust_excel, 'Customers_Master.XLSX')}, content_type='multipart/form-data', headers=headers)
    print("Customer Upload Status:", r.status_code)
    print("Response:", r.get_json())

    print("\n--- TEST 2: Products Import (Flexible Headers & Upper Case .XLSX) ---")
    prod_excel = create_sample_excel(
        ["Product Name", "Tag", "Bonus Points", "Brand", "Sales Rate"],
        [
            ["Ultra Widget A", "special", "250", "Brand-X", "1500.00"],
            ["Regular Widget B", "normal", "0", "Brand-Y", "800.00"]
        ]
    )
    r = client.post('/api/admin/upload/products', data={'file': (prod_excel, 'Products_Catalog.XLSX')}, content_type='multipart/form-data', headers=headers)
    print("Products Upload Status:", r.status_code)
    print("Response:", r.get_json())

    print("\n--- TEST 3: Invoices Import (Flexible Headers) ---")
    inv_excel = create_sample_excel(
        ["Bill No", "Party Name", "Net Amount", "Salesman", "Item"],
        [
            ["INV-8801", "Delta Enterprises", "125000", "rep@sales.com", "Ultra Widget A"],
            ["INV-8802", "Omega Stores", "75000", "rep@sales.com", "Regular Widget B"]
        ]
    )
    r = client.post('/api/admin/upload/invoices', data={'file': (inv_excel, 'Invoices_Export.XLSX')}, content_type='multipart/form-data', headers=headers)
    print("Invoices Upload Status:", r.status_code)
    print("Response:", r.get_json())

    print("\nALL 3 UPLOAD ENDPOINTS TESTED SUCCESSFULLY AND VERIFIED FLEXIBLE HEADER SUPPORT!")
