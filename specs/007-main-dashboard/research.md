# Research & Decisions: Main Dashboard

## Global State Management (Active Band)

**Decision**: Implement an Angular `BandStore` using Signals (`@angular/core`) to manage the globally active band across the application.
**Rationale**: The user must be able to switch bands from the sidebar or header and have the main dashboard react instantly. Signals provide a clean, reactive way to propagate this ID across independently loaded components without RxJS boilerplate.
**Alternatives considered**: Passing the band ID through the URL route parameters (e.g., `/bands/:id/dashboard`). While RESTful, it adds friction to navigation since every single top-level link would need to know the current band ID. A central state store allows cleaner URL structures (like just `/dashboard`) while maintaining the context internally.

## Dashboard Data Aggregation

**Decision**: Create a single `/api/bands/<id>/dashboard/` endpoint in the Django backend that aggregates the "next event", metrics (total songs, rehearsals), and recent setlists into a single JSON payload.
**Rationale**: Fetching this data independently (hitting `/events`, `/songs`, `/setlists`) would require multiple network round-trips and complex client-side filtering (e.g., finding the next event vs all events). A dedicated dashboard endpoint minimizes latency to achieve the < 300ms performance goal and keeps logic in the backend.
**Alternatives considered**: Using GraphQL. Rejected because the project currently uses Django Rest Framework (REST) and introducing a new paradigm just for one screen violates the constitution's simplicity principles.

## Band Creation Flow

**Decision**: The "Create Band" action will trigger an Angular modal/dialog layered over the dashboard. Upon successful creation, the API returns the new band, the `BandStore` updates its active band to the new ID, and the modal closes, instantly refreshing the dashboard.
**Rationale**: The spec requires keeping the band registration on the same page. A modal provides focus without losing the user's navigational context.

## Styling & Layout Architecture

**Decision**: Use CSS Grid for the dashboard layout to handle the asymmetrical design (large banner on the left, stacked metrics column on the right, wide setlists row on the bottom). 
**Rationale**: The provided mockup is highly structural. CSS Grid allows for precise placement of these varying sized cards and easy media queries for responsive stacking on smaller screens. Tailwind grid classes (`grid-cols-1 md:grid-cols-3`) will make this straightforward.
