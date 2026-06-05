---
description: "Task list template for feature implementation"
---

# Tasks: Tech Stack Migration

**Input**: Design documents from `/specs/003-tech-stack-migration/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure. Removing old stack and preparing the new ones.

- [x] T001 Limpar diretório `sonic-stage-api` atual em `sonic-stage-api/`
- [x] T002 Limpar diretório `sonic-stage-web` atual em `sonic-stage-web/`
- [x] T003 Inicializar ambiente virtual Python e instalar dependências (Django, DRF, psycopg2) em `sonic-stage-api/requirements.txt`
- [x] T004 Criar projeto Django `sonic_stage` e app `core` em `sonic-stage-api/`
- [x] T005 Gerar projeto Angular 21 Standalone em `sonic-stage-web/`
- [x] T006 Instalar e configurar TailwindCSS no projeto Angular em `sonic-stage-web/tailwind.config.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

- [x] T007 Configurar conexão com PostgreSQL e variáveis de ambiente em `sonic-stage-api/sonic_stage/settings.py`
- [x] T008 [P] Criar Custom User Model (herança de AbstractUser) no Django em `sonic-stage-api/core/models.py`
- [x] T009 Configurar JWT Authentication usando `djangorestframework-simplejwt` em `sonic-stage-api/sonic_stage/settings.py`
- [x] T010 [P] Configurar HTTP Client e interceptor de Autenticação no Angular em `sonic-stage-web/src/app/core/auth.interceptor.ts`
- [x] T011 [P] Configurar roteamento principal e Layout Global no Angular em `sonic-stage-web/src/app/app.routes.ts`

**Checkpoint**: Foundation ready - both backend and frontend shells are connected and capable of processing auth.

---

## Phase 3: User Story 1 - Backend Migration (Priority: P1) 🎯 MVP

**Goal**: A equipe de engenharia e produção necessita que a base do sistema opere na nova infraestrutura aprovada de backend.

**Independent Test**: Rotas da API podem ser chamadas via cURL ou Postman e retornam dados salvos no PostgreSQL.

### Implementation for User Story 1

- [x] T012 [US1] Criar modelo `Band` e `BandMember` no Django em `sonic-stage-api/core/models.py`
- [x] T013 [P] [US1] Criar modelos `Song`, `Setlist` e `SetlistSong` em `sonic-stage-api/core/models.py`
- [x] T014 [P] [US1] Criar modelo `Event` em `sonic-stage-api/core/models.py`
- [x] T015 [US1] Gerar e rodar migrações do banco de dados em `sonic-stage-api/manage.py`
- [x] T016 [US1] Criar serializers (ModelSerializers) para todas as entidades em `sonic-stage-api/core/serializers.py`
- [x] T017 [US1] Implementar Auth e Registration Views em `sonic-stage-api/core/views.py`
- [x] T018 [US1] Implementar ViewSets baseados em permissões para Band e Members em `sonic-stage-api/core/views.py`
- [x] T019 [P] [US1] Implementar ViewSets para Repertoire (Songs, Setlists) em `sonic-stage-api/core/views.py`
- [x] T020 [P] [US1] Implementar ViewSets para Agenda (Events) em `sonic-stage-api/core/views.py`
- [x] T021 [US1] Configurar rotas e DefaultRouter do DRF em `sonic-stage-api/core/urls.py`

**Checkpoint**: At this point, User Story 1 (The full Django API) should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Frontend Migration (Priority: P2)

**Goal**: Os usuários finais precisam acessar a plataforma visualmente sem perceber perda de funcionalidades, utilizando a nova arquitetura reativa com Angular Signals.

**Independent Test**: Navegar pelo aplicativo Angular, criar bandas, criar eventos e gerenciar o setlist sem erros no console.

### Implementation for User Story 2

- [x] T022 [US2] Criar Signal stores compartilhados (AuthStore, BandStore) em `sonic-stage-web/src/app/core/stores/`
- [x] T023 [P] [US2] Recriar telas de Login e Registro usando ReactiveForms em `sonic-stage-web/src/app/features/auth/`
- [x] T024 [US2] Recriar Dashboard de Projetos e Criação de Banda em `sonic-stage-web/src/app/features/bands/`
- [x] T025 [P] [US2] Recriar tela de Membros e Integração de Convites em `sonic-stage-web/src/app/features/members/`
- [x] T026 [P] [US2] Recriar módulo de Repertório e Montador de Setlists (SetlistBuilder) com drag-n-drop em `sonic-stage-web/src/app/features/repertoire/`
- [x] T027 [P] [US2] Recriar Agenda (Calendário e Detalhes) consumindo a API Django em `sonic-stage-web/src/app/features/agenda/`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work seamlessly together.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T028 Refinar design no TailwindCSS para garantir paridade 1:1 com o visual Premium desenvolvido anteriormente.
- [x] T029 Implementar tratamento global de erros no Angular e interceptor de loading.
- [x] T030 Homologação final: Teste manual de todos os fluxos de criação e autenticação.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - Phase 4 (Frontend) depende explicitamente das rotas da API geradas na Phase 3.
- **Polish (Final Phase)**: Depends on all desired user stories being complete
