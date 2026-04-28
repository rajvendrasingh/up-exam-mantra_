import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getAllTestSeries, 
  createTestSeries, 
  updateTestSeries, 
  deleteTestSeries 
} from '../../services/firestoreService';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [testSeries, setTestSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSeries, setEditingSeries] = useState(null);
  
  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('draft');

  useEffect(() => {
    loadTestSeries();
  }, []);

  const loadTestSeries = async () => {
    try {
      setLoading(true);
      const data = await getAllTestSeries(true); // Include inactive
      setTestSeries(data);
    } catch (error) {
      console.error('Error loading test series:', error);
      alert('Failed to load test series');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    try {
      const newSeries = await createTestSeries({
        title,
        description,
        category,
        status,
        order: testSeries.length + 1
      });
      
      setTestSeries([...testSeries, newSeries]);
      resetForm();
      setShowCreateModal(false);
      alert('✅ Test series created successfully!');
    } catch (error) {
      console.error('Error creating test series:', error);
      alert('Failed to create test series');
    }
  };

  const handleUpdate = async () => {
    if (!editingSeries) return;

    try {
      await updateTestSeries(editingSeries.id, {
        title,
        description,
        category,
        status
      });
      
      setTestSeries(testSeries.map(s => 
        s.id === editingSeries.id 
          ? { ...s, title, description, category, status }
          : s
      ));
      
      resetForm();
      setEditingSeries(null);
      alert('✅ Test series updated successfully!');
    } catch (error) {
      console.error('Error updating test series:', error);
      alert('Failed to update test series');
    }
  };

  const handleDelete = async (seriesId) => {
    if (!window.confirm('Are you sure? This will delete all sections, tests, and questions!')) {
      return;
    }

    try {
      await deleteTestSeries(seriesId);
      setTestSeries(testSeries.filter(s => s.id !== seriesId));
      alert('✅ Test series deleted successfully!');
    } catch (error) {
      console.error('Error deleting test series:', error);
      alert('Failed to delete test series');
    }
  };

  const openEditModal = (series) => {
    setEditingSeries(series);
    setTitle(series.title);
    setDescription(series.description);
    setCategory(series.category);
    setStatus(series.status);
    setShowCreateModal(true);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setStatus('draft');
    setEditingSeries(null);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)'
      }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏳</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: '2.5rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                🎓 Admin Dashboard
              </h1>
              <p style={{ margin: '10px 0 0 0', color: '#64748b', fontSize: '1.1rem' }}>
                Manage your test series, sections, and questions
              </p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }}
              style={{
                padding: '15px 30px',
                background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              }}
            >
              ➕ Create Test Series
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📚</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#2563EB' }}>
              {testSeries.length}
            </div>
            <div style={{ color: '#64748b', fontWeight: '600' }}>Total Test Series</div>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>✅</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981' }}>
              {testSeries.filter(s => s.status === 'active').length}
            </div>
            <div style={{ color: '#64748b', fontWeight: '600' }}>Active Series</div>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📝</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#f59e0b' }}>
              {testSeries.filter(s => s.status === 'draft').length}
            </div>
            <div style={{ color: '#64748b', fontWeight: '600' }}>Draft Series</div>
          </div>
        </div>

        {/* Test Series List */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            margin: '0 0 25px 0',
            fontSize: '1.8rem',
            fontWeight: '700',
            color: '#1e293b'
          }}>
            📋 All Test Series
          </h2>

          {testSeries.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#64748b'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📚</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '10px' }}>
                No test series yet
              </div>
              <div style={{ fontSize: '1rem' }}>
                Click "Create Test Series" to get started
              </div>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {testSeries.map((series) => (
                <div
                  key={series.id}
                  style={{
                    background: '#f8fafc',
                    borderRadius: '15px',
                    padding: '25px',
                    border: '2px solid #e2e8f0',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Status Badge */}
                  <div style={{
                    display: 'inline-block',
                    padding: '6px 15px',
                    background: series.status === 'active' ? '#10b981' : '#f59e0b',
                    color: '#fff',
                    borderRadius: '50px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    marginBottom: '15px'
                  }}>
                    {series.status === 'active' ? '✅ Active' : '📝 Draft'}
                  </div>

                  <h3 style={{
                    margin: '0 0 10px 0',
                    fontSize: '1.4rem',
                    fontWeight: '700',
                    color: '#1e293b'
                  }}>
                    {series.title}
                  </h3>

                  <p style={{
                    margin: '0 0 15px 0',
                    color: '#64748b',
                    fontSize: '0.95rem',
                    lineHeight: '1.5'
                  }}>
                    {series.description || 'No description'}
                  </p>

                  {series.category && (
                    <div style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      background: '#e0e7ff',
                      color: '#2563EB',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      marginBottom: '15px'
                    }}>
                      📂 {series.category}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginTop: '15px',
                    paddingTop: '15px',
                    borderTop: '1px solid #e2e8f0'
                  }}>
                    <button
                      onClick={() => navigate(`/admin/series/${series.id}/sections`)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      Manage Sections →
                    </button>
                    <button
                      onClick={() => openEditModal(series)}
                      style={{
                        padding: '10px 15px',
                        background: '#3b82f6',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(series.id)}
                      style={{
                        padding: '10px 15px',
                        background: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{
              margin: '0 0 25px 0',
              fontSize: '2rem',
              fontWeight: '800',
              color: '#1e293b'
            }}>
              {editingSeries ? '✏️ Edit Test Series' : '➕ Create Test Series'}
            </h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Lekhpal 2026 Test Series"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e2e8f0',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the test series"
                rows="3"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e2e8f0',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., UPSSSC Lekhpal, VDO"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e2e8f0',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e2e8f0',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                <option value="draft">📝 Draft</option>
                <option value="active">✅ Active</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={editingSeries ? handleUpdate : handleCreate}
                style={{
                  flex: 1,
                  padding: '15px',
                  background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {editingSeries ? '💾 Update' : '✅ Create'}
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                style={{
                  flex: 1,
                  padding: '15px',
                  background: '#e2e8f0',
                  color: '#64748b',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

