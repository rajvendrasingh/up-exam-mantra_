# UP Exam Mantra - Complete Code Documentation
## पूरे कोड की विस्तृत जानकारी

---

## 📁 Project Structure (प्रोजेक्ट की संरचना)

```
up-exam-mantra/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Footer.jsx       # Footer component with social links
│   │   ├── Hero.jsx         # Hero section for landing page
│   │   ├── Navbar.jsx       # Navigation bar component
│   │   ├── Exams.jsx        # Exam information section
│   │   └── DailyUpdates.jsx # Daily updates section
│   │
│   ├── pages/               # Page components
│   │   └── admin/
│   │       └── AdminDashboard.jsx  # Admin dashboard page
│   │
│   ├── services/            # Firebase and API services
│   │   └── firestoreService.js     # All Firestore database operations
│   │
│   ├── App.jsx              # Main application component with routing
│   ├── main.jsx             # Application entry point
│   ├── firebase.js          # Firebase configuration
│   ├── TestSeriesContext.jsx  # Global state management
│   │
│   ├── Auth.jsx             # Login/Signup page
│   ├── LandingPage.jsx      # First page (SEO optimized)
│   ├── Home.jsx             # Home page after login
│   ├── Admin.jsx            # Admin panel for managing tests
│   ├── Mocktest.jsx         # Test taking interface
│   ├── Dashboard.jsx        # User dashboard with stats
│   ├── Leaderboard.jsx      # Global rankings
│   ├── AttemptedTests.jsx   # Test history
│   ├── Bookmarks.jsx        # Saved questions
│   ├── Settings.jsx         # User settings & profile
│   └── Help.jsx             # Help & support page
│
├── public/                  # Static assets
├── dist/                    # Build output
├── firebase.json            # Firebase hosting config
├── firestore.rules          # Database security rules
├── package.json             # Dependencies
└── vite.config.js           # Vite build configuration
```

---

## 🔥 Firebase Configuration (firebase.js)

**Purpose:** Firebase को initialize करना और authentication, database setup करना

```javascript
// Firebase services को import करते हैं
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase project की configuration
const firebaseConfig = {
  apiKey: "...",           // API key
  authDomain: "...",       // Authentication domain
  projectId: "...",        // Project ID
  storageBucket: "...",    // Storage bucket
  messagingSenderId: "...", // Messaging sender ID
  appId: "..."             // App ID
};

// Firebase app को initialize करना
const app = initializeApp(firebaseConfig);

// Authentication service
export const auth = getAuth(app);

// Firestore database service
export const db = getFirestore(app);
```

---

## 🗄️ Firestore Service (services/firestoreService.js)

**Purpose:** Firebase Firestore के साथ सभी database operations

### Main Functions:

#### 1. TEST SERIES OPERATIONS (टेस्ट सीरीज़)

```javascript
// नई test series बनाना
createTestSeries(seriesData)
  - Input: { title, category, status, sections }
  - Output: Created test series with ID
  - Use: Admin panel में नई series add करने के लिए

// सभी test series लाना
getAllTestSeries(includeInactive)
  - Input: true/false (draft tests include करें या नहीं)
  - Output: Array of test series
  - Use: Home page और Mocktest page पर list दिखाने के लिए

// Test series update करना
updateTestSeries(seriesId, updates)
  - Input: Series ID और update data
  - Output: Updated series
  - Use: Admin panel में edit करने के लिए

// Test series delete करना
deleteTestSeries(seriesId)
  - Input: Series ID
  - Output: Success/failure
  - Use: Admin panel में delete करने के लिए
```

#### 2. SECTION OPERATIONS (सेक्शन)

```javascript
// नया section बनाना
createSection(seriesId, sectionData)
  - Input: Series ID और section data
  - Output: Created section
  - Use: Test series में sections add करने के लिए

// Sections लाना
getSections(seriesId)
  - Input: Series ID
  - Output: Array of sections
  - Use: Mocktest page पर sections दिखाने के लिए
```

#### 3. TEST OPERATIONS (टेस्ट)

```javascript
// नया test बनाना
createTest(seriesId, sectionId, testData)
  - Input: Series ID, Section ID, test data
  - Output: Created test
  - Use: Admin panel में test add करने के लिए

// Tests लाना
getTests(seriesId, sectionId, includeInactive)
  - Input: Series ID, Section ID, include drafts
  - Output: Array of tests
  - Use: Mocktest page पर tests list करने के लिए
```

