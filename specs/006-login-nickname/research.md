# Phase 0: Research Findings

## Authentication Flexibility in Django
- **Decision**: Implement a custom authentication backend.
- **Rationale**: Django provides a `ModelBackend` by default, which authenticates against the user model's `USERNAME_FIELD`. To authenticate against `email`, `display_name`, or `username`, the cleanest approach is to create a custom backend class (e.g., `FlexibleAuthBackend`) that extends `ModelBackend` or `BaseBackend`. Inside its `authenticate()` method, we query the `User` model using `Q` objects (`Q(email=username) | Q(display_name=username) | Q(username=username)`).
- **Alternatives considered**: Modifying the SimpleJWT `TokenObtainPairSerializer` to handle the query directly. While viable, putting it in a custom authentication backend keeps the logic centralized and reusable across the entire Django project, adhering to cleaner architecture.

## Frontend Modifications
- **Decision**: Update `loginForm` to accept `identifier` or keep `username` but change the label to "E-mail ou Nickname".
- **Rationale**: The backend will still accept the payload as `{"username": "value", "password": "value"}`. We just need to change the UI label and placeholder to indicate that it accepts either.
- **Alternatives considered**: None. It's the standard way to implement a unified input field.
