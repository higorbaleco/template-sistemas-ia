# Índice — Agente Comercial Avraham

**Navegação rápida por tópico**

---

## 📖 Primeiros Passos

| Arquivo | Para quem | Tempo |
|---------|-----------|-------|
| **00-LEIA-PRIMEIRO.md** | Você quer entender rápido | 5 min |
| **README.md** | Visão geral + como usar | 10 min |
| **STATUS-OPERACIONAL.md** | Checklist do que foi preparado | 5 min |

---

## 🎓 Entender o Agente

| Arquivo | Tópico | Para quem |
|---------|--------|-----------|
| **AGENTE.md** | Regras, processos, scripts | Quem quer conhecer a fundo |
| **SEGMENTOS-E-HORARIOS.md** | 7 segmentos + horários ideais | Quem quer escolher qual mercado |
| **ESCOPO-EXPANDIDO.md** | Mudanças v1.0 → v1.1 | Quem quer ver o que é novo |

---

## 🛠️ Técnico / Implementação

| Arquivo | Tópico | Para quem |
|---------|--------|-----------|
| **ESTRUTURA-DADOS.md** | Schema JSON, campos, exemplo | Dev ou quem quer integrar com CRM |
| **SCRAPLING-GUIA.md** | Como usar web scraping | Quem quer enriquecer dados 10+ empresas |
| **INDICE.md** | Este arquivo | Quem se perdeu |

---

## 📂 Campanhas Existentes

### Pizzarias Maringá (campanha-1)
```
Localização: campaigns/maringa-pizzarias-202610/

Arquivos:
├── prospects-maringa-pizzarias.json (10 pizzarias estruturadas)
└── campaign-maringa-pizzarias.md (3 fichas completas + scripts)

Status: Pronto para ligações
Próxima ação: Higor escolhe quando começar
```

---

## 🎯 Por Objetivo

### Quero começar a ligar AGORA
```
1. Abra: campaigns/maringa-pizzarias-202610/campaign-maringa-pizzarias.md
2. Leia: Ficha 1 (Don Boturi Pizzaria)
3. Busque: telefone em Google Maps
4. Ligue: 14h–17h com abertura da ficha
```

### Quero escolher qual segmento prospectar
```
1. Abra: SEGMENTOS-E-HORARIOS.md
2. Leia: características + horários de cada segmento
3. Escolha: o que faz mais sentido
4. Diga: "Ative a campanha: [SEGMENTO], [CIDADE]"
```

### Quero entender a estrutura completa
```
1. Abra: 00-LEIA-PRIMEIRO.md (overview)
2. Depois: AGENTE.md (processos)
3. Depois: ESTRUTURA-DADOS.md (dados)
```

### Quero usar Scrapling para enriquecer dados
```
1. Abra: SCRAPLING-GUIA.md
2. Defina: escopo (segmento, local, dados)
3. Execute: Scrapling com comando específico
4. Valide: resultados manualmente
```

### Quero expandir para outro país
```
1. Abra: ESCOPO-EXPANDIDO.md (multi-país)
2. Adapte: conforme país (CNPJ vs EIN vs NIF)
3. Diga: "Ative a campanha: [SEGMENTO], [CIDADE], [PAIS]"
```

---

## ❓ Perguntas Frequentes

### "Por onde começo?"
→ Abra **00-LEIA-PRIMEIRO.md**

### "Como começo a ligar?"
→ Abra **campaigns/maringa-pizzarias-202610/campaign-maringa-pizzarias.md**

### "Como uso Scrapling?"
→ Abra **SCRAPLING-GUIA.md**

### "Que dados são capturados?"
→ Abra **ESTRUTURA-DADOS.md**

### "Quais são os segmentos disponíveis?"
→ Abra **SEGMENTOS-E-HORARIOS.md**

### "O que é novo na v1.1?"
→ Abra **ESCOPO-EXPANDIDO.md**

