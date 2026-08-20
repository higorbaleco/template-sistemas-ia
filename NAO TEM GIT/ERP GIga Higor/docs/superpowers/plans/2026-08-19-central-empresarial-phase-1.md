# Central Empresarial Local - Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the foundation of a local desktop business management system with authentication, database schema, client management, and backup infrastructure.

**Architecture:** Single-file SQLite database with local file system storage. Python/Electron desktop app with local password-based authentication. All data remains on the user's machine with optional file encryption.

**Tech Stack:** 
- Backend: Python 3.11+ with SQLAlchemy ORM
- Frontend: Electron + React (TypeScript) for desktop UI
- Database: SQLite3 with AES encryption support
- Storage: Local filesystem for documents and backups
- Testing: pytest for backend, Jest for frontend

**Spec:** `ESPECIFICACAO.md` (sections 1-9, 14-23, 156-162)

## Global Constraints

- All data stored locally; no external dependencies or SaaS
- Minimum 8-character password requirement for master authentication
- Data marked with quality flags: COMPLETO, PARCIAL, ESTIMADO, PENDENTE_REVISAO
- All timestamps use UTC; display converted to user timezone
- Soft deletion via `archived_at` field; no permanent deletes for audit trail
- Every table includes: id, created_at, updated_at, created_by, updated_by, archived_at, is_active, notes

---

## File Structure

```
central-empresarial/
├── backend/
│   ├── src/
│   │   ├── main.py                    # Electron IPC bridge
│   │   ├── config.py                  # Configuration loader
│   │   ├── database.py                # SQLAlchemy setup
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py                # User, password hashing
│   │   │   ├── client.py              # Client, Contact, Status enums
│   │   │   └── timeline.py            # Timeline events
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py        # Login, logout, user management
│   │   │   ├── client_service.py      # Client CRUD
│   │   │   ├── backup_service.py      # Backup/restore
│   │   │   └── encryption.py          # Password hashing + DB encryption
│   │   └── api/
│   │       ├── __init__.py
│   │       └── ipc.py                 # Electron IPC handlers
│   ├── tests/
│   │   ├── test_auth.py
│   │   ├── test_database.py
│   │   ├── test_client.py
│   │   └── test_backup.py
│   ├── requirements.txt
│   └── pytest.ini
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx                   # React root
│   │   ├── App.tsx                    # Router
│   │   ├── pages/
│   │   │   ├── Login.tsx              # Master password screen
│   │   │   ├── Dashboard.tsx          # Main UI shell
│   │   │   └── Clients.tsx            # Client listing
│   │   ├── components/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── Filters.tsx
│   │   │   └── StatusBadge.tsx
│   │   ├── services/
│   │   │   └── ipc.ts                 # Electron IPC client
│   │   └── styles/
│   │       └── globals.css
│   ├── tests/
│   │   └── App.test.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── main.js                            # Electron main process
├── preload.js                         # Electron preload (IPC bridge)
├── CLAUDE.md                          # Development guidance
├── README.md                          # User guide
├── .gitignore
├── package.json                       # Root package.json
└── dados/
    ├── empresa.db                     # SQLite database
    ├── configuracoes/
    │   ├── sistema.json
    │   ├── preferencias.json
    │   └── seguranca.dat
    ├── documentos/                    # Placeholder
    ├── importacoes/                   # Placeholder
    ├── backups/
    │   ├── diarios/
    │   ├── semanais/
    │   └── mensais/
    └── logs/
```

---

## Task 1: Project Scaffolding & Dependencies

**Files:**
- Create: `package.json` (root)
- Create: `backend/requirements.txt`
- Create: `backend/pytest.ini`
- Create: `frontend/package.json`
- Create: `frontend/tsconfig.json`
- Create: `.gitignore`
- Create: `README.md`
- Create: `CLAUDE.md`

**Interfaces:**
- Produces: Installable project structure with all runtime dependencies declared

- [ ] **Step 1: Initialize root package.json**

```json
{
  "name": "central-empresarial",
  "version": "0.1.0",
  "description": "Business management system - local, no cloud",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "dev": "concurrently \"python backend/src/main.py\" \"cd frontend && npm run dev\"",
    "build": "cd frontend && npm run build && electron-builder",
    "test": "pytest backend/tests && cd frontend && npm test",
    "test:backend": "pytest backend/tests -v",
    "test:frontend": "cd frontend && npm test"
  },
  "dependencies": {
    "electron": "^latest"
  },
  "devDependencies": {
    "concurrently": "^8.0.0",
    "electron-builder": "^latest"
  }
}
```

- [ ] **Step 2: Create backend requirements.txt**

```text
Flask==3.0.0
SQLAlchemy==2.0.23
python-dotenv==1.0.0
cryptography==41.0.7
pytest==7.4.3
pytest-cov==4.1.0
bcrypt==4.1.1
```

- [ ] **Step 3: Create frontend package.json**

```json
{
  "name": "central-empresarial-ui",
  "version": "0.1.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "jest",
    "lint": "eslint src"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "jest": "^29.7.0",
    "@testing-library/react": "^14.1.0"
  }
}
```

- [ ] **Step 4: Create .gitignore**

```
node_modules/
__pycache__/
*.pyc
.env
.env.local
dist/
build/
.DS_Store
dados/empresa.db
dados/backups/*
dados/logs/*
*.log
.pytest_cache/
.vscode/
.idea/
```

- [ ] **Step 5: Create frontend tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "resolveJsonModule": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 6: Create backend pytest.ini**

```ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = -v --tb=short
```

- [ ] **Step 7: Create README.md (user guide)**

```markdown
# Central Empresarial Local

Centralize toda operação da sua empresa desde 2020 em um único lugar, sem depender de internet ou servidores externos.

## Características

- ✓ Totalmente local — sem cloud, sem SaaS, sem login online
- ✓ Histórico completo desde 2020
- ✓ Gestão de clientes, vendas, contratos, projetos
- ✓ Análise de margem, esforço e rentabilidade
- ✓ Detecção automática de riscos
- ✓ Backup automático e restauração
- ✓ Suporta usuários locais com diferentes roles

## Instalação Rápida

1. Baixe e extraia o arquivo
2. Abra o aplicativo
3. Crie sua senha mestre
4. Comece a cadastrar clientes e vendas

## Primeiros Passos

Após abrir:

1. **Dashboard** — Visão geral da empresa
2. **Clientes** — Cadastre e acompanhe seus clientes
3. **Vendas** — Registre toda operação comercial
4. **Financeiro** — Controle receber, pagar e fluxo
5. **Relatórios** — Analise histórico e rentabilidade

## Suporte

Consulte a documentação em `docs/` ou envie feedback.
```

- [ ] **Step 8: Create CLAUDE.md (development guidance)**

```markdown
# CLAUDE.md — Central Empresarial Local

Development guide for future contributors and AI agents.

## Project Overview

**Central Empresarial Local** is a comprehensive local business management system designed to run entirely on the user's machine without external dependencies.

- **Tech:** Electron (frontend) + Python Flask (backend) + SQLite (database)
- **Database:** Single file `dados/empresa.db` with AES encryption support
- **Architecture:** Desktop app with local IPC communication between Electron and Python backend
- **Data Retention:** Soft-delete model (archived_at) for audit trail; no permanent deletes

## Common Development Commands

### Backend

```bash
# Install dependencies
pip install -r backend/requirements.txt

