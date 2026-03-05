import { useState, useContext, useEffect } from "react";
import { auth, db } from "./firebase";
import { updateProfile, updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { TestSeriesContext } from "./TestSeriesContext";

export default function Settings() {
  const user = auth.currentUser;
  const { userProfile, setUserProfile } = useContext(TestSeriesContext);
  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [photoURL, setPhotoURL] = useState(userProfile.photoURL || user?.photoURL || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Load user profile data
  useEffect(() => {
    if (userProfile.name) {
      setName(userProfile.name);
    }
    if (userProfile.photoURL) {
      setPhotoURL(userProfile.photoURL);
    }
  }, [userProfile]);

  // Handle photo upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size should be less than 2MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file");
      return;
    }

    setUploadingPhoto(true);
    setError("");

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        
        try {
          // Update Firebase Auth profile
          await updateProfile(user, {
            photoURL: base64String
          });
          
          // Update Firestore user document
          if (user?.uid) {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
              photoURL: base64String,
              updatedAt: new Date().toISOString()
            });
            
            // Update local context
            setUserProfile({
              ...userProfile,
              photoURL: base64String
            });
            
            setPhotoURL(base64String);
            setSuccess("Profile photo updated successfully!");
          }
        } catch (error) {
          setError("Failed to update photo: " + error.message);
        } finally {
          setUploadingPhoto(false);
        }
      };
      
      reader.onerror = () => {
        setError("Failed to read image file");
        setUploadingPhoto(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      setError("Failed to upload photo: " + error.message);
      setUploadingPhoto(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: name
      });
      
      // Update Firestore user document
      if (user?.uid) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          name: name,
          updatedAt: new Date().toISOString()
        });
        
        // Update local context
        setUserProfile({
          ...userProfile,
          name: name
        });
      }
      
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

      {/* User Stats Overview */}
      <div style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
        marginBottom: "25px"
      }}>
        <h2 style={{ margin: "0 0 25px 0", color: "#1e293b" }}>
          📊 Your Statistics
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px"
        }}>
          <div style={{
            padding: "20px",
            background: "#f8fafc",
            borderRadius: "12px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📝</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#667eea" }}>
              {userProfile.totalTests || 0}
            </div>
            <div style={{ fontSize: "0.9rem", color: "#64748b", marginTop: "5px" }}>
              Tests Completed
            </div>
          </div>
          <div style={{
            padding: "20px",
            background: "#f8fafc",
            borderRadius: "12px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>⭐</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#f59e0b" }}>
              {userProfile.averageScore?.toFixed(2) || 0}
            </div>
            <div style={{ fontSize: "0.9rem", color: "#64748b", marginTop: "5px" }}>
              Average Score
            </div>
          </div>
          <div style={{
            padding: "20px",
            background: "#f8fafc",
            borderRadius: "12px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🏆</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#10b981" }}>
              {userProfile.bestScore?.toFixed(2) || 0}
            </div>
            <div style={{ fontSize: "0.9rem", color: "#64748b", marginTop: "5px" }}>
              Best Score
            </div>
          </div>
          <div style={{
            padding: "20px",
            background: "#f8fafc",
            borderRadius: "12px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>💯</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#ef4444" }}>
              {userProfile.totalScore?.toFixed(2) || 0}
            </div>
            <div style={{ fontSize: "0.9rem", color: "#64748b", marginTop: "5px" }}>
              Total Score
            </div>
          </div>
        </div>
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

      {/* Profile Photo Section */}
      <div style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
        marginBottom: "25px"
      }}>
        <h2 style={{ margin: "0 0 25px 0", color: "#1e293b" }}>
          📸 Profile Photo
        </h2>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "30px",
          flexWrap: "wrap"
        }}>
          {/* Current Photo */}
          <div style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "4px solid #667eea",
            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: photoURL ? "transparent" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          }}>
            {photoURL ? (
              <img 
                src={photoURL} 
                alt="Profile" 
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            ) : (
              <div style={{
                fontSize: "4rem",
                color: "#fff",
                fontWeight: "bold"
              }}>
                {user?.email ? user.email[0].toUpperCase() : "U"}
              </div>
            )}
          </div>

          {/* Upload Button */}
          <div style={{ flex: 1, minWidth: "250px" }}>
            <div style={{
              marginBottom: "15px",
              color: "#64748b",
              fontSize: "0.95rem"
            }}>
              Upload a new profile photo. Max size: 2MB
            </div>
            <label style={{
              display: "inline-block",
              padding: "12px 24px",
              background: uploadingPhoto ? "#94a3b8" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              borderRadius: "10px",
              fontWeight: "600",
              cursor: uploadingPhoto ? "not-allowed" : "pointer",
              transition: "all 0.3s"
            }}>
              {uploadingPhoto ? "Uploading..." : "📸 Choose Photo"}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploadingPhoto}
                style={{ display: "none" }}
              />
            </label>
            {photoURL && (
              <button
                onClick={async () => {
                  if (window.confirm("Remove profile photo?")) {
                    try {
                      await updateProfile(user, { photoURL: "" });
                      if (user?.uid) {
                        const userRef = doc(db, "users", user.uid);
                        await updateDoc(userRef, {
                          photoURL: "",
                          updatedAt: new Date().toISOString()
                        });
                      }
                      setPhotoURL("");
                      setUserProfile({ ...userProfile, photoURL: "" });
                      setSuccess("Profile photo removed!");
                    } catch (err) {
                      setError("Failed to remove photo");
                    }
                  }
                }}
                style={{
                  marginLeft: "10px",
                  padding: "12px 24px",
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                🗑️ Remove
              </button>
            )}
          </div>
        </div>
      </div>

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
