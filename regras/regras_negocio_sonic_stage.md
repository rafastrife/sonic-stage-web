---
title: "Documento de Regras de Negócio do Sistema"
subtitle: "Sonic Stage - Band Performance Manager"
author: "Gerado a partir do protótipo fornecido"
date: "27/05/2026"
lang: pt-BR
toc: true
toc-title: "Sumário"
geometry: margin=2.2cm
fontsize: 11pt
mainfont: DejaVu Sans
---

# 1. Visão geral

O **Sonic Stage** é uma plataforma para gestão de bandas, repertórios, ensaios, shows, membros e exportação de setlists. O sistema possui experiência web e mobile, com foco em organização operacional de performances musicais, colaboração entre membros e preparação de eventos.

Este documento consolida as regras de negócio inferidas a partir das telas do protótipo: login, cadastro de usuário, cadastro de banda, painel, agenda, criação de evento, repertório, membros/convites, perfil da banda e exportação de setlist.

## 1.1 Objetivo do sistema

Permitir que bandas e equipes musicais gerenciem, em uma única solução:

- Conta de acesso de usuários.
- Perfil da banda.
- Membros e convites de colaboradores.
- Agenda de shows, ensaios, viagens e atividades técnicas.
- Repertório, músicas e setlists.
- Roteiros de ensaio.
- Exportação de setlist em PDF/impressão.
- Acesso ao painel operacional da banda.

## 1.2 Canais suportados

| Canal | Descrição |
|---|---|
| Web/Desktop | Interface completa de gestão: painel, agenda, repertório, membros, finanças, criação de evento e exportação. |
| Mobile | Interface reduzida e orientada a ações rápidas: painel, agenda, músicas, banda, finanças, login, cadastro, perfil da banda, criação de ensaio, membros e exportação. |

# 2. Escopo funcional

## 2.1 Módulos identificados

| Módulo | Finalidade |
|---|---|
| Autenticação | Entrada no sistema por e-mail e senha. |
| Cadastro de Usuário | Criação de conta com nome artístico, e-mail, senha e função/instrumento principal. |
| Cadastro/Perfil de Banda | Registro da identidade da banda, logo/foto, gênero e biografia. |
| Painel | Visão resumida do próximo evento, repertório, ensaios e setlists recentes. |
| Agenda | Visualização de calendário e próximos eventos. |
| Criação de Evento | Cadastro de ensaios ou shows com data, hora, local e roteiro/objetivos. |
| Repertório | Gestão de faixas, filtros, setlists e status de músicas. |
| Membros e Convites | Envio e acompanhamento de convites para colaboradores. |
| Exportação de Setlist | Configuração e geração de setlists em formato de impressão/PDF. |
| Finanças | Módulo previsto na navegação, sem regras detalhadas nas telas fornecidas. |
| Entrar ao Vivo | Módulo previsto na navegação, sem regras detalhadas nas telas fornecidas. |

# 3. Atores e papéis

## 3.1 Atores principais

| Ator | Descrição |
|---|---|
| Usuário visitante | Pessoa não autenticada que pode acessar login e cadastro. |
| Usuário cadastrado | Pessoa com conta criada no sistema. |
| Administrador da banda | Usuário responsável por criar/gerenciar banda, membros, repertório e eventos. |
| Membro da banda | Colaborador convidado para participar da banda com uma função definida. |
| Produção/Técnico | Colaborador voltado à operação, produção ou suporte técnico. |
| Fã/Ouvinte | Perfil previsto no cadastro, com acesso potencialmente restrito a recursos administrativos. |

## 3.2 Funções musicais previstas

O sistema deve permitir seleção de função/instrumento principal durante o cadastro ou convite. As opções identificadas incluem:

- Vocalista/Vocal.
- Cordas/Guitarra/Baixo.
- Percussão/Bateria.
- Teclas/Teclados.
- Produtor/DJ/Produtor.
- Ouvinte/Fã.
- Produção.
- Técnico.

# 4. Regras gerais de negócio

