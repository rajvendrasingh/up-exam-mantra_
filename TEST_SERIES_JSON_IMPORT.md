# Test Series JSON Import with AI Auto-Fix ✅

## Feature Added
Test Series mein bhi ab JSON bulk import aur AI auto-fix feature hai, bilkul waise hi jaise Subject questions mein tha!

## What's Included

### 1. JSON Bulk Import
- Ek saath multiple questions import kar sakte ho
- Same JSON format jaise subjects mein hai
- Fast and efficient - 100 questions bhi ek click mein!

### 2. AI Auto-Fix 🤖
Test Series questions ke liye bhi same powerful AI features:
- ✓ Missing brackets fix karta hai `[ ]`
- ✓ Single quotes ko double quotes mein convert karta hai
- ✓ Trailing commas remove karta hai
- ✓ Unquoted keys ko fix karta hai
- ✓ Missing field names correct karta hai (question→q, choices→options)
- ✓ Missing options auto-complete karta hai
- ✓ Wrong answer index fix karta hai
- ✓ Beautifies and formats JSON

### 3. Error Validation
- 🔍 Check Errors button - Sabhi errors list karta hai
- Detailed error messages with line numbers
- Tells exactly what's wrong and how to fix

### 4. Export Feature
- 📤 Export existing questions as JSON
- Copy to clipboard automatically
- Use as template for new questions

## JSON Format

```json
[
  {
    "q": "What is the capital of France?",
    "options": ["London", "Paris", "Berlin", "Madrid", "Rome"],
    "answer": 1
  },
  {
    "q": "What is 2 + 2?",
    "options": ["3", "4", "5", "6", "7"],
    "answer": 1
  }
]
```

### Field Requirements:
- `q` - Question text (string)
- `options` - Array of exactly 5 strings
- `answer` - Number 0-4 (index of correct option)

## How to Use

### Import Questions:
1. Admin panel mein Test Series select karo
2. Click "📥 Bulk Import (JSON)"
3. JSON paste karo textarea mein
4. Click "🤖 AI Auto-Fix Errors" (optional but recommended)
5. Click "✅ Import All Questions"
6. Done! Saare questions add ho gaye

### Export Questions:
1. Test Series select karo
2. Click "📤 Export Questions (JSON)"
3. JSON automatically clipboard mein copy ho jayega
4. Paste anywhere and use as template

### AI Auto-Fix:
1. Paste your JSON (even if it has errors)
2. Click "🤖 AI Auto-Fix Errors"
3. AI automatically fixes common errors
4. Shows list of what was fixed
5. Review and import

### Check Errors:
1. Paste your JSON
2. Click "🔍 Check Errors"
3. See detailed list of all errors
4. Fix manually or use AI Auto-Fix

## Example Scenarios

### Scenario 1: Perfect JSON
```json
[{"q": "Question?", "options": ["A","B","C","D","E"], "answer": 0}]
```
Result: ✅ Direct import, no fixes needed

### Scenario 2: Missing Brackets
```json
{"q": "Question?", "options": ["A","B","C","D","E"], "answer": 0}
```
AI Fix: Adds `[` at start and `]` at end

### Scenario 3: Single Quotes
```json
[{'q': 'Question?', 'options': ['A','B','C','D','E'], 'answer': 0}]
```
AI Fix: Converts all `'` to `"`

### Scenario 4: Wrong Field Names
```json
[{"question": "Q?", "choices": ["A","B","C","D","E"], "correct": 0}]
```
AI Fix: Changes to `q`, `options`, `answer`

### Scenario 5: Missing Options
```json
[{"q": "Question?", "options": ["A","B"], "answer": 0}]
```
AI Fix: Adds "Option 3", "Option 4", "Option 5"

### Scenario 6: Trailing Commas
```json
[{"q": "Q?", "options": ["A","B","C","D","E",], "answer": 0,}]
```
AI Fix: Removes trailing commas

## UI Features

### Toggle Buttons:
- "📥 Bulk Import (JSON)" - Switch to JSON mode
- "📝 Manual Entry" - Switch back to manual form
- "📤 Export Questions (JSON)" - Export existing questions

### JSON Import Panel:
- Large textarea for JSON input
- Format example with syntax highlighting
- AI features list
- Three action buttons:
  - 🤖 AI Auto-Fix Errors
  - 🔍 Check Errors
  - ✅ Import All Questions
- Cancel button to go back

### Visual Feedback:
- Blue border for JSON import section
- Success messages after import
- Error messages with details
- Count of imported questions

## Benefits

### For Admin:
1. ✅ Save time - Import 100s of questions instantly
2. ✅ No manual typing - Copy-paste from anywhere
3. ✅ Error-free - AI fixes common mistakes
4. ✅ Reusable - Export and reuse questions
5. ✅ Flexible - Works with any JSON source

### For Development:
1. ✅ Easy testing - Quickly add test data
2. ✅ Bulk operations - Migrate questions easily
3. ✅ Backup - Export questions as JSON backup
4. ✅ Sharing - Share question banks as JSON files

## Technical Details

### Functions Added:
- `importSeriesQuestionsFromJson()` - Import questions
- `aiFixSeriesJson()` - AI auto-fix
- `validateAndShowSeriesErrors()` - Error validation
- `exportSeriesQuestionsToJson()` - Export questions

### State Variables:
- `seriesJsonInput` - JSON textarea content
- `showSeriesJsonImport` - Toggle JSON/manual mode

### Same Logic as Subject Import:
- Identical AI algorithms
- Same error detection
- Same validation rules
- Consistent user experience

## Files Modified
- `src/Admin.jsx` - Added JSON import UI and functions for test series

## Testing Checklist
- [ ] Import valid JSON - should work
- [ ] Import JSON with errors - AI should fix
- [ ] Export questions - should copy to clipboard
- [ ] Toggle between JSON and manual mode
- [ ] Import 100+ questions - should be fast
- [ ] Check errors button - should show all errors
- [ ] AI fix button - should fix and beautify
- [ ] Cancel button - should clear and close

## Notes
- Same JSON format for both Subjects and Test Series
- Can copy questions from Subject and paste in Test Series
- AI is smart enough to handle most common errors
- Always review AI fixes before importing
- Export feature useful for backup and sharing
