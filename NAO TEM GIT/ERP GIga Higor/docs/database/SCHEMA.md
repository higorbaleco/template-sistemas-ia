# Database Schema - Central Empresarial Local

**Versão:** 1.0  
**Database:** SQLite  
**Arquivo:** `dados/empresa.db`

---

## 1. TABELAS DE AUTENTICAÇÃO

### users

Usuários do sistema com controle de acesso.

```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'ADMIN',  -- ADMIN|FINANCEIRO|COMERCIAL|OPERACIONAL|LEITURA
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at DATETIME,
    failed_attempts INTEGER DEFAULT 0,
    locked_until DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);
```

---

## 2. TABELAS DE CLIENTES

### clients

Registro mestre de clientes (PF e PJ).

```sql
CREATE TABLE clients (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,  -- PF|PJ
    legal_name TEXT NOT NULL,
    trade_name TEXT,
    cpf_cnpj TEXT UNIQUE NOT NULL,
    state_registration TEXT,
    segment_id TEXT,
    subsegment TEXT,
    website TEXT,
    instagram TEXT,
    linkedin TEXT,
    email TEXT,
    phone TEXT,
    whatsapp TEXT,
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'Brasil',
    postal_code TEXT,
    address TEXT,
    status TEXT DEFAULT 'PROSPECT',
    acquisition_source_id TEXT,
    partner_id TEXT,
    owner_user_id TEXT,
    first_contact_at DATETIME,
    customer_since DATETIME,
    ended_at DATETIME,
    exit_type TEXT,
    exit_reason_id TEXT,
    exit_notes TEXT,
    risk_score INTEGER DEFAULT 50,
    economic_score INTEGER DEFAULT 50,
    data_quality TEXT DEFAULT 'COMPLETO',
    data_source TEXT,
    is_estimated BOOLEAN DEFAULT FALSE,
    needs_review BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT,
    updated_by TEXT,
    archived_at DATETIME
);

CREATE INDEX idx_clients_cpf_cnpj ON clients(cpf_cnpj);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_city ON clients(city);
CREATE INDEX idx_clients_is_active ON clients(is_active);
```

### contacts

Pessoas de contato dentro de clientes.

```sql
CREATE TABLE contacts (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    name TEXT NOT NULL,
    job_title TEXT,
    department TEXT,
    email TEXT,
    phone TEXT,
    whatsapp TEXT,
    linkedin TEXT,
    instagram TEXT,
    is_decision_maker BOOLEAN DEFAULT FALSE,
    is_primary BOOLEAN DEFAULT FALSE,
    birthday DATE,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    archived_at DATETIME,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE INDEX idx_contacts_client_id ON contacts(client_id);
CREATE INDEX idx_contacts_email ON contacts(email);
```

### timeline_events

Histórico de eventos por cliente.

```sql
CREATE TABLE timeline_events (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    title TEXT NOT NULL,
    description TEXT,
    related_entity_type TEXT,
    related_entity_id TEXT,
    user_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE INDEX idx_timeline_client_id ON timeline_events(client_id);
CREATE INDEX idx_timeline_event_type ON timeline_events(event_type);
CREATE INDEX idx_timeline_date ON timeline_events(event_date);
```

---

## 3. TABELAS DE PROSPECÇÃO

### prospects

Leads e prospects em prospecção.

```sql
CREATE TABLE prospects (
    id TEXT PRIMARY KEY,
    company_name TEXT NOT NULL,
    contact_name TEXT,
    segment_id TEXT,
    city TEXT,
    state TEXT,
    website TEXT,
    email TEXT,
    phone TEXT,
    whatsapp TEXT,
    linkedin TEXT,
    instagram TEXT,
    source_id TEXT,
    channel_id TEXT,
    list_id TEXT,
    owner_user_id TEXT,
    status TEXT DEFAULT 'NOVO',
    first_attempt_at DATETIME,
    last_attempt_at DATETIME,
    next_action_at DATETIME,
    attempt_count INTEGER DEFAULT 0,
    response_status TEXT,
    converted_to_lead BOOLEAN DEFAULT FALSE,
    client_id TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE INDEX idx_prospects_status ON prospects(status);
CREATE INDEX idx_prospects_email ON prospects(email);
```