#### 4. QUESTION OPERATIONS (प्रश्न)

```javascript
// Questions बनाना
bulkCreateQuestions(seriesId, sectionId, testId, questionsArray)
  - Input: IDs और questions array
  - Output: Number of questions created
  - Use: Admin panel में bulk questions add करने के लिए

// Questions लाना
getQuestions(seriesId, sectionId, testId)
  - Input: Series, Section, Test IDs
  - Output: Array of questions
  - Use: Test screen पर questions दिखाने के लिए
```

#### 5. USER & TEST ATTEMPTS (यूज़र और टेस्ट)

```javascript
// Test attempt save करना
createTestAttempt(attemptData)
  - Input: { userId, testTitle, score, answers, date }
  - Output: Saved attempt with ID
  - Use: Test complete होने पर result save करने के लिए

// User के सभी attempts लाना
getUserTestAttempts(userId)
  - Input: User ID
  - Output: Array of test attempts
  - Use: Dashboard और Attempted Tests page के लिए

// User profile बनाना/update करना
createUserProfile(userId, userData)
updateUserProfile(userId, updates)
  - Input: User ID और data
  - Output: Updated profile
  - Use: Login/signup और profile update के लिए

// सभी users लाना (Leaderboard के लिए)
getAllUsers()
  - Input: None
  - Output: Array of all users
  - Use: Leaderboard पर global rankings दिखाने के लिए
```

---

## 🌐 Global State Management (TestSeriesContext.jsx)

**Purpose:** पूरे app में data share करना (Redux की तरह)

### State Variables:

```javascript
// Test series data
testSeries: []              // सभी test series
testHistory: []             // User के completed tests
userProfile: {}             // User की profile info
bookmarkedQuestions: []     // Saved questions
notifications: []           // App notifications
currentUser: null           // Logged in user
loading: true               // Loading state
```

### Main Functions:

```javascript
// Test result save करना
addTestResult(result)
  - Test complete होने पर call होता है
  - Firebase में save करता है
  - User profile update करता है
  - Local state update करता है

// Question bookmark करना
toggleBookmark(seriesId, sectionId, testId, questionId)
  - Question को save/unsave करता है
  - localStorage में store करता है

// Notification add करना
addNotification(notification)
  - नया notification create करता है
  - Unread count update करता है

// Firebase से data reload करना
reloadTestSeries()
  - Latest test series fetch करता है
  - Admin panel में changes के बाद use होता है
```

---

## 📱 Main Application (App.jsx)

**Purpose:** Main routing और navigation setup

### Key Sections:

#### 1. AUTHENTICATION STATE
```javascript
// Firebase auth state को track करना
useEffect(() => {
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    setLoading(false);
  });
}, []);
```

#### 2. NAVIGATION HEADER
```javascript
// Desktop Navigation
- Logo (UP EXAM MANTRA)
- Home link (logged in users के लिए)
- Admin link (admin के लिए)
- Mocktest link
- Leaderboard link
- YouTube & Telegram icons
- Notifications bell
- Help icon
- User profile dropdown

// Mobile Navigation
- Hamburger menu
- Same links in sidebar
- Touch-friendly design
```

#### 3. USER MENU DROPDOWN
```javascript
// User click करने पर menu खुलता है:
- Profile photo/initial
- User name और email
- My Profile
- Dashboard
- My Tests
- Attempted Tests
- Bookmarks
- Leaderboard
- Settings
- Logout button
```

#### 4. ROUTING
```javascript
<Routes>
  <Route path="/" element={Landing/Home} />
  <Route path="/auth" element={<Auth />} />
  <Route path="/home" element={<Home />} />
  <Route path="/admin" element={<Admin />} />
  <Route path="/test" element={<Mocktest />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/leaderboard" element={<Leaderboard />} />
  <Route path="/attempted-tests" element={<AttemptedTests />} />
  <Route path="/bookmarks" element={<Bookmarks />} />
  <Route path="/settings" element={<Settings />} />
  <Route path="/help" element={<Help />} />
</Routes>
```

---

## 🔐 Authentication (Auth.jsx)

**Purpose:** User login और signup

### Features:

```javascript
// Login Methods:
1. Email/Password login
   - Firebase authentication use करता है
   - Error handling के साथ

2. Google Sign-in
   - One-click Google login
   - Automatic profile creation

3. Phone Number login
   - OTP verification
   - Indian phone numbers के लिए

// Signup Process:
1. User details collect करना
2. Firebase में account बनाना
3. Firestore में user profile create करना
4. Automatic login और home redirect
```

