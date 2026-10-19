# Simples Dental - API Reference

Endpoints capturados da API interna do Simples Dental durante navegação manual.

## Autenticação

### Login
- **POST** `https://api.simplesdental.com/loginmultiplo`
- Retorna token de autenticação para usar em outras requisições

### Verificação
- **GET** `https://api.simplesdental.com/ping/auth`
- Verifica se o token está válido (200 = válido)
- **GET** `https://api.simplesdental.com/context`
- Dados do contexto do usuário logado

## Consultas & Agendamentos

### Listar Consultas (Agenda)
- **GET** `https://api.simplesdental.com/consultas`
  - Parâmetros: `minimal=true`, `startDh`, `endDh`
  - Retorna consultas no período especificado
  
- **GET** `https://api.simplesdental.com/consultas?pageSize=6&pageNumber=1&status=6,5,10,12,7`
  - Lista paginada com filtro de status
  - Status: 6, 5, 10, 12, 7 (diferentes estados de consulta)

### Detalhes da Consulta
- **GET** `https://api.simplesdental.com/consultas/{consultaId}`
  - Retorna dados completos de uma consulta específica

### Compromissos
- **GET** `https://api.simplesdental.com/compromissos?minimal=true&startDh=X&endDh=Y`
  - Compromissos no período

## Pacientes

### Listar Pacientes
- **GET** `https://api.simplesdental.com/pacientesresumidos?pageSize=20&pageNumber=1&orderBy=nome&direction=asc`
  - Lista resumida de pacientes (com busca opcional `q=nome`)

### Detalhes do Paciente
- **GET** `https://api.simplesdental.com/pacientes/{pacienteId}`
  - Parâmetros: `includes=plano,perfil,codigoApp,origem,analiseCredito,indicacaoPaciente`
  - Dados completos do paciente

### Dados de Paciente
- **GET** `https://api.simplesdental.com/pacientes/{pacienteId}/consultas?pageNumber=1&pageSize=5`
  - Histórico de consultas do paciente

- **GET** `https://api.simplesdental.com/pacientes/{pacienteId}/evolucoes?pageSize=8&pageNumber=1&verHtml=true`
  - Evolução clínica do paciente

- **GET** `https://api.simplesdental.com/pacientes/{pacienteId}/evolucoes/ultima`
  - Última evolução registrada

- **GET** `https://api.simplesdental.com/pacientes/{pacienteId}/tratamentos?fields=...&filters=finalizado:eq:false&pageNumber=1&pageSize=20`
  - Tratamentos do paciente (filtro: não finalizados)

- **GET** `https://api.simplesdental.com/pacientes/{pacienteId}/tratamentos/odontograma`
  - Odontograma (mapa dental) do paciente

- **GET** `https://api.simplesdental.com/pacientes/{pacienteId}/orcamentos?pageNumber=1&pageSize=30`
  - Orçamentos do paciente

- **GET** `https://api.simplesdental.com/pacientes/{pacienteId}/recebimentos?pageNumber=1&pageSize=30`
  - Recebimentos/pagamentos do paciente

- **GET** `https://api.simplesdental.com/pacientes/{pacienteId}/mensagens?orderBy=dtEnvio&pageNumber=1&pageSize=1`
  - Mensagens da teledentística

- **GET** `https://api.simplesdental.com/pacientes/{pacienteId}/arquivos?pageSize=20&pageNumber=1`
  - Arquivos/documentos do paciente

- **GET** `https://api.simplesdental.com/pacientes/{pacienteId}/assinaturaspendentes`
  - Assinaturas digitais pendentes

## Financeiro

### Saldos
- **GET** `https://api.simplesdental.com/saldos`
  - Saldos financeiros da clínica

### Recebimentos
- **GET** `https://api.simplesdental.com/lancamentos/{lancamentoId}`
  - Detalhes de um lançamento/recebimento

## Profissionais

### Listar Profissionais
- **GET** `https://api.simplesdental.com/profissionais?pageSize=20&pageNumber=1&atendimento=true`
  - Lista de profissionais que atendem

### Detalhes do Profissional
- **GET** `https://api.simplesdental.com/profissionais/{profissionalId}`
  - Dados do profissional

## Configurações & Dados

### Cadeiras de Atendimento
- **GET** `https://api.simplesdental.com/cadeiras?status=ativas&pageSize=20&pageNumber=1`

### Planos
- **GET** `https://api.simplesdental.com/planos/all`
  - Todos os planos de saúde configurados

