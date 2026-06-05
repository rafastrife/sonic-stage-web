# Implementation Plan: Tech Stack Migration

**Branch**: `[003-tech-stack-migration]` | **Date**: 2026-05-27 | **Spec**: specs/003-tech-stack-migration/spec.md

**Input**: Feature specification from `/specs/[003-tech-stack-migration]/spec.md`

## Summary

Re-platforming of the Sonic Stage platform from Node.js/React to Django REST Framework (Python) and Angular 21 (Signals). The goal is to strictly replicate all business domains (Bands, Setlists, Events) and preserve PostgreSQL persistence.

## Technical Context

**Language/Version**: Python 3.12 (Backend) and TypeScript 5.4+ (Frontend)

**Primary Dependencies**: Django, Django REST Framework, psycopg2 (Backend) | Angular 21, Signals, TailwindCSS (Frontend)

**Storage**: PostgreSQL

**Testing**: Pytest (Backend) / Jasmine+Karma (Frontend)

**Target Platform**: Web application

**Project Type**: Monorepo with separated web and api directories

**Performance Goals**: API response times < 250ms, snappy UI reactivity with Angular Signals.

**Constraints**: Strict adherence to the `regras_negocio_sonic_stage.md` constitution rules.

**Scale/Scope**: Replicate existing MVP functionality precisely.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Architecture Separation: `sonic-stage-web` (Angular) and `sonic-stage-api` (Django) remain strictly separated.
- [x] Clean & Reusable Code: Component-based architecture in Angular, DRF Generic Views in Django.
- [x] Relational Persistence: PostgreSQL with Django ORM enforces relational integrity.
- [x] Cross-Platform Consistency: Rules remain centrally managed in backend.
- [x] Business Domain Strictness: Django Models mirror existing rules.

## Project Structure

### Documentation (this feature)

```text
specs/003-tech-stack-migration/
├── plan.md              
├── research.md          
├── data-model.md        
├── quickstart.md        
├── contracts/           
└── tasks.md             
```

### Source Code (repository root)

```text
sonic-stage-api/ (Django)
├── manage.py
├── sonic_stage/
│   ├── settings.py
│   └── urls.py
├── core/ (Business Logic Apps)
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   └── urls.py

sonic-stage-web/ (Angular)
├── angular.json
├── package.json
├── src/
│   ├── app/
│   │   ├── features/ (Bands, Agenda, Repertoire)
│   │   ├── core/ (Auth, Interceptors)
│   │   └── shared/ (UI Components)
│   └── styles.css
```

**Structure Decision**: The current monorepo structure with `sonic-stage-web` and `sonic-stage-api` will be cleared out and re-initialized with Django and Angular CLI respectively.
