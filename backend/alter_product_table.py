from app import create_app
from models import db
from sqlalchemy import text

app = create_app()
with app.app_context():
    try:
        print("Altering product table...")
        db.session.execute(text("ALTER TABLE product ADD COLUMN IF NOT EXISTS category VARCHAR(100);"))
        db.session.execute(text("ALTER TABLE product ADD COLUMN IF NOT EXISTS sales_rate DOUBLE PRECISION DEFAULT 0.0;"))
        db.session.commit()
        print("Product table altered successfully!")
    except Exception as e:
        db.session.rollback()
        print(f"Error altering table: {e}")
