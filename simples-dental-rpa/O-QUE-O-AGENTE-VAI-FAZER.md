# 🤖 O Que o Agente IA Vai Fazer - Especificação Exata

> **Documento de Execução:** Detalhamento 100% de cada ação que o agente vai executar

---

## 📌 Resumo Executivo

Um **Agente Claude** vai:
1. **Receber mensagens** do WhatsApp (de pacientes respondendo)
2. **Ler contexto** (quem é, por que estamos falando, que dados tem)
3. **Responder conversacionalmente** (com inteligência, não template)
4. **Chamar tools** para executar ações no Simples Dental
5. **Atualizar BD local** com resultado das interações

---

## 🎯 5 Cenários Exatos que o Agente Vai Enfrentar

### CENÁRIO 1: Confirmação de Agendamento

**Contexto que o Agente Recebe:**
```json
{
  "paciente_id": 26926607,
  "paciente_nome": "João Silva",
  "agendamento_id": 324826659,
  "data_consulta": "2026-10-19 14:00",
  "profissional": "Dr. Carlos",
  "tipo": "Limpeza",
  "telefone_paciente": "11987654321",
  "tentativas_confirmacao": 1,
  "historico_conversa": []
}
```

**Mensagem inicial que enviamos NO WHATSAPP:**
```
"Olá João! 👋 Confirme sua presença na consulta de hoje às 14:00 com Dr. Carlos para Limpeza. Responda SIM ou NÃO"
```

**Paciente responde no WhatsApp:**
```
"Sim, vou sim!"
```

**O QUE O AGENTE FAZ:**

1. **Recebe a resposta:**
   ```
   mensagem_do_paciente = "Sim, vou sim!"
   contexto = { agendamento_id: 324826659, ... }
   ```

2. **Processa com IA:**
   - Entende que é confirmação positiva
   - Pode ser "SIM", "Vou", "Sim claro", "Confirmado", etc
   - IA interpreta a intenção, não apenas palavras-chave

3. **Executa tool:**
   ```javascript
   await confirmar_agendamento(
     agendamento_id: 324826659,
     confirmacao: true,  // paciente confirmou
     timestamp: now
   )
   ```

4. **Atualiza BD local:**
   ```sql
   UPDATE agendamentos_confirmados 
   SET confirmado = true, data_confirmacao = NOW()
   WHERE agendamento_id = 324826659
   ```

5. **Responde ao paciente:**
   - Resposta conversacional (não template rigído)
   - Exemplos reais que IA pode gerar:
     - "Ótimo João! Te esperamos hoje às 14:00. Qualquer dúvida, é só chamar! 😊"
     - "Perfeito! Vamos preparar tudo para você. Até as 14:00!"
     - "Anotado! Você é massa. Até agora!"

**Se paciente responde NÃO:**
```
"Não vou conseguir"
```

1. **IA entende negação**
2. **Executa tool:**
   ```javascript
   await confirmar_agendamento(
     agendamento_id: 324826659,
     confirmacao: false
   )
   ```
3. **Responde e oferece opções:**
   - "Entendo! Quer remarcar? Quais datas você tem disponível?"
   - IA então aguarda resposta e pode criar novo agendamento

**Se paciente não responde:**
- Job agenda reenvio em 1 hora
- Agente reenvia lembrante
- Se não responder 2x mais, marca para contact center ligar

---

### CENÁRIO 2: Lembrete de Aniversariante

**Contexto que o Agente Recebe:**
```json
{
  "paciente_id": 48149581,
  "paciente_nome": "Maria Santos",
  "data_aniversario": "2026-10-19",
  "telefone": "11988776655",
  "ultimo_agendamento": "2026-09-15",
  "tempo_sem_visita_dias": 34,
  "historico_conversa": []
}
```

**Mensagem inicial NO WHATSAPP:**
```
"🎉 Feliz Aniversário Maria! 
Aproveite o dia especial. Conte com a gente para cuidar do seu sorriso! 
Quer agendar uma avaliação? Temos super promoção pra você este mês! 🎁"
```

