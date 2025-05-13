#!/bin/bash

# Start MongoDB if not running
mongod_running=$(ps aux | grep -v grep | grep mongod | wc -l)
if [ $mongod_running -eq 0 ]; then
    echo "Starting MongoDB..."
    mongod --dbpath ~/mongodb-data/db &
    sleep 2  # Give MongoDB time to start
fi

# Start the backend
echo "Starting backend..."
cd Backend/core-backend
./start_improved.sh &
sleep 3  # Give backend time to start

# Start the frontend
echo "Starting frontend..."
cd ../../frontend
npm run dev &

echo ""
echo "=== PlantG Application Started ==="
echo "Backend: http://localhost:5001"
echo "Frontend: http://localhost:5173"
echo ""
echo "Admin credentials:"
echo "  Email: shikhar@plantg.com"
echo "  Password: admin"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to press Ctrl+C
wait 