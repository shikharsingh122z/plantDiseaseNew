import os
import jwt
import datetime
from functools import wraps
from flask import request, jsonify
from dotenv import load_dotenv
from database import db

# Load environment variables
load_dotenv()

# JWT settings
JWT_SECRET = os.getenv("JWT_SECRET", "plantg_secret_key_do_not_share")
JWT_EXPIRATION = 24 * 60 * 60  # 24 hours in seconds

def generate_token(user_id, email, name, role="user"):
    """Generate JWT token for authenticated user"""
    payload = {
        "sub": str(user_id),
        "email": email,
        "name": name,
        "role": role,
        "iat": datetime.datetime.utcnow(),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(seconds=JWT_EXPIRATION)
    }
    
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    return token

def token_required(f):
    """Decorator to protect routes that require authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from Authorization header
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({"error": "Authentication token is missing"}), 401
        
        try:
            # Verify token
            data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            
            # Get user from database
            current_user = db.get_user_by_id(data["sub"])
            
            if not current_user:
                return jsonify({"error": "User not found"}), 401
            
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        
        # Add user info to the kwargs
        kwargs["current_user"] = current_user
        return f(*args, **kwargs)
    
    return decorated

def admin_required(f):
    """Decorator to protect routes that require admin privileges"""
    @wraps(f)
    def decorated(*args, **kwargs):
        current_user = kwargs.get("current_user")
        
        if not current_user or current_user.get("role") != "admin":
            return jsonify({"error": "Admin privileges required"}), 403
        
        return f(*args, **kwargs)
    
    return decorated 