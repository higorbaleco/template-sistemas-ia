# Sistema de Prospecção Automatizada
## Arquitetura completa com Claude Extension, Automações e Google Sheets

---

## 1. PESQUISADOR WEB (Claude Extension)
**ID:** PROSP-001  
**Tipo:** Skill para Extensão Claude  
**Objetivo:** Extrair dados de prospect de websites, LinkedIn, CrunchBase

### Quando usar
- Usuário está em website da empresa
- Usuário está em perfil LinkedIn
- Usuário clica no ícone da extensão

### Dados a extrair
```json
{
  "empresa": {
    "nome": "",
    "site": "",
    "linkedin_url": "",
    "segmento": "",
    "tamanho": "",
    "localizacao": "",
    "ano_fundacao": ""
  },
  "contato": {
    "nome": "",
    "cargo": "",
    "email": "",
    "linkedin_profile": "",
    "telefone": ""
  },
  "indicators": {
    "funded_recently": false,
    "hiring": false,
    "recent_news": [],
    "tech_stack": []
  },
  "source": "linkedin|website|crunchbase",
  "data_coletada": ""
}
```

### Prompt Operacional
```
Você atuará como Pesquisador de Prospects.

Página atual: {{url_pagina}}
Contexto: {{contexto_visivel}}

Extraia:
1. Dados da empresa (nome, site, segmento, tamanho, localização)
2. Dados do contato (nome, cargo, email, LinkedIn)
3. Indicadores de fit (recente captação, contratando, notícias, tech stack)
4. Fonte de dados

Formato JSON estruturado.

Regras:
- Não inventar dados
- Marcar lacunas como null
- Extrair URLs completas
- Formato de email validável (user@domain.com)
- Data no formato ISO 8601
```

---

## 2. NORMALIZADOR DE DADOS (Automação/Zapier → Sheets)
**ID:** PROSP-002  
**Tipo:** Prompt para normalização  
**Entrada:** JSON bruto do pesquisador  
**Saída:** Linha estruturada no Google Sheets

### Campos no Sheets
```
| data_coletada | empresa | segmento | cargo | email | fit_score | fase | prioridade | fonte |
```

### Prompt
```
Você atuará como Normalizador de Dados de Prospect.

Dados brutos:
{{dados_json}}

Normalize:
1. Nome da empresa (remover "Inc", "LLC", etc)
2. Email: valide formato
3. Segmento: mapeie para categoria padrão (SaaS, Ecommerce, Manufatura, etc)
4. Cargo: normalize (CEO, CTO, VP, Manager, etc)
5. Fit score: 0-10 baseado em:
   - Tamanho da empresa (ideal: 10-500 pessoas)
   - Segmento relevante
   - Indicadores de crescimento
6. Fase: LEAD_QUALIFICADO, EM_PESQUISA, DESCARTADO
7. Prioridade: HOJE, ESTA_SEMANA, SEM_PRESSA

Output: JSON estruturado pronto para Sheets

Regras:
- Não inventar dados
- Marcar confiança para cada campo
- Se email não encontrado, tentar sugerir formato padrão (firstname@company.com)
```

---

## 3. QUALIFICADOR MEDDPICC (Análise Inteligente)
**ID:** PROSP-003  
**Tipo:** Agente de qualificação  
**Entrada:** Dados normalizados + pesquisa adicional  
**Saída:** Score MEDDPICC + recomendação de ação

### Framework MEDDPICC
- **M**etrics: Qual métrica o prospect quer melhorar?
- **E**conomic Buyer: Quem tem poder de compra?
- **D**ecision Criteria: Quais são os critérios de decisão?
- **D**ecision Process: Como é o processo?
- **P**aper Process: Há burocracia? Assinatura? Aprovações?
- **I**mplication Questions: Qual o impacto do problema?
- **C**onsequences: Qual o custo de não resolver?
- **C**hampion: Há alguém dentro que nos apoiará?

