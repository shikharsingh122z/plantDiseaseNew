# Plant Disease Detection Backend

This backend implements a plant disease detection API using PyTorch and Inception V3 for high-accuracy plant disease classification, integrated with MongoDB for user management and history tracking.

## Features

- **High Accuracy Model**: Uses Inception V3 architecture pretrained on ImageNet and fine-tuned for plant disease detection
- **RESTful API**: Easy to integrate with any frontend through HTTP requests
- **User Authentication**: JWT-based authentication system
- **MongoDB Integration**: Store users and analysis history
- **Detailed Results**: Returns disease identification, confidence scores, symptoms, and treatment recommendations

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- MongoDB (running locally or remote)
- Virtual environment (recommended)

### MongoDB Setup

1. Start MongoDB
```bash
mongod
```

2. The admin user is automatically created when you run the application, with:
   - Email: shikhar@plantg.com
   - Password: admin

### Installation

1. Create and activate a virtual environment:

```bash
# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install the required dependencies:

```bash
pip install -r requirements.txt
```

3. Configure environment variables (or use .env file):
```
MONGODB_URI=mongodb://shikhar:admin@localhost:27017/plantg?authSource=admin
JWT_SECRET=plantg_secret_key_do_not_share
MODEL_PATH=models/inception_v3_plant_disease.pth
PORT=5001
```

4. Download and prepare the model:

```bash
python download_model.py
```

This will:
- Download the pretrained Inception V3 model
- Modify it for plant disease detection
- Save it to the `models/` directory
- Download sample images for testing

### Running the Server

Start the Flask server with:

```bash
python app.py
```

Or use the provided shell script:

```bash
./start-backend.sh
```

The API will be accessible at: http://localhost:5001

## API Endpoints

### Authentication

```
POST /api/auth/register
```
Register a new user with name, email, and password.

```
POST /api/auth/login
```
Login with email and password.

```
GET /api/auth/me
```
Get current user profile (requires authentication).

### Health Check

```
GET /api/health
```
Returns the status of the API.

### Plant Disease Detection

```
POST /api/detect
```
Public endpoint for plant disease detection without authentication.

```
POST /api/user/detect
```
Authenticated endpoint for plant disease detection that saves results to user history.

**Request:**
- Form data with a file field named 'file'

**Response:**
```json
{
  "disease": "Tomato___Late_blight",
  "confidence": 98.45,
  "image_id": "d64a1d2b-8e7c-4f72-9288-a5df365cdea3.jpg",
  "top_predictions": [
    {
      "disease": "Tomato___Late_blight",
      "confidence": 98.45
    },
    {
      "disease": "Potato___Late_blight",
      "confidence": 1.23
    },
    ...
  ],
  "description": "Late blight is a devastating disease...",
  "symptoms": ["Dark, water-soaked spots on leaves", ...],
  "treatments": ["Remove and destroy affected plant parts", ...]
}
```

### History Management

```
GET /api/user/analyses
```
Get user's analysis history.

```
GET /api/user/analyses/:id
```
Get a specific analysis.

```
DELETE /api/user/analyses/:id
```
Delete a specific analysis.

```
GET /api/user/statistics
```
Get statistics about user's analyses.

### Disease List

```
GET /api/diseases
```
Returns a list of all detectable plant diseases.

## Testing

You can test the API using the sample images in the `sample_images/` directory:

```bash
curl -X POST -F "file=@sample_images/apple_scab.jpg" http://localhost:5001/api/detect
```

For authenticated endpoints, include the JWT token:

```bash
curl -X POST -F "file=@sample_images/apple_scab.jpg" -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5001/api/user/detect
```

## Integration with Frontend

To integrate with the frontend, send POST requests to the API endpoints with appropriate authentication headers when needed.

Example authentication and analysis with JavaScript:

```javascript
// Login
async function login(email, password) {
  const response = await fetch('http://localhost:5001/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  // Store token in localStorage
  localStorage.setItem('token', data.token);
  return data;
}

// Authenticated image analysis
async function analyzeImage(imageFile) {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await fetch('http://localhost:5001/api/user/detect', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData
  });
  
  return await response.json();
}
``` 