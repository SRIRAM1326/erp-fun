from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from models import db, User, QRCode, PointsTransaction, Reward, Campaign
import uuid
import random
from datetime import datetime
from sqlalchemy import func

api = Blueprint('api', __name__)

@api.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({'message': 'User already exists'}), 400
        
    # Generate referral code
    ref_code = f"REF-{data.get('business_name', 'USER').replace(' ', '').upper()[:5]}-{random.randint(1000, 9999)}"
        
    hashed_password = generate_password_hash(data.get('password'))
    new_user = User(
        name=data.get('name'),
        email=data.get('email'),
        password_hash=hashed_password,
        role=data.get('role', 'buyer'),
        business_name=data.get('business_name'),
        phone=data.get('phone'),
        referral_code=ref_code
    )
    
    # Check for referral
    referrer_code = data.get('referral_code_used')
    if referrer_code:
        referrer = User.query.filter_by(referral_code=referrer_code).first()
        if referrer:
            new_user.referrer_id = referrer.id
            
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully', 'referral_code': ref_code}), 201

@api.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    
    if user and check_password_hash(user.password_hash, data.get('password')):
        access_token = create_access_token(
            identity=str(user.id), 
            additional_claims={'id': user.id, 'role': user.role}
        )
        return jsonify({
            'token': access_token,
            'user': {
                'id': user.id,
                'name': user.name,
                'role': user.role,
                'points': user.total_points
            }
        }), 200
        
    return jsonify({'message': 'Invalid credentials'}), 401

@api.route('/admin/qr/generate', methods=['POST'])
@jwt_required()
def generate_qr():
    current_user = get_jwt()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
        
    data = request.get_json()
    points = data.get('points', 100)
    
    new_qr = QRCode(
        code_value=str(uuid.uuid4()),
        points=points
    )
    db.session.add(new_qr)
    db.session.commit()
    
    return jsonify({'message': 'QR code generated', 'code_value': new_qr.code_value}), 201

@api.route('/admin/buyers', methods=['GET'])
@jwt_required()
def get_buyers():
    current_user = get_jwt()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
        
    buyers = User.query.filter_by(role='buyer').all()
    result = [{
        'id': b.id,
        'name': b.name,
        'email': b.email,
        'business_name': b.business_name,
        'total_points': b.total_points,
        'tier': b.tier,
        'referral_code': b.referral_code
    } for b in buyers]
    
    return jsonify(result), 200

@api.route('/buyer/scan', methods=['POST'])
@jwt_required()
def scan_qr():
    current_user = get_jwt()
    if current_user['role'] != 'buyer':
        return jsonify({'message': 'Only buyers can scan QR codes'}), 403
        
    data = request.get_json()
    code_value = data.get('code_value')
    
    qr = QRCode.query.filter_by(code_value=code_value).first()
    if not qr:
        return jsonify({'message': 'Invalid QR code'}), 404
        
    if qr.status != 'active':
        return jsonify({'message': 'QR code already scanned or expired'}), 400
        
    buyer = User.query.get(current_user['id'])
    
    # 1. Dynamic Campaigns Check
    now = datetime.utcnow()
    active_campaign = Campaign.query.filter(
        Campaign.status == 'active',
        Campaign.start_date <= now,
        Campaign.end_date >= now
    ).first()
    
    earned_points = qr.points
    message = f'Success! {earned_points} points added.'
    
    if active_campaign:
        earned_points = int(earned_points * active_campaign.multiplier)
        message = f'Campaign Active ({active_campaign.name})! {earned_points} points added.'
    
    # Update QR
    qr.status = 'scanned'
    qr.scanned_at = now
    qr.buyer_id = buyer.id
    buyer.total_points += earned_points
    
    db.session.add(PointsTransaction(
        buyer_id=buyer.id, points=earned_points, transaction_type='credit', source='scan'
    ))
    
    # 2. Referral Bonus Check (Check if this is their first ever scan)
    has_scanned_before = PointsTransaction.query.filter_by(buyer_id=buyer.id, source='scan').count() > 1
    if not has_scanned_before and buyer.referrer_id:
        # Issue bonus
        referrer = User.query.get(buyer.referrer_id)
        if referrer:
            bonus = 5000
            buyer.total_points += bonus
            referrer.total_points += bonus
            
            db.session.add(PointsTransaction(
                buyer_id=buyer.id, points=bonus, transaction_type='credit', source='referral_bonus'
            ))
            db.session.add(PointsTransaction(
                buyer_id=referrer.id, points=bonus, transaction_type='credit', source='referral_bonus'
            ))
            message += f' Plus 5000 Referral Bonus!'

    db.session.commit()
    
    return jsonify({
        'message': message,
        'total_points': buyer.total_points
    }), 200

