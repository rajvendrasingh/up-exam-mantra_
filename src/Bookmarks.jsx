import { useContext } from "react";
import { TestSeriesContext } from "./TestSeriesContext";

export default function Bookmarks() {
  const { bookmarkedQuestions, subjects, testSeries, toggleBookmark } = useContext(TestSeriesContext);

  // Get question details from bookmarked IDs
  const getBookmarkedQuestions = () => {
    const questions = [];
    
    bookmarkedQuestions.forEach(bookmark => {
      // Find in subjects
      subjects.forEach(subject => {
        const question = subject.questions?.[bookmark.questionIndex];
        if (question && bookmark.seriesId === subject.id) {
          questions.push({
            ...question,
            source: subject.name,
            sourceType: "subject",
            seriesId: subject.id,
            questionIndex: bookmark.questionIndex
          });
        }
      });

      // Find in test series
      testSeries.forEach(series => {
        const question = series.questions?.[bookmark.questionIndex];
        if (question && bookmark.seriesId === series.id) {
          questions.push({
            ...question,
            source: series.name,
            sourceType: "testseries",
            seriesId: series.id,
            questionIndex: bookmark.questionIndex
          });
        }
      });
    });

    return questions;
  };

  const bookmarked = getBookmarkedQuestions();

  return (
    <div style={{
      maxWidth: "1000px",
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
        <div style={{ fontSize: "4rem", marginBottom: "10px" }}>🔖</div>
        <h1 style={{ margin: "0 0 10px 0", fontSize: "2.5rem" }}>
          My Bookmarks
        </h1>
        <p style={{ margin: 0, fontSize: "1.1rem", opacity: 0.9 }}>
          {bookmarked.length} saved questions
        </p>
      </div>

      {/* Bookmarked Questions */}
      {bookmarked.length === 0 ? (
        <div style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "60px 40px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "5rem", marginBottom: "20px" }}>📚</div>
          <h2 style={{ color: "#1e293b", marginBottom: "10px" }}>
            No Bookmarks Yet
          </h2>
          <p style={{ color: "#64748b", fontSize: "1.1rem" }}>
            Start taking tests and bookmark important questions for later review!
          </p>
        </div>
      ) : (
        <div style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
        }}>
          {bookmarked.map((question, idx) => (
            <div key={idx} style={{
              padding: "25px",
              marginBottom: "20px",
              background: "#f8fafc",
              borderRadius: "12px",
              borderLeft: "4px solid #f59e0b"
            }}>
              {/* Source Badge */}
              <div style={{
                display: "inline-block",
                padding: "5px 12px",
                background: "#fef3c7",
                color: "#92400e",
                borderRadius: "20px",
                fontSize: "0.85rem",
                fontWeight: "600",
                marginBottom: "15px"
              }}>
                📚 {question.source}
              </div>

              {/* Question */}
              <div style={{
                fontSize: "1.1rem",
                fontWeight: "600",
                color: "#1e293b",
                marginBottom: "20px",
                lineHeight: "1.6"
              }}>
                {question.q}
              </div>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                {question.options?.map((opt, optIdx) => (
                  <div key={optIdx} style={{
                    padding: "15px",
                    background: optIdx === question.answer ? "#dcfce7" : "#fff",
                    border: `2px solid ${optIdx === question.answer ? "#22c55e" : "#e2e8f0"}`,
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px"
                  }}>
                    <div style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      background: optIdx === question.answer ? "#22c55e" : "#e2e8f0",
                      color: optIdx === question.answer ? "#fff" : "#64748b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "0.9rem"
                    }}>
                      {String.fromCharCode(65 + optIdx)}
                    </div>
                    <div style={{ 
                      flex: 1,
                      color: optIdx === question.answer ? "#166534" : "#1e293b",
                      fontWeight: optIdx === question.answer ? "600" : "normal"
                    }}>
                      {opt}
                    </div>
                    {optIdx === question.answer && (
                      <div style={{ color: "#22c55e", fontSize: "1.2rem" }}>✓</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Remove Bookmark Button */}
              <button
                onClick={() => toggleBookmark(question.seriesId, question.questionIndex)}
                style={{
                  padding: "10px 20px",
                  background: "#fee2e2",
                  color: "#991b1b",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#fecaca"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#fee2e2"}
              >
                🗑️ Remove Bookmark
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
