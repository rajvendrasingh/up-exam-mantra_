import { useState, useEffect, useContext } from "react";
import { TestSeriesContext } from "./TestSeriesContext";
import { getTestLeaderboard } from "./services/firestoreService";

export default function Leaderboard() {
  // TestSeriesContext se test series list lo
  const { testSeries } = useContext(TestSeriesContext);
  const activeSeries = testSeries.filter(s => s.status === "active");

  // Selection states
  const [selectedSeriesIdx, setSelectedSeriesIdx] = useState(null);
  const [selectedSectionIdx, setSelectedSectionIdx] = useState(null);
  const [selectedTestIdx, setSelectedTestIdx] = useState(null);

  // Leaderboard data
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Current selected items
  const currentSeries = selectedSeriesIdx !== null ? activeSeries[selectedSeriesIdx] : null;
  const currentSection = currentSeries && selectedSectionIdx !== null ? currentSeries.sections?.[selectedSectionIdx] : null;
  const currentTest = currentSection && selectedTestIdx !== null ? currentSection.tests?.[selectedTestIdx] : null;

  // Jab bhi test select ho, leaderboard fetch karo
  useEffect(() => {
    if (!currentSeries || !currentSection || !currentTest) {
      setLeaderboard([]);
      return;
    }
    const testId = `${currentSeries.id}_${currentSection.id}_${currentTest.id}`;
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getTestLeaderboard(testId);
        setLeaderboard(data);
      } catch {
        setError("Leaderboard load nahi ho saka. Dobara try karo.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [selectedSeriesIdx, selectedSectionIdx, selectedTestIdx, currentSeries, currentSection, currentTest]);

  const handleSeriesChange = (idx) => {
    setSelectedSeriesIdx(idx);
    setSelectedSectionIdx(null);
    setSelectedTestIdx(null);
    setLeaderboard([]);
  };

  const handleSectionChange = (idx) => {
    setSelectedSectionIdx(idx);
    setSelectedTestIdx(null);
    setLeaderboard([]);
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return { emoji: "🥇", color: "#fbbf24" };
    if (rank === 2) return { emoji: "🥈", color: "#94a3b8" };
    if (rank === 3) return { emoji: "🥉", color: "#f97316" };
    return { emoji: "🏅", color: "#6366f1" };
  };

  const formatTime = (seconds) => {
    if (!seconds) return "—";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "40px 20px"
    }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "2.5rem", color: "#fff", marginBottom: "10px", textShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
            🏆 Test Leaderboard
          </h1>
          <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.85)" }}>
            Kisi bhi test ka leaderboard dekhne ke liye neeche select karo
          </p>
        </div>

        {/* Selection Dropdowns */}
        <div style={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: "20px",
          padding: "30px",
          marginBottom: "30px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ color: "#1e293b", marginBottom: "20px", fontSize: "1.2rem" }}>📋 Test Select Karo</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
            {/* Test Series */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#475569", fontWeight: "600", fontSize: "0.9rem" }}>
                Test Series
              </label>
              <select
                value={selectedSeriesIdx ?? ""}
                onChange={(e) => handleSeriesChange(e.target.value === "" ? null : parseInt(e.target.value))}
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "2px solid #e2e8f0", fontSize: "0.95rem", color: "#1e293b", background: "#fff", cursor: "pointer", outline: "none" }}
              >
                <option value="">-- Series chuniye --</option>
                {activeSeries.map((series, idx) => (
                  <option key={series.id} value={idx}>{series.title}</option>
                ))}
              </select>
            </div>
            {/* Section */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#475569", fontWeight: "600", fontSize: "0.9rem" }}>
                Section
              </label>
              <select
                value={selectedSectionIdx ?? ""}
                onChange={(e) => handleSectionChange(e.target.value === "" ? null : parseInt(e.target.value))}
                disabled={!currentSeries}
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "2px solid #e2e8f0", fontSize: "0.95rem", color: "#1e293b", background: currentSeries ? "#fff" : "#f8fafc", cursor: currentSeries ? "pointer" : "not-allowed", outline: "none" }}
              >
                <option value="">-- Section chuniye --</option>
                {currentSeries?.sections?.map((section, idx) => (
                  <option key={section.id} value={idx}>{section.title}</option>
                ))}
              </select>
            </div>
            {/* Test */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#475569", fontWeight: "600", fontSize: "0.9rem" }}>
                Test
              </label>
              <select
                value={selectedTestIdx ?? ""}
                onChange={(e) => setSelectedTestIdx(e.target.value === "" ? null : parseInt(e.target.value))}
                disabled={!currentSection}
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "2px solid #e2e8f0", fontSize: "0.95rem", color: "#1e293b", background: currentSection ? "#fff" : "#f8fafc", cursor: currentSection ? "pointer" : "not-allowed", outline: "none" }}
              >
                <option value="">-- Test chuniye --</option>
                {currentSection?.tests?.map((test, idx) => (
                  <option key={test.id} value={idx}>{test.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Area */}
        {!currentTest ? (
          <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: "20px", padding: "60px 30px", textAlign: "center", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📊</div>
            <h3 style={{ color: "#64748b", fontSize: "1.4rem", marginBottom: "10px" }}>Upar se test select karo</h3>
            <p style={{ color: "#94a3b8" }}>Series → Section → Test select karne ke baad leaderboard dikhega</p>
          </div>
        ) : loading ? (
          <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: "20px", padding: "60px", textAlign: "center", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "20px" }}>⏳</div>
            <h3 style={{ color: "#64748b" }}>Leaderboard load ho raha hai...</h3>
          </div>
        ) : error ? (
          <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: "20px", padding: "40px", textAlign: "center", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "15px" }}>❌</div>
            <p style={{ color: "#ef4444", fontWeight: "600" }}>{error}</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: "20px", padding: "60px 30px", textAlign: "center", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🎯</div>
            <h3 style={{ color: "#64748b", fontSize: "1.4rem", marginBottom: "10px" }}>Abhi tak kisi ne yeh test attempt nahi kiya</h3>
            <p style={{ color: "#94a3b8" }}>Pehle attempt karo aur leaderboard mein apna naam dekho!</p>
          </div>
        ) : (
          <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}>
            {/* Table Header */}
            <div style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "20px 30px", color: "#fff" }}>
              <h2 style={{ margin: 0, fontSize: "1.3rem" }}>🏆 {currentTest.title} — Leaderboard</h2>
              <p style={{ margin: "5px 0 0 0", opacity: 0.85, fontSize: "0.9rem" }}>
                {currentSeries.title} › {currentSection.title} | {leaderboard.length} participants
              </p>
            </div>

            {/* Top 3 Podium */}
            {leaderboard.length >= 3 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px", padding: "25px 25px 10px", background: "#f8fafc" }}>
                {/* 2nd Place */}
                <div style={{ background: "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)", borderRadius: "15px", padding: "20px 15px", textAlign: "center", color: "#fff", marginTop: "20px" }}>
                  <div style={{ fontSize: "2.5rem" }}>🥈</div>
                  <div style={{ fontWeight: "700", fontSize: "1rem", marginTop: "8px" }}>{leaderboard[1].userName}</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "800" }}>{leaderboard[1].score?.toFixed(2)}</div>
                  <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>{leaderboard[1].percentage?.toFixed(1)}%</div>
                </div>
                {/* 1st Place */}
                <div style={{ background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)", borderRadius: "15px", padding: "25px 15px", textAlign: "center", color: "#fff", position: "relative" }}>
                  <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "#fff", color: "#fbbf24", padding: "3px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "700" }}>
                    👑 CHAMPION
                  </div>
                  <div style={{ fontSize: "3rem" }}>🥇</div>
                  <div style={{ fontWeight: "800", fontSize: "1.1rem", marginTop: "8px" }}>{leaderboard[0].userName}</div>
                  <div style={{ fontSize: "1.8rem", fontWeight: "900" }}>{leaderboard[0].score?.toFixed(2)}</div>
                  <div style={{ fontSize: "0.85rem", opacity: 0.95 }}>{leaderboard[0].percentage?.toFixed(1)}%</div>
                </div>
                {/* 3rd Place */}
                <div style={{ background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)", borderRadius: "15px", padding: "20px 15px", textAlign: "center", color: "#fff", marginTop: "20px" }}>
                  <div style={{ fontSize: "2.5rem" }}>🥉</div>
                  <div style={{ fontWeight: "700", fontSize: "1rem", marginTop: "8px" }}>{leaderboard[2].userName}</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "800" }}>{leaderboard[2].score?.toFixed(2)}</div>
                  <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>{leaderboard[2].percentage?.toFixed(1)}%</div>
                </div>
              </div>
            )}

            {/* Rankings Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f1f5f9" }}>
                    <th style={{ padding: "14px 20px", textAlign: "left", color: "#475569", fontWeight: "600", fontSize: "0.9rem" }}>Rank</th>
                    <th style={{ padding: "14px 20px", textAlign: "left", color: "#475569", fontWeight: "600", fontSize: "0.9rem" }}>Student</th>
                    <th style={{ padding: "14px 20px", textAlign: "center", color: "#475569", fontWeight: "600", fontSize: "0.9rem" }}>Score</th>
                    <th style={{ padding: "14px 20px", textAlign: "center", color: "#475569", fontWeight: "600", fontSize: "0.9rem" }}>Accuracy</th>
                    <th style={{ padding: "14px 20px", textAlign: "center", color: "#475569", fontWeight: "600", fontSize: "0.9rem" }}>Correct</th>
                    <th style={{ padding: "14px 20px", textAlign: "center", color: "#475569", fontWeight: "600", fontSize: "0.9rem" }}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => {
                    const badge = getRankBadge(entry.rank);
                    return (
                      <tr key={entry.id}
                        style={{ borderBottom: "1px solid #e2e8f0", background: index % 2 === 0 ? "#fff" : "#f8fafc", transition: "background 0.2s" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
                        onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? "#fff" : "#f8fafc"}
                      >
                        <td style={{ padding: "16px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "1.3rem" }}>{badge.emoji}</span>
                            <span style={{ fontWeight: "700", color: badge.color, fontSize: "1.1rem" }}>#{entry.rank}</span>
                          </div>
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <div style={{ fontWeight: "600", color: "#1e293b" }}>{entry.userName}</div>
                        </td>
                        <td style={{ padding: "16px 20px", textAlign: "center" }}>
                          <span style={{ fontSize: "1.1rem", fontWeight: "700", color: "#6366f1" }}>{entry.score?.toFixed(2)}</span>
                          <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>/{entry.totalQuestions}</span>
                        </td>
                        <td style={{ padding: "16px 20px", textAlign: "center" }}>
                          <span style={{
                            padding: "4px 12px", borderRadius: "20px",
                            background: entry.percentage >= 70 ? "#dcfce7" : entry.percentage >= 40 ? "#fef3c7" : "#fee2e2",
                            color: entry.percentage >= 70 ? "#166534" : entry.percentage >= 40 ? "#92400e" : "#991b1b",
                            fontWeight: "600", fontSize: "0.9rem"
                          }}>
                            {entry.percentage?.toFixed(1)}%
                          </span>
                        </td>
                        <td style={{ padding: "16px 20px", textAlign: "center", color: "#22c55e", fontWeight: "600" }}>
                          {entry.correctAnswers ?? "—"}
                        </td>
                        <td style={{ padding: "16px 20px", textAlign: "center", color: "#64748b", fontSize: "0.9rem" }}>
                          {formatTime(entry.timeTaken)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
