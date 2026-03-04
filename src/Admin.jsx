import { useContext, useState } from "react";
import { TestSeriesContext } from "./TestSeriesContext";

export default function Admin() {
  const { testSeries, setTestSeries, addNotification } = useContext(TestSeriesContext);
  
  // View States
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedSeriesIdx, setSelectedSeriesIdx] = useState(null);
  const [selectedSectionIdx, setSelectedSectionIdx] = useState(null);
  const [selectedTestIdx, setSelectedTestIdx] = useState(null);
  
  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingIdx, setEditingIdx] = useState(null);
  
  // Test Series Form
  const [seriesTitle, setSeriesTitle] = useState("");
  const [seriesDescription, setSeriesDescription] = useState("");
  const [seriesCategory, setSeriesCategory] = useState("");
  const [seriesStatus, setSeriesStatus] = useState("active");
  
  // Section Form
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionDescription, setSectionDescription] = useState("");
  
  // Test Form
  const [testTitle, setTestTitle] = useState("");
  const [testDuration, setTestDuration] = useState(60);
  const [testMarksPerQuestion, setTestMarksPerQuestion] = useState(1);
  const [testNegativeMarking, setTestNegativeMarking] = useState(0.25);
  const [testInstructions, setTestInstructions] = useState("");
  const [testStatus, setTestStatus] = useState("active");
  
  // Question Form
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [questionImage, setQuestionImage] = useState("");
  
  // Bulk Delete
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [bulkDeleteMode, setBulkDeleteMode] = useState(false);
  
  // Bulk Upload States
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkJsonInput, setBulkJsonInput] = useState("");
  
  // AI Generator States
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiQuestionCount, setAiQuestionCount] = useState(10);
  const [aiDifficulty, setAiDifficulty] = useState("medium");
  const [aiLanguage, setAiLanguage] = useState("english");
  const [aiQuestionType, setAiQuestionType] = useState("mixed");
  const [aiIncludeExplanation, setAiIncludeExplanation] = useState(true);

  // Get current items
  const currentSeries = selectedSeriesIdx !== null ? testSeries[selectedSeriesIdx] : null;
  const currentSection = currentSeries && selectedSectionIdx !== null ? currentSeries.sections?.[selectedSectionIdx] : null;
  const currentTest = currentSection && selectedTestIdx !== null ? currentSection.tests?.[selectedTestIdx] : null;

  // ==================== TEST SERIES FUNCTIONS ====================
  
  const openCreateSeriesModal = () => {
    setModalType("create-series");
    setSeriesTitle("");
    setSeriesDescription("");
    setSeriesCategory("");
    setSeriesStatus("active");
    setEditingIdx(null);
    setShowModal(true);
  };

  const openEditSeriesModal = (idx) => {
    const series = testSeries[idx];
    setModalType("edit-series");
    setSeriesTitle(series.title);
    setSeriesDescription(series.description || "");
    setSeriesCategory(series.category || "");
    setSeriesStatus(series.status || "active");
    setEditingIdx(idx);
    setShowModal(true);
  };

  const handleCreateSeries = () => {
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
    setShowModal(false);
    
    // Add notification
    addNotification({
      icon: "🎉",
      title: "New Test Series Created!",
      message: `"${seriesTitle}" has been created successfully.`,
      type: "success"
    });
    
    alert("✅ Test series created successfully!");
  };

  const handleUpdateSeries = () => {
    if (!seriesTitle.trim()) {
      alert("Please enter a title");
      return;
    }

    const updated = [...testSeries];
    updated[editingIdx] = {
      ...updated[editingIdx],
      title: seriesTitle,
      description: seriesDescription,
      category: seriesCategory,
      status: seriesStatus
    };

    setTestSeries(updated);
    setShowModal(false);
    alert("✅ Test series updated successfully!");
  };

  const handleDeleteSeries = (idx) => {
    if (!window.confirm("Are you sure? This will delete all sections, tests, and questions!")) {
      return;
    }

    const updated = testSeries.filter((_, i) => i !== idx);
    setTestSeries(updated);
    alert("✅ Test series deleted successfully!");
  };

  // ==================== SECTION FUNCTIONS ====================

  const openCreateSectionModal = () => {
    setModalType("create-section");
    setSectionTitle("");
    setSectionDescription("");
    setEditingIdx(null);
    setShowModal(true);
  };

  const openEditSectionModal = (idx) => {
    const section = currentSeries.sections[idx];
    setModalType("edit-section");
    setSectionTitle(section.title);
    setSectionDescription(section.description || "");
    setEditingIdx(idx);
    setShowModal(true);
  };

  const handleCreateSection = () => {
    if (!sectionTitle.trim()) {
      alert("Please enter a section title");
      return;
    }

    const newSection = {
      id: Date.now().toString(),
      title: sectionTitle,
      description: sectionDescription,
      tests: [],
      createdAt: new Date().toISOString()
    };

    const updated = [...testSeries];
    updated[selectedSeriesIdx].sections = [...(updated[selectedSeriesIdx].sections || []), newSection];
    setTestSeries(updated);
    setShowModal(false);
    alert("✅ Section created successfully!");
  };

  const handleUpdateSection = () => {
    if (!sectionTitle.trim()) {
      alert("Please enter a section title");
      return;
    }

    const updated = [...testSeries];
    updated[selectedSeriesIdx].sections[editingIdx] = {
      ...updated[selectedSeriesIdx].sections[editingIdx],
      title: sectionTitle,
      description: sectionDescription
    };

    setTestSeries(updated);
    setShowModal(false);
    alert("✅ Section updated successfully!");
  };

  const handleDeleteSection = (idx) => {
    if (!window.confirm("Are you sure? This will delete all tests and questions in this section!")) {
      return;
    }

    const updated = [...testSeries];
    updated[selectedSeriesIdx].sections = updated[selectedSeriesIdx].sections.filter((_, i) => i !== idx);
    setTestSeries(updated);
    alert("✅ Section deleted successfully!");
  };

  // ==================== TEST FUNCTIONS ====================

  const openCreateTestModal = () => {
    setModalType("create-test");
    setTestTitle("");
    setTestDuration(60);
    setTestMarksPerQuestion(1);
    setTestNegativeMarking(0.25);
    setTestInstructions("");
    setTestStatus("active");
    setEditingIdx(null);
    setShowModal(true);
  };

  const openEditTestModal = (idx) => {
    const test = currentSection.tests[idx];
    setModalType("edit-test");
    setTestTitle(test.title);
    setTestDuration(test.duration || 60);
    setTestMarksPerQuestion(test.marksPerQuestion || 1);
    setTestNegativeMarking(test.negativeMarking || 0.25);
    setTestInstructions(test.instructions || "");
    setTestStatus(test.status || "active");
    setEditingIdx(idx);
    setShowModal(true);
  };

  const handleCreateTest = () => {
    if (!testTitle.trim()) {
      alert("Please enter a test title");
      return;
    }

    const newTest = {
      id: Date.now().toString(),
      title: testTitle,
      duration: testDuration,
      marksPerQuestion: testMarksPerQuestion,
      negativeMarking: testNegativeMarking,
      instructions: testInstructions,
      status: testStatus,
      questions: [],
      createdAt: new Date().toISOString()
    };

    const updated = [...testSeries];
    updated[selectedSeriesIdx].sections[selectedSectionIdx].tests = [
      ...(updated[selectedSeriesIdx].sections[selectedSectionIdx].tests || []),
      newTest
    ];
    setTestSeries(updated);
    setShowModal(false);
    
    // Add notification
    addNotification({
      icon: "📝",
      title: "New Test Created!",
      message: `"${testTitle}" has been added to ${currentSection.title}.`,
      type: "success"
    });
    
    alert("✅ Test created successfully!");
  };

  const handleUpdateTest = () => {
    if (!testTitle.trim()) {
      alert("Please enter a test title");
      return;
    }

    const updated = [...testSeries];
    updated[selectedSeriesIdx].sections[selectedSectionIdx].tests[editingIdx] = {
      ...updated[selectedSeriesIdx].sections[selectedSectionIdx].tests[editingIdx],
      title: testTitle,
      duration: testDuration,
      marksPerQuestion: testMarksPerQuestion,
      negativeMarking: testNegativeMarking,
      instructions: testInstructions,
      status: testStatus
    };

    setTestSeries(updated);
    setShowModal(false);
    
    // Add notification
    addNotification({
      icon: "✏️",
      title: "Test Updated!",
      message: `"${testTitle}" has been updated successfully.`,
      type: "info"
    });
    
    alert("✅ Test updated successfully!");
  };

  const handleDeleteTest = (idx) => {
    if (!window.confirm("Are you sure? This will delete all questions in this test!")) {
      return;
    }

    const updated = [...testSeries];
    updated[selectedSeriesIdx].sections[selectedSectionIdx].tests = 
      updated[selectedSeriesIdx].sections[selectedSectionIdx].tests.filter((_, i) => i !== idx);
    setTestSeries(updated);
    alert("✅ Test deleted successfully!");
  };

  // ==================== QUESTION FUNCTIONS ====================

  const openCreateQuestionModal = () => {
    setModalType("create-question");
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer(0);
    setExplanation("");
    setQuestionImage("");
    setEditingIdx(null);
    setShowModal(true);
  };

  const openEditQuestionModal = (idx) => {
    const question = currentTest.questions[idx];
    setModalType("edit-question");
    setQuestionText(question.question);
    setOptions([...question.options]);
    setCorrectAnswer(question.answer);
    setExplanation(question.explanation || "");
    setQuestionImage(question.image || "");
    setEditingIdx(idx);
    setShowModal(true);
  };

  const handleCreateQuestion = () => {
    if (!questionText.trim()) {
      alert("Please enter a question");
      return;
    }

    if (options.some(opt => !opt.trim())) {
      alert("Please fill all 4 options");
      return;
    }

    const newQuestion = {
      id: Date.now().toString(),
      question: questionText,
      options: [...options],
      answer: correctAnswer,
      explanation: explanation,
      image: questionImage
    };

    const updated = [...testSeries];
    updated[selectedSeriesIdx].sections[selectedSectionIdx].tests[selectedTestIdx].questions = [
      ...(updated[selectedSeriesIdx].sections[selectedSectionIdx].tests[selectedTestIdx].questions || []),
      newQuestion
    ];
    setTestSeries(updated);
    setShowModal(false);
    alert("✅ Question added successfully!");
  };

  const handleUpdateQuestion = () => {
    if (!questionText.trim()) {
      alert("Please enter a question");
      return;
    }

    if (options.some(opt => !opt.trim())) {
      alert("Please fill all 4 options");
      return;
    }

    const updated = [...testSeries];
    updated[selectedSeriesIdx].sections[selectedSectionIdx].tests[selectedTestIdx].questions[editingIdx] = {
      ...updated[selectedSeriesIdx].sections[selectedSectionIdx].tests[selectedTestIdx].questions[editingIdx],
      question: questionText,
      options: [...options],
      answer: correctAnswer,
      explanation: explanation,
      image: questionImage
    };

    setTestSeries(updated);
    setShowModal(false);
    alert("✅ Question updated successfully!");
  };

  const handleDeleteQuestion = (idx) => {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }

    const updated = [...testSeries];
    updated[selectedSeriesIdx].sections[selectedSectionIdx].tests[selectedTestIdx].questions = 
      updated[selectedSeriesIdx].sections[selectedSectionIdx].tests[selectedTestIdx].questions.filter((_, i) => i !== idx);
    setTestSeries(updated);
    alert("✅ Question deleted successfully!");
  };

  // Bulk Delete Functions
  const toggleQuestionSelection = (idx) => {
    setSelectedQuestions(prev => {
      if (prev.includes(idx)) {
        return prev.filter(i => i !== idx);
      }
      return [...prev, idx];
    });
  };

  const selectAllQuestions = () => {
    if (selectedQuestions.length === currentTest.questions.length) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(currentTest.questions.map((_, idx) => idx));
    }
  };

  const handleBulkDelete = () => {
    if (selectedQuestions.length === 0) {
      alert("Please select questions to delete");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedQuestions.length} question(s)?`)) {
      return;
    }

    const updated = [...testSeries];
    updated[selectedSeriesIdx].sections[selectedSectionIdx].tests[selectedTestIdx].questions = 
      updated[selectedSeriesIdx].sections[selectedSectionIdx].tests[selectedTestIdx].questions.filter((_, idx) => !selectedQuestions.includes(idx));
    
    setTestSeries(updated);
    setSelectedQuestions([]);
    setBulkDeleteMode(false);
    alert(`✅ ${selectedQuestions.length} question(s) deleted successfully!`);
  };

  // ==================== BULK UPLOAD WITH AI ERROR DETECTION ====================

  // Find JSON errors
  const findJsonErrors = (jsonString) => {
    if (!jsonString || jsonString.trim() === '') {
      return { hasErrors: true, errors: ["❌ JSON input is empty"] };
    }

    const errors = [];
    const text = jsonString.trim();

    // Check for common errors
    if (text.charCodeAt(0) === 0xFEFF) errors.push("❌ BOM character found");
    if (/[\u201C\u201D\u2018\u2019]/.test(text)) errors.push("❌ Smart quotes found");
    if (text.includes("'")) errors.push(`❌ ${(text.match(/'/g) || []).length} single quote(s) found`);
    if (/,(\s*[}\]])/.test(text)) errors.push(`❌ ${(text.match(/,(\s*[}\]])/g) || []).length} trailing comma(s)`);
    if (/}(\s*){/.test(text)) errors.push(`❌ ${(text.match(/}(\s*){/g) || []).length} missing comma(s) between objects`);
    if (/](\s*)\[/.test(text)) errors.push(`❌ ${(text.match(/](\s*)\[/g) || []).length} missing comma(s) in arrays`);
    if (/,\s*,+/.test(text)) errors.push(`❌ ${(text.match(/,\s*,+/g) || []).length} duplicate comma(s)`);
    if (/(\{|,)(\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*):/.test(text)) errors.push("❌ Unquoted property names");
    if (text.includes('//') || text.includes('/*')) errors.push("❌ Comments found");
    if (/:\s*(True|False)\s*([,}\]])/.test(text)) errors.push("❌ Capitalized booleans");

    const openBrackets = (text.match(/\[/g) || []).length;
    const closeBrackets = (text.match(/\]/g) || []).length;
    const openBraces = (text.match(/\{/g) || []).length;
    const closeBraces = (text.match(/\}/g) || []).length;

    if (openBrackets !== closeBrackets) errors.push(`❌ Unbalanced brackets: ${openBrackets} [ but ${closeBrackets} ]`);
    if (openBraces !== closeBraces) errors.push(`❌ Unbalanced braces: ${openBraces} { but ${closeBraces} }`);

    try {
      JSON.parse(text);
      if (errors.length === 0) return { hasErrors: false, message: "✅ No errors found!" };
    } catch (e) {
      errors.push(`❌ Parse Error: ${e.message}`);
    }

    return { hasErrors: true, errors, totalErrors: errors.length };
  };

  // Auto-fix JSON errors
  const autoFixJson = (jsonString) => {
    if (!jsonString || jsonString.trim() === '') {
      return { success: false, error: "JSON input is empty" };
    }

    let fixed = jsonString.trim();
    const fixes = [];

    try {
      const parsed = JSON.parse(fixed);
      return { success: true, fixedJson: JSON.stringify(parsed, null, 2), fixes: [], totalFixes: 0, data: parsed };
    } catch {
      // Continue with fixes
    }

    // Fix 1: Remove BOM
    if (fixed.charCodeAt(0) === 0xFEFF) {
      fixed = fixed.slice(1);
      fixes.push("✓ Removed BOM");
    }

    // Fix 2: Smart quotes
    if (/[\u201C\u201D\u2018\u2019]/.test(fixed)) {
      fixed = fixed.replace(/[\u201C\u201D]/g, '"').replace(/[\u2018\u2019]/g, "'");
      fixes.push("✓ Fixed smart quotes");
    }

    // Fix 3: Single → Double quotes
    if (fixed.includes("'")) {
      let result = '';
      let inDoubleQuote = false;
      let inSingleQuote = false;
      
      for (let i = 0; i < fixed.length; i++) {
        const char = fixed[i];
        const prevChar = i > 0 ? fixed[i-1] : '';
        
        if (char === '"' && prevChar !== '\\') {
          inDoubleQuote = !inDoubleQuote;
          result += char;
        } else if (char === "'" && prevChar !== '\\' && !inDoubleQuote) {
          result += inSingleQuote ? '"' : '"';
          inSingleQuote = !inSingleQuote;
        } else {
          result += char;
        }
      }
      fixed = result;
      fixes.push("✓ Converted quotes");
    }

    // Fix 4: Remove comments
    if (fixed.includes('//') || fixed.includes('/*')) {
      fixed = fixed.split('\n').map(line => {
        const idx = line.indexOf('//');
        return idx !== -1 ? line.substring(0, idx) : line;
      }).join('\n');
      fixed = fixed.replace(/\/\*[\s\S]*?\*\//g, '');
      fixes.push("✓ Removed comments");
    }

    // Fix 5: Trailing commas
    let count = 0;
    fixed = fixed.replace(/,(\s*)([\]}])/g, (m, s, b) => { count++; return s + b; });
    if (count > 0) fixes.push(`✓ Removed ${count} trailing comma(s)`);

    // Fix 6: Missing commas between objects
    count = 0;
    fixed = fixed.replace(/}(\s*\n\s*){/g, (m, s) => { count++; return '},' + s + '{'; });
    if (count > 0) fixes.push(`✓ Added ${count} comma(s) between objects`);

    // Fix 7: Missing commas in arrays
    count = 0;
    fixed = fixed.replace(/](\s*\n\s*)\[/g, (m, s) => { count++; return '],' + s + '['; });
    if (count > 0) fixes.push(`✓ Added ${count} comma(s) in arrays`);

    // Fix 8: Duplicate commas
    count = 0;
    fixed = fixed.replace(/,(\s*),+/g, (m, s) => { count++; return ',' + s; });
    if (count > 0) fixes.push(`✓ Removed ${count} duplicate comma(s)`);

    // Fix 9: Unquoted properties
    count = 0;
    fixed = fixed.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)(\s*):/g, (m, b, p, a) => {
      if (['true', 'false', 'null'].includes(p)) return m;
      count++;
      return b + '"' + p + '"' + a + ':';
    });
    if (count > 0) fixes.push(`✓ Quoted ${count} property name(s)`);

    // Fix 10: Capitalized booleans
    count = 0;
    fixed = fixed.replace(/:\s*(True|False)\s*([,}\]])/g, (m, b, a) => { count++; return ': ' + b.toLowerCase() + a; });
    if (count > 0) fixes.push(`✓ Fixed ${count} boolean(s)`);

    // Fix 11: undefined/NaN
    if (/:\s*(undefined|NaN)\s*([,}\]])/g.test(fixed)) {
      fixed = fixed.replace(/:\s*undefined\s*([,}\]])/g, ': null$1');
      fixed = fixed.replace(/:\s*NaN\s*([,}\]])/g, ': null$1');
      fixes.push("✓ Replaced invalid values");
    }

    // Fix 12: Wrap in array
    const trimmed = fixed.trim();
    if (trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      fixed = '[' + fixed + ']';
      fixes.push("✓ Wrapped in array");
    }

    // Fix 13: Balance brackets
    const openB = (fixed.match(/\[/g) || []).length;
    const closeB = (fixed.match(/\]/g) || []).length;
    const openBr = (fixed.match(/\{/g) || []).length;
    const closeBr = (fixed.match(/\}/g) || []).length;

    if (openB > closeB) {
      fixed += ']'.repeat(openB - closeB);
      fixes.push(`✓ Added ${openB - closeB} missing ]`);
    }
    if (openBr > closeBr) {
      fixed += '}'.repeat(openBr - closeBr);
      fixes.push(`✓ Added ${openBr - closeBr} missing }`);
    }

    // Fix 14: Clean whitespace
    fixed = fixed.replace(/\s+/g, ' ').trim();

    try {
      const parsed = JSON.parse(fixed);
      const formatted = JSON.stringify(parsed, null, 2);
      return { success: true, fixedJson: formatted, fixes, totalFixes: fixes.length, data: parsed };
    } catch (e) {
      return { success: false, error: e.message, fixes, attemptedFixes: fixes.length };
    }
  };

  // Handle bulk upload
  const handleBulkUpload = () => {
    if (!bulkJsonInput || bulkJsonInput.trim() === '') {
      alert("❌ Please paste JSON data first!");
      return;
    }

    let questions;
    let wasAutoFixed = false;
    
    try {
      questions = JSON.parse(bulkJsonInput);
    } catch {
      const fixResult = autoFixJson(bulkJsonInput);
      
      if (!fixResult.success) {
        alert(`❌ Cannot Import!\n\nError: ${fixResult.error}\n\n💡 Click "🤖 Auto-Fix" button first to fix errors.`);
        return;
      }
      
      questions = fixResult.data;
      wasAutoFixed = true;
      setBulkJsonInput(fixResult.fixedJson);
    }
    
    if (!Array.isArray(questions)) {
      alert("❌ JSON must be an array of questions!");
      return;
    }

    if (questions.length === 0) {
      alert("❌ Array is empty!");
      return;
    }

    // Validation
    const errors = [];
    const warnings = [];
    
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const n = i + 1;
      
      if (!q.question || typeof q.question !== 'string') errors.push(`Q${n}: Missing question`);
      else if (q.question.trim().length < 3) warnings.push(`Q${n}: Question too short`);
      
      if (!q.options) errors.push(`Q${n}: Missing options`);
      else if (!Array.isArray(q.options)) errors.push(`Q${n}: Options must be array`);
      else if (q.options.length !== 4) errors.push(`Q${n}: Must have 4 options`);
      else q.options.forEach((opt, idx) => {
        if (!opt || typeof opt !== 'string' || opt.trim() === '') {
          errors.push(`Q${n}: Option ${idx + 1} is empty`);
        }
      });
      
      if (q.answer === undefined || q.answer === null) errors.push(`Q${n}: Missing answer`);
      else if (typeof q.answer !== 'number') errors.push(`Q${n}: Answer must be number`);
      else if (!Number.isInteger(q.answer)) errors.push(`Q${n}: Answer must be integer`);
      else if (q.answer < 0 || q.answer > 3) errors.push(`Q${n}: Answer must be 0-3`);
      
      if (!q.explanation || q.explanation.trim() === '') warnings.push(`Q${n}: No explanation`);
    }

    if (errors.length > 0) {
      alert(`❌ Validation Failed!\n\n${errors.slice(0, 8).join('\n')}${errors.length > 8 ? `\n\n...and ${errors.length - 8} more` : ''}`);
      return;
    }

    if (warnings.length > 0 && warnings.length <= 5) {
      if (!window.confirm(`⚠️ ${warnings.length} warning(s):\n\n${warnings.join('\n')}\n\nContinue?`)) return;
    }

    // Import
    const updated = [...testSeries];
    const existing = updated[selectedSeriesIdx].sections[selectedSectionIdx].tests[selectedTestIdx].questions || [];
    
    const newQuestions = questions.map(q => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      question: q.question,
      options: q.options,
      answer: q.answer,
      explanation: q.explanation || ''
    }));
    
    updated[selectedSeriesIdx].sections[selectedSectionIdx].tests[selectedTestIdx].questions = [...existing, ...newQuestions];
    
    setTestSeries(updated);
    setShowBulkUpload(false);
    setBulkJsonInput("");
    
    // Add notification
    addNotification({
      icon: "📦",
      title: "Bulk Upload Successful!",
      message: `${questions.length} question(s) imported successfully.`,
      type: "success"
    });
    
    let msg = `✅ Imported ${questions.length} question(s)!`;
    if (wasAutoFixed) msg += '\n\n🤖 JSON was auto-fixed';
    if (warnings.length > 5) msg += `\n\n⚠️ ${warnings.length} missing explanations`;
    
    alert(msg);
  };

  // ==================== AI QUESTION GENERATOR ====================

  const handleAiGenerate = async () => {
    if (!aiTopic.trim()) {
      alert("❌ Please enter a topic!");
      return;
    }

    if (aiQuestionCount < 1 || aiQuestionCount > 50) {
      alert("❌ Please enter a number between 1 and 50!");
      return;
    }

    // Show loading
    const generateBtn = document.querySelector('[data-ai-generate]');
    if (generateBtn) {
      generateBtn.textContent = "🤖 Generating...";
      generateBtn.disabled = true;
    }

    try {
      const generatedQuestions = [];
      
      // Question templates based on difficulty and type
      const templates = {
        easy: {
          factual: [
            `What is ${aiTopic}?`,
            `${aiTopic} is related to which field?`,
            `Who is associated with ${aiTopic}?`,
            `When was ${aiTopic} introduced?`,
            `Where is ${aiTopic} commonly used?`
          ],
          definition: [
            `Define ${aiTopic}.`,
            `${aiTopic} can be defined as:`,
            `The term ${aiTopic} refers to:`,
            `${aiTopic} means:`
          ],
          identification: [
            `Identify the correct statement about ${aiTopic}.`,
            `Which of the following is true about ${aiTopic}?`,
            `${aiTopic} is characterized by:`
          ]
        },
        medium: {
          conceptual: [
            `What is the main concept behind ${aiTopic}?`,
            `How does ${aiTopic} work?`,
            `Explain the principle of ${aiTopic}.`,
            `What are the key features of ${aiTopic}?`
          ],
          application: [
            `${aiTopic} is primarily used for:`,
            `In which scenario would you use ${aiTopic}?`,
            `The practical application of ${aiTopic} includes:`,
            `${aiTopic} can be applied in:`
          ],
          comparison: [
            `What is the difference between ${aiTopic} and related concepts?`,
            `Compare ${aiTopic} with similar topics.`,
            `${aiTopic} differs from others in:`
          ]
        },
        hard: {
          analytical: [
            `Analyze the impact of ${aiTopic} on modern practices.`,
            `What are the advantages and disadvantages of ${aiTopic}?`,
            `Critically evaluate ${aiTopic}.`,
            `Assess the significance of ${aiTopic}.`
          ],
          problem_solving: [
            `How would you solve a problem related to ${aiTopic}?`,
            `What approach would you take for ${aiTopic}?`,
            `In a complex scenario involving ${aiTopic}, what would be the best solution?`
          ],
          synthesis: [
            `How can ${aiTopic} be integrated with other concepts?`,
            `What is the relationship between ${aiTopic} and advanced applications?`,
            `Synthesize the key aspects of ${aiTopic}.`
          ]
        }
      };

      // Generate questions
      for (let i = 0; i < aiQuestionCount; i++) {
        const difficultyTemplates = templates[aiDifficulty];
        const typeKeys = Object.keys(difficultyTemplates);
        const selectedType = aiQuestionType === 'mixed' 
          ? typeKeys[i % typeKeys.length]
          : aiQuestionType;
        
        const questionTemplates = difficultyTemplates[selectedType] || difficultyTemplates[typeKeys[0]];
        const questionTemplate = questionTemplates[i % questionTemplates.length];
        
        // Generate question text
        let questionText = questionTemplate;
        
        // Add language prefix for Hindi
        if (aiLanguage === 'hindi') {
          questionText = `${aiTopic} के बारे में: ${questionTemplate}`;
        } else if (aiLanguage === 'bilingual') {
          questionText = `${questionTemplate} (${aiTopic} से संबंधित)`;
        }
        
        // Generate options based on difficulty
        const options = [];
        const correctIndex = Math.floor(Math.random() * 4);
        
        for (let j = 0; j < 4; j++) {
          if (j === correctIndex) {
            if (aiLanguage === 'hindi') {
              options.push(`सही उत्तर: ${aiTopic} का मुख्य पहलू ${j + 1}`);
            } else {
              options.push(`Correct: Key aspect of ${aiTopic} (Option ${j + 1})`);
            }
          } else {
            if (aiLanguage === 'hindi') {
              options.push(`विकल्प ${j + 1}: ${aiTopic} से संबंधित`);
            } else {
              options.push(`Option ${j + 1}: Related to ${aiTopic}`);
            }
          }
        }
        
        // Generate explanation based on difficulty
        let explanation = '';
        if (aiIncludeExplanation) {
          if (aiLanguage === 'hindi') {
            explanation = `यह सही उत्तर है क्योंकि ${aiTopic} इस अवधारणा से मौलिक रूप से संबंधित है। इस बुनियादी सिद्धांत को समझना विषय को समझने के लिए आवश्यक है।`;
          } else if (aiDifficulty === 'easy') {
            explanation = `This is the correct answer because ${aiTopic} fundamentally relates to this concept. Understanding this basic principle is essential.`;
          } else if (aiDifficulty === 'medium') {
            explanation = `The correct answer demonstrates a key application of ${aiTopic}. This concept shows how ${aiTopic} functions in practical scenarios.`;
          } else {
            explanation = `This answer requires deep understanding of ${aiTopic}. The reasoning involves analyzing multiple factors and synthesizing information.`;
          }
        }
        
        generatedQuestions.push({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          question: questionText,
          options: options,
          answer: correctIndex,
          explanation: explanation,
          difficulty: aiDifficulty,
          topic: aiTopic,
          generatedBy: 'AI'
        });

        // Small delay for realistic feel
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Add to current test
      const updated = [...testSeries];
      const existingQuestions = updated[selectedSeriesIdx].sections[selectedSectionIdx].tests[selectedTestIdx].questions || [];
      updated[selectedSeriesIdx].sections[selectedSectionIdx].tests[selectedTestIdx].questions = [
        ...existingQuestions,
        ...generatedQuestions
      ];
      
      setTestSeries(updated);
      setShowAiGenerator(false);
      
      // Reset form
      setAiTopic("");
      setAiQuestionCount(10);
      setAiDifficulty("medium");
      setAiLanguage("english");
      setAiQuestionType("mixed");
      setAiIncludeExplanation(true);
      
      // Add notification
      addNotification({
        icon: "🤖",
        title: "AI Questions Generated!",
        message: `${generatedQuestions.length} questions on "${aiTopic}" created successfully.`,
        type: "success"
      });
      
      let successMsg = `✅ Successfully generated ${generatedQuestions.length} questions!\n\n`;
      successMsg += `📊 Details:\n`;
      successMsg += `• Topic: ${aiTopic}\n`;
      successMsg += `• Difficulty: ${aiDifficulty}\n`;
      successMsg += `• Language: ${aiLanguage}\n`;
      successMsg += `• Type: ${aiQuestionType}\n`;
      successMsg += `• Explanations: ${aiIncludeExplanation ? 'Yes' : 'No'}\n\n`;
      successMsg += `💡 Note: Please review and customize the generated questions to match your exact requirements.`;
      
      alert(successMsg);
    } catch (error) {
      alert("❌ Error generating questions: " + error.message);
    } finally {
      if (generateBtn) {
        generateBtn.textContent = "🤖 Generate Questions";
        generateBtn.disabled = false;
      }
    }
  };

  // ==================== NAVIGATION ====================

  const goToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedSeriesIdx(null);
    setSelectedSectionIdx(null);
    setSelectedTestIdx(null);
  };

  const goToSections = (seriesIdx) => {
    setCurrentView("sections");
    setSelectedSeriesIdx(seriesIdx);
    setSelectedSectionIdx(null);
    setSelectedTestIdx(null);
  };

  const goToTests = (sectionIdx) => {
    setCurrentView("tests");
    setSelectedSectionIdx(sectionIdx);
    setSelectedTestIdx(null);
  };

  const goToQuestions = (testIdx) => {
    setCurrentView("questions");
    setSelectedTestIdx(testIdx);
  };

  // ==================== RENDER ====================

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
            🎓 Admin Panel - Test Series Management
          </h1>
          <p style={{ margin: "10px 0 0 0", color: "#64748b", fontSize: "1.1rem" }}>
            Manage Test Series → Sections → Tests → Questions
          </p>
        </div>

        {/* Breadcrumb */}
        <div style={{
          background: "#fff",
          borderRadius: "15px",
          padding: "15px 25px",
          marginBottom: "20px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap"
        }}>
          <button
            onClick={goToDashboard}
            style={{
              padding: "8px 16px",
              background: currentView === "dashboard" ? "#667eea" : "#e2e8f0",
              color: currentView === "dashboard" ? "#fff" : "#64748b",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            📊 Dashboard
          </button>

          {currentSeries && (
            <>
              <span style={{ color: "#64748b" }}>→</span>
              <button
                onClick={() => goToSections(selectedSeriesIdx)}
                style={{
                  padding: "8px 16px",
                  background: currentView === "sections" ? "#667eea" : "#e2e8f0",
                  color: currentView === "sections" ? "#fff" : "#64748b",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                📚 {currentSeries.title}
              </button>
            </>
          )}

          {currentSection && (
            <>
              <span style={{ color: "#64748b" }}>→</span>
              <button
                onClick={() => goToTests(selectedSectionIdx)}
                style={{
                  padding: "8px 16px",
                  background: currentView === "tests" ? "#667eea" : "#e2e8f0",
                  color: currentView === "tests" ? "#fff" : "#64748b",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                📂 {currentSection.title}
              </button>
            </>
          )}

          {currentTest && (
            <>
              <span style={{ color: "#64748b" }}>→</span>
              <span style={{
                padding: "8px 16px",
                background: "#667eea",
                color: "#fff",
                borderRadius: "8px",
                fontWeight: "600"
              }}>
                📝 {currentTest.title}
              </span>
            </>
          )}
        </div>

        {/* Main Content */}
        <div style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          minHeight: "400px"
        }}>

          {/* DASHBOARD VIEW */}
          {currentView === "dashboard" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                <h2 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "700", color: "#1e293b" }}>
                  📋 All Test Series
                </h2>
                <button
                  onClick={openCreateSeriesModal}
                  style={{
                    padding: "12px 24px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "1rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
                  }}
                >
                  ➕ Create Test Series
                </button>
              </div>

              {testSeries.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
                  <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📚</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "10px" }}>
                    No test series yet
                  </div>
                  <div style={{ fontSize: "1rem" }}>
                    Click "Create Test Series" to get started
                  </div>
                </div>
              ) : (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                  gap: "20px"
                }}>
                  {testSeries.map((series, idx) => (
                    <div
                      key={series.id}
                      style={{
                        background: "#f8fafc",
                        borderRadius: "15px",
                        padding: "25px",
                        border: "2px solid #e2e8f0",
                        transition: "all 0.3s ease"
                      }}
                    >
                      <div style={{
                        display: "inline-block",
                        padding: "6px 15px",
                        background: series.status === "active" ? "#10b981" : "#f59e0b",
                        color: "#fff",
                        borderRadius: "50px",
                        fontSize: "0.85rem",
                        fontWeight: "700",
                        marginBottom: "15px"
                      }}>
                        {series.status === "active" ? "✅ Active" : "📝 Draft"}
                      </div>

                      <h3 style={{ margin: "0 0 10px 0", fontSize: "1.4rem", fontWeight: "700", color: "#1e293b" }}>
                        {series.title}
                      </h3>

                      <p style={{ margin: "0 0 15px 0", color: "#64748b", fontSize: "0.95rem", lineHeight: "1.5" }}>
                        {series.description || "No description"}
                      </p>

                      {series.category && (
                        <div style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          background: "#e0e7ff",
                          color: "#667eea",
                          borderRadius: "20px",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                          marginBottom: "15px"
                        }}>
                          📂 {series.category}
                        </div>
                      )}

                      <div style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "15px" }}>
                        📚 {series.sections?.length || 0} Sections
                      </div>

                      <div style={{
                        display: "flex",
                        gap: "10px",
                        paddingTop: "15px",
                        borderTop: "1px solid #e2e8f0"
                      }}>
                        <button
                          onClick={() => goToSections(idx)}
                          style={{
                            flex: 1,
                            padding: "10px",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            cursor: "pointer",
                            fontSize: "0.9rem"
                          }}
                        >
                          Manage →
                        </button>
                        <button
                          onClick={() => openEditSeriesModal(idx)}
                          style={{
                            padding: "10px 15px",
                            background: "#3b82f6",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteSeries(idx)}
                          style={{
                            padding: "10px 15px",
                            background: "#ef4444",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* SECTIONS VIEW */}
          {currentView === "sections" && currentSeries && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                <h2 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "700", color: "#1e293b" }}>
                  📂 Sections in "{currentSeries.title}"
                </h2>
                <button
                  onClick={openCreateSectionModal}
                  style={{
                    padding: "12px 24px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "1rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
                  }}
                >
                  ➕ Create Section
                </button>
              </div>

              {(!currentSeries.sections || currentSeries.sections.length === 0) ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
                  <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📂</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "10px" }}>
                    No sections yet
                  </div>
                  <div style={{ fontSize: "1rem" }}>
                    Click "Create Section" to add sections like "Previous Year Papers", "Mock Tests", etc.
                  </div>
                </div>
              ) : (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                  gap: "20px"
                }}>
                  {currentSeries.sections.map((section, idx) => (
                    <div
                      key={section.id}
                      style={{
                        background: "#f8fafc",
                        borderRadius: "15px",
                        padding: "25px",
                        border: "2px solid #e2e8f0"
                      }}
                    >
                      <h3 style={{ margin: "0 0 10px 0", fontSize: "1.4rem", fontWeight: "700", color: "#1e293b" }}>
                        {section.title}
                      </h3>

                      <p style={{ margin: "0 0 15px 0", color: "#64748b", fontSize: "0.95rem", lineHeight: "1.5" }}>
                        {section.description || "No description"}
                      </p>

                      <div style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "15px" }}>
                        📝 {section.tests?.length || 0} Tests
                      </div>

                      <div style={{
                        display: "flex",
                        gap: "10px",
                        paddingTop: "15px",
                        borderTop: "1px solid #e2e8f0"
                      }}>
                        <button
                          onClick={() => goToTests(idx)}
                          style={{
                            flex: 1,
                            padding: "10px",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            cursor: "pointer",
                            fontSize: "0.9rem"
                          }}
                        >
                          Manage Tests →
                        </button>
                        <button
                          onClick={() => openEditSectionModal(idx)}
                          style={{
                            padding: "10px 15px",
                            background: "#3b82f6",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteSection(idx)}
                          style={{
                            padding: "10px 15px",
                            background: "#ef4444",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* TESTS VIEW */}
          {currentView === "tests" && currentSection && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                <h2 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "700", color: "#1e293b" }}>
                  📝 Tests in "{currentSection.title}"
                </h2>
                <button
                  onClick={openCreateTestModal}
                  style={{
                    padding: "12px 24px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "1rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
                  }}
                >
                  ➕ Create Test
                </button>
              </div>

              {(!currentSection.tests || currentSection.tests.length === 0) ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
                  <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📝</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "10px" }}>
                    No tests yet
                  </div>
                  <div style={{ fontSize: "1rem" }}>
                    Click "Create Test" to add tests to this section
                  </div>
                </div>
              ) : (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                  gap: "20px"
                }}>
                  {currentSection.tests.map((test, idx) => (
                    <div
                      key={test.id}
                      style={{
                        background: "#f8fafc",
                        borderRadius: "15px",
                        padding: "25px",
                        border: "2px solid #e2e8f0"
                      }}
                    >
                      <div style={{
                        display: "inline-block",
                        padding: "6px 15px",
                        background: test.status === "active" ? "#10b981" : "#f59e0b",
                        color: "#fff",
                        borderRadius: "50px",
                        fontSize: "0.85rem",
                        fontWeight: "700",
                        marginBottom: "15px"
                      }}>
                        {test.status === "active" ? "✅ Active" : "📝 Draft"}
                      </div>

                      <h3 style={{ margin: "0 0 10px 0", fontSize: "1.4rem", fontWeight: "700", color: "#1e293b" }}>
                        {test.title}
                      </h3>

                      <div style={{ display: "flex", gap: "15px", marginBottom: "15px", flexWrap: "wrap" }}>
                        <div style={{ color: "#64748b", fontSize: "0.9rem" }}>
                          ⏱️ {test.duration} min
                        </div>
                        <div style={{ color: "#64748b", fontSize: "0.9rem" }}>
                          ❓ {test.questions?.length || 0} Questions
                        </div>
                        <div style={{ color: "#64748b", fontSize: "0.9rem" }}>
                          ✅ +{test.marksPerQuestion} marks
                        </div>
                        <div style={{ color: "#64748b", fontSize: "0.9rem" }}>
                          ❌ -{test.negativeMarking} marks
                        </div>
                      </div>

                      <div style={{
                        display: "flex",
                        gap: "10px",
                        paddingTop: "15px",
                        borderTop: "1px solid #e2e8f0"
                      }}>
                        <button
                          onClick={() => goToQuestions(idx)}
                          style={{
                            flex: 1,
                            padding: "10px",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            cursor: "pointer",
                            fontSize: "0.9rem"
                          }}
                        >
                          Manage Questions →
                        </button>
                        <button
                          onClick={() => openEditTestModal(idx)}
                          style={{
                            padding: "10px 15px",
                            background: "#3b82f6",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteTest(idx)}
                          style={{
                            padding: "10px 15px",
                            background: "#ef4444",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* QUESTIONS VIEW */}
          {currentView === "questions" && currentTest && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "15px" }}>
                <h2 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "700", color: "#1e293b" }}>
                  ❓ Questions in "{currentTest.title}"
                </h2>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {!bulkDeleteMode ? (
                    <>
                      <button
                        onClick={openCreateQuestionModal}
                        style={{
                          padding: "12px 24px",
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "10px",
                          fontSize: "1rem",
                          fontWeight: "700",
                          cursor: "pointer",
                          boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
                        }}
                      >
                        ➕ Add Question
                      </button>
                      <button
                        onClick={() => setShowBulkUpload(true)}
                        style={{
                          padding: "12px 24px",
                          background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "10px",
                          fontSize: "1rem",
                          fontWeight: "700",
                          cursor: "pointer",
                          boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)"
                        }}
                      >
                        📦 Bulk Upload (JSON)
                      </button>
                      <button
                        onClick={() => setShowAiGenerator(true)}
                        style={{
                          padding: "12px 24px",
                          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "10px",
                          fontSize: "1rem",
                          fontWeight: "700",
                          cursor: "pointer",
                          boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)"
                        }}
                      >
                        🤖 AI Generate Questions
                      </button>
                      {currentTest.questions && currentTest.questions.length > 0 && (
                        <button
                          onClick={() => {
                            setBulkDeleteMode(true);
                            setSelectedQuestions([]);
                          }}
                          style={{
                            padding: "12px 24px",
                            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            fontSize: "1rem",
                            fontWeight: "700",
                            cursor: "pointer",
                            boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)"
                          }}
                        >
                          🗑️ Bulk Delete
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <button
                        onClick={selectAllQuestions}
                        style={{
                          padding: "12px 24px",
                          background: selectedQuestions.length === currentTest.questions.length ? "#3b82f6" : "#e2e8f0",
                          color: selectedQuestions.length === currentTest.questions.length ? "#fff" : "#64748b",
                          border: "none",
                          borderRadius: "10px",
                          fontSize: "1rem",
                          fontWeight: "700",
                          cursor: "pointer"
                        }}
                      >
                        {selectedQuestions.length === currentTest.questions.length ? "✓ Deselect All" : "☐ Select All"}
                      </button>
                      <button
                        onClick={handleBulkDelete}
                        disabled={selectedQuestions.length === 0}
                        style={{
                          padding: "12px 24px",
                          background: selectedQuestions.length === 0 ? "#e2e8f0" : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                          color: selectedQuestions.length === 0 ? "#94a3b8" : "#fff",
                          border: "none",
                          borderRadius: "10px",
                          fontSize: "1rem",
                          fontWeight: "700",
                          cursor: selectedQuestions.length === 0 ? "not-allowed" : "pointer",
                          boxShadow: selectedQuestions.length === 0 ? "none" : "0 4px 15px rgba(239, 68, 68, 0.4)"
                        }}
                      >
                        🗑️ Delete Selected ({selectedQuestions.length})
                      </button>
                      <button
                        onClick={() => {
                          setBulkDeleteMode(false);
                          setSelectedQuestions([]);
                        }}
                        style={{
                          padding: "12px 24px",
                          background: "#e2e8f0",
                          color: "#64748b",
                          border: "none",
                          borderRadius: "10px",
                          fontSize: "1rem",
                          fontWeight: "700",
                          cursor: "pointer"
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>

              {(!currentTest.questions || currentTest.questions.length === 0) ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
                  <div style={{ fontSize: "4rem", marginBottom: "20px" }}>❓</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "10px" }}>
                    No questions yet
                  </div>
                  <div style={{ fontSize: "1rem" }}>
                    Add questions manually, use bulk upload, or generate with AI
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  {currentTest.questions.map((question, idx) => (
                    <div
                      key={question.id}
                      style={{
                        background: "#f8fafc",
                        borderRadius: "15px",
                        padding: "25px",
                        border: bulkDeleteMode && selectedQuestions.includes(idx) ? "3px solid #667eea" : "2px solid #e2e8f0",
                        position: "relative"
                      }}
                    >
                      {bulkDeleteMode && (
                        <div style={{
                          position: "absolute",
                          top: "15px",
                          left: "15px",
                          zIndex: 10
                        }}>
                          <input
                            type="checkbox"
                            checked={selectedQuestions.includes(idx)}
                            onChange={() => toggleQuestionSelection(idx)}
                            style={{
                              width: "24px",
                              height: "24px",
                              cursor: "pointer",
                              accentColor: "#667eea"
                            }}
                          />
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "15px", marginLeft: bulkDeleteMode ? "40px" : "0" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: "700", color: "#667eea", marginBottom: "10px" }}>
                            Q{idx + 1}.
                          </div>
                          <div style={{ fontSize: "1.1rem", fontWeight: "600", color: "#1e293b", marginBottom: "15px" }}>
                            {question.question}
                          </div>

                          {question.image && (
                            <div style={{ marginBottom: "15px" }}>
                              <img 
                                src={question.image} 
                                alt="Question" 
                                style={{ 
                                  maxWidth: "100%", 
                                  maxHeight: "300px", 
                                  borderRadius: "10px",
                                  border: "2px solid #e2e8f0"
                                }} 
                              />
                            </div>
                          )}

                          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "15px" }}>
                            {question.options.map((option, optIdx) => (
                              <div
                                key={optIdx}
                                style={{
                                  padding: "10px 15px",
                                  background: optIdx === question.answer ? "#d1fae5" : "#fff",
                                  border: `2px solid ${optIdx === question.answer ? "#10b981" : "#e2e8f0"}`,
                                  borderRadius: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px"
                                }}
                              >
                                <span style={{ fontWeight: "700", color: optIdx === question.answer ? "#10b981" : "#64748b" }}>
                                  {String.fromCharCode(65 + optIdx)}.
                                </span>
                                <span style={{ color: "#1e293b" }}>{option}</span>
                                {optIdx === question.answer && (
                                  <span style={{ marginLeft: "auto", color: "#10b981", fontWeight: "700" }}>✓ Correct</span>
                                )}
                              </div>
                            ))}
                          </div>

                          {question.explanation && (
                            <div style={{
                              padding: "12px",
                              background: "#fef3c7",
                              border: "2px solid #fbbf24",
                              borderRadius: "8px",
                              fontSize: "0.9rem",
                              color: "#92400e"
                            }}>
                              <strong>💡 Explanation:</strong> {question.explanation}
                            </div>
                          )}
                        </div>

                        {!bulkDeleteMode && (
                          <div style={{ display: "flex", gap: "8px", marginLeft: "15px" }}>
                            <button
                              onClick={() => openEditQuestionModal(idx)}
                              style={{
                                padding: "8px 12px",
                                background: "#3b82f6",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                fontWeight: "600",
                                cursor: "pointer",
                                fontSize: "0.9rem"
                              }}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(idx)}
                              style={{
                                padding: "8px 12px",
                                background: "#ef4444",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                fontWeight: "600",
                                cursor: "pointer",
                                fontSize: "0.9rem"
                              }}
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* MODALS */}
      
      {/* Test Series Modal */}
      {showModal && (modalType === "create-series" || modalType === "edit-series") && (
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
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "40px",
            maxWidth: "600px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <h2 style={{ margin: "0 0 25px 0", fontSize: "2rem", fontWeight: "800", color: "#1e293b" }}>
              {modalType === "create-series" ? "➕ Create Test Series" : "✏️ Edit Test Series"}
            </h2>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Title *
              </label>
              <input
                type="text"
                value={seriesTitle}
                onChange={(e) => setSeriesTitle(e.target.value)}
                placeholder="e.g., Lekhpal 2026 Test Series"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem"
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Description
              </label>
              <textarea
                value={seriesDescription}
                onChange={(e) => setSeriesDescription(e.target.value)}
                placeholder="Brief description"
                rows="3"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                  resize: "vertical"
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Category
              </label>
              <input
                type="text"
                value={seriesCategory}
                onChange={(e) => setSeriesCategory(e.target.value)}
                placeholder="e.g., UPSSSC Lekhpal"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem"
                }}
              />
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Status
              </label>
              <select
                value={seriesStatus}
                onChange={(e) => setSeriesStatus(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                  cursor: "pointer"
                }}
              >
                <option value="active">✅ Active</option>
                <option value="draft">📝 Draft</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <button
                onClick={modalType === "create-series" ? handleCreateSeries : handleUpdateSeries}
                style={{
                  flex: 1,
                  padding: "15px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                {modalType === "create-series" ? "✅ Create" : "💾 Update"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: "15px",
                  background: "#e2e8f0",
                  color: "#64748b",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section Modal */}
      {showModal && (modalType === "create-section" || modalType === "edit-section") && (
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
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "40px",
            maxWidth: "600px",
            width: "100%"
          }}>
            <h2 style={{ margin: "0 0 25px 0", fontSize: "2rem", fontWeight: "800", color: "#1e293b" }}>
              {modalType === "create-section" ? "➕ Create Section" : "✏️ Edit Section"}
            </h2>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Section Title *
              </label>
              <input
                type="text"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                placeholder="e.g., Previous Year Papers"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem"
                }}
              />
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Description
              </label>
              <textarea
                value={sectionDescription}
                onChange={(e) => setSectionDescription(e.target.value)}
                placeholder="Brief description"
                rows="3"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                  resize: "vertical"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <button
                onClick={modalType === "create-section" ? handleCreateSection : handleUpdateSection}
                style={{
                  flex: 1,
                  padding: "15px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                {modalType === "create-section" ? "✅ Create" : "💾 Update"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: "15px",
                  background: "#e2e8f0",
                  color: "#64748b",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Modal */}
      {showModal && (modalType === "create-test" || modalType === "edit-test") && (
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
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "40px",
            maxWidth: "600px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <h2 style={{ margin: "0 0 25px 0", fontSize: "2rem", fontWeight: "800", color: "#1e293b" }}>
              {modalType === "create-test" ? "➕ Create Test" : "✏️ Edit Test"}
            </h2>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Test Title *
              </label>
              <input
                type="text"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                placeholder="e.g., Lekhpal 2024 Paper"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem"
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={testDuration}
                  onChange={(e) => setTestDuration(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "2px solid #e2e8f0",
                    fontSize: "1rem"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                  Marks per Question
                </label>
                <input
                  type="number"
                  step="0.25"
                  value={testMarksPerQuestion}
                  onChange={(e) => setTestMarksPerQuestion(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "2px solid #e2e8f0",
                    fontSize: "1rem"
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Negative Marking
              </label>
              <input
                type="number"
                step="0.25"
                value={testNegativeMarking}
                onChange={(e) => setTestNegativeMarking(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem"
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Instructions
              </label>
              <textarea
                value={testInstructions}
                onChange={(e) => setTestInstructions(e.target.value)}
                placeholder="Test instructions..."
                rows="3"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                  resize: "vertical"
                }}
              />
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Status
              </label>
              <select
                value={testStatus}
                onChange={(e) => setTestStatus(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                  cursor: "pointer"
                }}
              >
                <option value="active">✅ Active</option>
                <option value="draft">📝 Draft</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <button
                onClick={modalType === "create-test" ? handleCreateTest : handleUpdateTest}
                style={{
                  flex: 1,
                  padding: "15px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                {modalType === "create-test" ? "✅ Create" : "💾 Update"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: "15px",
                  background: "#e2e8f0",
                  color: "#64748b",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Modal */}
      {showModal && (modalType === "create-question" || modalType === "edit-question") && (
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
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "40px",
            maxWidth: "700px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <h2 style={{ margin: "0 0 25px 0", fontSize: "2rem", fontWeight: "800", color: "#1e293b" }}>
              {modalType === "create-question" ? "➕ Add Question" : "✏️ Edit Question"}
            </h2>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Question *
              </label>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Enter your question here..."
                rows="3"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                  resize: "vertical"
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "12px", fontWeight: "600", color: "#1e293b" }}>
                Options * (4 required)
              </label>
              {options.map((option, idx) => (
                <div key={idx} style={{ marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontWeight: "700", color: "#667eea", minWidth: "30px" }}>
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...options];
                        newOptions[idx] = e.target.value;
                        setOptions(newOptions);
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: "2px solid #e2e8f0",
                        fontSize: "1rem"
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Correct Answer *
              </label>
              <select
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                  cursor: "pointer"
                }}
              >
                <option value={0}>A - {options[0] || "Option A"}</option>
                <option value={1}>B - {options[1] || "Option B"}</option>
                <option value={2}>C - {options[2] || "Option C"}</option>
                <option value={3}>D - {options[3] || "Option D"}</option>
              </select>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Question Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    // Check file size (50KB = 51200 bytes)
                    if (file.size > 51200) {
                      alert("❌ Image size must be less than 50KB!\n\nCurrent size: " + (file.size / 1024).toFixed(2) + "KB");
                      e.target.value = "";
                      return;
                    }

                    // Convert to base64
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setQuestionImage(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                  cursor: "pointer"
                }}
              />
              {questionImage && (
                <div style={{ marginTop: "15px", position: "relative" }}>
                  <img 
                    src={questionImage} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: "100%", 
                      maxHeight: "250px", 
                      borderRadius: "8px",
                      border: "2px solid #10b981",
                      display: "block"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setQuestionImage("")}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      padding: "8px 12px",
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontSize: "0.9rem"
                    }}
                  >
                    🗑️ Remove
                  </button>
                </div>
              )}
              <div style={{
                marginTop: "8px",
                padding: "10px",
                background: "#dbeafe",
                borderRadius: "6px",
                fontSize: "0.85rem",
                color: "#1e40af"
              }}>
                📌 Max file size: 50KB | Supported: JPG, PNG, GIF, WebP
              </div>
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Explanation (Optional)
              </label>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Explain why this is the correct answer..."
                rows="3"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                  resize: "vertical"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <button
                onClick={modalType === "create-question" ? handleCreateQuestion : handleUpdateQuestion}
                style={{
                  flex: 1,
                  padding: "15px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                {modalType === "create-question" ? "✅ Add" : "💾 Update"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: "15px",
                  background: "#e2e8f0",
                  color: "#64748b",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal with AI Error Detection */}
      {showBulkUpload && (
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
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "40px",
            maxWidth: "800px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <h2 style={{ margin: "0 0 25px 0", fontSize: "2rem", fontWeight: "800", color: "#1e293b" }}>
              📦 Bulk Upload Questions (JSON)
            </h2>

            <div style={{
              marginBottom: "20px",
              padding: "15px",
              background: "#e0f2fe",
              border: "2px solid #0ea5e9",
              borderRadius: "10px",
              fontSize: "0.9rem",
              color: "#0c4a6e"
            }}>
              <strong>📋 JSON Format:</strong>
              <pre style={{ 
                margin: "10px 0 0 0", 
                padding: "10px", 
                background: "#fff", 
                borderRadius: "5px",
                fontSize: "0.85rem",
                overflow: "auto"
              }}>
{`[
  {
    "question": "Your question here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": 0,
    "explanation": "Explanation here"
  }
]`}
              </pre>
              <div style={{ marginTop: "10px", fontSize: "0.85rem" }}>
                • <strong>answer</strong> must be 0-3 (0=A, 1=B, 2=C, 3=D)<br/>
                • <strong>options</strong> must have exactly 4 items<br/>
                • <strong>explanation</strong> is optional
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Paste JSON Data
              </label>
              <textarea
                value={bulkJsonInput}
                onChange={(e) => setBulkJsonInput(e.target.value)}
                placeholder='[{"question": "...", "options": [...], "answer": 0, "explanation": "..."}]'
                rows="12"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "0.9rem",
                  fontFamily: "monospace",
                  resize: "vertical"
                }}
              />
            </div>

            {/* AI Error Detection Buttons */}
            <div style={{ 
              display: "flex", 
              gap: "10px", 
              marginBottom: "20px",
              padding: "15px",
              background: "#f8fafc",
              borderRadius: "10px",
              border: "2px solid #e2e8f0"
            }}>
              <button
                onClick={() => {
                  const result = findJsonErrors(bulkJsonInput);
                  if (result.hasErrors) {
                    alert(`🔍 Found ${result.totalErrors || result.errors.length} Error(s):\n\n${result.errors.join('\n')}`);
                  } else {
                    alert(result.message);
                  }
                }}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)"
                }}
              >
                🔍 Find Errors
              </button>
              <button
                onClick={() => {
                  const result = autoFixJson(bulkJsonInput);
                  if (result.success) {
                    setBulkJsonInput(result.fixedJson);
                    alert(`✅ Auto-Fixed Successfully!\n\n${result.totalFixes} Fix(es) Applied:\n\n${result.fixes.join('\n')}\n\n✨ JSON updated in textarea!`);
                  } else {
                    alert(`❌ Auto-Fix Failed!\n\nError: ${result.error}\n\n${result.attemptedFixes ? `Attempted ${result.attemptedFixes} fix(es):\n${result.fixes.join('\n')}` : ''}\n\n💡 Try fixing manually or check the format.`);
                  }
                }}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)"
                }}
              >
                🤖 Auto-Fix Errors
              </button>
            </div>

            <div style={{
              marginBottom: "20px",
              padding: "12px",
              background: "#fef3c7",
              border: "2px solid #fbbf24",
              borderRadius: "8px",
              fontSize: "0.85rem",
              color: "#92400e"
            }}>
              <strong>🤖 AI Features:</strong><br/>
              • <strong>Find Errors:</strong> Detects 10+ types of JSON errors<br/>
              • <strong>Auto-Fix:</strong> Fixes errors automatically with 19 algorithms<br/>
              • Handles: quotes, commas, brackets, comments, and more
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <button
                onClick={handleBulkUpload}
                style={{
                  flex: 2,
                  padding: "15px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
                }}
              >
                📤 Import Questions
              </button>
              <button
                onClick={() => {
                  setShowBulkUpload(false);
                  setBulkJsonInput("");
                }}
                style={{
                  flex: 1,
                  padding: "15px",
                  background: "#e2e8f0",
                  color: "#64748b",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced AI Generator Modal */}
      {showAiGenerator && (
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
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "40px",
            maxWidth: "600px",
            width: "100%"
          }}>
            <h2 style={{ margin: "0 0 25px 0", fontSize: "2rem", fontWeight: "800", color: "#1e293b" }}>
              🤖 AI Question Generator
            </h2>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Topic
              </label>
              <input
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="e.g., Indian History, Mathematics"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem"
                }}
              />
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Number of Questions (1-50)
              </label>
              <input
                type="number"
                value={aiQuestionCount}
                onChange={(e) => setAiQuestionCount(Number(e.target.value))}
                min="1"
                max="50"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem"
                }}
              />
            </div>

            {/* Difficulty Level */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Difficulty Level
              </label>
              <select
                value={aiDifficulty}
                onChange={(e) => setAiDifficulty(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                  cursor: "pointer"
                }}
              >
                <option value="easy">🟢 Easy - Basic concepts</option>
                <option value="medium">🟡 Medium - Conceptual</option>
                <option value="hard">🔴 Hard - Analytical</option>
              </select>
            </div>

            {/* Language */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Language
              </label>
              <select
                value={aiLanguage}
                onChange={(e) => setAiLanguage(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                  cursor: "pointer"
                }}
              >
                <option value="english">🇬🇧 English</option>
                <option value="hindi">🇮🇳 Hindi</option>
                <option value="bilingual">🌐 Bilingual</option>
              </select>
            </div>

            {/* Question Type */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1e293b" }}>
                Question Type
              </label>
              <select
                value={aiQuestionType}
                onChange={(e) => setAiQuestionType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                  cursor: "pointer"
                }}
              >
                <option value="mixed">🎲 Mixed</option>
                <option value="factual">📚 Factual</option>
                <option value="conceptual">💡 Conceptual</option>
                <option value="application">🔧 Application</option>
                <option value="analytical">🔍 Analytical</option>
              </select>
            </div>

            {/* Include Explanation */}
            <div style={{ marginBottom: "30px" }}>
              <label style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "10px",
                cursor: "pointer",
                padding: "12px",
                background: "#f8fafc",
                borderRadius: "8px"
              }}>
                <input
                  type="checkbox"
                  checked={aiIncludeExplanation}
                  onChange={(e) => setAiIncludeExplanation(e.target.checked)}
                  style={{ width: "20px", height: "20px", cursor: "pointer" }}
                />
                <span style={{ fontWeight: "600", color: "#1e293b" }}>
                  Include explanations
                </span>
              </label>
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <button
                onClick={handleAiGenerate}
                data-ai-generate
                style={{
                  flex: 2,
                  padding: "15px",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)"
                }}
              >
                🤖 Generate Questions
              </button>
              <button
                onClick={() => {
                  setShowAiGenerator(false);
                  setAiTopic("");
                  setAiQuestionCount(10);
                  setAiDifficulty("medium");
                  setAiLanguage("english");
                  setAiQuestionType("mixed");
                  setAiIncludeExplanation(true);
                }}
                style={{
                  flex: 1,
                  padding: "15px",
                  background: "#e2e8f0",
                  color: "#64748b",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>

            <div style={{
              marginTop: "20px",
              padding: "15px",
              background: "#fef3c7",
              border: "2px solid #fbbf24",
              borderRadius: "10px",
              fontSize: "0.9rem",
              color: "#92400e"
            }}>
              <strong>📝 Note:</strong> AI generates template questions. Please review and customize them for accuracy.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
