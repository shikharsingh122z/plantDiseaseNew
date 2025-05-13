#!/bin/bash

echo "🌱 Starting PlantG Application..."

# Check if MongoDB is running
echo "📊 Checking MongoDB status..."
mongod_running=$(ps aux | grep -v grep | grep mongod | wc -l)
if [ $mongod_running -eq 0 ]; then
    echo "📊 MongoDB is not running. Starting MongoDB..."
    # Create the data directory if it doesn't exist
    mkdir -p ~/mongodb-data/db
    
    # Start MongoDB in the background
    mongod --dbpath ~/mongodb-data/db &
    
    # Wait for MongoDB to start
    echo "⏳ Waiting for MongoDB to start..."
    sleep 5
else
    echo "✅ MongoDB is already running."
fi

# Start backend in a new terminal
echo "🔧 Starting backend server..."
cd Backend/core-backend
if [ ! -d "venv" ]; then
    echo "🔧 Creating Python virtual environment..."
    python3 -m venv venv
fi

echo "🔧 Activating virtual environment..."
source venv/bin/activate

echo "🔧 Installing backend dependencies..."
pip install -r requirements.txt

echo "🔧 Ensuring admin user exists..."
python3 create_admin.py

# Kill any existing Flask server
echo "🔧 Stopping any running Flask server..."
pkill -f "python app.py" || true
pkill -f "python3 app.py" || true

# Start the Flask server in the background
echo "🚀 Starting backend server on http://localhost:5001"
python3 app.py &

# Start frontend in a new terminal
echo "🎨 Setting up frontend..."
cd ../../frontend

echo "🎨 Installing frontend dependencies..."
npm install

echo "🚀 Starting frontend server..."
npm run dev

echo "✅ PlantG application started!"
echo "📝 Login credentials:"
echo "   - Email: shikhar@plantg.com"
echo "   - Password: admin"
echo "🌐 Access the application at http://localhost:5173 (or alternative port if 5173 is in use)" 