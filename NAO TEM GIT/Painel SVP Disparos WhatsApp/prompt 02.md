Implementação da Fase 1

Fundação multi-tenant com Lovable e Supabase

Implemente agora a Fase 1 do Painel White Label de Mensageria.

Não implemente ainda o fluxo completo de criação de campanhas, importação CSV ou integração real com a SVP. Entretanto, crie o schema necessário para essas fases e deixe a arquitetura preparada.

Objetivo da Fase 1

Entregar uma fundação funcional com:

Supabase Auth.

Perfis.

Tenants.

Memberships.

Papéis globais e por tenant.

Row Level Security.

Proteção de rotas.

Layout administrativo.

Layout do cliente.

Processo de bootstrap.

Provider abstrato.

Provider mock.

Documentação inicial.

1. Inspeção inicial

Antes de editar, analise:

estrutura atual do projeto

sistema de rotas utilizado

cliente Supabase existente

migrations existentes

componentes de interface existentes

estrutura de server functions

configuração de variáveis

autenticação atual, caso exista

Não substitua recursos já funcionais sem necessidade.

Apresente um resumo breve da estratégia e, em seguida, implemente.

2. Banco de dados

Crie migrations para:

profiles
tenants
memberships
platform_roles
campaigns
campaign_buttons
campaign_contacts
campaign_media
campaign_provider_bindings
campaign_reports
campaign_report_items
audit_logs
job_executions
integration_errors


Crie os enums necessários para:

profile_status
tenant_status
membership_status
tenant_role
platform_role
campaign_status
button_type
contact_validation_status
job_status


Valores mínimos:

profile_status:
active
inactive
blocked


tenant_status:
active
inactive
suspended


membership_status:
active
inactive


tenant_role:
TENANT_ADMIN
OPERATOR
VIEWER


platform_role:
SUPER_ADMIN


campaign_status:
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


button_type:
LINK
QUICK_REPLY
CALL


Adicione:

primary keys UUID

foreign keys

índices

unique constraints

created_at

updated_at

triggers de atualização quando apropriado

3. Perfis

A tabela profiles deve utilizar o mesmo UUID de auth.users.

Não crie senha própria.

Campos:

id
full_name
status
must_change_password
last_login_at
created_at
updated_at


Crie uma rotina segura para criação automática do perfil quando um usuário for criado no Supabase Auth.

Não confie em dados públicos de metadata para autorização.

4. Autorização

Crie funções SQL seguras:

is_super_admin()
is_tenant_member(target_tenant_id uuid)
is_tenant_admin(target_tenant_id uuid)
can_access_tenant(target_tenant_id uuid)


Requisitos:

utilizar auth.uid()

usar SECURITY DEFINER apenas quando necessário

configurar search_path

não conceder execução desnecessária

evitar recursão nas policies

retornar falso quando não autenticado

considerar status do perfil, membership e tenant

5. Row Level Security

Ative RLS em todas as tabelas públicas.

Implemente policies para:

profiles

usuário visualiza o próprio perfil

usuário atualiza apenas campos permitidos do próprio perfil

superadministrador visualiza perfis necessários à administração

campos críticos não devem ser alterados diretamente pelo cliente

tenants

membro visualiza o próprio tenant

superadministrador visualiza todos

somente superadministrador cria, ativa, suspende ou desativa tenants

memberships

membro visualiza a própria membership

tenant admin visualiza memberships do próprio tenant

superadministrador visualiza e administra todas

tenant admin não pode se promover a superadministrador

platform_roles

somente superadministrador e operações server-side autorizadas

usuário comum não insere, altera ou remove roles globais

campanhas e tabelas relacionadas

membro acessa somente registros do próprio tenant

tenant admin pode escrever no próprio tenant

vínculos do provider e erros de integração devem ter acesso mais restrito

operações administrativas continuam protegidas no servidor

6. Autenticação e páginas públicas

Implemente:

/login
/forgot-password
/reset-password
/change-password
/access-denied


Requisitos:

login funcional

logout funcional

recuperação de senha

redefinição de senha

mensagens de erro seguras

estado de carregamento

validação de formulário

redirecionamento após login

persistência correta de sessão

7. Troca obrigatória de senha

Quando:

profiles.must_change_password = true


o usuário deverá ser redirecionado para:

/change-password


Enquanto não concluir a troca, não poderá acessar:

/app
/admin


Após a alteração bem-sucedida:

must_change_password = false


Essa atualização deve acontecer por operação server-side autorizada ou mecanismo seguro equivalente.

8. Proteção de rotas

Regras:

SUPER_ADMIN → /admin
TENANT_ADMIN → /app


Um superadministrador poderá acessar áreas administrativas.

Um tenant admin não poderá acessar /admin.

Usuário sem tenant ativo deverá receber uma tela de acesso indisponível.

Usuário ou tenant inativo deverá ser desconectado ou bloqueado.

Não confie apenas em ocultação de menus. Valide o acesso no carregamento da rota e no servidor.

9. Painel administrativo

Crie:

/admin
/admin/tenants
/admin/tenants/new
/admin/tenants/:id
/admin/tenants/:id/users


Funcionalidades mínimas:

listar tenants

buscar tenant

