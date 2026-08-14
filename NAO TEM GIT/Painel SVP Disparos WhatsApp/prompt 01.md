Você é o engenheiro responsável por implementar um sistema SaaS multi-tenant de campanhas de mensageria chamado provisoriamente de “Painel de Campanhas Avraham”.

Leia toda a especificação antes de escrever código. Construa uma aplicação funcional, organizada, segura e preparada para produção. Não implemente apenas telas estáticas.

1. Objetivo

Desenvolver um painel white label no qual diferentes empresas clientes possam criar campanhas de WhatsApp.

A plataforma deverá utilizar a API da Soluciona VIP como fornecedora de mensageria.

Os clientes não podem conhecer, visualizar ou consumir diretamente a API da Soluciona VIP.

O backend da aplicação será responsável por:

Autenticar usuários.

Identificar o tenant do usuário.

Validar campanhas e contatos.

Armazenar campanhas localmente.

Converter os dados para o formato da SVP.

Autenticar na SVP utilizando Basic Auth.

Criar campanhas na SVP.

Armazenar o ID retornado pela SVP.

Sincronizar status e progresso.

Buscar e armazenar relatórios.

Garantir isolamento completo entre tenants.

2. Stack

Utilize:

TypeScript.

Next.js com App Router.

PostgreSQL.

Prisma ORM.

Tailwind CSS.

Componentes acessíveis baseados em shadcn/ui.

Zod para validação.

React Hook Form para formulários.

Autenticação por credenciais com sessões seguras.

Argon2 para senhas.

Redis e BullMQ para processamento em segundo plano.

Storage compatível com S3 para arquivos e mídias.

Vitest para testes unitários.

Playwright para testes end-to-end.

Docker e Docker Compose para ambiente local.

Não fixe versões antigas. Utilize versões estáveis compatíveis entre si.

3. Estrutura da aplicação

Organize o projeto por domínio:

src/
  app/
  components/
  modules/
    auth/
    users/
    tenants/
    campaigns/
    contacts/
    reports/
    audit/
    integrations/
      messaging-provider/
      svp/
  lib/
  server/
    jobs/
    queue/
    storage/
    database/
  types/


Crie uma interface genérica:

interface MessagingProvider {
  createCampaign(
    input: ProviderCampaignInput
  ): Promise<ProviderCampaignCreated>;

  listCampaigns(
    status?: ProviderCampaignStatus
  ): Promise<ProviderCampaign[]>;

  getCampaignReport(
    providerCampaignId: number
  ): Promise<ProviderCampaignReport>;
}


Implemente:

SVPMessagingProvider


Nenhum componente de interface pode chamar a SVP diretamente.

4. Hierarquia de acesso

Implemente:

SUPER_ADMIN
TENANT_ADMIN


Prepare o banco para futuramente receber:

OPERATOR
VIEWER


Regras:

SUPER_ADMIN acessa toda a plataforma.

TENANT_ADMIN acessa somente o próprio tenant.

Todo recurso do cliente deve possuir tenant_id.

O tenant deve ser determinado pela sessão.

Nunca confiar em tenant_id enviado pelo frontend.

Toda consulta deve aplicar escopo de tenant no backend.

Uma tentativa de acessar recurso de outro tenant deve retornar 404, evitando revelar a existência do registro.

5. Banco de dados

Crie models Prisma para:

Tenant
User
Membership
Session
Campaign
CampaignButton
CampaignContact
CampaignMedia
CampaignProviderBinding
CampaignReport
CampaignReportItem
AuditLog
PasswordResetToken


Tenant

Campos:

id
name
slug
document
status
timezone
maxContactsPerCampaign
maxCampaignsPerDay
createdAt
updatedAt


User

Campos:

id
name
email
passwordHash
status
mustChangePassword
lastLoginAt
createdAt
updatedAt


Membership

Campos:

id
userId
tenantId
role
createdAt


Campaign

