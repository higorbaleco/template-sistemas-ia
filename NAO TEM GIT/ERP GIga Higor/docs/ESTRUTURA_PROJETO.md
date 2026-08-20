# Estrutura do Projeto - Central Empresarial Local

**Documentação da organização física de arquivos e pastas**

---

## 📂 Visão Geral da Estrutura

```
central-empresarial/
│
├── 📄 README.md                              # Documentação principal
├── 📄 CLAUDE.md                              # Guia de desenvolvimento
├── 📄 ESPECIFICACAO.md                       # Requisitos completos (62 seções)
├── 📄 package.json                           # Dependências do projeto
│
├── 📁 frontend/                              # Interface React + Electron
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 📄 vite.config.ts
│   ├── 📄 index.html
│   ├── 📄 jest.config.js
│   │
│   └── 📁 src/
│       ├── 📄 main.tsx                      # Entry point React
│       ├── 📄 App.tsx                       # Root component
│       ├── 📄 App.css
│       │
│       ├── 📁 pages/                        # Páginas da aplicação
│       │   ├── 📄 Login.tsx                 # Tela de autenticação
│       │   ├── 📄 Dashboard.tsx             # Dashboard principal
│       │   ├── 📄 Clients.tsx               # Listagem de clientes
│       │   ├── 📄 ClientDetail.tsx          # Detalhes do cliente
│       │   ├── 📄 Sales.tsx                 # Vendas (Fase 2)
│       │   ├── 📄 Financial.tsx             # Financeiro (Fase 3)
│       │   └── 📄 Reports.tsx               # Relatórios (Fase 6)
│       │
│       ├── 📁 components/                   # Componentes reutilizáveis
│       │   ├── 📄 SearchBar.tsx
│       │   ├── 📄 Filter.tsx
│       │   ├── 📄 Table.tsx
│       │   ├── 📄 Modal.tsx
│       │   ├── 📄 Form.tsx
│       │   ├── 📄 Button.tsx
│       │   ├── 📄 Card.tsx
│       │   ├── 📄 Badge.tsx
│       │   └── 📄 Loading.tsx
│       │
│       ├── 📁 services/                    # Serviços e APIs
│       │   ├── 📄 ipc.ts                   # Cliente IPC (comunicação com backend)
│       │   ├── 📄 auth.ts                  # Serviço de autenticação
│       │   ├── 📄 cache.ts                 # Cache local de dados
│       │   └── 📄 storage.ts               # LocalStorage manager
│       │
│       ├── 📁 hooks/                       # React custom hooks
│       │   ├── 📄 useAuth.ts
│       │   ├── 📄 useClient.ts
│       │   └── 📄 usePagination.ts
│       │
│       └── 📁 styles/                      # CSS global
│           ├── 📄 globals.css
│           ├── 📄 variables.css
│           └── 📄 reset.css
│
├── 📁 backend/                              # Backend Python + Flask
│   ├── 📄 requirements.txt                  # Dependências Python
│   ├── 📄 pytest.ini
│   │
│   ├── 📁 src/
│   │   ├── 📄 main.py                      # Entry point Flask
│   │   ├── 📄 config.py                    # Configuração
│   │   ├── 📄 database.py                  # SQLAlchemy setup
│   │   │
│   │   ├── 📁 models/                      # ORM Models
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 auth.py                  # User, roles
│   │   │   ├── 📄 client.py                # Client, Contact, Timeline
│   │   │   ├── 📄 sales.py                 # Sales, Opportunities (Fase 2)
│   │   │   ├── 📄 financial.py             # Financeiro (Fase 3)
│   │   │   ├── 📄 projects.py              # Projetos (Fase 4)
│   │   │   └── 📄 base.py                  # Base model com campos padrão
│   │   │
│   │   ├── 📁 services/                    # Lógica de negócio
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 auth_service.py          # Autenticação
│   │   │   ├── 📄 client_service.py        # Clientes CRUD
│   │   │   ├── 📄 backup_service.py        # Backup/restore
│   │   │   ├── 📄 encryption.py            # Hash + criptografia
│   │   │   ├── 📄 sales_service.py         # Vendas (Fase 2)
│   │   │   ├── 📄 financial_service.py     # Financeiro (Fase 3)
│   │   │   └── 📄 report_service.py        # Relatórios (Fase 6)
│   │   │
│   │   ├── 📁 api/                         # IPC handlers
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 ipc.py                   # Todos os handlers IPC
│   │   │   └── 📄 validators.py            # Validação de entrada
│   │   │
│   │   └── 📁 utils/                       # Utilitários
│   │       ├── 📄 __init__.py
│   │       ├── 📄 logger.py                # Logging estruturado
│   │       ├── 📄 exceptions.py            # Custom exceptions
│   │       └── 📄 decorators.py            # Decoradores úteis
│   │
│   └── 📁 tests/                           # Testes unitários
│       ├── 📄 conftest.py                  # Configuração pytest
│       ├── 📄 test_auth.py
│       ├── 📄 test_database.py
│       ├── 📄 test_client.py
│       ├── 📄 test_backup.py
│       ├── 📄 test_sales.py
│       └── 📄 fixtures.py                  # Dados de teste
│
├── 📄 main.js                               # Electron main process
├── 📄 preload.js                            # Electron IPC preload
│
├── 📁 docs/                                 # Documentação
│   ├── 📄 ESTRUTURA_PROJETO.md             # Este arquivo
│   │
│   ├── 📁 architecture/
│   │   └── 📄 ARQUITETURA.md               # Design técnico
│   │
│   ├── 📁 database/
│   │   ├── 📄 SCHEMA.md                    # Schema SQL detalhado
│   │   ├── 📄 MIGRATIONS.md                # Guia de migrations
│   │   └── 📄 QUERIES.md                   # Queries importantes
│   │
│   ├── 📁 guides/
│   │   ├── 📄 USUARIO.md                   # Guia do usuário final
│   │   ├── 📄 DESENVOLVEDORA.md            # Guia de desenvolvimento
│   │   ├── 📄 FAQ.md                       # Perguntas frequentes
│   │   ├── 📄 TROUBLESHOOTING.md           # Solução de problemas
│   │   └── 📄 SETUP_LOCAL.md               # Setup de desenvolvimento
│   │
│   └── 📁 superpowers/plans/
│       ├── 📄 2026-08-19-central-empresarial-phase-1.md
│       ├── 📄 2026-XX-XX-central-empresarial-phase-2.md
│       └── 📄 2026-XX-XX-central-empresarial-phase-3.md
│
├── 📁 dados/                                # Dados de aplicação
│   ├── 📄 empresa.db                       # Banco SQLite principal
│   ├── 📄 .gitignore                       # Ignore dados no git
│   │
│   ├── 📁 configuracoes/
│   │   ├── 📄 sistema.json                 # Configurações do sistema
│   │   ├── 📄 preferencias.json            # Preferências de usuário
│   │   └── 📄 seguranca.dat                # Chaves de criptografia
│   │
│   ├── 📁 documentos/                      # Arquivos arquivados
│   │   ├── 📁 clientes/
│   │   ├── 📁 fornecedores/
│   │   ├── 📁 parceiros/
│   │   ├── 📁 contratos/
│   │   ├── 📁 projetos/
│   │   ├── 📁 propostas/
│   │   ├── 📁 financeiro/
│   │   ├── 📁 impostos/
│   │   └── 📁 cases/
│   │
│   ├── 📁 importacoes/
│   │   ├── 📁 entrada/                     # Arquivos a importar
│   │   ├── 📁 processados/                 # Importados com sucesso
│   │   ├── 📁 pendentes/                   # Aguardando revisão
│   │   └── 📁 rejeitados/                  # Descartados
│   │
│   ├── 📁 exportacoes/
│   │   ├── 📁 csv/
│   │   ├── 📁 planilhas/
│   │   ├── 📁 pdf/
│   │   └── 📁 relatorios/
│   │
│   ├── 📁 backups/
│   │   ├── 📁 diarios/                     # 7 backups mais recentes
│   │   ├── 📁 semanais/                    # 4 backups semanais
│   │   ├── 📁 mensais/                     # 12 backups mensais
│   │   └── 📁 manuais/                     # Backups criados manualmente
│   │
│   └── 📁 logs/
│       ├── 📄 application.log              # Log da aplicação
│       ├── 📄 backend.log                  # Log do backend
│       └── 📄 frontend.log                 # Log do frontend
│
└── 📁 .github/                              # GitHub específico
    ├── 📁 workflows/                        # CI/CD (futuro)
    └── 📄 CONTRIBUTING.md                  # Guia de contribuição
```

