#!/bin/bash

# Kill any existing Flask server
echo "Stopping any running Flask server..."
pkill -f "python app.py" || true

# Make sure MongoDB is running
echo "Checking if MongoDB is running..."
mongod_running=$(ps aux | grep -v grep | grep mongod | wc -l)
if [ $mongod_running -eq 0 ]; then
    echo "MongoDB is not running. Starting MongoDB..."
    # Create the data directory if it doesn't exist
    mkdir -p ~/mongodb-data/db
    
    # Start MongoDB in the background
    mongod --dbpath ~/mongodb-data/db &
    
    # Wait for MongoDB to start
    echo "Waiting for MongoDB to start..."
    sleep 5
else
    echo "MongoDB is already running."
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate || { 
    echo "Error: Virtual environment not found. Creating one..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt 
}

# Ensure admin user exists in MongoDB
echo "Ensuring admin user exists in MongoDB..."
python create_admin.py

# Start the Flask server
echo "Starting server on http://localhost:5001"
python app.py 