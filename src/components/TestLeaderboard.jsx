import { useState, useEffect } from 'react';
import { getTestLeaderboard } from '../services/firestoreService';

export default function TestLeaderboard({ testId, testTitle, currentUserId, onClose }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const results = await getTestLeaderboard(testId);
        setLeaderboard(results);
        
        // Find current user's rank
        const userResult = results.find(r => r.userId === currentUserId);
        if (userResult) {
          setUserRank({
            rank: userResult.rank,
            totalParticipants: results.length,
            percentile: ((results.length - userResult.rank + 1) / results.length * 100).toFixed(2)
          });
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    if (testId) {
      fetchLeaderboard();
    }
  }, [testId, currentUserId]);

  const getRankBadge = (rank) => {
    if (rank === 1) return { emoji: "🥇", color: "#fbbf24", text: "Gold" };
    if (rank === 2) return { emoji: "🥈", color: "#94a3b8", text: "Silver" };
    if (rank === 3) return { emoji: "🥉", color: "#f97316", text: "Bronze" };
    return { emoji: "🏅", color: "#2563EB", text: `#${rank}` };
  };

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20000
      }}>
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏳</div>
          <h3>Loading Leaderboard...</h3>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 20000,
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
          padding: '30px',
          color: '#fff',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#fff',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              fontSize: '1.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '2rem' }}>
            🏆 Test Leaderboard
          </h2>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '1.1rem' }}>
            {testTitle}
          </p>
        </div>

        {/* User's Rank Card */}
        {userRank && (
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            padding: '25px',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '5px' }}>
                {getRankBadge(userRank.rank).emoji}
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800' }}>
                #{userRank.rank}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Your Rank</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '5px' }}>📊</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800' }}>
                Top {userRank.percentile}%
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Percentile</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '5px' }}>👥</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800' }}>
                {userRank.totalParticipants}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Participants</div>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {leaderboard.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📊</div>
              <h3>No results yet</h3>
              <p>Be the first to complete this test!</p>
            </div>
          ) : (
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '15px 10px', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Rank</th>
                  <th style={{ padding: '15px 10px', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Student</th>
                  <th style={{ padding: '15px 10px', textAlign: 'center', fontWeight: '600', color: '#475569' }}>Score</th>
                  <th style={{ padding: '15px 10px', textAlign: 'center', fontWeight: '600', color: '#475569' }}>%</th>
                  <th style={{ padding: '15px 10px', textAlign: 'center', fontWeight: '600', color: '#475569' }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((result, index) => {
                  const badge = getRankBadge(result.rank);
                  const isCurrentUser = result.userId === currentUserId;
                  
                  return (
                    <tr key={result.id} style={{
                      borderBottom: '1px solid #e2e8f0',
                      background: isCurrentUser ? '#f0fdf4' : (index % 2 === 0 ? '#fff' : '#f8fafc'),
                      fontWeight: isCurrentUser ? '600' : 'normal'
                    }}>
                      <td style={{ padding: '15px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ fontSize: '1.2rem' }}>{badge.emoji}</span>
                          <span style={{ fontSize: '1rem', fontWeight: '700', color: badge.color }}>
                            #{result.rank}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '15px 10px' }}>
                        <div style={{ 
                          color: isCurrentUser ? '#10b981' : '#1e293b',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}>
                          {result.userName || result.userEmail?.split('@')[0] || 'Student'}
                          {isCurrentUser && <span style={{ fontSize: '0.8rem' }}>(You)</span>}
                        </div>
                      </td>
                      <td style={{ padding: '15px 10px', textAlign: 'center' }}>
                        <div style={{
                          fontSize: '1.1rem',
                          fontWeight: '700',
                          color: '#2563EB'
                        }}>
                          {result.score}/{result.totalQuestions}
                        </div>
                      </td>
                      <td style={{ padding: '15px 10px', textAlign: 'center' }}>
                        <div style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          background: result.percentage >= 80 ? '#10b981' : result.percentage >= 60 ? '#f59e0b' : '#ef4444',
                          color: '#fff',
                          borderRadius: '20px',
                          fontWeight: '600',
                          fontSize: '0.9rem'
                        }}>
                          {result.percentage}%
                        </div>
                      </td>
                      <td style={{ padding: '15px 10px', textAlign: 'center', color: '#64748b' }}>
                        {Math.floor(result.timeTaken / 60)}:{(result.timeTaken % 60).toString().padStart(2, '0')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px',
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 30px',
              background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

