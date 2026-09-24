# MCP da Máquina Comercial Avraham

Este diretório prepara a conexão do agente ao n8n. O MCP recomendado é o **Instance-level MCP nativo do n8n**. Ele expõe busca, leitura, teste, criação e edição de workflows conforme as permissões concedidas. Não é necessário instalar um MCP por ALA.

## Estado atual da instância local

- Container: `avraham-n8n`
- Versão verificada: `2.37.10`
- Endpoint: `http://localhost:5678/mcp-server/http`
- MCP nativo: habilitado por ambiente
- Cliente Codex: `avraham_n8n` autenticado via OAuth
- Workflows expostos: nenhum habilitado por este setup ainda

Depois de reiniciar a sessão do Codex, o builder poderá usar as ferramentas MCP. A autenticação OAuth fica armazenada pelo cliente; nenhum token foi escrito no repositório.

## O que será um MCP e o que será um nó do n8n

| Superfície | Implementação | MCP separado? |
|---|---|---|
| Construir, validar, testar e executar workflows | MCP nativo do n8n | Sim, um servidor n8n |
| Google Maps / Apify | Nó Apify ou HTTP Request no n8n | Não |
| Pesquisa web / Tavily | Tool do AI Agent ou HTTP Request no n8n | Não |
| WhatsApp / Z-API / MegaAPI | Adaptador HTTP ou nó de comunidade no n8n | Não |
| LinkedIn / Unipile | HTTP Request no n8n | Não |
| Instagram | Adaptador disponível no provedor escolhido | Não |
| CRM Avraham | Operações REST, banco ou adaptador definido após inspeção | Não |
| Agenda | Integração escolhida no n8n | Não |
| Postgres/Supabase | Nó nativo ou HTTP Request no n8n | Não |

Os MCPs externos opcionais, como um servidor de conhecimento `n8n-mcp`, não substituem o MCP nativo de gerenciamento. Só devem ser adicionados se a instância n8n não tiver o MCP nativo ou se for necessário consultar documentação de nós sem acessar a instância.

## Ativação do MCP nativo

1. Na instância n8n, abrir **Settings → Instance-level MCP**. Para esta instância local, o compose habilita `N8N_MCP_MANAGED_BY_ENV=true` e `N8N_MCP_ACCESS_ENABLED=true`.
2. Habilitar **MCP access** com uma conta owner/admin.
3. Usar **Connect → API key** ou OAuth. OAuth é preferível quando disponível.
4. Expor apenas workflows publicados que tenham trigger elegível. Começar com workflows de teste; não expor cadências de produção sem revisão.
5. Copiar o Server URL e o token uma única vez. O token não deve ser salvo neste repositório.
6. Adicionar o bloco de `codex-n8n.toml.example` à configuração do cliente, substituindo os valores pelos reais ou usando a configuração gerada pelo diálogo Connect.
7. Reiniciar o cliente e confirmar a conexão listando workflows. Depois habilitar os workflows aprovados individualmente.

O n8n exige que cada workflow seja explicitamente disponibilizado ao MCP. A busca pode encontrar previews de workflows acessíveis, mas leitura completa, execução ou edição dependem dessa permissão. Workflows novos só serão automaticamente expostos se a opção de auto-expose estiver habilitada na instância.

## Configuração de cliente

Veja [codex-n8n.toml.example](codex-n8n.toml.example). A configuração não é instalada automaticamente porque o endereço da instância e o token não foram fornecidos. Não substituir esses campos por valores fictícios.

Se o n8n estiver atrás de proxy, encaminhar os headers `MCP-Protocol-Version`, `Mcp-Method` e `Mcp-Name`. Se a instância for self-hosted, confirmar que `N8N_DISABLED_MODULES` não contém `mcp`.

## Fallback local opcional

O pacote comunitário `n8n-mcp` pode ser executado via `npx n8n-mcp`, mas ele exige URL da API n8n e uma API key e tem escopo diferente do MCP nativo. Não instalar nem ativar o fallback até confirmar que a instância não oferece Instance-level MCP. Se for necessário, preencher a configuração no arquivo separado `codex-n8n-community.toml.example`.

## Ordem de concessão

1. Acesso de leitura e busca.
2. Teste manual com workflow de staging.
3. Criação/edição de workflows.
4. Execução manual.
5. Publicação/ativação somente depois dos testes e da conexão das credenciais dos nós.

O MCP do n8n não recebe automaticamente as credenciais de Apify, Tavily, canais, CRM ou banco. Elas continuam sendo conectadas no editor do n8n. O MCP deve permanecer sem acesso a tokens em arquivos de workflow, prompts ou logs.

## Pré-requisitos pendentes

- URL da instância n8n e versão instalada.
- Método de autenticação escolhido e token gerado no próprio n8n.
- Conta owner/admin para habilitar Instance-level MCP.
- Lista inicial de workflows de staging a expor.
- Interfaces reais do CRM Avraham.
- Credenciais de cada provedor antes de qualquer execução real.

Sem esses dados, este diretório é uma preparação segura e revisável; não há MCP conectado nem workflows publicados por ele.
