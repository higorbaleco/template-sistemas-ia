# Formato: Feedback Diário (Relatório do Dia)

**Template que Higor preenche ao final do dia de prospecção**

---

## Comando

```
"Fechamento do dia: [RESULTADOS DO DIA]"
```

## Formato

```
DATA: 2026-10-19
CAMPANHA: Pizzarias Maringá
RESPONSÁVEL: Higor

ESFORÇO (O que fez):
  • Ligações feitas: 3 (Don Boturi, D'Marcos, Pizzaria Sardilli)
  • Tentativas sem contato: 1 (Casa Velha - sem resposta)
  • Conversas conseguidas: 3
  • Tempo total: 25 minutos

QUALIDADE (Resultados):
  • Conversas com decisor: 3/3 ✅
  • Dores confirmadas: 3/3 ✅
  • Diagnósticos agendados: 1 (Don Boturi)
  • Conversas qualificadas: 2 (D'Marcos, Sardilli - sem data mas com fit)

TAXA DE SUCESSO:
  • Taxa de contato: 3 ligações / 3 = 100% ✅
  • Taxa de qualificação: 3 qualificadas / 3 = 100% ✅
  • Taxa de agendamento: 1 demo / 3 = 33%

OBJEÇÕES DO DIA:
  1. Don Boturi: "Já tentei automação, não funcionou"
     → Resposta funcionou: diferenciei mostrando simplicidade

  2. D'Marcos: "Como vocês integram com Aiqfome?"
     → Não integra, só WhatsApp. Prometeu ligar semana que vem

  3. Pizzaria Sardilli: "Quanto custa?"
     → Não deu número, pediu para mostrar demo primeiro

APRENDIZADO DO DIA:
  • Objeção "já tentei automação" é comum → prepare resposta melhor
  • Não mencionar integração caro antes de demo → reduz friction
  • Perguntar "quem toma decisão?" antes de agendar → evita fluff

PRÓXIMAS AÇÕES:
  1. PRIORITÁRIO: Confirmar Don Boturi segunda-feira 13:30 (demo 14:00)
  2. D'Marcos: ligar terça-feira 14:30 (quer ver exemplo)
  3. Pizzaria Sardilli: ligar quarta-feira 14:00 (quer saber preço)
  4. Casa Velha: tentar ligar amanhã diferente horário

META DO PERÍODO:
  Objetivo: 10 empresas abordadas, 3 conversas com decisor, 1 demo
  Status: 3 abordadas, 3 conversas, 1 demo ✅ (33% do período)

NOTA GERAL:
  Dia muito produtivo. Teste de "frase de diferenciação" funcionou bem.
  Próximo passo: fazer demo funcionar para virar proposta.
```

---

## Placar Simples (Copiar/Colar)

```
┌─────────────────────────────────────────┐
│ PIZZARIAS MARINGÁ — Placar 19/10       │
├─────────────────────────────────────────┤
│ ESFORÇO:                                │
│  • Pesquisadas: 10                      │
│  • Abordadas: 3                         │
│  • Conversas: 3 ✅                      │
│                                         │
│ QUALIDADE:                              │
│  • Dores confirmadas: 3 ✅              │
│  • Demos agendadas: 1                   │
│  • Taxa contato: 100%                   │
│                                         │
│ PRÓXIMO: Demo Don Boturi seg 14h        │
└─────────────────────────────────────────┘
```

---

## JSON Estruturado

```json
{
  "data": "2026-10-19",
  "campanha": "maringa-pizzarias-202610",
  "responsavel": "Higor",
  
  "esforco": {
    "pesquisadas": 10,
    "abordadas": 3,
    "ligacoes_feitas": 3,
    "tentativas_sem_contato": 1,
    "conversas_conseguidas": 3,
    "tempo_total_minutos": 25
  },
  
  "qualidade": {
    "conversas_com_decisor": 3,
    "dores_confirmadas": 3,
    "conversas_qualificadas": 3,
    "diagnosticos_agendados": 1,
    "taxa_contato": "100%",
    "taxa_qualificacao": "100%"
  },
  
  "objecoes": [
    {
      "objecao": "Já tentei automação, não funcionou",
      "empresa": "Don Boturi",
      "resposta_dada": "Mostramos que eh diferente, simples"
    }
  ],
  
  "aprendizado": [
    "Objeção de experiência ruim é comum",
    "Não mencionar custo integração até demonstração",
    "Confirmar tomador de decisão antes de agendar"
  ],
  
  "proximas_acoes": [
    {
      "prioridade": 1,
      "empresa": "Don Boturi",
      "acao": "Confirmar demo segunda 14h",
      "data": "2026-10-21",
      "hora": "13:30"
    }
  ]
}
```

---

## Checklist: O Que Incluir

- [ ] Data clara
- [ ] Campanha identificada
- [ ] Total de ligações (feitas + tentativas)
- [ ] Total de conversas conseguidas
- [ ] Total de qualificações
- [ ] Objeções do dia (ajuda pattern matching)
- [ ] 1-2 aprendizados principais
- [ ] Próximas ações claras (com data/hora)
- [ ] Taxa de sucesso (contato / qualificação)

---

**Versão**: 1.0 | **Data**: 19/10/2026
