# Arquitetura - Central Empresarial Local

**Versão:** 1.0  
**Data:** 2026-08-19  
**Autor:** Development Team

---

## 1. VISÃO ARQUITETURAL

A Central Empresarial é uma aplicação **desktop local** que funciona totalmente desconectada, sem dependências externas.

### Pilares Arquiteturais:

1. **Local-First** — Nenhum acesso à internet necessário
2. **Single Responsibility** — Cada módulo tem uma responsabilidade clara
3. **Data Integrity** — Consistência de dados garantida via transações
4. **Security** — Criptografia de senhas, proteção do banco
5. **Scalability** — Preparado para histórico desde 2020 com milhares de registros
6. **Maintainability** — Código bem estruturado, testável e documentado

---

## 2. STACK TECNOLÓGICO

### Frontend
- **Framework:** Electron (desktop shell)
- **UI:** React 18+ com TypeScript
- **Styling:** CSS Modules ou styled-components
- **State:** React Hooks + Context API
- **Testing:** Jest + React Testing Library

### Backend
- **Linguagem:** Python 3.11+
- **Framework:** Flask (lightweight API server)
- **ORM:** SQLAlchemy 2.0+
- **Database:** SQLite3
- **Testing:** pytest
- **Security:** bcrypt, cryptography

### Desktop Integration
- **IPC Bridge:** Electron IPC (process.send/receive)
- **Packaging:** electron-builder

---

## 3. ARQUITETURA DE CAMADAS

```
┌─────────────────────────────────────────────────────┐
│                   APRESENTAÇÃO                       │
│  (Electron UI - React Components)                    │
│  ├── Pages (Login, Dashboard, Clients, etc)         │
│  ├── Components (Forms, Tables, Cards)              │
│  └── Services (IPC Client)                          │
└──────────────────┬──────────────────────────────────┘
                   │ IPC Bridge
┌──────────────────▼──────────────────────────────────┐
│              APLICAÇÃO (Backend)                     │
│  (Flask REST API - Local)                           │
│  ├── API Layer (IPC Handlers)                       │
│  ├── Service Layer (Business Logic)                 │
│  │   ├── AuthService                                │
│  │   ├── ClientService                              │
│  │   ├── SalesService                               │
│  │   └── ...                                        │
│  └── Repository Pattern (Data Access)               │
└──────────────────┬──────────────────────────────────┘
                   │ SQLAlchemy ORM
┌──────────────────▼──────────────────────────────────┐
│              PERSISTÊNCIA                            │
│  (SQLite Database)                                   │
│  ├── Schema Tables                                  │
│  ├── Migrations (Alembic)                           │
│  └── Backups                                        │
└──────────────────────────────────────────────────────┘
```

---

## 4. COMPONENTES PRINCIPAIS

### 4.1 Electron Main Process (`main.js`)

**Responsabilidades:**
- Criar janela principal
- Gerenciar ciclo de vida da aplicação
- Configurar IPC channels
- Lançar backend Python

**Ciclo de vida:**
```
app.ready
  → criar window
  → registrar IPC handlers
  → lançar Python backend
    
window.close
  → salvar estado
  → fazer backup
  → parar Python backend
  
app.quit
  → cleanup
```

### 4.2 Preload Script (`preload.js`)

**Responsabilidades:**
- Expor API segura do IPC
- Validar mensagens
- Fazer bridge entre Electron e Python

**Exemplo:**
```javascript
contextBridge.exposeInMainWorld('ipc', {
  invoke: (channel, data) => 
    ipcRenderer.invoke(channel, data),
  on: (channel, callback) => 
    ipcRenderer.on(channel, (e, data) => callback(data))
})
```

### 4.3 Frontend - React

**Estrutura:**
```
frontend/src/
├── pages/                    # Páginas da aplicação
│   ├── Login.tsx            # Autenticação
│   ├── Dashboard.tsx        # Dashboard principal
│   ├── Clients.tsx          # Listagem de clientes
│   ├── ClientDetail.tsx     # Detalhes do cliente
│   └── ...
├── components/              # Componentes reutilizáveis
│   ├── SearchBar.tsx
│   ├── Filter.tsx
│   ├── Table.tsx
│   ├── Modal.tsx
│   └── ...
├── services/               # Serviços (IPC, cache, etc)
│   ├── ipc.ts             # Cliente IPC
│   ├── auth.ts            # Autenticação
│   └── cache.ts           # Cache local
├── styles/                # CSS global
├── App.tsx                # Root component
└── main.tsx               # React entry point
```