### Produtos
- **GET** `https://api.simplesdental.com/produtos?pageNumber=1&pageSize=30&orderBy=nome&direction=asc`

## Dashboard & Relatórios

### Dashboard Principal
- **GET** `https://api.simplesdental.com/dashboard`

### Pacientes no Dashboard
- **GET** `https://api.simplesdental.com/dashboard/pacientes`
- **GET** `https://api.simplesdental.com/dashboard/ver/pacientes?startDh=X&endDh=Y&ver=ANIVERSARIANTES&pageNumber=1&pageSize=40`

### NPS (Satisfação)
- **GET** `https://api.simplesdental.com/dashboard/chart/nps?ano=2026&exibir=mes&mes=9`
- **GET** `https://api.simplesdental.com/dashboard/nps/profissionais?ano=2026&exibir=mes&mes=9&page=1&pageSize=3`

## Alertas & Contagem

### Alertas de Retorno
- **GET** `https://api.simplesdental.com/alertaretorno/count?idPaciente={id}`
  - Conta alertas de retorno para um paciente

- **GET** `https://api.simplesdental.com/alertaretorno/count?startDh=X&endDh=Y`
  - Alertas de retorno no período

### Pacientes com Alerta
- **GET** `https://api.simplesdental.com/pacientes/{pacienteId}/alerta`

### Encaixes
- **GET** `https://api.simplesdental.com/encaixes/count`
  - Contagem de encaixes disponíveis

### Inbox
- **GET** `https://api.simplesdental.com/inbox/recebidas/count`
  - Mensagens recebidas

## Integrações

### Google Agenda
- **GET** `https://api.simplesdental.com/google-agenda/status`

### Link de Agendamento
- **GET** `https://api.simplesdental.com/link-agendamento/obter`

### ASAAS (Pagamentos)
- **GET** `https://api.simplesdental.com/asaas/configuracoes`

### Maquininha (POS)
- **GET** `https://api.simplesdental.com/maquininha/status-integracao`

## Ortodontia (Módulo Específico)

### Agendamentos
- **GET** `https://api.simplesdental.com/ortodontia/agendamentos/emaberto?pageNumber=1&pageSize=5`
- **GET** `https://api.simplesdental.com/ortodontia/agendamentos/sumEmAberto?atrasadas=true`
- **GET** `https://api.simplesdental.com/ortodontia/agendamentos/sumEmAberto?emAberto=true`

### Orçamentos
- **GET** `https://api.simplesdental.com/ortodontia/orcamentos/resumo?exibir=ano&ano=2026&mes=9`

### Pacientes (Ortodontia)
- **GET** `https://api.simplesdental.com/ortodontia/pacientes/resumo?refreshCache=false&year=2026`

## CRM (Oportunidades)

### Pipelines
- **GET** `https://api.simplesdental.com/crm/pipelines`
- **GET** `https://api.simplesdental.com/crm/pipelines/{pipelineId}/stages`

## Outros

### Carteira Digital
- **GET** `https://api.simplesdental.com/carteiradigital/provedores`

### Prótese
- **GET** `https://api.simplesdental.com/protese/cards/list/all?pageNumber=1&pageSize=40`

### Recontratação
- **GET** `https://api.simplesdental.com/recontratacao/anual/4`

### Consultas v2
- **GET** `https://api.simplesdental.com/v2/consultas/rotulos?tag=CONSULTA&pageSize=50&pageNumber=1`

---

## Como Usar

1. **Fazer Login**: `POST /loginmultiplo` com email/senha para obter token
2. **Verificar Auth**: `GET /ping/auth` para confirmar que o token está válido
3. **Listar Dados**: Use os endpoints acima com parâmetros apropriados
4. **Extrair IDs**: De cada resposta, extraia IDs de pacientes, consultas, etc para requisições posteriores

## Padrões Observados

- **Paginação**: `pageNumber`, `pageSize`, `orderBy`, `direction`
- **Filtros de Data**: `startDh` e `endDh` em ISO 8601
- **Inclusões**: Parâmetro `includes=campo1,campo2` para trazer dados relacionados
- **Status**: Consultas têm códigos de status (5, 6, 7, 10, 12, etc)
- **Autenticação**: Usa cookies de sessão (mantidos automáticamente pelo navegador)

---

**Total de endpoints capturados**: 75+  
**Tipos de dados**: Consultas, Pacientes, Financeiro, Dashboard, Integrações, CRM, Ortodontia
