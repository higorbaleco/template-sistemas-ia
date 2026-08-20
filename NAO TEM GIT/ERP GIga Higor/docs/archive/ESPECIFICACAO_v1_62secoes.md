# Archived snapshot of `ESPECIFICACAO.md`

> Literal copy preserved for auditability. Replaced in the active docs on 2026-08-19.

# Central Empresarial Local — Especificação Completa

**Versão:** 1.0  
**Modelo:** Aplicação desktop local  
**Data:** 2026-08-19

---

## 1. VISÃO DO PRODUTO

A Central Empresarial Local deve funcionar como a fonte oficial de informações da empresa.

### O que o sistema permite:

- Reconstruir todo o histórico empresarial desde 2020
- Cadastrar todos os clientes que já passaram pela empresa
- Saber quais clientes continuam ativos
- Identificar quando cada cliente entrou
- Identificar quando saiu
- Registrar por que saiu
- Registrar tudo o que foi vendido
- Registrar tudo o que foi executado
- Relacionar vendas com clientes
- Relacionar vendas com produtos
- Relacionar vendas com parceiros
- Relacionar vendas com fornecedores
- Relacionar receitas com custos
- Relacionar receitas com impostos
- Relacionar receitas com comissões
- Calcular margem
- Calcular rentabilidade
- Controlar contas a pagar
- Controlar contas a receber
- Controlar movimentações financeiras
- Separar PF e PJ
- Controlar impostos
- Controlar leads
- Controlar prospecção
- Controlar pipeline comercial
- Controlar propostas
- Registrar motivos de perda
- Controlar leads antigos
- Controlar reativação
- Controlar contratos
- Controlar projetos
- Controlar cases
- Controlar parceiros
- Controlar fornecedores
- Manter histórico de custos
- Avaliar risco
- Avaliar inadimplência
- Medir esforço
- Comparar esforço versus resultado
- Gerar relatórios
- Gerar dashboards
- Gerar rankings
- Acompanhar KPIs históricos e atuais

### Objetivo Principal

O objetivo não é apenas responder: **Quanto a empresa faturou?**

O sistema precisa responder: **Quanto faturou, quanto recebeu, quanto sobrou, quanto trabalho deu, qual foi a margem, quanto risco existiu, quanto demorou para receber e se aquele tipo de negócio deveria ser repetido.**

---

## 2. PRINCÍPIOS DO SISTEMA

### 2.1 Local

Todo o sistema deve funcionar localmente.

**Não depender de:**
- Internet
- Servidor externo
- Login online
- API externa
- Plataforma SaaS
- Armazenamento em nuvem

### 2.2 Simplicidade Operacional

O sistema deve priorizar:
- Velocidade
- Poucos cliques
- Formulários objetivos
- Tabelas
- Filtros
- Pesquisa
- Relatórios
- Estabilidade

**Telas operacionais** não precisam parecer uma aplicação futurista.

**Modernidade visual** deve ficar concentrada principalmente em:
- Dashboard
- Gráficos
- Cards
- KPIs
- Indicadores
- Matrizes
- Análises
- Relatórios executivos

---

## 3. ESTRUTURA GERAL DO SISTEMA

### Menu Principal:

```
Dashboard
├── Histórico
├── Clientes
├── Contatos
├── Comercial
│   ├── Prospecção
│   ├── Pipeline
│   ├── Vendas
│   └── Contratos
├── Relacionamento
│   ├── Clientes
│   ├── Contatos
│   ├── Contratos
│   ├── Projetos
│   └── Cases
├── Financeiro
│   ├── Resumo
│   ├── Receber
│   ├── Pagar
│   ├── Movimentações
│   ├── Fluxo de caixa
│   └── Impostos
├── Catálogo
│   ├── Produtos
│   ├── Custos
│   └── Fornecedores
├── Rede
│   └── Parceiros
├── Gestão
│   ├── Histórico
│   ├── Risco e Retenção
│   ├── Inteligência
│   └── Relatórios
└── Sistema
    ├── Importações
    ├── Documentos
    ├── Backup
    └── Configurações
```

---

## 4. ARQUITETURA DE ARQUIVOS LOCAL

```
CentralEmpresa/
│
├── app/                           # Código da aplicação
│   ├── backend/
│   ├── frontend/
│   └── main.js
│
├── dados/                         # Dados da empresa
│   ├── empresa.db                 # Banco principal
│   ├── configuracoes/
│   │   ├── sistema.json
│   │   ├── preferencias.json
│   │   └── seguranca.dat
│   ├── documentos/
│   │   ├── clientes/
│   │   ├── fornecedores/
│   │   ├── parceiros/
│   │   ├── contratos/
│   │   ├── projetos/
│   │   ├── financeiro/
│   │   ├── impostos/
│   │   ├── propostas/
│   │   ├── cases/
│   │   └── diversos/
│   ├── importacoes/
│   │   ├── entrada/
│   │   ├── processados/
│   │   ├── pendentes/
│   │   └── rejeitados/
│   ├── exportacoes/
│   │   ├── csv/
│   │   ├── planilhas/
│   │   ├── pdf/
│   │   └── relatorios/
│   ├── backups/
│   │   ├── diarios/
│   │   ├── semanais/
│   │   ├── mensais/
│   │   └── manuais/
│   ├── logs/
│   └── temporarios/
│
├── docs/                          # Documentação
├── README.md
└── CLAUDE.md
```

---

## 5. BANCO PRINCIPAL

**Arquivo:** `dados/empresa.db`

Esse banco deve guardar os dados estruturados.

