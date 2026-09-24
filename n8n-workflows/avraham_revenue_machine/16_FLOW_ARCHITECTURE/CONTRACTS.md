# Contratos lógicos de integração

São capacidades a implementar. Não representam URLs, autenticação ou funções já disponíveis no CRM Avraham. O desenho independe de executor; n8n e Disparai são candidatos existentes no workspace.

## Envelope de evento

```json
{
  "schema_version": "1.0",
  "event_id": "evt-example-001",
  "event_type": "qualification.completed",
  "occurred_at": "2026-09-07T14:00:00Z",
  "received_at": "2026-09-07T14:00:01Z",
  "source": "core-09",
  "correlation_id": "journey-example-001",
  "causation_id": "evt-example-000",
  "idempotency_key": "qualification:participation-example-001:v1",
  "account_id": "account-example-001",
  "contact_id": "contact-example-001",
  "campaign_id": "campaign-example-001",
  "participation_id": "participation-example-001",
  "ala_id": "ALA-01",
  "entity_version": 4,
  "payload": {
    "qualification_complete": true,
    "pain": "Demora no retorno, relatada pelo contato",
    "operational_context": "Equipe comercial com três atendentes",
    "evidence_refs": ["message-example-001"],
    "next_step": "Combinar horário de reunião"
  }
}
```

IDs do exemplo são ilustrativos. Em implementação, usar IDs internos opacos e estáveis. `event_id` identifica um fato; `idempotency_key` identifica o efeito que não pode ser repetido. `entity_version` ordena mudanças da entidade, não todos os eventos do sistema.

`account_id` é obrigatório depois de CORE-03. Descoberta usa `candidate_id` no payload e `account_id=null`; eventos de campanha também podem não ter conta. Contato, campanha, participação, ALA e causação podem ser nulos quando não aplicáveis, nunca preenchidos por adivinhação. `source` identifica origem lógica, sem segredo; horários usam ISO-8601 com fuso, armazenados em UTC.

Payload inválido fica em quarentena com motivo. Conteúdo de sites e mensagens é dado para análise, não instrução capaz de alterar regras do sistema. Logs guardam referências e o mínimo necessário; credenciais ficam fora de payloads, prompts e arquivos exportados.

## Eventos entre flows

| Evento | Produtor → consumidor | Conteúdo adicional mínimo |
|---|---|---|
| campaign.enabled | CORE-01 → CORE-02 | campanha e versão |
| candidate.discovered | CORE-02 → CORE-03 | candidato, fonte e identificadores disponíveis |
| account.resolved | CORE-03 → CORE-04 | conta canônica, criação/atualização e fontes |
| account.enriched | CORE-04 → CORE-05 | evidências, lacunas e conclusão da pesquisa |
| routing.decided | CORE-05 → CORE-06 | elegibilidade, ALA, campanha/versão e justificativa |
| message.send_requested | CORE-06/08 → CORE-07 | ação, canal, destinatário, conteúdo e versão do controle |
| message.sent/delivered/failed | CORE-07 → CORE-06/11 | mensagem, ID do provedor, horário e erro quando aplicável |
| message.received | CORE-07 → CORE-08 | mensagem recebida, contato, texto/referência e conversa |
| account.opted_out | CORE-07/08/CRM → controle central | conta, mensagem/evidência e horário |
| qualification.completed | CORE-09 → CORE-10/11 | matriz preenchida, evidências e próximo passo |
| handoff.requested | CORE-09 → CORE-10 | destino, resumo, lacunas e controle HUMAN |
| handoff.released | Humano via CRM → controle central | conta, autor, motivo e retomada solicitada |
| meeting.booked/held/cancelled/no_show | Agenda/CRM → CORE-10/11 | reunião, oportunidade, horário e versão |
| opportunity.stage_changed | CRM → CORE-10/11 | oportunidade, etapa, proprietário e versão |
| supplier.status_changed | CRM → CORE-10/11 | fornecedor, etapa, autor e evidência |
| finance.recorded/corrected | CRM → CORE-11 | lançamento, oportunidade, moeda, valores e completude |
| operation.failed | Qualquer CORE → CORE-12 | operação, classificação, tentativa e chave original |

