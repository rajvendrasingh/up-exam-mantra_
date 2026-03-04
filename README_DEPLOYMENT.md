# 🎓 UP Exam Mantra - Complete Deployment Guide
## Live at: upexammantra.com

---

## 🚀 Quick Start (3 Commands)

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Build and Deploy
npm run build && firebase deploy --only hosting
```

**Done!** Your site is live at `https://up-exam-mantra.web.app`

---

## 🌐 Connect Custom Domain: upexammantra.com

### Step 1: Add Domain in Firebase

1. Open: https://console.firebase.google.com/project/up-exam-mantra/hosting
2. Click **"Add custom domain"**
3. Enter: `upexammantra.com`
4. Click **"Continue"**

### Step 2: Verify Ownership

Firebase will show a TXT record like:

```
Type: TXT
Name: @
Value: google-site-verification=xxxxxxxxxxxxx
```

**Add this in your domain DNS settings** (where you bought the domain)

### Step 3: Add DNS Records

After verification, add these A records:

```
Type: A
Name: @
Value: 151.101.1.195
TTL: 3600

Type: A
Name: @
Value: 151.101.65.195
TTL: 3600
```

And CNAME for www:

```
Type: CNAME
Name: www
Value: up-exam-mantra.web.app
TTL: 3600
```

### Step 4: Wait

- DNS propagation: **1-48 hours**
- SSL certificate: **Automatic** (FREE)
- Check status: https://dnschecker.org

---

## 📁 Project Structure

```
up-exam-mantra/
├── exam-portal/          # React app source
│   ├── src/
│   │   ├── Admin.jsx     # Admin panel
│   │   ├── Home.jsx      # Home page
│   │   ├── Mocktest.jsx  # Test interface
│   │   └── ...
│   ├── public/
│   └── package.json
├── firebase.json         # Firebase config ✅
├── .firebaserc          # Firebase project ✅
├── deploy.bat           # Windows deploy script ✅
├── deploy.sh            # Linux/Mac deploy script ✅
└── DEPLOYMENT_GUIDE.md  # Full guide ✅
```

---

## 🖥️ Deploy Commands

### Windows Users:
```bash
# Double click or run:
deploy.bat
```

### Mac/Linux Users:
```bash
# Make executable (first time only)
chmod +x deploy.sh

# Run
./deploy.sh
```

### Manual Deploy:
```bash
cd exam-portal
npm run build
cd ..
firebase deploy --only hosting
```

---

## 🔄 Update Website (After Changes)

```bash
cd exam-portal
npm run build
cd ..
firebase deploy --only hosting
```

Changes go live in **30 seconds**! 🚀

---

## 📊 Firebase Hosting Benefits

✅ **FREE Plan Includes:**
- 10GB Storage
- 360MB/day Bandwidth
- Unlimited custom domains
- Free SSL certificates (Auto-renewed)
- Global CDN (Fast worldwide)
- 99.95% Uptime SLA

✅ **Features:**
- Automatic HTTPS
- HTTP/2 Support
- Gzip Compression
- Rollback to previous versions
- Custom headers & redirects

---

## 🎯 Admin Access

**Admin Login:**
- URL: https://upexammantra.com
- Click "Admin Login" button
- Username: `yogendra`
- Password: `yug@123`

---

## 🔧 Troubleshooting

### "Firebase command not found"
```bash
npm install -g firebase-tools
```

### "Permission denied" (Mac/Linux)
```bash
sudo npm install -g firebase-tools
```

### Build fails
```bash
cd exam-portal
rm -rf node_modules build
npm install
npm run build
```

### Domain not working
1. Wait 24-48 hours for DNS
2. Check DNS records are correct
3. Verify at: https://dnschecker.org
4. Check Firebase Console for SSL status

---

## 📱 Test Locally Before Deploy

```bash
cd exam-portal
npm start
```

Open: http://localhost:3000

---

## 🎨 Features Included

✅ Test Series Management
✅ Section & Test Organization
✅ Question Bank with Images
✅ Bulk Upload (JSON)
✅ AI Question Generator
✅ Bulk Delete Questions
✅ Mock Test Interface
✅ Timer & Navigation
✅ Score Calculation
✅ Review Mode
✅ Notifications System
✅ Firebase Integration
✅ Responsive Design

---

## 📞 Need Help?

**Firebase Console:**
https://console.firebase.google.com/project/up-exam-mantra

**Firebase Hosting Docs:**
https://firebase.google.com/docs/hosting

**Check DNS Propagation:**
https://dnschecker.org

---

## ✅ Deployment Checklist

- [ ] Firebase CLI installed
- [ ] Logged into Firebase (`firebase login`)
- [ ] App builds successfully (`npm run build`)
- [ ] Deployed to Firebase (`firebase deploy`)
- [ ] Site live at up-exam-mantra.web.app
- [ ] Custom domain added in Firebase Console
- [ ] TXT record added for verification
- [ ] A records added for upexammantra.com
- [ ] CNAME record added for www.upexammantra.com
- [ ] DNS propagated (check dnschecker.org)
- [ ] SSL certificate active (automatic)
- [ ] Site live at https://upexammantra.com ✅

---

## 🎉 Success!

Your website is now live at:
- 🌐 https://upexammantra.com
- 🌐 https://www.upexammantra.com
- 🌐 https://up-exam-mantra.web.app

**Total Cost:** ₹0 (FREE) 🎊

**Deployment Time:** 
- Initial setup: 10 minutes
- Future updates: 30 seconds

---

**Made with ❤️ for UP Exam Mantra**
