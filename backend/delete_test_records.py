from app import create_app
from models import db, User, QRCode, PointsTransaction, Reward, Campaign, Invoice, Redemption, Product

app = create_app()
with app.app_context():
    try:
        # Invoices to delete
        invoice_numbers = ['INV-ERP100', 'INV-ERP101']
        
        # Buyers/Salesmen to delete
        user_names = [
            'Shree Balaji Traders Store', 
            'Shree Balaji Traders', 
            'Aditya Electronics Store', 
            'Aditya Electronics',
            'Rohan Sharma'
        ]
        
        # 1. Delete points transactions associated with these invoices or user names
        print("Deleting points transactions...")
        db.session.query(PointsTransaction).filter(
            (PointsTransaction.invoice_number.in_(invoice_numbers)) |
            (PointsTransaction.buyer_id.in_(
                db.session.query(User.id).filter(User.name.in_(user_names))
            ))
        ).delete(synchronize_session=False)
        
        # 2. Delete QR codes associated with these users
        print("Deleting QR codes...")
        db.session.query(QRCode).filter(
            QRCode.buyer_id.in_(
                db.session.query(User.id).filter(User.name.in_(user_names))
            )
        ).delete(synchronize_session=False)
        
        # 3. Delete redemptions associated with these users
        print("Deleting redemptions...")
        db.session.query(Redemption).filter(
            Redemption.user_id.in_(
                db.session.query(User.id).filter(User.name.in_(user_names))
            )
        ).delete(synchronize_session=False)
        
        # 4. Delete invoices
        print("Deleting invoices...")
        db.session.query(Invoice).filter(Invoice.invoice_number.in_(invoice_numbers)).delete(synchronize_session=False)
        
        # 5. Delete users
        print("Deleting users...")
        db.session.query(User).filter(User.name.in_(user_names)).delete(synchronize_session=False)
        
        db.session.commit()
        print("Successfully removed verification test records from the database!")
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting records: {e}")
