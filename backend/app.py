from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db, User, Campaign
from routes import api
from werkzeug.security import generate_password_hash

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    CORS(app)
    db.init_app(app)
    jwt = JWTManager(app)
    
    app.register_blueprint(api, url_prefix='/api')
    
    with app.app_context():
        db.create_all()
        # Create a default admin user if none exists
        if not User.query.filter_by(email='admin@example.com').first():
            admin = User(
                name='Admin User',
                email='admin@example.com',
                password_hash=generate_password_hash('admin123'),
                role='admin'
            )
            db.session.add(admin)
            
            # Create a test buyer
            buyer = User(
                name='Test Buyer',
                email='buyer@example.com',
                password_hash=generate_password_hash('buyer123'),
                role='buyer',
                business_name='Test Store',
                referral_code='REF-TESTSTORE'
            )
            db.session.add(buyer)
            db.session.commit()
            
            # Create a referred buyer
            buyer2 = User(
                name='Second Buyer',
                email='buyer2@example.com',
                password_hash=generate_password_hash('buyer123'),
                role='buyer',
                business_name='Second Store',
                referral_code='REF-SECOND',
                referrer_id=buyer.id
            )
            db.session.add(buyer2)
            
            # Create a campaign
            from datetime import datetime, timedelta
            campaign = Campaign(
                name='Double Points Weekend',
                multiplier=2.0,
                start_date=datetime.utcnow() - timedelta(days=1),
                end_date=datetime.utcnow() + timedelta(days=2),
                status='active'
            )
            db.session.add(campaign)
            
            db.session.commit()
            
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
