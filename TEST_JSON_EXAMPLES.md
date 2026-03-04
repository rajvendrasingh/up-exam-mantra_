# 🧪 Test JSON Examples for AI Error Fixer

## Test These Examples to See AI in Action!

Copy any example below and paste in Bulk Upload, then click "🤖 AI Check & Fix Errors"

---

## ✅ Example 1: Single Quotes (Will be Auto-Fixed)

```json
[
  {
    'question': 'What is the capital of India?',
    'options': ['Mumbai', 'Delhi', 'Kolkata', 'Chennai'],
    'answer': 1,
    'explanation': 'Delhi is the capital of India'
  },
  {
    'question': 'What is 2 + 2?',
    'options': ['2', '3', '4', '5'],
    'answer': 2
  }
]
```

**AI Will Fix**: Single quotes → Double quotes

---

## ✅ Example 2: Trailing Commas (Will be Auto-Fixed)

```json
[
  {
    "question": "Which is the largest planet?",
    "options": ["Earth", "Mars", "Jupiter", "Saturn",],
    "answer": 2,
    "explanation": "Jupiter is the largest planet",
  },
  {
    "question": "What is the speed of light?",
    "options": ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s",],
    "answer": 0,
  },
]
```

**AI Will Fix**: Remove trailing commas

---

## ✅ Example 3: Missing Commas (Will be Auto-Fixed)

```json
[
  {
    "question": "What is HTML?",
    "options": ["Language", "Markup", "Both", "None"],
    "answer": 2
  }
  {
    "question": "What is CSS?",
    "options": ["Style", "Script", "Markup", "None"],
    "answer": 0
  }
  {
    "question": "What is JavaScript?",
    "options": ["Markup", "Style", "Programming", "None"],
    "answer": 2
  }
]
```

**AI Will Fix**: Add missing commas between objects

---

## ✅ Example 4: Unquoted Properties (Will be Auto-Fixed)

```json
[
  {
    question: "Who invented the telephone?",
    options: ["Edison", "Bell", "Tesla", "Marconi"],
    answer: 1,
    explanation: "Alexander Graham Bell invented the telephone"
  },
  {
    question: "What year did India gain independence?",
    options: ["1945", "1946", "1947", "1948"],
    answer: 2
  }
]
```

**AI Will Fix**: Add quotes around property names

---

## ✅ Example 5: Mixed Errors (Will be Auto-Fixed)

```json
[
  {
    'question': 'What is Python?',
    options: ["Snake", "Language", "Tool", "Framework",],
    'answer': 1,
  }
  {
    question: "What is React?",
    'options': ['Library', 'Framework', 'Language', 'Tool'],
    answer: 0
  },
]
```

**AI Will Fix**: Multiple issues - quotes, commas, properties

---

## ✅ Example 6: Comments (Will be Auto-Fixed)

```json
[
  {
    // This is a history question
    "question": "Who was the first Prime Minister of India?",
    "options": ["Gandhi", "Nehru", "Patel", "Azad"],
    "answer": 1,
    /* Explanation below */
    "explanation": "Jawaharlal Nehru was the first PM"
  }
]
```

**AI Will Fix**: Remove all comments

---

## ✅ Example 7: Capitalized Booleans (Will be Auto-Fixed)

```json
[
  {
    "question": "Is Earth round?",
    "options": ["Yes", "No", "Maybe", "Unknown"],
    "answer": 0,
    "isActive": True,
    "isDeleted": False
  }
]
```

**AI Will Fix**: True/False → true/false

---

## ✅ Example 8: Missing Brackets (Will be Auto-Fixed)

```json
{
  "question": "What is AI?",
  "options": ["Intelligence", "Algorithm", "Both", "None"],
  "answer": 2
}
```

**AI Will Fix**: Wrap in array brackets []

---

## ✅ Example 9: Complex Mixed Errors (Will be Auto-Fixed)

```json
[
  {
    'question': 'What is the largest ocean?',
    options: ['Atlantic', 'Indian', 'Pacific', 'Arctic',],
    answer: 2,
  }
  {
    question: "What is the smallest country?",
    'options': ["Monaco", "Vatican", "Malta", "Liechtenstein"],
    'answer': 1
  },
  {
    // Geography question
    'question': 'Highest mountain?',
    options: ["K2", "Everest", "Kangchenjunga", "Lhotse",],
    answer: 1,
    explanation: "Mount Everest is the highest"
  }
]
```

**AI Will Fix**: All errors - quotes, commas, comments, properties

---

## ✅ Example 10: Real-World UPSSSC Questions (Will be Auto-Fixed)

```json
[
  {
    'question': 'उत्तर प्रदेश की राजधानी क्या है?',
    'options': ['मुंबई', 'लखनऊ', 'कानपुर', 'आगरा'],
    'answer': 1,
    'explanation': 'लखनऊ उत्तर प्रदेश की राजधानी है',
  },
  {
    question: "UPSSSC का पूरा नाम क्या है?",
    options: ["UP Subordinate Services Selection Commission", "UP State Service Commission", "UP Special Services Commission", "None"],
    answer: 0
  }
  {
    'question': 'भारत में कितने राज्य हैं?',
    'options': ['27', '28', '29', '30'],
    'answer': 1,
  }
]
```

**AI Will Fix**: All errors + supports Hindi text

---

## 🎯 Perfect JSON Format (No Errors)

```json
[
  {
    "question": "What is the capital of India?",
    "options": ["Mumbai", "Delhi", "Kolkata", "Chennai"],
    "answer": 1,
    "explanation": "Delhi is the capital of India"
  },
  {
    "question": "What is 2 + 2?",
    "options": ["2", "3", "4", "5"],
    "answer": 2,
    "explanation": "2 + 2 = 4"
  },
  {
    "question": "Which is the largest planet?",
    "options": ["Earth", "Mars", "Jupiter", "Saturn"],
    "answer": 2,
    "explanation": "Jupiter is the largest planet in our solar system"
  }
]
```

**AI Will Say**: ✅ PERFECT! JSON is valid! No errors found.

---

## 🧪 How to Test

1. Copy any example above
2. Go to Admin Panel → Select Test Series → Section → Test
3. Click "📦 Bulk Upload" button
4. Paste the JSON in textarea
5. Click "🤖 AI Check & Fix Errors" button
6. See the magic! ✨
7. Click "✅ Import Questions" to add them

---

## 📝 Notes

- All examples above have intentional errors
- AI will detect and fix them automatically
- Fixed JSON will appear in the textarea
- You can then import the corrected questions
- Works with Hindi/English/Mixed content
- Supports special characters and Unicode

---

## 💡 Pro Tips

1. **Test with Example 9**: It has the most errors - great for testing!
2. **Try Perfect Format**: Use Example 11 to see "No errors" message
3. **Mix Languages**: AI works with Hindi, English, and mixed content
4. **Large Batches**: AI can handle 100+ questions at once
5. **Save Time**: No need to manually fix JSON anymore!

---

**Happy Testing! 🚀**
