from app import create_app
from models import User
app = create_app()
with app.app_context():
    users = User.query.all()
    print("Database Users:")
    for u in users:
        print(f"ID: {u.id}, Name: '{u.name}', Email: '{u.email}', Role: '{u.role}', Verified: {u.is_verified}")
