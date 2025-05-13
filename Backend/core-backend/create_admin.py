#!/usr/bin/env python3
from pymongo import MongoClient
import bcrypt
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB connection string
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/plantg")

def create_admin_user():
    """Create admin user if it doesn't exist"""
    print("Connecting to MongoDB...")
    client = MongoClient(MONGODB_URI)
    db = client.get_database()
    
    print(f"Connected to database: {db.name}")
    
    # Check if users collection exists
    if "users" not in db.list_collection_names():
        print("Creating users collection...")
        db.create_collection("users")
    
    # Check if admin user exists
    users = db.users
    admin = users.find_one({"email": "shikhar@plantg.com"})
    
    if not admin:
        print("Admin user not found. Creating...")
        hashed_pwd = bcrypt.hashpw("admin".encode('utf-8'), bcrypt.gensalt())
        
        user = {
            "name": "Shikhar", 
            "email": "shikhar@plantg.com", 
            "password": hashed_pwd,
            "role": "admin"
        }
        
        result = users.insert_one(user)
        print(f"Admin user created with ID: {result.inserted_id}")
    else:
        print("Admin user already exists")
    
    # Print all users for debugging
    print("\nAll users in database:")
    for user in users.find({}, {"password": 0}):
        print(f" - {user['name']} ({user['email']}): {user['role']}")
    
    client.close()
    print("Database connection closed")

if __name__ == "__main__":
    print("=== Creating Admin User ===")
    create_admin_user() 