# Run tests
pytest backend/tests -v

# Run tests with coverage
pytest backend/tests --cov=backend/src

# Run single test file
pytest backend/tests/test_auth.py -v

# Run specific test
pytest backend/tests/test_auth.py::test_password_hashing -v

# Start backend server (Flask)
python backend/src/main.py
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Build for production
npm run build
```

### Project-Level

```bash
# Run all tests (backend + frontend)
npm test

# Start dev environment (both backend + frontend)
npm run dev

# Build production app
npm run build
```

## Architecture

### Backend (`backend/`)

**Database Layer** (`models/`)
- SQLAlchemy ORM models for all entities
- User authentication (bcrypt hashing)
- Client, Contact, Sales, Financial records

**Service Layer** (`services/`)
- `auth_service.py` — Login, password management, session handling
- `client_service.py` — Client CRUD, timeline tracking
- `backup_service.py` — Backup creation, restoration, rotation
- `encryption.py` — Password hashing and database encryption

**API Layer** (`api/`)
- IPC handlers for Electron communication
- Request validation and error handling

### Frontend (`frontend/`)

**Pages** (`src/pages/`)
- `Login.tsx` — Master password authentication
- `Dashboard.tsx` — Main UI shell, navigation
- `Clients.tsx` — Client listing and search

**Services** (`src/services/`)
- `ipc.ts` — Electron IPC client wrapper

**Components** (`src/components/`)
- Reusable UI components (SearchBar, Filters, Badges)

### Database Schema

**Core Tables:**
- `users` — Local user accounts
- `clients` — Client master data
- `contacts` — Client contact persons
- `sales` — Sales transactions
- `accounts_receivable` — Contas a receber
- `accounts_payable` — Contas a pagar
- Additional tables per Phase 1-7 spec

**Quality Flags** (on every table):
- `data_quality` — COMPLETO | PARCIAL | ESTIMADO | PENDENTE_REVISAO
- `data_source` — Where data came from
- `is_estimated` — Boolean flag
- `needs_review` — Boolean flag

## Specification References

- **Sections 1-9** — Vision, principles, architecture
- **Sections 14-23** — Dashboard, clients, contacts
- **Sections 156-162** — Implementation phases 1-7

Full spec: `ESPECIFICACAO.md`

## Database Backup Strategy

Backups stored in `dados/backups/`:
- **diarios/** — 7 most recent daily backups
- **semanais/** — 4 most recent weekly backups
- **mensais/** — 12 most recent monthly backups

Backup filename: `empresa_YYYY-MM-DD_HHmm.db`

Automatic triggers:
1. Application startup
2. Application shutdown
3. Once per day at fixed time

Manual backup available via UI.

## Security Considerations

1. **Master Password:** Hashed with bcrypt, never stored as plaintext
2. **Database Encryption:** Optional AES encryption layer for `dados/empresa.db`
3. **Session Management:** Auto-lock after configurable inactivity (default: 15 min)
4. **Audit Logs:** All changes tracked in `audit_logs` table

## Code Style & Conventions

**Backend (Python)**
- PEP 8 — Use black for formatting
- Type hints required on all functions
- SQLAlchemy models use snake_case for columns
- Service methods are stateless; pass dependencies

**Frontend (React/TypeScript)**
- Functional components with hooks
- TypeScript strict mode enabled
- CSS modules for component styles
- Test one behavior per test file

## Testing Requirements

**Backend:**
- All service methods must have unit tests
- Database tests use in-memory SQLite
- Authentication tests verify bcrypt behavior
- Backup tests verify file creation and restoration

**Frontend:**
- Component rendering tests required
- User interaction tests (e.g., form submission)
- Mock IPC calls in tests

**Coverage Target:** >80% for both backend and frontend

## Deployment Notes

- **Build:** `npm run build` produces distributable Electron app
- **Database Migration:** SQLAlchemy Alembic migrations for schema updates
- **Versioning:** Follows semantic versioning (major.minor.patch)

## Future Phases

- **Phase 2:** Commercial module (leads, pipeline, opportunities)
- **Phase 3:** Financial module (accounts payable/receivable, cash flow)
- **Phase 4:** Operations (products, costs, partners, suppliers, contracts, projects)
- **Phase 5:** Historical data import and reconciliation
- **Phase 6:** Intelligence dashboards and KPIs
- **Phase 7:** Refinement, reports, alerts, customization

Current phase: **Phase 1 (Foundation)**
```

- [ ] **Step 9: Commit initial structure**

```bash
git add -A
git commit -m "chore: initialize project structure with dependencies and documentation"
```

---

## Task 2: Database Schema & SQLAlchemy Models

**Files:**
- Create: `backend/src/database.py`
- Create: `backend/src/models/__init__.py`
- Create: `backend/src/models/auth.py`
- Create: `backend/src/models/client.py`
- Create: `backend/src/models/timeline.py`
- Create: `backend/tests/test_database.py`

**Interfaces:**
- Consumes: SQLAlchemy 2.0.23, SQLite3
- Produces: 
  - Database connection pool and session factory
  - ORM models: `User`, `Client`, `Contact`, `TimelineEvent`
  - Enum types: `ClientStatus`, `ClientType`, `TimelineEventType`
  - Schema initialization function

- [ ] **Step 1: Create database.py with connection setup**

```python
# backend/src/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from contextlib import contextmanager
import os

DATABASE_PATH = os.path.join(os.path.dirname(__file__), "../../dados/empresa.db")
DATABASE_URL = f"sqlite:///{DATABASE_PATH}"

# Create engine with connection pooling disabled for SQLite
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=False  # Set to True for SQL logging
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

@contextmanager
def get_db_session():
    """Context manager for database sessions."""
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

def init_db():
    """Create all tables in the database."""
    Base.metadata.create_all(bind=engine)
```

- [ ] **Step 2: Create models/__init__.py**

```python
# backend/src/models/__init__.py
from .auth import User
from .client import Client, Contact, ClientStatus, ClientType
from .timeline import TimelineEvent, TimelineEventType

__all__ = [
    "User",
    "Client",
    "Contact",
    "ClientStatus",
    "ClientType",
    "TimelineEvent",
    "TimelineEventType",
]
```

- [ ] **Step 3: Create models/auth.py**

```python
# backend/src/models/auth.py
from sqlalchemy import Column, String, DateTime, Boolean, Integer, Enum
from sqlalchemy.sql import func
from datetime import datetime
import enum
from database import Base

class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    FINANCEIRO = "FINANCEIRO"
    COMERCIAL = "COMERCIAL"
    OPERACIONAL = "OPERACIONAL"
    LEITURA = "LEITURA"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    username = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.ADMIN)
    is_active = Column(Boolean, default=True)
    last_login_at = Column(DateTime, nullable=True)
    failed_attempts = Column(Integer, default=0)
    locked_until = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<User {self.username}>"
```

- [ ] **Step 4: Create models/client.py**

