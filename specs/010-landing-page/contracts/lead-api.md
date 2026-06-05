# API Contract: Lead Capture (Waitlist)

## Endpoint

`POST /api/leads/waitlist`

## Request

**Headers:**
- `Content-Type: application/json`
- `Accept: application/json`

**Body:**
```json
{
  "email": "user@domain.com"
}
```

## Responses

**201 Created (Success)**
O cadastro foi realizado com sucesso.
```json
{
  "success": true,
  "message": "Você foi adicionado à lista de espera com sucesso!"
}
```

**400 Bad Request (Validation Error)**
O e-mail enviado é inválido ou malformado.
```json
{
  "success": false,
  "errors": {
    "email": ["Informe um e-mail válido."]
  }
}
```

**409 Conflict (Already Registered)**
O e-mail já estava registrado na lista. O frontend pode tratar isso como um aviso amigável ou mesmo como sucesso ("Seu e-mail já está na nossa lista!").
```json
{
  "success": false,
  "errors": {
    "email": ["Este e-mail já está cadastrado em nossa base."]
  }
}
```