criar tenant

visualizar tenant

ativar tenant

desativar tenant

suspender tenant

criar ou convidar administrador

listar memberships

O processo de criação do tenant deve permitir:

nome da empresa
slug
documento opcional
timezone
limite de contatos por campanha
limite de campanhas por dia


10. Painel do cliente

Crie:

/app
/app/profile
/app/settings


O dashboard inicial poderá exibir estados vazios e indicadores ainda sem dados reais, mas deve utilizar o contexto verdadeiro do tenant autenticado.

Exibir:

nome do tenant

nome do usuário

papel

status da conta

atalhos futuros de campanhas

aviso de modo mock em ambiente de desenvolvimento

Não misture dados administrativos globais com dados do tenant.

11. Bootstrap

Implemente e documente um fluxo seguro para criar o primeiro superadministrador.

Aceitável:

server function protegida por secret

script server-side

convite administrativo controlado

procedimento manual documentado com SQL seguro após criação no Auth

Não coloque senha em migration.

O bootstrap deve criar:

usuário no Supabase Auth
profile ativo
platform_role SUPER_ADMIN
must_change_password true


O mecanismo de bootstrap deverá poder ser desativado após o primeiro uso.

12. Tenant de demonstração

Crie um procedimento de seed ou bootstrap para:

Tenant: Empresa Demonstração
Tenant admin: usuário de demonstração
Membership: TENANT_ADMIN


Não exponha senhas reais no repositório.

Utilize convite ou senha temporária configurada fora do código.

13. Provider

Crie uma estrutura como:

src/lib/messaging-provider/
  types.ts
  interface.ts
  factory.ts
  mock-provider.ts
  svp-provider.ts


O arquivo svp-provider.ts poderá ser um esqueleto tipado nesta fase, sem realizar chamadas reais.

Interface:

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


O factory deve selecionar:

mock
svp


com base em variável privada do ambiente.

14. MockMessagingProvider

Implemente de forma funcional:

criação de campanha fictícia

ID fictício

status fictício

progresso

tracking links

relatório final

possibilidade controlada de simular falha

nenhuma chamada externa

Não conecte ainda o mock às telas de campanha, pois isso pertence à Fase 2. Garanta que o módulo possa ser testado isoladamente.

15. Layout e interface

Crie dois layouts:

AdminLayout
TenantLayout


Inclua:

sidebar

header

identificação do usuário

identificação do tenant

menu conforme papel

logout

responsividade

estado de carregamento

estado vazio

acesso negado

erro inesperado

Não utilize nome, logo ou referência visual da Soluciona VIP.

Utilize identidade neutra ou a identidade atual do projeto.

16. Auditoria inicial

Implemente a estrutura e registre pelo menos:

USER_LOGIN
USER_LOGOUT
PASSWORD_CHANGED
TENANT_CREATED
TENANT_UPDATED
TENANT_STATUS_CHANGED
TENANT_ADMIN_INVITED
MEMBERSHIP_CREATED


Não deixe falhas de auditoria impedirem o login do usuário, mas registre erros internos de maneira segura.

17. Variáveis

Crie ou atualize o arquivo de exemplo:

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MESSAGING_PROVIDER=mock
SVP_BASE_URL=
SVP_USERNAME=
SVP_PASSWORD=
SVP_REQUEST_TIMEOUT_MS=30000
CRON_SECRET=
INTERNAL_JOB_SECRET=
APP_URL=


Garanta que variáveis privadas não sejam importadas em código do cliente.

18. Documentação

Crie ou atualize:

README.md
docs/ARCHITECTURE.md
docs/DATABASE.md
docs/RLS.md
docs/AUTH.md
docs/MESSAGING-PROVIDER.md
docs/ROADMAP.md
.env.example


Documente:

arquitetura

banco

RLS

papéis

bootstrap

variáveis

modo mock

como executar

como validar isolamento

próximas fases

pendências da SVP

19. Validações obrigatórias

Antes de concluir, valide:

usuário não autenticado não acessa áreas internas

tenant admin não acessa admin

membro do tenant A não acessa tenant B

alteração manual de UUID na URL não concede acesso

tenant inativo não opera

perfil inativo não opera

service role não aparece no bundle

nenhuma senha própria foi criada

RLS está habilitada

policies não permitem leitura global acidental

superadministrador consegue criar tenant

tenant admin consegue acessar o próprio painel

troca obrigatória de senha funciona

provider mock funciona isoladamente

migrations podem ser reaplicadas em ambiente limpo

20. Entrega

Ao finalizar, apresente:

Implementado

Liste arquivos, páginas, tabelas, funções e policies.

Migrations

Informe os nomes e a finalidade de cada migration.

RLS

Resuma as policies por tabela.

Bootstrap

Explique exatamente como criar o primeiro superadministrador.

Testes realizados

Informe o que foi testado e os resultados.

Secrets pendentes

Liste tudo que ainda precisa ser configurado.

Limitações

Informe qualquer restrição real encontrada no Lovable ou Supabase.

Próxima fase

Apresente o escopo exato da Fase 2:

CRUD de campanhas

wizard

importação CSV

normalização

variáveis

botões

upload de mídia

revisão

preparação para submissão