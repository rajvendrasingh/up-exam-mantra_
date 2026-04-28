# Design Document: Study Material

## Overview

The Study Material feature adds a `/study-material` page to UP Exam Mantra where students can browse video lectures and downloadable notes organized by sections. It follows the same Firestore subcollection pattern and inline-style React conventions already used by the Mocktest and Admin pages.

The feature consists of:
- `src/StudyMaterial.jsx` — the student-facing page
- Additions to `src/Admin.jsx` — admin CRUD UI for study material
- Additions to `src/services/firestoreService.js` — Firestore CRUD functions
- A new route in `src/App.jsx`
- A link card added to `src/LandingPage.jsx` and `src/Home.jsx`

## Architecture

```mermaid
graph TD
    A[App.jsx - Router] -->|/study-material| B[StudyMaterial.jsx]
    A -->|/admin| C[Admin.jsx]
    B --> D[firestoreService.js - getAllStudyMaterials]
    C --> E[firestoreService.js - CRUD functions]
    D --> F[(Firestore: studyMaterials)]
    E --> F
    F --> G[studyMaterials/{id}/sections/{id}/items/{id}]
```

## Components and Interfaces

### StudyMaterial.jsx

```
Props: none
State:
  - materials: array of Study_Material objects (with nested sections/items)
  - activeTab: "video" | "notes"
  - loading: boolean
  - error: string | null

Renders:
  - Two tab buttons
  - For each material → for each section → filtered items as cards
  - Video card: title + description, entire card is clickable (opens YouTube in new tab)
  - Notes card: title + description + Download button (opens PDF in new tab)
```

### Admin.jsx additions

A new collapsible "Study Material" section added after the existing test series section:
- List of Study_Material documents with expand/collapse
- Within each: list of sections, within each: list of items
- Forms for create/edit at each level (same modal/inline style as existing admin forms)
- Conditional field rendering: show `youtubeUrl` input when type=video, show `pdfUrl` input when type=notes

### firestoreService.js additions

```js
// Study Material CRUD
createStudyMaterial(data)       // adds to studyMaterials collection
getAllStudyMaterials()           // returns all with nested sections+items
updateStudyMaterial(id, data)   // updates top-level doc
deleteStudyMaterial(id)         // deletes doc (sections/items must be deleted separately)

// Section CRUD
createStudySection(materialId, data)
updateStudySection(materialId, sectionId, data)
deleteStudySection(materialId, sectionId)

// Item CRUD
createStudyItem(materialId, sectionId, data)
updateStudyItem(materialId, sectionId, itemId, data)
deleteStudyItem(materialId, sectionId, itemId)
```

## Data Models

### Firestore Collection Structure

```
studyMaterials/                          ← top-level collection
  {materialId}/                          ← Study_Material document
    title: string
    description: string
    order: number
    createdAt: Timestamp
    updatedAt: Timestamp

    sections/                            ← subcollection
      {sectionId}/                       ← Study_Section document
        title: string
        order: number
        createdAt: Timestamp
        updatedAt: Timestamp

        items/                           ← subcollection
          {itemId}/                      ← Study_Item document
            title: string
            description: string
            type: "video" | "notes"
            youtubeUrl?: string          ← only for type="video"
            pdfUrl?: string              ← only for type="notes"
            order: number
            createdAt: Timestamp
            updatedAt: Timestamp
```

### In-memory shape returned by getAllStudyMaterials

```js
[
  {
    id: string,
    title: string,
    description: string,
    order: number,
    sections: [
      {
        id: string,
        title: string,
        order: number,
        items: [
          {
            id: string,
            title: string,
            description: string,
            type: "video" | "notes",
            youtubeUrl?: string,
            pdfUrl?: string,
            order: number
          }
        ]
      }
    ]
  }
]
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Tab filter shows only matching item types

*For any* set of study sections containing a mix of video and notes items, when the active tab is "video", every rendered item card should have `type === "video"`, and when the active tab is "notes", every rendered item card should have `type === "notes"`.

**Validates: Requirements 1.2, 2.1, 3.1**

### Property 2: YouTube URL is never exposed in video card rendering

*For any* Video_Item with a `youtubeUrl`, the rendered card HTML/text should contain the item's title and description but should NOT contain the raw `youtubeUrl` string as visible text.

**Validates: Requirements 2.2**

### Property 3: Notes card always contains a download affordance

*For any* Notes_Item, the rendered card should contain a download button or link element whose `href` equals the item's `pdfUrl`.

**Validates: Requirements 3.2, 3.3**

### Property 4: Study item data round-trip

*For any* valid Study_Item written via `createStudyItem`, reading it back via `getAllStudyMaterials` should return an object with identical `title`, `description`, `type`, and URL fields (`youtubeUrl` or `pdfUrl`).

**Validates: Requirements 4.4, 4.5, 4.6, 5.4, 5.5**

### Property 5: Admin form shows correct URL field for item type

*For any* admin item form state where `type` is set to `"video"`, the YouTube URL input should be visible and the PDF URL input should be hidden; when `type` is `"notes"`, the PDF URL input should be visible and the YouTube URL input should be hidden.

**Validates: Requirements 6.6, 6.7**

## Error Handling

- `getAllStudyMaterials` failure: show an error message on the Study Material page ("डेटा लोड करने में समस्या हुई। कृपया पुनः प्रयास करें।")
- Empty state: if no materials exist at all, show "अभी कोई सामग्री उपलब्ध नहीं है।"
- Admin write failures: display an inline error alert (same pattern as existing admin error handling)
- All Firestore service functions throw on error so callers can handle appropriately

## Testing Strategy

### Dual Testing Approach

Both unit tests and property-based tests are used together for comprehensive coverage.

**Unit tests** cover:
- Specific rendering examples (tab presence, default tab, empty section messages)
- Route protection (unauthenticated redirect)
- Admin form field visibility for a specific type selection
- Error state rendering

**Property-based tests** cover universal properties across randomly generated inputs.

### Property-Based Testing

Library: **fast-check** (works with Vitest/Jest, TypeScript/JavaScript)

Each property test runs a minimum of 100 iterations.

Tag format: `// Feature: study-material, Property {N}: {property_text}`

| Property | Test description |
|----------|-----------------|
| Property 1 | Generate random arrays of video+notes items; assert tab filter returns only matching type |
| Property 2 | Generate random Video_Items; render card; assert youtubeUrl not in rendered text |
| Property 3 | Generate random Notes_Items; render card; assert download link href equals pdfUrl |
| Property 4 | Generate random Study_Items; write then read via service; assert field equality |
| Property 5 | Generate random type values ("video"/"notes"); assert correct field visibility in admin form |

### Unit Test Examples

- Renders two tabs on mount
- Defaults to video tab
- Shows "कोई वीडियो उपलब्ध नहीं" for empty video section
- Shows "कोई नोट्स उपलब्ध नहीं" for empty notes section
- LandingPage contains a link to `/study-material`
- `/study-material` route redirects unauthenticated users to `/auth`
