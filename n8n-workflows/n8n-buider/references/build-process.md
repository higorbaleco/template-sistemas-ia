# Build Process

Fluxo passo a passo para construir workflows n8n via MCP tools, com testes em checkpoints lógicos.

## Contents
- [A Regra de Ouro](#a-regra-de-ouro)
- [Fluxo Completo](#fluxo-completo)
- [Requisitos de Teste](#requisitos-de-teste)
- [Exemplo de Build](#exemplo-de-build)

---

## A Regra de Ouro

```
CONSTRUA EM GRUPOS LÓGICOS → VALIDE → ATUALIZE → TESTE NO CHECKPOINT → PRÓXIMO GRUPO
```

Não é necessário testar após cada nó individualmente. Agrupe nós por função e teste nos checkpoints:

```
Checkpoint 1: Trigger criado e funcionando
Checkpoint 2: Lógica principal construída (transformações, condições, chamadas de API)
Checkpoint 3: Workflow completo antes de publicar

❌ ERRADO:
   Webhook → validate → test → Scraper → validate → test → Transform → validate → test...
   (overhead desnecessário para grupos simples)

✅ CORRETO:
   Webhook → validate → create → test ✓  (Checkpoint 1)
   Scraper + Transform → validate → update → test ✓  (Checkpoint 2)
   Sheets + Notify → validate → update → test ✓  (Checkpoint 3)
   Pronto!
```

Exceção: se um nó for complexo ou crítico (AI Agent, Loop, lógica de branching), teste-o individualmente antes de avançar.

---

## Fluxo Completo

### Passo 0: Descoberta

Antes de criar qualquer coisa, verifique o que já existe e obtenha os tipos corretos dos nós autenticados:

```
search_workflows(query="nome aproximado")
  → verificar se já existe workflow similar

get_node_types({ nodeIds: ["n8n-nodes-base.webhook", "n8n-nodes-base.googleSheets"] })
  → obter typeVersion exato e parâmetros corretos para nós autenticados
```

`get_sdk_reference` é opcional — usar apenas se o build envolver padrões avançados não cobertos pelos arquivos de referência.

Se banco de dados envolvido:
```
get_node_types({ nodeIds: ["n8n-nodes-base.postgres"] })
  → confirmar nó disponível, obter typeVersion
  → criar workflow temporário com getSchema para buscar campos reais
```

### Passo 1: Criar Workflow com Trigger

```
1. get_node_types({ nodeIds: ["n8n-nodes-base.webhook"] })  // ou o trigger escolhido
2. Escrever código do workflow com trigger apenas
3. validate_workflow(code)
   → se ERRO: corrigir → validate_workflow novamente
   → se OK: prosseguir
4. create_workflow_from_code(code)
   → salvar o workflow ID retornado
5. prepare_test_pin_data(workflowId, triggerNodeName)
6. test_workflow(workflowId, pinData)
   → verificar status = "success" — Checkpoint 1 ✓
   → se ERRO: get_execution para detalhar a falha → corrigir
```

**Salve o workflow ID — use-o para TODAS as atualizações.**

### Passo 2: Adicionar Nós em Grupos Lógicos

```
1. get_node_types({ nodeIds: ["nó-autenticado-1", "nó-autenticado-2"] })
   → apenas para nós que exigem credencial ou têm parâmetros complexos
   → nós simples (Set, If, Code, Merge) não precisam de get_node_types
2. Adicionar grupo de nós ao código do workflow
3. validate_workflow(updatedCode)
   → se ERRO: corrigir → validate_workflow novamente
   → se OK: prosseguir
4. update_workflow(workflowId, updatedCode)
5. prepare_test_pin_data(workflowId, nodeName)
6. test_workflow(workflowId, pinData)
   → verificar status = "success" — Checkpoint 2 ✓
   → se ERRO: get_execution para detalhar a falha → corrigir → repetir a partir de validate_workflow
```

**Repita para cada grupo lógico de nós.**

### Passo 3: Entrega e Verificação Final

```
1. Notificar usuário quais nós precisam de credencial conectada na UI do n8n
2. Usuário conecta credenciais (1 clique por nó no dropdown)
3. execute_workflow(workflowId)
   → execução real com chamadas reais a serviços externos
   → se ERRO: get_execution para detalhar a falha → corrigir
4. publish_workflow(workflowId)
   → ativar workflow em produção
5. Reportar resultado completo ao usuário
```

---

## Requisitos de Teste

### Preferir test_workflow Sobre execute_workflow Durante o Build

```
❌ ERRADO durante build: execute_workflow (chama APIs reais, consome créditos)
✅ CORRETO durante build: test_workflow com pinData (simulação segura)
✅ CORRETO na verificação final: execute_workflow com dados reais (após credenciais conectadas)
```

### get_execution é para Debug, Não para Rotina

`test_workflow` já retorna o resultado da execução. Não chame `get_execution` automaticamente após cada teste — é redundante.

Use `get_execution` apenas quando `test_workflow` retornar falha e precisar de mais detalhe para identificar o nó com problema.

### Teste com 2 Itens

Quando configurar nós que buscam dados:
- Apify/scraper: `maxResults: 2`
- HTTP Request: `?limit=2`
- Queries de banco: `LIMIT 2`
- Nós de busca: limitar a 2 resultados

### Um Workflow, Atualizações Incrementais

- Criar workflow UMA VEZ com `create_workflow_from_code` → obter workflow ID
- Todas as mudanças usam `update_workflow` no MESMO workflow ID
- Nunca criar novo workflow para testar ou corrigir

---

## Exemplo de Build

```
✓ Passo 0: get_node_types({ nodeIds: ["n8n-nodes-base.webhook", "n8n-nodes-base.googleSheets"] })
           → typeVersions confirmados

✓ Passo 1: validate → create_workflow_from_code (só webhook)
           test_workflow → status: success → Checkpoint 1 ✓

✓ Passo 2: update_workflow (+ HTTP Request + Set/Transform juntos)
           validate → update → test_workflow → status: success → Checkpoint 2 ✓

✓ Passo 2: get_node_types({ nodeIds: ["n8n-nodes-base.googleSheets"] })
           validate → update_workflow (+ Google Sheets)
           test_workflow → status: success → Checkpoint 3 ✓

✓ Passo 3: Notificar: "Google Sheets precisa de credencial na UI"
           Usuário conecta → execute_workflow → status: success (dados reais)
           publish_workflow → ativo em produção ✓
```

### ERRADO vs CORRETO

**ERRADO:**
```
create_workflow (webhook + scraper + AI + sheets) → test → erro → ???
```

**CORRETO:**
```
create (webhook) → validate → test ✓  [Checkpoint 1]
update (+ scraper + transform) → validate → test ✓  [Checkpoint 2]
update (+ AI agent) → validate → test ✓  [Checkpoint 3 — AI separado por ser complexo]
update (+ sheets) → validate → test ✓  [Checkpoint 4]
notificar credenciais → execute real → publish → done ✓
```
