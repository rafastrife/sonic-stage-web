<!--
Sync Impact Report:
- Version change: 1.1.0 → 2.0.0
- List of modified principles:
  - Merged GovEasy full constitution into Sonic Stage constitution
- Added sections: All GovEasy sections (1 to 18)
- Removed sections: None
-->

# Sonic Stage Constitution (Full Framework Edition)

## Sonic Stage Specific Core Principles

### I. Architecture Separation
Frontend must reside in `sonic-stage-web` and Backend in `sonic-stage-api`. Logic, presentation, and persistence layers must maintain strict separation, avoiding overlap between frontend logic and backend services.

### II. Clean & Reusable Code
Always prioritize clean code patterns. Create highly reusable components and functions. Avoid duplication by generalizing common logic. Ensure maintainability through clear abstractions and modularity.

### III. Relational Persistence
PostgreSQL MUST be the database engine for persistence. All entity relationships (Bands, Users, Events, Repertoires) must leverage strict foreign keys and relational integrity to ensure data consistency.

### IV. Cross-Platform Consistency
Business rules must remain identical between Web and Mobile interfaces. Differences are permitted only in presentation, navigation, and amount of data displayed on a single view, never in logic constraints.

### V. Strict Business Domain Adherence
System behavior must strictly align with `regras/regras_negocio_sonic_stage.md`. This includes role-based access control, event types, status flows, and required fields.

## Technical Stack & Infrastructure

- **Database**: PostgreSQL
- **Frontend**: Web and Mobile environments inside `sonic-stage-web` (Angular 17+)
- **Backend**: API services inside `sonic-stage-api`
- **UI/UX Reference**: Must visually align with the `assets` folder mockups and provide premium experiences.
- **Export**: Must support PDF generation for Setlists with custom layouts.

---

# Constituição do Projeto Frontend

**Versão:** 1.9.0
**Data de Ratificação:** 2026-05-24
**Última Alteração:** 2026-05-26

## 1. Propósito

Esta constituição define os princípios, padrões técnicos, convenções de desenvolvimento e critérios de qualidade para todos os projetos frontend da organização. Seu objetivo é garantir consistência arquitetural, alta manutenibilidade, reuso de componentes, segurança e performance.

Deve orientar a construção, evolução e revisão de todo o código frontend, servindo como referência oficial para times de desenvolvimento, revisão técnica, onboarding e governança de projetos.

---

## 2. Princípios Fundamentais

Todo projeto frontend deve seguir estes princípios:

1. **Padronização acima da preferência pessoal**
   As decisões de arquitetura e implementação devem seguir este documento, evitando divergências entre módulos, telas e times.

2. **Reatividade nativa como base do estado**
   O gerenciamento de estado local deve utilizar a API reativa moderna do Angular, priorizando `signal()`, `computed()` e `effect()`.

3. **Reuso por padrão**
   Componentes, serviços, modelos e utilitários devem ser criados de forma genérica e reutilizável sempre que possível.

4. **Tipagem completa e explícita**
   Todo código TypeScript deve ter tipagem clara e 100% explícita, incluindo variáveis, parâmetros, tipos de retorno de funções e propriedades.

5. **Segurança e performance por design**
   Toda implementação deve considerar proteção contra XSS, carregamento eficiente, baixo acoplamento e escalabilidade.

6. **Consistência visual institucional**
   O frontend deve seguir os padrões visuais do GovEasy, respeitando o Design System, a paleta de cores e os componentes definidos em `docs/design-system.md`.

---

## 3. Diretrizes Obrigatórias de Arquitetura Angular

### 3.1 Standalone como padrão absoluto

A partir do Angular 19, `standalone: true` tornou-se o padrão implícito para componentes, diretivas e pipes. No Angular 21 (versão atual do projeto) essa é a arquitetura padrão e absoluta. **Não declare `standalone: true` explicitamente** — a propriedade é omitida por padrão e inclui-la é ruído desnecessário.

O uso de arquitetura baseada em `NgModule` para novas declarações de componentes é proibido, exceto em cenários de interoperabilidade legada previamente aprovados.

### 3.2 API moderna de input/output

O uso dos decoradores legados `@Input()` e `@Output()` é proibido.

Todo componente deve adotar o padrão baseado em funções:

```ts
public readonly item = input<ItemModel>();
public readonly changed = output<{ action: 'update' }>();
```

Este padrão é obrigatório para manter alinhamento com o modelo reativo moderno do Angular.

### 3.3 Injeção de dependência moderna

A injeção de dependência manual via construtor no formato tradicional é proibida:

```ts
constructor( private service: ExampleService;){
}
```

Toda dependência deve ser obtida com `inject()`:

```ts
private readonly router: Router = inject(Router);
private readonly service: ExampleService = inject(ExampleService);
```

O uso de `inject()` deve ser preferido nas propriedades da classe, preservando clareza e previsibilidade.

### 3.4 Fluxo de controle em templates

O uso do fluxo de controle nativo do Angular é obrigatório:

- `@if`
- `@else`
- `@for`
- `@switch`
- `@defer`

O uso dos seguintes é proibido:

- `*ngIf`
- `*ngFor`
- `*ngSwitch`

### 3.5 Estado local reativo

Todo estado local de componente deve ser implementado com:

- `signal()`
- `computed()`
- `effect()`

Observables podem existir quando necessários para integração HTTP, bibliotecas de terceiros ou fluxos assíncronos, mas o estado interno de UI deve ser normalizado para Signals sempre que aplicável.

### 3.6 Detecção de mudança — OnPush obrigatório

Todo componente deve declarar `changeDetection: ChangeDetectionStrategy.OnPush`.

A estratégia `Default` verifica o componente em cada ciclo de detecção do Angular, independentemente de haver mudança real. Com `OnPush`, a re-renderização ocorre apenas quando:

- um `input()` recebe novo valor por referência
- um `signal()` ou `computed()` lido no template muda de valor
- um evento DOM originado dentro do componente é disparado
- `ChangeDetectorRef.markForCheck()` é chamado explicitamente

Em projetos com Signals (como este), `OnPush` é a escolha natural e deve ser aplicado sem exceção:

```typescript
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,  // obrigatório
})
```

---

## 4. Estrutura de Modelos

### 4.1 Contrato base obrigatório

Todo modelo do sistema deve estender a interface `ModelBase`.

```ts
export interface ModelBase {
  id: number;
  createdAt: string;
  modifiedAt: string;
  active: boolean;
}
```

