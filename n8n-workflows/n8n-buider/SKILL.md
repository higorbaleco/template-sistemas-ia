---
name: n8n-builder
description: Build, test, and deploy n8n workflows via MCP tools with incremental testing. Expert automation for n8n. USE THIS SKILL WHEN user says "create workflow", "build automation", "deploy to n8n", "activate workflow", needs to list, update, delete, or test workflows, mentions webhook execution, checking executions, debugging workflow runs, asks about n8n nodes, expressions, credentials, or Code nodes, needs JavaScript or Python code for n8n Code nodes, mentions expressions, $json, $input, or $node references, or asks about AI Agent, OpenAI, Anthropic, Google Sheets, Airtable, Slack, or other n8n nodes.
---

# n8n Automation Skill

Build, test, and deploy n8n workflows via o **n8n MCP connector** (25 ferramentas conectadas — sem .env, sem curl).

> **Conexão já estabelecida.** O MCP do n8n está instalado e autenticado. Use os MCP tools diretamente, sem configuração adicional.

---

## When This Skill Loads (DO THIS IMMEDIATELY)

### Step 1: Read Reference Files
```
Use the Read tool to read these files NOW:
1. Read references/pitfalls.md (critical node config rules)
2. Read references/build-process.md (step-by-step build workflow with MCP tools)
3. Read references/toolstack.md (preferred tools by category)
```

### Step 2: Create a Todo List

After understanding the user's request, create a todo list using TaskCreate.

```
SKILL LOADS -> READ FILES IMMEDIATELY -> THEN respond to user
```

---

## MCP Tools Available (25 ferramentas)

### 🔍 Busca & Navegação
| Tool | Quando usar |
|------|-------------|
| `search_workflows` | Localizar workflows por nome/descrição antes de criar |
| `search_nodes` | Descobrir nós disponíveis para um serviço ou função |
| `search_projects` | Listar projetos acessíveis na instância |
| `search_folders` | Localizar pastas dentro de um projeto |
| `search_data_tables` | Localizar tabelas de dados existentes |

### ⚙️ Criação & Edição
| Tool | Quando usar |
|------|-------------|
| `get_sdk_reference` | Opcional — consultar documentação SDK apenas em builds complexos ou padrões não cobertos pelos arquivos de referência |
| `get_node_types` | **CRÍTICO** — Obter definição TypeScript exata de um nó (parâmetros, typeVersion) |
| `get_suggested_nodes` | Descobrir nós recomendados por categoria |
| `validate_workflow` | **OBRIGATÓRIO** — Validar código antes de criar ou atualizar |
| `create_workflow_from_code` | Criar um workflow novo |
| `update_workflow` | Atualizar workflow existente (equivale ao PUT da API REST) |

### 🧪 Teste & Execução
| Tool | Quando usar |
|------|-------------|
| `test_workflow` | Testar com pin data (sem chamar serviços externos — preferido) |
| `prepare_test_pin_data` | Gerar pin data realista para simulação |
| `execute_workflow` | Executar workflow real por ID (usa serviços externos) |
| `get_execution` | Consultar detalhes de uma execução — usar apenas para debugar falhas |
| `get_workflow_details` | Ver detalhes completos de um workflow existente |

### 📋 Ciclo de Vida
| Tool | Quando usar |
|------|-------------|
| `publish_workflow` | Ativar/publicar workflow (equivale ao /activate) |
| `unpublish_workflow` | Desativar (usar apenas intencionalmente, nunca durante build) |
| `archive_workflow` | Arquivar workflows obsoletos |

### 🗄️ Data Tables
| Tool | Quando usar |
|------|-------------|
| `create_data_table` | Criar nova tabela de dados |
| `add_data_table_column` | Adicionar coluna |
| `add_data_table_rows` | Inserir linhas |
| `rename_data_table` | Renomear tabela |
| `rename_data_table_column` | Renomear coluna |
| `delete_data_table_column` | Deletar coluna |

---

## Critical Rules

### 1. USE THE TOOLS THE USER SPECIFIES

**Se o usuário mencionar ferramentas, nós ou serviços específicos — USE-OS.**

```
User says "use Apify" -> You use Apify node
User says "use OpenAI" -> You use OpenAI Chat Model
```

Never substitute, skip, or defer user-requested tools.

### 2. NEVER Simplify When Hitting Errors — FIX THE ISSUE

```
Loop node has error -> Debug why -> Fix the loop configuration
```

Não troque para abordagens "mais simples". Mantenha a arquitetura correta.

