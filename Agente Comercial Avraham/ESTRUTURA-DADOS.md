# Estrutura de Dados — Agente Comercial Avraham

**Documento de referência** para entender quais dados são capturados e como são estruturados.

---

## Campos Obrigatórios por Empresa

### Identificação Básica
```json
{
  "id": 1,
  "nome_comercial": "Don Boturi Pizzaria",
  "razao_social": "Don Boturi Pizzas LTDA",
  "cnpj": "12.345.678/0001-90",
  "pais": "Brasil",
  "estado": "PR",
  "cidade": "Maringá",
  "bairro": "Parque das Laranjeiras",
  "endereco_completo": "Avenida Mandacaru, 3000, Maringá, PR 87000-000",
  "cep": "87000-000",
  "nicho": "Pizzaria",
  "data_pesquisa": "2026-10-19"
}
```

### Canais Digitais
```json
{
  "site": {
    "url": "https://www.donboturi.com.br",
    "disponivel": true,
    "data_verificacao": "2026-10-19"
  },
  "instagram": {
    "handle": "@donboturipizzaria",
    "url": "https://www.instagram.com/donboturipizzaria",
    "seguidores": 1250,
    "ativo": true,
    "data_verificacao": "2026-10-19"
  },
  "google_maps": {
    "url": "https://maps.google.com/...",
    "avaliacoes": 4.7,
    "numero_avaliacoes": 320,
    "horarios_publicos": true,
    "data_verificacao": "2026-10-19"
  },
  "google_meu_negocio": {
    "verificado": true,
    "horarios": {
      "segunda": "18:00-23:00",
      "terca": "18:00-23:00",
      "quarta": "18:00-23:00",
      "quinta": "18:00-24:00",
      "sexta": "18:00-24:00",
      "sabado": "18:00-24:00",
      "domingo": "18:00-23:00"
    },
    "foto_capa": true,
    "data_verificacao": "2026-10-19"
  }
}
```

### Contatos
```json
{
  "contatos": [
    {
      "tipo": "whatsapp",
      "numero": "44 99999-1234",
      "codigo_pais": "+55",
      "verificado": true,
      "fonte": "Google Meu Negócio",
      "data_verificacao": "2026-10-19"
    },
    {
      "tipo": "telefone_fixo",
      "numero": "44 3222-5555",
      "codigo_pais": "+55",
      "verificado": true,
      "fonte": "Google Maps",
      "data_verificacao": "2026-10-19"
    },
    {
      "tipo": "email",
      "email": "contato@donboturi.com.br",
      "verificado": false,
      "fonte": "Site",
      "data_verificacao": "2026-10-19"
    }
  ]
}
```

### Evidências Observadas
```json
{
  "fatos_observados": [
    {
      "fato": "Oferece ~60 sabores de pizza",
      "fonte_url": "https://www.instagram.com/p/...",
      "tipo_evidencia": "Instagram",
      "data_verificacao": "2026-10-19"
    },
    {
      "fato": "Delivery ativo com WhatsApp público",
      "fonte_url": "https://maps.google.com/...",
      "tipo_evidencia": "Google Maps",
      "data_verificacao": "2026-10-19"
    },
    {
      "fato": "Aberto segunda a domingo, picos 20h-22h",
      "fonte_url": "https://maps.google.com/...",
      "tipo_evidencia": "Google Meu Negócio",
      "data_verificacao": "2026-10-19"
    },
    {
      "fato": "Avaliações positivas no Google (4.7 ⭐, 320 avaliações)",
      "fonte_url": "https://maps.google.com/...",
      "tipo_evidencia": "Google Maps",
      "data_verificacao": "2026-10-19"
    }
  ]
}
```

### Hipótese de Negócio
```json
{
  "hipotese_dor": "Cardápio extenso (~60 sabores) gera dúvidas frequentes de clientes via WhatsApp (qual sabor, se tem tal ingrediente, preço); atendimento manual em picos (20h-22h) resulta em atraso de resposta e possível perda de vendas.",
  "oportunidade": "Automação de perguntas iniciais (sabores disponíveis, preços, endereço de entrega, tempo estimado) respondidas na hora pelo bot, liberando equipe para finalizar pedidos e resolver questões complexas.",
  "volume_estimado": "40-60 pedidos/dia em picos (estimativa baseada em: 4.7★ com 320 avaliações = operação ativa)",
  "grau_confianca": "médio (dados observáveis, sem confirmação ao vivo ainda)"
}
```

