# Mapa de Bugs — Sonic Stage

**Data da análise:** 2026-08-26
**Escopo:** `sonic-stage-web` (Angular 17) + `sonic-stage-api` (Django 5.2 / DRF)
**Método:** leitura integral do código-fonte (~4.800 linhas no front, ~2.700 no back), `ng build`, `ng test`, `manage.py check`, `manage.py test core`, e um teste de intrusão pontual escrito para validar a falha de autorização (SEC-01/SEC-02).

## Sumário

| Severidade | Qtd. | Natureza |
|---|---|---|
| 🔴 Crítico | 10 (9 ✅ resolvidos, 1 ⚠️ parcial) | Segurança — dados de qualquer banda expostos, escalada de privilégio, segredos no repositório |
| 🟠 Alto | 15 | Funcionalidades quebradas em produção (e-mail, convites, dashboard, sessão) |
| 🟡 Médio | 29 | Comportamento incorreto, vazamentos, botões mortos, dados mockados |
| ⚪ Baixo | 15 | Dívida técnica, código morto, i18n, testes |

**Os 3 mais urgentes:** SEC-01, SEC-02 e ALT-04 (reset de senha inoperante).

**Atualização (feature `035-fix-critical-security-bugs`, 2026-08-29):** os 10 itens críticos (SEC-01 a SEC-10) ganharam teste de regressão em `sonic-stage-api/core/tests_security.py` e correção no código. 9 estão fechados por completo; SEC-10 está **parcial** — a revogação de token no logout está pronta, mas a expiração de convites (FR-012/FR-013) segue retida aguardando aprovação de produto para reverter RN-MEM-004/RN-MEM-008 (ver `specs/035-fix-critical-security-bugs/tasks.md`, T060). Detalhe de cada item marcado abaixo.

---

## 🔴 CRÍTICO — Segurança

### SEC-01 — IDOR total: qualquer usuário lê e apaga dados de qualquer banda ✅ *RESOLVIDO (feature 035)*
**Arquivo:** `sonic-stage-api/core/views.py:104-111` (`NestedBandResourceMixin`)

```python
def get_queryset(self):
    return self.queryset.filter(band_id=self.kwargs.get("band_pk"))  # só filtra pela URL
```

O mixin filtra apenas pelo `band_pk` da URL e **nunca verifica se o usuário autenticado pertence àquela banda**. Todos os viewsets que o usam declaram apenas `permissions.IsAuthenticated`: `SongViewSet`, `SetlistViewSet`, `EventViewSet`, `BandMemberViewSet`.

**Reproduzido** (usuário sem nenhum vínculo com a banda alvo):

```
GET    /api/bands/3/songs/          -> 200  (retornou "Musica Secreta")
DELETE /api/bands/3/songs/3/        -> 204  (música apagada de fato)
GET    /api/bands/3/members/        -> 200
GET    /api/bands/3/setlists/       -> 200
GET    /api/bands/3/events/         -> 200
```

**Impacto:** com uma conta gratuita e um loop sobre IDs sequenciais, qualquer pessoa lê, edita e destrói o repertório, setlists, agenda e lista de membros de todas as bandas da plataforma.
**Correção:** criar `IsBandMember(BasePermission)` (análoga a `IsBandAdmin`, que já existe e está correta em `core/permissions.py`) e aplicá-la em todos os viewsets aninhados; validar `band_pk` também no `perform_create`.
**Resolvido:** `IsBandMember` aplicada a `SongViewSet`, `SetlistViewSet`, `EventViewSet` e `BandMemberViewSet`; validado ao vivo — não-membro recebe `403` nos quatro `GET` e no `DELETE` destrutivo, que não apaga mais o registro.

### SEC-02 — Escalada de privilégio: auto-promoção a ADMIN de qualquer banda ✅ *RESOLVIDO (feature 035)*
**Arquivos:** `core/views.py:114-117`, `core/serializers.py:56-65`

`BandMemberViewSet` é um `ModelViewSet` completo com `IsAuthenticated`, e `BandMemberSerializer` usa `fields = "__all__"` com apenas `band` como read-only — ou seja, `permission_level` e `status` são graváveis pelo cliente.

**Reproduzido:**
```
POST /api/bands/4/members/  {"user_id": <eu>, "role": "Hacker",
                             "permission_level": "ADMIN", "status": "ACCEPTED"}
-> 201 Created
```