@api.route('/buyer/dashboard', methods=['GET'])
@jwt_required()
def buyer_dashboard():
    current_user = get_jwt()
    if current_user['role'] != 'buyer':
        return jsonify({'message': 'Unauthorized'}), 403
        
    buyer = User.query.get(current_user['id'])
    recent_txns = PointsTransaction.query.filter_by(buyer_id=buyer.id).order_by(PointsTransaction.created_at.desc()).limit(5).all()
    
    txns = [{
        'id': t.id,
        'points': t.points,
        'type': t.transaction_type,
        'source': t.source,
        'date': t.created_at.isoformat()
    } for t in recent_txns]
    
    return jsonify({
        'points': buyer.total_points,
        'tier': buyer.tier,
        'referral_code': buyer.referral_code,
        'recent_transactions': txns
    }), 200

@api.route('/buyer/history', methods=['GET'])
@jwt_required()
def buyer_history():
    current_user = get_jwt()
    if current_user['role'] != 'buyer':
        return jsonify({'message': 'Unauthorized'}), 403
        
    buyer = User.query.get(current_user['id'])
    txns = PointsTransaction.query.filter_by(buyer_id=buyer.id).order_by(PointsTransaction.created_at.desc()).all()
    
    history = [{
        'id': t.id,
        'points': t.points,
        'type': t.transaction_type,
        'source': t.source,
        'date': t.created_at.isoformat()
    } for t in txns]
    
    return jsonify(history), 200

@api.route('/buyer/leaderboard', methods=['GET'])
@jwt_required()
def get_leaderboard():
    # Get top 10 buyers by points
    top_buyers = User.query.filter_by(role='buyer').order_by(User.total_points.desc()).limit(10).all()
    
    leaderboard = []
    for i, b in enumerate(top_buyers):
        # Anonymize slightly (e.g. "Apex Distributors" -> "A. Distributors")
        parts = b.business_name.split(' ') if b.business_name else b.name.split(' ')
        display_name = f"{parts[0][0]}. {' '.join(parts[1:])}" if len(parts) > 1 else b.business_name or b.name
        
        leaderboard.append({
            'rank': i + 1,
            'name': display_name,
            'points': b.total_points,
            'tier': b.tier
        })
        
    return jsonify(leaderboard), 200

@api.route('/admin/reports/liability', methods=['GET'])
@jwt_required()
def get_liability():
    current_user = get_jwt()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
        
    total_points = db.session.query(func.sum(User.total_points)).filter(User.role == 'buyer').scalar() or 0
    # Assume 1 point = 0.10 currency units (e.g. Rupees)
    financial_liability = total_points * 0.10
    
    return jsonify({
        'total_unredeemed_points': total_points,
        'financial_liability': financial_liability,
        'currency': 'INR'
    }), 200

@api.route('/admin/reports/chart-data', methods=['GET'])
@jwt_required()
def get_chart_data():
    current_user = get_jwt()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
        
    # Return dummy aggregated data for the Recharts implementation to work immediately
    data = [
        {"name": "Jan", "issued": 4000, "redeemed": 2400},
        {"name": "Feb", "issued": 3000, "redeemed": 1398},
        {"name": "Mar", "issued": 2000, "redeemed": 9800},
        {"name": "Apr", "issued": 2780, "redeemed": 3908},
        {"name": "May", "issued": 1890, "redeemed": 4800},
        {"name": "Jun", "issued": 2390, "redeemed": 3800},
        {"name": "Jul", "issued": 3490, "redeemed": 4300},
    ]
    return jsonify(data), 200

@api.route('/admin/campaigns', methods=['GET'])
@jwt_required()
def get_campaigns():
    campaigns = Campaign.query.all()
    return jsonify([{
        'id': c.id,
        'name': c.name,
        'multiplier': c.multiplier,
        'start_date': c.start_date.isoformat(),
        'end_date': c.end_date.isoformat(),
        'status': c.status
    } for c in campaigns]), 200

@api.route('/rewards', methods=['GET'])
def get_rewards():
    rewards = Reward.query.filter_by(status='active').all()
    result = [{
        'id': r.id,
        'name': r.name,
        'description': r.description,
        'points_required': r.points_required
    } for r in rewards]
    return jsonify(result), 200
