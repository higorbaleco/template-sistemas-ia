# 🚀 Primeiros Passos — Evolution API + n8n

Guia rápido para começar a usar a biblioteca de automação WhatsApp em 5 minutos.

---

## 0️⃣ Pré-Requisitos

- ✅ n8n rodando localmente: `http://localhost:5678`
- ✅ Evolution API acessível: `https://wpp-avraham.instantcode.com.br`
- ✅ API Key da Evolution: `w1tNrBnMiunsN24` (já cadastrada em algum lugar seguro)
- ✅ Um celular com WhatsApp instalado

---

## 1️⃣ Configurar Credencial (2 min)

### No n8n

1. Abra `http://localhost:5678`
2. Clique em **Credentials** (🔑 no menu esquerdo)
3. Clique em **+ New** / **Create New**
4. Procure por **"Header Auth"** → Selecione → **Create**
5. Preencha:
   - **Name**: `Evolution API`
   - **Header Name**: `apikey`
   - **Header Value**: `w1tNrBnMiunsN24`
6. Clique **Save**

✅ **Credencial criada e reutilizável em todos os workflows!**

---

## 2️⃣ Testar Conexão (1 min)

### Importar Healthcheck

1. No n8n, clique em **Workflows** → **Import** → **From File**
2. Selecione: `Evolution API/00-Setup/Verificar Conexão Evolution API.json`
3. Clique **Import**
4. Abra o workflow importado
5. Clique no nó **GET /instance/fetchInstances**
6. Lado direito: selecione credencial → **Evolution API**
7. Clique **Test** (play button) ou execute o workflow

**Resultado esperado**: Status 200, lista de instâncias (pode estar vazia).

❌ Se receber erro 401: verifique credencial (volte ao passo 1)

---

## 3️⃣ Criar & Conectar Instância (5 min)

### Criar

1. Importe: `Evolution API/01-Gestao-de-Instancias/Criar Instancia.json`
2. Abra e execute
3. (Opcional) Passe `instance_name`: `"promo-q4"` se quiser nome customizado
4. Execute → **Copie o `instance_id` da resposta**

Exemplo de resposta:
```json
{
  "success": true,
  "instance_id": "abc123def456",
  "instance_name": "promo-q4"
}
```

### Conectar via QR Code

1. Importe: `Evolution API/01-Gestao-de-Instancias/Conectar Instancia (QR Code).json`
2. Passe o `instance_id` que você copiou
3. Execute
4. Copie o `qr_code` (ou `base64` da resposta) e decodifique/escaneie:
   - Se recebeu string QR legível, copie em qualquer gerador de QR (https://qr-server.com/)
   - Se recebeu base64, decodifique e visualize
5. **Abra WhatsApp no celular** e escaneie o código
6. Confirme a conexão

### Verificar Status

1. Importe: `Evolution API/01-Gestao-de-Instancias/Verificar Status da Instancia.json`
2. Passe o `instance_id`
3. Execute → deve retornar `status: "connected"`

✅ **Instância criada e conectada!**

---

## 4️⃣ Enviar Primeira Mensagem (3 min)

### Preparar Dados

Você precisa:
- **instance_id**: o que copiou acima (ex: `abc123def456`)
- **seu_numero_completo**: com DDD, formato `55AABBCCCCCCC@c.us` (ex: `5511999999999@c.us`)

Para descobrir seu número no formato WhatsApp:
1. Abra WhatsApp Web no navegador
2. Inspecione a URL: `https://web.whatsapp.com/send?phone=55XXXXXX`
3. Copie a parte `55XXXXXX` (tira os zeros à esquerda do DDD/número)
4. Adicione `@c.us` → `5511999999999@c.us`

### Enviar Mensagem Simples

1. Importe: `Evolution API/03-Envio-de-Mensagens/Enviar Texto (com variacao).json`
2. Execute com entrada:
```json
{
  "instance_id": "abc123def456",
  "recipient_jid": "5511999999999@c.us",
  "message_text": "Opa! Primeira mensagem via automação! 🎉"
}
```
3. Execute → deve chegar no seu próprio número em poucos segundos

✅ **Primeira mensagem enviada!**

---

## 5️⃣ Explorar Variações (Bônus)

### Com Spintax (cópia aleatória)

```json
{
  "instance_id": "abc123def456",
  "recipient_jid": "5511999999999@c.us",
  "message_text": "Opa {ei|opa|e aí}! {Tudo bem\|Como vai}? 🎉"
}
```
Cada execução escolhe uma combinação aleatória.

### Com Variáveis (personalização)

```json
{
  "instance_id": "abc123def456",
  "recipient_jid": "5511999999999@c.us",
  "message_text": "Opa {{ nome }}, desconto de {{ percentual }}% só pra você!",
  "variables": {
    "nome": "João",
    "percentual": "50"
  }
}
```

### Com Delay + Digitação (humanização)

```json
{
  "instance_id": "abc123def456",
  "recipient_jid": "5511999999999@c.us",
  "message_text": "Opa! Aguardei um pouco antes de enviar 😉",
  "delay_min": 3000,
  "delay_max": 10000,
  "use_typing": true
}
```
Aguarda 3-10s, mostra "está digitando…", depois envia.

---

## 📚 Próximas Leituras

Agora que funciona, explore:

1. **`README.md`** (nesta pasta) — visão completa da biblioteca
2. **`01-Gestao-de-Instancias/README.md`** — listar/verificar/deletar instâncias
3. **`02-Utilitarios/README.md`** — como funcionam spintax, delay, variáveis
4. **`03-Envio-de-Mensagens/README.md`** — enviar texto, mídia, notificações em grupo
5. **`04-Disparo-em-Massa/README.md`** — disparar para 100+ contatos com segurança

---

## ⚠️ Avisos Importantes

### Rate Limiting

Evolution API usa protocolo web (não oficial). Se enviar muito rápido:
- Instância pode desconectar (reconecte com QR code)
- Número pode ser bloqueado temporariamente
- Solução: use `delay_min: 2000, delay_max: 8000` (padrão já seguro)

### Uma Instância = Um Número

Cada instância que você cria se conecta a **um número WhatsApp**. Se quiser disparar de múltiplos números, crie múltiplas instâncias.

### Credencial Segura

A API key **nunca** aparece nos arquivos JSON. Fica guardada no cofre do n8n. Mesmo assim:
- Não compartilhe a key publicamente
- Se vazar, gere uma nova chave e atualize a credencial

---

## 🆘 Troubleshooting Rápido

| Erro | Solução |
|------|---------|
| **401 Unauthorized** | Credencial não selecionada ou chave errada → volte ao passo 1 |
| **QR não scanneia** | Tente de novo; escaneie com câmera apontada ao código |
| **Mensagem não chega** | Verifique se instância está "connected"; reconecte se necessário |
| **Demora para chegar** | Normal com delay+digitação; espere até 30s |
| **Spintax não funciona** | Verifique sintaxe: `{a\|b}` sem espaços |

---

## 🎯 Checklist para Go

- [ ] Credencial configurada e testada (passo 1)
- [ ] Healthcheck retorna 200 (passo 2)
- [ ] Instância criada e conectada (passo 3)
- [ ] Primeira mensagem chegou (passo 4)
- [ ] Testou spintax/variáveis/delay (passo 5)
- [ ] Leu os READMEs das pastas 01-04
- [ ] Pronto para disparos em massa! 🚀

---

**Precisa de ajuda?** Consulte os arquivos `.md` específicos em cada pasta ou revise os workflows `.json` (estão bem comentados).

**Última atualização**: 2026-09-07
