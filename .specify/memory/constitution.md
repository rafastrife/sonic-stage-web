<!--
Sync Impact Report:
- Version change: 2.0.0 → 2.2.0
- Modified: removidas as referências ao nome de outro projeto (nome, logo, feature de exemplo);
  seção 15.1 passa a refletir o fluxo de um único desenvolvedor (sem branch obrigatória);
  seções 8.2 e 8.3 passam a usar a identidade visual do Sonic Stage (DESIGN.md), sem Figma e sem tema claro.
- Added sections: None
- Removed sections: None
-->

# Constituição do Sonic Stage

**Versão:** 3.0.0
**Data de Ratificação:** 2026-05-24
**Última Alteração:** 2026-08-27

## Escopo de Aplicação

Este documento é a fonte única de verdade para decisões de arquitetura, padrão e qualidade dos dois projetos do Sonic Stage: `sonic-stage-web` (frontend) e `sonic-stage-api` (backend). Não se aplica a outros projetos da organização, e regras de outros projetos não se aplicam aqui.

Toda regra descreve o que **é** ou o que **deve passar a ser** neste repositório. Quando uma regra descreve um alvo que o código ainda não atingiu, isso está dito explicitamente. Nenhuma regra deve descrever ferramenta, biblioteca ou estrutura que o projeto não possui.

---

## 1. Princípios Core

### I. Separação de Arquitetura (Architecture Separation)

O frontend reside em `sonic-stage-web` e o backend em `sonic-stage-api`. As camadas de lógica, apresentação e persistência mantêm separação estrita.

**Regra inegociável de autorização:** toda decisão de acesso a dado é tomada no backend. O frontend pode ter guards e telas condicionais, mas eles são camada de experiência — nunca a autoridade. Uma regra de permissão que exista apenas no Angular é uma falha de segurança, não uma implementação.

### II. Código Limpo e Reutilizável (Clean & Reusable Code)

Priorizar padrões de código limpo. Criar componentes e funções reutilizáveis. Evitar duplicação generalizando lógica comum. Garantir manutenibilidade por abstrações claras e modularidade.

Na prática: quando a mesma verificação aparece em quatro lugares, ela vira uma classe — e não quatro cópias com pequenas diferenças.

6. **Consistência visual da marca**
   O frontend deve seguir os padrões visuais do Sonic Stage, respeitando o Design System, a paleta de cores e os componentes definidos em `assets/stitch_band_performance_manager/sonic_stage/DESIGN.md` (seção 8.2).

PostgreSQL é o motor de persistência. Todos os relacionamentos entre entidades (Bandas, Usuários, Eventos, Repertórios) usam chaves estrangeiras e integridade relacional estrita.

Restrições que expressam regra de negócio (`unique_together`, `on_delete`, `null=False`) pertencem ao modelo, não apenas ao serializer.

### IV. Consistência Multiplataforma (Cross-Platform Consistency)

As regras de negócio permanecem idênticas entre as interfaces Web e Mobile. Diferenças são permitidas apenas em apresentação, navegação e volume de dados exibido em uma única tela — nunca em restrições de lógica.

Como corolário do Princípio I: regra no backend é herdada por qualquer cliente sem código adicional.

### V. Aderência Estrita ao Domínio (Strict Business Domain Adherence)

O comportamento do sistema deve estar alinhado a `regras/regras_negocio_sonic_stage.md`. Isso inclui controle de acesso por papel, tipos de evento, fluxos de status e campos obrigatórios.

**Duas cópias, um conteúdo:** o arquivo existe em `sonic-stage-api/regras/` e em `sonic-stage-web/regras/`. As duas devem permanecer idênticas; alterar uma sem a outra é divergência.

**Divergência é possível, silêncio não é.** Quando uma feature precisa contrariar uma regra documentada, a divergência deve ser registrada no `plan.md` (seção Complexity Tracking), aprovada por produto, e o documento de regras atualizado na mesma feature. O que não é aceitável é implementar contra a regra sem registrar.

---

## 2. Stack e Infraestrutura

| Camada | Tecnologia |
|---|---|
| Banco de dados | PostgreSQL |
| Backend | Django 5.2 + Django REST Framework 3.15, em `sonic-stage-api` |
| Autenticação | JWT via `djangorestframework-simplejwt` |
| Frontend | Angular 17.3 (standalone), em `sonic-stage-web` |
| Estilo | Tailwind CSS 3.4 + `src/styles.css` — **o projeto não usa SCSS** |
| Configuração | Variáveis de ambiente via `python-dotenv` (`.env`, com `.env.example` versionado) |
| Exportação | PDF gerado no backend com WeasyPrint |
| Referência de UI | Mockups da pasta `assets` |

Nenhum segredo (chave de assinatura, senha de banco, credencial de integração) pode ser versionado. Configuração sensível vem do ambiente, e a ausência de uma variável obrigatória em produção deve interromper a inicialização — nunca cair em um valor padrão.

---

## 3. Arquitetura Angular

O projeto está em **Angular 17.3**. As regras abaixo respeitam o que essa versão suporta.

### 3.1 Standalone como padrão

Componentes, diretivas e pipes são standalone. No Angular 17 a propriedade `standalone: true` ainda precisa ser declarada explicitamente. Arquitetura baseada em `NgModule` é proibida para novas declarações.

### 3.2 Injeção de dependência

Dependências são obtidas com `inject()` em propriedades da classe, não por parâmetro de construtor:

```ts
private readonly router: Router = inject(Router);
private readonly songService: SongService = inject(SongService);
```

### 3.3 Estado reativo

O estado local usa a API reativa nativa: `signal()`, `computed()` e `effect()`.

**Armadilha conhecida:** um `computed()` que lê um `@Input` comum não recalcula quando o valor do input muda. Se um valor derivado depende de um input, o input precisa ser um signal.

### 3.4 API de input/output

Para **componentes novos**, usar a API baseada em funções, disponível a partir do Angular 17.1:

```ts
public readonly song = input<Song>();
public readonly changed = output<{ action: 'update' }>();
```

Componentes existentes que usam `@Input()`/`@Output()` migram quando forem tocados por outro motivo. Não é obrigatório abrir uma frente de migração só para isso.

### 3.5 Fluxo de controle em templates

Usar o fluxo de controle nativo: `@if`, `@for`, `@switch`, `@empty`. `*ngIf` e `*ngFor` são proibidos em templates novos.

### 3.6 Roteamento

Rotas são carregadas sob demanda com `loadComponent` / `loadChildren`. Toda área que exige sessão recebe `canActivate` no nó pai, não em cada filho — assim telas adicionadas depois já nascem protegidas.

---

## 4. Estado e Serviços

O projeto usa dois padrões complementares. Ambos são legítimos; a escolha depende do papel.

### 4.1 Stores — estado compartilhado

`src/app/core/stores/` — `@Injectable({ providedIn: 'root' })` que expõe signals privados via `computed()` públicos. Guardam estado que sobrevive à navegação e é lido por várias telas: sessão, banda ativa, notificações.

Regra: o signal de escrita é privado (`_accessToken`); o mundo externo lê pelo `computed()` e escreve por método nomeado (`setSession()`, `logout()`).

### 4.2 Services — acesso HTTP

`src/app/services/` para serviços de domínio (`song.service.ts`, `setlist.service.ts`) e `src/app/core/services/` para serviços de infraestrutura (`google-auth.service.ts`).

Regras:

- URLs sempre relativas, começando por `/api/`. Host absoluto em código é proibido — a resolução por ambiente é responsabilidade do interceptor.
- Componentes não montam URL na mão. Se uma tela precisa chamar um endpoint, o método vai no service correspondente.
- Todo `subscribe()` que grava dado tem tratamento de `error` com retorno visível ao usuário. Falha de gravação silenciosa é defeito.

### 4.3 Interceptors

`src/app/core/interceptors/` — o interceptor de autenticação injeta o header `Authorization` e trata `401`; o de erro centraliza a mensagem. Nenhum componente repete essa lógica.

---

## 5. Componentização

### 5.1 Responsabilidade única

Componente de página orquestra e busca dados; componente de apresentação recebe dados e emite eventos. Um componente de apresentação não injeta service de domínio.

### 5.2 Reuso

O que é usado por duas ou mais features vai para `src/app/shared/components/`. O que é usado por uma só permanece dentro da pasta da feature.

Componente não utilizado deve ser removido, não mantido "para depois".

### 5.3 Ciclo de vida

Todo recurso que sobrevive ao componente é liberado em `ngOnDestroy`: `addEventListener`, `setInterval`, `setTimeout` e subscriptions manuais. Um listener registrado no construtor sem destruição correspondente é vazamento.

---

## 6. Segurança

### 6.1 Autorização

Conforme o Princípio I, a autorização vive no backend. No Django REST Framework, isso significa classes de permissão explícitas por viewset — nunca apenas `IsAuthenticated` em um recurso que pertence a uma entidade.

Um recurso aninhado sob um identificador na URL (`/api/bands/{id}/songs/`) deve verificar que o usuário autenticado tem vínculo com aquela entidade. Filtrar o queryset pelo identificador da URL **não é** autorização.

### 6.2 Segredos e configuração

Nenhum segredo no repositório. Nenhum valor padrão inseguro. `.env` no `.gitignore`, `.env.example` versionado sem valores reais.

### 6.3 Superfície do cliente

- Não confiar em validação feita apenas no frontend. Toda regra validada na tela é revalidada no servidor.
- Evitar `innerHTML` e `bypassSecurityTrust*`. Conteúdo dinâmico usa interpolação.
- Segredo (token de convite, credencial) nunca aparece em query string, log ou mensagem de erro.

### 6.4 Sessão

A verificação de sessão no cliente considera a validade temporal da credencial, não apenas sua presença.

---

## 7. Código e Tipagem

### 7.1 Tipagem explícita

Todo código TypeScript tem tipagem explícita: variáveis, parâmetros, retornos e propriedades.

`any` é proibido em código novo. Toda entidade trafegada pela API tem modelo em `src/app/models/`, como já ocorre com `Song` e `Setlist`.

### 7.2 Clareza

Nomes descrevem intenção. Funções fazem uma coisa. Aninhamento profundo é sinal de extração pendente.

### 7.3 Higiene

Imports no topo do arquivo — nunca no meio ou dentro de função. Import não utilizado é removido. Código comentado não é versionado; o histórico do git cumpre esse papel.

### 7.4 Idioma na interface

A interface é integralmente pt-BR. Mensagens de erro, rótulos e textos exibidos ao usuário são em português, inclusive os originados no backend.

`alert()` e `confirm()` nativos não são padrão de UX aceitável — usar os componentes de modal e feedback do projeto.

---

## 8. Estrutura de Pastas

Estrutura real do `sonic-stage-web`:

```html
<!-- Correto -->
<form novalidate (submit)="submitForm($event)">
  ...
</form>

<!-- Proibido — validação HTML5 pode sobrepor o Signal Forms -->
<form (submit)="submitForm($event)">
  ...
</form>
```

O `novalidate` não desativa os validadores do Signal Forms — apenas impede que o browser intervenha com sua própria validação antes que o Angular processe o evento.

---

### 7.7 BaseFormComponent — base para páginas de formulário

Todo componente de página que representa um formulário **deve** estender `BaseFormComponent<K>`, localizado em `src/app/core/base/base-form-component.ts`.

**Contrato abstrato que o filho implementa:**

| Membro | Tipo | Descrição |
|---|---|---|
| `formRef` | `FieldTree<K>` | Field tree criada com `form()` |
| `initialData` | `K` | Valor inicial do modelo (modo criação) |
| `handleSubmit()` | `Promise<void>` | Lógica de submissão (service, navegação, toastr) |

**API fornecida pela base:**

| Membro | Tipo | Descrição |
|---|---|---|
| `data` | `input<Partial<K> \| null>(null)` | Dados externos — ativa o modo edição |
| `model` | `signal<K>` | Modelo reativo do formulário |
| `isEditMode` | `computed<boolean>` | `true` quando `data !== null` |
| `isSubmitting` | `signal<boolean>` | Estado de loading da submissão |
| `serverErrors` | `signal<Record<string, string>>` | Erros de campo vindos do servidor (limpo automaticamente a cada submit) |
| `toastr` | `ToastrService` | Injetado na base — não reinjetar nos filhos |
| `submitForm(event)` | método | Vinculado ao `(submit)` do form; previne dupla submissão e limpa `serverErrors` |
| `handleApiError(err)` | método | Trata `HttpErrorResponse`: erros de campo → `serverErrors`; strings globais → toast |
| `getModel()` | `Partial<K>` | Modo criação: model completo. Modo edição: só campos alterados |
| `updateField(key, value)` | método | Atualiza um campo individualmente |
| `resetForm()` | método | Restaura o baseline (`initialData` + `data`) |
| `hasChanges` | `get boolean` | Compara model atual com baseline via `isDeepEqual` |

**Padrão de implementação:**

```typescript
import { BaseFormComponent } from '@core/base';
import { InputComponent, SelectComponent, ToggleComponent } from '@shared/components';

@Component({
  selector: 'app-my-form',
  imports: [InputComponent, SelectComponent, ToggleComponent],
  templateUrl: './my-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyFormComponent extends BaseFormComponent<MyData> {

  protected readonly initialData: MyData = { name: '', active: false };

  readonly formRef = form(this.model, (s) => {
    required(s.name);
  });

  private readonly myService = inject(MyService);
  private readonly router = inject(Router);

  protected async handleSubmit(): Promise<void> {
    try {
      await firstValueFrom(this.myService.save(this.getModel()));
      this.toastr.success(Messages.myDomain.created); // use Messages de @core/constants
      this.router.navigate(['/list']);
    } catch (err) {
      this.handleApiError(err); // herdado da base — não reimplementar
    }
  }
}
```

**Template:**

```html
<form novalidate (submit)="submitForm($event)">
  <app-input [formField]="formRef.name" label="Nome" />
  <app-toggle [formField]="formRef.active" label="Ativo" />
  <button type="submit" [disabled]="isSubmitting()">Salvar</button>
</form>
```

**Regras:**

- O `handleSubmit()` é chamado pelo Signal Forms **apenas quando o formulário é válido** — não valide manualmente antes de chamar o serviço.
- Em modo edição, passe `[data]="registro"` no componente filho; a base sincroniza automaticamente.
- Use `isSubmitting()` para desabilitar o botão de submit durante requisições.
- Nunca gerencie `isSubmitting` manualmente — a base cuida disso no `submitForm()`.
- `toastr` está disponível via `this.toastr` — **não reinjetar** `ToastrService` em componentes filhos.
- Erros de API devem ser tratados via `this.handleApiError(err)` — nunca reimplementar o parsing de `HttpErrorResponse` no componente.

---

### 7.8 Tratamento de erros de servidor em formulários

