# Guia do Desenvolvedor — Central Empresarial Local

**Guia completo para desenvolvedores**

---

## 🎯 Começar a Desenvolver

### 1. Setup Inicial (5 min)

```bash
# Clone
git clone https://github.com/seu-repo/central-empresarial.git
cd central-empresarial

# Instale tudo
pip install -r backend/requirements.txt
cd frontend && npm install && cd ..
```

Ver mais em [SETUP_LOCAL.md](./SETUP_LOCAL.md)

### 2. Primeira Execução

```bash
# Terminal 1: Backend
python backend/src/main.py

# Terminal 2: Frontend  
cd frontend && npm run dev
```

App abre em http://localhost:5173

### 3. Faça seu Primeiro Commit

```bash
git checkout -b feature/seu-feature
# ... faça mudanças
git add .
git commit -m "feat: sua descrição"
```

---

## 🏗️ Arquitetura Mental

**Entenda isto primeiro:**

```
React (Frontend)
    ↓ IPC (Electron bridge)
    ↓ Mensagens JSON
    ↓
Flask (Backend)
    ↓ ORM
    ↓
SQLite (Database)
```

**Fluxo de dados:**

```
User clica botão no React
    → IPC: invoke('client:create', {data})
    → Flask recebe em handlers/ipc.py
    → ClientService.create_client(data)
    → SQLAlchemy cria record
    → Return JSON ao frontend
    → React atualiza state
    → Re-render UI
```

Leia [ARQUITETURA.md](../architecture/ARQUITETURA.md) para detalhes.

---

## 📂 Adicionar Nova Funcionalidade

### Exemplo: Adicionar Campo "Segmento" ao Cliente

**1. Database (backend/src/models/client.py)**

```python
class Client(Base):
    # ... campos existentes
    segment_id = Column(String)  # ← Novo campo
```

**2. Service (backend/src/services/client_service.py)**

```python
def create_client(
    type, legal_name, cpf_cnpj,
    segment_id=None  # ← Novo parâmetro
):
    client = Client(
        type=type,
        legal_name=legal_name,
        cpf_cnpj=cpf_cnpj,
        segment_id=segment_id  # ← Usar
    )
    # ... resto do código
```

**3. API Handler (backend/src/api/ipc.py)**

```python
@ipc_handler('client:create')
def handle_create_client(data):
    return ClientService.create_client(
        type=data['type'],
        legal_name=data['legal_name'],
        cpf_cnpj=data['cpf_cnpj'],
        segment_id=data.get('segment_id')  # ← Novo
    )
```

**4. Frontend Form (frontend/src/pages/Clients.tsx)**

```tsx
<input
    type="select"
    name="segment_id"
    placeholder="Segmento"
    value={formData.segment_id}
    onChange={handleChange}
/>
```

**5. Testes (backend/tests/test_client.py)**

```python
def test_create_client_with_segment():
    client = ClientService.create_client(
        type='PJ',
        legal_name='Company',
        cpf_cnpj='12.345.678/0001-90',
        segment_id='TECH'
    )
    assert client.segment_id == 'TECH'
```

**6. Commit**

```bash
git add .
git commit -m "feat: adicionar campo segmento ao cliente"
```

---

## 🧪 Testes

### Backend

```bash
# Todos os testes
pytest backend/tests -v

# Apenas um arquivo
pytest backend/tests/test_client.py -v

# Apenas um teste
pytest backend/tests/test_client.py::test_create_client -v

# Com coverage
pytest backend/tests --cov=backend/src
```

**Exemplo de teste:**

```python
def test_create_client(db_session, monkeypatch):
    """Test creating a client."""
    monkeypatch.setattr("src.services.client_service.SessionLocal", lambda: db_session)
    
    client = ClientService.create_client(
        type='PJ',
        legal_name='Acme Inc',
        cpf_cnpj='12.345.678/0001-90'
    )
    
    assert client.legal_name == 'Acme Inc'
    assert client.type == 'PJ'
```

### Frontend

```bash
# Todos
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

---

## 📝 Convenções de Código

### Python (Backend)

```python
# ✅ Bom
class ClientService:
    @staticmethod
    def create_client(type: str, legal_name: str) -> Client:
        """Create a new client."""
        # Code here

# ❌ Ruim
def create_client(t, ln):  # Sem tipos, nomes ruins
    pass
```

### TypeScript (Frontend)

```tsx
// ✅ Bom
interface Client {
    id: string;
    legalName: string;
    type: 'PF' | 'PJ';
}

function ClientForm() {
    const [clients, setClients] = useState<Client[]>([]);
    // Code
}

