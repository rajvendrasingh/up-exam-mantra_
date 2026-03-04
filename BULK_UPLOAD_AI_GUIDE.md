# 🤖 AI-Powered Bulk Upload Guide

## ✨ Features

The bulk upload feature now includes **AI Error Detection and Auto-Fix** that can:

1. ✅ **Auto-fix common JSON errors**
2. ✅ **Validate question structure**
3. ✅ **Check for required fields**
4. ✅ **Verify options count (must be 4)**
5. ✅ **Validate answer index (0-3)**
6. ✅ **Provide detailed error messages**

## 🎯 How to Use

### Step 1: Prepare Your Questions

Create a JSON array with your questions:

```json
[
  {
    "question": "What is the capital of India?",
    "options": ["Mumbai", "Delhi", "Kolkata", "Chennai"],
    "answer": 1,
    "explanation": "Delhi is the capital of India"
  },
  {
    "question": "Who wrote the Indian National Anthem?",
    "options": ["Tagore", "Gandhi", "Nehru", "Patel"],
    "answer": 0,
    "explanation": "Rabindranath Tagore wrote Jana Gana Mana"
  }
]
```

### Step 2: Click "AI Check & Fix Errors"

Before importing, click the **🤖 AI Check & Fix Errors** button to:
- Automatically detect and fix common errors
- Validate your JSON structure
- Get detailed feedback

### Step 3: Import Questions

Once validated, click **✅ Import Questions** to add them to your test.

## 🔧 AI Auto-Fix Capabilities

### 1. **Single Quotes to Double Quotes**

❌ **Before (Invalid):**
```json
[
  {
    'question': 'What is 2+2?',
    'options': ['3', '4', '5', '6'],
    'answer': 1
  }
]
```

✅ **After (Fixed):**
```json
[
  {
    "question": "What is 2+2?",
    "options": ["3", "4", "5", "6"],
    "answer": 1
  }
]
```

### 2. **Trailing Commas**

❌ **Before (Invalid):**
```json
[
  {
    "question": "Test question?",
    "options": ["A", "B", "C", "D"],
    "answer": 0,
  }
]
```

✅ **After (Fixed):**
```json
[
  {
    "question": "Test question?",
    "options": ["A", "B", "C", "D"],
    "answer": 0
  }
]
```

### 3. **Missing Commas Between Objects**

❌ **Before (Invalid):**
```json
[
  {
    "question": "Q1?",
    "options": ["A", "B", "C", "D"],
    "answer": 0
  }
  {
    "question": "Q2?",
    "options": ["A", "B", "C", "D"],
    "answer": 1
  }
]
```

✅ **After (Fixed):**
```json
[
  {
    "question": "Q1?",
    "options": ["A", "B", "C", "D"],
    "answer": 0
  },
  {
    "question": "Q2?",
    "options": ["A", "B", "C", "D"],
    "answer": 1
  }
]
```

## ✅ Validation Rules

### Required Fields:
- ✅ `question` - Must be a non-empty string
- ✅ `options` - Must be an array with exactly 4 items
- ✅ `answer` - Must be a number between 0 and 3

### Optional Fields:
- 📝 `explanation` - String (recommended for better learning)

## 📋 Complete Example

```json
[
  {
    "question": "What is the full form of HTML?",
    "options": [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Home Tool Markup Language",
      "Hyperlinks and Text Markup Language"
    ],
    "answer": 0,
    "explanation": "HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages."
  },
  {
    "question": "Which planet is known as the Red Planet?",
    "options": [
      "Venus",
      "Mars",
      "Jupiter",
      "Saturn"
    ],
    "answer": 1,
    "explanation": "Mars is called the Red Planet because of its reddish appearance caused by iron oxide on its surface."
  },
  {
    "question": "What is the largest ocean on Earth?",
    "options": [
      "Atlantic Ocean",
      "Indian Ocean",
      "Arctic Ocean",
      "Pacific Ocean"
    ],
    "answer": 3,
    "explanation": "The Pacific Ocean is the largest and deepest ocean on Earth, covering more than 30% of the Earth's surface."
  },
  {
    "question": "Who painted the Mona Lisa?",
    "options": [
      "Vincent van Gogh",
      "Pablo Picasso",
      "Leonardo da Vinci",
      "Michelangelo"
    ],
    "answer": 2,
    "explanation": "The Mona Lisa was painted by Leonardo da Vinci in the early 16th century."
  },
  {
    "question": "What is the speed of light?",
    "options": [
      "300,000 km/s",
      "150,000 km/s",
      "450,000 km/s",
      "600,000 km/s"
    ],
    "answer": 0,
    "explanation": "The speed of light in vacuum is approximately 300,000 kilometers per second or 186,000 miles per second."
  }
]
```

## 🚨 Common Errors and Solutions

### Error 1: Invalid JSON Format
**Message:** `JSON Error: Unexpected token`

**Solution:** Click **🤖 AI Check & Fix Errors** to automatically fix common syntax issues.

### Error 2: Missing Required Field
**Message:** `Question 3: Missing 'question' field`

**Solution:** Add the missing field to the question object.

### Error 3: Wrong Number of Options
**Message:** `Question 2: Must have exactly 4 options (found 3)`

**Solution:** Add or remove options to have exactly 4 options per question.

### Error 4: Invalid Answer Index
**Message:** `Question 1: 'answer' must be between 0 and 3 (found 4)`

**Solution:** Change the answer to a valid index (0, 1, 2, or 3).

## 💡 Pro Tips

1. **Use the AI Check button first** - Always click "AI Check & Fix Errors" before importing
2. **Copy from Excel/Sheets** - You can prepare questions in spreadsheet and convert to JSON
3. **Test with small batches** - Start with 5-10 questions to test the format
4. **Add explanations** - Always include explanations for better learning experience
5. **Keep it organized** - Use proper indentation for readability

## 🎓 Sample Questions by Subject

### Mathematics
```json
[
  {
    "question": "What is the value of π (pi) approximately?",
    "options": ["2.14", "3.14", "4.14", "5.14"],
    "answer": 1,
    "explanation": "Pi (π) is approximately 3.14159, commonly rounded to 3.14"
  }
]
```

### Science
```json
[
  {
    "question": "What is the chemical symbol for water?",
    "options": ["H2O", "CO2", "O2", "N2"],
    "answer": 0,
    "explanation": "Water is composed of two hydrogen atoms and one oxygen atom, hence H2O"
  }
]
```

### History
```json
[
  {
    "question": "In which year did India gain independence?",
    "options": ["1945", "1946", "1947", "1948"],
    "answer": 2,
    "explanation": "India gained independence from British rule on August 15, 1947"
  }
]
```

### Geography
```json
[
  {
    "question": "What is the capital of France?",
    "options": ["London", "Berlin", "Paris", "Rome"],
    "answer": 2,
    "explanation": "Paris is the capital and largest city of France"
  }
]
```

## 🎉 Success!

Once your questions are validated and imported, they will be immediately available in the test for students to attempt!

Happy question creation! 🚀
