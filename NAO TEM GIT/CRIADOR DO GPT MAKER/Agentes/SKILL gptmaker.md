---
name: gptmaker-agent-builder
description: Constrói, estrutura e documenta agentes de IA completos para a plataforma GPT Maker a partir de briefings, transcrições de reunião ou descrições do cliente. Use esta skill sempre que o usuário mencionar "agente GPT Maker", "criar agente", "montar agente de IA", "configurar bot de atendimento", "prompt de agente", "persona de IA", "fluxo de conversa para WhatsApp/Instagram", "intenções do agente", "treinamento de agente", ou quando pedir para transformar informações de uma empresa em um agente estruturado. Também ative quando o usuário fornecer uma transcrição de reunião com cliente e quiser transformar isso em documentação de agente. Esta skill reduz de 60h para menos de 2h o trabalho de criação de agentes na plataforma GPT Maker.
---

# GPT Maker Agent Builder

Esta skill transforma briefings, transcrições e informações brutas de clientes em documentação completa e pronta para configuração na plataforma GPT Maker.

## Visão Geral do Processo

```
INPUT                          OUTPUT
─────────────────────────      ─────────────────────────────────────
Transcrição de reunião    →    Documento estruturado completo
Briefing do cliente       →    Perfil + Comportamento + Treinamentos
Informações da empresa    →    Intenções + Configurações + Regras
```

## Etapa 1 — Extração de Informações

Antes de estruturar qualquer coisa, identifique e extraia do material fornecido:

### Dados Obrigatórios
- **Nome do agente** (persona — ex: "Adriano", "Marcelo", "Aline")
- **Nome da empresa**
- **Objetivo principal**: Suporte | Vendas | SDR | Uso Pessoal
- **Produto/serviço** que o agente representa
- **Tom de comunicação**: Formal | Normal | Descontraído
- **Canais de atuação**: WhatsApp | Instagram | Mercado Livre | Site | SDK

### Dados Complementares
- Fluxo de conversa esperado
- Regras de negócio e restrições
- Objeções frequentes e respostas
- Perguntas frequentes (FAQ)
- Materiais de treinamento (PDFs, textos, URLs)
- Intenções com APIs externas
- Configurações de inatividade e transferência

### Se faltar informação
Faça perguntas diretas e objetivas ao usuário, agrupando tudo em uma única rodada. Nunca prossiga sem os dados obrigatórios.

---

## Etapa 2 — Estrutura do Documento de Saída

Produza sempre o documento completo na seguinte ordem:

---

### 🧩 SEÇÃO 1 — PERFIL

```
## PERFIL

**Nome do Agente:** [Nome]
**Comunicação:** [Formal | Normal | Descontraído]

### Identidade e Personalidade
[Descreva quem é o agente, sua persona, traços de personalidade, 
como ele fala, o que representa dentro da empresa]

### Posicionamento
[Como o agente se apresenta, qual papel ocupa, o que transmite]
```

**Diretrizes de escrita para personalidade:**
- Use linguagem descritiva e rica — não genérica
- Inclua exemplos de tom de voz ("fala com clareza e firmeza", "acolhedor como uma mentora")
- Defina o que o agente NUNCA faz (ex: não menciona preços, não fala de concorrentes)
- Se for persona de pessoa real, descreva como ela se comportaria

---

### 🏢 SEÇÃO 2 — TRABALHO

```
## TRABALHO

**Tipo:** [Vendas | Suporte | SDR | Uso Pessoal]
**Produto/Serviço:** [Nome do produto ou serviço]
**Site:** [URL se houver]

### Descrição da Empresa
[Parágrafo descritivo sobre a empresa: missão, diferenciais, 
tempo de mercado, público, proposta de valor]
```

---

### 📚 SEÇÃO 3 — TREINAMENTOS

Liste os blocos de conhecimento no formato de afirmações diretas (não perguntas):

```
## TREINAMENTOS

### Informações Gerais
- [Fato 1 sobre a empresa]
- [Fato 2 sobre localização, horário, contato]
- [Fato 3 sobre política ou processo]

### Produtos e Serviços
- [Descrição objetiva de cada produto/serviço]
- [Preços, condições, variações]

### Regras de Negócio
- [Regra 1 — ex: "O agente nunca menciona preços diretamente"]
- [Regra 2 — ex: "O agente sempre direciona para agendamento"]

### Objeções e Respostas
**Objeção:** "[Objeção comum]"
→ "[Resposta orientada a benefício/solução]"

### FAQ
**Pergunta:** "[Pergunta frequente]"
→ "[Resposta direta e objetiva]"

### Documentos de Referência
- [nome_arquivo.pdf] — Treinado
- [URL do site] — Treinado
```

**Regra crítica de treinamento:**
> ✅ CORRETO: "O produto custa R$X parcelado em até 12x"
> ❌ ERRADO: "Quando o cliente perguntar o preço, diga que é R$X"

---

### 🎯 SEÇÃO 4 — INTENÇÕES

Para cada integração com API externa:

```
## INTENÇÕES

### [Nome da Intenção]
**Quando usar:** [Contexto que dispara essa intenção]
**Dados a capturar do cliente:**
- [Campo 1]
- [Campo 2]
**Endpoint:** [URL da API com variáveis usando @]
**Resposta esperada:** [O que fazer com o retorno da API]
```

Se não houver intenções, registre: `Sem intenções configuradas nesta versão.`

---

### 💬 SEÇÃO 5 — FLUXO DE CONVERSA

```
## FLUXO IDEAL DE CONVERSA

### 1. Abertura
[Mensagem de boas-vindas padrão do agente]

### 2. Qualificação
[Perguntas que o agente faz para entender o lead]

### 3. Apresentação
[Como o agente apresenta o produto/serviço]

### 4. Quebra de Objeções
[Estratégia e exemplos de como lidar com hesitação]

### 5. Fechamento
[Como o agente conduz para conversão ou agendamento]

### 6. Escalada Humana
[Quando e como transferir para atendente humano]
```

---

### ⚙️ SEÇÃO 6 — CONFIGURAÇÕES

```
## CONFIGURAÇÕES

### Preferências de Conversa
- Solicitar ajuda humana: [Sim | Não]
- Usar Emojis: [Sim | Não]
- Restringir Temas: [Sim | Não]
- Dividir resposta em partes: [Sim | Não]
- Permitir registrar lembretes: [Sim | Não]
- Timezone: (GMT-03:00) Sao Paulo

### Limites
- Tempo de resposta: [X segundos]
- Limite de interações por atendimento: [N interações]
- Ação ao atingir limite: [Transferir para humanos | Encerrar]

### Ações de Inatividade
- Sem resposta em [X horas]: Interagir com cliente
- Sem resposta em [X dias]: Interagir com cliente
- Sem resposta em [X dias]: Finalizar atendimento

### Regras de Transferência
[Descrever quando e como transferir para humano]
```

---

### 🚫 SEÇÃO 7 — RESTRIÇÕES E REGRAS CRÍTICAS

```
## RESTRIÇÕES

### O agente NUNCA deve:
- [Restrição 1]
- [Restrição 2]

### O agente SEMPRE deve:
- [Obrigação 1]
- [Obrigação 2]

### Palavras/Termos Proibidos:
- [Palavra ou termo proibido]

### Palavras/Termos Recomendados:
- [Alternativa positiva]
```

---

## Etapa 3 — Padrões de Qualidade

Ao gerar o documento, valide:

- [ ] Personalidade descrita de forma rica e específica (não genérica)
- [ ] Treinamentos no formato de afirmações (não instruções condicionais)
- [ ] Fluxo de conversa cobre abertura, meio e fechamento
- [ ] Pelo menos 5 objeções com respostas mapeadas
- [ ] Restrições claras e separadas das regras positivas
- [ ] Configurações completas com todos os campos preenchidos
- [ ] Tom consistente com o estilo de comunicação escolhido

---

## Etapa 4 — Exemplos de Referência por Segmento

### Agente de Vendas (ex: MejerCred, Dr. Raphael Alves)
- Foco em qualificação de lead → agendamento
- Sem textos longos (leads não leem)
- Gatilhos mentais: escassez, autoridade, prova social
- Evitar termos negativos sobre o problema do cliente

### Agente de Suporte (ex: Global Grabber)
- Detectar idioma e adaptar
- Nunca inventar preços
- Transferência suave para humano sem revelar que é IA
- Política de cancelamento clara

### Agente Comercial de E-commerce (ex: Neymar Edutech)
- Respostas curtas e persuasivas
- Objeções pré-mapeadas com resposta orientada a valor
- Seguir regras da plataforma (Mercado Livre, Instagram, etc.)
- Senso de urgência e prova social

### Agente de Restaurante/Local
- Informações práticas: horário, localização, cardápio, reservas
- Tom acolhedor e local
- Dados de Pix/CNPJ para pagamento
- Fluxo de reserva com coleta de dados

### Agente Jurídico / Profissional Liberal
- Linguagem técnica adaptada ao público
- Nunca prometer resultados
- Foco em agendamento de consulta
- Escalada rápida para humano em casos complexos

---

## Checklist Final Antes de Entregar

```
✅ Documento gerado em Markdown estruturado
✅ Todas as 7 seções preenchidas
✅ Linguagem consistente com o segmento
✅ Regras de negócio separadas e claras
✅ Pronto para copiar e colar na plataforma GPT Maker
✅ Versão resumida do comportamento (para campo "Comportamento" da plataforma)
```

---

## Dica de Uso da API GPT Maker

Se o usuário precisar automatizar via API, os campos principais do endpoint `PUT /agents/{id}` são:

```json
{
  "name": "Nome do Agente",
  "job_role": "Suporte | Vendas | SDR | Uso Pessoal",
  "job_name": "Nome da Empresa",
  "job_description": "Descrição da empresa",
  "profile_behavior": "Texto de comportamento e personalidade",
  "communication_style": "formal | normal | relaxed",
  "ask_human_help": true,
  "use_emojis": false,
  "restrict_themes": true,
  "split_responses": false
}
```

Referência completa: https://developer.gptmaker.ai/api-reference/agents/update
