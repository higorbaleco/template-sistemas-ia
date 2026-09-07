# Disparo em Massa — Automação de Campanhas

Workflows para enviar mensagens para múltiplos contatos/grupos com controle de rate limit, log e retry.

## Workflows Disponíveis

| Workflow | Descrição |
|----------|-----------|
| **Disparo em Lista com Rotacao.json** | Loop sobre CSV/JSON de contatos; envia para cada um com variação e delay |

---

## Disparo em Lista com Rotacao

**A Orquestração Principal** — itera sobre múltiplos contatos, disparando com todas as variações (spintax, variáveis, delay humanizado).

### Entrada Obrigatória

```json
{
  "instance_id": "promo-q4",
  "contacts": [
    {
      "jid": "5511999999999@c.us",
      "nome": "João",
      "percentual": "50"
    },
    {
      "jid": "5521999999999@c.us",
      "nome": "Maria",
      "percentual": "30"
    }
  ],
  "message_template": "Opa {{ nome }}, desconto de {{ percentual }}% esperando! {Aproveita\|Corre que é rápido}!"
}
```

### Entrada Opcional

```json
{
  "batch_size": 5,           // Enviar em lotes de 5 (evita ban)
  "delay_between_batches": 60000,  // 60s entre lotes
  "use_typing": true,        // Simulação de digitação
  "delay_min": 2000,
  "delay_max": 8000,
  "retry_on_fail": true,     // Tentar novamente se falhar
  "max_retries": 2
}
```

### Saída

```json
{
  "total_contacts": 2,
  "sent": 2,
  "failed": 0,
  "skipped": 0,
  "results": [
    {
      "contact": "João",
      "jid": "5511999999999@c.us",
      "success": true,
      "message_id": "3EB0D6B85FBC5A7E3E33F0E9",
      "message_sent": "Opa João, desconto de 50% esperando! Corre que é rápido!",
      "timestamp": "2026-09-07T14:32:00.000Z"
    },
    {
      "contact": "Maria",
      "jid": "5521999999999@c.us",
      "success": true,
      "message_id": "4FC1E7C96GCD6B8F4F44G1F0",
      "message_sent": "Opa Maria, desconto de 30% esperando! Aproveita!",
      "timestamp": "2026-09-07T14:35:00.000Z"
    }
  ]
}
```

---

## Casos de Uso

### 1. Newsletter Semanal Personalizada

**Objetivo**: Enviar artigo novo para 500 contatos com nome e link diferentes.

```json
{
  "instance_id": "newsletter",
  "contacts": [
    { "jid": "55119999@c.us", "nome": "João", "tema": "AI", "link": "https://blog.com/ai-2026" },
    { "jid": "55119998@c.us", "nome": "Maria", "tema": "DevOps", "link": "https://blog.com/devops" },
    ...
  ],
  "message_template": "Opa {{ nome }}, artigo novo sobre {{ tema }}! {{ link }}",
  "batch_size": 10,
  "delay_between_batches": 120000,  // 2 min entre lotes
  "use_typing": true
}
```

**Resultado**: 500 contatos recebem em ~2 horas, cada um com seu tema e link.

### 2. Reativação com Ofertas Diferentes

**Objetivo**: Clientes inativos com desconto progressivo (primeiros 50 desc. 30%, próximos 50 desc. 50%).

```json
{
  "instance_id": "reativacao",
  "contacts": [
    { "jid": "...", "nome": "Cliente 1", "desconto": "30" },
    { "jid": "...", "nome": "Cliente 2", "desconto": "30" },
    { "jid": "...", "nome": "Cliente 51", "desconto": "50" },
    ...
  ],
  "message_template": "{Opa\|E aí} {{ nome }}, voltou? Desconto de {{ desconto }}% só pra você!",
  "batch_size": 5,
  "delay_between_batches": 60000
}
```

### 3. Notificação Urgente (sem Variação)

**Objetivo**: Mantenedora de elevador notificando clientes sobre obra.

