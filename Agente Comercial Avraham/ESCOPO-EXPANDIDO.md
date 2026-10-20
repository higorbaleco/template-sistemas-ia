# Escopo Expandido — v1.1 do Agente Comercial Avraham

**Data**: 19/10/2026 | **Atualização**: Incluindo multi-país, enriquecimento de dados e Scrapling

---

## O que Mudou da v1.0 para v1.1

### v1.0 (Inicial)
- ✅ Pesquisa manual de empresas
- ✅ Classificação A/B/C simples
- ✅ 3 fichas de prospecção
- ✅ Scripts de ligação
- ✅ Focado em pizzarias Maringá

### v1.1 (Expandido) — AGORA
- ✅ **Pesquisa enriquecida** (telefone, Instagram, CNPJ, horários, site)
- ✅ **Scrapling automático** (10+ empresas de uma vez)
- ✅ **Multi-país** (Brasil, USA, Portugal, qualquer país)
- ✅ **7 segmentos mapeados** (pizzaria, lanchonete, restaurante, açaí, café, sushi, farmácia)
- ✅ **Estrutura de dados robusta** (não só nome + endereço)
- ✅ **Escalável** (1 empresa ou 1000 empresas, funciona igual)

---

## Dados Agora Capturados

Para cada empresa você terá:

| Campo | v1.0 | v1.1 | Fonte |
|-------|------|------|-------|
| Nome comercial | ✅ | ✅ | Google Maps |
| Razão social | ❌ | ✅ | CNPJ público |
| CNPJ | ❌ | ✅ | CNPJMe (Brasil) |
| Endereço | ✅ | ✅ | Google Maps |
| Site | ❌ | ✅ | Google Meu Negócio / Manual |
| Instagram | ❌ | ✅ | Scraping automático |
| Google Maps | ❌ | ✅ | Link verificado |
| Telefone fixo | ❌ | ✅ | Google Meu Negócio |
| WhatsApp | ✅ | ✅ | Google Meu Negócio / Instagram |
| Horários | ❌ | ✅ | Google Meu Negócio |
| Avaliações | ❌ | ✅ | Google Maps |
| Fatos observados | ✅ | ✅ | Multi-fonte |
| Hipótese de dor | ✅ | ✅ | Análise consultiva |

---

## Processo: De v1.0 para v1.1

### v1.0: Manual
```
1. Buscar "pizzaria Maringá" no Google
2. Anotar nomes e endereços
3. Compilar em lista
4. Criar fichas
Tempo: 30–45 min para 10 empresas
```

### v1.1: Enriquecido + Scrapling
```
1. Defina escopo: segmento, local, dados desejados
2. Execute Scrapling (automático)
3. Valide resultados (5 min)
4. Compile em JSON enriquecido (automático)
5. Gere 3 fichas com todos os dados
Tempo: 5–15 min para 10 empresas (10x mais rápido!)
```

---

## Novo Fluxo de Ativação

### Antes (v1.0)
```
Higor: "Monte minha prospecção de pizzarias Maringá"
         ↓
Agente: pesquisa manual, anota, cria 3 fichas
         ↓
Tempo: 45–60 min
```

### Agora (v1.1)
```
Higor: "Ative a campanha: pizzarias, Maringá, Brasil
       Use Scrapling para dados completos:
       - telefone, WhatsApp, Instagram, CNPJ, horários"
         ↓
Agente: executa Scrapling + enriquece + gera fichas + indica próxima ação
         ↓
Tempo: 10–15 min
```

---

## Novo Exemplo: Restaurantes São Paulo (Multi-País)

### Input
```
Segmento: Restaurantes
Local: São Paulo, SP, Brasil
Quantidade: 20
Dados: telefone, WhatsApp, Instagram, site, horários, avaliações
Prioridade: delivery ativo, alta gastronomia
```

### Processo (v1.1)
```
1. Scrapling busca "restaurante delivery São Paulo" no Google Maps
2. Coleta: endereço, telefone, horários, avaliações, Instagram
3. Verifica: cada um tem delivery confirmado
4. Enriquece: busca CNPJ em base pública
5. Compila: JSON com 20 restaurantes
6. Gera: 3 fichas melhores
7. Indica: qual ligar primeiro
```

**Tempo**: 15–20 min  
**Resultado**: 20 restaurantes com dados completos prontos para ligação

---

## Novo Exemplo: Multi-País

### Pizzarias Maringá, Brasil
```json
{
  "pais": "Brasil",
  "cidade": "Maringá",
  "estado": "PR",
  "cnpj": "12.345.678/0001-90",
  "whatsapp": "+55 44 99999-1234",
  "telefone": "+55 44 3222-5555"
}
```

### Pizzerias Barcelona, Espanha
```json
{
  "pais": "Espanha",
  "cidade": "Barcelona",
  "provincia": "Cataluña",
  "nif": "A12345678",
  "whatsapp": "+34 93 1234567",
  "telefone": "+34 93 1234567"
}
```

