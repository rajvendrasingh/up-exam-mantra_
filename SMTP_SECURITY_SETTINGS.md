# SMTP Security Settings Guide

## 🔒 Firebase SMTP Configuration

### Option 1: Gmail SMTP (RECOMMENDED)

#### Step 1: Gmail App Password Banao

1. **Google Account Settings:**
   ```
   https://myaccount.google.com/security
   ```

2. **2-Step Verification Enable Karo:**
   - Security > 2-Step Verification
   - Enable karo (agar already nahi hai)

3. **App Password Generate Karo:**
   - Security > App passwords
   - Select app: "Mail"
   - Select device: "Other (Custom name)"
   - Name: "Firebase UP Exam Mantra"
   - Generate click karo
   - 16-digit password copy karo

#### Step 2: Firebase SMTP Configure Karo

1. **Firebase Console:**
   ```
   https://console.firebase.google.com/project/up-exam-mantra/authentication/templates
   ```

2. **SMTP Settings Tab:**
   - Click on "SMTP settings"

3. **Gmail SMTP Details:**
   ```
   SMTP Server: smtp.gmail.com
   Port: 587
   Security: TLS/STARTTLS
   Username: your-email@gmail.com
   Password: [16-digit App Password]
   ```

4. **Save Settings**

---

## 📧 SMTP Security Modes

### TLS/STARTTLS (Port 587) - RECOMMENDED ✅

```
Port: 587
Security: TLS/STARTTLS
Encryption: Yes
Best for: Gmail, Outlook, most providers
```

**Use This For:**
- Gmail SMTP
- Outlook SMTP
- Most modern email providers
- Best security + compatibility

---

### SSL/TLS (Port 465)

```
Port: 465
Security: SSL/TLS
Encryption: Yes
Best for: Legacy systems
```

**Use This For:**
- Older email systems
- Some custom SMTP servers
- When port 587 blocked

---

### No Encryption (Port 25) - NOT RECOMMENDED ❌

```
Port: 25
Security: None
Encryption: No
Best for: Local testing only
```

**DON'T USE IN PRODUCTION!**

---

## 🎯 Recommended Configuration

### For Gmail (Best Option):

```
SMTP Host: smtp.gmail.com
Port: 587
Security Mode: TLS/STARTTLS
Username: your-gmail@gmail.com
Password: [App Password - 16 digits]
From Email: your-gmail@gmail.com
From Name: UP Exam Mantra
```

### For Outlook/Hotmail:

```
SMTP Host: smtp-mail.outlook.com
Port: 587
Security Mode: TLS/STARTTLS
Username: your-email@outlook.com
Password: [Your password]
From Email: your-email@outlook.com
From Name: UP Exam Mantra
```

### For SendGrid (Professional):

```
SMTP Host: smtp.sendgrid.net
Port: 587
Security Mode: TLS/STARTTLS
Username: apikey
Password: [SendGrid API Key]
From Email: noreply@yourdomain.com
From Name: UP Exam Mantra
```

---

## 🔧 Firebase Console Settings

### Complete Setup Steps:

1. **Open Firebase Console:**
   ```
   https://console.firebase.google.com/project/up-exam-mantra/authentication/templates
   ```

2. **Click "SMTP settings" tab**

3. **Fill Details:**
   ```
   SMTP Server: smtp.gmail.com
   Port: 587
   Security: TLS
   Username: [your-gmail@gmail.com]
   Password: [16-digit App Password]
   ```

4. **Test Configuration:**
   - Click "Test SMTP settings"
   - Enter test email
   - Send test email
   - Check if received

5. **Save Settings**

---

## ⚙️ Security Best Practices

### ✅ DO:

1. **Use App Passwords** (not regular passwords)
2. **Enable 2-Factor Authentication**
3. **Use TLS/STARTTLS** (Port 587)
4. **Use dedicated email** for sending
5. **Monitor email quota**
6. **Keep credentials secure**

### ❌ DON'T:

1. **Don't use regular Gmail password**
2. **Don't use Port 25** (no encryption)
3. **Don't share SMTP credentials**
4. **Don't hardcode passwords in code**
5. **Don't exceed email limits**

---

## 🚀 Quick Setup (Gmail)

### 5-Minute Setup:

**Step 1: Get App Password (2 min)**
```
1. https://myaccount.google.com/security
2. 2-Step Verification > Enable
3. App passwords > Generate
4. Copy 16-digit password
```

**Step 2: Configure Firebase (2 min)**
```
1. Firebase Console > Authentication > Templates
2. SMTP settings tab
3. Enter Gmail SMTP details
4. Save
```

**Step 3: Test (1 min)**
```
1. Send test email
2. Check inbox
3. Done!
```

---

## 🔍 Troubleshooting

### Issue 1: "Authentication Failed"

**Solution:**
- Use App Password, not regular password
- Enable 2-Step Verification first
- Check username is correct email

### Issue 2: "Connection Timeout"

**Solution:**
- Check port number (587 for TLS)
- Check firewall settings
- Try different security mode

### Issue 3: "SSL/TLS Error"

**Solution:**
- Use Port 587 with TLS/STARTTLS
- Don't use Port 465 unless required
- Update security settings

### Issue 4: "Quota Exceeded"

**Solution:**
- Gmail: 500 emails/day limit
- Wait 24 hours
- Use SendGrid for higher limits

---

## 📊 Email Provider Comparison

| Provider | Port | Security | Daily Limit | Cost |
|----------|------|----------|-------------|------|
| Gmail | 587 | TLS | 500 | Free |
| Outlook | 587 | TLS | 300 | Free |
| SendGrid | 587 | TLS | 100 (free) | Free/Paid |
| Firebase Default | - | - | 100 | Free |

---

## 💡 Recommendation

### Best Setup for Your Project:

**Use Gmail SMTP:**
```
✅ Free
✅ Reliable
✅ 500 emails/day
✅ Easy setup
✅ Good deliverability
```

**Configuration:**
```
Host: smtp.gmail.com
Port: 587
Security: TLS/STARTTLS
Username: your-gmail@gmail.com
Password: [App Password]
```

---

## 🎯 Final Steps

1. **Create Gmail App Password**
   - https://myaccount.google.com/security
   - 2-Step Verification > App passwords

2. **Configure in Firebase**
   - Authentication > Templates > SMTP settings
   - Enter Gmail SMTP details

3. **Test**
   - Send test email
   - Check delivery

4. **Done!**
   - Emails will work now

---

## 📞 Need Help?

**If still not working:**

1. Double-check App Password (16 digits)
2. Verify 2-Step Verification enabled
3. Try different Gmail account
4. Check Firebase Console logs
5. Wait 5-10 minutes after setup

---

**Security Mode:** TLS/STARTTLS (Port 587) ✅

**Best Provider:** Gmail SMTP ✅

**Setup Time:** 5 minutes ✅
