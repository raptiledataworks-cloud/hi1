"""
Seed the admin user (kani@gmail.com / Kani@12345) into the Excel database.
Run this once: python seed_admin.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.excel_db import init_excel, get_excel_path, read_from_sheet, append_row
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ADMIN_EMAIL = "kani@gmail.com"
ADMIN_PASSWORD = "Kani@12345"
ADMIN_NAME = "Kani (Admin)"

def seed():
    filepath = init_excel()
    
    # Check if admin already exists
    users = read_from_sheet(filepath, "users")
    for u in users:
        if u.get("email") == ADMIN_EMAIL:
            print(f"✅ Admin user '{ADMIN_EMAIL}' already exists. Skipping.")
            return
    
    import uuid
    admin_doc = {
        "_id": str(uuid.uuid4()),
        "name": ADMIN_NAME,
        "email": ADMIN_EMAIL,
        "hashed_password": pwd_context.hash(ADMIN_PASSWORD[:72]),
        "password_text": ADMIN_PASSWORD,
        "phone": "",
        "dob": "",
        "gender": "",
        "address": "",
        "city": "",
        "state": "",
        "pincode": "",
    }
    
    append_row(filepath, "users", admin_doc)
    print(f"🎉 Admin user created!")
    print(f"   Email: {ADMIN_EMAIL}")
    print(f"   Password: {ADMIN_PASSWORD}")

if __name__ == "__main__":
    seed()
