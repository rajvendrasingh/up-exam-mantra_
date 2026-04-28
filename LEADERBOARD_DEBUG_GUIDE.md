# 🐛 Leaderboard Debugging Guide

## Current Status

The leaderboard has been updated with:
- ✅ Global leaderboard removed (as requested)
- ✅ Only test-specific leaderboard remains
- ✅ Test ID format fixed to match: `${seriesId}_${sectionId}_${testId}`
- ✅ Enhanced console logging added for debugging

## How to Debug

### Step 1: Check Browser Console

1. Open the website: `https://up-exam-mantra.web.app/leaderboard`
2. Open browser console (F12 or Right-click → Inspect → Console)
3. Look for these log messages:

```
🔍 Extracting tests from testSeries: X series found
📦 Series: [Series Name] Status: active
  📂 Section: [Section Name]
    📝 Test: [Test Name] Status: active
    ✅ Adding test with ID: [testId]
📋 Available tests for leaderboard: [array of tests]
```

### Step 2: Select a Test

1. Select a test from the dropdown
2. Check console for:

```
📊 Fetching leaderboard for test: [testId]
✅ Leaderboard results: X results
```

### Step 3: Verify Test Results in Firestore

1. Go to Firebase Console: https://console.firebase.google.com/project/up-exam-mantra/firestore
2. Open `testResults` collection
3. Check if documents exist with matching `testId` field
4. Verify the testId format matches: `seriesId_sectionId_testId`

### Step 4: Complete a Test to Generate Data

If no data exists:
1. Login as a student
2. Go to Mocktest page
3. Select and complete a test
4. Check console for:

```
🔑 Setting completedTestId: [testId]
💾 Saving test result to Firestore: [data]
✅ Test-specific result saved for leaderboard
```

5. Go back to Leaderboard and select the same test

## Common Issues

### Issue 1: No Tests in Dropdown
**Cause:** Test series might be in "draft" status
**Solution:** 
- Go to Admin Panel
- Check test series status (should be "active")
- Check section status (should be "active")
- Check individual test status (should be "active")

### Issue 2: Test Selected but No Data
**Cause:** No one has completed this test yet
**Solution:** Complete the test first to generate leaderboard data

### Issue 3: TestId Mismatch
**Cause:** Old test results saved with different testId format
**Solution:** 
- Complete the test again (it will update the result)
- Or manually update testId in Firestore

## Test Result Data Structure

Each test result in Firestore should have:
```javascript
{
  userId: "user123",
  userName: "Student Name",
  userEmail: "student@example.com",
  testId: "seriesId_sectionId_testId",  // IMPORTANT: Must match this format
  testTitle: "Test Name",
  seriesTitle: "Series Name",
  sectionTitle: "Section Name",
  score: 15,
  totalQuestions: 20,
  correctAnswers: 15,
  wrongAnswers: 3,
  skippedAnswers: 2,
  timeTaken: 1200,  // in seconds
  percentage: 75.00,
  completedAt: Timestamp,
  attemptCount: 1
}
```

## Next Steps

1. Check browser console logs when visiting leaderboard
2. Verify test series/sections/tests are all "active" status
3. Complete a test to generate sample data
4. Check if leaderboard shows the data
5. Share console logs if issue persists

---

**Note:** The enhanced logging will help identify exactly where the issue is occurring.
