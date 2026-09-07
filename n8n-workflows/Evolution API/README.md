# Biblioteca de Automação WhatsApp — Evolution API + n8n

Biblioteca modular de workflows n8n para gerenciar e disparar mensagens WhatsApp via **Evolution API** (gateway não-oficial) com suporte a variações humanizadas: delay aleatório, rotação de copy (spintax), rotação de variáveis e simulação de "digitando…".

## 📋 Índice Rápido

### Setup & Verificação
- **`00-Setup/CREDENCIAIS.md`** — como cadastrar a credencial da Evolution API no n8n
- **`00-Setup/Verificar Conexão Evolution API.json`** — workflow de teste (healthcheck)

### Gestão de Instâncias
Workflows para criar, conectar, listar e gerenciar instâncias WhatsApp na Evolution API:

| Workflow | Descrição |
|----------|-----------|
| `Criar Instancia.json` | Cria nova instância com nome único |
| `Conectar Instancia (QR Code).json` | Gera QR code para conectar ao WhatsApp (scan no celular) |
| `Verificar Status da Instancia.json` | Checa se instância está conectada/online |
| `Listar Instancias.json` | Lista todas as instâncias criadas |
| `Deletar-Logout Instancia.json` | Desconecta e remove instância |

**Quando usar**: Antes de qualquer disparo, certifique-se de ter pelo menos uma instância criada e conectada. Use "Listar Instâncias" para encontrar o nome/ID exato da instância a usar.

### Utilitários (Sub-Workflows)
Lógica reutilizável chamada pelos workflows de envio via `Execute Workflow`:

| Workflow | Descrição |
|----------|-----------|
| `[Util] Delay Aleatorio + Digitando.json` | Delay randomizado + envia presence "composing" (está digitando…) antes de enviar a msg |
| `[Util] Rotacao de Copy (Spintax).json` | Processa variações de texto: `{opa\|opa aí\|e aí}` → escolhe uma aleatoriamente |
| `[Util] Rotacao de Variaveis.json` | Injeta variáveis dinâmicas (nome, produto, link, etc) por contato |

**Quando usar**: Integrados automaticamente nos workflows `03-Envio-de-Mensagens/` — não costuma chamar direto.

### Envio de Mensagens
Workflows prontos para disparar, já com suporte a variação:

| Workflow | Descrição |
|----------|-----------|
| `Enviar Texto (com variacao).json` | Envia mensagem de texto com delay, copy variado e digitando simulado |
| `Enviar Midia (imagem-video-documento).json` | Envia arquivo (imagem, vídeo, documento) |
| `Enviar Notificacao em Grupo.json` | Envia notificação/mensagem para todos num grupo |

**Quando usar**: Para testes pontuais de um contato ou grupo.

### Disparo em Massa
Workflow que itera sobre listas de contatos/grupos:

| Workflow | Descrição |
|----------|-----------|
| `Disparo em Lista com Rotacao.json` | Loop: lê lista (CSV, JSON) e dispara para cada contato/grupo com variação ponta a ponta |

**Quando usar**: Para campanhas de envio em massa (notificações, promoções, reativação).

---

## 🚀 Quick Start

### 1. Importar Workflows no n8n

1. Abra `http://localhost:5678` (n8n local)
2. Clique em **Workflows** → **Import** → **From File**
3. Selecione um arquivo `.json` desta pasta
4. Clique em **Import**

Repita para cada workflow que quiser usar.

### 2. Configurar Credencial Evolution API

Siga **`00-Setup/CREDENCIAIS.md`** — é uma credencial única que todos os workflows usarão.

### 3. Testar Conexão

1. Importe e abra `00-Setup/Verificar Conexão Evolution API.json`
2. Clique em **Test** (ou execute o workflow)
3. Deve retornar 200 OK e listar as instâncias existentes

Se falhar, verifique:
- A credencial está cadastrada corretamente
- A URL da Evolution API está acessível (`https://wpp-avraham.instantcode.com.br`)
- A API key está ativa

### 4. Criar & Conectar uma Instância

1. Importe `01-Gestao-de-Instancias/Criar Instancia.json`
2. Preencha o nome da instância (ex: "promo-q4")
3. Execute e copie o `instance_id` retornado
4. Abra `01-Gestao-de-Instancias/Conectar Instancia (QR Code).json`
5. Cole o `instance_id` e execute
6. Escaneie o QR code com o celular no WhatsApp
7. Use `Verificar Status da Instancia.json` para confirmar "connected"

### 5. Enviar Primeira Mensagem

