# Implementation Plan: Study Material

## Overview

Implement the Study Material feature incrementally: Firestore service functions first, then the student-facing page, then admin panel additions, then routing and home page links.

## Tasks

- [x] 1. Add Firestore service functions for study materials
  - Add `createStudyMaterial`, `getAllStudyMaterials`, `updateStudyMaterial`, `deleteStudyMaterial` to `src/services/firestoreService.js`
  - Add `createStudySection`, `updateStudySection`, `deleteStudySection`
  - Add `createStudyItem`, `updateStudyItem`, `deleteStudyItem`
  - `getAllStudyMaterials` must load nested sections and items (same pattern as `loadSeriesFromSubcollections`)
  - All write functions must include `serverTimestamp()` for `createdAt`/`updatedAt`
  - All functions must throw on error
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [ ]* 1.1 Write property test for study item data round-trip
    - **Property 4: Study item data round-trip**
    - Generate random Study_Item data, write via `createStudyItem`, read back via `getAllStudyMaterials`, assert field equality
    - **Validates: Requirements 4.4, 4.5, 4.6, 5.4, 5.5**

- [x] 2. Create `src/StudyMaterial.jsx` — base structure and data loading
  - Create the component with `getAllStudyMaterials` call on mount
  - Implement loading state (spinner) and error state (Hindi error message)
  - Implement empty state ("अभी कोई सामग्री उपलब्ध नहीं है।")
  - Use same inline styles as `Mocktest.jsx` (white cards, gradient header, section grouping)
  - Add Hindi comments throughout
  - _Requirements: 2.1, 3.1, 4.1, 4.2, 4.3_

- [x] 3. Implement tab navigation in `StudyMaterial.jsx`
  - Add two tab buttons: "📹 Video Lectures" and "📄 Notes"
  - Default active tab: `"video"`
  - Active tab gets highlighted style (same pattern as existing tab UIs in the app)
  - Filter displayed items by active tab's type
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ]* 3.1 Write property test for tab filter
    - **Property 1: Tab filter shows only matching item types**
    - Generate random arrays of mixed video+notes items; assert that filtering by "video" returns only video items and filtering by "notes" returns only notes items
    - **Validates: Requirements 1.2, 2.1, 3.1**

- [x] 4. Implement Video Lectures cards in `StudyMaterial.jsx`
  - Render each Video_Item as a card with title and description only
  - Entire card is clickable — `onClick` opens `youtubeUrl` in new tab via `window.open`
  - YouTube URL must NOT appear as visible text anywhere in the card
  - Show "कोई वीडियो उपलब्ध नहीं" when a section has no video items
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ]* 4.1 Write property test for YouTube URL not exposed
    - **Property 2: YouTube URL is never exposed in video card rendering**
    - Generate random Video_Items; render card; assert rendered text does not contain the youtubeUrl string
    - **Validates: Requirements 2.2**

- [x] 5. Implement Notes cards in `StudyMaterial.jsx`
  - Render each Notes_Item as a card with title, description, and a "📥 Download" button
  - Download button opens `pdfUrl` in new tab
  - Show "कोई नोट्स उपलब्ध नहीं" when a section has no notes items
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ]* 5.1 Write property test for notes card download affordance
    - **Property 3: Notes card always contains a download affordance**
    - Generate random Notes_Items; render card; assert download button/link href equals pdfUrl
    - **Validates: Requirements 3.2, 3.3**

- [ ] 6. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Add Study Material section to `src/Admin.jsx`
  - Add a "📚 Study Material" collapsible section after the existing test series section, using the same card/panel style
  - List all Study_Material documents; allow create, edit, delete
  - Within each material, list sections; allow create, edit, delete
  - Within each section, list items; allow add, edit, delete
  - Item form fields: title, description, type (radio/select: video | notes), youtubeUrl (shown only when type=video), pdfUrl (shown only when type=notes)
  - Call the new Firestore service functions for all operations
  - Add Hindi comments throughout
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

  - [ ]* 7.1 Write property test for admin form conditional field visibility
    - **Property 5: Admin form shows correct URL field for item type**
    - Generate random type values ("video" | "notes"); render admin item form with that type; assert correct input is visible and the other is hidden
    - **Validates: Requirements 6.6, 6.7**

- [x] 8. Add `/study-material` route in `src/App.jsx`
  - Import `StudyMaterial` from `./StudyMaterial`
  - Add `<Route path="/study-material" element={user || isAdmin ? <StudyMaterial /> : <Navigate to="/auth" />} />`
  - Add "Study Material" link in the desktop nav and mobile menu (same style as existing nav links)
  - _Requirements: 8.1, 8.2_

- [x] 9. Add Study Material link to `src/LandingPage.jsx` and `src/Home.jsx`
  - In `LandingPage.jsx`: add a feature card "📚 Study Material" in the features grid section, with a button/link navigating to `/study-material`
  - In `Home.jsx`: add a navigation card linking to `/study-material` (same style as existing home page cards)
  - _Requirements: 7.1, 7.2_

- [ ] 10. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- All components use inline styles only — no CSS modules or external stylesheets
- Hindi comments (`// हिंदी में comment`) should be used throughout new code
- The YouTube URL is stored in Firestore but never rendered as visible text to students
- Property tests use **fast-check** with minimum 100 iterations each