```python
# backend/src/models/client.py
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Enum
from sqlalchemy.sql import func
from datetime import datetime
import enum
import uuid
from database import Base

class ClientType(str, enum.Enum):
    PF = "PF"
    PJ = "PJ"

class ClientStatus(str, enum.Enum):
    PROSPECT = "PROSPECT"
    LEAD = "LEAD"
    OPORTUNIDADE = "OPORTUNIDADE"
    CLIENTE_ATIVO = "CLIENTE_ATIVO"
    CLIENTE_INATIVO = "CLIENTE_INATIVO"
    EX_CLIENTE = "EX_CLIENTE"
    BLOQUEADO = "BLOQUEADO"

class DataQuality(str, enum.Enum):
    COMPLETO = "COMPLETO"
    PARCIAL = "PARCIAL"
    ESTIMADO = "ESTIMADO"
    PENDENTE_REVISAO = "PENDENTE_REVISAO"

class Client(Base):
    __tablename__ = "clients"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    type = Column(Enum(ClientType), nullable=False)
    legal_name = Column(String(255), nullable=False)
    trade_name = Column(String(255), nullable=True)
    cpf_cnpj = Column(String(20), unique=True, nullable=False, index=True)
    segment_id = Column(String, nullable=True)
    website = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True, index=True)
    phone = Column(String(20), nullable=True)
    whatsapp = Column(String(20), nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(2), nullable=True)
    country = Column(String(100), default="Brasil")
    status = Column(Enum(ClientStatus), default=ClientStatus.PROSPECT)
    customer_since = Column(DateTime, nullable=True)
    ended_at = Column(DateTime, nullable=True)
    risk_score = Column(Integer, default=50)  # 0-100
    economic_score = Column(Integer, default=50)  # 0-100
    data_quality = Column(Enum(DataQuality), default=DataQuality.COMPLETO)
    is_active = Column(Boolean, default=True)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    created_by = Column(String, nullable=True)
    updated_by = Column(String, nullable=True)
    archived_at = Column(DateTime, nullable=True)

    def __repr__(self):
        return f"<Client {self.legal_name}>"

class Contact(Base):
    __tablename__ = "contacts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    client_id = Column(String, ForeignKey("clients.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    job_title = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True, index=True)
    phone = Column(String(20), nullable=True)
    whatsapp = Column(String(20), nullable=True)
    is_decision_maker = Column(Boolean, default=False)
    is_primary = Column(Boolean, default=False)
    notes = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    archived_at = Column(DateTime, nullable=True)

    def __repr__(self):
        return f"<Contact {self.name}>"
```

- [ ] **Step 5: Create models/timeline.py**

```python
# backend/src/models/timeline.py
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from datetime import datetime
import enum
import uuid
from database import Base

class TimelineEventType(str, enum.Enum):
    LEAD_CREATED = "LEAD_CREATED"
    CONTACT = "CONTACT"
    MEETING = "MEETING"
    PROPOSAL = "PROPOSAL"
    SALE = "SALE"
    PAYMENT = "PAYMENT"
    PROJECT_STARTED = "PROJECT_STARTED"
    PROJECT_FINISHED = "PROJECT_FINISHED"
    CONTRACT_STARTED = "CONTRACT_STARTED"
    CONTRACT_FINISHED = "CONTRACT_FINISHED"
    SUPPORT = "SUPPORT"
    INCIDENT = "INCIDENT"
    CHURN = "CHURN"
    REACTIVATION = "REACTIVATION"
    NOTE = "NOTE"

class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    client_id = Column(String, ForeignKey("clients.id"), nullable=False, index=True)
    event_type = Column(Enum(TimelineEventType), nullable=False)
    event_date = Column(DateTime, default=func.now())
    title = Column(String(255), nullable=False)
    description = Column(String, nullable=True)
    related_entity_type = Column(String(50), nullable=True)  # e.g., "sale", "project"
    related_entity_id = Column(String, nullable=True)
    user_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now())

    def __repr__(self):
        return f"<TimelineEvent {self.event_type} on {self.event_date}>"
```

- [ ] **Step 6: Create test_database.py**

```python
# backend/tests/test_database.py
import pytest
import tempfile
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Use in-memory SQLite for tests
from src.models import Base, User, Client, Contact, TimelineEvent
from src.models import ClientStatus, ClientType, DataQuality, TimelineEventType, UserRole

@pytest.fixture
def db_engine():
    """Create in-memory SQLite database for tests."""
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    yield engine

@pytest.fixture
def db_session(db_engine):
    """Create a test database session."""
    SessionLocal = sessionmaker(bind=db_engine)
    session = SessionLocal()
    yield session
    session.close()

def test_create_user(db_session):
    """Test creating a user record."""
    user = User(
        id="user-1",
        name="Admin User",
        username="admin",
        password_hash="hashed_password_here",
        role=UserRole.ADMIN,
        is_active=True
    )
    db_session.add(user)
    db_session.commit()
    
    retrieved = db_session.query(User).filter_by(username="admin").first()
    assert retrieved is not None
    assert retrieved.name == "Admin User"
    assert retrieved.role == UserRole.ADMIN

def test_create_client(db_session):
    """Test creating a client record."""
    client = Client(
        type=ClientType.PJ,
        legal_name="Empresa ABC Ltda",
        trade_name="Empresa ABC",
        cpf_cnpj="12.345.678/0001-90",
        city="São Paulo",
        state="SP",
        status=ClientStatus.PROSPECT,
        data_quality=DataQuality.COMPLETO
    )
    db_session.add(client)
    db_session.commit()
    
    retrieved = db_session.query(Client).filter_by(trade_name="Empresa ABC").first()
    assert retrieved is not None
    assert retrieved.type == ClientType.PJ
    assert retrieved.status == ClientStatus.PROSPECT

def test_create_contact(db_session):
    """Test creating a contact record."""
    client = Client(
        type=ClientType.PJ,
        legal_name="Empresa XYZ",
        cpf_cnpj="98.765.432/0001-10",
        status=ClientStatus.CLIENTE_ATIVO
    )
    db_session.add(client)
    db_session.commit()
    
    contact = Contact(
        client_id=client.id,
        name="João Silva",
        job_title="Diretor",
        email="joao@empresa.com",
        is_decision_maker=True,
        is_primary=True
    )
    db_session.add(contact)
    db_session.commit()
    
    retrieved = db_session.query(Contact).filter_by(email="joao@empresa.com").first()
    assert retrieved is not None
    assert retrieved.is_decision_maker is True
    assert retrieved.client_id == client.id

def test_timeline_event(db_session):
    """Test creating a timeline event."""
    client = Client(
        type=ClientType.PF,
        legal_name="João da Silva",
        cpf_cnpj="123.456.789-00",
        status=ClientStatus.LEAD
    )
    db_session.add(client)
    db_session.commit()
    
    event = TimelineEvent(
        client_id=client.id,
        event_type=TimelineEventType.LEAD_CREATED,
        title="Lead gerado via LinkedIn",
        description="Contato iniciado em rede social"
    )
    db_session.add(event)
    db_session.commit()
    
    retrieved = db_session.query(TimelineEvent).filter_by(event_type=TimelineEventType.LEAD_CREATED).first()
    assert retrieved is not None
    assert retrieved.title == "Lead gerado via LinkedIn"
```

- [ ] **Step 7: Run database tests**

```bash
cd backend
pytest tests/test_database.py -v
```

Expected: All 5 tests pass.

- [ ] **Step 8: Commit database layer**

```bash
git add backend/src/models backend/src/database.py backend/tests/test_database.py
git commit -m "feat: implement SQLAlchemy models and database schema for Phase 1"
```

---

## Task 3: Authentication Service & Password Hashing

**Files:**
- Create: `backend/src/services/encryption.py`
- Create: `backend/src/services/auth_service.py`
- Create: `backend/tests/test_auth.py`

