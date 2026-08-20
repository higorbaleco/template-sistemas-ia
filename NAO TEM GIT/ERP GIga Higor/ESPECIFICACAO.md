# Central Empresarial Local — Especificação Completa

**Versão:** 2.0
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

O objetivo principal não é somente responder: **Quanto a empresa faturou?**

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
1. Velocidade
2. Poucos cliques
3. Formulários objetivos
4. Tabelas
5. Filtros
6. Pesquisa
7. Relatórios
8. Estabilidade

As telas operacionais não precisam parecer uma aplicação futurista.

A modernidade visual deve ficar concentrada principalmente em:
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

```text
Dashboard
Histórico
Clientes
Contatos
Comercial
Prospecção
Pipeline
Vendas
Contratos
Projetos
Financeiro
Impostos
Produtos
Parceiros
Fornecedores
Risco e Retenção
Cases
Relatórios
Inteligência
Importações
Documentos
Configurações
Backup
```

---

## 4. ARQUITETURA DE ARQUIVOS LOCAL

Estrutura sugerida:

```text
CentralEmpresa/
│
├── app/
│
├── dados/
│   └── empresa.db
│
├── configuracoes/
│   ├── sistema.json
│   ├── preferencias.json
│   └── seguranca.dat
│
├── documentos/
│   ├── clientes/
│   ├── fornecedores/
│   ├── parceiros/
│   ├── contratos/
│   ├── projetos/
│   ├── financeiro/
│   ├── impostos/
│   ├── propostas/
│   ├── cases/
│   └── diversos/
│
├── importacoes/
│   ├── entrada/
│   ├── processados/
│   ├── pendentes/
│   └── rejeitados/
│
├── exportacoes/
│   ├── csv/
│   ├── planilhas/
│   ├── pdf/
│   └── relatorios/
│
├── backups/
│   ├── diarios/
│   ├── semanais/
│   ├── mensais/
│   └── manuais/
│
├── logs/
│
└── temporarios/
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
id
created_at
updated_at
created_by
updated_by
archived_at
is_active
notes
```

### Para registros históricos:

```sql
data_quality
data_source
is_estimated
needs_review
```

---

## 7. QUALIDADE DOS DADOS HISTÓRICOS

Como informações anteriores podem estar incompletas, cada registro histórico deve possuir uma classificação.

### Valores:

- **COMPLETO**
- **PARCIAL**
- **ESTIMADO**
- **PENDENTE_REVISAO**

### Exemplo:

```text
Cliente: confirmado
Valor venda: confirmado
Data: aproximada
Custo: estimado
```

Registro:

```text
data_quality = PARCIAL
is_estimated = true
```

---

## 8. AUTENTICAÇÃO LOCAL

### 8.1. Tela inicial

Ao abrir:

```text
CENTRAL EMPRESARIAL

Senha
[________________]

[Entrar]
```

Opcional:

```text
[ ] Manter desbloqueado neste computador
```

---

## 9. SENHA MESTRA

O sistema deve possuir uma senha mestre local.

### Regras mínimas:

- Mínimo de 8 caracteres
- Senha nunca armazenada diretamente
- Armazenar somente representação segura da senha
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

### Nível 1

Senha para abrir o aplicativo.

### Nível 2

Proteção do computador pelo sistema operacional.

### Nível 3

Criptografia do arquivo de dados.

Para informações empresariais sensíveis, o sistema deve ser preparado para trabalhar com proteção do banco em repouso.

A senha nunca deve ficar armazenada em texto simples.

---

## 11. USUÁRIOS LOCAIS

Mesmo que inicialmente exista apenas um usuário, o banco deve suportar usuários locais.

### Tabela: users

```sql
id
name
username
password_hash
role
is_active
last_login_at
failed_attempts
locked_until
created_at
updated_at
```

### Papéis:

- **ADMIN**
- **FINANCEIRO**
- **COMERCIAL**
- **OPERACIONAL**
- **LEITURA**

Inicialmente pode existir apenas **ADMIN**.

---

## 12. DASHBOARD PRINCIPAL

O dashboard é a principal área visual moderna do sistema.

### Filtros globais:

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

### Períodos rápidos:

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

### Cards principais:

- Faturamento
- Receita recebida
- Margem
- Margem %
- Lucro estimado
- A receber
- A pagar
- Vencido
- Inadimplência
- Clientes ativos
- Novos clientes
- Clientes perdidos
- Pipeline
- Ticket médio
- LTV médio
- Receita recorrente

---

## 14. GRÁFICO HISTÓRICO PRINCIPAL

### Gráfico:

- Receita
- Margem
- Resultado

### Eixo temporal:

- 2020
- 2021
- 2022
- 2023
- 2024
- 2025
- 2026

Permitir alternar:

- Mensal
- Trimestral
- Anual

---

## 15. CLIENTE 360º

Cada cliente deve possuir uma ficha completa.

### Cabeçalho

```text
Nome fantasia
Razão social
CPF/CNPJ
Tipo PF/PJ
Segmento
Cidade
Estado
Status
Data de entrada
Data de saída
Tempo de relacionamento
```

---

## 16. MÉTRICAS DO CLIENTE

```text
Faturamento histórico
Recebimento histórico
Margem histórica
Margem %
Quantidade de vendas
Quantidade de projetos
Quantidade de contratos
Produtos comprados
Ticket médio
LTV receita
LTV margem
Inadimplência
Dias médios de pagamento
Esforço total
Margem por hora
Score de risco
Score econômico
```

---

## 17. ABAS DO CLIENTE

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

## 18. TABELA CLIENTS

### Tabela: clients

```sql
id
type
legal_name
trade_name
cpf_cnpj
state_registration
segment_id
subsegment
website
instagram
linkedin
email
phone
whatsapp
city
state
country
postal_code
address
status
acquisition_source_id
partner_id
owner_user_id
first_contact_at
customer_since
ended_at
exit_type
exit_reason_id
exit_notes
risk_score
economic_score
data_quality
data_source
is_estimated
needs_review
created_at
updated_at
archived_at
```

