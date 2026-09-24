# Fluxo de Qualificação, Diagnóstico e Abordagem Estratégica

## 1. PREPARAÇÃO (Entrada → Validação Inicial)

```
📥 ORIGEM DA LISTA
├─ Upload manual
├─ Scraping Google Maps (por segmento/empresa)
├─ Scraping LinkedIn
└─ Output de outro workflow

        ⬇️

🔧 ENRIQUECIMENTO DE DADOS
├─ Valida WhatsApp ativo
├─ Busca infos públicas (faturamento estimado, segmento)
├─ Tenta encontrar: catálogo, ticket médio, volume de vendas
└─ Coleta histórico público (se houver)

        ⬇️

❓ TEM WHATSAPP?
├─ SIM ➜ Continua fluxo
└─ NÃO ➜ Descarta (não é ICP)
```

---

## 2. VALIDAÇÃO DE AUTOMAÇÃO (Comportamento de Resposta)

```
💬 MENSAGEM INICIAL
├─ Personalizável (nome, empresa, contexto)
├─ Tom: como cliente interessado
└─ CTA claro mas suave

        ⬇️

⏱️ AGUARDA RESPOSTA (MUTÁVEL)
├─ Timeout padrão: 1 hora (ajustável por segmento)
├─ Monitora: tempo até 1ª resposta
├─ Monitora: tipo de resposta (robótica vs humana)
└─ Continua ouvindo se não responder

        ⬇️

📊 ANÁLISE: TEM AUTOMAÇÃO?

┌─ RESPOSTA EM <5 MIN + MUITO ROBÓTICA
│  └─ 🚩 SCORE BAIXO: Já tem chatbot/solução
│     └─ Descarta ou score reduzido
│
└─ RESPOSTA EM 1-24H + TOM NATURAL
   └─ ✅ BOM LEAD: Não tem automação
      └─ Continua para abordagem
```

---

## 3. ABORDAGEM ESTRATÉGICA (Diagnóstico → Agendamento)

### 3.1 Criar Diagnóstico Personalizado

**Dados a coletar/estimar:**
- Quantos pedidos/vendas por dia? (pergunta + market estimate)
- Quantos clientes atendidos por dia? (pergunta + benchmark do segmento)
- Qual ticket médio? (se houver catálogo público ou estimativa)
- Tempo médio de resposta no WhatsApp? (validado no passo anterior)

**Output do diagnóstico:**
```
DIAGNÓSTICO PERSONALIZADO
├─ Situação Atual
│  ├─ Volume de vendas: X pedidos/dia (estimado)
│  ├─ Clientes/dia: X (estimado)
│  ├─ Ticket médio: R$ X (público + estimativa)
│  └─ Tempo de resposta: X minutos (observado)
│
├─ IMPACTO POTENCIAL
│  ├─ Clientes perdidos: ~X por dia (taxa estimada de abandono)
│  ├─ Receita em risco: R$ X/mês (clientes × ticket × taxa abandono)
│  └─ Cálculo: "Se 15% dos clientes não retornam por demora na resposta,
│     você está perdendo ~R$ X por mês"
│
├─ Case Semelhante
│  ├─ Empresa X (mesmo segmento/porte)
│  ├─ Problema: Mesma taxa de abandono + resposta lenta
│  ├─ Solução implementada: [Seu produto/serviço]
│  └─ Resultado: X% aumento em conversão, R$ Y de receita adicional/mês
│
└─ Próximo Passo
   └─ "Vamos marcar uma reunião rápida (15min) para validar
      se faz sentido?"
```

### 3.2 Agenda Reunião (Ver Sentido)

- Confirmação de disponibilidade
- Foco: validar diagnóstico + explorar fit
- Duração: 15-20 min (apenas para qualificar)

### 3.3 Entrega de Diagnóstico

- Documento completo (PDF/Notion/similar)
- Inclui: situação atual + impacto + case + próximos passos
- Inicia o relacionamento como "consultor", não vendedor

---

## 4. LÓGICA DE ICP (Sua Definição Específica)

**Critérios que você validou/quer validar:**

✅ **Faturamento**: 50-100k+ por mês
✅ **Canal principal**: WhatsApp é fonte de venda
✅ **Problema Pain**: Demora em responder, perda de clientes
✅ **Segmentos**: [Listar os seus segmentos específicos]
✅ **Sem automação**: Não têm chatbot/IA (validado por tempo de resposta)

**O que a ferramenta valida dinamicamente:**
- ⏱️ Tempo de resposta (proxy para "tem automação?")
- 📱 WhatsApp ativo
- 🏢 Informações públicas (faturamento estimado, segmento, porte)

---

## 5. ENTRADAS E PARÂMETROS MUTÁVEIS

```json
{
  "timeout_resposta_minutos": 60,
  "threshold_automatico_min_segundos": 300,
  "taxa_abandono_estimada": 0.15,
  "segmentos_alvo": ["Ecommerce", "Restaurante", "Consultoria", "..."],
  "faturamento_minimo_mensal": 50000,
  "origem_lista": "maps | linkedin | upload | outro_workflow"
}
```

---

## 6. FLUXOGRAMA SIMPLIFICADO

```
ORIGEM → ENRIQUECER → TEM WHATS? ──NÃO→ DESCARTA
                           │
                          SIM
                           ↓
                   MENSAGEM INICIAL
                           ↓
                   AGUARDA RESPOSTA
                           ↓
                    RESPONDEU? ──NÃO→ DESCARTA
                           │
                          SIM
                           ↓
                   TEM AUTOMAÇÃO? ──SIM→ SCORE BAIXO
                           │
                           NÃO
                           ↓
                   CRIA DIAGNÓSTICO (dados + impacto + case)
                           ↓
                   AGENDA REUNIÃO
                           ↓
                   ENTREGA DIAGNÓSTICO
                           ↓
                         ✅ LEAD QUALIFICADO
```

---

## 7. MÉTRICAS ESPERADAS

| Etapa | Esperado | Metadado |
|-------|----------|----------|
| Lista Inicial | 100 leads | origem: maps/linkedin/etc |
| Tem WhatsApp | 60% (60 leads) | conversion_whatsapp |
| Respondeu | 30% (18 leads) | response_rate |
| Sem Automação | 70% (12 leads de qualidade) | automation_false_rate |
| Agendou | 50% (6 reuniões) | booking_rate |
| Converteu | 30-40% (2-3 clientes) | conversion_final |

---

## Notas Importantes

1. **ICP Específico**: Você não precisa dados CNAE/funcionários publicados. Seu ICP é comportamental:
   - Usa WhatsApp como canal principal
   - Responde devagar (não tem IA/automação)
   - Tem volume suficiente para justificar solução

2. **Validação por Resposta**: O tempo de resposta é seu principal indicador de "tem automação ou não"
   - <5min + robótico = tem chatbot (score baixo)
   - 1h+ = humano respondendo (bom lead)

3. **Diagnóstico como Köppen**: Você não vende, você informa. O diagnóstico é educativo:
   - "Você está perdendo X" não é agressivo
   - "Vimos um case parecido" não é presumido
   - "Quer validar em 15min?" é consultivo

4. **Origem Mutável**: O fluxo é agnóstico à origem. Se não tiver lista, você roda scraping de Maps/LinkedIn como entrada.
