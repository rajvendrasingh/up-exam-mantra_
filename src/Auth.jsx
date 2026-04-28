import { useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export default function Auth({ onAuthSuccess, onAdminClick, showAdminLogin, setShowAdminLogin, adminUsername, setAdminUsername, adminPassword, setAdminPassword, handleAdminLogin }) {
  const [mode, setMode] = useState("login"); // "login", "signup", "forgot"
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Email/Password Signup
  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }

    setLoading(true);

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        role: "student",
        totalTests: 0,
        totalScore: 0,
        averageScore: 0,
        bestScore: 0,
        badges: []
      });

      console.log("✅ User document created in Firestore");
      setSuccess("Account created successfully!");
      setTimeout(() => onAuthSuccess(user), 1000);
    } catch (error) {
      console.error("Signup error:", error);
      if (error.code === "auth/email-already-in-use") {
        setError("Email already registered!");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address!");
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if user document exists, if not create it
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
          // Create user document if it doesn't exist
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            name: user.displayName || user.email.split('@')[0],
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            role: "student",
            totalTests: 0,
            totalScore: 0,
            averageScore: 0,
            bestScore: 0,
            badges: []
          });
          console.log("✅ User document created on login");
        } else {
          // Update last login time
          await setDoc(userDocRef, {
            lastLogin: new Date().toISOString()
          }, { merge: true });
          console.log("✅ Last login updated");
        }
      } catch (docError) {
        console.error("Error checking/creating user document:", docError);
        // Don't fail login if document creation fails
      }
      
      setSuccess("Login successful!");
      setTimeout(() => onAuthSuccess(user), 500);
    } catch (error) {
      console.error("Login error:", error);
      if (error.code === "auth/user-not-found") {
        setError("No account found with this email!");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password!");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address!");
      } else if (error.code === "auth/invalid-credential") {
        setError("Invalid email or password!");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email address!");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset email sent! Check your inbox.");
    } catch (error) {
      console.error("Password reset error:", error);
      if (error.code === "auth/user-not-found") {
        setError("No account found with this email!");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address!");
      } else {
        setError("Failed to send reset email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    setError(""); setSuccess(""); setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid, name: user.displayName || "User",
          email: user.email, photoURL: user.photoURL || "",
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          role: "student", totalTests: 0, totalScore: 0,
          averageScore: 0, bestScore: 0, badges: []
        });
      } else {
        await setDoc(userDocRef, { lastLogin: new Date().toISOString() }, { merge: true });
      }
      setSuccess("Google Sign-In successful!");
      setTimeout(() => onAuthSuccess(user), 500);
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") setError("Sign-in cancelled.");
      else if (err.code === "auth/popup-blocked") setError("Popup blocked! Please allow popups.");
      else if (err.code === "auth/unauthorized-domain") setError("Domain not authorized.");
      else setError("Google Sign-In failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        maxWidth: "450px",
        width: "100%",
        background: "#fff",
        borderRadius: "20px",
        padding: "40px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
      }}>
        {/* Logo/Title */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ 
            fontSize: "2.5rem", 
            margin: "0 0 10px 0",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "800"
          }}>
            UP Exam Mantra
          </h1>
          <p style={{ color: "#64748b", margin: 0 }}>
            {mode === "login" ? "Welcome back!" : mode === "signup" ? "Create your account" : "Reset your password"}
          </p>
        </div>

        {/* Admin Login Button - Always visible */}
        <button
          onClick={() => setShowAdminLogin(true)}
          style={{
            width: "100%",
            padding: "14px",
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            marginBottom: "20px",
            boxShadow: "0 4px 15px rgba(245, 158, 11, 0.4)"
          }}
        >
          🔐 Admin Login
        </button>

        {/* Tabs */}
        {mode !== "forgot" && (
          <div style={{
            display: "flex",
            gap: "10px",
            marginBottom: "30px",
            background: "#f1f5f9",
            padding: "5px",
            borderRadius: "12px"
          }}>
            <button
              onClick={() => setMode("login")}
              style={{
                flex: 1,
                padding: "12px",
                background: mode === "login" ? "#667eea" : "transparent",
                color: mode === "login" ? "#fff" : "#64748b",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
            >
              Login
            </button>
            <button
              onClick={() => setMode("signup")}
              style={{
                flex: 1,
                padding: "12px",
                background: mode === "signup" ? "#667eea" : "transparent",
                color: mode === "signup" ? "#fff" : "#64748b",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Error/Success Messages */}
        {error && (
          <div style={{
            padding: "12px",
            background: "#fee2e2",
            color: "#991b1b",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "0.9rem",
            fontWeight: "500"
          }}>
            ❌ {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: "12px",
            background: "#dcfce7",
            color: "#166534",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "0.9rem",
            fontWeight: "500"
          }}>
            ✅ {success}
          </div>
        )}

        {/* Forms */}
        {mode === "forgot" ? (
          // Forgot Password Form
          <form onSubmit={handleForgotPassword}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#1e293b", fontWeight: "600" }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
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
                width: "100%",
                padding: "14px",
                background: loading ? "#94a3b8" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
                marginBottom: "15px"
              }}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <button
              type="button"
              onClick={() => setMode("login")}
              style={{
                width: "100%",
                padding: "12px",
                background: "transparent",
                color: "#667eea",
                border: "none",
                fontSize: "0.95rem",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              ← Back to Login
            </button>
          </form>
        ) : (
          // Email Auth Form
          <form onSubmit={mode === "login" ? handleEmailLogin : handleEmailSignup}>
            {mode === "signup" && (
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#1e293b", fontWeight: "600" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
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
            )}

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#1e293b", fontWeight: "600" }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
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

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#1e293b", fontWeight: "600" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
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

            {mode === "signup" && (
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#1e293b", fontWeight: "600" }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  required
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
            )}

            {mode === "login" && (
              <div style={{ textAlign: "right", marginBottom: "20px" }}>
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#667eea",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: loading ? "#94a3b8" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
              }}
            >
              {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
            </button>

            {/* OR Divider */}
            <div style={{ display: "flex", alignItems: "center", margin: "20px 0", color: "#94a3b8", fontSize: "0.9rem" }}>
              <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }}></div>
              <span style={{ padding: "0 15px" }}>OR</span>
              <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }}></div>
            </div>

            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              style={{
                width: "100%", padding: "14px", background: "#fff", color: "#1e293b",
                border: "2px solid #e2e8f0", borderRadius: "10px", fontSize: "1rem",
                fontWeight: "600", cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                transition: "all 0.3s"
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </form>
        )}
      </div>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "40px",
            maxWidth: "400px",
            width: "90%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
          }}>
            <h2 style={{ 
              color: "#f59e0b", 
              marginBottom: "10px",
              fontSize: "1.8rem"
            }}>
              🔐 Admin Login
            </h2>
            <p style={{ color: "#64748b", marginBottom: "25px", fontSize: "0.9rem" }}>
              Enter admin credentials to access dashboard
            </p>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#1e293b", fontWeight: "600" }}>
                Username
              </label>
              <input
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="Enter username"
                onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
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

            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#1e293b", fontWeight: "600" }}>
                Password
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter password"
                onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
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

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleAdminLogin}
                style={{
                  flex: 1,
                  padding: "14px",
                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "1rem"
                }}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setShowAdminLogin(false);
                  setAdminUsername("");
                  setAdminPassword("");
                }}
                style={{
                  flex: 1,
                  padding: "14px",
                  background: "#e2e8f0",
                  color: "#64748b",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "1rem"
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