**O QUE O AGENTE FAI QUANDO PACIENTE RESPONDE:**

**Cenário A: Paciente quer agendar**
```
Paciente: "Oi! Quero sim! Quanto custa?"
```

1. **IA interpreta:** Paciente quer informações sobre procedimento/preço
2. **Agente executa:**
   ```javascript
   // Tool 1: Buscar planos/preços
   await consultar_procedimentos("limpeza", "avaliacao")
   
   // Tool 2: Buscar disponibilidade
   await consultar_disponibilidade(
     profissional_id: "qualquer",  // IA decide melhor
     data: "2026-10-20"  // próximos dias
   )
   ```
3. **Responde conversacionalmente:**
   - "Maria, a avaliação é gratuita! E se você virar cliente, ganha 20% de desconto em qualquer procedimento este mês. Qual dia você prefere agendar?"
4. **Paciente escolhe data/hora:**
   ```
   "Terça que vem às 14h?"
   ```
5. **IA confirma e cria agendamento:**
   ```javascript
   await criar_agendamento({
     paciente_id: 48149581,
     profissional_id: 2611026,  // IA escolhe disponível
     data: "2026-10-22",
     horario: "14:00"
   })
   ```
6. **Confirma no WhatsApp:**
   - "Perfeito Maria! Sua consulta está marcada para Terça (22/10) às 14h. Você vai amar o atendimento! 😊"

**Cenário B: Paciente não responde**
- Reenviar em 2 dias: "Oi Maria! Não recebeu minha mensagem? Promoção de aniversário ainda vale!"

**Cenário C: Paciente declina**
```
Paciente: "Não, não preciso não"
```
- IA respeita, responde educadamente
- Não força, mas oferece para ligar quando precisar

---

### CENÁRIO 3: Alerta de Orçamento em Aberto

**Contexto que o Agente Recebe:**
```json
{
  "paciente_id": 51337661,
  "paciente_nome": "Pedro Costa",
  "orcamento_id": 987654,
  "procedimento": "Implante unitário",
  "valor_total": 4500.00,
  "valor_pago": 1500.00,
  "saldo_devendo": 3000.00,
  "data_criacao_orcamento": "2026-09-01",
  "dias_em_aberto": 48,
  "status_pagamento": "parcial",
  "telefone": "11991234567",
  "historico_conversa": []
}
```

**Mensagem inicial NO WHATSAPP:**
```
"Oi Pedro! 👋 Seu orçamento de Implante unitário 
no valor de R$ 4.500 está aguardando sua aprovação. 
Você já pagou R$ 1.500, faltam R$ 3.000.

Quer conversar sobre as opções de parcelamento? 
Temos planos de até 12x sem juros! 💳"
```

**O QUE O AGENTE FAZ:**

**Cenário A: Paciente quer saber sobre parcelamento**
```
Paciente: "Qual é o melhor parcelamento pra mim?"
```

1. **IA interpreta:** Buscar flexibilidade de pagamento
2. **Agente executa:**
   ```javascript
   // Buscar opções de parcelamento configuradas
   opcoes_pagamento = [
     { parcelas: 6, valor: 500, juros: 0 },
     { parcelas: 12, valor: 250, juros: 0 },
     { parcelas: 18, valor: 167, juros: 2.5 }
   ]
   ```
3. **Oferece opções:**
   - "Temos 3 opções legais pro você:"
   - "📱 6x de R$ 500 (sem juros)"
   - "📱 12x de R$ 250 (sem juros)"
   - "📱 18x de R$ 167 (2,5% de juros)"
   - "Qual você acha melhor?"

4. **Paciente escolhe:**
   ```
   "Vou de 12x"
   ```