---

## 19. STATUS DO CLIENTE

- **PROSPECT**
- **LEAD**
- **OPORTUNIDADE**
- **CLIENTE_ATIVO**
- **CLIENTE_INATIVO**
- **EX_CLIENTE**
- **BLOQUEADO**

---

## 20. CONTATOS

### Tabela: contacts

```sql
id
client_id
name
job_title
department
email
phone
whatsapp
linkedin
instagram
is_decision_maker
is_primary
birthday
notes
created_at
updated_at
```

---

## 21. TIMELINE DO CLIENTE

### Tabela: timeline_events

```sql
id
client_id
event_type
event_date
title
description
related_entity_type
related_entity_id
user_id
created_at
```

### Tipos:

- **LEAD_CREATED**
- **CONTACT**
- **MEETING**
- **PROPOSAL**
- **SALE**
- **PAYMENT**
- **PROJECT_STARTED**
- **PROJECT_FINISHED**
- **CONTRACT_STARTED**
- **CONTRACT_FINISHED**
- **SUPPORT**
- **INCIDENT**
- **CHURN**
- **REACTIVATION**
- **NOTE**

---

## 22. PROSPECÇÃO

Módulo destinado à geração e acompanhamento de prospects.

### Menu:

- Prospects
- Listas
- Canais
- Tentativas
- Respostas
- Cadências
- Resultados

---

## 23. PROSPECTS

### Tabela: prospects

```sql
id
company_name
contact_name
segment_id
city
state
website
email
phone
whatsapp
linkedin
instagram
source_id
channel_id
list_id
owner_user_id
status
first_attempt_at
last_attempt_at
next_action_at
attempt_count
response_status
converted_to_lead
client_id
notes
created_at
updated_at
```

---

## 24. STATUS DO PROSPECT

- **NOVO**
- **NAO_TRABALHADO**
- **EM_CADENCIA**
- **RESPONDEU**
- **QUALIFICADO**
- **SEM_INTERESSE**
- **SEM_RESPOSTA**
- **CONVERTIDO**
- **DESCARTADO**

---

## 25. TENTATIVAS DE PROSPECÇÃO

### Tabela: prospecting_attempts

```sql
id
prospect_id
channel_id
attempt_at
result
message_summary
next_action_at
user_id
created_at
```

### Resultados:

- **ENVIADO**
- **VISUALIZADO**
- **RESPONDEU**
- **SEM_RESPOSTA**
- **NAO_ATENDEU**
- **NUMERO_INVALIDO**
- **EMAIL_INVALIDO**
- **INTERESSADO**
- **SEM_INTERESSE**
- **REAGENDAR**

---

## 26. CANAIS

### Tabela: channels

### Valores iniciais:

- LinkedIn
- WhatsApp
- Telefone
- E-mail
- Instagram
- Indicação
- Evento
- Inbound
- Site
- Parceiro
- Outro

---

## 27. CRM E PIPELINE

### Entidades principais:

- Lead
- Oportunidade
- Etapa
- Proposta
- Venda

---

## 28. LEADS

### Tabela: leads

```sql
id
client_id
contact_id
source_id
channel_id
owner_user_id
status
temperature
estimated_value
interest_product_id
created_at
qualified_at
lost_at
lost_reason_id
notes
updated_at
```

---

## 29. TEMPERATURA

- **FRIO**
- **MORNO**
- **QUENTE**

---

## 30. OPORTUNIDADES

### Tabela: opportunities

```sql
id
client_id
contact_id
pipeline_id
stage_id
owner_user_id
partner_id
title
description
estimated_value
probability
weighted_value
expected_close_date
created_at
won_at
lost_at
status
lost_reason_id
lost_notes
source_id
channel_id
campaign
notes
updated_at
```

---

## 31. PIPELINE

### Tabela: pipelines

```sql
id
name
description
is_active
```

---

## 32. ETAPAS DO FUNIL

### Tabela: pipeline_stages

```sql
id
pipeline_id
name
position
probability_default
is_won
is_lost
```

### Etapas iniciais:

- Prospecção
- Contato
- Qualificação
- Reunião
- Diagnóstico
- Proposta
- Negociação
- Fechado ganho
- Fechado perdido

---

## 33. PIPELINE PONDERADO

Fórmula:

```text
valor_ponderado =
valor_oportunidade × probabilidade
```

Exemplo:

```text
R$ 20.000 × 50%

Pipeline ponderado:
R$ 10.000
```

---

## 34. MOTIVOS DE PERDA

### Tabela: loss_reasons

### Valores iniciais:

- Preço
- Sem orçamento
- Timing
- Não respondeu
- Concorrente
- Decisor não aprovou
- Projeto pausado
- Sem necessidade
- Sem fit
- Mudança interna
- Internalização
- Não localizado
- Outro

Motivo deve ser obrigatório ao perder oportunidade.

---

## 35. PROPOSTAS

### Tabela: proposals

```sql
id
opportunity_id
client_id
proposal_number
title
created_at
sent_at
valid_until
status
subtotal
discount
total
estimated_cost
estimated_margin
estimated_margin_percentage
document_id
notes
updated_at
```

### Status:

- **RASCUNHO**
- **ENVIADA**
- **VISUALIZADA**
- **NEGOCIACAO**
- **APROVADA**
- **RECUSADA**
- **EXPIRADA**
- **CANCELADA**

---

## 36. ITENS DA PROPOSTA

### Tabela: proposal_items

```sql
id
proposal_id
product_id
description
quantity
unit_price
discount
total
estimated_unit_cost
estimated_total_cost
```

---

## 37. VENDAS

### Tabela: sales

```sql
id
sale_number
client_id
opportunity_id
proposal_id
partner_id
seller_user_id
sale_date
competence_date
status
gross_value
discount_value
net_value
direct_cost
commission_cost
tax_cost
other_variable_cost
contribution_margin
contribution_margin_percentage
effort_hours
margin_per_hour
payment_terms
notes
created_at
updated_at
```