### 3. Sempre use get_node_types antes de adicionar um nó autenticado

Antes de adicionar qualquer nó que exige credencial, chame `get_node_types` para obter:
- O `typeVersion` exato instalado na instância
- Os parâmetros e estrutura corretos do nó
- Confirmar que o nó existe na instância

```
Vai adicionar Google Sheets? -> get_node_types({ nodeIds: ["n8n-nodes-base.googleSheets"] }) primeiro
Vai adicionar Slack?         -> get_node_types({ nodeIds: ["n8n-nodes-base.slack"] }) primeiro
```

Para nós simples sem credencial (Set, If, Code, Merge), `get_node_types` é opcional.

### 4. Always Validate Before Create/Update

**OBRIGATÓRIO**: Chame `validate_workflow` antes de qualquer `create_workflow_from_code` ou `update_workflow`.

```
validate_workflow -> se OK -> create/update
validate_workflow -> se ERRO -> corrigir -> validate_workflow novamente
```

### 5. Test at Logical Checkpoints — Not After Every Node

Não é necessário testar após cada nó individualmente. Teste em **checkpoints lógicos**:

```
Checkpoint 1: após o trigger (confirmar que o flow inicia)
Checkpoint 2: após a lógica principal (confirmar transformações e condições)
Checkpoint 3: antes de publicar (verificação final da estrutura completa)
```

Seções simples de nós encadeados (ex: Set → If → Set) podem ser adicionadas e validadas juntas antes do próximo teste.

### 6. NEVER Archive/Unpublish Workflows — UPDATE Instead

```
Node fails -> Debug the error -> Update the same workflow
```

Um workflow ID para todo o processo de build.

### 7. Use Native Nodes First

| Priority | Use When |
|----------|----------|
| 1. Native node | Built-in exists (Slack, Sheets, etc.) |
| 2. AI Agent node | For ANY AI/LLM task |
| 3. Loop node | For processing multiple items |
| 4. HTTP Request | Native has issues OR no node exists |
| 5. Code node | Complex logic only |

### 8. No Placeholder Values in Node Config

Nunca deixe valores "REPLACE_ME", URLs fictícias ou IDs falsos na configuração dos nós.

> **Pin data para testes é diferente**: gerar dados simulados via `prepare_test_pin_data` para validar a lógica do workflow é o comportamento correto e esperado — não confundir com placeholder em produção.

### 9. Prefer test_workflow Over execute_workflow

`test_workflow` simula a execução com pin data sem chamar serviços externos. Use-o em todos os checkpoints de build.

`execute_workflow` faz chamadas reais — use apenas na verificação final, após o usuário conectar as credenciais na UI.

`get_execution` é para **debug de falhas** apenas. Não faz parte do loop padrão de teste.

### 10. Only Work With User-Specified Workflows

Nunca verifique, execute ou modifique workflows que o usuário não mencionou.

### 11. Credenciais: Estrutura Primeiro, Vinculação pelo Usuário

O MCP connector **não consegue conectar credenciais automaticamente** aos nós. Os nodes autenticados são criados com a estrutura correta (tipo de credencial, parâmetros), mas o vínculo com a credencial real precisa ser feito manualmente pelo usuário na UI do n8n.

Fluxo correto:
```
1. Construir workflow completo com estrutura correta
2. Testar lógica via test_workflow + pin data (valida tudo sem credenciais)
3. Ao entregar, listar quais nós precisam de credencial conectada na UI
4. Usuário conecta credenciais (1 clique por nó no dropdown)
5. execute_workflow para verificação final real
```

---

## Build Process Summary

### Step 0: Discover (If Needed)
```
search_workflows -> verificar se já existe workflow similar
get_node_types   -> obter typeVersion exato dos nós autenticados que serão usados
```

`get_sdk_reference` apenas se o build usar padrões avançados não cobertos pelos arquivos de referência locais.

### Step 1: Create Workflow with Trigger
```
1. get_node_types para o tipo de trigger escolhido
2. validate_workflow com apenas o trigger
3. create_workflow_from_code
4. test_workflow — Checkpoint 1
```

### Step 2: Add Nodes in Logical Groups
```
1. get_node_types para nós autenticados do grupo
2. Adicionar grupo de nós ao código do workflow
3. validate_workflow
4. update_workflow
5. test_workflow com pin data — Checkpoint 2
6. Se ERRO -> get_execution para detalhar a falha -> corrigir -> repetir a partir de validate_workflow
7. Se OK -> próximo grupo
```

