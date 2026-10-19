# Simples Dental RPA - Workflow de Setup & Captura

Documentação completa do processo de configuração, login e captura da API interna do Simples Dental.

## 1. Instalação Inicial

### 1.1 Instalar dependências Node
```bash
cd "/Users/higorplens/Antigravity Software/simples-dental-rpa"
npm install
```

**Dependências instaladas:**
- `playwright@^1.47.0` - Automação de navegador
- `better-sqlite3@^11.3.0` - Banco de dados SQLite
- `dotenv@^16.4.5` - Carregamento de variáveis de ambiente
- `node-fetch@^3.3.2` - Cliente HTTP para chamadas de API

### 1.2 Instalar browsers do Playwright
```bash
npx playwright install chromium
```

**O que faz:** Baixa o Chromium v156.0.8078.4 para automação (aprox. 185MB)

**Saída esperada:**
```
Downloading Chrome for Testing 156.0.8078.4...
Downloading FFmpeg...
Downloading Chrome Headless Shell...
```

---

## 2. Configuração de Credenciais

### 2.1 Criar arquivo `.env`
```bash
cp .env.example .env
```

### 2.2 Editar `.env` com credenciais reais
```env
SIMPLESDENTAL_BASE_URL=https://app.simplesdental.com
SIMPLESDENTAL_EMAIL=contato@avrahamdigital.com.br
SIMPLESDENTAL_PASSWORD=Proposito20*
HEADLESS=false
```

**Importante:** 
- `.env` está no `.gitignore` (nunca versione credenciais)
- `HEADLESS=false` = navegador visível (para captura manual)
- `HEADLESS=true` = modo headless (produção)

---

## 3. Autenticação & Sessão

### 3.1 Fazer primeiro login
```bash
npm run login
```

**O que acontece:**
1. Abre Chromium (se HEADLESS=false)
2. Navega para https://app.simplesdental.com
3. Preenche email e senha do `.env`
4. Clica "Entrar"
5. Salva a sessão em `data/session.json`

**Resultado esperado:**
```
Login ok, sessão salva em data/session.json
```

**Se falhar:**
- Verificar credenciais no `.env`
- Se os seletores estiverem errados, editar `src/auth/login.js`
- Rodar com `HEADLESS=false` para ver o que está acontecendo

### 3.2 Verificar sessão
```bash
ls -lh data/session.json
```

**Arquivo criado:** `data/session.json` (contém cookies + localStorage da sessão)

---

## 4. Captura da API Interna

### 4.1 Script de Captura Manual (Recomendado)
```bash
npm run capture
```

**Arquivo executado:** `scripts/manual-capture.js`

**O que faz:**
1. Abre navegador com sessão logada (HEADLESS=false)
2. Mostra instruções na tela
3. Você navega manualmente:
   - Abra Agenda
   - Clique em agendamentos
   - Abra prontuários de pacientes
   - Acesse diferentes seções (Financeiro, etc)
4. Script intercepta TODAS as chamadas XHR/fetch
5. Salva automaticamente em tempo real:
   - `data/network-capture/*.json` (um arquivo por requisição)
   - `data/simples-dental.db` (tabela `raw_captures`)

**Instruções na tela:**
```
📋 O QUE FAZER:
  1. Abra a Agenda
  2. Clique em um agendamento/paciente
  3. Abra o prontuário
  4. Confirme uma consulta
  5. Navegue pelos menus (Financeiro, Pacientes, etc)

⏹️  QUANDO TERMINAR: Feche o navegador
```

**Saída durante execução:**
```
📡 GET 200 saldos
📡 POST 200 loginmultiplo
📡 GET 200 consultas
📡 GET 200 pacientes
...
```

### 4.2 Script de Auto-Navegação (Alternativa)
```bash
npm run auto-capture
```

**Arquivo executado:** `scripts/auto-capture.js`

**O que faz:**
- Navega automaticamente tentando clicar em elementos
- Menos controlado, pode perder algumas APIs
- Útil se você não puder navegar manualmente

---

## 5. Resultados da Captura

### 5.1 Arquivos Capturados
```bash
ls -lh data/network-capture/ | wc -l
# Resultado: 198 arquivos .json
```

### 5.2 Banco de Dados
```bash
sqlite3 data/simples-dental.db "SELECT COUNT(*) FROM raw_captures;"
# Resultado: 198 registros
```

### 5.3 Listar Endpoints Únicos
```bash
sqlite3 data/simples-dental.db "SELECT DISTINCT url FROM raw_captures WHERE url LIKE '%simplesdental.com/api%' OR url LIKE '%api.simplesdental.com%';"
```

**Endpoints capturados:**
```
GET /consultas
GET /pacientes/{id}
GET /pacientesresumidos
POST /loginmultiplo
GET /ping/auth
GET /dashboard
GET /profissionais
GET /saldos
... (75+ endpoints únicos)
```

---

## 6. Estrutura de Dados Capturados

### 6.1 Exemplo de Arquivo Capturado
```json
{
  "method": "GET",
  "url": "https://api.simplesdental.com/pacientes/26926607",
  "status": 200,
  "request_body": null,
  "response_body": "{\"id\":26926607,\"nome\":\"João Silva\", ...}"
}
```

