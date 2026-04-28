import { useContext } from "react";
import { Link } from "react-router-dom";
import { TestSeriesContext } from "./TestSeriesContext";

export default function Home() {
  const { testSeries, userProfile, testHistory } = useContext(TestSeriesContext);

  const recentTests = testHistory.slice(-3).reverse();

  // Calculate total questions from all test series
  const totalQuestions = testSeries.reduce((sum, series) => {
    // Count questions from sections → tests → questions
    const seriesQuestions = series.sections?.reduce((sectionSum, section) => {
      const sectionQuestions = section.tests?.reduce((testSum, test) => {
        return testSum + (test.questions?.length || 0);
      }, 0) || 0;
      return sectionSum + sectionQuestions;
    }, 0) || 0;
    
    // Also count direct questions if any
    const directQuestions = series.questions?.length || 0;
    
    return sum + seriesQuestions + directQuestions;
  }, 0);

  // Calculate total sections
  const totalSections = testSeries.reduce((sum, series) => {
    return sum + (series.sections?.length || 0);
  }, 0);

  return (
    <div style={{ 
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      paddingBottom: "60px"
    }}>
      {/* Animated Background Shapes */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        zIndex: 0,
        pointerEvents: "none"
      }}>
        <div style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "300px",
          height: "300px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          filter: "blur(60px)",
          animation: "float 6s ease-in-out infinite"
        }} />
        <div style={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: "400px",
          height: "400px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          filter: "blur(80px)",
          animation: "float 8s ease-in-out infinite"
        }} />
      </div>

      <div style={{ 
        maxWidth: "1400px", 
        margin: "0 auto", 
        padding: "40px 20px",
        position: "relative",
        zIndex: 1
      }}>
        {/* Hero Section with Glass Effect */}
        <div style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: "30px",
          padding: "50px 40px",
          textAlign: "center",
          marginBottom: "50px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Decorative Elements */}
          <div style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "200px",
            height: "200px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "50%",
            opacity: 0.1,
            filter: "blur(40px)"
          }} />
          
          <div style={{
            display: "inline-block",
            padding: "6px 16px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#fff",
            borderRadius: "50px",
            fontSize: "0.85rem",
            fontWeight: "600",
            marginBottom: "15px",
            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)"
          }}>
            🎓 India's Leading Exam Platform
          </div>

          <h1 style={{ 
            fontSize: "3rem", 
            margin: "15px 0",
            fontWeight: "900",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-1.5px",
            lineHeight: "1.2"
          }}>
            UP Exam Mantra
          </h1>
          
          <p style={{ 
            fontSize: "1.2rem", 
            margin: "0 0 30px 0",
            color: "#64748b",
            fontWeight: "500",
            maxWidth: "650px",
            marginLeft: "auto",
            marginRight: "auto"
          }}>
            Master UPSSSC & UP Government Exams with AI-Powered Practice Tests
          </p>
          
          <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap", marginBottom: "35px" }}>
            <Link to="/test" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 32px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "50px",
              fontWeight: "700",
              fontSize: "1rem",
              boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)",
              transition: "all 0.3s ease",
              border: "none"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(102, 126, 234, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(102, 126, 234, 0.4)";
            }}>
              <span>🚀</span> Start Practice Now
            </Link>

            <Link to="/study-material" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 32px",
              background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "50px",
              fontWeight: "700",
              fontSize: "1rem",
              boxShadow: "0 10px 30px rgba(124, 58, 237, 0.4)",
              transition: "all 0.3s ease",
              border: "none"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(124, 58, 237, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(124, 58, 237, 0.4)";
            }}>
              <span>📚</span> Study Material
            </Link>
            
            <a href="#test-series" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 32px",
              background: "#fff",
              color: "#667eea",
              textDecoration: "none",
              borderRadius: "50px",
              fontWeight: "700",
              fontSize: "1rem",
              border: "2px solid #667eea",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#667eea";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.color = "#667eea";
              e.currentTarget.style.transform = "translateY(0)";
            }}>
              <span>📚</span> Explore Tests
            </a>
          </div>

          {/* Stats Bar */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "50px",
            flexWrap: "wrap"
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: "800", color: "#667eea" }}>
                {testSeries.length}+
              </div>
              <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>
                Test Series
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: "800", color: "#8b5cf6" }}>
                {totalSections}+
              </div>
              <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>
                Sections
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: "800", color: "#ec4899" }}>
                {totalQuestions}+
              </div>
              <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>
                Questions
              </div>
            </div>
          </div>
        </div>

        {/* Performance Dashboard */}
        <div style={{ marginBottom: "50px" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            marginBottom: "25px"
          }}>
            <h2 style={{ 
              fontSize: "2rem", 
              margin: 0,
              color: "#fff",
              fontWeight: "800"
            }}>
              📊 Your Performance
            </h2>
            <div style={{
              flex: 1,
              height: "3px",
              background: "rgba(255, 255, 255, 0.3)",
              borderRadius: "10px"
            }} />
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "25px"
          }}>
            {[
              { icon: "🎯", label: "Tests Completed", value: userProfile.totalTests, color: "#667eea", bg: "#e0e7ff" },
              { icon: "⭐", label: "Average Score", value: userProfile.averageScore || 0, color: "#f59e0b", bg: "#fef3c7" },
              { icon: "🏆", label: "Best Score", value: userProfile.bestScore || 0, color: "#ef4444", bg: "#fee2e2" },
              { icon: "💯", label: "Total Score", value: userProfile.totalScore || 0, color: "#10b981", bg: "#d1fae5" },
              { icon: "📈", label: "Success Rate", value: userProfile.totalTests > 0 ? Math.round((userProfile.averageScore / userProfile.totalTests) * 100) + "%" : "0%", color: "#8b5cf6", bg: "#ede9fe" }
            ].map((stat, idx) => (
              <div key={idx} style={{
                background: "#fff",
                borderRadius: "20px",
                padding: "30px",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.1)";
              }}>
                <div style={{
                  position: "absolute",
                  top: "-20px",
                  right: "-20px",
                  width: "100px",
                  height: "100px",
                  background: stat.bg,
                  borderRadius: "50%",
                  opacity: 0.5
                }} />
                
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  marginBottom: "15px"
                }}>
                  <div style={{
                    fontSize: "3rem",
                    width: "70px",
                    height: "70px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: stat.bg,
                    borderRadius: "15px"
                  }}>
                    {stat.icon}
                  </div>
                  <div>
                    <div style={{ 
                      fontSize: "2.5rem", 
                      fontWeight: "800", 
                      color: stat.color,
                      lineHeight: "1"
                    }}>
                      {stat.value}
                    </div>
                    <div style={{ 
                      color: "#64748b", 
                      marginTop: "5px",
                      fontWeight: "600",
                      fontSize: "0.95rem"
                    }}>
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Subjects */}
        {/* Removed subject section - now using Test Series only */}

        {/* Test Series Section */}
        {testSeries.length > 0 && (
          <div id="test-series" style={{ marginBottom: "50px" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginBottom: "25px"
            }}>
              <h2 style={{ 
                fontSize: "2rem", 
                margin: 0,
                color: "#fff",
                fontWeight: "800"
              }}>
                📝 Test Series
              </h2>
              <div style={{
                flex: 1,
                height: "3px",
                background: "rgba(255, 255, 255, 0.3)",
                borderRadius: "10px"
              }} />
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "30px"
            }}>
              {testSeries.filter(series => series.status === "active").map((series, idx) => (
                <div key={series.id} style={{
                  background: "#fff",
                  borderRadius: "25px",
                  padding: "35px",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow = "0 25px 50px rgba(0, 0, 0, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.1)";
                }}>
                  {/* Difficulty Badge */}
                  <div style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    padding: "8px 20px",
                    background: series.status === "active" ? "#10b981" : "#f59e0b",
                    color: "#fff",
                    borderRadius: "50px",
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)"
                  }}>
                    {series.status === "active" ? "✅ Active" : "📝 Draft"}
                  </div>

                  <h3 style={{ 
                    margin: "0 0 20px 0",
                    color: "#1e293b",
                    fontSize: "1.6rem",
                    fontWeight: "700",
                    paddingRight: "100px"
                  }}>
                    {series.title}
                  </h3>

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "15px",
                    marginBottom: "25px"
                  }}>
                    <div style={{
                      padding: "15px",
                      background: "#f8fafc",
                      borderRadius: "12px",
                      textAlign: "center"
                    }}>
                      <div style={{ fontSize: "1.8rem", marginBottom: "5px" }}>📝</div>
                      <div style={{ fontSize: "1.3rem", fontWeight: "700", color: "#667eea" }}>
                        {series.sections?.reduce((sum, section) => {
                          return sum + (section.tests?.reduce((testSum, test) => {
                            return testSum + (test.questions?.length || 0);
                          }, 0) || 0);
                        }, 0) || series.questions?.length || 0}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>
                        Questions
                      </div>
                    </div>

                    <div style={{
                      padding: "15px",
                      background: "#f8fafc",
                      borderRadius: "12px",
                      textAlign: "center"
                    }}>
                      <div style={{ fontSize: "1.8rem", marginBottom: "5px" }}>⏱️</div>
                      <div style={{ fontSize: "1.3rem", fontWeight: "700", color: "#8b5cf6" }}>
                        {series.duration || "N/A"}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>
                        Minutes
                      </div>
                    </div>

                    <div style={{
                      padding: "15px",
                      background: "#f8fafc",
                      borderRadius: "12px",
                      textAlign: "center"
                    }}>
                      <div style={{ fontSize: "1.8rem", marginBottom: "5px" }}>📂</div>
                      <div style={{ fontSize: "1.3rem", fontWeight: "700", color: "#ec4899" }}>
                        {series.sections?.length || 0}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>
                        Sections
                      </div>
                    </div>

                    <div style={{
                      padding: "15px",
                      background: "#f8fafc",
                      borderRadius: "12px",
                      textAlign: "center"
                    }}>
                      <div style={{ fontSize: "1.8rem", marginBottom: "5px" }}>✅</div>
                      <div style={{ fontSize: "1.3rem", fontWeight: "700", color: "#10b981" }}>
                        {series.status === "active" ? "Active" : "Draft"}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>
                        Status
                      </div>
                    </div>
                  </div>

                  <Link to="/test" style={{
                    display: "block",
                    textAlign: "center",
                    padding: "18px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "#fff",
                    textDecoration: "none",
                    borderRadius: "15px",
                    fontWeight: "700",
                    fontSize: "1.1rem",
                    transition: "all 0.3s ease",
                    boxShadow: "0 8px 20px rgba(102, 126, 234, 0.3)"
                  }}>
                    Start Test →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {recentTests.length > 0 && (
          <div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginBottom: "25px"
            }}>
              <h2 style={{ 
                fontSize: "2rem", 
                margin: 0,
                color: "#fff",
                fontWeight: "800"
              }}>
                🕒 Recent Activity
              </h2>
              <div style={{
                flex: 1,
                height: "3px",
                background: "rgba(255, 255, 255, 0.3)",
                borderRadius: "10px"
              }} />
            </div>

            <div style={{
              background: "#fff",
              borderRadius: "25px",
              padding: "35px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)"
            }}>
              {recentTests.map((test, idx) => (
                <div key={idx} style={{
                  padding: "25px",
                  borderBottom: idx < recentTests.length - 1 ? "2px solid #f1f5f9" : "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "all 0.3s ease",
                  borderRadius: "15px",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f8fafc";
                  e.currentTarget.style.transform = "translateX(10px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateX(0)";
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <div style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "15px",
                      background: test.score >= test.totalQuestions * 0.7 
                        ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                        : test.score >= test.totalQuestions * 0.4
                        ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                        : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.8rem",
                      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)"
                    }}>
                      {test.score >= test.totalQuestions * 0.7 ? "🏆" : 
                       test.score >= test.totalQuestions * 0.4 ? "⭐" : "📝"}
                    </div>
                    <div>
                      <div style={{ 
                        fontWeight: "700", 
                        color: "#1e293b", 
                        marginBottom: "5px",
                        fontSize: "1.2rem"
                      }}>
                        {test.seriesName}
                      </div>
                      <div style={{ fontSize: "0.95rem", color: "#64748b", fontWeight: "600" }}>
                        {new Date(test.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    fontSize: "2rem",
                    fontWeight: "800",
                    color: test.score >= test.totalQuestions * 0.7 ? "#10b981" : 
                           test.score >= test.totalQuestions * 0.4 ? "#f59e0b" : "#ef4444",
                    textAlign: "right"
                  }}>
                    <div>{test.score}/{test.totalQuestions}</div>
                    <div style={{ fontSize: "0.9rem", fontWeight: "600", color: "#64748b" }}>
                      {Math.round((test.score / test.totalQuestions) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
