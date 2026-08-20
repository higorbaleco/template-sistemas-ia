# Spec do Sistema de Agentes para WhatsApp

## Visão geral

Construir uma plataforma de orquestração de agentes para WhatsApp com foco em operação controlada, personas configuráveis, respostas contextualizadas, métricas e integrações. O sistema deve permitir criar agentes com perfis próprios, controlar quando cada agente está ativo, registrar conversas, medir desempenho e expor webhooks para automações externas.

Esta spec prioriza uso legítimo e opt-in. Não inclui mecânicas de scraping para abuso, envio não solicitado em massa ou automação para burlar regras de plataformas. Em vez disso, o produto deve operar com contatos autorizados, grupos próprios ou comunidades em que a conta tenha permissão explícita de participação.

## Objetivos do produto

1. Criar agentes com personalidade, contexto, tom de voz, histórico e objetivos.
2. Centralizar criação, edição e ativação de agentes em um painel.
3. Permitir múltiplas LLMs e múltiplos provedores de chave/API por agente.
4. Controlar automações em chats privados e grupos com regras claras de ativação.
5. Registrar mensagens enviadas e recebidas com métricas operacionais.
6. Expor webhooks e API para integrações com CRM, BI, automações e auditoria.
7. Permitir operação segura com aprovação humana, logs e trilha de auditoria.

## Não objetivos

1. Scraping de grupos ou contatos de terceiros sem consentimento.
2. Entrada automatizada em grupos públicos ou privados sem aprovação.
3. Spam, mass messaging ou comportamento projetado para burlar detecção.
4. Simulação enganosa de pessoa real sem aviso interno de uso da persona.

## Público-alvo

1. Operadores de comunidades.
2. Times de marketing e relacionamento.
3. Times de vendas consultivas com fluxo assistido.
4. Operações de atendimento que precisam de múltiplas personas.

## Conceito de agente

Cada agente é uma unidade independente de comportamento. O agente não é apenas um prompt; ele carrega:

1. Identidade.
2. Personalidade.
3. Regras de resposta.
4. Base de conhecimento.
5. Limites operacionais.
6. Canal de atuação.
7. Estado de ativação.
8. Métricas.

### Campos do agente

- `id`
- `name`
- `username`
- `avatar`
- `role`
- `personality`
- `tone`
- `writing_style`
- `response_length_policy`
- `language`
- `timezone`
- `training_base`
- `knowledge_sources`
- `greeting_templates`
- `fallback_templates`
- `group_behavior_policy`
- `private_chat_policy`
- `mention_only_mode`
- `active`
- `risk_level`
- `llm_provider`
- `llm_model`
- `llm_api_key_ref`
- `temperature`
- `max_tokens`
- `memory_window`
- `memory_policy`
- `allowed_channels`
- `blocked_channels`
- `tags`
- `created_at`
- `updated_at`

**Nota sobre múltiplas instâncias:** Com o suporte a múltiplas números WhatsApp simultâneos (requisito não-funcional de `requirements.md`), agente (persona/comportamento) e instância de conexão (número Baileys) passam a ser entidades **distintas**. Um agente pode estar vinculado a uma ou mais instâncias, e uma instância pode existir sem agente (ex.: durante aquecimento). Ver [warming-module-design.md](warming-module-design.md) para modelo de dados completo de `whatsapp_instance`.

## Persona framework

O sistema deve permitir montar uma persona em camadas.

### Camada 1: identidade

- Nome.
- Idade aparente.
- Região.
- Profissão.
- Interesses.
- Vocabulário.
- Nível de formalidade.

### Camada 2: comportamento

- Curto e objetivo.
- Mais caloroso e conversacional.
- Humor leve.
- Respostas técnicas.
- Respostas persuasivas.
- Respostas com perguntas de continuação.

### Camada 3: memória

- Fatos persistentes.
- Preferências.
- Histórico recente.
- Assuntos proibidos.
- Contextos recorrentes.

### Camada 4: treinamento operacional

- Exemplos de mensagens.
- Exemplos de respostas desejadas.
- Regras de estilo.
- Tratamento de exceções.

## Painel administrativo

O painel deve permitir operar o sistema sem editar código.

### Módulos do painel

1. Dashboard.
2. Agentes.
3. Conversas.
4. Grupos.
5. Contatos.
6. Entradas de webhook.
7. Métricas.
8. Logs.
9. Integrações.
10. Configurações.

### Dashboard

Exibir:

- Agentes ativos.
- Mensagens enviadas hoje.
- Mensagens recebidas hoje.
- Taxa de resposta.
- Filas pendentes.
- Alertas de risco.
- Webhooks com erro.
- Chats inativos.

### Tela de agentes

Permitir:

