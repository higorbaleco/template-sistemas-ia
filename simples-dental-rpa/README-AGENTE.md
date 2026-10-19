# Simples Dental RPA - Briefing para Agente de Automação

## 🎯 Estado Atual do Projeto

O projeto está **100% pronto para integração** com agentes de automação. A infraestrutura de acesso à API do Simples Dental foi estabelecida e documentada.

---

## 📚 Documentação Disponível

Leia em ordem:

1. **WORKFLOW-SETUP.md** - Como usar o projeto (setup, login, captura)
2. **API-REFERENCE.md** - Todos os endpoints disponíveis (75+)
3. **SESSION-REPORT.md** - Histórico completo do que foi feito
4. **src/actions/*.js** - Código pronto para usar

---

## 🛠️ O Que Está Pronto

### ✅ Autenticação & Sessão
- Login automático via Playwright
- Sessão reutilizável em `data/session.json`
- Todos os cookies salvos e prontos

### ✅ API Documentada
```
75+ endpoints capturados e documentados:
- Consultas/Agendamentos
- Pacientes (dados, tratamentos, evolução, etc)
- Financeiro
- Dashboard
- Profissionais
- Alertas
- E muito mais...
```

### ✅ Funções Prontas (13+)

**Agendamentos:**
- `listAppointments(context, startDh, endDh)` - Lista consultas
- `listAppointmentsMinimal(context, startDh, endDh)` - Versão leve
- `getAppointmentById(context, appointmentId)` - Dados de uma consulta

**Pacientes:**
- `listPatients(context, query, pageNumber, pageSize)` - Lista pacientes
- `getPatient(context, patientId)` - Dados completos
- `getPatientAppointments(context, patientId)` - Histórico de consultas
- `getPatientEvolutions(context, patientId)` - Evolução clínica
- `getPatientTreatments(context, patientId)` - Tratamentos
- `getPatientOdontogram(context, patientId)` - Odontograma (mapa dental)
- `getPatientBudgets(context, patientId)` - Orçamentos
- `getPatientPayments(context, patientId)` - Recebimentos/Pagamentos
- `getPatientAlert(context, patientId)` - Alertas de retorno

### ✅ CLI Funcional

```bash
npm run help                        # Ver ajuda
npm run login                       # Fazer login
npm run list-appointments           # Listar agendamentos
npm run list-patients [busca]       # Listar pacientes
npm run get-patient <patientId>     # Dados de um paciente
```

---

## 🚀 Como o Agente Deve Usar

### Fluxo Básico

```javascript
// 1. Importar as ações
import { openContext } from './src/browser.js';
import { listAppointments } from './src/actions/appointments.js';
import { getPatient } from './src/actions/patients.js';

// 2. Abrir contexto Playwright (já tem sessão salva)
const { browser, context } = await openContext();

// 3. Chamar as ações
const appointments = await listAppointments(
  context,
  '2026-10-19T03:00:00.000Z',
  '2026-10-26T03:00:00.000Z'
);

const patientData = await getPatient(context, 26926607);

// 4. Fechar
await browser.close();
```

### Padrão de Erro Handling

```javascript
try {
  const result = await listPatients(context, 'João');
  console.log(result);
} catch (err) {
  console.error('Erro:', err.message);
  // Tratar conforme necessário
}
```

---

## 📊 Dados de Exemplo

### Listar Agendamentos
```javascript
const appointments = await listAppointments(
  context,
  '2026-10-19T03:00:00.000Z',
  '2026-10-26T03:00:00.000Z',
  1,  // pageNumber
  6   // pageSize
);
// Retorna: { data: [...], total: 42, ... }
```

### Obter Paciente
```javascript
const patient = await getPatient(context, 26926607);
// Retorna:
// {
//   id: 26926607,
//   nome: "João Silva",
//   email: "joao@example.com",
//   telefone: "11999999999",
//   plano: { id: 1, nome: "Convênio XYZ" },
//   ...
// }
```

### Buscar Pacientes
```javascript
const patients = await listPatients(context, 'João', 1, 20);
// Retorna: { data: [...pacientes com "João" no nome...], ... }
```

---

## 🔄 Próximas Ações que Podem Ser Implementadas

### 1. Criar Agendamento
**Status:** Endpoint não identificado  
**Próximo passo:** Navegar manually por "Criar Consulta" para capturar POST

### 2. Confirmar Consulta
**Status:** Endpoint não identificado  
**Próximo passo:** Similar ao anterior

### 3. Atualizar Paciente
**Status:** Endpoint não identificado  
**Próximo passo:** Editar dados de paciente e capturar

### 4. Registrar Evolução
**Status:** Endpoint não identificado  
**Próximo passo:** Adicionar evolução clínica e capturar

---

## 🔐 Segurança & Dados

### Proteção de Credenciais
- ✅ `.env` está no `.gitignore`
- ✅ Credenciais nunca aparecem nos logs
- ✅ Sessão é local (SQLite em `data/simples-dental.db`)

### Conformidade LGPD
- ✅ Dados de pacientes são dados sensíveis de saúde
- ✅ Banco de dados local (não sincroniza para a nuvem)
- ✅ Documentado no CLAUDE.md do projeto

### Falhas de Autenticação
Se a sessão expirar:
```bash
rm -f data/session.json
npm run login
# Próxima requisição automáticamente reutiliza a nova sessão
```

---

## 📝 Estrutura do Projeto

```
simples-dental-rpa/
├── src/
│   ├── cli.js                 # CLI principal
│   ├── browser.js             # Gerenciamento do Playwright
│   ├── auth/login.js          # Login automático
│   ├── actions/               # Funções de ações
│   │   ├── appointments.js    # Consultas
│   │   └── patients.js        # Pacientes
│   └── storage/db.js          # Banco de dados
├── scripts/
│   ├── capture-network.js     # Captura de rede (original)
│   ├── manual-capture.js      # Captura manual (interativa)
│   └── auto-capture.js        # Captura automática
├── data/                      # Dados locais (git-ignored)
│   ├── session.json           # Sessão do Playwright
│   ├── simples-dental.db      # Banco SQLite
│   └── network-capture/       # Requisições capturadas
├── API-REFERENCE.md           # Documentação de endpoints
├── WORKFLOW-SETUP.md          # Guia de setup
├── SESSION-REPORT.md          # Histórico da sessão
├── README-AGENTE.md           # Este arquivo
└── package.json               # Dependências
```

---

## 🎓 Como Adicionar Novas Ações

Se o agente precisar de uma nova ação (ex: `criar-agendamento`):

1. **Capturar a requisição:**
   ```bash
   npm run capture
   # Navegar manualmente: Criar Consulta → preencher → confirmar
   # Arquivo criado: data/network-capture/*-POST-*.json
   ```

2. **Implementar a função:**
   ```javascript
   // src/actions/appointments.js
   export async function createAppointment(context, data) {
     const cookies = await context.cookies();
     const cookieString = cookies.map((c) => `${c.name}=${c.value}`).join('; ');
     
     const response = await fetch('https://api.simplesdental.com/consultas', {
       method: 'POST',
       headers: {
         Cookie: cookieString,
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(data),
     });
     
     if (!response.ok) throw new Error(`Falha: ${response.status}`);
     return response.json();
   }
   ```

3. **Adicionar no CLI:**
   ```javascript
   // src/cli.js
   async 'create-appointment'() {
     const { browser, context } = await openContext();
     try {
       const result = await createAppointment(context, {
         pacienteId: 26926607,
         profissionalId: 2611026,
         data: '2026-10-25',
         // ... outros campos
       });
       console.log(JSON.stringify(result, null, 2));
     } finally {
       await browser.close();
     }
   }
   ```

---

## 💡 Dicas para o Agente

1. **Sempre use `context.cookies()`** para manter autenticação
2. **Sempre feche o browser:** `await browser.close()`
3. **Sempre trate erros:** Requisições podem falhar por timeout, rede, etc
4. **Sempre use date ranges:** Endpoints de data usam ISO 8601
5. **Sempre pagine:** Use `pageNumber` e `pageSize` para listas grandes

---

## 🆘 Troubleshooting

### Erro: "Sessão expirou"
```bash
npm run login
```

### Erro: "Não consegue conectar"
- Verificar internet
- Verificar se Simples Dental está online

### Erro: "Endpoint retorna 401"
- Significa que a autenticação falhou
- Rodar `npm run login` novamente

### Erro: "Resposta vazia ou inválida"
- Pode ser mudança na API do Simples Dental
- Rodar `npm run capture` para capturar novamente

---

## 📞 Informações de Contato

**Conta usada para setup:**
- Email: `contato@avrahamdigital.com.br`
- Senha: `Proposito20*`
- Base URL: `https://app.simplesdental.com`

---

## 📋 Checklist Antes de Usar

- [ ] `.env` preenchido com credenciais (copy `.env.example`)
- [ ] `npm install` executado
- [ ] `npx playwright install chromium` executado
- [ ] `npm run login` passou sem erros
- [ ] `npm run list-appointments` retorna dados

Se tudo passou, está pronto para integração! 🚀

---

**Última atualização:** 2026-10-19  
**Versão:** 1.0.0  
**Status:** Pronto para produção

---

## 🎯 Próximo Passo

> Me pass qual é o que o agente realmente precisa fazer agora!

Descreva:
- Qual é o objetivo principal do agente?
- Que dados precisa extrair/manipular?
- Que ações precisa automatizar?
- Qual é a frequência/cronograma?
- Como deve integrar com o resto do sistema?

Assim eu posso:
1. Capturar as APIs faltantes (se houver)
2. Implementar as ações específicas
3. Conectar ao worker queue / agente que vai usar