**Impacto:** tomada de controle de qualquer banda, incluindo o poder de gerenciar convites (que é o único endpoint hoje protegido por `IsBandAdmin`).
**Correção:** tornar `permission_level` e `status` read-only no serializer; restringir escrita em `BandMemberViewSet` a `IsBandAdmin`; impedir `user_id` arbitrário.
**Resolvido:** `permission_level`/`status` viraram `read_only_fields`; `IsBandAdminOrMemberReadOnly` restringe escrita a admin; `unique_together` impede duplicar vínculo. Validado ao vivo — não-admin recebe `403`; admin que envia os campos de privilégio no `POST` tem os valores ignorados na resposta.

### SEC-03 — `SECRET_KEY` versionada e `DEBUG = True` fixo ✅ *RESOLVIDO (feature 035)*
**Arquivo:** `sonic-stage-api/sonic_stage/settings.py:29-34`

```python
SECRET_KEY = "django-insecure-=^y2r)(6b&r9hf83gk1=ue$$ri@)0cvdm8*yrmztt5*(_dkh8v"
DEBUG = True
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "*").split(",")
```

A chave está no repositório (permite forjar tokens de reset de senha e assinaturas de sessão), `DEBUG` não é controlado por variável de ambiente (expõe stacktrace, SQL e settings em qualquer erro 500) e `ALLOWED_HOSTS` cai em `*` por padrão.
**Correção:** mover os três para `os.environ`, rotacionar a `SECRET_KEY` atual, e adicionar `SECURE_*` / `CSRF_TRUSTED_ORIGINS` para produção.
**Resolvido no código:** `DEBUG`, `SECRET_KEY` e `ALLOWED_HOSTS` lidos via `env_required()` (falha com `ImproperlyConfigured` fora de dev sem as variáveis); bloco `if not DEBUG:` adiciona `SECURE_SSL_REDIRECT`/`HSTS`/cookies seguros; `.env.example` versionado. **Pendente:** rotação da `SECRET_KEY` em produção (T040 — requer acesso ao ambiente de produção, fora do alcance desta sessão).

### SEC-04 — `CORS_ALLOW_ALL_ORIGINS = True` ✅ *RESOLVIDO (feature 035)*
**Arquivo:** `settings.py:127` — qualquer site pode chamar a API a partir do navegador da vítima. Combinado com SEC-01, um site malicioso lê dados de bandas assim que obtiver um token.
**Correção:** `CORS_ALLOWED_ORIGINS` explícito por ambiente.
**Resolvido:** `CORS_ALLOWED_ORIGINS` lido do ambiente (lista explícita), `CSRF_TRUSTED_ORIGINS` adicionado.

### SEC-05 — Convite por link aceito sem o token, via ID sequencial ✅ *RESOLVIDO (feature 035)*
**Arquivo:** `core/views.py:302-315` (`_resolve_invitation_for_action`)

A checagem de titularidade só existe para `CHANNEL_DIRECT`:
```python
if invitation.channel == Invitation.CHANNEL_DIRECT and invitation.invited_user_id != request.user.id:
    return ... 403
```
Para convites `LINK`, qualquer usuário autenticado pode `POST /api/invitations/<id>/accept/` com IDs incrementais e entrar em bandas às quais nunca foi convidado — o UUID `token`, que é o segredo do fluxo, é ignorado no aceite.
**Correção:** exigir o `token` no corpo do aceite de convites LINK e conferi-lo contra o registro.
**Resolvido:** `_resolve_invitation_for_action` agora exige e confere o `token` UUID para convites LINK; frontend (`invite-landing.component.ts`) passou a enviá-lo. Validado ao vivo — sem token ou com token malformado → `403`; com token correto → `200` na primeira tentativa.

### SEC-06 — Nenhum guard de autenticação nas rotas do app ✅ *RESOLVIDO (feature 035)*
**Arquivo:** `sonic-stage-web/src/app/app.routes.ts:10-21`

`/dashboard` e todos os filhos só têm o `mvpGuard` (feature flag). Não existe `authGuard`. Um visitante sem token renderiza o layout completo e só é expulso depois que a primeira requisição volta 401.
**Correção:** `canActivate: [authGuard]` no nó `/dashboard`, validando também a expiração do JWT (hoje `isAuthenticated` só checa se a string existe — `auth.store.ts:16`).
**Resolvido:** `authGuard` criado (`CanActivateFn`), aplicado no nó `/dashboard`, valida `exp` do JWT via `isSessionValid` e redireciona para `/login?redirect=...`. Coberto por `auth.guard.spec.ts`; não reproduzido num navegador real nesta sessão.

