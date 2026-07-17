from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db, User, Campaign, Invoice, Redemption, Configuration, Product
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
                role='admin',
                is_verified=True,
                verification_status='verified'
            )
            db.session.add(admin)
            
            # Create a default configuration (Version 1)
            default_config = Configuration(
                version=1,
                credit_period=7,
                forfeiture_cutoff=30,
                high_spend_threshold=200000.0,
                high_spend_bonus=500,
                loyalty_bonus=250,
                regular_bonus=150,
                special_bonus=300,
                old_stock_bonus=500,
                referral_min_value=0.0,
                referral_rate=0.01,
                double_products="Product X, Product Y",
                shop_onboard_bonus=1000
            )
            db.session.add(default_config)
            db.session.commit()
            
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
