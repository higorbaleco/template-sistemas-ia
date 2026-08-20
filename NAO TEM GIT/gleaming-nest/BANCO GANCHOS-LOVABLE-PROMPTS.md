# Gleaming Nest — Prompts para o Lovable

> **Regra de ouro:** Um prompt por vez. Aprovei a tela → próximo prompt.
> Não reenviar o prompt inteiro se der bug — corrigir só o que falhou.

---

## Prompt 1 — Setup + Design System

```
Crie um app React + Vite + Tailwind + shadcn/ui chamado "Gleaming Nest".

Tema:
- Dark mode first (fundo #0A0A0F, superfície #111118)
- Cor primária: roxo #7C3AED
- Cor secundária: verde-menta #10B981
- Fonte: Inter (todas as variações)
- Grid 8px (spacing usa múltiplos de 8)

Crie apenas o shell do app:
1. Layout base com sidebar fixa à esquerda (largura 240px)
2. Itens da sidebar: Home, Ganchos, Inspirações, Roteiros — cada um com ícone shadcn/ui
3. Topbar com saudação dinâmica por horário:
   - 05h–11h59: "Bom dia, Higor ☀️"
   - 12h–17h59: "Boa tarde, Higor 🌤"
   - 18h–04h59: "Boa noite, Higor 🌙"
4. Área de conteúdo (main) em branco por enquanto

NÃO implemente nenhuma página ainda.
NÃO conecte Supabase ainda.
Entregue apenas o shell visual funcionando.
```

---

## Prompt 2 — Home

```
Na rota /, adicione o conteúdo da Home.

Estrutura:
1. Saudação dinâmica já existente na topbar (manter)
2. Abaixo da saudação, frase motivacional rotativa — sorteia uma diferente a cada reload.
   Array de 20 frases (crie frases sobre consistência, criação de conteúdo e resultado):
   - "Conteúdo consistente bate conteúdo perfeito toda vez."
   - [mais 19 no mesmo estilo]

3. Grid 2x2 de cards de atalho para as 4 seções:
   - 🔖 Ganchos — "Seu banco de aberturas"
   - ✨ Inspirações — "Saves e referências"
   - 🎬 Roteiros — "Pipeline de conteúdo"
   - 🧠 Iada — "Analise seu roteiro"
   Cada card usa a cor primária (#7C3AED) com hover em verde-menta (#10B981).

NÃO conecte dados reais.
NÃO toque na sidebar.
```

---

## Prompt 3 — Banco de Ganchos (lista)

```
Na rota /ganchos, crie a página do Banco de Ganchos.

Tabela com colunas:
Título | Intenção | Tema | Origem | Data adicionada | Performance média

Filtros no topo (linha horizontal):
- Intenção: select com opções Educar / Vender / Conectar / Posicionar / Engajar
- Tema: multi-select com opções Negócios / Mindset / Marketing / Vida pessoal / Tendência
- Origem: select com opções Manual / Auto-trend / Inspiração-save / Inspiração-concorrente
- Data: date range picker (de / até)
- Botão "Limpar filtros"

Botão primário "Novo gancho" no canto superior direito.
Ao clicar em "Novo gancho", abre um modal com os campos:
- Título (text input, obrigatório)
- Intenção (select)
- Tema (multi-select)
- Origem (default: Manual)
Botão "Salvar" no modal.

Use mock data com 10 linhas variadas preenchendo todas as colunas.

NÃO conecte Notion ainda.
NÃO toque nas outras páginas.
```

---

## Prompt 4 — Conectar Notion (proxy via Supabase)