Documentos grandes não devem obrigatoriamente ficar dentro do banco.

### O banco deve armazenar:

- ID do documento
- Nome
- Categoria
- Caminho do arquivo
- Cliente relacionado
- Venda relacionada
- Projeto relacionado
- Contrato relacionado
- Data
- Observação

---

## 6. PADRÃO DE TODAS AS TABELAS

Sempre que aplicável, toda tabela deve possuir:

```sql
id                  -- UUID ou auto-increment
created_at          -- Timestamp de criação
updated_at          -- Timestamp de atualização
created_by          -- Usuário que criou
updated_by          -- Usuário que atualizou
archived_at         -- Timestamp de arquivamento (soft-delete)
is_active           -- Boolean
notes               -- Notas livres
```

### Para registros históricos:

```sql
data_quality        -- COMPLETO | PARCIAL | ESTIMADO | PENDENTE_REVISAO
data_source         -- Origem dos dados
is_estimated        -- Boolean
needs_review        -- Boolean
```

---

## 7. QUALIDADE DOS DADOS HISTÓRICOS

Como informações anteriores podem estar incompletas, cada registro histórico deve possuir uma classificação.

### Valores:

- **COMPLETO** — Todos os dados confirmados
- **PARCIAL** — Alguns dados faltando ou aproximados
- **ESTIMADO** — Dados calculados/inferidos
- **PENDENTE_REVISAO** — Precisa de revisão antes de usar

### Exemplo:

```
Cliente: confirmado
Valor venda: confirmado
Data: aproximada
Custo: estimado

Resultado:
data_quality = PARCIAL
is_estimated = true
```

---

## 8. AUTENTICAÇÃO LOCAL

### Tela Inicial

```
CENTRAL EMPRESARIAL

Senha
[________________]

[Entrar]

[ ] Manter desbloqueado neste computador
```

---

## 9. SENHA MESTRA

O sistema deve possuir uma senha mestre local.

### Regras Mínimas:

- Mínimo de 8 caracteres
- Senha nunca armazenada diretamente
- Armazenar somente representação segura da senha (bcrypt)
- Bloquear temporariamente após várias tentativas incorretas
- Opção de alterar senha
- Opção de logout
- Bloqueio automático por inatividade configurável

### Parâmetro:

**Bloquear após:**
- 5 minutos
- 15 minutos
- 30 minutos
- 1 hora
- Nunca

---

## 10. PROTEÇÃO DOS DADOS

Existem três níveis possíveis:

### Nível 1: Senha Aplicação
Senha para abrir o aplicativo.

### Nível 2: Proteção SO
Proteção do computador pelo sistema operacional.

### Nível 3: Criptografia
Criptografia do arquivo de dados.

Para informações empresariais sensíveis, o sistema deve ser preparado para trabalhar com proteção do banco em repouso.

A senha nunca deve ficar armazenada em texto simples.

---

## 11. USUÁRIOS LOCAIS

Mesmo que inicialmente exista apenas um usuário, o banco deve suportar usuários locais.

### Tabela: users

```sql
id                  -- UUID
name                -- Nome completo
username            -- Username único
password_hash       -- Hash bcrypt
role                -- ADMIN | FINANCEIRO | COMERCIAL | OPERACIONAL | LEITURA
is_active           -- Boolean
last_login_at       -- Timestamp
failed_attempts     -- Contador
locked_until        -- Timestamp de bloqueio
created_at
updated_at
```

### Papéis:

- **ADMIN** — Acesso total
- **FINANCEIRO** — Acesso a financeiro e relatórios
- **COMERCIAL** — Acesso a comercial e clientes
- **OPERACIONAL** — Acesso a projetos e contratos
- **LEITURA** — Somente leitura

Inicialmente pode existir apenas **ADMIN**.

---

## 12. DASHBOARD PRINCIPAL

O dashboard é a principal área visual moderna do sistema.

### Filtros Globais:

- Período
- Empresa
- PF/PJ
- Produto
- Cliente
- Segmento
- Responsável
- Parceiro
- Canal
- Origem

### Períodos Rápidos:

- Hoje
- Esta semana
- Este mês
- Mês anterior
- Este trimestre
- Este ano
- Ano anterior
- Desde 2020
- Personalizado

---

## 13. DASHBOARD EXECUTIVO

### Cards Principais:

- **Faturamento** — Total recebido + não recebido
- **Receita Recebida** — Dinheiro em caixa
- **Margem** — Valor absoluto
- **Margem %** — Percentual
- **Lucro Estimado** — Receita - custos - impostos
- **A Receber** — Total em aberto
- **A Pagar** — Total de obrigações
- **Vencido** — Contas atrasadas
- **Inadimplência** — Valor e %
- **Clientes Ativos** — Contagem
- **Novos Clientes** — Este período
- **Clientes Perdidos** — Este período
- **Pipeline** — Oportunidades em aberto
- **Ticket Médio** — Receita / quantidade
- **LTV Médio** — Lifetime value
- **Receita Recorrente** — Contractual + assinatura

---

## 14. GRÁFICO HISTÓRICO PRINCIPAL

**Gráfico de linha com três linhas:**

- Receita
- Margem
- Resultado

**Eixo Temporal:**

2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026

**Permitir Alternar:**

- Mensal
- Trimestral
- Anual

---

## 15. CLIENTE 360º

Cada cliente deve possuir uma ficha completa.

### Cabeçalho:

- Nome fantasia
- Razão social
- CPF/CNPJ
- Tipo PF/PJ
- Segmento
- Cidade
- Estado
- Status
- Data de entrada
- Data de saída
- Tempo de relacionamento

