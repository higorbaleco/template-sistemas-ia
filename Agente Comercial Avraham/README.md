# Agente Comercial Avraham

**Versão**: 1.0 | **Data**: 19/10/2026 | **Estado**: estrutura pronta, aguardando ativação de campanha

## O que é este agente?

Sistema de **prospecção consultiva, qualificação e abordagem comercial** para Higor. Reduz tempo de preparação sem substituir conversas humanas. Objetivo: material verificável e pronto para executar ligações.

## Como usar

1. **Escolha um segmento + local** (ex: "Pizzarias Maringá", "Restaurantes São Paulo")
2. **Digite**: "Monte minha prospecção de hoje"
3. **Receba**: lista de 10 empresas, top 3 fichas personalizadas, scripts prontos e uma única próxima ação

## Estrutura de campanhas

Cada campanha fica em subpasta com:
- `prospects-[segmento]-[local].json` — banco estruturado de todas as empresas
- `campaign-[segmento]-[local].md` — fichas de prospecção, scripts e histórico

## Segmentos mapeados

### 1. Pizzarias (Maringá)
- **Arquivo**: `campaigns/maringa-pizzarias-202610/`
- **Status**: 10 prospects pesquisados (Prioridade A/B/C), top 3 fichas prontas
- **Horários de contato**: 14h–17h (fora de picos de preparo)
- **Especificidade**: cardápio variado, delivery, atendimento manual via WhatsApp
- **Próximo passo**: Ativar quando Higor confirmar

### 2. Restaurantes (múltiplas cidades)
- **Status**: estrutura pronta, aguardando ativação
- **Horários de contato**: 14h–17h (almoço terminando) ou 22h–10h (próximo dia)
- **Especificidade**: cardápio ainda maior, pedidos corporativos, variabilidade de volume

### 3. Lanches / Pastelarias / Döner (múltiplas cidades)
- **Status**: estrutura pronta, aguardando ativação
- **Horários de contato**: 14h–17h (pós-almço) ou 19h–22h (noite)
- **Especificidade**: cardápio pequeno, atendimento rápido, volume de pedidos imprevisível

### 4. Outros segmentos
- Cafeterias (horário: 10h–12h, fora de pico)
- Açaí (horário: 14h–17h)
- Sushi/Asiáticos (horário: 14h–17h)

---

## Estratégia de horários

O agente **respeita janelas de contato ideais** conforme segmento:

| Segmento | Horários de Abertura | Horários Ideais para Contato | Por quê |
|----------|----------------------|-----|------|
| **Pizzaria** | 18h–23h/24h | 14h–17h | Fora do prep, pré-pico noturno |
| **Restaurante** | 11h–22h | 14h–17h ou 10h–11h | Após almoço ou pré-almoço |
| **Lanches** | 10h–23h | 14h–17h | Fora de picos (manhã/noite) |
| **Café** | 07h–20h | 10h–12h | Fora de morning rush |
| **Açaí** | 10h–21h | 14h–17h | Após almoço |

---

## Critério de sucesso

Agente funciona quando Higor consegue:
1. **Listar 10 empresas reais** com dados verificáveis (não invenções)
2. **Ler 3 fichas completas** com contexto específico (não templates genéricos)
3. **Pegar o telefone** sem pesquisar nada a mais
4. **Ligar com confiança** usando abertura consultiva

---

## Fluxo de uso típico

```
Higor: "Monte minha prospecção de hoje: pizzarias Maringá"
    ↓
Agente: Pesquisa 10 pizzarias com delivery em Maringá/PR
    ↓
Agente: Classifica por prioridade (A/B/C)
    ↓
Agente: Cria 3 fichas completas (empresa, dor, abertura, perguntas, objeções)
    ↓
Agente: Indica 1 única próxima ação (qual ligar primeiro e por quê)
    ↓
Higor: Abre arquivo → lê ficha → liga
    ↓
Higor: "Acabei de falar com [empresa]: [notas da conversa]"
    ↓
Agente: Qualifica (dor confirmada? Decisor presente? Quando demonstração?)
    ↓
Agente: Registra status e sugere próximo contato
```

---

## Regras do agente

1. **Apenas dados verificáveis**: Google Maps, websites públicos, diretórios, redes sociais — nunca invenções
2. **Limite: 3 minutos por empresa** na pesquisa; se inconcluso, marcar "não verificado" e avançar
3. **Sem envio automático de mensagens**: documentar tudo, revisar antes de disparar
4. **Scripts consultivos, não pitches**: pergunta primeiro, apresenta solução depois
5. **Prioridade A quando**: aderência + canal + acesso confirmados
6. **Prioridade B quando**: aderência confirmada, 1+ critério depende de checagem
7. **Prioridade C quando**: <3 critérios confirmados (estacionado por enquanto)

---

## Dados mínimos capturados por empresa

```
data_pesquisa | empresa | cidade | nicho | site | fonte_url | telefone | whatsapp | 
fatos_publicos | hipotese_dor | prioridade | abertura_personalizada | status | 
data_contato | canal | houve_conversa_decisor | dor_confirmada | volume | 
processo_atual | ferramenta_atual | objecao | proxima_acao | data_retorno
```

Campos ausentes = "não verificado" (nunca adivinhar).

---

## Comando: Próxima campanha

Para ativar novo segmento:

```
Higor: "Ative a campanha: [SEGMENTO], [CIDADE/REGIÃO], [NICHO]"
```

Exemplo:
- "Ative a campanha: restaurantes, São Paulo, alta gastronomia"
- "Ative a campanha: lanches, Curitiba, sanduiches e pastéis"
- "Ative a campanha: cafés, Porto Alegre, cafeterias de especialidade"

Agente então:
1. Pesquisa segmento + local
2. Classifica A/B/C
3. Cria 3 fichas
4. Indica próxima ação

---

## Histórico de campanhas

| Campanha | Período | Segmento | Local | Status | Data Início |
|----------|---------|----------|-------|--------|---|
| Pizzarias Maringá | 19–30/10 | Pizzaria | Maringá | 🟡 Pronto, aguardando ativação | 19/10/2026 |

---

## Integração com ecossistema Avraham

Este agente cobre **Fases 1–3** (Pesquisa → Qualificação → Abordagem):

```
Agente Comercial Avraham (você está aqui)
         ↓
     Pesquisa pública (10 empresas)
     Qualificação documental (A/B/C)
     Fichas + scripts consultivos
         ↓
    Fase 4: N8n Revenue Machine
         ↓
    Fase 5: Evolution API + Disparo
         ↓
    Fase 6: CRM + Analytics
         ↓
    AI Cold Outreach (dashboard)
```

Próximas integrações: exportar leads para n8n, disparar via Evolution API (com aprovação).

---

## Próximos passos para você

1. ✅ **Estrutura de agente criada** (você está lendo)
2. ✅ **Campanha Pizzarias Maringá documentada** (10 prospects, 3 fichas, scripts)
3. ⏳ **Próximo**: Você escolhe quando ativar (ligações reais começam)
4. ⏳ **Depois**: Adicionar novos segmentos conforme necessário

---

**Dúvidas ou ajustes?** Posso:
- Pesquisar novo segmento + local
- Refinar fichas existentes
- Ajustar horários de contato
- Criar templates para próximas campanhas

Avise! 🎯