Campos:

id
tenantId
createdByUserId
name
messageTemplate
scheduledAt
timezone
status
progress
totalContacts
validContacts
invalidContacts
includeOptOut
notes
submittedAt
startedAt
finishedAt
createdAt
updatedAt


CampaignButton

Campos:

id
campaignId
position
label
type
action
createdAt


CampaignContact

Campos:

id
tenantId
campaignId
phone
name
variablesJson
validationStatus
validationError
providerStatus
providerTimestamp
createdAt
updatedAt


CampaignMedia

Campos:

id
campaignId
fileName
mimeType
fileSize
storageKey
checksum
createdAt


CampaignProviderBinding

Campos:

id
campaignId
provider
providerCampaignId
providerStatus
providerProgress
trackingLinksJson
requestPayloadHash
lastSyncedAt
lastError
createdAt
updatedAt


CampaignReport

Campos:

id
tenantId
campaignId
providerCampaignId
rawReportJson
totalRecords
deliveredCount
failedCount
generatedAt
downloadedAt
createdAt
updatedAt


CampaignReportItem

Campos:

id
reportId
phone
status
providerTimestamp
createdAt


AuditLog

Campos:

id
tenantId
userId
action
entityType
entityId
metadataJson
ipAddress
userAgent
createdAt


Crie índices para:

tenantId
campaignId
providerCampaignId
status
scheduledAt
email
phone
createdAt


Crie constraints que evitem duplicidade de vínculo entre campanha local e campanha do provider.

6. Status

Implemente o enum:

DRAFT
VALIDATING
READY
SUBMITTING
AWAITING
PROCESSING
FINISHED
FAILED
SUBMISSION_UNKNOWN
SYNC_ERROR


Mapeie:

aguardando → AWAITING
processando → PROCESSING
finalizado → FINISHED
falha → FAILED


Impeça transições inválidas de status.

Exemplos:

DRAFT → VALIDATING
VALIDATING → READY
READY → SUBMITTING
SUBMITTING → AWAITING
AWAITING → PROCESSING
PROCESSING → FINISHED


7. API da Soluciona VIP

Configurações:

SVP_BASE_URL=
SVP_USERNAME=
SVP_PASSWORD=
SVP_REQUEST_TIMEOUT_MS=30000
SVP_POLL_INTERVAL_SECONDS=60
DATABASE_URL=
REDIS_URL=
S3_ENDPOINT=
S3_BUCKET=
S3_ACCESS_KEY=
S3_SECRET_KEY=
APP_URL=
SESSION_SECRET=


Nunca exponha essas variáveis ao frontend.

Listar campanhas

GET /api/campaigns
Authorization: Basic BASE64(login:senha)


Parâmetro opcional:

status


Resposta:

[
  {
    "id": 1,
    "nome": "Campanha de Teste",
    "status": "finalizado",
    "progress": 100,
    "start_date": "2023-05-15T14:30:00",
    "end_date": "2023-05-15T16:45:00",
    "total_contacts": 150,
    "has_report": true
  }
]


Criar campanha

POST /api/campaigns
Authorization: Basic BASE64(login:senha)
Content-Type: application/json


Payload:

{
  "nome": "Nome da Campanha",
  "mensagem": "Olá {{name}}",
  "contatos": [
    {
      "phone": "5511999999999",
      "name": "João Silva",
      "var1": "cliente_vip"
    }
  ],
  "agendamento": "2026-07-20T14:30:00",
  "midia_base64": "BASE64",
  "midia_nome": "promocao.jpg",
  "botao1_legenda": "Saiba Mais",
  "botao1_tipo": "link",
  "botao1_acao": "https://exemplo.com",
  "botao2_legenda": "Falar com Vendedor",
  "botao2_tipo": "ligacao",
  "botao2_acao": "5511999999999",
  "sair_lista": true,
  "observacoes": "tenant=uuid; campaign=uuid; origin=avraham"
}


