import { useState } from "react";
import { auth } from "./firebase";
import { updateProfile, updatePassword, updateEmail } from "firebase/auth";

export default function Settings() {
  const user = auth.currentUser;
  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await updateProfile(user, {
        displayName: name
      });
      setSuccess("Profile updated successfully!");
    } catch (error) {
      setError("Failed to update profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }

    setLoading(true);

    try {
      await updatePassword(user, newPassword);
      setSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (error.code === "auth/requires-recent-login") {
        setError("Please logout and login again to change password.");
      } else {
        setError("Failed to update password: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: "900px",
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
        <div style={{ fontSize: "3rem", marginBottom: "10px" }}>⚙️</div>
        <h1 style={{ margin: "0 0 10px 0", fontSize: "2.5rem" }}>
          Settings
        </h1>
        <p style={{ margin: 0, fontSize: "1.1rem", opacity: 0.9 }}>
          Manage your account preferences
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div style={{
          padding: "15px",
          background: "#dcfce7",
          color: "#166534",
          borderRadius: "12px",
          marginBottom: "20px",
          fontWeight: "500"
        }}>
          ✅ {success}
        </div>
      )}

      {error && (
        <div style={{
          padding: "15px",
          background: "#fee2e2",
          color: "#991b1b",
          borderRadius: "12px",
          marginBottom: "20px",
          fontWeight: "500"
        }}>
          ❌ {error}
        </div>
      )}

      {/* Profile Settings */}
      <div style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
        marginBottom: "25px"
      }}>
        <h2 style={{ margin: "0 0 25px 0", color: "#1e293b" }}>
          Profile Information
        </h2>
        <form onSubmit={handleUpdateProfile}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              color: "#1e293b", 
              fontWeight: "600" 
            }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "2px solid #e2e8f0",
                fontSize: "1rem",
                outline: "none"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              color: "#1e293b", 
              fontWeight: "600" 
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              disabled
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "2px solid #e2e8f0",
                fontSize: "1rem",
                background: "#f8fafc",
                color: "#64748b"
              }}
            />
            <div style={{ 
              fontSize: "0.85rem", 
              color: "#64748b", 
              marginTop: "5px" 
            }}>
              Email cannot be changed
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px 30px",
              background: loading ? "#94a3b8" : "#667eea",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>

      {/* Password Settings */}
      <div style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
        marginBottom: "25px"
      }}>
        <h2 style={{ margin: "0 0 25px 0", color: "#1e293b" }}>
          Change Password
        </h2>
        <form onSubmit={handleUpdatePassword}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              color: "#1e293b", 
              fontWeight: "600" 
            }}>
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "2px solid #e2e8f0",
                fontSize: "1rem",
                outline: "none"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              color: "#1e293b", 
              fontWeight: "600" 
            }}>
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "2px solid #e2e8f0",
                fontSize: "1rem",
                outline: "none"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px 30px",
              background: loading ? "#94a3b8" : "#f59e0b",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>

      {/* Preferences */}
      <div style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
      }}>
        <h2 style={{ margin: "0 0 25px 0", color: "#1e293b" }}>
          Preferences
        </h2>
        
        <div style={{
          padding: "20px",
          background: "#f8fafc",
          borderRadius: "12px",
          marginBottom: "15px"
        }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center" 
          }}>
            <div>
              <div style={{ fontWeight: "600", color: "#1e293b", marginBottom: "5px" }}>
                Email Notifications
              </div>
              <div style={{ fontSize: "0.9rem", color: "#64748b" }}>
                Receive updates about new tests and results
              </div>
            </div>
            <label style={{ position: "relative", display: "inline-block", width: "60px", height: "34px" }}>
              <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{
                position: "absolute",
                cursor: "pointer",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "#10b981",
                borderRadius: "34px",
                transition: "0.4s"
              }}></span>
            </label>
          </div>
        </div>

        <div style={{
          padding: "20px",
          background: "#f8fafc",
          borderRadius: "12px"
        }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center" 
          }}>
            <div>
              <div style={{ fontWeight: "600", color: "#1e293b", marginBottom: "5px" }}>
                Show Test Timer
              </div>
              <div style={{ fontSize: "0.9rem", color: "#64748b" }}>
                Display countdown timer during tests
              </div>
            </div>
            <label style={{ position: "relative", display: "inline-block", width: "60px", height: "34px" }}>
              <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{
                position: "absolute",
                cursor: "pointer",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "#10b981",
                borderRadius: "34px",
                transition: "0.4s"
              }}></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
