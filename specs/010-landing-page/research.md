# Research & Decisions: Landing Page

## Decision 1: Formulários e Estado
**Decision**: O formulário de captura de leads utilizará **Signal Forms** nativo do Angular 17+ (ou `FormsModule`/`ReactiveFormsModule` se o Signal Forms do v19 não estiver totalmente portado, mas utilizando Signals para o estado reativo).
**Rationale**: A Constituição técnica do projeto exige uso moderno de estado (`signal()`) e desestimula abordagens clássicas pesadas para coisas simples. Como é apenas um campo (e-mail), manter o estado local reativo com um `WritableSignal<string>` é o caminho mais limpo.
**Alternatives considered**: Usar FormGroup completo. Rejeitado por ser excessivo para um formulário de um único campo que apenas valida e-mail e chama um endpoint simples.

## Decision 2: Estilização e Temas
**Decision**: Utilizar classes utilitárias do Tailwind CSS e tokens semânticos nativos do projeto para composição visual (ex: texto neon, backgrounds). O Dark Mode será fixo nesta tela.
**Rationale**: Mantém aderência à Constituição técnica da UI, garantindo consistência com o restante do Sonic Stage, que utiliza os tokens pré-definidos para preservar a estética "Cyberpunk/Synthwave".
**Alternatives considered**: Escrever SCSS puro BEM. Rejeitado pois a diretriz do projeto (vide constituição) preconiza o uso de Tailwind para utilitários de layout e apenas tokens globais (`var(--color-*)`) no lugar de SCSS customizado.

## Decision 3: Smooth Scrolling
**Decision**: O redirecionamento dos links no Header ("Funcionalidades", "Aviso de Lançamento") será feito com âncoras locais (`#features`, `#waitlist`) via CSS `scroll-behavior: smooth` ou diretiva angular.
**Rationale**: Forma mais leve e performática de garantir navegação amigável em páginas do tipo One Page, sem custo adicional de javascript.
