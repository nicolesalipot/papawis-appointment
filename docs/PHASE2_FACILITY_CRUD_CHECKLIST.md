# Phase 2 – Facility CRUD Operations: Checklist

Use this checklist to track completion of all tasks scoped for Phase 2 under the **Frontend-First** roadmap. Check items off as they are finished during the sprint.

## 1. Database & API Layer _(Back-End – deferred to Q2)_

> These tasks are listed for completeness but will be implemented during backend development phase.

- [ ] Design `Facility` schema (id, name, type, capacity, location, description, operating_hours, images, created_by, timestamps).
- [ ] Create migration scripts & ORM model.
- [ ] Scaffold CRUD endpoints (create, list w/ filters & pagination, detail, update, soft-delete/restore).
- [ ] Add validation (duplicate name prevention, capacity > 0, hours format validation).

## 2. Enhanced Facility Management UI

### Core CRUD Interface

- [x] Build enhanced facility list view with search functionality.
- [x] Implement sort capabilities (by name, type, capacity, status, created date).
- [x] Add pagination controls with page size options.
- [x] Create facility detail view/modal with complete information display.
- [x] Build facility creation form with multi-step or tabbed interface.
- [ ] Build facility edit form with pre-populated data.
- [x] Implement soft delete functionality with confirmation dialogs.

### Advanced Form Features

- [x] Create multi-step form wizard (Basic Info → Hours → Images → Amenities → Review).
- [x] Implement tabbed interface for facility data organization.
- [x] Add dynamic operating hours configuration (day-by-day settings).
- [x] Build capacity and location management fields.
- [x] Create facility type selection with custom types.
- [x] Add rich text description editor.

### Image Upload System

- [x] Design and implement drag-and-drop image upload widget.
- [x] Add image preview functionality with thumbnails.
- [x] Implement remove/replace image functionality.
- [x] Create image gallery view for multiple facility images.
- [x] Add image validation (file type, size limits, dimensions).
- [x] Mock cloud storage integration (S3-like signed URL flow simulation).

### Form Validation & UX

- [x] Implement real-time form validation with Zod schemas.
- [x] Add inline error messaging and field highlighting.
- [ ] Create form auto-save functionality (draft state).
- [x] Build confirmation dialogs for destructive actions.
- [x] Add loading states for all async operations.
- [x] Implement optimistic UI updates.

### Search & Filtering

- [x] Build global search across facility name, type, and location.
- [x] Add filter dropdowns (by type, status, location).
- [x] Implement advanced filter combinations.
- [ ] Create saved search/filter presets.
- [x] Add clear filters functionality.
- [ ] Build export filtered results feature.

## 3. Data Management & State

### Enhanced Mock Data

- [x] Expand MSW handlers for realistic facility CRUD operations.
- [x] Create comprehensive facility mock dataset (20+ facilities).
- [x] Add realistic operating hours data with variations.
- [x] Mock image URLs and metadata.
- [x] Implement mock pagination and filtering responses.
- [x] Add mock validation errors and edge cases.

### State Management

- [x] Create facility store with Zustand for state management.
- [x] Implement optimistic updates for better UX.
- [x] Add caching and data synchronization logic.
- [x] Build error handling and retry mechanisms.
- [x] Create loading states for different operations.

## 4. UI Components & Reusability

### Custom Components

- [ ] Build reusable DataTable component with sorting/filtering.
- [ ] Create ImageUpload component for drag-and-drop functionality.
- [ ] Build FormWizard component for multi-step forms.
- [ ] Create ConfirmDialog component for destructive actions.
- [ ] Build SearchInput component with debounced search.
- [ ] Create FilterDropdown component for advanced filtering.

### Design System Enhancement

- [ ] Add facility-specific icons and illustrations.
- [ ] Create status badges and indicators.
- [ ] Build responsive card layouts for facility display.
- [ ] Add skeleton loading states for all components.
- [ ] Implement consistent spacing and typography.

## 5. Testing & Quality Assurance

### Unit Testing

- [ ] Write unit tests for facility store logic.
- [ ] Test form validation schemas and error handling.
- [ ] Unit test custom hooks for facility operations.
- [ ] Test utility functions for data transformation.

### Component Testing

- [ ] Test FacilityList component with different data states.
- [ ] Test FacilityForm component with validation scenarios.
- [ ] Test ImageUpload component functionality.
- [ ] Test search and filter interactions.

### Integration Testing

- [ ] Test complete facility creation workflow.
- [ ] Test facility editing and update workflow.
- [ ] Test facility deletion with confirmation.
- [ ] Test search and filtering integration.

### End-to-End Testing

- [ ] E2E test for complete facility management workflow.
- [ ] Test responsive behavior across different screen sizes.
- [ ] Test error scenarios and edge cases.

## 6. Audit Trail & Metadata

### Information Display

- [ ] Show created_by information in facility details.
- [ ] Display last_updated_by and timestamp.
- [ ] Add facility status tracking (active, inactive, maintenance).
- [ ] Create change log placeholder for future audit trail.
- [ ] Show facility usage statistics (placeholder data).

---

### Frontend-First Priorities (Complete These First)

1. **Enhanced Facility List & Search** - Core table with filtering
2. **Facility Creation Form** - Multi-step form with validation
3. **Image Upload Widget** - Drag-and-drop functionality
4. **Facility Detail View** - Complete information display
5. **Edit & Delete Operations** - Full CRUD interface

### How to Use

1. Focus on Frontend-First priorities for immediate development.
2. Mark items as completed (`[x]`) as they are finished.
3. Backend items (marked with _(Back-End)_) remain unchecked until Q2.
4. Use this checklist to track sprint progress and plan iterations.

### Success Criteria

- [ ] Admin can create new facilities with complete information
- [ ] Admin can search and filter facilities effectively
- [ ] Admin can upload and manage facility images
- [ ] Admin can edit existing facility information
- [ ] Admin can soft-delete facilities with confirmation
- [ ] All forms have proper validation and error handling
- [ ] Interface is responsive and accessible
- [ ] Loading states and optimistic updates provide smooth UX
