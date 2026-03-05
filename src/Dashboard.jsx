import { useContext } from "react";
import { TestSeriesContext } from "./TestSeriesContext";
import { auth } from "./firebase";

export default function Dashboard() {
  const { testHistory, subjects, testSeries, userProfile } = useContext(TestSeriesContext);
  const user = auth.currentUser;

  // Calculate stats from userProfile (which is synced with Firebase)
  const totalTests = userProfile.totalTests || testHistory.length;
  const averageScore = userProfile.averageScore || 0;
  const bestScore = userProfile.bestScore || 0;
  const totalScore = userProfile.totalScore || 0;

  console.log("📊 Dashboard data:", {
    totalTests,
    averageScore,
    bestScore,
    historyLength: testHistory.length
  });

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
          📊 My Dashboard
        </h1>
        <p style={{ margin: 0, fontSize: "1.1rem", opacity: 0.9 }}>
          Welcome back, {user?.displayName || user?.email?.split('@')[0] || "Student"}!
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        marginBottom: "40px"
      }}>
        <div style={{
          background: "#fff",
          borderRadius: "15px",
          padding: "30px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
        }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>📝</div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#667eea" }}>
            {totalTests}
          </div>
          <div style={{ color: "#64748b", marginTop: "5px" }}>Tests Taken</div>
        </div>

        <div style={{
          background: "#fff",
          borderRadius: "15px",
          padding: "30px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
        }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>📈</div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#10b981" }}>
            {typeof averageScore === 'number' ? averageScore.toFixed(2) : averageScore}
          </div>
          <div style={{ color: "#64748b", marginTop: "5px" }}>Average Score</div>
        </div>

        <div style={{
          background: "#fff",
          borderRadius: "15px",
          padding: "30px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
        }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>🏆</div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#f59e0b" }}>
            {typeof bestScore === 'number' ? bestScore.toFixed(2) : bestScore}
          </div>
          <div style={{ color: "#64748b", marginTop: "5px" }}>Best Score</div>
        </div>

        <div style={{
          background: "#fff",
          borderRadius: "15px",
          padding: "30px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
        }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>💯</div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#3b82f6" }}>
            {typeof totalScore === 'number' ? totalScore.toFixed(2) : totalScore}
          </div>
          <div style={{ color: "#64748b", marginTop: "5px" }}>Total Score</div>
        </div>
      </div>

      {/* Recent Tests */}
      <div style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
      }}>
        <h2 style={{ margin: "0 0 25px 0", color: "#1e293b" }}>
          Recent Test History
        </h2>
        {testHistory.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "40px",
            color: "#64748b"
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "15px" }}>📝</div>
            <p>No tests taken yet. Start practicing now!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {testHistory.slice(-10).reverse().map((test, idx) => (
              <div key={idx} style={{
                padding: "20px",
                background: "#f8fafc",
                borderRadius: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderLeft: `4px solid ${test.score >= 0 ? "#10b981" : "#ef4444"}`
              }}>
                <div>
                  <div style={{ fontWeight: "600", color: "#1e293b", marginBottom: "5px" }}>
                    {test.seriesName}
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "#64748b" }}>
                    ✅ {test.correct} Correct • ❌ {test.wrong} Wrong • ⏭️ {test.unattempted} Skipped
                  </div>
                </div>
                <div style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: test.score >= 0 ? "#10b981" : "#ef4444"
                }}>
                  {test.score.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
