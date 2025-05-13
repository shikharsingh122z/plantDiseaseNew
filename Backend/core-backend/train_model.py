import os
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import transforms, models
from torchvision.datasets import ImageFolder
from tqdm import tqdm
import matplotlib.pyplot as plt
import numpy as np
from sklearn.metrics import accuracy_score, confusion_matrix
import seaborn as sns

# Set device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

# Dataset paths
KAGGLE_DATASET_PATH = os.getenv("KAGGLE_DATASET_PATH", "./plant_disease_dataset")
TRAIN_DIR = os.path.join(KAGGLE_DATASET_PATH, "train")
VAL_DIR = os.path.join(KAGGLE_DATASET_PATH, "val")

# Model save path
MODEL_DIR = "models"
MODEL_PATH = os.path.join(MODEL_DIR, "inception_v3_plant_disease.pth")
os.makedirs(MODEL_DIR, exist_ok=True)

# Hyperparameters
BATCH_SIZE = 32
LEARNING_RATE = 0.0001
NUM_EPOCHS = 20
IMAGE_SIZE = 299  # Inception v3 input size

def create_data_loaders():
    """Create and return data loaders for training and validation"""
    # Data transformations
    train_transforms = transforms.Compose([
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(15),
        transforms.RandomAffine(0, scale=(0.8, 1.2)),
        transforms.RandomAffine(0, shear=10),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    val_transforms = transforms.Compose([
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    # Load datasets
    train_dataset = ImageFolder(TRAIN_DIR, transform=train_transforms)
    val_dataset = ImageFolder(VAL_DIR, transform=val_transforms)
    
    # Create data loaders
    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=4)
    val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=4)
    
    print(f"Training images: {len(train_dataset)}")
    print(f"Validation images: {len(val_dataset)}")
    print(f"Number of classes: {len(train_dataset.classes)}")
    
    # Save class labels (disease names)
    class_labels = {idx: name for idx, name in enumerate(train_dataset.classes)}
    
    return train_loader, val_loader, class_labels

def train_model():
    """Train the Inception V3 model on the plant disease dataset"""
    # Create data loaders
    train_loader, val_loader, class_labels = create_data_loaders()
    
    # Load pre-trained Inception v3 model
    model = models.inception_v3(pretrained=True)
    
    # Modify the final layer for our classification task
    num_classes = len(class_labels)
    model.fc = nn.Linear(model.fc.in_features, num_classes)
    model.aux_logits = False  # Disable auxiliary output
    
    # Move model to device
    model = model.to(device)
    
    # Loss function and optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)
    
    # Learning rate scheduler
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', factor=0.1, patience=5)
    
    # Track metrics
    train_losses = []
    val_losses = []
    val_accuracies = []
    best_val_accuracy = 0.0
    
    # Train the model
    for epoch in range(NUM_EPOCHS):
        # Training phase
        model.train()
        train_loss = 0.0
        
        for inputs, labels in tqdm(train_loader, desc=f"Epoch {epoch+1}/{NUM_EPOCHS} - Training"):
            inputs, labels = inputs.to(device), labels.to(device)
            
            # Zero the parameter gradients
            optimizer.zero_grad()
            
            # Forward pass
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            
            # Backward pass and optimize
            loss.backward()
            optimizer.step()
            
            train_loss += loss.item() * inputs.size(0)
        
        train_loss = train_loss / len(train_loader.dataset)
        train_losses.append(train_loss)
        
        # Validation phase
        model.eval()
        val_loss = 0.0
        all_predictions = []
        all_true_labels = []
        
        with torch.no_grad():
            for inputs, labels in tqdm(val_loader, desc=f"Epoch {epoch+1}/{NUM_EPOCHS} - Validation"):
                inputs, labels = inputs.to(device), labels.to(device)
                
                # Forward pass
                outputs = model(inputs)
                loss = criterion(outputs, labels)
                
                val_loss += loss.item() * inputs.size(0)
                
                # Get predictions
                _, preds = torch.max(outputs, 1)
                
                all_predictions.extend(preds.cpu().numpy())
                all_true_labels.extend(labels.cpu().numpy())
        
        val_loss = val_loss / len(val_loader.dataset)
        val_losses.append(val_loss)
        
        # Calculate accuracy
        val_accuracy = accuracy_score(all_true_labels, all_predictions)
        val_accuracies.append(val_accuracy)
        
        # Update learning rate
        scheduler.step(val_loss)
        
        # Print metrics
        print(f"Epoch {epoch+1}/{NUM_EPOCHS}:")
        print(f"  Train Loss: {train_loss:.4f}")
        print(f"  Val Loss: {val_loss:.4f}")
        print(f"  Val Accuracy: {val_accuracy:.4f}")
        
        # Save best model
        if val_accuracy > best_val_accuracy:
            best_val_accuracy = val_accuracy
            # Save model
            torch.save({
                'model_state_dict': model.state_dict(),
                'class_labels': class_labels,
                'accuracy': val_accuracy
            }, MODEL_PATH)
            print(f"  Model saved with accuracy: {val_accuracy:.4f}")
    
    # Evaluate final model
    model.eval()
    all_predictions = []
    all_true_labels = []
    
    with torch.no_grad():
        for inputs, labels in tqdm(val_loader, desc="Final evaluation"):
            inputs, labels = inputs.to(device), labels.to(device)
            outputs = model(inputs)
            _, preds = torch.max(outputs, 1)
            all_predictions.extend(preds.cpu().numpy())
            all_true_labels.extend(labels.cpu().numpy())
    
    # Calculate final accuracy
    final_accuracy = accuracy_score(all_true_labels, all_predictions)
    print(f"\nFinal validation accuracy: {final_accuracy:.4f}")
    
    # Plot confusion matrix
    cm = confusion_matrix(all_true_labels, all_predictions)
    plt.figure(figsize=(20, 20))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=list(class_labels.values()), 
                yticklabels=list(class_labels.values()))
    plt.xlabel('Predicted')
    plt.ylabel('True')
    plt.title('Confusion Matrix')
    plt.tight_layout()
    plt.savefig('confusion_matrix.png')
    
    # Plot training history
    plt.figure(figsize=(12, 4))
    plt.subplot(1, 2, 1)
    plt.plot(train_losses, label='Train Loss')
    plt.plot(val_losses, label='Validation Loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    
    plt.subplot(1, 2, 2)
    plt.plot(val_accuracies, label='Validation Accuracy')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend()
    
    plt.tight_layout()
    plt.savefig('training_history.png')
    
    print(f"Model saved to {MODEL_PATH}")
    print(f"Confusion matrix and training history plots saved.")
    
    # Return final performance metrics
    return {
        'final_accuracy': final_accuracy,
        'class_labels': class_labels,
        'model_path': MODEL_PATH
    }

if __name__ == "__main__":
    print("=== Training Plant Disease Detection Model ===")
    metrics = train_model()
    print(f"Training completed with {metrics['final_accuracy']*100:.2f}% accuracy")
    print(f"The model can detect {len(metrics['class_labels'])} different plant diseases") 