# Protocolo: Rejeição e "Não Contatar"

**Como registrar e respeitar quando alguém diz "não contate mais"**

---

## 3 Níveis de Rejeição

### Nível 1: "Não Agora" (Suave)

**O que o cliente diz**:
- "Agora não é prioridade"
- "Ligue em 30 dias"
- "Estamos focando em outro problema"

**O que fazer**:
```json
{
  "status": "conversou_sem_fit",
  "motivo_rejecao": "não é prioridade agora",
  "severidade": "leve",
  "data_retorno": "2026-11-19 (30 dias depois)",
  "acao": "ligar de novo em novembre"
}
```

**Quando reativar**: +30 dias, sem exceção

---

### Nível 2: "Não Agora, Nunca" (Médio)

**O que o cliente diz**:
- "Já resolvemos isso"
- "Não temos interesse"
- "Não faz sentido pro nosso negócio"

**O que fazer**:
```json
{
  "status": "sem_fit_permanente",
  "motivo_rejecao": "já têm solução que funciona",
  "severidade": "média",
  "data_retorno": "2026-12-19 (3 meses depois)",
  "acao": "ligar apenas se situação mudou"
}
```

**Quando reativar**: +90 dias, apenas se souber que mudou

---

### Nível 3: "NUNCA MAIS LIGUE" (Severo)

**O que o cliente diz**:
- "Pare de ligar"
- "Não quero mais contato"
- "Stop, não me perturbe"
- "Vou reportar como spam"

**O que fazer IMEDIATAMENTE**:
```json
{
  "status": "nao_contatar",
  "motivo_rejecao": "cliente pediu explicitamente",
  "severidade": "severa",
  "nao_contatar_nunca": true,
  "data_requisicao": "2026-10-19 14:35",
  "quem_pediu": "José (dono)",
  "data_retorno": "NUNCA",
  "acao": "remover completamente"
}
```

**Quando reativar**: NUNCA. Deletar contato.

**Por que é importante**:
- Lei: LGPD (Brasil), GDPR (Europa), CAN-SPAM (USA)
- Risco: Multa, bloqueio, reputação
- Respeito: Cliente disse "não"

---

## Registrar Corretamente

### Formato JSON

```json
{
  "empresa_id": 6,
  "empresa": "Casa Velha Pizzaria",
  "data_rejecao": "2026-10-20",
  "hora_rejecao": "14:15",
  "pessoa_que_pediu": {
    "nome": "Atendente (não identificado)",
    "cargo": "desconhecido"
  },
  "tipo_rejecao": "nao_contatar",
  "frase_exata": "Pare de ligar, não quero contato",
  "contexto": "Higor tentou ligar pela 2ª vez, atendente foi agressivo",
  
  "acao_tomada": {
    "data": "2026-10-20",
    "remover_banco_dados": true,
    "remover_whatsapp": true,
    "arquivar_ficha": true,
    "registrar_em_nao_contatar": true
  },
  
  "evidencia": {
    "numero_ligacao": "(telefone chamada 1602:35)",
    "registrado_por": "Higor"
  },
  
  "nao_contatar_justificativa": "Respeitar LGPD e privacidade do cliente"
}
```

---

## Checklist: Ao Ouvir "Não Contate"

- [ ] **Ouça exatamente o que disse**: "não contate", "pare de ligar", "spam"?
- [ ] **Anote a frase**: Textual, não interpretação
- [ ] **Registre quem pediu**: Nome, cargo, se possível
- [ ] **Data e hora**: Exatas
- [ ] **Remove HOJE**:
  - [ ] Do banco de prospecção
  - [ ] Das listas de follow-up
  - [ ] Do agenda de ligações
  - [ ] Se tiver WhatsApp na lista, remove também
- [ ] **Marca "nao_contatar": true**
- [ ] **Avisa time**: Ninguém liga mais para este número
- [ ] **Documenta**: Por lei (LGPD)

---

## Exemplo: Casa Velha (Rejeição Severa)

```
REJEIÇÃO REGISTRADA
═══════════════════════════════════════

Empresa: Casa Velha Pizzaria
Data: 20/10/2026, 14:15
Pessoa: Atendente (anônimo)

FRASE EXATA: "Para de ligar, cara. Não quero contato."

AÇÃO:
  ✅ Removida do banco "maringa-pizzarias.json"
  ✅ Removida de "follow-up" agenda
  ✅ Marcada "nao_contatar: true"
  ✅ Documentada com data/hora
  ✅ Aviso: NÃO LIGAR NUNCA MAIS

STATUS: "nao_contatar_severidade_alta"
MOTIVO: Cliente rejeitou explicitamente
RETORNO: NUNCA
```

---

## Tipos de Rejeição x Ações

| Tipo | Gravidade | Ação | Retorno |
|------|-----------|------|---------|
| "Agora não" | 🟢 Baixa | Nutrir | +30 dias |
| "Não entendo" | 🟡 Média | Educação | +7 dias |
| "Já temos" | 🟠 Alta | Arquivar | +90 dias |
| "Não contate" | 🔴 Severa | DELETAR | NUNCA |
| Spam report | 🔴 Crítico | DELETAR + Log | NUNCA |

---

## Conformidade Legal

### Brasil (LGPD)
```
Lei 13.709/2018 - Lei Geral de Proteção de Dados

Artigo 6 (Consentimento):
  "O titular pode revogar consentimento a qualquer momento"

Artigo 17 (Direito de oposição):
  "O titular pode se opor ao tratamento de seus dados"

AÇÃO: Se cliente pede "não contate", é direito dele.
OBRIGAÇÃO: Respeitar imediatamente.
PENALIDADE: R$ 6 mil a R$ 100 mil por violação.
```

### USA (CAN-SPAM)
```
Sender must honor opt-out requests within 10 business days.
Penalty: up to $43,792 per email

AÇÃO: Quando alguém diz "pare", você tem 10 dias.
```

### Europa (GDPR)
```
Article 21 (Right to object):
  "Data subject may object to processing"

Penalty: up to €20,000,000 or 4% global revenue.
```

---

## Quando Pode Reativar (Exceção Rara)

❌ **NÃO reative se cliente disse "não contate"**

✅ **Pode reativar APENAS se**:
1. Cliente contatou você primeiro (novo WhatsApp, email, ligação)
2. Novo contato na empresa (mudou dono, gerente, etc)
3. Cliente explicitamente pediu para ligar ("pode ligar segunda")

```json
{
  "nao_contatar": true,
  "observacao": "Atendente pediu para não ligar, mas se novo gerente chamar, pode reativar"
}
```

---

**Versão**: 1.0 | **Data**: 19/10/2026 | **Importância**: Crítica (legal)
