import { useState, useEffect } from "react";
import { getAllUsers } from "../services/firestoreService";

export default function Footer() {
  const [totalUsers, setTotalUsers] = useState(null);

  useEffect(() => {
    getAllUsers().then(users => setTotalUsers(users.length)).catch(() => {});
  }, []);

  return (
    <footer style={{
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
      color: "#fff",
      padding: "70px 20px 0",
      marginTop: "60px"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Top CTA Banner */}
        <div style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "16px", padding: "30px 40px", marginBottom: "60px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "20px"
        }}>
          <div>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "1.4rem", fontWeight: "700" }}>
              📢 Free Mock Tests ke liye Join Karo!
            </h3>
            <p style={{ margin: 0, opacity: 0.9, fontSize: "0.95rem" }}>
              Telegram channel join karo — latest updates, free PDFs aur mock tests bilkul free
            </p>
          </div>
          <a href="https://t.me/upexammantra" target="_blank" rel="noopener noreferrer"
            style={{ padding: "12px 28px", background: "#fff", color: "#667eea", borderRadius: "10px", textDecoration: "none", fontWeight: "700", fontSize: "1rem", whiteSpace: "nowrap", transition: "transform 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
            Join Now ✈️
          </a>
        </div>

        {/* Main 4-column Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "40px", marginBottom: "50px" }}>

          {/* Column 1 - About */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
              <div style={{ fontSize: "2rem", fontWeight: "800", color: "#dc2626" }}>UP</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#f59e0b" }}>EXAM MANTRA</div>
            </div>
            <p style={{ color: "#94a3b8", lineHeight: "1.8", fontSize: "0.9rem", marginBottom: "20px" }}>
              UP Exam Mantra ek free platform hai UPSSSC &amp; UP Government exams ki taiyari ke liye.
              UPSSSC Lekhpal, VDO, UP Police, UPTET aur sabhi UP sarkari pariksha ke liye
              free mock tests, latest pattern questions aur detailed solutions milenge.
            </p>
            {/* Total Users Count */}
            {totalUsers !== null && (
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "10px",
                background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
                borderRadius: "10px", padding: "10px 16px", marginBottom: "18px"
              }}>
                <span style={{ fontSize: "1.4rem" }}>👥</span>
                <div>
                  <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "#818cf8" }}>{totalUsers.toLocaleString()}</div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Registered Students</div>
                </div>
              </div>
            )}

            {/* Social Icons */}
            <div style={{ display: "flex", gap: "12px" }}>
              <a href="https://youtube.com/@upexammantra?si=Mnv_TczfH3EM2NEr" target="_blank" rel="noopener noreferrer"
                style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#ff0000"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://t.me/upexammantra" target="_blank" rel="noopener noreferrer"
                style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#0088cc"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.121.099.155.232.171.326.016.094.036.308.02.475z"/></svg>
              </a>
              <a href="mailto:upexammantra@gmail.com"
                style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f59e0b"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 style={{ fontSize: "1.1rem", marginBottom: "20px", color: "#f59e0b", fontWeight: "700", borderBottom: "2px solid rgba(245,158,11,0.3)", paddingBottom: "10px" }}>
              Quick Links
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { href: "/", label: "🏠 Home" },
                { href: "/test", label: "📝 Mock Tests" },
                { href: "/leaderboard", label: "🏆 Leaderboard" },
                { href: "/dashboard", label: "📊 Dashboard" },
                { href: "/attempted-tests", label: "📋 Attempted Tests" },
                { href: "/bookmarks", label: "🔖 Bookmarks" },
                { href: "/help", label: "💬 Help & Support" },
                { href: "/settings", label: "⚙️ Settings" },
              ].map(({ href, label }) => (
                <a key={href} href={href}
                  style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#f59e0b"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}>
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3 - Exams Covered */}
          <div>
            <h4 style={{ fontSize: "1.1rem", marginBottom: "20px", color: "#f59e0b", fontWeight: "700", borderBottom: "2px solid rgba(245,158,11,0.3)", paddingBottom: "10px" }}>
              Exams Covered
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                "📌 UPSSSC PET",
                "📌 UPSSSC Lekhpal",
                "📌 UPSSSC VDO / VPO",
                "📌 UPSSSC Junior Assistant",
                "📌 UP Police Constable",
                "📌 UP Police SI",
                "📌 UP Lower PCS",
                "📌 UP Stenographer",
                "📌 UPTET / CTET",
                "📌 UP B.Ed Entrance",
              ].map((exam) => (
                <div key={exam} style={{ color: "#94a3b8", fontSize: "0.9rem" }}>{exam}</div>
              ))}
            </div>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h4 style={{ fontSize: "1.1rem", marginBottom: "20px", color: "#f59e0b", fontWeight: "700", borderBottom: "2px solid rgba(245,158,11,0.3)", paddingBottom: "10px" }}>
              Contact Us
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                </div>
                <div>
                  <div style={{ color: "#64748b", fontSize: "0.78rem", marginBottom: "3px" }}>Email</div>
                  <a href="mailto:upexammantra@gmail.com" style={{ color: "#cbd5e1", textDecoration: "none", fontSize: "0.88rem" }}>upexammantra@gmail.com</a>
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(0,136,204,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#0088cc"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.121.099.155.232.171.326.016.094.036.308.02.475z"/></svg>
                </div>
                <div>
                  <div style={{ color: "#64748b", fontSize: "0.78rem", marginBottom: "3px" }}>Telegram</div>
                  <a href="https://t.me/upexammantra" target="_blank" rel="noopener noreferrer" style={{ color: "#cbd5e1", textDecoration: "none", fontSize: "0.88rem" }}>t.me/upexammantra</a>
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(255,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </div>
                <div>
                  <div style={{ color: "#64748b", fontSize: "0.78rem", marginBottom: "3px" }}>YouTube</div>
                  <a href="https://youtube.com/@upexammantra?si=Mnv_TczfH3EM2NEr" target="_blank" rel="noopener noreferrer" style={{ color: "#cbd5e1", textDecoration: "none", fontSize: "0.88rem" }}>youtube.com/@upexammantra</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Keywords Strip */}
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "18px 24px", marginBottom: "40px", textAlign: "center" }}>
          <p style={{ margin: 0, color: "#475569", fontSize: "0.82rem", lineHeight: "1.9" }}>
            UPSSSC Mock Test &nbsp;|&nbsp; UP Police Mock Test &nbsp;|&nbsp; UP Lekhpal Mock Test &nbsp;|&nbsp;
            UPTET Mock Test &nbsp;|&nbsp; UP Lower PCS &nbsp;|&nbsp; UPSSSC PET &nbsp;|&nbsp;
            Free Online Test Series &nbsp;|&nbsp; UP Sarkari Naukri Preparation &nbsp;|&nbsp;
            UPSSSC VDO Mock Test &nbsp;|&nbsp; UP Stenographer Test
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", marginBottom: "30px" }} />

        {/* Developer Credit - Center */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.3)",
            borderRadius: "50px",
            padding: "10px 30px"
          }}>
            <span style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Developed by </span>
            <span style={{ color: "#f59e0b", fontWeight: "700", fontSize: "1rem" }}>Rajvendra Singh</span>
          </div>
        </div>

        {/* Copyright Bottom */}
        <div style={{ textAlign: "center", paddingBottom: "30px" }}>
          <p style={{ margin: 0, color: "#475569", fontSize: "0.82rem" }}>
            &copy; {new Date().getFullYear()} UP Exam Mantra. All rights reserved. &nbsp;|&nbsp;
            UPSSC, UP Police, Lekhpal, UPTET &amp; All UP Govt Exams Free Mock Tests
          </p>
        </div>

      </div>
    </footer>
  );
}
