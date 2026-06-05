# Feature Specification: core-system-implementation

**Feature Branch**: `002-core-system-implementation`

**Created**: 2026-05-27

**Status**: Draft

**Input**: User description: "implemente meu sistema a partir das regras que foras estabelecidas no arquivo de regras e nas telas de referencia, não precisa usar os htmls que estào na pasta assets"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cadastro e Gestão de Conta (Priority: P1)

Como um usuário, quero criar uma conta com meu nome artístico, e-mail e senha, para que eu possa acessar a plataforma.

**Why this priority**: É a porta de entrada obrigatória para qualquer funcionalidade do sistema.

**Independent Test**: Pode ser testado independentemente criando um usuário de teste e verificando o login bem-sucedido.

**Acceptance Scenarios**:

1. **Given** um e-mail não cadastrado, **When** o usuário preenche o formulário de cadastro, **Then** a conta é criada e o usuário é redirecionado para a área logada.
2. **Given** um e-mail já existente, **When** o usuário tenta cadastrar, **Then** o sistema exibe erro de e-mail duplicado.

---

### User Story 2 - Criação e Configuração da Banda (Priority: P1)

Como um músico, quero registrar minha banda com nome, gênero e biografia, para poder gerenciar minhas músicas e eventos.

**Why this priority**: A maioria das funcionalidades (agenda, repertório, eventos) depende de uma banda ativa.

**Independent Test**: Após o login, a criação de uma banda vinculada ao usuário logado deve ser verificada independentemente das músicas ou agenda.

**Acceptance Scenarios**:

1. **Given** um usuário logado e sem banda, **When** ele preenche os dados da nova banda, **Then** o sistema cria o perfil da banda e o torna o administrador.

---

### User Story 3 - Gestão de Repertório e Setlists (Priority: P2)

Como administrador da banda, quero adicionar músicas ao repertório e criar setlists, para me organizar para os shows.

**Why this priority**: O core da plataforma é a organização musical.

**Independent Test**: Criação de músicas e agrupamento em setlists podem ser validados no painel de repertório sem depender da agenda.

**Acceptance Scenarios**:

1. **Given** uma banda ativa, **When** o administrador cadastra uma nova música, **Then** a música aparece na listagem do repertório.
2. **Given** um repertório populado, **When** o administrador cria um setlist selecionando faixas, **Then** o setlist é salvo com a duração total calculada e mantendo a ordem definida.

---

### User Story 4 - Gestão da Agenda e Eventos (Priority: P2)

Como administrador da banda, quero registrar shows e ensaios, para manter o calendário da banda organizado.

**Why this priority**: O planejamento das apresentações e a geração do painel de resumo dependem dos eventos da agenda.

**Independent Test**: Cadastro de eventos e visualização no formato de calendário para a banda.

**Acceptance Scenarios**:

1. **Given** uma banda ativa, **When** o usuário cria um evento do tipo "Show" com data e local, **Then** o evento aparece na agenda do mês de forma destacada.

---

### User Story 5 - Convite de Membros (Priority: P3)

Como administrador, quero convidar outros músicos via e-mail atribuindo uma função, para que eles colaborem na banda.

**Why this priority**: Fundamental para a colaboração em equipe, mas o sistema pode funcionar inicialmente de forma individual para um membro.

**Independent Test**: Testar o envio de convites e a aceitação por outro usuário no sistema, validando a alteração de permissão na banda.

**Acceptance Scenarios**:

1. **Given** o e-mail de um membro, **When** o administrador envia um convite com a função de "Baterista", **Then** o convite fica pendente e visível até ser aceito ou expirado.

---

### User Story 6 - Exportação de Setlist em PDF (Priority: P3)

Como administrador da banda, quero exportar o setlist configurado em formato PDF, para uso durante a apresentação.

**Why this priority**: Funcionalidade muito útil para a ponta do processo musical, após toda a configuração prévia de músicas e setlists estar pronta.

**Independent Test**: Geração de arquivo PDF a partir de um setlist mockado, validando as colunas, numeração e ordenação.

**Acceptance Scenarios**:

1. **Given** um setlist salvo, **When** o usuário clica em exportar e confirma o layout, **Then** um PDF formatado é gerado para visualização/download.

### Edge Cases

- What happens when um usuário é removido de uma banda que acessava? (O sistema revoga seu acesso e o redireciona ao fluxo de criação/associação).
- How does system handle a exclusão de uma música que faz parte de setlists históricos? (A música pode ser desvinculada ou o setlist retém um snapshot para preservação do histórico).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST permitir o cadastro e autenticação de usuários via e-mail e senha.
- **FR-002**: O sistema MUST permitir que o usuário crie uma banda e torne-se o administrador primário.
- **FR-003**: O sistema MUST permitir cadastro de músicas com campos detalhados (título, categoria, status, afinação, BPM).
- **FR-004**: O sistema MUST suportar criação de Setlists consistindo de músicas ordenadas do repertório.
- **FR-005**: O sistema MUST suportar criação de eventos de tipo Ensaio (com roteiros customizáveis) e Show na agenda.
- **FR-006**: O sistema MUST suportar envio de convites por e-mail para atribuição de funções específicas aos novos membros.
- **FR-007**: O sistema MUST permitir a geração de arquivos PDF a partir de setlists prontos, oferecendo opções de customização visual e dados tabulares.

### Key Entities

- **Usuário**: Informações básicas de credenciais e perfil individual.
- **Banda**: Dados centrais da entidade musical (nome, gênero, bio).
- **Membro**: A relação de um usuário em uma banda e seu escopo de permissões/funções.
- **Música**: A faixa de repertório com seus atributos técnicos.
- **Setlist**: A coleção ordenada de músicas e sua duração consolidada.
- **Evento**: O compromisso agendado (ensaio/show) com local, horários e detalhes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Novos usuários devem conseguir completar o cadastro e criar o perfil inicial da banda em menos de 3 minutos.
- **SC-002**: O tempo para geração do PDF de um setlist contendo 20 músicas deve ser inferior a 3 segundos de resposta.
- **SC-003**: Listagens de repertório e navegação de agenda devem ter tempo de resposta inferior a 1 segundo mesmo para acervos superiores a 1.000 registros.
- **SC-004**: 90% dos usuários conseguem montar e salvar um setlist com 15 músicas na primeira tentativa sem solicitar suporte.

## Assumptions

- Presume-se o uso de um serviço SMTP externo (como SendGrid, AWS SES) ou provedor equivalente para os convites via e-mail.
- Presume-se que os requisitos de frontend (Web e Mobile) compartilharão do mesmo modelo de dados e API central para garantir a regra de negócio única.
- Presume-se que a experiência de usuário base (UI) não utilizará o HTML estático de "assets", mas será fielmente reproduzida a partir das referências visuais indicadas no projeto.
