# PlantG Frontend

This is the frontend for the PlantG application, a plant disease detection system. This project is built with React, TypeScript, and Tailwind CSS.

## Features

- User authentication and authorization
- Image upload for plant disease detection
- Historical analysis tracking
- Detailed plant disease information
- Treatment recommendations

## Tech Stack

- React 18
- TypeScript
- React Router v6
- Tailwind CSS
- Vite

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will start on http://localhost:5173 (or next available port).

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── assets/        # Static assets
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks
├── layouts/       # Layout components
├── pages/         # Page components
├── services/      # API services and utilities
├── utils/         # Helper functions
├── App.tsx        # Main app component with routes
├── main.tsx       # Entry point
└── index.css      # Global styles and Tailwind imports
```

## Routes

- `/` - Home page
- `/about` - About page
- `/features` - Features page
- `/contact` - Contact page
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - User dashboard
- `/dashboard/analysis` - Plant analysis tool
- `/dashboard/history` - User history 