# Quickstart: Sonic Stage

## Requisitos

- Node.js 20+
- PostgreSQL rodando localmente (recomendado via Docker)
- PNPM (ou NPM/Yarn)

## Setup do Backend (`sonic-stage-api`)

1. Navegue até a pasta da API:
   ```bash
   cd sonic-stage-api
   ```
2. Instale as dependências:
   ```bash
   pnpm install
   ```
3. Configure o banco de dados copiando o `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   # Edite o DATABASE_URL com suas credenciais do PostgreSQL local
   ```
4. Execute as migrations do Prisma:
   ```bash
   pnpm prisma migrate dev
   ```
5. Inicie o servidor de desenvolvimento:
   ```bash
   pnpm run dev
   ```
A API estará rodando em `http://localhost:3000`.

## Setup do Frontend (`sonic-stage-web`)

1. Navegue até a pasta do frontend:
   ```bash
   cd sonic-stage-web
   ```
2. Instale as dependências:
   ```bash
   pnpm install
   ```
3. Configure as variáveis de ambiente (URL da API):
   ```bash
   cp .env.example .env
   # VITE_API_URL=http://localhost:3000
   ```
4. Inicie o servidor de desenvolvimento Vite:
   ```bash
   pnpm run dev
   ```
O web app estará acessível em `http://localhost:5173`.
