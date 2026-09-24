# Common Pitfalls

Erros comuns a evitar e como debugar problemas.

## Contents
- [Erros de Configuração de Nó](#erros-de-configuração-de-nó)
- [Erros de Loop (Split in Batches)](#erros-de-loop-split-in-batches)
- [Erros do Airtable](#erros-do-airtable-crítico)
- [Erros Críticos de Build](#erros-críticos-de-build)
- [Erros de MCP Tool](#erros-de-mcp-tool)
- [Handling de Erros](#handling-de-erros)
- [Debugging](#debugging)

---

## Erros de Configuração de Nó

### "Install this node to use it" / Nó não instalado

Este erro significa que o `typeVersion` ou tipo do nó não está instalado na instância.

**Como evitar:**
```
SEMPRE chamar get_node_types ANTES de adicionar qualquer nó autenticado.
Copiar o typeVersion EXATO retornado — nunca assumir ou usar documentação externa.
```

**Debugging:**
```
get_node_types({ nodeIds: ["n8n-nodes-base.nomeDono"] })
→ Se retornar vazio ou erro: nó não está instalado
→ Se retornar dados: usar typeVersion do retorno, não de documentação
```

---

## Erros de Loop (Split in Batches)

### Output 0 vs Output 1 — O erro #1 em loops

**Output 0 e Output 1 NÃO são intercambiáveis!**

```
Split In Batches outputs:
- Output 0 = DONE (itens chegam aqui APÓS todo processamento)
- Output 1 = LOOP (batch atual para processar)
```

❌ **Errado**: Conectar processamento ao output 0
```json
"Loop Over Items": {
  "main": [
    [{ "node": "Process Item", "type": "main", "index": 0 }],  // ERRADO! Output 0 = done
    []
  ]
}
```

✅ **Correto**: Conectar processamento ao output 1
```json
"Loop Over Items": {
  "main": [
    [],                                                         // Output 0: done (vazio ou passo final)
    [{ "node": "Process Item", "type": "main", "index": 0 }]   // Output 1: loop (processamento aqui!)
  ]
}
```

**Sintomas de output errado:**
- Loop executa apenas uma vez
- Nó de processamento não executa
- Workflow ativa mas itens não são processados

---

## Erros do Airtable (CRÍTICO)

### Airtable NÃO suporta criação de tabelas via n8n

❌ **Errado**: Tentar `resource: "table"` com `operation: "create"`
✅ **Correto**: Usuário cria tabelas manualmente na UI do Airtable. n8n suporta apenas operações em records.

### Parâmetros diferentes: Data Node vs Trigger

| Tipo de Nó | Parâmetro Base | Parâmetro Tabela |
|------------|----------------|------------------|
| Airtable (data node v2.1) | `base` | `table` |
| Airtable Trigger (v1) | `baseId` | `tableId` |

❌ **Errado no data node**: Usar `baseId` e `tableId`
✅ **Correto no data node**: Usar `base` e `table`

### Nomes de campos devem ser EXATOS

❌ `"GoogleMapsURL"` → ✅ `"Google Maps URL"`

**Solução**: Usar operação `getSchema` primeiro para obter nomes exatos dos campos.

---

## Erros Críticos de Build

### Usar HTTP Request quando existe nó nativo

❌ Usar HTTP Request para chamar a API do Slack quando `n8n-nodes-base.slack` existe
✅ Usar o nó nativo com credenciais da instância

**Exceção**: Nó nativo tem bug conhecido ou funcionalidade ausente.

### Adicionar todos os nós de uma vez sem checkpoint

❌ Adicionar Nó A → B → C → D → testar → erro (qual falhou? impossível saber)
✅ Construir em grupos lógicos → validate → update → test no checkpoint → próximo grupo

### Usar dados mock

❌ `"url": "https://api.example.com/placeholder"` / `"documentId": "REPLACE_ME"`
✅ Usar valores reais. Se não tiver, perguntar ao usuário — nunca inventar.

### Criar novo workflow para corrigir erro

❌ Criar workflow novo a cada erro/iteração
✅ Usar `update_workflow` no MESMO workflow ID. Um ID para todo o build.

---

## Erros de MCP Tool

### Pular validate_workflow antes de create/update

❌ `create_workflow_from_code(code)` sem validar antes
✅ Sempre: `validate_workflow(code)` → se OK → `create_workflow_from_code(code)`

Se validate retornar erros → corrigir → validate novamente → só então criar/atualizar.

### Usar execute_workflow durante o build

❌ Usar `execute_workflow` para cada nó adicionado (chama APIs reais, consome créditos)
✅ Usar `test_workflow` com pin data durante o build. Reservar `execute_workflow` para a verificação final.

### Esquecer de salvar o workflowId

❌ Chamar `create_workflow_from_code` sem salvar o ID retornado
✅ Salvar imediatamente o `workflowId` do retorno — é necessário para todo update, test e publish subsequente.

### Arquivar/unpublish em vez de atualizar

❌ `archive_workflow` ou `unpublish_workflow` para "resetar" durante o build
✅ Sempre `update_workflow`. Nunca arquivar um workflow que está em desenvolvimento.

### Google Sheets sem documentId

Se Google Sheets for adicionado sem o ID da planilha, o `test_workflow` vai falhar com `WorkflowHasIssuesError`.

Solução: pedir o URL da planilha ao usuário e extrair o ID:
```
URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
ID: a parte entre /d/ e /edit
```

---

## Handling de Erros

### Erros comuns no get_execution

| Status/Erro | Significado | Solução |
|-------------|-------------|---------|
| `status: "error"` | Execução falhou | Ver campo `error` no retorno |
| `WorkflowHasIssuesError` | Nó com configuração incompleta | Verificar campos obrigatórios vazios |
| Nó não aparece em runData | Nó não foi conectado corretamente | Verificar connections no código |
| Loop executa 1x | Output errado no Split in Batches | Output 1 para processar, Output 0 para done |

### validate_workflow retorna erros

Se `validate_workflow` retornar erros antes de create/update:
1. Ler cada erro com atenção
2. Corrigir o problema específico apontado
3. Chamar `validate_workflow` novamente
4. Só chamar `create_workflow_from_code` / `update_workflow` quando validação OK

---

## Debugging

### Verificar resultado de uma execução

```
get_execution(executionId)
→ Checar: status (success/error/running)
→ Checar: runData — quais nós executaram
→ Checar: dados de saída de cada nó
→ Checar: campo error para detalhes do erro
```

### Nó não aparece no runData

Causas comuns:
1. Conexão entre nós configurada incorretamente
2. Condição de If/Switch não satisfeita
3. Split in Batches com output index errado
4. Nó nunca recebeu dados de entrada

**Debug**: Revisar as `connections` no código do workflow. Cada nó deve ter source e target corretos.

### Workflow ativa mas não executa

```
1. get_workflow_details(workflowId)  → confirmar que está published/active
2. Verificar o tipo de trigger configurado
3. Para Schedule trigger: verificar cron expression
4. Para Webhook trigger: confirmar URL do webhook
```

### Nó com typeVersion incorreto

```
1. get_node_types({ nodeIds: ["n8n-nodes-base.nomeDono"] })
2. Copiar o typeVersion EXATO retornado
3. update_workflow com o typeVersion correto
4. validate_workflow → update_workflow
```

---

## Regra de Ouro para Debug

**Não reporte sucesso sem testar. Não avance sem confirmar.**

```
❌ ERRADO: "Workflow criado! Teste você mesmo."
✅ CORRETO: Testar via test_workflow → get_execution → confirmar success → reportar
```