> **Por quê camelCase?** O `caseConverterInterceptor` converte automaticamente todas as respostas HTTP de snake_case → camelCase. O frontend trabalha **sempre** com camelCase — incluindo os campos do `ModelBase`. Nunca declare `created_at` ou `modified_at` em interfaces TypeScript.

### 4.2 Regra de definição de modelos

Todos os modelos devem ser definidos como `interface`.

Quando uma propriedade for expansível, relacional ou composta, pode utilizar um dos seguintes formatos:

- `number` para id
- `string` para url
- outra interface de modelo para modelo

E também criar uma função para o objeto quando houver outro modelo, usando o exemplo isDepartmentExpanded.

```ts
export interface DepartmentModel extends ModelBase {
  name: string;
}
```

```ts
export interface UserModel extends ModelBase {
  name: string;
  email: string;
  department: number | string | DepartmentModel;
}

export function isDepartmentExpanded(
  department: number | string | DepartmentModel,
): department is DepartmentModel {
  return typeof department === 'object' && department !== null;
}
```

Quando uma propriedade for um Choices, como uma escolha fixa, usar o enum para opções disponíveis.
Exemplo:

```ts
export enum Status {
  TO_DO = 1,
  DOING = 2,
  DONE = 3,
}

export interface TaskModel extends ModelBase {
  name: string;
  status: Status;
}
```

### 4.3 Convenções de nomenclatura

- Interfaces de domínio devem utilizar o sufixo `Model`.
- Interfaces auxiliares podem usar nomes sem esse sufixo apenas quando são DTOs internos estritamente justificáveis.
- Estruturas compartilhadas devem ser centralizadas por domínio.

---

## 5. Padrões de Componentização

### 5.1 Componentes genéricos e reutilizáveis

Todo componente deve ser projetado para reuso. Componentes não devem nascer excessivamente acoplados a uma única tela quando há potencial de reuso entre features.

Componentes reutilizáveis esperados incluem:

- cards
- tabelas
- filtros
- cabeçalhos de página
- formulários compostos
- modais
- paginadores
- estados vazios
- componentes de feedback visual

### 5.2 Separação de responsabilidades

Todo componente deve ter uma responsabilidade única e clara.

A divisão recomendada é:

- **Page Components:** composição e orquestração de tela
- **Feature Components:** componentes específicos de domínio
- **Shared Components:** componentes reutilizáveis globais
- **UI Components:** componentes visuais puros e genéricos

### 5.3 Comunicação entre componentes

A comunicação deve priorizar:

- `input()` para dados de entrada
- `output()` para eventos
- serviços compartilhados quando há estado de domínio ou coordenação entre múltiplos componentes

### 5.4 Padrão obrigatório para CRUDs

Todo CRUD deve ser estruturado, no mínimo, com dois componentes principais:

- um componente de `list`, responsável pela listagem e ações de navegação
- um componente de `detail`, responsável por criar, visualizar e editar o registro

O componente de `detail` deve ser implementado como formulário e reutilizado para os três estados de uso:

- criação
- visualização
- edição

As rotas devem seguir a convenção abaixo:

- `<entidade>/create`: modo de criação
- `<entidade>/:id`: modo de edição

Quando a necessidade for apenas visualização, o mesmo componente `detail` deve ser reutilizado, variando o estado da tela conforme a regra de negócio, sem criar um terceiro componente exclusivo para `view`.

---

### 5.5 Padrão de Navegação Lateral (Sidebar)

Todo recurso que precisa aparecer no menu lateral DEVE ser registrado adicionando uma entrada no array `navItems` em `sidebar.component.ts`.

```ts
public readonly navItems: NavItem[] = [
  { route: '/home',         icon: 'home',   label: 'Home',   permission: null },
  { route: '/courses',      icon: 'school', label: 'Cursos', permission: 'education.view_course' },
  // ↓ novo recurso
  { route: '/novo-recurso', icon: 'icone',  label: 'Nome',   permission: 'app_label.view_model' },
];
```

Regras inegociáveis:

- `permission: null` → item sempre visível; uso exclusivo de rotas de acesso geral (ex.: Home)
- `permission: 'app_label.view_model'` → item visível somente se o JWT do usuário contiver essa permissão
- O formato da permissão segue o padrão Django: `<app_label>.view_<model>`
- Nenhuma outra mudança é necessária no frontend — o template já itera `navItems` e aplica
  `@if (isVisible(item))` automaticamente

### 5.6 Catálogo de Componentes Compartilhados

O projeto dispõe dos seguintes componentes prontos para uso, todos exportados via `@shared/components`. **Reutilize antes de criar** — qualquer novo componente com potencial de reuso deve seguir o mesmo contrato e ser adicionado a este catálogo.

| Componente | Seletor | Localização | Principais inputs |
|---|---|---|---|
| `BadgeComponent` | `<app-badge>` | `shared/components/badge/` | `variant` (`info`\|`success`\|`danger`\|`warning`\|`neutral`), `shape` (`square`\|`pill`) — texto via `<ng-content>` |
| `ButtonComponent` | `<app-button>` | `shared/components/button/` | `variant`, `size`, `type`, `disabled`, `loading`, `full`, `iconLeft`, `iconRight` |
| `DataTableComponent` | `<app-data-table>` | `shared/components/data-table/` | `columns` (required), `rows` (required), `total`, `hasPrevious`, `hasNext`, `recordLabel` — outputs: `previousPage`, `nextPage` |
| `PageHeaderComponent` | `<app-page-header>` | `shared/components/page-header/` | `title` (required), `subtitle` |
| `ProgressComponent` | `<app-progress>` | `shared/components/progress/` | `value`, `max`, `variant`, `size`, `label`, `stepLabel`, `indeterminate` |
| `SearchFieldComponent` | `<app-search-field>` | `shared/components/search-field/` | `placeholder` (padrão `'Buscar...'`), `debounceMs` (padrão `300`) — output: `search` emite `string` após o debounce; largura fixa de 220px. **Use em toda tela que precise de campo de busca** — não crie campos de busca ad-hoc. |

**Diretivas compartilhadas:**

| Diretiva | Seletor | Uso |
|---|---|---|
| `TableCellDirective` | `[appTableCell]="'coluna'"` | Define template customizado para célula em `<app-data-table>` |

**Padrão de variantes via `computed()`:**

Componentes de UI com variantes computam dinamicamente as classes CSS a partir dos `input()`:

```typescript
protected readonly hostClasses = computed<string>(() => {
  return [
    'ui-button',
    `ui-button--${this.variant()}`,
    `ui-button--${this.size()}`,
    this.loading() ? 'ui-button--loading' : '',
  ].filter(Boolean).join(' ');
});
```

