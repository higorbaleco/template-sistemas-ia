# Fluxo de Decisão: Quando Estacionar, Quando Reativar

**Árvore de decisão para cada lead**

---

## Matriz de Decisão Pós-Ligação

```
┌─ CONVERSOU? ────────────────┐
│                              │
├─ SIM ────┐                 │
│          │                 │ NÃO
│    TEVE DOR? ──┐            │
│    └─ SIM ──┐  │            │
│             │  │ NÃO        │
│      MARCOU?│  │            │
│      └─ SIM│  │            │
│            │  │            │
│   ┌────────┘  │            │
│   │           │            │
│   ▼           ▼            ▼
│  AGE      NUTRIR         LIXO
│  NDADO   (Espera)      (Nunca)
│
│
└─ "diagnostico_agendado" ou "conversou_com_fit" ou "conversou_sem_fit" ou "tentativa_sem_contato"
```

---

## 4 Status Possíveis

### 1. ✅ AGENDADO (diagnostico_agendado)

**Critérios**:
- [ ] Conversou com alguém
- [ ] Confirmou dor
- [ ] Marcou data/hora específica
- [ ] Confirmou por WhatsApp/telefone

**Próximo passo**: 
- Confirmar 30 min antes (WhatsApp)
- Preparar demo/proposta
- Data retorno: DATA_AGENDADA

**Reativação**: Não reativar, é prioridade 1

---

### 2. 🟡 NUTRIR (conversou_com_fit)

**Critérios**:
- [ ] Conversou com alguém
- [ ] Confirmou dor
- [ ] SEM data definida ("ligue semana que vem" / "após tal período")

**Próximo passo**:
- Follow-up em 3-7 dias
- Tentar agendar demonstração
- Se disser "ligaram", vira "conversou_sem_fit"

**Reativação**: 
- Data: +7 dias
- Ação: Follow-up + tentativa de agendamento

---

### 3. ❌ SEM FIT (conversou_sem_fit)

**Critérios**:
- [ ] Conversou com alguém
- [ ] OU sem dor, OU sem disposição
- [ ] Não faz sentido conversa agora

**Motivos típicos**:
- "Agora não é prioridade"
- "Já temos solução que funciona"
- "Sem dor identificada"
- "Não entendeu o benefício"

**Próximo passo**:
- Arquivar por 30 dias
- Notificar: "Retomar em X data se situação mudou"

**Reativação**:
- Data: +30 dias
- Ação: Ligar de novo com contexto atualizado
- Se novamente "sem fit": arquivar por 90 dias

---

### 4. ❌ TENTATIVA SEM CONTATO (tentativa_sem_contato)

**Critérios**:
- [ ] Ninguém atendeu
- [ ] Recado deixado (se sim)
- [ ] Sem contato real

**Próximo passo**:
- Tentar de novo em horário diferente
- Tentar WhatsApp se tiver número
- Máximo 3 tentativas por semana

**Reativação**:
- Data: +1 dia (próximo horário)
- Tentar 3x antes de abandonar

---

## Árvore Completa com Datas

```
LIGAÇÃO → [CONVERSOU?]
            │
            ├─ NÃO → TENTATIVA_SEM_CONTATO
            │         └─ Retomar: +1 dia (novo horário)
            │         └─ Se 3 tentativas → SEM_FIT
            │
            └─ SIM → [TEVE DOR?]
                      │
                      ├─ NÃO → SEM_FIT
                      │         └─ Retomar: +30 dias
                      │
                      └─ SIM → [MARCOU DATA?]
                                │
                                ├─ NÃO → NUTRIR (COM_FIT)
                                │         └─ Retomar: +7 dias
                                │         └─ Se continua sem marcar: +30 dias → SEM_FIT
                                │
                                └─ SIM → AGENDADO ✅
                                          └─ Prioridade: HOJE
                                          └─ Confirmar: -30 min antes
```

---

## Exemplo: Decisão em 3 Empresas

### Don Boturi Pizzaria
```
✅ Conversou: José (gerente)
✅ Teve dor: "perde 10-15 pedidos/noite"
✅ Marcou: 24/10, 14h

STATUS: "diagnostico_agendado"
AÇÃO: Confirmar seg 13:30
```

### D'Marcos Pizzaria
```
✅ Conversou: Atendente
✅ Teve dor: "fica bagunça em pico"
❌ Marcou: Disse "ligue de novo na semana que vem"

STATUS: "conversou_com_fit"
AÇÃO: Follow-up ter 14:30 (próxima semana)
DATA_RETORNO: 2026-10-22
```

### Casa Velha Pizzaria
```
❌ Conversou: Ninguém atendeu
❌ Recado: Deixou

STATUS: "tentativa_sem_contato"
AÇÃO: Tentar amanhã (hora diferente)
DATA_RETORNO: 2026-10-20
```

---

## Reativação: Tabela

| Status | Retomar em | Ação | Se continua |
|--------|-----------|------|---|
| **agendado** | Data marcada | Confirmar | Marcar novo |
| **com_fit** | +7 dias | Follow-up | +30 dias SEM_FIT |
| **sem_fit** | +30 dias | Ligar de novo | +90 dias LIXO |
| **tentativa** | +1 dia | Novo horário | 3x → SEM_FIT |

---

**Versão**: 1.0 | **Data**: 19/10/2026