5. **IA aprova orçamento:**
   ```javascript
   await atualizar_orcamento({
     orcamento_id: 987654,
     status: "aprovado",
     parcelas: 12,
     valor_parcela: 250.00,
     data_aprovacao: now
   })
   ```

6. **Confirma:**
   - "Perfeito! Seu orçamento foi aprovado em 12x de R$ 250. Vamos agendar seu implante? Qual dia você prefere?"

7. **Cria agendamento se paciente quiser**

**Cenário B: Paciente quer negociar preço**
```
Paciente: "Não tá muito caro não?"
```

1. **IA responde com empatia:**
   - Explica complexidade do procedimento
   - Oferece alternativas (ex: técnica mais simples)
   - Nunca desvaloriza o trabalho
   - Oferece primeira consulta com dentista para discutir

2. **Se quiser descontar:**
   - "Deixa eu ver com o dentista as opções de desconto. Pode ser?"

**Cenário C: Paciente rejeita**
```
Paciente: "Achei caro, vou em outro lugar"
```

1. **IA não força:**
   - "Tudo bem, respeitamos sua decisão. Mas qualquer coisa, a gente tá aqui!"
   - **Log para vendedor:** Seguimento necessário

---

### CENÁRIO 4: Follow-up de Procedimento (6 meses depois)

**Contexto que o Agente Recebe:**
```json
{
  "paciente_id": 64052121,
  "paciente_nome": "Ana Paula",
  "procedimento_original": "Clareamento dental",
  "data_procedimento": "2026-04-19",
  "dias_desde_procedimento": 183,  // ~6 meses
  "telefone": "11987654388",
  "ultima_visita": "2026-04-19",
  "historico_conversa": []
}
```

**Mensagem inicial NO WHATSAPP:**
```
"Olá Ana! 👋 Você fez clareamento com a gente há 6 meses. 
Como está o resultado? 😁

Que tal agendar um retorno pra verificar como ficou? 
Aproveita que estamos com cupom de R$ 100 de desconto! 🎁"
```

**O QUE O AGENTE FAZ:**

**Cenário A: Paciente quer agendar retorno**
```
Paciente: "Oi! Tá tudo bem sim! Quero agendar"
```

1. **IA aprecia feedback:**
   - "Que alegria saber que ficou bom! 😊"

2. **Solicita agendamento:**
   - "Qual dia você tem disponível pra revisão?"

3. **Paciente responde:**
   ```
   "Segunda que vem, de manhã"
   ```

4. **IA busca disponibilidade:**
   ```javascript
   await consultar_disponibilidade(
     profissional_id: null,  // qualquer que fez clareamento
     data: "2026-10-20",
     periodo: "manha"
   )
   ```

5. **Oferece horários:**
   - "Temos 09:00, 09:30 e 10:00 disponível"

6. **Paciente escolhe, IA confirma:**
   ```javascript
   await criar_agendamento({
     paciente_id: 64052121,
     profissional_id: 2611026,
     data: "2026-10-20",
     horario: "09:30",
     tipo: "Follow-up - Clareamento",
     notas: "Cupom R$100 aplicado"
   })
   ```

7. **Confirmação final:**
   - "Pronto! Sua revisão está marcada para Segunda (20/10) às 09:30. Aproveita que seu cupom de R$ 100 vai direto na conta!"

**Cenário B: Paciente quer fazer outro procedimento**
```
Paciente: "Tá bom demais! Vcs fazem limpeza? Quero fazer tbm"
```

1. **IA oferece:**
   - "Fazemos sim! Limpeza é ótimo complement do clareamento. Quer agendar?"

2. **Oferta combinada:**
   - Clareamento + Limpeza juntos = desconto extra

3. **Cria agendamento para ambos**

**Cenário C: Paciente não responde**
- Reenvia em 3 dias
- Log para follow-up manual se necessário

---

### CENÁRIO 5: Retorno Periódico (Profilaxia)