### Abas:

- Visão geral
- Contatos
- Timeline
- Oportunidades
- Propostas
- Vendas
- Contratos
- Projetos
- Financeiro
- Produtos
- Atividades
- Documentos
- Cases
- Risco
- Retenção

---

## 16. MÉTRICAS DO CLIENTE

Para cada cliente, calcular:

- Faturamento histórico
- Recebimento histórico
- Margem histórica
- Margem %
- Quantidade de vendas
- Quantidade de projetos
- Quantidade de contratos
- Produtos comprados
- Ticket médio
- LTV receita
- LTV margem
- Inadimplência
- Dias médios de pagamento
- Esforço total
- Margem por hora
- Score de risco
- Score econômico

---

## 17. TABELA CLIENTS

```sql
id                      -- UUID
type                    -- PF | PJ
legal_name              -- Razão social
trade_name              -- Nome fantasia
cpf_cnpj                -- Identificador único
state_registration      -- Inscrição estadual
segment_id              -- ID do segmento
subsegment              -- Subramo
website                 -- Website
instagram               -- Instagram
linkedin                -- LinkedIn
email                   -- Email
phone                   -- Telefone
whatsapp                -- WhatsApp
city                    -- Cidade
state                   -- Estado (UF)
country                 -- País (padrão: Brasil)
postal_code             -- CEP
address                 -- Endereço
status                  -- PROSPECT | LEAD | OPORTUNIDADE | CLIENTE_ATIVO | ...
acquisition_source_id   -- Como chegou
partner_id              -- Parceiro responsável
owner_user_id           -- Usuário responsável
first_contact_at        -- Primeira abordagem
customer_since          -- Data que virou cliente
ended_at                -- Data de saída
exit_type               -- Motivo da saída
exit_reason_id          -- ID do motivo
exit_notes              -- Notas sobre saída
risk_score              -- 0-100
economic_score          -- 0-100
data_quality            -- COMPLETO | PARCIAL | ...
data_source             -- Origem
is_estimated            -- Boolean
needs_review            -- Boolean
created_at
updated_at
archived_at
```

---

## 18. STATUS DO CLIENTE

- **PROSPECT** — Potencial cliente, sem contato confirmado
- **LEAD** — Contato confirmado
- **OPORTUNIDADE** — Demonstrou interesse
- **CLIENTE_ATIVO** — Contratante, com fluxo ativo
- **CLIENTE_INATIVO** — Sem movimentação há X dias
- **EX_CLIENTE** — Cancelou
- **BLOQUEADO** — Não trabalhar mais

---

## 19. CONTATOS

### Tabela: contacts

```sql
id                  -- UUID
client_id           -- FK para clients
name                -- Nome
job_title           -- Cargo
department          -- Departamento
email               -- Email
phone               -- Telefone
whatsapp            -- WhatsApp
linkedin            -- LinkedIn
instagram           -- Instagram
is_decision_maker   -- Boolean
is_primary          -- Boolean
birthday            -- Aniversário
notes               -- Notas
created_at
updated_at
```

---

## 20. TIMELINE DO CLIENTE

### Tabela: timeline_events

```sql
id                      -- UUID
client_id               -- FK para clients
event_type              -- LEAD_CREATED | CONTACT | MEETING | ...
event_date              -- Data do evento
title                   -- Título
description             -- Descrição
related_entity_type     -- sale | project | contract
related_entity_id       -- ID da entidade relacionada
user_id                 -- Usuário que registrou
created_at
```

### Tipos de Eventos:

- **LEAD_CREATED** — Lead gerado
- **CONTACT** — Contato feito
- **MEETING** — Reunião agendada/realizada
- **PROPOSAL** — Proposta enviada
- **SALE** — Venda realizada
- **PAYMENT** — Pagamento recebido
- **PROJECT_STARTED** — Projeto iniciado
- **PROJECT_FINISHED** — Projeto finalizado
- **CONTRACT_STARTED** — Contrato ativado
- **CONTRACT_FINISHED** — Contrato encerrado
- **SUPPORT** — Suporte fornecido
- **INCIDENT** — Problema ocorreu
- **CHURN** — Cliente saiu
- **REACTIVATION** — Cliente reativado
- **NOTE** — Nota geral

---

## 21. PROSPECÇÃO

Módulo destinado à geração e acompanhamento de prospects.

### Menu:

- Prospects
- Listas
- Canais
- Tentativas
- Respostas
- Cadências
- Resultados

### Tabela: prospects

```sql
id                  -- UUID
company_name        -- Razão social
contact_name        -- Nome do contato
segment_id          -- ID do segmento
city                -- Cidade
state               -- Estado
website             -- Website
email               -- Email
phone               -- Telefone
whatsapp            -- WhatsApp
linkedin            -- LinkedIn
instagram           -- Instagram
source_id           -- Origem
channel_id          -- Canal
list_id             -- ID da lista
owner_user_id       -- Responsável
status              -- NOVO | NAO_TRABALHADO | EM_CADENCIA | ...
first_attempt_at    -- Primeira tentativa
last_attempt_at     -- Última tentativa
next_action_at      -- Próxima ação
attempt_count       -- Número de tentativas
response_status     -- Status da resposta
converted_to_lead   -- Boolean
client_id           -- FK para clients (quando convertido)
notes
created_at
updated_at
```

---

## 22. STATUS DO PROSPECT