```html
<button [class]="hostClasses()">...</button>
```

Todo novo componente com variantes deve seguir este padrão — nunca usar `[ngClass]` com lógica inline no template.

---

## 6. Padrões de Serviço

### 6.1 BaseService obrigatório

Todos os serviços HTTP devem usar `BaseService` como diretriz base, conforme definido em:

`@.claude/skills/base-service/SKILL.md`

A classe `BaseService<T>` é `abstract` — subclasses declaram `protected readonly path: string` diretamente, sem o modificador `override` (por ser implementação de propriedade abstrata).

Isso significa que nenhum serviço de acesso a dados deve implementar chamadas HTTP de forma dispersa ou sem adesão ao padrão central compartilhado.

### 6.2 Responsabilidades dos serviços

Os serviços devem:

- encapsular o acesso à API
- centralizar a transformação de payload quando necessário
- evitar lógica visual
- manter contratos claros e tipados
- respeitar o modelo de domínio

### 6.3 Nomenclatura

Os serviços devem usar nomes explícitos orientados ao domínio, por exemplo:

- `UserService`
- `ProjectService`
- `PermissionService`

### 6.4 Interceptores HTTP

Os interceptores ficam em `src/app/core/interceptors/` e são funções do tipo `HttpInterceptorFn` (padrão funcional do Angular 15+).

**Interceptor ativo: `caseConverterInterceptor`**

Localização: `src/app/core/interceptors/case-converter.interceptor.ts`

Converte automaticamente e de forma transparente o casing entre frontend e backend:

- **Requisições (outgoing):** camelCase → snake_case antes de enviar ao servidor
- **Respostas (incoming):** snake_case → camelCase ao receber do servidor
- Não atua em `FormData`, `Blob` ou `ArrayBuffer` — apenas em objetos JSON serializáveis

**Regras obrigatórias:**

- O frontend usa **sempre** camelCase — a conversão é automática e não deve ser feita manualmente
- **Nunca** chamar `deepToSnakeCase()` ou `deepToCamelCase()` em payloads de request/response — o interceptor já cobre esse passo
- Em casos excepcionais fora do ciclo HTTP (ex.: dados locais, WebSocket), as funções `deepToSnakeCase()` / `deepToCamelCase()` de `@core/utils` podem ser usadas diretamente
- O interceptor é registrado em `app.config.ts` via `withInterceptors([caseConverterInterceptor])`

**Ao criar um novo interceptor:**

1. Criar arquivo em `src/app/core/interceptors/<nome>.interceptor.ts`
2. Usar o tipo `HttpInterceptorFn` (nunca a classe `HttpInterceptor` legada)
3. Registrar no array `withInterceptors([...])` em `app.config.ts`
4. Exportar via barrel `src/app/core/interceptors/index.ts`

### 6.5 Proibição de override desnecessário em subclasses de `BaseService`

Sobrescrever (`override`) um método herdado de `BaseService` é permitido **apenas quando** a implementação da classe base não satisfaz a necessidade — ou seja, quando o filho precisa adicionar, alterar ou restringir comportamento.

**É proibido** fazer override cujo corpo seja idêntico (ou funcionalmente equivalente) ao da classe base. Esse padrão não agrega valor e cria ruído, falsa sensação de customização e risco de dessincronização futura caso a base evolua.

**Proibido — override que não acrescenta nada:**

```typescript
// ❌ body idêntico ao da BaseService
override getAll(): Observable<UserModel[]> {
  return this.http.get<UserModel[]>(this.endpoint);
}
```

**Correto — sem override (herança direta):**

```typescript
// ✅ simplesmente não declarar o método; a base já provê
export class UserService extends BaseService<UserModel> {
  protected readonly path = ApiRoutes.USERS.ROOT;
}
```

**Correto — override com lógica adicional justificada:**

```typescript
// ✅ adiciona parâmetro de query específico do domínio
override getAll(active?: boolean): Observable<UserModel[]> {
  const params = active !== undefined ? { active } : {};
  return this.http.get<UserModel[]>(this.endpoint, { params });
}
```

**Regra de decisão:** antes de escrever `override`, verifique se o comportamento desejado já é entregue pela base. Se sim, delete o método — a herança resolve.

---

### 6.6 Constantes centralizadas — proibição de strings literais em arquivos `.ts`

Strings de configuração como rotas SPA, endpoints de API, chaves de storage e codenames de permissão **nunca devem aparecer como literais** em código TypeScript. Todo valor recorrente ou compartilhado deve ser centralizado em `src/app/core/constants/` e importado via `@core/constants`.

**Constantes disponíveis:**

| Constante | Uso obrigatório |
|---|---|
| `AppRoutes` | Rotas do SPA — `router.navigate([AppRoutes.DASHBOARD])`, `canActivate` redirects |
| `ApiRoutes` | Endpoints de API — `protected readonly path = ApiRoutes.USERS.ROOT` |
| `Permissions` | Codenames Django — `data: { requiredPermission: Permissions.USERS.VIEW }` |
| `StorageKeys` | Chaves do `localStorage` — `localStorage.getItem(StorageKeys.ACCESS_TOKEN)` |
| `CryptoConfig` | Parâmetros de cripto (salt, iterações PBKDF2) — usados por `AuthStorageService` |
| `Messages` | Strings de mensagem de UI — `this.toastr.success(Messages.users.created)` |

**Correto:**
```typescript
this.router.navigate([AppRoutes.DASHBOARD]);
protected readonly path = ApiRoutes.USERS.ROOT;
data: { requiredPermission: Permissions.USERS.VIEW }
```

**Proibido:**
```typescript
this.router.navigate(['/dashboard']);          // ❌ string bruta de rota
protected readonly path = 'users/';           // ❌ string bruta de endpoint
data: { requiredPermission: 'auth.view_user' } // ❌ string bruta de permissão
```

Ao adicionar novos domínios, inserir as chaves no arquivo correspondente em `src/app/core/constants/` e reexportar via barrel.

---

### 6.7 Autenticação e Autorização

**AuthService** (`src/app/core/services/auth.service.ts`):

| Membro | Tipo | Descrição |
|---|---|---|
| `currentUser` | `WritableSignal<UserSessionModel \| null>` | Usuário decodificado do JWT; `null` se não autenticado |
| `isAuthenticated` | `Signal<boolean>` | `true` quando `currentUser !== null` |
| `hasPermission(perm)` | `Signal<boolean>` | `true` se JWT contém `perm`; superusuário retorna `true` para qualquer permissão |

**Guards disponíveis (exportados via `@core/guards`):**

