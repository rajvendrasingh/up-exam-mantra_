# Firebase Setup Guide for UP Exam Mantra

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `up-exam-mantra`
4. Disable Google Analytics (optional)
5. Click "Create Project"

## Step 2: Register Your Web App

1. In Firebase Console, click the **Web icon** (</>) to add a web app
2. Enter app nickname: `UP Exam Mantra Web`
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Copy the Firebase configuration object

## Step 3: Update Firebase Configuration

Open `src/firebase.js` and replace the configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 4: Enable Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (for development)
4. Select location (closest to your users)
5. Click "Enable"

## Step 5: Set Firestore Security Rules

Go to **Firestore Database** → **Rules** tab and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for all users (for development)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Note:** For production, implement proper authentication and security rules!

## Step 6: Test Firebase Connection

1. Run your app: `npm run dev`
2. Open browser console (F12)
3. Check for any Firebase errors
4. Try creating a subject in Admin panel
5. Check Firestore Database in Firebase Console to see if data is saved

## Collections Structure

Your Firestore will have these collections:

### `subjects`
```json
{
  "id": "auto-generated",
  "name": "Mathematics",
  "icon": "🔢",
  "questions": [
    {
      "q": "What is 2+2?",
      "options": ["2", "3", "4", "5", "6"],
      "answer": 2
    }
  ],
  "createdAt": "timestamp"
}
```

### `testSeries`
```json
{
  "id": "auto-generated",
  "name": "SSC Mock Test",
  "category": "GK",
  "difficulty": "Medium",
  "duration": 30,
  "questions": [...],
  "createdAt": "timestamp"
}
```

### `testHistory`
```json
{
  "id": "auto-generated",
  "userId": "default-user",
  "seriesName": "Mathematics",
  "score": 8.5,
  "totalQuestions": 10,
  "attempted": 10,
  "correct": 9,
  "wrong": 1,
  "unattempted": 0,
  "date": "timestamp"
}
```

### `userProfiles`
```json
{
  "id": "default-user",
  "name": "Student",
  "totalTests": 5,
  "totalScore": 42.5,
  "averageScore": "8.50",
  "bestScore": 10,
  "badges": []
}
```

## Features Enabled

✅ Real-time data sync across devices
✅ Cloud backup of all data
✅ Automatic data persistence
✅ Scalable database
✅ Multi-user support ready

## Toggle Firebase On/Off

The app works with both Firebase and localStorage:

- **Firebase OFF** (default): Data stored locally in browser
- **Firebase ON**: Data synced to cloud

To enable Firebase, you'll need to add a toggle in the Admin panel.

## Next Steps (Optional)

1. **Enable Authentication**: Add user login with Firebase Auth
2. **Security Rules**: Implement proper access control
3. **Hosting**: Deploy to Firebase Hosting
4. **Analytics**: Track user engagement
5. **Cloud Functions**: Add server-side logic

## Troubleshooting

### Error: "Firebase not initialized"
- Check if `src/firebase.js` has correct configuration
- Verify Firebase project is created

### Error: "Permission denied"
- Check Firestore security rules
- Make sure rules allow read/write

### Data not syncing
- Check browser console for errors
- Verify internet connection
- Check Firebase Console for data

## Support

For issues, check:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
