# Processo: Qualificação ao Vivo (Etapa D)

**Como registrar e qualificar uma conversa depois que Higor liga**

---

## Quando Usar Este Processo

Depois que Higor:
- ✅ Conseguiu falar com a empresa
- ✅ Teve conversa (não só "deixe recado")
- ✅ Perguntou sobre a operação
- ✅ Conversou com decisor (ou alguém que influencia decisão)

---

## 4 Dimensões de Qualificação

### 1. VOLUME
**O que perguntar**:
- Quantos pedidos chegam em um dia típico?
- Qual é o volume em hora de pico?
- Em qual horário é o pico?
- A variação é grande (segunda ≠ sexta)?

**O que registrar**:
```json
{
  "volume": {
    "dia_tipico": "50 pedidos/dia",
    "pico": "80-100 pedidos/dia em picos",
    "horario_pico": "20h-22h",
    "variacao": "alta (segunda-quinta baixo, sexta-domingo alto)",
    "confirmado": true
  }
}
```

---

### 2. PROCESSO
**O que perguntar**:
- Quem atende o WhatsApp? (dono, gerente, atendente?)
- Como é feito hoje? (totalmente manual, parcialmente automático?)
- Qual ferramenta vocês usam? (WhatsApp puro, iFood, Aiqfome?)
- Quem prepara os pedidos? Quem fecha a venda?

**O que registrar**:
```json
{
  "processo": {
    "quem_atende": "1 pessoa (gerente), turno noite",
    "metodo_atual": "WhatsApp manual + bloco de anotações",
    "ferramentas": [
      {
        "nome": "WhatsApp",
        "uso": "receber pedidos",
        "automatizado": false
      },
      {
        "nome": "Aiqfome",
        "uso": "complemento (alguns clientes)",
        "automatizado": false
      }
    ],
    "fluxo": "cliente manda msg → gerente responde na hora → manda para cozinha → finaliza pedido",
    "confirmado": true
  }
}
```

---

### 3. DOR E IMPACTO
**O que perguntar**:
- Quando fica complicado? (picos, horários específicos?)
- O que acontece quando não conseguem responder rápido?
- Vocês perdem cliente por demora? Com qual frequência?
- Quem sofre mais: equipe ou cliente?

**Registrar confirmação explícita**:
```json
{
  "dor": {
    "descricao": "Cliente espera resposta, gerente tá ocupado, demora 10-15 min",
    "frequencia": "todos os dias em picos (20h-22h)",
    "impacto": "cliente cancela, pede em outro lugar (estimado: 5-10% de perda)",
    "quem_sente": "equipe (sobrecarregada) + cliente (espera demais)",
    "cliente_confirmou_dor": true,
    "frase_do_cliente": "\"A gente tá sempre atrás do WhatsApp, perde muita venda mesmo\""
  }
}
```

**Critério**: Só marca `cliente_confirmou_dor: true` se ele **explicitamente** disser que é um problema. Não invente.

---

### 4. DECISÃO E PRÓXIMA ETAPA
**O que perguntar**:
- Se fizer sentido, vocês gostariam de ver um exemplo?
- Quando seria bom conversar? (próxima semana, próximo mês?)
- Quem precisaria estar na demonstração? (só você, você + cozinheiro, você + dono?)
- Quando vocês costumam tomar decisão sobre coisa assim?

**Registrar commitment**:
```json
{
  "proxima_etapa": {
    "decision": "agendado",
    "tipo": "demonstracao_15min",
    "data_proposta": "2026-10-24 14:00",
    "responsavel": "Higor",
    "participantes": [
      {
        "nome": "José (dono/gerente)",
        "papel": "tomador_de_decisao",
        "confirmado": true
      }
    ],
    "condicoes": "Se demonstração funcionar, quer conversar sobre implantação",
    "data_retorno_definida": "2026-10-24",
    "confirmacao_email": false,
    "confirmacao_whatsapp": true
  }
}
```

---

## Fluxo de Qualificação: Árvore de Decisão