| Guard | `canActivate` em | Redireciona para |
|---|---|---|
| `authGuard` | Qualquer rota protegida | `AppRoutes.LOGIN` se não autenticado |
| `permissionGuard` | Rota com `data.requiredPermission` | `data.permissionRedirectTo` ou `AppRoutes.DASHBOARD` |
| `adminGuard` | Rota exclusiva de superusuário | `AppRoutes.DASHBOARD` se não for superuser |

**Padrão de uso no roteador:**
```typescript
{
  path: 'users',
  loadChildren: ...,
  canActivate: [permissionGuard],
  data: { requiredPermission: Permissions.USERS.VIEW },
}
```

**`SKIP_AUTH_INTERCEPTOR`** — token `HttpContextToken<boolean>` exportado de `auth.service.ts`. Use para requisições que não devem receber o header `Authorization` (login, logout, refresh):
```typescript
import { SKIP_AUTH_INTERCEPTOR } from '@core/services';

this.http.post(url, body, {
  context: new HttpContext().set(SKIP_AUTH_INTERCEPTOR, true),
});
```

---

## 7. Padrões de Formulário

### 7.1 Abordagem obrigatória

Todos os formulários devem usar **Signal Forms** do Angular 21 (`@angular/forms`).

O uso de `ReactiveFormsModule`, `FormBuilder`, `FormGroup` clássico ou formulários orientados a template é proibido.

### 7.2 Estrutura de implementação

Os formulários são criados com um signal de modelo de dados e uma field tree gerada pela função `form()`:

```typescript
import { form, required, minLength, email, validate } from '@angular/forms/signals';
import { signal } from '@angular/core';

interface LoginData {
  email: string;
  password: string;
}

const loginModel = signal<LoginData>({ email: '', password: '' });
const loginForm = form(loginModel, (s) => {
  required(s.email, { message: 'E-mail obrigatório' });
  email(s.email);
  required(s.password, { message: 'Senha obrigatória' });
  minLength(s.password, 8);
});
```

No template, use a diretiva `[formField]` para binding bidirecional automático:

```html
<input type="email" [formField]="loginForm.email" />
<input type="password" [formField]="loginForm.password" />
```

Para ler ou escrever um valor reativamente no componente:

```typescript
// Leitura reativa
const email = loginForm.email().value();

// Escrita
loginForm.email().value.set('novo@email.com');
```

### 7.3 Validação e feedback

Declare todos os validadores no schema passado ao `form()`.

**Validators built-in disponíveis:**

| Validator | Parâmetros extras | Uso |
|---|---|---|
| `required(path, opts?)` | `{message?, when?}` | Campo obrigatório (vazio = `null` ou string vazia) |
| `email(path, opts?)` | `{message?, when?}` | Formato de e-mail |
| `minLength(path, n, opts?)` | `n`, `{message?, when?}` | Comprimento mínimo de string ou array |
| `maxLength(path, n, opts?)` | `n`, `{message?, when?}` | Comprimento máximo de string ou array |
| `min(path, n, opts?)` | `n`, `{message?, when?}` | Valor numérico mínimo |
| `max(path, n, opts?)` | `n`, `{message?, when?}` | Valor numérico máximo |
| `pattern(path, regex, opts?)` | `regex`, `{message?, when?}` | Expressão regular |

**Validação condicional — opção `when`:**

Todo built-in aceita `{ when }` para aplicar a regra somente quando uma condição for verdadeira. O callback recebe `{valueOf}` para ler outros campos, e pode referenciar signals externos diretamente:

```typescript
// Condicional baseado em outro campo do form
required(s.promoCode, {
  when: ({ valueOf }) => valueOf(s.applyDiscount),
});

// Condicional baseado em signal externo (ex.: modo de criação vs. edição)
required(s.password, {
  when: () => !this.isEditMode(),
});
```

> **Regra obrigatória:** nunca use verificações manuais (`if (!field.trim())`) em `handleSubmit()` para impor obrigatoriedade contextual — use `required` com `when`.

**Estados de campo disponíveis no template:**

- `valid()` — validação passou
- `invalid()` — validação falhou
- `touched()` — usuário interagiu com o campo
- `dirty()` — valor foi alterado
- `errors()` — array de erros `{ kind: string, message: string }`
- `pending()` — validação assíncrona em andamento

**Padrão de exibição (componentes customizados):**

```html
@if (form.email().touched() && form.email().invalid()) {
  @for (error of form.email().errors(); track error) {
    <span>{{ error.message }}</span>
  }
}
```

Os componentes `<app-input>`, `<app-select>` e `<app-toggle>` exibem o primeiro erro automaticamente via `[formField]` — o padrão acima só é necessário em campos fora desses componentes.

A validação deve cobrir:

- campos obrigatórios
- comprimento mínimo/máximo
- formato
- consistência de negócio

### 7.4 Componentes de campo reutilizáveis

O projeto dispõe de três componentes de campo prontos para uso, todos localizados em `src/app/shared/components/forms/` e derivados de `BaseFormFieldComponent`. O uso direto desses componentes é obrigatório — não crie campos de formulário ad-hoc em páginas.

| Seletor | Arquivo | Implementa |
|---|---|---|
| `<app-input>` | `forms/input/` | `FormValueControl<string>` |
| `<app-select>` | `forms/select/` | `FormValueControl<string>` |
| `<app-toggle>` | `forms/toggle/` | `FormCheckboxControl` |

**Inputs comuns (herdados de `BaseFormFieldComponent`):**

- `[formField]` — diretiva do Signal Forms que conecta o campo ao schema (binding automático de `value`/`checked`, `invalid`, `errors`, `touched`, etc.)
- `label` — rótulo textual
- `hint` — texto de ajuda (ocultado quando há erro)
- `serverError` — mensagem de erro vinda da API (exibida separadamente)
- `name` — atributo HTML `name` do input

**Inputs específicos:**

- `<app-input>`: `type`, `placeholder`, `autocomplete`, `iconLeft` (nome do ícone Lucide em kebab-case), `size` (`'sm'` | `'md'` padrão | `'lg'`) — suporta toggle de senha automático quando `type="password"`
- `<app-select>`: `options: SelectOption[]` — interface `SelectOption<T>` em `src/app/shared/types/select-option.model.ts`
- `<app-toggle>`: nenhum extra — usa `checked` como model bidirecional

**Feedback de validação automático:**

Os componentes exibem automaticamente a primeira mensagem de erro após o campo ser tocado (`touched`). As mensagens padrão por `kind` são definidas em `Messages.validation` (`@core/constants`):

