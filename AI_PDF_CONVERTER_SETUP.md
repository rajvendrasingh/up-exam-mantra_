# 🤖 AI PDF to Questions Converter - Setup Guide

## ✅ Installation Complete!

The AI PDF Converter has been successfully integrated into your Admin panel.

## 📋 Features

- **Automatic Question Extraction**: Upload any PDF and AI extracts all questions automatically
- **Smart Formatting**: Preserves mathematical symbols, equations, and special characters
- **Diagram Handling**: Converts diagrams, charts, and tables into text descriptions
- **Complete Data**: Extracts questions, 4 options, correct answers, and explanations
- **JSON Ready**: Outputs in perfect format ready to add to your tests

## 🔧 Setup Instructions

### Step 1: Get Gemini API Key (FREE)

1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### Step 2: Add API Key to .env File

1. Open your `.env` file
2. Find the line: `VITE_GEMINI_API_KEY=your_gemini_api_key_here`
3. Replace `your_gemini_api_key_here` with your actual API key
4. Save the file

Example:
```
VITE_GEMINI_API_KEY=AIzaSyABC123XYZ789_your_actual_key_here
```

### Step 3: Restart Development Server

```bash
npm run dev
```

## 🚀 How to Use

1. **Login as Admin**
2. **Go to Admin Panel** → Questions section
3. **Click "🤖 AI PDF to Questions"** button
4. **Upload your PDF file** (question paper, practice set, etc.)
5. **Click "🚀 Extract Questions with AI"**
6. **Wait 30-60 seconds** while AI processes the PDF
7. **Review extracted questions** and click "Add All Questions"

## 📝 Supported PDF Content

✅ Multiple choice questions (MCQ)
✅ Mathematical equations and symbols
✅ Diagrams and charts (converted to descriptions)
✅ Tables and data
✅ Special characters and Unicode symbols
✅ Hindi and English text
✅ Mixed content PDFs

## ⚡ Tips for Best Results

- Use clear, readable PDFs (not scanned images)
- Ensure questions are properly formatted in the PDF
- One question per section works best
- AI will describe diagrams - review and edit if needed
- Always review AI-generated content before publishing

## 🔍 Troubleshooting

**Error: "Gemini API key not configured"**
- Make sure you added the API key to `.env` file
- Restart the development server after adding the key

**Error: "Failed to process PDF"**
- Check if PDF is readable (not password protected)
- Try a smaller PDF first (under 5MB)
- Ensure PDF contains actual text (not just images)

**Questions not extracted correctly**
- Review the PDF format - AI works best with structured content
- Manually edit extracted questions if needed
- Try breaking large PDFs into smaller sections

## 💡 How It Works

1. **PDF Upload**: File is converted to base64 format
2. **AI Analysis**: Gemini Vision API reads and analyzes the entire PDF
3. **Smart Extraction**: AI identifies questions, options, answers, and explanations
4. **Format Conversion**: Content is structured into JSON format
5. **Ready to Use**: Questions are added to your test database

## 📊 API Limits (Free Tier)

- **Gemini API Free Tier**: 60 requests per minute
- **File Size**: Up to 10MB per PDF
- **Processing Time**: 30-60 seconds per PDF
- **Cost**: FREE for reasonable usage

## 🎯 Next Steps

1. Get your Gemini API key from Google AI Studio
2. Add it to your `.env` file
3. Restart the server
4. Try uploading a sample PDF to test the feature

## 📞 Support

If you face any issues:
1. Check the browser console for error messages
2. Verify API key is correctly added to `.env`
3. Ensure PDF is readable and not corrupted
4. Try with a smaller, simpler PDF first

---

**Status**: ✅ Ready to use (after API key setup)
**Location**: Admin Panel → Questions → "🤖 AI PDF to Questions" button
**Dependencies**: @google/generative-ai (installed ✓)
