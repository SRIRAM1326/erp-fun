import psycopg2

conn = psycopg2.connect(
    'postgresql://postgres:qoSxGIMTdwlzMyyP@db.bkqhhfnlfoyoibwjtxwy.supabase.co:5432/postgres'
)
cur = conn.cursor()

# Increase password_hash column to handle scrypt hashes (~200 chars)
cur.execute('ALTER TABLE "user" ALTER COLUMN password_hash TYPE VARCHAR(512);')
conn.commit()

cur.close()
conn.close()
print('Done! password_hash column altered to VARCHAR(512)')
