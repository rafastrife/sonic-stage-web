# Quickstart: Landing Page Development

Este documento é um guia rápido para executar o ambiente de desenvolvimento e testar a Landing Page de captura de leads.

## Como Iniciar

1. **Rodar o ambiente de desenvolvimento**
   No terminal raiz do repositório `sonic-stage-web`:
   ```bash
   npm start
   ```
   Acesse no navegador: `http://localhost:4200/`

2. **Acessando a página**
   A landing page será disponibilizada temporariamente na raiz (`/`) se for a primeira tela principal do sistema, ou em uma rota pública como `/lancamento` enquanto o app interno vive protegido.

## Validação Manual

- Verifique se o **Hero Banner** exibe os botões corretamente e se o botão "Quero ser avisado" desliza suavemente até o rodapé.
- No componente de **FAQ**, clique nas perguntas e veja se a expansão funciona sem empurrar o layout bruscamente.
- No formulário do **Footer**, digite uma string aleatória (ex: `teste123`) e clique em enviar. O botão deve apresentar estado de validação sem sucesso.
- Digite um e-mail válido, clique em enviar, verifique o estado visual (spinner no botão de preferência) e a notificação simulada de sucesso (`ToastrService.success`).
- Inspecione a página com devtools em 320px de largura e verifique se as 3 funcionalidades ("Agenda", "Equipe", "Repertório") empilham corretamente.
