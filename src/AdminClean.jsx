import { useContext, useState } from "react";
import { TestSeriesContext } from "./TestSeriesContext";

export default function AdminClean() {
  const { testSeries, setTestSeries } = useContext(TestSeriesContext);
  
  // Navigation States
  const [currentView, setCurrentView] = useState("series"); // series, sections, tests, questions
  const [selectedSeriesId, setSelectedSeriesId] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedTestId, setSelectedTestId] = useState(null);
  
  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  
  // Test Series Form
  const [seriesTitle, setSeriesTitle] = useState("");
  const [seriesDescription, setSeriesDescription] = useState("");
  const [seriesCategory, setSeriesCategory] = useState("");
  const [seriesStatus, setSeriesStatus] = useState("draft");
  
  // Section Form
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionDescription, setSectionDescription] = useState("");
  
  // Test Form
  const [testTitle, setTestTitle] = useState("");
  const [testDuration, setTestDuration] = useState(60);
  const [testMarksPerQuestion, setTestMarksPerQuestion] = useState(1);
  const [testNegativeMarking, setTestNegativeMarking] = useState(0.25);
  const [testInstructions, setTestInstructions] = useState("");
  const [testStatus, setTestStatus] = useState("draft");
  
  // Question Form
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [questionMarks, setQuestionMarks] = useState(1);
  
  // Bulk Upload
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkJsonInput, setBulkJsonInput] = useState("");

  // Get current series, section, test
  const currentSeries = testSeries.find(s => s.id === selectedSeriesId);
  const currentSection = currentSeries?.sections?.find(s => s.id === selectedSectionId);
  const currentTest = currentSection?.tests?.find(t => t.id === selectedTestId);

  // ==================== TEST SERIES FUNCTIONS ====================
  
  const createTestSeries = () => {
    if (!seriesTitle.trim()) {
      alert("Please enter a title");
      return;
    }
    
    const newSeries = {
      id: Date.now().toString(),
      title: seriesTitle,
      description: seriesDescription,
      category: seriesCategory,
      status: seriesStatus,
      sections: [],
      createdAt: new Date().toISOString()
    };
    
    setTestSeries([...testSeries, newSeries]);
    resetSeriesForm();
    setShowModal(false);
    alert("✅ Test Series created!");
  };

  const updateTestSeries = () => {
    if (!editingItem) return;
    
    setTestSeries(testSeries.map(s => 
      s.id === editingItem.id 
        ? { ...s, title: seriesTitle, description: seriesDescription, category: seriesCategory, status: seriesStatus }
        : s
    ));
    
    resetSeriesForm();
    setShowModal(false);
    alert("✅ Test Series updated!");
  };

  const deleteTestSeries = (seriesId) => {
    if (!window.confirm("Delete this test series? All sections, tests, and questions will be deleted!")) return;
    
    setTestSeries(testSeries.filter(s => s.id !== seriesId));
    alert("✅ Test Series deleted!");
  };

  const resetSeriesForm = () => {
    setSeriesTitle("");
    setSeriesDescription("");
    setSeriesCategory("");
    setSeriesStatus("draft");
    setEditingItem(null);
  };

  // ==================== SECTION FUNCTIONS ====================
  
  const createSection = () => {
    if (!sectionTitle.trim()) {
      alert("Please enter section title");
      return;
    }
    
    const newSection = {
      id: Date.now().toString(),
      title: sectionTitle,
      description: sectionDescription,
      tests: [],
      createdAt: new Date().toISOString()
    };
    
    setTestSeries(testSeries.map(s => 
      s.id === selectedSeriesId 
        ? { ...s, sections: [...(s.sections || []), newSection] }
        : s
    ));
    
    resetSectionForm();
    setShowModal(false);
    alert("✅ Section created!");
  };

  const updateSection = () => {
    if (!editingItem) return;
    
    setTestSeries(testSeries.map(s => 
      s.id === selectedSeriesId 
        ? {
            ...s,
            sections: s.sections.map(sec => 
              sec.id === editingItem.id 
                ? { ...sec, title: sectionTitle, description: sectionDescription }
                : sec
            )
          }
        : s
    ));
    
    resetSectionForm();
    setShowModal(false);
    alert("✅ Section updated!");
  };

  const deleteSection = (sectionId) => {
    if (!window.confirm("Delete this section? All tests and questions will be deleted!")) return;
    
    setTestSeries(testSeries.map(s => 
      s.id === selectedSeriesId 
        ? { ...s, sections: s.sections.filter(sec => sec.id !== sectionId) }
        : s
    ));
    
    alert("✅ Section deleted!");
  };

  const resetSectionForm = () => {
    setSectionTitle("");
    setSectionDescription("");
    setEditingItem(null);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px"
    }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "30px",
          marginBottom: "30px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
        }}>
          <h1 style={{
            margin: 0,
            fontSize: "2.5rem",
            fontWeight: "800",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            🎓 Admin Panel
          </h1>
          <p style={{ margin: "10px 0 0 0", color: "#64748b" }}>
            Manage Test Series, Sections, Tests & Questions
          </p>
        </div>

        {/* Breadcrumb Navigation */}
        <div style={{
          background: "#fff",
          borderRadius: "15px",
          padding: "20px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap"
        }}>
          <button
            onClick={() => {
              setCurrentView("series");
              setSelectedSeriesId(null);
              setSelectedSectionId(null);
              setSelectedTestId(null);
            }}
            style={{
              padding: "8px 16px",
              background: currentView === "series" ? "#667eea" : "#f1f5f9",
              color: currentView === "series" ? "#fff" : "#64748b",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            📚 Test Series
          </button>
          
          {selectedSeriesId && (
            <>
              <span style={{ color: "#94a3b8" }}>→</span>
              <button
                onClick={() => {
                  setCurrentView("sections");
                  setSelectedSectionId(null);
                  setSelectedTestId(null);
                }}
                style={{
                  padding: "8px 16px",
                  background: currentView === "sections" ? "#667eea" : "#f1f5f9",
                  color: currentView === "sections" ? "#fff" : "#64748b",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                📂 {currentSeries?.title}
              </button>
            </>
          )}
          
          {selectedSectionId && (
            <>
              <span style={{ color: "#94a3b8" }}>→</span>
              <button
                onClick={() => {
                  setCurrentView("tests");
                  setSelectedTestId(null);
                }}
                style={{
                  padding: "8px 16px",
                  background: currentView === "tests" ? "#667eea" : "#f1f5f9",
                  color: currentView === "tests" ? "#fff" : "#64748b",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                📝 {currentSection?.title}
              </button>
            </>
          )}
          
          {selectedTestId && (
            <>
              <span style={{ color: "#94a3b8" }}>→</span>
              <span style={{
                padding: "8px 16px",
                background: "#667eea",
                color: "#fff",
                borderRadius: "8px",
                fontWeight: "600"
              }}>
                ❓ {currentTest?.title}
              </span>
            </>
          )}
        </div>

        {/* Main Content Area */}
        <div style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "30px",
          minHeight: "500px"
        }}>
          {/* Content will be rendered based on currentView */}
          <div style={{ textAlign: "center", padding: "100px 20px", color: "#64748b" }}>
            <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🚧</div>
            <h2 style={{ margin: "0 0 10px 0", color: "#1e293b" }}>Under Construction</h2>
            <p>Complete admin panel coming soon...</p>
            <p style={{ marginTop: "20px", fontSize: "0.9rem" }}>
              Current View: <strong>{currentView}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
