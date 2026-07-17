from app import create_app
from models import db, User, QRCode, PointsTransaction, Reward, Campaign, Invoice, Redemption, Product

app = create_app()
with app.app_context():
    try:
        # 1. Define list of mock user emails to delete
        mock_emails = [
            'rep@example.com',
            'buyer@example.com',
            'buyer2@example.com',
            'buyer_rep_verified@example.com',
            'buyer_rep_pending@example.com'
        ]
        
        # 2. Define list of mock invoice numbers to delete
        mock_invoices = ['INV-2247', 'INV-2240', 'INV-2231', 'INV-2198']
        
        # 3. Define list of mock product names to delete
        mock_products = ['Product X', 'Product A', 'Product B']
        
        # 4. Define list of mock campaign names to delete
        mock_campaigns = ['Double Points Weekend']
        
        # Resolve user IDs to delete their transactions
        user_ids = [u.id for u in db.session.query(User).filter(User.email.in_(mock_emails)).all()]
        
        print(f"Deleting points transactions for user IDs: {user_ids}...")
        db.session.query(PointsTransaction).filter(
            (PointsTransaction.buyer_id.in_(user_ids)) | 
            (PointsTransaction.invoice_number.in_(mock_invoices))
        ).delete(synchronize_session=False)
        
        print("Deleting QR codes...")
        db.session.query(QRCode).filter(QRCode.buyer_id.in_(user_ids)).delete(synchronize_session=False)
        
        print("Deleting redemptions...")
        db.session.query(Redemption).filter(Redemption.user_id.in_(user_ids)).delete(synchronize_session=False)
        
        print("Deleting invoices...")
        db.session.query(Invoice).filter(Invoice.invoice_number.in_(mock_invoices)).delete(synchronize_session=False)
        
        print("Deleting campaigns...")
        db.session.query(Campaign).filter(Campaign.name.in_(mock_campaigns)).delete(synchronize_session=False)
        
        print("Deleting mock products...")
        db.session.query(Product).filter(Product.name.in_(mock_products)).delete(synchronize_session=False)
        
        print("Deleting mock users...")
        db.session.query(User).filter(User.email.in_(mock_emails)).delete(synchronize_session=False)
        
        db.session.commit()
        print("Successfully removed Priya Menon and all other default mock records from the database!")
    except Exception as e:
        db.session.rollback()
        print(f"Error clearing mock records: {e}")
