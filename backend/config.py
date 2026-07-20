import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-secure-minimum-32-bytes-long-string-123'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'dev-jwt-secret-key-secure-minimum-32-bytes-long-string-123'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'postgresql://postgres:qoSxGIMTdwlzMyyP@db.bkqhhfnlfoyoibwjtxwy.supabase.co:5432/postgres'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

