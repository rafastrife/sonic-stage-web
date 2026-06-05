# Feature Specification: Main Dashboard

**Feature Branch**: `007-main-dashboard`

**Created**: 2026-05-28

**Status**: Draft

**Input**: User description: "a tela principal deve estar desse jeito, deve ser mantido a parte de cadastro de banda nessa mesma página e a parte de alteração se um usuário tiver mais de uma banda também" + attached visual mockup of the dashboard.

---

## 1. Feature Description

The feature replaces the current dashboard with a visually rich, centralized command center for bands on Sonic Stage. The dashboard provides a high-level overview of a selected band's upcoming events, repertoire status, recent setlists, and overall "vibe".

Critically, the dashboard must seamlessly integrate band management directly on the page, allowing users to quickly switch between different bands they belong to, as well as providing a straightforward way to register a completely new band.

## 2. Business Value

- **Visual Engagement**: Creates a premium, high-energy environment matching the digital performance vibe of the platform, enhancing user retention.
- **Centralized Insights**: Gives musicians instant access to the most important metrics (upcoming shows, repertoire count, recent setlists) without navigating through multiple pages.
- **Frictionless Multi-Band Support**: Allows users involved in multiple projects to manage their bands effortlessly from a single interface, significantly reducing navigation friction.

## 3. User Scenarios & Testing

### Scenario 1: Navigating the Dashboard
- **Given** a user is logged in and belongs to a band
- **When** they access the main dashboard
- **Then** they see the navigation sidebar with links (Painel, Agenda, Repertório, Membros, Finanças, Entrar ao Vivo)
- **And** they see a hero banner for their next upcoming event with actions to view the schedule or manage the guest list
- **And** they see summary cards (Repertório Total, Ensaios Esta Semana, Vibe Principal)
- **And** they see a list of their recent setlists

### Scenario 2: Switching Between Bands
- **Given** a user belongs to multiple bands
- **When** they interact with the band selector on the dashboard (e.g., in the header or sidebar)
- **Then** they can choose a different band
- **And** the dashboard instantly updates to reflect the data (events, setlists, stats) of the newly selected band

### Scenario 3: Creating a New Band
- **Given** a user is on the dashboard
- **When** they choose the option to register a new band from the band management interface
- **Then** they are presented with a form or modal to input the new band's details
- **And** upon creation, the dashboard updates to focus on the newly created band

## 4. Functional Requirements

### Dashboard Layout & Aesthetics
- The dashboard must match the provided dark-mode mockup, featuring neon cyan and pink highlights.
- A persistent sidebar must contain navigation items (`Painel`, `Agenda`, `Repertório`, `Membros`, `Finanças`) and an `Entrar ao Vivo` button.
- The main content area must feature a prominent "Next Event" banner card.
- The dashboard must display three summary metrics cards: Repertoire Count, Weekly Rehearsals, and a visual Chart ("Vibe Principal").
- The dashboard must list up to 3 recent setlists with their track count, total duration, and status/last updated date.

### Band Context & Management
- The page must include a persistent "Band Selector" (e.g., a dropdown) indicating the currently active band.
- Changing the selection in the Band Selector must reload the dashboard's data context to the chosen band.
- The Band Selector or a nearby control must offer a "Create New Band" action.
- Creating a new band must be achievable without navigating away from the dashboard layout (e.g., via a modal or inline form).

### Data Integration
- If the active band has no upcoming events, the "Next Event" banner should display a suitable empty state (e.g., "Nenhum evento próximo. Agendar evento.").
- The setlists section must pull the latest updated setlists for the active band.
- The metrics must accurately reflect the band's actual repertoire size and rehearsal count.

## 5. Non-Functional Requirements

- **Performance**: Switching between bands must feel instantaneous, with loading states provided if data fetching takes more than 300ms.
- **Responsiveness**: The dashboard layout must adapt to tablet and mobile screens (e.g., the sidebar collapsing into a hamburger menu, and the grid stacking vertically).

## 6. Assumptions

- The "Vibe Principal Atual" chart in the mockup is for illustrative purposes. For this initial MVP, it can display static placeholder data or a simple mock visualization until a real analytics backend is developed.
- The "Entrar ao Vivo", "Finanças", and "Gerenciar Lista de Convidados" buttons can be stubbed (e.g., disabled or show "Em breve") if their respective modules are not yet implemented.

## 7. Success Criteria

- **User Satisfaction**: Users can successfully view their band's metrics upon logging in without needing to click further.
- **Workflow Efficiency**: The time taken to switch between two bands is reduced to a single click within the dashboard.
- **Engagement**: The dashboard renders identically (in spirit and structure) to the provided mockup, passing visual QA.
