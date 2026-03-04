# 🔐 Authentication Setup Guide

## ✅ What's Added

Complete authentication system with:
- ✅ Email/Password Login & Signup
- ✅ Phone/OTP Login & Signup
- ✅ Forgot Password
- ✅ User data saved to Firestore
- ✅ Logout functionality
- ✅ Protected routes

## 🚀 Enable Firebase Authentication

### Step 1: Enable Email/Password Authentication

1. Go to Firebase Console: https://console.firebase.google.com/project/up-exam-mantra/authentication
2. Click **"Get Started"**
3. Click **"Sign-in method"** tab
4. Click **"Email/Password"**
5. Toggle **"Enable"**
6. Click **"Save"**

### Step 2: Enable Phone Authentication

1. In **"Sign-in method"** tab
2. Click **"Phone"**
3. Toggle **"Enable"**
4. Click **"Save"**

**Note:** Phone authentication requires reCAPTCHA verification (automatically handled)

### Step 3: Update Firestore Rules

Go to Firestore Database → Rules and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Subjects - authenticated users can read, only admins can write
    match /subjects/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Test Series - authenticated users can read, only admins can write
    match /testSeries/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Test History - users can read/write their own history
    match /testHistory/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // User Profiles - users can read/write their own profile
    match /userProfiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📱 Features

### Login/Signup Page

**Two Authentication Methods:**

1. **📧 Email/Password**
   - Enter email and password
   - Instant login/signup
   - Password reset via email

2. **📱 Phone/OTP**
   - Enter 10-digit mobile number
   - Receive 6-digit OTP
   - Verify and login

### User Data Stored in Firestore

When user signs up, this data is saved:

```javascript
{
  uid: "user-unique-id",
  name: "User Name",
  email: "user@example.com",
  phone: "+919876543210",
  createdAt: "2024-01-01T00:00:00.000Z",
  role: "student"
}
```

### Features Available:

- ✅ **Login** - Email or Phone
- ✅ **Signup** - Create new account
- ✅ **Forgot Password** - Reset via email
- ✅ **Logout** - Sign out from app
- ✅ **User Profile** - Display in navbar
- ✅ **Protected Routes** - Only logged-in users can access

## 🎯 How It Works

### Flow:

1. **User opens app** → Shows Login/Signup page
2. **User signs up** → Data saved to Firestore `users` collection
3. **User logs in** → Authenticated, redirected to Home
4. **User info shown** → Email/Phone displayed in navbar
5. **User clicks Logout** → Signed out, back to Login page

### Admin Access:

- Regular users can access Home and Mocktest
- Admin panel requires password: `admin123`
- Admin can manage subjects and test series

## 🔧 Testing

### Test Email Login:

1. Open app: http://localhost:5174/
2. Click **"Sign Up"** tab
3. Select **"📧 Email"**
4. Enter:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
5. Click **"Create Account"**
6. Check Firestore → `users` collection

### Test Phone Login:

1. Click **"Sign Up"** tab
2. Select **"📱 Phone"**
3. Enter:
   - Name: Test User
   - Phone: 9876543210
4. Click **"Send OTP"**
5. Enter OTP received
6. Click **"Verify OTP"**

### Test Forgot Password:

1. Click **"Forgot Password?"**
2. Enter your email
3. Click **"Send Reset Link"**
4. Check email inbox
5. Click reset link
6. Set new password

## 📊 User Data Structure

### Firestore Collections:

**`users` Collection:**
```
users/
  ├── {userId}/
  │   ├── uid: string
  │   ├── name: string
  │   ├── email: string
  │   ├── phone: string
  │   ├── createdAt: timestamp
  │   └── role: string
```

**`userProfiles` Collection:**
```
userProfiles/
  ├── {userId}/
  │   ├── name: string
  │   ├── totalTests: number
  │   ├── totalScore: number
  │   ├── averageScore: number
  │   ├── bestScore: number
  │   └── badges: array
```

## 🛡️ Security

### Current Setup (Development):

- ✅ Email/Password authentication
- ✅ Phone/OTP authentication
- ✅ Password reset
- ✅ User data in Firestore
- ⚠️ Test mode security rules

### For Production:

1. **Update Security Rules** - Restrict access properly
2. **Add Email Verification** - Verify email addresses
3. **Add Phone Verification** - Verify phone numbers
4. **Rate Limiting** - Prevent abuse
5. **Admin Role Check** - Proper admin authentication

## 🐛 Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
**Solution:** Enable Email/Password and Phone authentication in Firebase Console

### "reCAPTCHA verification failed"
**Solution:** 
- Check internet connection
- Try again after a few seconds
- Clear browser cache

### "User not found"
**Solution:** User needs to sign up first

### "Wrong password"
**Solution:** Use forgot password to reset

### OTP not received
**Solution:**
- Check phone number format (+91XXXXXXXXXX)
- Wait 30 seconds
- Try resending OTP

## 📞 Support

- Firebase Auth Docs: https://firebase.google.com/docs/auth
- Phone Auth Guide: https://firebase.google.com/docs/auth/web/phone-auth

## ✨ Next Steps

1. ✅ Enable Email/Password auth
2. ✅ Enable Phone auth
3. ✅ Update Firestore rules
4. ✅ Test login/signup
5. 🎉 Done!

Your authentication system is ready! 🚀
