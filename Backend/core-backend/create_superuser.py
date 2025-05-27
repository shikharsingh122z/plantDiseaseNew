import sys
from database import db
import bcrypt
from pymongo.errors import DuplicateKeyError

def create_superuser(name, email, password, role="admin"):
    """Create a superuser"""
    try:
        users = db.get_user_collection()
        
        # Check if user already exists and delete if it does (for recreation)
        existing_user = users.find_one({"email": email})
        if existing_user:
            users.delete_one({"email": email})
            print(f"Deleted existing user with email: {email}")
        
        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Create user document
        user = {
            "name": name,
            "email": email,
            "password": hashed_password,
            "role": role
        }
        
        result = users.insert_one(user)
        print(f"Superuser created: {name} ({email}) with role: {role}")
        return True
    except DuplicateKeyError:
        print(f"Error: User with email {email} already exists")
        return False
    except Exception as e:
        print(f"Error creating superuser: {e}")
        return False

if __name__ == "__main__":
    print("Creating superuser...")
    create_superuser("Admin", "admin@plantg.com", "admin")
    create_superuser("Shikhar", "shikhar@plantg.com", "admin")
    
    # List all users
    users = db.get_user_collection()
    print("\nAll users in database:")
    for user in users.find():
        print(f" - {user['name']} ({user['email']}): {user['role']}") 