```
┌─ Conseguiu falar com alguém? ───┐
│                                  │
├─ SIM ─────────────────┐         │
│                       │         │ NÃO
│ Tinha volume claro?   │         └─ Status: "tentativa_sem_contato"
│  └─ SIM ──┐           │            Próximo: ligar novamente
│           │           │            Data: [data]
│           │        NÃO │
│           │           └─ Status: "conversou_sem_fit"
│           │              Motivo: "não quer saber de solução agora"
│           │
│  Tinha dor confirmada? ┐
│  └─ SIM ──┐            │
│           │         NÃO │
│           │            └─ Status: "conversou_sem_fit"
│           │               Motivo: "sem dor identificada"
│           │
│  Marcou próxima conversa?
│  └─ SIM ─┐
│          │               NÃO
│          │              └─ Status: "conversou_com_fit"
│          │                 Próximo: follow-up em X dias
│          │
│      Status: "diagnostico_agendado"
│      Próximo: enviar confirmação + preparar demo
│
```

---

## Formato de Registro: JSON Completo

Use este template para registrar a conversa:

```json
{
  "empresa_id": 3,
  "nome_empresa": "Don Boturi Pizzaria",
  
  "contato": {
    "data": "2026-10-19",
    "hora_inicio": "14:30",
    "hora_fim": "14:45",
    "duracao_minutos": 15,
    "canal": "telefone",
    "numero_discado": "44 3222-5555"
  },
  
  "pessoa_contatada": {
    "nome": "José",
    "cargo": "dono/gerente",
    "telefone": "44 99999-1234",
    "email": "nao_obteve",
    "confirmado_como_decisor": true
  },
  
  "resultado_conversa": "conversou_com_fit",
  
  "qualificacao": {
    "volume": {
      "dia_tipico": "50-70 pedidos",
      "pico": "100-120 em sexta/sabado",
      "horario_pico": "20h-22h",
      "confirmado": true
    },
    
    "processo": {
      "quem_atende": "1 pessoa (gerente) no horário de pico",
      "ferramentas_atuais": [
        { "nome": "WhatsApp", "automatizado": false },
        { "nome": "Aiqfome", "automatizado": false }
      ],
      "confirmado": true
    },
    
    "dor": {
      "descricao": "Cliente espera demora de resposta em picos, equipe fica sobrecarregada",
      "frequencia": "todos os dias",
      "impacto": "perde vendas (estimado 10-15% em picos)",
      "cliente_confirmou": true,
      "citacao_cliente": "\"A gente perde muito pedido porque a resposta demora\""
    },
    
    "objecoes": [
      {
        "objecao": "Já tentamos automatização antes, não funcionou",
        "contexto": "software antigo, integração ruim",
        "resposta_dada": "esse é diferente, vamos mostrar"
      }
    ]
  },
  
  "proxima_etapa": {
    "tipo": "demonstracao",
    "data_agendada": "2026-10-24",
    "hora_agendada": "14:00",
    "participantes": ["José (dono)"],
    "confirmacao": "WhatsApp + número anotado",
    "responsavel": "Higor",
    "data_retorno": "2026-10-24 13:00"
  },
  
  "notas_internas": [
    "Dono é muito direto, não gosta de conversa mole",
    "Quer ver demo funcionando 100%, não quer promessa",
    "Preço é sensível, diz que já paga muito em plataformas",
    "Melhor horário de contato: 14h-17h (fora de picos)"
  ],
  
  "score_qualificacao": {
    "volume_confirmado": 25,
    "dor_confirmada": 25,
    "decisor_presente": 25,
    "disposicao": 25,
    "total": 100
  },
  
  "status": "diagnostico_agendado",
  "responsavel": "Higor",
  "data_atualizacao": "2026-10-19"
}
```

---

## 4 Possíveis Resultados

### 1. **Status: "conversou_com_fit"**
✅ Dor confirmada, disposição, mas sem data definida ainda

Próximo passo: follow-up em 3-7 dias
```json
{
  "status": "conversou_com_fit",
  "motivo": "tem dor, quer conhecer, mas não marcou data agora",
  "data_retorno": "2026-10-25",
  "acao": "ligar de novo, tentar agendar demonstracao"
}
```

