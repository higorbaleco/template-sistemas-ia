Introdução
A API do Painel SVP permite que você integre nosso sistema de campanhas WhatsApp com suas próprias aplicações. Com ela você pode:

Criar novas campanhas
Listar campanhas existentes
Verificar o status e progresso
Baixar relatórios de campanhas finalizadas
Todas as requisições devem usar autenticação Basic Auth com as mesmas credenciais do painel web.

Autenticação
Todas as requisições à API devem incluir o cabeçalho de autenticação:

Authorization: Basic BASE64(login:senha)
Exemplo: Se seu login é "api_user" e senha "123456", você deve codificar "api_user:123456" em Base64 e enviar no cabeçalho.
Listar Campanhas
Retorna todas as campanhas do usuário autenticado.

Endpoint
GET /api/campaigns
Parâmetros opcionais
status: Filtrar por status (aguardando, processando, finalizado, falha)
Exemplo de resposta
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
Criar Campanha
Cria uma nova campanha de WhatsApp.

Endpoint
POST /api/campaigns
Corpo da requisição (JSON)
{
    "nome": "Nome da Campanha",
    "mensagem": "Olá , seu número é ",
    "contatos": [
        {"phone": "5511999999999", "name": "João Silva", "var1": "valor1"},
        {"phone": "5511888888888", "name": "Maria Souza", "var1": "valor2"}
    ],
    "agendamento": "2023-05-20T14:30:00",
    "botao1_legenda": "Saiba Mais",
    "botao1_tipo": "link",
    "botao1_acao": "https://exemplo.com",
    "sair_lista": true,
    "observacoes": "Campanha de teste via API"
}
Campos obrigatórios
nome: Nome da campanha
mensagem: Texto da mensagem (pode conter variáveis como , , etc)
contatos: Array de objetos com os contatos (deve ter pelo menos o campo "phone")
agendamento: Data e hora de início no formato ISO 8601 (UTC-3)
Campos opcionais
midia_base64: Arquivo de mídia codificado em base64 (opcional)
midia_nome: Nome do arquivo de mídia (obrigatório se midia_base64 for enviado)
botao1_legenda: Legenda do primeiro botão
botao1_tipo: Tipo do primeiro botão (link, resposta rapida, ligacao)
botao1_acao: Ação do primeiro botão (URL, número de telefone ou texto)
botao2_legenda: Legenda do segundo botão
botao2_tipo: Tipo do segundo botão (link, resposta rapida, ligacao)
botao2_acao: Ação do segundo botão (URL, número de telefone ou texto)
sair_lista: Boolean indicando se deve incluir botão "Sair da Lista"
observacoes: Observações sobre a campanha
Exemplo completo de requisição
{
    "nome": "Campanha Completa API",
    "mensagem": "Olá , confira nossa promoção!",
    "contatos": [
        {"phone": "5511999999999", "name": "João Silva", "var1": "cliente_vip"},
        {"phone": "5511888888888", "name": "Maria Souza", "var1": "novo_cliente"}
    ],
    "agendamento": "2023-05-20T14:30:00",
    "midia_base64": "base64_encoded_string_here",
    "midia_nome": "promocao.jpg",
    "botao1_legenda": "Ver Promoção",
    "botao1_tipo": "link",
    "botao1_acao": "https://exemplo.com/promocao",
    "botao2_legenda": "Falar com Vendedor",
    "botao2_tipo": "ligacao",
    "botao2_acao": "5511999999999",
    "sair_lista": true,
    "observacoes": "Campanha de teste com todos os recursos"
}
Tipos de botão
link: Ao clicar no botão é direcionado ao link
resposta rapida: A resposta rápida aparece na conversa ao clicar neste botão
ligacao: Efetua ligação pelo discador do próprio aparelho ao clicar neste botão
Exemplo de resposta
{
    "id": 2,
    "message": "Campanha criada com sucesso",
    "status": "aguardando",
    "tracking_links": {
        "button1": "https://rastreio.exemplo.com/dashboard/abc123",
        "button2": "https://rastreio.exemplo.com/dashboard/def456"
    }
}
Links de Rastreio Automático: Se a API de rastreio estiver configurada por um administrador, os botões do tipo "link" terão suas URLs automaticamente convertidas em links de rastreio.
Baixar Relatório
Retorna os dados do relatório de uma campanha finalizada.

Endpoint
GET /api/campaigns/{id}/report
Exemplo de resposta
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
Exemplos de Código
Python
import requests
from requests.auth import HTTPBasicAuth

# Autenticação
auth = HTTPBasicAuth('seu_login', 'sua_senha')

# Listar campanhas
response = requests.get(
    'http://seusite.com/api/campaigns',
    auth=auth
)
print(response.json())

# Criar campanha
data = {
    "nome": "Campanha API",
    "mensagem": "Olá ",
    "contatos": [{"phone": "5511999999999", "name": "Exemplo"}],
    "agendamento": "2023-05-20T14:30:00"
}
response = requests.post(
    'http://seusite.com/api/campaigns',
    json=data,
    auth=auth
)
print(response.json())
JavaScript (Fetch)
// Codificar credenciais em Base64
const username = 'seu_login';
const password = 'sua_senha';
const auth = btoa(`${username}:${password}`);

// Listar campanhas
fetch('http://seusite.com/api/campaigns', {
    headers: {
        'Authorization': `Basic ${auth}`
    }
})
.then(response => response.json())
.then(data => console.log(data));