Campos obrigatórios:

nome
mensagem
contatos
agendamento


Campos opcionais:

midia_base64
midia_nome
botao1_legenda
botao1_tipo
botao1_acao
botao2_legenda
botao2_tipo
botao2_acao
sair_lista
observacoes


Tipos de botão da SVP:

link
resposta rapida
ligacao


Resposta:

{
  "id": 2,
  "message": "Campanha criada com sucesso",
  "status": "aguardando",
  "tracking_links": {
    "button1": "https://rastreio.exemplo.com/dashboard/abc123",
    "button2": "https://rastreio.exemplo.com/dashboard/def456"
  }
}


Buscar relatório

GET /api/campaigns/{id}/report
Authorization: Basic BASE64(login:senha)


Resposta:

{
  "campaign_id": 1,
  "campaign_name": "Campanha de Teste",
  "report_data": [
    {
      "phone": "5511999999999",
      "status": "entregue",
      "timestamp": "2023-05-15 15:30:22"
    }
  ]
}


8. Cliente HTTP da SVP

Implemente o cliente com:

Basic Auth gerado no servidor.

Timeout configurável.

Schemas Zod para respostas.

Erros tipados.

Logs sanitizados.

Correlation ID.

Métricas de duração.

Redação de senha, Authorization e Base64.

Validação de status HTTP.

Validação do formato do JSON.

Não registre:

senha
authorization
midia_base64
lista completa de contatos


Não implemente repetição automática do POST de criação quando existir dúvida sobre o resultado.

Em caso de timeout após envio:

status = SUBMISSION_UNKNOWN


Crie uma ação administrativa de conciliação manual.

9. Rotas próprias

Implemente:

POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
POST /api/auth/change-password

GET    /api/v1/campaigns
POST   /api/v1/campaigns
GET    /api/v1/campaigns/:id
PATCH  /api/v1/campaigns/:id
DELETE /api/v1/campaigns/:id

POST /api/v1/campaigns/:id/contacts/import
GET  /api/v1/campaigns/:id/contacts
GET  /api/v1/campaigns/:id/contacts/summary

POST /api/v1/campaigns/:id/validate
POST /api/v1/campaigns/:id/submit
POST /api/v1/campaigns/:id/sync

GET /api/v1/campaigns/:id/report
GET /api/v1/campaigns/:id/report/download

GET   /api/v1/users
POST  /api/v1/users
PATCH /api/v1/users/:id

GET   /api/admin/tenants
POST  /api/admin/tenants
GET   /api/admin/tenants/:id
PATCH /api/admin/tenants/:id

GET  /api/admin/campaigns
GET  /api/admin/campaigns/:id
POST /api/admin/campaigns/:id/sync
POST /api/admin/campaigns/:id/reconcile

GET /api/admin/integration/health
GET /api/admin/integration/errors
GET /api/admin/audit-logs


Utilize respostas padronizadas:

{
  "success": true,
  "data": {},
  "request_id": "uuid"
}


Erros:

{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensagem segura para o usuário"
  },
  "request_id": "uuid"
}


10. Importação CSV

Aceite CSV com separador vírgula ou ponto e vírgula.

A coluna phone é obrigatória.

Valide:

Encoding.

Cabeçalho.

Número de linhas.

Telefones vazios.

Caracteres não numéricos.

Comprimento entre 10 e 15 dígitos.

Duplicidades dentro do arquivo.

Linhas completamente vazias.

Variáveis disponíveis.

Limite configurado para o tenant.

Normalize telefones removendo:

+
espaços
parênteses
hífens
pontos


Não adicione automaticamente o código 55.

Armazene colunas extras em variablesJson.

Retorne:

{
  "total_rows": 1500,
  "valid_rows": 1468,
  "invalid_rows": 22,
  "duplicate_rows": 10,
  "available_variables": [
    "name",
    "var1",
    "cidade"
  ]
}


