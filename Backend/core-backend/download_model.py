import torch
import torch.nn as nn
import torchvision.models as models
import os
import requests
from tqdm import tqdm
import ssl
import platform
import sys

# Fix for macOS SSL certificate issues
if platform.system() == 'Darwin':
    print("Detected macOS. Applying SSL certificate fix.")
    ssl._create_default_https_context = ssl._create_unverified_context

def download_pretrained_model(save_dir='./models'):
    """
    Downloads a pretrained Inception V3 model and modifies it for plant disease detection.
    
    This script:
    1. Downloads the pretrained Inception V3 model from torchvision
    2. Modifies the final fully connected layer for plant disease classification (38 classes)
    3. Saves the model to disk
    """
    print("Setting up model directory...")
    os.makedirs(save_dir, exist_ok=True)
    model_path = os.path.join(save_dir, 'inception_v3_plant_disease.pth')
    
    # Don't download if model already exists
    if os.path.exists(model_path):
        print(f"Model already exists at {model_path}")
        return model_path
    
    print("Loading pretrained Inception V3 model...")
    try:
        model = models.inception_v3(weights=models.Inception_V3_Weights.IMAGENET1K_V1)
    except Exception as e:
        print(f"Error downloading pretrained model: {e}")
        print("\nCreating a fresh Inception V3 model without pretrained weights...")
        model = models.inception_v3(weights=None)
    
    # Modify the final layer for our plant disease classes
    num_classes = 38  # Total number of plant disease classes
    in_features = model.fc.in_features
    model.fc = nn.Linear(in_features, num_classes)
    
    # Initialize the new layer with weights near zero to start fine-tuning from the pretrained base
    nn.init.normal_(model.fc.weight, std=0.001)
    nn.init.constant_(model.fc.bias, 0)
    
    print("Saving model...")
    # Save the model in eval mode
    model.eval()
    torch.save(model.state_dict(), model_path)
    
    print(f"Model saved to {model_path}")
    return model_path
    
def download_sample_images(save_dir='./sample_images'):
    """
    Downloads sample plant disease images for testing
    """
    os.makedirs(save_dir, exist_ok=True)
    
    # Sample URLs of plant disease images
    sample_images = [
        {
            "url": "https://2.bp.blogspot.com/-dxdRgMQGbV0/XEDXm0GRtPI/AAAAAAAASZg/UDu7MwCl9UENJQmrqHxNVWsc5-yRHrqFQCLcBGAs/s640/apple-scab.jpg",
            "filename": "apple_scab.jpg"
        },
        {
            "url": "https://extension.umn.edu/sites/extension.umn.edu/files/styles/large/public/early%20blight.jpg?itok=wc_HdMRw",
            "filename": "tomato_early_blight.jpg"
        },
        {
            "url": "https://upload.wikimedia.org/wikipedia/commons/0/01/Potato_late_blight_3.jpg",
            "filename": "potato_late_blight.jpg"
        }
    ]
    
    print("Downloading sample images...")
    for image in sample_images:
        image_path = os.path.join(save_dir, image["filename"])
        
        if os.path.exists(image_path):
            print(f"Image {image['filename']} already exists")
            continue
        
        try:
            response = requests.get(image["url"], stream=True, verify=False)
            response.raise_for_status()
            
            total_size = int(response.headers.get('content-length', 0))
            with open(image_path, 'wb') as file:
                for data in tqdm(response.iter_content(chunk_size=1024), 
                                 total=total_size//1024, 
                                 unit='KB', 
                                 desc=image["filename"]):
                    file.write(data)
            
            print(f"Downloaded {image['filename']}")
        except Exception as e:
            print(f"Error downloading {image['filename']}: {e}")

if __name__ == "__main__":
    print("=== Preparing Plant Disease Detection Model ===")
    
    # Download and prepare the model
    model_path = download_pretrained_model()
    
    # Download sample images
    download_sample_images()
    
    print("\nModel and sample images prepared. You can now run the API with 'python app.py'") 