---

## 📋 Descrição de Cada Seção

### `frontend/`

**Responsabilidade:** Interface gráfica da aplicação (Electron + React)

**Estrutura:**
```
src/pages/           → Páginas completas
src/components/      → Componentes reutilizáveis
src/services/        → Lógica de comunicação (IPC)
src/hooks/           → React custom hooks
src/styles/          → CSS global
```

**Tecnologias:** React 18+, TypeScript, CSS Modules, Jest

**Importante:** Todos os componentes devem ser funcionais com hooks. Não há classes.

### `backend/`

**Responsabilidade:** Lógica de negócio e persistência (Flask + SQLAlchemy)

**Estrutura:**
```
src/models/          → ORM models (SQLAlchemy)
src/services/        → Serviços de negócio (stateless)
src/api/             → Handlers de IPC
src/utils/           → Utilitários comuns
tests/               → Testes unitários
```

**Tecnologias:** Python 3.11+, Flask, SQLAlchemy, pytest

**Importante:** Serviços são stateless. Cada método recebe suas dependências.

### `dados/`

**Responsabilidade:** Armazenamento de dados do usuário

**Arquivos Críticos:**
```
empresa.db           → Banco SQLite principal (não commitar)
configuracoes/       → Preferências de aplicação
backups/             → Cópias automáticas do banco
logs/                → Arquivos de log
```

