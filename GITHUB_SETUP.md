# 📦 GitHub Repository Setup Guide
## UP Exam Mantra - Complete GitHub Upload

---

## 🎯 Step-by-Step Commands

### Step 1: Create New Repository on GitHub

1. Go to: https://github.com/new
2. Repository name: `up-exam-mantra` (or any name you want)
3. Description: `UP Exam Mantra - Online Test Portal`
4. Choose: **Public** or **Private**
5. **DO NOT** check "Initialize with README"
6. Click **"Create repository"**

---

### Step 2: Initialize Git in Your Project

Open terminal/command prompt in your project folder and run:

```bash
# Initialize git (if not already initialized)
git init

# Add all files to git
git add .

# Create first commit
git commit -m "Initial commit: UP Exam Mantra complete project"
```

---

### Step 3: Connect to GitHub Repository

Replace `YOUR_USERNAME` with your GitHub username:

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/up-exam-mantra.git

# Verify remote is added
git remote -v
```

**Example:**
If your GitHub username is `yogendra123`, then:
```bash
git remote add origin https://github.com/yogendra123/up-exam-mantra.git
```

---

### Step 4: Push Code to GitHub

```bash
# Push to main branch
git branch -M main
git push -u origin main
```

**Done!** Your code is now on GitHub! 🎉

---

## 🔄 Future Updates (After Making Changes)

Whenever you make changes:

```bash
# Add all changed files
git add .

# Commit with message
git commit -m "Updated features"

# Push to GitHub
git push
```

---

## 📋 Complete Command List (Copy & Paste All)

```bash
# Step 1: Initialize and commit
git init
git add .
git commit -m "Initial commit: UP Exam Mantra complete project"

# Step 2: Add remote (REPLACE YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/up-exam-mantra.git

# Step 3: Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🔐 If Asked for Username/Password

GitHub now uses **Personal Access Tokens** instead of passwords.

### Create Token:
1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Select scopes: `repo` (full control)
4. Click **"Generate token"**
5. **Copy the token** (you won't see it again!)

### Use Token:
- Username: Your GitHub username
- Password: Paste the token (not your GitHub password)

---

## 🌿 Branch Strategy (Optional)

If you want to work with branches:

```bash
# Create development branch
git checkout -b development

# Make changes, then commit
git add .
git commit -m "New feature"

# Push development branch
git push -u origin development

# Switch back to main
git checkout main

# Merge development into main
git merge development
git push
```

---

## 📁 What Will Be Uploaded

✅ All source code (`src/` folder)
✅ Public files (`public/` folder)
✅ Configuration files
✅ Firebase setup files
✅ Deployment scripts
✅ Documentation files

❌ `node_modules/` (excluded by .gitignore)
❌ `dist/` or `build/` (excluded by .gitignore)
❌ `.env` files (excluded by .gitignore)

---

## 🔍 Check Upload Status

After pushing, go to:
```
https://github.com/YOUR_USERNAME/up-exam-mantra
```

You should see all your files! 🎊

---

## 🚀 Deploy from GitHub (Bonus)

Once code is on GitHub, you can:

### Option 1: Vercel (Easiest)
1. Go to: https://vercel.com
2. Click "Import Project"
3. Select your GitHub repo
4. Auto-deploys! ✅

### Option 2: Netlify
1. Go to: https://netlify.com
2. "New site from Git"
3. Select repo
4. Auto-deploys! ✅

### Option 3: Firebase (Manual)
```bash
npm run build
firebase deploy --only hosting
```

---

## 🆘 Troubleshooting

### "git: command not found"
Install Git: https://git-scm.com/downloads

### "Permission denied"
```bash
# Use HTTPS instead of SSH
git remote set-url origin https://github.com/YOUR_USERNAME/up-exam-mantra.git
```

### "Repository not found"
- Check repository name is correct
- Check you're logged into correct GitHub account
- Make sure repository exists on GitHub

### "Failed to push"
```bash
# Pull first, then push
git pull origin main --allow-unrelated-histories
git push
```

### Large files error
```bash
# Remove large files from git
git rm --cached path/to/large/file
echo "path/to/large/file" >> .gitignore
git commit -m "Remove large file"
git push
```

---

## 📝 .gitignore Already Configured

Your `.gitignore` file already excludes:
- `node_modules/`
- `dist/` and `build/`
- `.env` files
- IDE files
- Firebase cache

So these won't be uploaded to GitHub. ✅

---

## 🎯 Quick Reference

```bash
# Check status
git status

# See commit history
git log

# See remote URL
git remote -v

# Pull latest changes
git pull

# Clone repository (on another computer)
git clone https://github.com/YOUR_USERNAME/up-exam-mantra.git
```

---

## 📊 Repository Settings (After Upload)

### Add Description:
Go to repo → Settings → Description:
```
UP Exam Mantra - Complete Online Test Portal with Admin Panel, Mock Tests, AI Question Generator, and Firebase Integration
```

### Add Topics:
```
react, firebase, exam-portal, test-series, education, vite, javascript
```

### Add README:
Your `README.md` will automatically show on the repo page.

---

## 🔗 Share Your Repository

After upload, share this link:
```
https://github.com/YOUR_USERNAME/up-exam-mantra
```

---

## ✅ Success Checklist

- [ ] Git installed on computer
- [ ] GitHub account created
- [ ] New repository created on GitHub
- [ ] Git initialized in project (`git init`)
- [ ] All files added (`git add .`)
- [ ] First commit created (`git commit`)
- [ ] Remote added (`git remote add origin`)
- [ ] Code pushed to GitHub (`git push`)
- [ ] Repository visible on GitHub
- [ ] All files uploaded correctly

---

**Your code will be safely stored on GitHub and accessible from anywhere!** 🎉

**Repository URL Format:**
```
https://github.com/YOUR_USERNAME/up-exam-mantra
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

**Need help with any step? Let me know!** 🚀