| `kind` | Mensagem padrão |
|---|---|
| `required` | Campo obrigatório. |
| `email` | Informe um e-mail válido. |
| `cpf` | Informe um CPF válido. |
| `cnpj` | Informe um CNPJ válido. |

Passar `{ message }` no validador só é necessário para sobrescrever casos excepcionais.

**Exemplo de uso:**

```html
<app-input
  [formField]="form.email"
  label="E-mail"
  type="email"
  placeholder="seu@email.com"
/>

<app-select
  [formField]="form.role"
  label="Perfil"
  [options]="roleOptions"
/>

<app-toggle
  [formField]="form.active"
  label="Ativo"
/>
```

---

### 7.5 Validadores customizados

Validadores específicos de negócio ficam em `src/app/core/validators/index.ts` e seguem a mesma assinatura dos built-ins do Signal Forms (recebem o path do schema + `options?`). Retornam `null` para campo vazio — a obrigatoriedade fica a cargo de `required()`.

Validadores disponíveis:

| Função | `kind` | Validação |
|---|---|---|
| `cpf(path, options?)` | `'cpf'` | CPF brasileiro (11 dígitos, dígitos verificadores) |
| `cnpj(path, options?)` | `'cnpj'` | CNPJ brasileiro (14 dígitos, dígitos verificadores) |

**Uso:**

```typescript
import { cpf, cnpj } from '@core/validators';

const form = form(model, (s) => {
  required(s.cpf);
  cpf(s.cpf);                          // mensagem padrão via Messages.validation
  cnpj(s.cnpj, { message: 'CNPJ inválido para este convênio' }); // mensagem custom
});
```

Novos validadores de domínio devem ser adicionados nesse mesmo arquivo, seguindo o mesmo contrato.

**Criando um validador reutilizável:**

Encapsule `validate()` em uma função com a mesma assinatura dos built-ins e adicione em `src/app/core/validators/index.ts`:

```typescript
import { validate } from '@angular/forms/signals';

export function url(path: SchemaPath<string>, options?: { message?: string }): void {
  validate(path, ({ value }) => {
    try {
      new URL(value());
      return null;
    } catch {
      return { kind: 'url', message: options?.message ?? 'Informe uma URL válida.' };
    }
  });
}
```

**Validação inline com `validate()`:**

Para regras únicas de negócio que não justificam extração:

```typescript
import { validate } from '@angular/forms/signals';

validate(s.website, ({ value }) => {
  if (!value().startsWith('https://')) {
    return { kind: 'https', message: 'A URL deve iniciar com https://.' };
  }
  return null;
});
```

**Validação cruzada entre campos com `valueOf()`:**

Use `valueOf()` dentro do callback para acessar o valor de outro campo. Este é o padrão obrigatório para confirmação de senha e regras de dependência:

```typescript
validate(s.confirmPassword, ({ valueOf }) => {
  if (this.isEditMode()) return null;
  return valueOf(s.confirmPassword) !== valueOf(s.password)
    ? { kind: 'mismatch', message: 'As senhas não coincidem.' }
    : null;
});
```

**Múltiplos campos com `validateTree()`:**

Quando a regra envolve vários campos e não pertence a um campo específico (ex.: intervalo de datas):

```typescript
import { validateTree } from '@angular/forms/signals';

validateTree(s, (ctx) => {
  if (ctx.valueOf(s.endDate) <= ctx.valueOf(s.startDate)) {
    return { kind: 'dateRange', message: 'A data de fim deve ser posterior à de início.' };
  }
  return null;
});
```

**Validação de arrays com `applyEach()`:**

```typescript
import { applyEach } from '@angular/forms/signals';

applyEach(s.items, (item) => {
  required(item.name);
  min(item.quantity, 1);
});
```

**Validação assíncrona com `validateHttp()`:**

Para verificações server-side como unicidade de e-mail ou username. Só roda após todas as regras síncronas passarem:

```typescript
import { validateHttp } from '@angular/forms/signals';

validateHttp(s.email, {
  request: ({ value }) => `/api/check-email?email=${value()}`,
  onSuccess: (response) =>
    response.taken ? { kind: 'emailTaken', message: 'E-mail já cadastrado.' } : null,
  onError: () => ({ kind: 'networkError', message: 'Não foi possível verificar o e-mail.' }),
});
```

Use `field.pending()` no template para indicar o carregamento da verificação assíncrona.

**Validação com schema externo (`validateStandardSchema()`):**

Para projetos que adotam Zod ou Valibot como fonte de validação centralizada:

```typescript
import * as z from 'zod';
import { validateStandardSchema } from '@angular/forms/signals';

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

const loginForm = form(model, (s) => validateStandardSchema(s, schema));
```

Schemas dinâmicos (que mudam com base em outros campos) podem ser passados como signal via `computed()`.

---

### 7.6 Atributo `novalidate` obrigatório na tag `<form>`

Todo elemento `<form>` no template deve conter o atributo `novalidate`. Isso desativa a validação nativa do HTML5, que pode conflitar com o ciclo de validação do Signal Forms e produzir comportamentos inconsistentes (ex.: tooltips do browser, bloqueios de submit antes que o Signal Forms possa intervir).

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

### 8.2 Sistema de Design — obrigatório via Figma MCP

Todas as implementações de front-end devem seguir **exclusivamente** os tokens e diretrizes do **Sistema de Design**, sendo esta a única fonte de verdade para cores, tipografia, espaçamento e estilo de componentes.
Ao criar ou modificar qualquer componente, página ou elemento visual, é **obrigatório** consultar o **Figma MCP** (`mcp__figma__get_figma_data`) para obter as especificações visuais em tempo real, garantindo conformidade com tokens semânticos, estados interativos e suporte completo a light/dark mode.

**Fontes oficiais (em ordem de precedência):**

1. **Figma MCP** (`mcp__figma__get_figma_data`, arquivo `penFRXwrSPVvVtEOcGhMch`) — especificações visuais em tempo real diretamente do Figma
2. `src/styles/_themes.scss` — implementação via CSS custom properties

**Regras inegociáveis:**

- Utilizar apenas **tokens semânticos** — nunca valores hardcoded (hex, rgb, px) quando houver equivalente
- Não usar condicionais manuais de tema (`theme === "dark" ? ... : ...`)
- Todos os componentes interativos devem conter estados: `default`, `hover`, `active`, `focus-visible`, `disabled`
- O estado `focus-visible` deve sempre utilizar `border/focus` como outline (acessibilidade obrigatória)
- Suporte a **light mode e dark mode é obrigatório** e deve ser validado
- Ao criar componentes, usar como classe base `src/styles/components`.