**Interfaces:**
- Consumes: bcrypt, User model from Task 2
- Produces:
  - `hash_password(password: str) -> str`
  - `verify_password(password: str, hash: str) -> bool`
  - `AuthService.login(username: str, password: str) -> Optional[User]`
  - `AuthService.register_user(name: str, username: str, password: str, role: UserRole) -> User`

- [ ] **Step 1: Create encryption.py with bcrypt utilities**

```python
# backend/src/services/encryption.py
import bcrypt
import os
from cryptography.fernet import Fernet
from pathlib import Path

def hash_password(password: str) -> str:
    """Hash a password using bcrypt with salt rounds of 12."""
    if not isinstance(password, bytes):
        password = password.encode('utf-8')
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password, salt).decode('utf-8')

def verify_password(password: str, password_hash: str) -> bool:
    """Verify a password against a bcrypt hash."""
    if not isinstance(password, bytes):
        password = password.encode('utf-8')
    if not isinstance(password_hash, bytes):
        password_hash = password_hash.encode('utf-8')
    return bcrypt.checkpw(password, password_hash)

def generate_encryption_key() -> str:
    """Generate a Fernet encryption key."""
    return Fernet.generate_key().decode()

def load_or_create_key(key_path: str = "dados/configuracoes/security.key") -> str:
    """Load encryption key or create new one."""
    Path(key_path).parent.mkdir(parents=True, exist_ok=True)
    
    if os.path.exists(key_path):
        with open(key_path, 'r') as f:
            return f.read()
    
    key = generate_encryption_key()
    with open(key_path, 'w') as f:
        f.write(key)
    
    return key

class DatabaseEncryption:
    """Placeholder for optional database-level encryption (AES)."""
    
    def __init__(self, key: str):
        self.cipher = Fernet(key.encode())
    
    def encrypt(self, data: str) -> str:
        """Encrypt data using Fernet."""
        if isinstance(data, str):
            data = data.encode()
        return self.cipher.encrypt(data).decode()
    
    def decrypt(self, encrypted_data: str) -> str:
        """Decrypt data using Fernet."""
        if isinstance(encrypted_data, str):
            encrypted_data = encrypted_data.encode()
        return self.cipher.decrypt(encrypted_data).decode()
```

- [ ] **Step 2: Create auth_service.py**

```python
# backend/src/services/auth_service.py
from typing import Optional
from datetime import datetime, timedelta
import uuid
from src.database import SessionLocal
from src.models import User, UserRole
from src.services.encryption import hash_password, verify_password

class AuthService:
    """Authentication service for user login and registration."""
    
    @staticmethod
    def login(username: str, password: str) -> Optional[User]:
        """
        Authenticate a user by username and password.
        
        Args:
            username: The username to authenticate
            password: The plaintext password to verify
        
        Returns:
            User object if authentication successful, None otherwise
        """
        session = SessionLocal()
        try:
            user = session.query(User).filter_by(username=username).first()
            
            if not user:
                return None
            
            # Check if user is locked
            if user.locked_until and user.locked_until > datetime.utcnow():
                return None  # User is locked due to failed attempts
            
            # Verify password
            if not verify_password(password, user.password_hash):
                # Increment failed attempts
                user.failed_attempts += 1
                if user.failed_attempts >= 5:
                    user.locked_until = datetime.utcnow() + timedelta(minutes=15)
                session.commit()
                return None
            
            # Successful login
            user.failed_attempts = 0
            user.locked_until = None
            user.last_login_at = datetime.utcnow()
            session.commit()
            
            return user
        finally:
            session.close()
    
    @staticmethod
    def register_user(
        name: str,
        username: str,
        password: str,
        role: UserRole = UserRole.ADMIN
    ) -> User:
        """
        Register a new user.
        
        Args:
            name: Full name of the user
            username: Unique username
            password: Plaintext password (will be hashed)
            role: User role (default: ADMIN)
        
        Returns:
            Created User object
        
        Raises:
            ValueError: If username already exists or password too short
        """
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters")
        
        session = SessionLocal()
        try:
            existing = session.query(User).filter_by(username=username).first()
            if existing:
                raise ValueError(f"Username '{username}' already exists")
            
            user = User(
                id=str(uuid.uuid4()),
                name=name,
                username=username,
                password_hash=hash_password(password),
                role=role,
                is_active=True
            )
            session.add(user)
            session.commit()
            session.refresh(user)
            return user
        finally:
            session.close()
    
    @staticmethod
    def change_password(user_id: str, old_password: str, new_password: str) -> bool:
        """
        Change user password.
        
        Args:
            user_id: ID of the user
            old_password: Current password (must be verified)
            new_password: New password to set
        
        Returns:
            True if successful, False otherwise
        """
        if len(new_password) < 8:
            raise ValueError("New password must be at least 8 characters")
        
        session = SessionLocal()
        try:
            user = session.query(User).filter_by(id=user_id).first()
            if not user:
                return False
            
            # Verify old password
            if not verify_password(old_password, user.password_hash):
                return False
            
            # Set new password
            user.password_hash = hash_password(new_password)
            session.commit()
            return True
        finally:
            session.close()
```

- [ ] **Step 3: Create test_auth.py**

