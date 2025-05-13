from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
import json
from werkzeug.utils import secure_filename
import torch
import ssl
import platform
from dotenv import load_dotenv
from model import PlantDiseaseModel
from database import db, MongoJSONEncoder
from auth import generate_token, token_required, admin_required

# Load environment variables
load_dotenv()

# Fix for macOS SSL certificate issues
if platform.system() == 'Darwin':
    ssl._create_default_https_context = ssl._create_unverified_context

app = Flask(__name__)
app.json_encoder = MongoJSONEncoder  # Use custom JSON encoder for MongoDB

# Configure CORS to be permissive during development
CORS(app, origins=["*"], supports_credentials=True, allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize model with error handling
try:
    # Try to load the model with pretrained weights
    model_path = os.getenv("MODEL_PATH", os.path.join('models', 'inception_v3_plant_disease.pth'))
    if os.path.exists(model_path):
        model = PlantDiseaseModel(model_path=model_path)
        print(f"Loaded model from {model_path}")
    else:
        model = PlantDiseaseModel()
        print("Initialized model without pretrained weights")
except Exception as e:
    print(f"Error initializing model: {e}")
    print("Initializing model without pretrained weights...")
    model = PlantDiseaseModel()

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    """API health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'Plant disease detection API is running'
    })

# Authentication endpoints
@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({'error': 'Name, email and password are required'}), 400
    
    # Register user
    user, error = db.register_user(data['name'], data['email'], data['password'])
    
    if error:
        return jsonify({'error': error}), 400
    
    # Generate JWT token
    token = generate_token(user['_id'], user['email'], user['name'], user['role'])
    
    return jsonify({
        'token': token,
        'user': user
    })

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login a user"""
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400
    
    # Login user
    user, error = db.login_user(data['email'], data['password'])
    
    if error:
        return jsonify({'error': error}), 401
    
    # Generate JWT token
    token = generate_token(user['_id'], user['email'], user['name'], user['role'])
    
    return jsonify({
        'token': token,
        'user': user
    })

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_user_profile(current_user):
    """Get current user profile"""
    return jsonify(current_user)

# Disease detection endpoint
@app.route('/api/detect', methods=['POST'])
def detect_disease():
    """Public endpoint for plant disease detection without authentication"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        # Generate a unique filename
        filename = str(uuid.uuid4()) + os.path.splitext(secure_filename(file.filename))[1]
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Save the file
        file.save(file_path)
        
        try:
            # Run prediction
            result = model.predict(file_path)
            
            # Add metadata
            result['image_id'] = filename
            
            # Add treatment and description based on disease
            info = get_disease_info(result['disease'])
            result.update(info)
            
            return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            # Optionally clean up the file after prediction
            # os.remove(file_path)
            pass
    
    return jsonify({'error': 'Invalid file format. Allowed formats: png, jpg, jpeg'}), 400

@app.route('/api/user/detect', methods=['POST'])
@token_required
def detect_disease_authenticated(current_user):
    """Authenticated endpoint for plant disease detection"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        # Generate a unique filename
        filename = str(uuid.uuid4()) + os.path.splitext(secure_filename(file.filename))[1]
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Save the file
        file.save(file_path)
        
        try:
            # Run prediction
            result = model.predict(file_path)
            
            # Add metadata
            result['image_id'] = filename
            
            # Add treatment and description based on disease
            info = get_disease_info(result['disease'])
            
            # Save to database
            analysis = db.save_analysis(
                current_user['_id'],
                filename,
                result['disease'],
                result['confidence'],
                result['top_predictions'],
                info['symptoms'],
                info['treatments'],
                info['description']
            )
            
            # Add disease info to result
            result.update(info)
            result['_id'] = analysis['_id']
            
            return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            # Optionally clean up the file after prediction
            # os.remove(file_path)
            pass
    
    return jsonify({'error': 'Invalid file format. Allowed formats: png, jpg, jpeg'}), 400

# History endpoints
@app.route('/api/user/analyses', methods=['GET'])
@token_required
def get_user_analyses(current_user):
    """Get all analyses for the authenticated user"""
    limit = int(request.args.get('limit', 10))
    skip = int(request.args.get('skip', 0))
    
    analyses = db.get_user_analyses(current_user['_id'], limit, skip)
    
    return jsonify(analyses)

@app.route('/api/user/analyses/<analysis_id>', methods=['GET'])
@token_required
def get_analysis(current_user, analysis_id):
    """Get a specific analysis"""
    analysis = db.get_analysis_by_id(analysis_id, current_user['_id'])
    
    if not analysis:
        return jsonify({'error': 'Analysis not found'}), 404
    
    return jsonify(analysis)

@app.route('/api/user/analyses/<analysis_id>', methods=['DELETE'])
@token_required
def delete_analysis(current_user, analysis_id):
    """Delete a specific analysis"""
    success = db.delete_analysis(analysis_id, current_user['_id'])
    
    if not success:
        return jsonify({'error': 'Analysis not found or you do not have permission to delete it'}), 404
    
    return jsonify({'message': 'Analysis deleted successfully'})

@app.route('/api/user/statistics', methods=['GET'])
@token_required
def get_user_statistics(current_user):
    """Get statistics for the authenticated user"""
    statistics = db.get_statistics(current_user['_id'])
    return jsonify(statistics)

# Admin endpoints
@app.route('/api/admin/users', methods=['GET'])
@token_required
@admin_required
def get_all_users(current_user):
    """Admin endpoint to get all users"""
    users = list(db.get_user_collection().find({}, {'password': 0}))
    return jsonify(users)

# Disease info helper
def get_disease_info(disease_name):
    """Get additional information about the disease"""
    # This would ideally come from a database
    # For now, we're providing sample data for a few diseases
    disease_info = {
        "Apple___Apple_scab": {
            "description": "Apple scab is a fungal disease caused by Venturia inaequalis that affects apple trees, causing dark, scabby lesions on leaves and fruit.",
            "symptoms": [
                "Dark, olive-green spots on leaves",
                "Dark, scab-like lesions on fruit",
                "Severely infected leaves may turn yellow and drop early",
                "Misshapen fruit if infected when young"
            ],
            "treatments": [
                "Remove and destroy fallen leaves and infected fruit",
                "Prune trees to improve air circulation",
                "Apply fungicides early in the growing season",
                "Plant scab-resistant apple varieties",
                "Apply protective fungicide before rainy periods"
            ]
        },
        "Tomato___Late_blight": {
            "description": "Late blight is a devastating disease caused by the fungus-like oomycete pathogen Phytophthora infestans. It can rapidly destroy tomato plants, especially in cool, wet conditions.",
            "symptoms": [
                "Dark, water-soaked spots on leaves",
                "White, fuzzy growth on the undersides of leaves",
                "Brown lesions on stems",
                "Firm, dark, greasy-looking spots on fruits"
            ],
            "treatments": [
                "Remove and destroy affected plant parts",
                "Apply copper-based fungicide as a preventative measure",
                "Ensure good air circulation around plants",
                "Water at the base of plants, avoiding wet foliage",
                "Rotate crops yearly"
            ]
        },
        "Tomato___Early_blight": {
            "description": "Early blight is a common fungal disease caused by Alternaria solani. It typically affects older leaves first and can spread to stems and fruit.",
            "symptoms": [
                "Brown to black spots with concentric rings",
                "Yellowing around the spots",
                "Spots may merge, causing leaves to die",
                "Dark lesions on stems",
                "Dark, sunken spots on fruit"
            ],
            "treatments": [
                "Remove infected leaves promptly",
                "Apply fungicides labeled for early blight",
                "Mulch around plants to prevent spores from splashing",
                "Rotate crops every 3-4 years",
                "Ensure adequate plant spacing for airflow"
            ]
        }
    }
    
    # Return default info if the specific disease info is not available
    if disease_name not in disease_info:
        return {
            "description": "Information about this plant disease is being updated.",
            "symptoms": [],
            "treatments": ["Consult a local agricultural extension service for specific treatment options."]
        }
    
    return disease_info[disease_name]

@app.route('/api/diseases', methods=['GET'])
def get_diseases():
    """Get the list of detectable diseases"""
    return jsonify({
        'diseases': list(model.class_labels.values())
    })

# Commenting out the teardown handler that's causing the connection issues
# @app.teardown_appcontext
# def shutdown_session(exception=None):
#     db.close()

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5001))
    app.run(host='0.0.0.0', port=port, debug=True) 