import { createContext, useState, useEffect } from "react";
import { auth } from './firebase';
import {
  getAllTestSeries,
  createTestAttempt,
  getUserTestAttempts,
  getUserProfile,
  updateUserProfile
} from './services/firestoreService';

export const TestSeriesContext = createContext();

export function TestSeriesProvider({ children }) {
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
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Get current user ID
  const getUserId = () => {
    return auth.currentUser?.uid || 'guest-user';
  };

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

  // Listen to auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Load data from Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("🔄 Loading data from Firebase...");
        
        // Load test series (always load, even for guests)
        const testSeriesData = await getAllTestSeries(false); // Only active
        console.log("✅ Firebase data loaded:", { testSeriesCount: testSeriesData.length });
        setTestSeries(testSeriesData);
        
        // Load user-specific data if logged in
        const userId = getUserId();
        if (userId !== 'guest-user') {
          console.log("👤 Loading user data for:", userId);
          
          try {
            const [historyData, profileData] = await Promise.all([
              getUserTestAttempts(userId),
              getUserProfile(userId)
            ]);
            
            console.log("📊 User data loaded:", {
              testsCount: historyData.length,
              profile: profileData
            });
            
            // Set test history
            setTestHistory(historyData || []);
            
            // If profile exists, use it; otherwise use default
            if (profileData) {
              setUserProfile(profileData);
            } else {
              // Create default profile if doesn't exist
              const defaultProfile = {
                name: currentUser?.displayName || currentUser?.email?.split('@')[0] || "Student",
                totalTests: 0,
                totalScore: 0,
                averageScore: 0,
                bestScore: 0,
                badges: []
              };
              setUserProfile(defaultProfile);
              
              // Save to Firebase
              try {
                await updateUserProfile(userId, defaultProfile);
                console.log("✅ Default profile created");
              } catch (err) {
                console.error("⚠️ Could not create default profile:", err);
              }
            }
          } catch (userDataError) {
            console.error("⚠️ Error loading user data:", userDataError);
            // Set empty defaults
            setTestHistory([]);
            setUserProfile({
              name: currentUser?.displayName || currentUser?.email?.split('@')[0] || "Student",
              totalTests: 0,
              totalScore: 0,
              averageScore: 0,
              bestScore: 0,
              badges: []
            });
          }
        } else {
          console.log("👤 Guest user - using default profile");
        }
        
        // Load bookmarks from localStorage
        const savedBookmarks = localStorage.getItem("bookmarkedQuestions");
        if (savedBookmarks) {
          setBookmarkedQuestions(JSON.parse(savedBookmarks));
        }
        
      } catch (error) {
        console.error("❌ Error loading data from Firebase:", error);
        
        // Fallback to localStorage
        const savedTestSeries = localStorage.getItem("testSeries");
        if (savedTestSeries) {
          console.log("⚠️ Falling back to localStorage");
          setTestSeries(JSON.parse(savedTestSeries));
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUser]);

  // Save to localStorage as backup
  useEffect(() => {
    if (!loading && testSeries.length > 0) {
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
    const userId = getUserId();
    const newResult = { 
      ...result, 
      userId,
      completedAt: new Date().toISOString() 
    };
    
    try {
      console.log("💾 Saving test result...");
      
      // Save to Firebase
      await createTestAttempt(newResult);
      console.log("✅ Test result saved to Firebase");
      
      // Update local state
      const newHistory = [...testHistory, newResult];
      setTestHistory(newHistory);

      // Calculate updated profile stats
      const totalTests = newHistory.length;
      const totalScore = newHistory.reduce((sum, test) => sum + test.score, 0);
      const averageScore = totalScore / totalTests;
      const bestScore = Math.max(...newHistory.map(test => test.score));

      const updatedProfile = {
        ...userProfile,
        name: userProfile.name || currentUser?.displayName || currentUser?.email?.split('@')[0] || "Student",
        email: currentUser?.email || "",
        totalTests,
        totalScore: parseFloat(totalScore.toFixed(2)),
        averageScore: parseFloat(averageScore.toFixed(2)),
        bestScore: parseFloat(bestScore.toFixed(2)),
        lastTestDate: new Date().toISOString()
      };
      
      setUserProfile(updatedProfile);
      
      console.log("📊 Updated profile:", updatedProfile);
      
      // Save profile to Firebase (don't fail if this fails)
      if (userId !== 'guest-user') {
        try {
          await updateUserProfile(userId, updatedProfile);
          console.log("✅ User profile updated in Firebase");
        } catch (profileError) {
          console.error("⚠️ Profile update failed (non-critical):", profileError);
          // Don't throw - test result is already saved
        }
      }
    } catch (error) {
      console.error("❌ Error saving test result:", error);
      alert("Error saving test result: " + error.message);
      throw error;
    }
  };

  const toggleBookmark = (seriesId, sectionId, testId, questionId) => {
    const bookmarkKey = `${seriesId}-${sectionId}-${testId}-${questionId}`;
    setBookmarkedQuestions(prev => {
      if (prev.includes(bookmarkKey)) {
        return prev.filter(key => key !== bookmarkKey);
      }
      return [...prev, bookmarkKey];
    });
  };

  const isBookmarked = (seriesId, sectionId, testId, questionId) => {
    const bookmarkKey = `${seriesId}-${sectionId}-${testId}-${questionId}`;
    return bookmarkedQuestions.includes(bookmarkKey);
  };

  // Reload test series from Firebase
  // includeAll = true hone par admin ke liye sab series load karo
  const reloadTestSeries = async (includeAll = false) => {
    try {
      setLoading(true);
      const testSeriesData = await getAllTestSeries(includeAll);
      setTestSeries(testSeriesData);
      console.log("Test series reloaded from Firebase");
    } catch (error) {
      console.error("Error reloading test series:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TestSeriesContext.Provider value={{ 
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
      currentUser,
      getUserId,
      reloadTestSeries,
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
