# Utilitários — Sub-Workflows Reutilizáveis

Workflows pequenos que encapsulam lógica comum, chamados por workflows maiores via nó **Execute Workflow**.

## Workflows Disponíveis

| Workflow | O Que Faz | Entrada | Saída |
|----------|----------|---------|-------|
| **[Util] Delay Aleatorio + Digitando.json** | Aguarda tempo aleatório + simula digitação (presence: composing) | `instance_id`, `recipient_jid`, `delay_min`, `delay_max`, `use_typing` | `ready_to_send: true` |
| **[Util] Rotacao de Copy (Spintax).json** | Resolve spintax {opção1\|opção2} para aleatoriedade de texto | `message_text` | `message_text` (resolvido) |
| **[Util] Rotacao de Variaveis.json** | Injeta variáveis {{ var }} no texto | `message_text`, `variables` (JSON) | `message_text` (com variáveis injetadas) |

---

## Como Funcionam

### [Util] Delay Aleatorio + Digitando

**Objetivo**: Humanizar o comportamento da instância antes de enviar mensagem.

**Fluxo**:
1. Recebe `delay_min` e `delay_max` (em ms)
2. Calcula delay aleatório entre os dois valores
3. Aguarda esse tempo
4. Se `use_typing=true`:
   - Envia PATCH `/presence` com "composing" (mostra "está digitando…")
   - Aguarda ~60% do tempo de delay
   - Envia PATCH `/presence` com "paused"
5. Retorna `ready_to_send: true`

**Exemplo**:
```json
{
  "instance_id": "promo-q4",
  "recipient_jid": "5511999999999@c.us",
  "delay_min": 2000,
  "delay_max": 8000,
  "use_typing": true
}
```
Resultado: aguarda 2-8s, mostra "digitando" por ~1.5s, então retorna controle.

---

### [Util] Rotacao de Copy (Spintax)

**Objetivo**: Criar variação de texto randomicamente.

**Sintaxe**:
```
{opção1|opção2|opção3}
```

**Exemplos**:
- `"Opa {ei|opa|e aí}!"` → `"Opa ei!"` ou `"Opa opa!"` ou `"Opa e aí!"`
- `"Desconto {imperdível|exclusivo|limitado}!"` → um dos três

**Suporta aninhamento limitado:**
```
"Opa {ei|opa}, {como vai|tudo bem}?" → "Opa ei, tudo bem?" etc.
```

**Entrada**:
```json
{
  "message_text": "Opa {ei|opa|e aí}! Desconto de {30|50|70}% esperando!"
}
```

**Saída**:
```json
{
  "message_text": "Opa opa! Desconto de 50% esperando!"
}
```

---

### [Util] Rotacao de Variaveis

**Objetivo**: Personalizar mensagem com dados dinâmicos (nome, link, percentual, etc).

**Sintaxe**:
```
{{ variable_name }}
```

**Exemplo**:
```json
{
  "message_text": "Opa {{ nome }}, desconto de {{ percentual }}% em {{ produto }}!",
  "variables": {
    "nome": "João",
    "percentual": "50",
    "produto": "Smart TV"
  }
}
```

**Resultado**:
```
"Opa João, desconto de 50% em Smart TV!"
```

---

## Usando em Workflows Maiores

No n8n, você chama um sub-workflow via nó **Execute Workflow**:

1. Adicione um nó **Execute Workflow**
2. Selecione o sub-workflow (ex: `[Util] Delay Aleatorio + Digitando.json`)
3. Mapeie os inputs do nó anterior
4. O retorno fica disponível como `$node.["nome-do-nó"].json`

**Exemplo de fluxo em `03-Envio-de-Mensagens/Enviar Texto`**:
```
Extrair Parâmetros
  ↓
Resolver Spintax (Code node)
  ↓
Injetar Variáveis (Code node)
  ↓
Aguardar Delay Aleatório (Wait node)
  ↓
POST /message/sendText
  ↓
Output Final
```

---

## Combinações Comuns

### 1. Envio com Variação Máxima
```
Spintax → Variáveis → Delay → Envio
```
Resultado: texto completamente aleatório e personalizado + humanizado

### 2. Disparo Humanizado
```
Delay → Envio
```
Resultado: apenas delay + digitação, sem variação (copiar-colar de template fixo)

### 3. Personalização sem Delay
```
Variáveis → Envio (imediato)
```
Resultado: dados injetados, sem espera (automação pura, menos humana)

---

## Performance

Cada sub-workflow tem um pequeno overhead de inicialização. Para disparos em massa:
- **Se precisa de variação**: use os utilitários (vale a pena)
- **Se a mensagem é idêntica**: copie a lógica inline no workflow principal (mais rápido)

---

## Troubleshooting

| Problema | Causa | Solução |
|----------|-------|---------|
| Spintax não resolve | Sintaxe errada: `{ a \| b }` com espaços | Use `{a\|b}` (sem espaços) |
| Variável não injeta | {{ var }} não encontrada em `variables` | Verifique o nome exato da chave |
| Delay muito longo | `delay_max` muito grande | Reduza para 5000-10000 ms |

---

**Última atualização**: 2026-09-07
