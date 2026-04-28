import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  setDoc,
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

// Subcollections se ek series ka data load karo
const loadSeriesFromSubcollections = async (seriesId) => {
  let sectionsSnap;
  try {
    sectionsSnap = await getDocs(query(
      collection(db, 'testSeries', seriesId, 'sections'),
      orderBy('order', 'asc')
    ));
  } catch {
    sectionsSnap = await getDocs(collection(db, 'testSeries', seriesId, 'sections'));
  }

  if (sectionsSnap.docs.length === 0) return null; // Subcollections mein kuch nahi

  const sections = await Promise.all(
    sectionsSnap.docs.map(async (sectionDoc) => {
      const sectionData = { id: sectionDoc.id, ...sectionDoc.data() };

      let testsSnap;
      try {
        testsSnap = await getDocs(query(
          collection(db, 'testSeries', seriesId, 'sections', sectionDoc.id, 'tests'),
          orderBy('order', 'asc')
        ));
      } catch {
        testsSnap = await getDocs(collection(db, 'testSeries', seriesId, 'sections', sectionDoc.id, 'tests'));
      }

      const tests = await Promise.all(
        testsSnap.docs.map(async (testDoc) => {
          const testData = { id: testDoc.id, ...testDoc.data() };

          let questionsSnap;
          try {
            questionsSnap = await getDocs(query(
              collection(db, 'testSeries', seriesId, 'sections', sectionDoc.id, 'tests', testDoc.id, 'questions'),
              orderBy('order', 'asc')
            ));
          } catch {
            questionsSnap = await getDocs(collection(db, 'testSeries', seriesId, 'sections', sectionDoc.id, 'tests', testDoc.id, 'questions'));
          }

          const questions = questionsSnap.docs.map(qDoc => ({ id: qDoc.id, ...qDoc.data() }));
          return { ...testData, questions };
        })
      );

      return { ...sectionData, tests };
    })
  );

  return sections;
};

export const getAllTestSeries = async (includeInactive = false) => {
  try {
    const q = collection(db, 'testSeries');
    const snapshot = await getDocs(q);
    const allSeries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Status filter
    const filteredSeries = includeInactive
      ? allSeries
      : allSeries.filter(series => series.status === 'active');

    const seriesWithData = await Promise.all(
      filteredSeries.map(async (series) => {
        try {
          // Pehle subcollections se load karo
          const subcollectionSections = await loadSeriesFromSubcollections(series.id);

          if (subcollectionSections !== null) {
            // Subcollections mein data mila — use karo
            return { ...series, sections: subcollectionSections };
          }

          // Subcollections empty hain — document ke nested sections field check karo (BINA migrate kiye)
          if (series.sections && series.sections.length > 0) {
            console.log(`📦 Series "${series.title}" mein purana nested data hai — as-is use kar rahe hain`);
            return { ...series }; // Nested data as-is return karo, kuch wipe mat karo
          }

          // Koi data nahi
          return { ...series, sections: [] };

        } catch (err) {
          console.error(`Error loading series ${series.id}:`, err);
          return { ...series, sections: series.sections || [] };
        }
      })
    );

    return seriesWithData;
  } catch (error) {
    console.error('Error getting test series:', error);
    return [];
  }
};

/**
 * Safe migration: purana nested data subcollections mein migrate karo
 * 500 operations ki limit ke liye chunked batches use karta hai
 * DATA WIPE NAHI KARTA jab tak migration 100% successful na ho
 */
