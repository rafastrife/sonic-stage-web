---

description: "Task list template for feature implementation"
---

# Tasks: Login with Nickname

**Input**: Design documents from `/specs/006-login-nickname/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

*(No setup tasks needed as this is an existing project.)*

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T001 Create `FlexibleAuthBackend` in `sonic-stage-api/core/auth_backends.py`
- [x] T002 Update `AUTHENTICATION_BACKENDS` in `sonic-stage-api/sonic_stage/settings.py` to use `core.auth_backends.FlexibleAuthBackend`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Log in with Email (Priority: P1) 🎯 MVP

**Goal**: As a user, I want to log into the system using my registered email address so that I can access my account.

**Independent Test**: Can be tested by entering a valid email and password in the login form.

### Implementation for User Story 1

- [x] T003 [US1] Verify that `FlexibleAuthBackend` in `sonic-stage-api/core/auth_backends.py` supports querying by `email`
- [x] T004 [US1] Update `login.component.ts` in `sonic-stage-web/src/app/features/auth/login.component.ts` to reflect "E-mail ou Nickname" label

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Log in with Nickname (Priority: P1)

**Goal**: As a user, I want to log into the system using my nickname (Nome de Artista/Exibição) so that I have a faster and more personalized login experience.

**Independent Test**: Can be tested by entering a valid nickname and password in the login form.

### Implementation for User Story 2

- [x] T005 [US2] Verify that `FlexibleAuthBackend` in `sonic-stage-api/core/auth_backends.py` supports querying by `display_name` and `username`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T006 Run tests to ensure standard username login is not broken

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P1)**: Can start after Foundational (Phase 2)

### Parallel Opportunities

- User Story 1 and User Story 2 can be developed in parallel as they rely on the same backend implementation and frontend form updates.

---

## Implementation Strategy

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Each story adds value without breaking previous stories
