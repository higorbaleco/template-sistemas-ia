# Toolstack — Ferramentas Preferidas

Este documento define as ferramentas preferidas para cada categoria de uso.
**Antes de propor qualquer arquitetura de workflow, cruze com este arquivo para garantir que os nós e integrações usados refletem o stack real do usuário.**

---

## Regra de Preferência

Quando o usuário não especificar qual ferramenta usar, siga esta ordem:
1. Consulte este documento pela categoria relevante
2. Use a ferramenta listada como **preferida**
3. Se houver dúvida entre duas opções do stack, pergunte ao usuário antes de construir

---

## Armazenamento de Dados

### Google Sheets
Planilha online do Google. Usado para armazenar listas de leads, resultados de automações, relatórios e dashboards simples.
- **Implementação**: Nó nativo `n8n-nodes-base.googleSheets`
- **Auth**: Google OAuth2 (credential: `googleSheetsOAuth2Api`)
- **Preferido para**: outputs de automação, listas de leads, relatórios de fácil acesso

### Airtable
Banco de dados visual no estilo planilha com suporte a views, fórmulas e automações. Usado para pipelines de dados mais estruturados.
- **Implementação**: Nó nativo `n8n-nodes-base.airtable` (v2.1)
- **Auth**: Airtable OAuth2 (credential: `airtableOAuth2Api`)
- **Atenção**: Não suporta criação de tabelas via n8n. Sempre usar `getSchema` antes de criar records.
- **Preferido para**: bases de dados com estrutura mais complexa, múltiplas views

### Supabase
Plataforma de banco de dados PostgreSQL como serviço (open source). Alternativa ao Firebase com SQL completo.
- **Implementação**: HTTP Request para REST API (`https://<project>.supabase.co/rest/v1/`) OU nó de comunidade se disponível
- **Auth**: Header `apikey` + `Authorization: Bearer <token>`
- **Preferido para**: projetos que precisam de banco relacional com API REST direta

### Postgres
Banco de dados relacional SQL direto. Usado para instâncias próprias ou de clientes.
- **Implementação**: Nó nativo `n8n-nodes-base.postgres`
- **Auth**: Credential `postgres` com host/user/password/database
- **Preferido para**: dados estruturados, queries complexas, projetos com banco próprio

### Google Drive
Armazenamento de arquivos na nuvem do Google. Usado para armazenar documentos, PDFs, uploads.
- **Implementação**: Nó nativo `n8n-nodes-base.googleDrive`
- **Auth**: Google OAuth2 (credential: `googleDriveOAuth2Api`)
- **Preferido para**: upload/download de arquivos, criação de pastas, gestão de documentos

---

## CRM

### Pipedrive ⭐ Preferido
CRM de vendas B2B. CRM principal da Playbook Lab e solução padrão para clientes.
- **Implementação**: Nó nativo `n8n-nodes-base.pipedrive`
- **Auth**: Pipedrive API Token (credential: `pipedriveApi`)
- **Preferido para**: gestão de deals, contatos, atividades e pipeline de vendas

### HubSpot
Plataforma de CRM e marketing automation. Usado quando o cliente opera em HubSpot.
- **Implementação**: Nó nativo `n8n-nodes-base.hubspot`
- **Auth**: HubSpot API Key ou OAuth2
- **Preferido para**: workflows de clientes que usam HubSpot

### Salesforce
CRM enterprise. Usado quando o cliente opera em Salesforce.
- **Implementação**: Nó nativo `n8n-nodes-base.salesforce`
- **Auth**: Salesforce OAuth2
- **Preferido para**: workflows de clientes enterprise com Salesforce

---

## WhatsApp

### MegaAPI ⭐ Preferido (API não-oficial)
API brasileira de WhatsApp não-oficial com nó de comunidade para n8n. Infraestrutura estável para automações de mensagens.
- **Implementação**: Nó de comunidade `n8n-nodes-megaapi` (instalar se disponível) OU HTTP Request
- **Auth**: Token da instância MegaAPI no header
- **Endpoints principais** (HTTP Request):
  - `POST /message/sendText/{instance}` — enviar mensagem de texto
  - `POST /message/sendMedia/{instance}` — enviar mídia
  - `GET /instance/connectionState/{instance}` — checar status da conexão
- **Preferido para**: envio de mensagens, notificações, chatbots WhatsApp

### ZAPI (API não-oficial)
Maior API de WhatsApp não-oficial do Brasil. Alternativa ao MegaAPI, principalmente via HTTP Request.
- **Implementação**: HTTP Request
- **Auth**: `Client-Token` no header da requisição
- **Base URL**: `https://api.z-api.io/instances/{instanceId}/token/{token}`
- **Endpoints principais**:
  - `POST /send-text` — enviar mensagem de texto
  - `POST /send-image` — enviar imagem
  - `GET /status` — checar status da instância
- **Preferido para**: quando o cliente já usa ZAPI ou MegaAPI não está disponível

---

## LinkedIn

### Unipile ⭐ Preferido
API multi-canal que abstrai o LinkedIn (e outros canais) com 500+ endpoints. Permite automação de mensagens, prospecção e gestão de conversas via HTTP Request.
- **Implementação**: HTTP Request
- **Auth**: Header `X-API-KEY: <token>` + URL base da instância do cliente
- **Base URL**: `https://api2.unipile.com:13149/api/v1`
- **Endpoints principais**:
  - `GET /linkedin/profiles/{profileId}` — buscar perfil
  - `POST /chats` — iniciar nova conversa
  - `POST /chats/{chatId}/messages` — enviar mensagem em conversa existente
  - `GET /chats` — listar conversas
  - `POST /linkedin/invitations` — enviar pedido de conexão