### 6.2 Exemplo de Query no DB
```bash
sqlite3 data/simples-dental.db
SELECT method, url, status FROM raw_captures LIMIT 5;
```

**Resultado:**
```
GET|https://api.simplesdental.com/consultas|200
POST|https://api.simplesdental.com/loginmultiplo|200
GET|https://api.simplesdental.com/pacientes/26926607|200
GET|https://api.simplesdental.com/saldos|200
GET|https://api.simplesdental.com/dashboard|200
```

---

## 7. Implementação de Ações

### 7.1 Comandos Disponíveis
```bash
npm run help                          # Ver todos os comandos
npm run list-appointments             # Listar agendamentos
npm run list-patients [busca]         # Listar pacientes com filtro
npm run get-patient <patientId>       # Obter dados de um paciente
npm run create-appointment            # (Ainda não implementado)
```

### 7.2 Exemplos de Uso
```bash
# Listar agendamentos da próxima semana
npm run list-appointments

# Buscar pacientes por nome
npm run list-patients "João"

# Obter dados completos de um paciente
npm run get-patient 26926607

# Ver ajuda
npm run help
```

### 7.3 Arquivos de Ações Criados
```
src/actions/
  ├── appointments.js    (listAppointments, getAppointmentById, etc)
  └── patients.js        (listPatients, getPatient, getPatientAppointments, etc)
```

---

## 8. Autenticação & Sessão (Detalhe Técnico)

### 8.1 Como Funciona
1. **Login:** Playwright salva `storageState` (cookies + localStorage) em `data/session.json`
2. **Reutilização:** Próximas execuções carregam a sessão automaticamente
3. **API Calls:** Todas as requisições incluem cookies via header `Cookie`

### 8.2 Ciclo de Vida
```
npm run login
  ↓
Chromium abre → Loga → Salva session.json
  ↓
npm run list-appointments
  ↓
Chromium abre (com session.json) → Já logado → Chama /consultas → Retorna dados
```

### 8.3 Se a Sessão Expirar
```bash
# Refazer o login
npm run login

# Depois rodar o comando novamente
npm run list-appointments
```

---

## 9. Troubleshooting

### Problema: "browserType.launch: Executable doesn't exist"
**Solução:**
```bash
npx playwright install chromium
```

### Problema: "Usuário ou senha inválidos" (401)
**Motivos possíveis:**
- Sessão expirou → rodar `npm run login` novamente
- Credenciais no `.env` estão erradas
- Cookies não foram carregados corretamente

**Solução:**
```bash
rm -f data/session.json
npm run login
```

### Problema: Nenhuma requisição foi capturada
**Checklist:**
- [ ] `.env` está preenchido com credenciais reais
- [ ] Você navegou pela interface (não apenas abrir o navegador)
- [ ] Esperou o script capturar as requisições (vê na tela)
- [ ] Fechou o navegador para finalizar

---

## 10. Próximos Passos

### 10.1 Para Implementar Mais Ações
1. Abrir o arquivo `API-REFERENCE.md`
2. Encontrar o endpoint desejado
3. Implementar função em `src/actions/*.js`
4. Adicionar comando em `src/cli.js`

### 10.2 Para Melhorar a Autenticação
- Atualmente: Login automático via Playwright
- Futuro: Verificar se há API de autenticação (POST /loginmultiplo)

### 10.3 Para Adicionar Persistência
- Atualmente: Dados salvos em SQLite
- Futuro: Sincronizar com banco de dados externo

---

## 11. Estado Atual (2026-10-19)

### ✅ Concluído
- [x] Setup de Playwright e dependências
- [x] Autenticação via Playwright (login automático)
- [x] Captura de 198 requisições de rede
- [x] Documentação de 75+ endpoints da API
- [x] Implementação de ações: listAppointments, listPatients, getPatient
- [x] CLI funcional

### 🔄 Em Progresso
- [ ] Testar todos os comandos em produção
- [ ] Implementar create-appointment (endpoint não identificado)

### 📋 Backlog
- [ ] Testes automatizados
- [ ] Tratamento de erros mais robusto
- [ ] Sincronização com banco de dados externo
- [ ] Webhooks para notificações
- [ ] Interface gráfica (opcional)

---

## 12. Referências Rápidas

### Terminal Commands
```bash
# Setup
npm install
npx playwright install chromium

# Autenticação
npm run login

# Captura
npm run capture                    # Manual (recomendado)
npm run auto-capture              # Automático

# Usar API
npm run help
npm run list-appointments
npm run list-patients "Busca"
npm run get-patient 26926607

# Database
sqlite3 data/simples-dental.db
SELECT * FROM raw_captures LIMIT 10;
```

### Arquivos Importantes
```
.env                      # Credenciais (git-ignored)
data/session.json         # Sessão logada (git-ignored)
data/simples-dental.db    # Banco de dados local (git-ignored)
data/network-capture/     # Requisições capturadas (git-ignored)
API-REFERENCE.md          # Documentação de endpoints
WORKFLOW-SETUP.md         # Este arquivo
src/cli.js                # CLI principal
src/actions/              # Funções de ações (appointments, patients, etc)
scripts/                  # Scripts auxiliares (captura, etc)
```

---

**Última atualização:** 2026-10-19  
**Versão do projeto:** 0.1.0  
**Status:** Pronto para integração