export const migrateSeriesDataSafely = async (series) => {
  try {
    if (!series.sections || series.sections.length === 0) {
      console.log(`⚠️ Series "${series.title}" mein migrate karne ke liye koi data nahi`);
      return false;
    }

    console.log(`🔄 Migrating series: "${series.title}"...`);

    // Saare operations collect karo
    const operations = [];

    for (let si = 0; si < series.sections.length; si++) {
      const section = series.sections[si];
      const sectionRef = doc(collection(db, 'testSeries', series.id, 'sections'));
      const sectionId = sectionRef.id;

      operations.push({ ref: sectionRef, data: {
        title: section.title || '',
        description: section.description || '',
        order: si,
        migratedAt: serverTimestamp()
      }});

      const tests = section.tests || [];
      for (let ti = 0; ti < tests.length; ti++) {
        const test = tests[ti];
        const testRef = doc(collection(db, 'testSeries', series.id, 'sections', sectionId, 'tests'));
        const testId = testRef.id;

        operations.push({ ref: testRef, data: {
          title: test.title || '',
          duration: test.duration || 60,
          marksPerQuestion: test.marksPerQuestion || 1,
          negativeMarking: test.negativeMarking || 0.25,
          instructions: test.instructions || '',
          status: test.status || 'active',
          order: ti,
          migratedAt: serverTimestamp()
        }});

        const questions = test.questions || [];
        for (let qi = 0; qi < questions.length; qi++) {
          const question = questions[qi];
          const questionRef = doc(collection(db, 'testSeries', series.id, 'sections', sectionId, 'tests', testId, 'questions'));

          operations.push({ ref: questionRef, data: {
            question: question.question || '',
            options: question.options || [],
            answer: question.answer ?? 0,
            explanation: question.explanation || '',
            image: question.image || '',
            order: qi,
            migratedAt: serverTimestamp()
          }});
        }
      }
    }

    // 499 operations ke chunks mein batch commit karo
    const CHUNK_SIZE = 499;
    for (let i = 0; i < operations.length; i += CHUNK_SIZE) {
      const chunk = operations.slice(i, i + CHUNK_SIZE);
      const batch = writeBatch(db);
      chunk.forEach(op => batch.set(op.ref, op.data));
      await batch.commit();
      console.log(`✅ Batch ${Math.floor(i / CHUNK_SIZE) + 1} committed (${chunk.length} ops)`);
    }

    // Sirf tab purana data hata do jab saare batches successful ho gaye
    await updateDoc(doc(db, 'testSeries', series.id), {
      sections: [],
      migratedToSubcollections: true,
      updatedAt: serverTimestamp()
    });

    console.log(`✅ Migration complete for: "${series.title}" (${operations.length} total ops)`);
    return true;
  } catch (err) {
    console.error(`❌ Migration failed for series ${series.id}:`, err);
    // Kuch wipe nahi kiya — data safe hai
    throw err;
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

    const cleanUpdates = { ...updates };
    delete cleanUpdates.id;
    delete cleanUpdates.createdAt;

    await updateDoc(docRef, {
      ...cleanUpdates,
      updatedAt: serverTimestamp()
    });

    return { id: seriesId, ...cleanUpdates };
  } catch (error) {
    console.error('Error updating test series:', error);
    throw error;
  }
};

