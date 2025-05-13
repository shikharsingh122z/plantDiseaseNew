#!/usr/bin/env python3
import os
import sys
import zipfile
import shutil
from tqdm import tqdm
import requests
import subprocess

# Dataset paths
DATASET_DIR = "plant_disease_dataset"
KAGGLE_DATASET = "vipoooool/new-plant-diseases-dataset"  # This is a commonly used plant disease dataset on Kaggle

def check_kaggle_api():
    """Check if kaggle API is installed and configured"""
    try:
        import kaggle
        return True
    except ImportError:
        print("Kaggle API not found. Installing...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "kaggle"])
        return False

def check_kaggle_credentials():
    """Check if Kaggle credentials exist"""
    kaggle_dir = os.path.expanduser("~/.kaggle")
    kaggle_file = os.path.join(kaggle_dir, "kaggle.json")
    
    if not os.path.exists(kaggle_file):
        print("Kaggle API credentials not found at ~/.kaggle/kaggle.json")
        print("Please make sure you have a Kaggle account and API token.")
        print("1. Go to https://www.kaggle.com/<username>/account")
        print("2. Scroll down to API section and click 'Create New API Token'")
        print("3. Move the downloaded kaggle.json file to ~/.kaggle/kaggle.json")
        print("4. Run 'chmod 600 ~/.kaggle/kaggle.json' for appropriate permissions")
        return False
    
    return True

def download_from_kaggle():
    """Download the dataset from Kaggle"""
    try:
        import kaggle
        print(f"Downloading dataset {KAGGLE_DATASET}...")
        kaggle.api.dataset_download_files(KAGGLE_DATASET, path=".", unzip=True)
        
        # Find the downloaded directory
        download_dirs = [d for d in os.listdir(".") if os.path.isdir(d) and "plant" in d.lower() and "disease" in d.lower()]
        
        if download_dirs:
            src_dir = download_dirs[0]
            if os.path.exists(DATASET_DIR):
                shutil.rmtree(DATASET_DIR)
            shutil.move(src_dir, DATASET_DIR)
            print(f"Dataset moved to {DATASET_DIR}")
        else:
            print("Could not find the downloaded dataset directory.")
            return False
            
        return True
    except Exception as e:
        print(f"Error downloading from Kaggle: {e}")
        return False

def download_from_url():
    """Alternative download method using direct URL (if available)"""
    # This is a backup method in case Kaggle API doesn't work
    # You would need to host the dataset somewhere accessible
    
    print("Direct download not implemented. Please use Kaggle API.")
    return False

def validate_dataset():
    """Validate the downloaded dataset"""
    required_dirs = ["train", "val"]
    
    for d in required_dirs:
        path = os.path.join(DATASET_DIR, d)
        if not os.path.exists(path):
            print(f"Error: Required directory '{d}' not found in the dataset.")
            return False
    
    # Count classes and images
    train_dir = os.path.join(DATASET_DIR, "train")
    classes = [d for d in os.listdir(train_dir) if os.path.isdir(os.path.join(train_dir, d))]
    
    if not classes:
        print("Error: No class directories found in the training set.")
        return False
    
    total_images = 0
    for cls in classes:
        class_dir = os.path.join(train_dir, cls)
        images = [f for f in os.listdir(class_dir) if f.endswith(('.jpg', '.jpeg', '.png'))]
        total_images += len(images)
    
    print(f"Dataset validated successfully:")
    print(f"  - Number of classes: {len(classes)}")
    print(f"  - Total training images: {total_images}")
    return True

def main():
    """Main function to download and prepare the dataset"""
    print("=== Downloading Plant Disease Dataset ===")
    
    # Check if dataset already exists
    if os.path.exists(DATASET_DIR):
        print(f"Dataset directory '{DATASET_DIR}' already exists.")
        valid = validate_dataset()
        if valid:
            print("Dataset is valid. Skipping download.")
            return True
        else:
            print("Existing dataset is invalid. Removing and downloading again.")
            shutil.rmtree(DATASET_DIR)
    
    # Try downloading from Kaggle
    check_kaggle_api()
    if check_kaggle_credentials():
        success = download_from_kaggle()
    else:
        success = download_from_url()
    
    if success:
        valid = validate_dataset()
        if valid:
            print("Dataset downloaded and validated successfully.")
            return True
        else:
            print("Downloaded dataset failed validation.")
            return False
    else:
        print("Failed to download the dataset.")
        print("\nManual download instructions:")
        print("1. Go to https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset")
        print("2. Download and extract the dataset")
        print(f"3. Rename the extracted directory to {DATASET_DIR}")
        print("4. Ensure it has 'train' and 'val' subdirectories")
        return False

if __name__ == "__main__":
    main() 