- **NOVO** — Recém adicionado
- **NAO_TRABALHADO** — Ainda não abordado
- **EM_CADENCIA** — Em processo de prospecção
- **RESPONDEU** — Respondeu à abordagem
- **QUALIFICADO** — Qualificado para venda
- **SEM_INTERESSE** — Sem interesse
- **SEM_RESPOSTA** — Não respondeu
- **CONVERTIDO** — Virou cliente
- **DESCARTADO** — Descartado

---

## 23. PIPELINE COMERCIAL

### Tabela: pipelines

```sql
id          -- UUID
name        -- Nome do pipeline
description -- Descrição
is_active   -- Boolean
```

### Tabela: pipeline_stages

```sql
id                      -- UUID
pipeline_id             -- FK para pipelines
name                    -- Nome da etapa
position                -- Ordem visual
probability_default     -- % padrão
is_won                  -- É etapa de ganho?
is_lost                 -- É etapa de perda?
```

### Etapas Iniciais Sugeridas:

1. Prospecção
2. Contato
3. Qualificação
4. Reunião
5. Diagnóstico
6. Proposta
7. Negociação
8. Fechado Ganho
9. Fechado Perdido

---

## 24. OPORTUNIDADES

### Tabela: opportunities

```sql
id                  -- UUID
client_id           -- FK
contact_id          -- FK
pipeline_id         -- FK
stage_id            -- FK para pipeline_stages
owner_user_id       -- Responsável
partner_id          -- Parceiro envolvido
title               -- Título
description         -- Descrição
estimated_value     -- Valor estimado
probability         -- % de probabilidade (0-100)
weighted_value      -- Valor * probabilidade
expected_close_date -- Data esperada de fechamento
created_at
won_at              -- Data de ganho
lost_at             -- Data de perda
status              -- OPEN | WON | LOST
lost_reason_id      -- Motivo de perda
lost_notes          -- Notas sobre perda
source_id           -- Origem
channel_id          -- Canal
campaign            -- Campanha
notes
updated_at
```

---

## 25. PROPOSTAS

### Tabela: proposals

```sql
id                              -- UUID
opportunity_id                  -- FK
client_id                       -- FK
proposal_number                 -- Número sequencial
title                           -- Título
created_at
sent_at                         -- Data de envio
valid_until                     -- Validade
status                          -- RASCUNHO | ENVIADA | VISUALIZADA | ...
subtotal                        -- Subtotal
discount                        -- Desconto
total                           -- Total
estimated_cost                  -- Custo estimado
estimated_margin                -- Margem estimada
estimated_margin_percentage     -- % de margem
document_id                     -- ID do documento PDF/Word
notes
updated_at
```

### Status da Proposta:

- RASCUNHO
- ENVIADA
- VISUALIZADA
- NEGOCIACAO
- APROVADA
- RECUSADA
- EXPIRADA
- CANCELADA

### Tabela: proposal_items

```sql
id                      -- UUID
proposal_id             -- FK
product_id              -- FK
description             -- Descrição
quantity                -- Quantidade
unit_price              -- Preço unitário
discount                -- Desconto
total                   -- Total
estimated_unit_cost     -- Custo unitário estimado
estimated_total_cost    -- Custo total
```

---

## 26. VENDAS

### Tabela: sales

```sql
id                          -- UUID
sale_number                 -- Número sequencial
client_id                   -- FK
opportunity_id              -- FK
proposal_id                 -- FK
partner_id                  -- FK (parceiro responsável)
seller_user_id              -- FK (vendedor)
sale_date                   -- Data da venda
competence_date             -- Competência (faturamento)
status                      -- CONFIRMADA | EM_EXECUCAO | CONCLUIDA | ...
gross_value                 -- Valor bruto
discount_value              -- Desconto
net_value                   -- Valor líquido
direct_cost                 -- Custo direto
commission_cost             -- Custo de comissão
tax_cost                    -- Impostos
other_variable_cost         -- Outros custos variáveis
contribution_margin         -- Margem de contribuição
contribution_margin_percentage  -- %
effort_hours                -- Horas consumidas
margin_per_hour             -- Margem/hora
payment_terms               -- Termos (ex: 3x30)
notes
created_at
updated_at
```

### Status da Venda:

- CONFIRMADA
- EM_EXECUCAO
- CONCLUIDA
- CANCELADA
- ESTORNADA
- PARCIAL

### Tabela: sale_items

```sql
id                  -- UUID
sale_id             -- FK
product_id          -- FK
quantity            -- Quantidade
unit_price          -- Preço unitário
discount            -- Desconto
total_value         -- Total
unit_cost_snapshot  -- Custo congelado no momento
total_cost          -- Custo total
margin_value        -- Margem
margin_percentage   -- %
```

**Importante:** O custo deve ser congelado no momento da venda. Alterações futuras no custo do produto não podem alterar o histórico.

---

## 27. CÁLCULO ECONÔMICO DA VENDA

```
Receita Líquida
= valor bruto - descontos

Margem de Contribuição
= receita líquida - custos diretos - comissões - impostos - outros custos variáveis

Margem %
= margem de contribuição ÷ receita líquida × 100
```

---

## 28. ESFORÇO

Cada venda, projeto ou cliente pode registrar esforço.

### Tabela: effort_entries

```sql
id              -- UUID
client_id       -- FK
sale_id         -- FK
project_id      -- FK
category        -- COMERCIAL | IMPLANTACAO | OPERACIONAL | SUPORTE | ...
effort_date     -- Data do esforço
hours           -- Horas (se conhecidas)
effort_level    -- 1-5 (se horas desconhecidas)
description     -- Descrição
user_id         -- FK
created_at
```

### Categorias:

- COMERCIAL
- IMPLANTACAO
- OPERACIONAL
- SUPORTE
- ADMINISTRATIVO
- FINANCEIRO
- GESTAO
- OUTRO

### Esforço Histórico sem Horas:

Quando horas exatas não existirem, usar escala subjetiva:

```
1 = Muito baixo
2 = Baixo
3 = Médio
4 = Alto
5 = Muito alto
```

**Não converter** automaticamente nível em horas.

---

## 29. MARGEM POR HORA

```
Margem por Hora = Margem de Contribuição ÷ Horas Totais

Exemplo:
Margem: R$ 12.000
Horas: 10
Margem/hora: R$ 1.200
```

---

## 30. CONTRATOS

### Tabela: contracts

```sql
id                  -- UUID
client_id           -- FK
sale_id             -- FK
contract_number     -- Número sequencial
title               -- Título
start_date          -- Data de início
end_date            -- Data de encerramento
renewal_date        -- Data de renovação
status              -- RASCUNHO | ATIVO | SUSPENSO | ...
billing_frequency   -- MENSAL | TRIMESTRAL | ANUAL
monthly_value       -- Valor mensal
total_value         -- Valor total
auto_renew          -- Boolean
notice_days         -- Dias de aviso para cancelamento
exit_type           -- Motivo de encerramento
exit_reason_id      -- ID do motivo
exit_notes          -- Notas
document_id         -- ID do documento
created_at
updated_at
```

### Status do Contrato:

- RASCUNHO
- ATIVO
- SUSPENSO
- ENCERRADO
- CANCELADO
- RENOVADO
- INADIMPLENTE

### Tipo de Encerramento:

- PROJETO_CONCLUIDO
- ENCERRAMENTO_SAUDAVEL
- CHURN
- CANCELAMENTO
- INADIMPLENCIA
- ROMPIMENTO_EMPRESA
- MIGRACAO
- INTERNALIZACAO
- OUTRO

---

## 31. PROJETOS

### Tabela: projects

```sql
id                  -- UUID
client_id           -- FK
sale_id             -- FK
contract_id         -- FK
name                -- Nome
description         -- Descrição
project_type        -- CONSULTORIA | IMPLEMENTACAO | DESENVOLVIMENTO | ...
status              -- PLANEJADO | EM_ANDAMENTO | PAUSADO | ...
start_date          -- Data de início
expected_end_date   -- Data prevista
actual_end_date     -- Data real
responsible_user_id -- Responsável
planned_hours       -- Horas planejadas
actual_hours        -- Horas gastas
complexity_level    -- 1-5
success_level       -- 1-5
case_candidate      -- Boolean (virou case?)
notes
created_at
updated_at
```

### Status do Projeto:

- PLANEJADO
- EM_ANDAMENTO
- PAUSADO
- AGUARDANDO_CLIENTE
- CONCLUIDO
- CANCELADO

### Complexidade:

```
1 = Muito baixa
2 = Baixa
3 = Média
4 = Alta
5 = Muito alta
```

---

## 32. CASES

### Tabela: cases

```sql
id                  -- UUID
client_id           -- FK
project_id          -- FK
sale_id             -- FK
title               -- Título
problem             -- Problema inicial
solution            -- Solução implementada
execution_summary   -- Resumo da execução
before_state        -- Estado antes
after_state         -- Estado depois
result_summary      -- Resumo dos resultados
metrics             -- Métricas (JSON)
testimonial         -- Depoimento do cliente
can_publish         -- Pode publicar?
case_type           -- COMERCIAL | TECNICO | FINANCEIRO | ...
status              -- DRAFT | PUBLISHED | ARCHIVED
created_at
updated_at
```

### Tipos:

- COMERCIAL
- TECNICO
- FINANCEIRO
- ESCALA
- AUTOMACAO
- PARCERIA
- OUTRO

---

## 33. FINANCEIRO

### Menu:

```
Resumo
├── Contas a Receber
├── Contas a Pagar
├── Movimentações
├── Contas
├── Categorias
├── Parcelamentos
├── Recorrências
├── Fluxo de Caixa
├── DRE Gerencial
├── PF x PJ
└── Inadimplência
```

---

## 34. CONTAS FINANCEIRAS

### Tabela: financial_accounts

```sql
id              -- UUID
name            -- Nome
type            -- CONTA_CORRENTE | POUPANCA | DINHEIRO | CARTEIRA | CARTAO | OUTRO
nature          -- PF | PJ
institution     -- Banco/Instituição
opening_balance -- Saldo inicial
current_balance -- Saldo atual
is_active       -- Boolean
notes
```

---

## 35. CONTAS A RECEBER

### Tabela: accounts_receivable

```sql
id                      -- UUID
client_id               -- FK
sale_id                 -- FK
contract_id             -- FK
description             -- Descrição
installment_number      -- Número da parcela
installment_total       -- Total de parcelas
competence_date         -- Data de competência
issue_date              -- Data de emissão
due_date                -- Data de vencimento
expected_date           -- Data esperada de recebimento
received_date           -- Data real de recebimento
gross_value             -- Valor bruto
discount                -- Desconto
interest                -- Juros
fine                    -- Multa
received_value          -- Valor recebido
remaining_value         -- Saldo a receber
status                  -- ABERTO | PARCIAL | PAGO | VENCIDO | ...
financial_account_id    -- FK para conta que recebeu
payment_method          -- DINHEIRO | CARTAO | TRANSFERENCIA | ...
document_id             -- ID do documento
notes
created_at
updated_at
```

### Status a Receber:

- ABERTO
- PARCIAL
- PAGO
- VENCIDO
- RENEGOCIADO
- CANCELADO
- INADIMPLENTE