```python
# backend/tests/test_auth.py
import pytest
from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from src.models import Base, User, UserRole
from src.services.encryption import hash_password, verify_password
from src.services.auth_service import AuthService

# Use in-memory SQLite for tests
@pytest.fixture
def db_session():
    """Create in-memory SQLite database for tests."""
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    yield session
    session.close()

def test_password_hashing():
    """Test bcrypt password hashing and verification."""
    password = "MySecurePassword123!"
    hashed = hash_password(password)
    
    # Hash should not equal plaintext
    assert hashed != password
    
    # Verification should succeed
    assert verify_password(password, hashed) is True
    
    # Wrong password should fail
    assert verify_password("WrongPassword", hashed) is False

def test_register_user(db_session, monkeypatch):
    """Test user registration."""
    # Mock SessionLocal to use test session
    monkeypatch.setattr("src.services.auth_service.SessionLocal", lambda: db_session)
    
    user = AuthService.register_user(
        name="Admin User",
        username="admin123",
        password="SecurePassword123",
        role=UserRole.ADMIN
    )
    
    assert user.name == "Admin User"
    assert user.username == "admin123"
    assert user.role == UserRole.ADMIN
    assert user.is_active is True
    assert user.id is not None

def test_register_user_password_too_short(db_session, monkeypatch):
    """Test that short passwords are rejected."""
    monkeypatch.setattr("src.services.auth_service.SessionLocal", lambda: db_session)
    
    with pytest.raises(ValueError, match="at least 8 characters"):
        AuthService.register_user(
            name="User",
            username="testuser",
            password="short"
        )

def test_register_user_duplicate_username(db_session, monkeypatch):
    """Test that duplicate usernames are rejected."""
    monkeypatch.setattr("src.services.auth_service.SessionLocal", lambda: db_session)
    
    # Create first user
    AuthService.register_user(
        name="User 1",
        username="duplicate",
        password="Password123"
    )
    
    # Try to create second user with same username
    with pytest.raises(ValueError, match="already exists"):
        AuthService.register_user(
            name="User 2",
            username="duplicate",
            password="Password123"
        )

def test_login_success(db_session, monkeypatch):
    """Test successful login."""
    monkeypatch.setattr("src.services.auth_service.SessionLocal", lambda: db_session)
    
    # Create user
    AuthService.register_user(
        name="Test User",
        username="testuser",
        password="TestPassword123"
    )
    
    # Login with correct credentials
    user = AuthService.login("testuser", "TestPassword123")
    assert user is not None
    assert user.username == "testuser"
    assert user.failed_attempts == 0
    assert user.last_login_at is not None

def test_login_wrong_password(db_session, monkeypatch):
    """Test login with wrong password."""
    monkeypatch.setattr("src.services.auth_service.SessionLocal", lambda: db_session)
    
    # Create user
    AuthService.register_user(
        name="Test User",
        username="testuser",
        password="CorrectPassword123"
    )
    
    # Login with wrong password
    user = AuthService.login("testuser", "WrongPassword")
    assert user is None
    
    # Verify failed attempts incremented
    stored_user = db_session.query(User).filter_by(username="testuser").first()
    assert stored_user.failed_attempts == 1

def test_login_account_locked_after_failed_attempts(db_session, monkeypatch):
    """Test that account locks after 5 failed attempts."""
    monkeypatch.setattr("src.services.auth_service.SessionLocal", lambda: db_session)
    
    # Create user
    AuthService.register_user(
        name="Test User",
        username="testuser",
        password="CorrectPassword123"
    )
    
    # Make 5 failed login attempts
    for i in range(5):
        AuthService.login("testuser", "WrongPassword")
    
    # 6th attempt should fail (account locked)
    user = AuthService.login("testuser", "CorrectPassword123")
    assert user is None
    
    # Verify account is locked
    stored_user = db_session.query(User).filter_by(username="testuser").first()
    assert stored_user.locked_until is not None

def test_change_password(db_session, monkeypatch):
    """Test changing password."""
    monkeypatch.setattr("src.services.auth_service.SessionLocal", lambda: db_session)
    
    # Create user
    user = AuthService.register_user(
        name="Test User",
        username="testuser",
        password="OldPassword123"
    )
    
    # Change password
    success = AuthService.change_password(
        user_id=user.id,
        old_password="OldPassword123",
        new_password="NewPassword456"
    )
    assert success is True
    
    # Login with old password should fail
    user = AuthService.login("testuser", "OldPassword123")
    assert user is None
    
    # Login with new password should succeed
    user = AuthService.login("testuser", "NewPassword456")
    assert user is not None
```

- [ ] **Step 4: Run auth tests**

```bash
cd backend
pytest tests/test_auth.py -v
```

Expected: All 8 tests pass.

- [ ] **Step 5: Commit authentication**

```bash
git add backend/src/services/encryption.py backend/src/services/auth_service.py backend/tests/test_auth.py
git commit -m "feat: implement authentication service with bcrypt password hashing"
```

---

## Task 4: Client Service & CRUD Operations

**Files:**
- Create: `backend/src/services/client_service.py`
- Create: `backend/tests/test_client.py`

**Interfaces:**
- Consumes: Client, Contact, TimelineEvent models from Task 2; SessionLocal from database.py
- Produces:
  - `ClientService.create_client(type, legal_name, cpf_cnpj, **kwargs) -> Client`
  - `ClientService.get_client(client_id) -> Optional[Client]`
  - `ClientService.list_clients(status=None, city=None) -> List[Client]`
  - `ClientService.update_client(client_id, **updates) -> Client`
  - `ClientService.archive_client(client_id) -> bool`
  - `ClientService.add_contact(client_id, name, **kwargs) -> Contact`

- [ ] **Step 1: Create client_service.py**

```python
# backend/src/services/client_service.py
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

from src.database import SessionLocal
from src.models import Client, Contact, TimelineEvent, ClientStatus, TimelineEventType

class ClientService:
    """Service for client management operations."""
    
    @staticmethod
    def create_client(
        type: str,
        legal_name: str,
        cpf_cnpj: str,
        trade_name: Optional[str] = None,
        city: Optional[str] = None,
        state: Optional[str] = None,
        status: str = "PROSPECT",
        created_by: Optional[str] = None,
        **kwargs
    ) -> Client:
        """
        Create a new client.
        
        Args:
            type: ClientType (PF or PJ)
            legal_name: Legal name of the client
            cpf_cnpj: CPF or CNPJ (must be unique)
            trade_name: Trade name (optional)
            city: City (optional)
            state: State (optional)
            status: Initial status (default: PROSPECT)
            created_by: User ID who created this record
        
        Returns:
            Created Client object
        
        Raises:
            ValueError: If CPF/CNPJ already exists
        """
        session = SessionLocal()
        try:
            # Check for duplicates
            existing = session.query(Client).filter_by(cpf_cnpj=cpf_cnpj).first()
            if existing:
                raise ValueError(f"Client with CPF/CNPJ '{cpf_cnpj}' already exists")
            
            client = Client(
                id=str(uuid.uuid4()),
                type=type,
                legal_name=legal_name,
                cpf_cnpj=cpf_cnpj,
                trade_name=trade_name or legal_name,
                city=city,
                state=state,
                status=status,
                created_by=created_by,
                **kwargs
            )
            session.add(client)
            
            # Create timeline event
            event = TimelineEvent(
                client_id=client.id,
                event_type=TimelineEventType.LEAD_CREATED,
                title=f"Cliente {type} criado",
                description=f"Novo cliente {legal_name} cadastrado no sistema",
                user_id=created_by
            )
            session.add(event)
            session.commit()
            session.refresh(client)
            return client
        finally:
            session.close()
    
    @staticmethod
    def get_client(client_id: str) -> Optional[Client]:
        """
        Retrieve a client by ID.
        
        Args:
            client_id: The client's unique ID
        
        Returns:
            Client object or None if not found
        """
        session = SessionLocal()
        try:
            return session.query(Client).filter_by(id=client_id, is_active=True).first()
        finally:
            session.close()
    
    @staticmethod
    def list_clients(
        status: Optional[str] = None,
        city: Optional[str] = None,
        search: Optional[str] = None,
        limit: int = 100,
        offset: int = 0
    ) -> List[Client]:
        """
        List clients with optional filters.
        
        Args:
            status: Filter by client status (optional)
            city: Filter by city (optional)
            search: Search by name or CPF/CNPJ (optional)
            limit: Max results to return (default: 100)
            offset: Number of results to skip (default: 0)
        
        Returns:
            List of Client objects
        """
        session = SessionLocal()
        try:
            query = session.query(Client).filter_by(is_active=True)
            
            if status:
                query = query.filter_by(status=status)
            
            if city:
                query = query.filter_by(city=city)
            
            if search:
                search_term = f"%{search}%"
                query = query.filter(
                    (Client.legal_name.ilike(search_term)) |
                    (Client.trade_name.ilike(search_term)) |
                    (Client.cpf_cnpj.ilike(search_term))
                )
            
            return query.limit(limit).offset(offset).all()
        finally:
            session.close()
    
    @staticmethod
    def update_client(
        client_id: str,
        updated_by: Optional[str] = None,
        **updates
    ) -> Client:
        """
        Update client information.
        
        Args:
            client_id: The client's unique ID
            updated_by: User ID who made the update
            **updates: Dictionary of fields to update
        
        Returns:
            Updated Client object
        
        Raises:
            ValueError: If client not found
        """
        session = SessionLocal()
        try:
            client = session.query(Client).filter_by(id=client_id).first()
            if not client:
                raise ValueError(f"Client '{client_id}' not found")
            
            for key, value in updates.items():
                if hasattr(client, key):
                    setattr(client, key, value)
            
            client.updated_by = updated_by
            session.commit()
            session.refresh(client)
            return client
        finally:
            session.close()
    
    @staticmethod
    def archive_client(client_id: str, user_id: Optional[str] = None) -> bool:
        """
        Archive (soft delete) a client.
        
        Args:
            client_id: The client's unique ID
            user_id: User ID who archived this record
        
        Returns:
            True if successful, False if client not found
        """
        session = SessionLocal()
        try:
            client = session.query(Client).filter_by(id=client_id).first()
            if not client:
                return False
            
            client.archived_at = datetime.utcnow()
            client.is_active = False
            client.updated_by = user_id
            session.commit()
            return True
        finally:
            session.close()
    
    @staticmethod
    def add_contact(
        client_id: str,
        name: str,
        job_title: Optional[str] = None,
        email: Optional[str] = None,
        phone: Optional[str] = None,
        whatsapp: Optional[str] = None,
        is_decision_maker: bool = False,
        is_primary: bool = False
    ) -> Contact:
        """
        Add a contact person to a client.
        
        Args:
            client_id: The client's unique ID
            name: Contact name
            job_title: Job title (optional)
            email: Email address (optional)
            phone: Phone number (optional)
            whatsapp: WhatsApp number (optional)
            is_decision_maker: Whether this is a decision maker
            is_primary: Whether this is the primary contact
        
        Returns:
            Created Contact object
        
        Raises:
            ValueError: If client not found
        """
        session = SessionLocal()
        try:
            client = session.query(Client).filter_by(id=client_id).first()
            if not client:
                raise ValueError(f"Client '{client_id}' not found")
            
            contact = Contact(
                id=str(uuid.uuid4()),
                client_id=client_id,
                name=name,
                job_title=job_title,
                email=email,
                phone=phone,
                whatsapp=whatsapp,
                is_decision_maker=is_decision_maker,
                is_primary=is_primary
            )
            session.add(contact)
            
            # Create timeline event
            event = TimelineEvent(
                client_id=client_id,
                event_type=TimelineEventType.CONTACT,
                title=f"Novo contato: {name}",
                description=f"Contato {job_title or 'sem cargo'} adicionado"
            )
            session.add(event)
            session.commit()
            session.refresh(contact)
            return contact
        finally:
            session.close()
    
    @staticmethod
    def get_client_contacts(client_id: str) -> List[Contact]:
        """
        Get all contacts for a client.
        
        Args:
            client_id: The client's unique ID
        
        Returns:
            List of Contact objects
        """
        session = SessionLocal()
        try:
            return session.query(Contact).filter_by(
                client_id=client_id,
                is_active=True
            ).all()
        finally:
            session.close()
    
    @staticmethod
    def get_client_timeline(client_id: str, limit: int = 50) -> List[TimelineEvent]:
        """
        Get timeline events for a client.
        
        Args:
            client_id: The client's unique ID
            limit: Max events to return (default: 50)
        
        Returns:
            List of TimelineEvent objects, ordered by date descending
        """
        session = SessionLocal()
        try:
            return session.query(TimelineEvent).filter_by(
                client_id=client_id
            ).order_by(TimelineEvent.event_date.desc()).limit(limit).all()
        finally:
            session.close()
```

