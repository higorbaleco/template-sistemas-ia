# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# Central Empresarial Local — Project Development Guide

## Project Overview

**Central Empresarial Local** is a comprehensive local business management system (ERP) designed to run entirely on the user's machine without external dependencies or internet requirements.

**Purpose:** Centralize business operations, history, client relationships, sales, finances, projects, and risk management for a company since 2020.

**Key Principle:** No SaaS, no cloud, no external APIs — everything stays local and encrypted on the user's machine.

---

## Architecture at a Glance

### Stack
- **Frontend:** Electron (desktop) + React (UI)
- **Backend:** Python 3.11+ with Flask
- **Database:** SQLite3 (local file `dados/empresa.db`)
- **Storage:** Local filesystem with automatic backups
- **Security:** bcrypt for passwords, optional AES encryption for database

### High-Level Flow
```
Electron (UI) 
  ↓ IPC
  ↓ Python Flask Server
  ↓ SQLAlchemy ORM
  ↓ SQLite Database (dados/empresa.db)
```

### Data Directories
```
dados/
  ├── empresa.db              # Main database
  ├── configuracoes/          # Settings and encryption keys
  ├── documentos/             # Uploaded/archived files
  ├── importacoes/            # Historical data imports
  ├── backups/
  │   ├── diarios/            # 7 daily backups
  │   ├── semanais/           # 4 weekly backups
  │   └── mensais/            # 12 monthly backups
  └── logs/                   # Application logs
```

---

## Development Commands

### Backend Setup & Testing
```bash
# Install dependencies
pip install -r backend/requirements.txt

# Run all backend tests
pytest backend/tests -v

# Run tests with coverage report
pytest backend/tests --cov=backend/src --cov-report=html

# Run single test file
pytest backend/tests/test_auth.py -v

# Run specific test
pytest backend/tests/test_auth.py::test_password_hashing -v

# Start backend server (Flask)
python backend/src/main.py
```

### Frontend Setup & Testing
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Build for production
npm run build

# Exit frontend directory
cd ..
```

### Full Application
```bash
# Install all dependencies (root + backend + frontend)
npm install && pip install -r backend/requirements.txt && cd frontend && npm install && cd ..

# Run complete dev environment (both processes)
npm run dev

# Run all tests (backend + frontend)
npm test

# Build production Electron app
npm run build
```

---

## Project Structure

### Backend (`backend/`)

**Database & Models** (`src/models/`)
- `auth.py` — User model, roles, authentication
- `client.py` — Client, Contact, status enums
- `timeline.py` — Timeline events and event types
- `database.py` — SQLAlchemy setup and session management

**Business Logic** (`src/services/`)
- `auth_service.py` — Login, registration, password management
- `client_service.py` — Client CRUD, contacts, timeline tracking
- `backup_service.py` — Database backup, restoration, rotation
- `encryption.py` — Password hashing (bcrypt) and optional DB encryption

**API Layer** (`src/api/`)
- `ipc.py` — Electron IPC request handlers

**Entry Point**
- `main.py` — Flask server initialization and startup

**Tests** (`tests/`)
- `test_auth.py` — Authentication and password hashing
- `test_database.py` — Database schema and ORM
- `test_client.py` — Client operations
- `test_backup.py` — Backup creation and restoration

### Frontend (`frontend/`)

**Pages** (`src/pages/`)
- `Login.tsx` — Master password authentication screen
- `Dashboard.tsx` — Main UI shell and navigation
- `Clients.tsx` — Client listing, search, and management

**Services** (`src/services/`)
- `ipc.ts` — Electron IPC client wrapper for backend communication

**Components** (`src/components/`)
- Reusable React components (SearchBar, Filters, StatusBadge, etc.)

**Styles** (`src/styles/`)
- Global styles and CSS modules

### Electron

**Entry Points**
- `main.js` — Electron main process (window creation, lifecycle)
- `preload.js` — IPC bridge (secure communication between Electron and Python)

---

## Database Schema Patterns

### Every Table Includes
```python
id              # UUID primary key
created_at      # Timestamp (UTC)
updated_at      # Timestamp (auto-updated)
created_by      # User ID who created
updated_by      # User ID who updated
archived_at     # Soft-delete timestamp (NULL = active)
is_active       # Boolean flag
notes           # Optional free-form notes
```

### Data Quality Flags (for historical data)
```python
data_quality    # COMPLETO | PARCIAL | ESTIMADO | PENDENTE_REVISAO
data_source     # Where data came from
is_estimated    # Boolean
needs_review    # Boolean
```

### Status Fields
Use enums for all status fields:
- `ClientStatus` — PROSPECT, LEAD, OPORTUNIDADE, CLIENTE_ATIVO, CLIENTE_INATIVO, EX_CLIENTE, BLOQUEADO
- `UserRole` — ADMIN, FINANCEIRO, COMERCIAL, OPERACIONAL, LEITURA
- `TimelineEventType` — LEAD_CREATED, CONTACT, MEETING, PROPOSAL, SALE, PAYMENT, PROJECT_*, CONTRACT_*, SUPPORT, INCIDENT, CHURN, REACTIVATION, NOTE

---

## Authentication & Security

### Password Requirements
- Minimum 8 characters
- Hashed with bcrypt (12 rounds)
- Never stored as plaintext

### Session Management
- Master password unlocks the app
- Auto-lock after configurable inactivity (default: 15 minutes)
- Account locks after 5 failed login attempts (15 minute cooldown)

### Backup Security
- Automatic backups on startup, shutdown, and once per day
- Optional AES encryption for database at rest
- Manual backup available via UI

---

## Testing Strategy

### Coverage Requirements
- **Backend:** >80% (pytest)
- **Frontend:** >80% (Jest)

### Test Organization
```
backend/tests/
  ├── test_auth.py        # User login, password hashing, role management
  ├── test_database.py    # Schema creation, ORM basics
  ├── test_client.py      # Client CRUD, contacts, timeline
  └── test_backup.py      # Backup creation, restoration, cleanup