---

## 🏠 Landing Page (LandingPage.jsx)

**Purpose:** SEO-optimized first page for non-logged users

### Sections:

```javascript
1. Hero Section
   - Main heading और tagline
   - CTA buttons (Login/Signup)
   - Attractive gradient background

2. Exam Information
   - UPSSC, UP Police, UP Lekhpal
   - UPTET, UPPSC, Railway, SSC
   - Exam details और syllabus info

3. Features Section
   - Mock tests
   - Performance tracking
   - Leaderboard
   - Study materials

4. Footer
   - Social media links
   - Contact information
   - Quick links
```

---

## 📝 Mocktest Page (Mocktest.jsx)

**Purpose:** Test लेने का main interface

### Test Flow:

```javascript
// STEP 1: TEST SERIES SELECTION
- सभी active test series दिखाना
- Draft tests hide करना (users के लिए)
- Click करके select करना

// STEP 2: SECTION SELECTION
- Selected series के sections दिखाना
- Section details (tests count)
- Click करके select करना

// STEP 3: TEST SELECTION
- Section के सभी active tests दिखाना
- Test details (questions, duration, marks)
- Click करके select करना

// STEP 4: INSTRUCTIONS SCREEN
- Test details display करना
- Important instructions
- "Start Test" button

// STEP 5: ACTIVE TEST SCREEN (Full-screen mode)
- Question display
- 4 options (A, B, C, D)
- Timer (per question)
- Submit button
- Next/Previous buttons
- Flag for review
- Question navigator (sidebar)
- Language translator (Hindi/English)
- Back button with confirmation

// STEP 6: TEST COMPLETED SCREEN (Full-screen mode)
- Final score display
- Correct/Wrong/Attempted/Skipped stats
- Percentage calculation
- Review Answers button
- Take Another Test button
- Back button

// STEP 7: REVIEW MODE (Full-screen mode)
- सभी questions और answers
- Correct answers highlight (green)
- Wrong answers highlight (red)
- User's selected answers
- Explanations (if available)
- Back to Results button
```

### Key Features:

```javascript
// Timer System
- हर question के लिए 45 seconds
- Auto-submit on timeout
- Visual warning (red) when < 10 seconds

// Scoring System
- Correct answer: +1 mark
- Wrong answer: -0.25 marks
- Unattempted: 0 marks

// Question Navigator
- Color-coded status:
  * Green: Correct
  * Red: Wrong
  * Blue: Answered (not submitted)
  * Orange: Flagged
  * Gray: Unanswered
- Click to jump to any question
- Mobile: Bottom sheet overlay
- Desktop: Right sidebar

// Language Translator
- Original language
- Hindi translation (Google Translate API)
- English translation
- Per-question translation
- Cached translations
```

---

## 📊 Dashboard (Dashboard.jsx)

**Purpose:** User की performance statistics

### Sections:

```javascript
// 1. PROFILE CARD
- User photo/initial
- Name और email
- Total tests taken
- Average score
- Best score
- Badges earned

// 2. PERFORMANCE STATS
- Total Tests: कितने tests दिए
- Total Score: कुल marks
- Average Score: औसत marks
- Best Score: सबसे ज्यादा marks
- Success Rate: percentage

// 3. RECENT TESTS
- Last 5 tests की list
- Test name
- Score
- Date
- View details button

// 4. PROGRESS CHART
- Score trend over time
- Visual graph
- Performance analysis

// 5. QUICK ACTIONS
- Take New Test
- View All Tests
- Check Leaderboard
- Update Profile
```

---

## 🏆 Leaderboard (Leaderboard.jsx)

**Purpose:** Global rankings display

### Features:

```javascript
// DATA SOURCE
- Firebase से सभी users fetch करता है
- Real-time rankings
- Total score के basis पर sort

// TOP 3 PODIUM
- 1st Place: Gold medal, champion badge
- 2nd Place: Silver medal
- 3rd Place: Bronze medal
- Special styling और animations

// COMPLETE RANKINGS TABLE
Columns:
- Rank: #1, #2, #3, etc.
- Student: User name
- Total Score: कुल marks
- Tests: कितने tests दिए
- Average: औसत score
- Best Score: highest score

// RANKING CALCULATION
1. सभी users को total score से sort करना
2. Descending order (highest first)
3. Rank numbers assign करना (1, 2, 3...)
4. Ties handle करना (same score)

// LOADING STATE
- Spinner दिखाना जब data load हो रहा हो
- Empty state अगर कोई user नहीं
```