export const deleteTestSeries = async (seriesId) => {
  try {
    await deleteDoc(doc(db, 'testSeries', seriesId));
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
    const testsRef = collection(db, 'testSeries', seriesId, 'sections', sectionId, 'tests');
    const testsSnap = await getDocs(testsRef);

    const batch = writeBatch(db);

    for (const testDoc of testsSnap.docs) {
      const questionsRef = collection(db, 'testSeries', seriesId, 'sections', sectionId, 'tests', testDoc.id, 'questions');
      const questionsSnap = await getDocs(questionsRef);
      questionsSnap.docs.forEach(qDoc => batch.delete(qDoc.ref));
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
    const questionsRef = collection(db, 'testSeries', seriesId, 'sections', sectionId, 'tests', testId, 'questions');
    const questionsSnap = await getDocs(questionsRef);

    const batch = writeBatch(db);
    questionsSnap.docs.forEach(qDoc => batch.delete(qDoc.ref));
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
    const questionsRef = collection(db, 'testSeries', seriesId, 'sections', sectionId, 'tests', testId, 'questions');
    const CHUNK_SIZE = 499;

    for (let i = 0; i < questionsArray.length; i += CHUNK_SIZE) {
      const chunk = questionsArray.slice(i, i + CHUNK_SIZE);
      const batch = writeBatch(db);
      chunk.forEach((questionData, idx) => {
        const docRef = doc(questionsRef);
        batch.set(docRef, {
          ...questionData,
          order: i + idx + 1,
          createdAt: serverTimestamp()
        });
      });
      await batch.commit();
    }

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
    const cleanData = JSON.parse(JSON.stringify(attemptData));
    const docRef = await addDoc(collection(db, 'testAttempts'), {
      ...cleanData,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...cleanData };
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
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    const attempts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    attempts.sort((a, b) => {
      const dateA = new Date(a.completedAt || a.date);
      const dateB = new Date(b.completedAt || b.date);
      return dateB - dateA;
    });

    return attempts;
  } catch (error) {
    console.error('Error getting user test attempts:', error);
    return [];
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
    await setDoc(docRef, updates, { merge: true });
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

// ==================== LEADERBOARD ====================

export const getAllUsers = async () => {
  try {
    const q = collection(db, 'users');
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
};

// ==================== TEST-SPECIFIC LEADERBOARD ====================

export const saveTestResult = async (resultData) => {
  try {
    const { userId, testId } = resultData;

    const existingQuery = query(
      collection(db, 'testResults'),
      where('userId', '==', userId),
      where('testId', '==', testId)
    );

    const existingSnapshot = await getDocs(existingQuery);

    if (!existingSnapshot.empty) {
      const existingDoc = existingSnapshot.docs[0];
      const existingData = existingDoc.data();

      await updateDoc(doc(db, 'testResults', existingDoc.id), {
        ...resultData,
        completedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        attemptCount: (existingData.attemptCount || 1) + 1
      });

      return { id: existingDoc.id, ...resultData };
    } else {
      const docRef = await addDoc(collection(db, 'testResults'), {
        ...resultData,
        completedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        attemptCount: 1
      });

      return { id: docRef.id, ...resultData };
    }
  } catch (error) {
    console.error('Error saving test result:', error);
    throw error;
  }
};

export const getTestLeaderboard = async (testId) => {
  try {
    const q = query(
      collection(db, 'testResults'),
      where('testId', '==', testId)
    );

    const snapshot = await getDocs(q);
    const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    results.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.timeTaken - b.timeTaken;
    });

    results.forEach((result, index) => {
      result.rank = index + 1;
    });

    return results;
  } catch (error) {
    console.error('Error getting test leaderboard:', error);
    return [];
  }
};

export const getUserRankInTest = async (testId, userId) => {
  try {
    const leaderboard = await getTestLeaderboard(testId);
    const userResult = leaderboard.find(r => r.userId === userId);

    if (!userResult) return null;

    return {
      rank: userResult.rank,
      totalParticipants: leaderboard.length,
      percentile: ((leaderboard.length - userResult.rank + 1) / leaderboard.length * 100).toFixed(2),
      score: userResult.score,
      percentage: userResult.percentage
    };
  } catch (error) {
    console.error('Error getting user rank:', error);
    return null;
  }
};

// ==================== LIVE TEST SCHEDULING ====================

/**
 * Test ko specific time window ke liye live schedule karo
 */
export const scheduleLiveTest = async (liveTestData) => {
  try {
    // Pehle check karo ki same test ka koi existing schedule hai
    const existingQuery = query(
      collection(db, 'liveTests'),
      where('testSeriesId', '==', liveTestData.testSeriesId),
      where('sectionId', '==', liveTestData.sectionId),
      where('testId', '==', liveTestData.testId)
    );
    const existingSnap = await getDocs(existingQuery);

    if (!existingSnap.empty) {
      // Update existing schedule
      const existingDoc = existingSnap.docs[0];
      await updateDoc(doc(db, 'liveTests', existingDoc.id), {
        ...liveTestData,
        updatedAt: serverTimestamp()
      });
      return { id: existingDoc.id, ...liveTestData };
    }

    // Nayi schedule create karo
    const docRef = await addDoc(collection(db, 'liveTests'), {
      ...liveTestData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...liveTestData };
  } catch (error) {
    console.error('Error scheduling live test:', error);
    throw error;
  }
};

/**
 * Saare live test schedules fetch karo
 */
export const getLiveTests = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'liveTests'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting live tests:', error);
    return [];
  }
};

/**
 * Specific test ka live schedule fetch karo
 */
export const getLiveTestSchedule = async (testSeriesId, sectionId, testId) => {
  try {
    const q = query(
      collection(db, 'liveTests'),
      where('testSeriesId', '==', testSeriesId),
      where('sectionId', '==', sectionId),
      where('testId', '==', testId)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() };
  } catch (error) {
    console.error('Error getting live test schedule:', error);
    return null;
  }
};

/**
 * Live test schedule delete karo (unschedule)
 */
export const deleteLiveTestSchedule = async (liveTestId) => {
  try {
    await deleteDoc(doc(db, 'liveTests', liveTestId));
    return true;
  } catch (error) {
    console.error('Error deleting live test schedule:', error);
    throw error;
  }
};

/**
 * Check karo ki user ne yeh live test pehle diya hai ya nahi
 */
export const checkUserAttemptedLiveTest = async (userId, liveTestId) => {
  try {
    const q = query(
      collection(db, 'liveTestAttempts'),
      where('userId', '==', userId),
      where('liveTestId', '==', liveTestId)
    );
    const snap = await getDocs(q);
    return !snap.empty;
  } catch (error) {
    console.error('Error checking live test attempt:', error);
    return false;
  }
};

/**
 * User ka live test attempt record karo
 */
export const recordLiveTestAttempt = async (userId, userEmail, liveTestId, testTitle) => {
  try {
    await addDoc(collection(db, 'liveTestAttempts'), {
      userId,
      userEmail,
      liveTestId,
      testTitle,
      attemptedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error recording live test attempt:', error);
    throw error;
  }
};

// ==================== STUDY MATERIAL ====================

// Study Material top-level CRUD
export const createStudyMaterial = async (data) => {
  try {
    const docRef = await addDoc(collection(db, 'studyMaterials'), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('Error creating study material:', error);
    throw error;
  }
};

export const getAllStudyMaterials = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'studyMaterials'));
    const materials = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    const withSections = await Promise.all(materials.map(async (mat) => {
      let sectionsSnap;
      try {
        sectionsSnap = await getDocs(query(
          collection(db, 'studyMaterials', mat.id, 'sections'),
          orderBy('order', 'asc')
        ));
      } catch {
        sectionsSnap = await getDocs(collection(db, 'studyMaterials', mat.id, 'sections'));
      }

      const sections = await Promise.all(sectionsSnap.docs.map(async (secDoc) => {
        const secData = { id: secDoc.id, ...secDoc.data() };
        let itemsSnap;
        try {
          itemsSnap = await getDocs(query(
            collection(db, 'studyMaterials', mat.id, 'sections', secDoc.id, 'items'),
            orderBy('order', 'asc')
          ));
        } catch {
          itemsSnap = await getDocs(collection(db, 'studyMaterials', mat.id, 'sections', secDoc.id, 'items'));
        }
        const items = itemsSnap.docs.map(iDoc => ({ id: iDoc.id, ...iDoc.data() }));
        return { ...secData, items };
      }));

      return { ...mat, sections };
    }));

    return withSections;
  } catch (error) {
    console.error('Error getting study materials:', error);
    return [];
  }
};

export const updateStudyMaterial = async (id, updates) => {
  try {
    await updateDoc(doc(db, 'studyMaterials', id), { ...updates, updatedAt: serverTimestamp() });
    return { id, ...updates };
  } catch (error) {
    console.error('Error updating study material:', error);
    throw error;
  }
};

export const deleteStudyMaterial = async (id) => {
  try {
    await deleteDoc(doc(db, 'studyMaterials', id));
    return true;
  } catch (error) {
    console.error('Error deleting study material:', error);
    throw error;
  }
};

// Study Section CRUD
export const createStudySection = async (materialId, data) => {
  try {
    const docRef = await addDoc(collection(db, 'studyMaterials', materialId, 'sections'), {
      ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...data };
  } catch (error) { console.error('Error creating study section:', error); throw error; }
};

export const updateStudySection = async (materialId, sectionId, updates) => {
  try {
    await updateDoc(doc(db, 'studyMaterials', materialId, 'sections', sectionId), { ...updates, updatedAt: serverTimestamp() });
    return { id: sectionId, ...updates };
  } catch (error) { console.error('Error updating study section:', error); throw error; }
};

export const deleteStudySection = async (materialId, sectionId) => {
  try {
    const itemsSnap = await getDocs(collection(db, 'studyMaterials', materialId, 'sections', sectionId, 'items'));
    const batch = writeBatch(db);
    itemsSnap.docs.forEach(d => batch.delete(d.ref));
    batch.delete(doc(db, 'studyMaterials', materialId, 'sections', sectionId));
    await batch.commit();
    return true;
  } catch (error) { console.error('Error deleting study section:', error); throw error; }
};

// Study Item CRUD
export const createStudyItem = async (materialId, sectionId, data) => {
  try {
    const docRef = await addDoc(
      collection(db, 'studyMaterials', materialId, 'sections', sectionId, 'items'),
      { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }
    );
    return { id: docRef.id, ...data };
  } catch (error) { console.error('Error creating study item:', error); throw error; }
};

export const updateStudyItem = async (materialId, sectionId, itemId, updates) => {
  try {
    await updateDoc(
      doc(db, 'studyMaterials', materialId, 'sections', sectionId, 'items', itemId),
      { ...updates, updatedAt: serverTimestamp() }
    );
    return { id: itemId, ...updates };
  } catch (error) { console.error('Error updating study item:', error); throw error; }
};

export const deleteStudyItem = async (materialId, sectionId, itemId) => {
  try {
    await deleteDoc(doc(db, 'studyMaterials', materialId, 'sections', sectionId, 'items', itemId));
    return true;
  } catch (error) { console.error('Error deleting study item:', error); throw error; }
};
