# Feature Specification: refatorar-agenda

**Feature Branch**: `008-refatorar-agenda`

**Created**: 2026-05-28

**Status**: Draft

**Input**: User description: "vamos refatorar a agenda"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Monthly Schedule (Priority: P1)

As a band member, I want to view a monthly calendar of my upcoming events, so I can plan my schedule.

**Why this priority**: It is the core function of the Agenda page to provide a bird's-eye view of all upcoming commitments.

**Independent Test**: Can be fully tested by verifying the calendar grid renders correctly for a given month, displaying events accurately on their respective days.

**Acceptance Scenarios**:

1. **Given** I navigate to the Agenda page, **When** the page loads, **Then** I should see the current month and year displayed prominently.
2. **Given** I am on the Agenda page, **When** looking at the calendar grid, **Then** I should see chips for each event indicating its type (e.g., "Ensaio", "Show", "Viagem").

---

### User Story 2 - View Upcoming 7 Days Summary (Priority: P1)

As a band member, I want to see a detailed summary of events in the next 7 days side-by-side with the calendar, so I know what's immediately coming up.

**Why this priority**: Immediate upcoming events require the most attention, making this summary critical for daily planning.

**Independent Test**: Can be tested by ensuring the side panel accurately lists events occurring within the next 7 days, including details like time, location, and type.

**Acceptance Scenarios**:

1. **Given** I am on the Agenda page, **When** I look at the right panel, **Then** I should see a list titled "Próximos 7 Dias".
2. **Given** an event is happening today, **When** it appears in the summary, **Then** it should highlight the event details with tags like "HOJE" and the specific time.

---

### User Story 3 - Identify Event Types Visually (Priority: P2)

As a band member, I want to easily distinguish between different types of events (e.g., rehearsals, shows, travel) using visual cues.

**Why this priority**: Quick visual recognition improves user experience and reduces cognitive load when scanning the calendar.

**Independent Test**: Can be tested by verifying that "Shows" use a specific style (e.g., pink outline/background) compared to "Ensaios" (e.g., standard dark grey chip).

**Acceptance Scenarios**:

1. **Given** the calendar contains both shows and rehearsals, **When** I view the grid, **Then** shows should have a distinct visual style (e.g., pink color) from rehearsals.
2. **Given** an event is "AO VIVO", **When** it is displayed in the upcoming list, **Then** it should have a specific tag indicating it is live.

### Edge Cases

- What happens when a day has more than 3 events? (Does it show a "+X more" indicator?)
- How does the system handle an empty month with zero scheduled events?
- What happens when an event spans multiple days?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a monthly calendar grid showing the days of the week.
- **FR-002**: System MUST display a summary of the total number of upcoming shows and rehearsals for the current view.
- **FR-003**: System MUST provide a side panel listing detailed event information for the next 7 days.
- **FR-004**: System MUST differentiate event types (Shows, Rehearsals, Travel) using distinct visual styles (colors/icons).
- **FR-005**: System MUST allow users to navigate between different months.
- **FR-006**: System MUST include a "Novo Evento" action to schedule new activities.
- **FR-007**: System MUST support responsive design to handle smaller screens.

### Key Entities

- **Event**: Represents a scheduled activity, containing properties like Title, Type (Show, Ensaio, Viagem), Date, Time, Location, and Status (e.g., Live).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully view their schedule and identify upcoming events within 5 seconds of page load.
- **SC-002**: Visual refactor accurately matches the provided dark mode UI design aesthetics.
- **SC-003**: The page loads and renders the calendar and events in under 1.5 seconds.
- **SC-004**: 100% of event types (shows vs. rehearsals) are visually distinct as per the new design.

## Assumptions

- Users have a modern browser supporting CSS Grid/Flexbox for the calendar layout.
- The existing backend API provides the necessary event data (dates, types, locations).
- The dark mode theme is the primary and only required theme for this feature refactor.
