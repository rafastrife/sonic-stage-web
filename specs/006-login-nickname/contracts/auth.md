# Authentication Contract

**Endpoint**: `POST /api/auth/login/`

**Request Payload**:
```json
{
  "username": "user@example.com OR NeonPulse",
  "password": "my_password"
}
```

**Response**:
```json
{
  "refresh": "eyJ...",
  "access": "eyJ..."
}
```

The payload structure remains exactly the same as before, ensuring backward compatibility. The only change is that the `username` field now accepts emails, usernames, or display names.