frontend/tests/
  ├── App.test.tsx        # Router, main layout
  ├── pages/Login.test.tsx
  ├── components/*.test.tsx
  └── services/ipc.test.ts
```

### Testing with In-Memory SQLite
Tests use `sqlite:///:memory:` for speed and isolation. Each test gets a fresh database.

---

## Implementation Phases

This project follows a 7-phase roadmap:

| Phase | Focus | Key Modules |
|-------|-------|-------------|
| **1** | Foundation | Login, DB schema, clients, backup | **← Currently Here**
| **2** | Commercial | Leads, pipeline, opportunities, proposals, sales |
| **3** | Financial | Accounts payable/receivable, cash flow, taxes |
| **4** | Operations | Products, costs, partners, contracts, projects |
| **5** | Historical | Data import, reconciliation, quality assessment |
| **6** | Intelligence | Dashboards, KPIs, rankings, cohorts |
| **7** | Refinement | Reports, alerts, customization, polish |

**Current Phase:** Phase 1 (Foundation) — See `/docs/superpowers/plans/` for task breakdown.

---

## Code Conventions

### Python (Backend)

**File Organization**
- Imports grouped: stdlib, third-party, local
- Type hints required on all functions
- Docstrings for classes and public methods (Google style)

**Naming**
- Functions/variables: `snake_case`
- Classes: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Database columns: `snake_case`

**SQLAlchemy**
- Use declarative base with `Base`
- Define relationships with type hints
- Use Enum for status fields (not strings)
- Soft-delete via `archived_at` field

**Services**
- Stateless methods (pass dependencies as args)
- Handle session lifecycle (open, commit, close)
- Return domain objects (not raw rows)
- Raise specific exceptions for validation

**Example:**
```python
@staticmethod
def create_client(type: str, legal_name: str, cpf_cnpj: str) -> Client:
    """Create a new client."""
    session = SessionLocal()
    try:
        # Validation
        if not legal_name:
            raise ValueError("legal_name required")
        
        # Create
        client = Client(type=type, legal_name=legal_name, cpf_cnpj=cpf_cnpj)
        session.add(client)
        session.commit()
        session.refresh(client)
        return client
    finally:
        session.close()
```

### TypeScript/React (Frontend)

**Conventions**
- Functional components with hooks
- Props typed via TypeScript interfaces
- CSS Modules for scoped styling
- IPC calls wrapped in service layer

**Example:**
```tsx
interface ClientListProps {
  filter?: string;
  onSelect: (client: Client) => void;
}

export function ClientList({ filter, onSelect }: ClientListProps) {
  const [clients, setClients] = useState<Client[]>([]);
  
  useEffect(() => {
    IPCService.listClients(filter).then(setClients);
  }, [filter]);
  
  return (
    <div className={styles.container}>
      {clients.map(c => (
        <div key={c.id} onClick={() => onSelect(c)}>
          {c.legal_name}
        </div>
      ))}
    </div>
  );
}
```

---

## Specification References

Complete spec: `ESPECIFICACAO.md` (current source of truth for requirements across 7 phases)

Key sections by task:
- **Sections 1-9** — Vision, principles, architecture foundations
- **Sections 14-23** — Dashboard, clients, contacts, timelines
- **Sections 156-162** — Implementation phases 1-7

---

## Common Development Tasks

### Adding a New Entity (e.g., Sales)

1. **Define Model** (`backend/src/models/sales.py`)
   - Create SQLAlchemy model with all standard fields
   - Define status enums if needed

2. **Add Service** (`backend/src/services/sale_service.py`)
   - Write CRUD methods (create, get, list, update, archive)
   - Add timeline events on key actions

3. **Write Tests** (`backend/tests/test_sales.py`)
   - Test each service method
   - Cover edge cases and validation

4. **Connect to IPC** (`backend/src/api/ipc.py`)
   - Register handlers for frontend to call

5. **Build UI** (`frontend/src/pages/Sales.tsx`)
   - Create listing page
   - Add forms for create/edit
   - Call IPC service

### Adding a Dashboard Widget

1. **Design KPI Calculation** (docs/)
2. **Add Backend Calculation** (service method)
3. **Expose via IPC** (api/ipc.py handler)
4. **Build React Component** (frontend/src/components/Widgets/)
5. **Add to Dashboard** (frontend/src/pages/Dashboard.tsx)

### Running Migrations

```bash
# Create new migration (after changing models)
alembic revision --autogenerate -m "add new table"

# Apply migrations
alembic upgrade head

# Rollback last migration
alembic downgrade -1
```

---

## Debugging

### Backend Logging
```python
import logging
logger = logging.getLogger(__name__)

logger.debug("Debug message")
logger.info("Info message")
logger.error("Error message")
```

### Frontend Debugging
- Use React DevTools browser extension
- Console.log for debugging (remove before production)
- Network tab in DevTools to inspect IPC calls

### Database Inspection
```bash
# Open SQLite CLI
sqlite3 dados/empresa.db

# Common commands
.schema                    # Show all tables
SELECT * FROM clients;     # Query clients
.quit                      # Exit
```

### Enable SQL Logging
```python
# In database.py, set echo=True
engine = create_engine(DATABASE_URL, echo=True)  # Shows all SQL
```

---

## Performance Considerations

### Database
- Add indexes on frequently filtered columns (cpf_cnpj, email, status)
- Use pagination for large result sets (limit/offset)
- Archive old records instead of deleting

### Frontend
- Memoize expensive computations (useMemo)
- Lazy load large lists (React.lazy)
- Avoid re-renders with React.memo

### IPC Communication
- Batch requests when possible
- Use pagination for large datasets
- Cache results client-side when appropriate

---

## Deployment

### Development
```bash
npm run dev    # Starts Electron + Flask + React dev servers
```

### Production Build
```bash
npm run build  # Creates distributable Electron app
```

### Database Backup Strategy
- Automatic backups: 7 daily, 4 weekly, 12 monthly
- Manual backup available in Settings
- Restore from backup with automatic safety backup of current state

---

## Known Limitations & Future Work

### Phase 1 (Current)
- Single-user local authentication (no multi-user sync)
- Manual data import (no automated sync)
- No advanced reporting or exports (planned Phase 6-7)

### Planned Enhancements
- Phase 2: Full sales pipeline with probability-weighted forecasting
- Phase 3: Complex financial analysis and tax calculations
- Phase 5: Bulk historical data import with deduplication
- Phase 6: Interactive dashboards with drill-down analytics
- Phase 7: Custom reports and scheduled exports

---

## Support & Resources

- **Specification:** `/ESPECIFICACAO.md` (complete requirements)
- **Implementation Plan:** `/docs/superpowers/plans/2026-08-19-central-empresarial-phase-1.md`
- **Schema Docs:** Documented in each model file
- **Tests:** Comprehensive test coverage for all services

---

## Quick Reference: Common Patterns

### Creating a New Record
```python
service = ClientService()
client = service.create_client(
    type=ClientType.PJ,
    legal_name="Company Name",
    cpf_cnpj="12.345.678/0001-90",
    created_by=current_user_id
)
```

### Querying Records
```python
clients = ClientService.list_clients(
    status=ClientStatus.CLIENTE_ATIVO,
    city="São Paulo",
    search="search term",
    limit=50
)
```

### Handling Errors
```python
try:
    client = ClientService.create_client(...)
except ValueError as e:
    # Validation error (duplicate, missing required field)
    log.error(f"Validation failed: {e}")
except Exception as e:
    # Database or other error
    log.error(f"Unexpected error: {e}")
```

### Testing
```bash
# Quick test during development
pytest backend/tests/test_client.py::test_create_client -v

# Full coverage report
pytest backend/tests --cov=backend/src --cov-report=term-missing

# Watch mode (if using pytest-watch)
ptw backend/tests
```