### Prompt
```
Você atuará como Qualificador MEDDPICC.

Prospect: {{empresa}}
Cargo: {{cargo}}
Segmento: {{segmento}}
Contexto: {{dados_pesquisador}}

Analise:

1. METRICS
   Pergunta: Qual métrica {{cargo}} está tentando melhorar?
   Hipótese baseada em: [segmento, cargo, tamanho]
   Confiança: alta|média|baixa

2. ECONOMIC BUYER
   Quem tem poder orçamentário?
   Alternativa se {{cargo}} não for: 
   Próximo contato: [cargo sugerido]

3. DECISION CRITERIA
   Critérios prováveis:
   - ROI/Payback
   - Integração
   - Suporte
   - Preço
   
4. DECISION PROCESS
   Duração típica: 30|60|90|180 dias
   Stakeholders envolvidos: [quantidade estimada]

5. PAPER PROCESS
   Contrato: Está preparado?
   Aprovações: Quantos níveis?

6. IMPLICATION QUESTIONS
   Pergunta de abertura: "O que acontece se {{problema}} continuar?"

7. CONSEQUENCES
   Custo anual de não resolver: Estimativa

8. CHAMPION
   Já temos? SIM/NÃO
   Se não, quem seria mais provável: [perfil]

Score final: 0-100 baseado em:
- Fit com ICP: +30
- Indicadores de crescimento: +20
- Acesso a Economic Buyer: +25
- Urgência aparente: +25

Recomendação de ação:
- QUALIFICADO: Enviar abordagem personalizada
- EM_PESQUISA: Pesquisar mais antes de contato
- DESCARTADO: Por quê?
```

---

## 4. GERADOR DE ABORDAGEM PERSONALIZADA
**ID:** PROSP-004  
**Tipo:** Prompt de copy  
**Entrada:** Dados normalizados + Score MEDDPICC  
**Saída:** Mensagem pronta para LinkedIn/Email/WhatsApp

### Prompt
```
Você atuará como Redator de Prospecção.

Prospect:
- Empresa: {{empresa}}
- Cargo: {{cargo}}
- Contexto: {{contexto_pesquisador}}

Qualificação MEDDPICC:
- Métrica relevante: {{metrica}}
- Score: {{score}}
- Champion disponível: {{tem_champion}}

Crie abordagem por canal:

### LinkedIn
Máximo 300 caracteres na conexão.
Tom: Profissional, específico, valor claro.
Estrutura:
1. Referência concreta (notícia, mudança, contratação)
2. Dor relevante para {{cargo}}
3. Prova social (case similar)
4. CTA leve: conectar para conversa

### Email
Assunto: <50 caracteres
Corpo: <150 palavras
Tom: Consultivo, sem pitch
Estrutura:
1. Abertura: por que estou contatando {{nome}}
2. Contexto: empresa similar que resolveu {{problema}}
3. Pergunta: "Você enfrenta algo parecido?"
4. CTA: agendar 15min

### WhatsApp
Máximo 3 mensagens curtas.
Tom: Casual, direto
Estrutura:
1. "Oi {{nome}}, vi seu perfil em [LinkedIn/site]"
2. "Ajudamos empresas como {{empresa}} a [resultado]"
3. "Seria interessante conversar?"

Regras:
- Sem promessa não comprovada
- Referência verificável obrigatória
- CTA específica e baixa fricção
- Sem elogio genérico
```

---

## 5. WORKFLOW DE AUTOMAÇÃO (Zapier/N8N)
**ID:** PROSP-005  
**Tipo:** Workflow  
**Fluxo:** Extensão Claude → Zapier → Sheets → Automação de follow-up

### Etapas

**Etapa 1: Trigger - Dados da Extensão**
- Forma: Extensão Claude envia JSON para webhook
- Campo: dados_json (como definido em PROSP-001)

**Etapa 2: Normalização**
- Ferramenta: Claude API (via Zapier)
- Prompt: PROSP-002
- Output: Dados normalizados em JSON

**Etapa 3: Adicionar ao Sheets**
- Ferramenta: Google Sheets
- Campos:
  ```
  A: Data Coletada
  B: Empresa
  C: Segmento
  D: Nome
  E: Cargo
  F: Email
  G: LinkedIn
  H: Status (pendente_qualificacao)
  I: Fit Score
  J: Data_Adicao
  ```

**Etapa 4: Qualificar (Diário)**
- Tempo: Todos os dias às 9am
- Filtro: Status = "pendente_qualificacao"
- Prompt: PROSP-003
- Update Sheets:
  ```
  K: MEDDPICC Score
  L: Recomendacao (QUALIFICADO, EM_PESQUISA, DESCARTADO)
  M: Motivo
  H: Status (atualizado)
  ```

**Etapa 5: Gerar Abordagem**
- Trigger: Status = "QUALIFICADO"
- Prompt: PROSP-004
- Campos novos no Sheets:
  ```
  N: Abordagem_LinkedIn
  O: Abordagem_Email_Assunto
  P: Abordagem_Email_Corpo
  Q: Abordagem_WhatsApp
  ```