- [ ] **Step 2: Create test_client.py**

```python
# backend/tests/test_client.py
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime

from src.models import Base, Client, Contact, TimelineEvent
from src.models import ClientStatus, ClientType, TimelineEventType
from src.services.client_service import ClientService

@pytest.fixture
def db_session():
    """Create in-memory SQLite database for tests."""
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    yield session
    session.close()

@pytest.fixture
def mock_session(db_session, monkeypatch):
    """Mock SessionLocal to use test session."""
    monkeypatch.setattr("src.services.client_service.SessionLocal", lambda: db_session)
    return db_session

def test_create_client(mock_session):
    """Test creating a client."""
    client = ClientService.create_client(
        type=ClientType.PJ,
        legal_name="Empresa XYZ Ltda",
        cpf_cnpj="12.345.678/0001-90",
        city="São Paulo",
        state="SP",
        created_by="user-1"
    )
    
    assert client.legal_name == "Empresa XYZ Ltda"
    assert client.type == ClientType.PJ
    assert client.status == "PROSPECT"
    assert client.created_by == "user-1"
    assert client.id is not None

def test_create_client_duplicate_cpf(mock_session):
    """Test that duplicate CPF/CNPJ is rejected."""
    ClientService.create_client(
        type=ClientType.PF,
        legal_name="João da Silva",
        cpf_cnpj="123.456.789-00"
    )
    
    with pytest.raises(ValueError, match="already exists"):
        ClientService.create_client(
            type=ClientType.PF,
            legal_name="João Silva",
            cpf_cnpj="123.456.789-00"
        )

def test_get_client(mock_session):
    """Test retrieving a client."""
    created = ClientService.create_client(
        type=ClientType.PJ,
        legal_name="Test Company",
        cpf_cnpj="98.765.432/0001-10"
    )
    
    retrieved = ClientService.get_client(created.id)
    assert retrieved is not None
    assert retrieved.legal_name == "Test Company"

def test_list_clients(mock_session):
    """Test listing clients."""
    # Create multiple clients
    ClientService.create_client(
        type=ClientType.PJ,
        legal_name="Company A",
        cpf_cnpj="11.111.111/0001-11",
        city="São Paulo",
        status=ClientStatus.CLIENTE_ATIVO
    )
    
    ClientService.create_client(
        type=ClientType.PJ,
        legal_name="Company B",
        cpf_cnpj="22.222.222/0001-22",
        city="Rio de Janeiro",
        status=ClientStatus.PROSPECT
    )
    
    # List all
    all_clients = ClientService.list_clients()
    assert len(all_clients) == 2
    
    # Filter by city
    sp_clients = ClientService.list_clients(city="São Paulo")
    assert len(sp_clients) == 1
    assert sp_clients[0].legal_name == "Company A"
    
    # Filter by status
    active_clients = ClientService.list_clients(status=ClientStatus.CLIENTE_ATIVO)
    assert len(active_clients) == 1

def test_list_clients_search(mock_session):
    """Test searching clients by name."""
    ClientService.create_client(
        type=ClientType.PJ,
        legal_name="Tech Solutions Ltda",
        cpf_cnpj="12.345.678/0001-90"
    )
    
    ClientService.create_client(
        type=ClientType.PJ,
        legal_name="Marketing Services",
        cpf_cnpj="98.765.432/0001-10"
    )
    
    results = ClientService.list_clients(search="Tech")
    assert len(results) == 1
    assert "Tech" in results[0].legal_name

def test_update_client(mock_session):
    """Test updating a client."""
    client = ClientService.create_client(
        type=ClientType.PJ,
        legal_name="Original Name",
        cpf_cnpj="12.345.678/0001-90"
    )
    
    updated = ClientService.update_client(
        client.id,
        legal_name="Updated Name",
        status=ClientStatus.CLIENTE_ATIVO,
        updated_by="user-2"
    )
    
    assert updated.legal_name == "Updated Name"
    assert updated.status == ClientStatus.CLIENTE_ATIVO
    assert updated.updated_by == "user-2"

def test_archive_client(mock_session):
    """Test archiving a client."""
    client = ClientService.create_client(
        type=ClientType.PJ,
        legal_name="Client to Archive",
        cpf_cnpj="12.345.678/0001-90"
    )
    
    success = ClientService.archive_client(client.id, user_id="user-1")
    assert success is True
    
    # Archived client should not be retrievable
    retrieved = ClientService.get_client(client.id)
    assert retrieved is None

def test_add_contact(mock_session):
    """Test adding a contact to a client."""
    client = ClientService.create_client(
        type=ClientType.PJ,
        legal_name="Test Company",
        cpf_cnpj="12.345.678/0001-90"
    )
    
    contact = ClientService.add_contact(
        client.id,
        name="Maria Silva",
        job_title="Diretora",
        email="maria@company.com",
        is_decision_maker=True,
        is_primary=True
    )
    
    assert contact.name == "Maria Silva"
    assert contact.is_decision_maker is True
    assert contact.client_id == client.id

def test_get_client_contacts(mock_session):
    """Test retrieving all contacts for a client."""
    client = ClientService.create_client(
        type=ClientType.PJ,
        legal_name="Test Company",
        cpf_cnpj="12.345.678/0001-90"
    )
    
    ClientService.add_contact(client.id, name="Contact 1")
    ClientService.add_contact(client.id, name="Contact 2")
    
    contacts = ClientService.get_client_contacts(client.id)
    assert len(contacts) == 2

def test_get_client_timeline(mock_session):
    """Test retrieving timeline events for a client."""
    client = ClientService.create_client(
        type=ClientType.PJ,
        legal_name="Test Company",
        cpf_cnpj="12.345.678/0001-90"
    )
    
    ClientService.add_contact(client.id, name="Contact")
    
    timeline = ClientService.get_client_timeline(client.id)
    assert len(timeline) >= 2  # At least LEAD_CREATED and CONTACT events
```

