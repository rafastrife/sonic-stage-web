# Phase 0: Research & Architecture Decisions

## Tech Stack & Language
- **Decision**: TypeScript (Node.js 20+ para backend, React + Vite para frontend)
- **Rationale**: TypeScript garante tipagem estática e segurança na estruturação do código, o que se alinha perfeitamente com o princípio de "Clean & Reusable Code". A separação estrita exigida pela Constituição (I. Architecture Separation) é atingida tendo dois projetos distintos: um para o frontend (Vite) e outro para o backend API.
- **Alternatives considered**: Python/Django ou Go. Rejeitados em favor do ecossistema TS/JS que facilita o compartilhamento de tipos e interfaces entre `sonic-stage-web` e `sonic-stage-api`.

## Web Framework (Frontend)
- **Decision**: React com Vite e Tailwind CSS (estilo Vanilla-like guiado por tokens de design customizados).
- **Rationale**: Vite provê build extremamente rápido e o React permite componentização altamente reutilizável, alinhado à Constituição. Tailwind será utilizado conforme as diretrizes do sistema (configurado para garantir estética premium com paletas HSL vibrantes e suporte a dark mode).
- **Alternatives considered**: Next.js. Rejeitado pois a Constituição requer separação estrita física e lógica (`sonic-stage-api` dedicado), e o Vite + SPA atende bem esse cenário sem overhead de SSR se não for exigido.

## Backend API Framework
- **Decision**: Node.js com Express.js estruturado em arquitetura de camadas (Layered Architecture - Controllers, Services, Repositories).
- **Rationale**: Promove separação de responsabilidades (Clean Code) permitindo que as regras de negócio de `regras_negocio_sonic_stage.md` sejam encapsuladas nos Services.
- **Alternatives considered**: NestJS. Considerado muito opinativo e com curva de aprendizado maior para um MVP, embora seja limpo. Express com injeção de dependência manual (ou via tsyringe) mantém a simplicidade e clareza.

## Storage & ORM
- **Decision**: PostgreSQL com Prisma ORM.
- **Rationale**: Atende ao Princípio "III. Relational Persistence". Prisma fornece tipagem forte e esquema declarativo, o que evita erros de integridade relacional.
- **Alternatives considered**: TypeORM ou Sequelize. Prisma foi escolhido pela superioridade em developer experience (DX) e inferência de tipos.

## PDF Export Engine
- **Decision**: Puppeteer ou `pdfmake` no backend.
- **Rationale**: Permite geração de PDFs formatados com alta fidelidade para os setlists.
- **Alternatives considered**: Geração de PDF no frontend (jsPDF). Rejeitada devido a inconsistências de renderização em dispositivos mobile.

## Gates Evaluation (Constitution Check)
Todos os "Gates" definidos no arquivo de constituição estão sendo respeitados:
- **Architecture Separation**: Projetos isolados em `sonic-stage-web` e `sonic-stage-api`.
- **Clean & Reusable Code**: Uso de TS, componentização e arquitetura em camadas.
- **Relational Persistence**: PostgreSQL escolhido como motor principal.
- **Cross-Platform Consistency**: O frontend será uma PWA responsiva ou SPA responsiva adaptável aos navegadores mobile, mantendo regra única no backend.
- **Business Domain Strictness**: O modelo de dados será construído unicamente a partir de `regras_negocio_sonic_stage.md`.
