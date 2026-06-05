# Data Model: refatorar-agenda

## Entities

### Event
- `id`: UUID
- `title`: String
- `type`: Enum (SHOW, ENSAIO, VIAGEM)
- `date`: Date
- `time`: Time
- `location`: String
- `isLive`: Boolean (for the AO VIVO tag)

Note: This data model is likely already partially implemented in the backend, but we may need to ensure these fields are exposed to the frontend.
