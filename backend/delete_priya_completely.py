from app import create_app
from models import db, User, QRCode, PointsTransaction, Redemption, Invoice

app = create_app()
with app.app_context():
    try:
        # Find all reps with name Priya Menon
        priya_users = User.query.filter(User.name.like('%Priya Menon%')).all()
        
        if not priya_users:
            print("No representatives named Priya Menon found in the database.")
            exit()
            
        for priya in priya_users:
            print(f"Found Priya Menon: ID={priya.id}, Email={priya.email}")
            
            # 1. Unlink rep_id from invoices
            print("Unlinking rep from invoices...")
            db.session.query(Invoice).filter(Invoice.rep_id == priya.id).update({Invoice.rep_id: None})
            
            # 2. Delete points transactions associated with this rep
            print("Deleting points transactions...")
            db.session.query(PointsTransaction).filter(PointsTransaction.buyer_id == priya.id).delete()
            
            # 3. Delete QR codes associated with this rep
            print("Deleting QR codes...")
            db.session.query(QRCode).filter(QRCode.buyer_id == priya.id).delete()
            
            # 4. Delete redemptions associated with this rep
            print("Deleting redemptions...")
            db.session.query(Redemption).filter(Redemption.user_id == priya.id).delete()
            
            # 5. Delete user record
            print("Deleting user record...")
            db.session.delete(priya)
            
        db.session.commit()
        print("Priya Menon has been completely removed from the database!")
    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