### SEC-07 — Senha padrão do banco no código ✅ *RESOLVIDO (feature 035)*
**Arquivo:** `settings.py:102` — `"PASSWORD": os.environ.get("DB_PASSWORD", "123456")`. Fallback silencioso para uma senha trivial se a variável não for definida em produção.
**Resolvido:** default `"123456"` removido, `DB_PASSWORD` passa por `env_required` (obrigatório fora de dev).

### SEC-08 — Login Google não verifica `email_verified` e vincula contas por e-mail ✅ *RESOLVIDO (feature 035)*
**Arquivo:** `core/views.py:753-770`

```python
user = User.objects.filter(email=email).first()   # vincula automaticamente
```
Se um usuário se cadastrou com e-mail+senha, qualquer identidade Google com o mesmo e-mail assume a conta. O `idinfo["email_verified"]` retornado pela Google nunca é checado.
**Correção:** exigir `idinfo.get("email_verified")` e não vincular contas existentes automaticamente sem confirmação explícita.
**Resolvido:** `GoogleLoginView` exige `email_verified` (senão `403 EMAIL_NOT_VERIFIED`) e não assume mais contas locais existentes (`409 ACCOUNT_EXISTS_LINK_REQUIRED`); frontend trata os dois códigos e `/dashboard/profile` foi destravada como caminho de saída para vincular a conta. Coberto por `GoogleIdentityTests` (mock); sem token OAuth real disponível para reprodução ao vivo nesta sessão.

### SEC-09 — Sem validação de força de senha no backend ✅ *RESOLVIDO (feature 035)*
**Arquivos:** `core/serializers.py:33-47` (`RegisterSerializer`), `core/views.py:718-726` (reset)

`AUTH_PASSWORD_VALIDATORS` está configurado, mas nem o registro nem o reset chamam `django.contrib.auth.password_validation.validate_password`. A única barreira é o `Validators.minLength(6)` do front — trivialmente contornável via API. Aceita `123456`.
**Resolvido:** `validate_password` aplicado em `RegisterSerializer` e `PasswordResetConfirmView`; `LANGUAGE_CODE = "pt-br"` para mensagens traduzidas. Validado ao vivo — `123456` → `400` com 3 mensagens em pt-BR; senha forte → `201`. Contas antigas com senha fraca continuam entrando (FR-032, não reavaliadas retroativamente).

### SEC-10 — Convites sem expiração e logout sem invalidação de token ⚠️ *PARCIAL (feature 035)*
**Arquivos:** `core/models.py:35-69`, `sonic-stage-web/src/app/core/stores/auth.store.ts:68-73`

`Invitation` não tem campo de expiração — um link vazado vale para sempre. E `token_blacklist` do SimpleJWT não está instalado: o logout apenas remove o token do `localStorage`; o JWT continua válido por até 1 dia (`ACCESS_TOKEN_LIFETIME`) para quem o tiver capturado.
**Resolvido — revogação de token:** `POST /api/auth/logout/` grava o `jti` numa denylist (`RevokedToken`); `RevokingJWTAuthentication` recusa tokens revogados (`401 token_revoked`). Validado ao vivo — logout idempotente (duas chamadas, `204` nas duas), reutilizar o token revogado dá `401`, token de outro usuário continua válido.
**Retido — expiração de convites:** FR-012/FR-013 revertem a decisão de produto registrada em RN-MEM-004/RN-MEM-008 ("não há expiração automática nesta versão", feature 025). Aguarda aprovação de produto (`specs/035-fix-critical-security-bugs/tasks.md`, T060) antes de adicionar `Invitation.expires_at` e recusar convites vencidos com `410`.

---

## 🟠 ALTO — Funcionalidade quebrada

### ALT-01 — "Próximo Evento" do dashboard nunca aparece
**Arquivo:** `core/views.py:557`

```python
Event.objects.filter(band=band, status="SCHEDULED", date__gte=now)
```
`"SCHEDULED"` não existe em `Event.STATUS_CHOICES` (`core/models.py:161-168`, que define `CONFIRMED`/`PENDING`/`CANCELED`). O filtro nunca casa → `next_event` é sempre `None` → o banner do dashboard mostra permanentemente "Nenhum evento agendado", mesmo com eventos futuros cadastrados.

### ALT-02 — Métrica "Ensaios Esta Semana" travada em zero
**Arquivos:** `core/views.py:579-587`, `core/serializers.py:205-218`, `sonic-stage-web/.../agenda.component.ts:548-557`

