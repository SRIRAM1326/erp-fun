from app import create_app
from models import db, User, QRCode, PointsTransaction, Reward, Campaign, Invoice, Redemption, Product

app = create_app()
with app.app_context():
    try:
        print("Deleting points transactions...")
        db.session.query(PointsTransaction).delete()
        
        print("Deleting QR codes...")
        db.session.query(QRCode).delete()
        
        print("Deleting invoices...")
        db.session.query(Invoice).delete()
        
        print("Deleting redemptions...")
        db.session.query(Redemption).delete()
        
        print("Deleting campaigns...")
        db.session.query(Campaign).delete()
        
        print("Deleting products...")
        db.session.query(Product).delete()
        
        print("Deleting non-admin users...")
        db.session.query(User).filter(User.role != 'admin').delete()
        
        db.session.commit()
        print("Database cleared successfully! Only admin users and configurations are kept.")
    except Exception as e:
        db.session.rollback()
        print(f"Error clearing database: {e}")
