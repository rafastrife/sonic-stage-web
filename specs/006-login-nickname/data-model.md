# Phase 1: Data Model Updates

No schema changes are required for this feature. We will reuse the existing fields on the `User` model:
- `username`
- `email`
- `display_name` (Nickname / Nome de Artista)

The authentication logic will query against all three fields.
