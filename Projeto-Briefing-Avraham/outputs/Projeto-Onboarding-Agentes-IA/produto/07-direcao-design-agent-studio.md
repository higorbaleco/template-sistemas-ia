# Direcao de Design: Avraham Agent Studio

> Atualizacao: a direcao visual oficial deve herdar do `CRM _ SalesOS Design System`, localizado em `/Users/higorplens/Downloads/sales_os_docs/CRM _ SalesOS Design System`. Este documento continua valido como intencao de produto, mas a especificacao visual operacional esta detalhada em `11-adaptacao-sales-os-para-agent-studio.md`. Ajuste importante: no Agent Studio, Plus Jakarta Sans e a fonte principal.

## Leitura do produto

Este produto deve parecer uma ferramenta operacional premium, nao uma landing page.

A sensacao certa:

- calmo;
- preciso;
- confiavel;
- comercial;
- consultivo;
- denso na medida;
- bonito sem parecer decorativo.

O usuario precisa sentir que esta usando um cockpit de vendas, onboarding e ROI. Nao deve parecer uma planilha enfeitada, nem um site institucional com formulario longo.

## Relacao com o site atual

O app deve nascer como uma extensao natural da identidade visual da Avraham.

Pontos observados no site:

- stack com TanStack Start, React, Vite e Cloudflare;
- fonte principal `Plus Jakarta Sans`;
- tokens em OKLCH;
- base clara e escura;
- acento primario ciano-verde;
- botoes arredondados;
- uso de Lucide icons;
- linguagem visual com superficies, bordas suaves, glass controlado e glow pontual.

Direcao:

- reaproveitar a identidade;
- aumentar a densidade;
- reduzir efeito de landing;
- privilegiar leitura e acao.

## Personalidade visual

Nome visual sugerido:

```text
Avraham Agent Studio
```

Vibe:

```text
Linear + HubSpot + Stripe Dashboard, com identidade Avraham.
```

Nao e para parecer:

- chatbot generico;
- SaaS roxo de IA;
- painel financeiro pesado;
- landing com hero gigante;
- ferramenta infantilizada.

## Paleta

### Base

Usar a base existente do site:

- fundo escuro quase preto;
- surfaces em cinza frio;
- texto claro;
- bordas suaves;
- contraste alto em pontos de decisao.

### Acento

Usar o ciano-verde Avraham como acento principal.

Aplicacoes:

- CTA principal;
- foco;
- progresso;
- nota positiva;
- status de fit forte;
- links importantes.

### Estados

Sugestao:

- Fit forte: ciano-verde / verde.
- Fit condicional: amarelo/ambar discreto.
- Sem fit: vermelho/coral discreto.
- Pendente: cinza.
- Em andamento: azul/ciano.

Evitar:

- muitos tons competindo;
- gradiente roxo de IA;
- badges coloridos demais;
- fundos decorativos sem funcao.

## Tipografia

Fonte principal:

```text
Plus Jakarta Sans
```

Uso:

- headings claros e compactos;
- labels pequenas e legiveis;
- numeros com bastante destaque;
- nada de serif decorativa;
- sem textos longos em cards pequenos.

Escala:

- Dashboard heading: 28 a 36px.
- Titulo de tela: 22 a 28px.
- Titulo de card: 15 a 18px.
- Corpo: 14 a 16px.
- Label/form: 12 a 14px.
- Metric number: 24 a 40px conforme importancia.

## Layout do app

### Estrutura principal

Desktop:

- sidebar esquerda;
- topbar compacta;
- area central;
- painel lateral contextual quando necessario.

Mobile/tablet:

- navegacao compacta;
- etapas em tela cheia;
- tabelas viram listas.

### Densidade

O produto deve ser mais denso que o site, mas sem virar ERP antigo.

Boa densidade:

- listas escaneaveis;
- tabelas com espaco decente;
- cards pequenos para metricas;
- formulários em blocos;
- painéis laterais para contexto.

## Componentes principais

### Dashboard

Componentes:

- cards de KPI;
- tabela de oportunidades;
- filtros;
- proximas acoes;
- funil por etapa;
- alerta de oportunidade travada.

Visual:

- grid limpo;
- poucas sombras;
- bordas leves;
- status por cor e texto.

### Descoberta guiada

Layout recomendado:

- esquerda: perguntas e respostas;
- direita: resumo vivo;
- topo: etapa atual e progresso;
- rodape fixo: salvar, voltar, continuar, gerar fit.

Este fluxo deve parecer uma entrevista assistida.

### Resultado de fit

Elementos:

- nota grande;
- classificacao;
- barras por criterio;
- bloqueios;
- recomendacao de proxima acao.

Inspiracao do GPT Maker:

- nota visivel;
- checklist de maturidade;
- proximas acoes que aumentam a nota.

### Calculadora

Visual:

- inputs a esquerda;
- resultado a direita;
- breakdown abaixo;
- simulador de cenarios.

Deve deixar claro:

- custo interno;
- preco minimo;
- preco sugerido;
- margem;
- payback.

### Plano do cliente

Visual:

- documento estruturado;
- blocos editaveis;
- checklist de pendencias;
- status de cada agente;
- linha do tempo.

## Sistema de maturidade

Usar uma `Nota do Projeto` de 0 a 10.

Criterios:

- briefing completo;
- canal definido;
- CRM/integracoes definidas;
- base de conhecimento enviada;
- perguntas de qualificacao aprovadas;
- tom de voz aprovado;
- handoff definido;
- testes aprovados;
- ROI configurado;
- go-live realizado.

Cada item pendente vira uma acao:

- `Enviar base de conhecimento`;
- `Definir regra de handoff`;
- `Conectar CRM`;
- `Aprovar perguntas de qualificacao`;
- `Configurar relatorio de ROI`.

## Iconografia

Usar Lucide, porque o site atual ja usa `lucide-react`.

Familia unica:

- nao misturar varias bibliotecas;
- evitar SVG manual;
- padronizar tamanho e stroke.

Icones uteis:

- `Gauge` para score;
- `ClipboardList` para briefing;
- `Calculator` para precificacao;
- `Users` para oportunidades;
- `Bot` para agentes;
- `Route` para fluxo;
- `LineChart` para ROI;
- `CheckCircle` para concluido;
- `AlertTriangle` para risco;
- `ArrowRight` para avancar.

## Interacoes

Regras:

- feedback claro ao salvar;
- estados de loading sem spinner generico;
- auto-save em formularios longos;
- erros inline;
- progresso sempre visivel;
- voltar sem perder resposta;
- revisar antes de gerar proposta.

## O que evitar

- hero gigante dentro do app;
- frases de marketing em excesso;
- cards dentro de cards;
- formulario longo sem progresso;
- tabela sem filtros;
- badges coloridos demais;
- muito glow;
- roxo/azul generico de IA;
- animacoes que atrapalham vendedor durante ligacao.

## Primeiras telas para prototipo

1. Dashboard.
2. Nova oportunidade.
3. Descoberta guiada.
4. Resultado de fit.
5. Calculadora de proposta.
6. Gerador de proposta.
7. Onboarding.
8. Plano do cliente.
9. ROI mensal.

## Regra de qualidade visual

Antes de implementar, cada tela precisa responder:

- Qual decisao essa tela ajuda a tomar?
- Qual informacao precisa saltar primeiro?
- Qual acao principal o usuario deve fazer?
- O que pode ficar escondido em painel, aba ou detalhe?
- O que nao precisa estar nessa tela?