- **Rate limit**: ~100–150 mensagens/dia por conta LinkedIn
- **Preferido para**: automação de outreach no LinkedIn, mensagens, conexões

---

## Enriquecimento de Leads

### Apify ⭐ Preferido (scraping)
Plataforma de web scraping com centenas de atores prontos. Usado para scraping de dados de sites, LinkedIn, Instagram, Google Maps, etc.
- **Implementação**: Nó de comunidade (se instalado) OU HTTP Request
- **Auth**: Bearer Token (`Authorization: Bearer <APIFY_API_TOKEN>`)
- **Base URL**: `https://api.apify.com/v2`
- **Endpoints principais**:
  - `POST /acts/{actorId}/runs` — iniciar execução de ator
  - `GET /acts/{actorId}/runs/last/dataset/items` — buscar resultado do último run
  - `GET /datasets/{datasetId}/items` — buscar resultado por dataset ID
- **Parâmetro de teste**: sempre usar `maxItems: 2` nos primeiros testes
- **Preferido para**: qualquer necessidade de scraping (LinkedIn, Instagram, Google, sites)

### AnyMailFinder ⭐ Preferido (email lookup)
Serviço de busca de emails B2B verificados. Cobra apenas por emails confirmados como entregáveis.
- **Implementação**: HTTP Request
- **Auth**: Query param `api_key=<KEY>` ou header `Authorization: Token <KEY>`
- **Base URL**: `https://api.anymailfinder.com/v5.0`
- **Endpoints principais**:
  - `POST /search/person.json` — buscar email por nome + domínio/empresa
  - `POST /search/company.json` — buscar emails de tomadores de decisão de uma empresa
  - `POST /verify.json` — verificar se um email específico é válido
- **Campos obrigatórios para busca por pessoa**: `full_name`, `domain` (ou `company_name`)
- **Preferido para**: encontrar emails de prospects em campanhas de outbound

---

## Pesquisa / IA

### Tavily ⭐ Preferido (busca web para agentes)
API de busca web otimizada para agentes de IA. Retorna resultados limpos, sem ruído de SEO, ideal para uso dentro de AI Agents.
- **Implementação**: Nó de comunidade `@tavily/n8n-nodes-tavily` como **tool do AI Agent** OU HTTP Request standalone
- **Auth**: API Key no header ou credential dedicada do nó
- **Base URL**: `https://api.tavily.com`
- **Endpoints principais**:
  - `POST /search` — busca web com resultados curados para IA
  - `POST /extract` — extrair conteúdo de URLs específicas
- **Parâmetros relevantes**: `search_depth: "advanced"`, `include_answer: true`, `max_results: 5`
- **Preferido para**: AI Agents que precisam de pesquisa web em tempo real, enriquecimento de dados via busca

---

## Voz / Áudio

### ElevenLabs
Plataforma de síntese de voz com IA (text-to-speech). Gera áudio realista em múltiplas vozes e idiomas.
- **Implementação**: HTTP Request
- **Auth**: Header `xi-api-key: <KEY>`
- **Base URL**: `https://api.elevenlabs.io/v1`
- **Endpoints principais**:
  - `POST /text-to-speech/{voiceId}` — converter texto em áudio (retorna binário)
  - `GET /voices` — listar vozes disponíveis
- **Preferido para**: geração de áudios para WhatsApp, vídeos, notificações por voz

---

## Reuniões / Transcrição

### tldv
Ferramenta de gravação e transcrição de reuniões online (Google Meet, Zoom, Teams). Gera transcrições e resumos automáticos.
- **Implementação**: HTTP Request (API REST)
- **Auth**: Header `Authorization: Bearer <API_KEY>`
- **Base URL**: `https://api.tldv.io/v2`
- **Endpoints principais**:
  - `GET /meetings` — listar reuniões gravadas
  - `GET /meetings/{meetingId}` — detalhes de uma reunião
  - `GET /meetings/{meetingId}/transcript` — obter transcrição completa
- **Preferido para**: processar transcrições de calls, criar resumos automatizados, alimentar CRM com notas de reunião

---

## Tabela de Referência Rápida

| Categoria | Ferramenta Preferida | Implementação |
|-----------|---------------------|---------------|
| Planilha / Output | Google Sheets | Nó nativo |
| Banco de dados visual | Airtable | Nó nativo |
| Banco relacional | Postgres / Supabase | Nó nativo / HTTP Request |
| Arquivos | Google Drive | Nó nativo |
| CRM principal | Pipedrive | Nó nativo |
| CRM cliente (marketing) | HubSpot | Nó nativo |
| CRM cliente (enterprise) | Salesforce | Nó nativo |
| WhatsApp | MegaAPI | Nó comunidade / HTTP Request |
| LinkedIn outreach | Unipile | HTTP Request |
| Web scraping | Apify | Nó comunidade / HTTP Request |
| Email lookup | AnyMailFinder | HTTP Request |
| Busca web (agentes IA) | Tavily | Nó comunidade (AI Agent tool) |
| Síntese de voz | ElevenLabs | HTTP Request |
| Transcrição de reuniões | tldv | HTTP Request |
