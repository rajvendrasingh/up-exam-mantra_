# UP Exam Mantra - Online Test Platform
## ऑनलाइन टेस्ट प्लेटफॉर्म

![UP Exam Mantra](https://img.shields.io/badge/UP-EXAM%20MANTRA-red?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=flat-square&logo=react)
![Firebase](https://img.shields.io/badge/Firebase-10.7.1-orange?style=flat-square&logo=firebase)
![Vite](https://img.shields.io/badge/Vite-5.0.0-purple?style=flat-square&logo=vite)

---

## 🎯 About Project (प्रोजेक्ट के बारे में)

UP Exam Mantra एक complete online test platform है जो UPSSSC और UP Government exams की तैयारी के लिए बनाया गया है। इसमें mock tests, performance tracking, leaderboard, और बहुत कुछ है।

**Live Website:** https://up-exam-mantra.web.app

---

## ✨ Features (मुख्य विशेषताएं)

### 👨‍🎓 For Students (छात्रों के लिए)

- ✅ **Mock Tests** - विभिन्न exams के लिए practice tests
- 📊 **Dashboard** - अपनी performance track करें
- 🏆 **Leaderboard** - अपनी ranking देखें
- 📝 **Test History** - पुराने tests review करें
- 🔖 **Bookmarks** - important questions save करें
- 📱 **Mobile Friendly** - phone पर भी आसानी से use करें
- 🌐 **Language Support** - Hindi और English में questions
- ⏱️ **Timer** - real exam जैसा experience
- 📈 **Analytics** - detailed performance analysis

### 👑 For Admins (एडमिन के लिए)

- ➕ **Create Tests** - नए tests बनाएं
- 📚 **Manage Content** - test series, sections, questions manage करें
- 📤 **Bulk Upload** - CSV से questions import करें
- 🎯 **Activate/Deactivate** - tests को control करें
- 📊 **Analytics** - user performance देखें
- 🔧 **Full Control** - complete admin panel

---

## 🚀 Quick Start (शुरुआत करें)

### Prerequisites (जरूरी चीजें)

```bash
Node.js (v16 या higher)
npm या yarn
Firebase account
```

### Installation (इंस्टॉलेशन)

```bash
# 1. Repository clone करें
git clone https://github.com/yourusername/up-exam-mantra.git

# 2. Project folder में जाएं
cd up-exam-mantra

# 3. Dependencies install करें
npm install

# 4. Development server start करें
npm run dev

# 5. Browser में खोलें
http://localhost:5173
```

---

## 🔥 Firebase Setup

### Step 1: Firebase Project बनाएं

1. [Firebase Console](https://console.firebase.google.com) पर जाएं
2. "Add Project" click करें
3. Project name enter करें
4. Google Analytics enable करें (optional)

### Step 2: Web App Add करें

1. Project overview में जाएं
2. Web icon (</>) click करें
3. App nickname enter करें
4. "Register app" click करें
5. Configuration copy करें

### Step 3: Configuration Add करें

`src/firebase.js` file में अपना configuration paste करें:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 4: Firestore Database Enable करें

1. Firebase Console में "Firestore Database" पर जाएं
2. "Create database" click करें
3. "Start in test mode" select करें
4. Location select करें
5. "Enable" click करें

### Step 5: Authentication Enable करें

1. Firebase Console में "Authentication" पर जाएं
2. "Get started" click करें
3. Sign-in methods में:
   - Email/Password enable करें
   - Google enable करें
   - Phone enable करें (optional)

---

## 📁 Project Structure (फोल्डर स्ट्रक्चर)

```
up-exam-mantra/
│
├── src/
│   ├── components/          # Reusable components
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   └── ...
│   │
│   ├── services/            # API और Firebase services
│   │   └── firestoreService.js
│   │
│   ├── pages/               # Page components
│   │   └── admin/
│   │
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   ├── firebase.js          # Firebase config
│   ├── TestSeriesContext.jsx  # Global state
│   │
│   ├── Auth.jsx             # Login/Signup
│   ├── Home.jsx             # Home page
│   ├── Admin.jsx            # Admin panel
│   ├── Mocktest.jsx         # Test interface
│   ├── Dashboard.jsx        # User dashboard
│   ├── Leaderboard.jsx      # Rankings
│   └── ...
│
├── public/                  # Static files
├── dist/                    # Build output
│
├── firebase.json            # Firebase config
├── firestore.rules          # Database rules
├── package.json             # Dependencies
├── vite.config.js           # Vite config
│
├── CODE_DOCUMENTATION.md    # Complete code documentation
└── README.md                # This file
```

---

## 🎮 Usage Guide (उपयोग गाइड)

### For Students (छात्रों के लिए)

#### 1. Registration (रजिस्ट्रेशन)

```
1. Website खोलें
2. "Sign Up" button click करें
3. Details भरें (Name, Email, Password)
4. "Create Account" click करें
5. Email verify करें (if required)
```

#### 2. Taking a Test (टेस्ट देना)

```
1. Login करें
2. "Mocktest" page पर जाएं
3. Test Series select करें
4. Section select करें
5. Test select करें
6. Instructions पढ़ें
7. "Start Test" click करें
8. Questions solve करें
9. "Finish Test" click करें
10. Results देखें
```

#### 3. Checking Performance (परफॉर्मेंस देखना)

```
1. "Dashboard" पर जाएं
2. Overall stats देखें
3. Recent tests check करें
4. Progress chart analyze करें
```

#### 4. Viewing Leaderboard (रैंकिंग देखना)

```
1. "Leaderboard" page खोलें
2. अपनी rank देखें
3. Top performers देखें
4. Compare करें
```

### For Admins (एडमिन के लिए)

#### Admin Login Credentials:
```
Username: yogendra
Password: yug@123
```

#### 1. Creating Test Series (टेस्ट सीरीज़ बनाना)

```
1. Admin panel खोलें
2. "Create Test Series" click करें
3. Details भरें:
   - Title (e.g., "UPSSSC PET 2024")
   - Category (e.g., "UPSSSC")
   - Status (Draft/Active)
4. "Create" click करें
```

#### 2. Adding Sections (सेक्शन जोड़ना)

```
1. Test Series select करें
2. "Add Section" click करें
3. Section name enter करें (e.g., "General Knowledge")
4. Order number set करें
5. "Add" click करें
```

#### 3. Creating Tests (टेस्ट बनाना)

```
1. Section select करें
2. "Add Test" click करें
3. Details भरें:
   - Title
   - Duration (minutes)
   - Marks per question
   - Negative marking
   - Instructions
4. "Create" click करें
```

#### 4. Adding Questions (प्रश्न जोड़ना)

**Single Question:**
```
1. Test select करें
2. "Add Question" click करें
3. Question text enter करें
4. 4 options enter करें
5. Correct answer select करें
6. Explanation add करें (optional)
7. "Add" click करें
```

**Bulk Upload (CSV):**
```
1. CSV file prepare करें:
   question,optionA,optionB,optionC,optionD,answer,explanation
   "What is capital of India?","Mumbai","Delhi","Kolkata","Chennai","1","Delhi is the capital"

2. "Bulk Upload" click करें
3. CSV file select करें
4. Preview check करें
5. "Import" click करें
```

#### 5. Activating Tests (टेस्ट एक्टिवेट करना)

```
1. Test select करें
2. Status को "Draft" से "Active" change करें
3. "Save" click करें
4. अब users को test दिखेगा
```

---

## 🛠️ Available Scripts (कमांड्स)

```bash
# Development server start करें
npm run dev

# Production build बनाएं
npm run build

# Build preview करें
npm run preview

# Firebase पर deploy करें
firebase deploy

# Firestore rules deploy करें
firebase deploy --only firestore:rules

# Hosting deploy करें
firebase deploy --only hosting
```

---

## 📊 Database Structure (डेटाबेस स्ट्रक्चर)

### Firestore Collections:

```javascript
// 1. users (यूज़र्स)
users/{userId}
  - name: string
  - email: string
  - photoURL: string
  - totalTests: number
  - totalScore: number
  - averageScore: number
  - bestScore: number
  - createdAt: timestamp
  - lastLogin: timestamp

// 2. testSeries (टेस्ट सीरीज़)
testSeries/{seriesId}
  - title: string
  - category: string
  - status: "draft" | "active"
  - sections: array
  - createdAt: timestamp
  - updatedAt: timestamp

// 3. testAttempts (टेस्ट अटेम्प्ट्स)
testAttempts/{attemptId}
  - userId: string
  - testTitle: string
  - score: number
  - totalQuestions: number
  - correct: number
  - wrong: number
  - unattempted: number
  - userAnswers: array
  - completedAt: timestamp
```

---

## 🔒 Security Rules (सिक्योरिटी रूल्स)

`firestore.rules` file में:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users - own data access
    match /users/{userId} {
      allow read, write: if request.auth != null 
                         && request.auth.uid == userId;
    }
    
    // Test Series - public read
    match /testSeries/{seriesId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Test Attempts - user specific
    match /testAttempts/{attemptId} {
      allow read, write: if request.auth != null 
                         && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## 🎨 Customization (कस्टमाइजेशन)

### Colors Change करना:

`src/App.jsx` और other components में colors change करें:

```javascript
// Primary Color
background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"

// Success Color
background: "#10b981"

// Error Color
background: "#ef4444"

// Warning Color
background: "#f59e0b"
```

### Logo Change करना:

`src/App.jsx` में logo section edit करें:

```javascript
<div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#dc2626" }}>
  YOUR LOGO
</div>
```

### Footer Update करना:

`src/components/Footer.jsx` में social links और contact info update करें।

---

## 📱 Mobile Responsive

यह platform पूरी तरह से mobile responsive है:

- ✅ Touch-friendly buttons
- ✅ Hamburger menu
- ✅ Bottom navigation
- ✅ Swipe gestures
- ✅ Optimized layouts
- ✅ Fast loading

---

## 🐛 Troubleshooting (समस्या समाधान)

### Common Issues:

#### 1. Firebase Connection Error
```
Problem: Firebase से connect नहीं हो रहा
Solution:
- Check internet connection
- Verify Firebase config
- Check Firebase project status
- Clear browser cache
```

#### 2. Login Not Working
```
Problem: Login नहीं हो रहा
Solution:
- Check email/password
- Verify email is verified
- Check Firebase Authentication settings
- Try different browser
```

#### 3. Tests Not Loading
```
Problem: Tests load नहीं हो रहे
Solution:
- Check if tests are activated
- Verify user is logged in
- Check browser console for errors
- Refresh the page
```

#### 4. Results Not Saving
```
Problem: Test results save नहीं हो रहे
Solution:
- Check internet connection
- Verify Firestore rules
- Check user authentication
- See browser console
```

---

## 📈 Performance Tips

### For Better Performance:

```javascript
// 1. Image Optimization
- Use WebP format
- Compress images
- Lazy load images

// 2. Code Optimization
- Use React.memo for components
- Implement code splitting
- Remove unused dependencies

// 3. Database Optimization
- Use indexes
- Limit query results
- Cache data locally

// 4. Build Optimization
- Minify code
- Enable gzip compression
- Use CDN for assets
```

---

## 🤝 Contributing (योगदान)

Contributions welcome हैं! कृपया:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📞 Support & Contact

### Technical Support:
- 📧 Email: upexammantra@gmail.com
- 💬 Telegram: https://t.me/upexammantra
- 📺 YouTube: https://youtube.com/@upexammantra

### Admin Access:
- 👤 Username: yogendra
- 🔑 Password: yug@123

### Developer:
- 👨‍💻 Name: Rajvendra
- 🎯 Role: Full Stack Developer

---

## 📄 License

© 2024 UP Exam Mantra. All rights reserved.

---

## 🙏 Acknowledgments

- React Team for amazing framework
- Firebase for backend services
- Vite for fast build tool
- All contributors and users

---

## 📚 Documentation

Complete code documentation के लिए देखें:
- [CODE_DOCUMENTATION.md](./CODE_DOCUMENTATION.md) - Detailed code explanation

---

## 🎯 Roadmap

### Upcoming Features:

- [ ] Video lectures integration
- [ ] PDF study materials
- [ ] Discussion forum
- [ ] Live classes
- [ ] Certificates
- [ ] Payment integration
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] AI-powered recommendations
- [ ] Offline mode

---

## ⭐ Show Your Support

अगर यह project helpful लगा तो:
- ⭐ Star the repository
- 🔄 Share with friends
- 📢 Spread the word
- 🐛 Report bugs
- 💡 Suggest features

---

**Made with ❤️ by Rajvendra for UP Exam Aspirants**

**Happy Learning! 📚✨**