---

## 36. CONTAS A PAGAR

### Tabela: accounts_payable

```sql
id                      -- UUID
supplier_id             -- FK
partner_id              -- FK
sale_id                 -- FK
product_id              -- FK
tax_id                  -- FK
description             -- Descrição
nature                  -- Tipo
category_id             -- FK
cost_center_id          -- FK
competence_date         -- Data de competência
issue_date              -- Data de emissão
due_date                -- Data de vencimento
paid_date               -- Data de pagamento
gross_value             -- Valor bruto
discount                -- Desconto
interest                -- Juros
fine                    -- Multa
paid_value              -- Valor pago
remaining_value         -- Saldo a pagar
status                  -- ABERTO | PARCIAL | PAGO | VENCIDO | ...
financial_account_id    -- FK para conta que pagou
payment_method          -- DINHEIRO | CARTAO | TRANSFERENCIA | ...
document_id             -- ID do documento
notes
created_at
updated_at
```

---

## 37. MOVIMENTAÇÕES

### Tabela: financial_transactions

```sql
id                      -- UUID
financial_account_id    -- FK
transaction_date        -- Data
type                    -- ENTRADA | SAIDA | TRANSFERENCIA | AJUSTE
nature                  -- PF | PJ
category_id             -- FK
cost_center_id          -- FK
description             -- Descrição
amount                  -- Valor
receivable_id           -- FK (se relacionado)
payable_id              -- FK (se relacionado)
client_id               -- FK
supplier_id             -- FK
partner_id              -- FK
sale_id                 -- FK
project_id              -- FK
notes
created_at
```

### Tipos:

- ENTRADA — Dinheiro entra
- SAIDA — Dinheiro sai
- TRANSFERENCIA — Entre contas
- AJUSTE — Correção

---

## 38. CATEGORIAS FINANCEIRAS

### Exemplos de Receita:

- Receita de serviços
- Receita de produtos
- Receita de representação
- Receita recorrente

### Exemplos de Despesa:

- Fornecedor
- Comissão
- Impostos
- Contabilidade
- Aluguel
- Marketing
- Software
- Freelancer
- Funcionários
- Viagens
- Combustível
- Administrativo
- Pró-labore
- Outros

---

## 39. PF E PJ

Todo lançamento financeiro deve possuir:

```
nature = PF

OU

nature = PJ
```

Filtro global:

- Tudo
- PF
- PJ

---

## 40. FLUXO DE CAIXA

### Apresentar:

**Realizado:**
- Saldo inicial
- Entradas realizadas
- Saídas realizadas
- Saldo realizado

**Projetado:**
- Entradas previstas
- Saídas previstas
- Saldo projetado

**Por Período:**
- Dia
- Semana
- Mês
- Ano

---

## 41. DRE GERENCIAL

### Estrutura:

```
Receita Bruta
(-) Descontos
= Receita Líquida

(-) Custos Variáveis
(-) Fornecedores
(-) Comissões
(-) Impostos Variáveis

= Margem de Contribuição

(-) Despesas Operacionais
(-) Despesas Administrativas
(-) Marketing
(-) Estrutura
(-) Pró-labore

= Resultado Operacional
```

---

## 42. INADIMPLÊNCIA

### Dashboard:

- Total vencido
- Quantidade de clientes inadimplentes
- Valor médio vencido
- Maior inadimplente
- Dias médios de atraso
- Índice de inadimplência

### Fórmula:

```
Índice de Inadimplência =
Valor Vencido ÷ Valor Total Faturado × 100
```

---

## 43. PRODUTOS

### Tabela: products

```sql
id                          -- UUID
name                        -- Nome
description                 -- Descrição
type                        -- PRODUTO | SERVICO | PROJETO | RECORRENCIA | ...
category_id                 -- FK
sku                         -- SKU único
status                      -- ATIVO | INATIVO | DESCONTINUADO
default_sale_price          -- Preço padrão
current_cost                -- Custo atual
default_tax_rate            -- Taxa de imposto %
default_commission_rate     -- Taxa de comissão %
recurring                   -- Boolean
billing_frequency           -- MENSAL | TRIMESTRAL | ANUAL
effort_level                -- 1-5 (esforço típico)
notes
created_at
updated_at
```

### Tipos:

- PRODUTO
- SERVICO
- PROJETO
- RECORRENCIA
- INTERMEDIACAO
- REPRESENTACAO
- OUTRO

### Histórico de Custo

**Tabela: product_cost_history**

```sql
id                  -- UUID
product_id          -- FK
supplier_id         -- FK
valid_from          -- Data início validade
valid_until         -- Data fim validade
unit_cost           -- Custo unitário
minimum_quantity    -- Qt mínima
maximum_quantity    -- Qt máxima
notes
created_at
```

**Nunca sobrescrever histórico de custo.**

### Histórico de Preço

**Tabela: product_price_history**

```sql
id                  -- UUID
product_id          -- FK
valid_from          -- Data início
valid_until         -- Data fim
sale_price          -- Preço
minimum_quantity    -- Qt mínima
maximum_quantity    -- Qt máxima
notes
created_at
```

---

## 44. FORNECEDORES

### Tabela: suppliers

```sql
id              -- UUID
name            -- Nome
legal_name      -- Razão social
cpf_cnpj        -- CPF/CNPJ
contact_name    -- Contato
email           -- Email
phone           -- Telefone
whatsapp        -- WhatsApp
category        -- Categoria
payment_terms   -- Termos padrão
risk_level      -- Baixo | Médio | Alto
notes
created_at
updated_at
```

