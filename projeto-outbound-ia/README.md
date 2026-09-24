# Projeto Outbound IA

Sistema de prospecção outbound orientado por diagnóstico real do atendimento comercial do prospect.

## Objetivo

Construir uma máquina comercial que:

1. seleciona empresas dentro de um ICP;
2. realiza uma interação inicial como potencial cliente;
3. mede o atendimento recebido;
4. usa IA para avaliar a operação comercial;
5. prioriza empresas com falhas reais;
6. gera uma abordagem personalizada;
7. conduz o prospect até uma reunião;
8. mede conversões e receita de ponta a ponta.

## Meta inicial de negócio

- Ticket médio de setup: R$ 3.000
- Meta mensal: R$ 30.000
- Vendas necessárias: 10/mês
- Ciclo médio de venda: 21 dias
- Conversão estimada Lead -> Resposta: 10%
- Conversão Resposta -> Reunião: 40%
- Conversão Reunião -> Venda: 33%
- Conversão total estimada: 1,32%
- Volume-base necessário: ~758 abordagens/mês
- Meta operacional recomendada: 1.000 abordagens/mês
- Meta diária aproximada: 50 novas empresas por dia útil

## Documentação

- [Workflow completo](docs/WORKFLOW.md)
- [Master Spec do sistema](docs/MASTER-SPEC.md)
- [Métricas e KPIs](docs/METRICAS-KPIS.md)
- [ICP e qualificação](docs/ICP-E-QUALIFICACAO.md)
- [Modelo de dados e eventos](docs/MODELO-DE-DADOS.md)
- [Regras da IA](docs/REGRAS-DA-IA.md)
- [Estados do funil](docs/ESTADOS-DO-FUNIL.md)
- [Plano de implementação](docs/IMPLEMENTACAO.md)

## Princípio do projeto

A prospecção não começa com uma oferta. Ela começa com uma evidência.

O sistema primeiro identifica uma falha real no atendimento da empresa e somente depois inicia a abordagem comercial.

Fluxo central:

`LISTA -> TESTE -> MEDIÇÃO -> ANÁLISE IA -> SCORE -> ABORDAGEM -> REUNIÃO -> VENDA`

## Documentos V2

- `docs/WORKFLOW-V2.md`: workflow completo com múltiplas origens, enriquecimento, diagnóstico, scoring e delivery.
- `docs/ICP-SINAIS-PUBLICOS.md`: como inferir ICP usando sinais públicos e proxies com confiança.
- `docs/DIAGNOSTICO-DELIVERY.md`: estrutura do diagnóstico entregue ao prospect.
