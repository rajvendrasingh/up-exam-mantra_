# 🔑 OTP Password Reset System - Setup Guide

## ✅ System Overview

Your OTP-based password reset system is now ready! Here's how it works:

### 3-Step Process:
1. **User enters email** → System generates OTP from pre-generated pool
2. **OTP sent to email** → User receives 4-digit OTP (valid for 15 minutes, 3 attempts)
3. **After OTP verification** → Firebase sends password reset link to email

---

## 📋 Setup Instructions

### Step 1: Initialize OTP Pool (One-time setup)

1. **Login as Admin** to your website
2. Go to **Admin Panel** (🔐 Admin Login button)
3. You'll see **"🔑 OTP Pool Management"** section at the top
4. Click **"🔄 Initialize OTP Pool"** button
5. Confirm the action
6. Wait for 400 OTPs to be generated (takes ~10 seconds)
7. Click **"📊 Load Stats"** to verify OTPs are created

**Important:** Only do this ONCE when setting up the system!

---

### Step 2: Configure EmailJS (For sending OTP emails)

#### A. Create EmailJS Account (FREE)

1. Go to https://www.emailjs.com/
2. Click **"Sign Up"** (free account)
3. Verify your email

#### B. Add Email Service

1. In EmailJS dashboard, go to **"Email Services"**
2. Click **"Add New Service"**
3. Choose **Gmail** (recommended) or any other provider
4. Connect your Gmail account
5. Copy the **Service ID** (looks like: `service_abc123`)

#### C. Create Email Template

1. Go to **"Email Templates"**
2. Click **"Create New Template"**
3. Use this template:

```
Subject: Your OTP for Password Reset - {{app_name}}

Hello,

Your OTP for password reset is: {{otp_code}}

This OTP is valid for {{validity}}.

Do not share this OTP with anyone.

If you didn't request this, please ignore this email.

Best regards,
{{app_name}} Team
```

4. Make sure these variables are in the template:
   - `{{to_email}}` (recipient email)
   - `{{otp_code}}` (the OTP)
   - `{{app_name}}` (app name)
   - `{{validity}}` (validity period)
   - `{{message}}` (optional message)

5. Copy the **Template ID** (looks like: `template_xyz789`)

#### D. Get Public Key

1. Go to **"Account"** → **"General"**
2. Copy your **Public Key** (looks like: `abc123XYZ`)

#### E. Update .env File

Open `.env` file and update these values:

```env
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=abc123XYZ
```

Replace with your actual values from EmailJS dashboard.

---

### Step 3: Test the System

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Test password reset:**
   - Go to login page
   - Click **"Forgot Password?"**
   - Enter a registered email
   - Check your email for OTP
   - Enter OTP (4 digits)
   - After verification, check email for Firebase password reset link
   - Click the link and set new password

---

## 🔧 How It Works

### OTP Pool System
- 400 pre-generated 4-digit OTPs stored in Firestore
- Each OTP can only be used once
- When user requests password reset, one OTP is assigned
- OTP is marked as "used" after assignment
- Admin can monitor available OTPs in Admin Panel

### Email Delivery
- **Primary:** EmailJS sends OTP to user's email
- **Fallback:** If email fails, OTP is displayed on screen (for testing)
- **Production:** Configure EmailJS properly to ensure emails are delivered

### Security Features
- ✅ OTP valid for 15 minutes only
- ✅ Maximum 3 attempts to enter correct OTP
- ✅ OTP expires after time limit
- ✅ Each OTP can only be used once
- ✅ Firebase handles actual password reset securely

---

## 📊 Monitoring OTP Pool

### Check OTP Statistics

In Admin Panel, click **"📊 Load Stats"** to see:
- **Total OTPs:** 400 (initially)
- **Available:** Unused OTPs
- **Used:** OTPs already assigned

### When to Re-initialize

When available OTPs are low (< 50), click **"🔄 Initialize OTP Pool"** again to generate 400 new OTPs.

**Warning:** This will create NEW OTPs, not replace existing ones. Old unused OTPs will still be available.

---

## 🚀 Deployment

### Before Deploying to Firebase:

1. ✅ Initialize OTP pool (done in Admin Panel)
2. ✅ Configure EmailJS (update .env file)
3. ✅ Test locally (verify emails are sent)
4. ✅ Build and deploy:

```bash
npm run build
firebase deploy
```

---

## 🐛 Troubleshooting

### OTP Email Not Received

**Check:**
1. EmailJS Service ID, Template ID, and Public Key are correct in `.env`
2. EmailJS service is connected to your Gmail
3. Check spam/junk folder
4. Verify email template has correct variables
5. Check EmailJS dashboard for error logs

**Temporary Solution:**
If email fails, OTP will be displayed on screen for testing.

### OTP Pool Empty

**Solution:**
Go to Admin Panel → Click "🔄 Initialize OTP Pool"

### OTP Verification Failed

**Possible Reasons:**
- OTP expired (15 minutes limit)
- Too many incorrect attempts (3 max)
- OTP already used
- Wrong OTP entered

**Solution:**
Click "← Request New OTP" to get a fresh OTP

### Firebase Password Reset Email Not Received

**Check:**
1. Firebase email templates are configured
2. Email is registered in Firebase Auth
3. Check spam/junk folder
4. Wait a few minutes (can be delayed)

---

## 📝 Files Modified

### New Files Created:
- `src/services/otpService.js` - OTP generation, verification, email sending
- `src/components/OTPPasswordReset.jsx` - 3-step password reset UI
- `src/components/OTPPoolManager.jsx` - Admin OTP pool management

### Files Updated:
- `src/Auth.jsx` - Added OTP password reset integration
- `src/Admin.jsx` - Added OTP Pool Manager to dashboard
- `.env` - Added EmailJS configuration

---

## 🎯 Next Steps

1. ✅ Initialize OTP pool in Admin Panel
2. ✅ Configure EmailJS for email sending
3. ✅ Test the complete flow locally
4. ✅ Deploy to Firebase
5. ✅ Monitor OTP pool usage
6. ✅ Re-initialize pool when needed

---

## 💡 Tips

- **For Testing:** If EmailJS is not configured, OTP will be displayed on screen
- **For Production:** Always configure EmailJS to send actual emails
- **Security:** Never share OTPs or display them in production logs
- **Monitoring:** Check OTP pool stats regularly in Admin Panel
- **Backup:** Keep EmailJS credentials secure and backed up

---

## 📞 Support

If you face any issues:
1. Check browser console for error messages
2. Verify all configuration values in `.env`
3. Test EmailJS separately at https://www.emailjs.com/
4. Check Firebase console for authentication errors
5. Review Firestore rules for `otpPool` and `passwordResets` collections

---

**System Status:** ✅ Ready to use (after EmailJS configuration)

**Last Updated:** March 5, 2026
