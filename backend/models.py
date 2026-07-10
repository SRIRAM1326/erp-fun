from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(20), default='buyer') # 'admin' or 'buyer'
    
    # Buyer specific fields
    business_name = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    total_points = db.Column(db.Integer, default=0)
    tier = db.Column(db.String(20), default='bronze')
    
    # Referrals
    referral_code = db.Column(db.String(50), unique=True, nullable=True)
    referrer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    
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
