from app import create_app
import openpyxl
import io

app = create_app()

wb = openpyxl.Workbook()
ws = wb.active
ws.append(["Customer Code", "Customer Name", "Address", "City", "State", "Phone Number", "Mail"])
ws.append(["000590", "A.G.ELECTRICALS", "16-33/4-1 G.S.COMPLEX", "Mekkamandapam", "Tamil Nadu", "ARUMANAYAG DAVID SOLOMON", ""])

bytes_io = io.BytesIO()
wb.save(bytes_io)
bytes_io.seek(0)

with app.test_client() as client:
    print("Logging in as Admin...")
    r = client.post('/api/auth/login', json={'email': 'admin@example.com', 'password': 'admin123'})
    token = r.get_json().get('token')
    headers = {'Authorization': f'Bearer {token}'}

    print("Uploading row with long text in Phone column...")
    r = client.post('/api/admin/upload/customers', data={'file': (bytes_io, 'Customer_Master_Long_Phone.xlsx')}, content_type='multipart/form-data', headers=headers)
    print("Status:", r.status_code)
    print("Response:", r.get_json())