---

## 38. STATUS DA VENDA

- **CONFIRMADA**
- **EM_EXECUCAO**
- **CONCLUIDA**
- **CANCELADA**
- **ESTORNADA**
- **PARCIAL**

---

## 39. ITENS DA VENDA

### Tabela: sale_items

```sql
id
sale_id
product_id
quantity
unit_price
discount
total_value
unit_cost_snapshot
total_cost
margin_value
margin_percentage
```

O custo deve ser congelado no momento da venda.

Alterações futuras no custo do produto não podem alterar o histórico.

---

## 40. CÁLCULO ECONÔMICO DA VENDA

```text
Receita líquida
=
valor bruto
- descontos
```

```text
Margem de contribuição
=
receita líquida
- custos diretos
- comissões
- impostos
- outros custos variáveis
```

```text
Margem %
=
margem de contribuição
÷ receita líquida
× 100
```

---

## 41. ESFORÇO

Cada venda, projeto ou cliente pode registrar esforço.

### Tabela: effort_entries

```sql
id
client_id
sale_id
project_id
category
effort_date
hours
effort_level
description
user_id
created_at
```

### Categorias:

- **COMERCIAL**
- **IMPLANTACAO**
- **OPERACIONAL**
- **SUPORTE**
- **ADMINISTRATIVO**
- **FINANCEIRO**
- **GESTAO**
- **OUTRO**

---

## 42. ESFORÇO HISTÓRICO SEM HORAS

Quando horas exatas não existirem:

1. Muito baixo
2. Baixo
3. Médio
4. Alto
5. Muito alto

Campo: `effort_level`

Não converter automaticamente nível subjetivo em horas.

---

## 43. MARGEM POR HORA

Quando houver horas:

```text
margem_por_hora =
margem_de_contribuicao
÷
horas_totais
```

Exemplo:

```text
Margem:
R$ 12.000

Horas:
10

Margem/hora:
R$ 1.200
```

---

## 44. CONTRATOS

### Tabela: contracts

```sql
id
client_id
sale_id
contract_number
title
start_date
end_date
renewal_date
status
billing_frequency
monthly_value
total_value
auto_renew
notice_days
exit_type
exit_reason_id
exit_notes
document_id
created_at
updated_at
```

---

## 45. STATUS DO CONTRATO

- **RASCUNHO**
- **ATIVO**
- **SUSPENSO**
- **ENCERRADO**
- **CANCELADO**
- **RENOVADO**
- **INADIMPLENTE**

---

## 46. TIPO DE ENCERRAMENTO

- **PROJETO_CONCLUIDO**
- **ENCERRAMENTO_SAUDAVEL**
- **CHURN**
- **CANCELAMENTO**
- **INADIMPLENCIA**
- **ROMPIMENTO_EMPRESA**
- **MIGRACAO**
- **INTERNALIZACAO**
- **OUTRO**

---

## 47. PROJETOS

### Tabela: projects

```sql
id
client_id
sale_id
contract_id
name
description
project_type
status
start_date
expected_end_date
actual_end_date
responsible_user_id
planned_hours
actual_hours
complexity_level
success_level
case_candidate
notes
created_at
updated_at
```

---

## 48. STATUS DO PROJETO

- **PLANEJADO**
- **EM_ANDAMENTO**
- **PAUSADO**
- **AGUARDANDO_CLIENTE**
- **CONCLUIDO**
- **CANCELADO**

---

## 49. COMPLEXIDADE

1. Muito baixa
2. Baixa
3. Média
4. Alta
5. Muito alta

---

## 50. CASES

### Tabela: cases

```sql
id
client_id
project_id
sale_id
title
problem
solution
execution_summary
before_state
after_state
result_summary
metrics
testimonial
can_publish
case_type
status
created_at
updated_at
```

### Tipos:

- **COMERCIAL**
- **TECNICO**
- **FINANCEIRO**
- **ESCALA**
- **AUTOMACAO**
- **PARCERIA**
- **OUTRO**

---

## 51. FINANCEIRO

### Menu:

- Resumo
- Contas a receber
- Contas a pagar
- Movimentações
- Contas
- Categorias
- Parcelamentos
- Recorrências
- Fluxo de caixa
- DRE gerencial
- PF x PJ
- Inadimplência

---

## 52. CONTAS FINANCEIRAS

### Tabela: financial_accounts

```sql
id
name
type
nature
institution
opening_balance
current_balance
is_active
notes
```

### Tipos:

- **CONTA_CORRENTE**
- **POUPANCA**
- **DINHEIRO**
- **CARTEIRA**
- **CARTAO**
- **OUTRO**

### Natureza:

- **PF**
- **PJ**

---

## 53. CONTAS A RECEBER

### Tabela: accounts_receivable

```sql
id
client_id
sale_id
contract_id
description
installment_number
installment_total
competence_date
issue_date
due_date
expected_date
received_date
gross_value
discount
interest
fine
received_value
remaining_value
status
financial_account_id
payment_method
document_id
notes
created_at
updated_at
```

---

## 54. STATUS A RECEBER

- **ABERTO**
- **PARCIAL**
- **PAGO**
- **VENCIDO**
- **RENEGOCIADO**
- **CANCELADO**
- **INADIMPLENTE**

---

## 55. CONTAS A PAGAR

### Tabela: accounts_payable

```sql
id
supplier_id
partner_id
sale_id
product_id
tax_id
description
nature
category_id
cost_center_id
competence_date
issue_date
due_date
paid_date
gross_value
discount
interest
fine
paid_value
remaining_value
status
financial_account_id
payment_method
document_id
notes
created_at
updated_at
```

---

## 56. MOVIMENTAÇÕES

### Tabela: financial_transactions

```sql
id
financial_account_id
transaction_date
type
nature
category_id
cost_center_id
description
amount
receivable_id
payable_id
client_id
supplier_id
partner_id
sale_id
project_id
notes
created_at
```

### Tipos:

- **ENTRADA**
- **SAIDA**
- **TRANSFERENCIA**
- **AJUSTE**

---

## 57. CATEGORIAS FINANCEIRAS

### Tabela: financial_categories

### Exemplos:

```text
Receita de serviços
Receita de produtos
Receita de representação
Receita recorrente

Fornecedor
Comissão
Impostos
Contabilidade
Aluguel
Marketing
Software
Freelancer
Funcionários
Viagens
Combustível
Administrativo
Pró-labore
Outros
```

---

## 58. CENTROS DE CUSTO

### Tabela: cost_centers

### Exemplos:

- Administrativo
- Comercial
- Operacional
- Marketing
- Projetos
- Infraestrutura
- Diretoria

---

## 59. PF E PJ

Todo lançamento financeiro deve possuir:

```text
nature = PF
```

ou:

```text
nature = PJ
```

### Filtro global:

- Tudo
- PF
- PJ

---

## 60. FLUXO DE CAIXA

Apresentar:

```text
Saldo inicial
Entradas realizadas
Saídas realizadas
Saldo realizado

Entradas previstas
Saídas previstas
Saldo projetado
```

Por:

- Dia
- Semana
- Mês
- Ano

---

## 61. DRE GERENCIAL

Estrutura:

```text
Receita bruta
(-) Descontos
= Receita líquida

(-) Custos variáveis
(-) Fornecedores
(-) Comissões
(-) Impostos variáveis

= Margem de contribuição

(-) Despesas operacionais
(-) Despesas administrativas
(-) Marketing
(-) Estrutura
(-) Pró-labore

= Resultado operacional
```

---

## 62. INADIMPLÊNCIA

### Dashboard:

- Total vencido
- Quantidade de clientes inadimplentes
- Valor médio vencido
- Maior inadimplente
- Dias médios de atraso
- Índice de inadimplência

Fórmula:

```text
índice_inadimplencia =
valor_vencido
÷
valor_total_faturado
× 100
```

---

## 63. AGING DE RECEBÍVEIS

### Faixas:

- A vencer
- 1 a 7 dias
- 8 a 15 dias
- 16 a 30 dias
- 31 a 60 dias
- 61 a 90 dias
- Mais de 90 dias

---

## 64. IMPOSTOS

### Tabela: taxes

```sql
id
name
tax_type
competence_date
due_date
paid_date
base_value
rate
amount
status
nature
sale_id
client_id
document_id
notes
created_at
updated_at
```

### Tipos iniciais:

- **DAS**
- **ISS**
- **IR**
- **INSS**
- **PIS**
- **COFINS**
- **ICMS**
- **OUTRO**

---

## 65. PRODUTOS

### Tabela: products

```sql
id
name
description
type
category_id
sku
status
default_sale_price
current_cost
default_tax_rate
default_commission_rate
recurring
billing_frequency
effort_level
notes
created_at
updated_at
```

### Tipos:

- **PRODUTO**
- **SERVICO**
- **PROJETO**
- **RECORRENCIA**
- **INTERMEDIACAO**
- **REPRESENTACAO**
- **OUTRO**

---

## 66. HISTÓRICO DE CUSTO

### Tabela: product_cost_history

```sql
id
product_id
supplier_id
valid_from
valid_until
unit_cost
minimum_quantity
maximum_quantity
notes
created_at
```

Nunca sobrescrever histórico de custo.

---

## 67. HISTÓRICO DE PREÇO

### Tabela: product_price_history

```sql
id
product_id
valid_from
valid_until
sale_price
minimum_quantity
maximum_quantity
notes
created_at
```

---

## 68. RENTABILIDADE DO PRODUTO

### KPIs:

- Quantidade vendida
- Receita total
- Ticket médio
- Custo total
- Margem R$
- Margem %
- Horas consumidas
- Margem por hora
- Clientes
- Recorrência
- Churn
- Inadimplência

---

## 69. FORNECEDORES

### Tabela: suppliers

```sql
id
name
legal_name
cpf_cnpj
contact_name
email
phone
whatsapp
category
payment_terms
risk_level
notes
created_at
updated_at
```

---

## 70. PARCEIROS

### Tabela: partners

```sql
id
name
company_name
cpf_cnpj
type
email
phone
whatsapp
default_commission_type
default_commission_value
status
notes
created_at
updated_at
```

### Tipos:

- **INDICACAO**
- **REPRESENTANTE**
- **REVENDEDOR**
- **AFILIADO**
- **ESTRATEGICO**
- **INTERMEDIADOR**
- **FORNECEDOR**
- **OUTRO**

---

## 71. COMISSÕES

### Tabela: commissions

```sql
id
partner_id
sale_id
client_id
base_value
commission_type
commission_rate
commission_value
due_date
paid_date
status
notes
created_at
```

### Tipos:

- **PERCENTUAL**
- **VALOR_FIXO**
- **POR_UNIDADE**

---

## 72. DASHBOARD DE PARCEIROS

Para cada parceiro:

- Leads gerados
- Clientes gerados
- Vendas
- Conversão
- Faturamento
- Comissões
- Margem
- Margem %
- Horas
- Margem por hora
- Inadimplência
- Ticket médio

---

## 73. REATIVAÇÃO

### Tela: Base de reativação

### Filtros:

- Sem contato há 30 dias
- Sem contato há 60 dias
- Sem contato há 90 dias
- Sem contato há 180 dias
- Motivo de perda
- Produto
- Segmento
- Valor
- Cidade
- Canal
- Origem
- Última venda
- Última atividade

---

## 74. RETENÇÃO

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

## 75. CHURN

Fórmula:

```text
churn =
clientes_perdidos_no_periodo
÷
clientes_ativos_no_inicio
× 100
```

Projetos concluídos naturalmente não contam automaticamente como churn.

---

## 76. LTV DE RECEITA

```text
LTV Receita =
soma de todas as receitas do cliente
```

---

## 77. LTV DE MARGEM

```text
LTV Margem =
soma de todas as margens geradas pelo cliente
```

