# Matriz de MCPs e integrações

O único MCP necessário para o builder é o MCP nativo do n8n. Os demais itens são capacidades de workflows e não devem virar servidores MCP independentes sem uma justificativa operacional.

| Capacidade | Primeira implementação prevista | Credencial necessária | Bloqueio atual |
|---|---|---|---|
| Gerenciamento n8n | Instance-level MCP nativo | OAuth ou token MCP | URL/token e habilitação na instância |
| Descoberta Google Maps | Apify node/API | Apify token | Ator, conta e limites |
| Enriquecimento web | Tavily AI tool/API | Tavily key | Chave e política de fontes |
| WhatsApp | Adaptador Z-API/MegaAPI | Token/instância do provedor | Provedor escolhido e endpoint |
| LinkedIn | Unipile via HTTP Request | X-API-KEY | Conta e base URL |
| Instagram | Provedor/aplicação aprovada | Token do provedor | Adaptador e política de uso |
| CRM Avraham | REST, banco ou adaptador | Conforme interface real | API/schema não confirmado |
| Agenda | Integração de calendário | OAuth/API | Calendário e responsável |
| Persistência | Postgres ou Supabase | Credencial de banco | Banco e schema de produção |

## Regra de instalação

Instalar somente o conector necessário para a primeira onda. O MCP do n8n pode descobrir tipos de nós e workflows, mas não cria credenciais externas. Cada novo provedor entra após confirmar: capacidade instalada, autenticação, limites, ambiente de staging e teste seguro.

## Primeira onda recomendada

MCP nativo n8n → Postgres/Supabase → Apify → Tavily → CRM Avraham → um adaptador WhatsApp. LinkedIn, Instagram, agenda e demais provedores entram depois que os contratos do núcleo e a identidade de contas estiverem testados.