**Padrões:**
- Componentes funcionais com hooks
- TypeScript strict mode
- Props tipadas via interfaces
- IPC chamadas centralizadas em serviços

### 4.4 Backend - Flask

**Estrutura:**
```
backend/src/
├── main.py               # Entry point (inicia Flask)
├── config.py             # Configuração
├── database.py           # SQLAlchemy setup
├── models/               # ORM models
│   ├── auth.py          # User, roles
│   ├── client.py        # Client, Contact
│   ├── sales.py         # Sales, Items
│   └── ...
├── services/            # Business logic
│   ├── auth_service.py
│   ├── client_service.py
│   ├── sales_service.py
│   ├── backup_service.py
│   └── ...
└── api/                 # HTTP endpoints
    └── ipc.py          # IPC handlers para Electron
```

**Padrões:**
- Serviços stateless
- Injeção de dependências
- Validação de entrada
- Logging estruturado
- Exception handling centralizado

### 4.5 Database - SQLite

**Localização:** `dados/empresa.db`

**Características:**
- Arquivo único
- Transações ACID
- Suporte a JSON (campo json_data)
- Soft-delete via `archived_at`
- Auditoria via `created_by`, `updated_by`

**Índices Críticos:**
```sql
-- Clientes
CREATE INDEX idx_clients_cpf_cnpj ON clients(cpf_cnpj);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_email ON clients(email);

-- Usuários
CREATE INDEX idx_users_username ON users(username);

-- Vendas
CREATE INDEX idx_sales_client_id ON sales(client_id);
CREATE INDEX idx_sales_sale_date ON sales(sale_date);

-- Transações Financeiras
CREATE INDEX idx_fin_trans_account_id ON financial_transactions(financial_account_id);
CREATE INDEX idx_fin_trans_date ON financial_transactions(transaction_date);
```

---

## 5. FLUXO DE DADOS

### 5.1 Autenticação

```
User Types Password
  ↓
React Form (Login.tsx)
  ↓
IPC: invoke('auth:login', {username, password})
  ↓
main.js IPC Handler
  ↓
Backend: AuthService.login()
  ↓
Bcrypt Verification
  ↓
Return: {user, sessionToken}
  ↓
Frontend: Store token, redirect to Dashboard
```

### 5.2 Criação de Cliente

```
User Preenche Form (Clients.tsx)
  ↓
IPC: invoke('client:create', {data})
  ↓
Backend: ClientService.create_client()
  ↓
Validation: CPF/CNPJ unique?
  ↓
Create Client record
Create Timeline Event (LEAD_CREATED)
  ↓
Commit Transaction
  ↓
Return: Created client object
  ↓
Frontend: Update state, show confirmation
```

### 5.3 Query de Clientes

```
User Abre Clients Page
  ↓
useEffect() dispara
  ↓
IPC: invoke('client:list', {filters})
  ↓
Backend: ClientService.list_clients()
  ↓
Build Query: WHERE status=? AND city=? ...
Add Pagination: LIMIT 50 OFFSET 0
  ↓
Return: [Client[], total_count]
  ↓
Frontend: Render Table, pagination
```

### 5.4 Backup Automático

```
Application Startup
  ↓
BackupService.create_backup('diario')
  ↓
Copy: empresa.db → backups/diarios/empresa_2026-08-19_0800.db
  ↓
Cleanup: Keep only 7 most recent
  ↓
Log: Backup created successfully
```

---

## 6. PADRÕES DE DESIGN

### 6.1 Service Layer Pattern

```python
# Serviço encapsula lógica de negócio
class ClientService:
    @staticmethod
    def create_client(type, legal_name, cpf_cnpj):
        # Validação
        if not legal_name:
            raise ValueError("...")
        
        # Lógica
        session = SessionLocal()
        try:
            client = Client(...)
            session.add(client)
            session.commit()
            return client
        finally:
            session.close()
```

