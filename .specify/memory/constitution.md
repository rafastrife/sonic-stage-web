<!--
Sync Impact Report:
- Version change: Initial → 1.0.0
- List of modified principles:
  - [PRINCIPLE_1_NAME] → I. Architecture Separation
  - [PRINCIPLE_2_NAME] → II. Clean & Reusable Code
  - [PRINCIPLE_3_NAME] → III. Relational Persistence
  - [PRINCIPLE_4_NAME] → IV. Cross-Platform Consistency
  - [PRINCIPLE_5_NAME] → V. Strict Business Domain Adherence
- Added sections: None
- Removed sections: None
- Templates requiring updates: 
  - .specify/templates/plan-template.md: ✅ updated 
- Follow-up TODOs: None
-->

# Sonic Stage Constitution

## Core Principles

### I. Architecture Separation
Frontend must reside in `sonic-stage-web` and Backend in `sonic-stage-api`. Logic, presentation, and persistence layers must maintain strict separation, avoiding overlap between frontend logic and backend services.

### II. Clean & Reusable Code
Always prioritize clean code patterns. Create highly reusable components and functions. Avoid duplication by generalizing common logic. Ensure maintainability through clear abstractions and modularity.

### III. Relational Persistence
PostgreSQL MUST be the database engine for persistence. All entity relationships (Bands, Users, Events, Repertoires) must leverage strict foreign keys and relational integrity to ensure data consistency.

### IV. Cross-Platform Consistency
Business rules must remain identical between Web and Mobile interfaces. Differences are permitted only in presentation, navigation, and amount of data displayed on a single view, never in logic constraints.

### V. Strict Business Domain Adherence
System behavior must strictly align with `regras/regras_negocio_sonic_stage.md`. This includes role-based access control, event types, status flows, and required fields.

## Technical Stack & Infrastructure

- **Database**: PostgreSQL
- **Frontend**: Web and Mobile environments inside `sonic-stage-web`
- **Backend**: API services inside `sonic-stage-api`
- **UI/UX Reference**: Must visually align with the `assets` folder mockups and provide premium experiences.
- **Export**: Must support PDF generation for Setlists with custom layouts.

## Development Workflow

- Code review must enforce the usage of clean code and reusable patterns.
- Implementations must check `regras/regras_negocio_sonic_stage.md` for specific rules regarding character limits, formats, and mandatory requirements before making assumptions.

## Governance

Any deviations from the documented business rules or architecture standards require a formal amendment to both this constitution and the business rules document. Implementations must always respect differences in constraints by unifying them to a single rule before coding.

**Version**: 1.0.0 | **Ratified**: 2026-05-27 | **Last Amended**: 2026-05-27
