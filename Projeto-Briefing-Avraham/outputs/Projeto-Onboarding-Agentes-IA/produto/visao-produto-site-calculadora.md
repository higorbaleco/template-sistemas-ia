# Visao de Produto: Gerador de Agentes IA

## Recomendacao curta

Sim: isso deveria virar uma ferramenta visual.

Minha recomendacao e criar primeiro como um produto separado, com identidade propria, mas conectado ao site principal. O site principal continua sendo vitrine e aquisicao. O `Gerador de Agentes IA` vira a ferramenta operacional usada por pre-venda, closer, CS e implementacao.

## Por que separado no inicio

Um gerador separado permite evoluir rapido sem mexer no site institucional toda hora. Tambem deixa claro que nao e apenas uma pagina bonita: e uma maquina de diagnostico, proposta, onboarding e ROI.

Depois que o fluxo estiver validado, ele pode aparecer no site como:

- uma calculadora publica simples para atrair leads;
- uma area interna para o time comercial;
- um portal do cliente depois do fechamento;
- um modulo dentro do site principal.

## Produto ideal

O produto pode ter 5 modulos.

### 1. Diagnostico comercial

Usado pelo pre-vendedor ou closer durante a primeira ligacao.

O sistema pergunta sobre dores, volume, perdas, processo atual, ferramentas, urgencia, verba e capacidade de implementacao. Ao final, gera:

- fit score;
- classificacao `Fit forte`, `Fit condicional` ou `Sem fit agora`;
- dores principais;
- oportunidade financeira estimada;
- proxima acao comercial;
- alertas de risco.

### 2. Calculadora de proposta

Transforma as respostas da descoberta em escopo e preco.

Ela calcula:

- agentes necessarios;
- horas de setup;
- custo interno;
- preco minimo saudavel;
- preco sugerido;
- mensalidade sugerida;
- custos de token, canal e infraestrutura;
- margem estimada;
- prazo de implementacao.

### 3. Gerador de proposta

Gera uma narrativa comercial com base no que mais doeu no cliente.

Exemplo:

> Hoje voces perdem oportunidades porque leads respondem fora do horario, ficam sem retorno e nao sao qualificados com consistencia. O agente proposto atua no WhatsApp, identifica segmento, gargalo e ticket medio, encaminha leads prontos para reuniao e registra tudo no CRM.

Esse modulo deve gerar:

- resumo executivo;
- problema diagnosticado;
- solucao proposta;
- escopo;
- investimento;
- ROI esperado;
- plano de implantacao.

### 4. Onboarding guiado

Depois do fechamento, o cliente entra em um fluxo mais profundo.

Ele responde perguntas sobre:

- empresa;
- objetivo;
- dores;
- processos;
- canais;
- CRM;
- base de conhecimento;
- tom de voz;
- regras comerciais;
- limites do agente;
- handoff humano;
- metricas de sucesso.

O resultado vira o `Plano de Onboarding`.

### 5. Operacao e ROI mensal

Depois que o agente esta rodando, o sistema acompanha se o cliente esta vendo valor.

Deve mostrar:

- conversas atendidas;
- leads qualificados;
- reunioes geradas;
- vendas influenciadas;
- horas economizadas;
- dinheiro recuperado ou gerado;
- custo mensal;
- ROI;
- proximas melhorias.

## Experiencia visual inspirada no GPT Maker

A ideia boa do GPT Maker nao e so o visual. E o conceito de maturidade.

Podemos ter uma `Nota do Projeto` de 0 a 10:

- briefing completo;
- dados suficientes;
- canais conectados;
- CRM integrado;
- regras de handoff definidas;
- base de conhecimento anexada;
- testes aprovados;
- metricas configuradas;
- ROI mensuravel.

Cada item pendente vira uma acao clara:

- `Conectar WhatsApp`;
- `Enviar documentos`;
- `Definir perguntas de qualificacao`;
- `Conectar CRM`;
- `Aprovar tom de voz`;
- `Configurar relatorio de ROI`.

## MVP recomendado

Versao 1 deve ser interna, usada pelo time.

Telas essenciais:

1. Dashboard de oportunidades.
2. Nova oportunidade.
3. Roteiro de descoberta.
4. Resultado de fit.
5. Calculadora de escopo e preco.
6. Gerador de proposta.
7. Onboarding do cliente fechado.
8. Plano do cliente.
9. Relatorio mensal de ROI.

## Decisao de arquitetura

Eu faria assim:

- `Site principal`: atracao, posicionamento, cases e CTA.
- `Calculadora publica`: versao simples para gerar leads.
- `Gerador de Agentes IA`: app interno/portal, com dados, scores, propostas e onboarding.
- `Portal do cliente`: segunda fase, para o cliente acompanhar pendencias, entregaveis e ROI.

## Stack sugerida

Para um MVP rapido:

- Frontend: Next.js ou React.
- Banco: Supabase.
- Autenticacao: Supabase Auth.
- Arquivos: Supabase Storage ou Google Drive.
- Planilhas: Google Sheets no inicio, banco depois.
- Automacoes: n8n, Make ou Zapier.
- IA: OpenAI para resumo, proposta, plano de onboarding e relatorios.

## Primeiro corte de produto

O primeiro corte nao precisa substituir tudo. Ele deve centralizar o que ja existe.

Entrada:

- respostas do vendedor;
- parametros comerciais;
- respostas do briefing;
- metricas mensais.

Saida:

- fit score;
- mapa da oportunidade;
- escopo;
- preco sugerido;
- plano de onboarding;
- checklist de implementacao;
- relatorio mensal de ROI.

## Nome possivel

Alguns nomes possiveis:

- Gerador de Agentes IA;
- Agent Builder;
- Mapa do Agente;
- AI Client OS;
- Avraham Agent Studio;
- Vibe Agent OS.

Minha preferencia: `Agent Studio` para uso interno e `Gerador de Agentes IA` para explicar rapidamente ao cliente.
