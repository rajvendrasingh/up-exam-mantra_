export default function Footer() {
  return (
    <footer style={{
      background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
      color: "#fff",
      padding: "60px 20px 20px",
      marginTop: "60px"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        {/* Main Footer Content */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "40px",
          marginBottom: "40px"
        }}>
          {/* About Section */}
          <div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginBottom: "15px"
            }}>
              <div style={{
                fontSize: "2rem",
                fontWeight: "800",
                color: "#dc2626"
              }}>
                UP
              </div>
              <div style={{
                fontSize: "1.8rem",
                fontWeight: "700",
                color: "#f59e0b"
              }}>
                EXAM MANTRA
              </div>
            </div>
            <p style={{
              color: "#cbd5e1",
              lineHeight: "1.8",
              fontSize: "0.95rem",
              marginBottom: "20px"
            }}>
              UP Exam Mantra ek dedicated channel hai UPSSSC & UP Government exams ki taiyari ke liye. Yahan milega smart study plan, UPSSSC Lekhpal, VDO, VPO, Junior Assistant, Lower PCS, Stenographer and all exam related content, guidance and updates.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontSize: "1.3rem",
              marginBottom: "20px",
              color: "#f59e0b",
              fontWeight: "600"
            }}>
              Quick Links
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <a href="/" style={{
                color: "#cbd5e1",
                textDecoration: "none",
                fontSize: "0.95rem",
                transition: "color 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#f59e0b"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#cbd5e1"}>
                🏠 Home
              </a>
              <a href="/test" style={{
                color: "#cbd5e1",
                textDecoration: "none",
                fontSize: "0.95rem",
                transition: "color 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#f59e0b"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#cbd5e1"}>
                📝 Mock Tests
              </a>
              <a href="/admin" style={{
                color: "#cbd5e1",
                textDecoration: "none",
                fontSize: "0.95rem",
                transition: "color 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#f59e0b"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#cbd5e1"}>
                👑 Admin Panel
              </a>
            </div>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 style={{
              fontSize: "1.3rem",
              marginBottom: "20px",
              color: "#f59e0b",
              fontWeight: "600"
            }}>
              Connect With Us
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {/* Phone */}
              <a href="tel:7054404700" style={{
                color: "#cbd5e1",
                textDecoration: "none",
                fontSize: "0.95rem",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "color 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#f59e0b"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#cbd5e1"}>
                <span style={{ fontSize: "1.3rem" }}>📞</span>
                <span>7054404700</span>
              </a>

              {/* Email */}
              <a href="mailto:upexammantra@gmail.com" style={{
                color: "#cbd5e1",
                textDecoration: "none",
                fontSize: "0.95rem",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "color 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#f59e0b"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#cbd5e1"}>
                <span style={{ fontSize: "1.3rem" }}>📧</span>
                <span>upexammantra@gmail.com</span>
              </a>

              {/* YouTube */}
              <a href="https://youtube.com/@upexammantra?si=Mnv_TczfH3EM2NEr" target="_blank" rel="noopener noreferrer" style={{
                color: "#cbd5e1",
                textDecoration: "none",
                fontSize: "0.95rem",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "color 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#ff0000"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#cbd5e1"}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>YouTube Channel</span>
              </a>

              {/* Telegram */}
              <a href="https://t.me/upexammantra" target="_blank" rel="noopener noreferrer" style={{
                color: "#cbd5e1",
                textDecoration: "none",
                fontSize: "0.95rem",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "color 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#0088cc"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#cbd5e1"}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.121.099.155.232.171.326.016.094.036.308.02.475z"/>
                </svg>
                <span>Telegram Channel</span>
              </a>
            </div>
          </div>
        </div>

        {/* Social Media Buttons */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          padding: "30px 0",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          marginBottom: "30px"
        }}>
          <a href="https://youtube.com/@upexammantra?si=Mnv_TczfH3EM2NEr" target="_blank" rel="noopener noreferrer" style={{
            width: "55px",
            height: "55px",
            borderRadius: "50%",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            transition: "transform 0.2s, box-shadow 0.2s",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(255,0,0,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FF0000"/>
            </svg>
          </a>
          <a href="https://t.me/upexammantra" target="_blank" rel="noopener noreferrer" style={{
            width: "55px",
            height: "55px",
            borderRadius: "50%",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            transition: "transform 0.2s, box-shadow 0.2s",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,136,204,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.121.099.155.232.171.326.016.094.036.308.02.475z" fill="#0088cc"/>
            </svg>
          </a>
          <a href="tel:7054404700" style={{
            width: "55px",
            height: "55px",
            borderRadius: "50%",
            background: "#10b981",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.8rem",
            textDecoration: "none",
            transition: "transform 0.2s, box-shadow 0.2s",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(16,185,129,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
          }}>
            📞
          </a>
          <a href="mailto:upexammantra@gmail.com" style={{
            width: "55px",
            height: "55px",
            borderRadius: "50%",
            background: "#f59e0b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.8rem",
            textDecoration: "none",
            transition: "transform 0.2s, box-shadow 0.2s",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(245,158,11,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
          }}>
            📧
          </a>
        </div>

        {/* Copyright */}
        <div style={{
          textAlign: "center",
          color: "#94a3b8",
          fontSize: "0.9rem"
        }}>
          <p style={{ margin: "0 0 10px 0" }}>
            © {new Date().getFullYear()} UP Exam Mantra. All rights reserved.
          </p>
          <p style={{ 
            margin: "0",
            color: "#cbd5e1",
            fontSize: "0.95rem"
          }}>
            Created with ❤️ by <span style={{ 
              color: "#f59e0b", 
              fontWeight: "600" 
            }}>Rajvendra Singh</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