---

## 📋 Attempted Tests (AttemptedTests.jsx)

**Purpose:** User की test history

### Features:

```javascript
// TEST HISTORY LIST
- सभी completed tests
- Newest first (latest on top)
- Test details:
  * Test name
  * Date और time
  * Score obtained
  * Total marks
  * Percentage
  * Correct/Wrong/Unattempted

// FILTERS
- By date range
- By test series
- By score range
- Search by test name

// ACTIONS
- View detailed results
- Retake test
- Share results
- Download certificate (if passed)

// STATISTICS
- Total tests taken
- Average score
- Improvement trend
- Weak areas identification
```

---

## 🔖 Bookmarks (Bookmarks.jsx)

**Purpose:** Saved questions management

### Features:

```javascript
// BOOKMARKED QUESTIONS LIST
- सभी saved questions
- Question text
- Options
- Correct answer
- Explanation
- Source (test name)

// ORGANIZATION
- By subject/topic
- By difficulty
- By test series
- Search functionality

// ACTIONS
- Remove bookmark
- Practice bookmarked questions
- Export to PDF
- Share with friends

// PRACTICE MODE
- Practice only bookmarked questions
- Random order
- Timed/Untimed mode
- Track progress
```

---

## ⚙️ Settings (Settings.jsx)

**Purpose:** User profile और app settings

### Sections:

```javascript
// 1. PROFILE SETTINGS
- Upload profile photo (max 2MB)
- Update name
- Update email
- Update phone number
- Change password

// 2. NOTIFICATION SETTINGS
- Email notifications
- Push notifications
- Test reminders
- Score updates
- New test alerts

// 3. PRIVACY SETTINGS
- Profile visibility
- Leaderboard participation
- Data sharing preferences

// 4. APP PREFERENCES
- Language selection
- Theme (light/dark)
- Font size
- Sound effects

// 5. ACCOUNT MANAGEMENT
- Delete account
- Export data
- Account statistics
- Logout from all devices
```

---

## 👑 Admin Panel (Admin.jsx)

**Purpose:** Test series और questions manage करना

### Main Features:

```javascript
// 1. TEST SERIES MANAGEMENT
- Create new test series
- Edit existing series
- Delete series
- Activate/Deactivate (Draft/Active)
- View series statistics

// 2. SECTION MANAGEMENT
- Add sections to series
- Edit section details
- Delete sections
- Reorder sections

// 3. TEST MANAGEMENT
- Create new tests
- Edit test details:
  * Title
  * Duration
  * Marks per question
  * Negative marking
  * Instructions
- Delete tests
- Activate/Deactivate tests

// 4. QUESTION MANAGEMENT
- Add questions (single/bulk)
- Question fields:
  * Question text
  * 4 options (A, B, C, D)
  * Correct answer
  * Explanation
  * Difficulty level
  * Tags/Topics
- Edit questions
- Delete questions
- Import from CSV/Excel
- Export questions

// 5. BULK OPERATIONS
- Import questions from file
- CSV format support
- Validation और error handling
- Preview before import
- Bulk edit
- Bulk delete

// 6. ANALYTICS
- Total users
- Total tests
- Total questions
- User engagement
- Popular tests
- Performance metrics
```

### Admin Login:
```javascript
Username: yogendra
Password: yug@123
```

---

## 🎨 Styling & Responsive Design

### Design System:

```javascript
// COLORS
Primary: #667eea (Purple)
Secondary: #764ba2 (Dark Purple)
Success: #10b981 (Green)
Warning: #f59e0b (Orange)
Error: #ef4444 (Red)
Info: #3b82f6 (Blue)

// GRADIENTS
Main: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Success: linear-gradient(135deg, #10b981 0%, #059669 100%)
Warning: linear-gradient(135deg, #f59e0b 0%, #d97706 100%)

// TYPOGRAPHY
Headings: Bold, 1.5rem - 3rem
Body: Regular, 1rem
Small: 0.85rem - 0.95rem

// SPACING
Padding: 15px, 20px, 30px, 40px
Margin: 10px, 20px, 30px, 40px
Gap: 10px, 15px, 20px

// BORDER RADIUS
Small: 8px
Medium: 12px
Large: 15px, 20px
Circle: 50%

// SHADOWS
Light: 0 2px 8px rgba(0,0,0,0.08)
Medium: 0 4px 15px rgba(0,0,0,0.1)
Heavy: 0 10px 40px rgba(0,0,0,0.15)
```