| ID | Regra |
|---|---|
| RN-GER-001 | O usuário deve estar autenticado para acessar painel, agenda, repertório, membros, finanças, criação de evento e exportação de setlist. |
| RN-GER-002 | Após cadastro de usuário, o sistema deve conduzir o usuário para a criação ou associação a uma banda antes de liberar a experiência completa de gestão. |
| RN-GER-003 | Uma banda deve possuir, no mínimo, nome e gênero principal para ser registrada. |
| RN-GER-004 | Funcionalidades administrativas devem considerar o vínculo do usuário com a banda ativa. |
| RN-GER-005 | A navegação principal deve manter consistência entre web e mobile, respeitando adaptações de espaço e prioridade de ações. |
| RN-GER-006 | Dados exibidos no painel devem ser consolidados a partir dos módulos de agenda, repertório e setlists. |
| RN-GER-007 | O sistema deve exibir mensagens e ações em português brasileiro na experiência fornecida. |

# 5. Autenticação e cadastro de usuário

## 5.1 Login

| ID | Regra |
|---|---|
| RN-AUT-001 | O login deve solicitar e-mail e senha. |
| RN-AUT-002 | O sistema deve disponibilizar ação de recuperação de senha, identificada como "Esqueci a Senha" ou "Esqueceu?". |
| RN-AUT-003 | Usuários sem conta devem poder acessar o fluxo de criação de conta a partir da tela de login. |
| RN-AUT-004 | Após autenticação válida, o usuário deve ser direcionado para o painel ou para o fluxo pendente de criação/seleção de banda. |
| RN-AUT-005 | Credenciais inválidas devem impedir o acesso às áreas restritas do sistema. |

## 5.2 Cadastro de conta

| ID | Regra |
|---|---|
| RN-USU-001 | O cadastro deve coletar nome de artista/exibição ou nome de usuário. |
| RN-USU-002 | O cadastro deve coletar endereço de e-mail. |
| RN-USU-003 | O cadastro deve coletar senha. |
| RN-USU-004 | O usuário deve selecionar uma função principal ou instrumento principal. |
| RN-USU-005 | O e-mail deve ser único na base de usuários. |
| RN-USU-006 | O sistema deve permitir alternar visualização da senha durante o preenchimento. |
| RN-USU-007 | Usuários que já possuem conta devem poder retornar ao login. |

# 6. Cadastro e perfil da banda

## 6.1 Registro de banda

| ID | Regra |
|---|---|
| RN-BAN-001 | O usuário deve poder criar o perfil da banda após criar ou acessar sua conta. |
| RN-BAN-002 | O nome da banda é obrigatório. |
| RN-BAN-003 | O gênero principal da banda deve ser selecionado em uma lista predefinida. |
| RN-BAN-004 | A biografia curta deve respeitar limite de caracteres. No desktop foi identificado limite de 500 caracteres; no mobile, 150 caracteres. A regra final deve ser padronizada pelo produto. |
| RN-BAN-005 | O upload de logo/foto de capa deve aceitar formatos SVG, PNG, JPG, JPEG ou GIF, conforme indicação do protótipo. |
| RN-BAN-006 | O tamanho máximo do arquivo de imagem da banda deve ser de 5 MB, conforme indicação do protótipo web. |
| RN-BAN-007 | Após registrar a banda, o usuário deve poder completar informações adicionais e convidar membros pelo painel. |

## 6.2 Gêneros previstos

As telas indicam opções como:

- Rock / Alternativo.
- Eletrônica / Synthwave.
- Hip Hop / Rap.
- Pop / Indie Pop.
- Metal / Hardcore.
- Jazz / Blues.
- Rock.
- Eletrônica.
- Indie.
- Metal.
- Hip Hop.
- Outro.

**Regra de padronização:** o cadastro web e mobile devem usar a mesma taxonomia de gêneros para evitar inconsistência de dados.

# 7. Painel

## 7.1 Indicadores e atalhos

