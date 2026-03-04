#!/bin/bash

echo "========================================"
echo "GitHub Upload Script"
echo "UP Exam Mantra"
echo "========================================"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null
then
    echo "❌ Git is not installed!"
    echo "Please install Git from: https://git-scm.com/downloads"
    exit 1
fi

echo "✅ Git found!"
echo ""

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME
echo ""

# Initialize git if not already
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo ""
fi

# Add all files
echo "📁 Adding all files..."
git add .
echo ""

# Commit
echo "💾 Creating commit..."
git commit -m "Initial commit: UP Exam Mantra complete project"
echo ""

# Add remote
echo "🔗 Adding GitHub remote..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/$GITHUB_USERNAME/up-exam-mantra.git
echo ""

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "✅ SUCCESS! Code uploaded to GitHub"
    echo "========================================"
    echo ""
    echo "Your repository: https://github.com/$GITHUB_USERNAME/up-exam-mantra"
    echo ""
else
    echo ""
    echo "========================================"
    echo "❌ Upload failed!"
    echo "========================================"
    echo ""
    echo "Possible reasons:"
    echo "1. Repository doesn't exist on GitHub"
    echo "2. Wrong username"
    echo "3. Need to create Personal Access Token"
    echo ""
    echo "Please check GITHUB_SETUP.md for detailed instructions"
    echo ""
fi