O dashboard conta `Event.objects.filter(type="ENSAIO")`, mas o campo `type` **não está em `EventSerializer.fields`** e o formulário da Agenda nunca o envia. Todo evento nasce com o default `"SHOW"`. Logo `rehearsals_this_week` e `next_rehearsal_date` jamais saem de 0/`None`.
**Bônus:** `start_of_week = now - timedelta(days=now.weekday())` não tem limite superior nem zera a hora — se o `type` fosse corrigido, contaria também todos os ensaios das semanas futuras.

### ALT-03 — Link de convite gerado aponta para `localhost:4200`
**Arquivo:** `core/serializers.py:95-98`

```python
return f"http://localhost:4200/invite/{obj.token}"
```
O link que o usuário copia na tela de Membros é inutilizável fora da máquina de desenvolvimento. Toda a funcionalidade "Gerar link" está quebrada em produção.

### ALT-04 — Reset de senha inoperante: URL hardcoded **e com rota errada**
**Arquivo:** `core/views.py:680-682`

```python
reset_url = f"http://localhost:4200/auth/reset-password?uid={uid}&token={token}"
```
Dois defeitos somados: (1) host fixo de desenvolvimento; (2) o caminho `/auth/reset-password` **não existe** — a rota registrada em `app.routes.ts:8` é `/reset-password`. Mesmo em ambiente local o link do e-mail leva a uma rota inexistente, que — por causa de WEB-05 — renderiza uma página em branco. O fluxo de recuperação de senha não funciona em nenhum ambiente.

### ALT-05 — Nenhum e-mail é realmente enviado
**Arquivo:** `settings.py:152` — `EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"`, sem override por ambiente. Reset de senha nunca chega ao usuário. Além disso, o campo `invite_email` coletado na UI de convite por link (`members.component.ts:91-93`) é gravado no banco e **nunca usado para enviar nada**.

### ALT-06 — Refresh token descartado: sessão morre sem renovação
**Arquivo:** `sonic-stage-web/src/app/core/stores/auth.store.ts:49-58`

O endpoint devolve `{access, refresh}` mas só o `access` é guardado. O endpoint `/api/auth/refresh/` existe (`core/urls.py:48`) e nunca é chamado. Ironicamente, `auth.interceptor.ts:30` faz `localStorage.removeItem('refresh_token')` — uma chave que nunca foi escrita. Resultado: expirado o token, o usuário é deslogado no meio do trabalho, sem aviso.

### ALT-07 — Logout não limpa o estado das stores
**Arquivo:** `auth.store.ts:68-73`

`logout()` limpa `localStorage` e o signal de token, mas `BandStore` (`_userBands`, `_activeBandId`, `_dashboardData`) e `NotificationsStore` mantêm os dados do usuário anterior em memória. Ao logar com outra conta na mesma aba, bandas e notificações do usuário anterior aparecem até o primeiro `loadUserBands()` retornar — e o `activeBandId` antigo pode persistir apontando para uma banda de terceiro.

### ALT-08 — Waitlist da landing page quebrada em produção
**Arquivo:** `sonic-stage-web/src/app/services/lead.service.ts:13`

```python
private apiUrl = 'http://localhost:8000/api/leads/waitlist/';
```
Único serviço que não usa caminho relativo `/api/`. O formulário "Quero ser avisado" — a principal conversão da landing page — falha em qualquer ambiente que não seja a máquina do desenvolvedor.

### ALT-09 — Tela de Membros fica vazia ao recarregar a página
**Arquivo:** `sonic-stage-web/src/app/features/members/members.component.ts:189-207`

```typescript
ngOnInit() { this.loadMembers(); this.loadPendingInvitations(); }
loadMembers() { const band = this.bandStore.activeBand(); if (!band) return; ... }
```
`ngOnInit` roda antes de `GET /api/bands/` resolver. Sai pelo `return` e **nunca tenta de novo** — não há `effect()` observando `activeBand()` (padrão que `repertoire.component.ts:432-445` aplica corretamente). Consequências: ao acessar `/dashboard/members` direto pela URL a lista vem vazia; e trocar de banda no seletor lateral não recarrega os membros.

### ALT-10 — Ordem cronológica da Agenda depende de um acoplamento implícito ⚠️ *risco, não falha atual*
**Arquivos:** `core/views.py:514-538` (`AllEventsView`), `agenda.component.ts:318-334`

