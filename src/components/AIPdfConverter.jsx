import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function AIPdfConverter({ onQuestionsGenerated, onClose }) {
  const [pdfFile, setPdfFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setError('');
    } else {
      setError('Please select a valid PDF file');
      setPdfFile(null);
    }
  };

  const extractTextFromPDF = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          // Convert PDF to base64
          const base64 = e.target.result.split(',')[1];
          resolve(base64);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read PDF file'));
      reader.readAsDataURL(file);
    });
  };

  const processWithAI = async () => {
    if (!pdfFile) {
      setError('Please select a PDF file first');
      return;
    }

    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      setError('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to .env file');
      return;
    }

    setProcessing(true);
    setProgress('Reading PDF file...');
    setError('');

    try {
      // Extract PDF content
      const base64Data = await extractTextFromPDF(pdfFile);
      
      setProgress('Analyzing PDF with AI...');

      // Use Gemini 2.5 Flash for PDF analysis (FREE tier available)
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `Extract all multiple choice questions from this PDF and return them as a JSON array.

For each question, provide:
- question: The complete question text (single line, no line breaks)
- options: Array of 4 options
- answer: Index of correct answer (0, 1, 2, or 3)
- explanation: Brief explanation of the answer

IMPORTANT:
- Return ONLY a valid JSON array, nothing else
- No markdown, no code blocks, no extra text
- Use double quotes for all strings
- No line breaks inside strings
- Replace line breaks with spaces

Example format:
[{"question":"What is 2+2?","options":["1","2","3","4"],"answer":3,"explanation":"2+2 equals 4"}]

Extract all questions now:`;

      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: 'application/pdf'
        }
      };

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      console.log('AI Response Length:', text.length);
      console.log('AI Response Preview:', text.substring(0, 500));

      setProgress('Processing AI response...');

      // Extract JSON from response
      let jsonText = text.trim();
      
      // Remove markdown code blocks if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
      }

      // Try to find JSON array in the response
      const jsonArrayMatch = jsonText.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonArrayMatch) {
        jsonText = jsonArrayMatch[0];
        console.log('Extracted JSON array, length:', jsonText.length);
      }

      // Clean up control characters and invalid JSON characters
      // Step 1: Remove all control characters except those we'll escape
      jsonText = jsonText.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F]/g, '');
      
      // Step 2: Fix common JSON issues before parsing
      jsonText = jsonText
        .replace(/\r\n/g, ' ') // Replace Windows line breaks with space
        .replace(/\n/g, ' ') // Replace Unix line breaks with space
        .replace(/\r/g, ' ') // Replace Mac line breaks with space
        .replace(/\t/g, ' ') // Replace tabs with space
        .replace(/\\/g, '\\\\') // Escape backslashes first
        .replace(/\\\\"/g, '\\"') // Fix double-escaped quotes
        .replace(/\\\\n/g, ' ') // Fix double-escaped newlines
        .replace(/\\\\t/g, ' ') // Fix double-escaped tabs
        .replace(/\s+/g, ' ') // Normalize multiple spaces
        .trim();

      console.log('Cleaned JSON preview:', jsonText.substring(0, 300));

      // Try to parse JSON with multiple fallback strategies
      let questions;
      try {
        questions = JSON.parse(jsonText);
        console.log('JSON parsed successfully on first attempt');
      } catch (parseError) {
        console.error('JSON Parse Error (Attempt 1):', parseError.message);
        console.log('Error position:', parseError.message.match(/position (\d+)/)?.[1]);
        
        // Strategy 2: Try to extract JSON array from text
        try {
          const arrayMatch = jsonText.match(/\[[\s\S]*\]/);
          if (arrayMatch) {
            jsonText = arrayMatch[0];
            questions = JSON.parse(jsonText);
            console.log('JSON parsed successfully on second attempt');
          } else {
            throw new Error('No JSON array found');
          }
        } catch (secondError) {
          console.error('JSON Parse Error (Attempt 2):', secondError.message);
          
          // Strategy 3: Advanced cleaning
          try {
            jsonText = jsonText
              .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
              .replace(/([{,]\s*)(\w+):/g, '$1"$2":') // Add quotes to unquoted keys
              .replace(/:\s*'([^']*)'/g, ': "$1"') // Replace single quotes with double
              .replace(/\\'/g, "'") // Fix escaped single quotes
              .replace(/[\u201C\u201D]/g, '"') // Replace smart quotes
              .replace(/[\u2018\u2019]/g, "'") // Replace smart single quotes
              .replace(/…/g, '...') // Replace ellipsis
              .replace(/–/g, '-') // Replace en dash
              .replace(/—/g, '-') // Replace em dash
              .replace(/\u00A0/g, ' ') // Replace non-breaking space
              .trim();
            
            questions = JSON.parse(jsonText);
            console.log('JSON parsed successfully on third attempt');
          } catch (thirdError) {
            console.error('JSON Parse Error (Attempt 3):', thirdError.message);
            console.log('Failed JSON sample:', jsonText.substring(0, 500));
            
            // Strategy 4: Show detailed error with AI response
            throw new Error(`JSON parsing failed after 3 attempts. AI returned: "${text.substring(0, 200)}..." - This might not be valid JSON. Please try a simpler PDF.`);
          }
        }
      }

      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('No questions found in the PDF');
      }

      // Post-process and validate questions
      questions = questions.map((q, index) => {
        // Ensure all required fields exist
        if (!q.question || !q.options || !Array.isArray(q.options)) {
          console.warn(`Question ${index + 1} missing required fields, skipping`);
          return null;
        }

        // Clean and validate question text
        let cleanQuestion = String(q.question || '')
          .replace(/\s+/g, ' ') // Normalize spaces
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control chars
          .trim();

        // Clean and validate options
        let cleanOptions = (q.options || []).map(opt => 
          String(opt || '')
            .replace(/\s+/g, ' ')
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
            .trim()
        );

        // Ensure exactly 4 options
        while (cleanOptions.length < 4) {
          cleanOptions.push('Option not provided');
        }
        cleanOptions = cleanOptions.slice(0, 4);

        // Validate answer index
        let cleanAnswer = parseInt(q.answer);
        if (isNaN(cleanAnswer) || cleanAnswer < 0 || cleanAnswer > 3) {
          cleanAnswer = 0; // Default to first option if invalid
        }

        // Clean explanation
        let cleanExplanation = String(q.explanation || 'No explanation provided')
          .replace(/\s+/g, ' ')
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
          .trim();

        // Clean image description
        let cleanImageDesc = String(q.imageDescription || '')
          .replace(/\s+/g, ' ')
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
          .trim();

        return {
          question: cleanQuestion,
          options: cleanOptions,
          answer: cleanAnswer,
          explanation: cleanExplanation,
          hasImage: Boolean(q.hasImage),
          imageDescription: cleanImageDesc
        };
      }).filter(q => q !== null); // Remove invalid questions

      if (questions.length === 0) {
        throw new Error('No valid questions could be extracted from the PDF');
      }

      setProgress(`Successfully extracted ${questions.length} questions!`);
      
      // Pass questions to parent component
      setTimeout(() => {
        onQuestionsGenerated(questions);
        setProcessing(false);
      }, 1000);

    } catch (error) {
      console.error('Error processing PDF:', error);
      setError(`Error: ${error.message || 'Failed to process PDF. Please try again.'}`);
      setProcessing(false);
      setProgress('');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '1.8rem',
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '2rem' }}>🤖</span>
            AI PDF to Questions Converter
          </h2>
          <button
            onClick={onClose}
            disabled={processing}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: processing ? 'not-allowed' : 'pointer',
              color: '#64748b',
              opacity: processing ? 0.5 : 1
            }}
          >
            ✕
          </button>
        </div>

        {/* Info Box */}
        <div style={{
          background: 'linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%)',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '30px',
          border: '2px solid #3b82f6'
        }}>
          <div style={{
            fontSize: '1rem',
            color: '#1e40af',
            fontWeight: '600',
            marginBottom: '10px'
          }}>
            ✨ AI-Powered Features:
          </div>
          <ul style={{
            margin: 0,
            paddingLeft: '20px',
            color: '#1e40af',
            fontSize: '0.9rem',
            lineHeight: '1.8'
          }}>
            <li>Extracts ALL questions from PDF automatically</li>
            <li>Preserves mathematical symbols & equations</li>
            <li>Converts diagrams & charts to descriptions</li>
            <li>Generates detailed explanations</li>
            <li>Formats everything in JSON ready to upload</li>
          </ul>
        </div>

        {/* File Upload */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{
            display: 'block',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '10px'
          }}>
            📄 Upload PDF File
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={processing}
            style={{
              width: '100%',
              padding: '15px',
              border: '2px dashed #cbd5e1',
              borderRadius: '12px',
              fontSize: '1rem',
              cursor: processing ? 'not-allowed' : 'pointer',
              background: '#f8fafc',
              opacity: processing ? 0.5 : 1
            }}
          />
          {pdfFile && (
            <div style={{
              marginTop: '10px',
              padding: '10px',
              background: '#dcfce7',
              borderRadius: '8px',
              color: '#166534',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>✓</span>
              <span>{pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
          )}
        </div>

        {/* Progress */}
        {processing && (
          <div style={{
            marginBottom: '20px',
            padding: '20px',
            background: '#fef3c7',
            borderRadius: '12px',
            border: '2px solid #f59e0b'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '10px'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                border: '3px solid #f59e0b',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <span style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#92400e'
              }}>
                Processing...
              </span>
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: '#92400e'
            }}>
              {progress}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            marginBottom: '20px',
            padding: '15px',
            background: '#fee2e2',
            borderRadius: '12px',
            border: '2px solid #ef4444',
            color: '#991b1b',
            fontSize: '0.9rem'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '15px',
          marginTop: '30px'
        }}>
          <button
            onClick={processWithAI}
            disabled={!pdfFile || processing}
            style={{
              flex: 1,
              padding: '15px 30px',
              background: (!pdfFile || processing) 
                ? '#cbd5e1' 
                : 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: (!pdfFile || processing) ? 'not-allowed' : 'pointer',
              boxShadow: (!pdfFile || processing) ? 'none' : '0 4px 15px rgba(37, 99, 235, 0.3)',
              transition: 'all 0.3s'
            }}
          >
            {processing ? '⏳ Processing...' : '🚀 Extract Questions with AI'}
          </button>
          <button
            onClick={onClose}
            disabled={processing}
            style={{
              padding: '15px 30px',
              background: '#f1f5f9',
              color: '#475569',
              border: '2px solid #cbd5e1',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: processing ? 'not-allowed' : 'pointer',
              opacity: processing ? 0.5 : 1
            }}
          >
            Cancel
          </button>
        </div>

        {/* Note */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#f8fafc',
          borderRadius: '8px',
          fontSize: '0.85rem',
          color: '#64748b',
          lineHeight: '1.6'
        }}>
          <strong>Note:</strong> Make sure your PDF contains clear, readable questions. 
          The AI will analyze the entire document and extract all questions automatically. 
          Processing time depends on PDF size (typically 30-60 seconds).
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