Essa deve ser uma das principais métricas do sistema.

---

## 78. TEMPO DE RELACIONAMENTO

```text
data_final
-
customer_since
```

Quando ativo:

```text
hoje - customer_since
```

---

## 79. RISCO DO CLIENTE

O sistema deve trabalhar com diferentes componentes.

- Risco financeiro
- Risco comercial
- Risco operacional
- Risco estratégico

---

## 80. RISCO FINANCEIRO

Considerar:

- Atrasos
- Inadimplência
- Quantidade de renegociações
- Prazo médio de pagamento
- Valores vencidos

---

## 81. RISCO COMERCIAL

Considerar:

- Pressão constante por desconto
- Histórico de renegociação
- Baixa previsibilidade
- Dependência de decisor
- Instabilidade comercial

---

## 82. RISCO OPERACIONAL

Considerar:

- Chamados
- Incidentes
- Customizações
- Horas de suporte
- Complexidade
- Retrabalho

---

## 83. RISCO ESTRATÉGICO

Considerar:

- Dependência da receita
- Dependência de fornecedor
- Dependência de uma pessoa
- Concentração
- Risco reputacional

---

## 84. SCORE DE RISCO

### Escala:

```text
0 a 100
```

### Interpretação:

- **0 a 20** — Muito baixo
- **21 a 40** — Baixo
- **41 a 60** — Moderado
- **61 a 80** — Alto
- **81 a 100** — Crítico

O sistema deve mostrar os componentes que geraram a nota.

---

## 85. SCORE ECONÔMICO DO CLIENTE

### Objetivo:

Medir qualidade econômica e operacional do relacionamento.

### Componentes iniciais:

- Margem
- Margem por hora
- Recorrência
- Pontualidade
- Retenção
- Potencial de expansão
- Esforço
- Risco

---

## 86. PESOS INICIAIS DO SCORE ECONÔMICO

Sugestão inicial:

- **Margem** — 20%
- **Margem por hora** — 20%
- **Pontualidade** — 15%
- **Recorrência** — 15%
- **Retenção** — 10%
- **Potencial de expansão** — 10%
- **Esforço** — 5%
- **Risco** — 5%

Todos os pesos devem ser configuráveis.

---

## 87. CLASSIFICAÇÃO ECONÔMICA

- **90 a 100** — Excelente
- **75 a 89** — Muito bom
- **60 a 74** — Bom
- **45 a 59** — Atenção
- **30 a 44** — Ruim
- **0 a 29** — Crítico

---

## 88. CLASSIFICAÇÃO DE NEGÓCIOS

O sistema deve permitir classificar vendas ou projetos como:

- **OURO**
- **ESCALAVEL**
- **ESTRATEGICO**
- **FATURAMENTO_ENGANOSO**
- **RISCO**
- **RENEGOCIAR**
- **DESCONTINUAR**

---

## 89. FATURAMENTO ENGANOSO

### Conceito:

Negócio com:

```text
Receita alta
+
Margem baixa
+
Esforço alto
```

O objetivo é impedir que faturamento bruto seja confundido com qualidade do negócio.

---

## 90. MATRIZ MARGEM X ESFORÇO

### Quadrantes:

```text
Alta margem + baixo esforço
Excelente

Alta margem + alto esforço
Rentável, mas pesado

Baixa margem + baixo esforço
Avaliar escala

Baixa margem + alto esforço
Ruim
```

---

## 91. INTELIGÊNCIA

### Menu:

- Clientes
- Produtos
- Parceiros
- Canais
- Segmentos
- Rentabilidade
- Esforço
- Risco
- Retenção
- Histórico

---

## 92. RANKINGS DE CLIENTES

- Top faturamento
- Top margem
- Top margem %
- Top margem/hora
- Top LTV
- Top recorrência
- Top pontualidade
- Top retenção

Também:

- Piores margens
- Maior esforço
- Maior inadimplência
- Maior risco
- Menor margem/hora

---

## 93. RANKINGS DE PRODUTOS

- Mais vendidos
- Maior faturamento
- Maior margem
- Maior margem %
- Maior margem/hora
- Mais recorrentes
- Maior retenção
- Maior churn
- Maior esforço

---

## 94. RANKINGS DE PARCEIROS

- Mais leads
- Mais clientes
- Mais vendas
- Maior faturamento
- Maior margem
- Maior margem/hora
- Maior conversão
- Menor inadimplência

---

## 95. SEGMENTOS

### Tabela: segments

```sql
id
name
parent_id
description
is_active
```

Permitir descobrir:

- Segmentos com maior faturamento
- Segmentos com maior margem
- Segmentos com maior LTV
- Segmentos com menor churn
- Segmentos com menor inadimplência

---

## 96. ORIGENS DE CLIENTE

### Tabela: lead_sources

### Exemplos:

- Outbound
- Inbound
- Indicação
- Parceiro
- LinkedIn
- Instagram
- WhatsApp
- Cold call
- Cold e-mail
- Evento
- Networking
- Cliente antigo
- Site
- Outro

---

## 97. DASHBOARD DE AQUISIÇÃO

### KPIs:

- Prospects
- Leads
- Reuniões
- Propostas
- Vendas
- Conversão
- Ticket
- Margem
- LTV

Por:

- Canal
- Origem
- Campanha
- Parceiro
- Segmento

---

## 98. CONVERSÃO DO FUNIL

Exemplo:

```text
Prospects         1.000
Respostas           220
Qualificados        110
Reuniões             60
Propostas            31
Vendas               12
```

Mostrar conversão entre cada etapa.

---

## 99. PESQUISA GLOBAL

Campo sempre disponível:

```text
Buscar...
```

Pesquisar:

- Cliente
- Contato
- CNPJ
- Telefone
- E-mail
- Venda
- Contrato
- Projeto
- Produto
- Parceiro
- Fornecedor
- Conta
- Documento
- Proposta

---

## 100. RELATÓRIOS

### Menu:

- Executivo
- Financeiro
- Comercial
- Clientes
- Produtos
- Parceiros
- Prospecção
- Projetos
- Risco
- Retenção
- Histórico

---

## 101. RELATÓRIOS FINANCEIROS

- Fluxo de caixa
- Contas a receber
- Contas a pagar
- Inadimplência
- Receita
- Despesas
- DRE gerencial
- PF x PJ
- Movimentações
- Impostos

---

## 102. RELATÓRIOS COMERCIAIS

- Pipeline
- Conversão
- Vendas
- Ticket médio
- Ciclo comercial
- Motivos de perda
- Origem
- Canal
- Responsável
- Produto
- Segmento

---

## 103. RELATÓRIOS DE CLIENTES

- Clientes ativos
- Clientes inativos
- Clientes históricos
- Novos clientes
- Clientes perdidos
- LTV
- Retenção
- Churn
- Inadimplência
- Risco
- Rentabilidade

---

## 104. DOCUMENTOS

### Tabela: documents

```sql
id
name
document_type
file_path
client_id
supplier_id
partner_id
sale_id
contract_id
project_id
financial_transaction_id
document_date
notes
created_at
```

---

## 105. ORGANIZAÇÃO FÍSICA DE DOCUMENTOS

Exemplo:

```text
documentos/clientes/000123_empresa-abc/
│
├── propostas/
├── contratos/
├── projetos/
├── financeiro/
├── cases/
└── diversos/
```

---

## 106. IMPORTAÇÃO HISTÓRICA

Criar módulo: **Importações**

### Objetivo:

Reconstruir toda a empresa desde 2020.

### Fontes:

- Planilhas
- CSV
- Extratos
- CRMs antigos
- Notas fiscais
- Contratos
- Propostas
- Listas
- Arquivos financeiros

---

## 107. STAGING

Nenhuma importação histórica deve entrar diretamente no banco definitivo.

Primeiro:

```text
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

---

## 108. TABELA DE IMPORTAÇÃO

### Tabela: import_batches

```sql
id
source_name
file_name
import_type
imported_at
status
total_rows
valid_rows
error_rows
notes
```

---

## 109. REGISTROS TEMPORÁRIOS

### Tabela: import_staging

```sql
id
batch_id
row_number
raw_data
suggested_entity
suggested_match_id
confidence
status
review_notes
```

---

## 110. RECONCILIAÇÃO

Exemplo:

```text
Recebimento encontrado

12/05/2022
R$ 15.000

Possível cliente:
Empresa ABC

Confiança:
92%

[Confirmar]
[Alterar]
[Ignorar]
```

---

## 111. DETECÇÃO DE DUPLICIDADE

Antes de criar cliente:

Comparar:

- CPF/CNPJ
- Nome
- Razão social
- E-mail
- Telefone
- WhatsApp

Exibir possível duplicidade.

Nunca mesclar automaticamente sem confirmação.

---

## 112. BASE HISTÓRICA 2020+

### Tela:

- 2020
- 2021
- 2022
- 2023
- 2024
- 2025
- 2026

Para cada ano:

- Clientes
- Novos clientes
- Clientes perdidos
- Vendas
- Faturamento
- Recebido
- Margem
- Inadimplência
- Produtos
- Projetos

---

## 113. BACKUP

Backup é obrigatório.

### Menu:

- Backup agora
- Restaurar
- Histórico de backups
- Configuração

---

## 114. BACKUP AUTOMÁTICO

Executar:

- Ao abrir
- Ao fechar
- 1 vez ao dia

Configuração deve permitir alterar.

---

## 115. RETENÇÃO DE BACKUPS

Sugestão:

- 7 backups diários
- 4 backups semanais
- 12 backups mensais
- Backups manuais ilimitados

---

## 116. ESTRUTURA DO BACKUP

Exemplo:

```text
backups/diarios/
empresa_2026-08-19_0800.db
empresa_2026-08-18_1830.db
```

---

## 117. RESTAURAÇÃO

Antes de restaurar:

```text
Criar backup automático do estado atual.
```

Depois perguntar:

```text
Deseja restaurar o backup selecionado?
```

Exibir:

- Data
- Hora
- Tamanho
- Origem

---

## 118. LOGS

### Tabela: audit_logs

```sql
id
user_id
action
entity_type
entity_id
old_data
new_data
created_at
```

### Ações:

- **CREATE**
- **UPDATE**
- **DELETE**
- **ARCHIVE**
- **RESTORE**
- **LOGIN**
- **IMPORT**
- **EXPORT**

---

## 119. EXCLUSÃO

Evitar exclusão física sempre que possível.

Utilizar: `archived_at`

Botão: **Arquivar**

Em vez de: **Excluir permanentemente**

Exclusão definitiva somente em configurações administrativas.

---

## 120. CONFIGURAÇÕES GERAIS

### Tela:

- Empresa
- Financeiro
- Comercial
- Produtos
- Scores
- Segurança
- Backup
- Interface
- Importações

---

## 121. CONFIGURAÇÕES DA EMPRESA

```text
Nome
Razão social
CPF/CNPJ
Logo
Cidade
Estado
Moeda
Formato de data
Início do histórico
```

Padrão:

```text
Histórico inicial:
01/01/2020
```

---

## 122. PARÂMETROS FINANCEIROS

- Moeda
- Taxa padrão de imposto
- Natureza padrão
- Conta padrão
- Categoria padrão
- Dias de tolerância

---

## 123. PARÂMETROS COMERCIAIS

- Pipeline padrão
- Probabilidade das etapas
- Motivos de perda
- Canais
- Origens
- Temperaturas

---

## 124. PARÂMETROS DE SCORE

Permitir configurar:

- Pesos do score econômico
- Pesos do score de risco
- Faixas
- Classificações

---

## 125. INTERFACE

### Telas operacionais

Priorizar:

- Tabela
- Filtro
- Pesquisa
- Formulário
- Botão
- Atalho

### Dashboards

Priorizar:

- Cards
- Gráficos
- Rankings
- Heatmaps
- Matrizes
- Indicadores
- Tendências
- Comparações

---

## 126. MENU LATERAL

Estrutura:

```text
Dashboard

