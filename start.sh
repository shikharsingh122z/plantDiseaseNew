#!/bin/bash

# Set terminal colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Elasticsearch credentials
ES_USERNAME="elastic"
ES_PASSWORD="zL6VBo2q3SRYIsnS8PMu"

# MongoDB settings
MONGODB_DB="plantg"

# Trap Ctrl+C to ensure clean shutdown of all services
trap 'echo -e "${YELLOW}Stopping services...${NC}"; cleanup; exit 0' INT

# Function to cleanup services
cleanup() {
    echo -e "${YELLOW}Stopping all services...${NC}"
    
    if [[ -n $BACKEND_PID ]]; then
        echo -e "${YELLOW}Stopping backend server...${NC}"
        kill $BACKEND_PID 2>/dev/null || true
    fi
    
    if [[ -n $FRONTEND_PID ]]; then
        echo -e "${YELLOW}Stopping frontend server...${NC}"
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    
    if [[ $ELASTICSEARCH_STARTED -eq 1 ]]; then
        echo -e "${YELLOW}Stopping Elasticsearch...${NC}"
        kill $(pgrep -f elasticsearch) 2>/dev/null || true
    fi
    
    if [[ $KIBANA_STARTED -eq 1 ]]; then
        echo -e "${YELLOW}Stopping Kibana...${NC}"
        kill $(pgrep -f kibana) 2>/dev/null || true
    fi
    
    if [[ $MONGO_STARTED -eq 1 ]]; then
        echo -e "${YELLOW}Stopping MongoDB...${NC}"
        pkill -f "mongod" 2>/dev/null || true
    fi
    
    echo -e "${GREEN}All services stopped.${NC}"
}

# Initialize variables
ELASTICSEARCH_STARTED=0
KIBANA_STARTED=0
MONGO_STARTED=0

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
    MONGO_STARTED=1
    echo -e "${GREEN}✅ MongoDB started successfully.${NC}"
else
    echo -e "${GREEN}✅ MongoDB is already running.${NC}"
fi

# Check if Elasticsearch is running
echo -e "${YELLOW}🔍 Checking Elasticsearch status...${NC}"
ES_RUNNING=0
if curl -s -k -u "${ES_USERNAME}:${ES_PASSWORD}" https://localhost:9200 >/dev/null 2>&1; then
    ES_RUNNING=1
fi

if [ $ES_RUNNING -eq 0 ]; then
    echo -e "${YELLOW}🔍 Elasticsearch is not running. Starting Elasticsearch...${NC}"
    
    # Check if Elasticsearch is installed
    if ! command -v elasticsearch &> /dev/null; then
        echo -e "${RED}❌ Elasticsearch is not installed. Please install Elasticsearch and try again.${NC}"
        echo -e "${YELLOW}You can install it using Homebrew with: brew install elastic/tap/elasticsearch-full${NC}"
        exit 1
    fi
    
    # Start Elasticsearch in the background
    elasticsearch &
    
    # Wait for Elasticsearch to start
    echo -e "${YELLOW}⏳ Waiting for Elasticsearch to start...${NC}"
    for i in {1..30}; do
        if curl -s -k -u "${ES_USERNAME}:${ES_PASSWORD}" https://localhost:9200 >/dev/null 2>&1; then
            ELASTICSEARCH_STARTED=1
            echo -e "${GREEN}✅ Elasticsearch started successfully.${NC}"
            break
        fi
        echo -n "."
        sleep 2
    done
    
    if [ $ELASTICSEARCH_STARTED -eq 0 ]; then
        echo -e "${RED}❌ Failed to start Elasticsearch. Please check logs.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Elasticsearch is already running.${NC}"
fi

# Check if Kibana is running
echo -e "${YELLOW}📊 Checking Kibana status...${NC}"
KIBANA_RUNNING=0
if curl -s http://localhost:5601 >/dev/null 2>&1; then
    KIBANA_RUNNING=1
fi

if [ $KIBANA_RUNNING -eq 0 ]; then
    echo -e "${YELLOW}📊 Kibana is not running. Starting Kibana...${NC}"
    
    # Check if Kibana is installed
    if ! command -v kibana &> /dev/null; then
        echo -e "${RED}❌ Kibana is not installed. Please install Kibana and try again.${NC}"
        echo -e "${YELLOW}You can install it using Homebrew with: brew install elastic/tap/kibana-full${NC}"
        exit 1
    fi
    
    # Create Kibana config file with ES credentials
    KIBANA_CONFIG_DIR="$HOME/.kibana"
    mkdir -p "$KIBANA_CONFIG_DIR"
    cat > "$KIBANA_CONFIG_DIR/kibana.yml" << EOF