Crie uma tela com prévia das primeiras 20 linhas e opção para baixar os erros.

11. Variáveis da mensagem

Utilize internamente:

{{name}}
{{phone}}
{{var1}}
{{qualquer_coluna}}


Valide que as variáveis utilizadas existem nos dados importados.

Crie uma função isolada:

transformMessageTemplateForProvider()


Por enquanto, mantenha a mesma sintaxe no payload, mas deixe a transformação centralizada para alteração futura.

Inclua comentário técnico informando que a sintaxe final precisa ser confirmada com a SVP.

12. Mídia

Faça upload para storage privado.

Valide:

nome
extensão
MIME type
tamanho
checksum


Não armazene mídia em Base64 no PostgreSQL.

No momento da submissão:

Leia o arquivo do storage.

Converta para Base64.

Monte o payload.

Envie à SVP.

Libere a memória utilizada.

Não registre o Base64 em logs.

Tamanho e formatos máximos devem ser configuráveis por variáveis de ambiente.

13. Worker de sincronização

Crie um worker separado com BullMQ.

Job:

sync-svp-campaigns


Intervalo configurável, com padrão de 60 segundos.

Processamento:

Executar GET /api/campaigns na SVP.

Validar resposta.

Percorrer campanhas retornadas.

Localizar CampaignProviderBinding pelo providerCampaignId.

Atualizar status e progresso.

Ignorar campanhas sem vínculo local.

Registrar campanhas desconhecidas para análise administrativa.

Quando has_report=true e status for finalizado, agendar job de relatório.

Utilizar lock para impedir duas sincronizações simultâneas.

Utilizar backoff em falhas de listagem.

Job adicional:

fetch-svp-campaign-report


Este job deve:

Validar se o relatório já foi baixado.

Consultar a SVP.

Salvar resposta bruta.

Normalizar itens.

Calcular totais.

Atualizar campanha para FINISHED.

Ser idempotente.

14. Telas

Login

Campos:

E-mail
Senha
Entrar


Obrigar troca da senha quando mustChangePassword=true.

Dashboard do cliente

Cards:

Total de campanhas
Aguardando
Processando
Finalizadas
Falhas
Total de contatos


Tabela de campanhas recentes.

Lista de campanhas

Colunas:

Nome
Criada em
Agendada para
Contatos
Status
Progresso
Ações


Filtros:

Busca
Status
Período


Nova campanha

Wizard:

1. Informações
2. Contatos
3. Conteúdo
4. Revisão
5. Confirmação


Detalhes da campanha

Exibir:

Status
Progresso
Agendamento
Total de contatos
Mensagem
Botões
Mídia
Histórico de status
Relatório


Administração

Implementar:

Dashboard geral
Tenants
Usuários
Campanhas
Falhas de integração
Logs


15. Segurança

Implemente:

Cookies HttpOnly.

Cookies Secure em produção.

SameSite adequado.

Proteção CSRF.

Rate limit de login.

Rate limit de criação de campanhas.

Argon2 para senhas.

Senha temporária com troca obrigatória.

Validação Zod no servidor.

Verificação de tenant em todos os serviços.

Sanitização de arquivos.

Limite de upload.

URLs temporárias para arquivos privados.

Auditoria de ações administrativas.

Proteção contra enumeração de usuários.

Mensagens de erro sem detalhes internos.

Exclusão de segredos nos logs.

Headers de segurança.

HTTPS em produção.

Controle de sessão revogável.

16. Auditoria

Registre:

USER_LOGIN
USER_LOGOUT
PASSWORD_CHANGED
TENANT_CREATED
TENANT_UPDATED
TENANT_DISABLED
USER_CREATED
USER_DISABLED
CAMPAIGN_CREATED
CONTACTS_IMPORTED
CAMPAIGN_UPDATED
CAMPAIGN_VALIDATED
CAMPAIGN_SUBMITTED
CAMPAIGN_SYNCED
CAMPAIGN_RECONCILED
REPORT_FETCHED
REPORT_DOWNLOADED


