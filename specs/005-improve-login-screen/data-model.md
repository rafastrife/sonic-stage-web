# Data Model: Improve Login Screen

## Entities

### User Credentials
Represents the data collected by the login form. This is a frontend DTO rather than a database entity for this specific feature.

**Fields**:
- `email`: string, required, must be a valid email format.
- `password`: string, required, minimum length depends on existing backend constraints.

**State Transitions**:
- `idle`: Form is waiting for input.
- `submitting`: Form data is being sent to the backend.
- `success`: Backend returns success, user is redirected.
- `error`: Backend returns an error, error message is displayed on the form.