### Responsive Breakpoints:

```css
/* Mobile First Approach */

/* Mobile: < 768px */
- Single column layout
- Hamburger menu
- Touch-friendly buttons (min 44px)
- Bottom navigation
- Full-width cards

/* Tablet: 768px - 1024px */
- 2 column grid
- Sidebar navigation
- Medium-sized cards
- Optimized spacing

/* Desktop: > 1024px */
- Multi-column layout
- Full navigation bar
- Hover effects
- Larger content area
- Side panels
```

### Mobile Optimizations:

```javascript
// CSS Media Queries
@media (max-width: 768px) {
  .desktop-nav { display: none; }
  .mobile-nav { display: flex; }
  .question-navigator-desktop { display: none; }
  .mobile-menu-btn { display: block; }
}

// Touch Interactions
- Larger tap targets (min 44x44px)
- Swipe gestures
- Pull to refresh
- Bottom sheets
- Mobile-friendly modals

// Performance
- Lazy loading images
- Code splitting
- Optimized bundle size
- Fast page transitions
```

---

## 🔒 Security & Data Protection

### Firebase Security Rules:

```javascript
// Firestore Rules (firestore.rules)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      // User can read/write own data
      allow read, write: if request.auth != null 
                         && request.auth.uid == userId;
    }
    
    // Test series - public read, admin write
    match /testSeries/{seriesId} {
      allow read: if true;  // Anyone can read
      allow write: if request.auth != null;  // Only authenticated
    }
    
    // Test attempts - user specific
    match /testAttempts/{attemptId} {
      allow read, write: if request.auth != null 
                         && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

### Data Validation:

```javascript
// Input Sanitization
- XSS protection
- SQL injection prevention
- File upload validation
- Email format validation
- Phone number validation

// Authentication
- Firebase Auth
- Secure password hashing
- Email verification
- Phone OTP verification
- Session management

// Authorization
- Role-based access (Admin/User)
- Protected routes
- API endpoint security
- Data access control
```

---

## 🚀 Deployment & Build

### Build Process:

```bash
# Development
npm run dev          # Start dev server (localhost:5173)

# Production Build
npm run build        # Create optimized build in /dist

# Preview Build
npm run preview      # Preview production build locally

# Deploy to Firebase
firebase deploy      # Deploy to Firebase Hosting
```

### Firebase Hosting Configuration:

```json
// firebase.json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Environment Variables:

```javascript
// .env file (not committed to git)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 📦 Dependencies

### Main Dependencies:

```json
{
  "react": "^18.2.0",              // UI library
  "react-dom": "^18.2.0",          // React DOM rendering
  "react-router-dom": "^6.20.0",   // Routing
  "firebase": "^10.7.1",           // Backend services
  "vite": "^5.0.0"                 // Build tool
}
```

### Why These Technologies:

```javascript
// React
- Component-based architecture
- Virtual DOM for performance
- Large ecosystem
- Easy to learn

// Firebase
- Real-time database
- Authentication built-in
- Hosting included
- Scalable
- Free tier available

// Vite
- Fast development server
- Hot Module Replacement (HMR)
- Optimized production builds
- Modern JavaScript support

// React Router
- Client-side routing
- Nested routes
- Protected routes
- URL parameters
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Test Results Not Saving
```javascript
Problem: Test complete होने पर result save नहीं हो रहा

Solution:
1. Check Firebase connection
2. Verify user is logged in
3. Check console for errors
4. Ensure userAnswers array clean है (no null values)
5. Check Firestore rules
```

### Issue 2: Leaderboard Not Showing Users
```javascript
Problem: Leaderboard empty दिख रहा है

Solution:
1. Check getAllUsers() function
2. Verify Firestore collection name
3. Check user profile creation on signup
4. Ensure totalScore field exists
5. Check loading state
```

### Issue 3: Login Redirect Not Working
```javascript
Problem: Login के बाद home page पर नहीं जा रहा

Solution:
1. Check handleAuthSuccess function
2. Verify navigate("/home") call
3. Check routing configuration
4. Ensure user state update हो रहा है
```

