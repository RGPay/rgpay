#!/bin/bash

# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install

# Navigate to backend directory
cd ../backend

# Install backend dependencies
npm install

# Return to root directory
cd ..

echo "All dependencies installed successfully!" 