| ID | Regra |
|---|---|
| RN-PAI-001 | O painel deve exibir o próximo evento da banda, incluindo nome, data/hora e local quando disponíveis. |
| RN-PAI-002 | O painel deve exibir contagem total de músicas no repertório. |
| RN-PAI-003 | O painel deve exibir quantidade de ensaios da semana. |
| RN-PAI-004 | O painel deve exibir setlists recentes com data de última utilização, quantidade de faixas e duração total. |
| RN-PAI-005 | O painel pode exibir estado de "Vibe Principal Atual" ou indicador equivalente de status/energia da banda. |
| RN-PAI-006 | O painel deve fornecer acesso rápido para cronograma, lista de convidados, repertório e setlists. |

# 8. Agenda

## 8.1 Visualização de calendário

| ID | Regra |
|---|---|
| RN-AGE-001 | A agenda deve apresentar eventos organizados por calendário mensal. |
| RN-AGE-002 | A agenda web deve permitir alternância entre visualização em Lista e em Calendário (mês), com navegação entre meses e atalho para o mês atual. A alternância adicional entre mês e semana fica adiada para uma versão futura (decisão de produto da feature 026). |
| RN-AGE-003 | A agenda deve listar os próximos eventos em uma seção de curto prazo, como "Próximos 7 Dias". |
| RN-AGE-004 | Cada evento da agenda deve apresentar data, horário (início/fim quando informados), título e local quando disponíveis. O campo "tipo" (Ensaio/Show) deixa de ser exibido nesta versão — ver RN-EVE-002. |
| RN-AGE-005 | Eventos podem ser classificados como ensaio, show, viagem ou atividade técnica. |
| RN-AGE-006 | Eventos com apresentação ao vivo podem exibir destaque visual como "AO VIVO". |
| RN-AGE-007 | A agenda deve disponibilizar ação para criação de novo evento. |

## 8.2 Métricas de agenda

| ID | Regra |
|---|---|
| RN-AGE-008 | A agenda pode exibir resumo quantitativo do mês, como número de shows agendados e ensaios. |
| RN-AGE-009 | Os indicadores da agenda devem ser calculados com base nos eventos vinculados à banda ativa. |

# 9. Criação e gestão de eventos

## 9.1 Tipos de evento

| ID | Regra |
|---|---|
| RN-EVE-001 | O sistema deve permitir criar pelo menos dois tipos principais de evento: Ensaio e Show. A partir da feature 026, esse tipo é definido automaticamente pelo sistema (padrão "Show") em vez de coletado no formulário — ver RN-EVE-002. |
| RN-EVE-002 | O formulário de evento deve coletar nome do evento, banda e data (obrigatórios), além de setlist vinculada, horário de início, horário de fim, local, status e observações (opcionais). O tipo (Ensaio/Show) não é mais coletado diretamente no formulário nesta versão (decisão de produto da feature 026). |
| RN-EVE-003 | Eventos do tipo ensaio podem conter roteiro de ensaio e objetivos. |
| RN-EVE-004 | O usuário deve poder cancelar o cadastro antes da confirmação. |
| RN-EVE-005 | O evento só deve ser criado após confirmação explícita. |

## 9.2 Roteiro de ensaio

| ID | Regra |
|---|---|
| RN-ROT-001 | O roteiro de ensaio deve permitir uma ou mais atividades. |
| RN-ROT-002 | Cada item do roteiro pode conter descrição e duração estimada. |
| RN-ROT-003 | O usuário deve poder adicionar novos itens ao roteiro. |
| RN-ROT-004 | O usuário deve poder remover itens do roteiro antes de confirmar o ensaio. |
| RN-ROT-005 | O sistema deve preservar a ordem dos itens do roteiro. |
| RN-ROT-006 | Objetivos do ensaio devem ajudar a alinhar a equipe e podem ser registrados em lista. |

# 10. Repertório e setlists

## 10.1 Catálogo de músicas