1. Importe `03-Envio-de-Mensagens/Enviar Texto (com variacao).json`
2. Preencha os campos:
   - `instance_id` (da instância conectada)
   - `recipient_jid` (número no formato `5511999999999@c.us` ou `5511999999999-5511999999999@g.us` para grupo)
   - `message_text` com spintax opcional: `Opa {ei|opa|e aí} de novo!`
3. Execute

---

## 📐 Convenções e Padrões

### Nomenclatura

- **Workflows de ação**: nome no infinitivo (ex: `Criar Instancia.json`)
- **Sub-workflows (utilitários)**: prefixo `[Util]` (ex: `[Util] Delay Aleatorio + Digitando.json`)
- **Workflows de disparo em massa**: prefixo `[DISPARO]` (ex: `[DISPARO] Newsletter Q4.json`)

### Estrutura de Node no n8n

Todos os workflows seguem este padrão:

1. **Trigger**: geralmente um node manual (Play button) ou webhook
2. **Inputs/Validation**: extrai e valida parâmetros
3. **API Calls**: chamadas HTTP para a Evolution API
4. **Executar Sub-Workflows**: via node `Execute Workflow` para reutilizar lógica (delay, spintax)
5. **Output/Resposta**: retorna sucesso/erro e dados relevantes

### Variáveis de Entrada (Input Fields)

Todo workflow aceita parâmetros via:
- **Manual node**: campos de entrada da UI (clique em "Set node output" no n8n)
- **Webhook**: query parameters ou JSON body
- **Execute Workflow**: dados passados do workflow pai

Exemplo no `Enviar Texto (com variacao).json`:

```json
{
  "instance_id": "promo-q4",
  "recipient_jid": "5511999999999@c.us",
  "message_text": "Opa {ei|opa|e aí}! Quer 50% OFF hoje? {{ variavel_customizada }}",
  "delay_min": 2000,
  "delay_max": 8000,
  "use_typing": true
}
```

---

## 🔌 API Evolution: Endpoints Principais

Referência rápida — veja docs completas em `https://wpp-avraham.instantcode.com.br/api-docs` (se disponível):

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/instance/create` | Cria instância |
| `GET` | `/instance/fetchInstances` | Lista instâncias |
| `GET` | `/instance/status/:id` | Status da instância |
| `POST` | `/instance/connect/:id` | Gera QR code para conectar |
| `DELETE` | `/instance/logout/:id` | Desconecta/deleta |
| `POST` | `/message/sendText/:id` | Envia texto |
| `POST` | `/message/sendMedia/:id` | Envia arquivo |
| `PATCH` | `/presence/:id` | Altera status (composing = digitando) |

---

## ⚠️ Notas Importantes

### Risco de Bloqueio

Evolution API usa protocolo web (Baileys), não é a API oficial do WhatsApp. Enviando muitas mensagens muito rápido, sua instância pode ser **bloqueada temporariamente** ou permanentemente pelo WhatsApp. Por isso:

- **Sempre use delays aleatórios** entre mensagens (2-10s é seguro)
- **Respeite intervalos entre contatos** (não dispare para 100 pessoas em 10 segundos)
- **Comece com poucos testes** antes de campanhas em massa
- **Monitore sinais de erro 429** (rate limit) — se receber, pause a campanha

### Reconexão

Instâncias podem desconectar (energia, internet, WhatsApp updatou). No futuro, haverá workflows para **reconectar automaticamente**, mas por enquanto é manual:

1. Chame `Verificar Status da Instancia.json`
2. Se "disconnected", use `Conectar Instancia (QR Code).json` novamente

### Dados Sensíveis

- **Nunca** coloque a API key em comentários, commits ou pastas públicas
- Sempre use a **credencial nativa do n8n** (armazenada no cofre do n8n, não nos JSONs)
- Revisar `.gitignore` para garantir que credenciais não são versionadas

---

## 📚 Próximos Passos

- [ ] Configura credencial (ver `00-Setup/CREDENCIAIS.md`)
- [ ] Testa conexão com healthcheck (`00-Setup/Verificar Conexão Evolution API.json`)
- [ ] Cria primeira instância (`01-Gestao-de-Instancias/Criar Instancia.json`)
- [ ] Conecta instância via QR (`01-Gestao-de-Instancias/Conectar Instancia (QR Code).json`)
- [ ] Envia primeira mensagem (`03-Envio-de-Mensagens/Enviar Texto (com variacao).json`)
- [ ] Lê disparo em massa e adapta para caso de uso (`04-Disparo-em-Massa/Disparo em Lista com Rotacao.json`)

---

**Última atualização**: 2026-09-07  
**Versão**: 1.0 (Fase 1)  
**Status**: Biblioteca modular pronta para uso e extensão
