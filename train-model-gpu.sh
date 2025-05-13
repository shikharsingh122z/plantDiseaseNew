#!/bin/bash

echo "🌱 PlantG - Enhanced Plant Disease Detection Model Training"
echo "=========================================================="

# Define paths
ROOT_DIR=$(pwd)
DATASET_PATH="$ROOT_DIR/dataset/PlantVillage"
BACKEND_DIR="$ROOT_DIR/Backend/core-backend"

# Function to check if command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check for CPU or GPU
if command_exists nvidia-smi; then
  echo "🖥️  GPU detected - will use GPU for training"
  USE_GPU=true
else
  echo "🖥️  No GPU detected - will use CPU for training (this will be slower)"
  USE_GPU=false
fi

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

# Install dependencies
echo "🔧 Installing dependencies..."
pip3 install -r requirements.txt

# Install additional dependencies needed for training with progress tracking
echo "🔧 Installing additional dependencies required for training..."
pip3 install seaborn scikit-learn matplotlib tqdm ipython

# Check if dataset exists in project root
if [ ! -d "$DATASET_PATH" ]; then
    echo "❌ Dataset not found at $DATASET_PATH"
    echo "   Please ensure the dataset is in the correct location."
    exit 1
else
    echo "✅ Dataset found at $DATASET_PATH"
    
    # Check dataset structure
    if [ ! -d "$DATASET_PATH/train" ] || [ ! -d "$DATASET_PATH/val" ]; then
        echo "❌ Dataset structure is incorrect. Expected 'train' and 'val' directories."
        exit 1
    fi
    
    # Count the number of classes and images
    NUM_CLASSES=$(find "$DATASET_PATH/train" -maxdepth 1 -type d | wc -l)
    NUM_CLASSES=$((NUM_CLASSES - 1))  # Subtract 1 to account for the parent directory
    
    TRAIN_IMAGES=$(find "$DATASET_PATH/train" -type f -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" | wc -l)
    VAL_IMAGES=$(find "$DATASET_PATH/val" -type f -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" | wc -l)
    
    echo "📊 Dataset statistics:"
    echo "   - Number of classes: $NUM_CLASSES"
    echo "   - Training images: $TRAIN_IMAGES"
    echo "   - Validation images: $VAL_IMAGES"
    
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

# Set the number of epochs based on hardware
if [ "$USE_GPU" = true ]; then
    export NUM_EPOCHS=20  # More epochs for GPU
else
    export NUM_EPOCHS=10  # Fewer epochs for CPU to save time
fi

# Train the model
echo "🚀 Starting model training process..."
echo "   Training with $NUM_EPOCHS epochs."
echo "   This may take several hours depending on your hardware."
echo "   The trained model will be saved in Backend/core-backend/models/"

# Try to create a more robust training process with better error handling
python3 -c "
import os
import sys
import time
import torch
from tqdm import tqdm

# Load the train_model module
sys.path.append('.')
import train_model

# Show GPU info if available
if torch.cuda.is_available():
    device_count = torch.cuda.device_count()
    print(f'GPU available: {device_count} device(s)')
    for i in range(device_count):
        print(f'  Device {i}: {torch.cuda.get_device_name(i)}')
else:
    print('No GPU available, using CPU')

# Update the number of epochs
train_model.NUM_EPOCHS = int(os.environ.get('NUM_EPOCHS', 20))
print(f'Training for {train_model.NUM_EPOCHS} epochs')

try:
    # Start timer
    start_time = time.time()
    
    # Train the model
    print('Starting training...')
    metrics = train_model.train_model()
    
    # Calculate training time
    elapsed_time = time.time() - start_time
    hours = int(elapsed_time // 3600)
    minutes = int((elapsed_time % 3600) // 60)
    seconds = int(elapsed_time % 60)
    
    print(f'Training completed in {hours}h {minutes}m {seconds}s')
    print(f'Final accuracy: {metrics[\"final_accuracy\"]*100:.2f}%')
    print(f'Model saved to: {metrics[\"model_path\"]}')
except Exception as e:
    print(f'Error during training: {e}')
    sys.exit(1)
"

# Check if training was successful
if [ $? -ne 0 ]; then
    echo "❌ Training failed. Please check the error messages above."
    exit 1
fi

# Return to root directory
cd $ROOT_DIR

echo "✅ Training process completed!"
echo "   Check Backend/core-backend/models/ for the trained model."
echo "   You can now run the application with the newly trained model using ./start-app.sh" 