| ID | Regra |
|---|---|
| RN-REP-001 | O repertório deve exibir catálogo de músicas da banda ativa, independente de qualquer setlist específico. |
| RN-REP-002 | Cada faixa pode possuir título (obrigatório), artista/banda, categoria/gênero, tom, afinação, BPM e tags livres. |
| RN-REP-003 | O sistema deve permitir busca por título e por artista. |
| RN-REP-004 | O sistema deve disponibilizar filtros por status e por gênero para facilitar a gestão do catálogo. |
| RN-REP-005 | O sistema deve permitir adicionar nova faixa ao catálogo informando apenas o título; os demais campos são opcionais. |
| RN-REP-006 | O sistema deve permitir editar e remover faixas existentes do catálogo. Ao remover uma faixa referenciada por um ou mais setlists, o sistema deve avisar quais setlists serão afetados antes de confirmar a exclusão. |
| RN-REP-007 | O sistema deve permitir reordenar manualmente as faixas do catálogo, persistindo a ordem definida. |
| RN-REP-008 | Uma mesma faixa (mesmo título/artista) pode ser reutilizada em múltiplos setlists sem duplicação de cadastro. |

## 10.2 Status de faixa

| ID | Regra |
|---|---|
| RN-REP-009 | Uma faixa possui um status de prontidão, com os valores: "Ativa", "Em ensaio" ou "Sugestão". |
| RN-REP-010 | Uma faixa recém-cadastrada sem status definido assume "Ativa" por padrão. |
| RN-REP-011 | O status de uma faixa pode ser alterado livremente por qualquer membro da banda, sem fluxo de aprovação obrigatório. |
| RN-REP-012 | Status de faixa deve ser visível na listagem para apoiar decisão de inclusão em setlists. |

## 10.3 Setlists

| ID | Regra |
|---|---|
| RN-SET-001 | O sistema deve permitir criação de setlists a partir do repertório. |
| RN-SET-002 | Um setlist deve conter uma lista ordenada de músicas. |
| RN-SET-003 | Um setlist pode possuir nome, quantidade de faixas, duração total e data de última utilização. |
| RN-SET-004 | Setlists podem estar em estado de rascunho ou prontos para uso. |
| RN-SET-005 | O painel deve exibir setlists recentes e permitir acesso à lista completa. |

# 11. Membros e convites

## 11.1 Convite de colaboradores

| ID | Regra |
|---|---|
| RN-MEM-001 | O administrador da banda deve poder convidar colaboradores por dois canais: buscando um usuário já cadastrado na plataforma (por nome/e-mail parcial) para envio de notificação direta no app, ou gerando um link de convite de uso único para quem ainda não possui conta (detalhado na feature 025). |
| RN-MEM-002 | Cada convite deve possuir uma função atribuída. |
| RN-MEM-003 | O sistema deve permitir cancelar o envio antes da confirmação. |
| RN-MEM-004 | Após envio, o convite deve aparecer como pendente até aceitação, recusa ou cancelamento pelo administrador. Não há expiração automática nesta versão (decisão de produto tomada na especificação da feature 025 — ver `specs/025-band-invite-notifications/spec.md`). |
| RN-MEM-005 | Convites pendentes devem exibir e-mail, função, tempo desde envio e status. |
| RN-MEM-006 | O sistema deve permitir reenviar convite pendente. |
| RN-MEM-007 | O sistema deve contabilizar convites ativos/pendentes. |

## 11.2 Funções para convite

As telas indicam funções como:

- Vocais.
- Guitarra.
- Baixo.
- Bateria.
- Teclados.
- Produtor.
- Músico.
- Produção.
- Técnico.

**Regra de padronização:** funções exibidas no cadastro de usuário, perfil e convite devem ser normalizadas em uma tabela única de papéis/funções.

# 12. Exportação de setlist

## 12.1 Configuração de exportação

