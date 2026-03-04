import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';

// ==================== TEST SERIES ====================

export const createTestSeries = async (seriesData) => {
  try {
    const docRef = await addDoc(collection(db, 'testSeries'), {
      ...seriesData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: seriesData.status || 'draft'
    });
    return { id: docRef.id, ...seriesData };
  } catch (error) {
    console.error('Error creating test series:', error);
    throw error;
  }
};

export const getAllTestSeries = async (includeInactive = false) => {
  try {
    let q = collection(db, 'testSeries');
    
    if (!includeInactive) {
      q = query(q, where('status', '==', 'active'));
    }
    
    q = query(q, orderBy('order', 'asc'), orderBy('createdAt', 'desc'));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting test series:', error);
    throw error;
  }
};

export const getTestSeriesById = async (seriesId) => {
  try {
    const docRef = doc(db, 'testSeries', seriesId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting test series:', error);
    throw error;
  }
};

export const updateTestSeries = async (seriesId, updates) => {
  try {
    const docRef = doc(db, 'testSeries', seriesId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { id: seriesId, ...updates };
  } catch (error) {
    console.error('Error updating test series:', error);
    throw error;
  }
};

export const deleteTestSeries = async (seriesId) => {
  try {
    // Delete all subcollections first (sections, tests, questions)
    const sectionsRef = collection(db, 'testSeries', seriesId, 'sections');
    const sectionsSnap = await getDocs(sectionsRef);
    
    const batch = writeBatch(db);
    
    for (const sectionDoc of sectionsSnap.docs) {
      // Delete tests in this section
      const testsRef = collection(db, 'testSeries', seriesId, 'sections', sectionDoc.id, 'tests');
      const testsSnap = await getDocs(testsRef);
      
      for (const testDoc of testsSnap.docs) {
        // Delete questions in this test
        const questionsRef = collection(db, 'testSeries', seriesId, 'sections', sectionDoc.id, 'tests', testDoc.id, 'questions');
        const questionsSnap = await getDocs(questionsRef);
        
        questionsSnap.docs.forEach(qDoc => {
          batch.delete(qDoc.ref);
        });
        
        batch.delete(testDoc.ref);
      }
      
      batch.delete(sectionDoc.ref);
    }
    
    // Delete the test series itself
    batch.delete(doc(db, 'testSeries', seriesId));
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error deleting test series:', error);
    throw error;
  }
};

// ==================== SECTIONS ====================

export const createSection = async (seriesId, sectionData) => {
  try {
    const docRef = await addDoc(collection(db, 'testSeries', seriesId, 'sections'), {
      ...sectionData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...sectionData };
  } catch (error) {
    console.error('Error creating section:', error);
    throw error;
  }
};

export const getSections = async (seriesId) => {
  try {
    const q = query(
      collection(db, 'testSeries', seriesId, 'sections'),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting sections:', error);
    throw error;
  }
};

export const updateSection = async (seriesId, sectionId, updates) => {
  try {
    const docRef = doc(db, 'testSeries', seriesId, 'sections', sectionId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { id: sectionId, ...updates };
  } catch (error) {
    console.error('Error updating section:', error);
    throw error;
  }
};

export const deleteSection = async (seriesId, sectionId) => {
  try {
    // Delete all tests and questions in this section
    const testsRef = collection(db, 'testSeries', seriesId, 'sections', sectionId, 'tests');
    const testsSnap = await getDocs(testsRef);
    
    const batch = writeBatch(db);
    
    for (const testDoc of testsSnap.docs) {
      const questionsRef = collection(db, 'testSeries', seriesId, 'sections', sectionId, 'tests', testDoc.id, 'questions');
      const questionsSnap = await getDocs(questionsRef);
      
      questionsSnap.docs.forEach(qDoc => {
        batch.delete(qDoc.ref);
      });
      
      batch.delete(testDoc.ref);
    }
    
    batch.delete(doc(db, 'testSeries', seriesId, 'sections', sectionId));
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error deleting section:', error);
    throw error;
  }
};

// ==================== TESTS ====================

export const createTest = async (seriesId, sectionId, testData) => {
  try {
    const docRef = await addDoc(
      collection(db, 'testSeries', seriesId, 'sections', sectionId, 'tests'),
      {
        ...testData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: testData.status || 'draft'
      }
    );
    return { id: docRef.id, ...testData };
  } catch (error) {
    console.error('Error creating test:', error);
    throw error;
  }
};

export const getTests = async (seriesId, sectionId, includeInactive = false) => {
  try {
    let q = collection(db, 'testSeries', seriesId, 'sections', sectionId, 'tests');
    
    if (!includeInactive) {
      q = query(q, where('status', '==', 'active'));
    }
    
    q = query(q, orderBy('order', 'asc'));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting tests:', error);
    throw error;
  }
};

export const getTestById = async (seriesId, sectionId, testId) => {
  try {
    const docRef = doc(db, 'testSeries', seriesId, 'sections', sectionId, 'tests', testId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting test:', error);
    throw error;
  }
};

export const updateTest = async (seriesId, sectionId, testId, updates) => {
  try {
    const docRef = doc(db, 'testSeries', seriesId, 'sections', sectionId, 'tests', testId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { id: testId, ...updates };
  } catch (error) {
    console.error('Error updating test:', error);
    throw error;
  }
};

export const deleteTest = async (seriesId, sectionId, testId) => {
  try {
    // Delete all questions in this test
    const questionsRef = collection(db, 'testSeries', seriesId, 'sections', sectionId, 'tests', testId, 'questions');
    const questionsSnap = await getDocs(questionsRef);
    
    const batch = writeBatch(db);
    
    questionsSnap.docs.forEach(qDoc => {
      batch.delete(qDoc.ref);
    });
    
    batch.delete(doc(db, 'testSeries', seriesId, 'sections', sectionId, 'tests', testId));
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error deleting test:', error);
    throw error;
  }
};

// ==================== QUESTIONS ====================

export const createQuestion = async (seriesId, sectionId, testId, questionData) => {
  try {
    const docRef = await addDoc(
      collection(db, 'testSeries', seriesId, 'sections', sectionId, 'tests', testId, 'questions'),
      {
        ...questionData,
        createdAt: serverTimestamp()
      }
    );
    return { id: docRef.id, ...questionData };
  } catch (error) {
    console.error('Error creating question:', error);
    throw error;
  }
};

export const bulkCreateQuestions = async (seriesId, sectionId, testId, questionsArray) => {
  try {
    const batch = writeBatch(db);
    const questionsRef = collection(db, 'testSeries', seriesId, 'sections', sectionId, 'tests', testId, 'questions');
    
    questionsArray.forEach((questionData, index) => {
      const docRef = doc(questionsRef);
      batch.set(docRef, {
        ...questionData,
        order: index + 1,
        createdAt: serverTimestamp()
      });
    });
    
    await batch.commit();
    return questionsArray.length;
  } catch (error) {
    console.error('Error bulk creating questions:', error);
    throw error;
  }
};

export const getQuestions = async (seriesId, sectionId, testId) => {
  try {
    const q = query(
      collection(db, 'testSeries', seriesId, 'sections', sectionId, 'tests', testId, 'questions'),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting questions:', error);
    throw error;
  }
};

export const updateQuestion = async (seriesId, sectionId, testId, questionId, updates) => {
  try {
    const docRef = doc(db, 'testSeries', seriesId, 'sections', sectionId, 'tests', testId, 'questions', questionId);
    await updateDoc(docRef, updates);
    return { id: questionId, ...updates };
  } catch (error) {
    console.error('Error updating question:', error);
    throw error;
  }
};

export const deleteQuestion = async (seriesId, sectionId, testId, questionId) => {
  try {
    await deleteDoc(doc(db, 'testSeries', seriesId, 'sections', sectionId, 'tests', testId, 'questions', questionId));
    return true;
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};

// ==================== TEST ATTEMPTS ====================

export const createTestAttempt = async (attemptData) => {
  try {
    const docRef = await addDoc(collection(db, 'testAttempts'), {
      ...attemptData,
      startedAt: serverTimestamp()
    });
    return { id: docRef.id, ...attemptData };
  } catch (error) {
    console.error('Error creating test attempt:', error);
    throw error;
  }
};

export const updateTestAttempt = async (attemptId, updates) => {
  try {
    const docRef = doc(db, 'testAttempts', attemptId);
    await updateDoc(docRef, {
      ...updates,
      completedAt: serverTimestamp()
    });
    return { id: attemptId, ...updates };
  } catch (error) {
    console.error('Error updating test attempt:', error);
    throw error;
  }
};

export const getUserTestAttempts = async (userId) => {
  try {
    const q = query(
      collection(db, 'testAttempts'),
      where('userId', '==', userId),
      orderBy('completedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting user test attempts:', error);
    throw error;
  }
};

// ==================== USER MANAGEMENT ====================

export const getUserProfile = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, updates);
    return { id: userId, ...updates };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const createUserProfile = async (userId, userData) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    });
    return { id: userId, ...userData };
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};