**Importante:** Pasta `dados/` não entra no git. Cada usuário tem sua própria cópia.

### `docs/`

**Responsabilidade:** Documentação técnica e de usuário

**Seções:**
```
architecture/        → Design técnico
database/            → Schema e queries
guides/              → Guias práticos
superpowers/plans/   → Roadmaps de implementação
```

**Importante:** Documentação é viva. Atualizar quando arquitetura muda.

---

## 🔄 Fluxo de Desenvolvimento

### Adicionando Nova Funcionalidade

**Exemplo: Adicionar módulo de Parceiros (Fase 4)**

```
1. Especificação
   └── docs/guides/ESPECIFICACAO_PARCEIROS.md

2. Database
   └── Adicionar tabelas em backend/src/models/partners.py
   └── Criar migration em alembic/versions/

3. Backend
   └── Criar backend/src/services/partner_service.py
   └── Adicionar handlers em backend/src/api/ipc.py
   └── Escrever testes em backend/tests/test_partners.py

4. Frontend
   └── Criar pages/Partners.tsx
   └── Criar components/PartnerForm.tsx, PartnerTable.tsx
   └── Adicionar rota em App.tsx
   └── Adicionar menu item no Dashboard.tsx

5. Integração
   └── Testar E2E com npm run dev
   └── Code review
   └── Commit e merge
```

### Estrutura de Branches

```
main                 → Versão estável de produção
├── develop          → Integração de features
│   ├── feature/clients           → Desenvolvimento de features
│   ├── feature/sales
│   ├── bugfix/login-timeout
│   └── refactor/database-indexes
```

### Padrão de Commits

```
feat: adicionar módulo de parceiros
  - Tabelas de partners e comissões
  - CRUD completo
  - Testes unitários

fix: corrigir cálculo de margem em vendas

docs: atualizar arquitetura com novo fluxo

refactor: simplificar serviço de clientes
```

---

## 📊 Organização de Dados

### Arquivo banco.db

**Não fazer download de repositório. Cada máquina tem seu próprio banco.**

```
dados/empresa.db
├── users                        # Usuários do sistema
├── clients                       # Clientes master
├── contacts                      # Contatos
├── timeline_events               # Histórico por cliente
├── opportunities                 # Oportunidades
├── proposals                      # Propostas
├── sales                         # Vendas
├── contracts                     # Contratos
├── financial_accounts            # Contas bancárias
├── accounts_receivable           # Contas a receber
├── accounts_payable              # Contas a pagar
└── ... (40+ tabelas)
```

