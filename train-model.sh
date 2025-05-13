#!/bin/bash

echo "🌱 PlantG - Training Plant Disease Detection Model"
echo "=================================================="

# Define paths
ROOT_DIR=$(pwd)
DATASET_PATH="$ROOT_DIR/dataset/PlantVillage"
BACKEND_DIR="$ROOT_DIR/Backend/core-backend"

# Navigate to the backend directory
cd $BACKEND_DIR

# Check if Python virtual environment exists
if [ ! -d "venv" ]; then
    echo "🔧 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies if needed
echo "🔧 Checking and installing dependencies..."
pip3 install -r requirements.txt

# Install additional dependencies needed for training
echo "🔧 Installing additional dependencies required for training..."
pip3 install seaborn scikit-learn matplotlib tqdm

# Check if dataset exists in project root
if [ ! -d "$DATASET_PATH" ]; then
    echo "❌ Dataset not found at $DATASET_PATH"
    echo "   Please ensure the dataset is in the correct location."
    exit 1
else
    echo "✅ Dataset found at $DATASET_PATH"
    
    # Create a symlink to the dataset if it doesn't exist
    if [ ! -L "plant_disease_dataset" ]; then
        echo "🔗 Creating symlink to dataset..."
        ln -sf "$DATASET_PATH" plant_disease_dataset
        echo "✅ Symlink created: plant_disease_dataset -> $DATASET_PATH"
    else
        echo "✅ Symlink already exists."
    fi
fi

# Create models directory if it doesn't exist
if [ ! -d "models" ]; then
    echo "📂 Creating models directory..."
    mkdir -p models
fi

# Set environment variable for the dataset path
export KAGGLE_DATASET_PATH="plant_disease_dataset"

# Train the model
echo "🚀 Starting model training process..."
echo "   This may take several hours depending on your hardware."
echo "   The trained model will be saved in Backend/core-backend/models/"
python3 train_model.py

# Return to root directory
cd $ROOT_DIR

echo "✅ Training process completed!"
echo "   Check Backend/core-backend/models/ for the trained model."
echo "   You can now run the application with the newly trained model using ./start-app.sh" 