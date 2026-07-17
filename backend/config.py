import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-123'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'dev-jwt-secret-key-123'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'postgresql://postgres:qoSxGIMTdwlzMyyP@db.bkqhhfnlfoyoibwjtxwy.supabase.co:5432/postgres'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
