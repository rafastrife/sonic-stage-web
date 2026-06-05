# Tasks: Main Dashboard

**Input**: Design documents from `/specs/007-main-dashboard/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/dashboard_metrics.json

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create dashboard components structure in frontend `sonic-stage-web/src/app/features/dashboard/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 [P] Implement `DashboardMetricsView` in `sonic-stage-api/core/views.py` per `data-model.md` aggregation rules
- [x] T003 [P] Add dashboard URL routing in `sonic-stage-api/core/urls.py` (`/api/bands/<id>/dashboard/`)
- [x] T004 Implement `BandStore` (Signals) in `sonic-stage-web/src/app/core/stores/band.store.ts` to manage `active_band_id`

**Checkpoint**: Foundation ready - backend endpoint and global frontend store are available.

---

## Phase 3: User Story 1 - Navigating the Dashboard (Priority: P1) 🎯 MVP

**Goal**: Present the user with a visually rich dashboard aggregating their active band's metrics, upcoming events, and setlists.

**Independent Test**: Login as a user with a band, hardcode the `active_band_id` in `BandStore`, and navigate to the dashboard route to verify data loading and visual structure.

### Implementation for User Story 1

- [x] T005 [P] [US1] Create `DashboardComponent` in `sonic-stage-web/src/app/features/dashboard/dashboard.component.ts` layout using CSS Grid
- [x] T006 [P] [US1] Implement "Next Event" banner UI component matching the mockup
- [x] T007 [P] [US1] Implement Metrics Cards UI component matching the mockup
- [x] T008 [P] [US1] Implement Recent Setlists UI component matching the mockup
- [x] T009 [US1] Integrate `DashboardComponent` with `BandStore` and backend dashboard endpoint, wiring up child UI components.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently with a hardcoded active band.

---

## Phase 4: User Story 2 - Switching Between Bands (Priority: P2)

**Goal**: Allow users with multiple bands to seamlessly switch contexts from the sidebar, instantly refreshing the dashboard data.

**Independent Test**: Verify the Band Selector dropdown in the sidebar correctly lists the user's bands and updates the dashboard view when changed.

### Implementation for User Story 2

- [x] T010 [P] [US2] Create or update `SidebarComponent` in `sonic-stage-web/src/app/layout/sidebar.component.ts` and its HTML template
- [x] T011 [US2] Implement Band Selector UI element within the sidebar (dropdown or list)
- [x] T012 [US2] Connect Band Selector to `BandStore.setActiveBand(id)` and fetch user's bands from `/api/bands/`
- [x] T013 [US2] Ensure dashboard UI reacts smoothly to `BandStore` changes (loading states)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Creating a New Band (Priority: P3)

**Goal**: Provide a frictionless "Create Band" flow directly from the dashboard/sidebar without full page reloads.

**Independent Test**: Use the "Create Band" button, fill the modal, and verify the UI switches to the newly created band context automatically.

### Implementation for User Story 3

- [x] T014 [US3] Implement `CreateBandModalComponent` in `sonic-stage-web/src/app/features/dashboard/components/create-band-modal.component.ts`
- [x] T015 [US3] Add trigger for the modal inside the `SidebarComponent`'s Band Selector
- [x] T016 [US3] Connect modal submission to `BandStore` creation action and update active band context

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T017 Update frontend routing in `app.routes.ts` to redirect authenticated users to the new dashboard
- [x] T018 Code cleanup and verify Tailwind CSS classes match the provided neon aesthetic perfectly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P2)**: Integrates deeply with US1.
- **User Story 3 (P3)**: Depends on US2's Band Selector location.

### Parallel Opportunities

- Foundational backend (T002, T003) and frontend store (T004) can be developed in parallel.
- All UI widget components (T006, T007, T008) can be developed in parallel before assembly (T009).

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (with a hardcoded `active_band_id` for testing)
4. **STOP and VALIDATE**: Test User Story 1 independently

### Incremental Delivery

1. Foundation ready
2. Add User Story 1 (Dashboard loads data)
3. Add User Story 2 (Dynamic band switching)
4. Add User Story 3 (Create band inline)