---

## 45. PARCEIROS

### Tabela: partners

```sql
id                              -- UUID
name                            -- Nome
company_name                    -- Razão social
cpf_cnpj                        -- CPF/CNPJ
type                            -- INDICACAO | REPRESENTANTE | REVENDEDOR | ...
email                           -- Email
phone                           -- Telefone
whatsapp                        -- WhatsApp
default_commission_type         -- PERCENTUAL | VALOR_FIXO | POR_UNIDADE
default_commission_value        -- Valor padrão
status                          -- ATIVO | INATIVO
notes
created_at
updated_at
```

### Tipos:

- INDICACAO
- REPRESENTANTE
- REVENDEDOR
- AFILIADO
- ESTRATEGICO
- INTERMEDIADOR
- FORNECEDOR
- OUTRO

---

## 46. COMISSÕES

### Tabela: commissions

```sql
id                  -- UUID
partner_id          -- FK
sale_id             -- FK
client_id           -- FK
base_value          -- Valor base
commission_type     -- PERCENTUAL | VALOR_FIXO | POR_UNIDADE
commission_rate     -- % ou valor
commission_value    -- Valor calculado
due_date            -- Data de pagamento
paid_date           -- Data paga
status              -- ABERTO | PAGO | CANCELADO
notes
created_at
```

---

## 47. IMPORTAÇÕES HISTÓRICAS

### Criar Módulo: Importações

**Objetivo:** Reconstruir toda a empresa desde 2020.

**Fontes:**

- Planilhas
- CSV
- Extratos
- CRMs antigos
- Notas fiscais
- Contratos
- Propostas
- Listas
- Arquivos financeiros

### Staging:

```
IMPORTADO
    ↓
STAGING
    ↓
REVISÃO
    ↓
CONFIRMAÇÃO
    ↓
BANCO DEFINITIVO
```

### Tabela: import_batches

```sql
id              -- UUID
source_name     -- Nome da fonte
file_name       -- Nome do arquivo
import_type     -- Tipo de importação
imported_at     -- Data
status          -- STAGING | REVIEW | CONFIRMED | ERROR
total_rows      -- Total de linhas
valid_rows      -- Linhas válidas
error_rows      -- Linhas com erro
notes
```

### Tabela: import_staging

```sql
id                      -- UUID
batch_id                -- FK
row_number              -- Número da linha
raw_data                -- Dados brutos
suggested_entity        -- Entidade sugerida
suggested_match_id      -- ID sugerido
confidence              -- % de confiança
status                  -- PENDING | CONFIRMED | IGNORED | ERROR
review_notes            -- Notas da revisão
```

---

## 48. DETECÇÃO DE DUPLICIDADE

Antes de criar cliente, comparar:

- CPF/CNPJ
- Nome
- Razão social
- E-mail
- Telefone
- WhatsApp

Exibir possível duplicidade.

**Nunca mesclar automaticamente sem confirmação.**

---

## 49. RISCO DO CLIENTE

O sistema deve trabalhar com diferentes componentes:

### Componentes:

- **Risco Financeiro** — Atrasos, inadimplência, renegociações
- **Risco Comercial** — Pressão por desconto, instabilidade
- **Risco Operacional** — Chamados, incidentes, customizações
- **Risco Estratégico** — Dependência, concentração

### Score de Risco (0-100):

```
0-20    = Muito baixo
21-40   = Baixo
41-60   = Moderado
61-80   = Alto
81-100  = Crítico
```

O sistema deve mostrar os componentes que geraram a nota.

---

## 50. SCORE ECONÔMICO DO CLIENTE

### Objetivo:

Medir qualidade econômica e operacional do relacionamento.

### Componentes Iniciais:

- Margem
- Margem por hora
- Recorrência
- Pontualidade
- Retenção
- Potencial de expansão
- Esforço
- Risco

### Pesos Iniciais Sugeridos:

```
Margem                    20%
Margem por hora           20%
Pontualidade              15%
Recorrência               15%
Retenção                  10%
Potencial de expansão     10%
Esforço                    5%
Risco                      5%
```

Todos os pesos devem ser configuráveis.

### Classificação:

```
90-100   = Excelente
75-89    = Muito bom
60-74    = Bom
45-59    = Atenção
30-44    = Ruim
0-29     = Crítico
```

---

## 51. CLASSIFICAÇÃO DE NEGÓCIOS

O sistema deve permitir classificar vendas ou projetos como:

- **OURO** — Ótimo negócio
- **ESCALAVEL** — Potencial de crescimento
- **ESTRATEGICO** — Importante para empresa
- **FATURAMENTO_ENGANOSO** — Alta receita, baixa margem
- **RISCO** — Alto risco
- **RENEGOCIAR** — Deve renegociar
- **DESCONTINUAR** — Não repetir

---

## 52. FATURAMENTO ENGANOSO

**Conceito:**

Negócio com:

- Receita alta
- Margem baixa
- Esforço alto

O objetivo é impedir que faturamento bruto seja confundido com qualidade do negócio.

---

## 53. MATRIZ MARGEM X ESFORÇO

### Quadrantes:

```
Alta Margem + Baixo Esforço
→ EXCELENTE

Alta Margem + Alto Esforço
→ Rentável, mas pesado

Baixa Margem + Baixo Esforço
→ Avaliar escala

Baixa Margem + Alto Esforço
→ RUIM
```

---

## 54. INTELIGÊNCIA

### Menu:

```
Clientes
├── Produtos
├── Parceiros
├── Canais
├── Segmentos
├── Rentabilidade
├── Esforço
├── Risco
├── Retenção
└── Histórico
```

