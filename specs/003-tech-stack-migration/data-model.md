# Data Model: Tech Stack Migration

Based on `regras_negocio_sonic_stage.md`.
The models will be implemented in Django (`core/models.py`).

## Models

### User (Django Custom User)
- `email`: EmailField (unique)
- `password`: String (handled by Django Auth)
- `display_name`: CharField
- `main_role`: CharField (optional)

### Band
- `name`: CharField
- `genre`: CharField (optional)
- `bio`: TextField (optional)

### BandMember (M2M through model)
- `user`: ForeignKey(User, null=True, on_delete=CASCADE)
- `band`: ForeignKey(Band, on_delete=CASCADE)
- `role`: CharField
- `permission_level`: CharField (ADMIN, MEMBER)
- `status`: CharField (PENDING, ACCEPTED)
- `invite_email`: EmailField (optional)

### Song
- `band`: ForeignKey(Band, on_delete=CASCADE)
- `title`: CharField
- `genre`: CharField
- `status`: CharField
- `tuning`: CharField
- `bpm`: IntegerField
- `duration_seconds`: IntegerField

### Setlist
- `band`: ForeignKey(Band, on_delete=CASCADE)
- `name`: CharField
- `songs`: ManyToManyField(Song, through='SetlistSong')

### SetlistSong
- `setlist`: ForeignKey(Setlist, on_delete=CASCADE)
- `song`: ForeignKey(Song, on_delete=CASCADE)
- `order_index`: IntegerField

### Event
- `band`: ForeignKey(Band, on_delete=CASCADE)
- `title`: CharField
- `type`: CharField (SHOW, ENSAIO)
- `date`: DateTimeField
- `location`: CharField
- `status`: CharField
- `script`: JSONField (optional)
