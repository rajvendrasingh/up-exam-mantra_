import { createContext, useState, useEffect } from "react";
import {
  getAllSubjects,
  addSubject as addSubjectToFirebase,
  updateSubject as updateSubjectInFirebase,
  deleteSubject as deleteSubjectFromFirebase,
  getAllTestSeries,
  addTestSeries as addTestSeriesToFirebase,
  updateTestSeries as updateTestSeriesInFirebase,
  deleteTestSeries as deleteTestSeriesFromFirebase,
  getUserTestHistory,
  addTestResult as addTestResultToFirebase,
  getUserProfile,
  updateUserProfile as updateUserProfileInFirebase
} from './firebaseService';

export const TestSeriesContext = createContext();

export function TestSeriesProvider({ children }) {
  const [subjects, setSubjects] = useState([]);
  const [testSeries, setTestSeries] = useState([]);
  const [testHistory, setTestHistory] = useState([]);
  const [userProfile, setUserProfile] = useState({
    name: "Student",
    totalTests: 0,
    totalScore: 0,
    averageScore: 0,
    bestScore: 0,
    badges: []
  });
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useFirebase, setUseFirebase] = useState(false); // Toggle Firebase on/off
  const [notifications, setNotifications] = useState([]);
  
  const userId = 'default-user'; // You can implement proper auth later

  // Add notification function
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Load data from Firebase or localStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        if (useFirebase) {
          // Load from Firebase
          const [subjectsData, testSeriesData, historyData, profileData] = await Promise.all([
            getAllSubjects(),
            getAllTestSeries(),
            getUserTestHistory(userId),
            getUserProfile(userId)
          ]);
          
          setSubjects(subjectsData);
          setTestSeries(testSeriesData);
          setTestHistory(historyData);
          setUserProfile(profileData);
        } else {
          // Load from localStorage
          const savedSubjects = localStorage.getItem("subjects");
          const savedTestSeries = localStorage.getItem("testSeries");
          const savedHistory = localStorage.getItem("testHistory");
          const savedProfile = localStorage.getItem("userProfile");
          const savedBookmarks = localStorage.getItem("bookmarkedQuestions");
          
          if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
          if (savedTestSeries) setTestSeries(JSON.parse(savedTestSeries));
          if (savedHistory) setTestHistory(JSON.parse(savedHistory));
          if (savedProfile) setUserProfile(JSON.parse(savedProfile));
          if (savedBookmarks) setBookmarkedQuestions(JSON.parse(savedBookmarks));
        }
      } catch (error) {
        console.error("Error loading data:", error);
        // Fallback to localStorage if Firebase fails
        const savedSubjects = localStorage.getItem("subjects");
        if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [useFirebase]);

  // Save to localStorage (backup)
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("subjects", JSON.stringify(subjects));
    }
  }, [subjects, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("testSeries", JSON.stringify(testSeries));
    }
  }, [testSeries, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("testHistory", JSON.stringify(testHistory));
    }
  }, [testHistory, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
    }
  }, [userProfile, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("bookmarkedQuestions", JSON.stringify(bookmarkedQuestions));
    }
  }, [bookmarkedQuestions, loading]);

  // Load and save notifications
  useEffect(() => {
    const savedNotifications = localStorage.getItem("notifications");
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("notifications", JSON.stringify(notifications));
    }
  }, [notifications, loading]);

  // Add test result
  const addTestResult = async (result) => {
    const newResult = { ...result, date: new Date().toISOString() };
    
    if (useFirebase) {
      try {
        await addTestResultToFirebase(userId, newResult);
      } catch (error) {
        console.error("Error adding test result to Firebase:", error);
      }
    }
    
    const newHistory = [...testHistory, newResult];
    setTestHistory(newHistory);

    const totalTests = newHistory.length;
    const totalScore = newHistory.reduce((sum, test) => sum + test.score, 0);
    const averageScore = totalScore / totalTests;
    const bestScore = Math.max(...newHistory.map(test => test.score));

    const updatedProfile = {
      ...userProfile,
      totalTests,
      totalScore,
      averageScore: averageScore.toFixed(2),
      bestScore
    };
    
    setUserProfile(updatedProfile);
    
    if (useFirebase) {
      try {
        await updateUserProfileInFirebase(userId, updatedProfile);
      } catch (error) {
        console.error("Error updating profile in Firebase:", error);
      }
    }
  };

  const toggleBookmark = (seriesId, questionIndex) => {
    const bookmarkKey = `${seriesId}-${questionIndex}`;
    setBookmarkedQuestions(prev => {
      if (prev.includes(bookmarkKey)) {
        return prev.filter(key => key !== bookmarkKey);
      }
      return [...prev, bookmarkKey];
    });
  };

  const isBookmarked = (seriesId, questionIndex) => {
    return bookmarkedQuestions.includes(`${seriesId}-${questionIndex}`);
  };

  // Sync local data to Firebase
  const syncToFirebase = async () => {
    try {
      setLoading(true);
      
      // Clear Firebase and upload local data
      for (const subject of subjects) {
        await addSubjectToFirebase(subject);
      }
      
      for (const series of testSeries) {
        await addTestSeriesToFirebase(series);
      }
      
      alert("✅ Data synced to Firebase successfully!");
      setUseFirebase(true);
    } catch (error) {
      console.error("Error syncing to Firebase:", error);
      alert("❌ Error syncing to Firebase: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TestSeriesContext.Provider value={{ 
      subjects,
      setSubjects,
      testSeries, 
      setTestSeries,
      testHistory,
      addTestResult,
      userProfile,
      setUserProfile,
      bookmarkedQuestions,
      toggleBookmark,
      isBookmarked,
      loading,
      useFirebase,
      setUseFirebase,
      syncToFirebase,
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearAllNotifications
    }}>
      {children}
    </TestSeriesContext.Provider>
  );
}