### Issue 4: Mobile Menu Not Opening
```javascript
Problem: Mobile पर hamburger menu काम नहीं कर रहा

Solution:
1. Check showMobileMenu state
2. Verify CSS media queries
3. Check z-index values
4. Ensure onClick handler attached है
```

### Issue 5: Questions Not Loading
```javascript
Problem: Test में questions नहीं दिख रहे

Solution:
1. Check getQuestions() function
2. Verify test ID correct है
3. Check Firebase data structure
4. Ensure questions array populated है
5. Check console for errors
```

---

## 📈 Performance Optimization

### Code Splitting:
```javascript
// Lazy load components
const Admin = lazy(() => import('./Admin'));
const Dashboard = lazy(() => import('./Dashboard'));

// Use Suspense for loading state
<Suspense fallback={<Loading />}>
  <Admin />
</Suspense>
```

### Image Optimization:
```javascript
// Compress images before upload
// Use WebP format
// Lazy load images
// Use appropriate sizes
```

### Database Optimization:
```javascript
// Index frequently queried fields
// Limit query results
// Use pagination
// Cache data in localStorage
// Batch operations
```

### Bundle Size Optimization:
```javascript
// Tree shaking
// Code splitting
// Remove unused dependencies
// Minification
// Compression (gzip)
```

---

## 🔄 Future Enhancements

### Planned Features:

```javascript
1. Video Lectures Integration
   - Embedded YouTube videos
   - Topic-wise organization
   - Progress tracking

2. Study Materials
   - PDF notes
   - Important formulas
   - Previous year papers
   - Current affairs

3. Discussion Forum
   - Ask doubts
   - Community answers
   - Expert responses
   - Upvote/Downvote

4. Live Classes
   - Scheduled classes
   - Live chat
   - Recording playback
   - Attendance tracking

5. Certificates
   - Auto-generated certificates
   - Downloadable PDF
   - Shareable on social media
   - Verification system

6. Payment Integration
   - Premium tests
   - Subscription plans
   - Razorpay/Paytm integration
   - Invoice generation

7. Advanced Analytics
   - Detailed performance reports
   - Weak area identification
   - Comparison with toppers
   - Personalized recommendations

8. Mobile App
   - React Native app
   - Offline mode
   - Push notifications
   - Better performance
```

---

## 📞 Support & Contact

### For Technical Issues:
- Email: upexammantra@gmail.com
- Telegram: https://t.me/upexammantra
- YouTube: https://youtube.com/@upexammantra

### For Admin Access:
- Contact: Yogendra
- Email: admin@upexammantra.com

### Developer:
- Name: Rajvendra
- Role: Full Stack Developer

---

## 📝 License & Credits

```
© 2024 UP Exam Mantra. All rights reserved.

Developed by: Rajvendra
Platform: React + Firebase
Hosting: Firebase Hosting
Domain: upexammantra.com
```

---

## 🎯 Quick Start Guide

### For Users:
```
1. Visit: https://up-exam-mantra.web.app
2. Click "Login" or "Sign Up"
3. Complete registration
4. Go to "Mocktest" page
5. Select test series → section → test
6. Read instructions
7. Start test
8. Submit and view results
9. Check leaderboard for ranking
```

### For Admins:
```
1. Click "Admin Login"
2. Enter credentials (yogendra / yug@123)
3. Create test series
4. Add sections
5. Add tests
6. Add questions (bulk/single)
7. Activate test series
8. Monitor user performance
```

### For Developers:
```bash
1. Clone repository
   git clone <repo-url>

2. Install dependencies
   npm install

3. Setup Firebase
   - Create Firebase project
   - Add web app
   - Copy config to firebase.js

4. Run development server
   npm run dev

5. Build for production
   npm run build

6. Deploy to Firebase
   firebase deploy
```

---

## 🎓 Learning Resources

### React:
- Official Docs: https://react.dev
- Tutorial: React for Beginners
- Video: Traversy Media React Crash Course

### Firebase:
- Official Docs: https://firebase.google.com/docs
- Tutorial: Firebase Full Course
- Video: Fireship Firebase Tutorials

### JavaScript:
- MDN Web Docs: https://developer.mozilla.org
- JavaScript.info: https://javascript.info
- Video: JavaScript Mastery

---

**यह documentation पूरे codebase को समझने के लिए है। किसी भी doubt के लिए contact करें!**

**This documentation covers the entire codebase. Contact for any questions!**