### prospecting_attempts

Tentativas de prospecção em um prospect.

```sql
CREATE TABLE prospecting_attempts (
    id TEXT PRIMARY KEY,
    prospect_id TEXT NOT NULL,
    channel_id TEXT NOT NULL,
    attempt_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    result TEXT,  -- ENVIADO|VISUALIZADO|RESPONDEU|SEM_RESPOSTA|...
    message_summary TEXT,
    next_action_at DATETIME,
    user_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prospect_id) REFERENCES prospects(id)
);

CREATE INDEX idx_attempts_prospect_id ON prospecting_attempts(prospect_id);
```

### channels

Canais de prospectação.

```sql
CREATE TABLE channels (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,  -- LinkedIn|WhatsApp|Telefone|Email|...
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. TABELAS DE VENDAS

### pipelines

Pipelines de vendas.

```sql
CREATE TABLE pipelines (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### pipeline_stages

Etapas dentro de um pipeline.

```sql
CREATE TABLE pipeline_stages (
    id TEXT PRIMARY KEY,
    pipeline_id TEXT NOT NULL,
    name TEXT NOT NULL,
    position INTEGER,
    probability_default INTEGER,  -- 0-100
    is_won BOOLEAN DEFAULT FALSE,
    is_lost BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pipeline_id) REFERENCES pipelines(id)
);

CREATE INDEX idx_stages_pipeline_id ON pipeline_stages(pipeline_id);
```

### opportunities

Oportunidades de venda.

```sql
CREATE TABLE opportunities (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    contact_id TEXT,
    pipeline_id TEXT,
    stage_id TEXT,
    owner_user_id TEXT,
    partner_id TEXT,
    title TEXT NOT NULL,
    description TEXT,
    estimated_value DECIMAL(15,2),
    probability INTEGER,  -- 0-100
    weighted_value DECIMAL(15,2),
    expected_close_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    won_at DATETIME,
    lost_at DATETIME,
    status TEXT DEFAULT 'OPEN',  -- OPEN|WON|LOST
    lost_reason_id TEXT,
    lost_notes TEXT,
    source_id TEXT,
    channel_id TEXT,
    campaign TEXT,
    notes TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (contact_id) REFERENCES contacts(id),
    FOREIGN KEY (pipeline_id) REFERENCES pipelines(id),
    FOREIGN KEY (stage_id) REFERENCES pipeline_stages(id)
);

CREATE INDEX idx_opportunities_client_id ON opportunities(client_id);
CREATE INDEX idx_opportunities_status ON opportunities(status);
```

### proposals

Propostas comerciais.

```sql
CREATE TABLE proposals (
    id TEXT PRIMARY KEY,
    opportunity_id TEXT,
    client_id TEXT NOT NULL,
    proposal_number TEXT UNIQUE,
    title TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    sent_at DATETIME,
    valid_until DATE,
    status TEXT DEFAULT 'RASCUNHO',
    subtotal DECIMAL(15,2),
    discount DECIMAL(15,2),
    total DECIMAL(15,2),
    estimated_cost DECIMAL(15,2),
    estimated_margin DECIMAL(15,2),
    estimated_margin_percentage DECIMAL(5,2),
    document_id TEXT,
    notes TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id),
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE INDEX idx_proposals_client_id ON proposals(client_id);
CREATE INDEX idx_proposals_status ON proposals(status);
```

### proposal_items

Itens dentro de uma proposta.

```sql
CREATE TABLE proposal_items (
    id TEXT PRIMARY KEY,
    proposal_id TEXT NOT NULL,
    product_id TEXT,
    description TEXT NOT NULL,
    quantity DECIMAL(15,4),
    unit_price DECIMAL(15,2),
    discount DECIMAL(15,2),
    total DECIMAL(15,2),
    estimated_unit_cost DECIMAL(15,2),
    estimated_total_cost DECIMAL(15,2),
    FOREIGN KEY (proposal_id) REFERENCES proposals(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### sales

Vendas realizadas.

```sql
CREATE TABLE sales (
    id TEXT PRIMARY KEY,
    sale_number TEXT UNIQUE,
    client_id TEXT NOT NULL,
    opportunity_id TEXT,
    proposal_id TEXT,
    partner_id TEXT,
    seller_user_id TEXT,
    sale_date DATE NOT NULL,
    competence_date DATE,
    status TEXT DEFAULT 'CONFIRMADA',
    gross_value DECIMAL(15,2) NOT NULL,
    discount_value DECIMAL(15,2),
    net_value DECIMAL(15,2),
    direct_cost DECIMAL(15,2),
    commission_cost DECIMAL(15,2),
    tax_cost DECIMAL(15,2),
    other_variable_cost DECIMAL(15,2),
    contribution_margin DECIMAL(15,2),
    contribution_margin_percentage DECIMAL(5,2),
    effort_hours DECIMAL(10,2),
    margin_per_hour DECIMAL(15,2),
    payment_terms TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id),
    FOREIGN KEY (proposal_id) REFERENCES proposals(id)
);

