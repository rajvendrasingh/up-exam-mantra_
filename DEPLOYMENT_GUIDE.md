# 🚀 UP Exam Mantra - Deployment Guide
## Domain: upexammantra.com

---

## 📋 Prerequisites

1. **Node.js** installed (v14 or higher)
2. **Firebase CLI** installed
3. **Firebase Project**: up-exam-mantra (Already configured ✅)

---

## 🔧 Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

---

## 🔑 Step 2: Login to Firebase

```bash
firebase login
```

This will open browser for authentication.

---

## 📦 Step 3: Build Your App

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

---

## 🚀 Step 4: Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

Your site will be live at: `https://up-exam-mantra.web.app`

---

## 🌐 Step 5: Connect Custom Domain (upexammantra.com)

### A. Add Domain in Firebase Console

1. Go to: https://console.firebase.google.com/project/up-exam-mantra/hosting
2. Click **"Add custom domain"**
3. Enter: `upexammantra.com`
4. Click **"Continue"**

### B. Verify Domain Ownership

Firebase will show you a TXT record to add:

```
Type: TXT
Name: @
Value: [Firebase will provide this]
TTL: 3600
```

Add this in your domain provider's DNS settings.

### C. Add DNS Records

After verification, Firebase will provide these records:

**For Root Domain (upexammantra.com):**
```
Type: A
Name: @
Value: [Firebase IP addresses - usually 4 IPs]
TTL: 3600
```

**For WWW Subdomain (www.upexammantra.com):**
```
Type: CNAME
Name: www
Value: up-exam-mantra.web.app
TTL: 3600
```

### D. Where to Add DNS Records?

Go to your domain provider (where you bought upexammantra.com):
- **GoDaddy**: My Products → Domains → DNS Management
- **Namecheap**: Domain List → Manage → Advanced DNS
- **Hostinger**: Domains → DNS Zone Editor
- **Google Domains**: My Domains → DNS

---

## ⏱️ Step 6: Wait for Propagation

- DNS changes take **24-48 hours** to propagate globally
- Usually works in **1-2 hours**
- Firebase automatically provisions **FREE SSL certificate**

---

## ✅ Verification

After DNS propagation, your site will be live at:
- ✅ https://upexammantra.com
- ✅ https://www.upexammantra.com
- ✅ https://up-exam-mantra.web.app (Firebase default)

All with **FREE SSL** (HTTPS) 🔒

---

## 🔄 Future Updates

Whenever you make changes:

```bash
# 1. Build
npm run build

# 2. Deploy
firebase deploy --only hosting
```

Changes go live in **30 seconds**! 🚀

---

## 📊 Firebase Hosting Features

✅ **Free SSL Certificate** (Auto-renewed)
✅ **Global CDN** (Fast worldwide)
✅ **10GB Storage** (Free tier)
✅ **360MB/day Bandwidth** (Free tier)
✅ **Custom Domain Support**
✅ **Automatic Compression**
✅ **HTTP/2 Support**
✅ **Rollback Support** (Previous versions)

---

## 🛠️ Troubleshooting

### Issue: "Firebase command not found"
```bash
npm install -g firebase-tools
```

### Issue: "Build failed"
```bash
# Clear cache and rebuild
rm -rf node_modules build
npm install
npm run build
```

### Issue: "Domain not connecting"
- Wait 24-48 hours for DNS propagation
- Check DNS records are correct
- Use https://dnschecker.org to verify propagation

### Issue: "SSL certificate pending"
- Wait 24 hours after DNS is verified
- Firebase auto-provisions SSL
- Check Firebase Console → Hosting → Domains

---

## 📱 Testing Before Going Live

Test your build locally:

```bash
npm run build
npx serve -s build
```

Open: http://localhost:3000

---

## 🎯 Quick Deploy Commands

```bash
# Full deployment
npm run build && firebase deploy --only hosting

# Deploy with message
firebase deploy --only hosting -m "Updated features"

# View deployment history
firebase hosting:channel:list
```

---

## 📞 Support

If you face any issues:
1. Check Firebase Console logs
2. Verify DNS settings
3. Check browser console for errors
4. Clear browser cache

---

## 🎉 Success Checklist

- [ ] Firebase CLI installed
- [ ] Logged into Firebase
- [ ] App built successfully (`npm run build`)
- [ ] Deployed to Firebase (`firebase deploy`)
- [ ] Custom domain added in Firebase Console
- [ ] TXT record added for verification
- [ ] A records added for root domain
- [ ] CNAME record added for www
- [ ] DNS propagated (24-48 hours)
- [ ] SSL certificate active
- [ ] Site live at upexammantra.com ✅

---

**Your website will be live at: https://upexammantra.com** 🚀

**Estimated Time:** 
- Setup & Deploy: 10 minutes
- DNS Propagation: 1-48 hours
- SSL Certificate: Automatic after DNS

---

**Note:** Firebase Hosting is completely FREE for your usage level and includes:
- Unlimited custom domains
- Free SSL certificates
- Global CDN
- 99.95% uptime SLA

Good luck! 🎓📚