**Benefícios:**
- Lógica centralizada
- Fácil de testar
- Reutilizável

### 6.2 Data Quality Flags

Cada registro histórico carrega flags de qualidade:

```python
class Client(Base):
    data_quality = Column(
        Enum(DataQuality),
        default=DataQuality.COMPLETO
    )
    is_estimated = Column(Boolean, default=False)
    needs_review = Column(Boolean, default=False)
```

**Isso permite:**
- Rastrear origem dos dados
- Filtrar por confiabilidade
- Reportar dados que precisam revisão

### 6.3 Soft Delete

Nunca deletar registros permanentemente:

```python
# Ao invés de DELETE FROM clients WHERE id=?
# Fazer:
client.archived_at = datetime.utcnow()
client.is_active = False

# Filtros padrão sempre usam:
query = session.query(Client).filter(Client.is_active == True)
```

**Benefícios:**
- Mantém histórico completo
- Permite restaurar
- Auditoria completa

### 6.4 Timeline Events

Toda ação importante registra um evento:

```python
event = TimelineEvent(
    client_id=client.id,
    event_type=TimelineEventType.LEAD_CREATED,
    title="Nova oportunidade",
    user_id=current_user.id
)
session.add(event)
```

**Resulta em:**
- Histórico de ações
- Rastreabilidade
- Possibilidade de "o que aconteceu com este cliente?"

---

## 7. SEGURANÇA

### 7.1 Autenticação

- **Master Password** — bcrypt com 12 rounds
- **Session Token** — JWT ou simples em memória
- **Lockout** — 5 tentativas erradas = 15 min bloqueado
- **Inactivity** — Auto-logout após 15 min

### 7.2 Proteção de Dados

**Nível 1:** Senha de aplicação (padrão)

**Nível 2:** Proteção do SO (Windows BitLocker, macOS FileVault)

**Nível 3:** Criptografia de banco (opcional, com chave mestra)

### 7.3 IPC Security

```javascript
// Validar origem das mensagens
if (event.origin !== 'file://') {
    return; // Rejeitar
}

// Validar schema das mensagens
const schema = {
    channel: 'string',
    data: 'object'
};
```

### 7.4 Auditoria

Toda ação registrada:

```python
audit_log = AuditLog(
    user_id=user.id,
    action='UPDATE',
    entity_type='Client',
    entity_id=client.id,
    old_data=old_values,
    new_data=new_values,
    created_at=datetime.utcnow()
)
```

---

## 8. PERFORMANCE

### 8.1 Database Optimization

**Índices:**
- CPF/CNPJ (lookup único)
- Status (filtering comum)
- Dates (range queries)
- Foreign keys (joins)

**Paginação:**
- Sempre usar LIMIT/OFFSET
- Padrão: 50 registros por página
- Frontend cache de resultados

**Connection Pooling:**
```python
engine = create_engine(
    DATABASE_URL,
    pool_size=5,
    max_overflow=10
)
```

### 8.2 Frontend Optimization

**Code Splitting:**
```tsx
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Clients = lazy(() => import('./pages/Clients'));

// Lazy load páginas
<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

**Memoization:**
```tsx
const ClientTable = memo(({ clients }) => {
  return clients.map(c => <ClientRow key={c.id} client={c} />);
});
```

**IPC Batching:**
```typescript
// ❌ Ruim
for (const id of clientIds) {
    await ipc.invoke('client:get', id);  // N chamadas
}

// ✓ Bom
const clients = await ipc.invoke('client:getMany', clientIds); // 1 chamada
```

### 8.3 Backup Strategy

**Automático:**
- Startup
- Shutdown
- 1x por dia (configurável)

**Rotação:**
- 7 diários
- 4 semanais
- 12 mensais

**Tamanho esperado:**
- Database típica: 50-100 MB
- Backups comprimidos: 15-30 MB cada

---

## 9. ESCALABILIDADE

### 9.1 Crescimento de Dados

Sistema preparado para:

```
Clientes:       até 100.000
Contatos:       até 500.000
Vendas:         até 1.000.000
Movimentações:  até 5.000.000
Histórico:      2020-2050+ (30+ anos)
```

**Estratégia:**
- Índices em colunas críticas
- Paginação em queries
- Arquivamento de dados muito antigos (opcional)

### 9.2 Crescimento de Usuários

Mesmo sendo local, suportar múltiplos usuários:

```python
# Cada ação registra user_id
client = ClientService.create_client(..., created_by=user.id)

