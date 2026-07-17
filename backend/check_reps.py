from app import create_app
from models import User
app = create_app()
with app.app_context():
    reps = User.query.filter_by(role='rep').all()
    print("Database Reps:")
    for r in reps:
        print(f"Name: '{r.name}', Email: '{r.email}', Role: '{r.role}'")
