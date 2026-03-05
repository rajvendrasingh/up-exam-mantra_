import { useState, useMemo, useEffect } from "react";
import { getAllUsers } from "./services/firestoreService";

export default function Leaderboard() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users from Firebase on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const users = await getAllUsers();
        setAllUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const rankings = useMemo(() => {
    if (!allUsers || allUsers.length === 0) {
      return [];
    }

    // Create rankings from all users in Firebase
    const rankingsArray = allUsers.map(user => ({
      userId: user.id,
      userName: user.name || user.email?.split('@')[0] || "Student",
      totalTests: user.totalTests || 0,
      totalScore: user.totalScore || 0,
      averageScore: user.averageScore || 0,
      bestScore: user.bestScore || 0,
      percentage: user.totalTests > 0 
        ? ((user.totalScore / user.totalTests) * 100).toFixed(2)
        : "0.00"
    }));

    // Sort by total score (descending)
    rankingsArray.sort((a, b) => b.totalScore - a.totalScore);

    // Assign ranks
    rankingsArray.forEach((user, index) => {
      user.rank = index + 1;
    });

    return rankingsArray;
  }, [allUsers]);

  const getRankBadge = (rank) => {
    if (rank === 1) return { emoji: "🥇", color: "#fbbf24", text: "Gold" };
    if (rank === 2) return { emoji: "🥈", color: "#94a3b8", text: "Silver" };
    if (rank === 3) return { emoji: "🥉", color: "#f97316", text: "Bronze" };
    return { emoji: "🏅", color: "#6366f1", text: `#${rank}` };
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "40px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: "20px",
          padding: "60px",
          textAlign: "center",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "20px" }}>⏳</div>
          <h3 style={{ color: "#64748b", fontSize: "1.5rem" }}>
            Loading Leaderboard...
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "40px 20px"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        {/* Header */}
        <div style={{
          textAlign: "center",
          marginBottom: "40px"
        }}>
          <h1 style={{
            fontSize: "3rem",
            color: "#fff",
            marginBottom: "10px",
            textShadow: "0 2px 10px rgba(0,0,0,0.2)"
          }}>
            🏆 Leaderboard
          </h1>
          <p style={{
            fontSize: "1.2rem",
            color: "rgba(255,255,255,0.9)"
          }}>
            Global rankings based on total scores
          </p>
        </div>

        {/* Rankings */}
        {rankings.length === 0 ? (
          <div style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: "20px",
            padding: "60px 30px",
            textAlign: "center",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
          }}>
            <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📊</div>
            <h3 style={{ color: "#64748b", fontSize: "1.5rem" }}>
              No users found yet
            </h3>
            <p style={{ color: "#94a3b8", marginTop: "10px" }}>
              Be the first to complete a test and appear on the leaderboard!
            </p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            {rankings.length >= 3 && (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
                marginBottom: "30px"
              }}>
                {/* 2nd Place */}
                <div style={{
                  background: "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
                  borderRadius: "20px",
                  padding: "30px 20px",
                  textAlign: "center",
                  color: "#fff",
                  transform: "translateY(20px)",
                  boxShadow: "0 10px 30px rgba(148,163,184,0.3)"
                }}>
                  <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🥈</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "5px" }}>
                    {rankings[1].userName}
                  </div>
                  <div style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "5px" }}>
                    {rankings[1].totalScore}
                  </div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>
                    {rankings[1].totalTests} tests • Avg: {rankings[1].averageScore}
                  </div>
                </div>

                {/* 1st Place */}
                <div style={{
                  background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                  borderRadius: "20px",
                  padding: "40px 20px",
                  textAlign: "center",
                  color: "#fff",
                  boxShadow: "0 15px 40px rgba(251,191,36,0.4)",
                  position: "relative"
                }}>
                  <div style={{
                    position: "absolute",
                    top: "-15px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#fff",
                    color: "#fbbf24",
                    padding: "5px 15px",
                    borderRadius: "20px",
                    fontSize: "0.9rem",
                    fontWeight: "700",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                  }}>
                    👑 CHAMPION
                  </div>
                  <div style={{ fontSize: "4rem", marginBottom: "10px" }}>🥇</div>
                  <div style={{ fontSize: "1.8rem", fontWeight: "800", marginBottom: "5px" }}>
                    {rankings[0].userName}
                  </div>
                  <div style={{ fontSize: "2.5rem", fontWeight: "900", marginBottom: "5px" }}>
                    {rankings[0].totalScore}
                  </div>
                  <div style={{ fontSize: "1rem", opacity: 0.95 }}>
                    {rankings[0].totalTests} tests • Avg: {rankings[0].averageScore}
                  </div>
                </div>

                {/* 3rd Place */}
                <div style={{
                  background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                  borderRadius: "20px",
                  padding: "30px 20px",
                  textAlign: "center",
                  color: "#fff",
                  transform: "translateY(20px)",
                  boxShadow: "0 10px 30px rgba(249,115,22,0.3)"
                }}>
                  <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🥉</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "5px" }}>
                    {rankings[2].userName}
                  </div>
                  <div style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "5px" }}>
                    {rankings[2].totalScore}
                  </div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>
                    {rankings[2].totalTests} tests • Avg: {rankings[2].averageScore}
                  </div>
                </div>
              </div>
            )}

            {/* Full Rankings Table */}
            <div style={{
              background: "rgba(255,255,255,0.95)",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
            }}>
              <div style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                padding: "20px 30px",
                color: "#fff"
              }}>
                <h2 style={{ margin: 0, fontSize: "1.5rem" }}>
                  Complete Rankings
                </h2>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{
                  width: "100%",
                  borderCollapse: "collapse"
                }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      <th style={{ padding: "15px 20px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Rank</th>
                      <th style={{ padding: "15px 20px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Student</th>
                      <th style={{ padding: "15px 20px", textAlign: "center", fontWeight: "600", color: "#475569" }}>Total Score</th>
                      <th style={{ padding: "15px 20px", textAlign: "center", fontWeight: "600", color: "#475569" }}>Tests</th>
                      <th style={{ padding: "15px 20px", textAlign: "center", fontWeight: "600", color: "#475569" }}>Average</th>
                      <th style={{ padding: "15px 20px", textAlign: "center", fontWeight: "600", color: "#475569" }}>Best Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.map((user, index) => {
                      const badge = getRankBadge(user.rank);
                      return (
                        <tr key={user.userId} style={{
                          borderBottom: "1px solid #e2e8f0",
                          background: index % 2 === 0 ? "#fff" : "#f8fafc",
                          transition: "background 0.2s"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
                        onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? "#fff" : "#f8fafc"}>
                          <td style={{ padding: "20px" }}>
                            <div style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px"
                            }}>
                              <span style={{ fontSize: "1.5rem" }}>{badge.emoji}</span>
                              <span style={{
                                fontSize: "1.2rem",
                                fontWeight: "700",
                                color: badge.color
                              }}>
                                #{user.rank}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: "20px" }}>
                            <div style={{ fontWeight: "600", color: "#1e293b", fontSize: "1.1rem" }}>
                              {user.userName}
                            </div>
                          </td>
                          <td style={{ padding: "20px", textAlign: "center" }}>
                            <div style={{
                              fontSize: "1.3rem",
                              fontWeight: "700",
                              color: "#6366f1"
                            }}>
                              {user.totalScore}
                            </div>
                          </td>
                          <td style={{ padding: "20px", textAlign: "center", color: "#64748b" }}>
                            {user.totalTests}
                          </td>
                          <td style={{ padding: "20px", textAlign: "center", color: "#64748b" }}>
                            {user.averageScore}
                          </td>
                          <td style={{ padding: "20px", textAlign: "center" }}>
                            <div style={{
                              display: "inline-block",
                              padding: "5px 15px",
                              background: "#10b981",
                              color: "#fff",
                              borderRadius: "20px",
                              fontWeight: "600"
                            }}>
                              {user.bestScore}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