- Criar, editar, duplicar e arquivar agentes.
- Configurar personalidade, tom e memória.
- Definir LLM por agente.
- Trocar chave/token por agente.
- Configurar se responde em grupo, privado ou ambos.
- Habilitar modo manual, semiautomático ou automático.
- Definir “responder apenas quando mencionado” em grupos.
- Definir “responder somente em privado” quando necessário.

### Tela de conversas

Permitir:

- Ver histórico por contato ou grupo.
- Buscar por palavra-chave.
- Filtrar por agente.
- Filtrar por status.
- Marcar conversa como sensível.
- Pausar automação daquele chat.
- Reatribuir conversa para outro agente.

### Tela de grupos

Permitir:

- Listar grupos monitorados.
- Ver status do grupo.
- Ver regras do grupo.
- Definir comportamento de boas-vindas.
- Definir comportamento de menção.
- Definir horários de atuação.
- Silenciar respostas fora de janela.

### Tela de integrações

Permitir:

- Cadastrar webhooks.
- Testar webhook.
- Ver histórico de entrega.
- Configurar eventos por assinatura.
- Mapear payloads.

## Fluxo de conversa

### Privado

1. Mensagem chega.
2. Motor de regras verifica se o chat está ativo e se a instância WhatsApp subjacente completou aquecimento (lifecycle_status = READY ou OPERATIONAL).
3. Checa se o agente pode responder.
4. Verifica memória e contexto.
5. Gera resposta via LLM ou regra fixa.
6. Aplica filtros de segurança.
7. Envia resposta.
8. Registra métricas e evento.

### Grupo

1. Mensagem chega ao grupo.
2. Sistema verifica se o agente está habilitado para o grupo.
3. Se `mention_only_mode` estiver ativo, só responde quando houver menção direta.
4. Se houver boas-vindas, dispara apenas em eventos permitidos e configurados.
5. Aplica limites de frequência e cooldown.
6. Registra a resposta e o contexto.

### Mensagem de boas-vindas

Boas-vindas em grupos devem ser configuráveis por template e gatilho:

- Quando o agente entrar em um grupo autorizado.
- Quando um membro novo entrar no grupo.
- Quando o agente for mencionado pela primeira vez.

As boas-vindas devem ter:

- Variação de texto.
- Regras de frequência.
- Limite por período.
- Fallback manual.

## Regras de resposta

### Regras principais

1. Responder com naturalidade e consistência de persona.
2. Evitar repetir estrutura de texto.
3. Preferir respostas curtas quando o canal exigir.
4. Não responder fora do escopo configurado.
5. Não iniciar conversa em grupo quando o modo exigir menção.
6. Não invadir conversas com mensagens excessivas.
7. Respeitar janelas de horário e pausa manual.

### Modos de resposta

- `manual`: só envia se um operador aprovar.
- `semi_automatic`: sugere resposta e aguarda confirmação em casos sensíveis.
- `automatic`: responde conforme regras e limiares.

### Guardrails

- Bloquear conteúdo proibido por policy interna.
- Reduzir confiança quando o contexto estiver incompleto.
- Pedir clarificação quando a intenção do usuário estiver ambígua.
- Suspender o agente em caso de comportamento anômalo.

## Base de conhecimento

Cada agente pode ter uma base de conhecimento própria:

- Arquivos enviados.
- Notas internas.
- FAQ.
- Links.
- Scripts de atendimento.
- Exemplos de diálogo.

### Indexação

- Chunking por documento.
- Metadados por fonte.
- Busca semântica.
- Relevância por contexto do chat.
- Expiração de fontes se necessário.

## LLM e provedores

O sistema deve ser agnóstico ao provedor.

### Requisitos

- Seleção por agente.
- Configuração de chave por agente ou por workspace.
- Suporte a múltiplos modelos.
- Histórico de uso por modelo.
- Limites de custo por agente.
- Fallback para modelo secundário.

### Parâmetros editáveis

- Provider.
- Model.
- Temperature.
- Top-p.
- Max tokens.
- Seed, se suportado.
- System prompt.
- Memory window.

## Memória

### Memória de curto prazo

- Últimas mensagens do chat.
- Último estado da conversa.
- Última intenção detectada.

### Memória de longo prazo

- Nome do contato.
- Preferências.
- Interesses.
- Restrições.
- Histórico consolidado.

### Política de memória

- O operador define o que persiste.
- O agente pode esquecer dados sensíveis.
- O sistema deve permitir expurgo manual.

## Métricas

### Métricas essenciais

- Mensagens enviadas.
- Mensagens recebidas.
- Taxa de resposta.
- Tempo médio de resposta.
- Conversas ativas.
- Conversas pausadas.
- Mensagens por agente.
- Mensagens por grupo.
- Mensagens por contato.
- Erros por tipo.
- Custos de LLM.
- Conversões atribuídas, se houver integração.

### Métricas avançadas

