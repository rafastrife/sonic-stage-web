# Research: refatorar-agenda

## Technical Stack & Approach
- **Decision**: Refactor the Agenda page using Angular standalone components and Tailwind CSS.
- **Rationale**: The project uses Angular for `sonic-stage-web`. The new UI design relies heavily on modern styling (dark mode, neon colors) which fits perfectly with Tailwind CSS. We will implement a custom calendar grid using CSS Grid to avoid heavy external dependencies. Given the design's uniqueness, a custom CSS Grid implementation is preferred to ensure exact match with the provided mockups.
- **Alternatives considered**: Using full calendar libraries like fullcalendar.io, but they are often difficult to style exactly as the custom mockup requires.
