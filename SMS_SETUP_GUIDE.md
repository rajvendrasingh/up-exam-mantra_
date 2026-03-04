# SMS OTP Setup Guide

## 🚀 How to Send OTP to User's Phone

Your app now supports 3 SMS providers. Choose one based on your needs:

---

## 📱 Option 1: MSG91 (Recommended for India)

**Best for:** Indian phone numbers, affordable, reliable

### Steps:

1. **Sign Up:**
   - Go to https://msg91.com
   - Create free account
   - Get 100 free SMS credits

2. **Get API Key:**
   - Login to MSG91 dashboard
   - Go to "API" section
   - Copy your **Auth Key**

3. **Create OTP Template:**
   - Go to "SMS" → "Templates"
   - Click "Create Template"
   - Template content: `Your UP Exam Mantra OTP is ##OTP##. Valid for 5 minutes.`
   - Submit for approval (takes 1-2 hours)
   - Copy **Template ID** after approval

4. **Update Code:**
   ```javascript
   // In src/Auth.jsx, line ~30
   const msg91AuthKey = "YOUR_MSG91_AUTH_KEY"; // Replace with your key
   const msg91TemplateId = "YOUR_TEMPLATE_ID"; // Replace with template ID
   ```

5. **Pricing:**
   - ₹0.15 - ₹0.25 per SMS
   - 100 free SMS on signup

---

## 📱 Option 2: Fast2SMS (Easy Setup)

**Best for:** Quick testing, Indian numbers

### Steps:

1. **Sign Up:**
   - Go to https://www.fast2sms.com
   - Create free account
   - Get 50 free SMS credits

2. **Get API Key:**
   - Login to dashboard
   - Go to "Dev API" section
   - Copy your **API Key**

3. **Update Code:**
   ```javascript
   // In src/Auth.jsx, line ~40
   const fast2smsApiKey = "YOUR_FAST2SMS_API_KEY"; // Replace with your key
   ```

4. **Pricing:**
   - ₹0.15 - ₹0.20 per SMS
   - 50 free SMS on signup

---

## 📱 Option 3: Twilio (International)

**Best for:** International numbers, most reliable

### Steps:

1. **Sign Up:**
   - Go to https://www.twilio.com
   - Create free account
   - Get $15 free credit

2. **Get Credentials:**
   - Login to Twilio Console
   - Copy **Account SID**
   - Copy **Auth Token**
   - Get a **Phone Number** (free trial number)

3. **Update Code:**
   ```javascript
   // In src/Auth.jsx, line ~55
   const twilioAccountSid = "YOUR_TWILIO_ACCOUNT_SID";
   const twilioAuthToken = "YOUR_TWILIO_AUTH_TOKEN";
   const twilioPhoneNumber = "YOUR_TWILIO_PHONE_NUMBER"; // e.g., +15551234567
   ```

4. **Pricing:**
   - $0.0079 per SMS to India (~₹0.65)
   - $15 free credit on signup

---

## 🔧 Implementation Details

### Current Code Structure:

The `sendOTPviaSMS()` function tries providers in order:
1. **MSG91** (tries first)
2. **Fast2SMS** (backup if MSG91 fails)
3. **Twilio** (backup if both fail)

If all fail, OTP is shown on screen as fallback.

### Security Notes:

⚠️ **IMPORTANT:** Never expose API keys in frontend code in production!

**Better approach for production:**

1. Create a backend API (Node.js/Express)
2. Store API keys in backend environment variables
3. Frontend calls your backend
4. Backend sends SMS using API keys

### Example Backend Setup:

```javascript
// backend/server.js (Node.js + Express)
const express = require('express');
const app = express();

app.post('/api/send-otp', async (req, res) => {
  const { phone, otp } = req.body;
  
  // Use MSG91 API
  const response = await fetch(`https://api.msg91.com/api/v5/otp?authkey=${process.env.MSG91_KEY}&mobile=91${phone}&otp=${otp}`);
  
  res.json({ success: true });
});

app.listen(3001);
```

Then update frontend:
```javascript
// src/Auth.jsx
const sendOTPviaSMS = async (phoneNumber, otpCode) => {
  const response = await fetch('http://localhost:3001/api/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: phoneNumber, otp: otpCode })
  });
  return response.json();
};
```

---

## 🧪 Testing Without SMS (Current Setup)

For now, OTP is shown in:
1. **Browser Console** (F12 → Console tab)
2. **Yellow box on screen** (for easy testing)

This works perfectly for development!

---

## 📊 Comparison Table

| Provider | Best For | Free Credits | Price/SMS | Setup Time |
|----------|----------|--------------|-----------|------------|
| MSG91 | India | 100 SMS | ₹0.15-0.25 | 2 hours (template approval) |
| Fast2SMS | India | 50 SMS | ₹0.15-0.20 | 5 minutes |
| Twilio | International | $15 | ₹0.65 | 10 minutes |

---

## 🎯 Recommended Setup

**For Development:**
- Use current setup (OTP in console)
- No cost, instant testing

**For Production:**
1. Choose **MSG91** or **Fast2SMS**
2. Create backend API
3. Store keys in environment variables
4. Never expose keys in frontend

---

## 🆘 Need Help?

**MSG91 Support:** support@msg91.com
**Fast2SMS Support:** https://www.fast2sms.com/contact
**Twilio Support:** https://www.twilio.com/help

---

## ✅ Quick Start (5 Minutes)

1. Sign up for **Fast2SMS** (fastest)
2. Get API key
3. Replace `YOUR_FAST2SMS_API_KEY` in `src/Auth.jsx`
4. Test with your phone number
5. Done! 🎉
