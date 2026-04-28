import { useState, useEffect } from "react";
import { getAllStudyMaterials } from "./services/firestoreService";

export default function StudyMaterial() {
  const [materials, setMaterials] = useState([]);
  const [activeTab, setActiveTab] = useState("video");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Expanded sections track karo: "materialId_sectionId" format
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (key) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllStudyMaterials();
        setMaterials(data);
      } catch (err) {
        console.error("Study material load error:", err);
        setError("डेटा लोड करने में समस्या हुई। कृपया पुनः प्रयास करें।");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px", color: "#64748b" }}>
        <div style={{ fontSize: "3rem", marginBottom: "15px" }}>📚</div>
        <div style={{ fontSize: "1.2rem" }}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px", color: "#ef4444" }}>
        <div style={{ fontSize: "3rem", marginBottom: "15px" }}>⚠️</div>
        <div style={{ fontSize: "1.1rem" }}>{error}</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
        borderRadius: "20px",
        padding: "35px 40px",
        color: "#fff",
        marginBottom: "30px",
        textAlign: "center"
      }}>
        <div style={{ fontSize: "3rem", marginBottom: "10px" }}>📚</div>
        <h1 style={{ margin: "0 0 8px 0", fontSize: "2rem", fontWeight: "800" }}>
          Study Material
        </h1>
        <p style={{ margin: 0, opacity: 0.9, fontSize: "1rem" }}>
          Video Lectures aur Notes — ek jagah
        </p>
      </div>

      {/* Tab Buttons */}
      <div style={{
        display: "flex",
        gap: "12px",
        marginBottom: "25px",
        background: "#fff",
        padding: "8px",
        borderRadius: "14px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
      }}>
        <button
          onClick={() => setActiveTab("video")}
          style={{
            flex: 1,
            padding: "12px",
            background: activeTab === "video" ? "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)" : "transparent",
            color: activeTab === "video" ? "#fff" : "#64748b",
            border: "none",
            borderRadius: "10px",
            fontWeight: "700",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          📹 Video Lectures
        </button>
        <button
          onClick={() => setActiveTab("notes")}
          style={{
            flex: 1,
            padding: "12px",
            background: activeTab === "notes" ? "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)" : "transparent",
            color: activeTab === "notes" ? "#fff" : "#64748b",
            border: "none",
            borderRadius: "10px",
            fontWeight: "700",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          📄 Notes
        </button>
      </div>

      {/* Empty state */}
      {materials.length === 0 && (
        <div style={{
          textAlign: "center", padding: "60px 20px", color: "#64748b",
          background: "#fff", borderRadius: "15px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)"
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>📭</div>
          <div style={{ fontSize: "1.2rem", fontWeight: "600" }}>
            अभी कोई सामग्री उपलब्ध नहीं है।
          </div>
          <div style={{ fontSize: "0.95rem", marginTop: "8px" }}>
            Admin जल्द ही content add करेंगे।
          </div>
        </div>
      )}

      {/* Materials list */}
      {materials.map((material) => (
        <div key={material.id} style={{ marginBottom: "30px" }}>
          {/* Material title */}
          <div style={{
            background: "#fff",
            borderRadius: "15px",
            padding: "20px 25px",
            marginBottom: "15px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            borderLeft: "5px solid #7c3aed"
          }}>
            <h2 style={{ margin: "0 0 5px 0", fontSize: "1.4rem", fontWeight: "700", color: "#1e293b" }}>
              {material.title}
            </h2>
            {material.description && (
              <p style={{ margin: 0, color: "#64748b", fontSize: "0.95rem" }}>{material.description}</p>
            )}
          </div>

          {/* Sections */}
          {(material.sections || []).map((section) => {
            const filteredItems = (section.items || []).filter(item => item.type === activeTab);
            const sectionKey = `${material.id}_${section.id}`;
            const isExpanded = !!expandedSections[sectionKey];

            return (
              <div key={section.id} style={{ marginBottom: "10px" }}>
                {/* Section header — click to expand/collapse */}
                <div
                  onClick={() => toggleSection(sectionKey)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 20px",
                    background: isExpanded
                      ? (activeTab === "video" ? "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)" : "linear-gradient(135deg, #0088cc 0%, #229ed9 100%)")
                      : "#f1f5f9",
                    color: isExpanded ? "#fff" : "#1e293b",
                    borderRadius: isExpanded ? "12px 12px 0 0" : "12px",
                    cursor: "pointer",
                    userSelect: "none",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "1.1rem" }}>
                      {activeTab === "video" ? "📹" : "📄"}
                    </span>
                    <span style={{ fontWeight: "700", fontSize: "1rem" }}>{section.title}</span>
                    <span style={{
                      background: isExpanded ? "rgba(255,255,255,0.2)" : "#e2e8f0",
                      color: isExpanded ? "#fff" : "#64748b",
                      padding: "2px 10px",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: "600"
                    }}>
                      {filteredItems.length} items
                    </span>
                  </div>
                  <span style={{ fontSize: "1.2rem", transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>
                    ▼
                  </span>
                </div>

                {/* Items — sirf tab dikhao jab expanded ho */}
                {isExpanded && (
                  <div style={{
                    border: `2px solid ${activeTab === "video" ? "#a855f7" : "#229ed9"}`,
                    borderTop: "none",
                    borderRadius: "0 0 12px 12px",
                    padding: "15px",
                    background: "#fff"
                  }}>
                    {filteredItems.length === 0 ? (
                      <div style={{ padding: "20px", color: "#94a3b8", fontSize: "0.9rem", textAlign: "center" }}>
                        {activeTab === "video" ? "कोई वीडियो उपलब्ध नहीं" : "कोई नोट्स उपलब्ध नहीं"}
                      </div>
                    ) : (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
                        {filteredItems.map((item) => (
                          <ItemCard key={item.id} item={item} activeTab={activeTab} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// Video / Notes card component
function ItemCard({ item, activeTab }) {
  const isVideo = activeTab === "video";

  return (
    <div
      onClick={() => {
        if (isVideo && item.youtubeUrl) {
          window.open(item.youtubeUrl, "_blank", "noopener,noreferrer");
        } else if (!isVideo && (item.telegramUrl || item.pdfUrl)) {
          window.open(item.telegramUrl || item.pdfUrl, "_blank", "noopener,noreferrer");
        }
      }}
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
        border: "2px solid #e2e8f0",
        cursor: isVideo ? "pointer" : (!isVideo && (item.telegramUrl || item.pdfUrl)) ? "pointer" : "default",
        transition: "all 0.2s",
        display: "flex",
        flexDirection: "column",
        gap: "8px"
      }}
      onMouseEnter={(e) => {
        if (isVideo || (!isVideo && (item.telegramUrl || item.pdfUrl))) {
          e.currentTarget.style.borderColor = isVideo ? "#7c3aed" : "#0088cc";
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = isVideo
            ? "0 6px 20px rgba(124,58,237,0.15)"
            : "0 6px 20px rgba(0,136,204,0.15)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#e2e8f0";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.07)";
      }}
    >
      {/* Icon + Title */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
        <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>
          {isVideo ? "▶️" : "📄"}
        </span>
        <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: "700", color: "#1e293b", lineHeight: "1.4" }}>
          {item.title}
        </h4>
      </div>

      {/* Description */}
      {item.description && (
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#64748b", lineHeight: "1.5" }}>
          {item.description}
        </p>
      )}

      {/* Notes download button — link hidden, sirf button dikhega */}
      {!isVideo && (item.pdfUrl || item.telegramUrl) && (
        <a
          href={item.telegramUrl || item.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            marginTop: "8px",
            padding: "8px 16px",
            background: "linear-gradient(135deg, #0088cc 0%, #229ed9 100%)",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "0.9rem",
            textAlign: "center",
            display: "block"
          }}
        >
          📥 Notes Open Karo
        </a>
      )}

      {/* Video watch hint */}
      {isVideo && (
        <div style={{ fontSize: "0.8rem", color: "#a855f7", fontWeight: "600" }}>
          ▶ Click to watch
        </div>
      )}    </div>
  );
}