O agrupamento por mês do front constrói os grupos na ordem de chegada e **nunca ordena**. Hoje funciona só porque `Event.Meta.ordering = ["date", "start_time"]` (`models.py:191-192`) ordena o queryset por acaso — `AllEventsView` não declara nenhum `.order_by()` explícito. Qualquer alteração no `Meta` do modelo ou a introdução de paginação/`distinct` embaralha a Agenda sem que nada no front indique a causa.
**Correção:** `.order_by("date", "start_time")` explícito na view e ordenação defensiva no `monthGroups()`.

### ALT-11 — Sem rota coringa: URL desconhecida = página em branco
**Arquivo:** `app.routes.ts:22` — não existe `{ path: '**', ... }`. Qualquer 404 client-side (inclusive o link de reset de senha do ALT-04) renderiza uma tela totalmente vazia, sem navegação de volta.

### ALT-12 — E-mail não é único: login pode retornar 500
**Arquivos:** `core/models.py:7-12`, `core/auth_backends.py:15-19`

`User` herda de `AbstractUser` (onde `email` **não** é único) e `RegisterSerializer` não adiciona a restrição. O `FlexibleAuthBackend` faz:
```python
user = UserModel.objects.get(Q(username__iexact=..) | Q(email__iexact=..) | Q(display_name__iexact=..))
```
Com dois cadastros no mesmo e-mail — ou dois `display_name` iguais, que também não são únicos — o `.get()` lança `MultipleObjectsReturned` e **o login devolve 500 para ambos os usuários, permanentemente**. Como o front envia `username = email` no registro (`register.component.ts:183-185`), o `username` protege parcialmente, mas o `display_name` continua totalmente exposto (dois usuários "Neon Pulse" quebram o login um do outro).

### ALT-13 — `requirements.txt` em UTF-16: `pip install` falha
**Arquivo:** `../sonic-stage-api/requirements.txt`

```
requirements.txt: Unicode text, UTF-16, little-endian text, with CRLF line terminators
```
Gerado por `pip freeze > requirements.txt` no PowerShell. Em Linux/Docker o pip lê o BOM e falha com erro de parsing na primeira linha. O deploy não sobe a partir do repositório.

### ALT-14 — 3 dos 5 testes do frontend falham
**Comando:** `ng test --watch=false --browsers=ChromeHeadless` → `TOTAL: 3 FAILED, 2 SUCCESS`

- `app.component.spec.ts:17-28` — ainda é o boilerplate do Angular CLI: espera `<h1>Hello, sonic-stage-web</h1>`, mas `app.component.html` contém só `<router-outlet>`.
- `forgot-password.component.spec.ts` e `reset-password.component.spec.ts` — `NullInjectorError: No provider for HttpClient!` (o `TestBed` não provê `provideHttpClient()` nem `ActivatedRoute`).

Além de vermelha, a suíte cobre ~0% de 4.800 linhas: nenhum teste para repertório, agenda, setlists, membros ou stores.

### ALT-15 — 4 testes do backend falham por dependência nativa não documentada
**Comando:** `manage.py test core` → `Ran 63 tests, FAILED (errors=4)`

Todos em exportação de PDF: `WeasyPrint could not import some external libraries` (faltam GTK/Pango/Cairo no Windows). Nem o `README.md` nem o `DOCUMENTATION.md` mencionam esse pré-requisito, então a exportação de PDF — funcionalidade destacada na UI — não funciona numa instalação limpa.

---

## 🟡 MÉDIO

### Botões e controles sem ação
| # | Onde | Descrição |
|---|---|---|
| MED-01 | `dashboard.component.ts:24-26` | Botão "Criar Banda" do estado vazio não tem `(click)` — usuário sem banda fica preso |
| MED-02 | `event-banner.component.ts:34-47` | "Ver Cronograma", "Gerenciar Lista de Convidados" e "Agendar Evento": três botões sem handler |
| MED-03 | `navbar.component.html:35-41` | Menu hambúrguer da landing page é mock ("mocked for visual") — no mobile não há navegação alguma |
| MED-04 | `recent-setlists.component.ts:22` | Cards com `cursor-pointer` mas sem navegação |
| MED-05 | `footer.component.html:22-27` | Ícones sociais com `href="#"` |

