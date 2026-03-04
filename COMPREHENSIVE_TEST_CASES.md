# 🧪 Comprehensive Test Cases for Super AI Fixer

Copy any test case and paste in Bulk Upload to test the AI!

---

## ✅ TEST 1: Single Quotes
```json
[{'question':'What is 2+2?','options':['1','2','3','4'],'answer':2}]
```
**Expected**: Converts all single quotes to double quotes

---

## ✅ TEST 2: Trailing Commas
```json
[
  {
    "question": "Test?",
    "options": ["A", "B", "C", "D",],
    "answer": 0,
  },
]
```
**Expected**: Removes all trailing commas

---

## ✅ TEST 3: Missing Commas Between Objects
```json
[
  {"question": "Q1?", "options": ["A","B","C","D"], "answer": 0}
  {"question": "Q2?", "options": ["A","B","C","D"], "answer": 1}
  {"question": "Q3?", "options": ["A","B","C","D"], "answer": 2}
]
```
**Expected**: Adds commas between objects

---

## ✅ TEST 4: Unquoted Property Names
```json
[
  {
    question: "Test question?",
    options: ["A", "B", "C", "D"],
    answer: 0,
    explanation: "Test explanation"
  }
]
```
**Expected**: Adds quotes to all property names

---

## ✅ TEST 5: Comments
```json
[
  {
    // This is a comment
    "question": "Test?",
    "options": ["A", "B", "C", "D"], /* inline comment */
    "answer": 0
  }
]
```
**Expected**: Removes all comments

---

## ✅ TEST 6: Capitalized Booleans
```json
[
  {
    "question": "Test?",
    "options": ["A", "B", "C", "D"],
    "answer": 0,
    "isActive": True,
    "isDeleted": False
  }
]
```
**Expected**: Converts True/False to true/false

---

## ✅ TEST 7: Mixed Quotes
```json
[
  {
    'question': "What is the capital?",
    "options": ['Delhi', "Mumbai", 'Kolkata', "Chennai"],
    'answer': 0
  }
]
```
**Expected**: Normalizes all to double quotes

---

## ✅ TEST 8: Missing Brackets
```json
{
  "question": "Test?",
  "options": ["A", "B", "C", "D"],
  "answer": 0
}
```
**Expected**: Wraps in array brackets []

---

## ✅ TEST 9: Duplicate Commas
```json
[
  {
    "question": "Test?",,
    "options": ["A",, "B", "C", "D"],
    "answer": 0
  }
]
```
**Expected**: Removes duplicate commas

---

## ✅ TEST 10: Unbalanced Brackets
```json
[
  {
    "question": "Test?",
    "options": ["A", "B", "C", "D",
    "answer": 0
  }
```
**Expected**: Adds missing ] and }

---

## ✅ TEST 11: Smart Quotes
```json
[
  {
    "question": "What's the answer?",
    "options": ["A", "B", "C", "D"],
    "answer": 0
  }
]
```
**Expected**: Converts smart quotes to regular

---

## ✅ TEST 12: Multiple Errors Combined
```json
[
  {
    'question': 'What is HTML?',
    options: ['Markup', 'Language', 'Both', 'None',],
    answer: 2,
  }
  {
    question: "What is CSS?",
    'options': ["Style", "Script", "Markup", "None"],
    'answer': 0
  },
  {
    // JavaScript question
    "question": "What is JS?",
    "options": ["Language", "Framework", "Library", "Tool",],
    answer: 0,
    isActive: True
  }
]
```
**Expected**: Fixes all errors - quotes, commas, comments, booleans

---

## ✅ TEST 13: Hindi Content with Errors
```json
[
  {
    'question': 'भारत की राजधानी क्या है?',
    'options': ['मुंबई', 'दिल्ली', 'कोलकाता', 'चेन्नई'],
    'answer': 1,
  }
  {
    question: "UPSSSC का पूरा नाम?",
    options: ["Commission A", "Commission B", "Commission C", "None"],
    answer: 0
  }
]
```
**Expected**: Fixes errors while preserving Hindi text

---

## ✅ TEST 14: Extra Whitespace
```json
[   {    "question"   :   "Test?"   ,   "options"   :   [   "A"   ,   "B"   ,   "C"   ,   "D"   ]   ,   "answer"   :   0   }   ]
```
**Expected**: Cleans up and formats properly

---

## ✅ TEST 15: Undefined and NaN
```json
[
  {
    "question": "Test?",
    "options": ["A", "B", "C", "D"],
    "answer": 0,
    "score": undefined,
    "rating": NaN
  }
]
```
**Expected**: Replaces undefined/NaN with null

---

## ✅ TEST 16: Real-World Complex Example
```json
[
  {
    'question': 'उत्तर प्रदेश में कितने जिले हैं?',
    options: ['70', '71', '72', '75',],
    answer: 3,
    explanation: '75 जिले हैं',
  }
  {
    // English question
    question: "What is the capital of UP?",
    'options': ["Kanpur", "Lucknow", "Agra", "Varanasi"],
    'answer': 1,
    isActive: True
  },
  {
    "question": "UPSSSC Lekhpal exam pattern?",
    "options": ["100 MCQ", "150 MCQ", "200 MCQ", "250 MCQ",],
    answer: 0,
    explanation: undefined
  }
]
```
**Expected**: Fixes all errors - quotes, commas, comments, booleans, undefined

---

## ✅ TEST 17: Missing Colons
```json
[
  {
    "question" "Test?",
    "options" ["A", "B", "C", "D"],
    "answer" 0
  }
]
```
**Expected**: Adds missing colons after property names

---

## ✅ TEST 18: Perfect JSON (No Errors)
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
  }
]
```
**Expected**: No fixes needed, just formats nicely

---

## 🎯 How to Test:

1. Copy any test case above
2. Go to Admin Panel
3. Navigate to: Test Series → Section → Test → Questions
4. Click "📦 Bulk Upload"
5. Paste the test case
6. Click "🤖 Auto-Fix Errors"
7. See the result!

---

## 📊 Expected Success Rate:

- TEST 1-10: 100% success
- TEST 11-15: 100% success
- TEST 16-17: 95% success
- TEST 18: 100% (already perfect)

---

## 💡 Tips:

- Start with simple tests (1-5)
- Then try complex tests (12, 16)
- Test with Hindi content (13, 16)
- Always review the fixed JSON
- Click "Import Questions" after fixing

---

**All test cases are designed to cover real-world scenarios!** 🚀
