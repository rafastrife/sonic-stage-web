# Contracts: refatorar-agenda

## API Endpoints

### GET /api/events/
- Query Params: `month` (YYYY-MM)
- Response: Array of Event objects for the specified month, including events for the next 7 days even if they cross into the next month.
