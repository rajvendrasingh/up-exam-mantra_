import { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Auth from "./Auth";
import Home from "./Home";
import Admin from "./Admin";
import Test from "./Mocktest";
import Dashboard from "./Dashboard";
import Help from "./Help";
import Settings from "./Settings";
import Bookmarks from "./Bookmarks";
import Footer from "./components/Footer";
import { TestSeriesProvider, TestSeriesContext } from "./TestSeriesContext";

function AppContent() {
  const navigate = useNavigate();
  const { setUseFirebase, notifications, markAsRead, markAllAsRead } = useContext(TestSeriesContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  // Get unread notification count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleAdminLogin = () => {
    if (adminUsername === "yogendra" && adminPassword === "yug@123") {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminUsername("");
      setAdminPassword("");
      
      // Enable Firebase for admin too
      setUseFirebase(true);
      
      navigate("/admin");
    } else {
      alert("Wrong username or password!");
    }
  };

  const handleAuthSuccess = async (authenticatedUser) => {
    setUser(authenticatedUser);
    
    // Automatically enable Firebase sync on login
    try {
      // Check if this is first time login (data exists in localStorage but not synced)
      const hasLocalData = localStorage.getItem("subjects") || localStorage.getItem("testSeries");
      
      setUseFirebase(true);
      
      // Show a subtle notification
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
      `;
      notification.innerHTML = hasLocalData 
        ? '✅ Firebase sync enabled! Your data will be saved to cloud.'
        : '✅ Firebase sync enabled automatically!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
      
      console.log("✅ Firebase sync enabled on login");
    } catch (error) {
      console.error("Error enabling Firebase:", error);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(120deg, #6366f1 0%, #e0e7ff 100%)"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "20px" }}>📚</div>
          <div style={{ fontSize: "1.5rem", color: "#fff", fontWeight: "600" }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  // Show Auth page if not logged in and not admin
  if (!user && !isAdmin) {
    return <Auth onAuthSuccess={handleAuthSuccess} onAdminClick={() => setShowAdminLogin(true)} showAdminLogin={showAdminLogin} setShowAdminLogin={setShowAdminLogin} adminUsername={adminUsername} setAdminUsername={setAdminUsername} adminPassword={adminPassword} setAdminPassword={setAdminPassword} handleAdminLogin={handleAdminLogin} />;
  }

  // If admin logged in but no user, create mock admin user
  if (isAdmin && !user) {
    const adminUser = {
      uid: "admin_yogendra",
      email: "admin@upexammantra.com",
      displayName: "Yogendra (Admin)"
    };
    setUser(adminUser);
    return null; // Will re-render with user set
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(120deg, #6366f1 0%, #e0e7ff 100%)"
      }}
    >
      <header style={{
        background: "rgba(255,255,255,0.85)",
        padding: "18px 0",
        marginBottom: "32px",
        boxShadow: "0 2px 8px rgba(60,72,88,0.08)",
        borderBottomLeftRadius: "18px",
        borderBottomRightRadius: "18px"
      }}>
        <nav style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px"
        }}>
          <div style={{ display: "flex", gap: "40px", alignItems: "center" }}>
            {/* Logo */}
            <Link to="/" style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none"
            }}>
              <div style={{
                fontSize: "1.5rem",
                fontWeight: "800",
                color: "#dc2626",
                letterSpacing: "-1px"
              }}>
                UP
              </div>
              <div style={{
                fontSize: "1.3rem",
                fontWeight: "700",
                background: "linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                EXAM MANTRA
              </div>
            </Link>
            
            <Link to="/" style={{
              color: "#6366f1",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "1.2rem",
              letterSpacing: "1px"
            }}>Home</Link>
            {isAdmin && (
              <Link to="/admin" style={{
                color: "#f59e0b",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "1.2rem",
                letterSpacing: "1px"
              }}>Admin</Link>
            )}
            <Link to="/test" style={{
              color: "#6366f1",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "1.2rem",
              letterSpacing: "1px"
            }}>Mocktest</Link>
          </div>
          
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            {/* YouTube Link */}
            <a 
              href="https://youtube.com/@upexammantra?si=Mnv_TczfH3EM2NEr" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.15)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              title="YouTube Channel"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FF0000"/>
              </svg>
            </a>

            {/* Telegram Link */}
            <a 
              href="https://t.me/upexammantra" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.15)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              title="Telegram Channel"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.121.099.155.232.171.326.016.094.036.308.02.475z" fill="#0088cc"/>
              </svg>
            </a>

            {/* Notifications Icon */}
            <div style={{ position: "relative" }}>
              <div 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ 
                  fontSize: "1.5rem",
                  color: showNotifications ? "#6366f1" : "#64748b",
                  cursor: "pointer",
                  transition: "color 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#6366f1"}
                onMouseLeave={(e) => {
                  if (!showNotifications) e.currentTarget.style.color = "#64748b";
                }}
                title="Notifications">
                🔔
              </div>
              <div style={{
                position: "absolute",
                top: "-5px",
                right: "-5px",
                width: "18px",
                height: "18px",
                background: "#ef4444",
                borderRadius: "50%",
                fontSize: "0.7rem",
                color: "#fff",
                display: unreadCount > 0 ? "flex" : "none",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold"
              }}>
                {unreadCount}
              </div>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 15px)",
                  right: "-20px",
                  width: "350px",
                  background: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                  border: "1px solid #e2e8f0",
                  zIndex: 1000,
                  overflow: "hidden"
                }}>
                  {/* Header */}
                  <div style={{
                    padding: "15px 20px",
                    borderBottom: "1px solid #e2e8f0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div style={{ fontSize: "1rem", fontWeight: "600", color: "#1e293b" }}>
                      Notifications {unreadCount > 0 && `(${unreadCount})`}
                    </div>
                    {unreadCount > 0 && (
                      <div 
                        onClick={markAllAsRead}
                        style={{ 
                          fontSize: "0.8rem", 
                          color: "#6366f1",
                          cursor: "pointer",
                          fontWeight: "600"
                        }}
                      >
                        Mark all read
                      </div>
                    )}
                  </div>

                  {/* Notifications List */}
                  <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {notifications.length === 0 ? (
                      <div style={{
                        padding: "40px 20px",
                        textAlign: "center",
                        color: "#94a3b8",
                        fontSize: "0.9rem"
                      }}>
                        <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🔔</div>
                        <div>No notifications yet</div>
                      </div>
                    ) : (
                      <>
                        {notifications.map((notif) => {
                          const timeAgo = (() => {
                            const now = new Date();
                            const notifTime = new Date(notif.timestamp);
                            const diffMs = now - notifTime;
                            const diffMins = Math.floor(diffMs / 60000);
                            const diffHours = Math.floor(diffMs / 3600000);
                            const diffDays = Math.floor(diffMs / 86400000);
                            
                            if (diffMins < 1) return "Just now";
                            if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
                            if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
                            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
                          })();

                          return (
                            <div
                              key={notif.id}
                              onClick={() => markAsRead(notif.id)}
                              style={{
                                padding: "15px 20px",
                                borderBottom: "1px solid #f1f5f9",
                                cursor: "pointer",
                                background: notif.read ? "#fff" : "#f8fafc",
                                transition: "background 0.2s"
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
                              onMouseLeave={(e) => e.currentTarget.style.background = notif.read ? "#fff" : "#f8fafc"}
                            >
                              <div style={{ display: "flex", gap: "12px" }}>
                                <div style={{ fontSize: "1.5rem" }}>{notif.icon}</div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: "0.9rem", fontWeight: "600", color: "#1e293b", marginBottom: "4px" }}>
                                    {notif.title}
                                  </div>
                                  <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "6px" }}>
                                    {notif.message}
                                  </div>
                                  <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                                    {timeAgo}
                                  </div>
                                </div>
                                {!notif.read && (
                                  <div style={{
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "50%",
                                    background: "#6366f1",
                                    marginTop: "5px"
                                  }}></div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Help Icon */}
            <div style={{ position: "relative" }}>
              <div 
                onClick={() => setShowHelp(!showHelp)}
                style={{ 
                  fontSize: "1.5rem",
                  color: showHelp ? "#6366f1" : "#64748b",
                  cursor: "pointer",
                  transition: "color 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#6366f1"}
                onMouseLeave={(e) => {
                  if (!showHelp) e.currentTarget.style.color = "#64748b";
                }}
                title="Help & Support">
                ❓
              </div>

              {/* Help Dropdown */}
              {showHelp && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 15px)",
                  right: "-20px",
                  width: "320px",
                  background: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                  border: "1px solid #e2e8f0",
                  zIndex: 1000,
                  overflow: "hidden"
                }}>
                  {/* Header */}
                  <div style={{
                    padding: "20px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "#fff"
                  }}>
                    <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>💬</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: "600" }}>
                      Help & Support
                    </div>
                    <div style={{ fontSize: "0.85rem", opacity: 0.9, marginTop: "4px" }}>
                      We're here to help you
                    </div>
                  </div>

                  {/* Help Options */}
                  <div style={{ padding: "10px 0" }}>
                    {/* FAQs */}
                    <div
                      onClick={() => setShowHelp(false)}
                      style={{
                        padding: "15px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        cursor: "pointer",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <span style={{ fontSize: "1.3rem" }}>📖</span>
                      <div>
                        <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "#1e293b" }}>FAQs</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Frequently asked questions</div>
                      </div>
                    </div>

                    {/* Video Tutorials */}
                    <div
                      onClick={() => setShowHelp(false)}
                      style={{
                        padding: "15px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        cursor: "pointer",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <span style={{ fontSize: "1.3rem" }}>🎥</span>
                      <div>
                        <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "#1e293b" }}>Video Tutorials</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Learn how to use the platform</div>
                      </div>
                    </div>

                    {/* User Guide */}
                    <div
                      onClick={() => setShowHelp(false)}
                      style={{
                        padding: "15px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        cursor: "pointer",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <span style={{ fontSize: "1.3rem" }}>📚</span>
                      <div>
                        <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "#1e293b" }}>User Guide</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Complete documentation</div>
                      </div>
                    </div>

                    <div style={{ height: "1px", background: "#e2e8f0", margin: "10px 0" }}></div>

                    {/* Contact Support */}
                    <div
                      onClick={() => setShowHelp(false)}
                      style={{
                        padding: "15px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        cursor: "pointer",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <span style={{ fontSize: "1.3rem" }}>📧</span>
                      <div>
                        <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "#1e293b" }}>Contact Support</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>support@examportal.com</div>
                      </div>
                    </div>

                    {/* Live Chat */}
                    <div
                      onClick={() => setShowHelp(false)}
                      style={{
                        padding: "15px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        cursor: "pointer",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <span style={{ fontSize: "1.3rem" }}>💬</span>
                      <div>
                        <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "#1e293b" }}>Live Chat</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Chat with our team</div>
                      </div>
                    </div>

                    {/* Report a Bug */}
                    <div
                      onClick={() => setShowHelp(false)}
                      style={{
                        padding: "15px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        cursor: "pointer",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <span style={{ fontSize: "1.3rem" }}>🐛</span>
                      <div>
                        <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "#1e293b" }}>Report a Bug</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Help us improve</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div style={{ position: "relative" }}>
              <div
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 15px",
                  background: showUserMenu ? "#f1f5f9" : "transparent",
                  borderRadius: "12px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  border: showUserMenu ? "2px solid #6366f1" : "2px solid transparent"
                }}
                onMouseEnter={(e) => {
                  if (!showUserMenu) e.currentTarget.style.background = "#f8fafc";
                }}
                onMouseLeave={(e) => {
                  if (!showUserMenu) e.currentTarget.style.background = "transparent";
                }}
              >
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "1.2rem",
                  fontWeight: "bold"
                }}>
                  {user.email ? user.email[0].toUpperCase() : "U"}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <div style={{ 
                    color: "#1e293b", 
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    maxWidth: "150px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>
                    {user.displayName || user.email?.split('@')[0] || "User"}
                  </div>
                  <div style={{ 
                    color: "#64748b", 
                    fontSize: "0.75rem"
                  }}>
                    {isAdmin ? "Admin" : "Student"}
                  </div>
                </div>
                <div style={{ 
                  color: "#64748b",
                  fontSize: "0.8rem",
                  transform: showUserMenu ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s"
                }}>
                  ▼
                </div>
              </div>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 10px)",
                  right: "0",
                  width: "280px",
                  background: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                  border: "1px solid #e2e8f0",
                  zIndex: 1000,
                  overflow: "hidden"
                }}>
                  {/* User Info Section */}
                  <div style={{
                    padding: "20px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "#fff"
                  }}>
                    <div style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2rem",
                      fontWeight: "bold",
                      margin: "0 auto 10px"
                    }}>
                      {user.email ? user.email[0].toUpperCase() : "U"}
                    </div>
                    <div style={{ textAlign: "center", fontSize: "1rem", fontWeight: "600", marginBottom: "5px" }}>
                      {user.displayName || user.email?.split('@')[0] || "User"}
                    </div>
                    <div style={{ textAlign: "center", fontSize: "0.85rem", opacity: 0.9 }}>
                      {user.email || user.phoneNumber}
                    </div>
                    {isAdmin && (
                      <div style={{ 
                        textAlign: "center", 
                        fontSize: "0.75rem", 
                        background: "rgba(245, 158, 11, 0.3)",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        marginTop: "8px"
                      }}>
                        👑 Admin Access
                      </div>
                    )}
                  </div>

                  {/* Menu Items */}
                  <div style={{ padding: "10px 0" }}>
                    {/* Profile */}
                    <div
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate("/");
                      }}
                      style={{
                        padding: "12px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        cursor: "pointer",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <span style={{ fontSize: "1.3rem" }}>👤</span>
                      <div>
                        <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "#1e293b" }}>My Profile</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>View and edit profile</div>
                      </div>
                    </div>

                    {/* Dashboard */}
                    <div
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate("/dashboard");
                      }}
                      style={{
                        padding: "12px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        cursor: "pointer",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <span style={{ fontSize: "1.3rem" }}>📊</span>
                      <div>
                        <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "#1e293b" }}>Dashboard</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>View your progress</div>
                      </div>
                    </div>

                    {/* My Tests */}
                    <div
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate("/test");
                      }}
                      style={{
                        padding: "12px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        cursor: "pointer",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <span style={{ fontSize: "1.3rem" }}>📝</span>
                      <div>
                        <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "#1e293b" }}>My Tests</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>View test history</div>
                      </div>
                    </div>

                    {/* Bookmarks */}
                    <div
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate("/bookmarks");
                      }}
                      style={{
                        padding: "12px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        cursor: "pointer",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <span style={{ fontSize: "1.3rem" }}>🔖</span>
                      <div>
                        <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "#1e293b" }}>Bookmarks</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Saved questions</div>
                      </div>
                    </div>

                    <div style={{ height: "1px", background: "#e2e8f0", margin: "10px 0" }}></div>

                    {/* Settings */}
                    <div
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate("/settings");
                      }}
                      style={{
                        padding: "12px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        cursor: "pointer",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <span style={{ fontSize: "1.3rem" }}>⚙️</span>
                      <div>
                        <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "#1e293b" }}>Settings</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Preferences & privacy</div>
                      </div>
                    </div>

                    {/* Help & Support */}
                    <div
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate("/help");
                      }}
                      style={{
                        padding: "12px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        cursor: "pointer",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <span style={{ fontSize: "1.3rem" }}>💬</span>
                      <div>
                        <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "#1e293b" }}>Help & Support</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Get help</div>
                      </div>
                    </div>

                    <div style={{ height: "1px", background: "#e2e8f0", margin: "10px 0" }}></div>

                    {/* Logout */}
                    <div
                      onClick={() => {
                        setShowUserMenu(false);
                        handleLogout();
                      }}
                      style={{
                        padding: "12px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        cursor: "pointer",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#fee2e2"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <span style={{ fontSize: "1.3rem" }}>🚪</span>
                      <div>
                        <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "#ef4444" }}>Logout</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Sign out of account</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Click outside to close menus */}
      {showUserMenu && (
        <div
          onClick={() => setShowUserMenu(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
        />
      )}
      {showNotifications && (
        <div
          onClick={() => setShowNotifications(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
        />
      )}
      {showHelp && (
        <div
          onClick={() => setShowHelp(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
        />
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/help" element={<Help />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route
          path="/admin"
          element={isAdmin ? <Admin /> : <Navigate to="/" />}
        />
        <Route path="/test" element={<Test />} />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <TestSeriesProvider>
      <Router>
        <AppContent />
      </Router>
    </TestSeriesProvider>
  );
}

export default App;