# ✅ Firebase Setup Checklist

## Your Firebase Configuration
✅ **DONE** - Firebase config added to `src/firebase.js`

**Project Details:**
- Project ID: `up-exam-mantra`
- Auth Domain: `up-exam-mantra.firebaseapp.com`

---

## Next Steps (Complete These Now)

### Step 1: Enable Firestore Database ⚠️ REQUIRED

1. Go to: https://console.firebase.google.com/project/up-exam-mantra/firestore
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select location: **asia-south1** (Mumbai, India - closest to you)
5. Click **"Enable"**

**Why?** Without this, your app cannot save data to Firebase.

---

### Step 2: Set Firestore Security Rules

After enabling Firestore:

1. Go to **Firestore Database** → **Rules** tab
2. Replace with this code:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for all users (DEVELOPMENT ONLY)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click **"Publish"**

**⚠️ Warning:** This allows anyone to read/write. For production, add proper authentication!

---

### Step 3: Test Your Setup

1. Run your app:
   ```bash
   npm run dev
   ```

2. Open browser: http://localhost:5173

3. Login to Admin (password: `admin123`)

4. Look at top-right corner - you'll see:
   ```
   💾 Local Storage
   [Switch to Cloud] button
   ```

5. Click **"Switch to Cloud"** or **"Sync to Cloud"**

6. Create a test subject

7. Check Firebase Console → Firestore Database
   - You should see a new collection: `subjects`
   - Your test data should appear there

---

## Verification Steps

### ✅ Check 1: Firebase Console
- Go to: https://console.firebase.google.com/project/up-exam-mantra/firestore/data
- You should see collections: `subjects`, `testSeries`, etc.

### ✅ Check 2: Browser Console
- Press F12 in browser
- Check for any Firebase errors
- Should see: "Firebase initialized successfully" (or no errors)

### ✅ Check 3: Data Sync
- Create a subject in Admin panel
- Refresh the page
- Data should persist (loaded from Firebase)

---

## Quick Commands

```bash
# Start development server
npm run dev

# Check for errors
npm run lint

# Build for production
npm run build
```

---

## Current Status

✅ Firebase SDK installed
✅ Configuration added
⏳ Firestore Database - **YOU NEED TO ENABLE THIS**
⏳ Security Rules - **SET AFTER ENABLING FIRESTORE**
⏳ Test the connection

---

## Troubleshooting

### Error: "Firebase: Error (auth/configuration-not-found)"
**Solution:** Enable Firestore Database in Firebase Console

### Error: "Missing or insufficient permissions"
**Solution:** Update Firestore security rules to allow read/write

### Error: "Network request failed"
**Solution:** Check internet connection

### Data not appearing in Firebase
**Solution:** 
1. Make sure you clicked "Switch to Cloud" in Admin panel
2. Check browser console for errors
3. Verify Firestore is enabled

---

## Support Links

- Firebase Console: https://console.firebase.google.com/project/up-exam-mantra
- Firestore Database: https://console.firebase.google.com/project/up-exam-mantra/firestore
- Documentation: https://firebase.google.com/docs/firestore

---

## What's Next?

After completing the checklist:

1. ✅ Your app will save data to cloud
2. ✅ Access from any device
3. ✅ Automatic backup
4. ✅ Real-time sync

**Ready to go!** 🚀