---

## 55. RANKINGS

### Top Clientes:

- Top faturamento
- Top margem
- Top margem %
- Top margem/hora
- Top LTV
- Top recorrência
- Top pontualidade
- Top retenção
- Piores margens
- Maior esforço
- Maior inadimplência
- Maior risco
- Menor margem/hora

### Top Produtos:

- Mais vendidos
- Maior faturamento
- Maior margem
- Maior margem %
- Maior margem/hora
- Mais recorrentes
- Maior retenção
- Maior churn
- Maior esforço

### Top Parceiros:

- Mais leads
- Mais clientes
- Mais vendas
- Maior faturamento
- Maior margem
- Maior margem/hora
- Maior conversão
- Menor inadimplência

---

## 56. CHURN

**Fórmula:**

```
Churn = Clientes Perdidos no Período ÷ Clientes Ativos no Início × 100
```

Projetos concluídos naturalmente não contam automaticamente como churn.

---

## 57. LTV

### LTV de Receita:

```
LTV Receita = Soma de todas as receitas do cliente
```

### LTV de Margem:

```
LTV Margem = Soma de todas as margens geradas pelo cliente
```

**Essa deve ser uma das principais métricas do sistema.**

---

## 58. RETENÇÃO E RENOVAÇÃO

### KPIs:

- Clientes ativos
- Clientes perdidos
- Churn
- Tempo médio de contrato
- LTV
- Taxa de renovação
- Taxa de recompra
- Clientes reativados

---

## 59. VISÃO DE IMPLEMENTAÇÃO POR FASE

### FASE 1: Fundação

- Login
- Banco
- Configurações
- Clientes
- Contatos
- Pesquisa
- Backup

### FASE 2: Comercial

- Leads
- Prospecção
- Pipeline
- Oportunidades
- Propostas
- Vendas

### FASE 3: Financeiro

- Contas
- Receber
- Pagar
- Movimentações
- PF/PJ
- Fluxo de caixa
- Impostos

### FASE 4: Operação

- Produtos
- Custos
- Parceiros
- Fornecedores
- Contratos
- Projetos
- Cases

### FASE 5: Histórico

- Importações
- Reconciliação
- Dados 2020+
- Qualidade de dados

### FASE 6: Inteligência

- Dashboards
- KPIs
- Rentabilidade
- Margem
- Esforço
- Risco
- Retenção
- Cohorts
- Rankings

### FASE 7: Refinamento

- Relatórios
- Exportações
- Alertas
- Atalhos
- Filtros avançados
- Customização

---

## 60. CRITÉRIO DE SUCESSO DO SISTEMA

O projeto estará cumprindo sua função quando for possível responder rapidamente perguntas como:

- Quanto faturamos desde 2020?
- Quanto realmente recebemos?
- Qual foi nossa margem histórica?
- Qual ano foi mais rentável?
- Qual produto mais faturou?
- Qual produto mais deu lucro?
- Qual produto tem maior margem/hora?
- Qual cliente mais faturou?
- Qual cliente mais gerou margem?
- Qual cliente mais consumiu tempo?
- Quais clientes são inadimplentes?
- Quais clientes deram prejuízo?
- Quais clientes deveríamos recuperar?
- Quais clientes não deveríamos atender novamente?
- Qual segmento é mais rentável?
- Qual canal gera melhores clientes?
- Qual parceiro gera melhores negócios?
- Qual parceiro gera muito faturamento mas pouca margem?
- Por que perdemos vendas?
- Por que perdemos clientes?
- Quanto temos para receber?
- Quanto temos para pagar?
- Qual é nosso fluxo de caixa projetado?
- Quanto pagamos em impostos?
- Qual é nossa receita recorrente?
- Qual é nosso churn?
- Qual é nosso LTV?
- Quanto esforço é necessário para cada produto?
- Quais negócios parecem bons pelo faturamento, mas são ruins economicamente?

---

## 61. PRINCÍPIO FINAL DA CENTRAL

A Central Empresarial não deve ser apenas um lugar para registrar informações.

Ela deve criar uma **linha lógica completa:**

```
PROSPECÇÃO
    ↓
LEAD
    ↓
OPORTUNIDADE
    ↓
PROPOSTA
    ↓
VENDA
    ↓
CONTRATO
    ↓
PROJETO
    ↓
FATURAMENTO
    ↓
RECEBIMENTO
    ↓
CUSTOS
    ↓
COMISSÕES
    ↓
IMPOSTOS
    ↓
MARGEM
    ↓
ESFORÇO
    ↓
RISCO
    ↓
RETENÇÃO
    ↓
LTV
    ↓
RESULTADO REAL
```

---

## 62. OBJETIVO GERENCIAL FINAL

O sistema precisa funcionar como uma memória completa da empresa desde 2020.

Para qualquer **cliente, produto, parceiro, venda ou projeto**, deve ser possível entender:

- Quem foi?
- De onde veio?
- Quando entrou?
- O que comprou?
- Quanto comprou?
- Quanto pagou?
- Quando pagou?
- Quanto custou?
- Quanto sobrou?
- Quanto trabalho deu?
- Quanto tempo ficou?
- O que executamos?
- Funcionou?
- Virou case?
- Recomprou?
- Indicou alguém?
- Ficou inadimplente?
- Saiu?
- Quando saiu?
- Por que saiu?
- Valeu a pena?
- Deveríamos fazer novamente?

**Esse é o núcleo funcional e estratégico da Central Empresarial Local.**

---

*Fim da Especificação*
