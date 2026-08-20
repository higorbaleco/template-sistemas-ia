# Setup Local — Ambiente de Desenvolvimento

**Como configurar seu ambiente para desenvolver**

---

## 📋 Pré-requisitos

### Obrigatório
- **Git** — Controle de versão
- **Node.js 18+** — Runtime JavaScript
- **Python 3.11+** — Backend
- **VS Code** — Editor recomendado

### Instalação rápida

**macOS:**
```bash
# Instalar Homebrew (se não tiver)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar dependências
brew install git node python@3.11
```

**Windows:**
```powershell
# Instalar Chocolatey (se não tiver)
# https://chocolatey.org/install

choco install git nodejs python311
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install git nodejs npm python3.11 python3.11-venv
```

---

## 🚀 Clonar & Setup Inicial

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-repo/central-empresarial.git
cd central-empresarial
```

### 2. Instale Dependências

```bash
# Backend
pip install -r backend/requirements.txt

# Frontend
cd frontend
npm install
cd ..
```

### 3. Crie Variáveis de Ambiente

**Arquivo: `.env`**
```bash
FLASK_ENV=development
DEBUG=True
DATABASE_URL=sqlite:///dados/empresa.db
SECRET_KEY=sua-chave-secreta-aqui
```

### 4. Inicialize o Banco

```bash
python backend/src/main.py
# Ctrl+C para parar
```

Database é criado automaticamente em `dados/empresa.db`

---

## 🔧 Desenvolvimento

### Rodar Aplicação Completa

```bash
# Em 2 terminais diferentes:

# Terminal 1 — Backend
python backend/src/main.py

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Aplicação abrirá em http://localhost:5173

### Rodar Testes

```bash
# Todos os testes
npm test

# Apenas backend
pytest backend/tests -v

# Apenas frontend
cd frontend && npm test

# Com coverage
pytest backend/tests --cov=backend/src
```

### Lint & Formatação

```bash
# Backend (Python)
black backend/src
flake8 backend/src

# Frontend (JavaScript)
cd frontend
npm run lint
npm run format
```

---

## 📁 Estrutura de Pastas

```
central-empresarial/
├── frontend/                   # React UI
│   ├── src/pages/
│   ├── src/components/
│   ├── src/services/
│   └── package.json
├── backend/                    # Python Flask
│   ├── src/models/
│   ├── src/services/
│   ├── src/api/
│   ├── tests/
│   └── requirements.txt
├── docs/                       # Documentação
├── dados/                      # Dados locais
│   ├── empresa.db
│   ├── backups/
│   ├── configuracoes/
│   └── logs/
└── CLAUDE.md                   # Guia dev
```

---

## 💻 Editor Setup (VS Code)

### Extensões Recomendadas

```
1. Python (Microsoft)
2. Pylance
3. ES7+ React/Redux/React-Native snippets
4. Prettier
5. ESLint
6. SQLite (alexcvzz)
```

### settings.json

```json
{
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "python.formatting.provider": "black",
  "[python]": {
    "editor.defaultFormatter": "ms-python.python",
    "editor.formatOnSave": true
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  }
}
```

---

## 🧪 Testes

### Executar Testes Backend

```bash
# Todos
pytest backend/tests -v

# Arquivo específico
pytest backend/tests/test_auth.py -v

# Função específica
pytest backend/tests/test_auth.py::test_password_hashing -v

# Com output detalhado
pytest backend/tests -vv -s
```

### Executar Testes Frontend

```bash
cd frontend

# Todos
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Matar Processos Presos

```bash
# macOS/Linux — Encontrar processo na porta 5173
lsof -i :5173
kill -9 PID

# Windows
netstat -ano | findstr :5173
taskkill /PID PID /F
```

---

## 📊 Database Inspection

### SQLite CLI

```bash
# Abrir banco
sqlite3 dados/empresa.db

# Comandos úteis dentro do CLI:
.schema                    # Ver schema
SELECT * FROM clients;     # Ver clientes
.quit                      # Sair
```

### GUI Tool (Recomendado)

Instale **DB Browser for SQLite**:
```bash
# macOS
brew install db-browser-for-sqlite

# Windows
choco install db-browser-for-sqlite

# Linux
sudo apt install sqlitebrowser
```

Depois abra `dados/empresa.db` com a ferramenta GUI.

---

## 🐛 Debugging

### Backend (Python)

```python
# Adicione em seu código:
import pdb; pdb.set_trace()  # Debugger para Python

# Ou use print (mais simples):
print(f"Debug: {variable}")  # Aparece no terminal
```

### Frontend (JavaScript)

```javascript
// No seu código React:
console.log('Debug:', variable);

// Ou debugger nativo:
debugger;  // Abre DevTools quando executar

// DevTools: F12 ou Ctrl+Shift+I
```

### Logs

```bash
# Backend
tail -f dados/logs/application.log
tail -f dados/logs/backend.log

# Frontend (no console do navegador)
# F12 → Console
```

---

## 📦 Dependências

### Frontend (package.json)

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "jest": "^29.7.0"
  }
}
```

### Backend (requirements.txt)

```
Flask==3.0.0
SQLAlchemy==2.0.23
python-dotenv==1.0.0
cryptography==41.0.7
pytest==7.4.3
bcrypt==4.1.1
```

---

## 🔄 Workflow Git

### Criar Feature Branch

```bash
git checkout -b feature/meu-feature
# Faça mudanças...
git add .
git commit -m "feat: descrição curta"
git push origin feature/meu-feature
```

### Abrir Pull Request

```bash
# GitHub CLI
gh pr create --title "Meu PR" --body "Descrição"

# Ou via interface web:
# 1. Push branch
# 2. GitHub sugere criar PR
# 3. Preencha título e descrição
# 4. Submit
```

### Merge PR

```bash
# Após review:
git checkout main
git pull origin main
git merge feature/meu-feature
git push origin main
```

---

## ⚡ Atalhos Úteis

### Bash/Zsh

```bash
# Alias no ~/.bashrc ou ~/.zshrc
alias ce="cd ~/path/to/central-empresarial"
alias ce-test="cd central-empresarial && npm test"
alias ce-dev="cd central-empresarial && npm run dev"
```

### npm Scripts

```bash
npm run dev       # Iniciar desenvolvimento
npm test          # Rodar testes
npm run build     # Build produção
npm run lint      # Verificar linting
npm run format    # Formatar código
```

---

## 🚨 Troubleshooting Setup

### "Module not found"

```bash
# Reinstale dependências
pip install -r backend/requirements.txt --force-reinstall
cd frontend && npm install --force
```

### "Port already in use"

```bash
# Matar processo na porta
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### "Permission denied"

```bash
# Dar permissão ao arquivo
chmod +x backend/src/main.py
chmod +x node_modules/.bin/*
```

### "Python version mismatch"

```bash
python3 --version  # Verifique versão (precisa 3.11+)
which python3      # Veja localização
```

---

## 📚 Recursos Adicionais

- [CLAUDE.md](../../CLAUDE.md) — Guia técnico completo
- [ARQUITETURA.md](../architecture/ARQUITETURA.md) — Design e componentes
- [SCHEMA.md](../database/SCHEMA.md) — Database structure

---

*Última atualização: 2026-08-19*  
*Versão: 1.0*
