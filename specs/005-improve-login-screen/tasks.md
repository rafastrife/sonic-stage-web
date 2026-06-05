# Tasks: Improve Login Screen

**Input**: Design documents from `/specs/005-improve-login-screen/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Extend Tailwind config with neon colors (`#00E5FF`, `#FF007F`) and fonts in `sonic-stage-web/tailwind.config.js`
- [x] T002 Update global styles to ensure dark background consistency in `sonic-stage-web/src/styles.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

*(No foundational tasks required, as the project is already set up and this is a purely visual feature update).*

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Modernized Login Experience (Priority: P1) 🎯 MVP

**Goal**: Deliver a visually appealing, modern login screen with a dark aesthetic, neon accents, and glassmorphism form card.

**Independent Test**: Navigate to the login route and visually confirm the new layout, glassmorphism card, styled inputs with icons, and the cyan gradient "ENTRAR NO PALCO" button.

### Implementation for User Story 1

- [x] T003 [US1] Update `login.component.html` base layout structure to center the login form in `sonic-stage-web/src/app/features/auth/login.component.html`
- [x] T004 [US1] Apply glassmorphism styling (`bg-black/50 backdrop-blur-md`, etc.) to the form container in `sonic-stage-web/src/app/features/auth/login.component.html`
- [x] T005 [P] [US1] Add logo and subtitle "Vibe Check HQ" above the form inputs in `sonic-stage-web/src/app/features/auth/login.component.html`
- [x] T006 [P] [US1] Style email and password input fields with dark theme styling, SVG icons, and focus states in `sonic-stage-web/src/app/features/auth/login.component.html`
- [x] T007 [P] [US1] Style the primary action button "ENTRAR NO PALCO" with cyan gradient in `sonic-stage-web/src/app/features/auth/login.component.html`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Account Recovery and Creation Links (Priority: P2)

**Goal**: Ensure users can navigate to password recovery and account creation flows.

**Independent Test**: Visually confirm links are present and click them to verify router navigation.

### Implementation for User Story 2

- [x] T008 [P] [US2] Add "Esqueci a Senha" link near password input in `sonic-stage-web/src/app/features/auth/login.component.html`
- [x] T009 [P] [US2] Add "Novo por aqui? Criar Conta" footer link in `sonic-stage-web/src/app/features/auth/login.component.html`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T010 Validate layout responsiveness across desktop, tablet, and mobile views in `sonic-stage-web/src/app/features/auth/login.component.html`
- [x] T011 Verify accessibility contrast and tab focus states

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: N/A
- **User Stories (Phase 3+)**: All depend on Setup completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Setup. No dependencies.
- **User Story 2 (P2)**: Integrates directly into US1 HTML structure.

### Parallel Opportunities

- All Setup tasks can run in parallel.
- All User Story 1 UI components (logo, inputs, buttons) can be styled in parallel if desired, since they are distinct sections of the HTML.
- User Story 2 links can be added in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 3: User Story 1
3. **STOP and VALIDATE**: Test User Story 1 independently

### Incremental Delivery

1. Complete Setup
2. Add User Story 1 → Test independently
3. Add User Story 2 → Test independently
