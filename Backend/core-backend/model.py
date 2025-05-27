import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import os
import json
import platform
import ssl
import logging

# Fix for macOS SSL certificate issues
if platform.system() == 'Darwin':
    ssl._create_default_https_context = ssl._create_unverified_context

# Set up basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PlantDiseaseModel:
    def __init__(self, model_path=None, num_classes=38):
        # Initialize model path if not provided
        if model_path is None:
            model_path = os.path.join('models', 'inception_v3_direct.pth')
        
        logger.info(f"Initializing model with path: {model_path}")
        
        # Check if model file exists
        if os.path.exists(model_path):
            logger.info(f"Model file found at: {model_path}")
        else:
            logger.warning(f"Model file NOT found at: {model_path}")
            # Try alternative paths
            alt_paths = [
                os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models', 'inception_v3_direct.pth'),
                os.path.join(os.getcwd(), 'models', 'inception_v3_direct.pth')
            ]
            for alt_path in alt_paths:
                if os.path.exists(alt_path):
                    model_path = alt_path
                    logger.info(f"Found model at alternative path: {model_path}")
                    break
        
        # Initialize the model with Inception V3 architecture
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        logger.info(f"Using device: {self.device}")
        
        # Initialize the model
        try:
            logger.info("Loading Inception V3 model...")
            self.model = models.inception_v3(weights=None)
            logger.info("Inception V3 model loaded without pretrained weights")
            
            # Modify the final layer to match our number of plant disease classes
            in_features = self.model.fc.in_features
            self.model.fc = nn.Linear(in_features, num_classes)
            logger.info(f"Final layer modified to output {num_classes} classes")
            
            # Load pre-trained weights if provided
            if os.path.exists(model_path):
                logger.info(f"Loading weights from {model_path}...")
                state_dict = torch.load(model_path, map_location=self.device)
                self.model.load_state_dict(state_dict)
                logger.info(f"Successfully loaded weights from {model_path}")
            else:
                logger.warning(f"Model file not found at {model_path}, using untrained model")
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            # Fallback to ImageNet pretrained model
            try:
                logger.info("Falling back to ImageNet pretrained model...")
                self.model = models.inception_v3(weights=models.Inception_V3_Weights.IMAGENET1K_V1)
                in_features = self.model.fc.in_features
                self.model.fc = nn.Linear(in_features, num_classes)
                logger.info("Using ImageNet pretrained model")
            except Exception as e2:
                logger.error(f"Error loading ImageNet model: {e2}")
                logger.info("Initializing model without pretrained weights")
                self.model = models.inception_v3(weights=None)
                in_features = self.model.fc.in_features
                self.model.fc = nn.Linear(in_features, num_classes)
        
        self.model = self.model.to(self.device)
        self.model.eval()  # Set to evaluation mode
        
        # Define image transformations
        self.transform = transforms.Compose([
            transforms.Resize((299, 299)),  # Inception V3 requires 299x299 input
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        
        # Load class labels
        self.class_labels = self._load_class_labels()

    def _load_class_labels(self):
        # Example classes - replace with your actual plant disease classes
        labels = {
            0: "Apple___Apple_scab",
            1: "Apple___Black_rot",
            2: "Apple___Cedar_apple_rust",
            3: "Apple___healthy",
            4: "Blueberry___healthy",
            5: "Cherry___healthy",
            6: "Cherry___Powdery_mildew",
            7: "Corn___Cercospora_leaf_spot Gray_leaf_spot",
            8: "Corn___Common_rust",
            9: "Corn___healthy",
            10: "Corn___Northern_Leaf_Blight",
            11: "Grape___Black_rot",
            12: "Grape___Esca_(Black_Measles)",
            13: "Grape___healthy",
            14: "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
            15: "Orange___Haunglongbing_(Citrus_greening)",
            16: "Peach___Bacterial_spot",
            17: "Peach___healthy",
            18: "Pepper,_bell___Bacterial_spot",
            19: "Pepper,_bell___healthy",
            20: "Potato___Early_blight",
            21: "Potato___healthy",
            22: "Potato___Late_blight",
            23: "Raspberry___healthy",
            24: "Soybean___healthy",
            25: "Squash___Powdery_mildew",
            26: "Strawberry___healthy",
            27: "Strawberry___Leaf_scorch",
            28: "Tomato___Bacterial_spot",
            29: "Tomato___Early_blight",
            30: "Tomato___healthy",
            31: "Tomato___Late_blight",
            32: "Tomato___Leaf_Mold",
            33: "Tomato___Septoria_leaf_spot",
            34: "Tomato___Spider_mites Two-spotted_spider_mite",
            35: "Tomato___Target_Spot",
            36: "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
            37: "Tomato___Tomato_mosaic_virus"
        }
        return labels

    def preprocess_image(self, image_path):
        """Preprocess an image for inference"""
        try:
            img = Image.open(image_path).convert('RGB')
            img_tensor = self.transform(img).unsqueeze(0).to(self.device)
            return img_tensor
        except Exception as e:
            print(f"Error preprocessing image: {e}")
            return None

    def predict(self, image_path):
        """Predict plant disease from image"""
        img_tensor = self.preprocess_image(image_path)
        
        if img_tensor is None:
            return {"error": "Failed to process image"}
        
        with torch.no_grad():
            # Ensure model is in eval mode
            self.model.eval()
            
            try:
                # Inception V3 in training mode returns tuple (output, aux_output)
                # In eval mode, it only returns output
                outputs = self.model(img_tensor)
                
                _, predicted = torch.max(outputs, 1)
                class_idx = predicted.item()
                
                # Get probabilities using softmax
                probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
                confidence = probabilities[class_idx].item() * 100
                
                result = {
                    "disease": self.class_labels[class_idx],
                    "confidence": round(confidence, 2),
                    "top_predictions": []
                }
                
                # Get top 5 predictions
                top_probs, top_indices = torch.topk(probabilities, 5)
                for i in range(top_indices.size(0)):
                    idx = top_indices[i].item()
                    prob = top_probs[i].item() * 100
                    result["top_predictions"].append({
                        "disease": self.class_labels[idx],
                        "confidence": round(prob, 2)
                    })
                
                return result
            except Exception as e:
                print(f"Error during inference: {e}")
                return {"error": f"Inference error: {str(e)}"}

    def train(self, train_loader, val_loader, epochs=10, lr=0.001):
        """Train the model (for future use)"""
        self.model.train()
        criterion = nn.CrossEntropyLoss()
        optimizer = torch.optim.Adam(self.model.parameters(), lr=lr)
        
        for epoch in range(epochs):
            running_loss = 0.0
            correct = 0
            total = 0
            
            for inputs, labels in train_loader:
                inputs, labels = inputs.to(self.device), labels.to(self.device)
                
                optimizer.zero_grad()
                
                try:
                    # Inception v3 returns tuple in training mode
                    outputs, aux_outputs = self.model(inputs)
                    loss1 = criterion(outputs, labels)
                    loss2 = criterion(aux_outputs, labels)
                    loss = loss1 + 0.4 * loss2
                except Exception as e:
                    # Handle case where aux_output isn't available
                    print(f"Training error (using standard output only): {e}")
                    outputs = self.model(inputs)
                    loss = criterion(outputs, labels)
                
                loss.backward()
                optimizer.step()
                
                running_loss += loss.item()
                _, predicted = torch.max(outputs.data, 1)
                total += labels.size(0)
                correct += (predicted == labels).sum().item()
            
            print(f'Epoch [{epoch+1}/{epochs}], Loss: {running_loss/len(train_loader):.4f}, Acc: {100 * correct / total:.2f}%')
            
            # Validate after each epoch
            self.validate(val_loader)
        
        self.model.eval()

    def validate(self, val_loader):
        """Validate the model"""
        self.model.eval()
        correct = 0
        total = 0
        
        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs, labels = inputs.to(self.device), labels.to(self.device)
                
                outputs = self.model(inputs)
                _, predicted = torch.max(outputs, 1)
                
                total += labels.size(0)
                correct += (predicted == labels).sum().item()
        
        print(f'Validation Accuracy: {100 * correct / total:.2f}%')
        self.model.train()

    def save_model(self, path):
        """Save the model"""
        torch.save(self.model.state_dict(), path)
        print(f"Model saved to {path}")

# Example usage
if __name__ == "__main__":
    model = PlantDiseaseModel()
    # If you have a test image
    # result = model.predict("test_image.jpg")
    # print(json.dumps(result, indent=4)) 