export default function Help() {
  return (
    <div style={{
      maxWidth: "1200px",
      margin: "40px auto",
      padding: "20px"
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "20px",
        padding: "40px",
        color: "#fff",
        marginBottom: "30px",
        textAlign: "center"
      }}>
        <div style={{ fontSize: "4rem", marginBottom: "15px" }}>💬</div>
        <h1 style={{ margin: "0 0 10px 0", fontSize: "2.5rem" }}>
          Help & Support
        </h1>
        <p style={{ margin: 0, fontSize: "1.1rem", opacity: 0.9 }}>
          We're here to help you succeed!
        </p>
      </div>

      {/* Contact Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "25px",
        marginBottom: "40px"
      }}>
        {/* Phone */}
        <a href="tel:7054404700" style={{
          background: "#fff",
          borderRadius: "15px",
          padding: "30px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          textDecoration: "none",
          transition: "transform 0.2s, box-shadow 0.2s",
          cursor: "pointer"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.08)";
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "15px" }}>📞</div>
          <h3 style={{ margin: "0 0 10px 0", color: "#1e293b" }}>Call Us</h3>
          <p style={{ color: "#64748b", margin: "0 0 15px 0" }}>
            Speak directly with our support team
          </p>
          <div style={{ 
            fontSize: "1.3rem", 
            fontWeight: "bold", 
            color: "#10b981" 
          }}>
            7054404700
          </div>
        </a>

        {/* Email */}
        <a href="mailto:upexammantra@gmail.com" style={{
          background: "#fff",
          borderRadius: "15px",
          padding: "30px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          textDecoration: "none",
          transition: "transform 0.2s, box-shadow 0.2s",
          cursor: "pointer"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.08)";
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "15px" }}>📧</div>
          <h3 style={{ margin: "0 0 10px 0", color: "#1e293b" }}>Email Us</h3>
          <p style={{ color: "#64748b", margin: "0 0 15px 0" }}>
            Send us your queries anytime
          </p>
          <div style={{ 
            fontSize: "1.1rem", 
            fontWeight: "600", 
            color: "#f59e0b",
            wordBreak: "break-all"
          }}>
            upexammantra@gmail.com
          </div>
        </a>

        {/* YouTube */}
        <a href="https://youtube.com/@upexammantra?si=Mnv_TczfH3EM2NEr" target="_blank" rel="noopener noreferrer" style={{
          background: "#fff",
          borderRadius: "15px",
          padding: "30px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          textDecoration: "none",
          transition: "transform 0.2s, box-shadow 0.2s",
          cursor: "pointer"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.08)";
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "15px" }}>📺</div>
          <h3 style={{ margin: "0 0 10px 0", color: "#1e293b" }}>YouTube Channel</h3>
          <p style={{ color: "#64748b", margin: "0 0 15px 0" }}>
            Watch tutorials and study materials
          </p>
          <div style={{ 
            fontSize: "1.1rem", 
            fontWeight: "600", 
            color: "#ff0000" 
          }}>
            @upexammantra
          </div>
        </a>

        {/* Telegram */}
        <a href="https://t.me/upexammantra" target="_blank" rel="noopener noreferrer" style={{
          background: "#fff",
          borderRadius: "15px",
          padding: "30px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          textDecoration: "none",
          transition: "transform 0.2s, box-shadow 0.2s",
          cursor: "pointer"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.08)";
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "15px" }}>✈️</div>
          <h3 style={{ margin: "0 0 10px 0", color: "#1e293b" }}>Telegram Channel</h3>
          <p style={{ color: "#64748b", margin: "0 0 15px 0" }}>
            Join our community for updates
          </p>
          <div style={{ 
            fontSize: "1.1rem", 
            fontWeight: "600", 
            color: "#0088cc" 
          }}>
            t.me/upexammantra
          </div>
        </a>
      </div>

      {/* FAQs */}
      <div style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "40px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
      }}>
        <h2 style={{ margin: "0 0 30px 0", color: "#1e293b", textAlign: "center" }}>
          Frequently Asked Questions
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {[
            {
              q: "How do I start a test?",
              a: "Go to the Mocktest page, select a subject or test series, read the instructions, and click 'Start Test'."
            },
            {
              q: "Can I pause a test?",
              a: "No, once you start a test, you need to complete it. However, you can skip questions and come back to them later."
            },
            {
              q: "How is scoring calculated?",
              a: "Each correct answer gives you marks (usually 1 mark). Wrong answers may have negative marking (usually -0.25). Unattempted questions get 0 marks."
            },
            {
              q: "Can I review my answers after submission?",
              a: "Yes! After completing a test, you can click 'Review Answers' to see all questions with correct answers highlighted."
            },
            {
              q: "How do I see my progress?",
              a: "Visit the Dashboard to see your test history, average score, best score, and overall performance."
            },
            {
              q: "Are new tests added regularly?",
              a: "Yes! Our admin team regularly adds new subjects and test series. Check back often for updates."
            }
          ].map((faq, idx) => (
            <div key={idx} style={{
              padding: "25px",
              background: "#f8fafc",
              borderRadius: "12px",
              borderLeft: "4px solid #667eea"
            }}>
              <h3 style={{ 
                margin: "0 0 10px 0", 
                color: "#1e293b",
                fontSize: "1.1rem"
              }}>
                {faq.q}
              </h3>
              <p style={{ 
                margin: 0, 
                color: "#64748b",
                lineHeight: "1.6"
              }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