O `BaseFormComponent` gerencia o ciclo completo de erros de servidor. **Nunca crie signals ou métodos de erro próprios** em componentes filhos.

**Como `handleApiError()` classifica o body do erro:**

| Tipo do valor no body | Comportamento |
|---|---|
| `string[]` (array de strings) | Erro de campo → gravado em `serverErrors[key]` |
| `string` | Mensagem global → `toastr.error(value)` |
| outro (número, objeto, …) | Metadado → ignorado silenciosamente |

**Padrão obrigatório no componente:**

```typescript
try {
  await firstValueFrom(this.service.save(payload));
} catch (err) {
  this.handleApiError(err); // ← única linha necessária
}
```

**Padrão obrigatório no template:**

```html
<app-input
  [formField]="formRef.email"
  [serverError]="serverErrors()['email']"
/>
```

`serverErrors` é limpo automaticamente pelo `submitForm()` a cada nova tentativa — não limpe manualmente.

---

## 8. Padrões de Template e UI

### 8.1 SCSS como base de layout

Todo layout, espaçamento, alinhamento, responsividade e composição visual devem ser implementados via SCSS.

O projeto utiliza **Tailwind CSS v4** integrado ao SCSS global com `@use 'tailwindcss'`. A divisão de responsabilidades entre `@apply` e `var(--token)` é obrigatória:

| Mecanismo | Uso |
|---|---|
| `@apply` | Layout, estrutura e estados comportamentais — classes utilitárias do Tailwind (ex.: `flex`, `items-center`, `hidden`, `focus:outline-none`) |
| `var(--token)` | Toda propriedade visual — cores, radius, espaçamento, tipografia, sombras |

**Nenhum valor hardcoded** (hex, rgb, px) para propriedades visuais: use sempre o token equivalente de `src/styles/_themes.scss`. A conversão de `@apply` nunca substitui tokens semânticos — ela complementa o layout estrutural.

**Regra de Ouro: Estilos por Camada**

É **proibido** o uso de atributo `style="..."` inline em templates HTML.

Para propriedades **estruturais** (display, flex-direction, align-items, justify-content, flex-wrap, gap, padding sem semântica de design system), Tailwind CSS PODE ser usado diretamente no template via classes utilitárias. Para propriedades **visuais** (cores, radius, tipografia, sombras) e para padrões reutilizáveis entre páginas, sempre usar classes `.ui-*` globais ou `*.component.scss`.

**Correto — estrutura com Tailwind, visual com tokens:**

```html
<!-- Tailwind para estrutura, classes globais para visual -->
<div class="flex flex-col gap-4">
  <div class="ui-alert ui-alert--danger">...</div>
</div>
```

**Correto — visual encapsulado em SCSS de componente:**

```html
<div class="card__header">...</div>
```

```scss
// SCSS
.card__header {
  display: flex;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border-default);
  background-color: var(--color-surface-default);
}
```

**Incorreto:**

```html
<!-- NUNCA fazer isso -->
<div style="display: flex; align-items: center; padding: 0.75rem 1rem;">...</div>
```

**Priorize:**

- Flexbox e CSS Grid para estrutura de layout
- Tokens de espaçamento (`var(--space-*)`) para `padding`, `margin` e `gap` — nunca valores `px` hardcoded
- Tokens de radius (`var(--radius-*)`) para `border-radius` — nunca valores `px` hardcoded
- Tokens de tipografia (`var(--font-size-*)`, `var(--font-weight-*)`) para tamanho e peso de texto
- Tokens de sombra (`var(--shadow-*)`) para `box-shadow`
- Media queries para responsividade — usar exclusivamente os mixins `bp.up()`, `bp.down()` e `bp.between()` de `src/styles/_breakpoints.scss` (seção 8.7)
- Classes semânticas consistentes quando encapsuladas em componentes

### 8.2 Sistema de Design — Sonic Stage

Todas as implementações de front-end devem seguir **exclusivamente** os tokens e diretrizes do **Sistema de Design do Sonic Stage**, sendo esta a única fonte de verdade para cores, tipografia, espaçamento e estilo de componentes.

O estilo é **Neon-Futurismo + Minimalismo**: superfícies muito escuras ("palco apagado / estúdio") que fazem os acentos neon parecerem emitir luz. O contraste forte guia a atenção para o conteúdo e para os pontos de interação.

**Fontes oficiais (em ordem de precedência):**

1. `assets/stitch_band_performance_manager/sonic_stage/DESIGN.md` — especificação do design system (tokens, tipografia, elevação, formas e componentes)
2. Telas de referência em `assets/stitch_band_performance_manager/*/screen.png` (desktop e mobile)
3. `src/styles/_themes.scss` (CSS custom properties) e `tailwind.config.js` — implementação dos tokens; o Tailwind deve expor os mesmos tokens para uso nas classes utilitárias

**Regras inegociáveis:**

- Utilizar apenas **tokens semânticos** — nunca valores hardcoded (hex, rgb, px) quando houver equivalente; nada de cores arbitrárias como `text-[#00d1ff]` no template
- O sistema é **dark-mode-first e exclusivamente escuro**: não implementar tema claro na interface (o tema claro existe apenas como opção de exportação do PDF de repertório)
- Não usar condicionais manuais de tema (`theme === "dark" ? ... : ...`)
- Todos os componentes interativos devem conter estados: `default`, `hover`, `active`, `focus-visible`, `disabled`
- O estado `focus-visible` deve sempre utilizar `border/focus` (azul elétrico) como outline, com glow sutil (acessibilidade obrigatória)
- Elevação é feita por **camadas tonais e glows**, não por sombras tradicionais
- Ao criar componentes, usar como classe base `src/styles/components`.

Componentes compartilhados como `Card`, `DataTable`, `Button`, `Input`, `Alert`, `Dashboard`, `Sidenav` e similares devem respeitar integralmente a identidade visual do Sonic Stage definida nesses tokens.

---

### 8.3 Paleta de Tokens Semânticos

O sistema utiliza tokens semânticos sobre uma base escura. Nunca utilizar valores diretos quando houver token correspondente.

A paleta tem como base o **Midnight Black**. A cor principal é o **Azul Elétrico** (`#00d1ff`), usado em ações principais, indicadores de progresso e elementos de marca. O **Magenta Vívido** (`#ff4b89`) é o acento de alta energia, reservado para ações secundárias de destaque, notificações e indicadores "ao vivo"/"novo". O **Âmbar** (`#feb127`) é a cor terciária, usada com moderação (avisos, destaques pontuais). Os neutros são dessaturados para preservar a pureza dos acentos neon.

**Tokens de interação:**

- `interactive/primary/default`: `#00d1ff` (azul elétrico — botões primários, links, progresso)
- `interactive/primary/hover`: `#4cd6ff`
- `interactive/primary/on`: `#000000` (texto preto sobre fundo azul — alto contraste)
- `interactive/primary/subtle`: `rgba(0,209,255,0.15)`
- `interactive/secondary/default`: `transparent` com borda 1px `#00d1ff` e texto `#00d1ff` (botão secundário)
- `interactive/secondary/hover`: `rgba(0,209,255,0.10)`
- `interactive/accent/default`: `#ff4b89` (magenta — botão ghost de alta energia, badges "ao vivo"/"novo")
- `interactive/accent/hover`: `#ffb1c3`
- `interactive/accent/subtle`: `rgba(255,75,137,0.15)`
- `interactive/tertiary/default`: `#feb127` (âmbar)

**Tokens de superfície e conteúdo:**

