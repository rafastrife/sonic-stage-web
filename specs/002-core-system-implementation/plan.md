# Implementation Plan: core-system-implementation

**Branch**: `002-core-system-implementation` | **Date**: 2026-05-27 | **Spec**: [spec.md](file:///c:/repo/sonic-stage/specs/002-core-system-implementation/spec.md)

**Input**: Feature specification from `/specs/002-core-system-implementation/spec.md`

## Summary

Implementação do Sonic Stage MVP, um gerenciador de bandas contendo cadastro de usuários e bandas, gestão de repertórios, montagem de setlists, convite de membros, agenda de shows/ensaios e geração de PDFs. O projeto adota estrita separação entre a API backend e o frontend Web/Mobile.

## Technical Context

**Language/Version**: TypeScript (Node.js 20+)

**Primary Dependencies**: React (Vite) no frontend, Express.js e Prisma ORM no backend

**Storage**: PostgreSQL

**Testing**: Jest (Backend), React Testing Library (Frontend)

**Target Platform**: Web Browsers (Desktop & Mobile)

**Project Type**: Web Application (SPA) + REST API Service

**Performance Goals**: <200ms API p95 response time, <1s page load

**Constraints**: Strict adherence to `regras_negocio_sonic_stage.md` and UI mockup references. Code must be highly reusable.

**Scale/Scope**: MVP for band management. 

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Architecture Separation: Verify `sonic-stage-web` and `sonic-stage-api` logic segregation.
- [x] Clean & Reusable Code: Ensure the plan promotes clean, reusable code structures.
- [x] Relational Persistence: Validate that persistence uses PostgreSQL and enforces integrity.
- [x] Cross-Platform Consistency: Ensure rules apply consistently to Web and Mobile.
- [x] Business Domain Strictness: Validate that logic aligns with `regras_negocio_sonic_stage.md`.

## Project Structure

### Documentation (this feature)

```text
specs/002-core-system-implementation/
├── plan.md              # This file
├── research.md          # Tech stack and architecture decisions
├── data-model.md        # Entity schemas
├── quickstart.md        # Developer setup guide
├── contracts/           # API Interface definitions
└── tasks.md             # Execution steps
```

### Source Code (repository root)

```text
sonic-stage-api/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── routes/
│   └── prisma/
│       └── schema.prisma
└── tests/

sonic-stage-web/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── services/ (API clients)
└── tests/
```

**Structure Decision**: Option 2 (Web application with separated API) was selected and adapted to `sonic-stage-api` and `sonic-stage-web` as strictly mandated by the constitution.

## Complexity Tracking

> N/A. No violations of the Constitution to justify.
