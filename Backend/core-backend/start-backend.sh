#!/bin/bash

# Activate virtual environment
source venv/bin/activate

# Install dependencies if needed
pip install -r requirements.txt

# Download model and sample images if they don't exist
python download_model.py

# Create an admin user if it doesn't exist
echo "Ensuring admin user exists in MongoDB..."
python -c "
from database import db
admin = db.get_user_collection().find_one({'email': 'shikhar@plantg.com'})
if not admin:
    import bcrypt
    hashed_pwd = bcrypt.hashpw('admin'.encode('utf-8'), bcrypt.gensalt())
    db.get_user_collection().insert_one({
        'name': 'Shikhar', 
        'email': 'shikhar@plantg.com', 
        'password': hashed_pwd,
        'role': 'admin'
    })
    print('Admin user created')
else:
    print('Admin user already exists')
"

# Start the Flask server on port 5001
echo "Starting server on http://localhost:5001"
python app.py 