- `bg/base`: `#000000` (nível 0 — canvas da aplicação; preto real para contraste e OLED)
- `surface/default`: `#0a0a0a` (nível 1 — cards, seções, modais)
- `surface/raised`: `#1a1a1a` (nível 2 — hover, elementos flutuantes)
- `surface/input`: `#050505` (campos de formulário, mais escuros que a superfície)
- `content/primary`: `#e5e2e1`
- `content/secondary`: `#bbc9cf`
- `content/tertiary`: `#859399`
- `border/default`: `#1a1a1a`
- `border/strong`: `#3c494e`
- `border/focus`: `#00d1ff` (acessibilidade)
- `link/default`: `#00d1ff` → hover `#a4e6ff`

**Tokens de status:**

- `status/success`: bg `rgba(74,222,128,0.15)`, content `#4ade80`
- `status/warning`: bg `rgba(254,177,39,0.15)`, content `#feb127`
- `status/danger`: bg `rgba(147,0,10,0.35)`, content `#ffb4ab`
- `status/info`: bg `rgba(0,209,255,0.15)`, content `#00d1ff`
- `status/live`: bg `rgba(255,75,137,0.15)`, content `#ff4b89` (ao vivo, novo, próximo show)

**Tipografia:**

- **Fonte única:** Montserrat (pesos 400, 500, 600, 700, 800)
- **Títulos e display:** Bold/ExtraBold com letter-spacing negativo, transmitindo impacto
- **Corpo:** Regular com line-height generoso (1.5–1.6) para leitura sobre fundo escuro
- **Labels:** Medium/SemiBold, frequentemente em maiúsculas com letter-spacing positivo (estética de "painel de instrumento")
- **Base de corpo:** 16px · escala: `xs`=12 · `sm`=14 · `base`=16 · `lg`=18 · `xl`=24 · `2xl`=32 · `display`=56

**Tokens de espaçamento (`--space-*`):**

O grid usa unidade base de **8px**. Desktop: 12 colunas, gutter 24px, margem a partir de 48px, largura máxima 1440px. Tablet: 8 colunas, gutter 20px, margem 32px. Mobile: 4 colunas, gutter e margem de 16px. Use gaps grandes (48px+) entre seções distintas e pequenos (8–16px) entre elementos relacionados.

| Token | Valor | Uso típico |
| --------------- | ----- | ----------------------------------------- |
| `--space-1` | 4px | micro espaçamento, gaps mínimos |
| `--space-2` | 8px | espaçamento interno compacto (unidade base) |
| `--space-3` | 12px | padding de elementos pequenos |
| `--space-4` | 16px | padding padrão de componentes, margem mobile |
| `--space-5` | 20px | gutter tablet |
| `--space-6` | 24px | gutter desktop, seções internas de cards/forms |
| `--space-8` | 32px | separação de blocos, margem tablet |
| `--space-10` | 40px | padding de seções de página |
| `--space-12` | 48px | espaçamento entre seções grandes, margem desktop |
| `--space-16` | 64px | espaçamento de layout |
| `--space-20` | 80px | margens de seção |

**Tokens de radius (`--radius-*`):**

Geometria **suave**: cantos discretos, com aparência técnica de equipamento musical.

| Token | Valor | Uso típico |
| -------------- | ------ | ---------------------------------- |
| `--radius-xs` | 2px | detalhes mínimos |
| `--radius-sm` | 4px | botões, inputs, chips e tags |
| `--radius-md` | 6px | selects, dropdowns |
| `--radius-lg` | 8px | cards, modais, painéis |
| `--radius-xl` | 12px | hero, banners, seções de destaque |
| `--radius-full` | 9999px | avatares, pílulas, toggles |

**Tokens de tipografia:**

| Token | Valor | Uso típico |
| ----------------------- | ----- | -------------------------------- |
| `--font-size-xs` | 12px | labels pequenos, metadados |
| `--font-size-sm` | 14px | labels, texto secundário |
| `--font-size-base` | 16px | texto padrão de interface |
| `--font-size-lg` | 18px | corpo de destaque |
| `--font-size-xl` | 24px | títulos de seção, títulos de página no mobile |
| `--font-size-2xl` | 32px | títulos de página |
| `--font-size-display` | 56px | hero / landing page |
| `--font-weight-regular` | 400 | texto corrido |
| `--font-weight-medium` | 500 | labels pequenos, navegação |
| `--font-weight-semibold` | 600 | labels, cabeçalhos |
| `--font-weight-bold` | 700 | títulos |
| `--font-weight-extrabold` | 800 | display, hero |

**Tokens de elevação e glow:**

A profundidade é transmitida por camadas tonais (`bg/base` → `surface/default` → `surface/raised`) e por glows sutis, nunca por sombras escuras tradicionais.

- `--glow-primary` (`shadow-glow-primary`) — `0 0 15px rgba(0,209,255,0.3)` (CTA principal, foco de input)
- `--glow-primary-strong` (`shadow-glow-primary-strong`) — `0 0 25px rgba(0,209,255,0.5)` (hover do CTA principal)
- `--glow-accent` (`shadow-glow-accent`) — `0 0 15px rgba(255,75,137,0.3)` (elementos "ao vivo" / destaque)
- `--glow-tertiary` (`shadow-glow-tertiary`) — `0 0 15px rgba(254,177,39,0.3)` (destaques pontuais em âmbar)
- `--shadow-lg` — `0 8px 24px rgba(0,0,0,0.6)` (apenas modais, dropdowns e popovers sobre conteúdo)

**Componentes de referência (resumo do DESIGN.md):**

- **Botão primário:** fundo azul elétrico sólido, texto preto
- **Botão secundário:** fundo transparente, borda 1px azul elétrico, texto azul
- **Botão terciário/ghost:** sem fundo e sem borda, texto magenta (ações de alta energia)
- **Input:** fundo `surface/input`, borda 1px `border/default`; no foco, borda azul elétrico com `--glow-primary`
- **Card:** fundo `surface/default`; acentos pequenos ("Novo", "Ao vivo") em magenta
- **Chips e tags:** radius 4px; categorias com fundo cinza escuro e texto branco; status com `status/live` (fundo magenta translúcido, texto magenta)
- **Visualizador de áudio:** barras verticais com gradiente do azul elétrico (base) ao magenta (pico)

Para a lista completa de tokens, consultar `assets/stitch_band_performance_manager/sonic_stage/DESIGN.md` ou `src/styles/_themes.scss`.

---

### 8.4 Arquitetura SCSS — Padrão de Componentização

**Estrutura obrigatória para estilos:**

