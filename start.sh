#!/bin/bash

# Set terminal colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Trap Ctrl+C to ensure clean shutdown of all services
trap 'echo -e "${YELLOW}Stopping services...${NC}"; [[ -n $BACKEND_PID ]] && kill $BACKEND_PID; [[ -n $FRONTEND_PID ]] && kill $FRONTEND_PID; pkill -f "mongod"; echo -e "${GREEN}All services stopped.${NC}"; exit 0' INT

echo -e "${GREEN}🌱 Starting PlantG Application...${NC}"
echo -e "${BLUE}======================================${NC}"

# Check if MongoDB is running
echo -e "${YELLOW}📊 Checking MongoDB status...${NC}"
mongod_running=$(ps aux | grep -v grep | grep mongod | wc -l)
if [ $mongod_running -eq 0 ]; then
    echo -e "${YELLOW}📊 MongoDB is not running. Starting MongoDB...${NC}"
    # Create the data directory if it doesn't exist
    mkdir -p ~/mongodb-data/db
    
    # Start MongoDB in the background
    mongod --dbpath ~/mongodb-data/db &
    
    # Wait for MongoDB to start
    echo -e "${YELLOW}⏳ Waiting for MongoDB to start...${NC}"
    sleep 5
else
    echo -e "${GREEN}✅ MongoDB is already running.${NC}"
fi

# Setup and start backend server
echo -e "${YELLOW}🔧 Setting up backend server...${NC}"

# Navigate to the backend directory
cd "$(dirname "$0")/Backend/core-backend" || {
    echo -e "\033[0;31mError: Backend directory not found!${NC}"
    exit 1
}

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}🔧 Creating Python virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate the virtual environment
echo -e "${YELLOW}🔧 Activating virtual environment...${NC}"
source venv/bin/activate || {
    echo -e "\033[0;31mError: Failed to activate virtual environment${NC}"
    exit 1
}

# Install required packages
echo -e "${YELLOW}🔧 Installing backend dependencies...${NC}"
pip install -r requirements.txt

# Create symlink to dataset if it doesn't exist
if [ ! -e "plant_disease_dataset" ]; then
    echo -e "${YELLOW}🔧 Creating symlink to dataset...${NC}"
    DATASET_PATH="$(dirname "$0")/dataset/PlantVillage"
    if [ -d "$DATASET_PATH" ]; then
        ln -sf "$DATASET_PATH" plant_disease_dataset
    else
        echo -e "\033[0;33mWarning: Dataset directory not found at $DATASET_PATH${NC}"
    fi
fi

# Ensure admin user exists
echo -e "${YELLOW}🔧 Ensuring admin user exists...${NC}"
python3 create_admin.py

# Kill any existing Flask server
echo -e "${YELLOW}🔧 Stopping any running Flask server...${NC}"
pkill -f "python app.py" || true
pkill -f "python3 app.py" || true

# Start the Flask server in the background
echo -e "${GREEN}🚀 Starting backend server on http://localhost:5001${NC}"
python3 app.py &
BACKEND_PID=$!

# Store the current directory to return to after setting up frontend
CURRENT_DIR=$(pwd)

# Navigate to frontend directory and start frontend
echo -e "${YELLOW}🎨 Setting up frontend...${NC}"
cd "$(dirname "$0")/frontend" || {
    # Try absolute path if relative path fails
    cd /Users/shikharpratapsingh/Desktop/Projects/plantG/frontend || {
        echo -e "\033[0;31mError: Frontend directory not found!${NC}"
        kill $BACKEND_PID
        exit 1
    }
}

# Install frontend dependencies
echo -e "${YELLOW}🎨 Installing frontend dependencies...${NC}"
npm install

# Start the frontend development server
echo -e "${GREEN}🚀 Starting frontend server...${NC}"
npm run dev &
FRONTEND_PID=$!

# Return to the original directory
cd "$CURRENT_DIR"

# Deactivate the virtual environment
deactivate

echo -e "${GREEN}✅ PlantG application started!${NC}"
echo -e "${BLUE}======================================${NC}"
echo -e "${YELLOW}📝 Login credentials:${NC}"
echo -e "${YELLOW}   - Email: shikhar@plantg.com${NC}"
echo -e "${YELLOW}   - Password: admin${NC}"
echo -e "${YELLOW}🌐 Access the application at:${NC}"
echo -e "${YELLOW}   - Frontend: http://localhost:5173${NC}"
echo -e "${YELLOW}   - Backend API: http://localhost:5001${NC}"
echo -e "${BLUE}======================================${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"

# Wait for user to press Ctrl+C
wait $BACKEND_PID $FRONTEND_PID 