17. Seed

Crie um comando de seed que gere:

Superadministrador
Tenant de demonstração
Administrador do tenant
Campanhas de exemplo
Contatos de exemplo


Não coloque senhas reais no código.

Utilize credenciais de desenvolvimento claramente identificadas e exija alteração no primeiro login.

18. Testes obrigatórios

Crie testes para:

Login válido e inválido.

Troca obrigatória de senha.

Isolamento entre tenants.

Superadministrador acessando todos os tenants.

Importação de CSV válido.

CSV sem coluna phone.

Remoção de contatos duplicados.

Validação de variáveis.

Criação de rascunho.

Bloqueio de edição após submissão.

Montagem do payload SVP.

Mapeamento de status.

Erro de autenticação na SVP.

Timeout durante listagem.

Timeout durante criação.

Não repetição automática de criação.

Sincronização de progresso.

Importação de relatório.

Tentativa de acessar campanha de outro tenant.

Download de relatório em CSV.

Crie um provider falso para testes:

FakeMessagingProvider


Não utilize a API real nos testes automatizados.

19. Documentação

Crie:

README.md
docs/ARCHITECTURE.md
docs/API.md
docs/SVP-INTEGRATION.md
docs/SECURITY.md
docs/DEPLOYMENT.md
.env.example
docker-compose.yml


O README deve explicar:

Como instalar.

Como configurar.

Como executar migrations.

Como rodar seed.

Como iniciar web, worker, Redis e PostgreSQL.

Como rodar testes.

Como configurar a SVP.

Como executar em modo mock.

Como promover para produção.

20. Modo mock

Implemente:

MESSAGING_PROVIDER=mock


E:

MESSAGING_PROVIDER=svp


No modo mock:

Criar campanha retorna ID fictício.

Status evolui de aguardando para processando e finalizado.

Progresso aumenta gradualmente.

Relatório de exemplo é gerado.

Nenhuma chamada externa é realizada.

21. Ordem de execução

Siga esta ordem:

Criar estrutura do projeto.

Configurar Docker Compose.

Modelar banco.

Criar migrations.

Implementar autenticação.

Implementar tenants e permissões.

Implementar campanhas locais.

Implementar importação CSV.

Implementar interface MessagingProvider.

Implementar provider mock.

Implementar provider SVP.

Implementar submissão.

Implementar worker de sincronização.

Implementar relatórios.

Implementar telas administrativas.

Implementar auditoria.

Escrever testes.

Escrever documentação.

Após cada etapa:

Execute lint.

Execute typecheck.

Execute testes relacionados.

Corrija os erros antes de prosseguir.

22. Restrições importantes

Não exponha as credenciais da SVP.

Não chame a SVP pelo browser.

Não utilize respostas da SVP como banco principal.

Não permita acesso cruzado entre tenants.

Não repita automaticamente o POST após timeout indefinido.

Não armazene mídias em Base64 no banco.

Não registre listas completas de contatos.

Não implemente dados simulados na aplicação real, exceto no modo mock.

Não invente endpoints da SVP.

Não implemente cancelamento, edição remota ou webhook sem documentação.

Não fixe limites desconhecidos da SVP.

Não considere o código concluído sem testes de isolamento multi-tenant.

23. Entrega inicial

Antes de implementar tudo, produza:

Resumo da arquitetura.

Estrutura de diretórios.

Diagrama textual do fluxo.

Schema Prisma proposto.

Lista de rotas.

Lista de variáveis de ambiente.

Plano de implementação por etapas.

Depois disso, inicie a implementação sem interromper para solicitar confirmações sobre decisões menores.

Quando alguma informação da SVP estiver ausente:

Crie uma configuração.

Registre a pendência na documentação.

Não invente comportamento do fornecedor.

Mantenha o módulo adaptável.