Componentes compartilhados como `Card`, `DataTable`, `Button`, `Input`, `Alert`, `Dashboard`, `Sidenav` e similares devem respeitar integralmente a identidade visual institucional definida nesses tokens.

---

### 8.3 Paleta de Tokens Semânticos

O sistema utiliza tokens semânticos que se adaptam automaticamente entre temas claro e escuro. Nunca utilizar valores diretos quando houver token correspondente.

A identidade visual do GovEasy é governamental: **azul institucional** (`#0f2d80`) como cor de marca/navegação e **verde de ação** (`#009c3b`) como cor primária de CTA.

**Tokens de interação (light → dark):**

- `interactive/primary/default`: `#009c3b` (verde — botões primários, links, confirmações)
- `interactive/primary/hover`: `#007a2e` → `#00c44a`
- `interactive/primary/on`: `#ffffff` (texto sobre fundo primário)
- `interactive/primary/subtle`: `#f0fdf4` → `rgba(0,156,59,0.15)`
- `interactive/secondary/default`: `#0f2d80` → `rgba(255,255,255,0.12)` (azul — navegação, botões secundários)
- `interactive/secondary/hover`: `#1a3d99` → `rgba(255,255,255,0.18)`
- `interactive/secondary/on`: `#ffffff` → `rgba(255,255,255,0.95)`
- `interactive/accent/default`: `#0f2d80` → `#4d6ecc`

**Tokens de superfície e conteúdo (light → dark):**

- `bg/base`: `#ffffff` → `#111318`
- `bg/subtle`: `#f8f9fa` → `#1c2128`
- `surface/default`: `#ffffff` → `#0d1117`
- `surface/raised`: `#ffffff` → `#161b22`
- `content/primary`: `#212529` → `rgba(255,255,255,0.95)`
- `content/secondary`: `#495057` → `rgba(255,255,255,0.65)`
- `content/tertiary`: `#6c757d` → `rgba(255,255,255,0.40)`
- `border/default`: `#dee2e6` → `rgba(255,255,255,0.10)`
- `border/focus`: `#009c3b` (ambos os temas — acessibilidade)
- `link/default`: `#009c3b` → `#00c44a`

**Tokens de status (light → dark):**

- `status/success`: bg `#f0fdf4`, content `#009c3b` → `#00c44a`
- `status/warning`: bg `#fef3c7`, content `#d97706` → `#fbbf24`
- `status/danger`: bg `#fee2e2`, content `#ef4444` → `#f87171`
- `status/info`: bg `#eff6ff`, content `#0f2d80` → `#7b9dea`

**Tipografia:**

- **Fonte primária:** Inter (interface geral, formulários, navegação)
- **Fonte secundária:** DM Sans (tabelas, dados, dashboards)
- **Base de corpo:** `font/size/base` = 14px · escala: `xs`=10 · `sm`=12 · `md`=13 · `base`=14 · `lg`=17 · `xl`=18 · `2xl`=28 · `3xl`=30 · `4xl`=36

**Tokens de espaçamento (`--space-*`):**

| Token | Valor | Uso típico |
| --------------- | ----- | ----------------------------------------- |
| `--space-1` | 4px | micro espaçamento, gaps mínimos |
| `--space-2` | 8px | espaçamento interno compacto |
| `--space-3` | 12px | padding de elementos pequenos |
| `--space-4` | 16px | padding padrão de componentes |
| `--space-5` | 20px | espaçamento entre grupos |
| `--space-6` | 24px | seções internas de cards/forms |
| `--space-8` | 32px | separação de blocos |
| `--space-10` | 40px | padding de seções de página |
| `--space-12` | 48px | espaçamento entre seções grandes |
| `--space-16` | 64px | espaçamento de layout |
| `--space-20` | 80px | margens de seção |

**Tokens de radius (`--radius-*`):**

| Token | Valor | Uso típico |
| -------------- | ------ | ---------------------------------- |
| `--radius-xs` | 4px | badges, chips |
| `--radius-sm` | 6px | botões |
| `--radius-md` | 8px | cards, painéis, selects |
| `--radius-input` | 10px | inputs padrão (md/lg) |
| `--radius-lg` | 12px | modais, drawers |
| `--radius-xl` | 14px | inputs large, elementos de destaque |
| `--radius-full` | 9999px | avatares, pílulas, toggles |

**Tokens de tipografia:**

| Token | Valor | Uso típico |
| ----------------------- | ----- | -------------------------------- |
| `--font-size-xs` | 10px | rótulos auxiliares |
| `--font-size-sm` | 12px | legendas, metadados |
| `--font-size-md` | 13px | texto secundário |
| `--font-size-base` | 14px | texto padrão de interface |
| `--font-size-lg` | 17px | subtítulos, destaques |
| `--font-size-xl` | 18px | títulos de seção |
| `--font-size-2xl` | 28px | títulos de página |
| `--font-weight-regular` | 400 | texto corrido |
| `--font-weight-medium` | 500 | labels, navegação |
| `--font-weight-semibold` | 600 | cabeçalhos, rótulos importantes |
| `--font-weight-bold` | 700 | títulos, ênfase |

**Tokens de sombra (`--shadow-*`):**

- `--shadow-sm` — elevação sutil (hover de linha de tabela)
- `--shadow-md` — cards e painéis padrão
- `--shadow-lg` — modais, dropdowns, popovers

Para a lista completa de tokens atualizada, consultar o Figma MCP (`mcp__figma__get_figma_data`) ou `src/styles/_themes.scss`.

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
- [ ] Light/dark mode validados

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
src/
  app/
    core/
      guards/
      interceptors/
      services/
      tokens/
      utils/
    shared/
      components/
      directives/
      pipes/
      models/
      services/
    features/
      users/
        components/
        pages/
        services/
        models/
        utils/
      projects/
        components/
        pages/
        services/
        models/
        utils/
```

### 12.3 Estrutura do Projeto GovEasy

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
    _themes.scss              ← todos os design tokens (light/dark)
  public/
    assets/
      logo-goveasy.png         ← logo horizontal completa (usada no sidebar expandido e na tela de login)
      logo-goveasy-icon.png    ← ícone da logo (usada no sidebar colapsado e no painel de marca do login)
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
      automagov/
        automagov.routes.ts     ← routes file da feature (padrão para features com múltiplas rotas)
        components/
        models/
        pages/
        services/
      dashboard/
    layout/                     ← componentes de estrutura de layout (shell, wrapper, etc.)
    app.routes.ts
    app.config.ts
```

**Routes file por feature:**

