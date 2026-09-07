# Envio de Mensagens — Workflows Prontos

Workflows para enviar mensagens (texto, mídia, notificações em grupo) com suporte a variação, delay e humanização.

## Workflows Disponíveis

| Workflow | Descrição | Entrada Obrigatória | Saída |
|----------|-----------|-------------------|-------|
| **Enviar Texto (com variacao).json** | Envia mensagem de texto com spintax, variáveis, delay, digitação | `instance_id`, `recipient_jid`, `message_text` | `message_id`, `success`, `timestamp` |
| **Enviar Midia (imagem-video-documento).json** | Envia arquivo (imagem, vídeo, PDF) | `instance_id`, `recipient_jid`, `media_url` | `message_id`, `success` |
| **Enviar Notificacao em Grupo.json** | Envia notificação para todos num grupo | `instance_id`, `group_jid`, `message_text` | `recipients_count`, `success` |

---

## Enviar Texto (com variacao)

**O Motor Principal** — mais flexível, melhor para campanhas personalizadas.

### Entrada (Obrigatória)

```json
{
  "instance_id": "promo-q4",
  "recipient_jid": "5511999999999@c.us",
  "message_text": "Opa {ei|opa}! Desconto de {{ percentual }}% aguardando."
}
```

### Entrada (Opcional)

```json
{
  "delay_min": 2000,           // default: 2000 ms
  "delay_max": 8000,           // default: 8000 ms
  "use_typing": true,          // default: true
  "variables": {
    "percentual": "50",
    "nome": "João"
  }
}
```

### Saída (Sucesso)

```json
{
  "success": true,
  "message_id": "3EB0D6B85FBC5A7E3E33F0E9",
  "message_text_sent": "Opa opa! Desconto de 50% aguardando.",
  "recipient": "5511999999999@c.us",
  "timestamp": "2026-09-07T14:32:00.000Z"
}
```

### Saída (Erro)

```json
{
  "success": false,
  "message_id": "",
  "message": "Erro ao enviar mensagem",
  "status_code": 500
}
```

### Exemplo de Uso Prático

**Caso: Newsletter com personalização**

```json
{
  "instance_id": "newsletter-sep",
  "recipient_jid": "5511999999999@c.us",
  "message_text": "Opa {{ nome }}, novo artigo saiu! {Leia\|Confira\|Veja} em {{ link }}",
  "variables": {
    "nome": "Maria",
    "link": "https://blog.com/artigo-xyz"
  },
  "delay_min": 3000,
  "delay_max": 10000,
  "use_typing": true
}
```

Resultado:
1. Aguarda 3-10s
2. Mostra "está digitando…"
3. Envia: "Opa Maria, novo artigo saiu! Confira em https://blog.com/artigo-xyz"

---

## Enviar Midia (imagem-video-documento)

**Para anexos**: fotos, vídeos, PDFs, etc.

### Entrada Obrigatória

```json
{
  "instance_id": "promo-q4",
  "recipient_jid": "5511999999999@c.us",
  "media_url": "https://example.com/imagem.jpg",
  "caption": "Confira este produto!"
}
```

### Opções de Tipo

```json
{
  "media_type": "image",     // image, video, document (PDF)
  "media_url": "...",
  "caption": "Texto junto com o arquivo"
}
```

### Exemplo

```json
{
  "instance_id": "promo-q4",
  "recipient_jid": "5511999999999@c.us",
  "media_url": "https://cdn.example.com/promo.jpg",
  "media_type": "image",
  "caption": "Promoção exclusiva! 50% OFF hoje 🎉"
}
```

---

## Enviar Notificacao em Grupo

**Para broadcast em um grupo** — envia para todos os membros simultaneamente.

### Entrada Obrigatória

```json
{
  "instance_id": "promo-q4",
  "group_jid": "5511999999999-1234567890@g.us",
  "message_text": "Reunião amanhã às 14h na sala 1!"
}
```

### Entrada Opcional

```json
{
  "use_mention_all": true,    // @todos (se suportado pela API)
  "message_type": "text"      // text, notification
}
```

### Saída (Sucesso)

```json
{
  "success": true,
  "recipients_count": 24,
  "group_jid": "5511999999999-1234567890@g.us",
  "message_text": "Reunião amanhã às 14h na sala 1!"
}
```

---

## Encontrar JID Correto

### Contato Pessoal

Formato: `55AABBCCCCCCCC@c.us` (código de país + DDD + número)

Exemplos:
- Brasil, São Paulo (11), número 9999-9999: `5511999999999@c.us`
- Brasil, Rio (21), número 9999-9999: `5521999999999@c.us`

### Grupo

Formato: `XXXXXX-YYYYYY@g.us`

Como encontrar:
1. Adicione o seu número (que controla a instância) ao grupo
2. Abra o grupo no WhatsApp Web
3. Olhe a URL: `https://web.whatsapp.com/send?phone=<aqui está o JID>`
4. Ou use `Listar Instancias.json` se a API expõe grupos conectados

---

## Boas Práticas

### Rate Limiting (Evitar Bloqueio)

Evolution API usa protocolo web (não oficial). WhatsApp pode bloquear se:
- Enviar muito rápido (< 2s entre mensagens)
- Disparar para muitos contatos consecutivamente
- Mensagens muito similares (spam)

**Solução**:
- Use `delay_min: 2000, delay_max: 8000` (padrão já seguro)
- Para disparo em massa, use `04-Disparo-em-Massa/` que faz batching

### Evitar Mensagens Duplicadas

Se o workflow falhar e você retentá-lo, pode enviar duplicado. Solução:
- Log o `message_id` retornado
- Não reexecute o workflow no mesmo contato com mesma mensagem
- Use a pasta `04-Disparo-em-Massa/` que controla isso automaticamente

### Testar Antes de Massa

Sempre teste `Enviar Texto (com variacao).json` com **um único contato de teste** antes de disparar para 100+:

1. Execute o workflow com seu número
2. Verifique se chegou, com texto correto, delay funcionando
3. Se OK, passe para disparo em massa

---

## Troubleshooting

| Problema | Causa | Solução |
|----------|-------|---------|
| 401 Unauthorized | Credencial não configurada ou expirada | Ver `00-Setup/CREDENCIAIS.md` |
| 400 Bad Request | JID mal formatado ou instance_id errado | Verifique `01-Gestao-de-Instancias/Listar Instancias.json` |
| Mensagem demora para chegar | Delay + digitação + rede | É normal; verifique se chegou em até 30s |
| Instância desconectada | Sessão expirou | Reconecte via `01-Gestao-de-Instancias/Conectar Instancia (QR Code).json` |
| Spintax não funciona | Sintaxe errada | Use `{a\|b\|c}` sem espaços |
| Variável vazia | Chave não encontrada em `variables` | Verifique nome exato |

---

## Próximos Passos

1. ✅ Testou um workflow individual? Pronto!
2. → Quer disparar para múltiplos contatos? Use `04-Disparo-em-Massa/Disparo em Lista com Rotacao.json`

---

**Última atualização**: 2026-09-07
