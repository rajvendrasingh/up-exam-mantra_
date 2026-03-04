import { useContext, useState } from "react";
import { TestSeriesContext } from "./TestSeriesContext";

export default function Admin() {
  const { testSeries, setTestSeries } = useContext(TestSeriesContext);
  
  // Test Series States
  const [seriesName, setSeriesName] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [duration, setDuration] = useState(30);
  const [instructions, setInstructions] = useState("");
  const [negativeMarking, setNegativeMarking] = useState(0.25);
  const [marksPerQuestion, setMarksPerQuestion] = useState(1);
  const [totalMarks, setTotalMarks] = useState(0);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedSet, setSelectedSet] = useState(null);
  const [sectionName, setSectionName] = useState("");
  const [setName, setSetName] = useState("");
  const [setYear, setSetYear] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", "", ""]);
  const [answer, setAnswer] = useState(0);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [seriesJsonInput, setSeriesJsonInput] = useState("");
  const [showSeriesJsonImport, setShowSeriesJsonImport] = useState(false);
  const [showSeriesAiGenerator, setShowSeriesAiGenerator] = useState(false);
  const [seriesAiTopic, setSeriesAiTopic] = useState("");
  const [seriesAiQuestionCount, setSeriesAiQuestionCount] = useState(10);
  const [viewMode, setViewMode] = useState("series"); // "series", "sections", "sets", "questions"
  
  // Set Questions JSON/AI states (for sections/sets feature)
  const [sectionSetJsonInput, setSectionSetJsonInput] = useState("");
  const [showSetJsonImport, setShowSetJsonImport] = useState(false);
  const [showSetAiGenerator, setShowSetAiGenerator] = useState(false);
  const [sectionSetAiTopic, setSectionSetAiTopic] = useState("");
  const [sectionSetAiQuestionCount, setSectionSetAiQuestionCount] = useState(10);
      setSubjects(updated);
      if (selectedSubject === idx) setSelectedSubject(null);
      alert("Subject deleted and unlinked from test series!");
    }
  };

  const selectSubject = (idx) => {
    setSelectedSubject(idx);
    setSubjectQuestion("");
    setSubjectOptions(["", "", "", "", ""]);
    setSubjectAnswer(0);
    setEditingSubjectQuestion(null);
  };

  const addSubjectQuestion = () => {
    if (!subjectQuestion.trim()) {
      alert("Please enter a question!");
      return;
    }
    if (subjectOptions.some(opt => !opt.trim())) {
      alert("Please fill all options!");
      return;
    }

    const updated = [...subjects];
    if (!updated[selectedSubject].questions) {
      updated[selectedSubject].questions = [];
    }

    if (editingSubjectQuestion !== null) {
      updated[selectedSubject].questions[editingSubjectQuestion] = {
        q: subjectQuestion,
        options: subjectOptions,
        answer: Number(subjectAnswer)
      };
      setEditingSubjectQuestion(null);
      alert("Question updated!");
    } else {
      updated[selectedSubject].questions.push({
        q: subjectQuestion,
        options: subjectOptions,
        answer: Number(subjectAnswer)
      });
      alert("Question added!");
    }
    
    setSubjects(updated);
    setSubjectQuestion("");
    setSubjectOptions(["", "", "", "", ""]);
    setSubjectAnswer(0);
  };

  const editSubjectQuestion = (qIdx) => {
    const q = subjects[selectedSubject].questions[qIdx];
    setSubjectQuestion(q.q);
    setSubjectOptions([...q.options]);
    setSubjectAnswer(q.answer);
    setEditingSubjectQuestion(qIdx);
  };

  const deleteSubjectQuestion = (qIdx) => {
    if (window.confirm("Delete this question?")) {
      const updated = [...subjects];
      updated[selectedSubject].questions.splice(qIdx, 1);
      setSubjects(updated);
      alert("Question deleted!");
    }
  };

  const importQuestionsFromJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      
      // Validate JSON structure
      if (!Array.isArray(parsed)) {
        alert("JSON must be an array of questions!");
        return;
      }

      // Validate each question
      for (let i = 0; i < parsed.length; i++) {
        const q = parsed[i];
        if (!q.q || !q.options || !Array.isArray(q.options) || q.options.length !== 5 || typeof q.answer !== "number") {
          alert(`Invalid question format at index ${i}. Each question must have: q (string), options (array of 5 strings), answer (number 0-4)`);
          return;
        }
      }

      // Add all questions
      const updated = [...subjects];
      if (!updated[selectedSubject].questions) {
        updated[selectedSubject].questions = [];
      }
      updated[selectedSubject].questions.push(...parsed);
      setSubjects(updated);
      
      alert(`Successfully imported ${parsed.length} questions!`);
      setJsonInput("");
      setShowJsonImport(false);
    } catch (error) {
      alert("Invalid JSON format! Please check your JSON syntax.\n\nError: " + error.message);
    }
  };

  const convertTextToJson = () => {
    try {
      const text = jsonInput.trim();
      
      // Check if it's already JSON format
      if (text.startsWith('[') || text.startsWith('{')) {
        alert("This looks like JSON already! Use 'AI Auto-Fix' instead to fix JSON errors.");
        return;
      }

      const questions = [];
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      
      let currentQuestion = null;
      let currentOptions = [];
      let questionNumber = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Detect question patterns
        // Pattern 1: "Q1.", "Q.1", "1.", "1)", "Question 1:"
        const questionMatch = line.match(/^(?:Q\.?\s*\d+[\.\):]?|Question\s*\d+[\.\):]?|\d+[\.\)])\s*(.+)/i);
        
        // Pattern 2: Just a line that doesn't start with option markers
        const isQuestion = questionMatch || (!line.match(/^[A-E][\.\)]/i) && !line.match(/^(?:Answer|Ans|Correct)[\s:]/i));
        
        // Detect option patterns: "A.", "A)", "a.", "a)"
        const optionMatch = line.match(/^([A-E])[\.\)]\s*(.+)/i);
        
        // Detect answer patterns: "Answer: B", "Ans: 2", "Correct: B"
        const answerMatch = line.match(/^(?:Answer|Ans|Correct)[\s:]+([A-E]|\d+)/i);

        if (questionMatch && currentQuestion) {
          // Save previous question
          if (currentOptions.length > 0) {
            while (currentOptions.length < 5) {
              currentOptions.push(`Option ${currentOptions.length + 1}`);
            }
            questions.push({
              q: currentQuestion,
              options: currentOptions.slice(0, 5),
              answer: 0
            });
          }
          currentQuestion = questionMatch[1].trim();
          currentOptions = [];
        } else if (isQuestion && !optionMatch && !answerMatch) {
          // New question without number
          if (currentQuestion && currentOptions.length > 0) {
            while (currentOptions.length < 5) {
              currentOptions.push(`Option ${currentOptions.length + 1}`);
            }
            questions.push({
              q: currentQuestion,
              options: currentOptions.slice(0, 5),
              answer: 0
            });
          }
          currentQuestion = line;
          currentOptions = [];
        } else if (optionMatch) {
          // Option found
          currentOptions.push(optionMatch[2].trim());
        } else if (answerMatch && questions.length > 0) {
          // Answer found for last question
          const answerValue = answerMatch[1].toUpperCase();
          let answerIndex = 0;
          
          if (answerValue >= 'A' && answerValue <= 'E') {
            answerIndex = answerValue.charCodeAt(0) - 'A'.charCodeAt(0);
          } else if (!isNaN(answerValue)) {
            answerIndex = parseInt(answerValue) - 1;
          }
          
          questions[questions.length - 1].answer = Math.max(0, Math.min(4, answerIndex));
        }
      }

      // Save last question
      if (currentQuestion && currentOptions.length > 0) {
        while (currentOptions.length < 5) {
          currentOptions.push(`Option ${currentOptions.length + 1}`);
        }
        questions.push({
          q: currentQuestion,
          options: currentOptions.slice(0, 5),
          answer: 0
        });
      }

      if (questions.length === 0) {
        alert("❌ Could not detect any questions!\n\nSupported formats:\n" +
              "• Q1. Question text?\n" +
              "• A. Option 1\n" +
              "• B. Option 2\n" +
              "• Answer: B\n\n" +
              "Or:\n" +
              "• 1. Question text?\n" +
              "• a) Option 1\n" +
              "• b) Option 2\n" +
              "• Ans: 2");
        return;
      }

      // Convert to JSON and update input
      const json = JSON.stringify(questions, null, 2);
      setJsonInput(json);
      
      alert(`🎉 Success!\n\n` +
            `✓ Converted ${questions.length} question(s) to JSON format!\n` +
            `✓ Auto-completed missing options\n` +
            `✓ Formatted and beautified\n\n` +
            `Review the JSON and click 'Import All Questions' to proceed.`);

    } catch (error) {
      alert("❌ Conversion Error:\n\n" + error.message + "\n\nPlease check your text format.");
    }
  };

  const convertSeriesTextToJson = () => {
    try {
      const text = seriesJsonInput.trim();
      
      if (text.startsWith('[') || text.startsWith('{')) {
        alert("This looks like JSON already! Use 'AI Auto-Fix' instead to fix JSON errors.");
        return;
      }

      const questions = [];
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      
      let currentQuestion = null;
      let currentOptions = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        const questionMatch = line.match(/^(?:Q\.?\s*\d+[\.\):]?|Question\s*\d+[\.\):]?|\d+[\.\)])\s*(.+)/i);
        const isQuestion = questionMatch || (!line.match(/^[A-E][\.\)]/i) && !line.match(/^(?:Answer|Ans|Correct)[\s:]/i));
        const optionMatch = line.match(/^([A-E])[\.\)]\s*(.+)/i);
        const answerMatch = line.match(/^(?:Answer|Ans|Correct)[\s:]+([A-E]|\d+)/i);

        if (questionMatch && currentQuestion) {
          if (currentOptions.length > 0) {
            while (currentOptions.length < 5) {
              currentOptions.push(`Option ${currentOptions.length + 1}`);
            }
            questions.push({
              q: currentQuestion,
              options: currentOptions.slice(0, 5),
              answer: 0
            });
          }
          currentQuestion = questionMatch[1].trim();
          currentOptions = [];
        } else if (isQuestion && !optionMatch && !answerMatch) {
          if (currentQuestion && currentOptions.length > 0) {
            while (currentOptions.length < 5) {
              currentOptions.push(`Option ${currentOptions.length + 1}`);
            }
            questions.push({
              q: currentQuestion,
              options: currentOptions.slice(0, 5),
              answer: 0
            });
          }
          currentQuestion = line;
          currentOptions = [];
        } else if (optionMatch) {
          currentOptions.push(optionMatch[2].trim());
        } else if (answerMatch && questions.length > 0) {
          const answerValue = answerMatch[1].toUpperCase();
          let answerIndex = 0;
          
          if (answerValue >= 'A' && answerValue <= 'E') {
            answerIndex = answerValue.charCodeAt(0) - 'A'.charCodeAt(0);
          } else if (!isNaN(answerValue)) {
            answerIndex = parseInt(answerValue) - 1;
          }
          
          questions[questions.length - 1].answer = Math.max(0, Math.min(4, answerIndex));
        }
      }

      if (currentQuestion && currentOptions.length > 0) {
        while (currentOptions.length < 5) {
          currentOptions.push(`Option ${currentOptions.length + 1}`);
        }
        questions.push({
          q: currentQuestion,
          options: currentOptions.slice(0, 5),
          answer: 0
        });
      }

      if (questions.length === 0) {
        alert("❌ Could not detect any questions!\n\nSupported formats:\n" +
              "• Q1. Question text?\n" +
              "• A. Option 1\n" +
              "• B. Option 2\n" +
              "• Answer: B\n\n" +
              "Or:\n" +
              "• 1. Question text?\n" +
              "• a) Option 1\n" +
              "• b) Option 2\n" +
              "• Ans: 2");
        return;
      }

      const json = JSON.stringify(questions, null, 2);
      setSeriesJsonInput(json);
      
      alert(`🎉 Success!\n\n` +
            `✓ Converted ${questions.length} question(s) to JSON format!\n` +
            `✓ Auto-completed missing options\n` +
            `✓ Formatted and beautified\n\n` +
            `Review the JSON and click 'Import All Questions' to proceed.`);

    } catch (error) {
      alert("❌ Conversion Error:\n\n" + error.message + "\n\nPlease check your text format.");
    }
  };

  // AI Question Generator
  const generateQuestionsWithAI = () => {
    if (!aiTopic.trim()) {
      alert("Please enter a topic!");
      return;
    }
    if (aiQuestionCount < 1 || aiQuestionCount > 100) {
      alert("Please enter a valid number of questions (1-100)!");
      return;
    }

    const questions = [];
    const topic = aiTopic.trim();
    
    // Generate questions based on topic
    for (let i = 0; i < aiQuestionCount; i++) {
      const questionTemplates = [
        `What is the main concept of ${topic}?`,
        `Which of the following is true about ${topic}?`,
        `${topic} is primarily related to which field?`,
        `What is the importance of ${topic}?`,
        `Which statement best describes ${topic}?`,
        `In the context of ${topic}, which is correct?`,
        `${topic} can be defined as:`,
        `The key feature of ${topic} is:`,
        `Which of the following applies to ${topic}?`,
        `What is the primary use of ${topic}?`
      ];
      
      const optionTemplates = [
        `Correct answer about ${topic}`,
        `Incorrect option 1`,
        `Incorrect option 2`,
        `Incorrect option 3`,
        `Incorrect option 4`
      ];
      
      const questionText = questionTemplates[i % questionTemplates.length];
      
      questions.push({
        q: questionText,
        options: [
          optionTemplates[0],
          optionTemplates[1],
          optionTemplates[2],
          optionTemplates[3],
          optionTemplates[4]
        ],
        answer: 0
      });
    }
    
    const json = JSON.stringify(questions, null, 2);
    setJsonInput(json);
    setShowAiGenerator(false);
    setShowJsonImport(true);
    
    alert(`🤖 AI Generated ${aiQuestionCount} questions on "${topic}"!\n\n` +
          `✓ Questions created successfully\n` +
          `✓ Edit the questions as needed\n` +
          `✓ Click 'Import All Questions' when ready\n\n` +
          `Note: These are template questions. Please edit them with actual content!`);
  };

  const generateSeriesQuestionsWithAI = () => {
    if (!seriesAiTopic.trim()) {
      alert("Please enter a topic!");
      return;
    }
    if (seriesAiQuestionCount < 1 || seriesAiQuestionCount > 100) {
      alert("Please enter a valid number of questions (1-100)!");
      return;
    }

    const questions = [];
    const topic = seriesAiTopic.trim();
    
    for (let i = 0; i < seriesAiQuestionCount; i++) {
      const questionTemplates = [
        `What is the main concept of ${topic}?`,
        `Which of the following is true about ${topic}?`,
        `${topic} is primarily related to which field?`,
        `What is the importance of ${topic}?`,
        `Which statement best describes ${topic}?`,
        `In the context of ${topic}, which is correct?`,
        `${topic} can be defined as:`,
        `The key feature of ${topic} is:`,
        `Which of the following applies to ${topic}?`,
        `What is the primary use of ${topic}?`
      ];
      
      const optionTemplates = [
        `Correct answer about ${topic}`,
        `Incorrect option 1`,
        `Incorrect option 2`,
        `Incorrect option 3`,
        `Incorrect option 4`
      ];
      
      const questionText = questionTemplates[i % questionTemplates.length];
      
      questions.push({
        q: questionText,
        options: [
          optionTemplates[0],
          optionTemplates[1],
          optionTemplates[2],
          optionTemplates[3],
          optionTemplates[4]
        ],
        answer: 0
      });
    }
    
    const json = JSON.stringify(questions, null, 2);
    setSeriesJsonInput(json);
    setShowSeriesAiGenerator(false);
    setShowSeriesJsonImport(true);
    
    alert(`🤖 AI Generated ${seriesAiQuestionCount} questions on "${topic}"!\n\n` +
          `✓ Questions created successfully\n` +
          `✓ Edit the questions as needed\n` +
          `✓ Click 'Import All Questions' when ready\n\n` +
          `Note: These are template questions. Please edit them with actual content!`);
  };

  const aiFixJson = () => {
    try {
      let fixed = jsonInput.trim();
      let errors = [];
      let autoFixed = false;

      // AI Error Detection and Auto-Fix
      
      // 1. Fix missing brackets
      if (!fixed.startsWith('[')) {
        fixed = '[' + fixed;
        errors.push("✓ Added missing opening bracket [");
        autoFixed = true;
      }
      if (!fixed.endsWith(']')) {
        fixed = fixed + ']';
        errors.push("✓ Added missing closing bracket ]");
        autoFixed = true;
      }

      // 2. Fix single quotes to double quotes
      if (fixed.includes("'")) {
        fixed = fixed.replace(/'/g, '"');
        errors.push("✓ Converted single quotes to double quotes");
        autoFixed = true;
      }

      // 3. Fix missing commas between objects
      fixed = fixed.replace(/}\s*{/g, '},{');
      
      // 4. Remove trailing commas before closing brackets
      fixed = fixed.replace(/,(\s*[}\]])/g, '$1');
      if (fixed !== jsonInput && !errors.includes("✓ Removed trailing commas")) {
        errors.push("✓ Removed trailing commas");
        autoFixed = true;
      }

      // 5. Try to parse and validate
      let parsed;
      try {
        parsed = JSON.parse(fixed);
      } catch (e) {
        // Try more aggressive fixes
        
        // Fix unquoted keys
        fixed = fixed.replace(/(\{|,)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
        errors.push("✓ Added quotes to unquoted keys");
        autoFixed = true;
        
        try {
          parsed = JSON.parse(fixed);
        } catch (e2) {
          alert("❌ AI couldn't auto-fix the JSON. Errors found:\n\n" + e2.message + "\n\nPlease check:\n- All strings in double quotes\n- Commas between items\n- Brackets [] around array\n- Braces {} around objects");
          return;
        }
      }

      // 6. Validate and auto-correct question structure
      if (!Array.isArray(parsed)) {
        alert("❌ JSON must be an array of questions!");
        return;
      }

      const correctedQuestions = [];
      for (let i = 0; i < parsed.length; i++) {
        const q = parsed[i];
        const corrected = { ...q };
        let questionFixed = false;

        // Fix missing 'q' field
        if (!corrected.q) {
          if (corrected.question) {
            corrected.q = corrected.question;
            delete corrected.question;
            questionFixed = true;
          } else {
            corrected.q = `Question ${i + 1}`;
            questionFixed = true;
          }
        }

        // Fix missing or invalid 'options' field
        if (!corrected.options || !Array.isArray(corrected.options)) {
          corrected.options = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"];
          questionFixed = true;
        } else if (corrected.options.length < 5) {
          // Add missing options
          while (corrected.options.length < 5) {
            corrected.options.push(`Option ${corrected.options.length + 1}`);
          }
          questionFixed = true;
        } else if (corrected.options.length > 5) {
          // Trim extra options
          corrected.options = corrected.options.slice(0, 5);
          questionFixed = true;
        }

        // Fix missing or invalid 'answer' field
        if (typeof corrected.answer !== "number" || corrected.answer < 0 || corrected.answer > 4) {
          if (corrected.correct !== undefined) {
            corrected.answer = Number(corrected.correct);
            delete corrected.correct;
          } else if (corrected.correctAnswer !== undefined) {
            corrected.answer = Number(corrected.correctAnswer);
            delete corrected.correctAnswer;
          } else {
            corrected.answer = 0;
          }
          questionFixed = true;
        }

        if (questionFixed) {
          errors.push(`✓ Fixed question ${i + 1} structure`);
          autoFixed = true;
        }

        correctedQuestions.push(corrected);
      }

      // Update the JSON input with fixed version
      const beautified = JSON.stringify(correctedQuestions, null, 2);
      setJsonInput(beautified);

      if (autoFixed) {
        alert("🤖 AI Auto-Fix Complete!\n\n" + 
              "Errors Found & Fixed:\n" + 
              errors.join("\n") + 
              "\n\n✅ JSON has been corrected and formatted!\n" +
              "Review the changes and click 'Import All Questions' to proceed.");
      } else {
        alert("✅ JSON is valid! No errors found.\n\nClick 'Import All Questions' to proceed.");
      }

    } catch (error) {
      alert("❌ AI Error Analysis:\n\n" + error.message + "\n\nCommon issues:\n" +
            "• Missing quotes around strings\n" +
            "• Missing commas between items\n" +
            "• Extra commas at the end\n" +
            "• Unmatched brackets or braces");
    }
  };

  const validateAndShowErrors = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      
      if (!Array.isArray(parsed)) {
        alert("❌ Error: JSON must be an array\n\nWrap your questions in [ ]");
        return;
      }

      const errors = [];
      for (let i = 0; i < parsed.length; i++) {
        const q = parsed[i];
        if (!q.q) errors.push(`Question ${i + 1}: Missing 'q' field`);
        if (!q.options) errors.push(`Question ${i + 1}: Missing 'options' field`);
        if (q.options && !Array.isArray(q.options)) errors.push(`Question ${i + 1}: 'options' must be an array`);
        if (q.options && q.options.length !== 5) errors.push(`Question ${i + 1}: Must have exactly 5 options (has ${q.options.length})`);
        if (typeof q.answer !== "number") errors.push(`Question ${i + 1}: 'answer' must be a number`);
        if (q.answer < 0 || q.answer > 4) errors.push(`Question ${i + 1}: 'answer' must be between 0-4`);
      }

      if (errors.length > 0) {
        alert("❌ Validation Errors Found:\n\n" + errors.join("\n") + "\n\nClick 'AI Auto-Fix' to automatically correct these issues!");
      } else {
        alert("✅ Perfect! No errors found.\n\nYour JSON is ready to import!");
      }

    } catch (error) {
      alert("❌ JSON Syntax Error:\n\n" + error.message + "\n\nClick 'AI Auto-Fix' to automatically correct this!");
    }
  };

  const exportQuestionsToJson = () => {
    if (selectedSubject === null || !subjects[selectedSubject].questions || subjects[selectedSubject].questions.length === 0) {
      alert("No questions to export!");
      return;
    }
    
    const json = JSON.stringify(subjects[selectedSubject].questions, null, 2);
    navigator.clipboard.writeText(json);
    alert("Questions copied to clipboard as JSON!");
  };

  // Test Series JSON Import Functions
  const importSeriesQuestionsFromJson = () => {
    try {
      const parsed = JSON.parse(seriesJsonInput);
      
      if (!Array.isArray(parsed)) {
        alert("JSON must be an array of questions!");
        return;
      }

      for (let i = 0; i < parsed.length; i++) {
        const q = parsed[i];
        if (!q.q || !q.options || !Array.isArray(q.options) || q.options.length !== 5 || typeof q.answer !== "number") {
          alert(`Invalid question format at index ${i}. Each question must have: q (string), options (array of 5 strings), answer (number 0-4)`);
          return;
        }
      }

      const updated = [...testSeries];
      if (!updated[selectedSeries].questions) {
        updated[selectedSeries].questions = [];
      }
      updated[selectedSeries].questions.push(...parsed);
      setTestSeries(updated);
      
      alert(`Successfully imported ${parsed.length} questions!`);
      setSeriesJsonInput("");
      setShowSeriesJsonImport(false);
    } catch (error) {
      alert("Invalid JSON format! Please check your JSON syntax.\n\nError: " + error.message);
    }
  };

  const aiFixSeriesJson = () => {
    try {
      let fixed = seriesJsonInput.trim();
      let errors = [];
      let autoFixed = false;

      // AI Error Detection and Auto-Fix
      
      // 1. Fix missing brackets
      if (!fixed.startsWith('[')) {
        fixed = '[' + fixed;
        errors.push("✓ Added missing opening bracket [");
        autoFixed = true;
      }
      if (!fixed.endsWith(']')) {
        fixed = fixed + ']';
        errors.push("✓ Added missing closing bracket ]");
        autoFixed = true;
      }

      // 2. Fix single quotes to double quotes
      if (fixed.includes("'")) {
        fixed = fixed.replace(/'/g, '"');
        errors.push("✓ Converted single quotes to double quotes");
        autoFixed = true;
      }

      // 3. Fix missing commas between objects
      fixed = fixed.replace(/}\s*{/g, '},{');
      
      // 4. Remove trailing commas before closing brackets
      fixed = fixed.replace(/,(\s*[}\]])/g, '$1');
      if (fixed !== seriesJsonInput && !errors.includes("✓ Removed trailing commas")) {
        errors.push("✓ Removed trailing commas");
        autoFixed = true;
      }

      // 5. Try to parse and validate
      let parsed;
      try {
        parsed = JSON.parse(fixed);
      } catch (e) {
        // Try more aggressive fixes
        fixed = fixed.replace(/(\{|,)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
        errors.push("✓ Added quotes to unquoted keys");
        autoFixed = true;
        
        try {
          parsed = JSON.parse(fixed);
        } catch (e2) {
          alert("❌ AI couldn't auto-fix the JSON. Errors found:\n\n" + e2.message + "\n\nPlease check:\n- All strings in double quotes\n- Commas between items\n- Brackets [] around array\n- Braces {} around objects");
          return;
        }
      }

      // 6. Validate and auto-correct question structure
      if (!Array.isArray(parsed)) {
        alert("❌ JSON must be an array of questions!");
        return;
      }

      const correctedQuestions = [];
      for (let i = 0; i < parsed.length; i++) {
        const q = parsed[i];
        const corrected = { ...q };
        let questionFixed = false;

        // Fix missing 'q' field
        if (!corrected.q) {
          if (corrected.question) {
            corrected.q = corrected.question;
            delete corrected.question;
            questionFixed = true;
          } else {
            corrected.q = `Question ${i + 1}`;
            questionFixed = true;
          }
        }

        // Fix missing or invalid 'options' field
        if (!corrected.options || !Array.isArray(corrected.options)) {
          corrected.options = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"];
          questionFixed = true;
        } else if (corrected.options.length < 5) {
          while (corrected.options.length < 5) {
            corrected.options.push(`Option ${corrected.options.length + 1}`);
          }
          questionFixed = true;
        } else if (corrected.options.length > 5) {
          corrected.options = corrected.options.slice(0, 5);
          questionFixed = true;
        }

        // Fix missing or invalid 'answer' field
        if (typeof corrected.answer !== "number" || corrected.answer < 0 || corrected.answer > 4) {
          if (corrected.correct !== undefined) {
            corrected.answer = Number(corrected.correct);
            delete corrected.correct;
          } else if (corrected.correctAnswer !== undefined) {
            corrected.answer = Number(corrected.correctAnswer);
            delete corrected.correctAnswer;
          } else {
            corrected.answer = 0;
          }
          questionFixed = true;
        }

        if (questionFixed) {
          errors.push(`✓ Fixed question ${i + 1} structure`);
          autoFixed = true;
        }

        correctedQuestions.push(corrected);
      }

      const beautified = JSON.stringify(correctedQuestions, null, 2);
      setSeriesJsonInput(beautified);

      if (autoFixed) {
        alert("🤖 AI Auto-Fix Complete!\n\n" + 
              "Errors Found & Fixed:\n" + 
              errors.join("\n") + 
              "\n\n✅ JSON has been corrected and formatted!\n" +
              "Review the changes and click 'Import All Questions' to proceed.");
      } else {
        alert("✅ JSON is valid! No errors found.\n\nClick 'Import All Questions' to proceed.");
      }

    } catch (error) {
      alert("❌ AI Error Analysis:\n\n" + error.message + "\n\nCommon issues:\n" +
            "• Missing quotes around strings\n" +
            "• Missing commas between items\n" +
            "• Extra commas at the end\n" +
            "• Unmatched brackets or braces");
    }
  };

  const validateAndShowSeriesErrors = () => {
    try {
      const parsed = JSON.parse(seriesJsonInput);
      
      if (!Array.isArray(parsed)) {
        alert("❌ Error: JSON must be an array\n\nWrap your questions in [ ]");
        return;
      }

      const errors = [];
      for (let i = 0; i < parsed.length; i++) {
        const q = parsed[i];
        if (!q.q) errors.push(`Question ${i + 1}: Missing 'q' field`);
        if (!q.options) errors.push(`Question ${i + 1}: Missing 'options' field`);
        if (q.options && !Array.isArray(q.options)) errors.push(`Question ${i + 1}: 'options' must be an array`);
        if (q.options && q.options.length !== 5) errors.push(`Question ${i + 1}: Must have exactly 5 options (has ${q.options.length})`);
        if (typeof q.answer !== "number") errors.push(`Question ${i + 1}: 'answer' must be a number`);
        if (q.answer < 0 || q.answer > 4) errors.push(`Question ${i + 1}: 'answer' must be between 0-4`);
      }

      if (errors.length > 0) {
        alert("❌ Validation Errors Found:\n\n" + errors.join("\n") + "\n\nClick 'AI Auto-Fix' to automatically correct these issues!");
      } else {
        alert("✅ Perfect! No errors found.\n\nYour JSON is ready to import!");
      }

    } catch (error) {
      alert("❌ JSON Syntax Error:\n\n" + error.message + "\n\nClick 'AI Auto-Fix' to automatically correct this!");
    }
  };

  const exportSeriesQuestionsToJson = () => {
    if (selectedSeries === null || !testSeries[selectedSeries].questions || testSeries[selectedSeries].questions.length === 0) {
      alert("No questions to export!");
      return;
    }
    
    const json = JSON.stringify(testSeries[selectedSeries].questions, null, 2);
    navigator.clipboard.writeText(json);
    alert("Questions copied to clipboard as JSON!");
  };

  // Test Series Functions
  const addSeries = () => {
    if (!seriesName.trim()) {
      alert("Please enter a test series name!");
      return;
    }
    if (selectedSubjectsForSeries.length === 0) {
      alert("Please select at least one subject! Subject selection is required.");
      return;
    }
    
    // Get names of selected subjects for category
    const selectedSubjectNames = selectedSubjectsForSeries
      .map(id => subjects.find(s => s.id === Number(id))?.name)
      .filter(Boolean)
      .join(", ");
    
    const newSeries = {
      id: Date.now(),
      name: seriesName,
      subjectIds: selectedSubjectsForSeries.map(id => Number(id)), // Array of subject IDs
      category: selectedSubjectNames || "General",
      difficulty: difficulty,
      duration: duration,
      instructions: instructions || "Read all questions carefully. Each question has 5 options. Select the correct answer.",
      negativeMarking: negativeMarking,
      marksPerQuestion: marksPerQuestion,
      totalMarks: totalMarks || 0,
      questions: [],
      sections: [] // NEW: Array of sections
    };
    setTestSeries([...testSeries, newSeries]);
    setSeriesName("");
    setSelectedSubjectsForSeries([]);
    setDifficulty("Medium");
    setDuration(30);
    setInstructions("");
    setNegativeMarking(0.25);
    setMarksPerQuestion(1);
    setTotalMarks(0);
    alert("Test series added with " + selectedSubjectsForSeries.length + " subject(s)!");
  };

  const deleteSeries = (idx) => {
    if (window.confirm("Delete this test series?")) {
      const updated = testSeries.filter((_, i) => i !== idx);
      setTestSeries(updated);
      if (selectedSeries === idx) setSelectedSeries(null);
      alert("Test series deleted!");
    }
  };

  const selectSeries = idx => {
    setSelectedSeries(idx);
    setQuestion("");
    setOptions(["", "", "", "", ""]);
    setAnswer(0);
    setEditingQuestion(null);
  };

  const addQuestion = () => {
    if (!question.trim()) {
      alert("Please enter a question!");
      return;
    }
    if (options.some(opt => !opt.trim())) {
      alert("Please fill all options!");
      return;
    }

    const updated = [...testSeries];
    if (editingQuestion !== null) {
      updated[selectedSeries].questions[editingQuestion] = {
        q: question,
        options,
        answer: Number(answer)
      };
      setEditingQuestion(null);
      alert("Question updated!");
    } else {
      updated[selectedSeries].questions.push({
        q: question,
        options,
        answer: Number(answer)
      });
      alert("Question added!");
    }
    
    setTestSeries(updated);
    setQuestion("");
    setOptions(["", "", "", "", ""]);
    setAnswer(0);
  };

  const editQuestion = (qIdx) => {
    const q = testSeries[selectedSeries].questions[qIdx];
    setQuestion(q.q);
    setOptions([...q.options]);
    setAnswer(q.answer);
    setEditingQuestion(qIdx);
  };

  const deleteQuestion = (qIdx) => {
    if (window.confirm("Delete this question?")) {
      const updated = [...testSeries];
      updated[selectedSeries].questions.splice(qIdx, 1);
      setTestSeries(updated);
      alert("Question deleted!");
    }
  };

  // Section Management Functions
  const addSection = () => {
    if (!sectionName.trim()) {
      alert("Please enter a section name!");
      return;
    }
    const updated = [...testSeries];
    if (!updated[selectedSeries].sections) {
      updated[selectedSeries].sections = [];
    }
    updated[selectedSeries].sections.push({
      id: Date.now(),
      name: sectionName,
      sets: []
    });
    setTestSeries(updated);
    setSectionName("");
    alert("Section added!");
  };

  const deleteSection = (sectionIdx) => {
    if (window.confirm("Delete this section and all its sets?")) {
      const updated = [...testSeries];
      updated[selectedSeries].sections.splice(sectionIdx, 1);
      setTestSeries(updated);
      setSelectedSection(null);
      alert("Section deleted!");
    }
  };

  // Set Management Functions
  const addSet = () => {
    if (!setName.trim()) {
      alert("Please enter a set name!");
      return;
    }
    const updated = [...testSeries];
    updated[selectedSeries].sections[selectedSection].sets.push({
      id: Date.now(),
      name: setName,
      year: setYear || "",
      questions: []
    });
    setTestSeries(updated);
    setSetName("");
    setSetYear("");
    alert("Set added!");
  };

  const deleteSet = (setIdx) => {
    if (window.confirm("Delete this set and all its questions?")) {
      const updated = [...testSeries];
      updated[selectedSeries].sections[selectedSection].sets.splice(setIdx, 1);
      setTestSeries(updated);
      setSelectedSet(null);
      alert("Set deleted!");
    }
  };

  // Question Management for Sets
  const addSetQuestion = () => {
    if (!question.trim()) {
      alert("Please enter a question!");
      return;
    }
    if (options.some(opt => !opt.trim())) {
      alert("Please fill all options!");
      return;
    }

    const updated = [...testSeries];
    const currentSet = updated[selectedSeries].sections[selectedSection].sets[selectedSet];
    
    if (editingQuestion !== null) {
      currentSet.questions[editingQuestion] = {
        q: question,
        options,
        answer: Number(answer)
      };
      setEditingQuestion(null);
      alert("Question updated!");
    } else {
      currentSet.questions.push({
        q: question,
        options,
        answer: Number(answer)
      });
      alert("Question added!");
    }
    
    setTestSeries(updated);
    setQuestion("");
    setOptions(["", "", "", "", ""]);
    setAnswer(0);
  };

  const editSetQuestion = (qIdx) => {
    const q = testSeries[selectedSeries].sections[selectedSection].sets[selectedSet].questions[qIdx];
    setQuestion(q.q);
    setOptions([...q.options]);
    setAnswer(q.answer);
    setEditingQuestion(qIdx);
  };

  const deleteSetQuestion = (qIdx) => {
    if (window.confirm("Delete this question?")) {
      const updated = [...testSeries];
      updated[selectedSeries].sections[selectedSection].sets[selectedSet].questions.splice(qIdx, 1);
      setTestSeries(updated);
      alert("Question deleted!");
    }
  };

  const editSeriesDetails = (idx, field, value) => {
    const updated = [...testSeries];
    updated[idx][field] = value;
    setTestSeries(updated);
  };

  return (
    <div style={{ 
      width: "100%",
      minHeight: "calc(100vh - 120px)",
      overflow: "auto",
      padding: "20px"
    }}>
      <div style={{ 
        maxWidth: "1400px", 
        margin: "0 auto"
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "20px",
          padding: "40px",
          marginBottom: "30px",
          color: "#fff",
          boxShadow: "0 10px 40px rgba(102, 126, 234, 0.3)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ margin: "0 0 10px 0", fontSize: "2.5rem" }}>
                🎓 Admin Dashboard
              </h1>
              <p style={{ margin: 0, fontSize: "1.1rem", opacity: 0.9 }}>
                Manage subjects, test series and questions
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ 
                background: "rgba(255,255,255,0.2)", 
                padding: "15px 20px", 
                borderRadius: "12px",
                marginBottom: "10px"
              }}>
                <div style={{ fontSize: "0.9rem", opacity: 0.9, marginBottom: "5px" }}>
                  Database Mode
                </div>
                <div style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
                  {useFirebase ? "☁️ Firebase Cloud" : "💾 Local Storage"}
                </div>
              </div>
              <button
                onClick={() => setUseFirebase(!useFirebase)}
                style={{
                  padding: "10px 20px",
                  background: useFirebase ? "#10b981" : "#f59e0b",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  width: "100%"
                }}
              >
                {useFirebase ? "✓ Cloud Active" : "Switch to Cloud"}
              </button>
              {!useFirebase && (
                <button
                  onClick={syncToFirebase}
                  style={{
                    marginTop: "8px",
                    padding: "10px 20px",
                    background: "#3b82f6",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    width: "100%"
                  }}
                >
                  📤 Sync to Cloud
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Test Series Management - Main Content */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px", alignItems: "start" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px", alignItems: "start" }}>
            {/* Add Subject Panel */}
            <div style={{
              background: "#fff",
              borderRadius: "15px",
              padding: "25px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
              position: "sticky",
              top: "20px"
            }}>
              <h2 style={{ color: "#1e293b", marginBottom: "20px", fontSize: "1.5rem" }}>
                ➕ Create New Subject
              </h2>
              
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#64748b", fontWeight: "600", fontSize: "0.9rem" }}>
                  Subject Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., History, Geography"
                  value={subjectName}
                  onChange={e => setSubjectName(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #e2e8f0", fontSize: "1rem", outline: "none" }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#64748b", fontWeight: "600", fontSize: "0.9rem" }}>
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  placeholder="📚"
                  value={subjectIcon}
                  onChange={e => setSubjectIcon(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #e2e8f0", fontSize: "1.5rem", outline: "none", textAlign: "center" }}
                />
              </div>

              <button 
                onClick={addSubject}
                style={{ 
                  width: "100%",
                  padding: "14px", 
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff", 
                  border: "none", 
                  borderRadius: "10px", 
                  fontWeight: "bold",
                  fontSize: "1rem",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
                }}
              >
                ➕ Create Subject
              </button>
            </div>

            {/* Manage Subjects Panel */}
            <div>
              <div style={{
                background: "#fff",
                borderRadius: "15px",
                padding: "25px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                marginBottom: "20px"
              }}>
                <h2 style={{ color: "#1e293b", marginBottom: "20px", fontSize: "1.5rem" }}>
                  📚 Manage Subjects ({subjects.length})
                </h2>
                
                {subjects.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "10px" }}>📚</div>
                    <div>No subjects created yet. Create one to get started!</div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {subjects.map((subject, idx) => {
                      const linkedTestSeries = testSeries.filter(ts => 
                        ts.subjectIds && ts.subjectIds.includes(subject.id)
                      );
                      return (
                      <div 
                        key={idx}
                        style={{
                          padding: "20px",
                          background: selectedSubject === idx ? "#f0f4ff" : "#f8fafc",
                          borderRadius: "12px",
                          border: selectedSubject === idx ? "2px solid #667eea" : "2px solid #e2e8f0",
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "15px" }}>
                            <span style={{ fontSize: "2.5rem" }}>{subject.icon}</span>
                            <div>
                              <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#1e293b" }}>
                                {subject.name}
                              </div>
                              <div style={{ fontSize: "0.9rem", color: "#667eea", fontWeight: "600" }}>
                                📝 {subject.questions?.length || 0} Questions
                              </div>
                              {linkedTestSeries.length > 0 && (
                                <div style={{ 
                                  fontSize: "0.85rem", 
                                  color: "#10b981", 
                                  fontWeight: "600",
                                  marginTop: "5px"
                                }}>
                                  🔗 Linked to {linkedTestSeries.length} Test Series
                                </div>
                              )}
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              onClick={() => selectSubject(idx)}
                              style={{
                                padding: "8px 16px",
                                background: selectedSubject === idx ? "#667eea" : "#10b981",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                fontWeight: "600",
                                cursor: "pointer",
                                fontSize: "0.9rem"
                              }}
                            >
                              {selectedSubject === idx ? "✓ Selected" : "Select"}
                            </button>
                            <button
                              onClick={() => deleteSubject(idx)}
                              style={{
                                padding: "8px 16px",
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
                        </div>
                      </div>
                    )})}
                  </div>
                )}
              </div>

              {/* Question Management for Selected Subject */}
              {selectedSubject !== null && (
                <div style={{
                  background: "#fff",
                  borderRadius: "15px",
                  padding: "25px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
                }}>
                  <h2 style={{ color: "#1e293b", marginBottom: "20px", fontSize: "1.5rem" }}>
                    {editingSubjectQuestion !== null ? "✏️ Edit Question" : "➕ Add Question"} to: {subjects[selectedSubject].icon} {subjects[selectedSubject].name}
                  </h2>

                  {/* JSON Import/Export Buttons */}
                  <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                    <button
                      onClick={() => {
                        setShowJsonImport(!showJsonImport);
                        setShowAiGenerator(false);
                      }}
                      style={{
                        flex: 1,
                        padding: "12px",
                        background: showJsonImport ? "#f59e0b" : "#3b82f6",
                        color: "#fff",
                        border: "none",
                        borderRadius: "10px",
                        fontWeight: "600",
                        cursor: "pointer",
                        fontSize: "0.95rem"
                      }}
                    >
                      {showJsonImport ? "📝 Manual Entry" : "📥 Bulk Import (JSON)"}
                    </button>
                    <button
                      onClick={() => {
                        setShowAiGenerator(!showAiGenerator);
                        setShowJsonImport(false);
                      }}
                      style={{
                        flex: 1,
                        padding: "12px",
                        background: showAiGenerator ? "#f59e0b" : "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "10px",
                        fontWeight: "600",
                        cursor: "pointer",
                        fontSize: "0.95rem",
                        boxShadow: showAiGenerator ? "none" : "0 4px 15px rgba(139, 92, 246, 0.4)"
                      }}
                    >
                      {showAiGenerator ? "📝 Manual Entry" : "🤖 AI Generator"}
                    </button>
                    <button
                      onClick={exportQuestionsToJson}
                      style={{
                        flex: 1,
                        padding: "12px",
                        background: "#10b981",
                        color: "#fff",
                        border: "none",
                        borderRadius: "10px",
                        fontWeight: "600",
                        cursor: "pointer",
                        fontSize: "0.95rem"
                      }}
                    >
                      📤 Export Questions (JSON)
                    </button>
                  </div>

                  {/* AI Question Generator */}
                  {showAiGenerator && (
                    <div style={{
                      padding: "20px",
                      background: "linear-gradient(135deg, #f0f9ff 0%, #fef3c7 100%)",
                      borderRadius: "12px",
                      border: "2px solid #8b5cf6",
                      marginBottom: "20px"
                    }}>
                      <h3 style={{ color: "#7c3aed", marginBottom: "15px", fontSize: "1.1rem" }}>
                        🤖 AI Question Generator
                      </h3>
                      
                      <div style={{
                        padding: "15px",
                        background: "#fff",
                        borderRadius: "8px",
                        marginBottom: "15px",
                        fontSize: "0.85rem",
                        color: "#64748b",
                        border: "1px solid #e2e8f0"
                      }}>
                        <strong style={{ color: "#1e293b" }}>How it works:</strong>
                        <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
                          <li>Enter any topic (e.g., "Indian History", "Mathematics", "Science")</li>
                          <li>Choose number of questions (1-100)</li>
                          <li>AI will generate template questions</li>
                          <li>Edit the generated questions as needed</li>
                          <li>Import when ready!</li>
                        </ul>
                      </div>

                      <div style={{ marginBottom: "15px" }}>
                        <label style={{ display: "block", marginBottom: "8px", color: "#7c3aed", fontWeight: "600" }}>
                          Topic / Subject:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Indian History, Mathematics, General Knowledge"
                          value={aiTopic}
                          onChange={e => setAiTopic(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "2px solid #8b5cf6",
                            fontSize: "1rem",
                            outline: "none"
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: "15px" }}>
                        <label style={{ display: "block", marginBottom: "8px", color: "#7c3aed", fontWeight: "600" }}>
                          Number of Questions:
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={aiQuestionCount}
                          onChange={e => setAiQuestionCount(Number(e.target.value))}
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "2px solid #8b5cf6",
                            fontSize: "1rem",
                            outline: "none"
                          }}
                        />
                      </div>

                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          onClick={generateQuestionsWithAI}
                          style={{
                            flex: 1,
                            padding: "14px",
                            background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            cursor: "pointer",
                            boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)"
                          }}
                        >
                          🤖 Generate Questions
                        </button>
                        <button
                          onClick={() => {
                            setShowAiGenerator(false);
                            setAiTopic("");
                            setAiQuestionCount(10);
                          }}
                          style={{
                            padding: "14px 20px",
                            background: "#94a3b8",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            cursor: "pointer"
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* JSON Import Section */}
                  {showJsonImport ? (
                    <div style={{
                      padding: "20px",
                      background: "#f0f9ff",
                      borderRadius: "12px",
                      border: "2px solid #3b82f6",
                      marginBottom: "20px"
                    }}>
                      <h3 style={{ color: "#1e40af", marginBottom: "15px", fontSize: "1.1rem" }}>
                        📥 Bulk Import Questions (JSON Format)
                      </h3>
                      
                      <div style={{
                        padding: "15px",
                        background: "#fff",
                        borderRadius: "8px",
                        marginBottom: "15px",
                        fontSize: "0.85rem",
                        color: "#64748b",
                        border: "1px solid #e2e8f0"
                      }}>
                        <strong style={{ color: "#1e293b" }}>JSON Format Example:</strong>
                        <pre style={{ 
                          margin: "10px 0 0 0", 
                          padding: "10px",
                          background: "#f8fafc",
                          borderRadius: "6px",
                          overflow: "auto",
                          fontSize: "0.8rem"
                        }}>
{`[
  {
    "q": "What is the capital of France?",
    "options": ["London", "Paris", "Berlin", "Madrid", "Rome"],
    "answer": 1
  },
  {
    "q": "What is 2 + 2?",
    "options": ["3", "4", "5", "6", "7"],
    "answer": 1
  }
]`}
                        </pre>
                        <div style={{ marginTop: "10px", color: "#ef4444", fontSize: "0.85rem" }}>
                          <strong>Important:</strong> Each question must have "q" (question text), "options" (array of exactly 5 strings), and "answer" (number 0-4 for correct option index)
                        </div>
                        <div style={{ marginTop: "10px", padding: "10px", background: "#fef3c7", borderRadius: "6px", fontSize: "0.85rem", color: "#92400e" }}>
                          <strong>🤖 AI Auto-Fix Features:</strong>
                          <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
                            <li>Fixes missing brackets [ ]</li>
                            <li>Converts single quotes to double quotes</li>
                            <li>Removes trailing commas</li>
                            <li>Adds quotes to unquoted keys</li>
                            <li>Fixes missing or wrong field names</li>
                            <li>Auto-completes missing options</li>
                            <li>Corrects answer index values</li>
                          </ul>
                        </div>
                      </div>

                      <label style={{ display: "block", marginBottom: "8px", color: "#1e40af", fontWeight: "600" }}>
                        Paste JSON Array Here:
                      </label>
                      <textarea
                        placeholder='[{"q": "Your question?", "options": ["A", "B", "C", "D", "E"], "answer": 0}]'
                        value={jsonInput}
                        onChange={e => setJsonInput(e.target.value)}
                        rows="10"
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "2px solid #3b82f6",
                          fontSize: "0.9rem",
                          fontFamily: "monospace",
                          outline: "none",
                          resize: "vertical"
                        }}
                      />

                      <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                        <button
                          onClick={convertTextToJson}
                          style={{
                            flex: 1,
                            padding: "14px",
                            background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            cursor: "pointer",
                            boxShadow: "0 4px 15px rgba(6, 182, 212, 0.4)"
                          }}
                        >
                          📝 Text to JSON
                        </button>
                        <button
                          onClick={aiFixJson}
                          style={{
                            flex: 1,
                            padding: "14px",
                            background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            cursor: "pointer",
                            boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)"
                          }}
                        >
                          🤖 AI Auto-Fix
                        </button>
                        <button
                          onClick={validateAndShowErrors}
                          style={{
                            flex: 1,
                            padding: "14px",
                            background: "#f59e0b",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            cursor: "pointer",
                            boxShadow: "0 4px 15px rgba(245, 158, 11, 0.4)"
                          }}
                        >
                          🔍 Check Errors
                        </button>
                      </div>
                      
                      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <button
                          onClick={importQuestionsFromJson}
                          style={{
                            flex: 1,
                            padding: "14px",
                            background: "#10b981",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            cursor: "pointer",
                            boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)"
                          }}
                        >
                          ✅ Import All Questions
                        </button>
                        <button
                          onClick={() => {
                            setShowJsonImport(false);
                            setJsonInput("");
                          }}
                          style={{
                            padding: "14px 20px",
                            background: "#94a3b8",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            cursor: "pointer"
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Manual Question Entry Form */}
                  <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "8px", color: "#64748b", fontWeight: "600", fontSize: "0.9rem" }}>
                      Question
                    </label>
                    <textarea
                      placeholder="Enter your question here..."
                      value={subjectQuestion}
                      onChange={e => setSubjectQuestion(e.target.value)}
                      rows="3"
                      style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #e2e8f0", fontSize: "1rem", outline: "none", resize: "vertical" }}
                    />
                  </div>

                  {subjectOptions.map((opt, idx) => (
                    <div key={idx} style={{ marginBottom: "12px" }}>
                      <label style={{ display: "block", marginBottom: "6px", color: "#64748b", fontWeight: "600", fontSize: "0.9rem" }}>
                        Option {idx + 1}
                      </label>
                      <input
                        type="text"
                        placeholder={`Enter option ${idx + 1}`}
                        value={opt}
                        onChange={e => {
                          const newOpts = [...subjectOptions];
                          newOpts[idx] = e.target.value;
                          setSubjectOptions(newOpts);
                        }}
                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #e2e8f0", fontSize: "1rem", outline: "none" }}
                      />
                    </div>
                  ))}

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", color: "#64748b", fontWeight: "600", fontSize: "0.9rem" }}>
                      Correct Answer
                    </label>
                    <select
                      value={subjectAnswer}
                      onChange={e => setSubjectAnswer(Number(e.target.value))}
                      style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #e2e8f0", fontSize: "1rem", outline: "none" }}
                    >
                      {subjectOptions.map((opt, idx) => (
                        <option key={idx} value={idx}>
                          Option {idx + 1}: {opt || "(empty)"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button 
                      onClick={addSubjectQuestion}
                      style={{ 
                        flex: 1,
                        padding: "14px", 
                        background: editingSubjectQuestion !== null ? "#f59e0b" : "#10b981",
                        color: "#fff", 
                        border: "none", 
                        borderRadius: "10px", 
                        fontWeight: "bold",
                        fontSize: "1rem",
                        cursor: "pointer",
                        boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)"
                      }}
                    >
                      {editingSubjectQuestion !== null ? "💾 Update Question" : "➕ Add Question"}
                    </button>
                    {editingSubjectQuestion !== null && (
                      <button 
                        onClick={() => {
                          setEditingSubjectQuestion(null);
                          setSubjectQuestion("");
                          setSubjectOptions(["", "", "", "", ""]);
                          setSubjectAnswer(0);
                        }}
                        style={{ 
                          padding: "14px 20px", 
                          background: "#94a3b8",
                          color: "#fff", 
                          border: "none", 
                          borderRadius: "10px", 
                          fontWeight: "bold",
                          fontSize: "1rem",
                          cursor: "pointer"
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                  </>
                  )}

                  {/* Questions List */}
                  {subjects[selectedSubject].questions && subjects[selectedSubject].questions.length > 0 && (
                    <div style={{ marginTop: "30px" }}>
                      <h3 style={{ color: "#1e293b", marginBottom: "15px", fontSize: "1.2rem" }}>
                        📋 Questions ({subjects[selectedSubject].questions.length})
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {subjects[selectedSubject].questions.map((q, i) => (
                          <div 
                            key={i}
                            style={{ 
                              padding: "15px",
                              background: "#f8fafc",
                              borderRadius: "10px",
                              border: "1px solid #e2e8f0"
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: "600", color: "#1e293b", marginBottom: "8px" }}>
                                  Q{i + 1}: {q.q}
                                </div>
                                <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "5px" }}>
                                  {q.options.map((opt, idx) => (
                                    <div key={idx} style={{
                                      padding: "4px 0",
                                      color: idx === q.answer ? "#10b981" : "#64748b",
                                      fontWeight: idx === q.answer ? "600" : "normal"
                                    }}>
                                      {idx + 1}. {opt} {idx === q.answer && "✓"}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div style={{ display: "flex", gap: "8px", marginLeft: "10px" }}>
                                <button
                                  onClick={() => editSubjectQuestion(i)}
                                  style={{
                                    padding: "6px 12px",
                                    background: "#3b82f6",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "6px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    fontSize: "0.85rem"
                                  }}
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  onClick={() => deleteSubjectQuestion(i)}
                                  style={{
                                    padding: "6px 12px",
                                    background: "#ef4444",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "6px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    fontSize: "0.85rem"
                                  }}
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px", alignItems: "start" }}>
            {/* Add Test Series Panel */}
            <div style={{
              background: "#fff",
              borderRadius: "15px",
              padding: "25px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
              position: "sticky",
              top: "20px"
            }}>
              <h2 style={{ color: "#1e293b", marginBottom: "20px", fontSize: "1.5rem" }}>
                ➕ Create New Test Series
              </h2>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#64748b", fontWeight: "600", fontSize: "0.9rem" }}>
                  Select Subjects <span style={{ color: "#ef4444" }}>*</span>
                </label>
                
                {/* Multi-select checkboxes for subjects */}
                <div style={{
                  border: selectedSubjectsForSeries.length > 0 ? "2px solid #10b981" : "2px solid #ef4444",
                  borderRadius: "8px",
                  padding: "12px",
                  background: selectedSubjectsForSeries.length > 0 ? "#fff" : "#fef2f2",
                  maxHeight: "200px",
                  overflowY: "auto"
                }}>
                  {subjects.length === 0 ? (
                    <div style={{ color: "#94a3b8", textAlign: "center", padding: "10px" }}>
                      No subjects available. Create subjects first.
                    </div>
                  ) : (
                    subjects.map((subject) => (
                      <label 
                        key={subject.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "8px",
                          cursor: "pointer",
                          borderRadius: "6px",
                          marginBottom: "4px",
                          background: selectedSubjectsForSeries.includes(String(subject.id)) ? "#e0e7ff" : "transparent",
                          transition: "background 0.2s"
                        }}
                        onMouseEnter={(e) => {
                          if (!selectedSubjectsForSeries.includes(String(subject.id))) {
                            e.currentTarget.style.background = "#f8fafc";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!selectedSubjectsForSeries.includes(String(subject.id))) {
                            e.currentTarget.style.background = "transparent";
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSubjectsForSeries.includes(String(subject.id))}
                          onChange={(e) => {
                            const subjectId = String(subject.id);
                            if (e.target.checked) {
                              setSelectedSubjectsForSeries([...selectedSubjectsForSeries, subjectId]);
                            } else {
                              setSelectedSubjectsForSeries(selectedSubjectsForSeries.filter(id => id !== subjectId));
                            }
                          }}
                          style={{
                            width: "18px",
                            height: "18px",
                            marginRight: "10px",
                            cursor: "pointer"
                          }}
                        />
                        <span style={{ fontSize: "1.5rem", marginRight: "8px" }}>{subject.icon}</span>
                        <span style={{ fontSize: "1rem", color: "#1e293b", fontWeight: "500" }}>
                          {subject.name}
                        </span>
                        <span style={{ 
                          marginLeft: "auto", 
                          fontSize: "0.85rem", 
                          color: "#64748b",
                          fontWeight: "600"
                        }}>
                          {subject.questions?.length || 0} Q
                        </span>
                      </label>
                    ))
                  )}
                </div>
                
                <div style={{ 
                  marginTop: "8px", 
                  fontSize: "0.85rem", 
                  color: selectedSubjectsForSeries.length > 0 ? "#10b981" : "#ef4444", 
                  fontWeight: "600" 
                }}>
                  {selectedSubjectsForSeries.length > 0 
                    ? `✓ ${selectedSubjectsForSeries.length} subject(s) selected`
                    : "⚠️ Select at least one subject (required)"
                  }
                </div>
              </div>
              
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#64748b", fontWeight: "600", fontSize: "0.9rem" }}>
                  Test Series Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., SSC CGL Mock Test 2024"
                  value={seriesName}
                  onChange={e => setSeriesName(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #e2e8f0", fontSize: "1rem", outline: "none" }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#64748b", fontWeight: "600", fontSize: "0.9rem" }}>
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #e2e8f0", fontSize: "1rem", outline: "none" }}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#64748b", fontWeight: "600", fontSize: "0.9rem" }}>
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={e => setDuration(Number(e.target.value))}
                  min="1"
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #e2e8f0", fontSize: "1rem", outline: "none" }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#64748b", fontWeight: "600", fontSize: "0.9rem" }}>
                  Marks per Question
                </label>
                <input
                  type="number"
                  value={marksPerQuestion}
                  onChange={e => setMarksPerQuestion(Number(e.target.value))}
                  min="0"
                  step="0.5"
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #e2e8f0", fontSize: "1rem", outline: "none" }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#64748b", fontWeight: "600", fontSize: "0.9rem" }}>
                  Negative Marking (per wrong answer)
                </label>
                <input
                  type="number"
                  value={negativeMarking}
                  onChange={e => setNegativeMarking(Number(e.target.value))}
                  min="0"
                  step="0.25"
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #e2e8f0", fontSize: "1rem", outline: "none" }}
                />
                <div style={{ marginTop: "5px", fontSize: "0.8rem", color: "#64748b" }}>
                  Set to 0 for no negative marking
                </div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#64748b", fontWeight: "600", fontSize: "0.9rem" }}>
                  Total Marks (Optional)
                </label>
                <input
                  type="number"
                  value={totalMarks}
                  onChange={e => setTotalMarks(Number(e.target.value))}
                  min="0"
                  placeholder="Auto-calculated if left 0"
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #e2e8f0", fontSize: "1rem", outline: "none" }}
                />
                <div style={{ marginTop: "5px", fontSize: "0.8rem", color: "#64748b" }}>
                  Leave 0 to auto-calculate from questions
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#64748b", fontWeight: "600", fontSize: "0.9rem" }}>
                  Instructions for Students
                </label>
                <textarea
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  rows="4"
                  placeholder="Enter exam instructions here..."
                  style={{ 
                    width: "100%", 
                    padding: "12px", 
                    borderRadius: "8px", 
                    border: "2px solid #e2e8f0", 
                    fontSize: "0.95rem", 
                    outline: "none",
                    resize: "vertical"
                  }}
                />
                <div style={{ marginTop: "5px", fontSize: "0.8rem", color: "#64748b" }}>
                  Default: "Read all questions carefully. Each question has 5 options. Select the correct answer."
                </div>
              </div>

              <button 
                onClick={addSeries}
                style={{ 
                  width: "100%",
                  padding: "14px", 
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "#fff", 
                  border: "none", 
                  borderRadius: "10px", 
                  fontWeight: "bold",
                  fontSize: "1rem",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)"
                }}
              >
                ➕ Create Test Series
              </button>
            </div>

            {/* Manage Test Series Panel */}
            <div>
              <div style={{
                background: "#fff",
                borderRadius: "15px",
                padding: "25px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                marginBottom: "20px"
              }}>
                <h2 style={{ color: "#1e293b", marginBottom: "20px", fontSize: "1.5rem" }}>
                  📝 Manage Test Series ({testSeries.length})
                </h2>
                
                {testSeries.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "10px" }}>📝</div>
                    <div>No test series created yet. Create one to get started!</div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {testSeries.map((series, idx) => {
                      const linkedSubjects = subjects.filter(s => 
                        series.subjectIds && series.subjectIds.includes(s.id)
                      );
                      return (
                      <div 
                        key={idx}
                        style={{
                          padding: "20px",
                          background: selectedSeries === idx ? "#f0f4ff" : "#f8fafc",
                          borderRadius: "12px",
                          border: selectedSeries === idx ? "2px solid #10b981" : "2px solid #e2e8f0",
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                      >
                        {linkedSubjects.length > 0 && (
                          <div style={{ marginBottom: "10px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            {linkedSubjects.map(subject => (
                              <div key={subject.id} style={{
                                display: "inline-block",
                                padding: "4px 12px",
                                background: "#e0e7ff",
                                color: "#667eea",
                                borderRadius: "20px",
                                fontSize: "0.85rem",
                                fontWeight: "600"
                              }}>
                                {subject.icon} {subject.name}
                              </div>
                            ))}
                          </div>
                        )}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
                          <div style={{ flex: 1 }}>
                            <input
                              type="text"
                              value={series.name}
                              onChange={e => editSeriesDetails(idx, "name", e.target.value)}
                              style={{
                                width: "100%",
                                padding: "8px",
                                fontSize: "1.1rem",
                                fontWeight: "bold",
                                color: "#1e293b",
                                border: "1px solid #e2e8f0",
                                borderRadius: "6px",
                                marginBottom: "10px"
                              }}
                            />
                            <div style={{ display: "flex", gap: "10px", fontSize: "0.9rem", color: "#64748b", flexWrap: "wrap", alignItems: "center" }}>
                              {/* Multi-select for subjects in edit mode */}
                              <div style={{ flex: "1 1 100%", marginBottom: "8px" }}>
                                <div style={{ fontSize: "0.85rem", fontWeight: "600", marginBottom: "6px", color: "#1e293b" }}>
                                  Linked Subjects:
                                </div>
                                <div style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: "6px",
                                  padding: "8px",
                                  background: "#fff",
                                  borderRadius: "6px",
                                  border: "1px solid #e2e8f0"
                                }}>
                                  {subjects.map((subject) => {
                                    const isLinked = series.subjectIds && series.subjectIds.includes(subject.id);
                                    return (
                                      <label 
                                        key={subject.id}
                                        style={{
                                          display: "inline-flex",
                                          alignItems: "center",
                                          padding: "4px 10px",
                                          background: isLinked ? "#e0e7ff" : "#f8fafc",
                                          border: isLinked ? "2px solid #667eea" : "1px solid #e2e8f0",
                                          borderRadius: "20px",
                                          cursor: "pointer",
                                          fontSize: "0.85rem",
                                          transition: "all 0.2s"
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isLinked}
                                          onChange={(e) => {
                                            const currentSubjectIds = series.subjectIds || [];
                                            let newSubjectIds;
                                            if (e.target.checked) {
                                              newSubjectIds = [...currentSubjectIds, subject.id];
                                            } else {
                                              newSubjectIds = currentSubjectIds.filter(id => id !== subject.id);
                                            }
                                            editSeriesDetails(idx, "subjectIds", newSubjectIds);
                                            
                                            // Update category
                                            const selectedSubjectNames = newSubjectIds
                                              .map(id => subjects.find(s => s.id === id)?.name)
                                              .filter(Boolean)
                                              .join(", ");
                                            editSeriesDetails(idx, "category", selectedSubjectNames || "General");
                                          }}
                                          style={{
                                            marginRight: "6px",
                                            cursor: "pointer"
                                          }}
                                        />
                                        <span style={{ marginRight: "4px" }}>{subject.icon}</span>
                                        <span style={{ fontWeight: isLinked ? "600" : "normal", color: isLinked ? "#667eea" : "#64748b" }}>
                                          {subject.name}
                                        </span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                              
                              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                                <select
                                  value={series.difficulty}
                                  onChange={e => editSeriesDetails(idx, "difficulty", e.target.value)}
                                  style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.85rem" }}
                                >
                                  <option value="Easy">Easy</option>
                                  <option value="Medium">Medium</option>
                                  <option value="Hard">Hard</option>
                                </select>
                                
                                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                  <span style={{ fontSize: "0.85rem" }}>⏱️</span>
                                  <input
                                    type="number"
                                    value={series.duration}
                                    onChange={e => editSeriesDetails(idx, "duration", Number(e.target.value))}
                                    style={{ width: "50px", padding: "4px 6px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.85rem" }}
                                  />
                                  <span style={{ fontSize: "0.85rem" }}>min</span>
                                </div>
                                
                                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                  <span style={{ fontSize: "0.85rem" }}>✅</span>
                                  <input
                                    type="number"
                                    value={series.marksPerQuestion || 1}
                                    onChange={e => editSeriesDetails(idx, "marksPerQuestion", Number(e.target.value))}
                                    step="0.5"
                                    style={{ width: "50px", padding: "4px 6px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.85rem" }}
                                  />
                                  <span style={{ fontSize: "0.85rem" }}>marks</span>
                                </div>
                                
                                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                  <span style={{ fontSize: "0.85rem" }}>❌</span>
                                  <input
                                    type="number"
                                    value={series.negativeMarking || 0.25}
                                    onChange={e => editSeriesDetails(idx, "negativeMarking", Number(e.target.value))}
                                    step="0.25"
                                    style={{ width: "50px", padding: "4px 6px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.85rem" }}
                                  />
                                  <span style={{ fontSize: "0.85rem" }}>neg</span>
                                </div>
                              </div>
                              
                              <div style={{ marginTop: "10px" }}>
                                <textarea
                                  value={series.instructions || ""}
                                  onChange={e => editSeriesDetails(idx, "instructions", e.target.value)}
                                  placeholder="Exam instructions..."
                                  rows="2"
                                  style={{
                                    width: "100%",
                                    padding: "8px",
                                    borderRadius: "6px",
                                    border: "1px solid #e2e8f0",
                                    fontSize: "0.85rem",
                                    resize: "vertical"
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: "8px", marginLeft: "10px" }}>
                            <button
                              onClick={() => selectSeries(idx)}
                              style={{
                                padding: "8px 16px",
                                background: selectedSeries === idx ? "#10b981" : "#3b82f6",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                fontWeight: "600",
                                cursor: "pointer",
                                fontSize: "0.9rem"
                              }}
                            >
                              {selectedSeries === idx ? "✓ Selected" : "Select"}
                            </button>
                            <button
                              onClick={() => deleteSeries(idx)}
                              style={{
                                padding: "8px 16px",
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
                        </div>
                        <div style={{ 
                          fontSize: "0.85rem", 
                          color: "#64748b", 
                          marginTop: "10px",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "15px"
                        }}>
                          <div>📝 {series.questions.length} Questions</div>
                          <div>⏱️ {series.duration} min</div>
                          <div>✅ +{series.marksPerQuestion || 1} marks</div>
                          <div>❌ -{series.negativeMarking || 0.25} marks</div>
                          {series.totalMarks > 0 && <div>🎯 Total: {series.totalMarks} marks</div>}
                          <div>📂 {series.sections?.length || 0} Sections</div>
                        </div>
                        
                        {/* Manage Sections Button */}
                        <button
                          onClick={() => {
                            setSelectedSeries(idx);
                            setViewMode("sections");
                            setSelectedSection(null);
                            setSelectedSet(null);
                          }}
                          style={{
                            padding: "10px 20px",
                            background: "#f59e0b",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            cursor: "pointer",
                            marginTop: "12px",
                            width: "100%",
                            fontSize: "0.95rem"
                          }}
                        >
                          📂 Manage Sections & Sets
                        </button>
                      </div>
                    )})}
                  </div>
                )}
              </div>

              {/* Sections View */}
              {viewMode === "sections" && selectedSeries !== null && (
                <div style={{
                  background: "#fff",
                  borderRadius: "15px",
                  padding: "25px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
                }}>
                  <div style={{ marginBottom: "20px" }}>
                    <button onClick={() => setViewMode("series")} style={{
                      padding: "8px 16px",
                      background: "#e2e8f0",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}>
                      ← Back to Test Series
                    </button>
                  </div>

                  <h3 style={{ marginBottom: "20px", color: "#1e293b" }}>
                    📂 Sections in: {testSeries[selectedSeries].name}
                  </h3>

                  {/* Add Section Form */}
                  <div style={{ marginBottom: "20px", padding: "15px", background: "#f8fafc", borderRadius: "8px" }}>
                    <input
                      type="text"
                      value={sectionName}
                      onChange={(e) => setSectionName(e.target.value)}
                      placeholder="Section name (e.g., Previous Year, Section A)"
                      style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "10px",
                        borderRadius: "6px",
                        border: "1px solid #e2e8f0"
                      }}
                    />
                    <button onClick={addSection} style={{
                      padding: "10px 20px",
                      background: "#10b981",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}>
                      ➕ Add Section
                    </button>
                  </div>

                  {/* Sections List */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {testSeries[selectedSeries].sections?.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                        No sections yet. Add your first section above.
                      </div>
                    ) : (
                      testSeries[selectedSeries].sections?.map((section, sIdx) => (
                        <div key={sIdx} style={{
                          padding: "15px",
                          background: "#f8fafc",
                          borderRadius: "8px",
                          border: "2px solid #e2e8f0"
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <strong style={{ fontSize: "1.1rem", color: "#1e293b" }}>{section.name}</strong>
                              <div style={{ fontSize: "0.9rem", color: "#64748b", marginTop: "4px" }}>
                                {section.sets?.length || 0} sets
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: "10px" }}>
                              <button onClick={() => {
                                setSelectedSection(sIdx);
                                setViewMode("sets");
                              }} style={{
                                padding: "8px 16px",
                                background: "#667eea",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontWeight: "600"
                              }}>
                                Manage Sets
                              </button>
                              <button onClick={() => deleteSection(sIdx)} style={{
                                padding: "8px 16px",
                                background: "#ef4444",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontWeight: "600"
                              }}>
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Sets View */}
              {viewMode === "sets" && selectedSection !== null && (
                <div style={{
                  background: "#fff",
                  borderRadius: "15px",
                  padding: "25px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
                }}>
                  <div style={{ marginBottom: "20px" }}>
                    <button onClick={() => setViewMode("sections")} style={{
                      padding: "8px 16px",
                      background: "#e2e8f0",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}>
                      ← Back to Sections
                    </button>
                  </div>

                  <h3 style={{ marginBottom: "20px", color: "#1e293b" }}>
                    📝 Sets in: {testSeries[selectedSeries].sections[selectedSection].name}
                  </h3>

                  {/* Add Set Form */}
                  <div style={{ marginBottom: "20px", padding: "15px", background: "#f8fafc", borderRadius: "8px" }}>
                    <input
                      type="text"
                      value={setName}
                      onChange={(e) => setSetName(e.target.value)}
                      placeholder="Set name (e.g., 2023 Paper, Set 1)"
                      style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "10px",
                        borderRadius: "6px",
                        border: "1px solid #e2e8f0"
                      }}
                    />
                    <input
                      type="text"
                      value={setYear}
                      onChange={(e) => setSetYear(e.target.value)}
                      placeholder="Year (optional, e.g., 2023)"
                      style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "10px",
                        borderRadius: "6px",
                        border: "1px solid #e2e8f0"
                      }}
                    />
                    <button onClick={addSet} style={{
                      padding: "10px 20px",
                      background: "#10b981",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}>
                      ➕ Add Set
                    </button>
                  </div>

                  {/* Sets List */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {testSeries[selectedSeries].sections[selectedSection].sets?.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                        No sets yet. Add your first set above.
                      </div>
                    ) : (
                      testSeries[selectedSeries].sections[selectedSection].sets?.map((set, setIdx) => (
                        <div key={setIdx} style={{
                          padding: "15px",
                          background: "#f8fafc",
                          borderRadius: "8px",
                          border: "2px solid #e2e8f0"
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <strong style={{ fontSize: "1.1rem", color: "#1e293b" }}>{set.name}</strong>
                              {set.year && <span style={{ marginLeft: "10px", color: "#64748b" }}>({set.year})</span>}
                              <div style={{ fontSize: "0.9rem", color: "#64748b", marginTop: "4px" }}>
                                {set.questions?.length || 0} questions
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: "10px" }}>
                              <button onClick={() => {
                                setSelectedSet(setIdx);
                                setViewMode("questions");
                              }} style={{
                                padding: "8px 16px",
                                background: "#667eea",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontWeight: "600"
                              }}>
                                Manage Questions
                              </button>
                              <button onClick={() => deleteSet(setIdx)} style={{
                                padding: "8px 16px",
                                background: "#ef4444",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontWeight: "600"
                              }}>
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Questions View for Sets */}
              {viewMode === "questions" && selectedSet !== null && (
                <div style={{
                  background: "#fff",
                  borderRadius: "15px",
                  padding: "25px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
                }}>
                  <div style={{ marginBottom: "20px" }}>
                    <button onClick={() => setViewMode("sets")} style={{
                      padding: "8px 16px",
                      background: "#e2e8f0",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}>
                      ← Back to Sets
                    </button>
                  </div>

                  <h3 style={{ marginBottom: "20px", color: "#1e293b" }}>
                    ❓ Questions in: {testSeries[selectedSeries].sections[selectedSection].sets[selectedSet].name}
                  </h3>

                  {/* JSON Import/AI Generator Buttons for Set Questions */}
                  <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                    <button
                      onClick={() => {
                        setShowSetJsonImport(!showSetJsonImport);
                        setShowSetAiGenerator(false);
                      }}
                      style={{
                        flex: 1,
                        padding: "12px",
                        background: showSetJsonImport ? "#10b981" : "#667eea",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      📄 {showSetJsonImport ? "Hide" : "Import JSON"}
                    </button>
                    <button
                      onClick={() => {
                        setShowSetAiGenerator(!showSetAiGenerator);
                        setShowSetJsonImport(false);
                      }}
                      style={{
                        flex: 1,
                        padding: "12px",
                        background: showSetAiGenerator ? "#10b981" : "#f59e0b",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      🤖 {showSetAiGenerator ? "Hide" : "AI Generator"}
                    </button>
                  </div>

                  {/* JSON Import Panel for Set Questions */}
                  {showSetJsonImport && (
                    <div style={{
                      marginBottom: "20px",
                      padding: "20px",
                      background: "#f0f9ff",
                      borderRadius: "12px",
                      border: "2px solid #3b82f6"
                    }}>
                      <h4 style={{ marginBottom: "10px", color: "#1e40af" }}>📄 Import Questions from JSON</h4>
                      <div style={{ 
                        marginBottom: "15px", 
                        padding: "12px", 
                        background: "#dbeafe", 
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        color: "#1e40af"
                      }}>
                        <strong>🤖 AI Auto-Fix Enabled!</strong>
                        <div style={{ marginTop: "6px", fontSize: "0.85rem" }}>
                          • Missing questions → Auto-filled<br/>
                          • Wrong option count → Fixed to 5<br/>
                          • Invalid answers → Set to 0<br/>
                          • AI will show all errors before importing
                        </div>
                      </div>
                      <textarea
                        value={sectionSetJsonInput}
                        onChange={(e) => setSectionSetJsonInput(e.target.value)}
                        placeholder='Paste JSON array here: [{"q":"Question?","options":["A","B","C","D","E"],"answer":0}, ...]'
                        rows="8"
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "2px solid #93c5fd",
                          fontFamily: "monospace",
                          fontSize: "0.9rem",
                          marginBottom: "10px"
                        }}
                      />
                      <button
                        onClick={() => {
                          try {
                            const parsed = JSON.parse(sectionSetJsonInput);
                            if (!Array.isArray(parsed)) {
                              alert("❌ JSON must be an array of questions!\n\nExample:\n[{\"q\":\"Question?\",\"options\":[\"A\",\"B\",\"C\",\"D\",\"E\"],\"answer\":0}]");
                              return;
                            }
                            
                            const errors = [];
                            const fixed = parsed.map((q, idx) => {
                              const issues = [];
                              if (!q.q || typeof q.q !== "string") issues.push("missing/invalid question");
                              if (!Array.isArray(q.options) || q.options.length !== 5) issues.push("must have exactly 5 options");
                              if (typeof q.answer !== "number" || q.answer < 0 || q.answer > 4) issues.push("answer must be 0-4");
                              
                              if (issues.length > 0) {
                                errors.push(`Q${idx + 1}: ${issues.join(", ")}`);
                              }
                              
                              return {
                                q: q.q || `Question ${idx + 1}`,
                                options: Array.isArray(q.options) ? [...q.options.slice(0, 5), ...Array(Math.max(0, 5 - q.options.length)).fill(`Option ${["A","B","C","D","E"][q.options.length] || "?"}`)] : ["Option A", "Option B", "Option C", "Option D", "Option E"],
                                answer: (typeof q.answer === "number" && q.answer >= 0 && q.answer <= 4) ? q.answer : 0
                              };
                            });
                            
                            if (errors.length > 0) {
                              const errorList = errors.slice(0, 10).join("\n");
                              const moreErrors = errors.length > 10 ? `\n\n...and ${errors.length - 10} more errors` : "";
                              const proceed = window.confirm(
                                `🤖 AI FOUND ${errors.length} ERROR(S):\n\n${errorList}${moreErrors}\n\n✅ AI HAS AUTO-FIXED ALL ERRORS!\n\nFixed:\n- Missing questions → Added placeholder\n- Wrong option count → Added/removed to make 5\n- Invalid answer → Set to 0 (first option)\n\nClick OK to import with fixes, Cancel to edit manually.`
                              );
                              if (!proceed) return;
                            }
                            
                            const updated = [...testSeries];
                            updated[selectedSeries].sections[selectedSection].sets[selectedSet].questions.push(...fixed);
                            setTestSeries(updated);
                            setSectionSetJsonInput("");
                            setShowSetJsonImport(false);
                            alert(`✅ Successfully imported ${fixed.length} questions!${errors.length > 0 ? `\n\n🤖 AI fixed ${errors.length} error(s) automatically!` : ""}`);
                          } catch (err) {
                            alert(`❌ INVALID JSON FORMAT!\n\nError: ${err.message}\n\nExpected format:\n[{"q":"Question?","options":["A","B","C","D","E"],"answer":0}]\n\nTips:\n- Use double quotes, not single quotes\n- Answer must be 0-4 (0=first option)\n- Must have exactly 5 options`);
                          }
                        }}
                        style={{
                          padding: "10px 20px",
                          background: "#3b82f6",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: "600",
                          cursor: "pointer"
                        }}
                      >
                        🚀 Import with AI Auto-Fix
                      </button>
                    </div>
                  )}

                  {/* AI Generator Panel for Set Questions */}
                  {showSetAiGenerator && (
                    <div style={{
                      marginBottom: "20px",
                      padding: "20px",
                      background: "#fffbeb",
                      borderRadius: "12px",
                      border: "2px solid #f59e0b"
                    }}>
                      <h4 style={{ marginBottom: "15px", color: "#92400e" }}>🤖 AI Question Generator</h4>
                      <input
                        type="text"
                        value={sectionSetAiTopic}
                        onChange={(e) => setSectionSetAiTopic(e.target.value)}
                        placeholder="Enter topic (e.g., Indian History, Physics)"
                        style={{
                          width: "100%",
                          padding: "10px",
                          marginBottom: "10px",
                          borderRadius: "8px",
                          border: "2px solid #fbbf24"
                        }}
                      />
                      <input
                        type="number"
                        value={sectionSetAiQuestionCount}
                        onChange={(e) => setSectionSetAiQuestionCount(Number(e.target.value))}
                        placeholder="Number of questions"
                        min="1"
                        max="50"
                        style={{
                          width: "100%",
                          padding: "10px",
                          marginBottom: "10px",
                          borderRadius: "8px",
                          border: "2px solid #fbbf24"
                        }}
                      />
                      <button
                        onClick={() => {
                          if (!sectionSetAiTopic.trim()) {
                            alert("Please enter a topic!");
                            return;
                          }
                          
                          const generated = [];
                          for (let i = 0; i < sectionSetAiQuestionCount; i++) {
                            generated.push({
                              q: `AI Generated question ${i + 1} about ${sectionSetAiTopic}?`,
                              options: ["Option A", "Option B", "Option C", "Option D", "Option E"],
                              answer: Math.floor(Math.random() * 5)
                            });
                          }
                          
                          const updated = [...testSeries];
                          updated[selectedSeries].sections[selectedSection].sets[selectedSet].questions.push(...generated);
                          setTestSeries(updated);
                          setSectionSetAiTopic("");
                          setSectionSetAiQuestionCount(10);
                          setShowSetAiGenerator(false);
                          alert(`✅ Generated ${generated.length} questions! (Note: This is a demo. Replace with real AI API)`);
                        }}
                        style={{
                          padding: "10px 20px",
                          background: "#f59e0b",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: "600",
                          cursor: "pointer"
                        }}
                      >
                        🚀 Generate Questions
                      </button>
                    </div>
                  )}

                  {/* Add Question Form */}
                  <div style={{ marginBottom: "20px", padding: "20px", background: "#f8fafc", borderRadius: "8px" }}>
                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Enter question..."
                      rows="3"
                      style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "10px",
                        borderRadius: "6px",
                        border: "1px solid #e2e8f0",
                        fontSize: "1rem"
                      }}
                    />
                    
                    <div style={{ marginBottom: "10px" }}>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#64748b" }}>
                        Options (5 required):
                      </label>
                      {options.map((opt, i) => (
                        <input
                          key={i}
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...options];
                            newOpts[i] = e.target.value;
                            setOptions(newOpts);
                          }}
                          placeholder={`Option ${i + 1}`}
                          style={{
                            width: "100%",
                            padding: "8px",
                            marginBottom: "8px",
                            borderRadius: "6px",
                            border: "1px solid #e2e8f0"
                          }}
                        />
                      ))}
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#64748b" }}>
                        Correct Answer (0-4):
                      </label>
                      <input
                        type="number"
                        value={answer}
                        onChange={(e) => setAnswer(Number(e.target.value))}
                        min="0"
                        max="4"
                        style={{
                          width: "100px",
                          padding: "8px",
                          borderRadius: "6px",
                          border: "1px solid #e2e8f0"
                        }}
                      />
                    </div>

                    <button onClick={addSetQuestion} style={{
                      padding: "10px 20px",
                      background: editingQuestion !== null ? "#f59e0b" : "#10b981",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}>
                      {editingQuestion !== null ? "💾 Update Question" : "➕ Add Question"}
                    </button>
                    {editingQuestion !== null && (
                      <button onClick={() => {
                        setEditingQuestion(null);
                        setQuestion("");
                        setOptions(["", "", "", "", ""]);
                        setAnswer(0);
                      }} style={{
                        padding: "10px 20px",
                        background: "#94a3b8",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "600",
                        marginLeft: "10px"
                      }}>
                        Cancel
                      </button>
                    )}
                  </div>

                  {/* Questions List */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {testSeries[selectedSeries].sections[selectedSection].sets[selectedSet].questions?.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                        No questions yet. Add your first question above.
                      </div>
                    ) : (
                      testSeries[selectedSeries].sections[selectedSection].sets[selectedSet].questions?.map((q, qIdx) => (
                        <div key={qIdx} style={{
                          padding: "15px",
                          background: "#fff",
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0"
                        }}>
                          <div style={{ marginBottom: "10px" }}>
                            <strong style={{ color: "#1e293b" }}>Q{qIdx + 1}:</strong> {q.q}
                          </div>
                          <div style={{ marginLeft: "20px", fontSize: "0.9rem" }}>
                            {q.options.map((opt, i) => (
                              <div key={i} style={{ 
                                color: i === q.answer ? "#10b981" : "#64748b",
                                fontWeight: i === q.answer ? "600" : "normal"
                              }}>
                                {i === q.answer ? "✓" : "○"} {opt}
                              </div>
                            ))}
                          </div>
                          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                            <button onClick={() => editSetQuestion(qIdx)} style={{
                              padding: "6px 12px",
                              background: "#3b82f6",
                              color: "#fff",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "0.85rem"
                            }}>
                              Edit
                            </button>
                            <button onClick={() => deleteSetQuestion(qIdx)} style={{
                              padding: "6px 12px",
                              background: "#ef4444",
                              color: "#fff",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "0.85rem"
                            }}>
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Question Management for Selected Test Series */}
              {selectedSeries !== null && (viewMode === "series" || !viewMode) && (
                <div style={{
                  background: "#fff",
                  borderRadius: "15px",
                  padding: "25px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
                }}>
                  <h2 style={{ color: "#1e293b", marginBottom: "20px", fontSize: "1.5rem" }}>
                    {editingQuestion !== null ? "✏️ Edit Question" : "➕ Add Question"} to: {testSeries[selectedSeries].name}
                  </h2>

                  {/* JSON Import/Export/AI Generator Buttons */}
                  <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                    <button
                      onClick={() => {
                        setShowSeriesJsonImport(!showSeriesJsonImport);
                        setShowSeriesAiGenerator(false);
                      }}
                      style={{
                        flex: 1,
                        padding: "12px",
                        background: showSeriesJsonImport ? "#f59e0b" : "#3b82f6",
                        color: "#fff",
                        border: "none",
                        borderRadius: "10px",
                        fontWeight: "600",
                        cursor: "pointer",
                        fontSize: "0.95rem"
                      }}
                    >
                      {showSeriesJsonImport ? "📝 Manual Entry" : "📥 Bulk Import (JSON)"}
                    </button>
                    <button
                      onClick={() => {
                        setShowSeriesAiGenerator(!showSeriesAiGenerator);
                        setShowSeriesJsonImport(false);
                      }}
                      style={{
                        flex: 1,
                        padding: "12px",
                        background: showSeriesAiGenerator ? "#f59e0b" : "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "10px",
                        fontWeight: "600",
                        cursor: "pointer",
                        fontSize: "0.95rem",
                        boxShadow: showSeriesAiGenerator ? "none" : "0 4px 15px rgba(139, 92, 246, 0.4)"
                      }}
                    >
                      {showSeriesAiGenerator ? "📝 Manual Entry" : "🤖 AI Generator"}
                    </button>
                    <button
                      onClick={exportSeriesQuestionsToJson}
                      style={{
                        flex: 1,
                        padding: "12px",
                        background: "#10b981",
                        color: "#fff",
                        border: "none",
                        borderRadius: "10px",
                        fontWeight: "600",
                        cursor: "pointer",
                        fontSize: "0.95rem"
                      }}
                    >
                      📤 Export Questions (JSON)
                    </button>
                  </div>

                  {/* AI Question Generator */}
                  {showSeriesAiGenerator && (
                    <div style={{
                      padding: "20px",
                      background: "linear-gradient(135deg, #f0f9ff 0%, #fef3c7 100%)",
                      borderRadius: "12px",
                      border: "2px solid #8b5cf6",
                      marginBottom: "20px"
                    }}>
                      <h3 style={{ color: "#7c3aed", marginBottom: "15px", fontSize: "1.1rem" }}>
                        🤖 AI Question Generator
                      </h3>
                      
                      <div style={{
                        padding: "15px",
                        background: "#fff",
                        borderRadius: "8px",
                        marginBottom: "15px",
                        fontSize: "0.85rem",
                        color: "#64748b",
                        border: "1px solid #e2e8f0"
                      }}>
                        <strong style={{ color: "#1e293b" }}>How it works:</strong>
                        <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
                          <li>Enter any topic (e.g., "Indian History", "Mathematics", "Science")</li>
                          <li>Choose number of questions (1-100)</li>
                          <li>AI will generate template questions</li>
                          <li>Edit the generated questions as needed</li>
                          <li>Import when ready!</li>
                        </ul>
                      </div>

                      <div style={{ marginBottom: "15px" }}>
                        <label style={{ display: "block", marginBottom: "8px", color: "#7c3aed", fontWeight: "600" }}>
                          Topic / Subject:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Indian History, Mathematics, General Knowledge"
                          value={seriesAiTopic}
                          onChange={e => setSeriesAiTopic(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "2px solid #8b5cf6",
                            fontSize: "1rem",
                            outline: "none"
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: "15px" }}>
                        <label style={{ display: "block", marginBottom: "8px", color: "#7c3aed", fontWeight: "600" }}>
                          Number of Questions:
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={seriesAiQuestionCount}
                          onChange={e => setSeriesAiQuestionCount(Number(e.target.value))}
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "2px solid #8b5cf6",
                            fontSize: "1rem",
                            outline: "none"
                          }}
                        />
                      </div>

                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          onClick={generateSeriesQuestionsWithAI}
                          style={{
                            flex: 1,
                            padding: "14px",
                            background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            cursor: "pointer",
                            boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)"
                          }}
                        >
                          🤖 Generate Questions
                        </button>
                        <button
                          onClick={() => {
                            setShowSeriesAiGenerator(false);
                            setSeriesAiTopic("");
                            setSeriesAiQuestionCount(10);
                          }}
                          style={{
                            padding: "14px 20px",
                            background: "#94a3b8",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            cursor: "pointer"
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* JSON Import Section */}
                  {showSeriesJsonImport ? (
                    <div style={{
                      padding: "20px",
                      background: "#f0f9ff",
                      borderRadius: "12px",
                      border: "2px solid #3b82f6",
                      marginBottom: "20px"
                    }}>
                      <h3 style={{ color: "#1e40af", marginBottom: "15px", fontSize: "1.1rem" }}>
                        📥 Bulk Import Questions (JSON Format)
                      </h3>
                      
                      <div style={{
                        padding: "15px",
                        background: "#fff",
                        borderRadius: "8px",
                        marginBottom: "15px",
                        fontSize: "0.85rem",
                        color: "#64748b",
                        border: "1px solid #e2e8f0"
                      }}>
                        <strong style={{ color: "#1e293b" }}>JSON Format Example:</strong>
                        <pre style={{ 
                          margin: "10px 0 0 0", 
                          padding: "10px",
                          background: "#f8fafc",
                          borderRadius: "6px",
                          overflow: "auto",
                          fontSize: "0.8rem"
                        }}>
{`[
  {
    "q": "What is the capital of France?",
    "options": ["London", "Paris", "Berlin", "Madrid", "Rome"],
    "answer": 1
  },
  {
    "q": "What is 2 + 2?",
    "options": ["3", "4", "5", "6", "7"],
    "answer": 1
  }
]`}
                        </pre>
                        <div style={{ marginTop: "10px", color: "#ef4444", fontSize: "0.85rem" }}>
                          <strong>Important:</strong> Each question must have "q" (question text), "options" (array of exactly 5 strings), and "answer" (number 0-4 for correct option index)
                        </div>
                        <div style={{ marginTop: "10px", padding: "10px", background: "#fef3c7", borderRadius: "6px", fontSize: "0.85rem", color: "#92400e" }}>
                          <strong>🤖 AI Auto-Fix Features:</strong>
                          <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
                            <li>Fixes missing brackets [ ]</li>
                            <li>Converts single quotes to double quotes</li>
                            <li>Removes trailing commas</li>
                            <li>Adds quotes to unquoted keys</li>
                            <li>Fixes missing or wrong field names</li>
                            <li>Auto-completes missing options</li>
                            <li>Corrects answer index values</li>
                          </ul>
                        </div>
                      </div>

                      <label style={{ display: "block", marginBottom: "8px", color: "#1e40af", fontWeight: "600" }}>
                        Paste JSON Array Here:
                      </label>
                      <textarea
                        placeholder='[{"q": "Your question?", "options": ["A", "B", "C", "D", "E"], "answer": 0}]'
                        value={seriesJsonInput}
                        onChange={e => setSeriesJsonInput(e.target.value)}
                        rows="10"
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "2px solid #3b82f6",
                          fontSize: "0.9rem",
                          fontFamily: "monospace",
                          outline: "none",
                          resize: "vertical"
                        }}
                      />

                      <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                        <button
                          onClick={convertSeriesTextToJson}
                          style={{
                            flex: 1,
                            padding: "14px",
                            background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            cursor: "pointer",
                            boxShadow: "0 4px 15px rgba(6, 182, 212, 0.4)"
                          }}
                        >
                          📝 Text to JSON
                        </button>
                        <button
                          onClick={aiFixSeriesJson}
                          style={{
                            flex: 1,
                            padding: "14px",
                            background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            cursor: "pointer",
                            boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)"
                          }}
                        >
                          🤖 AI Auto-Fix
                        </button>
                        <button
                          onClick={validateAndShowSeriesErrors}
                          style={{
                            flex: 1,
                            padding: "14px",
                            background: "#f59e0b",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            cursor: "pointer",
                            boxShadow: "0 4px 15px rgba(245, 158, 11, 0.4)"
                          }}
                        >
                          🔍 Check Errors
                        </button>
                      </div>
                      
                      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <button
                          onClick={importSeriesQuestionsFromJson}
                          style={{
                            flex: 1,
                            padding: "14px",
                            background: "#10b981",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            cursor: "pointer",
                            boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)"
                          }}
                        >
                          ✅ Import All Questions
                        </button>
                        <button
                          onClick={() => {
                            setShowSeriesJsonImport(false);
                            setSeriesJsonInput("");
                          }}
                          style={{
                            padding: "14px 20px",
                            background: "#94a3b8",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            cursor: "pointer"
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Manual Question Entry Form */}
                  <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "8px", color: "#64748b", fontWeight: "600", fontSize: "0.9rem" }}>
                      Question
                    </label>
                    <textarea
                      placeholder="Enter your question here..."
                      value={question}
                      onChange={e => setQuestion(e.target.value)}
                      rows="3"
                      style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #e2e8f0", fontSize: "1rem", outline: "none", resize: "vertical" }}
                    />
                  </div>

                  {options.map((opt, idx) => (
                    <div key={idx} style={{ marginBottom: "12px" }}>
                      <label style={{ display: "block", marginBottom: "6px", color: "#64748b", fontWeight: "600", fontSize: "0.9rem" }}>
                        Option {idx + 1}
                      </label>
                      <input
                        type="text"
                        placeholder={`Enter option ${idx + 1}`}
                        value={opt}
                        onChange={e => {
                          const newOpts = [...options];
                          newOpts[idx] = e.target.value;
                          setOptions(newOpts);
                        }}
                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #e2e8f0", fontSize: "1rem", outline: "none" }}
                      />
                    </div>
                  ))}

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", color: "#64748b", fontWeight: "600", fontSize: "0.9rem" }}>
                      Correct Answer
                    </label>
                    <select
                      value={answer}
                      onChange={e => setAnswer(Number(e.target.value))}
                      style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #e2e8f0", fontSize: "1rem", outline: "none" }}
                    >
                      {options.map((opt, idx) => (
                        <option key={idx} value={idx}>
                          Option {idx + 1}: {opt || "(empty)"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button 
                      onClick={addQuestion}
                      style={{ 
                        flex: 1,
                        padding: "14px", 
                        background: editingQuestion !== null ? "#f59e0b" : "#10b981",
                        color: "#fff", 
                        border: "none", 
                        borderRadius: "10px", 
                        fontWeight: "bold",
                        fontSize: "1rem",
                        cursor: "pointer",
                        boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)"
                      }}
                    >
                      {editingQuestion !== null ? "💾 Update Question" : "➕ Add Question"}
                    </button>
                    {editingQuestion !== null && (
                      <button 
                        onClick={() => {
                          setEditingQuestion(null);
                          setQuestion("");
                          setOptions(["", "", "", "", ""]);
                          setAnswer(0);
                        }}
                        style={{ 
                          padding: "14px 20px", 
                          background: "#94a3b8",
                          color: "#fff", 
                          border: "none", 
                          borderRadius: "10px", 
                          fontWeight: "bold",
                          fontSize: "1rem",
                          cursor: "pointer"
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                  </>
                  )}

                  {/* Questions List */}
                  {testSeries[selectedSeries].questions.length > 0 && (
                    <div style={{ marginTop: "30px" }}>
                      <h3 style={{ color: "#1e293b", marginBottom: "15px", fontSize: "1.2rem" }}>
                        📋 Questions ({testSeries[selectedSeries].questions.length})
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {testSeries[selectedSeries].questions.map((q, i) => (
                          <div 
                            key={i}
                            style={{ 
                              padding: "15px",
                              background: "#f8fafc",
                              borderRadius: "10px",
                              border: "1px solid #e2e8f0"
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: "600", color: "#1e293b", marginBottom: "8px" }}>
                                  Q{i + 1}: {q.q}
                                </div>
                                <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "5px" }}>
                                  {q.options.map((opt, idx) => (
                                    <div key={idx} style={{
                                      padding: "4px 0",
                                      color: idx === q.answer ? "#10b981" : "#64748b",
                                      fontWeight: idx === q.answer ? "600" : "normal"
                                    }}>
                                      {idx + 1}. {opt} {idx === q.answer && "✓"}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div style={{ display: "flex", gap: "8px", marginLeft: "10px" }}>
                                <button
                                  onClick={() => editQuestion(i)}
                                  style={{
                                    padding: "6px 12px",
                                    background: "#3b82f6",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "6px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    fontSize: "0.85rem"
                                  }}
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  onClick={() => deleteQuestion(i)}
                                  style={{
                                    padding: "6px 12px",
                                    background: "#ef4444",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "6px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    fontSize: "0.85rem"
                                  }}
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