**Etapa 6: Agendar Follow-up**
- Se QUALIFICADO:
  - Criar lembrte para contato manual
  - Ou disparo automático (se autorizado)
- Se EM_PESQUISA:
  - Agendar re-qualificação em 7 dias
  - Pesquisa adicional automática
- Se DESCARTADO:
  - Arquivar/mover para aba "Descartados"

---

## 6. ESTRUTURA DO GOOGLE SHEETS
**ID:** PROSP-006  
**Tipo:** Schema

### Abas
1. **PROSPECTOS_ATIVOS** - Pipeline principal
2. **DESCARTADOS** - Por quê não qualifica
3. **CONVERTIDOS** - Leads que viraram oportunidades
4. **ANALISE** - Dashboard com filtros

### Colunas (PROSPECTOS_ATIVOS)
```
A: Data_Coletada (date)
B: Empresa (text)
C: Segmento (dropdown: SaaS, Ecommerce, Manufatura, Consultoria, Outro)
D: Nome_Contato (text)
E: Cargo (text)
F: Email (email)
G: LinkedIn_URL (url)
H: Website (url)
I: Status (dropdown: Pendente, Qualificado, Em_Pesquisa, Descartado, Contato_Enviado)
J: Fit_Score (number 0-10)
K: MEDDPICC_Score (number 0-100)
L: Recomendacao (text)
M: Motivo_Descarte (text)
N: Abordagem_LinkedIn (text)
O: Email_Assunto (text)
P: Email_Corpo (text)
Q: WhatsApp_Mensagem (text)
R: Data_Proximo_Contato (date)
S: Notas (text)
T: Criado_Por (text - username)
U: Ultima_Atualizacao (date)
```

### Validações
- Email: padrão válido
- Score: 0-100
- Status: apenas valores pré-definidos
- Segmento: apenas valores pré-definidos

### Filtros e Views
- View "Hoje": Status = Pendente, Data_Proximo_Contato = Hoje
- View "Priority": Fit_Score >= 7, Status = Qualificado
- View "Descartados": Status = Descartado (oculta por padrão)

---

## 7. INTEGRAÇÃO COMPLETA
**ID:** PROSP-007  
**Tipo:** Diagrama de fluxo

```
┌─────────────────────────────────────────────────────┐
│ Usuário usa Extensão Claude em LinkedIn/Website    │
└─────────────┬───────────────────────────────────────┘
              │
              ▼
        ┌──────────────┐
        │ PROSP-001:   │
        │ Pesquisador  │
        │ Extrai dados │
        └──────┬───────┘
               │ JSON
               ▼
        ┌──────────────────┐
        │ Zapier Webhook   │
        │ Recebe JSON      │
        └──────┬───────────┘
               │
               ▼
        ┌──────────────┐
        │ PROSP-002:   │
        │ Normaliza    │
        └──────┬───────┘
               │
               ▼
    ┌──────────────────────┐
    │ Google Sheets        │
    │ Adiciona linha       │
    │ Status: Pendente     │
    └──────┬───────────────┘
           │
      [Diariamente 9am]
           │
           ▼
    ┌──────────────┐
    │ PROSP-003:   │
    │ MEDDPICC     │
    │ Qualifica    │
    └──────┬───────┘
           │
      ┌────┴────┬───────────┐
      │          │           │
   QUALIF    PESQUISA    DESCARTADO
      │          │           │
      ▼          ▼           ▼
   Abord.    Re-qual.     Arquiva
   (004)      em 7d
      │
      ▼
   Aguardando
   contato manual
```

---

## 8. PROMPTS PRONTOS PARA COPIAR