1. **Componentes globais** (`src/styles/components/`):
   - Arquivos parciais: `_{componente}.scss`
   - Classes com prefixo `.ui-*`
   - Propriedades CSS nativas para composição de estilos
   - Tokens do design system via `var(--color-*)`, `var(--space-*)`, etc.

   **Arquivos existentes:**

   | Arquivo | Classes geradas | Descrição |
   |---|---|---|
   | `_alert.scss` | `.ui-alert`, `.ui-alert--danger`, `.ui-alert__message` | Callouts de alerta com variantes semânticas |
   | `_badge.scss` | `.ui-badge`, `.ui-badge--*` | Badges de status com variantes e shapes |
   | `_button.scss` | `.ui-button`, `.ui-button--*` | Botões com variantes, tamanhos e estados |
   | `_data-table.scss` | `.ui-data-table__*` | Tabela de dados com layout e estados |
   | `_form-field.scss` | `.input-field`, `.select-field`, `.toggle-field` e subclasses BEM | Estilos unificados de todos os campos de formulário (input, select, toggle); inclui variantes de tamanho (`--sm`, `--md`, `--lg`) e suporte a ícone à esquerda |
   | `_page.scss` | `.ui-page`, `.ui-layout`, `.ui-layout__main`, `.ui-layout__scroll`, `.ui-page-header`, `.ui-page-header__*` | Wrapper de conteúdo, shell de layout principal e cabeçalho de página |
   | `_progress.scss` | `.ui-progress`, `.ui-progress__*` | Barra de progresso com variantes |
   | `_select-list.scss` | `.ui-select-list`, `.ui-select-list__item` | Lista scrollável de itens selecionáveis |
   | `_sidebar.scss` | `.ui-sidebar`, `.ui-sidebar--*`, `.ui-sidebar__*` | Sidebar de navegação lateral com colapso e drawer mobile |
   | `_typography.scss` | `.ui-text-*`, `.ui-link`, `.ui-stack` | Classes semânticas de tipografia |

   **Classes de tipografia utilitárias** (definidas em `_typography.scss`):

   | Classe | Uso |
   |---|---|
   | `.ui-text-id` | Códigos de referência, IDs de registro |
   | `.ui-text-title` | Títulos de entidade |
   | `.ui-text-caption` | Rótulos pequenos |
   | `.ui-text-date` | Valores de data |
   | `.ui-text-meta` | Informação secundária/auxiliar |
   | `.ui-text-overline` | Labels em maiúsculo |
   | `.ui-link` | Links — variantes `--primary`, `--muted`; modificadores `--bold`, `--sm`; `text-decoration: none` por padrão, underline no hover |
   | `.ui-stack` | Container vertical de grupo de texto |

2. **Estilos de host** — propriedade `host:` no `@Component`:

   Regras que se aplicam ao elemento host (`display`, `style`, atributos estáticos) devem ser declaradas diretamente na propriedade `host` do decorator — **nunca em arquivo `.scss`**:

   ```typescript
   @Component({
     selector: 'app-sidebar',
     host: { 'style': 'display: contents' },
   })
   ```

   Isso elimina arquivos `.scss` criados exclusivamente para uma única regra `:host`.

3. **Estilos de componente** (`*.component.scss` / `*.page.scss`):

   **Criar arquivo `.scss` é proibido por padrão.** Tailwind utilities e classes `.ui-*` globais devem
   cobrir a quase totalidade dos estilos. Um arquivo `.scss` local só é justificado quando **todas**
   as condições abaixo forem verdadeiras:

   - O estilo tem semântica visual específica (cores, bordas personalizadas, sombras, animações,
     transições proprietárias) que **não existe** em nenhum token global nem em classe `.ui-*`; **E**
   - O padrão **não será reutilizado** em outra feature (caso contrário, criar global em
     `src/styles/components/`); **E**
   - Tailwind utilities são insuficientes ou produziriam classes arbitrárias sem semântica clara.

   **Casos justificados (referência):**
   - `login.page.scss` — painel de marca com imagem de fundo, gradiente e animações de entrada únicas

   **Casos que NÃO justificam um `.scss`:**
   - Qualquer wrapper com `display: flex`, `flex-direction`, `gap`, `padding` → Tailwind direto no template
   - `user-list.page.scss` com `padding: var(--space-6)` → usar `.ui-page`
   - `dashboard.component.scss` só para `display: flex; gap: var(--space-4)` → `class="flex gap-4"`

   Quando o arquivo `.scss` for criado, as classes devem seguir a hierarquia BEM:

   ```
   .nome-do-componente
   .nome-do-componente__elemento
   .nome-do-componente--variante
   ```

4. **Hierarquia de classes semânticas** (quando o arquivo `.scss` local for criado):

```
.nome-do-componente           // Bloco principal
.nome-do-componente__elemento // Elemento interno
.nome-do-componente--variante // Modificador/variante
```

5. **Fluxo de Decisão — Reutilização vs Criação de Componentes SCSS:**

Ao implementar uma nova feature ou componente visual, seguir esta sequência de perguntas:

**Passo 0 — O estilo é puramente estrutural (display, flex-direction, align-items, justify-content,
flex-wrap, gap, padding) sem semântica visual específica?**
Use Tailwind utilities diretamente no template — não crie classe SCSS para regras que o Tailwind
já cobre com semântica clara.

- **Sim:** Adicione classes Tailwind no template (ex: `class="flex flex-col gap-4 p-6"`). Nenhum SCSS necessário.
- **Não:** Avance para o Passo 1.

**Passo 1 — Já existe um componente equivalente em `src/styles/components/`?**
Verifique se há um arquivo parcial (`_button`, `_card`, `_input`, `_table`, `_form`, `_feedback`, etc.) que já cobre o estilo necessário.

- **Sim:** Reutilize. Use a classe global existente (ex: `.ui-button`, `.ui-card`) diretamente no template. Nenhum SCSS novo é necessário.
- **Não:** Avance para o Passo 2.

**Passo 2 — O novo componente será reutilizado em outras features ou páginas?**
Avalie se esse padrão visual aparecerá em dois ou mais contextos diferentes da aplicação.

- **Sim:** Crie global. Adicione um novo arquivo parcial em `src/styles/components/` com prefixo `.ui-*`
  (ex: `_badge.scss` com classe `.ui-badge`). Documente uso, tokens e variantes com comentários no arquivo.
- **Não:** Avance para o Passo 3.

**Passo 3 — O estilo tem semântica visual específica que Tailwind não cobre?**
Apenas sombras/bordas personalizadas, animações, gradientes ou estruturas com lógica visual própria
justificam um arquivo `.scss` local. Propriedades estruturais (`flex`, `gap`, `padding`) **nunca** justificam.

- **Sim (com justificativa clara):** Crie local. Adicione o estilo no arquivo `.component.scss` da própria
  feature (ex: `login.page.scss`), usando tokens semânticos para garantir suporte a temas. Registre no PR
  por que Tailwind e `.ui-*` não eram suficientes.
- **Não:** Nenhum SCSS necessário — use Tailwind utilities diretamente no template.

**Regras de Decisão:**

- Sempre verifique `src/styles/components/` antes de criar qualquer estilo novo.
- Reutilize componentes globais quando o comportamento visual é idêntico ou muito similar ao existente.
- Crie global apenas se o componente será usado em duas ou mais features diferentes.
- **Nunca crie `.scss` local apenas para `display: flex`, `gap` ou `padding`** — essas regras vão direto no template via Tailwind.
- Arquivo `.scss` local é a opção de último recurso, não o padrão.
- Documente novos componentes globais com comentários sobre uso, tokens e variantes.

**Exemplos Práticos:**

| Situação                                         | Decisão        | Localização                                                         |
| ------------------------------------------------ | -------------- | ------------------------------------------------------------------- |
| `display: flex; gap: var(--space-4)`             | Tailwind       | `class="flex gap-4"` diretamente no template                        |
| `padding: var(--space-6); flex-direction: column`| Tailwind       | `class="p-6 flex flex-col"` diretamente no template                 |
| Wrapper de conteúdo de página                    | Reutilizar     | `src/styles/components/_page.scss` (classe `.ui-page`)              |
| Botão de ação primária                           | Reutilizar     | `src/styles/components/_button.scss` (classe `.ui-button--primary`) |
| Tabela de listagem                               | Reutilizar     | `src/styles/components/_data-table.scss` (classe `.ui-data-table`)  |
| Badge de status ativo/inativo                    | Reutilizar     | `src/styles/components/_badge.scss` (classe `.ui-badge`)            |
| Alerta de confirmação de exclusão                | Reutilizar     | `src/styles/components/_alert.scss` (classe `.ui-alert--danger`)    |
| Painel de login com gradiente e animações únicas | Criar local    | `login.page.scss` (classe `.login-page`) — SCSS justificado         |
| Card com borda animada específica da feature     | Criar local    | `feature.component.scss` — SCSS justificado                         |

