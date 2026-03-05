import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }}>
      {/* Header with Login/Signup */}
      <header style={{
        background: "rgba(255,255,255,0.95)",
        padding: "15px 0",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <div style={{
              fontSize: "1.8rem",
              fontWeight: "800",
              color: "#dc2626"
            }}>UP</div>
            <div style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              background: "linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>EXAM MANTRA</div>
          </div>
          
          <div style={{ display: "flex", gap: "15px" }}>
            <button
              onClick={() => navigate("/auth")}
              style={{
                padding: "10px 25px",
                background: "transparent",
                color: "#667eea",
                border: "2px solid #667eea",
                borderRadius: "10px",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "1rem"
              }}
            >
              Login
            </button>
            <button
              onClick={() => navigate("/auth")}
              style={{
                padding: "10px 25px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "1rem",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)"
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: "60px 20px",
        textAlign: "center",
        color: "#fff"
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h1 style={{
            fontSize: "3rem",
            fontWeight: "800",
            marginBottom: "20px",
            lineHeight: "1.2"
          }}>
            उत्तर प्रदेश की सभी प्रतियोगी परीक्षाओं की तैयारी के लिए
          </h1>
          <p style={{
            fontSize: "1.3rem",
            marginBottom: "30px",
            opacity: 0.95
          }}>
            UPSSC, UP Police, UP Lekhpal, UPTET और अन्य सभी UP सरकारी परीक्षाओं के लिए Free Mock Tests
          </p>
          <button
            onClick={() => navigate("/auth")}
            style={{
              padding: "18px 40px",
              background: "#fff",
              color: "#667eea",
              border: "none",
              borderRadius: "12px",
              fontSize: "1.2rem",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 8px 25px rgba(0,0,0,0.2)"
            }}
          >
            अभी शुरू करें - Free में
          </button>
        </div>
      </section>

      {/* Main Content */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 20px"
      }}>
        {/* Exams Grid */}
        <section style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "40px",
          marginBottom: "40px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{
            fontSize: "2.5rem",
            color: "#1e293b",
            marginBottom: "30px",
            textAlign: "center"
          }}>
            हम किन परीक्षाओं के लिए Mock Tests प्रदान करते हैं
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "25px",
            marginBottom: "40px"
          }}>
            {/* UPSSC */}
            <div style={{
              padding: "30px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "15px",
              color: "#fff"
            }}>
              <h3 style={{ fontSize: "1.8rem", marginBottom: "15px" }}>📚 UPSSC</h3>
              <p style={{ fontSize: "1rem", lineHeight: "1.6", marginBottom: "15px" }}>
                उत्तर प्रदेश अधीनस्थ सेवा चयन आयोग (UPSSC) की सभी परीक्षाओं के लिए Mock Tests:
              </p>
              <ul style={{ fontSize: "0.95rem", lineHeight: "1.8", paddingLeft: "20px" }}>
                <li>UPSSC PET (Preliminary Eligibility Test)</li>
                <li>UPSSC VDO (Village Development Officer)</li>
                <li>UPSSC Junior Assistant</li>
                <li>UPSSC Forest Guard</li>
                <li>UPSSC Revenue Inspector</li>
              </ul>
            </div>

            {/* UP Police */}
            <div style={{
              padding: "30px",
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              borderRadius: "15px",
              color: "#fff"
            }}>
              <h3 style={{ fontSize: "1.8rem", marginBottom: "15px" }}>👮 UP Police</h3>
              <p style={{ fontSize: "1rem", lineHeight: "1.6", marginBottom: "15px" }}>
                उत्तर प्रदेश पुलिस भर्ती की सभी परीक्षाओं के लिए Mock Tests:
              </p>
              <ul style={{ fontSize: "0.95rem", lineHeight: "1.8", paddingLeft: "20px" }}>
                <li>UP Police Constable</li>
                <li>UP Police SI (Sub Inspector)</li>
                <li>UP Police Head Constable</li>
                <li>UP Police Fireman</li>
                <li>UP Police Computer Operator</li>
              </ul>
            </div>

            {/* UP Lekhpal */}
            <div style={{
              padding: "30px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              borderRadius: "15px",
              color: "#fff"
            }}>
              <h3 style={{ fontSize: "1.8rem", marginBottom: "15px" }}>✍️ UP Lekhpal</h3>
              <p style={{ fontSize: "1rem", lineHeight: "1.6", marginBottom: "15px" }}>
                उत्तर प्रदेश लेखपाल परीक्षा की पूर्ण तैयारी:
              </p>
              <ul style={{ fontSize: "0.95rem", lineHeight: "1.8", paddingLeft: "20px" }}>
                <li>General Hindi (सामान्य हिंदी)</li>
                <li>Village Society & Development (ग्राम समाज)</li>
                <li>Arithmetic (अंकगणित)</li>
                <li>General Knowledge (सामान्य ज्ञान)</li>
                <li>Previous Year Papers</li>
              </ul>
            </div>
          </div>

          {/* More Exams */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px"
          }}>
            <div style={{
              padding: "25px",
              background: "#f8fafc",
              borderRadius: "12px",
              border: "2px solid #e2e8f0"
            }}>
              <h4 style={{ fontSize: "1.3rem", color: "#1e293b", marginBottom: "10px" }}>
                🎓 UPTET
              </h4>
              <p style={{ fontSize: "0.95rem", color: "#64748b" }}>
                उत्तर प्रदेश शिक्षक पात्रता परीक्षा - Paper 1 & Paper 2
              </p>
            </div>

            <div style={{
              padding: "25px",
              background: "#f8fafc",
              borderRadius: "12px",
              border: "2px solid #e2e8f0"
            }}>
              <h4 style={{ fontSize: "1.3rem", color: "#1e293b", marginBottom: "10px" }}>
                🏛️ UPPSC
              </h4>
              <p style={{ fontSize: "0.95rem", color: "#64748b" }}>
                उत्तर प्रदेश लोक सेवा आयोग - PCS, RO/ARO, और अन्य परीक्षाएं
              </p>
            </div>

            <div style={{
              padding: "25px",
              background: "#f8fafc",
              borderRadius: "12px",
              border: "2px solid #e2e8f0"
            }}>
              <h4 style={{ fontSize: "1.3rem", color: "#1e293b", marginBottom: "10px" }}>
                🚆 Railway
              </h4>
              <p style={{ fontSize: "0.95rem", color: "#64748b" }}>
                RRB Group D, NTPC, और अन्य रेलवे परीक्षाएं
              </p>
            </div>

            <div style={{
              padding: "25px",
              background: "#f8fafc",
              borderRadius: "12px",
              border: "2px solid #e2e8f0"
            }}>
              <h4 style={{ fontSize: "1.3rem", color: "#1e293b", marginBottom: "10px" }}>
                💼 SSC
              </h4>
              <p style={{ fontSize: "0.95rem", color: "#64748b" }}>
                SSC CGL, CHSL, MTS, और अन्य SSC परीक्षाएं
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "40px",
          marginBottom: "40px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{
            fontSize: "2.5rem",
            color: "#1e293b",
            marginBottom: "30px",
            textAlign: "center"
          }}>
            हमारी विशेषताएं
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "25px"
          }}>
            <div style={{ padding: "25px", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "15px" }}>📝</div>
              <h3 style={{ fontSize: "1.3rem", color: "#1e293b", marginBottom: "10px" }}>
                Free Mock Tests
              </h3>
              <p style={{ fontSize: "0.95rem", color: "#64748b", lineHeight: "1.6" }}>
                सभी परीक्षाओं के लिए पूरी तरह से मुफ्त Mock Tests। कोई छिपा हुआ शुल्क नहीं।
              </p>
            </div>

            <div style={{ padding: "25px", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "15px" }}>🎯</div>
              <h3 style={{ fontSize: "1.3rem", color: "#1e293b", marginBottom: "10px" }}>
                Latest Pattern
              </h3>
              <p style={{ fontSize: "0.95rem", color: "#64748b", lineHeight: "1.6" }}>
                नवीनतम परीक्षा पैटर्न के अनुसार तैयार किए गए प्रश्न पत्र।
              </p>
            </div>

            <div style={{ padding: "25px", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "15px" }}>📊</div>
              <h3 style={{ fontSize: "1.3rem", color: "#1e293b", marginBottom: "10px" }}>
                Detailed Analysis
              </h3>
              <p style={{ fontSize: "0.95rem", color: "#64748b", lineHeight: "1.6" }}>
                प्रत्येक प्रश्न का विस्तृत विश्लेषण और व्याख्या।
              </p>
            </div>

            <div style={{ padding: "25px", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "15px" }}>🏆</div>
              <h3 style={{ fontSize: "1.3rem", color: "#1e293b", marginBottom: "10px" }}>
                Leaderboard
              </h3>
              <p style={{ fontSize: "0.95rem", color: "#64748b", lineHeight: "1.6" }}>
                अन्य छात्रों के साथ अपनी रैंकिंग की तुलना करें।
              </p>
            </div>

            <div style={{ padding: "25px", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "15px" }}>🌐</div>
              <h3 style={{ fontSize: "1.3rem", color: "#1e293b", marginBottom: "10px" }}>
                Hindi & English
              </h3>
              <p style={{ fontSize: "0.95rem", color: "#64748b", lineHeight: "1.6" }}>
                हिंदी और अंग्रेजी दोनों भाषाओं में प्रश्न उपलब्ध।
              </p>
            </div>

            <div style={{ padding: "25px", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "15px" }}>📱</div>
              <h3 style={{ fontSize: "1.3rem", color: "#1e293b", marginBottom: "10px" }}>
                Mobile Friendly
              </h3>
              <p style={{ fontSize: "0.95rem", color: "#64748b", lineHeight: "1.6" }}>
                मोबाइल, टैबलेट और कंप्यूटर सभी पर काम करता है।
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "40px",
          marginBottom: "40px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{
            fontSize: "2.5rem",
            color: "#1e293b",
            marginBottom: "30px",
            textAlign: "center"
          }}>
            हमें क्यों चुनें?
          </h2>

          <div style={{ fontSize: "1.1rem", color: "#475569", lineHeight: "1.8" }}>
            <p style={{ marginBottom: "20px" }}>
              <strong>UP Exam Mantra</strong> उत्तर प्रदेश की सभी प्रतियोगी परीक्षाओं की तैयारी के लिए एक विश्वसनीय और मुफ्त प्लेटफॉर्म है। हम समझते हैं कि सरकारी नौकरी की तैयारी कितनी चुनौतीपूर्ण हो सकती है, इसलिए हमने यह प्लेटफॉर्म बनाया है जो पूरी तरह से मुफ्त है।
            </p>

            <h3 style={{ fontSize: "1.5rem", color: "#1e293b", marginBottom: "15px", marginTop: "30px" }}>
              UPSSC परीक्षाओं के लिए विशेष
            </h3>
            <p style={{ marginBottom: "20px" }}>
              UPSSC (Uttar Pradesh Subordinate Services Selection Commission) द्वारा आयोजित सभी परीक्षाओं जैसे PET, VDO, Junior Assistant, Forest Guard, Revenue Inspector के लिए हमारे पास विशेष Mock Tests हैं। प्रत्येक Mock Test नवीनतम परीक्षा पैटर्न और सिलेबस के अनुसार तैयार किया गया है।
            </p>

            <h3 style={{ fontSize: "1.5rem", color: "#1e293b", marginBottom: "15px", marginTop: "30px" }}>
              UP Police भर्ती की तैयारी
            </h3>
            <p style={{ marginBottom: "20px" }}>
              उत्तर प्रदेश पुलिस भर्ती और प्रोन्नति बोर्ड (UPPRPB) द्वारा आयोजित Constable, SI, Head Constable और अन्य पदों की परीक्षाओं के लिए हमारे Mock Tests आपको वास्तविक परीक्षा का अनुभव देते हैं। सभी प्रश्न पिछले वर्षों के पेपर और नवीनतम पैटर्न पर आधारित हैं।
            </p>

            <h3 style={{ fontSize: "1.5rem", color: "#1e293b", marginBottom: "15px", marginTop: "30px" }}>
              UP Lekhpal परीक्षा की पूर्ण तैयारी
            </h3>
            <p style={{ marginBottom: "20px" }}>
              राजस्व परिषद, उत्तर प्रदेश द्वारा आयोजित Lekhpal परीक्षा के सभी विषयों - सामान्य हिंदी, ग्राम समाज और विकास, अंकगणित, और सामान्य ज्ञान के लिए विस्तृत Mock Tests। प्रत्येक प्रश्न के साथ विस्तृत व्याख्या भी दी गई है।
            </p>

            <h3 style={{ fontSize: "1.5rem", color: "#1e293b", marginBottom: "15px", marginTop: "30px" }}>
              अन्य महत्वपूर्ण परीक्षाएं
            </h3>
            <p style={{ marginBottom: "20px" }}>
              UPTET (शिक्षक पात्रता परीक्षा), UPPSC (लोक सेवा आयोग), Railway, SSC और अन्य सभी प्रतियोगी परीक्षाओं के लिए भी हमारे पास Mock Tests उपलब्ध हैं। हम नियमित रूप से नए Mock Tests जोड़ते रहते हैं।
            </p>
          </div>
        </section>

        {/* SEO Content */}
        <section style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "40px",
          marginBottom: "40px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{
            fontSize: "2.5rem",
            color: "#1e293b",
            marginBottom: "30px",
            textAlign: "center"
          }}>
            परीक्षा की तैयारी कैसे करें?
          </h2>

          <div style={{ fontSize: "1.05rem", color: "#475569", lineHeight: "1.8" }}>
            <h3 style={{ fontSize: "1.5rem", color: "#1e293b", marginBottom: "15px" }}>
              1. नियमित अभ्यास करें
            </h3>
            <p style={{ marginBottom: "20px" }}>
              प्रतिदिन कम से कम एक Mock Test जरूर दें। नियमित अभ्यास से आपकी गति और सटीकता दोनों में सुधार होगा। हमारे प्लेटफॉर्म पर आप असीमित Mock Tests दे सकते हैं।
            </p>

            <h3 style={{ fontSize: "1.5rem", color: "#1e293b", marginBottom: "15px" }}>
              2. अपनी गलतियों से सीखें
            </h3>
            <p style={{ marginBottom: "20px" }}>
              प्रत्येक Mock Test के बाद अपने गलत उत्तरों का विश्लेषण करें। हम प्रत्येक प्रश्न के लिए विस्तृत व्याख्या प्रदान करते हैं जो आपको अवधारणाओं को समझने में मदद करेगी।
            </p>

            <h3 style={{ fontSize: "1.5rem", color: "#1e293b", marginBottom: "15px" }}>
              3. समय प्रबंधन सीखें
            </h3>
            <p style={{ marginBottom: "20px" }}>
              वास्तविक परीक्षा में समय प्रबंधन बहुत महत्वपूर्ण है। हमारे Mock Tests में टाइमर होता है जो आपको समय के अनुसार प्रश्न हल करने का अभ्यास कराता है।
            </p>

            <h3 style={{ fontSize: "1.5rem", color: "#1e293b", marginBottom: "15px" }}>
              4. Leaderboard पर अपनी रैंक देखें
            </h3>
            <p style={{ marginBottom: "20px" }}>
              अन्य छात्रों के साथ अपनी तुलना करें और जानें कि आप कहां खड़े हैं। यह आपको प्रेरित रखेगा और आपको अपने कमजोर क्षेत्रों को पहचानने में मदद करेगा।
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "20px",
          padding: "60px 40px",
          textAlign: "center",
          color: "#fff",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
        }}>
          <h2 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
            अभी शुरू करें - पूरी तरह से मुफ्त!
          </h2>
          <p style={{ fontSize: "1.2rem", marginBottom: "30px", opacity: 0.95 }}>
            हजारों छात्र पहले से ही UP Exam Mantra के साथ अपनी तैयारी कर रहे हैं
          </p>
          <button
            onClick={() => navigate("/auth")}
            style={{
              padding: "18px 50px",
              background: "#fff",
              color: "#667eea",
              border: "none",
              borderRadius: "12px",
              fontSize: "1.3rem",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 8px 25px rgba(0,0,0,0.2)"
            }}
          >
            Free में Sign Up करें
          </button>
        </section>
      </div>

      {/* Footer */}
      <footer style={{
        background: "rgba(0,0,0,0.2)",
        color: "#fff",
        padding: "30px 20px",
        marginTop: "60px",
        textAlign: "center"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{ fontSize: "1rem", marginBottom: "10px" }}>
            © 2024 UP Exam Mantra - All Rights Reserved
          </p>
          <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
            UPSSC Mock Test | UP Police Mock Test | UP Lekhpal Mock Test | UPTET Mock Test | Free Online Test Series
          </p>
        </div>
      </footer>
    </div>
  );
}
