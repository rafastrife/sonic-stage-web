# Feature Specification: melhorias-agenda

**Feature Branch**: `009-melhorias-agenda`

**Created**: 2026-05-28

**Status**: Draft

**Input**: User description: "preciso fazer melhorias na agenda, deve ser possível o usuário navegar entre os meses, quando for cadastrado um evento, o evento deve aparecer no dashboard em destaque como 'próximo evento', ao clicar duas vezes rapidamente num quadradinho do calentário deve abrir a parte pra agendar um evento da mesma forma como funciona como se fosse agendar uma reunião no microsoft teams"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Month Navigation (Priority: P1)

As a band member, I want to navigate between different months in the calendar so I can view my schedule for the past and future.

**Why this priority**: Essential for planning beyond the current month.

**Independent Test**: Can be tested by clicking "Previous" and "Next" month buttons and verifying the calendar grid updates to show the correct days and events for that month.

**Acceptance Scenarios**:

1. **Given** I am on the Agenda page, **When** I click the "Next Month" button, **Then** the calendar displays the grid and events for the following month.
2. **Given** I navigated to a different month, **When** I click a "Current Month" button, **Then** I am returned to the current month's view.

---

### User Story 2 - Quick Event Scheduling (Double Click) (Priority: P1)

As a band member, I want to double-click on any day in the calendar grid to quickly open the event creation form for that specific day.

**Why this priority**: Improves usability and speeds up the workflow of adding events, matching expected behavior from popular calendar tools (like MS Teams).

**Independent Test**: Can be tested by double-clicking a specific calendar cell and verifying the "Novo Evento" form opens with that date pre-filled.

**Acceptance Scenarios**:

1. **Given** I am looking at the calendar grid, **When** I double-click on the cell for "October 15", **Then** the "Criar Novo Evento" modal/form opens with the date set to October 15.

---

### User Story 3 - Next Event Dashboard Highlight (Priority: P2)

As a band member, I want to see my most immediate upcoming event highlighted on the main Dashboard, so I know exactly what my next commitment is.

**Why this priority**: Connects the Agenda with the Dashboard, giving immediate visibility to urgent upcoming tasks.

**Independent Test**: Can be tested by creating an event for tomorrow and verifying it appears in a designated "Próximo Evento" section on the Dashboard.

**Acceptance Scenarios**:

1. **Given** I have an event scheduled for tomorrow, **When** I visit the Dashboard, **Then** I see this event highlighted as the "Próximo Evento".
2. **Given** I create a new event that occurs sooner than the currently highlighted one, **When** I return to the Dashboard, **Then** the newly created event replaces the previous one as the "Próximo Evento".

### Edge Cases

- What happens if the user double-clicks on a day from the previous/next month that appears in the grid's padding? Does it switch to that month or just schedule on that date?
- What happens on the Dashboard if there are no upcoming events at all?
- How is the "Next Event" determined if there are two events starting at the exact same time?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide UI controls to navigate to the previous and next months in the Agenda view.
- **FR-002**: System MUST detect double-click events on calendar day cells.
- **FR-003**: System MUST open the event creation form pre-populated with the date of the double-clicked cell.
- **FR-004**: System MUST display a "Próximo Evento" highlight widget on the main Dashboard.
- **FR-005**: The Dashboard "Próximo Evento" MUST automatically update to show the chronologically closest future event across all event types.

### Key Entities

- **Event**: No schema changes required, but sorting and querying for the "next" event is needed for the dashboard.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can change the viewed month in under 1 second.
- **SC-002**: Double-clicking a date successfully opens the creation form 100% of the time, with the correct date pre-filled.
- **SC-003**: The Dashboard accurately identifies and displays the very next chronological event without requiring a manual page refresh if coming from the Agenda page.

## Assumptions

- The Dashboard already has a logical place/layout to insert a "Próximo Evento" widget.
- Double-click functionality works on touch devices via an alternative interaction (e.g., long press) or we assume this is primarily a desktop feature for now.
