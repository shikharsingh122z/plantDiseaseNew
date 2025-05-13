#!/bin/bash

# Dead simple training script
echo "🌱 Starting training..."

# Go to backend directory
cd Backend/core-backend

# Activate virtual environment
source venv/bin/activate

# Create symlink to dataset
ln -sf ../../dataset/PlantVillage plant_disease_dataset

# Create models directory
mkdir -p models

# Install required packages (in case they're missing)
pip3 install seaborn matplotlib scikit-learn tqdm

# Run training script directly
python3 train_model.py

echo "✅ Training completed." 