import { useContext, useState } from "react";
import { TestSeriesContext } from "./TestSeriesContext";
import { auth } from "./firebase";

export default function AttemptedTests() {
  const { testHistory, testSeries } = useContext(TestSeriesContext);
  const user = auth.currentUser;
  const [selectedTest, setSelectedTest] = useState(null);
  const [showReview, setShowReview] = useState(false);

  console.log("📝 AttemptedTests - testHistory:", testHistory.length, "tests");
  console.log("📝 Test history data:", testHistory);

  // Get test details from testHistory
  const getTestDetails = (historyItem) => {
    // Find the actual test from testSeries
    for (const series of testSeries) {
      for (const section of series.sections || []) {
        for (const test of section.tests || []) {
          if (test.title === historyItem.testTitle) {
            return {
              ...historyItem,
              questions: test.questions || []
            };
          }
        }
      }
    }
    return historyItem;
  };

  const handleViewDetails = (test) => {
    const fullTest = getTestDetails(test);
    setSelectedTest(fullTest);
    setShowReview(true);
  };

  const getAnswerStatus = (question, userAnswer) => {
    if (userAnswer === null || userAnswer === undefined || userAnswer === -1) {
      return { status: "unattempted", color: "#94a3b8", icon: "⏭️", text: "Not Attempted" };
    }
    if (userAnswer === question.answer) {
      return { status: "correct", color: "#10b981", icon: "✅", text: "Correct" };
    }
    return { status: "wrong", color: "#ef4444", icon: "❌", text: "Wrong" };
  };

  if (showReview && selectedTest) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px"
      }}>
        <div style={{
          maxWidth: "1000px",
          margin: "0 auto"
        }}>
          {/* Header */}
          <div style={{
            background: "#fff",
            borderRadius: "15px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
          }}>
            <button
              onClick={() => setShowReview(false)}
              style={{
                background: "none",
                border: "none",
                color: "#667eea",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                marginBottom: "15px",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}
            >
              ← Back to Tests
            </button>
            <h2 style={{ margin: "0 0 10px 0", color: "#1e293b" }}>
              {selectedTest.testTitle}
            </h2>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", fontSize: "0.95rem", color: "#64748b" }}>
              <span>📅 {new Date(selectedTest.date).toLocaleDateString()}</span>
              <span>⏰ {new Date(selectedTest.date).toLocaleTimeString()}</span>
              <span style={{ color: selectedTest.score >= 0 ? "#10b981" : "#ef4444", fontWeight: "600" }}>
                Score: {selectedTest.score.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Summary Stats */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "15px",
            marginBottom: "20px"
          }}>
            <div style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "center",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "5px" }}>✅</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#10b981" }}>
                {selectedTest.correct || 0}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Correct</div>
            </div>
            <div style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "center",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "5px" }}>❌</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#ef4444" }}>
                {selectedTest.wrong || 0}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Wrong</div>
            </div>
            <div style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "center",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "5px" }}>⏭️</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#94a3b8" }}>
                {selectedTest.unattempted || 0}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Skipped</div>
            </div>
            <div style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "center",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "5px" }}>📊</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#667eea" }}>
                {selectedTest.percentage ? selectedTest.percentage.toFixed(1) : 0}%
              </div>
              <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Percentage</div>
            </div>
          </div>

          {/* Questions Review */}
          <div style={{
            background: "#fff",
            borderRadius: "15px",
            padding: "25px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ margin: "0 0 20px 0", color: "#1e293b" }}>
              Question-wise Analysis
            </h3>
            {selectedTest.questions && selectedTest.questions.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {selectedTest.questions.map((question, idx) => {
                  const userAnswer = selectedTest.userAnswers ? selectedTest.userAnswers[idx] : null;
                  const answerStatus = getAnswerStatus(question, userAnswer);
                  
                  return (
                    <div key={idx} style={{
                      padding: "20px",
                      background: "#f8fafc",
                      borderRadius: "12px",
                      borderLeft: `4px solid ${answerStatus.color}`
                    }}>
                      {/* Question Header */}
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "15px"
                      }}>
                        <div style={{ fontWeight: "700", color: "#667eea", fontSize: "1.1rem" }}>
                          Question {idx + 1}
                        </div>
                        <div style={{
                          padding: "6px 12px",
                          background: answerStatus.color,
                          color: "#fff",
                          borderRadius: "20px",
                          fontSize: "0.85rem",
                          fontWeight: "600"
                        }}>
                          {answerStatus.icon} {answerStatus.text}
                        </div>
                      </div>

                      {/* Question Text */}
                      <div style={{
                        fontSize: "1.05rem",
                        color: "#1e293b",
                        marginBottom: "15px",
                        lineHeight: "1.6"
                      }}>
                        {question.question}
                      </div>

                      {/* Question Image */}
                      {question.image && (
                        <div style={{ marginBottom: "15px" }}>
                          <img 
                            src={question.image} 
                            alt="Question" 
                            style={{ 
                              maxWidth: "100%", 
                              maxHeight: "300px", 
                              borderRadius: "8px",
                              border: "2px solid #e2e8f0"
                            }} 
                          />
                        </div>
                      )}

                      {/* Options */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {question.options.map((option, optIdx) => {
                          const isCorrect = optIdx === question.answer;
                          const isUserAnswer = optIdx === userAnswer;
                          
                          let bgColor = "#fff";
                          let borderColor = "#e2e8f0";
                          let textColor = "#1e293b";
                          
                          if (isCorrect) {
                            bgColor = "#d1fae5";
                            borderColor = "#10b981";
                            textColor = "#065f46";
                          } else if (isUserAnswer && !isCorrect) {
                            bgColor = "#fee2e2";
                            borderColor = "#ef4444";
                            textColor = "#991b1b";
                          }
                          
                          return (
                            <div
                              key={optIdx}
                              style={{
                                padding: "12px 15px",
                                background: bgColor,
                                border: `2px solid ${borderColor}`,
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px"
                              }}
                            >
                              <span style={{ fontWeight: "700", color: textColor }}>
                                {String.fromCharCode(65 + optIdx)}.
                              </span>
                              <span style={{ color: textColor, flex: 1 }}>
                                {option}
                              </span>
                              {isCorrect && (
                                <span style={{ fontSize: "1.2rem" }}>✅</span>
                              )}
                              {isUserAnswer && !isCorrect && (
                                <span style={{ fontSize: "1.2rem" }}>❌</span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation if wrong */}
                      {userAnswer !== question.answer && userAnswer !== null && (
                        <div style={{
                          marginTop: "15px",
                          padding: "15px",
                          background: "#fef3c7",
                          borderRadius: "8px",
                          borderLeft: "4px solid #f59e0b"
                        }}>
                          <div style={{ fontWeight: "600", color: "#92400e", marginBottom: "5px" }}>
                            💡 Correct Answer: {String.fromCharCode(65 + question.answer)}
                          </div>
                          <div style={{ fontSize: "0.9rem", color: "#78350f" }}>
                            Your answer was {userAnswer !== null ? String.fromCharCode(65 + userAnswer) : "not attempted"}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                <div style={{ fontSize: "3rem", marginBottom: "15px" }}>📝</div>
                <p>No question details available for this test.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: "1200px",
      margin: "40px auto",
      padding: "20px"
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "20px",
        padding: "40px",
        color: "#fff",
        marginBottom: "30px"
      }}>
        <h1 style={{ margin: "0 0 10px 0", fontSize: "2.5rem" }}>
          📝 Attempted Tests
        </h1>
        <p style={{ margin: 0, fontSize: "1.1rem", opacity: 0.9 }}>
          Review your previous test attempts and analyze your performance
        </p>
      </div>

      {/* Tests List */}
      {testHistory.length === 0 ? (
        <div style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "60px 30px",
          textAlign: "center",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📝</div>
          <h3 style={{ color: "#64748b", fontSize: "1.5rem", marginBottom: "10px" }}>
            No tests attempted yet
          </h3>
          <p style={{ color: "#94a3b8" }}>
            Start taking tests to see your performance history here!
          </p>
        </div>
      ) : (
        <div style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {testHistory.slice().reverse().map((test, idx) => (
              <div key={idx} style={{
                padding: "25px",
                background: "#f8fafc",
                borderRadius: "15px",
                borderLeft: `5px solid ${test.score >= 0 ? "#10b981" : "#ef4444"}`,
                transition: "transform 0.2s, box-shadow 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "15px" }}>
                  <div style={{ flex: 1, minWidth: "250px" }}>
                    <div style={{ fontWeight: "700", color: "#1e293b", fontSize: "1.2rem", marginBottom: "8px" }}>
                      {test.testTitle || test.seriesName}
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: "10px" }}>
                      📅 {new Date(test.date).toLocaleDateString()} • ⏰ {new Date(test.date).toLocaleTimeString()}
                    </div>
                    <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", fontSize: "0.95rem" }}>
                      <span style={{ color: "#10b981", fontWeight: "600" }}>✅ {test.correct || 0} Correct</span>
                      <span style={{ color: "#ef4444", fontWeight: "600" }}>❌ {test.wrong || 0} Wrong</span>
                      <span style={{ color: "#94a3b8", fontWeight: "600" }}>⏭️ {test.unattempted || 0} Skipped</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
                    <div style={{
                      fontSize: "2rem",
                      fontWeight: "900",
                      color: test.score >= 0 ? "#10b981" : "#ef4444"
                    }}>
                      {test.score.toFixed(2)}
                    </div>
                    <button
                      onClick={() => handleViewDetails(test)}
                      style={{
                        padding: "10px 20px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "600",
                        cursor: "pointer",
                        fontSize: "0.9rem"
                      }}
                    >
                      📊 View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
