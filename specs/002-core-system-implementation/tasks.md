# Tasks: core-system-implementation

**Input**: Design documents from `/specs/002-core-system-implementation/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize backend project `sonic-stage-api` with Express and TypeScript in `sonic-stage-api/package.json`
- [x] T002 Initialize frontend project `sonic-stage-web` with Vite and React (TypeScript) in `sonic-stage-web/package.json`
- [x] T003 [P] Configure TailwindCSS in `sonic-stage-web/tailwind.config.js`
- [x] T004 [P] Initialize Prisma in `sonic-stage-api/prisma/schema.prisma`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T005 Define common Prisma models (User, Band, BandMember, Song, Setlist, SetlistSong, Event) in `sonic-stage-api/prisma/schema.prisma`
- [x] T006 Setup Express application entry point and global error handler in `sonic-stage-api/src/app.ts`
- [x] T007 [P] Create Prisma database client singleton in `sonic-stage-api/src/prisma/client.ts`
- [x] T008 [P] Setup JWT authentication middleware in `sonic-stage-api/src/middlewares/auth.ts`
- [x] T009 Create base API client/Axios instance for frontend in `sonic-stage-web/src/services/api.ts`
- [x] T010 [P] Setup React Router with layout wrapper in `sonic-stage-web/src/App.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Cadastro e Gestão de Conta (Priority: P1) 🎯 MVP

**Goal**: User registration and login flows.

- [x] T011 [P] [US1] Implement Auth Service (register, login) in `sonic-stage-api/src/services/auth.service.ts`
- [x] T012 [P] [US1] Create Auth Controller in `sonic-stage-api/src/controllers/auth.controller.ts`
- [x] T013 [US1] Expose Auth routes (`/api/auth/*`) in `sonic-stage-api/src/routes/auth.routes.ts`
- [x] T014 [US1] Create Login and Register forms UI in `sonic-stage-web/src/pages/Auth/Login.tsx` and `sonic-stage-web/src/pages/Auth/Register.tsx`
- [x] T015 [US1] Integrate Auth UI with API client in `sonic-stage-web/src/services/auth.service.ts`

**Checkpoint**: User authentication works end-to-end.

---

## Phase 4: User Story 2 - Criação e Configuração da Banda (Priority: P1)

**Goal**: Band profile creation and active band selection.

- [x] T016 [P] [US2] Implement Band Service in `sonic-stage-api/src/services/band.service.ts`
- [x] T017 [P] [US2] Create Band Controller in `sonic-stage-api/src/controllers/band.controller.ts`
- [x] T018 [US2] Expose Band routes (`/api/bands/*`) in `sonic-stage-api/src/routes/band.routes.ts`
- [x] T019 [US2] Create Band Creation Wizard UI in `sonic-stage-web/src/pages/Bands/CreateBand.tsx`
- [x] T020 [US2] Create Band Dashboard UI in `sonic-stage-web/src/pages/Dashboard/index.tsx`
- [x] T021 [US2] Integrate Band UI with API client in `sonic-stage-web/src/services/band.service.ts`

**Checkpoint**: Users can log in and create a band successfully.

---

## Phase 5: User Story 3 - Gestão de Repertório e Setlists (Priority: P2)

**Goal**: Add songs and group them into setlists.

- [x] T022 [P] [US3] Implement Song Service in `sonic-stage-api/src/services/song.service.ts`
- [x] T023 [P] [US3] Implement Setlist Service in `sonic-stage-api/src/services/setlist.service.ts`
- [x] T024 [P] [US3] Create Song and Setlist Controllers in `sonic-stage-api/src/controllers/repertoire.controller.ts`
- [x] T025 [US3] Expose Song and Setlist routes in `sonic-stage-api/src/routes/repertoire.routes.ts`
- [x] T026 [US3] Create Repertoire List UI in `sonic-stage-web/src/pages/Repertoire/List.tsx`
- [x] T027 [US3] Create Setlist Builder UI in `sonic-stage-web/src/pages/Setlists/Builder.tsx`
- [x] T028 [US3] Integrate Repertoire UI with API client in `sonic-stage-web/src/services/repertoire.service.ts`