**Exemplo de implementação:**

```html
<!-- Template -->
<article class="card">
  <header class="card__header">...</header>
  <div class="card__body">...</div>
  <footer class="card__footer">...</footer>
</article>
```

```scss
// SCSS
.card {
  border-radius: var(--radius-md);
  transition: box-shadow 200ms ease;
  background-color: var(--color-surface-default);

  &__header {
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--color-border-default);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    color: var(--color-content-primary);
  }

  &__body {
    padding: var(--space-4);
    color: var(--color-content-secondary);
  }

  &--raised {
    box-shadow: var(--shadow-md);
  }
}
```

**Checklist de Code Review para Estilos:**

- [ ] Zero estilos inline no template
- [ ] Classes semânticas com nomes descritivos
- [ ] Propriedades CSS nativas para composição de estilos
- [ ] Tokens do design system para cores, espaçamento, radius, tipografia e sombras
- [ ] Nenhum valor hardcoded (hex, rgb, px) quando token equivalente existir
- [ ] Estados interativos implementados (hover, focus, disabled)
- [ ] Tema escuro validado (contraste dos textos e estados de foco)

---

### 8.5 Feedback de Mensagens da API

Mensagens de retorno da API devem seguir esta distinção obrigatória:

- **Erros de campo (400 com array)** → exibir inline via `serverErrors()['campo']` no template — tratado automaticamente pelo `handleApiError()` da base (seção 7.8).
- **Mensagens globais do backend (strings no body do erro)** → `toastr.error()` disparado automaticamente pelo `handleApiError()`.
- **Sucesso e mensagens de negócio** → `toastr.success()` / `toastr.info()` explícitos no `handleSubmit()`.

É proibido o uso de `alert()`, `console.log()` ou componentes customizados de notificação para retornos de API.

**Implementação para páginas de formulário** (que estendem `BaseFormComponent`):

```ts
import { Messages } from '@core/constants';

// Sucesso — use Messages de @core/constants, nunca string literal
this.toastr.success(Messages.users.created);

// Erro — delegar à base, não implementar parsing próprio
this.handleApiError(err);
```

`ToastrService` é injetado em `BaseFormComponent` e disponível como `this.toastr` — **não reinjetar** nos componentes filhos.

**Implementação para componentes que não estendem `BaseFormComponent`:**

```ts
import { ToastrService } from 'ngx-toastr';
import { Messages } from '@core/constants';

private readonly toastr = inject(ToastrService);

this.toastr.success(Messages.meuDominio.created);
this.toastr.error(Messages.errors.unexpected);
```

O `ngx-toastr` deve ser configurado no `app.config.ts` via `provideToastr()`. Não chamar `provideAnimations()` ou `provideAnimationsAsync()` — ambos foram removidos no Angular 19+.

---

### 8.6 Ícones — LucideAngularModule

O projeto usa `lucide-angular` para ícones. **Todo ícone referenciado em qualquer componente deve estar registrado no `LucideIconProvider` em `src/app/app.config.ts`** antes de ser usado. Ícones não registrados não renderizam e geram erro no console.

**Fluxo obrigatório ao usar um ícone:**

1. Verificar se o ícone já está em `LucideIconProvider` no `app.config.ts`.
2. Se não estiver, importar e adicionar antes de usar.

```typescript
// app.config.ts
import { ArrowRight, Plus, NomeDoIcone } from 'lucide-angular';

{
  provide: LUCIDE_ICONS,
  useValue: new LucideIconProvider({
    ArrowRight,
    Plus,
    NomeDoIcone, // ← adicionar aqui
  }),
}
```

O nome passado ao `[name]` do `<lucide-angular>` segue o padrão kebab-case (ex: `arrow-right`, `chevron-down`), enquanto o import usa PascalCase (`ArrowRight`, `ChevronDown`).

---

### 8.7 Responsividade — Breakpoints e Media Queries

O projeto centraliza todos os breakpoints em `src/styles/_breakpoints.scss`, alinhado com os breakpoints padrão do Tailwind CSS v4. **É proibido escrever valores de `@media` diretamente nos arquivos SCSS** — todo acesso deve ocorrer via os mixins exportados por esse arquivo.

**Breakpoints disponíveis:**

| Nome | Valor |
|---|---|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

**Mixins disponíveis:**

| Mixin | Gera | Equivalente Tailwind |
|---|---|---|
| `bp.up(lg)` | `@media (min-width: 1024px)` | prefixo `lg:` |
| `bp.down(md)` | `@media (max-width: 767px)` | abaixo de `md:` |
| `bp.between(sm, lg)` | `@media (min-width: 640px) and (max-width: 1023px)` | — |

**Como usar:**

```scss
@use 'styles/breakpoints' as bp;
@reference "tailwindcss";

.meu-componente {
  // estilos base (mobile-first)

  @include bp.up(lg) {
    // desktop e acima
  }

  @include bp.down(md) {
    // apenas mobile
  }
}
```

O `includePaths: ["src"]` configurado no `angular.json` garante que `@use 'styles/breakpoints'` funciona de qualquer arquivo SCSS do projeto sem caminhos relativos.

**Correto:**

```scss
@use 'styles/breakpoints' as bp;

@include bp.down(md) {
  .ui-sidebar { @apply fixed; }
}
```

**Proibido:**

```scss
/* ❌ nunca usar valores hardcoded */
@media (max-width: 767px) { ... }
@media (min-width: 1024px) { ... }
```

---

## 9. Diretrizes de Performance

### 9.1 Carregamento sob demanda

Componentes pesados, tabelas grandes, módulos visuais complexos e blocos de UI com alto custo de renderização devem usar `@defer`.

### 9.2 Listas e tabelas

Paginação é obrigatória para listas grandes.

Uma das seguintes abordagens deve ser adotada:

- paginação lógica com `@for`
- paginação controlada por um componente reutilizável
- virtualização quando o volume de dados justificar

### 9.3 Renderização eficiente

Evite:

- cálculos pesados diretamente em templates
- estruturas duplicadas sem abstração
- estado redundante
- reprocessamento desnecessário

---

## 10. Diretrizes de Segurança

### 10.1 Proteção contra XSS

Injetar conteúdo dinâmico com `innerHTML` sem sanitização explícita é proibido.

Sempre que possível, use renderização segura de texto. Quando HTML dinâmico for realmente necessário, o conteúdo deve passar por sanitização adequada.

### 10.2 Tipagem confiável e contratos

A segurança também depende de contratos tipados. Todo caminho de dados entre componente, serviço e template deve ser fortemente tipado.

### 10.3 Controle de conteúdo dinâmico

Qualquer conteúdo proveniente de API, entrada externa, CMS ou rich text deve ser tratado como dado potencialmente inseguro até ser devidamente validado.

---

## 11. Padrões de Código e Clean Code

### 11.1 Imports mínimos

Cada arquivo deve importar apenas o que é estritamente necessário.

Proibido:

- imports genéricos não utilizados
- dependências residuais em componentes
- agrupamentos desnecessários que prejudicam a legibilidade

