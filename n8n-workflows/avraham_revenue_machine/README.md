# Avraham Revenue Machine

> **Especificação vigente do desenho — 2026-09-07:** [Arquitetura dos 18 flows](16_FLOW_ARCHITECTURE/README.md). Esse pacote consolida as decisões aprovadas, os contratos, estados separados por entidade e as seis ALAs. Em caso de divergência, prevalece sobre o blueprint inicial abaixo e os documentos das pastas 00–15. Entrega documental; não representa workflows implementados ou integrações ativas.

**Versão:** V1  
**Status:** Arquitetura Funcional / Blueprint de Implementação  
**Objetivo inicial:** construir uma máquina comercial omnichannel capaz de gerar demanda previsível e sustentar inicialmente R$30 mil a R$50 mil/mês em novas receitas, evoluindo posteriormente para R$50 mil a R$150 mil/mês sem criar uma operação inchada.

---

# 1. Princípio central

A Avraham Revenue Machine não deve ser uma automação monolítica.

Ela deve ser composta por blocos independentes, com contratos claros entre si:

```text
INPUT
↓
PROCESSO
↓
OUTPUT
```

Cada bloco deve:

1. funcionar isoladamente;
2. registrar tudo que fez;
3. produzir uma saída padronizada;
4. poder ser desligado ou substituído sem quebrar toda a máquina;
5. nunca depender circularmente de outro bloco.

A visão é grande. A implementação é modular.

---

# 2. Objetivo comercial

A máquina deve gerar demanda comercial previsível para as principais linhas de receita da Avraham:

- Agentes IA;
- projetos de IA com integrações/API;
- infraestrutura e contingência de WhatsApp;
- chips, BMs e ativos;
- disparos;
- parceiros, revendedores e afiliados;
- fornecedores estratégicos.

O sistema deve operar principalmente em:

- WhatsApp;
- LinkedIn;
- Instagram.

Fontes de descoberta prioritárias:

- Google Maps;
- listas B2B;
- LinkedIn;
- bases próprias e enriquecidas.

---

# 3. Macroarquitetura

```text
DISCOVERY
Google Maps + Listas B2B + LinkedIn
        ↓
ACCOUNT DATABASE
        ↓
ENRICHMENT
        ↓
ICP QUALIFICATION
        ↓
PRODUCT ROUTER
        ↓
CAMPAIGN / CADENCE ENGINE
        ↓
┌──────────────┬──────────────┬──────────────┐
│   LinkedIn   │  Instagram   │   WhatsApp   │
└──────────────┴──────────────┴──────────────┘
        ↓
CONVERSATION HUB
        ↓
QUALIFICATION
        ↓
MEETING / CTA
        ↓
HIGOR / COMERCIAL
        ↓
OPPORTUNITY / PROPOSAL / SALE
        ↓
REVENUE DATA
        ↓
ANALYTICS
```

---

# 4. Estrutura de pastas

```text
avraham_revenue_machine/
│
├── README.md
├── 00_GOVERNANCE/
├── 01_DISCOVERY/
├── 02_ACCOUNT_DATABASE/
├── 03_ENRICHMENT/
├── 04_ICP_QUALIFICATION/
├── 05_PRODUCT_ROUTER/
├── 06_CAMPAIGN_ENGINE/
├── 07_CHANNELS/
│   ├── WHATSAPP/
│   ├── LINKEDIN/
│   └── INSTAGRAM/
├── 08_CONVERSATION_HUB/
├── 09_QUALIFICATION/
├── 10_MEETING_ENGINE/
├── 11_CRM_PIPELINE/
├── 12_ANALYTICS/
├── 13_PRODUCT_PLAYBOOKS/
│   ├── AI/
│   ├── INFRA/
│   ├── DISPAROS/
│   ├── ATIVOS/
│   ├── PARTNERS/
│   └── SUPPLIERS/
├── 14_PHASES/
└── 15_TESTS/
```

---

# 5. Fases de evolução

## Fase 0 — Fundação

Construir contratos, banco, estados e logs.

## Fase 1 — Demand Engine

Objetivo: gerar R$30k–R$50k/mês em nova receita.

Já deve ser omnichannel:
- LinkedIn;
- Instagram;
- WhatsApp.

## Fase 2 — Revenue Expansion

Objetivo: R$50k–R$150k/mês.

Aumentar:
- ticket;
- qualidade do pipeline;
- mix de ofertas;
- campanhas enterprise;
- infraestrutura;
- grandes operações.

## Fase 3 — Founder Capacity

Otimizar a agenda até a hora comercial do Higor tornar-se gargalo real.

## Fase 4 — Commercial Scale

Adicionar:
- webinars;
- reuniões coletivas;
- demonstrações gravadas;
- closer;
- self-service quando aplicável.

## Fase 5 — Delivery Scale

A máquina passa a respeitar capacidade operacional, fornecedores, ativos e implantação.

## Fase 6 — Revenue Intelligence

Entram previsões, expected revenue, expected gross profit, capacity allocation e otimização automática.

---

# 6. Regra de implantação

Nenhum bloco é integrado ao próximo antes de:

- receber corretamente o input;
- produzir output válido;
- registrar erros;
- evitar duplicidade;
- possuir logs;
- passar por testes mínimos.

Ver `/15_TESTS/`.

---

# 7. Unidade central

A unidade da máquina é a **ACCOUNT**, não a mensagem e não o canal.

Uma empresa pode possuir:

- WhatsApp;
- Instagram;
- LinkedIn;
- vários decisores;
- várias tentativas;
- mais de um produto potencial.

Todos os dados devem pertencer à mesma conta.

---

# 8. Métrica norteadora inicial

A métrica central continua sendo:

**Revenue per 100 Accounts Prospected**

Mas a V1 também deve registrar:

- Accounts Discovered;
- Accounts Qualified;
- Delivery Rate;
- Reply Rate;
- Positive Reply Rate;
- Meeting Booking Rate;
- Show Rate;
- Win Rate;
- Revenue;
- Gross Profit quando aplicável;
- Ticket médio;
- Revenue por produto;
- Revenue por nicho;
- Revenue por canal;
- Revenue por campanha.

---

# 9. Filosofia de construção

Não reduzir a máquina a um único canal.

Não adicionar inteligência sofisticada antes de existir dado real.

Construir uma esteira omnichannel funcional primeiro.

Depois aumentar inteligência.
