# Leaderboard Subject-Wise Update Plan

## Current Issue:
- Leaderboard shows only global rankings
- No subject-wise filtering
- Not shown after test completion

## Solution:

### Simple Approach (Recommended):
1. Add "View Leaderboard" button on test completion screen
2. Add subject/category filter dropdown in Leaderboard component
3. Save test category info when user completes test
4. Filter leaderboard by selected subject

### Implementation Steps:

1. **Update Test Completion Screen** (Mocktest.jsx):
   - Add "View Leaderboard" button
   - Pass current test category to Leaderboard

2. **Update Leaderboard Component**:
   - Add subject filter dropdown at top
   - Filter users by subject scores
   - Show "All Subjects" by default

3. **Update User Data Structure**:
   - Store subject-wise scores in user document
   - Example: `subjectScores: { "Polity": 85, "History": 92 }`

4. **Update Test Result Saving**:
   - Save test category/subject with result
   - Update user's subject-specific score

## Files to Modify:
- src/Mocktest.jsx (add button)
- src/Leaderboard.jsx (add filter)
- src/services/firestoreService.js (save subject scores)
- src/TestSeriesContext.jsx (update addTestResult)

## Benefits:
- Simple to implement
- Works with existing code
- User-friendly
- Scalable for multiple subjects
