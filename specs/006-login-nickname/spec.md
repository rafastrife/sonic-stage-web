# Feature Specification: Login with Email or Nickname

**Feature Branch**: `006-login-nickname`

**Created**: 2026-05-28

**Status**: Draft

**Input**: User description: "agora vamos refatorar a tela de cadastro o com a adição de que o usuário pode usar ou o email ou o nickname para entrar no sistema"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Log in with Email (Priority: P1)

As a user, I want to log into the system using my registered email address so that I can access my account.

**Why this priority**: Core functionality; existing users rely on email login.

**Independent Test**: Can be tested by entering a valid email and password in the login form.

**Acceptance Scenarios**:

1. **Given** a registered user with email "user@example.com", **When** they enter "user@example.com" and their correct password, **Then** they are successfully authenticated and redirected to the system.
2. **Given** an unregistered email, **When** the user attempts to log in with it, **Then** an appropriate error message is displayed.

---

### User Story 2 - Log in with Nickname (Priority: P1)

As a user, I want to log into the system using my nickname (Nome de Artista/Exibição) so that I have a faster and more personalized login experience.

**Why this priority**: This is the core new feature requested, providing an alternative, convenient login method.

**Independent Test**: Can be tested by entering a valid nickname and password in the login form.

**Acceptance Scenarios**:

1. **Given** a registered user with nickname "NeonPulse", **When** they enter "NeonPulse" and their correct password, **Then** they are successfully authenticated and redirected to the system.
2. **Given** an unregistered nickname, **When** the user attempts to log in with it, **Then** an appropriate error message is displayed.
3. **Given** a nickname that resembles an email format (edge case), **When** they attempt to log in, **Then** the system correctly identifies it or handles the authentication seamlessly.

### Edge Cases

- What happens when a user's nickname contains the '@' symbol (if allowed by registration rules)?
- How does the system handle case sensitivity for nicknames during login? (e.g., "NeonPulse" vs "neonpulse")

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The login form MUST provide a single input field that accepts either an email address or a nickname.
- **FR-002**: The system MUST determine whether the provided input is an email address or a nickname based on its format (e.g., presence of '@' and valid email structure).
- **FR-003**: If the input is determined to be an email, the system MUST authenticate against the email field in the user database.
- **FR-004**: If the input is determined to be a nickname, the system MUST authenticate against the nickname (Nome de Artista) field in the user database.
- **FR-005**: The system MUST return a generic error message (e.g., "Invalid credentials") on failed attempts to prevent user enumeration.

### Key Entities

- **User**: Represents a registered user. Key attributes: `email` (unique string), `nickname` (unique string), `passwordHash`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully log in using either their email or nickname.
- **SC-002**: No degradation in login performance (authentication completes in under 1 second).
- **SC-003**: 100% of existing accounts can log in using their established emails or nicknames without requiring any account migration.

## Assumptions

- Nicknames (Nome de Artista) are already guaranteed to be unique in the system during registration.
- The backend authentication mechanism can be modified to support querying by either field.
- The input field on the frontend will have its label updated to indicate "Email ou Nickname".
