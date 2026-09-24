# Credenciais e Tipos de Nós

Como obter typeVersion correto e trabalhar com credenciais via MCP.

---

## Como as credenciais funcionam

O MCP connector **não conecta credenciais automaticamente** aos nós. Os nós autenticados são criados com a estrutura correta (tipo de credencial, parâmetros), mas o vínculo com a credencial real precisa ser feito manualmente pelo usuário na UI do n8n após o build.

Fluxo correto:
1. Construir workflow com estrutura e parâmetros corretos via MCP
2. Testar lógica via `test_workflow` + pin data (funciona sem credencial)
3. Ao entregar, listar quais nós precisam de credencial conectada na UI
4. Usuário conecta credenciais (1 clique por nó no dropdown)
5. `execute_workflow` para verificação final real

---

## Como obter typeVersion correto

Use `get_node_types` diretamente:

```
get_node_types({ nodeIds: ["n8n-nodes-base.googleSheets"] })
→ Retorna a definição TypeScript completa do nó
→ Inclui typeVersion instalado na instância
→ Inclui parâmetros exatos e tipos de credencial esperados pelo nó
```

**CRÍTICO**: Copie o `typeVersion` EXATO do retorno. Não assuma versões de documentações externas — a versão instalada na instância é a única que funciona.

`get_node_types` retorna os **tipos** de credencial que o nó aceita (ex: `openAiApi`), não as credenciais reais configuradas na instância. Os IDs reais só existem na UI do n8n.

---

## Usando get_node_types

Para cada nó autenticado que você vai adicionar:

```
get_node_types({ nodeIds: ["n8n-nodes-base.slack"] })
```

Retorno contém:
- `type`: string completa do tipo (ex: `"n8n-nodes-base.slack"`)
- `typeVersion`: versão instalada (ex: `2.2`)
- `credentials`: tipos de credenciais suportados pelo nó
- `parameters`: todos os parâmetros e suas opções

Use essas informações diretamente no código do workflow.

---

## Tipos de credenciais comuns

Para referência — mas sempre confirme via `get_node_types`:

| Serviço | Credential Type |
|---------|-----------------|
| Slack | `slackApi`, `slackOAuth2Api` |
| Google Sheets | `googleSheetsOAuth2Api` |
| Gmail | `gmailOAuth2` |
| OpenAI | `openAiApi` |
| HTTP Request | `httpHeaderAuth`, `httpBasicAuth` |
| PostgreSQL | `postgres` |
| Airtable | `airtableTokenApi` |
| Notion | `notionApi` |
| Apify | `apifyApi` |
| Anthropic | `anthropicApi` |
| Pipedrive | `pipedriveApi` |
| ElevenLabs | `elevenLabsApi` |
| Tavily | `tavilyApi` |

---

## Nó não aparece em get_node_types

Se `get_node_types` retornar vazio ou erro para um nó:

```
Opções:
1. Tentar search_nodes({ queries: ["nome do serviço"] }) para encontrar o nome correto
2. O nó não está instalado na instância — informar o usuário
3. Usar HTTP Request como alternativa (com a API do serviço diretamente)
```

Nunca use um nó que não foi confirmado via `get_node_types`.
