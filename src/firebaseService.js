import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc,
  setDoc,
  query,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Collections
const SUBJECTS_COLLECTION = 'subjects';
const TEST_SERIES_COLLECTION = 'testSeries';
const TEST_HISTORY_COLLECTION = 'testHistory';
const USER_PROFILES_COLLECTION = 'userProfiles';

// ==================== SUBJECTS ====================

// Get all subjects
export const getAllSubjects = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, SUBJECTS_COLLECTION));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting subjects:", error);
    throw error;
  }
};

// Add a new subject
export const addSubject = async (subject) => {
  try {
    const docRef = await addDoc(collection(db, SUBJECTS_COLLECTION), {
      ...subject,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...subject };
  } catch (error) {
    console.error("Error adding subject:", error);
    throw error;
  }
};

// Update a subject
export const updateSubject = async (subjectId, updates) => {
  try {
    const subjectRef = doc(db, SUBJECTS_COLLECTION, subjectId);
    await updateDoc(subjectRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating subject:", error);
    throw error;
  }
};

// Delete a subject
export const deleteSubject = async (subjectId) => {
  try {
    await deleteDoc(doc(db, SUBJECTS_COLLECTION, subjectId));
  } catch (error) {
    console.error("Error deleting subject:", error);
    throw error;
  }
};

// ==================== TEST SERIES ====================

// Get all test series
export const getAllTestSeries = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, TEST_SERIES_COLLECTION));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting test series:", error);
    throw error;
  }
};

// Add a new test series
export const addTestSeries = async (testSeries) => {
  try {
    const docRef = await addDoc(collection(db, TEST_SERIES_COLLECTION), {
      ...testSeries,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...testSeries };
  } catch (error) {
    console.error("Error adding test series:", error);
    throw error;
  }
};

// Update a test series
export const updateTestSeries = async (seriesId, updates) => {
  try {
    const seriesRef = doc(db, TEST_SERIES_COLLECTION, seriesId);
    await updateDoc(seriesRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating test series:", error);
    throw error;
  }
};

// Delete a test series
export const deleteTestSeries = async (seriesId) => {
  try {
    await deleteDoc(doc(db, TEST_SERIES_COLLECTION, seriesId));
  } catch (error) {
    console.error("Error deleting test series:", error);
    throw error;
  }
};

// ==================== TEST HISTORY ====================

// Get user test history
export const getUserTestHistory = async (userId) => {
  try {
    const q = query(
      collection(db, TEST_HISTORY_COLLECTION),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(test => test.userId === userId);
  } catch (error) {
    console.error("Error getting test history:", error);
    throw error;
  }
};

// Add test result
export const addTestResult = async (userId, result) => {
  try {
    const docRef = await addDoc(collection(db, TEST_HISTORY_COLLECTION), {
      userId,
      ...result,
      date: serverTimestamp()
    });
    return { id: docRef.id, ...result };
  } catch (error) {
    console.error("Error adding test result:", error);
    throw error;
  }
};

// ==================== USER PROFILE ====================

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const docRef = doc(db, USER_PROFILES_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      // Create default profile if doesn't exist
      const defaultProfile = {
        name: "Student",
        totalTests: 0,
        totalScore: 0,
        averageScore: 0,
        bestScore: 0,
        badges: []
      };
      await setDoc(docRef, defaultProfile);
      return { id: userId, ...defaultProfile };
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId, updates) => {
  try {
    const profileRef = doc(db, USER_PROFILES_COLLECTION, userId);
    await updateDoc(profileRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// ==================== SYNC FUNCTIONS ====================

// Sync local data to Firebase (for migration)
export const syncLocalToFirebase = async (subjects, testSeries, testHistory, userProfile) => {
  try {
    // Sync subjects
    for (const subject of subjects) {
      await addSubject(subject);
    }
    
    // Sync test series
    for (const series of testSeries) {
      await addTestSeries(series);
    }
    
    // Sync test history
    const userId = 'default-user'; // You can replace with actual user ID
    for (const test of testHistory) {
      await addTestResult(userId, test);
    }
    
    // Sync user profile
    await setDoc(doc(db, USER_PROFILES_COLLECTION, userId), userProfile);
    
    return true;
  } catch (error) {
    console.error("Error syncing to Firebase:", error);
    throw error;
  }
};
