# Requirements Document

## Introduction

Study Material feature for UP Exam Mantra — a React + Firebase app. This feature adds a dedicated Study Material page where students can access video lectures and downloadable notes organized by sections. Admins can manage all content (sections and items) from the existing Admin panel. The feature mirrors the existing Mocktest page's layout and data pattern using Firestore subcollections.

## Glossary

- **Study_Material_Page**: The `/study-material` route rendered by `StudyMaterial.jsx`
- **Study_Material**: A top-level Firestore document in the `studyMaterials` collection representing a category (e.g., "UP Police", "UPSSC")
- **Study_Section**: A subcollection document under a `studyMaterials` document, grouping related items
- **Study_Item**: A subcollection document under a `Study_Section`, representing either a video lecture or a notes PDF
- **Video_Item**: A `Study_Item` with `type: "video"` containing a YouTube URL visible only to the admin
- **Notes_Item**: A `Study_Item` with `type: "notes"` containing a PDF URL for download
- **Admin_Panel**: The existing `Admin.jsx` component accessible at `/admin`
- **Firestore_Service**: The `src/services/firestoreService.js` module
- **Tab**: One of two UI tabs on the Study Material Page — "📹 Video Lectures" or "📄 Notes"

## Requirements

### Requirement 1: Study Material Page — Tab Navigation

**User Story:** As a student, I want to switch between Video Lectures and Notes tabs, so that I can quickly find the type of content I need.

#### Acceptance Criteria

1. THE Study_Material_Page SHALL display two tabs: "📹 Video Lectures" and "📄 Notes"
2. WHEN a user clicks a tab, THE Study_Material_Page SHALL display only items matching that tab's type
3. THE Study_Material_Page SHALL default to the "📹 Video Lectures" tab on first load
4. WHILE a tab is active, THE Study_Material_Page SHALL visually highlight the active tab

### Requirement 2: Study Material Page — Video Lectures

**User Story:** As a student, I want to browse video lectures organized by section, so that I can find and watch relevant content.

#### Acceptance Criteria

1. WHEN the "📹 Video Lectures" tab is active, THE Study_Material_Page SHALL display all Video_Items grouped by Study_Section
2. THE Study_Material_Page SHALL display each Video_Item as a card showing title and description only — the YouTube URL SHALL NOT be visible to the user
3. WHEN a user clicks a Video_Item card, THE Study_Material_Page SHALL open the YouTube video in a new browser tab
4. IF no Video_Items exist in a section, THEN THE Study_Material_Page SHALL display a "कोई वीडियो उपलब्ध नहीं" message for that section

### Requirement 3: Study Material Page — Notes

**User Story:** As a student, I want to download notes PDFs organized by section, so that I can study offline.

#### Acceptance Criteria

1. WHEN the "📄 Notes" tab is active, THE Study_Material_Page SHALL display all Notes_Items grouped by Study_Section
2. THE Study_Material_Page SHALL display each Notes_Item as a card showing title, description, and a "📥 Download" button
3. WHEN a user clicks the Download button on a Notes_Item, THE Study_Material_Page SHALL open the PDF URL in a new browser tab
4. IF no Notes_Items exist in a section, THEN THE Study_Material_Page SHALL display a "कोई नोट्स उपलब्ध नहीं" message for that section

### Requirement 4: Firestore Data Model

**User Story:** As a developer, I want study material data stored in Firestore using subcollections, so that the data structure is consistent with the existing test series pattern.

#### Acceptance Criteria

1. THE Firestore_Service SHALL store Study_Material documents in the `studyMaterials` top-level collection
2. THE Firestore_Service SHALL store Study_Section documents in the `studyMaterials/{id}/sections` subcollection
3. THE Firestore_Service SHALL store Study_Item documents in the `studyMaterials/{id}/sections/{sectionId}/items` subcollection
4. WHEN a Study_Item is created, THE Firestore_Service SHALL persist a `type` field with value `"video"` or `"notes"`
5. WHEN a Video_Item is created, THE Firestore_Service SHALL persist a `youtubeUrl` field
6. WHEN a Notes_Item is created, THE Firestore_Service SHALL persist a `pdfUrl` field

### Requirement 5: Firestore Service Functions

**User Story:** As a developer, I want CRUD functions for study materials in the Firestore service, so that both the admin panel and the study material page can read and write data consistently.

#### Acceptance Criteria

1. THE Firestore_Service SHALL expose `createStudyMaterial`, `getAllStudyMaterials`, `updateStudyMaterial`, `deleteStudyMaterial` functions
2. THE Firestore_Service SHALL expose `createStudySection`, `updateStudySection`, `deleteStudySection` functions
3. THE Firestore_Service SHALL expose `createStudyItem`, `updateStudyItem`, `deleteStudyItem` functions
4. WHEN `getAllStudyMaterials` is called, THE Firestore_Service SHALL return all Study_Material documents with their nested sections and items
5. WHEN any write function is called, THE Firestore_Service SHALL include `createdAt` or `updatedAt` server timestamps
6. IF a Firestore operation fails, THEN THE Firestore_Service SHALL throw the error so the caller can handle it

### Requirement 6: Admin Panel — Study Material Management

**User Story:** As an admin, I want to manage study material sections and items from the Admin panel, so that I can keep content up to date without touching code.

#### Acceptance Criteria

1. THE Admin_Panel SHALL display a "Study Material" section using the same visual style as the existing test series management section
2. THE Admin_Panel SHALL allow the admin to create, edit, and delete Study_Material documents (top-level categories)
3. THE Admin_Panel SHALL allow the admin to create, edit, and delete Study_Section documents within a Study_Material
4. THE Admin_Panel SHALL allow the admin to add Study_Items with fields: title, description, type (video/notes), youtubeUrl (for videos), pdfUrl (for notes)
5. THE Admin_Panel SHALL allow the admin to edit and delete existing Study_Items
6. WHEN the admin selects `type: "video"`, THE Admin_Panel SHALL show the YouTube URL input field and hide the PDF URL field
7. WHEN the admin selects `type: "notes"`, THE Admin_Panel SHALL show the PDF URL input field and hide the YouTube URL field

### Requirement 7: Home Page Link

**User Story:** As a student visiting the home page, I want a visible link to the Study Material page, so that I can discover and navigate to it easily.

#### Acceptance Criteria

1. THE LandingPage SHALL display a card or button in the features/hero section linking to `/study-material`
2. WHEN a logged-in user is on the Home page, THE Home_Page SHALL display a navigation card linking to `/study-material`

### Requirement 8: App Routing

**User Story:** As a developer, I want a `/study-material` route registered in the app router, so that the page is accessible via URL.

#### Acceptance Criteria

1. THE App SHALL register a `/study-material` route rendering the Study_Material_Page component
2. WHEN an unauthenticated user navigates to `/study-material`, THE App SHALL redirect to `/auth`