### Agenda
- **MED-06** — Não há como **editar nem excluir** um evento. O modal é fixo em "Novo Evento" (`agenda.component.ts:202`) e não existe rota/menu de edição. Um erro de digitação é permanente pela UI.
- **MED-07** — `statusButtonClasses()` (`agenda.component.ts:420-425`) pinta o botão selecionado sempre de verde-esmeralda: "Cancelado" selecionado aparece verde, contradizendo o vermelho usado na listagem.
- **MED-08** — `submitForm()` (linha 559) não trata `error`: se o POST falhar, o modal fica aberto sem nenhuma mensagem e o usuário não sabe se salvou.
- **MED-09** — Sem validação de `end_time > start_time`.
- **MED-10** — `isToday` é calculado com `new Date()` dentro de um `computed` (linha 353): não é reativo, o "hoje" do calendário não vira à meia-noite numa aba aberta.
- **MED-11** — `bandTagClasses()` (linha 394) usa `palette[0]` como fallback para banda não encontrada, colorindo bandas distintas de forma idêntica.

### Repertório / Setlists
- **MED-12** — `exportToPDF()` (`repertoire.component.ts:592-599`) chama `window.URL.revokeObjectURL()` imediatamente após `link.click()`. Sem `appendChild` no DOM e sem atraso, o download é abortado em alguns navegadores (notadamente Firefox).
- **MED-13** — A mesma função monta a URL na mão com `this.http.get('/api/bands/.../generate_repertoire_pdf/')` em vez de usar `SetlistService`/`SongService`, quebrando o padrão e escapando do tratamento de erro (`exportSetlistToPDF`, logo abaixo, faz certo).
- **MED-14** — Drag & drop (`onDrop`, linha 567) reordena `this.songs()` (lista completa) usando índices da lista **filtrada** exibida. Com busca ou filtro de status ativos, a música vai parar numa posição diferente da que o usuário soltou.
- **MED-15** — `formatSetlistDuration()` (linha 617) e `formatDuration()` (`setlist-form.component.ts:189`) não convertem para horas: uma setlist de 1h30 aparece como `90:00`. Mesmo problema em `format_duration_seconds` no backend (`core/views.py:40-43`).
- **MED-16** — Os menus `⋮` de música e setlist não fecham ao clicar fora (só ao clicar de novo no botão) — falta o `@HostListener('document:click')` que `notification-bell.component.ts:78` implementa corretamente.
- **MED-17** — No modal de exclusão, `deleteUsages` é buscado de forma assíncrona **depois** de abrir o modal (linha 534-541): o aviso "esta música está nos setlists X, Y" pisca depois do texto "Esta ação não pode ser desfeita", podendo levar a uma exclusão desinformada.
- **MED-18** — `song-form.component.ts`: se o usuário faz "Preencher" pelo Spotify e depois **apaga** o texto do campo de link, o `spotify_url` continua no formulário e é salvo. Não há como remover um link já preenchido.
- **MED-19** — `setlist-form.component.ts:132-137`: `selectedSongs` é um `computed()` que lê `this.repertoire` — um `@Input` comum, **não** um signal. O computed não recalcula quando o repertório chega/muda; a lista fica vazia se o modal abrir antes de `songs()` carregar.
- **MED-20** — Não há UI para definir o status da setlist na criação (sempre `DRAFT`, `repertoire.component.ts:647`).

### Estado, memória e sessão
- **MED-21** — `create-band-modal.component.ts:61-65`: `window.addEventListener` no construtor, **sem** `ngOnDestroy`. Cada navegação que recria o layout empilha listeners em componentes destruídos.
- **MED-22** — `google-button.component.ts:34-39`: `setInterval` de 100ms aguardando o SDK do Google, nunca limpo se o componente for destruído antes. Vazamento + `renderButton` sobre um elemento fora do DOM.
- **MED-23** — `members.component.ts:187`: `searchDebounce` (`setTimeout`) sem `ngOnDestroy`.
- **MED-24** — `BandStore` não persiste a banda ativa: a seleção volta para a primeira banda a cada F5 (`band.store.ts:56-58`).
- **MED-25** — `notifications.store.ts`: as notificações são carregadas uma única vez, na construção. Sem polling nem websocket, um convite recebido só aparece depois de recarregar a página inteira.
- **MED-26** — `login.component.ts:99-104` + `auth.store.ts:55`: navegação dupla. O `tap` da store navega para `/dashboard` e o componente navega em seguida para o `redirect`. Race visível como flash de tela.
- **MED-27** — `google-auth.service.ts:18`: o login Google navega direto para `/dashboard`, **ignorando o `?redirect`**. Quem aceita um convite via "Criar Conta e Aceitar" com Google (`invite-landing.component.ts:61-68`) é jogado no dashboard e perde o convite.
- **MED-28** — `sidebar.component.ts:25-32`: `[value]` num `<select>` populado por `*ngFor` é conhecidamente instável no Angular (opções renderizam depois do valor ser aplicado); o seletor pode exibir a banda errada. Usar `[ngModel]` ou `[selected]` por opção.
- **MED-29** — Não há como **remover um membro** nem alterar sua função/permissão — `members.component.ts` só lista e convida.

