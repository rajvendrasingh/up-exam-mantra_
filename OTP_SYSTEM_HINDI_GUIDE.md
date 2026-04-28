# 🔑 OTP Password Reset System - हिंदी गाइड

## ✅ सिस्टम तैयार है!

आपका OTP-based password reset system अब तैयार है! यह कैसे काम करता है:

### 3 स्टेप प्रोसेस:
1. **यूजर ईमेल डालता है** → सिस्टम OTP generate करता है
2. **OTP ईमेल पर भेजा जाता है** → यूजर को 4-digit OTP मिलता है (15 मिनट valid, 3 attempts)
3. **OTP verify होने के बाद** → Firebase password reset link भेजता है

---

## 📋 सेटअप करने के लिए

### Step 1: OTP Pool Initialize करें (सिर्फ एक बार)

1. **Admin Login** करें अपनी website पर
2. **Admin Panel** में जाएं (🔐 Admin Login button)
3. ऊपर **"🔑 OTP Pool Management"** section दिखेगा
4. **"🔄 Initialize OTP Pool"** button पर क्लिक करें
5. Confirm करें
6. 400 OTPs generate होने का wait करें (~10 seconds)
7. **"📊 Load Stats"** पर क्लिक करके verify करें

**जरूरी:** यह सिर्फ एक बार करना है setup के समय!

---

### Step 2: EmailJS Configure करें (OTP email भेजने के लिए)

#### A. EmailJS Account बनाएं (FREE)

1. https://www.emailjs.com/ पर जाएं
2. **"Sign Up"** पर क्लिक करें (free account)
3. अपना email verify करें

#### B. Email Service Add करें

1. EmailJS dashboard में **"Email Services"** पर जाएं
2. **"Add New Service"** पर क्लिक करें
3. **Gmail** चुनें (recommended)
4. अपना Gmail account connect करें
5. **Service ID** copy करें (जैसे: `service_abc123`)

#### C. Email Template बनाएं

1. **"Email Templates"** पर जाएं
2. **"Create New Template"** पर क्लिक करें
3. यह template use करें:

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

4. ये variables जरूर होने चाहिए:
   - `{{to_email}}` (recipient email)
   - `{{otp_code}}` (OTP)
   - `{{app_name}}` (app name)
   - `{{validity}}` (validity period)

5. **Template ID** copy करें (जैसे: `template_xyz789`)

#### D. Public Key लें

1. **"Account"** → **"General"** में जाएं
2. **Public Key** copy करें (जैसे: `abc123XYZ`)

#### E. .env File Update करें

`.env` file खोलें और ये values update करें:

```env
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=abc123XYZ
```

अपनी actual values से replace करें।

---

### Step 3: Test करें

1. **Development server restart करें:**
   ```bash
   npm run dev
   ```

2. **Password reset test करें:**
   - Login page पर जाएं
   - **"Forgot Password?"** पर क्लिक करें
   - Registered email डालें
   - Email में OTP check करें
   - OTP enter करें (4 digits)
   - Verification के बाद, Firebase password reset link के लिए email check करें
   - Link पर क्लिक करके new password set करें

---

## 🚀 Deploy करें

### Firebase पर Deploy करने से पहले:

1. ✅ OTP pool initialize करें (Admin Panel में)
2. ✅ EmailJS configure करें (.env file update करें)
3. ✅ Locally test करें
4. ✅ Build और deploy करें:

```bash
npm run build
firebase deploy
```

---

## 🐛 Problems और Solutions

### OTP Email नहीं आ रहा

**Check करें:**
1. EmailJS Service ID, Template ID, और Public Key सही हैं `.env` में
2. EmailJS service Gmail से connected है
3. Spam/junk folder check करें
4. Email template में सही variables हैं
5. EmailJS dashboard में error logs check करें

**Temporary Solution:**
अगर email fail हो तो OTP screen पर दिखेगा (testing के लिए)

### OTP Pool खाली हो गया

**Solution:**
Admin Panel → "🔄 Initialize OTP Pool" पर क्लिक करें

### OTP Verification Failed

**Possible Reasons:**
- OTP expire हो गया (15 minutes limit)
- बहुत ज्यादा गलत attempts (3 max)
- OTP पहले से use हो चुका है
- गलत OTP डाला

**Solution:**
"← Request New OTP" पर क्लिक करके नया OTP लें

---

## 📊 OTP Pool Monitor करें

Admin Panel में **"📊 Load Stats"** पर क्लिक करके देखें:
- **Total OTPs:** 400 (initially)
- **Available:** Unused OTPs
- **Used:** Already assigned OTPs

जब available OTPs कम हों (< 50), तो फिर से initialize करें।

---

## 💡 Important Tips

- **Testing के लिए:** अगर EmailJS configured नहीं है, तो OTP screen पर दिखेगा
- **Production के लिए:** हमेशा EmailJS configure करें actual emails के लिए
- **Security:** कभी भी OTPs share न करें
- **Monitoring:** Regular OTP pool stats check करें Admin Panel में

---

## ✅ System Status

**Status:** तैयार है (EmailJS configuration के बाद)

**Files बनाई गईं:**
- `src/services/otpService.js` - OTP generation और verification
- `src/components/OTPPasswordReset.jsx` - Password reset UI
- `src/components/OTPPoolManager.jsx` - Admin OTP management
- `OTP_SYSTEM_SETUP.md` - Complete English guide
- `OTP_SYSTEM_HINDI_GUIDE.md` - यह Hindi guide

**अगला कदम:**
1. Admin Panel में login करें
2. OTP Pool initialize करें
3. EmailJS configure करें
4. Test करें
5. Deploy करें

---

**Last Updated:** March 5, 2026