### "Como funciona o processo completo?"
→ Abra **AGENTE.md** (Etapas A–F)

---

## 📊 Arquivos por Tipo

### 📋 Documentação Principal
- 00-LEIA-PRIMEIRO.md
- README.md
- AGENTE.md

### 🎯 Referência Rápida
- SEGMENTOS-E-HORARIOS.md
- STATUS-OPERACIONAL.md
- ESCOPO-EXPANDIDO.md
- INDICE.md (você está aqui)

### 🔧 Técnico
- ESTRUTURA-DADOS.md
- SCRAPLING-GUIA.md

### 📁 Campanhas
- campaigns/maringa-pizzarias-202610/
  - prospects-maringa-pizzarias.json
  - campaign-maringa-pizzarias.md

---

## 🔍 Busca Rápida

### Procurando por... → Abra arquivo

| Busca | Arquivo |
|-------|---------|
| Scripts de ligação | campaign-maringa-pizzarias.md |
| Horários de contato ideais | SEGMENTOS-E-HORARIOS.md |
| Campos de dados | ESTRUTURA-DADOS.md |
| Como usar Scrapling | SCRAPLING-GUIA.md |
| Objeções esperadas | campaign-maringa-pizzarias.md |
| Fórmulas de métrica | AGENTE.md (seção 9) |
| Processo Etapa A–F | AGENTE.md |
| Qual segmento começar | ESCOPO-EXPANDIDO.md |
| Próximas ações | STATUS-OPERACIONAL.md |

---

## 📞 Próximos Comandos

Quando pronto, você pode usar:

```
"Comece a campanha de pizzarias agora"
→ Instruções em: campaign-maringa-pizzarias.md

"Ative a campanha: lanchonetes, Maringá"
→ Referência em: SEGMENTOS-E-HORARIOS.md

"Use Scrapling para restaurantes São Paulo"
→ Guia em: SCRAPLING-GUIA.md

"Expanda pizzarias para: São Paulo, Curitiba, Brasília"
→ Conceito em: ESCOPO-EXPANDIDO.md
```

---

## 📈 Evolução Esperada

```
Semana 1: Pizzarias Maringá
   ↓ (via campaign-maringa-pizzarias.md)

Semana 2: Lanchonetes Maringá (novo segmento)
   ↓ (via SEGMENTOS-E-HORARIOS.md)

Semana 3: Pizzarias São Paulo (nova cidade)
   ↓ (via SCRAPLING-GUIA.md)

Semana 4: Múltiplas cidades em paralelo
   ↓ (via ESCOPO-EXPANDIDO.md)

Semana 5+: Integração com n8n + Evolution API
   ↓ (próxima fase do roadmap)
```

---

## ✅ Checklist: O que você tem

- ✅ Manual completo do agente
- ✅ 7 segmentos mapeados com horários
- ✅ 1 campanha pronta (Pizzarias Maringá, 10 empresas)
- ✅ 3 fichas de prospecção completas
- ✅ Scripts de ligação + objeções
- ✅ Estrutura de dados enriquecida
- ✅ Guia de Scrapling
- ✅ Suporte multi-país
- ✅ Índice de navegação (este arquivo)

**Próximo passo**: Você escolhe quando começar ↓

---

## 🚀 Comece Aqui Agora

**Opção A**: Leia rápido  
→ Abra: **00-LEIA-PRIMEIRO.md** (5 min)

**Opção B**: Comece a ligar  
→ Abra: **campaigns/maringa-pizzarias-202610/campaign-maringa-pizzarias.md** (leia Ficha 1)

**Opção C**: Escolha segmento  
→ Abra: **SEGMENTOS-E-HORARIOS.md** (escolha qual prospectar)

**Opção D**: Entenda tudo  
→ Abra: **README.md** (visão geral)

---

**Versão**: 1.1 | **Data**: 19/10/2026  
**Próxima**: O que você quer fazer agora?
