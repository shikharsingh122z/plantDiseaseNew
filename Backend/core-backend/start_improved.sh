#!/bin/bash

# Kill any existing Flask server
pkill -f "python app.py" || true

# Make sure MongoDB is running
mongod_running=$(ps aux | grep -v grep | grep mongod | wc -l)
if [ $mongod_running -eq 0 ]; then
    echo "MongoDB is not running. Please start MongoDB first."
    echo "Run: mongod --dbpath ~/mongodb-data/db &"
    exit 1
fi

# Activate virtual environment
source venv/bin/activate || { 
    echo "Error: Virtual environment not found. Creating one..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt 
}

# Create symlink to dataset if it doesn't exist
if [ ! -e "plant_disease_dataset" ]; then
    echo "Creating symlink to dataset..."
    ln -sf /Users/shikharpratapsingh/Desktop/Projects/plantG/dataset/PlantVillage plant_disease_dataset
fi

# Ensure admin user exists in MongoDB
echo "Ensuring admin user exists in MongoDB..."
python create_admin.py

# Start the Flask server
echo "Starting server on http://localhost:5001"
python app.py 