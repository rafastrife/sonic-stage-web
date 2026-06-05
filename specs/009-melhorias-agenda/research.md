# Research: melhorias-agenda

## Technical Stack & Approach
- **Month Navigation**: We will add `previousMonth()` and `nextMonth()` methods in `AgendaComponent` that modify the `currentDate` property. Since `calendarDays` is a computed signal based on `currentDate`, the grid will reactively update.
- **Double Click Scheduling**: We will bind a `(dblclick)` event handler to each day cell in the calendar grid. The handler will set `isAddingEvent = true` and prepopulate the `eventForm`'s `date` field with the clicked date.
- **Dashboard Highlight**: The `DashboardComponent` already expects `next_event` from `bandStore.dashboardData()`. We just need to ensure that the backend API returns the *closest future event* in that field, or that it is properly populated. If the backend is already doing this, we just need to ensure the local state updates when navigating from Agenda to Dashboard.