# Permite auditoria por usuário
logs = session.query(AuditLog).filter(
    AuditLog.user_id == user.id
).all()
```

---

## 10. DISPONIBILIDADE E RECUPERAÇÃO

### 10.1 Backup & Restore

```
Erro no banco?
  ↓
Criar safety backup (pre_restore)
  ↓
Restaurar de último backup
  ↓
Validar integridade
  ↓
Continuar operação
```

### 10.2 Validação de Integridade

```sql
-- Verificar integridade
PRAGMA integrity_check;

-- Reparar se necessário
PRAGMA quick_check;
```

### 10.3 Disaster Recovery

**Cenário:** Arquivo de banco corrompido

**Solução:**
1. Automático: Restaurar do backup mais recente
2. Manual: Usuário escolhe qual backup restaurar

---

## 11. INTEGRAÇÃO ENTRE CAMADAS

### 11.1 Frontend ↔ Backend

```
React Component
  ↓ useEffect
  ↓ await ipc.invoke('client:list', filters)
  ↓
Electron IPC Handler (main.js)
  ↓
Python IPC Receiver (backend/api/ipc.py)
  ↓
ClientService.list_clients(filters)
  ↓
SQLAlchemy Query
  ↓
SQLite Query
  ↓ Results
  ↓
Return JSON
  ↓ ipc.invoke completes
  ↓
setState(clients)
  ↓
Re-render Table
```

### 11.2 Error Handling

```
Frontend Error
  ↓
Log to console + UI
  ↓
Backend Error (Python)
  ↓
Log to file
  ↓
Return error response
  ↓
Frontend catches, displays
  ↓
User sees friendly message
```

---

## 12. DEPLOYMENT

### 12.1 Estrutura de Build

```
npm run build
  ↓
Frontend: npm run build (Vite)
  ├── dist/
  ├── index.html
  └── assets/
  ↓
Backend: pyinstaller (empacotar Python)
  ├── backend.exe (Windows)
  └── backend (Linux/Mac)
  ↓
electron-builder
  ├── Central-Empresarial-1.0.0.exe (Windows)
  ├── Central-Empresarial-1.0.0.dmg (Mac)
  └── Central-Empresarial-1.0.0.AppImage (Linux)
```

### 12.2 Update Strategy

**Local-only = sem auto-update necessário**

Usuários download nova versão manualmente quando disponível.

---

## 13. DIAGRAMA DE FLUXO COMPLETO

```
┌─────────────────────────────────────┐
│   USUÁRIO FINAL                      │
│   (Electron Window)                  │
└────────────────┬────────────────────┘
                 │
       ┌─────────▼──────────┐
       │  REACT APPLICATION │
       │  ├── Pages         │
       │  ├── Components    │
       │  └── Services      │
       └─────────┬──────────┘
                 │
         ┌───────▼────────┐
         │  IPC BRIDGE    │
         │  (main.js)     │
         └───────┬────────┘
                 │
    ┌────────────▼────────────┐
    │  FLASK API SERVER       │
    │  ├── API Handlers       │
    │  └── IPC Receivers      │
    └────────────┬────────────┘
                 │
    ┌────────────▼────────────┐
    │  SERVICE LAYER          │
    │  ├── AuthService        │
    │  ├── ClientService      │
    │  ├── SalesService       │
    │  └── BackupService      │
    └────────────┬────────────┘
                 │
    ┌────────────▼────────────┐
    │  SQLALCHEMY ORM         │
    │  ├── Models             │
    │  └── Sessions           │
    └────────────┬────────────┘
                 │
    ┌────────────▼────────────┐
    │  SQLITE DATABASE        │
    │  ├── empresa.db         │
    │  └── Backups/           │
    └─────────────────────────┘
```

---

*Fim da Documentação de Arquitetura*
