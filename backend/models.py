from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(512))
    role = db.Column(db.String(20), default='buyer') # 'admin' or 'buyer'
    
    # Buyer specific fields
    business_name = db.Column(db.String(100))
    customer_code = db.Column(db.String(100), nullable=True)
    phone = db.Column(db.String(100))
    address = db.Column(db.String(255), default='0')
    city = db.Column(db.String(100), default='0')
    state = db.Column(db.String(100), default='0')
    total_points = db.Column(db.Integer, default=0)
    tier = db.Column(db.String(20), default='bronze')
    
    # Referrals
    referral_code = db.Column(db.String(50), unique=True, nullable=True)
    referrer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    
    # Verification
    is_verified = db.Column(db.Boolean, default=False)
    verification_status = db.Column(db.String(20), default='pending') # 'pending', 'verified', 'rejected'
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    transactions = db.relationship('PointsTransaction', backref='buyer', lazy=True)
    qr_codes = db.relationship('QRCode', backref='buyer', lazy=True)
    referred_users = db.relationship('User', backref=db.backref('referrer', remote_side=[id]), lazy=True)

class QRCode(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code_value = db.Column(db.String(100), unique=True, nullable=False)
    points = db.Column(db.Integer, nullable=False)
    buyer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True) # Optional, can be assigned later
    status = db.Column(db.String(20), default='active') # 'active', 'scanned', 'expired'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    scanned_at = db.Column(db.DateTime, nullable=True)

class PointsTransaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    buyer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    points = db.Column(db.Integer, nullable=False)
    transaction_type = db.Column(db.String(10)) # 'credit' or 'debit'
    source = db.Column(db.String(50)) # 'scan', 'reward', 'manual', 'referral_bonus'
    invoice_number = db.Column(db.String(50), nullable=True)
    rule_applied = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Reward(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255))
    points_required = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default='active') # 'active' or 'inactive'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Campaign(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    multiplier = db.Column(db.Float, default=1.0)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), default='active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Invoice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    invoice_number = db.Column(db.String(50), unique=True, nullable=False)
    buyer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rep_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending') # 'pending', 'paid'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    paid_at = db.Column(db.DateTime, nullable=True)
    
    points_customer = db.Column(db.Integer, default=0)
    points_rep = db.Column(db.Integer, default=0)
    products = db.Column(db.String(255), nullable=True) # comma-separated product names
    config_version = db.Column(db.Integer, nullable=True)
    
    buyer = db.relationship('User', foreign_keys=[buyer_id], backref='invoices')
    rep = db.relationship('User', foreign_keys=[rep_id], backref='referred_invoices')

class Redemption(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    points_redeemed = db.Column(db.Integer, nullable=False)
    redemption_type = db.Column(db.String(50), nullable=False) # 'cash' or 'product'
    details = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(20), default='pending') # 'pending', 'approved', 'rejected'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref='redemptions')

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    tag = db.Column(db.String(50), default='normal') # 'normal', 'special', 'old_stock', 'double_points'
    bonus_points = db.Column(db.Integer, default=0)
    category = db.Column(db.String(100), nullable=True)
    brand = db.Column(db.String(100), nullable=True)
    sales_rate = db.Column(db.Float, default=0.0)

class Configuration(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    version = db.Column(db.Integer, default=1)
    invoice_reward_percentage = db.Column(db.Float, default=0.50)
    credit_period = db.Column(db.Integer, default=7)
    forfeiture_cutoff = db.Column(db.Integer, default=30)
    high_spend_threshold = db.Column(db.Float, default=200000.0)
    high_spend_bonus = db.Column(db.Integer, default=500)
    loyalty_consecutive_months = db.Column(db.Integer, default=3)
    loyalty_min_monthly_purchase = db.Column(db.Float, default=200000.0)
    loyalty_bonus = db.Column(db.Integer, default=10000)
    regular_bonus = db.Column(db.Integer, default=150)
    special_bonus = db.Column(db.Integer, default=300)
    old_stock_bonus = db.Column(db.Integer, default=500)
    referral_min_value = db.Column(db.Float, default=0.0)
    referral_rate = db.Column(db.Float, default=0.01)
    double_products = db.Column(db.String(255), default="Product X, Product Y")
    shop_onboard_bonus = db.Column(db.Integer, default=1000)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