### Prompt 1: Pesquisador (Extensão)
```
Você atuará como Pesquisador de Prospects especializado em extração de dados.

Informações disponíveis:
- URL da página: {{url_pagina}}
- Conteúdo visível: {{conteudo_pagina}}
- Metadados do site: {{meta_tags}}

Extraia em JSON:

{
  "empresa": {
    "nome": "[obrigatório]",
    "site": "[URL do site]",
    "linkedin_url": "[URL da página company]",
    "segmento": "[SaaS, Ecommerce, Manufatura, etc]",
    "tamanho": "[1-10, 11-50, 51-200, 201-500, 500+]",
    "localizacao": "[País ou Cidade]",
    "ano_fundacao": "[AAAA]"
  },
  "contato": {
    "nome": "[se visível]",
    "cargo": "[se visível]",
    "email": "[se visível, validar formato]",
    "linkedin_profile": "[URL se visível]",
    "telefone": "[se visível]"
  },
  "indicators": {
    "funded_recently": "[true/false + data/noticia]",
    "hiring": "[true/false + vagas abertas]",
    "recent_news": ["[notícias, aquisições, parcerias]"],
    "tech_stack": ["[tecnologias identificadas]"]
  },
  "confianca": {
    "empresa": "alta|media|baixa",
    "contato": "alta|media|baixa",
    "indicators": "alta|media|baixa"
  },
  "source": "linkedin|website|crunchbase|outro",
  "data_coletada": "[ISO 8601]",
  "notas": "[qualquer contexto adicional]"
}

Regras obrigatórias:
1. Não inventar dados
2. Marcar confiança para cada seção
3. Se não encontrar, deixar null (não preencher aleatoriamente)
4. Email deve estar em formato validável: user@domain.com
5. URLs completas com https://
6. Datas em AAAA-MM-DD ou null
```

### Prompt 2: Normalizador
```
Você atuará como Normalizador de Dados de Prospect.

JSON bruto recebido:
{{dados_json_bruto}}

Normalize os seguintes campos:

1. EMPRESA
   - Remover sufixos (Inc, LLC, Ltd, S.A., etc)
   - Padronizar maiúsculas
   - Remover caracteres especiais desnecessários
   Exemplo: "ACME Inc." → "Acme"

2. SEGMENTO
   Mapear para: SaaS | Ecommerce | Manufatura | Consultoria | Healthcare | Educação | Financeiro | Varejo | Outro
   Baseado em: descrição, site, produtos

3. CARGO
   Normalizar para: 
   - C-Level (CEO, CFO, CTO, COO, CMO)
   - VP / Director
   - Manager / Head
   - Specialist / Analyst
   - Founder / Solo
   
4. EMAIL
   - Validar formato (user@domain.com)
   - Se ausente, sugerir padrão: firstname.lastname@company.com
   - Marcar "sugerido" vs "confirmado"

5. TAMANHO DA EMPRESA
   Categorizar: 1-10 | 11-50 | 51-200 | 201-500 | 500+

6. FIT_SCORE
   Calcular 0-10 baseado em:
   
   +2: Tamanho empresa 11-500
   +1: Segmento relevante [fornecedor de oferta]
   +2: Cargo é Economic Buyer (CEO, CFO, VP)
   +2: Indicador de crescimento (hiring, funding, notícias)
   +1: Email confirmado
   +1: LinkedIn confirmado
   +1: Localização compatível
   
   Resultado: Soma dos pontos (máx 10)

7. FASE
   - LEAD_QUALIFICADO: Fit >= 7
   - EM_PESQUISA: Fit 4-6
   - DESCARTADO: Fit <= 3 ou dados insuficientes

8. PRIORIDADE
   - HOJE: Fit >= 8 AND Economic Buyer confirmado
   - ESTA_SEMANA: Fit >= 7
   - SEM_PRESSA: Fit 4-6

Output JSON:
{
  "empresa": "{{normalizado}}",
  "segmento": "{{categoria}}",
  "cargo": "{{normalizado}}",
  "email": {
    "valor": "{{email@domain.com}}",
    "tipo": "confirmado|sugerido",
    "valido": true|false
  },
  "tamanho": "{{faixa}}",
  "fit_score": {{0-10}},
  "fase": "LEAD_QUALIFICADO|EM_PESQUISA|DESCARTADO",
  "prioridade": "HOJE|ESTA_SEMANA|SEM_PRESSA",
  "dados_originais_preservados": {{objeto_original}},
  "timestamp": "{{ISO8601}}"
}
```