- [ ] **Step 3: Run client tests**

```bash
cd backend
pytest tests/test_client.py -v
```

Expected: All 10 tests pass.

- [ ] **Step 4: Commit client service**

```bash
git add backend/src/services/client_service.py backend/tests/test_client.py
git commit -m "feat: implement client service with CRUD operations and timeline tracking"
```

---

## Task 5: Backup Service & File Management

**Files:**
- Create: `backend/src/services/backup_service.py`
- Create: `backend/tests/test_backup.py`
- Create: `dados/` directory structure

**Interfaces:**
- Consumes: Database path, datetime
- Produces:
  - `BackupService.create_backup() -> str` (returns backup file path)
  - `BackupService.list_backups(backup_type: str) -> List[str]`
  - `BackupService.restore_backup(backup_path: str) -> bool`
  - `BackupService.cleanup_old_backups(backup_type: str, keep_count: int)`

- [ ] **Step 1: Create backup_service.py**

```python
# backend/src/services/backup_service.py
import shutil
import os
from datetime import datetime
from pathlib import Path
from typing import List, Optional

BACKUP_BASE = Path("dados/backups")
DATABASE_PATH = Path("dados/empresa.db")

class BackupService:
    """Service for database backup and restoration."""
    
    BACKUP_TYPES = {
        "diario": 7,      # Keep 7 daily backups
        "semanal": 4,     # Keep 4 weekly backups
        "mensal": 12      # Keep 12 monthly backups
    }
    
    @staticmethod
    def create_backup(backup_type: str = "diario") -> str:
        """
        Create a backup of the database.
        
        Args:
            backup_type: Type of backup (diario, semanal, mensal)
        
        Returns:
            Path to the created backup file
        
        Raises:
            FileNotFoundError: If database not found
            ValueError: If invalid backup_type
        """
        if not DATABASE_PATH.exists():
            raise FileNotFoundError("Database file not found")
        
        if backup_type not in BackupService.BACKUP_TYPES:
            raise ValueError(f"Invalid backup_type: {backup_type}")
        
        # Create backup directory
        backup_dir = BACKUP_BASE / backup_type
        backup_dir.mkdir(parents=True, exist_ok=True)
        
        # Generate backup filename with timestamp
        timestamp = datetime.utcnow().strftime("%Y-%m-%d_%H%M")
        backup_path = backup_dir / f"empresa_{timestamp}.db"
        
        # Copy database file
        shutil.copy2(str(DATABASE_PATH), str(backup_path))
        
        # Cleanup old backups
        BackupService.cleanup_old_backups(backup_type)
        
        return str(backup_path)
    
    @staticmethod
    def list_backups(backup_type: str = "diario") -> List[str]:
        """
        List all backups of a given type.
        
        Args:
            backup_type: Type of backup to list
        
        Returns:
            List of backup file paths, sorted by date (newest first)
        """
        backup_dir = BACKUP_BASE / backup_type
        
        if not backup_dir.exists():
            return []
        
        backups = sorted(
            backup_dir.glob("empresa_*.db"),
            key=lambda x: x.stat().st_mtime,
            reverse=True
        )
        
        return [str(b) for b in backups]
    
    @staticmethod
    def restore_backup(backup_path: str) -> bool:
        """
        Restore database from a backup.
        
        Args:
            backup_path: Path to the backup file
        
        Returns:
            True if successful, False otherwise
        """
        backup_path = Path(backup_path)
        
        if not backup_path.exists():
            return False
        
        try:
            # Create a safety backup of current database
            if DATABASE_PATH.exists():
                safety_backup = DATABASE_PATH.parent / f"empresa_pre_restore_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.db"
                shutil.copy2(str(DATABASE_PATH), str(safety_backup))
            
            # Restore from backup
            shutil.copy2(str(backup_path), str(DATABASE_PATH))
            return True
        except Exception as e:
            print(f"Restore failed: {e}")
            return False
    
    @staticmethod
    def cleanup_old_backups(backup_type: str, keep_count: Optional[int] = None) -> int:
        """
        Remove old backups, keeping only the most recent ones.
        
        Args:
            backup_type: Type of backup to cleanup
            keep_count: Number of backups to keep (uses defaults if None)
        
        Returns:
            Number of backups deleted
        """
        if keep_count is None:
            keep_count = BackupService.BACKUP_TYPES.get(backup_type, 7)
        
        backup_dir = BACKUP_BASE / backup_type
        
        if not backup_dir.exists():
            return 0
        
        backups = sorted(
            backup_dir.glob("empresa_*.db"),
            key=lambda x: x.stat().st_mtime,
            reverse=True
        )
        
        deleted_count = 0
        for backup in backups[keep_count:]:
            try:
                backup.unlink()
                deleted_count += 1
            except Exception as e:
                print(f"Failed to delete {backup}: {e}")
        
        return deleted_count
    
    @staticmethod
    def initialize_backup_directories():
        """Create backup directory structure."""
        for backup_type in BackupService.BACKUP_TYPES.keys():
            (BACKUP_BASE / backup_type).mkdir(parents=True, exist_ok=True)
    
    @staticmethod
    def get_backup_info(backup_path: str) -> dict:
        """
        Get information about a backup file.
        
        Args:
            backup_path: Path to the backup file
        
        Returns:
            Dictionary with file info (size, date, etc.)
        """
        backup_path = Path(backup_path)
        
        if not backup_path.exists():
            return {}
        
        stat = backup_path.stat()
        return {
            "path": str(backup_path),
            "filename": backup_path.name,
            "size_bytes": stat.st_size,
            "size_mb": round(stat.st_size / (1024 * 1024), 2),
            "created_at": datetime.fromtimestamp(stat.st_mtime).isoformat(),
            "type": backup_path.parent.name
        }
```

