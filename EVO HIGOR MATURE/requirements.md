# Requisitos — Sistema de Agentes para WhatsApp

Gerado via `/sc:brainstorm` a partir de `spec.md`. Este documento é a especificação de requisitos consolidada. Não contém decisões de arquitetura, schema de banco ou design de API — isso é o próximo passo (`/sc:design`).

## Decisões fechadas nesta rodada

| Decisão | Escolha | Implicação |
|---|---|---|
| Conector WhatsApp | Biblioteca não-oficial (Baileys/whatsapp-web.js) | Sem custo por mensagem, mas risco real de ban. Exige rate limiting e aquecimento de número. |
| Escopo da entrega | Spec completa (Fases 1–4) num único ciclo | Não é um MVP enxuto — todo o backlog das 4 fases entra no plano de implementação. |
| Tenancy | Uso solo (um workspace, um operador) | Sem necessidade de isolamento multi-cliente agora. Simplifica auth e modelo de dados. |
| Instâncias WhatsApp | Múltiplos números simultâneos | Exige pool de conexões/sessões Baileys isoladas, uma por número. |
| Stack | Flexível — prioridade é a automação funcionar, não a linguagem | Abre caminho para backend em Python (ou outra linguagem leve) + serviço Node dedicado só para rodar Baileys, comunicando via fila/webhook interno. |
| Apetite de risco de volume | Conservador — poucas dezenas de mensagens automáticas/dia por número | Guardrails de frequência devem ser padrão restritivo, não configuração opcional. |

## Requisitos funcionais (herdados de spec.md, sem alteração de escopo)

1. Cadastro completo de agentes com os campos definidos em `spec.md` (identidade, personalidade, políticas, LLM, memória).
2. Persona em 4 camadas (identidade, comportamento, memória, treinamento operacional).
3. Painel administrativo com os 10 módulos listados (Dashboard, Agentes, Conversas, Grupos, Contatos, Webhooks, Métricas, Logs, Integrações, Configurações).
4. Fluxos de conversa separados para privado e grupo, incluindo `mention_only_mode` e mensagens de boas-vindas configuráveis.
5. Três modos de resposta: `manual`, `semi_automatic`, `automatic`.
6. Base de conhecimento por agente com indexação semântica.
7. Suporte multi-LLM/multi-provedor por agente, com fallback para modelo secundário.
8. Memória de curto e longo prazo com política de expurgo manual.
9. Métricas essenciais e avançadas conforme listado em `spec.md`.
10. Webhooks com os 13 eventos definidos, assinatura de payload, retentativa e fila assíncrona.
11. Segurança: autenticação, perfis de acesso, segredos fora do front, rotação de tokens, auditoria, kill switch global.

## Requisitos não-funcionais novos (derivados das decisões desta rodada)

1. **Isolamento por instância**: cada número WhatsApp roda em sessão própria; falha ou ban de uma instância não pode derrubar as demais.
2. **Rate limiting conservador por padrão**: limite de mensagens automáticas/dia por número deve vir pré-configurado em faixa baixa (dezenas), com necessidade de ação explícita do operador para aumentar.
3. **Aquecimento de número novo**: números recém-conectados devem ter rampa de volume progressiva antes de atingir o limite padrão.
4. **Comunicação entre backend principal e serviço de conector**: se a stack for polyglot (ex.: Python + Node), precisa de contrato de mensagens claro (fila ou webhook interno) entre o serviço que fala com o Baileys e o resto do sistema.
5. **Reconexão resiliente**: sessões Baileys devem suportar reconexão automática após queda, sem perda de mensagens em trânsito.

## User stories / critérios de aceite (amostra prioritária)

- **Como operador**, quero conectar um novo número WhatsApp escaneando um QR code, **para** ativar um agente sem tocar em código.
  - Aceite: conexão bem-sucedida aparece no painel em até 30s após scan; falha exibe motivo claro.

- **Como operador**, quero definir um limite diário de mensagens automáticas por agente, **para** reduzir risco de banimento.
  - Aceite: ao atingir o limite, o agente passa a fila mensagens excedentes ou recusa envio, registrando o evento.

- **Como operador**, quero pausar um agente ou um chat específico sem derrubar os demais números conectados, **para** conter um incidente isolado.
  - Aceite: pausar um agente não afeta o estado de conexão de outros agentes/números.

- **Como operador**, quero ver no dashboard quando uma instância WhatsApp está próxima de ser desconectada/flagada, **para** agir antes do ban.
  - Aceite: existe um indicador de saúde por instância (ex.: taxa de erro de envio, desconexões recentes).

## Perguntas em aberto (bloqueiam `/sc:design`)

1. **Provedor(es) de LLM iniciais**: quais provedores/modelos precisam funcionar já na v1 (OpenAI, Anthropic, outro)? Isso afeta o desenho do serviço de LLM e dos limites de custo.
2. **Hospedagem**: onde isso vai rodar (VPS própria, cloud gerenciada, o próprio Mac local)? Baileys exige processo long-running com sessão persistente em disco.
3. **Autenticação do painel**: login simples (usuário/senha) é suficiente para uso solo, ou já quer 2FA?
4. **Quantos números o operador pretende conectar de fato no início** (2? 5? 20?) — isso define se "pool de conexões" é um detalhe de implementação ou uma peça central de arquitetura.
   - **Nota (resolvida parcialmente):** O design do Serviço de Aquecimento em `warming-module-design.md` resolve a parte **estrutural** — arquitetura suporta N números sem limite artificial no schema. A resposta **numérica** (quantos o operador vai conectar) continua aberta — ela impacta dimensionamento de infraestrutura, não o design do módulo.
5. **O que conta como "sensível" para pausar automaticamente uma conversa** — precisa de uma lista inicial de gatilhos (palavras, temas) ou fica 100% a critério do operador?
6. **Fallback quando o número é banido**: existe expectativa de failover automático para outro número, ou é sempre intervenção manual?

## Próximo passo

Leitura recomendada:
- [warming-module-design.md](warming-module-design.md) — design completo do Serviço de Aquecimento, modelo de dados, máquina de estados, regras de negócio.

Com as respostas às perguntas em aberto acima, seguir para `/sc:design` (arquitetura, schema de dados, contrato de API/fila entre backend e serviço Baileys, integração com Warming Service) ou `/sc:workflow` (quebra em épicos/histórias para implementação integrada com os 4 fases do `spec.md`).