| ID | Regra |
|---|---|
| RN-EXP-001 | O usuário deve poder exportar ou imprimir um setlist em formato PDF. |
| RN-EXP-002 | O usuário deve selecionar o setlist a ser exportado. |
| RN-EXP-003 | O sistema deve permitir escolha de layout do documento, como padrão ou grade compacta. |
| RN-EXP-004 | O usuário deve poder escolher quais colunas serão incluídas. |
| RN-EXP-005 | Colunas previstas incluem afinação, nota inicial, BPM/tempo e durações. |
| RN-EXP-006 | O sistema deve permitir seleção de tema de impressão, como palco escuro ou economia de tinta. |
| RN-EXP-007 | A exportação deve exibir preview antes da impressão/PDF. |
| RN-EXP-008 | O documento exportado deve incluir identificação do setlist, data, numeração das músicas e paginação quando aplicável. |
| RN-EXP-009 | O documento pode incluir indicação de origem, como "Gerado pelo Sonic Stage Pro". |

## 12.2 Conteúdo do PDF de setlist

| ID | Regra |
|---|---|
| RN-EXP-010 | As músicas devem ser exportadas na ordem definida no setlist. |
| RN-EXP-011 | A numeração das músicas deve ser sequencial. |
| RN-EXP-012 | Campos opcionais devem aparecer somente se habilitados na configuração de exportação. |
| RN-EXP-013 | A versão mobile deve manter as mesmas opções essenciais, ainda que com interface simplificada. |

# 13. Mobile

| ID | Regra |
|---|---|
| RN-MOB-001 | A experiência mobile deve priorizar ações essenciais: início, agenda, músicas, banda e finanças. |
| RN-MOB-002 | O menu inferior deve permitir navegação rápida entre áreas principais. |
| RN-MOB-003 | Fluxos mobile devem manter compatibilidade funcional com web para login, cadastro, agenda, membros, eventos e exportação. |
| RN-MOB-004 | Quando houver diferenças entre web e mobile, a regra de negócio deve ser única e a interface deve apenas adaptar apresentação e quantidade de campos visíveis. |

# 14. Navegação e permissões

## 14.1 Itens de navegação identificados

- Painel / Início.
- Agenda.
- Repertório / Músicas.
- Membros / Banda.
- Finanças.
- Entrar ao Vivo.
- Configurações.
- Notificações.

## 14.2 Regras de acesso sugeridas

| ID | Regra |
|---|---|
| RN-PER-001 | Visitantes podem acessar apenas login, cadastro de usuário e fluxos públicos de recuperação de senha. |
| RN-PER-002 | Usuários autenticados sem banda devem acessar criação/associação de banda. |
| RN-PER-003 | Administradores da banda podem criar eventos, gerenciar repertório, exportar setlists e convidar membros. |
| RN-PER-004 | Membros podem visualizar agenda, repertório e setlists conforme permissões definidas pela banda. |
| RN-PER-005 | Produção e técnicos devem ter acesso aos dados operacionais necessários para eventos e roteiros. |
| RN-PER-006 | Perfis de fã/ouvinte não devem possuir permissões administrativas por padrão. |

# 15. Dados principais

## 15.1 Entidades sugeridas

| Entidade | Campos principais |
|---|---|
| Usuário | ID, nome de exibição, e-mail, senha, função principal, status, data de criação. |
| Banda | ID, nome, gênero principal, biografia, imagem/logo, criador, data de criação. |
| Membro da Banda | usuário, banda, função, permissão, status, data de entrada. |
| Convite | e-mail (opcional para convite por link), usuário convidado (quando resolvido), banda, função, canal (direto/link), status, token, enviado em, reenviado em. Sem campo de expiração nesta versão (feature 025). |
| Evento | título, tipo (definido automaticamente, não coletado no formulário desde a feature 026), data, hora início, hora fim, local, status, banda, setlist vinculada (opcional), observações. |
| Roteiro de Ensaio | evento, itens ordenados, descrição, duração estimada. |
| Música | título (obrigatório), artista/banda, categoria/gênero, tom, afinação, BPM, duração, tags, status, ordem no catálogo. |
| Setlist | nome, banda, músicas ordenadas, duração total, status, última utilização. |
| Exportação | setlist, layout, colunas, tema, data de geração, usuário gerador. |