- Taxa de resposta por janela de tempo.
- Volume por persona.
- Taxa de menções respondidas.
- Ratio de mensagens humanas vs automáticas.
- Tempo até primeira resposta.
- Taxa de escalonamento para humano.

## Webhooks

### Eventos

- `agent.created`
- `agent.updated`
- `agent.activated`
- `agent.deactivated`
- `message.received`
- `message.sent`
- `conversation.opened`
- `conversation.closed`
- `group.joined`
- `group.left`
- `group.mentioned`
- `error.raised`
- `risk.flagged`

### Payload mínimo

- `event_id`
- `event_type`
- `timestamp`
- `workspace_id`
- `agent_id`
- `conversation_id`
- `channel`
- `message_id`
- `direction`
- `content_preview`
- `metadata`

### Garantias

- Retentativa em falha.
- Assinatura de payload.
- Logs de entrega.
- Fila assíncrona.

## Arquitetura sugerida

### Frontend

- Painel web.
- Cadastro e edição de agentes.
- Visualização de métricas.
- Gestão de conversas.

### Backend

- API principal.
- Orquestrador de eventos.
- Serviço de regras.
- Serviço de memória.
- Serviço de LLM.
- Serviço de webhooks.
- **Serviço de Aquecimento** (warming service) — orquestra ciclos de maturação de números WhatsApp conectados. Ver [warming-module-design.md](warming-module-design.md).
- Worker de processamento.

### Persistência

- PostgreSQL para dados transacionais.
- Redis para fila e estado curto.
- Storage de objetos para arquivos.
- Vetor/embeddings para memória e conhecimento, se necessário.

### Integração WhatsApp

O sistema deve usar um conector compatível com o canal escolhido e com os termos de uso aplicáveis. A integração precisa suportar:

- Listagem de chats.
- Recebimento de mensagens.
- Envio de mensagens.
- Eventos de grupo.
- Eventos de menção.
- Estado de conexão.

## Segurança e controle

### Controles obrigatórios

- Autenticação no painel.
- Perfis de acesso.
- Segredos fora do front em produção.
- Rotação de tokens.
- Auditoria por ação.
- Bloqueio de conteúdo sensível.
- Limite de taxa por agente.
- Kill switch global.

### Controles operacionais

- Ativar/desativar agente.
- Pausar chat.
- Bloquear contato.
- Bloquear grupo.
- Revisar fila antes de envio.
- Aprovar exceções manualmente.

## Plano de implementação

### Fase 1: base funcional

1. Estruturar banco e entidades principais.
2. Criar autenticação e painel base.
3. Implementar CRUD de agentes.
4. Implementar conector WhatsApp.
5. Registrar mensagens recebidas e enviadas.
6. Exibir conversas e métricas básicas.

### Fase 2: inteligência do agente

1. Adicionar persona configurável.
2. Adicionar memória de curto prazo.
3. Adicionar seleção de LLM por agente.
4. Adicionar regras de grupo e privado.
5. Adicionar modo mention-only.
6. Adicionar respostas com aprovação opcional.

### Fase 3: operação e escala

1. Adicionar webhooks.
2. Adicionar trilha de auditoria.
3. Adicionar alertas.
4. Adicionar filas e retries.
5. Adicionar custos por agente.
6. Adicionar exportação de dados.

### Fase 4: refinamento

1. Melhorar editor de persona.
2. Melhorar templates de resposta.
3. Melhorar dashboards.
4. Melhorar observabilidade.
5. Melhorar ferramentas de revisão humana.

## Critérios de pronto

1. Criar um agente completo em menos de 10 minutos.
2. Ativar e desativar um agente sem reiniciar o sistema.
3. Responder mensagens privadas conforme persona.
4. Responder grupos apenas quando permitido pela regra.
5. Medir volume e tempo de resposta por agente.
6. Entregar eventos de webhook com sucesso.
7. Registrar logs úteis para auditoria e suporte.

## Riscos principais

1. Uso indevido para spam ou automação abusiva.
2. Bloqueios da plataforma de mensagens.
3. Vazamento de chave/API no front.
4. Persona inconsistente por falta de memória.
5. Custo alto de LLM com agentes muito ativos.
6. Respostas inadequadas sem guardrails suficientes.

## Restrições recomendadas

1. Operar apenas com contatos e grupos autorizados.
2. Exigir ativação explícita por agente.
3. Aplicar limites de taxa.
4. Manter logs e revisão humana para ações sensíveis.
5. Separar ambiente de teste do ambiente de produção.

## Entregáveis de produto

1. Painel web operacional.
2. Cadastro completo de agentes.
3. Integração WhatsApp.
4. Motor de regras.
5. Sistema de memória.
6. Métricas e logs.
7. Webhooks.
8. Documentação de uso e operação.

## Próximo passo recomendado

Transformar esta spec em backlog técnico com épicos, histórias e ordem de implementação, começando pela base de dados, painel de agentes e conector de mensagens.