CREATE INDEX idx_sales_client_id ON sales(client_id);
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_sales_status ON sales(status);
```

### sale_items

Itens de uma venda.

```sql
CREATE TABLE sale_items (
    id TEXT PRIMARY KEY,
    sale_id TEXT NOT NULL,
    product_id TEXT,
    quantity DECIMAL(15,4) NOT NULL,
    unit_price DECIMAL(15,2),
    discount DECIMAL(15,2),
    total_value DECIMAL(15,2),
    unit_cost_snapshot DECIMAL(15,2),
    total_cost DECIMAL(15,2),
    margin_value DECIMAL(15,2),
    margin_percentage DECIMAL(5,2),
    FOREIGN KEY (sale_id) REFERENCES sales(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE INDEX idx_sale_items_sale_id ON sale_items(sale_id);
```

### effort_entries

Registro de esforço (horas ou nível subjetivo).

```sql
CREATE TABLE effort_entries (
    id TEXT PRIMARY KEY,
    client_id TEXT,
    sale_id TEXT,
    project_id TEXT,
    category TEXT NOT NULL,
    effort_date DATE DEFAULT CURRENT_DATE,
    hours DECIMAL(10,2),
    effort_level INTEGER,  -- 1-5 se sem horas
    description TEXT,
    user_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (sale_id) REFERENCES sales(id),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE INDEX idx_effort_client_id ON effort_entries(client_id);
CREATE INDEX idx_effort_sale_id ON effort_entries(sale_id);
```

---

## 5. TABELAS DE CONTRATOS E PROJETOS

### contracts

Contratos com clientes.

```sql
CREATE TABLE contracts (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    sale_id TEXT,
    contract_number TEXT UNIQUE,
    title TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    renewal_date DATE,
    status TEXT DEFAULT 'RASCUNHO',
    billing_frequency TEXT,
    monthly_value DECIMAL(15,2),
    total_value DECIMAL(15,2),
    auto_renew BOOLEAN DEFAULT FALSE,
    notice_days INTEGER,
    exit_type TEXT,
    exit_reason_id TEXT,
    exit_notes TEXT,
    document_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (sale_id) REFERENCES sales(id)
);

CREATE INDEX idx_contracts_client_id ON contracts(client_id);
CREATE INDEX idx_contracts_status ON contracts(status);
```

### projects

Projetos executados.

```sql
CREATE TABLE projects (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    sale_id TEXT,
    contract_id TEXT,
    name TEXT NOT NULL,
    description TEXT,
    project_type TEXT,
    status TEXT DEFAULT 'PLANEJADO',
    start_date DATE,
    expected_end_date DATE,
    actual_end_date DATE,
    responsible_user_id TEXT,
    planned_hours DECIMAL(10,2),
    actual_hours DECIMAL(10,2),
    complexity_level INTEGER,  -- 1-5
    success_level INTEGER,  -- 1-5
    case_candidate BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (sale_id) REFERENCES sales(id),
    FOREIGN KEY (contract_id) REFERENCES contracts(id)
);

CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
```

### cases

Cases de sucesso para marketing.

```sql
CREATE TABLE cases (
    id TEXT PRIMARY KEY,
    client_id TEXT,
    project_id TEXT,
    sale_id TEXT,
    title TEXT NOT NULL,
    problem TEXT,
    solution TEXT,
    execution_summary TEXT,
    before_state TEXT,
    after_state TEXT,
    result_summary TEXT,
    metrics TEXT,  -- JSON
    testimonial TEXT,
    can_publish BOOLEAN DEFAULT FALSE,
    case_type TEXT,
    status TEXT DEFAULT 'DRAFT',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (sale_id) REFERENCES sales(id)
);

CREATE INDEX idx_cases_status ON cases(status);
```

---

## 6. TABELAS FINANCEIRAS

### financial_accounts

Contas bancárias/financeiras.

```sql
CREATE TABLE financial_accounts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,  -- CONTA_CORRENTE|POUPANCA|DINHEIRO|...
    nature TEXT,  -- PF|PJ
    institution TEXT,
    opening_balance DECIMAL(15,2),
    current_balance DECIMAL(15,2),
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### accounts_receivable

Contas a receber (faturamento).

```sql
CREATE TABLE accounts_receivable (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    sale_id TEXT,
    contract_id TEXT,
    description TEXT,
    installment_number INTEGER,
    installment_total INTEGER,
    competence_date DATE,
    issue_date DATE,
    due_date DATE NOT NULL,
    expected_date DATE,
    received_date DATE,
    gross_value DECIMAL(15,2) NOT NULL,
    discount DECIMAL(15,2),
    interest DECIMAL(15,2),
    fine DECIMAL(15,2),
    received_value DECIMAL(15,2),
    remaining_value DECIMAL(15,2),
    status TEXT DEFAULT 'ABERTO',
    financial_account_id TEXT,
    payment_method TEXT,
    document_id TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (sale_id) REFERENCES sales(id),
    FOREIGN KEY (financial_account_id) REFERENCES financial_accounts(id)
);

CREATE INDEX idx_ar_client_id ON accounts_receivable(client_id);
CREATE INDEX idx_ar_due_date ON accounts_receivable(due_date);
CREATE INDEX idx_ar_status ON accounts_receivable(status);
```

### accounts_payable

Contas a pagar (obrigações).

```sql
CREATE TABLE accounts_payable (
    id TEXT PRIMARY KEY,
    supplier_id TEXT,
    partner_id TEXT,
    sale_id TEXT,
    product_id TEXT,
    description TEXT,
    nature TEXT,
    category_id TEXT,
    cost_center_id TEXT,
    competence_date DATE,
    issue_date DATE,
    due_date DATE NOT NULL,
    paid_date DATE,
    gross_value DECIMAL(15,2) NOT NULL,
    discount DECIMAL(15,2),
    interest DECIMAL(15,2),
    fine DECIMAL(15,2),
    paid_value DECIMAL(15,2),
    remaining_value DECIMAL(15,2),
    status TEXT DEFAULT 'ABERTO',
    financial_account_id TEXT,
    payment_method TEXT,
    document_id TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    FOREIGN KEY (financial_account_id) REFERENCES financial_accounts(id)
);

CREATE INDEX idx_ap_due_date ON accounts_payable(due_date);
CREATE INDEX idx_ap_status ON accounts_payable(status);
```

### financial_transactions

Movimentações financeiras.

```sql
CREATE TABLE financial_transactions (
    id TEXT PRIMARY KEY,
    financial_account_id TEXT NOT NULL,
    transaction_date DATE NOT NULL,
    type TEXT NOT NULL,  -- ENTRADA|SAIDA|TRANSFERENCIA|AJUSTE
    nature TEXT,  -- PF|PJ
    category_id TEXT,
    cost_center_id TEXT,
    description TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    receivable_id TEXT,
    payable_id TEXT,
    client_id TEXT,
    supplier_id TEXT,
    partner_id TEXT,
    sale_id TEXT,
    project_id TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (financial_account_id) REFERENCES financial_accounts(id)
);

CREATE INDEX idx_fin_trans_account_id ON financial_transactions(financial_account_id);
CREATE INDEX idx_fin_trans_date ON financial_transactions(transaction_date);
```

### financial_categories

Categorias de receita/despesa.

```sql
CREATE TABLE financial_categories (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    type TEXT,  -- RECEITA|DESPESA
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### cost_centers

Centros de custo.

```sql
CREATE TABLE cost_centers (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### taxes

Impostos e contribuições.

```sql
CREATE TABLE taxes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tax_type TEXT,  -- DAS|ISS|IR|INSS|PIS|COFINS|ICMS|OUTRO
    competence_date DATE,
    due_date DATE,
    paid_date DATE,
    base_value DECIMAL(15,2),
    rate DECIMAL(5,2),
    amount DECIMAL(15,2),
    status TEXT,  -- ABERTO|PAGO|VENCIDO
    nature TEXT,  -- PF|PJ
    sale_id TEXT,
    client_id TEXT,
    document_id TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_taxes_due_date ON taxes(due_date);
CREATE INDEX idx_taxes_status ON taxes(status);
```

### commissions

Comissões para parceiros.

```sql
CREATE TABLE commissions (
    id TEXT PRIMARY KEY,
    partner_id TEXT NOT NULL,
    sale_id TEXT,
    client_id TEXT,
    base_value DECIMAL(15,2),
    commission_type TEXT,  -- PERCENTUAL|VALOR_FIXO|POR_UNIDADE
    commission_rate DECIMAL(5,2),
    commission_value DECIMAL(15,2),
    due_date DATE,
    paid_date DATE,
    status TEXT DEFAULT 'ABERTO',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (partner_id) REFERENCES partners(id),
    FOREIGN KEY (sale_id) REFERENCES sales(id)
);

CREATE INDEX idx_commissions_partner_id ON commissions(partner_id);
```

---

## 7. TABELAS DE CATÁLOGO

### products

Produtos e serviços.

```sql
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,  -- PRODUTO|SERVICO|PROJETO|RECORRENCIA|...
    category_id TEXT,
    sku TEXT UNIQUE,
    status TEXT DEFAULT 'ATIVO',
    default_sale_price DECIMAL(15,2),
    current_cost DECIMAL(15,2),
    default_tax_rate DECIMAL(5,2),
    default_commission_rate DECIMAL(5,2),
    recurring BOOLEAN DEFAULT FALSE,
    billing_frequency TEXT,
    effort_level INTEGER,  -- 1-5
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_sku ON products(sku);
```

### product_cost_history

Histórico de custos do produto.

```sql
CREATE TABLE product_cost_history (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    supplier_id TEXT,
    valid_from DATE,
    valid_until DATE,
    unit_cost DECIMAL(15,2),
    minimum_quantity DECIMAL(15,4),
    maximum_quantity DECIMAL(15,4),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE INDEX idx_cost_hist_product_id ON product_cost_history(product_id);
```

### product_price_history

Histórico de preços do produto.

```sql
CREATE TABLE product_price_history (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    valid_from DATE,
    valid_until DATE,
    sale_price DECIMAL(15,2),
    minimum_quantity DECIMAL(15,4),
    maximum_quantity DECIMAL(15,4),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### suppliers

Fornecedores.

```sql
CREATE TABLE suppliers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    legal_name TEXT,
    cpf_cnpj TEXT UNIQUE,
    contact_name TEXT,
    email TEXT,
    phone TEXT,
    whatsapp TEXT,
    category TEXT,
    payment_terms TEXT,
    risk_level TEXT,  -- Baixo|Médio|Alto
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_suppliers_cpf_cnpj ON suppliers(cpf_cnpj);
```

### partners

Parceiros (representantes, afiliados, etc).

```sql
CREATE TABLE partners (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    company_name TEXT,
    cpf_cnpj TEXT UNIQUE,
    type TEXT,  -- INDICACAO|REPRESENTANTE|REVENDEDOR|...
    email TEXT,
    phone TEXT,
    whatsapp TEXT,
    default_commission_type TEXT,
    default_commission_value DECIMAL(15,2),
    status TEXT DEFAULT 'ATIVO',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_partners_status ON partners(status);
```

---

## 8. TABELAS DE IMPORTAÇÃO

### import_batches

Lotes de importação de dados históricos.

```sql
CREATE TABLE import_batches (
    id TEXT PRIMARY KEY,
    source_name TEXT,
    file_name TEXT,
    import_type TEXT,
    imported_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'STAGING',
    total_rows INTEGER,
    valid_rows INTEGER,
    error_rows INTEGER,
    notes TEXT
);
```

### import_staging

Registros em staging para revisão.

```sql
CREATE TABLE import_staging (
    id TEXT PRIMARY KEY,
    batch_id TEXT NOT NULL,
    row_number INTEGER,
    raw_data TEXT,  -- JSON
    suggested_entity TEXT,
    suggested_match_id TEXT,
    confidence INTEGER,
    status TEXT DEFAULT 'PENDING',
    review_notes TEXT,
    FOREIGN KEY (batch_id) REFERENCES import_batches(id)
);

CREATE INDEX idx_staging_batch_id ON import_staging(batch_id);
```

---

## 9. TABELAS DE DOCUMENTOS

### documents

Registro de documentos.

```sql
CREATE TABLE documents (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    document_type TEXT,
    file_path TEXT,
    client_id TEXT,
    supplier_id TEXT,
    partner_id TEXT,
    sale_id TEXT,
    contract_id TEXT,
    project_id TEXT,
    financial_transaction_id TEXT,
    document_date DATE,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (sale_id) REFERENCES sales(id)
);

CREATE INDEX idx_documents_client_id ON documents(client_id);
```

---

## 10. TABELAS DE AUDITORIA

### audit_logs

Log de auditoria de todas as ações.

```sql
CREATE TABLE audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    action TEXT,  -- CREATE|UPDATE|DELETE|ARCHIVE|...
    entity_type TEXT,
    entity_id TEXT,
    old_data TEXT,  -- JSON
    new_data TEXT,  -- JSON
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_date ON audit_logs(created_at);
```

---

## 11. ÍNDICES CRÍTICOS

**Resumo de todos os índices por desempenho:**

```sql
-- Autenticação
CREATE INDEX idx_users_username ON users(username);

-- Clientes (mais consultados)
CREATE INDEX idx_clients_cpf_cnpj ON clients(cpf_cnpj);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_city ON clients(city);
CREATE INDEX idx_clients_is_active ON clients(is_active);

-- Contatos
CREATE INDEX idx_contacts_client_id ON contacts(client_id);

-- Vendas
CREATE INDEX idx_sales_client_id ON sales(client_id);
CREATE INDEX idx_sales_date ON sales(sale_date);

-- Financeiro
CREATE INDEX idx_ar_due_date ON accounts_receivable(due_date);
CREATE INDEX idx_ar_status ON accounts_receivable(status);
CREATE INDEX idx_ap_due_date ON accounts_payable(due_date);
CREATE INDEX idx_fin_trans_date ON financial_transactions(transaction_date);
```

---

## 12. MIGRATIONS

Usar Alembic para versionamento de schema:

```bash
# Criar migration
alembic revision --autogenerate -m "add new table"

# Aplicar
alembic upgrade head

# Rollback
alembic downgrade -1
```

---

## 13. DATA TYPES

### Números Financeiros
```
DECIMAL(15,2)  -- Até 999.999.999,99
```

### Textos
```
TEXT           -- Até 1GB (notas, descrições)
```

### Datas/Horas
```
DATE           -- YYYY-MM-DD
DATETIME       -- YYYY-MM-DD HH:mm:ss.SSS
```

### Booleans
```
BOOLEAN        -- TRUE|FALSE (0|1 em SQLite)
```

---

*Fim da Documentação de Schema*
