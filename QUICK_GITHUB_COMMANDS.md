# ⚡ Quick GitHub Commands - Copy & Paste

## 🎯 Complete Upload (All Commands)

```bash
# 1. Initialize Git
git init

# 2. Add all files
git add .

# 3. Create first commit
git commit -m "Initial commit: UP Exam Mantra complete project"

# 4. Add GitHub remote (REPLACE YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/up-exam-mantra.git

# 5. Push to GitHub
git branch -M main
git push -u origin main
```

---

## 📝 Before Running Commands

1. **Create repository on GitHub:**
   - Go to: https://github.com/new
   - Name: `up-exam-mantra`
   - Click "Create repository"
   - **DON'T** initialize with README

2. **Replace YOUR_USERNAME** with your actual GitHub username

---

## 🔄 Update Code (After Changes)

```bash
git add .
git commit -m "Updated features"
git push
```

---

## 🆘 Common Issues

### Issue: "git: command not found"
**Solution:** Install Git from https://git-scm.com/downloads

### Issue: "Permission denied"
**Solution:** Create Personal Access Token
1. Go to: https://github.com/settings/tokens
2. Generate new token (classic)
3. Select `repo` scope
4. Use token as password

### Issue: "Repository not found"
**Solution:** 
- Check repository exists on GitHub
- Check username is correct
- Make sure you created the repo first

---

## ✅ Success Check

After pushing, visit:
```
https://github.com/YOUR_USERNAME/up-exam-mantra
```

You should see all your files! 🎉

---

## 🚀 One-Click Upload (Windows)

Double-click: `github-upload.bat`

## 🚀 One-Click Upload (Mac/Linux)

```bash
chmod +x github-upload.sh
./github-upload.sh
```

---

**That's it! Your code will be on GitHub in 5 minutes!** ⚡
