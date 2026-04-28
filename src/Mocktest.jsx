import { useContext, useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { TestSeriesContext } from "./TestSeriesContext";
import { saveTestResult, getLiveTestSchedule, checkUserAttemptedLiveTest, recordLiveTestAttempt } from "./services/firestoreService";
import { auth } from "./firebase";

export default function Mocktest() {
  const { testSeries, addTestResult } = useContext(TestSeriesContext);
  const [searchParams] = useSearchParams();
  
  // Filter only active test series for users
  const activeTestSeries = testSeries.filter(series => series.status === "active");
  
  // Navigation states
  const [mode, setMode] = useState("select"); // "select", "testseries", "section", "test"
  const [selectedSeriesIdx, setSelectedSeriesIdx] = useState(null);
  const [selectedSectionIdx, setSelectedSectionIdx] = useState(null);
  const [selectedTestIdx, setSelectedTestIdx] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  
  // Get current items from ACTIVE test series
  const currentSeries = selectedSeriesIdx !== null ? activeTestSeries[selectedSeriesIdx] : null;
  const currentSection = currentSeries && selectedSectionIdx !== null ? currentSeries.sections?.[selectedSectionIdx] : null;
  const currentTest = currentSection && selectedTestIdx !== null ? currentSection.tests?.[selectedTestIdx] : null;
  const questions = currentTest?.questions || [];
  
  // Test states
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState([]);
  const [submitted, setSubmitted] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(45);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [flagged, setFlagged] = useState([]);
  
  // Language translator states
  const [translatedQuestions, setTranslatedQuestions] = useState({});
  const [translatedOptions, setTranslatedOptions] = useState({});
  const [translating, setTranslating] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("original"); // "original", "hindi", "english"
  
  // Mobile menu state
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Test start time track karne ke liye ref
  const testStartTimeRef = useRef(null);

  // Live test state
  const [liveSchedule, setLiveSchedule] = useState(null); // current test ka live schedule

  // Deep link handler: URL params se seedha test kholo
  // e.g. /test?series=SERIES_ID&section=SECTION_ID&test=TEST_ID
  useEffect(() => {
    const seriesId = searchParams.get("series");
    const sectionId = searchParams.get("section");
    const testId = searchParams.get("test");

    if (!seriesId || activeTestSeries.length === 0) return;

    const sIdx = activeTestSeries.findIndex(s => s.id === seriesId);
    if (sIdx === -1) return;

    setSelectedSeriesIdx(sIdx);

    if (!sectionId) { setMode("section"); return; }

    const series = activeTestSeries[sIdx];
    const secIdx = series.sections?.findIndex(s => s.id === sectionId) ?? -1;
    if (secIdx === -1) { setMode("section"); return; }

    setSelectedSectionIdx(secIdx);

    if (!testId) { setMode("test"); return; }

    const section = series.sections[secIdx];
    const tIdx = section.tests?.findIndex(t => t.id === testId) ?? -1;
    if (tIdx === -1) { setMode("test"); return; }

    setSelectedTestIdx(tIdx);
    setMode("test");

    const test = section.tests[tIdx];
    if (test.questions && test.questions.length > 0) {
      setShowInstructions(true);
    }
  }, [searchParams, activeTestSeries.length]);

  // Auto-skip logic: agar sirf ek series/section/test hai to seedha kholo
  useEffect(() => {
    if (activeTestSeries.length === 0) return;

    // Deep link: URL params se seedha test pe jaao
    const seriesId = searchParams.get("series");
    const sectionId = searchParams.get("section");
    const testId = searchParams.get("test");

    if (seriesId && sectionId && testId) {
      const sIdx = activeTestSeries.findIndex(s => s.id === seriesId);
      if (sIdx === -1) return;
      const series = activeTestSeries[sIdx];
      const secIdx = series.sections?.findIndex(sec => sec.id === sectionId) ?? -1;
      if (secIdx === -1) return;
      const section = series.sections[secIdx];
      const tIdx = section.tests?.findIndex(t => t.id === testId) ?? -1;
      if (tIdx === -1) return;

      setSelectedSeriesIdx(sIdx);
      setSelectedSectionIdx(secIdx);
      setSelectedTestIdx(tIdx);
      setMode("test");
      if (section.tests[tIdx].questions?.length > 0) {
        setShowInstructions(true);
      }
      return;
    }

    // Auto-skip: agar sirf ek series hai
    if (mode === "select" && activeTestSeries.length === 1) {
      const series = activeTestSeries[0];
      setSelectedSeriesIdx(0);
      if (series.sections && series.sections.length > 0) {
        setMode("section");
      }
    }
  }, [activeTestSeries.length, mode, searchParams]);
  useEffect(() => {
    if (mode === "section" && selectedSeriesIdx !== null) {
      const series = activeTestSeries[selectedSeriesIdx];
      const sections = series?.sections || [];
      if (sections.length === 1) {
        setSelectedSectionIdx(0);
        if (sections[0].tests && sections[0].tests.length > 0) {
          setMode("test");
        }
      }
    }
  }, [mode, selectedSeriesIdx]);

  useEffect(() => {
    if (mode === "test" && selectedSectionIdx !== null && selectedSeriesIdx !== null) {
      const series = activeTestSeries[selectedSeriesIdx];
      const section = series?.sections?.[selectedSectionIdx];
      const activeTests = section?.tests?.filter(t => t.status === "active") || [];
      if (activeTests.length === 1) {
        const originalIdx = section.tests.findIndex(t => t.id === activeTests[0].id);
        setSelectedTestIdx(originalIdx);
        if (activeTests[0].questions && activeTests[0].questions.length > 0) {
          setShowInstructions(true);
        }
      }
    }
  }, [mode, selectedSectionIdx]);

  // Reset when test changes
  useEffect(() => {
    if (questions.length > 0) {
      setCurrent(0);
      setTimer(45);
      setSelected(Array(questions.length).fill(null));
      setSubmitted(Array(questions.length).fill(false));
      setScore(0);
      setTestStarted(false);
      setTestCompleted(false);
      setShowReview(false);
      setFlagged(Array(questions.length).fill(false));
    }
  }, [selectedTestIdx, questions.length]);

  // Timer logic
  useEffect(() => {
    if (!testStarted || testCompleted || questions.length === 0) return;

    if (!submitted[current] && timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    }
    
    if (timer === 0 && !submitted[current]) {
      handleSubmit();
    }
  }, [timer, current, submitted, testStarted, testCompleted, questions.length]);

  const handleSubmit = () => {
    if (submitted[current]) return;
    let marks = 0;
    if (selected[current] === questions[current].answer) {
      marks = 1;
    } else if (selected[current] !== null) {
      marks = -0.25;
    }
    setScore((prev) => prev + marks);
    const updated = [...submitted];
    updated[current] = true;
    setSubmitted(updated);
  };

  const handleOptionClick = (optionIdx) => {
    if (submitted[current]) return;
    const updated = [...selected];
    updated[current] = optionIdx;
    setSelected(updated);
  };

  const handleNext = () => {
    setTimer(45);
    setCurrent((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handlePrev = () => {
    setTimer(45);
    setCurrent((prev) => Math.max(prev - 1, 0));
  };

  const handleJump = (idx) => {
    setTimer(45);
    setCurrent(idx);
  };

  const handleFlag = () => {
    const updated = [...flagged];
    updated[current] = !updated[current];
    setFlagged(updated);
  };

  // Translation function using Google Translate API
  const translateText = async (text, targetLang) => {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
      const response = await fetch(url);
      const data = await response.json();
      return data[0][0][0];
    } catch (error) {
      console.error("Translation error:", error);
      return text; // Return original if translation fails
    }
  };

  // Translate current question
  const handleTranslate = async (targetLang) => {
    if (translating) return;
    
    setTranslating(true);
    const questionId = questions[current].id;
    
    try {
      // Check if already translated
      if (translatedQuestions[questionId]?.[targetLang]) {
        setCurrentLanguage(targetLang);
        setTranslating(false);
        return;
      }

      // Translate question
      const translatedQuestion = await translateText(questions[current].question, targetLang);
      
      // Translate all options
      const translatedOpts = await Promise.all(
        questions[current].options.map(opt => translateText(opt, targetLang))
      );

      // Store translations
      setTranslatedQuestions(prev => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          [targetLang]: translatedQuestion
        }
      }));

      setTranslatedOptions(prev => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          [targetLang]: translatedOpts
        }
      }));

      setCurrentLanguage(targetLang);
    } catch (error) {
      console.error("Translation failed:", error);
      alert("Translation failed. Please try again.");
    } finally {
      setTranslating(false);
    }
  };

  // Get displayed text based on current language
  const getDisplayedQuestion = () => {
    if (currentLanguage === "original") return questions[current].question;
    const questionId = questions[current].id;
    return translatedQuestions[questionId]?.[currentLanguage] || questions[current].question;
  };

  const getDisplayedOptions = () => {
    if (currentLanguage === "original") return questions[current].options;
    const questionId = questions[current].id;
    return translatedOptions[questionId]?.[currentLanguage] || questions[current].options;
  };

  const handleFinishTest = async () => {
    // Calculate final score properly
    let finalScore = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;
    
    questions.forEach((question, idx) => {
      if (selected[idx] === null || selected[idx] === undefined) {
        // Unattempted
        unattemptedCount++;
      } else if (selected[idx] === question.answer) {
        // Correct answer
        correctCount++;
        finalScore += 1; // +1 for correct
      } else {
        // Wrong answer
        wrongCount++;
        finalScore -= 0.25; // -0.25 for wrong
      }
    });
    
    setTestCompleted(true);
    
    // Clean userAnswers - replace null/undefined with -1
    const cleanUserAnswers = selected.map(answer => answer === null || answer === undefined ? -1 : answer);
    
    const testResult = {
      seriesName: currentTest.title,
      testTitle: currentTest.title,
      score: finalScore,
      totalQuestions: questions.length,
      totalMarks: questions.length,
      attempted: correctCount + wrongCount,
      correct: correctCount,
      wrong: wrongCount,
      unattempted: unattemptedCount,
      percentage: ((correctCount / questions.length) * 100),
      userAnswers: cleanUserAnswers,
      date: new Date().toISOString()
    };
    
    console.log("Saving test result:", testResult);
    addTestResult(testResult);

    // Firestore mein bhi save karo test-specific leaderboard ke liye
    const user = auth.currentUser;
    if (user) {
      const testId = `${currentSeries?.id}_${currentSection?.id}_${currentTest?.id}`;
      try {
        await saveTestResult({
          userId: user.uid,
          userName: user.displayName || user.email?.split('@')[0] || 'Student',
          userEmail: user.email,
          testId,
          testTitle: currentTest?.title,
          seriesTitle: currentSeries?.title,
          sectionTitle: currentSection?.title,
          score: finalScore,
          totalQuestions: questions.length,
          correctAnswers: correctCount,
          wrongAnswers: wrongCount,
          skippedAnswers: unattemptedCount,
          timeTaken: testStartTimeRef.current ? Math.floor((Date.now() - testStartTimeRef.current) / 1000) : 0,
          percentage: parseFloat(((correctCount / questions.length) * 100).toFixed(2))
        });
        console.log("✅ Leaderboard mein save ho gaya");

        // Agar yeh live test tha to attempt record karo (ek baar ka rule)
        if (liveSchedule && liveSchedule.id) {
          try {
            await recordLiveTestAttempt(user.uid, user.email, liveSchedule.id, currentTest?.title);
            console.log("✅ Live test attempt recorded");
          } catch (err) {
            console.error("❌ Live attempt record error:", err);
          }
        }
      } catch (err) {
        console.error("❌ Leaderboard save error:", err);
      }
    }
  };

  const getQuestionStatus = (idx) => {
    if (submitted[idx]) {
      return selected[idx] === questions[idx].answer ? "correct" : "wrong";
    }
    if (selected[idx] !== null) return "answered";
    if (flagged[idx]) return "flagged";
    return "unanswered";
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "correct": return "#22c55e";
      case "wrong": return "#ef4444";
      case "answered": return "#3b82f6";
      case "flagged": return "#f59e0b";
      default: return "#e5e7eb";
    }
  };

  // SELECTION SCREENS
  if (!testStarted) {
    return (
      <div style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "40px",
        background: "#fff",
        borderRadius: "20px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ 
          color: "#1e293b", 
          marginBottom: "30px",
          fontSize: "2rem",
          textAlign: "center"
        }}>
          Select Test to Attempt
        </h2>

        {/* Test Series Selection */}
        {mode === "select" && (
          <div>
            <h3 style={{ color: "#1e293b", marginBottom: "20px", fontSize: "1.5rem" }}>
              Choose Test Series
            </h3>
            
            {activeTestSeries.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#64748b",
                background: "#f8fafc",
                borderRadius: "15px"
              }}>
                <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📚</div>
                <div style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "10px" }}>
                  No active test series available yet
                </div>
                <div style={{ fontSize: "1rem" }}>
                  Please wait for admin to activate test series
                </div>
              </div>
            ) : (
              activeTestSeries.map((series, idx) => (
                <div
                  key={series.id}
                  style={{
                    marginBottom: "15px",
                    background: selectedSeriesIdx === idx ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "#f8fafc",
                    color: selectedSeriesIdx === idx ? "#fff" : "#1e293b",
                    borderRadius: "15px",
                    border: selectedSeriesIdx === idx ? "none" : "2px solid #e2e8f0",
                    overflow: "hidden"
                  }}
                >
                  {/* Clickable area */}
                  <div
                    onClick={() => {
                      setSelectedSeriesIdx(idx);
                      if (series.sections && series.sections.length > 0) {
                        setMode("section");
                      } else {
                        alert("This test series has no sections yet. Please ask admin to add sections and tests.");
                      }
                    }}
                    style={{ padding: "25px", cursor: "pointer" }}
                  >
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px"
                    }}>
                      <h3 style={{ margin: 0, fontSize: "1.3rem" }}>{series.title}</h3>
                      <span style={{
                        background: selectedSeriesIdx === idx ? "rgba(255,255,255,0.2)" : "#10b981",
                        color: "#fff",
                        padding: "5px 15px",
                        borderRadius: "20px",
                        fontSize: "0.85rem",
                        fontWeight: "600"
                      }}>
                        ✅ Active
                      </span>
                    </div>
                    <div style={{ fontSize: "0.95rem", opacity: 0.9 }}>
                      📂 {series.sections?.length || 0} Sections | 
                      {series.category && ` 📚 ${series.category}`}
                    </div>
                  </div>

                  {/* Share button */}
                  <div style={{
                    padding: "0 25px 15px 25px",
                    display: "flex",
                    justifyContent: "flex-end"
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const url = `https://upexammantra.com/test?series=${series.id}`;
                        const shareText = `🎓 ${series.title}\n\nUP Exam Mantra pe free mock tests do!\n👉 ${url}`;
                        if (navigator.share) {
                          navigator.share({ title: series.title, text: shareText, url });
                        } else {
                          navigator.clipboard.writeText(shareText).then(() => alert("✅ Link copied! Share karo apne doston ke saath."));
                        }
                      }}
                      style={{
                        padding: "8px 18px",
                        background: selectedSeriesIdx === idx ? "rgba(255,255,255,0.2)" : "#e0e7ff",
                        color: selectedSeriesIdx === idx ? "#fff" : "#4f46e5",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "600",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      📤 Share
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Section Selection */}
        {mode === "section" && currentSeries && (
          <div>
            <button
              onClick={() => {
                setMode("select");
                setSelectedSectionIdx(null);
              }}
              style={{
                padding: "10px 20px",
                background: "#e2e8f0",
                color: "#1e293b",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
                marginBottom: "20px"
              }}
            >
              ← Back to Test Series
            </button>
            
            <h3 style={{ color: "#1e293b", marginBottom: "20px", fontSize: "1.5rem" }}>
              Select Section from: {currentSeries.title}
            </h3>
            
            {(!currentSeries.sections || currentSeries.sections.length === 0) ? (
              <div style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#64748b",
                background: "#f8fafc",
                borderRadius: "15px"
              }}>
                <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📂</div>
                <div style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "10px" }}>
                  No sections available
                </div>
                <div style={{ fontSize: "1rem" }}>
                  Admin needs to add sections to this test series
                </div>
              </div>
            ) : (
              currentSeries.sections.map((section, idx) => (
                <div
                  key={section.id}
                  onClick={() => {
                    setSelectedSectionIdx(idx);
                    if (section.tests && section.tests.length > 0) {
                      setMode("test");
                    } else {
                      alert("This section has no tests yet. Please ask admin to add tests.");
                    }
                  }}
                  style={{
                    padding: "25px",
                    marginBottom: "15px",
                    background: selectedSectionIdx === idx ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" : "#f8fafc",
                    color: selectedSectionIdx === idx ? "#fff" : "#1e293b",
                    borderRadius: "15px",
                    cursor: "pointer",
                    border: selectedSectionIdx === idx ? "none" : "2px solid #e2e8f0",
                    transition: "all 0.3s"
                  }}
                >
                  <h3 style={{ margin: "0 0 10px 0", fontSize: "1.3rem" }}>📂 {section.title}</h3>
                  <div style={{ fontSize: "0.95rem", opacity: 0.9 }}>
                    📝 {section.tests?.length || 0} Tests Available
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Test Selection */}
        {mode === "test" && currentSection && (
          <div>
            <button
              onClick={() => {
                setMode("section");
                setSelectedTestIdx(null);
              }}
              style={{
                padding: "10px 20px",
                background: "#e2e8f0",
                color: "#1e293b",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
                marginBottom: "20px"
              }}
            >
              ← Back to Sections
            </button>
            
            <h3 style={{ color: "#1e293b", marginBottom: "20px", fontSize: "1.5rem" }}>
              Select Test from: {currentSection.title}
            </h3>
            
            {(() => {
              // Filter only active tests
              const activeTests = currentSection.tests?.filter(test => test.status === "active") || [];
              
              if (activeTests.length === 0) {
                return (
                  <div style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    color: "#64748b",
                    background: "#f8fafc",
                    borderRadius: "15px"
                  }}>
                    <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📝</div>
                    <div style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "10px" }}>
                      No active tests available
                    </div>
                    <div style={{ fontSize: "1rem" }}>
                      Please wait for admin to activate tests
                    </div>
                  </div>
                );
              }
              
              return activeTests.map((test) => {
                // Find original index in full tests array for selection
                const originalIdx = currentSection.tests.findIndex(t => t.id === test.id);
                
                return (
                  <div
                    key={test.id}
                    style={{
                      marginBottom: "15px",
                      background: selectedTestIdx === originalIdx ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "#f8fafc",
                      color: selectedTestIdx === originalIdx ? "#fff" : "#1e293b",
                      borderRadius: "15px",
                      border: selectedTestIdx === originalIdx ? "none" : "2px solid #e2e8f0",
                      overflow: "hidden"
                    }}
                  >
                    {/* Clickable test info */}
                    <div
                      onClick={async () => {
                      if (!test.questions || test.questions.length === 0) {
                        alert("This test has no questions yet. Please ask admin to add questions.");
                        return;
                      }

                      // Live test check karo
                      const schedule = await getLiveTestSchedule(currentSeries.id, currentSection.id, test.id);
                      const now = Date.now();

                      if (schedule && schedule.isActive) {
                        // Time window check
                        if (now < schedule.startTime) {
                          const startStr = new Date(schedule.startTime).toLocaleString('en-IN');
                          alert(`⏳ Yeh test abhi live nahi hua hai!\n\nTest start hoga: ${startStr}`);
                          return;
                        }
                        if (now > schedule.endTime) {
                          alert("⌛ Yeh live test khatam ho gaya hai. Ab yeh test available nahi hai.");
                          return;
                        }

                        // One-attempt check
                        const user = auth.currentUser;
                        if (user) {
                          const alreadyAttempted = await checkUserAttemptedLiveTest(user.uid, schedule.id);
                          if (alreadyAttempted) {
                            alert(`🚫 Aapne yeh live test pehle de diya hai!\n\nHar Gmail account se sirf ek baar diya ja sakta hai.\n\n(${user.email})`);
                            return;
                          }
                        } else {
                          alert("❌ Live test dene ke liye pehle login karo!");
                          return;
                        }

                        setLiveSchedule(schedule);
                      } else {
                        setLiveSchedule(null);
                      }

                      setSelectedTestIdx(originalIdx);
                      setShowInstructions(true);
                    }}
                      style={{ padding: "25px", cursor: "pointer" }}
                    >
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px"
                    }}>
                      <h3 style={{ margin: 0, fontSize: "1.3rem" }}>📝 {test.title}</h3>
                      <span style={{
                        background: selectedTestIdx === originalIdx ? "rgba(255,255,255,0.2)" : "#10b981",
                        color: "#fff",
                        padding: "5px 15px",
                        borderRadius: "20px",
                        fontSize: "0.85rem",
                        fontWeight: "600"
                      }}>
                        ✅ Active
                      </span>
                    </div>
                    <div style={{ fontSize: "0.95rem", opacity: 0.9 }}>
                      ❓ {test.questions?.length || 0} Questions | 
                      ⏱️ {test.duration || 60} min | 
                      ✅ +{test.marksPerQuestion || 1} | 
                      ❌ -{test.negativeMarking || 0.25}
                    </div>
                    </div>

                    {/* Share button */}
                    <div style={{ padding: "0 25px 15px 25px", display: "flex", justifyContent: "flex-end" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const url = `https://upexammantra.com/test?series=${currentSeries?.id}&section=${currentSection?.id}&test=${test.id}`;
                          const shareText = `📝 ${test.title}\n🎓 ${currentSeries?.title}\n\nUP Exam Mantra pe free mock test do!\n👉 ${url}`;
                          if (navigator.share) {
                            navigator.share({ title: test.title, text: shareText, url });
                          } else {
                            navigator.clipboard.writeText(shareText)
                              .then(() => alert("✅ Link copy ho gaya! Apne doston ke saath share karo."))
                              .catch(() => alert("Share karo: " + url));
                          }
                        }}
                        style={{
                          padding: "8px 18px",
                          background: selectedTestIdx === originalIdx ? "rgba(255,255,255,0.2)" : "#e0e7ff",
                          color: selectedTestIdx === originalIdx ? "#fff" : "#4f46e5",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: "600",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        📤 Share
                      </button>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}

        {/* Instructions Screen */}
        {showInstructions && currentTest && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
            overflowY: "auto"
          }}>
            <div style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "40px",
              maxWidth: "800px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto"
            }}>
              <h2 style={{ 
                color: "#1e293b", 
                marginBottom: "30px",
                fontSize: "2rem",
                textAlign: "center",
                borderBottom: "3px solid #667eea",
                paddingBottom: "15px"
              }}>
                📋 Test Instructions
              </h2>

              {/* Test Details */}
              <div style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                padding: "25px",
                borderRadius: "15px",
                marginBottom: "30px"
              }}>
                <h3 style={{ margin: "0 0 20px 0", fontSize: "1.5rem" }}>
                  {currentTest.title}
                </h3>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "15px",
                  fontSize: "1rem"
                }}>
                  <div>
                    <div style={{ opacity: 0.9, fontSize: "0.9rem" }}>Total Questions</div>
                    <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>📝 {questions.length}</div>
                  </div>
                  <div>
                    <div style={{ opacity: 0.9, fontSize: "0.9rem" }}>Duration</div>
                    <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                      ⏱️ {currentTest.duration || 60} min
                    </div>
                  </div>
                  <div>
                    <div style={{ opacity: 0.9, fontSize: "0.9rem" }}>Marks per Question</div>
                    <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                      ✅ +{currentTest.marksPerQuestion || 1}
                    </div>
                  </div>
                  <div>
                    <div style={{ opacity: 0.9, fontSize: "0.9rem" }}>Negative Marking</div>
                    <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                      ❌ -{currentTest.negativeMarking || 0.25}
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions Content */}
              <div style={{
                background: "#f8fafc",
                padding: "25px",
                borderRadius: "15px",
                marginBottom: "30px",
                border: "2px solid #e2e8f0"
              }}>
                <h3 style={{ color: "#1e293b", marginBottom: "15px", fontSize: "1.3rem" }}>
                  📖 Important Instructions:
                </h3>
                <div style={{ 
                  color: "#475569", 
                  fontSize: "1rem", 
                  lineHeight: "1.8",
                  whiteSpace: "pre-wrap"
                }}>
                  {currentTest.instructions || 
                    "• Read all questions carefully before answering.\n• Each question has 4 options, select the most appropriate one.\n• You can flag questions for review later.\n• Use the question navigator to jump between questions.\n• Submit each answer before moving to the next question.\n• Negative marking will be applied for wrong answers.\n• Manage your time wisely.\n• Click 'Finish Test' when you complete all questions."}
                </div>
              </div>

              {/* General Guidelines */}
              <div style={{
                background: "#fef3c7",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "30px",
                border: "2px solid #fbbf24"
              }}>
                <h4 style={{ color: "#92400e", marginBottom: "10px", fontSize: "1.1rem" }}>
                  ⚠️ General Guidelines:
                </h4>
                <ul style={{ 
                  color: "#78350f", 
                  fontSize: "0.95rem",
                  lineHeight: "1.6",
                  paddingLeft: "20px",
                  margin: 0
                }}>
                  <li>Ensure stable internet connection</li>
                  <li>Do not refresh the page during the test</li>
                  <li>Timer will start as soon as you click "Start Test"</li>
                  <li>You cannot pause the test once started</li>
                  <li>Make sure you have enough time to complete the test</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "15px" }}>
                <button
                  onClick={() => setShowInstructions(false)}
                  style={{
                    flex: 1,
                    padding: "15px",
                    background: "#94a3b8",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  ← Go Back
                </button>
                <button
                  onClick={() => {
                    setShowInstructions(false);
                    setTestStarted(true);
                    testStartTimeRef.current = Date.now(); // Test start time record karo
                  }}
                  style={{
                    flex: 2,
                    padding: "15px",
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)"
                  }}
                >
                  I Understand, Start Test Now →
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // TEST COMPLETED SCREEN
  if (testCompleted && !showReview) {
    // Recalculate score for display
    let finalScore = 0;
    let correctCount = 0;
    let wrongCount = 0;
    
    questions.forEach((question, idx) => {
      if (selected[idx] === null || selected[idx] === undefined) {
        // Unattempted - no marks
      } else if (selected[idx] === question.answer) {
        correctCount++;
        finalScore += 1;
      } else {
        wrongCount++;
        finalScore -= 0.25;
      }
    });
    
    const percentage = ((correctCount / questions.length) * 100).toFixed(1);
    
    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        overflow: "auto",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}>
        {/* Back Button */}
        <button
          onClick={() => {
            setTestStarted(false);
            setTestCompleted(false);
            setMode("select");
            setSelectedSeriesIdx(null);
            setSelectedSectionIdx(null);
            setSelectedTestIdx(null);
          }}
          style={{
            position: "fixed",
            top: "15px",
            left: "15px",
            padding: "10px 20px",
            background: "rgba(255, 255, 255, 0.95)",
            color: "#1e293b",
            border: "2px solid #e2e8f0",
            borderRadius: "10px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            zIndex: 10001,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.95rem"
          }}
        >
          ← Back
        </button>

        <div style={{
          maxWidth: "700px",
          width: "100%",
          padding: "40px",
          background: "#fff",
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          textAlign: "center"
        }}>
        <div style={{ fontSize: "5rem", marginBottom: "20px" }}>
          {percentage >= 70 ? "🎉" : percentage >= 40 ? "👍" : "📚"}
        </div>
        <h2 style={{ color: "#1e293b", fontSize: "2.5rem", marginBottom: "10px" }}>
          Test Completed!
        </h2>
        <div style={{
          fontSize: "3rem",
          fontWeight: "bold",
          color: percentage >= 70 ? "#22c55e" : percentage >= 40 ? "#f59e0b" : "#ef4444",
          marginBottom: "30px"
        }}>
          {finalScore.toFixed(2)} / {questions.length}
        </div>
        <div style={{ fontSize: "1.5rem", color: "#64748b", marginBottom: "40px" }}>
          {percentage}% Score
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "15px",
          marginBottom: "30px"
        }}>
          <div style={{ padding: "20px", background: "#dcfce7", borderRadius: "12px" }}>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#166534" }}>
              {correctCount}
            </div>
            <div style={{ color: "#166534" }}>Correct</div>
          </div>
          <div style={{ padding: "20px", background: "#fee2e2", borderRadius: "12px" }}>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#991b1b" }}>
              {wrongCount}
            </div>
            <div style={{ color: "#991b1b" }}>Wrong</div>
          </div>
          <div style={{ padding: "20px", background: "#dbeafe", borderRadius: "12px" }}>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#1e40af" }}>
              {correctCount + wrongCount}
            </div>
            <div style={{ color: "#1e40af" }}>Attempted</div>
          </div>
          <div style={{ padding: "20px", background: "#f3f4f6", borderRadius: "12px" }}>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#374151" }}>
              {questions.length - correctCount - wrongCount}
            </div>
            <div style={{ color: "#374151" }}>Skipped</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
          <button
            onClick={() => setShowReview(true)}
            style={{
              flex: 1,
              padding: "15px",
              background: "#667eea",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Review Answers
          </button>
        </div>
        <button
          onClick={() => {
            setTestStarted(false);
            setTestCompleted(false);
            setMode("select");
            setSelectedSeriesIdx(null);
            setSelectedSectionIdx(null);
            setSelectedTestIdx(null);
          }}
          style={{
            width: "100%",
            padding: "15px",
            background: "#10b981",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Take Another Test
        </button>
      </div>
      </div>
    );
  }

  // REVIEW MODE
  if (showReview) {
    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        overflow: "auto",
        zIndex: 10000,
        padding: "70px 20px 20px 20px"
      }}>
        {/* Back Button */}
        <button
          onClick={() => setShowReview(false)}
          style={{
            position: "fixed",
            top: "15px",
            left: "15px",
            padding: "10px 20px",
            background: "rgba(255, 255, 255, 0.95)",
            color: "#1e293b",
            border: "2px solid #e2e8f0",
            borderRadius: "10px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            zIndex: 10001,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.95rem"
          }}
        >
          ← Back to Results
        </button>

        <div style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "40px",
          background: "#fff",
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
        }}>
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ color: "#1e293b", fontSize: "2rem", margin: 0 }}>
            📝 Review Answers
          </h2>
        </div>

        {questions.map((q, idx) => (
          <div
            key={idx}
            style={{
              padding: "25px",
              marginBottom: "20px",
              background: "#f8fafc",
              borderRadius: "15px",
              border: `2px solid ${getStatusColor(getQuestionStatus(idx))}`
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
              <div style={{ fontWeight: "700", color: "#667eea", fontSize: "1.1rem" }}>
                Q{idx + 1}.
              </div>
              <div style={{
                padding: "4px 12px",
                background: getStatusColor(getQuestionStatus(idx)),
                color: "#fff",
                borderRadius: "20px",
                fontSize: "0.85rem",
                fontWeight: "600"
              }}>
                {getQuestionStatus(idx).toUpperCase()}
              </div>
            </div>

            <div style={{ fontSize: "1.1rem", fontWeight: "600", color: "#1e293b", marginBottom: "15px" }}>
              {q.question}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "15px" }}>
              {q.options.map((option, optIdx) => (
                <div
                  key={optIdx}
                  style={{
                    padding: "12px 15px",
                    background: optIdx === q.answer 
                      ? "#d1fae5" 
                      : optIdx === selected[idx] && selected[idx] !== q.answer
                      ? "#fee2e2"
                      : "#fff",
                    border: `2px solid ${
                      optIdx === q.answer 
                        ? "#10b981" 
                        : optIdx === selected[idx] && selected[idx] !== q.answer
                        ? "#ef4444"
                        : "#e2e8f0"
                    }`,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}
                >
                  <span style={{ 
                    fontWeight: "700", 
                    color: optIdx === q.answer 
                      ? "#10b981" 
                      : optIdx === selected[idx] && selected[idx] !== q.answer
                      ? "#ef4444"
                      : "#64748b"
                  }}>
                    {String.fromCharCode(65 + optIdx)}.
                  </span>
                  <span style={{ color: "#1e293b" }}>{option}</span>
                  {optIdx === q.answer && (
                    <span style={{ marginLeft: "auto", color: "#10b981", fontWeight: "700" }}>✓ Correct</span>
                  )}
                  {optIdx === selected[idx] && selected[idx] !== q.answer && (
                    <span style={{ marginLeft: "auto", color: "#ef4444", fontWeight: "700" }}>✗ Your Answer</span>
                  )}
                </div>
              ))}
            </div>

            {q.explanation && (
              <div style={{
                padding: "12px",
                background: "#fef3c7",
                border: "2px solid #fbbf24",
                borderRadius: "8px",
                fontSize: "0.95rem",
                color: "#92400e"
              }}>
                <strong>💡 Explanation:</strong> {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>
      </div>
    );
  }

  // ACTIVE TEST SCREEN
  if (questions.length === 0) {
    return (
      <div style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "40px",
        background: "#fff",
        borderRadius: "20px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
        textAlign: "center"
      }}>
        <div style={{ fontSize: "4rem", marginBottom: "20px" }}>❌</div>
        <h2 style={{ color: "#1e293b", fontSize: "2rem", marginBottom: "15px" }}>
          No Questions Available
        </h2>
        <p style={{ color: "#64748b", fontSize: "1.1rem", marginBottom: "30px" }}>
          This test doesn't have any questions yet. Please contact admin.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "15px 30px",
            background: "#667eea",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      overflow: "auto",
      zIndex: 10000
    }}>
      {/* Back Button - Fixed Top Left */}
      <button
        onClick={() => {
          if (window.confirm("Are you sure you want to exit the test? Your progress will be lost.")) {
            setTestStarted(false);
            setMode("select");
            setSelectedSeriesIdx(null);
            setSelectedSectionIdx(null);
            setSelectedTestIdx(null);
          }
        }}
        style={{
          position: "fixed",
          top: "15px",
          left: "15px",
          padding: "10px 20px",
          background: "rgba(255, 255, 255, 0.95)",
          color: "#1e293b",
          border: "2px solid #e2e8f0",
          borderRadius: "10px",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          zIndex: 10001,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "0.95rem"
        }}
      >
        ← Back
      </button>

      <div style={{ padding: "70px 20px 20px 20px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          background: "#fff",
          borderRadius: "15px",
          padding: "20px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
        }}>
          <div>
            <h2 style={{ margin: 0, color: "#1e293b", fontSize: "1.5rem" }}>
              {currentTest?.title}
            </h2>
            <div style={{ color: "#64748b", fontSize: "0.95rem", marginTop: "5px" }}>
              Question {current + 1} of {questions.length}
            </div>
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "20px"
          }}>
            <div style={{
              padding: "10px 20px",
              background: timer < 10 ? "#fee2e2" : "#f0fdf4",
              color: timer < 10 ? "#991b1b" : "#166534",
              borderRadius: "10px",
              fontWeight: "700",
              fontSize: "1.2rem"
            }}>
              ⏱️ {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
            </div>
            <div style={{
              padding: "10px 20px",
              background: "#e0e7ff",
              color: "#667eea",
              borderRadius: "10px",
              fontWeight: "700",
              fontSize: "1.2rem"
            }}>
              Score: {score.toFixed(2)}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", position: "relative" }}>
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
              zIndex: 1000,
              display: "none"
            }}
            className="mobile-menu-btn"
          >
            ☰
          </button>

          {/* Mobile Question Navigator Overlay */}
          {showMobileMenu && (
            <>
              <div
                onClick={() => setShowMobileMenu(false)}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(0,0,0,0.5)",
                  zIndex: 1001
                }}
              />
              <div style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                background: "#fff",
                borderRadius: "20px 20px 0 0",
                padding: "20px",
                boxShadow: "0 -4px 20px rgba(0,0,0,0.2)",
                zIndex: 1002,
                maxHeight: "70vh",
                overflowY: "auto"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ margin: 0, color: "#1e293b", fontSize: "1.2rem" }}>
                    Question Navigator
                  </h3>
                  <button
                    onClick={() => setShowMobileMenu(false)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "1.5rem",
                      cursor: "pointer",
                      color: "#64748b"
                    }}
                  >
                    ✕
                  </button>
                </div>
                
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: "8px",
                  marginBottom: "20px"
                }}>
                  {questions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        handleJump(idx);
                        setShowMobileMenu(false);
                      }}
                      style={{
                        padding: "10px",
                        background: getStatusColor(getQuestionStatus(idx)),
                        color: "#fff",
                        border: current === idx ? "3px solid #1e293b" : "none",
                        borderRadius: "8px",
                        fontWeight: "700",
                        cursor: "pointer",
                        fontSize: "0.95rem"
                      }}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <div style={{ fontSize: "0.85rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <div style={{ width: "16px", height: "16px", background: "#22c55e", borderRadius: "4px" }}></div>
                    <span>Correct</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <div style={{ width: "16px", height: "16px", background: "#ef4444", borderRadius: "4px" }}></div>
                    <span>Wrong</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <div style={{ width: "16px", height: "16px", background: "#3b82f6", borderRadius: "4px" }}></div>
                    <span>Answered</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <div style={{ width: "16px", height: "16px", background: "#f59e0b", borderRadius: "4px" }}></div>
                    <span>Flagged</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "16px", height: "16px", background: "#e5e7eb", borderRadius: "4px" }}></div>
                    <span>Unanswered</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Question Panel */}
          <div style={{
            flex: "1 1 600px",
            background: "#fff",
            borderRadius: "15px",
            padding: "30px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
          }}>
            <div style={{ marginBottom: "25px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <div style={{ fontWeight: "700", color: "#667eea", fontSize: "1.1rem" }}>
                  Question {current + 1}
                </div>
                
                {/* Language Translator Buttons */}
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", color: "#64748b", marginRight: "5px" }}>
                    Translate:
                  </span>
                  <button
                    onClick={() => setCurrentLanguage("original")}
                    disabled={translating}
                    style={{
                      padding: "6px 12px",
                      background: currentLanguage === "original" ? "#667eea" : "#f1f5f9",
                      color: currentLanguage === "original" ? "#fff" : "#64748b",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      cursor: translating ? "not-allowed" : "pointer",
                      opacity: translating ? 0.6 : 1
                    }}
                  >
                    Original
                  </button>
                  <button
                    onClick={() => handleTranslate("hi")}
                    disabled={translating}
                    style={{
                      padding: "6px 12px",
                      background: currentLanguage === "hi" ? "#10b981" : "#f1f5f9",
                      color: currentLanguage === "hi" ? "#fff" : "#64748b",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      cursor: translating ? "not-allowed" : "pointer",
                      opacity: translating ? 0.6 : 1
                    }}
                  >
                    {translating && currentLanguage !== "hi" && currentLanguage !== "en" ? "..." : "हिंदी"}
                  </button>
                  <button
                    onClick={() => handleTranslate("en")}
                    disabled={translating}
                    style={{
                      padding: "6px 12px",
                      background: currentLanguage === "en" ? "#3b82f6" : "#f1f5f9",
                      color: currentLanguage === "en" ? "#fff" : "#64748b",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      cursor: translating ? "not-allowed" : "pointer",
                      opacity: translating ? 0.6 : 1
                    }}
                  >
                    {translating && currentLanguage !== "en" && currentLanguage !== "hi" ? "..." : "English"}
                  </button>
                </div>
              </div>
              
              <div style={{ fontSize: "1.2rem", fontWeight: "600", color: "#1e293b", lineHeight: "1.6" }}>
                {getDisplayedQuestion()}
              </div>
              {questions[current].image && (
                <div style={{ marginTop: "15px" }}>
                  <img 
                    src={questions[current].image} 
                    alt="Question" 
                    style={{ 
                      maxWidth: "100%", 
                      maxHeight: "400px", 
                      borderRadius: "10px",
                      border: "2px solid #e2e8f0",
                      display: "block"
                    }} 
                  />
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "30px" }}>
              {getDisplayedOptions().map((option, idx) => (
                <div
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  style={{
                    padding: "15px 20px",
                    background: selected[current] === idx ? "#e0e7ff" : "#f8fafc",
                    border: `2px solid ${selected[current] === idx ? "#667eea" : "#e2e8f0"}`,
                    borderRadius: "10px",
                    cursor: submitted[current] ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                    opacity: submitted[current] ? 0.6 : 1
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ 
                      fontWeight: "700", 
                      color: selected[current] === idx ? "#667eea" : "#64748b",
                      fontSize: "1.1rem"
                    }}>
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <span style={{ color: "#1e293b", fontSize: "1.05rem" }}>{option}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                onClick={handlePrev}
                disabled={current === 0}
                style={{
                  padding: "12px 20px",
                  background: current === 0 ? "#e2e8f0" : "#667eea",
                  color: current === 0 ? "#94a3b8" : "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: current === 0 ? "not-allowed" : "pointer"
                }}
              >
                ← Previous
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={submitted[current] || selected[current] === null}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  background: submitted[current] || selected[current] === null ? "#e2e8f0" : "#10b981",
                  color: submitted[current] || selected[current] === null ? "#94a3b8" : "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: submitted[current] || selected[current] === null ? "not-allowed" : "pointer"
                }}
              >
                {submitted[current] ? "✓ Submitted" : "Submit Answer"}
              </button>

              <button
                onClick={handleNext}
                disabled={current === questions.length - 1}
                style={{
                  padding: "12px 20px",
                  background: current === questions.length - 1 ? "#e2e8f0" : "#667eea",
                  color: current === questions.length - 1 ? "#94a3b8" : "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: current === questions.length - 1 ? "not-allowed" : "pointer"
                }}
              >
                Next →
              </button>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button
                onClick={handleFlag}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  background: flagged[current] ? "#f59e0b" : "#f8fafc",
                  color: flagged[current] ? "#fff" : "#1e293b",
                  border: "2px solid #e2e8f0",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                {flagged[current] ? "🚩 Flagged" : "🏳️ Flag for Review"}
              </button>

              <button
                onClick={handleFinishTest}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                🏁 Finish Test
              </button>
            </div>
          </div>

          {/* Question Navigator - Desktop Only */}
          <div className="question-navigator-desktop" style={{
            flex: "0 0 300px",
            background: "#fff",
            borderRadius: "15px",
            padding: "20px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            maxHeight: "600px",
            overflowY: "auto"
          }}>
            <h3 style={{ margin: "0 0 20px 0", color: "#1e293b", fontSize: "1.2rem" }}>
              Question Navigator
            </h3>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "8px"
            }}>
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleJump(idx)}
                  style={{
                    padding: "10px",
                    background: getStatusColor(getQuestionStatus(idx)),
                    color: "#fff",
                    border: current === idx ? "3px solid #1e293b" : "none",
                    borderRadius: "8px",
                    fontWeight: "700",
                    cursor: "pointer",
                    fontSize: "0.95rem"
                  }}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <div style={{ marginTop: "20px", fontSize: "0.9rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div style={{ width: "20px", height: "20px", background: "#22c55e", borderRadius: "4px" }}></div>
                <span>Correct</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div style={{ width: "20px", height: "20px", background: "#ef4444", borderRadius: "4px" }}></div>
                <span>Wrong</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div style={{ width: "20px", height: "20px", background: "#3b82f6", borderRadius: "4px" }}></div>
                <span>Answered</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div style={{ width: "20px", height: "20px", background: "#f59e0b", borderRadius: "4px" }}></div>
                <span>Flagged</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "20px", height: "20px", background: "#e5e7eb", borderRadius: "4px" }}></div>
                <span>Unanswered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
