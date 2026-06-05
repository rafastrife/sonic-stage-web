# Research: Tech Stack Migration

## Django REST Framework vs Node.js
- **Decision**: Migrate to Django REST Framework (DRF) as requested by user.
- **Rationale**: User mandate. DRF provides robust built-in authentication, ORM integration with PostgreSQL, and generic views that dramatically accelerate CRUD generation which maps well to our Setlist, Band, and Event entities.
- **Alternatives considered**: Keeping Node.js/Express (Rejected by explicit user requirement).

## Angular 21 Signals vs React
- **Decision**: Migrate to Angular 21 using Signals for reactivity.
- **Rationale**: User mandate. Signals provide fine-grained reactivity and eliminate the need for zone.js, offering superior performance predictability compared to React hooks.
- **Alternatives considered**: Keeping React (Rejected by user requirement).

## PostgreSQL Integration
- **Decision**: Use Django's default ORM (`psycopg2` driver).
- **Rationale**: Perfectly aligns with the constitutional requirement to use PostgreSQL. Django's ORM handles relational integrity and cascade deletions out of the box, fulfilling Phase 8 fixes inherently.
