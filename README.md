# PlantG: Advanced Plant Disease Detection

PlantG is a cutting-edge plant disease detection application that uses artificial intelligence to identify plant diseases from images, providing accurate diagnoses and treatment recommendations.

## ✨ Features

- **Advanced Disease Detection** - AI-powered detection of 50+ plant diseases with 98% accuracy
- **Easy Image Upload** - Quickly upload photos from your device or take new ones
- **Detailed Analysis** - Get comprehensive information about diseases and treatments
- **History Tracking** - Keep a record of all your plant analyses
- **Educational Content** - Learn about plant health, especially designed for children
- **Premium UI** - Beautiful and intuitive user interface

## 👥 The Team

- **Shikhar** - Lead Developer
- **Shiva** - Backend Core Developer
- **Yash** - Python Developer
- **Sahil** - UI Developer

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python 3.9+ with pip
- MongoDB (installed and running)

### Complete Installation Guide

#### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/plantg.git
cd plantg
```

#### Step 2: Start MongoDB Service
Ensure MongoDB is running on your system:
```bash
# Create MongoDB data directory if it doesn't exist
mkdir -p ~/mongodb-data/db

# Start MongoDB service
mongod --dbpath ~/mongodb-data/db
```

#### Step 3: Set Up and Start Backend
```bash
# Navigate to backend directory
cd Backend/core-backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start server
python app.py
```

The backend server will run on http://localhost:5001.

#### Step 4: Set Up and Start Frontend
In a new terminal:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend application will run on http://localhost:5173 (or 5174 if 5173 is already in use).

### Quick Start (Using Scripts)

1. Make the start script executable
   ```bash
   chmod +x start-app.sh
   ```

2. Run the application using the start script
   ```bash
   ./start-app.sh
   ```

## 🔐 Login Information

The application is pre-configured with an admin account:

- **Email**: shikhar@plantg.com
- **Password**: admin

You can use these credentials to log in or create your own account through the registration page.

## 💻 Accessing the Application

- **Frontend**: http://localhost:5173 (or alternative port if 5173 is in use)
- **Backend API**: http://localhost:5001
- **API Health Check**: http://localhost:5001/api/health

## 🧪 Testing the Application

1. Log in with the provided credentials
2. Navigate to the Plant Analysis page
3. Upload a plant image (sample images are available in `/Backend/core-backend/sample_images/`)
4. View the analysis results
5. Check your analysis history in the Dashboard

## ⚠️ Troubleshooting

### Common Issues & Solutions

#### Python Command Not Found
If you encounter `zsh: command not found: python`, use `python3` instead:
```bash
python3 app.py
```

#### Script Not Found
Ensure you're in the correct directory when running scripts. For backend scripts:
```bash
cd Backend/core-backend
./restart_service.sh  # Make sure to run chmod +x restart_service.sh first
```

#### Port Already in Use
If port 5173 is already in use, Vite will automatically try alternative ports (like 5174). Use the URL displayed in the terminal.

#### MongoDB Connection Issues
If you encounter database connection issues:
1. Ensure MongoDB is running: `ps aux | grep mongod`
2. Check if the database is properly initialized: `cd Backend/core-backend && python create_admin.py`

#### "Cannot use MongoClient after close" Error
This error occurs when the MongoDB connection is closed prematurely. We've fixed this by:
1. Removing the connection teardown after each request
2. Implementing persistent connection handling

## 📱 App Screens

- **Home** - Introduction to PlantG with key features
- **About** - Information about the project and team members
- **Features** - Detailed list of features including educational content for kids
- **Analysis** - Upload and analyze plant images
- **Dashboard** - Overview of your plant health monitoring
- **History** - View past analyses and treatments

## 🛠️ Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Flask, PyTorch, MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Machine Learning**: Inception V3 model trained on plant disease dataset

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

For any inquiries, please reach out to the team through the contact page on the website. 