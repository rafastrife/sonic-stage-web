# API Contracts

Todos os endpoints retornam JSON e esperam requisições com `Content-Type: application/json`.
As rotas protegidas exigem um header `Authorization: Bearer <JWT>`.

## Auth
- `POST /api/auth/register`: Cria uma conta de usuário. Recebe `email`, `password`, `displayName`. Retorna `{ token, user }`.
- `POST /api/auth/login`: Autentica um usuário. Recebe `email`, `password`. Retorna `{ token, user }`.

## Bands
- `GET /api/bands`: Lista as bandas em que o usuário logado é membro.
- `POST /api/bands`: Cria uma nova banda. Recebe `name`, `genre`, `bio`. Torna o usuário atual um `ADMIN`.
- `GET /api/bands/:bandId`: Retorna os detalhes de uma banda (exige permissão).

## Members & Invites
- `GET /api/bands/:bandId/members`: Lista os membros e convites pendentes de uma banda.
- `POST /api/bands/:bandId/invites`: Envia um convite de e-mail. Recebe `email`, `role`. Exige nível `ADMIN`.

## Repertoire (Songs)
- `GET /api/bands/:bandId/songs`: Lista as músicas da banda.
- `POST /api/bands/:bandId/songs`: Cadastra uma música. Recebe `title`, `bpm`, `tuning`, etc.
- `PUT /api/bands/:bandId/songs/:songId`: Atualiza uma música existente.

## Setlists
- `GET /api/bands/:bandId/setlists`: Lista os setlists da banda.
- `POST /api/bands/:bandId/setlists`: Cria um setlist. Recebe `name`, `songIds` (array de IDs ordenados).
- `GET /api/bands/:bandId/setlists/:setlistId/export`: Rota para geração do PDF. Retorna um stream/arquivo `application/pdf`.

## Events (Agenda)
- `GET /api/bands/:bandId/events`: Lista eventos de uma banda. Aceita query params `month`, `year`.
- `POST /api/bands/:bandId/events`: Cria um evento. Recebe `title`, `date`, `type` (SHOW/REHEARSAL), `location`, `script`.
