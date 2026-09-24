# Master Spec — Sistema Comercial Autônomo de Diagnóstico + Outbound

## Papel

Atue como tech lead, engenheiro de produto e especialista em agentes de IA e automação comercial.

Este projeto deve evoluir para um sistema local e auditável que execute o ciclo:

**Descobrir → Qualificar → Observar → Diagnosticar → Priorizar → Abordar → Converter → Medir → Aprender → Adaptar**.

Não construir apenas um CRM. O CRM é a interface de uma máquina operacional orientada por eventos.

## Objetivo de negócio inicial

Os valores reais devem vir de `config/kpis.json`.

Baseline atual:

- ticket médio de setup: R$ 3.000;
- meta de receita: R$ 30.000/mês;
- meta: 10 vendas/mês;
- ciclo médio: 21 dias;
- lead → resposta: 10%;
- resposta → reunião: 40%;
- reunião → venda: 33%;
- conversão total estimada: 1,32%;
- referência matemática: ~758 abordagens/mês;
- meta operacional inicial: 1.000 abordagens/mês;
- referência diária: 50 novas empresas/dia útil.

Esses números são hipóteses iniciais até existir amostra real. Toda métrica precisa mostrar `baseline`, `actual`, `target` e `sample_size`.

## Princípio do produto

O sistema não começa tentando vender para qualquer empresa.

Ele primeiro procura três coisas:

1. **Fit**: a empresa se parece com quem pode comprar?
2. **Pain**: existe uma dor comercial observável?
3. **Timing**: há evidência de que vale abordar agora?

A prioridade nasce desses sinais.

## Fluxo principal

Consultar `docs/WORKFLOW.md` como fonte operacional principal.

```text
Descoberta
  → ICP Score
  → Observação/diagnóstico
  → Pain Score
  → Opportunity Score
  → Abordagem personalizada
  → Resposta
  → Reunião
  → Proposta
  → Venda
  → Métricas
  → Aprendizado
  ↺
```

## Motor de decisão

Para cada lead, manter:

```json
{
  "icp_score": 0,
  "pain_score": 0,
  "timing_score": null,
  "opportunity_score": 0,
  "priority": "A|B|C|D",
  "pipeline_stage": "discovered",
  "next_action": null,
  "next_action_at": null,
  "do_not_contact": false
}
```

A IA pode recomendar scores, mas cada score deve incluir evidências e versão da regra utilizada.

## Agente de diagnóstico

Responsável por transformar histórico e eventos de atendimento em uma análise estruturada.

Nunca confundir fato com inferência.

Formato esperado:

```json
{
  "facts": [],
  "inferences": [],
  "response_time_minutes": null,
  "service_score": 0,
  "pain_score": 0,
  "main_problem": null,
  "recommended_solution": null,
  "confidence": 0
}
```

## Agente de abordagem

Entrada:

- dados públicos do lead;
- ICP;
- evidências do diagnóstico;
- cases aprovados;
- histórico;
- estágio;
- canal.

Saída:

- abertura;
- mensagem/roteiro de áudio;
- CTA;
- hipótese de objeção;
- próxima ação.

Nunca inventar case, número, resultado, urgência ou relação com o prospect.

## Agente conversacional

Intenções mínimas:

`interested`, `asked_info`, `asked_pricing`, `objection`, `not_interested`, `not_decision_maker`, `wants_meeting`, `opt_out`, `ambiguous`, `needs_human`.

Ações mínimas:

`reply`, `ask`, `send_case`, `handle_objection`, `schedule_meeting`, `schedule_followup`, `wait`, `close`, `escalate_human`.

## Eventos

Toda ação relevante cria evento imutável.

Eventos mínimos:

```text
lead_discovered
lead_deduplicated
icp_scored
diagnostic_contact_sent
first_reply_received
response_time_measured
followup_received
diagnosis_completed
pain_scored
opportunity_scored
outreach_generated
outreach_sent
outreach_replied
followup_scheduled
followup_sent
meeting_scheduled
meeting_held
proposal_sent
deal_won
deal_lost
opt_out_received
human_review_requested
```

## KPIs

### Negócio

- receita mensal;
- vendas;
- ticket médio;
- ciclo médio de venda;
- CAC;
- receita por 100 empresas analisadas.

### Funil

- discovered → qualified;
- qualified → diagnosed;
- diagnosed → high pain;
- prioritized → reply;
- reply → meeting;
- meeting → proposal;
- proposal → won;
- overall lead → won.

### Diagnóstico

- mediana de tempo de resposta dos prospects;
- % acima de 1 hora;
- % sem follow-up;
- % sem pergunta de qualificação;
- % sem tentativa de próximo passo;
- % com Pain Score ≥ 60.

### Operação

- leads processados/dia;
- jobs com erro;
- ações aguardando humano;
- duplicidades bloqueadas;
- opt-outs;
- custo de IA por lead, reunião e venda.

## Experimentos

Testar uma variável principal por experimento:

- nicho;
- origem da lista;
- janela de envio;
- abertura;
- áudio vs. texto;
- CTA;
- evidência apresentada;
- follow-up;
- case utilizado.

Sempre registrar grupo, versão, amostra, início, fim e resultado.

Não declarar vencedor com amostra irrelevante.

## Guardrails

- opt-out encerra contato;
- nenhuma mensagem duplicada;
- nenhuma alegação sem prova;
- nenhuma identidade falsa;
- nenhuma intenção comercial falsa para provocar resposta;
- nenhuma informação privada indevida;
- toda decisão da IA auditável;
- mudança de score/prompt versionada;
- limites de volume configuráveis;
- pause geral disponível.

## Critérios de aceite do MVP

O MVP é considerado funcional quando for possível demonstrar:

1. importar/descobrir leads;
2. deduplicar;
3. calcular ICP Score;
4. registrar eventos de observação;
5. produzir diagnóstico por IA com evidências;
6. calcular Pain e Opportunity Score;
7. priorizar fila;
8. gerar abordagem personalizada;
9. registrar resposta e follow-up;
10. mover lead até reunião, proposta, ganho/perda;
11. exibir funil e KPIs;
12. comparar baseline vs. realizado;
13. manter histórico de versões e decisões;
14. respeitar do-not-contact;
15. exportar relatório do piloto.

## Piloto recomendado

Rodar primeiro com **100 empresas de um único nicho**.

Ao final, o relatório deve responder:

- quantas entraram no ICP;
- quantas tiveram diagnóstico suficiente;
- qual o tempo mediano de resposta;
- quantas apresentaram dor relevante;
- quantas foram prioridade A/B;
- quantas foram abordadas;
- quantas responderam;
- quantas reuniões foram marcadas;
- quantas propostas;
- quantas vendas;
- receita;
- receita por 100 analisadas;
- gargalo dominante do funil.
