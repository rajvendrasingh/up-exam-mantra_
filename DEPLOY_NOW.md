# 🚀 Deploy UP Exam Mantra to upexammantra.com

## ⚡ Quick Deploy (Copy & Paste These Commands)

### Step 1: Install Firebase CLI (One-time only)
```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase
```bash
firebase login
```
This will open your browser. Login with your Google account that has access to Firebase project "up-exam-mantra".

### Step 3: Build Your App
```bash
npm run build
```

### Step 4: Deploy to Firebase
```bash
firebase deploy --only hosting
```

**Done!** Your site is now live at: `https://up-exam-mantra.web.app`

---

## 🌐 Connect Custom Domain: upexammantra.com

### Step 1: Open Firebase Console
Go to: https://console.firebase.google.com/project/up-exam-mantra/hosting/main

### Step 2: Click "Add custom domain"
- Enter: `upexammantra.com`
- Click "Continue"

### Step 3: Verify Domain Ownership
Firebase will show you a TXT record like:
```
Type: TXT
Name: @
Value: google-site-verification=xxxxxxxxxx
```

**Add this record in your domain provider's DNS settings** (where you bought upexammantra.com)

### Step 4: Add DNS Records
After verification, Firebase will show you these records:

**A Records (for upexammantra.com):**
```
Type: A
Name: @
Value: 151.101.1.195

Type: A
Name: @
Value: 151.101.65.195
```

**CNAME Record (for www.upexammantra.com):**
```
Type: CNAME
Name: www
Value: up-exam-mantra.web.app
```

### Step 5: Wait for DNS Propagation
- Usually takes 1-2 hours
- Can take up to 24-48 hours
- Check status at: https://dnschecker.org

### Step 6: SSL Certificate (Automatic)
Firebase will automatically provision a FREE SSL certificate once DNS is verified.

---

## ✅ Your Website Will Be Live At:
- ✅ https://upexammantra.com
- ✅ https://www.upexammantra.com
- ✅ https://up-exam-mantra.web.app

All with FREE SSL (HTTPS) 🔒

---

## 🔄 Future Updates (After Making Changes)

Just run these 2 commands:
```bash
npm run build
firebase deploy --only hosting
```

Changes go live in 30 seconds! 🚀

---

## 🆘 Troubleshooting

### "firebase: command not found"
```bash
npm install -g firebase-tools
```

### "Permission denied" (Mac/Linux)
```bash
sudo npm install -g firebase-tools
```

### Build fails
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Domain not connecting
1. Wait 24-48 hours for DNS propagation
2. Verify DNS records are correct
3. Check at: https://dnschecker.org
4. Check Firebase Console for SSL status

---

## 📞 Where to Add DNS Records?

**GoDaddy:**
My Products → Domains → DNS Management

**Namecheap:**
Domain List → Manage → Advanced DNS

**Hostinger:**
Domains → DNS Zone Editor

**Google Domains:**
My Domains → DNS

**Cloudflare:**
DNS → Records

---

## 💰 Cost: ₹0 (FREE)

Firebase Hosting Free Tier includes:
- 10GB Storage
- 360MB/day Bandwidth
- Unlimited custom domains
- Free SSL certificates
- Global CDN

---

**Need help? Check the full guide in DEPLOYMENT_GUIDE.md**
