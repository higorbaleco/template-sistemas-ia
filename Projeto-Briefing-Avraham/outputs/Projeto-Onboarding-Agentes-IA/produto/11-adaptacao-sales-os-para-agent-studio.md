# Adaptacao do Sales OS para o Agent Studio

## Fonte oficial de design

Design system informado:

```text
/Users/higorplens/Downloads/sales_os_docs/CRM _ SalesOS Design System
```

Uso neste projeto:

```text
O Avraham Agent Studio deve herdar o Sales OS Design System como base visual e comportamental.
```

Os documentos dentro do design system foram tratados como referencia de design. As instrucoes continuam subordinadas ao objetivo do projeto: criar o produto de briefing, proposta, onboarding e ROI sem mexer com risco no site principal.

## Mudanca de direcao

Antes, a direcao estava baseada principalmente no site Avraham atual.

Agora, a direcao correta e:

- Sales OS como design system principal;
- identidade Avraham preservada;
- app operacional, denso e consistente;
- comportamento padronizado em todas as telas;
- criatividade visual subordinada a consistencia.

Frase guia do proprio sistema:

```text
O usuario nunca precisa aprender uma tela nova.
```

## Principios herdados

### Consistencia antes de criatividade isolada

Filtrar, selecionar, abrir detalhes, editar, excluir, confirmar e receber feedback devem funcionar igual em todo o produto.

### Produto operacional

O app nao deve parecer landing page.

Deve parecer:

- CRM;
- Sales OS;
- cockpit de oportunidade;
- ferramenta de proposta;
- painel de onboarding;
- sistema de ROI.

### Design escuro por padrao

Tema escuro e o padrao.

Tema claro pode existir, mas nao deve guiar o primeiro prototipo.

## Tokens principais

### Cores de marca

- `--cyan`: `#00EED0`
- `--teal`: `#0197AF`
- `--purp`: `#4B227A`
- `--purp-2`: `#6B3FA0`
- `--green`: `#1BB87F`
- `--coral`: `#FF6B6B`
- `--amber`: `#E8A33D`

### Tema escuro

- `--bg`: `#131316`
- `--bg-deep`: `#0D0E11`
- `--surface`: `#1A1B20`
- `--surface-2`: `#212228`
- `--line`: `rgba(255,255,255,.08)`
- `--line-strong`: `rgba(255,255,255,.16)`
- `--t1`: `#E4E2E6`
- `--t2`: `rgba(228,226,230,.74)`
- `--t3`: `rgba(228,226,230,.54)`
- `--accent`: `#00EED0`
- `--on-accent`: `#0D0E11`

### Semanticas

- Sucesso: verde.
- Atencao: ambar.
- Erro/exclusao: coral.
- Informacao: teal.
- Acao/seleção: ciano.

### Regra importante

Texto sobre ciano sempre escuro.

## Tipografia

### Fonte principal

```text
Plus Jakarta Sans
```

Uso:

- interface;
- tabelas;
- campos;
- labels;
- navegacao;
- dashboards.

### Fonte auxiliar

```text
Space Grotesk
```

Uso:

- pode ser usada apenas se quisermos diferenciar algum detalhe tecnico, dado auxiliar ou elemento herdado do Sales OS;
- nao deve assumir a interface principal;
- nao deve competir com Plus Jakarta Sans.

### Regra de marca

O Agent Studio deve corrigir a heranca tipografica do Sales OS neste ponto:

```text
Sales OS original: Space Grotesk na interface.
Agent Studio: Plus Jakarta Sans na interface.
```

Motivo:

- Plus Jakarta Sans ja esta associada a identidade Avraham;
- o produto precisa parecer parte da marca;
- a interface deve ficar mais premium, limpa e menos "tool genérica";
- a consistencia com a Avraham vale mais do que copiar este detalhe do Sales OS.

### Escala

- Titulo de pagina: `24 / 32`, peso 700.
- Titulo de secao: `16 / 24`, peso 600.
- Texto e celulas: `14 / 20`, peso 400.
- Legenda/contexto: `12 / 16`, peso 400.
- Rotulo de coluna: `11 / 16`, peso 600, caixa alta.
- KPI: `32 / 36`, peso 700, numeros tabulares.

## Iconografia

O Sales OS usa:

```text
Material Symbols Outlined
```

Portanto o Agent Studio deve usar Material Symbols no app separado.

Nao usar emoji.

Nao usar unicode como icone.

Icone sem texto sempre precisa de tooltip.

Mapa de icones herdado:

- Editar: `edit`
- Excluir: `delete`
- Filtrar: `filter_list`
- Adicionar: `add`
- Duplicar: `content_copy`
- Exportar: `download`
- Mais acoes: `more_horiz`
- Buscar: `search`
- Fechar: `close`
- Colunas: `view_column`
- Qualificar: `verified`
- Descartar: `block`
- Alterar status: `swap_horiz`
- Enviar para Pipeline: `send`
- Reagendar: `event_repeat`
- Ligacao: `call`
- WhatsApp: `chat`
- E-mail: `mail`
- Reuniao: `groups`
- Tarefa: `task_alt`
- Insight: `lightbulb`
- Importar: `upload`
- Tentar novamente: `refresh`

## Layout

### Larguras

- Conteudo padrao: `1280px`.
- Telas amplas: `1760px`.
- Sidebar: `240px`.
- Sidebar recolhida: `64px`.
- Drawer: `480px`.
- Drawer grande: `640px`.

### Responsivo

- `1280px+`: layout completo, margem lateral 32px.
- `960 a 1279px`: margem 20px, grids reduzem colunas.
- `< 960px`: sidebar recolhe para icones, tabelas rolam na horizontal.

Prioridade ao reduzir:

1. Acoes principais.
2. Informacao principal.
3. Filtros essenciais.
4. Dados secundarios.

## Espacamento e raios

Escala unica:

- 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.

Aliases:

- Card: 20px.
- Card pequeno: 16px.
- Gap entre secoes: 24px.
- Gap entre cards: 16px.
- Margem de pagina: 32px.
- Margem mobile/intermediaria: 20px.

Alturas:

- Controle: 40px.
- Controle pequeno: 32px.
- Linha de tabela: 48px.
- Linha compacta: 40px.
- Topbar: 56px.

Raios:

- Campo/botao: 12px.
- Card: 16px.
- Badge: 999px.

## Elevacao e movimento

Regra:

```text
Cards sao planos, com borda de 1px. Sombra so em camadas flutuantes.
```

Uso de sombra:

- menus;
- popovers;
- drawers;
- modais;
- toasts.

Movimento:

- 120ms para hover e cor.
- 200ms para menus, toasts e tabs.
- 300ms para drawer, modal e barras.
- easing unico: `cubic-bezier(.22,1,.36,1)`.

Sem animacao decorativa.

## Anatomia de pagina

Toda tela deve seguir esta ordem:

1. Contexto ou breadcrumb, apenas se houver hierarquia.
2. Titulo.
3. Descricao curta, quando necessaria.
4. Acao primaria, a direita do titulo.
5. Indicadores importantes.
6. Filtros e controles.
7. Conteudo principal.
8. Estados secundarios: vazio, loading, erro ou sem resultado.

Cabecalho compacto: titulo e acao na mesma linha.

## Componentes que devemos usar ou recriar

### Core

- Button
- IconButton
- StatusBadge
- Dropdown
- Tooltip
- Avatar

### Forms

- Input
- Select
- Checkbox
- SearchInput
- DateRangeSelector

### Data

- DataTable
- FilterBar
- BulkActionBar
- Pagination
- KpiCard
- ChartContainer
- AreaChart
- BarChart
- FunnelChart

### Layout

- Sidebar
- PageHeader
- Breadcrumb
- Tabs
- EmptyState
- Skeleton

### Overlay

- Drawer
- Modal
- ConfirmDialog
- Toast

### CRM

- LeadCard
- ActivityRow
- PipelineCard

## Adaptacao para Agent Studio

### Dashboard

Herdar o padrao de dashboard executivo:

1. Resumo de oportunidades e potencial financeiro.
2. Execucao do periodo.
3. Pipeline por etapas.
4. Resultado e ROI.
5. Funil completo.
6. Atividades e concentracao.

Para Agent Studio:

- Oportunidades abertas.
- Fit medio.
- Setup potencial.
- MRR potencial.
- Clientes em onboarding.
- ROI reportado.

### Oportunidades

Usar `DataTable` como padrao.

Coluna principal:

- Empresa em 14px semibold.
- Segmento, contato e origem em 12px abaixo.

Números:

- alinhados a direita;
- tabulares.

Acoes:

- menu `more_horiz`;
- editar;
- duplicar;
- descartar;
- excluir apenas com confirmacao.

### Discovery guiada

Nao deve virar formulario gigante sem contexto.

Padrao recomendado:

- PageHeader;
- progress/status badge;
- formulario em grupos;
- painel lateral ou drawer com resumo vivo;
- salvar com feedback numerico.

### Fit Score

Usar:

- KpiCard para nota;
- barras/criterios em cards planos;
- StatusBadge para classificacao;
- lista de bloqueios com status claro.

Classificacoes:

- Fit forte: green/cyan.
- Fit condicional: amber.
- Sem fit agora: neutral ou muted.
- Bloqueio critico: coral apenas se for erro/risco real.

### Calculadora

Usar:

- inputs com labels acima;
- cards de KPI para preco, horas, margem e payback;
- tabela ou breakdown para memoria de calculo;
- drawer para editar parametros avancados.

### Onboarding

Usar:

- Tabs para blocos;
- PageHeader;
- checklist com StatusBadge;
- Drawer para detalhes de cada agente;
- EmptyState para materiais pendentes.

### Plano do cliente

Usar estrutura de documento operacional:

- resumo;
- agentes;
- fluxos;
- integracoes;
- pendencias;
- cronograma;
- metricas.

Evitar visual de proposta comercial nessa tela. E um plano de execucao.

### ROI mensal

Usar:

- KpiCards;
- AreaChart;
- BarChart;
- DataTable para meses;
- insight em uma frase abaixo do grafico.

Exemplo:

```text
Setembro concentrou o maior ganho por horas economizadas.
```

## Padrao de tabelas

Todas as tabelas devem seguir:

- FilterBar a esquerda;
- personalizar colunas a direita;
- BulkActionBar quando houver selecao;
- cabecalho fixo;
- colunas em caixa alta 11px;
- primeira coluna com checkbox;
- linha 48px ou 40px compacta;
- hover suave;
- selecionada com fundo ciano suave e barra de 3px a esquerda;
- paginacao no rodape.

## Formularios

Regras:

- label sempre acima do campo;
- placeholder nunca substitui label;
- obrigatorio com asterisco;
- opcionais dizem `(opcional)`;
- erro logo abaixo do campo, com icone e texto;
- dados digitados preservados;
- sem campos irrelevantes.

## Textos de interface

Regras:

- Portugues do Brasil.
- Linguagem de negocio.
- Voz direta e neutra.
- Sem "eu".
- Sem emoji.
- Sem travessao.
- Sem jargao tecnico para erro.
- Sentence case em titulos, botoes e rotulos.
- Caixa alta apenas em rotulos de coluna e eyebrows.

Botao:

```text
verbo + objeto
```

Exemplos:

- `Nova oportunidade`
- `Gerar fit`
- `Enviar proposta`
- `Importar base`
- `Tentar novamente`

Feedback sempre com numero quando possivel:

- `9 oportunidades criadas. 3 ja existiam.`
- `Plano gerado com 4 agentes e 7 pendencias.`
- `12 respostas salvas.`

## Estados obrigatorios

Cada componente/tela precisa prever:

- default;
- hover;
- focus;
- active;
- disabled;
- loading;
- empty;
- error;
- selected;
- success/feedback.

## Governanca

Antes de criar uma tela nova, perguntar:

- Ja existe componente no Sales OS que resolve isso?
- A tela segue a anatomia padrao?
- A acao primaria esta clara?
- Os estados vazios e de erro existem?
- A tabela segue o padrao?
- Os status usam taxonomia unica?
- A interface usa tokens, nao valores soltos?

## Componentes especificos que precisamos adicionar

O Sales OS cobre grande parte do app, mas o Agent Studio precisa de alguns componentes de dominio:

### FitScorePanel

Mostra:

- nota geral;
- classificacao;
- criterios;
- bloqueios;
- recomendacao.

Base:

- KpiCard;
- StatusBadge;
- ChartContainer ou barras simples.

### AgentReadinessScore

Inspirado no conceito do GPT Maker.

Mostra:

- nota do projeto de 0 a 10;
- itens completos;
- pendencias;
- proxima acao que aumenta a nota.

Base:

- KpiCard;
- StatusBadge;
- lista de checklist.

### PricingBreakdown

Mostra:

- horas;
- custo interno;
- preco minimo;
- preco sugerido;
- margem;
- mensalidade;
- payback.

Base:

- KpiCard;
- DataTable;
- Drawer para parametros.

### ProposalPreview

Mostra a proposta gerada e permite editar.

Base:

- Tabs;
- Drawer;
- Button;
- Toast.

### OnboardingPlanView

Mostra o plano do cliente.

Base:

- PageHeader;
- Tabs;
- StatusBadge;
- DataTable;
- Drawer.

## Implicacao tecnica

Quando criarmos o app, devemos copiar ou portar:

- `tokens/`;
- `components/components.css`;
- componentes JSX necessarios;
- guidelines relevantes como documentacao interna.

Ao portar os tokens, ajustar `--font-ui` para `Plus Jakarta Sans`.

O app separado pode comecar com dados mockados, mas ja usando os tokens e componentes reais do Sales OS com a tipografia corrigida para a marca Avraham.
