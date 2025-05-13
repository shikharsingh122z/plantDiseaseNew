#!/bin/bash

echo "🌱 PlantG - Simple Plant Disease Detection Model Training"
echo "========================================================"

# Define paths
ROOT_DIR=$(pwd)
DATASET_PATH="$ROOT_DIR/dataset/PlantVillage"
BACKEND_DIR="$ROOT_DIR/Backend/core-backend"

# Navigate to the backend directory
cd $BACKEND_DIR

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install seaborn if not already installed
pip3 install seaborn

# Create a symlink to the dataset if it doesn't exist
if [ ! -L "plant_disease_dataset" ]; then
    echo "🔗 Creating symlink to dataset..."
    ln -sf "$DATASET_PATH" plant_disease_dataset
    echo "✅ Symlink created: plant_disease_dataset -> $DATASET_PATH"
else
    echo "✅ Symlink already exists."
fi

# Create models directory if it doesn't exist
if [ ! -d "models" ]; then
    echo "📂 Creating models directory..."
    mkdir -p models
fi

# Start training
echo "🚀 Starting model training process..."
echo "   This will take several hours on CPU. Consider running overnight."
echo "   The trained model will be saved in Backend/core-backend/models/"

# Run the training script
python3 train_model.py

# Return to root directory
cd $ROOT_DIR

echo "✅ Training process completed!"
echo "   Check Backend/core-backend/models/ for the trained model."
echo "   You can now run the application with the newly trained model using ./start-app.sh" 