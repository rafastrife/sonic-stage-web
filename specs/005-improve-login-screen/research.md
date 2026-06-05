# Phase 0: Research

**Feature**: Improve Login Screen

## Unknowns Resolved

1. **Exact Neon Colors**
   - **Decision**: Use `#00E5FF` for neon cyan and `#FF007F` for neon pink.
   - **Rationale**: Based on visual inspection of the mockup and standard neon hex codes that provide good contrast against a dark background.
   - **Alternatives considered**: None, this is a standard design decision.

2. **Glassmorphism Implementation**
   - **Decision**: Use Tailwind's `backdrop-blur` and `bg-opacity` utilities.
   - **Rationale**: Avoids writing custom CSS and keeps everything within the utility-first methodology.
   - **Alternatives considered**: Writing custom CSS classes in `styles.css`.

3. **Font Family**
   - **Decision**: Use 'Montserrat' or similar modern sans-serif.
   - **Rationale**: The mockup uses a bold, clean sans-serif for "SONIC STAGE" and the "VIBE CHECK HQ" subtitle.
   - **Alternatives considered**: 'Inter' or system fonts, but Montserrat matches the slightly wider, modern aesthetic better.