Comercial
  Prospecção
  Leads
  Pipeline
  Propostas
  Vendas

Relacionamento
  Clientes
  Contatos
  Contratos
  Projetos
  Cases

Financeiro
  Resumo
  Receber
  Pagar
  Movimentações
  Fluxo de caixa
  Impostos

Catálogo
  Produtos
  Custos
  Fornecedores

Rede
  Parceiros

Gestão
  Histórico
  Risco e Retenção
  Inteligência
  Relatórios

Sistema
  Importações
  Documentos
  Backup
  Configurações
```

---

## 127. HEADER

Mostrar:

- Pesquisa global
- Período ativo
- Botão: Novo
- Usuário
- Bloquear

---

## 128. BOTÃO NOVO

### Menu rápido:

- Novo cliente
- Novo contato
- Novo lead
- Nova oportunidade
- Nova proposta
- Nova venda
- Conta a receber
- Conta a pagar
- Novo projeto
- Novo contrato
- Novo parceiro
- Novo produto

---

## 129. FILTROS PADRÃO

Toda tela de listagem deve permitir:

- Pesquisa
- Status
- Data
- Período
- Cliente
- Responsável
- Produto
- Segmento
- Parceiro
- Origem

Quando aplicável.

---

## 130. COLUNAS CONFIGURÁVEIS

Nas tabelas:

- Mostrar/ocultar coluna
- Reordenar
- Ordenar
- Filtrar

Salvar preferência local.

---

## 131. EXPORTAÇÃO

Toda listagem e relatório relevante deve permitir:

- CSV
- Planilha
- PDF
- Imprimir

---

## 132. KPI: TICKET MÉDIO

```text
ticket_medio =
receita
÷
quantidade_de_vendas
```

---

## 133. KPI: MARGEM MÉDIA

Preferencialmente:

```text
margem_media =
margem_total
÷
receita_total
× 100
```

---

## 134. KPI: DIAS MÉDIOS PARA RECEBER

```text
dias_recebimento =
data_recebimento
-
data_vencimento
```

Calcular média por:

- Cliente
- Produto
- Segmento
- Ano

---

## 135. KPI: TAXA DE RECOMPRA

```text
clientes_com_mais_de_uma_venda
÷
clientes_com_compra
× 100
```

---

## 136. KPI: TAXA DE RENOVAÇÃO

```text
contratos_renovados
÷
contratos_elegiveis_para_renovacao
× 100
```

---

## 137. KPI: EFICIÊNCIA OPERACIONAL

```text
margem_total
÷
horas_totais
```

---

## 138. KPI: CONCENTRAÇÃO DE RECEITA

Mostrar percentual de receita:

- Top 1 cliente
- Top 3 clientes
- Top 5 clientes
- Top 10 clientes

---

## 139. KPI: CONCENTRAÇÃO DE MARGEM

Mesma análise utilizando margem.

---

## 140. DASHBOARD DE RENTABILIDADE

Mostrar:

- Receita
- Margem
- Margem %
- Margem/hora
- Esforço

### Rankings:

- Clientes
- Produtos
- Parceiros
- Projetos
- Segmentos

---

## 141. DASHBOARD DE ESFORÇO X RESULTADO

Gráfico de dispersão.

Eixo X: **Esforço**

Eixo Y: **Margem**

Cada ponto pode representar:

- Cliente
- Venda
- Projeto
- Produto

---

## 142. DASHBOARD DE RECEITA X MARGEM

### Objetivo:

Identificar faturamento alto com baixa rentabilidade.

---

## 143. DASHBOARD DE RISCO

### Cards:

- Clientes críticos
- Clientes alto risco
- Valor exposto
- Inadimplência
- Concentração
- Contratos próximos do fim

---

## 144. DASHBOARD DE RETENÇÃO

- Clientes ativos
- Churn
- Renovações
- Recompras
- Reativados
- Tempo médio
- LTV

---

## 145. COHORTS

Agrupar clientes por período de entrada.

Exemplo:

- Clientes adquiridos em 2023
- Clientes adquiridos em 2024
- Clientes adquiridos em 2025

Mostrar permanência após:

- 3 meses
- 6 meses
- 12 meses
- 24 meses
- 36 meses

---

## 146. ANÁLISE DE MOTIVOS DE PERDA

Mostrar:

- Preço
- Timing
- Sem orçamento
- Concorrente
- Sem resposta
- Sem fit
- Outros

Por:

- Quantidade
- Valor perdido
- Produto
- Segmento
- Ano
- Responsável

---

## 147. ANÁLISE DE MOTIVOS DE SAÍDA

Separar:

- Churn
- Projeto concluído
- Internalização
- Concorrente
- Preço
- Resultado
- Inadimplência
- Encerramento da empresa
- Outro

---

## 148. PAINEL "O QUE FUNCIONOU"

Mostrar:

- Melhores clientes
- Melhores produtos
- Melhores segmentos
- Melhores parceiros
- Melhores canais
- Melhores anos

### Critérios:

- Margem
- Margem/hora
- Recorrência
- Retenção
- Pontualidade
- Risco

---

## 149. PAINEL "O QUE NÃO FUNCIONOU"

Mostrar:

- Clientes pouco rentáveis
- Produtos pouco rentáveis
- Negócios muito trabalhosos
- Clientes inadimplentes
- Operações de alto risco
- Projetos com retrabalho
- Parceiros pouco eficientes

---

## 150. PAINEL "OPORTUNIDADES ESCONDIDAS"

Mostrar:

- Ex-clientes saudáveis
- Clientes sem contato há muito tempo
- Clientes que compraram somente um produto
- Clientes com potencial de cross-sell
- Leads perdidos por timing
- Propostas antigas
- Clientes com alta margem e baixo esforço

---

## 151. ALERTAS INTERNOS

O sistema pode possuir alertas locais.

### Exemplos:

- Conta vence hoje
- Conta vencida
- Recebimento atrasado
- Contrato próximo do fim
- Lead sem atividade
- Oportunidade parada
- Cliente sem contato
- Custo de produto alterado
- Margem abaixo do mínimo
- Risco elevado

---

## 152. PARÂMETROS DE ALERTA

Configuráveis:

```text
Oportunidade parada:
7 dias