### Pizza Shops New York, USA
```json
{
  "pais": "USA",
  "cidade": "New York",
  "estado": "NY",
  "ein": "12-3456789",
  "whatsapp": "+1 212 555-1234",
  "telefone": "+1 212 555-1234"
}
```

**Mesmo processo, dados adaptados por país.**

---

## Capacidades Novas

### 1. Enriquecimento em Massa
```
Uma campanha agora pode ter:
- 10 empresas (pequeno teste)
- 100 empresas (campanha média)
- 1000+ empresas (expansão nacional)

Sem limite de quantidade.
```

### 2. Scrapling Automático
```
Antes: "Procure em Google Maps"
Agora: "Execute Scrapling [ESCOPO]"

Resultado: dados em JSON estruturado, pronto para usar.
```

### 3. Multi-Fonte
```
Cada dado tem:
- Valor (ex: "44 99999-1234")
- Fonte (ex: "Google Meu Negócio")
- Data de verificação (ex: "2026-10-19")
- Status (ex: "verificado: true")

Você sabe exatamente onde cada número veio.
```

### 4. Integração com Estrutura de Dados
```
Agora usando: ESTRUTURA-DADOS.md

Todos os campos padronizados, versionados, datados.
JSON é estruturado, não é livre.
```

---

## Novos Arquivos Criados

```
Agente Comercial Avraham/
├── ESTRUTURA-DADOS.md (esquema completo de campos)
├── SCRAPLING-GUIA.md (como usar web scraping)
├── ESCOPO-EXPANDIDO.md (este arquivo — mudanças v1.0 → v1.1)
└── ... (demais arquivos anteriores)
```

---

## Quando Usar Cada Abordagem

### Pesquisa Manual (1–5 empresas)
```
- Higor já conhece o segmento
- Poucas empresas para validar
- Tempo: 15–30 min
- Exemplo: "Pesquise esta pizzaria: [nome/link]"
```

### Pesquisa com Scrapling (10–100 empresas)
```
- Campanha nova para segmento
- Múltiplas empresas em uma cidade
- Tempo: 15–30 min para 10–50 empresas
- Exemplo: "Ative campanha: pizzarias Maringá
           Use Scrapling para 10 empresas"
```

### Expansão Geográfica (100+ empresas)
```
- Múltiplas cidades/estados
- Replicar segmento em novo mercado
- Tempo: 1–2h para setup, depois automático
- Exemplo: "Expanda pizzarias para: SP, RJ, MG, RS"
```

---

## Novos Comandos Disponíveis

```
"Ative a campanha: [SEGMENTO], [CIDADE], [PAIS]"
Exemplo: "Ative a campanha: pizzarias, Maringá, Brasil"

"Use Scrapling para enriquecer: [ESCOPO]"
Exemplo: "Use Scrapling para enriquecer restaurantes São Paulo com CNPJ e Instagram"

"Expanda [SEGMENTO] para: [CIDADES/ESTADOS]"
Exemplo: "Expanda pizzarias para São Paulo, Curitiba e Brasília"

"Pesquise esta empresa: [NOME/LINK]"
Exemplo: "Pesquise esta empresa: https://maps.google.com/..."
```

---

## Comparação: Antes vs Depois

| Aspecto | v1.0 | v1.1 |
|---------|------|------|
| **Países suportados** | 1 (Brasil) | Ilimitado |
| **Tempo/empresa** | 3 min | 1–2 min |
| **Dados capturados** | 5 campos | 12+ campos |
| **Automação** | Nenhuma | Scrapling total |
| **Escalabilidade** | 10 empresas | 1000+ empresas |
| **Qualidade de dados** | Básica | Rich (multi-fonte) |
| **Verificabilidade** | Parcial | Total (data + fonte) |
| **Multi-segmento** | 7 mapeados | 7 + customizable |
| **Integração CRM** | Manual JSON | JSON estruturado |

---

## Roadmap Futuro

### Curto prazo (próximas 2 semanas)
- ✅ Executar campanha Pizzarias Maringá com enriquecimento
- ✅ Testar Scrapling em múltiplas cidades
- ✅ Validar dados antes de integrar com n8n

### Médio prazo (próximas 4 semanas)
- Integrar com n8n Revenue Machine (importar leads qualificados)
- Disparar mensagens via Evolution API (com aprovação)
- Registrar resultados em CRM centralizado

### Longo prazo (próximos 3 meses)
- Automação 100% (Higor ativa, agente pesquisa + qualifica + enfileira)
- Dashboard de analytics (taxa de contato, qualificação, conversão)
- Modelo de preço validado com primeiros clientes

---

## Benefício Principal

**De**: Higor gastando 45 min pesquisando manualmente  
**Para**: Agente pesquisando + enriquecendo em 10 min, Higor ligando direto

**Economia**: 35 min × 5 empresas/semana = ~2h30 por semana liberadas para ligar

---

**Versão**: 1.1 | **Data**: 19/10/2026  
**Status**: Documentação expandida, pronto para executar campanhas em escala
