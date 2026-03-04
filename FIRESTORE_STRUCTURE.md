# 🔥 Firestore Database Structure - UP Exam Mantra

## 📊 Complete Hierarchical Structure

```
firestore/
│
├── users/                              # User profiles
│   └── {userId}/
│       ├── uid: string
│       ├── email: string
│       ├── name: string
│       ├── role: "admin" | "user"
│       ├── createdAt: timestamp
│       └── lastLogin: timestamp
│
├── testSeries/                         # Root: Test Series
│   └── {seriesId}/
│       ├── title: string
│       ├── description: string
│       ├── category: string
│       ├── status: "active" | "draft"
│       ├── createdAt: timestamp
│       ├── updatedAt: timestamp
│       ├── createdBy: string (userId)
│       └── order: number
│       │
│       └── sections/                   # Subcollection: Sections
│           └── {sectionId}/
│               ├── sectionTitle: string
│               ├── description: string
│               ├── order: number
│               ├── createdAt: timestamp
│               └── updatedAt: timestamp
│               │
│               └── tests/              # Subcollection: Tests
│                   └── {testId}/
│                       ├── testTitle: string
│                       ├── totalQuestions: number
│                       ├── duration: number (minutes)
│                       ├── marksPerQuestion: number
│                       ├── negativeMarking: number
│                       ├── instructions: string
│                       ├── status: "active" | "draft"
│                       ├── createdAt: timestamp
│                       ├── updatedAt: timestamp
│                       └── order: number
│                       │
│                       └── questions/  # Subcollection: Questions
│                           └── {questionId}/
│                               ├── questionText: string
│                               ├── options: array[4]
│                               ├── correctAnswer: number (0-3)
│                               ├── explanation: string
│                               ├── marks: number
│                               ├── negativeMarks: number
│                               ├── order: number
│                               └── createdAt: timestamp
│
├── testAttempts/                       # User test attempts
│   └── {attemptId}/
│       ├── userId: string
│       ├── testId: string
│       ├── seriesId: string
│       ├── sectionId: string
│       ├── answers: array
│       ├── score: number
│       ├── totalQuestions: number
│       ├── correctAnswers: number
│       ├── wrongAnswers: number
│       ├── unattempted: number
│       ├── timeTaken: number (seconds)
│       ├── startedAt: timestamp
│       └── completedAt: timestamp
│
└── leaderboard/                        # Test leaderboards
    └── {testId}/
        └── entries/
            └── {userId}/
                ├── userName: string
                ├── score: number
                ├── rank: number
                ├── timeTaken: number
                └── completedAt: timestamp
```

## 🔐 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Test Series - Root level
    match /testSeries/{seriesId} {
      // Users can read only active series
      allow read: if isAuthenticated() && 
                     (resource.data.status == 'active' || isAdmin());
      
      // Only admin can write
      allow create, update, delete: if isAdmin();
      
      // Sections subcollection
      match /sections/{sectionId} {
        allow read: if isAuthenticated();
        allow create, update, delete: if isAdmin();
        
        // Tests subcollection
        match /tests/{testId} {
          // Users can read only active tests
          allow read: if isAuthenticated() && 
                         (resource.data.status == 'active' || isAdmin());
          allow create, update, delete: if isAdmin();
          
          // Questions subcollection
          match /questions/{questionId} {
            allow read: if isAuthenticated();
            allow create, update, delete: if isAdmin();
          }
        }
      }
    }
    
    // Test Attempts
    match /testAttempts/{attemptId} {
      allow read: if isAuthenticated() && 
                     (resource.data.userId == request.auth.uid || isAdmin());
      allow create: if isAuthenticated() && 
                       request.resource.data.userId == request.auth.uid;
      allow update: if isOwner(resource.data.userId);
      allow delete: if isAdmin();
    }
    
    // Leaderboard
    match /leaderboard/{testId}/entries/{userId} {
      allow read: if isAuthenticated();
      allow create, update: if isAuthenticated() && 
                               request.resource.data.userId == request.auth.uid;
      allow delete: if isAdmin();
    }
  }
}
```

## 📝 Example Data

### Test Series Document
```json
{
  "title": "Lekhpal 2026 Test Series",
  "description": "Complete test series for UPSSSC Lekhpal 2026",
  "category": "UPSSSC Lekhpal",
  "status": "active",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z",
  "createdBy": "admin_user_id",
  "order": 1
}
```

### Section Document
```json
{
  "sectionTitle": "Previous Year Papers",
  "description": "All previous year question papers",
  "order": 1,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### Test Document
```json
{
  "testTitle": "Lekhpal 2024 Paper",
  "totalQuestions": 100,
  "duration": 120,
  "marksPerQuestion": 1,
  "negativeMarking": 0.25,
  "instructions": "Read all instructions carefully...",
  "status": "active",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z",
  "order": 1
}
```

### Question Document
```json
{
  "questionText": "What is the capital of India?",
  "options": ["Mumbai", "Delhi", "Kolkata", "Chennai"],
  "correctAnswer": 1,
  "explanation": "Delhi is the capital of India",
  "marks": 1,
  "negativeMarks": 0.25,
  "order": 1,
  "createdAt": "2024-01-15T10:00:00Z"
}
```

## 🔄 Data Flow

### Admin Creates Test Series
1. Admin creates test series → `testSeries/{seriesId}`
2. Admin adds sections → `testSeries/{seriesId}/sections/{sectionId}`
3. Admin adds tests → `sections/{sectionId}/tests/{testId}`
4. Admin adds questions → `tests/{testId}/questions/{questionId}`

### User Takes Test
1. User browses active test series
2. Selects section
3. Selects test
4. Attempts test
5. Submits → Creates `testAttempts/{attemptId}`
6. Updates leaderboard → `leaderboard/{testId}/entries/{userId}`

## 📊 Indexes Required

```
Collection: testSeries
- status ASC, createdAt DESC
- category ASC, status ASC

Collection: testAttempts
- userId ASC, completedAt DESC
- testId ASC, score DESC

Collection: leaderboard/{testId}/entries
- score DESC, timeTaken ASC
```
