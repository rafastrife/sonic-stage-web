# Implementation Plan: Login with Nickname

**Branch**: `006-login-nickname` | **Date**: 2026-05-28 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/006-login-nickname/spec.md`

## Summary

Refactor the login screen and authentication flow to allow users to log in using either their registered email address or their nickname (display_name). We'll implement a custom authentication backend in Django to support this flexible authentication format and update the frontend login form to prompt for "E-mail ou Nickname".

## Technical Context

**Language/Version**: Python 3.x for API, TypeScript for Web

**Primary Dependencies**: Django, Django REST Framework, djangorestframework-simplejwt, Angular 17+

**Storage**: PostgreSQL

**Testing**: Pytest / Django Test for API, Jasmine/Karma for Angular Web

**Target Platform**: Linux server, Modern Web Browsers

**Project Type**: web-service + frontend web app

**Performance Goals**: <1s response time for authentication

**Constraints**: Must integrate smoothly with existing JWT authentication

**Scale/Scope**: Impacts all existing and future users' login workflows.

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
specs/006-login-nickname/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
sonic-stage-api/
├── core/
│   ├── auth_backends.py  # New file for custom auth
│   └── settings.py       # (Assuming sonic_stage/settings.py will be updated)

sonic-stage-web/
└── src/app/features/auth/
    └── login.component.ts # Updated UI and form fields
```

**Structure Decision**: The project is split into frontend (`sonic-stage-web`) and backend (`sonic-stage-api`). We'll add a new `auth_backends.py` in the core app and update `settings.py` to register it. In the frontend, we'll modify the `login.component.ts`.