**Contexto que o Agente Recebe:**
```json
{
  "paciente_id": 26926607,
  "paciente_nome": "João Silva",
  "procedimento_periodicidade": "profilaxia",
  "data_ultimo_procedimento": "2026-04-19",
  "tempo_recomendado_meses": 6,
  "dias_ate_vencimento": 30,
  "status": "aviso_1_mes",
  "telefone": "11987654321",
  "historico_conversa": []
}
```

**Mensagem inicial NO WHATSAPP:**
```
"Oi João! 👋 Sua profilaxia vence em 1 mês (19/10).
Quer agendar agora pra não atrasar a manutenção do seu sorriso? 
Agende por aqui! 😁"
```

**O QUE O AGENTE FAZ:**

1. **Se paciente marca:**
   - Mesmo fluxo de agendamento
   - Cria novo procedimento no Simples Dental

2. **Se não responde em 2 dias:**
   - Reenvia: "João, tá faltando menos de 1 mês pra sua profilaxia vencer. Bora marcar?"

3. **Se vencer sem agendar:**
   - Último aviso: "João! Sua profilaxia venceu. Marca agora pra gente cuidar do seu sorriso!"
   - Log para contact center ligar

4. **Após agendamento:**
   - Guardar em `follow_ups` para próximo ciclo (6 meses depois)

---

## 🔧 Tools que o Agente Usa

```javascript
Tool 1: confirmar_agendamento
├─ Input: agendamento_id, confirmacao (true/false)
└─ Output: { sucesso, mensagem, proximos_passos }

Tool 2: criar_agendamento
├─ Input: paciente_id, profissional_id, data, horario, [tipo]
└─ Output: { agendamento_id, confirmacao, linkWhatsApp }

Tool 3: atualizar_orcamento
├─ Input: orcamento_id, status, [valor_pago], [parcelas]
└─ Output: { sucesso, novo_status, plano_pagamento }

Tool 4: consultar_disponibilidade
├─ Input: profissional_id, data, [periodo: manha/tarde/noite]
└─ Output: { horarios_disponiveis: ["09:00", "09:30", ...] }

Tool 5: consultar_procedimentos
├─ Input: tipo, [paciente_id]
└─ Output: { valor, descricao, tempo, opcoes_pagamento }
```

---

## 📊 Fluxo Geral de QUALQUER Interação

```
┌─────────────────────────────────────────┐
│ 1. WHATSAPP WEBHOOK recebe mensagem     │
│    Paciente: "Sim, vou sim!"            │
└──────────────────┬──────────────────────┘
                   ⬇️
┌─────────────────────────────────────────┐
│ 2. PROCESSAR contexto                   │
│    - Qual é o paciente?                 │
│    - Por qual motivo estou falando?     │
│    - Qual é o histórico?                │
└──────────────────┬──────────────────────┘
                   ⬇️
┌─────────────────────────────────────────┐
│ 3. CHAMAR AGENTE CLAUDE                 │
│    - System prompt com contexto         │
│    - Tools disponíveis                  │
│    - Histórico da conversa              │
└──────────────────┬──────────────────────┘
                   ⬇️
┌─────────────────────────────────────────┐
│ 4. IA PROCESSA E DECIDE                 │
│    - Entender intenção                  │
│    - Validar dados                      │
│    - Chamar tool(s) se necessário       │
└──────────────────┬──────────────────────┘
                   ⬇️
┌─────────────────────────────────────────┐
│ 5. EXECUTAR TOOL(S)                     │
│    - Atualizar Simples Dental           │
│    - Atualizar BD local                 │
│    - Registrar ação                     │
└──────────────────┬──────────────────────┘
                   ⬇️
┌─────────────────────────────────────────┐
│ 6. RESPONDER NO WHATSAPP                │
│    - Resposta conversacional            │
│    - Próximos passos claros             │
│    - Sempre educado                     │
└──────────────────┬──────────────────────┘
                   ⬇️
┌─────────────────────────────────────────┐
│ 7. PERSISTIR CONTEXTO                   │
│    - Guardar mensagem em BD             │
│    - Atualizar histórico de conversa    │
│    - Preparar pra próxima interação     │
└─────────────────────────────────────────┘
```

