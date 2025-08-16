#!/bin/bash

# RGPAY - Install Dependencies Script
# This script installs all necessary dependencies for the RGPAY project

echo "🚀 Installing RGPAY dependencies..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Check if PostgreSQL is installed
echo "🔍 Checking PostgreSQL installation..."
if ! command -v pg_config &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed or not in PATH."
    echo "   Please install PostgreSQL before continuing:"
    echo ""
    echo "   macOS: brew install postgresql"
    echo "   Ubuntu/Debian: sudo apt install postgresql postgresql-contrib libpq-dev"
    echo "   CentOS/RHEL: sudo yum install postgresql postgresql-server postgresql-devel"
    echo "   Windows: Download from https://www.postgresql.org/download/windows/"
    echo ""
    echo "   This is required for the pg package to compile properly."
    echo "   Installation will continue, but you may encounter errors..."
    echo ""
else
    echo "✅ PostgreSQL is installed"
fi

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Navigate to frontend directory
cd frontend

# Install frontend dependencies
echo "🎨 Installing frontend dependencies..."
npm install

# Navigate to backend directory
cd ../backend

# Install backend dependencies
echo "🔧 Installing backend dependencies..."
npm install

# Return to root directory
cd ..

echo "✅ All dependencies installed successfully!" 