```
Conecte o app ao Notion via Supabase Edge Function.

1. Configure o projeto com Supabase (só o cliente — sem auth por agora).

2. Crie o hook src/hooks/useNotion.ts:
   - Função: useNotion(database: string)
   - Chama a Edge Function "notion-proxy" via supabase.functions.invoke
   - Aceita: { database, action, payload }
   - Retorna: { data, loading, error }
   - Actions disponíveis: "query", "create", "update", "get"

3. Crie src/lib/notion-types.ts com as interfaces TypeScript:

interface Gancho {
  id: string
  url: string
  titulo: string
  intencao: "Educar" | "Vender" | "Conectar" | "Posicionar" | "Engajar" | null
  tema: string[]
  origem: "Manual" | "Auto-trend" | "Inspiração-save" | "Inspiração-concorrente" | null
  dataAdicionada: string
  performanceMedia: string | null
}

interface Roteiro {
  id: string
  url: string
  titulo: string
  status: "Criação" | "Pronto" | "Gravação" | "Edição" | "Publicado"
  resultado: "A definir" | "Abaixo da média" | "Na média" | "Acima da média" | "Viral"
  metricas: string | null
  dataPublicacao: string | null
  textoRoteiro: string | null
  marcacoes: string[]
  checklist: {
    gancho: boolean
    clareza: boolean
    emocao: boolean
    argumento: boolean
    retencao: boolean
    direcionamento: boolean
  }
  iadaUltimaAnalise: string | null
}

interface Inspiracao {
  id: string
  url: string
  autor: string
  postUrl: string | null
  origem: "Save-meu" | "Concorrente"
  temaInferido: string[]
  ganchoExtraido: string | null
  transcricao: string | null
  dataCaptura: string
}

4. Substitua o mock de /ganchos por dados reais da Edge Function.
   - Mapeie as propriedades Notion para as interfaces acima.
   - Botão "Novo gancho" deve salvar no Notion (action: "create").

NÃO toque nas outras páginas.
NÃO implemente auth ainda.
```

---

## Prompt 5 — Inspirações

```
Na rota /inspiracoes, crie a página de Inspirações.

Layout: grid de cards, 3 colunas no desktop, 1 coluna no mobile.

Cada card mostra:
- Foto/thumb do post (se disponível) — use um placeholder cinza se não houver
- Badge de origem no canto superior: "Save ✓" (verde) ou "Concorrente" (laranja)
- Nome do autor (@handle)
- Tags de tema (chips)
- Gancho extraído (texto truncado em 2 linhas, expandível ao clicar)
- Botão "Virar gancho" — ação: cria um registro no database Ganchos com:
  - Título = gancho extraído (ou primeiros 100 chars da transcrição)
  - Origem = "Inspiração-save" ou "Inspiração-concorrente" (baseado na origem do card)
  - Inspiração-fonte = ID da inspiração (relation)

Filtros no topo:
- Origem: Todos / Save-meu / Concorrente
- Tema: multi-select
- Busca por texto (filtra em autor e gancho extraído)

Dados vêm do Notion via useNotion("inspiracoes").

NÃO toque nas outras páginas.
```

---

## Prompt 6 — Roteiros (Kanban)

```
Na rota /roteiros, crie o Kanban de Roteiros.

Layout: 5 colunas lado a lado com scroll horizontal se necessário:
Criação | Pronto | Gravação | Edição | Publicado

Cada coluna tem:
- Header com nome + badge com contagem de cards
- Lista de cards com scroll vertical

Cada card mostra:
- Título do roteiro
- Badge do gancho vinculado (se houver, em roxo)
- Data de publicação formatada (se houver)
- Ícone de resultado (para Publicado): 🔥 Viral / ✅ Acima / ➡️ Na média / ⚠️ Abaixo

Drag-and-drop entre colunas:
- Ao mover um card, faz PATCH no Notion via useNotion("roteiros") com action: "update" atualizando o campo Status.

Toggle no topo da página:
- "Por status" (default — exibe kanban normal)
- "Por resultado" (regroup: Viral / Acima da média / Na média / Abaixo da média / A definir)

Botão "+ Novo roteiro" no canto superior direito — cria página em branco com Status = "Criação" e redireciona para /roteiros/:id.

Dados vêm do Notion via useNotion("roteiros").

NÃO implemente o editor ainda.
NÃO toque nas outras páginas.
```

---

## Prompt 7 — Editor de Roteiro

