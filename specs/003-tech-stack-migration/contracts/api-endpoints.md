# API Endpoints (Django REST Framework)

## Auth
- `POST /api/auth/register/`
- `POST /api/auth/login/` (JWT token pair generation)

## Bands
- `GET /api/bands/`
- `POST /api/bands/`
- `GET /api/bands/<id>/`

## Repertoire (Nested under bands)
- `GET /api/bands/<band_id>/songs/`
- `POST /api/bands/<band_id>/songs/`
- `GET /api/bands/<band_id>/setlists/`
- `POST /api/bands/<band_id>/setlists/`

## Events
- `GET /api/bands/<band_id>/events/`
- `POST /api/bands/<band_id>/events/`
- `GET /api/bands/<band_id>/events/<id>/`

## Members
- `GET /api/bands/<band_id>/members/`
- `POST /api/bands/<band_id>/members/invites/`