**Checkpoint**: The band administrator can manage songs and setlists.

---

## Phase 6: User Story 4 - Gestão da Agenda e Eventos (Priority: P2)

**Goal**: Schedule shows and rehearsals.

- [x] T029 [P] [US4] Implement Event Service in `sonic-stage-api/src/services/event.service.ts`
- [x] T030 [P] [US4] Create Event Controller in `sonic-stage-api/src/controllers/event.controller.ts`
- [x] T031 [US4] Expose Event routes (`/api/bands/:bandId/events`) in `sonic-stage-api/src/routes/event.routes.ts`
- [x] T032 [US4] Create Agenda/Calendar UI in `sonic-stage-web/src/pages/Agenda/Calendar.tsx`
- [x] T033 [US4] Create Event Details UI in `sonic-stage-web/src/pages/Agenda/EventDetails.tsx`
- [x] T034 [US4] Integrate Agenda UI with API client in `sonic-stage-web/src/services/event.service.ts`

**Checkpoint**: Events can be scheduled and viewed in the agenda.

---

## Phase 7: User Story 5 - Convite de Membros (Priority: P3)

**Goal**: Invite collaborators via email to join the band.

- [x] T035 [P] [US5] Implement Invite Service (SMTP/mock logic) in `sonic-stage-api/src/services/invite.service.ts`
- [x] T036 [P] [US5] Create Member Controller in `sonic-stage-api/src/controllers/member.controller.ts`
- [x] T037 [US5] Expose Member routes (`/api/bands/:bandId/invites`) in `sonic-stage-api/src/routes/member.routes.ts`
- [x] T038 [US5] Create Members Management UI in `sonic-stage-web/src/pages/Members/List.tsx`
- [x] T039 [US5] Integrate Members UI with API client in `sonic-stage-web/src/services/member.service.ts`

**Checkpoint**: Invites can be sent and tracked.

---

## Phase 8: User Story 6 - Exportação de Setlist em PDF (Priority: P3)

**Goal**: Export ready setlists to PDF for printing.

- [x] T040 [P] [US6] Setup PDF generation engine (Puppeteer/pdfmake) in `sonic-stage-api/src/utils/pdfGenerator.ts`
- [x] T041 [US6] Implement Setlist Export endpoint in `sonic-stage-api/src/controllers/repertoire.controller.ts`
- [x] T042 [US6] Create Export Modal UI (layout configs) in `sonic-stage-web/src/components/Setlists/ExportModal.tsx`
- [x] T043 [US6] Integrate frontend download handler in `sonic-stage-web/src/pages/Setlists/Builder.tsx`

**Checkpoint**: PDFs can be generated and downloaded.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T044 Code cleanup and refactoring across all `sonic-stage-api/` routes
- [x] T045 Create and refine responsive layouts for Mobile devices in `sonic-stage-web/src/components/Layout/ResponsiveWrapper.tsx`
- [x] T046 Run full manual verification on `quickstart.md` procedures

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - Phase 3 (US1) is standalone.
  - Phase 4 (US2) depends on Phase 3 (Auth required to create band).
  - Phases 5-8 (US3-US6) depend on Phase 4 (Band required for songs, events, and members).
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### Parallel Opportunities

- All models inside `schema.prisma` can be created concurrently.
- Express setup (T006) and Vite setup (T009, T010) can happen simultaneously.
- Within each US phase, backend Services (`[P]`) can be implemented in parallel with frontend UI placeholders before integration.

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Complete Setup and Foundational phases.
2. Complete US1 (Auth) and US2 (Bands).
3. Validated: A user can log in and create their band.

### Incremental Delivery

4. Add US3 (Repertoire/Setlists) to empower the main music features.
5. Add US4 (Agenda) for event management.
6. Add US5 and US6 as polish features for the MVP completeness.