```
Na rota /roteiros/:id, crie o editor de roteiro.

Layout 2 colunas (70% / 30%):

COLUNA ESQUERDA (editor):
- Campo Título (input grande, editable inline)
- Row com: Status (select), Resultado (select), Data publicação (date picker)
- Select de Gancho vinculado — dropdown buscando nos ganchos do Notion
- Textarea grande para Texto roteiro (mínimo 400px de altura, auto-resize)
- Abaixo da textarea: chips clicáveis para as marcações
  Segredo | Eng. de emoção | Ponto de virada | Intenção | Gatilho | CTA
  (clicar adiciona/remove do campo Marcações do roteiro)

COLUNA DIREITA (painel fixo):
- Título "Checklist de qualidade"
- 6 checkboxes: Gancho / Clareza / Emoção / Argumento / Retenção / Direcionamento
  (cada checkbox marca/desmarca em tempo real — salva no Notion)
- Barra de progresso mostrando quantos dos 6 estão marcados
- Botão grande "🧠 Rodar Iada" — cor primária #7C3AED

Comportamento:
- Auto-save a cada 3 segundos de inatividade após qualquer mudança (debounce)
- Indicador visual "Salvando..." / "Salvo" no topo
- Botão voltar para /roteiros

Dados carregados via useNotion("roteiros") com action: "get", payload: { pageId: id }.

NÃO implemente a Iada ainda.
NÃO toque nas outras páginas.
```

---

## Prompt 8 — Iada (análise do roteiro)

```
No editor de roteiro (/roteiros/:id), implemente a análise da Iada.

Ao clicar "🧠 Rodar Iada":

1. Chama a Edge Function "iada-analyze" via supabase.functions.invoke com:
   {
     roteiroId: id,
     texto: textoRoteiro,
     marcacoes: marcacoesArray,
     checklist: { gancho, clareza, emocao, argumento, retencao, direcionamento }
   }

2. Enquanto carrega: botão fica com spinner e texto "Analisando...".

3. Resultado abre em painel lateral deslizante (drawer) da direita:
   - Header: "Análise da Iada" + score total (ex: "7.4 / 10")
   - Mini scorecard: 6 barrinhas coloridas (verde/amarelo/vermelho por score)
   - Seção "Pontos fortes" — lista em verde
   - Seção "Sugestões" — para cada sugestão:
     - Trecho original (fundo vermelho/rosa claro com texto tachado)
     - Seta →
     - Sugestão (fundo verde claro)
     - Motivo em texto pequeno (cinza)
     - Botão "Aplicar" — substitui o trecho no textarea
   - Se houver reescrita opcional: seção colapsável "Ver reescrita completa"

4. Após análise bem-sucedida:
   - Salva o JSON completo no campo "Iada — última análise" do roteiro no Notion.
   - Badge aparece no editor indicando "Última análise: [data]"

NÃO toque nas outras páginas.
```

---

## Prompt 9 — Cron de ingestão diária

```
Configure a ingestão automática diária no Supabase.

1. Certifique-se de que a Edge Function "daily-ingest" está deployada e acessível.

2. No Supabase Dashboard, configure um Scheduled Job (pg_cron ou Supabase Cron):
   - Schedule: "0 8 * * *" (todo dia às 8h horário de Brasília = 11h UTC)
   - HTTP POST para a URL da Edge Function daily-ingest

3. Variáveis de ambiente necessárias no Supabase (Settings > Edge Functions > Secrets):
   NOTION_TOKEN=<integration token>
   ANTHROPIC_API_KEY=<chave Claude>
   APIFY_TOKEN=<token Apify>
   INSTAGRAM_SESSION_COOKIE=<cookie sessionid do Instagram>

4. Na Home da aplicação (/), adicione um botão discreto "↻ Sincronizar agora" 
   (ícone pequeno no canto, não destaque visual) que faz POST manual para daily-ingest
   e exibe toast: "Sincronização iniciada — novos conteúdos aparecerão em alguns minutos."

NÃO modifique as Edge Functions (já estão prontas).
NÃO toque nas outras páginas.
```

---

## Referência rápida — IDs do Notion

| Database | ID |
|---|---|
| Ganchos | `623cb39e06864fd9b8a07b1da5d8ab37` |
| Roteiros | `ff760037ac3c455b89dd9df181eacf71` |
| Inspirações | `1d748ed258c94f5480f1f95ebbde4666` |
| Concorrentes | `8514a23ab2b6427aae6cbb0be263b406` |

Hub no Notion: https://www.notion.so/36078711495081d58981deecb60c3be1

---

## Após baixar o projeto via git

Copiar os arquivos de Edge Functions para o projeto:

```
cp -r ~/gleaming-nest/supabase/functions/ ./supabase/functions/
```

Configurar secrets no Supabase CLI:
```
supabase secrets set --env-file ./supabase/.env.example
```

Deploy das funções:
```
supabase functions deploy notion-proxy
supabase functions deploy iada-analyze
supabase functions deploy daily-ingest
```
