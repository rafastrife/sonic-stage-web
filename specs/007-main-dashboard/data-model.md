# Data Model: Main Dashboard

## Entities & Relationships

The dashboard relies on existing entities: `Band`, `Event`, `Song`, and `Setlist`. No database schema changes are required. The dashboard will aggregate these models.

### Dashboard Payload Structure

**Next Event**
- Aggregation: Filter `Event` where `band=active_band`, `status='SCHEDULED'`, and `date >= now`. Order by `date` ascending. Take the first record.
- Required Fields: `id`, `title`, `location`, `date`

**Metrics**
- Total Repertoire: Count of `Song` where `band=active_band` and `status='ACTIVE'`.
- Rehearsals This Week: Count of `Event` where `band=active_band`, `type='ENSAIO'`, and `date` falls within the current calendar week.
- Vibe Principal: Static/mock array of frequency numbers for MVP.

**Recent Setlists**
- Aggregation: Filter `Setlist` where `band=active_band`. Order by `created_at` descending (or `last_modified` if available). Limit to 3.
- Required Fields: `id`, `name`, `created_at`, total tracks (count of `SetlistSong` for that setlist), total duration (sum of `duration_seconds` for all songs in that setlist).

## Validation Rules

- The `/api/bands/<id>/dashboard/` endpoint must verify that `request.user` is a member of the band with the given `<id>`. If not, return HTTP 403 Forbidden.
- The active band selection in the frontend must only list bands where the user is a member.

## State Transitions

- Frontend UI State: `active_band_id`
  - Null state: User has no bands. Display "Create your first band" onboarding.
  - Set state: User selects a band from the dropdown. Store triggers data refresh for the dashboard endpoint.