### Prompt 3: MEDDPICC
```
Você atuará como Qualificador MEDDPICC de Prospects.

Dados do prospect:
{
  "empresa": "{{empresa}}",
  "cargo": "{{cargo}}",
  "segmento": "{{segmento}}",
  "tamanho": "{{tamanho}}",
  "indicadores": {{indicadores}}
}

Contexto da oferta:
- Solução: {{solucao}}
- ICP ideal: {{icp}}
- Principais benefícios: {{beneficios}}
- Preço típico: {{preco}}

Análise MEDDPICC:

## 1. METRICS (Métrica que quer melhorar)
- Hipótese para {{cargo}} em {{segmento}}: 
  [baseado no cargo: se CFO = reduzir custos; se CMO = aumentar leads, etc]
- Métrica específica: [revenue, churn, customer acquisition cost, etc]
- Confiança: alta|média|baixa
- Evidência: [por quê acredita nisso]

## 2. ECONOMIC BUYER (Quem tem poder de compra)
- Cargo atual é Economic Buyer? SIM/NÃO
- Se não, quem é mais provável? [CEO, CFO, Head of]
- Como acessá-lo? [através de {{cargo}} atual, LinkedIn, outro]
- Dificuldade de acesso: Fácil|Média|Difícil

## 3. DECISION CRITERIA (Critérios de decisão)
Prováveis critérios para {{cargo}} em {{segmento}}:
- ROI / Payback period
- Integração com sistemas existentes
- Segurança / Compliance
- Suporte e implementação
- Preço
- Reputação do vendor
- Escalabilidade

Ordene por importância: [1º, 2º, 3º...]

## 4. DECISION PROCESS (Como é o processo)
- Duração típica: 30|60|90|180+ dias
- Quem mais está envolvido? [IT, Compliance, Finance, etc]
- Tem comitê de aprovação? Provável SIM/NÃO
- Quantas aprovações precisam? [estimativa]
- Há ciclo orçamentário? [Q1, Q2, etc]

## 5. PAPER PROCESS (Burocracia)
- Contrato padrão: Cliente usa seu? SIM/NÃO
- Cláusulas comuns em {{segmento}}: [SLA, indemnification, etc]
- MSA (Master Service Agreement)? Provável
- Aprovações jurídicas? SIM/NÃO
- Tempo estimado de negociação legal: [dias/semanas]

## 6. IMPLICATION QUESTIONS (Perguntas que revelam impacto)
3-5 perguntas que {{cargo}} deveria fazer a si mesmo:

1. "O que acontece se {{problema}} continuar sem resolver?"
2. "Qual é o custo anual dessa ineficiência?"
3. "Como isso impacta [métrica importante para esse cargo]?"
4. "Quem mais na empresa é afetado?"
5. "Por quanto tempo isso pode continuar assim?"

## 7. CONSEQUENCES (Consequências do não-fazer)
- Custo anual da inação: [estimativa]
- Impacto em revenue: [+/- X%]
- Risco competitivo: Alto|Médio|Baixo
- Turnover de time: Risco SIM/NÃO
- Oportunidades perdidas: [número/valor]

## 8. CHAMPION (Defensor interno)
- Já temos um? SIM/NÃO
- Se não, quem seria mais provável baseado em:
  - Impacto pessoal [quem sofre com o problema]
  - Poder político [quem influencia]
  - Motivação [bônus, promoção, facilidade]
  
Candidatos:
1. [Cargo]: [por quê]
2. [Cargo]: [por quê]

## SCORE FINAL

Cálculo:
- Fit com ICP: {{1-30}} pontos
- Indicadores de crescimento: {{0-20}} pontos
- Acesso a Economic Buyer: {{0-25}} pontos
- Urgência aparente: {{0-25}} pontos

Score: {{0-100}}

## RECOMENDAÇÃO

Se Score >= 75:
"QUALIFICADO - Enviar abordagem personalizada imediatamente"

Se Score 50-74:
"PROMISSOR - Pesquisar mais antes de contato. Focar em: [o quê]"

Se Score < 50:
"DESCARTADO - Motivo principal: [qual/por quê]"
```