- [ ] **Step 2: Create test_backup.py**

```python
# backend/tests/test_backup.py
import pytest
import tempfile
import shutil
from pathlib import Path
from datetime import datetime
import sqlite3

from src.services.backup_service import BackupService

@pytest.fixture
def temp_backup_dir(monkeypatch):
    """Create temporary directories for backup testing."""
    temp_dir = tempfile.mkdtemp()
    monkeypatch.setattr("src.services.backup_service.BACKUP_BASE", Path(temp_dir) / "backups")
    monkeypatch.setattr("src.services.backup_service.DATABASE_PATH", Path(temp_dir) / "empresa.db")
    
    yield Path(temp_dir)
    
    # Cleanup
    shutil.rmtree(temp_dir, ignore_errors=True)

def create_test_database(db_path):
    """Create a test database file."""
    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(db_path))
    conn.execute("CREATE TABLE test (id INTEGER PRIMARY KEY, data TEXT)")
    conn.execute("INSERT INTO test (data) VALUES ('test data')")
    conn.commit()
    conn.close()

def test_initialize_backup_directories(temp_backup_dir, monkeypatch):
    """Test backup directory structure creation."""
    monkeypatch.setattr("src.services.backup_service.BACKUP_BASE", temp_backup_dir / "backups")
    
    BackupService.initialize_backup_directories()
    
    assert (temp_backup_dir / "backups" / "diario").exists()
    assert (temp_backup_dir / "backups" / "semanal").exists()
    assert (temp_backup_dir / "backups" / "mensal").exists()

def test_create_backup(temp_backup_dir, monkeypatch):
    """Test creating a backup."""
    db_path = temp_backup_dir / "empresa.db"
    monkeypatch.setattr("src.services.backup_service.DATABASE_PATH", db_path)
    
    # Create test database
    create_test_database(db_path)
    
    # Create backup
    backup_path = BackupService.create_backup("diario")
    
    assert Path(backup_path).exists()
    assert "empresa_" in backup_path
    assert ".db" in backup_path

def test_create_backup_nonexistent_database(temp_backup_dir, monkeypatch):
    """Test that backup fails if database doesn't exist."""
    db_path = temp_backup_dir / "nonexistent.db"
    monkeypatch.setattr("src.services.backup_service.DATABASE_PATH", db_path)
    
    with pytest.raises(FileNotFoundError):
        BackupService.create_backup()

def test_list_backups(temp_backup_dir, monkeypatch):
    """Test listing backups."""
    db_path = temp_backup_dir / "empresa.db"
    monkeypatch.setattr("src.services.backup_service.DATABASE_PATH", db_path)
    
    # Create test database
    create_test_database(db_path)
    
    # Create multiple backups
    BackupService.create_backup("diario")
    BackupService.create_backup("diario")
    
    backups = BackupService.list_backups("diario")
    assert len(backups) == 2

def test_restore_backup(temp_backup_dir, monkeypatch):
    """Test restoring from backup."""
    db_path = temp_backup_dir / "empresa.db"
    monkeypatch.setattr("src.services.backup_service.DATABASE_PATH", db_path)
    
    # Create original database
    create_test_database(db_path)
    
    # Create backup
    backup_path = BackupService.create_backup("diario")
    
    # Modify original database
    conn = sqlite3.connect(str(db_path))
    conn.execute("DELETE FROM test")
    conn.commit()
    conn.close()
    
    # Restore from backup
    success = BackupService.restore_backup(backup_path)
    assert success is True
    
    # Verify data was restored
    conn = sqlite3.connect(str(db_path))
    cursor = conn.execute("SELECT data FROM test")
    result = cursor.fetchone()
    conn.close()
    
    assert result is not None
    assert result[0] == "test data"

def test_cleanup_old_backups(temp_backup_dir, monkeypatch):
    """Test cleanup of old backups."""
    db_path = temp_backup_dir / "empresa.db"
    monkeypatch.setattr("src.services.backup_service.DATABASE_PATH", db_path)
    
    # Create test database
    create_test_database(db_path)
    
    # Create 10 backups
    for i in range(10):
        BackupService.create_backup("diario")
    
    # Cleanup, keeping only 7
    deleted_count = BackupService.cleanup_old_backups("diario", keep_count=7)
    
    assert deleted_count == 3
    
    # Verify only 7 remain
    backups = BackupService.list_backups("diario")
    assert len(backups) == 7

def test_get_backup_info(temp_backup_dir, monkeypatch):
    """Test getting backup file information."""
    db_path = temp_backup_dir / "empresa.db"
    monkeypatch.setattr("src.services.backup_service.DATABASE_PATH", db_path)
    
    # Create test database
    create_test_database(db_path)
    
    # Create backup
    backup_path = BackupService.create_backup("diario")
    
    # Get info
    info = BackupService.get_backup_info(backup_path)
    
    assert info["path"] == backup_path
    assert info["size_bytes"] > 0
    assert info["size_mb"] > 0
    assert info["type"] == "diario"
    assert "created_at" in info
```

- [ ] **Step 3: Create directory structure**

```bash
mkdir -p dados/backups/diarios
mkdir -p dados/backups/semanais
mkdir -p dados/backups/mensais
mkdir -p dados/configuracoes
mkdir -p dados/documentos
mkdir -p dados/importacoes/entrada
mkdir -p dados/importacoes/processados
mkdir -p dados/importacoes/pendentes
mkdir -p dados/importacoes/rejeitados
mkdir -p dados/logs
```

- [ ] **Step 4: Run backup tests**

```bash
cd backend
pytest tests/test_backup.py -v
```

Expected: All 8 tests pass.

- [ ] **Step 5: Commit backup service**

```bash
git add backend/src/services/backup_service.py backend/tests/test_backup.py
git commit -m "feat: implement backup service with automatic rotation and restoration"
```

---

## Task 6: IPC Bridge & Flask API Setup

**Files:**
- Create: `backend/src/api/ipc.py`
- Create: `backend/src/main.py`
- Create: `main.js` (Electron)
- Create: `preload.js` (Electron IPC bridge)

**Interfaces:**
- Consumes: Flask, all services from previous tasks
- Produces: IPC handlers for authentication, client operations, backup management

---

## EXECUTION HANDOFF

**Plan saved to** `/Users/higorplens/Antigravity Software/NAO TEM GIT/ERP GIga Higor/docs/superpowers/plans/2026-08-19-central-empresarial-phase-1.md`

This is **Phase 1 (Foundation)** of a 7-phase implementation. The plan covers:
- ✓ Task 1: Project scaffolding & dependencies
- ✓ Task 2: Database schema & SQLAlchemy models
- ✓ Task 3: Authentication service with bcrypt
- ✓ Task 4: Client management CRUD operations
- ✓ Task 5: Backup service with automatic rotation
- → Task 6: Electron IPC bridge (next)

**Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration with quality gates

**2. Inline Execution** — Continue in this session using executing-plans, batch tasks with checkpoints

**Which approach would you prefer?**