### Step 3: Final Delivery
```
1. Notificar usuário quais nós precisam de credencial conectada na UI do n8n
2. Usuário conecta credenciais
3. execute_workflow (execução real com dados reais) — Checkpoint 3
4. Se ERRO -> get_execution para detalhar -> corrigir
5. Se OK -> publish_workflow para ativar
6. Reportar resultado ao usuário
```

---

## Node Selection Flow

**Before adding any authenticated node:**

```
1. get_node_types({ nodeIds: ["tipo-do-no"] }) para typeVersion e parâmetros corretos
2. Leia o arquivo de referência relevante (triggers.md, ai-nodes.md, etc.)
3. Se nó de DATABASE -> buscar schema com nó getSchema temporário
4. Adicionar nó com config correta
5. validate_workflow antes de update
```

---

## Expression Quick Reference

```javascript
// Webhook body (CRITICAL - data is under .body!)
{{ $json.body.fieldName }}

// Other node reference
{{ $('Node Name').item.json.field }}

// Default value
{{ $json.field ?? 'default' }}

// Safe access
{{ $json.obj?.nested?.field }}

// Current date
{{ $now.toFormat('yyyy-MM-dd') }}
```

**In Code nodes, use plain JavaScript — NOT `{{ }}`:**
```javascript
const data = $input.first().json.body;
return [{ json: { result: data.fieldName } }];
```

---

## Code Node Quick Reference

### JavaScript
```javascript
const items = $input.all();
const first = $input.first().json;
const data = $('Node Name').first().json;
return [{ json: { result: 'value' } }];
```

### Python
```python
items = _input.all()
first = _input.first().json
return [{"json": {"result": "value"}}]
```

---

## Testing Strategy

### Durante o build (sem credenciais)
```
1. prepare_test_pin_data -> gerar dados simulados para nós autenticados
2. test_workflow          -> simular execução completa (sem chamadas externas)
```

`test_workflow` já retorna o resultado da execução. **Não chame `get_execution` na sequência** — é redundante. Use `get_execution` apenas se `test_workflow` retornar falha e precisar de mais detalhe para debugar.

**Não avance até o próximo checkpoint sem status = "success".**

### Verificação final (com credenciais conectadas pelo usuário)
```
1. execute_workflow -> execução real
2. Se ERRO -> get_execution para detalhar a falha
3. Se OK -> publish_workflow -> ativar
```

---

## What to Report to User

**After successful build:**
```
Build concluído — checkpoints validados:
1. Trigger — OK
2. [Lógica principal] — OK (ex: 3 itens processados)
3. Estrutura completa — OK

Workflow: [Nome]
Status: pronto para ativação

Nós que precisam de credencial conectada na UI do n8n:
- [Nome do nó] → selecionar credencial "[Tipo]" no dropdown
- [Nome do nó] → selecionar credencial "[Tipo]" no dropdown

Após conectar, executar uma vez para confirmar e publicar.
```

---

## Reference Files

Leia conforme necessário com a ferramenta Read:

### Build & Pitfalls
| File | Contents |
|------|----------|
| [references/build-process.md](references/build-process.md) | Fluxo passo a passo com MCP tools |
| [references/pitfalls.md](references/pitfalls.md) | **CRÍTICO**: Erros comuns e como debugar |
| [references/api-reference.md](references/api-reference.md) | Mapeamento completo dos MCP tools |
| [references/toolstack.md](references/toolstack.md) | **Stack preferido**: ferramentas por categoria, como implementar cada uma |

### Node Reference
| File | Contents |
|------|----------|
| [references/triggers.md](references/triggers.md) | Webhook, Schedule, Form, Chat e outros triggers |
| [references/ai-nodes.md](references/ai-nodes.md) | AI Agent, OpenAI/Anthropic Chat Models, Memory, Vector Store |
| [references/data-nodes.md](references/data-nodes.md) | Google Sheets, Airtable, Notion, Postgres, Slack, Gmail, etc. |
| [references/transform-nodes.md](references/transform-nodes.md) | Set, If, Switch, Filter, Merge, Code, HTTP Request, Loops |

### Code & Expressions
| File | Contents |
|------|----------|
| [references/javascript.md](references/javascript.md) | JavaScript patterns para Code nodes |
| [references/python.md](references/python.md) | Python patterns para Code nodes |
| [references/node-config.md](references/node-config.md) | Configurações de nós e padrões de workflow |
| [references/expressions.md](references/expressions.md) | Sintaxe de expressões (`{{ $json.field }}`) |
| [references/credentials.md](references/credentials.md) | Como obter typeVersion e credenciais via MCP |