### Prompt 4: Abordagem Personalizada
```
Você atuará como Redator Consultivo de Prospecção.

Dados do prospect:
- Empresa: {{empresa}}
- Nome: {{nome}}
- Cargo: {{cargo}}
- Email: {{email}}
- Segmento: {{segmento}}
- Fit Score: {{fit_score}}
- MEDDPICC Score: {{meddpicc_score}}

Oferta:
- Solução: {{solucao}}
- Benefício principal: {{beneficio_principal}}
- Case similar: {{empresa_caso_similar}} ({{resultado_caso}})

Crie 3 variações de abordagem:

---

### ABORDAGEM 1: LINKEDIN

**Restrição:** Máximo 300 caracteres na conexão

Oi {{nome}},

[Abertura específica: notícia, contratação ou padrão identitário]

Ajudamos [tipo empresa] como {{empresa}} a [benefício principal em 1 linha].

Recentemente [case similar] conseguiu [resultado] com [abordagem].

Vale conversar 15 min? 

[Seu nome]

---

### ABORDAGEM 2: EMAIL

**Assunto:** [máximo 50 caracteres - TESTE 3 variações]

Opção A: [curiosidade + número]
Opção B: [dor específica para esse cargo]
Opção C: [contexto + resultado]

**Corpo:** [máximo 150 palavras]

Oi {{nome}},

[Parágrafo 1 - Por que estou contatando]
Vi que {{empresa}} está [expansão|contratação|lançamento]. {{cargo}} geralmente está focado em [métrica relevante].

[Parágrafo 2 - Contexto de solução]
Trabalhamos com [X empresas similares] em {{segmento}}. {{empresa_caso}} enfrentava [problema] e conseguiu [resultado] em [tempo].

[Parágrafo 3 - Pergunta baixa fricção]
Você enfrenta algo parecido com [dor específica]?

[CTA]
Podemos falar 15 minutos? [link calendário]

Abs,
[Seu nome]

---

### ABORDAGEM 3: WhatsApp

**Estrutura:** 3 mensagens curtas (NÃO 1 gigante)

Msg 1 (contexto):
"Oi {{nome}}, vi seu perfil e vi que você está em {{empresa}}.
Estou conectado com outros [cargo/função] no segmento de {{segmento}}."

Msg 2 (valor):
"Ajudamos empresas como {{empresa}} a [benefício].
{{empresa_caso}} conseguiu [resultado] em [tempo]."

Msg 3 (CTA):
"Seria interessante conversar? Tenho 15 min amanhã entre 14-16h?"

---

## REGRAS OBRIGATÓRIAS

✗ Não copie exatamente - adapte ao estilo
✗ Sem promessa não comprovada
✗ Referência verificável obrigatória (case real)
✗ Sem elogio genérico ("Vi que sua empresa é incrível")
✗ CTA específica (data/hora, link, ação exata)
✗ Sem travessão em listas
✗ Tom consultivo, não vendedor

## OUTPUT

Forneça as 3 abordagens em JSON:

{
  "linkedin": "{{mensagem}}",
  "email": {
    "assunto_opcao_a": "...",
    "assunto_opcao_b": "...",
    "assunto_opcao_c": "...",
    "corpo": "{{texto_email}}"
  },
  "whatsapp": [
    "{{msg1}}",
    "{{msg2}}",
    "{{msg3}}"
  ],
  "notas_implementacao": {
    "timing": "{{recomendação de quando enviar}}",
    "canal_prioritario": "{{LinkedIn|Email|WhatsApp}}",
    "motivo": "{{por quê esse canal primeiro}}"
  }
}
```

---

## COMO IMPLEMENTAR

### Passo 1: Extensão Claude
1. Usuário clica ícone da extensão em website/LinkedIn
2. Extensão coleta page content via DOM
3. Envia ao Zapier webhook com dados

### Passo 2: Zapier Automation
1. **Trigger:** Webhook recebe dados
2. **Action 1:** Call OpenAI/Claude API com PROSP-002
3. **Action 2:** Add row to Google Sheets
4. **Action 3:** Schedule daily task para 9am

### Passo 3: Daily Qualification (9am)
1. **Trigger:** Horário (9am EST)
2. **Filter:** Sheet rows onde Status = "Pendente"
3. **Action 1:** Para cada row, chamar Claude com PROSP-003
4. **Action 2:** Atualizar Sheets com Score e Recomendação
5. **Action 3:** Se QUALIFICADO, chamar PROSP-004
6. **Action 4:** Atualizar coluna "Abordagem_*"

### Passo 4: Usuário revisa no Sheets
1. Filtro: Status = QUALIFICADO E Prioridade = HOJE
2. Copia texto de abordagem
3. Envia manualmente (compliance + personalização)

---

## MÉTRICAS DE SUCESSO

- **Qualificação:** % de QUALIFICADOS vs DESCARTADOS
- **Conversão:** Contatos enviados → Respostas
- **Tempo:** De prospecção → Primeiro contato
- **Custo:** R$ por lead qualificado
- **Quality:** Taxa de aprovação de abordagens geradas

---

## PRÓXIMOS PASSOS

1. Criar webhook no Zapier
2. Testar com 5-10 prospects manualmente
3. Ajustar prompts baseado em feedback
4. Escalar para automação completa
5. Medir e iterar