elasticsearch.hosts: ["https://localhost:9200"]
elasticsearch.username: "${ES_USERNAME}"
elasticsearch.password: "${ES_PASSWORD}"
elasticsearch.ssl.verificationMode: none
EOF
    
    # Start Kibana in the background with the config
    kibana --config "$KIBANA_CONFIG_DIR/kibana.yml" &
    
    # Wait for Kibana to start
    echo -e "${YELLOW}⏳ Waiting for Kibana to start...${NC}"
    for i in {1..30}; do
        if curl -s http://localhost:5601 >/dev/null 2>&1; then
            KIBANA_STARTED=1
            echo -e "${GREEN}✅ Kibana started successfully.${NC}"
            break
        fi
        echo -n "."
        sleep 2
    done
    
    if [ $KIBANA_STARTED -eq 0 ]; then
        echo -e "${RED}❌ Failed to start Kibana. Please check logs.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Kibana is already running.${NC}"
fi

# Setup Kibana index pattern for PlantDisease if not already created
echo -e "${YELLOW}🔧 Setting up Kibana PlantDisease index pattern...${NC}"
curl -X POST "http://localhost:5601/api/index_patterns/index_pattern" \
  -H 'kbn-xsrf: true' \
  -H 'Content-Type: application/json' \
  -d '{
    "index_pattern": {
      "title": "plantdisease*",
      "timeFieldName": "timestamp"
    }
  }' || echo -e "${YELLOW}⚠️ Could not create Kibana index pattern, might already exist or Kibana not ready.${NC}"

# Setup and start backend server
echo -e "${YELLOW}🔧 Setting up backend server...${NC}"

# Navigate to the backend directory
cd "$(dirname "$0")/Backend/core-backend" || {
    echo -e "${RED}❌ Error: Backend directory not found!${NC}"
    cleanup
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
    echo -e "${RED}❌ Error: Failed to activate virtual environment${NC}"
    cleanup
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
        echo -e "${YELLOW}⚠️ Warning: Dataset directory not found at $DATASET_PATH${NC}"
    fi
fi

# Create .env file with Elasticsearch credentials
echo -e "${YELLOW}🔧 Creating .env file with Elasticsearch credentials...${NC}"
cat > .env << EOF
ES_HOST=localhost
ES_PORT=9200
ES_USERNAME=${ES_USERNAME}
ES_PASSWORD=${ES_PASSWORD}
MONGODB_DB=${MONGODB_DB}
MODEL_PATH=models/inception_v3_direct.pth
EOF

# Ensure admin user exists by running our script
echo -e "${YELLOW}🔧 Ensuring superusers exist...${NC}"
python create_superuser.py

# Kill any existing Flask server
echo -e "${YELLOW}🔧 Stopping any running Flask server...${NC}"
pkill -f "python app.py" || true
pkill -f "python3 app.py" || true

# Create directory for logs
mkdir -p logs

# Start the Flask server in the background
echo -e "${GREEN}🚀 Starting backend server on http://localhost:5001${NC}"
python app.py &
BACKEND_PID=$!

# Store the current directory to return to after setting up frontend
CURRENT_DIR=$(pwd)

# Navigate to frontend directory and start frontend
echo -e "${YELLOW}🎨 Setting up frontend...${NC}"
cd "$(dirname "$0")/frontend" || {
    # Try absolute path if relative path fails
    cd /Users/shikharpratapsingh/Desktop/Projects/plantG/frontend || {
        echo -e "${RED}❌ Error: Frontend directory not found!${NC}"
        kill $BACKEND_PID
        cleanup
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
echo -e "${YELLOW}   - Email: admin@plantg.com or shikhar@plantg.com${NC}"
echo -e "${YELLOW}   - Password: admin${NC}"
echo -e "${YELLOW}🌐 Access the application at:${NC}"
echo -e "${YELLOW}   - Frontend: http://localhost:5173${NC}"
echo -e "${YELLOW}   - Backend API: http://localhost:5001${NC}"
echo -e "${YELLOW}   - Kibana (Logging): http://localhost:5601${NC}"
echo -e "${BLUE}======================================${NC}"
echo -e "${YELLOW}PlantDisease index is configured in Kibana for logs${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"

# Wait for user to press Ctrl+C
wait $BACKEND_PID $FRONTEND_PID 