### 2. **Status: "diagnostico_agendado"**
✅ Tudo certo, demonstração marcada

Próximo passo: confirmar dia antes, preparar demo
```json
{
  "status": "diagnostico_agendado",
  "data_demo": "2026-10-24 14:00",
  "checklist_preparacao": [
    "[ ] Confirmar WhatsApp 1 hora antes",
    "[ ] Preparar exemplo customizado para pizzaria",
    "[ ] Testar demo (rodar localmente)",
    "[ ] Ter número de telefone da demo pronto"
  ]
}
```

### 3. **Status: "conversou_sem_fit"**
❌ Sem dor ou sem disposição agora

Próximo passo: estacionar ou tentar em 30 dias
```json
{
  "status": "conversou_sem_fit",
  "motivo": "disse que agora nao eh prioridade",
  "data_retorno": "2026-11-19 (em 30 dias)",
  "acao": "ligar de novo em nov para ver se situacao mudou"
}
```

### 4. **Status: "tentativa_sem_contato"**
❌ Não conseguiu falar

Próximo passo: tentar novamente
```json
{
  "status": "tentativa_sem_contato",
  "motivo": "ninguem atendeu",
  "data_tentativa_1": "2026-10-19 14:30",
  "data_tentativa_2": "2026-10-20 15:00 (agendada)",
  "nota": "tentar ligacao + WhatsApp se possivel"
}
```

---

## Checklist Pós-Ligação

Depois que Higor desligar, preencher:

- [ ] Data e hora da ligação registradas?
- [ ] Nome e cargo da pessoa contatada confirmados?
- [ ] Volume estimado capturado?
- [ ] Processo atual documentado?
- [ ] Dor confirmada explicitamente (não suposição)?
- [ ] Objeções registradas com contexto?
- [ ] Próxima ação clara?
  - [ ] Se agendou: data, hora, participantes?
  - [ ] Se não agendou: quando retomar?
- [ ] Notas internas para próxima ligação?
- [ ] Status final selecionado corretamente?

---

## Exemplo Completo: Conversa Registrada

```
CONTATO 1: Don Boturi Pizzaria
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Data: 19/10/2026, 14:30-14:45
Canal: Telefone
Pessoa: José (dono/gerente)

VOLUME:
  • Dia típico: 50-70 pedidos
  • Pico: 100-120 pedidos (sexta/sábado 20h-22h)
  ✓ Confirmado

PROCESSO:
  • Quem atende: 1 gerente em picos (José ou funcionário)
  • Ferramentas: WhatsApp manual + Aiqfome (alguns)
  • Não tem automação
  ✓ Confirmado

DOR:
  • "A gente perde muito pedido porque a resposta demora"
  • Cliente espera 10-15 min em picos, cancela
  • Estimado: 10-15% de perda em picos
  ✓ Cliente confirmou explicitamente

OBJEÇÃO:
  • "Já tentei automação antes, não funcionou"
  • Contexto: software antigo, integração ruim com Aiqfome
  • Resposta: Esse é diferente, funciona com WhatsApp puro

PRÓXIMO PASSO:
  ✓ Agendado: 24/10/2026 às 14h00 (demo 15 min)
  ✓ Confirmou: José (dono) estará lá
  ✓ Confirmou por: WhatsApp

SCORE: 100/100
STATUS: "diagnostico_agendado"

NOTAS:
  - Dono é direto, não aceita enrolação
  - Quer ver funcionando, não quer promessa
  - Sensível a preço (já paga em plataformas)
  - Melhor horário: 14h-17h (não chamar 18h+)
```

---

## Quando Não Qualificar Como "Diagnostico Agendado"

❌ Não use `diagnostico_agendado` se:
- Cliente disse "talvez" sem confirmar data exata
- Não tinha pessoa com poder de decisão na ligação
- Dor não foi confirmada explicitamente
- Cliente pediu para ligar depois ("ligue em 30 dias")
- Responsável pela decisão é outra pessoa não contatada

✅ Use `conversou_com_fit` nesses casos

---

**Versão**: 1.0  
**Data**: 19/10/2026  
**Uso**: Depois de cada ligação, para registrar qualificação