---

## 💾 Dados que o Agente Acessa/Modifica

### LEITURA (do Simples Dental via API):
```javascript
// Agendar/consultar
GET /consultas/{id}
GET /pacientes/{id}
GET /pacientes/{id}/orcamentos
GET /profissionais
GET /cadeiras

// Buscar disponibilidade
GET /profissionais/{id}/horarios
GET /cadeiras?status=ativa
```

### ESCRITA (no Simples Dental):
```javascript
// Ainda não existem esses endpoints - PRECISAM ser implementados:
PATCH /consultas/{id}  // Marcar como confirmado
POST /consultas        // Criar novo agendamento
PATCH /orcamentos/{id} // Aprovar orçamento
PATCH /pacientes/{id}/recebimentos  // Registrar pagamento
```

### ESCRITA (no BD Local):
```javascript
INSERT INTO whatsapp_conversations (...)
INSERT INTO agendamentos_confirmados (...)
INSERT INTO follow_ups (...)
UPDATE agendamentos_confirmados SET ...
UPDATE follow_ups SET ...
```

---

## ⚙️ Configurações Necessárias

```javascript
// Para cada clínica/cliente:
{
  "cliente_id": "avraham",
  "whatsapp_api": "meta",  // ou twilio
  "whatsapp_phone_id": "1234567890",
  "simples_dental_email": "contato@avrahamdigital.com.br",
  
  // Templates de mensagens (customizáveis)
  "templates": {
    "confirmacao_agendamento": "Olá {nome}! Confirme sua presença...",
    "lembrete_aniversario": "🎉 Feliz Aniversário {nome}!...",
    "alerta_orcamento": "Oi {nome}! Seu orçamento de {proc}..."
  },
  
  // Regras de negócio
  "regras": {
    "tentativas_confirmacao": 3,
    "intervalo_reenvio_minutos": 60,
    "dias_follow_up_implante": 180,
    "dias_follow_up_limpeza": 180,
    "desconto_aniversario": 20,
    "desconto_follow_up": 100
  }
}
```

---

## 📈 Métricas que o Agente Vai Gerar

```javascript
// Por cada interação:
{
  "data": "2026-10-19T14:30:00Z",
  "tipo": "confirmacao_agendamento",
  "paciente_id": 26926607,
  "resultado": "confirmado",  // confirmado/negado/abandonado
  "tempo_resposta_segundos": 45,
  "tools_chamadas": ["confirmar_agendamento"],
  "sucesso": true,
  "categoria": "confirmacao_agendamento"
}
```

### Relatórios possíveis:
- Taxa de confirmação de agendamentos (%)
- Taxa de conversão aniversário → agendamento (%)
- Taxa de aprovação orçamento (%)
- Tempo médio de conversa
- Abandono de conversa
- Escalação para humano (%)
- Receita gerada por automação

---

## 🎯 Resumo Final: O QUE O AGENTE EXECUTA

| Ação | Como | Resultado |
|------|------|-----------|
| **Confirma agendamento** | Lê resposta SIM/NÃO, chama tool | Marca no BD como confirmado |
| **Oferece serviço** | Sugere agendamento baseado em contexto | Cria novo agendamento |
| **Aprova orçamento** | Oferece parcelamento, paciente escolhe | Atualiza status orçamento |
| **Agenda retorno** | Consulta disponibilidade, cria agendamento | Novo agendamento criado |
| **Responde dúvidas** | Conversação natural com IA | Paciente satisfeito |
| **Escala para humano** | Se não consegue resolver | Contact center ligação |
| **Registra tudo** | Persiste contexto em BD | Histórico disponível |

---

**Status:** ✅ 100% Documentado e Pronto para Implementação

Quer que comece a implementar qual dos 5 cenários primeiro?
