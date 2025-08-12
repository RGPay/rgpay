#!/bin/bash

echo "🚀 Deploying RGPay to Azure..."

# Build the backend
echo "📦 Building backend..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Backend build failed!"
    exit 1
fi

echo "✅ Backend built successfully!"

# Check if dist folder exists
if [ ! -d "backend/dist" ]; then
    echo "❌ Backend dist folder not found!"
    exit 1
fi

echo "📁 Backend dist folder found at backend/dist/"

# Check if index.js exists
if [ ! -f "index.js" ]; then
    echo "❌ index.js not found at root level!"
    exit 1
fi

echo "✅ index.js found at root level"

# Check if web.config exists
if [ ! -f "web.config" ]; then
    echo "❌ web.config not found!"
    exit 1
fi

echo "✅ web.config found"

echo ""
echo "🎯 Ready for Azure deployment!"
echo ""
echo "Next steps:"
echo "1. Commit and push these changes to your main branch:"
echo "   git add ."
echo "   git commit -m 'Add Azure deployment configuration'"
echo "   git push origin main"
echo ""
echo "2. In Azure Portal, make sure your Web App is configured to deploy from your Git repository"
echo "3. Azure should automatically detect the changes and redeploy"
echo ""
echo "Files that will be deployed:"
echo "- index.js (root entry point)"
echo "- web.config (Azure configuration)"
echo "- backend/dist/ (built NestJS application)"
echo "- package.json (dependencies)"
echo "- node_modules/ (will be installed by Azure)"