// ❌ Ruim
function ClientForm() {
    const [data, setData] = useState([]);  // Sem tipos
}
```

---

## 🔄 Git Workflow

### Criar Feature

```bash
# Crie branch a partir de main
git checkout main
git pull origin main
git checkout -b feature/seu-feature
```

### Commit

```bash
# Use conventional commits
git commit -m "feat: adicionar novo campo"     # Nova feature
git commit -m "fix: corrigir bug de login"     # Bug fix
git commit -m "docs: atualizar README"         # Docs
git commit -m "refactor: simplificar serviço"  # Refactor
git commit -m "test: adicionar testes"         # Tests
```

### Push & PR

```bash
git push origin feature/seu-feature

# Criar PR via CLI
gh pr create --title "Meu PR" --body "Descrição"

# Ou via web interface
# GitHub sugere criar PR automaticamente
```

### Merge

```bash
# Após aprovação
git checkout main
git pull origin main
git merge feature/seu-feature
git push origin main
```

---

## 🐛 Debug

### Backend

```python
# Adicione em seu código:
import pdb; pdb.set_trace()

# Ou use logging:
import logging
logger = logging.getLogger(__name__)
logger.debug(f"Debug: {variable}")
```

### Frontend

```javascript
console.log('Debug:', variable);
debugger;  // Abre DevTools

// DevTools: F12 → Console/Sources
```

### Database

```bash
# Inspeccionar banco
sqlite3 dados/empresa.db

# Ver tabelas
.schema

# Ver dados
SELECT * FROM clients;
```

---

## 📊 Dados de Teste

### Seed Database

```python
# backend/tests/fixtures.py
@pytest.fixture
def test_client(db_session):
    client = Client(
        type='PJ',
        legal_name='Test Company',
        cpf_cnpj='12.345.678/0001-90'
    )
    db_session.add(client)
    db_session.commit()
    return client
```

Uso:
```python
def test_something(test_client):
    # test_client já existe no DB
    assert test_client.legal_name == 'Test Company'
```

---

## 🚀 Deployment

### Build

```bash
npm run build
```

Cria arquivos em:
- `frontend/dist/` — Frontend build
- `dist/Central-Empresarial-*.exe|dmg|AppImage` — Executáveis

### Versionamento

```bash
# Atualizar versão em package.json
# Criar tag git
git tag v0.2.0
git push origin v0.2.0

# Release é criado automaticamente
```

---

## 📚 Estrutura de Pastas

```
central-empresarial/
├── frontend/src/
│   ├── pages/         # Páginas completas
│   ├── components/    # Componentes reutilizáveis
│   ├── services/      # Lógica (IPC, cache)
│   ├── hooks/         # Custom hooks
│   └── styles/        # CSS global
├── backend/src/
│   ├── models/        # ORM Models
│   ├── services/      # Business logic
│   ├── api/           # IPC handlers
│   └── utils/         # Utilitários
├── backend/tests/     # Testes
├── docs/              # Documentação
└── dados/             # Dados
```

Ver [ESTRUTURA_PROJETO.md](../ESTRUTURA_PROJETO.md) para detalhes.

---

## ⚡ Atalhos & Dicas

### VS Code

```
Ctrl+Shift+P     → Command palette
Ctrl+K Ctrl+F    → Format document
F2               → Rename symbol
Ctrl+G           → Go to line
Ctrl+Shift+O     → Outline
```

### npm

```bash
npm install       # Instalar deps
npm run dev       # Iniciar dev
npm test          # Rodar testes
npm run build     # Build produção
npm run lint      # Verificar linting
```

### pytest

```bash
pytest --verbose              # Output verboso
pytest -k "test_name"         # Rodar teste específico
pytest --maxfail=1            # Parar no primeiro erro
pytest --lf                   # Rodar último falhado
```

---

## 🎓 Aprendizagem

### Conceitos Base

1. **IPC (Inter-Process Communication)** — Como Frontend fala com Backend
2. **ORM (Object-Relational Mapping)** — SQLAlchemy mapeia SQL para Python
3. **React Hooks** — useState, useEffect, useContext
4. **State Management** — Context API para compartilhar dados

### Recursos

- [React Docs](https://react.dev)
- [Flask Docs](https://flask.palletsprojects.com)
- [SQLAlchemy Docs](https://docs.sqlalchemy.org)
- [Electron Docs](https://www.electronjs.org/docs)

---

## 🤝 Processo de Review

1. **Crie PR** com descrição clara
2. **Testes passam** — CI testa automaticamente
3. **Code review** — Time revisa
4. **Feedback** — Ajuste conforme pedido
5. **Aprovação** — Merge após aprovação
6. **Deploy** — Tag release cria build

---

## ✅ Checklist Pré-Commit

Antes de fazer commit:

- [ ] Testes passam
- [ ] Código formatado
- [ ] Sem console.log/pprint(debug)
- [ ] Sem arquivos sensíveis (.env)
- [ ] Mensagem de commit clara
- [ ] Sem conflitos de merge

---

*Última atualização: 2026-08-19*  
*Versão: 1.0*