```json
{
  "instance_id": "obras",
  "contacts": [
    { "jid": "55119999@c.us", "apto": "1001" },
    { "jid": "55119998@c.us", "apto": "1002" },
    ...
  ],
  "message_template": "Atenção apto {{ apto }}: obra de manutenção amanhã 9h-17h. Peço desculpas!",
  "batch_size": 20,           // Notificação urgente: lotes maiores
  "delay_between_batches": 30000,  // 30s entre lotes
  "use_typing": false         // Sem digitação (urgência)
}
```

---

## Importar Dados de CSV/Excel

**Passo 1**: Prepare um CSV assim:
```csv
jid,nome,percentual,produto
5511999999999@c.us,João,50,Smart TV
5521999999999@c.us,Maria,30,Notebook
```

**Passo 2**: No n8n, use nó **Read Binary File** ou **CSV** → converte em JSON:
```json
[
  { "jid": "5511999999999@c.us", "nome": "João", ... },
  { "jid": "5521999999999@c.us", "nome": "Maria", ... }
]
```

**Passo 3**: Passe como `contacts` para `Disparo em Lista com Rotacao.json`.

---

## Monitoramento & Retry

### Logging Automático

Cada execução gera um log com:
- Total de contatos
- Enviados com sucesso
- Falhados (com erro)
- Pulados (ex: JID inválido)

### Retry Automático

Se `retry_on_fail: true`:
- Contatos que falharam são tentados `max_retries` vezes
- Delay aumenta a cada tentativa (evita sobrecarregar)

### Pausa Manual

Se a execução está muito rápida ou recebendo erros 429 (rate limit):
1. Clique em **Pause** no n8n
2. Aumente `delay_between_batches`
3. Clique em **Resume**

---

## Rate Limiting & Segurança

### Recomendações

| Cenário | batch_size | delay_between_batches |
|---------|--------|-----------------------|
| Newsletter (humanizado) | 5-10 | 60-120s |
| Reativação | 5-20 | 30-60s |
| Notificação urgente | 20-50 | 10-30s |
| Teste/dev | 1-2 | 5s |

### Sinais de Ban

- Erro 429 (Too Many Requests)
- Erro 403 (Forbidden) repentino
- Mensagens não chegando mesmo com sucesso 200

Se isso acontecer:
1. **Pause imediatamente**
2. Aguarde 1-2 horas
3. Reconecte a instância via `01-Gestao-de-Instancias/Conectar Instancia (QR Code).json`
4. Retome com delays maiores

---

## Troubleshooting

| Problema | Causa | Solução |
|----------|-------|---------|
| Alguns contatos falharam, outros OK | JID mal formatado ou instância caiu | Verifique formato de JID; reconecte se necessário |
| Saiu erros 429 no meio | Taxa muito rápida | Aumente `delay_between_batches` para 120s+ |
| Variáveis não injetadas | Chave errada em `contacts` | Verifique nomes das chaves no JSON/CSV |
| Workflow travou em batch | n8n reiniciou ou timeout | Reinicie; considere lotes menores |
| Quero cancelar execução | Precisa parar agora | Clique **Stop execution** no n8n |

---

## Exemplo Completo (End-to-End)

### 1. Preparar dados (CSV ou JSON)

```csv
jid,nome,desconto
5511999999999@c.us,João Silva,50
5521999999999@c.us,Maria Santos,30
```

### 2. Abrir `Disparo em Lista com Rotacao.json`

### 3. Preencher entrada

```json
{
  "instance_id": "promo-q4",
  "contacts": [
    { "jid": "5511999999999@c.us", "nome": "João Silva", "desconto": "50" },
    { "jid": "5521999999999@c.us", "nome": "Maria Santos", "desconto": "30" }
  ],
  "message_template": "Opa {{ nome }}, desconto de {{ desconto }}% {imperdível\|exclusivo}! Aproveita!",
  "batch_size": 2,
  "delay_between_batches": 30000,
  "use_typing": true
}
```

### 4. Executar

Clique **Execute** no n8n.

### 5. Monitorar

Observe a saída em tempo real. Ao final, veja o relatório de `sent` / `failed`.

---

## Próximos Passos (Fase 2)

- [ ] Dashboard de histórico de disparos
- [ ] Webhook para atualizar status de clientes (ex: "entregue", "lido")
- [ ] Retry automático para falhas de rede (sem re-enviar)
- [ ] Integração com Pipedrive (marca como "contatado")

---

**Última atualização**: 2026-09-07