Cliente sem contato:
60 dias

Contrato próximo do fim:
30 dias

Conta próxima do vencimento:
3 dias

Margem mínima:
20%
```

---

## 153. REGRAS DE INTEGRIDADE

O sistema não deve permitir:

- Venda sem cliente
- Recebimento maior que saldo sem confirmação
- Comissão sem parceiro
- Custo negativo
- Quantidade negativa
- Margem calculada manualmente sem justificativa
- Oportunidade perdida sem motivo
- Contrato encerrado sem tipo de encerramento

---

## 154. CAMPOS CALCULADOS

Sempre que possível, valores derivados não devem depender de digitação manual.

### Exemplos:

- Saldo
- Margem
- Margem %
- Margem/hora
- Ticket médio
- Tempo de contrato
- LTV
- Dias de atraso
- Pipeline ponderado

---

## 155. ARQUIVAMENTO

Entidades inativas devem poder ser arquivadas.

### Filtros:

- Ativos
- Arquivados
- Todos

---

## 156. PERFORMANCE

O sistema deve ser preparado para trabalhar confortavelmente com:

- Dezenas de milhares de contatos
- Milhares de clientes
- Milhares de vendas
- Milhares de movimentações
- Histórico desde 2020

Sem necessidade de infraestrutura externa.

---

## 157. EXPERIÊNCIA DE CADASTRO

O cadastro deve funcionar progressivamente.

Exemplo:

Para criar cliente inicialmente basta:

- Nome
- Tipo

Depois os demais dados podem ser complementados.

Não exigir dezenas de campos para criar registro.

---

## 158. CAMPOS OBRIGATÓRIOS

Manter somente os realmente necessários.

**Cliente:**
- Nome
- Tipo

**Venda:**
- Cliente
- Data
- Valor
- Produto ou descrição

**Conta:**
- Descrição
- Valor
- Vencimento
- Tipo

**Oportunidade:**
- Cliente
- Título
- Etapa
- Valor estimado

---

## 159. ATALHOS

Sugestão:

- **CMD + K** — Pesquisa global
- **CMD + N** — Novo registro
- **CMD + S** — Salvar
- **ESC** — Fechar modal

---

## 160. VISÃO DE IMPLEMENTAÇÃO POR FASE

### FASE 1

Fundação:

- Login
- Banco
- Configurações
- Clientes
- Contatos
- Pesquisa
- Backup

---

## 161. FASE 2

Comercial:

- Leads
- Prospecção
- Pipeline
- Oportunidades
- Propostas
- Vendas

---

## 162. FASE 3

Financeiro:

- Contas
- Receber
- Pagar
- Movimentações
- PF/PJ
- Fluxo de caixa
- Impostos

---

## 163. FASE 4

Operação:

- Produtos
- Custos
- Parceiros
- Fornecedores
- Contratos
- Projetos
- Cases

---

## 164. FASE 5

Histórico:

- Importações
- Reconciliação
- Dados 2020+
- Qualidade de dados

---

## 165. FASE 6

Inteligência:

- Dashboards
- KPIs
- Rentabilidade
- Margem
- Esforço
- Risco
- Retenção
- Cohorts
- Rankings

---

## 166. FASE 7

Refinamento:

- Relatórios
- Exportações
- Alertas
- Atalhos
- Filtros avançados
- Customização

---

## 167. CRITÉRIO DE SUCESSO DO SISTEMA

O projeto estará cumprindo sua função quando for possível responder rapidamente perguntas como:

```text
Quanto faturamos desde 2020?

Quanto realmente recebemos?

Qual foi nossa margem histórica?

Qual ano foi mais rentável?

Qual produto mais faturou?

Qual produto mais deu lucro?

Qual produto tem maior margem/hora?

Qual cliente mais faturou?

Qual cliente mais gerou margem?

Qual cliente mais consumiu tempo?

Quais clientes são inadimplentes?

Quais clientes deram prejuízo?

Quais clientes deveríamos recuperar?

Quais clientes não deveríamos atender novamente?

Qual segmento é mais rentável?

Qual canal gera melhores clientes?

Qual parceiro gera melhores negócios?

Qual parceiro gera muito faturamento mas pouca margem?

Por que perdemos vendas?

Por que perdemos clientes?

Quanto temos para receber?

Quanto temos para pagar?

Qual é nosso fluxo de caixa projetado?

Quanto pagamos em impostos?

Qual é nossa receita recorrente?

Qual é nosso churn?

Qual é nosso LTV?

Quanto esforço é necessário para cada produto?

Quais negócios parecem bons pelo faturamento, mas são ruins economicamente?
```

---

## 168. PRINCÍPIO FINAL DA CENTRAL

A Central Empresarial não deve ser apenas um lugar para registrar informações.

Ela deve criar uma linha lógica completa:

```text
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

## 169. OBJETIVO GERENCIAL FINAL

O sistema precisa funcionar como uma memória completa da empresa desde 2020.

Para qualquer cliente, produto, parceiro, venda ou projeto, deve ser possível entender:

```text
Quem foi?
De onde veio?
Quando entrou?
O que comprou?
Quanto comprou?
Quanto pagou?
Quando pagou?
Quanto custou?
Quanto sobrou?
Quanto trabalho deu?
Quanto tempo ficou?
O que executamos?
Funcionou?
Virou case?
Recomprou?
Indicou alguém?
Ficou inadimplente?
Saiu?
Quando saiu?
Por que saiu?
Valeu a pena?
Deveríamos fazer novamente?
```

Esse é o núcleo funcional e estratégico da Central Empresarial Local.

---

*Fim da Especificação*