### 11.2 Tipagem total

Toda variável criada deve ter tipagem adequada.

Modificadores de acesso explícitos também são obrigatórios:

- `public`
- `private`
- `protected`

Toda função deve declarar um tipo de retorno. Se não houver retorno, use `void`.

### 11.3 Clareza de nomenclatura

Nomes de classes, métodos, signals, propriedades e arquivos devem revelar intenção.

Nomes genéricos como os seguintes devem ser evitados:

- `data`
- `item`
- `obj`
- `list`
- `temp`

a menos que o contexto justifique claramente seu uso.

### 11.4 Organização da lógica

A lógica deve seguir uma estrutura previsível:

1. propriedades input/output
2. injeções
3. signals locais
4. propriedades públicas auxiliares
5. ciclo de vida
6. métodos públicos
7. métodos privados

### 11.5 Testes Unitários

Testes unitários **não são obrigatórios** neste projeto. A validação de comportamento é feita por meio de revisão de código, testes manuais e integração com o backend real. Não crie arquivos de teste unitário salvo instrução explícita.

---

## 12. Convenções de Estrutura de Pastas

A estrutura do projeto deve favorecer escalabilidade, manutenibilidade e compreensão rápida do domínio.

Estrutura base sugerida:

```text
src/app/
├── core/                 # infraestrutura transversal
│   ├── config/           # feature flags e constantes
│   ├── guards/           # guards de rota
│   ├── interceptors/     # interceptors HTTP
│   ├── services/         # serviços de infraestrutura
│   └── stores/           # estado compartilhado
├── features/             # uma pasta por área funcional
│   └── <feature>/
│       └── components/   # componentes exclusivos da feature
├── layout/               # casca da aplicação (sidebar, layout, navbar)
├── models/               # interfaces de domínio
├── services/             # serviços HTTP de domínio
└── shared/components/    # componentes reutilizados por 2+ features
```

### 12.3 Estrutura do Projeto

```text
src/
  styles/
    components/
      _alert.scss             ← .ui-alert, .ui-alert--danger, .ui-alert__message
      _badge.scss             ← .ui-badge, .ui-badge--*
      _button.scss            ← .ui-button, .ui-button--*
      _data-table.scss        ← .ui-data-table__*
      _form-field.scss        ← .input-field, .select-field, .toggle-field (BEM unificado para todos os campos)
      _page.scss              ← .ui-page, .ui-layout*, .ui-page-header* (wrapper, shell e cabeçalho de página)
      _progress.scss          ← .ui-progress, .ui-progress__*
      _select-list.scss       ← .ui-select-list, .ui-select-list__item
      _sidebar.scss           ← .ui-sidebar, .ui-sidebar--*, .ui-sidebar__*
      _typography.scss        ← .ui-text-*, .ui-link (--primary|--muted|--bold|--sm), .ui-stack
    _breakpoints.scss         ← mixins bp.up(), bp.down(), bp.between() — uso obrigatório para @media
    _index.scss               ← ponto de entrada dos estilos globais
    _reset.scss               ← resets globais (box-sizing, body, accent-color)
    _themes.scss              ← todos os design tokens (tema escuro)
  public/
    assets/
      logo.png                 ← logo horizontal completa (usada no sidebar expandido e na tela de login)
      logo-icon.png            ← ícone da logo (usada no sidebar colapsado e no painel de marca do login)
    favicon.ico
    favicon.svg
  environments/
    environment.ts
    environment.development.ts
  app/
    core/
      base/
        base-form-component.ts  ← classe base abstrata para páginas de formulário
        index.ts
      constants/
        api-routes.ts           ← ApiRoutes (endpoints de API REST — nunca strings brutas em path de serviços)
        app-routes.ts           ← AppRoutes (rotas do SPA — nunca strings brutas de caminho em .ts)
        messages.ts             ← Messages (validation, errors, domínios) — toda string de UI vai aqui
        permissions.ts          ← Permissions (codenames Django: app_label.action_model)
        storage.ts              ← StorageKeys, CryptoConfig (chaves e parâmetros de cripto do localStorage)
        index.ts
      models/
        auth.models.ts          ← UserSessionModel, AuthTokenModel, LoginCredentials
        index.ts
      guards/
        admin.guard.ts          ← adminGuard (rota exclusiva de superusuário)
        auth.guard.ts           ← authGuard (exige usuário autenticado)
        permission.guard.ts     ← permissionGuard (exige permissão via data.requiredPermission)
        index.ts
      interceptors/
        case-converter.interceptor.ts  ← conversão camelCase ↔ snake_case
        index.ts
      services/
        auth.service.ts         ← AuthService (login, logout, refresh, currentUser, hasPermission)
        auth-storage.service.ts ← token de acesso criptografado (AES-GCM); refresh token via HttpOnly cookie
        base.service.ts         ← BaseService<T> abstrata; path abstrato obrigatório nas subclasses
        user.service.ts         ← UserService (perfil do usuário autenticado)
        index.ts
      utils/
        case-converter.ts       ← deepToCamelCase, deepToSnakeCase (uso manual)
        date.ts                 ← formatChatTimestamp (formata ISO date para exibição relativa em pt-BR)
        object.ts               ← isDeepEqual
        index.ts
      validators/
        index.ts                ← validadores customizados (cpf, cnpj, ...)
    shared/
      components/
        badge/
          badge.component.ts
          badge.component.html
        button/
          button.component.ts
          button.component.html
        data-table/
          data-table.component.ts
          data-table.component.html
        forms/
          base-form-field.ts    ← classe base abstrata para campos de formulário
          input/
          select/
          toggle/
          index.ts
        page-header/
          page-header.component.ts
          page-header.component.html
        progress/
          progress.component.ts
          progress.component.html
        search-field/
          search-field.component.ts  ← campo de busca com debounce; 220px; usa <app-input size="sm">
        sidebar/
          sidebar.component.ts   ← host: { 'style': 'display: contents' }; estilos visuais em _sidebar.scss global
          sidebar.component.html
        index.ts                ← barrel de todos os componentes compartilhados
      directives/
        table-cell.directive.ts
        index.ts
      types/
        select-option.model.ts  ← interface SelectOption<T>
    features/
      auth/
        login/
          login.page.ts
          login.page.html
          login.page.scss
        services/
          auth.service.ts
      repertoire/
        repertoire.routes.ts    ← routes file da feature (padrão para features com múltiplas rotas)
        components/
        models/
        pages/
        services/
      dashboard/
    layout/                     ← componentes de estrutura de layout (shell, wrapper, etc.)
    app.routes.ts
    app.config.ts
```

Arquivos em kebab-case com sufixo de papel: `song-form.component.ts`, `band.store.ts`, `auth.guard.ts`, `song.model.ts`, `song.service.ts`.

Toda feature com mais de uma rota deve ter seu próprio `<feature>.routes.ts` na raiz da sua pasta. Esse arquivo é registrado no `app.routes.ts` via `loadChildren`:

```typescript
// app.routes.ts
{
  path: 'repertoire',
  loadChildren: () =>
    import('./features/repertoire/repertoire.routes').then((m) => m.REPERTOIRE_ROUTES),
}
```

**Path aliases configurados (tsconfig.json):**

| Alias | Aponta para |
|---|---|
| `@core/*` | `src/app/core/*` |
| `@shared/*` | `src/app/shared/*` |

**Configuração SCSS (angular.json):**

```json
"stylePreprocessorOptions": {
  "includePaths": ["src"]
}
```

