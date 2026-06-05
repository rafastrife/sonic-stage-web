# Data Model: Sonic Stage

## Entity-Relationship Overview

O sistema é construído sobre PostgreSQL e mapeado via Prisma. As relações são fortemente consistentes.

### 1. User (Usuário)
Representa uma pessoa no sistema.
- `id`: UUID (PK)
- `email`: String (Unique)
- `passwordHash`: String
- `displayName`: String
- `mainRole`: String (e.g., 'Vocalista', 'Baterista')
- `createdAt`: DateTime
- `updatedAt`: DateTime
- **Relationships**:
  - `memberships`: One-to-Many com `BandMember`

### 2. Band (Banda)
Representa o grupo musical.
- `id`: UUID (PK)
- `name`: String
- `genre`: String
- `bio`: String (max 500 chars)
- `coverImageUrl`: String (optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- **Relationships**:
  - `members`: One-to-Many com `BandMember`
  - `songs`: One-to-Many com `Song`
  - `setlists`: One-to-Many com `Setlist`
  - `events`: One-to-Many com `Event`

### 3. BandMember (Membro da Banda)
Tabela associativa entre `User` e `Band`, com papéis e status.
- `id`: UUID (PK)
- `userId`: UUID (FK to User, nullable if pending invite)
- `bandId`: UUID (FK to Band)
- `inviteEmail`: String (usado para convites pendentes)
- `role`: String (e.g., 'Baterista', 'Produção')
- `permissionLevel`: Enum (ADMIN, MEMBER, VIEWER)
- `status`: Enum (PENDING, ACCEPTED)
- `createdAt`: DateTime
- **Relationships**:
  - Pertence a um `User`
  - Pertence a uma `Band`

### 4. Song (Música)
Representa uma música no repertório da banda.
- `id`: UUID (PK)
- `bandId`: UUID (FK to Band)
- `title`: String
- `genre`: String (optional)
- `status`: Enum (NEW, READY, IN_REVIEW, ARCHIVED)
- `tuning`: String (optional)
- `startingNote`: String (optional)
- `bpm`: Int (optional)
- `durationSeconds`: Int (optional)
- `createdAt`: DateTime
- **Relationships**:
  - Pertence a uma `Band`
  - Mapeado indiretamente nos `Setlist` via `SetlistSong`

### 5. Setlist
Coleção ordenada de músicas.
- `id`: UUID (PK)
- `bandId`: UUID (FK to Band)
- `name`: String
- `totalDurationSeconds`: Int
- `status`: Enum (DRAFT, READY, USED, ARCHIVED)
- `lastUsedAt`: DateTime (optional)
- `createdAt`: DateTime
- **Relationships**:
  - Pertence a uma `Band`
  - `songs`: One-to-Many com `SetlistSong`

### 6. SetlistSong (Música do Setlist)
Tabela associativa para ordenar músicas em um setlist.
- `id`: UUID (PK)
- `setlistId`: UUID (FK to Setlist)
- `songId`: UUID (FK to Song)
- `orderIndex`: Int
- **Relationships**:
  - Pertence a um `Setlist`
  - Pertence a uma `Song`

### 7. Event (Evento)
Agenda (Show ou Ensaio).
- `id`: UUID (PK)
- `bandId`: UUID (FK to Band)
- `title`: String
- `type`: Enum (SHOW, REHEARSAL)
- `date`: DateTime
- `location`: String (optional)
- `script`: JSON (optional, roteiro para ensaios)
- `status`: Enum (SCHEDULED, LIVE, COMPLETED, CANCELLED)
- `createdAt`: DateTime
- **Relationships**:
  - Pertence a uma `Band`
