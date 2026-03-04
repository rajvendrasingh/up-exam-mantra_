import { useContext, useState, useEffect } from "react";
import { TestSeriesContext } from "./TestSeriesContext";

export default function AdminNew() {
  const { testSeries, setTestSeries } = useContext(TestSeriesContext);
  const [activeView, setActiveView] = useState("dashboard"); // dashboard, series, sections, tests, questions
  
  // Test Series States
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  
  // Form States
  const [seriesTitle, setSeriesTitle] = useState("");
  const [seriesDescription, setSeriesDescription] = useState("");
  const [seriesCategory, setSeriesCategory] = useState("");
  const [seriesStatus, setSeriesStatus] = useState("draft");
  
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionDescription, setSectionDescription] = useState("");
  
  const [testTitle, setTestTitle] = useState("");
  const [testDuration, setTestDuration] = useState(60);
  const [testMarksPerQuestion, setTestMarksPerQuestion] = useState(1);
  const [testNegativeMarking, setTestNegativeMarking] = useState(0.25);
  const [testInstructions, setTestInstructions] = useState("");
  const [testStatus, setTestStatus] = useState("draft");
  
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [explanation, setExplanation] = useState("");
  
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // create-series, edit-series, create-section, etc.

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }}>
      {/* Content will be added */}
      <div style={{ padding: "20px", color: "#fff", textAlign: "center" }}>
        <h1>Admin Panel - Test Series Management Only</h1>
        <p>Subject Management Removed</p>
      </div>
    </div>
  );
}
