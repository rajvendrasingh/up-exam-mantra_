# Test Series Sections & Sets Feature

## New Data Structure

### Test Series with Sections and Sets:
```javascript
{
  id: 123456,
  name: "UPSSSC PET 2024",
  subjectIds: [1, 2, 3],
  difficulty: "Medium",
  duration: 120,
  instructions: "...",
  negativeMarking: 0.25,
  marksPerQuestion: 1,
  sections: [
    {
      id: 1,
      name: "Previous Year Papers",
      sets: [
        {
          id: 1,
          name: "2023 Paper",
          year: "2023",
          questions: [...]
        },
        {
          id: 2,
          name: "2022 Paper",
          year: "2022",
          questions: [...]
        }
      ]
    },
    {
      id: 2,
      name: "Section A - General Knowledge",
      sets: [
        {
          id: 1,
          name: "Set 1",
          questions: [...]
        },
        {
          id: 2,
          name: "Set 2",
          questions: [...]
        }
      ]
    }
  ]
}
```

## Admin Panel Features:

1. **Test Series Management:**
   - Create test series (existing)
   - Add sections to test series (NEW)
   - Add sets within sections (NEW)
   - Add questions to sets (NEW)

2. **Section Management:**
   - Add section (e.g., "Previous Year", "Section A")
   - Edit section name
   - Delete section
   - Reorder sections

3. **Set Management:**
   - Add set within section (e.g., "2023 Paper", "Set 1")
   - Edit set name
   - Delete set
   - Add questions to set
   - Import JSON questions to set

## UI Flow:

1. Admin selects Test Series
2. Admin sees list of sections
3. Admin clicks "Add Section" → Creates new section
4. Admin clicks on section → Sees list of sets
5. Admin clicks "Add Set" → Creates new set
6. Admin clicks on set → Can add questions

## Data Persistence:

- All data saved to localStorage automatically
- No data loss on refresh
- User stays logged in until logout