# 16. Validações recomendadas

| Campo/Fluxo | Validação |
|---|---|
| E-mail | Formato válido e unicidade para cadastro de usuário. |
| Senha | Obrigatória; política mínima deve ser definida pelo produto. |
| Nome da banda | Obrigatório. |
| Logo/foto da banda | Formatos permitidos e limite máximo de 5 MB. |
| Biografia | Respeitar limite final padronizado de caracteres. |
| Data do evento | Obrigatória e válida. |
| Hora do evento | Obrigatória e válida. |
| Tipo de evento | Deve pertencer à lista permitida. |
| Convite | E-mail obrigatório, função obrigatória e não duplicar convite pendente para a mesma banda/e-mail. |
| Música | Título obrigatório; BPM deve ser numérico quando preenchido. |
| Setlist | Deve conter ao menos uma música para exportação final. |

# 17. Estados e status

| Objeto | Status identificados ou sugeridos |
|---|---|
| Convite | Pendente, aceito, recusado, cancelado. ("Reenviado" é uma ação sobre um convite pendente, não um status próprio; não há status "expirado" nesta versão — decisão de produto da feature 025.) |
| Música | Ativa, em ensaio, sugestão. |
| Setlist | Rascunho, pronto, utilizado, arquivado. |
| Evento | Confirmado, Pendente, Cancelado (decisão de produto da feature 026 — substitui a lista anterior "Agendado, ao vivo, concluído, cancelado" para esta versão). |
| Usuário | Ativo, pendente de verificação, bloqueado, inativo. |

# 18. Regras de consistência entre web e mobile

| ID | Regra |
|---|---|
| RN-CON-001 | Web e mobile devem consumir a mesma base de dados e as mesmas regras de validação. |
| RN-CON-002 | Campos com limites divergentes entre protótipos devem ser resolvidos em regra única antes do desenvolvimento final. |
| RN-CON-003 | Opções de gênero, função e status devem ser centralizadas para evitar duplicidade. |
| RN-CON-004 | A versão mobile pode omitir configurações avançadas na primeira camada, mas não deve impedir operações essenciais. |

# 19. Pontos em aberto para decisão do produto

| Item | Decisão necessária |
|---|---|
| Biografia da banda | Padronizar limite: 150 ou 500 caracteres. |
| Finanças | Definir funcionalidades, permissões e entidades do módulo financeiro. |
| Entrar ao Vivo | Definir escopo: transmissão, check-in de show, status operacional ou sala ao vivo. |
| Papéis e permissões | Definir matriz completa de acesso por função. |
| Recuperação de senha | Definir fluxo: e-mail, token, expiração e política de segurança. |
| Exportação PDF | Definir se todos os usuários podem exportar ou apenas administradores/produção. |
| Verificação de e-mail | Definir se cadastro exige confirmação antes do acesso. |

# 20. Critérios de aceite macro

- O usuário consegue criar conta, entrar no sistema e criar/associar uma banda.
- A banda possui perfil mínimo com nome, gênero e biografia.
- O administrador consegue convidar membros e acompanhar convites pendentes.
- O administrador consegue criar eventos de ensaio/show com data, hora e local.
- O administrador consegue adicionar itens de roteiro para ensaios.
- O repertório lista músicas com dados técnicos relevantes.
- O usuário consegue montar e visualizar setlists.
- O usuário consegue configurar colunas e gerar/imprimir PDF de setlist.
- Painel, agenda e repertório refletem os dados da banda ativa.
- Web e mobile mantêm regras de negócio consistentes.

# 21. Observações finais

Este documento foi estruturado a partir dos artefatos do protótipo fornecido. Algumas regras são explícitas nas telas e outras são inferências necessárias para transformar o protótipo em especificação funcional. Itens marcados como pontos em aberto devem ser validados com produto, design e equipe técnica antes da implementação definitiva.
