import { useContext, useState, useEffect } from "react";
import { TestSeriesContext } from "./TestSeriesContext";

export default function Mocktest() {
  const { testSeries, addTestResult } = useContext(TestSeriesContext);
  
  // Navigation states
  const [mode, setMode] = useState("select"); // "select", "testseries", "section", "test"
  const [selectedSeriesIdx, setSelectedSeriesIdx] = useState(null);
  const [selectedSectionIdx, setSelectedSectionIdx] = useState(null);
  const [selectedTestIdx, setSelectedTestIdx] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  
  // Get current items
  const currentSeries = selectedSeriesIdx !== null ? testSeries[selectedSeriesIdx] : null;
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

  const handleFinishTest = () => {
    setTestCompleted(true);
    const testResult = {
      seriesName: currentTest.title,
      score: score,
      totalQuestions: questions.length,
      attempted: selected.filter(s => s !== null).length,
      correct: selected.filter((s, i) => s === questions[i].answer).length,
      wrong: selected.filter((s, i) => s !== null && s !== questions[i].answer).length,
      unattempted: selected.filter(s => s === null).length,
      date: new Date().toISOString()
    };
    addTestResult(testResult);
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
            
            {testSeries.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#64748b",
                background: "#f8fafc",
                borderRadius: "15px"
              }}>
                <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📚</div>
                <div style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "10px" }}>
                  No test series available yet
                </div>
                <div style={{ fontSize: "1rem" }}>
                  Admin needs to create test series first
                </div>
              </div>
            ) : (
              testSeries.map((series, idx) => (
                <div
                  key={series.id}
                  onClick={() => {
                    setSelectedSeriesIdx(idx);
                    if (series.sections && series.sections.length > 0) {
                      setMode("section");
                    } else {
                      alert("This test series has no sections yet. Please ask admin to add sections and tests.");
                    }
                  }}
                  style={{
                    padding: "25px",
                    marginBottom: "15px",
                    background: selectedSeriesIdx === idx ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "#f8fafc",
                    color: selectedSeriesIdx === idx ? "#fff" : "#1e293b",
                    borderRadius: "15px",
                    cursor: "pointer",
                    border: selectedSeriesIdx === idx ? "none" : "2px solid #e2e8f0",
                    transition: "all 0.3s"
                  }}
                >
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px"
                  }}>
                    <h3 style={{ margin: 0, fontSize: "1.3rem" }}>{series.title}</h3>
                    <span style={{
                      background: selectedSeriesIdx === idx ? "rgba(255,255,255,0.2)" : series.status === "active" ? "#10b981" : "#f59e0b",
                      color: selectedSeriesIdx === idx ? "#fff" : "#fff",
                      padding: "5px 15px",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      fontWeight: "600"
                    }}>
                      {series.status === "active" ? "✅ Active" : "📝 Draft"}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.95rem", opacity: 0.9 }}>
                    📂 {series.sections?.length || 0} Sections | 
                    {series.category && ` 📚 ${series.category}`}
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
            
            {(!currentSection.tests || currentSection.tests.length === 0) ? (
              <div style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#64748b",
                background: "#f8fafc",
                borderRadius: "15px"
              }}>
                <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📝</div>
                <div style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "10px" }}>
                  No tests available
                </div>
                <div style={{ fontSize: "1rem" }}>
                  Admin needs to add tests to this section
                </div>
              </div>
            ) : (
              currentSection.tests.map((test, idx) => (
                <div
                  key={test.id}
                  onClick={() => {
                    setSelectedTestIdx(idx);
                    if (test.questions && test.questions.length > 0) {
                      setShowInstructions(true);
                    } else {
                      alert("This test has no questions yet. Please ask admin to add questions.");
                    }
                  }}
                  style={{
                    padding: "25px",
                    marginBottom: "15px",
                    background: selectedTestIdx === idx ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "#f8fafc",
                    color: selectedTestIdx === idx ? "#fff" : "#1e293b",
                    borderRadius: "15px",
                    cursor: "pointer",
                    border: selectedTestIdx === idx ? "none" : "2px solid #e2e8f0",
                    transition: "all 0.3s"
                  }}
                >
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px"
                  }}>
                    <h3 style={{ margin: 0, fontSize: "1.3rem" }}>📝 {test.title}</h3>
                    <span style={{
                      background: selectedTestIdx === idx ? "rgba(255,255,255,0.2)" : test.status === "active" ? "#10b981" : "#f59e0b",
                      color: "#fff",
                      padding: "5px 15px",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      fontWeight: "600"
                    }}>
                      {test.status === "active" ? "✅ Active" : "📝 Draft"}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.95rem", opacity: 0.9 }}>
                    ❓ {test.questions?.length || 0} Questions | 
                    ⏱️ {test.duration || 60} min | 
                    ✅ +{test.marksPerQuestion || 1} | 
                    ❌ -{test.negativeMarking || 0.25}
                  </div>
                </div>
              ))
            )}
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
    const percentage = ((score / questions.length) * 100).toFixed(1);
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
          {score.toFixed(2)} / {questions.length}
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
              {selected.filter((s, i) => s === questions[i].answer).length}
            </div>
            <div style={{ color: "#166534" }}>Correct</div>
          </div>
          <div style={{ padding: "20px", background: "#fee2e2", borderRadius: "12px" }}>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#991b1b" }}>
              {selected.filter((s, i) => s !== null && s !== questions[i].answer).length}
            </div>
            <div style={{ color: "#991b1b" }}>Wrong</div>
          </div>
          <div style={{ padding: "20px", background: "#dbeafe", borderRadius: "12px" }}>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#1e40af" }}>
              {selected.filter(s => s !== null).length}
            </div>
            <div style={{ color: "#1e40af" }}>Attempted</div>
          </div>
          <div style={{ padding: "20px", background: "#f3f4f6", borderRadius: "12px" }}>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#374151" }}>
              {selected.filter(s => s === null).length}
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
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Review Answers
          </button>
        </div>
        <button
          onClick={() => window.location.reload()}
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
    );
  }

  // REVIEW MODE
  if (showReview) {
    return (
      <div style={{
        maxWidth: "1000px",
        margin: "40px auto",
        padding: "40px",
        background: "#fff",
        borderRadius: "20px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h2 style={{ color: "#1e293b", fontSize: "2rem", margin: 0 }}>
            📝 Review Answers
          </h2>
          <button
            onClick={() => setShowReview(false)}
            style={{
              padding: "12px 24px",
              background: "#667eea",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            ← Back to Results
          </button>
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
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px"
    }}>
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

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {/* Question Panel */}
          <div style={{
            flex: "1 1 600px",
            background: "#fff",
            borderRadius: "15px",
            padding: "30px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
          }}>
            <div style={{ marginBottom: "25px" }}>
              <div style={{ fontWeight: "700", color: "#667eea", marginBottom: "15px", fontSize: "1.1rem" }}>
                Question {current + 1}
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: "600", color: "#1e293b", lineHeight: "1.6" }}>
                {questions[current].question}
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
              {questions[current].options.map((option, idx) => (
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

          {/* Question Navigator */}
          <div style={{
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
  );
}