Permite `@use 'styles/components/form-field' as field;` em qualquer arquivo SCSS sem caminhos relativos.

### 12.4 Comandos do Projeto

```bash
npm start           # dev server em localhost:4200
npm run build       # build de produção
ng generate component features/<feature>/<page>.page
```

1. A estrutura pode variar por domínio, mas deve preservar previsibilidade e clara separação de responsabilidades.
2. Na criação de novos componentes, seguir o padrão estrutural do Angular 21:

- Componente principal da feature:
  `src/app/features/<feature>/<feature>.component.ts`

- Pasta da feature:
  `src/app/features/<feature>/<feature>/`

- Componentes filhos (organizados por responsabilidade):
  `src/app/features/<feature>/components/<component-name>/<component-name>.component.ts`

Exemplos de variações comuns:

- Componente de item:
  `components/<entity>-item/<entity>-item.component.ts`

- Componente de listagem:
  `components/<entity>-list/<entity>-list.component.ts`

Diretrizes:

- Utilizar nomes descritivos e consistentes
- Separar componentes por responsabilidade (ex: list, item, form, modal)
- Evitar múltiplos componentes no mesmo diretório
- Em CRUDs, manter obrigatoriamente a separação entre componentes `list` e `detail`, conforme a seção 5.4

---

## 9. Testes

Substitui a regra anterior, que dizia não criar testes.

### 9.1 Backend — obrigatório

`sonic-stage-api/core/` mantém suíte de testes em arquivos `test*.py`, executada por `python manage.py test core`.

Toda correção de comportamento incorreto entra com um teste que **falha antes** e **passa depois**. Toda regra de autorização tem teste do caso negativo — o de quem não deveria ter acesso.

A suíte não pode regredir. Falhas pré-existentes conhecidas devem estar registradas para que uma regressão nova não se confunda com elas.

### 9.2 Frontend — sob demanda

Testes unitários de componente não são obrigatórios. São exigidos para lógica pura com regra de decisão: guards, funções de transformação e utilitários.

### 9.3 Verificação mínima antes de entregar

`ng build` compila sem erro, e `python manage.py check` passa.

---

## 10. Branch e Commit

### 10.1 Branch

Duas convenções coexistem, e isso é intencional:

- **Features conduzidas pelo Spec Kit** usam o nome gerado pelo comando (`035-fix-critical-security-bugs`). O número amarra a branch à pasta de especificação.
- **Trabalho fora do Spec Kit** usa `<tipo>/<nome-kebab>`, com tipo em `feature`, `fix`, `hotfix` ou `improve`.

### 10.2 Commit

Conventional Commits: `<tipo>: <descrição>`.

Tipos: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`.

Identificador de card é opcional — quando existir, `<tipo>(#ID): <descrição>`.

Commits não incluem segredos. Antes de commitar alteração de configuração, conferir que `.env` não entrou no diff.

---

## 11. Idioma dos Artefatos

**Todos os artefatos gerados pelo Spec Kit são escritos em Português Brasileiro:** `spec.md`, `plan.md`, `tasks.md`, `research.md`, `data-model.md`, `quickstart.md`, `contracts/*.md`, `checklists/*.md` e qualquer outro documento produzido pelos comandos `/speckit-*`.

Código-fonte, identificadores, variáveis e comentários técnicos podem permanecer em inglês quando seguirem a convenção da linguagem ou do framework. As palavras normativas MUST / MUST NOT / SHOULD nos requisitos seguem a RFC 2119 e permanecem em inglês.

---

## 12. Governança

### 15.1 Branches

O projeto é mantido por um único desenvolvedor: o trabalho é feito **diretamente na `main`**. Não é necessário criar branch para novas atividades, features ou specs. Branches são opcionais (por exemplo, para experimentos) e, quando usadas, não seguem padrão obrigatório.

### 15.2 Mensagens de Commit

Código que contraria esta constituição é corrigido ou a divergência é registrada no `plan.md` com justificativa, conforme o Princípio V. Ignorar em silêncio não é opção.

### 12.4 Bridge de contexto

`CLAUDE.md` na raiz e em cada projeto aponta para o plano da feature corrente, entre os marcadores `<!-- SPECKIT START -->` e `<!-- SPECKIT END -->`. Esses arquivos são mantidos pelos comandos do Spec Kit e não devem ser editados à mão.

---

## 13. Cláusula Final

Uma regra que não pode ser cumprida não protege nada — só ensina o time a ignorar o documento. Se uma seção desta constituição descrever ferramenta, biblioteca ou estrutura que o Sonic Stage não possui, isso é um defeito da constituição e deve ser corrigido aqui, não contornado no código.

Isso inclui, sem limitação:

- `spec.md` — especificação da feature
- `plan.md` — plano de implementação
- `tasks.md` — lista de tarefas
- `research.md` — pesquisa técnica
- `data-model.md` — modelo de dados
- `quickstart.md` — guia de início rápido
- `contracts/*.md` — contratos de interface
- `checklists/*.md` — checklists de qualidade
- Qualquer outro documento gerado por comandos do Spec Kit (`/speckit-specify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-checklist`, `/speckit-clarify`, etc.)

Código-fonte, identificadores, variáveis e comentários técnicos podem permanecer em inglês quando seguirem convenções da linguagem ou framework. O idioma pt-BR é obrigatório apenas para **conteúdo textual de documentação**.

---

## 17. Governança da Constituição

Esta constituição deve ser tratada como a principal referência para decisões frontend.

### 17.1 Aplicação

Aplica-se a:

- novos projetos
- manutenção evolutiva
- refatorações
- revisões técnicas
- definições de padrões do time
- onboarding de novos desenvolvedores

### 17.2 Alterações

Qualquer alteração nesta constituição deve:

1. ser formalmente documentada
2. justificar o impacto técnico e organizacional
3. preservar a compatibilidade com os princípios fundamentais
4. ser aprovada pela liderança técnica responsável

### 17.3 Não conformidade

Implementações fora deste padrão devem ser tratadas como dívida técnica ou exceção arquitetural formalmente justificada.

### 17.4 Fonte única de verdade — CLAUDE.md como bridge de contexto IA

Esta constituição (`constitution.md`) é a **única fonte de verdade** para diretrizes de desenvolvimento do projeto.

O arquivo `CLAUDE.md` na raiz do projeto é **o único arquivo autorizado** fora desta constituição. Sua função exclusiva é servir como contexto de bootstrap para o Claude Code (o agente de IA lê esse arquivo automaticamente no início de cada sessão). Ele deve permanecer **conciso** e dentro das seguintes restrições:

- **Nunca duplicar ou contradizer** regras desta constituição
- **Referenciar esta constituição** como autoridade em caso de dúvida
- Conter apenas: stack tecnológica essencial, localização da constituição, e lembretes de regras críticas que o agente precisa ter imediatos (ex.: registro de ícones, path aliases)

Toda regra de desenvolvimento **deve ser adicionada exclusivamente a esta constituição**. O `CLAUDE.md` não é o lugar para novas regras — é apenas um atalho de carregamento. Qualquer `CLAUDE.md` em subdiretórios do projeto continua **proibido**.

---

## 18. Cláusula Final

Todo desenvolvimento frontend da organização deve refletir esta constituição como um compromisso com qualidade, consistência, segurança, escalabilidade e identidade visual do Sonic Stage.

Na ausência de uma regra específica, deve prevalecer a decisão que melhor preserve:

- reuso
- legibilidade
- tipagem forte
- reatividade moderna
- segurança
- adesão ao Design System
- simplicidade arquitetural