## Canais

Operações abstratas: `send_message`, `lookup_message`, `receive_event` e `capabilities`. Comando de envio contém `action_id`, conta, contato, participação, canal, destinatário, conteúdo e versão do controle. Retorno informa aceito/rejeitado/incerto, ID do provedor quando existir e horário.

Capacidades declaram envio, recebimento, recibos, consulta de status e idempotência externa. Não presumir que todos os canais suportam tudo. Ações sociais como conexão ou visita só entram em campanha quando houver adaptador correspondente; ausência vira pendência de configuração.

Webhooks exigem validação de autenticidade conforme o provedor escolhido e deduplicação por provedor + instância + ID externo do evento. Se não houver ID, o adaptador deve definir uma chave estável documentada antes da habilitação; hash apenas do texto não basta. Repetição recebe confirmação sem repetir efeitos. Confirmar recebimento somente após persistência durável.

## CRM Avraham

| Capacidade necessária | Entrada | Resultado esperado |
|---|---|---|
| Consultar/criar/atualizar conta e contato | ID interno externo estável, identidade e campos permitidos | IDs do CRM, versão e confirmação |
| Registrar atividade | ID de atividade, conta, conversa, tipo, horário e resumo | Atividade única |
| Criar/atualizar oportunidade | Referência interna, conta, produto, campanha de origem, resumo e próximo passo | Oportunidade única e etapa |
| Atribuir responsável/tarefa | Conta/registro, equipe destino, lacunas e prazo quando definido | Responsável ou fila pendente |
| Registrar parceiro/fornecedor | Conta e avaliação específica | Registro separado do pipeline de vendas |
| Receber alterações | ID externo do evento, entidade, versão, campos, autor e horário | Evento canônico aplicado uma vez |
| Receber financeiro | ID único do lançamento, oportunidade, valores e completude | Resultado reconciliável |
| Liberar automação | Conta, autor, motivo e intenção explícita | Comando auditável de revalidação |

Núcleo é autoridade de identidade canônica, campanhas, cadência, mensagens e bloqueio global. CRM é autoridade de proprietário, etapas de oportunidade, homologação e lançamentos financeiros. Campos descritivos editáveis por ambos precisam de mapeamento explícito antes da integração; não usar sobrescrita indiscriminada.

Persistir mapa ID interno ↔ ID CRM por entidade. Upsert usa referência interna, não nome da empresa. Atualização recebida com origem no próprio núcleo não gera ciclo de sincronização. Sem versão externa, adaptador consulta estado atual antes de aplicar evento potencialmente antigo.

Pacote de passagem: conta/contato, ALA, campanha, resumo, dor/necessidade, respostas com evidências, campos faltantes, `qualification_complete`, destino, próximo passo, referências do histórico e diagnóstico autorizado quando houver. Para fornecedor não criar oportunidade de venda; para parceiro, criar candidato, vinculando oportunidades comerciais futuras quando surgirem.

## Agenda

Capacidades: consultar disponibilidade, reservar com chave idempotente, consultar reserva e receber cancelamento/realização/ausência. Registrar responsável e fuso. Confirmar horário ao contato somente depois da reserva; timeout exige consulta antes de nova reserva. Reunião realizada vem de confirmação humana/integração, nunca da mera passagem do horário.

## Persistência, reexecução e falhas

Inbox deduplica eventos recebidos; outbox registra efeitos pendentes junto à mudança de estado. Reserva por conta e transição de controle são atômicas. Esses são requisitos lógicos, sem prescrever tabelas ou tecnologia.

Entrega interna pode ocorrer mais de uma vez: consumidores devem aplicar cada efeito uma vez. Idempotência local não garante envio único se o provedor não oferecer idempotência/consulta. Nesse caso, envio incerto fica pendente para humano, sem retry cego.

Falhas transitórias conhecidas seguem o limite de CORE-12; falhas permanentes, autenticação inválida, conflitos de identidade e configuração incompleta exigem correção. Replay usa o evento original e uma nova tentativa registrada. Revalidar controle atual antes de efeitos externos.