### Qualificação
```json
{
  "aderencia": true,
  "canal_whatsapp": true,
  "operacao_delivery": true,
  "acesso_decisor": "não_confirmado",
  "contexto_valido": true,
  "prioridade": "B",
  "motivo_prioridade": "aderência + canal + operação confirmados; acesso a decisor precisa ser validado em ligação"
}
```

### Histórico de Contato
```json
{
  "contatos_registrados": [
    {
      "data": "2026-10-19",
      "hora": "14:30",
      "canal": "telefone",
      "resultado": "conversou_com_decisor",
      "decisor_nome": "José (dono)",
      "dor_confirmada": "perde vendas em picos, clientes esperam demais para resposta no WhatsApp",
      "volume_confirmado": "50-70 pedidos/dia, picos 20h-22h",
      "processo_manual_confirmado": true,
      "ferramenta_atual": "WhatsApp manual + Aiqfome",
      "objecao_principal": "não tem",
      "proxima_acao": "Demonstração de 15 minutos sexta-feira 14h",
      "data_retorno": "2026-10-24",
      "responsavel": "Higor"
    }
  ]
}
```

---

## Exemplo Completo em JSON

```json
{
  "id": 1,
  "nome_comercial": "Don Boturi Pizzaria",
  "razao_social": "Don Boturi Pizzas LTDA",
  "cnpj": "12.345.678/0001-90",
  "pais": "Brasil",
  "estado": "PR",
  "cidade": "Maringá",
  "bairro": "Parque das Laranjeiras",
  "endereco_completo": "Avenida Mandacaru, 3000, Maringá, PR 87000-000",
  "cep": "87000-000",
  "nicho": "Pizzaria",
  "data_pesquisa": "2026-10-19",
  
  "site": {
    "url": "https://www.donboturi.com.br",
    "disponivel": true
  },
  "instagram": {
    "handle": "@donboturipizzaria",
    "url": "https://www.instagram.com/donboturipizzaria"
  },
  "google_maps": {
    "url": "https://maps.google.com/...",
    "avaliacoes": 4.7,
    "numero_avaliacoes": 320
  },
  
  "contatos": [
    {
      "tipo": "whatsapp",
      "numero": "44 99999-1234",
      "codigo_pais": "+55",
      "verificado": true,
      "fonte": "Google Meu Negócio"
    },
    {
      "tipo": "telefone_fixo",
      "numero": "44 3222-5555",
      "verificado": true,
      "fonte": "Google Maps"
    }
  ],
  
  "fatos_observados": [
    "~60 sabores de pizza (Instagram)",
    "Delivery ativo, WhatsApp público (Google Maps)",
    "Aberto seg-dom, picos 20h-22h (Google Meu Negócio)"
  ],
  
  "hipotese_dor": "Cardápio extenso gera dúvidas frequentes; atendimento manual em picos resulta em atraso",
  "oportunidade": "Automação de perguntas iniciais + qualificação",
  
  "prioridade": "B",
  "status": "nao_abordado"
}
```

---

## Campos: O que é Obrigatório vs Opcional

| Campo | Obrigatório | Tipo | Exemplo |
|-------|---|---|---|
| `nome_comercial` | ✅ | string | "Don Boturi Pizzaria" |
| `razao_social` | ❌ | string | "Don Boturi Pizzas LTDA" |
| `cnpj` | ❌ | string | "12.345.678/0001-90" |
| `pais` | ✅ | string | "Brasil", "USA", "Portugal" |
| `estado/provincia` | ✅ | string | "PR", "SP", "CA" |
| `cidade` | ✅ | string | "Maringá", "São Paulo" |
| `endereco_completo` | ✅ | string | "Av. Mandacaru, 3000, Maringá, PR 87000-000" |
| `site` | ❌ | URL ou null | "https://..." |
| `instagram` | ❌ | URL/handle ou null | "@...", "https://instagram.com/..." |
| `google_maps` | ✅ | URL | "https://maps.google.com/..." |
| `whatsapp` | ❌ | phone ou null | "44 99999-1234" |
| `telefone_fixo` | ❌ | phone ou null | "44 3222-5555" |
| `fatos_observados` | ✅ | array | ["Delivery ativo", "Cardápio grande"] |
| `hipotese_dor` | ✅ | string | "Atendimento manual em picos..." |
| `prioridade` | ✅ | "A" ou "B" ou "C" | "B" |

