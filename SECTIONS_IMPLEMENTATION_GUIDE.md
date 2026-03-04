# Sections & Sets Implementation Guide

## ✅ What's Already Done:

1. **Data Structure Updated** ✅
   - Test series now have `sections: []` field
   - Functions added for section/set management

2. **Functions Added** ✅
   - `addSection()` - Add new section
   - `deleteSection()` - Delete section
   - `addSet()` - Add set to section
   - `deleteSet()` - Delete set
   - `addSetQuestion()` - Add question to set
   - `editSetQuestion()` - Edit set question
   - `deleteSetQuestion()` - Delete set question

3. **State Variables Added** ✅
   - `selectedSection` - Currently selected section
   - `selectedSet` - Currently selected set
   - `sectionName` - Section name input
   - `setName` - Set name input
   - `setYear` - Year for PYQ sets
   - `viewMode` - Navigation between views

## 🎯 What You Need to Add in UI:

### In Test Series Management Panel:

After selecting a test series, add this button:

```jsx
<button
  onClick={() => {
    setViewMode("sections");
    setSelectedSection(null);
    setSelectedSet(null);
  }}
  style={{
    padding: "12px 24px",
    background: "#f59e0b",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px"
  }}
>
  📂 Manage Sections & Sets
</button>
```

### Add Sections View:

```jsx
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
        cursor: "pointer"
      }}>
        ← Back to Test Series
      </button>
    </div>

    <h3 style={{ marginBottom: "20px" }}>
      Sections in: {testSeries[selectedSeries].name}
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
        cursor: "pointer"
      }}>
        ➕ Add Section
      </button>
    </div>

    {/* Sections List */}
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {testSeries[selectedSeries].sections?.map((section, sIdx) => (
        <div key={sIdx} style={{
          padding: "15px",
          background: "#f8fafc",
          borderRadius: "8px",
          border: "2px solid #e2e8f0"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <strong>{section.name}</strong>
              <div style={{ fontSize: "0.9rem", color: "#64748b" }}>
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
                cursor: "pointer"
              }}>
                Manage Sets
              </button>
              <button onClick={() => deleteSection(sIdx)} style={{
                padding: "8px 16px",
                background: "#ef4444",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
```

### Add Sets View:

```jsx
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
        cursor: "pointer"
      }}>
        ← Back to Sections
      </button>
    </div>

    <h3 style={{ marginBottom: "20px" }}>
      Sets in: {testSeries[selectedSeries].sections[selectedSection].name}
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
        cursor: "pointer"
      }}>
        ➕ Add Set
      </button>
    </div>

    {/* Sets List */}
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {testSeries[selectedSeries].sections[selectedSection].sets?.map((set, setIdx) => (
        <div key={setIdx} style={{
          padding: "15px",
          background: "#f8fafc",
          borderRadius: "8px",
          border: "2px solid #e2e8f0"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <strong>{set.name}</strong>
              {set.year && <span style={{ marginLeft: "10px", color: "#64748b" }}>({set.year})</span>}
              <div style={{ fontSize: "0.9rem", color: "#64748b" }}>
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
                cursor: "pointer"
              }}>
                Manage Questions
              </button>
              <button onClick={() => deleteSet(setIdx)} style={{
                padding: "8px 16px",
                background: "#ef4444",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
```

## 📍 Where to Add This Code:

In `src/Admin.jsx`, find the line:
```jsx
{activeTab === "testseries" && (
```

After the existing test series management UI, add the sections and sets views.

## 🎯 Result:

Users will be able to:
1. Create test series
2. Add sections (Previous Year, Section A, etc.)
3. Add sets within sections (2023 Paper, 2022 Paper, Set 1, Set 2)
4. Add questions to each set
5. All data auto-saves to localStorage

Would you like me to create a complete new Admin.jsx file with all this integrated?
