#!/bin/bash

echo "🚀 UP Exam Mantra - Deployment Script"
echo "======================================"
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null
then
    echo "❌ Firebase CLI not found!"
    echo "📦 Installing Firebase CLI..."
    npm install -g firebase-tools
fi

echo "✅ Firebase CLI found"
echo ""

# Build the app
echo "📦 Building the app..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    
    # Deploy to Firebase
    echo "🚀 Deploying to Firebase Hosting..."
    firebase deploy --only hosting
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Deployment successful!"
        echo ""
        echo "🌐 Your site is live at:"
        echo "   - https://up-exam-mantra.web.app"
        echo "   - https://upexammantra.com (after DNS setup)"
        echo ""
        echo "📖 Read DEPLOYMENT_GUIDE.md for custom domain setup"
    else
        echo "❌ Deployment failed!"
        exit 1
    fi
else
    echo "❌ Build failed!"
    exit 1
fi
