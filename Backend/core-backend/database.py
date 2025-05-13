import os
import pymongo
from pymongo import MongoClient
from dotenv import load_dotenv
import bcrypt
import datetime
import json
from bson import ObjectId

# Load environment variables
load_dotenv()

# MongoDB connection string
MONGODB_URI = os.getenv("MONGODB_URI")

# Custom JSON encoder to handle MongoDB ObjectId and dates
class MongoJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime.datetime):
            return obj.isoformat()
        return super(MongoJSONEncoder, self).default(obj)

class Database:
    def __init__(self):
        self.client = None
        self.db = None
        self.connect()
    
    def connect(self):
        """Connect to MongoDB"""
        try:
            # Only create a new connection if one doesn't exist
            if self.client is None:
                self.client = MongoClient(MONGODB_URI)
                self.db = self.client.get_database()
                print(f"Connected to MongoDB: {self.db.name}")
                
                # Create indexes for better performance
                self.db.users.create_index([("email", pymongo.ASCENDING)], unique=True)
                self.db.analyses.create_index([("user_id", pymongo.ASCENDING)])
                self.db.analyses.create_index([("created_at", pymongo.DESCENDING)])
            
            return True
        except Exception as e:
            print(f"Error connecting to MongoDB: {e}")
            return False
    
    def get_user_collection(self):
        """Get users collection"""
        return self.db.users
    
    def get_analyses_collection(self):
        """Get analyses collection"""
        return self.db.analyses
    
    # User operations
    def register_user(self, name, email, password):
        """Register a new user"""
        users = self.get_user_collection()
        
        # Check if user already exists
        if users.find_one({"email": email}):
            return None, "User with this email already exists"
        
        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Create user document
        user = {
            "name": name,
            "email": email,
            "password": hashed_password,
            "role": "user",
            "created_at": datetime.datetime.utcnow()
        }
        
        result = users.insert_one(user)
        
        # Create user object for response, converting ObjectId to string
        user_data = {
            "_id": str(result.inserted_id),
            "name": name,
            "email": email,
            "role": "user",
            "created_at": user["created_at"].isoformat()
        }
        
        return user_data, None
    
    def login_user(self, email, password):
        """Log in a user"""
        users = self.get_user_collection()
        user = users.find_one({"email": email})
        
        if not user:
            return None, "User not found"
        
        # Check password
        if bcrypt.checkpw(password.encode('utf-8'), user["password"]):
            # Convert ObjectId to string for JSON serialization
            user_data = {
                "_id": str(user["_id"]),
                "name": user["name"],
                "email": user["email"],
                "role": user["role"],
                "created_at": user["created_at"].isoformat() if "created_at" in user else None
            }
            return user_data, None
        else:
            return None, "Invalid password"
    
    def get_user_by_id(self, user_id):
        """Get user by ID"""
        users = self.get_user_collection()
        try:
            user = users.find_one({"_id": ObjectId(user_id)})
            if user:
                # Convert to serializable format
                user_data = {
                    "_id": str(user["_id"]),
                    "name": user["name"],
                    "email": user["email"],
                    "role": user["role"],
                    "created_at": user["created_at"].isoformat() if "created_at" in user else None
                }
                return user_data
            return None
        except:
            return None
    
    # Analysis operations
    def save_analysis(self, user_id, image_id, disease, confidence, top_predictions, symptoms, treatments, description):
        """Save analysis result"""
        analyses = self.get_analyses_collection()
        
        analysis = {
            "user_id": ObjectId(user_id),
            "image_id": image_id,
            "disease": disease,
            "confidence": confidence,
            "top_predictions": top_predictions,
            "symptoms": symptoms,
            "treatments": treatments,
            "description": description,
            "created_at": datetime.datetime.utcnow()
        }
        
        result = analyses.insert_one(analysis)
        analysis["_id"] = result.inserted_id
        return analysis
    
    def get_user_analyses(self, user_id, limit=10, skip=0):
        """Get analyses for a user"""
        analyses = self.get_analyses_collection()
        cursor = analyses.find({"user_id": ObjectId(user_id)}) \
                          .sort("created_at", pymongo.DESCENDING) \
                          .skip(skip) \
                          .limit(limit)
        
        return list(cursor)
    
    def get_analysis_by_id(self, analysis_id, user_id=None):
        """Get analysis by ID, optionally filtered by user_id for security"""
        analyses = self.get_analyses_collection()
        query = {"_id": ObjectId(analysis_id)}
        
        if user_id:
            query["user_id"] = ObjectId(user_id)
            
        return analyses.find_one(query)
    
    def delete_analysis(self, analysis_id, user_id):
        """Delete analysis by ID (only if it belongs to the user)"""
        analyses = self.get_analyses_collection()
        result = analyses.delete_one({
            "_id": ObjectId(analysis_id),
            "user_id": ObjectId(user_id)
        })
        return result.deleted_count > 0
    
    def get_statistics(self, user_id):
        """Get statistics for a user"""
        analyses = self.get_analyses_collection()
        
        # Total number of analyses
        total_analyses = analyses.count_documents({"user_id": ObjectId(user_id)})
        
        # Get unique diseases detected
        pipeline = [
            {"$match": {"user_id": ObjectId(user_id)}},
            {"$group": {"_id": "$disease"}},
            {"$count": "count"}
        ]
        unique_diseases_result = list(analyses.aggregate(pipeline))
        unique_diseases = unique_diseases_result[0]["count"] if unique_diseases_result else 0
        
        # Get most common disease
        pipeline = [
            {"$match": {"user_id": ObjectId(user_id)}},
            {"$group": {"_id": "$disease", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 1}
        ]
        most_common_result = list(analyses.aggregate(pipeline))
        most_common_disease = most_common_result[0]["_id"] if most_common_result else None
        
        return {
            "total_analyses": total_analyses,
            "unique_diseases": unique_diseases,
            "most_common_disease": most_common_disease
        }
    
    def close(self):
        """Close MongoDB connection"""
        # In a Flask application, it's better not to close the connection
        # after each request. Only close when shutting down the application.
        # This method is kept for compatibility but should rarely be used.
        if self.client:
            print("Warning: Closing MongoDB connection. This should only happen during application shutdown.")
            self.client.close()
            self.client = None
            self.db = None

# Create a global database instance
db = Database() 