Toda feature com mais de uma rota deve ter seu próprio `<feature>.routes.ts` na raiz da sua pasta. Esse arquivo é registrado no `app.routes.ts` via `loadChildren`:

```typescript
// app.routes.ts
{
  path: 'automagov',
  loadChildren: () =>
    import('./features/automagov/automagov.routes').then((m) => m.AUTOMAGOV_ROUTES),
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

### 12.5 Path Aliases — Imports por alias

O projeto configura path aliases no `tsconfig.json` para evitar caminhos relativos longos e tornar os imports legíveis e independentes de localização.

**Aliases disponíveis:**

| Alias | Aponta para |
|---|---|
| `@core/*` | `src/app/core/*` |
| `@shared/*` | `src/app/shared/*` |

**Correto — usar alias:**

```typescript
import { BaseFormComponent } from '@core/base';
import { InputComponent } from '@shared/components';
import { cpf } from '@core/validators';
import { isDeepEqual } from '@core/utils';
```

**Proibido — caminhos relativos profundos:**

```typescript
// ❌ nunca usar quando existe alias equivalente
import { BaseFormComponent } from '../../../core/base/base-form-component';
import { InputComponent } from '../../shared/components/forms/input/input.component';
```

**Regra:** caminhos relativos com mais de um nível (`../`) são proibidos quando o destino está coberto por um alias. Caminhos relativos de primeiro nível (`./`) dentro da própria pasta são permitidos.

---

### 12.6 Barrel Files — index.ts

Todo conjunto lógico de arquivos que será importado por outros módulos deve expor um `index.ts` que centraliza os exports públicos. Isso desacopla os importadores da estrutura interna da pasta.

**Padrão obrigatório:**

```
src/app/core/utils/
  object.ts        ← implementação interna
  index.ts         ← export { isDeepEqual } from './object';
```

**Uso:**

```typescript
// Correto — via barrel (preferido)
import { isDeepEqual } from '@core/utils';

// Correto — import direto quando pasta não tem barrel ainda
import { isDeepEqual } from '@core/utils/object';
```

**Barrels existentes:**

| Barrel | O que exporta |
|---|---|
| `@core/base` | `BaseFormComponent` |
| `@core/constants` | `Messages`, `AppRoutes`, `ApiRoutes`, `Permissions`, `StorageKeys`, `CryptoConfig` |
| `@core/models` | `UserSessionModel`, `AuthTokenModel`, `LoginCredentials` |
| `@core/guards` | `authGuard`, `adminGuard`, `permissionGuard` |
| `@core/interceptors` | `caseConverterInterceptor` |
| `@core/utils` | `isDeepEqual`, `deepToCamelCase`, `deepToSnakeCase`, `formatChatTimestamp` |
| `@core/validators` | `cpf`, `cnpj`, `ValidatorOptions` |
| `@shared/components` | `BadgeComponent`, `ButtonComponent`, `DataTableComponent`, `PageHeaderComponent`, `ProgressComponent`, `SearchFieldComponent` e tipos exportados |
| `@shared/components/forms` | `InputComponent`, `SelectComponent`, `ToggleComponent` |
| `@shared/directives` | `TableCellDirective` |

**Regras:**

- Ao criar uma nova pasta com dois ou mais arquivos de exportação pública, criar `index.ts` imediatamente.
- O barrel exporta apenas o que é público — tipos e funções internas não são re-exportados.
- Preferir `export { X } from './arquivo'` a `export * from './arquivo'` quando nem tudo no arquivo é público.
- O `index.ts` não contém lógica — é exclusivamente re-export.
- **Componentes individuais** (`shared/components/<nome>/`) **não têm** `index.ts` próprio. Todos os exports passam pelo `shared/components/index.ts`.
- **Diretivas** ficam em `src/app/shared/directives/`, exportadas via `shared/directives/index.ts`.

---

## 13. Exemplo de Referência Técnica

```ts
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

import { UserModel } from '../models/user.model';
import { SelectedFilterModel } from '../models/selected-filter.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-example',
  imports: [],
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleComponent implements OnInit {
  readonly user = input<UserModel>();
  readonly emitUpdate = output<{ action: 'change' }>();

  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  readonly selectedFilters = signal<SelectedFilterModel[]>([]);
  readonly totalItems = computed(() => this.items().length);
  private readonly items = signal<string[]>([]);

  ngOnInit(): void {
    this.loadItems();
  }

  handleAction(action: string, id: number): void {
    this.emitUpdate.emit({ action: 'change' });
    this.router.navigate(['/details', id]);
  }

  private loadItems(): void {
    this.items.set(['A', 'B', 'C']);
  }
}
```

---

## 14. Critérios de Code Review

Todo code review deve validar:

**Angular 21 e arquitetura:**

1. `standalone: true` **não declarado** — é o padrão implícito; declarar é ruído (seção 3.1)
2. `changeDetection: ChangeDetectionStrategy.OnPush` declarado em **todo** componente (seção 3.6)
3. ausência dos legados `@Input()` e `@Output()`
4. uso de `inject()` em vez de injeção via construtor
5. uso de `signal()`, `computed()` e `effect()` quando aplicável
6. uso do fluxo de controle moderno do Angular (`@if`, `@for`, `@switch`, `@defer`)

**Imports e organização:**

7. imports usando path aliases (`@core/*`, `@shared/*`) — ausência de caminhos relativos com mais de um nível (`../`) (seção 12.5)
8. `index.ts` criado (ou atualizado) ao adicionar novos arquivos públicos em uma pasta (seção 12.6)
9. tipagem completa — variáveis, parâmetros, retornos

**Modelos e domínio:**

10. adesão ao `ModelBase`
11. uso de componentes reutilizáveis

**Estilos e UI:**

12. uso de tokens do design system para cores, espaçamento (`--space-*`), radius (`--radius-*`), tipografia (`--font-size-*`, `--font-weight-*`) e sombras (`--shadow-*`) — ausência de valores hardcoded e estilos inline
13. segurança contra XSS

**Serviços e HTTP:**

14. uso de `BaseService` em serviços HTTP
15. ausência de overrides desnecessários em subclasses de `BaseService` — método só é sobrescrito quando adiciona ou altera comportamento em relação à base; corpo idêntico ao original é proibido (seção 6.5)
16. paginação ou virtualização em listas grandes
17. uso de `@defer` para cargas pesadas

**Formulários:**

18. ausência de `ReactiveFormsModule`, `FormBuilder`, `FormGroup` clássico — formulários devem usar Signal Forms (`form()` + `[formField]`)
19. páginas de formulário estendem `BaseFormComponent<K>` — sem gerenciamento manual de `isSubmitting` ou lógica de submissão duplicada (seção 7.7)
20. campos de formulário usam `<app-input>`, `<app-select>` ou `<app-toggle>` — sem campos HTML brutos (seção 7.4)
21. validadores de domínio (CPF, CNPJ, etc.) importados de `@core/validators` — não reimplementar validação inline (seção 7.5)
22. validação condicional usa `required()` ou `validate()` com `{ when }` — nunca verificação manual de campo em `handleSubmit()` para obrigatoriedade contextual (seção 7.3)
23. validação cruzada entre campos usa `validate()` com `valueOf()` — nunca comparação manual no método de submissão (seção 7.5)
24. em modo edição, `getModel()` retorna apenas os campos alterados — não enviar o modelo completo desnecessariamente (seção 7.7)
25. todo elemento `<form>` contém o atributo `novalidate` — ausência do atributo permite que a validação nativa do HTML5 interfira no ciclo do Signal Forms (seção 7.6)
26. erros de servidor tratados exclusivamente via `this.handleApiError(err)` herdado da base — ausência de signals de erro por campo, métodos `handle400()`, `handleApiError()` próprios ou parsing manual de `HttpErrorResponse` (seção 7.8)
27. erros de campo exibidos no template como `[serverError]="serverErrors()['campo']"` — sem signals individuais por campo (seção 7.8)
28. `ToastrService` não reinjetado em componentes que estendem `BaseFormComponent` — `this.toastr` já está disponível via base (seção 7.7)

**Mensagens e constantes:**

29. toda string de mensagem em arquivos `.ts` referencia `Messages` de `@core/constants` — ausência de strings literais de UI hardcoded em TypeScript; arquivos `.html` são permitidos

**Ícones:**

30. todo ícone referenciado via `<lucide-angular [name]="...">` está registrado no `LucideIconProvider` em `app.config.ts` (seção 8.6)

**Navegação:**

31. entrada em `navItems` criada corretamente ao adicionar novo recurso ao menu lateral (seção 5.5)
32. clareza de nomenclatura e organização

**Integração HTTP:**

33. payload de request/response **não é convertido manualmente** com `deepToSnakeCase()` / `deepToCamelCase()` — o `caseConverterInterceptor` já cobre o ciclo HTTP; conversão manual só em contextos fora do ciclo HTTP (seção 6.4)
34. novos interceptores usam `HttpInterceptorFn` (funcional) — nunca a classe `HttpInterceptor` legada (seção 6.4)

**Componentes compartilhados:**

35. componentes do catálogo (`<app-badge>`, `<app-button>`, `<app-data-table>`, `<app-page-header>`, `<app-progress>`, `<app-search-field>`) são reutilizados antes de criar equivalentes — telas de listagem que precisem de busca usam `<app-search-field>` obrigatoriamente; novos componentes com variantes usam `computed()` para montar classes CSS, nunca `[ngClass]` inline (seção 5.6)

**Estilos e estrutura de página:**

36. página de conteúdo usa `<div class="ui-page">` como wrapper — ausência de classes BEM per-página para layout estrutural (seção 8.4)
37. estrutura interna de página (filtros, formulários, seções) usa Tailwind utilities diretamente no template para propriedades estruturais (flex, gap, padding) — sem criar SCSS para regras que o Tailwind já cobre (seção 8.1)
38. `styles.scss` contém apenas `@use 'tailwindcss'` e `@use 'styles/index'` — resets e globais ficam exclusivamente em `_reset.scss` via `_index.scss` (seção 12.3)
39. **nenhum arquivo `*.page.scss` ou `*.component.scss` criado** sem justificativa — qualquer novo `.scss` local deve ter as três condições documentadas no Passo 3 do fluxo de decisão (seção 8.4): semântica visual específica, não reutilizável, Tailwind insuficiente

**Constantes centralizadas:**

40. rotas SPA usam `AppRoutes` de `@core/constants` — ausência de strings de caminho brutas em `.ts` (seção 6.6)
41. endpoints de API usam `ApiRoutes` de `@core/constants` em `protected readonly path` — ausência de strings URL brutas em serviços (seção 6.6)
42. permissões usam `Permissions` de `@core/constants` em `data.requiredPermission` e `navItems` — ausência de strings Django brutas (seção 6.6)

---

## 15. Convenções de Branch e Commit

### 15.1 Nomenclatura de Branch

Os branches devem seguir o padrão `<tipo>/<nome-da-branch>`, onde o nome usa kebab-case (letras minúsculas separadas por hífen):

| Tipo             | Uso                                                   |
| ---------------- | ----------------------------------------------------- |
| `feature/<nome>` | Nova funcionalidade                                   |
| `fix/<nome>`     | Correção de bug                                       |
| `hotfix/<nome>`  | Correção crítica que impede funcionamento em produção |
| `improve/<nome>` | Melhoria ou refatoração em funcionalidade existente   |

Exemplos:

```text
feature/autenticacao-jwt
fix/validacao-senha
hotfix/erro-critico-login
improve/performance-listagem
```

### 15.2 Mensagens de Commit

As mensagens de commit devem seguir o padrão `<tipo>(#id-do-card): Descrição do commit`.

O `#id-do-card` refere-se ao identificador do card no board (ex.: `ANT-956`, `STS-42`).

| Tipo                     | Uso                                                            |
| ------------------------ | -------------------------------------------------------------- |
| `feat(#id): <descrição>` | Nova funcionalidade                                            |
| `fix(#id): <descrição>`  | Correção de bug                                                |
| `fix!(#id): <descrição>` | Hotfix — correção crítica que impede funcionamento em produção |
| `imp(#id): <descrição>`  | Melhoria ou pequena mudança em funcionalidade existente        |

Exemplos:

```text
feat(#ANT-123): adiciona endpoint de autenticação JWT
fix(#STS-42): corrige validação de refresh token expirado
fix!(#ANT-956): corrige erro crítico no login que impede acesso
imp(#ANT-789): melhora performance da listagem de usuários
```

---

## 16. Idioma dos Artefatos: Português BR (Obrigatório)

**Todos os artefatos gerados pelo Spec Kit devem ser escritos em Português Brasileiro (pt-BR).**

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

Todo desenvolvimento frontend da organização deve refletir esta constituição como um compromisso com qualidade, consistência, segurança, escalabilidade e identidade técnica institucional.

Na ausência de uma regra específica, deve prevalecer a decisão que melhor preserve:

- reuso
- legibilidade
- tipagem forte
- reatividade moderna
- segurança
- adesão ao Design System
- simplicidade arquitetural
