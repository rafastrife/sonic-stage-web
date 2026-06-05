# Data Model: Landing Page

O domínio da Landing Page é extremamente enxuto e não requer persistência local complexa. O único dado relevante é o Lead coletado.

## Entities

### `LeadPayload`
Objeto de transferência de dados (DTO) enviado à API quando um usuário se cadastra para receber novidades.

| Field | Type | Required | Validations |
|-------|------|----------|-------------|
| `email` | `string` | Yes | Deve ser um formato de e-mail válido padrão RFC (ex: `usuario@dominio.com`). |

### `LeadResponse`
Objeto retornado pelo backend ao concluir o cadastro com sucesso.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `success` | `boolean` | Yes | Indica se o e-mail foi cadastrado (ou se já estava cadastrado). |
| `message` | `string` | Yes | Mensagem a ser exibida (via Toastr ou inline no template). |
