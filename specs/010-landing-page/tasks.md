# Tasks: Landing Page de Lançamento

**Input**: Design documents from `/specs/010-landing-page/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are omitted as they were not explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create `landing-page` feature base component in `src/app/features/landing-page/landing-page.component.ts`
- [ ] T002 Create routing configuration for the landing page in `src/app/features/landing-page/landing-page.routes.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 [P] Implement `LeadPayload` and `LeadResponse` interfaces in `src/app/models/lead.model.ts`
- [ ] T004 Implement `LeadService` according to the API contract in `src/app/services/lead.service.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Cadastro na Lista de Espera (Priority: P1) 🎯 MVP

**Goal**: Permitir que usuários insiram o e-mail e se cadastrem na lista de espera.

**Independent Test**: Pode ser testado preenchendo o campo de e-mail e verificando a notificação de sucesso e chamada à API.

### Implementation for User Story 1

- [ ] T005 [P] [US1] Create the Waitlist Form component with Angular Signals in `src/app/features/landing-page/components/waitlist-form/waitlist-form.component.ts`
- [ ] T006 [P] [US1] Create the Hero component with Call-To-Action buttons in `src/app/features/landing-page/components/hero/hero.component.ts`
- [ ] T007 [P] [US1] Create the Navbar component with smooth scroll anchor links in `src/app/features/landing-page/components/navbar/navbar.component.ts`
- [ ] T008 [US1] Integrate `WaitlistFormComponent` with `LeadService` to send POST requests
- [ ] T009 [US1] Assemble `Navbar`, `Hero` and `WaitlistForm` into the main layout in `src/app/features/landing-page/landing-page.component.html`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Exploração de Funcionalidades (Priority: P2)

**Goal**: Demonstrar as principais funcionalidades da plataforma em cartões informativos.

**Independent Test**: Testado rolando até a seção e verificando a legibilidade e disposição dos cartões nas diferentes resoluções.

### Implementation for User Story 2

- [ ] T010 [P] [US2] Create the Features component (3 cards) using Tailwind CSS in `src/app/features/landing-page/components/features/features.component.ts`
- [ ] T011 [US2] Add the `FeaturesComponent` to the main layout in `src/app/features/landing-page/landing-page.component.html`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Consulta de Dúvidas Frequentes (FAQ) (Priority: P3)

**Goal**: Fornecer respostas rápidas com um componente expansível (accordion).

**Independent Test**: Testado clicando nas perguntas do FAQ para expandir/recolher as respostas.

### Implementation for User Story 3

- [ ] T012 [P] [US3] Create the FAQ component with Signal-based state for accordion logic in `src/app/features/landing-page/components/faq/faq.component.ts`
- [ ] T013 [US3] Add the `FaqComponent` to the main layout in `src/app/features/landing-page/landing-page.component.html`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T014 [P] Update the main `app.routes.ts` to lazy-load the `landing-page.routes.ts` at the root path (`/`)
- [ ] T015 [P] Create the Footer component with social media links and copyright in `src/app/features/landing-page/components/footer/footer.component.ts`
- [ ] T016 Add the Footer component to the main layout and run responsive layout checks
- [ ] T017 Final polish of glassmorphism UI elements and Dark Mode colors across all components

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### Parallel Opportunities

- The UI Components (`waitlist-form`, `hero`, `navbar`, `features`, `faq`) can be generated and developed entirely in parallel by multiple agents or developers since they reside in different files.
- Integration to the main template (`landing-page.component.html`) becomes the synchronization point.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently (Waitlist capture and Hero CTAs working).

### Incremental Delivery

1. Foundation ready.
2. Add User Story 1 (Lead Capture) → Test independently.
3. Add User Story 2 (Features section) → Test layout.
4. Add User Story 3 (FAQ section) → Test accordion behavior.
5. Final polish, lazy-loading setup, and Footer addition.