### Dados incorretos e mocks em produção
- **MED-30** — `core/views.py:574-596`: `repertoire_added_this_month` fixo em `0`, `vibe_data` é um array literal `[20, 30, 15, ...]` e alimenta o gráfico "Vibe Principal Atual" do dashboard como se fosse real.
- **MED-31** — `core/views.py:616`: `"status": "Rascunho"` hardcoded (`# Mock status`). O status real da setlist nunca chega ao dashboard. O front compara `setlist.status === 'Rascunho'` (`recent-setlists.component.ts:29`) contra um rótulo em português em vez do enum `DRAFT`/`READY` — os dois erros se anulam por acidente e vão quebrar juntos quando um for corrigido.
- **MED-32** — `core/views.py:613`: `"updated_at": sl.created_at.isoformat()` — o campo exibido como "Última vez" é na verdade a data de criação (`Setlist` não tem `updated_at`).
- **MED-33** — `core/views.py:572`: `total_repertoire` conta só músicas `ACTIVE`, mas o card se chama "Repertório **Total**" e diverge do número mostrado na tela de Repertório.
- **MED-34** — `settings.py:154-156`: `LANGUAGE_CODE = "en-us"` e `TIME_ZONE = "UTC"` numa aplicação inteiramente pt-BR. Cálculos de "hoje"/"esta semana" (`AllEventsView`, dashboard) usam UTC — entre 21h e 00h no horário de Brasília, eventos de hoje já são classificados como amanhã.

### Backend — robustez
- **MED-35** — `core/serializers.py:163-184`: `_sync_songs` faz `delete()` de todos os `SetlistSong` e depois `bulk_create`, **fora de uma transação**. Falha no meio = setlist esvaziada.
- **MED-36** — `core/models.py:22-32`: `BandMember` não tem `unique_together = ("band", "user")` — permite membros duplicados. E `InvitationAcceptView` usa `get_or_create(..., defaults={...})` (`views.py:333`): se já existir um `BandMember` com status `PENDING`, o aceite **não** o promove para `ACCEPTED`.
- **MED-37** — `core/serializers.py:115`: `invitation_id = IntegerField(source="invitation.id")` estoura `AttributeError` (500) para qualquer `Notification` com `invitation = None` — permitido pelo modelo (`models.py:87-89`). Falta `default=None` / `allow_null`.
- **MED-38** — Nenhum endpoint tem paginação (`REST_FRAMEWORK` em `settings.py:106-110` não define `DEFAULT_PAGINATION_CLASS`). `GET /api/bands/X/songs/` e `/api/events/` retornam a tabela inteira.
- **MED-39** — `error.interceptor.ts:20-21` monta uma mensagem de erro e só faz `console.error` (`// Em um cenário de produção, usaria um Toast/Snackbar`). Combinado com os `subscribe()` sem `error` espalhados pelo repertório (`repertoire.component.ts:520, 529, 552, 582`), falhas de gravação são **completamente silenciosas** para o usuário.

---

## ⚪ BAIXO — Dívida técnica e código morto

