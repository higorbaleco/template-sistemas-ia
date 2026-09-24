# MCP Tools Reference

Mapeamento completo das 25 ferramentas do n8n MCP connector. Use estas ferramentas diretamente — sem curl, sem .env, sem API key manual.

## Contents
- [Busca & Navegação](#busca--navegação)
- [Descoberta de Nós](#descoberta-de-nós)
- [Criação & Edição de Workflows](#criação--edição-de-workflows)
- [Teste & Execução](#teste--execução)
- [Ciclo de Vida](#ciclo-de-vida)
- [Data Tables](#data-tables)
- [Mapeamento: API REST → MCP Tool](#mapeamento-api-rest--mcp-tool)

---

## Busca & Navegação

### search_workflows
Busca workflows por nome ou descrição.
```
search_workflows(query="nome do workflow")
→ Usar ANTES de criar para evitar duplicatas
→ Usar para localizar workflows existentes a atualizar
```

### search_nodes
Busca nós disponíveis na instância por serviço ou função.
```
search_nodes(query="google sheets")
search_nodes(query="http request")
→ Usar quando não sabe o nome exato do tipo de nó
```

### search_projects
Lista projetos acessíveis na instância n8n.

### search_folders
Busca pastas dentro de um projeto.

### search_data_tables
Localiza tabelas de dados existentes.

---

## Descoberta de Nós

### get_node_types ⭐ CRÍTICO
Retorna a definição TypeScript completa de um nó — parâmetros exatos, typeVersion instalado, estrutura de credenciais.

```
get_node_types({ nodeIds: ["n8n-nodes-base.googleSheets"] })
get_node_types({ nodeIds: ["n8n-nodes-base.webhook"] })
get_node_types({ nodeIds: ["n8n-nodes-base.openAi"] })
get_node_types({ nodeIds: ["n8n-nodes-base.slack"] })
get_node_types({ nodeIds: ["n8n-nodes-base.airtable"] })
```

**Use ANTES de adicionar qualquer nó que requer credencial.**
O retorno contém o `typeVersion` exato instalado na instância — copie-o sem alterar.

### get_suggested_nodes
Retorna nós recomendados por categoria ou caso de uso.
```
get_suggested_nodes(category="data")
get_suggested_nodes(category="communication")
→ Usar quando não sabe qual nó usar para um objetivo
```

### get_sdk_reference
Documentação do SDK n8n — padrões de código, estrutura de workflows, expressões.
```
get_sdk_reference()
→ Opcional — usar apenas em builds complexos ou padrões não cobertos pelos arquivos de referência locais
→ Não chamar por padrão em todo build
```

---

## Criação & Edição de Workflows

### validate_workflow ⭐ OBRIGATÓRIO
Valida o código do workflow antes de criar ou atualizar.
```
validate_workflow(code)
→ SEMPRE chamar antes de create_workflow_from_code
→ SEMPRE chamar antes de update_workflow
→ Se retornar erros: corrigir → validate novamente
→ Só prosseguir quando validação OK
```

### create_workflow_from_code
Cria um novo workflow a partir do código SDK.
```
create_workflow_from_code(code, name="Nome do Workflow")
→ Salvar o workflowId retornado — usar para todos os updates
→ Chamar validate_workflow ANTES
```

### update_workflow
Atualiza um workflow existente (equivale ao PUT da API REST).
```
update_workflow(workflowId, updatedCode)
→ Usar para ADICIONAR nós incrementalmente
→ Nunca criar novo workflow para corrigir — sempre update
→ Chamar validate_workflow ANTES
```

### get_workflow_details
Retorna detalhes completos de um workflow existente.
```
get_workflow_details(workflowId)
→ Usar para inspecionar estrutura atual antes de atualizar
→ Útil para debug
```

---

## Teste & Execução

### prepare_test_pin_data
Gera pin data realista para simular a saída de um nó sem chamadas externas.
```
prepare_test_pin_data(workflowId, nodeName)
→ Chamar para o nó ANTERIOR ao que está sendo testado
→ Retorna dados que simulam a saída real do nó
```

### test_workflow ⭐ PREFERIDO DURANTE BUILD
Testa o workflow com pin data — sem chamar serviços externos.
```
test_workflow(workflowId, pinData)
→ Usar nos checkpoints de build (seguro, sem consumo de APIs)
→ Já retorna o resultado da execução — não é necessário chamar get_execution na sequência
→ Usar get_execution apenas se test_workflow retornar falha e precisar de mais detalhe
```

### execute_workflow
Executa o workflow real, chamando APIs externas.
```
execute_workflow(workflowId)
→ Usar APENAS na verificação final (consome créditos/APIs reais)
→ Não usar durante build incremental
→ Executar após todos os nós testados com test_workflow
```

### get_execution
Consulta detalhes de uma execução específica. **Usar apenas para debug de falhas.**
```
get_execution(executionId)
→ Verificar: status = "success" | "error" | "running"
→ Verificar: quais nós executaram (runData)
→ Ver dados de saída de cada nó
→ Ver detalhes de erro quando status = "error"

Não chamar automaticamente após test_workflow — use apenas quando houver falha a investigar.
```

---

## Ciclo de Vida

### publish_workflow
Ativa/publica um workflow em produção.
```
publish_workflow(workflowId)
→ Chamar APENAS após teste completo e aprovação
→ Equivale ao POST /api/v1/workflows/{id}/activate da API REST
```

### unpublish_workflow
Desativa um workflow.
```
unpublish_workflow(workflowId)
→ Usar SOMENTE quando quiser parar um workflow intencionalmente
→ NUNCA usar durante o processo de build/update
```

### archive_workflow
Arquiva um workflow obsoleto.
```
archive_workflow(workflowId)
→ Usar apenas para workflows que não serão mais usados
→ NUNCA usar como substituto para update
```

---

## Data Tables

```
create_data_table(name, columns)
add_data_table_column(tableId, columnName, columnType)
add_data_table_rows(tableId, rows)
rename_data_table(tableId, newName)
rename_data_table_column(tableId, columnId, newName)
delete_data_table_column(tableId, columnId)
```

---

## Mapeamento: API REST → MCP Tool

Para quem vem da versão anterior da skill (baseada em curl):

| Operação REST | MCP Tool |
|---------------|----------|
| `POST /api/v1/workflows` | `create_workflow_from_code` |
| `PUT /api/v1/workflows/{id}` | `update_workflow` |
| `POST /api/v1/workflows/{id}/activate` | `publish_workflow` |
| `POST /api/v1/workflows/{id}/deactivate` | `unpublish_workflow` |
| `GET /api/v1/workflows/{id}` | `get_workflow_details` |
| `GET /api/v1/executions/{id}` | `get_execution` |
| `POST /webhook/{path}` | `execute_workflow` |
| (não existia) | `validate_workflow` |
| (não existia) | `get_node_types` |
| (não existia) | `test_workflow` |
| (não existia) | `prepare_test_pin_data` |
