import os
import torch
import json
from PIL import Image
from model import PlantDiseaseModel
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_model():
    """Test the model on a sample image"""
    # Create models directory if it doesn't exist
    os.makedirs('models', exist_ok=True)
    
    # Check if model exists
    model_path = os.path.join('models', 'inception_v3_direct.pth')
    if os.path.exists(model_path):
        logger.info(f"Found model at {model_path}")
    else:
        logger.error(f"Model not found at {model_path}")
    
    # Initialize model
    try:
        model = PlantDiseaseModel(model_path=model_path)
        logger.info("Model initialized successfully")
        
        # Find a sample image to test with
        sample_dirs = ['uploads', 'sample_images']
        test_image = None
        
        for directory in sample_dirs:
            if os.path.exists(directory):
                files = os.listdir(directory)
                image_files = [f for f in files if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
                if image_files:
                    test_image = os.path.join(directory, image_files[0])
                    break
        
        if not test_image:
            # Create a blank test image
            logger.info("Creating a blank test image")
            test_image = "test_image.jpg"
            Image.new('RGB', (299, 299), color='white').save(test_image)
        
        # Run prediction
        logger.info(f"Testing model with image: {test_image}")
        result = model.predict(test_image)
        
        # Log result
        logger.info(f"Prediction result: {json.dumps(result, indent=2)}")
        
        # Print the top 5 predictions
        logger.info("Top 5 predictions:")
        for i, pred in enumerate(result.get('top_predictions', [])[:5]):
            logger.info(f"{i+1}. {pred['disease']} - {pred['confidence']}%")
        
        return result
    except Exception as e:
        logger.error(f"Error testing model: {e}")
        return None

if __name__ == "__main__":
    logger.info("Testing plant disease model...")
    result = test_model()
    if result:
        logger.info("Model test completed successfully")
    else:
        logger.error("Model test failed") 