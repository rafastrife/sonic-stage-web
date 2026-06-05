# Implementation Plan: Main Dashboard

**Branch**: `007-main-dashboard` | **Date**: 2026-05-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/007-main-dashboard/spec.md`

## Summary

Implement a new centralized, visually rich dashboard for the user to view band metrics (next event, repertoire count, rehearsals, recent setlists) and seamlessly manage band context (switch between bands, create a new band) without leaving the page. This involves frontend Angular component creation and backend Django API endpoints for dashboard aggregation.

## Technical Context

**Language/Version**: TypeScript (Frontend), Python 3.11 (Backend)

**Primary Dependencies**: Angular, TailwindCSS (Frontend) | Django, Django Rest Framework (Backend)

**Storage**: PostgreSQL

**Testing**: Jasmine/Karma (Frontend), Django TestCase (Backend)

**Target Platform**: Web browsers (Chrome, Safari, Firefox, Edge)

**Project Type**: web-application

**Performance Goals**: Dashboard data loads under 300ms; band switching feels instantaneous.

**Constraints**: Strict adherence to the dark-mode aesthetic from the provided mockup; neon accents.

**Scale/Scope**: Users with 1 to N bands, dashboard requires aggregations across band relationships.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Architecture Separation: Frontend (`sonic-stage-web`) calls Backend (`sonic-stage-api`) REST endpoints for aggregated data.
- [x] Clean & Reusable Code: Reusable UI components (metrics cards, setlist rows, banner) will be created.
- [x] Relational Persistence: Backend will leverage Django ORM to aggregate data for the specific `band_id`.
- [x] Cross-Platform Consistency: APIs designed here can be re-used by future mobile apps.
- [x] Business Domain Strictness: Role constraints (only members can see band dashboards) will be respected via Django permissions.

## Project Structure

### Documentation (this feature)

```text
specs/007-main-dashboard/
├── plan.md              # This file
├── research.md          # Technical decisions and architecture
├── data-model.md        # API data mapping and DB aggregation strategy
├── quickstart.md        # Feature setup instructions
├── contracts/           # API contract definitions
└── tasks.md             # Execution task list (pending)
```

### Source Code (repository root)

```text
sonic-stage-api/
├── core/
│   ├── views.py         # Add DashboardMetricsView
│   └── urls.py          # Add route for /api/bands/<id>/dashboard/

sonic-stage-web/
├── src/app/
│   ├── core/
│   │   └── stores/
│   │       └── band.store.ts # Central state for band switching
│   ├── features/
│   │   └── dashboard/
│   │       ├── dashboard.component.ts # Main container
│   │       ├── dashboard.component.html
│   │       └── components/ # Reusable UI pieces
│   └── layout/
│       └── sidebar.component.ts # Navigation and Band Selector
```

**Structure Decision**: The frontend requires a global or layout-level state management for the active band so the sidebar and the dashboard stay in sync. The backend requires a dedicated read-only aggregation endpoint to prevent over-fetching.

## Complexity Tracking

*(No violations justified. Adhering strictly to standard Django DRF + Angular patterns.)*