**Campos ausentes devem ser `null` ou `"não encontrado"`, NUNCA adivinhar.**

---

## Ferramentas de Enriquecimento Disponíveis

### 1. **Google Maps + Google Meu Negócio**
- Buscar: endereço, telefone, horários, avaliações, site, Instagram
- Tempo: ~1 min por empresa
- Resultado: muito rico, confiável

### 2. **Scrapling** (Web Scraping Automático)
- Disponível via skill `scrapling`
- Uso: raspar dados de Google Maps, diretórios, plataformas locais
- Tempo: ~2–5 min por empresa
- Resultado: enriquecimento automático

### 3. **CNPJ (Brasil apenas)**
- Bases públicas: CNPJMe, Receita Federal, Jucergs, etc
- Uso: validar razão social, CNPJ, sócio
- Tempo: ~1 min por empresa
- Resultado: dados oficiais

### 4. **Instagram / Facebook**
- Busca manual ou automática
- Informações: handle, follower count, últimas postagens
- Tempo: ~1 min por empresa
- Resultado: presença digital confirmada

### 5. **Diretórios Locais** (por país)
- Brasil: Telelistas, Guia Fácil, Apontador, iFood, Ifood
- USA: Yelp, Yellow Pages, Google Maps
- Mundo: LocalStack, TomTom, OpenStreetMap
- Tempo: ~2 min por empresa
- Resultado: validação de dados

---

## Quando Usar Qual Ferramenta

| Situação | Ferramenta | Tempo |
|----------|-----------|-------|
| Buscar telefone + horários | Google Maps | 1 min |
| Validar CNPJ + razão social | CNPJMe (Brasil) | 1 min |
| Confirmar Instagram + seguidores | Instagram search | 1 min |
| Raspar 10 empresas de vez | Scrapling | 5–10 min |
| Validar múltiplas fontes | Combinação das acima | 3–5 min |

---

## Exemplo de Pesquisa Completa (5–7 minutos)

**Entrada**: "Don Boturi Pizzaria, Maringá, PR"

**Processo**:
1. Google Maps busca: "Don Boturi Pizzaria Maringá" → link, endereço, telefone, horários, avaliações (1 min)
2. Google Meu Negócio: clica no link → confirma horários públicos, WhatsApp (1 min)
3. Instagram: busca "@donboturi" → verifica atividade, conta (1 min)
4. Site: se encontrou, acessa rapidamente (1 min)
5. CNPJ (opcional): busca CNPJMe por nome (1 min)
6. Compilar em JSON + marcar "verificado" (1 min)

**Total**: 5–7 minutos para 1 empresa com dados completos

---

## Versioning: Dados Mudam

Campos importantes:
- `data_verificacao`: quando foi checado
- `data_atualizacao`: quando foi atualizado último
- `versao`: qual versão do schema

Exemplo:
```json
{
  "whatsapp": {
    "numero": "44 99999-1234",
    "data_verificacao": "2026-10-19",
    "versao": "1.2",
    "nota": "Atualizado: número mudou em 2026-10-25"
  }
}
```

---

## Multi-País: Adaptações

### Brasil
- CNPJ obrigatório (se possível)
- Google Meu Negócio bastante preciso
- Diretórios: Telelistas, Guia Fácil

### USA
- EIN/DUNS obrigatório (se possível)
- Yelp + Google Maps
- Yellow Pages

### Portugal
- Número de Pessoa Colectiva (NPC)
- Google Maps
- Diretórios locais

### Resto do Mundo
- Adaptar conforme país
- Google Maps sempre funciona
- Diretórios locais + redes sociais

---

**Versão**: 1.0 | **Data**: 19/10/2026  
**Próxima revisão**: Após primeira campanha com enriquecimento completo