- **BX-01** — `jspdf` e `jspdf-autotable` estão em `dependencies` (`package.json:21-22`) e **não são usados em lugar nenhum** (`grep` = 0 ocorrências) — o PDF é gerado no backend com WeasyPrint.
- **BX-02** — `shared/components/forms/input/input.component.ts` é código morto: `onInput()`/`onBlur()` são placeholders vazios, o componente não é importado em lugar nenhum, e as linhas 41-46 são comentários de scaffolding de IA versionados no repositório ("might be too complex for this quick refactor", "the user asked to refactor the landing page").
- **BX-03** — `index.html:5`: `<title>SonicStageWeb</title>` (placeholder do CLI) e `<html lang="en">` numa aplicação pt-BR. Sem `<meta name="description">` — ruim para a landing page, que é uma página de captação.
- **BX-04** — `environment.ts` não tem `apiUrl`, não existe `environment.prod.ts` e `angular.json` não tem `fileReplacements`: `environment.production` é `false` inclusive no build de produção. A URL do backend está espalhada entre `auth.interceptor.ts:14-15` (`http://localhost:8000` condicionado a `hostname === 'localhost'`) e `lead.service.ts:13`.
- **BX-05** — `requirements.txt` é um `pip freeze` do venv inteiro: inclui `atlassian-python-api`, `tiktoken`, `python-docx`, `beautifulsoup4`, `types-PyYAML`, `django-stubs` e `djangorestframework-stubs` (dev) misturados com as dependências reais. Sem separação prod/dev, sem `.env.example`.
- **BX-06** — `core/admin.py` está vazio ("# Register your models here.") — nenhum modelo administrável, apesar de `django.contrib.admin` estar instalado e roteado.
- **BX-07** — Mensagens em inglês numa UI pt-BR: `login.component.ts:107` (`'Login failed. Check your credentials.'`), `error.interceptor.ts:11` (`'An unexpected error occurred.'`), respostas da API em `views.py:694, 724, 729`.
- **BX-08** — `alert()` / `confirm()` nativos como padrão de UX: `login.component.ts:107`, `register.component.ts:196`, `reset-password.component.ts:95`, `settings.component.ts:38-46`, `google-button.component.ts:66-74`, `repertoire.component.ts:704`.
- **BX-09** — `any` em toda a camada de Membros e Dashboard (`members.component.ts:169-175`, `metrics-cards.component.ts:56`, `event-banner.component.ts:53`, `recent-setlists.component.ts:45`) — sem modelos tipados, ao contrário de `Song`/`Setlist` que estão bem definidos.
- **BX-10** — `core/views.py`: imports no meio do arquivo (linhas 541, 629-641) e dentro de funções (73-76, 475-478, 773). `Count` importado e nunca usado.
- **BX-11** — `SettingsComponent` (`/dashboard/profile`) está bloqueada pelo `mvpGuard` (`feature-flags.ts:14-16`) e não tem link na sidebar: o "Vincular/Desvincular Google" é inalcançável. `mvpGuard` também está aplicado em `/dashboard/members` e `/dashboard/agenda` (`app.routes.ts:17-18`), onde é um no-op — essas rotas não estão em `LOCKED_ROUTES`.
- **BX-12** — `faq.component.ts:35-41`: `toggleFaq` copia o array mas **muta o objeto** dentro dele (`newItems[index].isOpen = !...`) — antipadrão com signals; quebra se o componente virar `OnPush` com comparação por referência.
- **BX-13** — `styles.css:1`: `@import` de fonte do Google no topo do CSS bloqueia a renderização. Preferir `<link rel="preconnect">` no `index.html`.
- **BX-14** — `footer.component.html:18`: copyright "© 2026" fixo no HTML.
- **BX-15** — Sem CI: nenhum workflow que rode `ng build` / `ng test` / `manage.py test` — as suítes vermelhas (ALT-14, ALT-15) passaram despercebidas.

---

## Ordem de correção sugerida

1. ~~**Hoje:** SEC-01 e SEC-02~~ ✅ Resolvido na feature 035.
2. ~~**Esta semana:** SEC-03/04/05/07~~ ✅ Resolvido na feature 035 (SEC-07 no código; rotação da `SECRET_KEY` em produção segue pendente — T040). ALT-04, ALT-05, ALT-03 continuam abertos.
3. **Antes do próximo deploy:** ALT-13 (encoding do `requirements.txt`), ALT-08, ALT-06, ALT-07, ALT-11. ~~SEC-06~~ ✅ resolvido na feature 035.
4. **Sprint seguinte:** ALT-01/02 (dashboard mostrando dados reais), ALT-09, ALT-12, MED-39 (feedback de erro visível) e a série MED-01..05 de botões mortos.
5. **Contínuo:** ALT-14/ALT-15 + BX-15 — consertar as suítes e colocá-las num CI antes de acumular mais regressões.

**Feature 035 (2026-08-29):** SEC-01, SEC-02, SEC-03, SEC-04, SEC-05, SEC-06, SEC-07, SEC-08 e SEC-09 fechados. SEC-10 parcial — revogação de token no logout resolvida; expiração de convites retida aguardando aprovação de produto. Pendências operacionais: rotação da `SECRET_KEY` em produção (T040) e a aprovação de produto para expiração de convites (T060). Ver `specs/035-fix-critical-security-bugs/tasks.md` para o detalhe tarefa a tarefa.