### Arquivos de Configuração

**sistema.json** — Configurações de aplicação
```json
{
  "empresa": {
    "nome": "Minha Empresa",
    "cnpj": "12.345.678/0001-90",
    "inicio_historico": "2020-01-01"
  },
  "interface": {
    "tema": "light",
    "idioma": "pt-BR"
  }
}
```

**preferencias.json** — Preferências de usuário
```json
{
  "ultimo_login": "2026-08-19T15:30:00Z",
  "autolock_minutes": 15,
  "moeda": "BRL",
  "colunas_visiveis": ["nome", "status", "email"]
}
```

### Backups

**Localização:** `dados/backups/{tipo}/{nome}`

```
dados/backups/
├── diarios/
│   ├── empresa_2026-08-19_0800.db
│   ├── empresa_2026-08-18_1830.db
│   └── ... (últimos 7)
├── semanais/
│   └── empresa_2026-08-19_0000.db (4 mais recentes)
└── mensais/
    └── empresa_2026-08-01_0000.db (12 mais recentes)
```

---

## 🔒 .gitignore

```bash
# Dados locais (nunca commitar)
dados/

# Dependencies
node_modules/
__pycache__/
*.pyc
.venv/

# Build outputs
dist/
build/
frontend/build/

# IDE
.vscode/
.idea/
*.swp
.DS_Store

# Logs
*.log
npm-debug.log

# Environment
.env
.env.local
```

---

## 📦 Dependências Principais

### Frontend
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "vite": "^5.0.0",
  "typescript": "^5.3.0",
  "jest": "^29.7.0"
}
```

### Backend
```
Flask==3.0.0
SQLAlchemy==2.0.23
python-dotenv==1.0.0
cryptography==41.0.7
pytest==7.4.3
bcrypt==4.1.1
```

### Desktop
```json
{
  "electron": "^latest",
  "electron-builder": "^latest"
}
```

---

## 🚀 Deployment

### Build Local
```bash
npm install              # Instala todas as dependências
npm run dev              # Executa em modo desenvolvimento
npm run build            # Cria executáveis
```

### Saída do Build
```
dist/
├── Central-Empresarial-1.0.0.exe       (Windows)
├── Central-Empresarial-1.0.0.dmg       (macOS)
└── Central-Empresarial-1.0.0.AppImage  (Linux)
```

---

## 📚 Convenções

### Nomes de Arquivos

- **TypeScript/React:** `CamelCase.tsx` (ex: `LoginForm.tsx`)
- **Python:** `snake_case.py` (ex: `auth_service.py`)
- **Config:** lowercase-with-dashes.json (ex: `system-config.json`)

### Nomes de Funções/Classes

```python
# Backend (Python)
class ClientService:          # Classes: PascalCase
    def create_client():      # Métodos: snake_case

# Frontend (TypeScript)
function LoginForm():         # Componentes: PascalCase
const handleClick = () => {}  # Handlers: camelCase
```

### Variáveis

```typescript
// Frontend (TypeScript)
const isActive = true;               // Booleans: isX, hasX, canX
const handleSubmit = () => {};       // Event handlers: handleX
const selectedClient = null;         // State: descriptive camelCase

// Backend (Python)
is_active = True                     # Booleans: is_x, has_x
def handle_submit():                 # Functions: snake_case
selected_client = None               # Variables: snake_case
```

---

## ✅ Checklist de Desenvolvimento

Ao adicionar nova funcionalidade:

- [ ] Criar/atualizar especificação em docs/
- [ ] Implementar models SQLAlchemy
- [ ] Implementar serviços (business logic)
- [ ] Escrever testes (>80% coverage)
- [ ] Criar API/IPC handlers
- [ ] Implementar components React
- [ ] Implementar pages React
- [ ] Adicionar rota em App.tsx
- [ ] Adicionar menu item
- [ ] Testar E2E
- [ ] Documentar em CLAUDE.md
- [ ] Code review
- [ ] Commit com mensagem clara

---

*Última atualização: 2026-08-19*  
*Versão: 1.0*
