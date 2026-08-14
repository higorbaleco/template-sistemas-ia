# PAKAS — PRD do MVP v1

**Product Requirements Document · Versão 1.0 · Maio 2026**
*Cidade-piloto: Maringá · Stack proposta: Lovable + Supabase*

---

## 1. Visão do MVP

O MVP do Pakas valida **uma única hipótese**:

> *Pessoas em Maringá vão usar o Pakas pra decidir onde sair em vez de Google Maps, Instagram ou perguntar no grupo.*

Tudo no MVP serve essa hipótese. O que não serve fica para a v2.

**MVP entrega:**
- Descoberta contextual (busca por intenção, não por nome)
- Filtros por ambiente, estrutura, comida, preço, ocasião
- Score de compatibilidade visível em cada lugar
- Reserva via WhatsApp/painel simples (sem integração de PDV)
- Aprendizado básico de preferências

**MVP NÃO entrega (fica pra v2+):**
- Pagamento integrado / checkout
- Comanda digital
- Pedido antecipado
- Cardápio padronizado entre estabelecimentos
- Integração com PDV/sistema de caixa
- Programa de fidelidade
- Mapa de mesas / disponibilidade em tempo real
- Painel completo de restaurante (na v1, painel é simples: ver reservas + confirmar)

---

## 2. Princípios de produto (não-negociáveis)

**P1 — Velocidade > Completude.** Usuário decide em menos de 90 segundos ou perdemos. Toda tela é otimizada pra decisão rápida.

**P2 — Match > Avaliação genérica.** A pergunta não é "este lugar é bom?", é "este lugar serve pra mim agora?". O score de compatibilidade é o número mais visível em qualquer card.

**P3 — Filtro é o produto.** Sem filtros granulares de contexto, somos Google Maps. Os filtros precisam ser fáceis de aplicar, fáceis de remover e visualmente claros.

**P4 — Defaults inteligentes em todo lugar.** Formulário de reserva já vem com hoje + próximo slot livre + 2 adultos. Usuário ajusta só o que precisa.

**P5 — Tom direto, sem fricção visual.** Copy curta, conversacional, sem corporativês. "Sair pra comer" e não "experiência gastronômica".

---

## 3. Identidade visual

### Design tokens

```css
--mint: #2DD4BF;          /* cor primária — ações, match, destaque ativo */
--mint-dark: #0F766E;     /* hover do mint, ícones em verde */
--mint-soft: #CCFBF1;     /* fundo de chip ativo, badge soft */
--ink: #0B1620;           /* fundo dark, CTA secundário, texto principal */
--ink-soft: #1E293B;      /* texto principal em fundo claro */
--paper: #FFFFFF;         /* cards, inputs */
--cream: #FAFAF7;         /* fundo principal do app (claro mas quente) */
--warm-gray: #F5F1EC;     /* fundo de chips inativos, separadores */
--line: #E8E5DF;          /* bordas, dividers */
--text: #1E293B;          /* texto primário */
--text-soft: #64748B;     /* texto secundário */
--text-faint: #94A3B8;    /* texto terciário, placeholders */
--accent-pink: #FF6B6B;   /* tag de date/romântico */
--accent-yellow: #FFD166; /* tag de família */
```

### Tipografia

- **Display** (títulos, números grandes): **Bricolage Grotesque** — peso 600-800
- **Body** (corpo, UI): **Plus Jakarta Sans** — peso 400-700

Ambas via Google Fonts. Não usar Inter, Roboto, Arial.

### Escala tipográfica

| Token | Tamanho | Uso |
|---|---|---|
| display-xl | 48px / 700 | Splash, hero |
| display-lg | 28-36px / 700 | Títulos de tela |
| display-md | 22-26px / 700 | Títulos de seção, nome do lugar (cover) |
| heading | 18px / 700 | Título de seção dentro da tela |
| body | 14-15px / 500-600 | Texto padrão |
| label | 12px / 600 (uppercase, letter-spacing 0.08em) | Labels de campo |
| caption | 11-12px / 500 | Meta, hints |
| micro | 10px / 600 | Tags em foto, tabbar |

### Componentes-base

- **Bordas**: radius 12px (inputs, chips), 16px (cards pequenos), 18-22px (cards grandes), 28-44px (containers grandes/splash)
- **Sombras**: usar com parcimônia. Apenas em hero cards, CTAs fixos e modais.
- **Espaçamento**: múltiplos de 4. Padding padrão de tela: 20-24px laterais.
- **Toque mínimo**: 44x44px (todos os botões e ícones interativos).

---

## 4. Personas-âncora (resumo)

| Persona | Filtros típicos | Intenção dominante |
|---|---|---|
| **Casal date** | Romântico, mesa íntima, sem som ao vivo, ticket R$60-180 | "Onde a gente vai hoje sem briga?" |
| **Família com crianças** | Playground, mesa pra grupo, estacionamento, comida pra criança | "Lugar que dê pra sentar e relaxar" |
| **Jovem rolê** | Som ao vivo, ambiente jovem, aberto tarde, cerveja boa | "Onde começa o agito mais cedo?" |

Toda decisão de produto passa pelo teste: *"Isso resolve melhor pra pelo menos uma dessas três personas?"*

---

## 5. Inventário de telas do MVP

Dez telas. Nem mais, nem menos.

| # | Tela | Função |
|---|---|---|
| 01 | **Splash / Boas-vindas** | Entrada do app, login/cadastro |
| 02 | **Onboarding Quiz** | 5 perguntas iniciais pra personalizar |
| 03 | **Home** | Hub central — "Do que você tá afim?" |
| 04 | **Filtros avançados** | Painel completo com 6 categorias |
| 05 | **Resultados** | Lista de lugares ordenada por match |
| 06 | **Página do lugar** | Detalhe do estabelecimento |
| 07 | **Cardápio (visualização)** | Cardápio do lugar (não padronizado no MVP) |
| 08 | **Reserva** | Formulário de reserva |
| 09 | **Confirmação / Minhas reservas** | Status da reserva ativa |
| 10 | **Perfil** | Preferências, favoritos, histórico |

---

## 6. Especificação por tela

### Tela 01 — Splash / Boas-vindas

**Objetivo:** entrada do app, captura/login do usuário.

**Layout:**
- Background: gradiente dark (`var(--ink)` → `var(--mint-dark)`)
- Logo Pakas centralizado (símbolo + wordmark)
- Tagline: *"Sair pra comer, beber ou curtir a cidade do jeito que você quer ficou simples Pakas."*
- Dois botões na parte inferior:
  - CTA primário (verde): **"Começar"** → fluxo de cadastro
  - CTA ghost: **"Já tenho conta"** → login

**Cadastro (modal/tela):**
- Telefone (obrigatório, com DDI) — autenticação via OTP/SMS no v1, ou link mágico
- Nome (obrigatório)
- E-mail (opcional)
- Permissão de localização (segundo passo, com explicação curta)

**Estado pós-cadastro:** vai direto pra Tela 02 (Quiz).

---

### Tela 02 — Onboarding Quiz

**Objetivo:** capturar preferências iniciais que alimentam o motor de recomendação.

**Layout:**
- Header: botão voltar + barra de progresso + contador (3/5)
- Step indicator: "Pergunta 3 de 5"
- Pergunta em display-lg
- Subtitle explicativo (opcional, "Pode escolher mais de um")
- Lista de opções como cards selecionáveis (radio ou checkbox dependendo da pergunta)
- CTA fixo no fundo: **"Próxima"** (escuro) → última pergunta vira **"Encontrar lugares"** (verde)

**As 5 perguntas:**

1. **"Com quem você costuma sair?"** (multi-select)
   - Sozinho
   - Casal / date
   - Família com crianças
   - Amigos
   - Colegas de trabalho

2. **"Que tipo de ocasião marca seus rolês?"** (multi-select)
   - Almoço casual
   - Jantar romântico
   - Comemoração
   - Reunião
   - Rolê pra desestressar
   - Saída com kids

3. **"Como você quer o ambiente?"** (multi-select)
   - Romântico e tranquilo
   - Animado com música
   - Familiar
   - Sofisticado
   - Despojado / boteco

4. **"Qual faixa de preço cabe melhor?"** (single-select)
   - Até R$40 por pessoa
   - R$40 a R$80
   - R$80 a R$150
   - Acima de R$150
   - Depende da ocasião

5. **"Que tipos de comida você curte?"** (multi-select, mínimo 2)
   - Pizza
   - Sushi / japonês
   - Churrasco / carnes
   - Italiano / massas
   - Hambúrguer / americano
   - Petiscos / boteco
   - Comida brasileira
   - Árabe
   - Mexicano
   - Vegetariano/vegano

**Comportamento:**
- Cada resposta salva no perfil (`user_preferences`)
- Quiz pode ser pulado ("Pular por agora") — gera perfil neutro
- Quiz pode ser refeito a qualquer momento via Perfil

---

### Tela 03 — Home

**Objetivo:** ponto central. Usuário decide caminho em 3 segundos.

**Layout (de cima pra baixo):**

**Header**
- Saudação contextual ("Bom dia, [nome]" / "Boa tarde" / "Boa noite")
- Avatar circular no canto direito (link pra Perfil)
- Pill de localização: ícone + "Centro, Maringá" + chevron pra trocar

**Hero card (CTA principal)**
- Background dark com gradiente sutil mint
- Texto: **"Do que você tá afim hoje?"**
- Subtitle: "Responde 5 perguntas rápidas e a gente acha o lugar certo."
- Botão: "Começar" → vai pro fluxo Quiz Express (versão rápida do quiz, focada em "agora" — 3 perguntas só: companhia, vibe, faixa de preço)

**Seção: Por ocasião**
- Título: "Por ocasião"
- Grid 2x2 ou 2x3 de cards rápidos:
  - 💗 Date romântico
  - ⭐ Família
  - 🎵 Música ao vivo
  - 🍻 Boteco
  - ☕ Café tranquilo
  - 🎉 Comemoração
- Cada card abre Resultados pré-filtrado

**Seção: Por tipo de comida** (scroll horizontal)
- Pills com emoji + categoria: Pizza, Sushi, Churrasco, Italiana, Hambúrguer, Boteco, Brasileira

**Seção: Pra você** (se houver perfil)
- Carrossel horizontal de 3-5 lugares recomendados com base no perfil
- Cada item: foto pequena + nome + match%

**Tabbar fixa (bottom):**
- Início (ativa)
- Explorar (lupa)
- Favoritos (coração)
- Eu (perfil)

---

### Tela 04 — Filtros avançados

**Objetivo:** controle granular pra usuário power.

**Layout:**
- Header: voltar + título "Filtros" + "Limpar tudo" (texto-link no canto direito)
- Conteúdo scrollável dividido em seções (sticky section headers)

**Seções (na ordem):**

**1. Ocasião** (multi-select, pills)
Date, Família, Amigos, Aniversário, Reunião casual, Almoço rápido, Happy hour, Comemoração, Pra conversar, Sozinho

**2. Ambiente** (multi-select, pills)
Romântico, Tranquilo, Agitado, Familiar, Jovem, Sofisticado, Simples, Ao ar livre, Climatizado, Com música ao vivo, Sem música ao vivo, Com DJ, Com TV/jogos

**3. Estrutura** (multi-select, pills com possível ícone)
Playground, Área kids, Estacionamento, Valet, Acessibilidade, Pet friendly, Mesa externa, Mesa interna, Mesa pra grupo, Mesa reservada, Mesa próxima ao palco, Mesa longe do palco, Mesa próxima ao playground, Banheiro familiar

**4. Comida** (multi-select, pills)
Pizza, Sushi, Churrasco, Hambúrguer, Espeto, Massas, Japonesa, Italiana, Brasileira, Árabe, Mexicana, Cafeteria, Doces, Porções, Vinhos, Drinks, Cerveja, Infantil, Vegetariano, Vegano, Sem glúten, Sem lactose

**5. Preço** (single-select, pills)
Até R$30, R$30-60, R$60-100, R$100-180, Acima de R$180, Promoção ativa, Rodízio, Combo, Happy hour

**6. Operação** (multi-select, pills)
Aberto agora, Fecha tarde (após 23h), Aceita reserva, Pouca fila, Alta disponibilidade, Mesa agora

**Footer fixo:**
- Botão verde grande: **"Ver X lugares"** (count atualiza em tempo real conforme filtros mudam)

**Comportamento:**
- Cada filtro selecionado adiciona à query
- Counter ao vivo de quantos lugares atendem
- Estado vazio (0 lugares): texto "Nenhum lugar atende todos esses filtros. Que tal afrouxar algum?" + botão "Limpar tudo"

---

### Tela 05 — Resultados

**Objetivo:** mostrar lugares ordenados por match.

**Layout:**

**Header:**
- Search pill: mostra busca atual ("Pra família com playground") — clicável pra editar
- Botão filtro com badge numérico (quantos filtros ativos)

**Active filters bar (scroll horizontal):**
- Chips com filtros aplicados. Filtros prioritários em mint (cor de match), demais em ink.
- Cada chip tem um "×" pra remover

**Meta line:**
- "X lugares compatíveis em Maringá · ordenado por match"
- Toggle de ordenação: Match (default) / Distância / Avaliação / Preço

**Lista de cards (vertical scroll):**
Cada card:
- Foto grande (130-140px de altura, full bleed)
- Match badge no canto superior esquerdo: "94% match" com ícone de check, fundo branco
- Heart button no canto superior direito (favoritar)
- Tags sobrepostas no canto inferior esquerdo da foto (até 3): "Playground", "Mesa p/ grupo", "Estacionamento" — fundo escuro com blur
- Info section:
  - Nome do lugar (display-md)
  - Rating (★ 4.8) à direita
  - Meta line: categoria · preço por pessoa · distância

**Empty state (caso 0 resultados):**
- Ilustração simples ou ícone grande
- Texto: "Não achamos lugares que batam com tudo isso. Tente afrouxar algum filtro?"
- Botão "Editar filtros"

**Loading state:**
- Skeletons dos cards (3-4) com shimmer suave

---

### Tela 06 — Página do lugar

**Objetivo:** convencer o usuário a reservar.

**Layout (scroll vertical):**

**Cover (240px de altura):**
- Foto principal full-bleed
- Gradient overlay no rodapé (transparent → ink 60%)
- Botão voltar (top-left) + heart (top-right)
- Sobre o gradient (bottom):
  - Nome do lugar (display-md, branco)
  - Meta: "★ 4.8 · 312 avaliações · Aberto agora"

**Quick info row (3 cards):**
- R$45 / por pessoa
- 15min / preparo médio
- 1,2km / de você

**Match card (destaque):**
- Background gradiente mint → mint-dark
- 94% em display-lg
- Texto: "Bate com o que você quer" + explicação curta (quais filtros atendem)

**Seção: Estrutura**
- Grid 2x2 de features que o lugar tem (checkmark verde)
- Apenas mostra as relevantes pro perfil do usuário primeiro

**Seção: Ambiente**
- Tags em chips: Familiar · Climatizado · Música ambiente · Aberto

**Seção: Tipo de comida**
- Pills: Pizza · Massas · Petiscos

**Seção: Avaliações por uso** (diferencial!)
- "Bom pra família — 4.9 ★ (38 avaliações)"
- "Bom pra date — 4.2 ★ (12 avaliações)"
- "Bom pra grupo — 4.7 ★ (24 avaliações)"

**Seção: Cardápio**
- Mini preview com 3-4 itens
- Botão "Ver cardápio completo" → Tela 07

**Seção: Localização**
- Mini mapa (estático no MVP) + endereço + botão "Como chegar" (abre Maps)

**Footer fixo (sticky CTA):**
- Botão grande dark: **"Reservar mesa"** + preço por pessoa em mint

---

### Tela 07 — Cardápio

**Objetivo:** mostrar o que o lugar serve.

**MVP simplificado:**
- Não é padronizado entre estabelecimentos (vira v2)
- Apenas exibe o que o restaurante cadastrou
- Categorias colapsáveis (Entradas, Pratos, Bebidas, Sobremesas)
- Cada item: nome + descrição + preço + foto pequena (opcional)
- Sem ação direta (não pode pedir no MVP — pedido só na v2)

**Estado vazio:** "Este lugar ainda não cadastrou o cardápio. Você pode pedir lá."

---

### Tela 08 — Reserva

**Objetivo:** capturar dados da reserva, enviar pro restaurante.

**Layout:**

**Header:**
- Voltar
- Título: "Sua reserva"
- Sub: "A gente avisa o restaurante. Você só chega."

**Card do lugar (resumo):**
- Foto pequena + nome + meta

**Campos (em ordem):**

**Quando**
- Date picker simplificado — começa em "Hoje" (default)
- Próximos 14 dias

**Horário**
- Pills horizontais com slots disponíveis (de meia em meia hora)
- Default: próximo slot livre considerando hora atual

**Pessoas**
- Counter pra adultos (default 2)
- Counter pra crianças (default 0) — se família

**Preferência de mesa** (chips multi-select, opcional)
- "Mesa de canto"
- "Perto do playground"
- "Longe do som ao vivo"
- "Mesa externa"
- "Acessível"

**Observações** (textarea opcional)
- Placeholder: "Aniversário, primeira vez no lugar, alguma alergia... fica à vontade."

**Footer (sticky):**
- Summary line: "Mesa pra 6 pessoas hoje às 19:30"
- Botão verde: **"Confirmar reserva"**

**Pós-confirmação:**
- Animação curta de sucesso
- Vai pra Tela 09

**No backend (MVP):**
- Reserva fica com status `pending`
- Sistema envia mensagem WhatsApp estruturada pro restaurante: *"Olá! Nova reserva via Pakas. [Nome], [N adultos + N crianças], [data] às [horário]. Observações: [obs]. Confirma respondendo SIM ou ajuste."*
- Restaurante confirma manualmente (no painel web simples ou respondendo WhatsApp)
- Usuário recebe push/SMS quando confirmado

---

### Tela 09 — Confirmação / Minhas reservas

**Objetivo:** acompanhar status da reserva.

**Layout:**

**Tela de confirmação imediata (após reservar):**
- Ícone grande de check em mint
- Título: "Quase lá!"
- Texto: "A gente já avisou a [Nome do lugar]. Em até 15 minutos eles confirmam sua mesa."
- Card de resumo da reserva
- Botão: "Voltar pra home"
- Link: "Ver minhas reservas"

**Lista "Minhas reservas":**
- Aba: Próximas / Histórico
- Cada reserva como card:
  - Foto do lugar
  - Nome + data/hora
  - Status badge: **Pendente** (amarelo) / **Confirmada** (verde) / **Cancelada** (cinza) / **Realizada** (verde escuro)
  - Botão "Detalhes" → modal com tudo + opção de cancelar (até X horas antes)

---

### Tela 10 — Perfil ("Eu")

**Objetivo:** ajustes pessoais, histórico e preferências.

**Seções:**

**Header pessoal:**
- Avatar grande
- Nome + cidade
- Botão "Editar perfil" (pequeno)

**Cards de acesso rápido:**
- Minhas reservas
- Favoritos
- Histórico de lugares
- Refazer quiz de preferências

**Preferências aprendidas (read-only no MVP):**
- "Você prefere ambientes tranquilos"
- "Cerveja: Heineken parece ser sua favorita"
- "Ticket médio: R$60 por pessoa"
- Botão "Resetar preferências"

**Configurações:**
- Notificações
- Localização
- Política de privacidade
- Termos
- Sair

---

## 7. Fluxos principais

### Fluxo F1 — Descoberta rápida (jornada feliz)

```
Splash → Cadastro (telefone + nome) → Quiz (5 perguntas)
   → Home → toca "Família" → Resultados pré-filtrados
   → Toca primeiro card → Página do lugar → "Reservar"
   → Formulário (defaults) → Confirmar → Tela de confirmação
```

Tempo-alvo total: < 90 segundos do toque em "Família" até a confirmação.

### Fluxo F2 — Power user com filtros

```
Home → Botão filtros avançados → Seleciona ocasião + estrutura + preço
   → Toca "Ver 12 lugares" → Resultados
   → Aplica filtro adicional via chip → Lista atualiza
   → Abre lugar → Reserva
```

### Fluxo F3 — Volta ao app (usuário recorrente)

```
App abre direto na Home → Seção "Pra você" mostra recomendações personalizadas
   → Toca card → Página do lugar → Reserva (formulário já preenchido com último uso)
```

### Fluxo F4 — Reserva via intent express (sem quiz)

```
Home → toca "Date romântico" → Mini-modal: "Pra quando?" (Hoje / Amanhã / Sábado)
   → Resultados → Reserva
```

---

## 8. Taxonomia completa de filtros

Lista exaustiva. Cada filtro precisa ter um booleano correspondente na tabela `establishment_features`.

**Estrutura física:**
`has_playground` · `has_kids_area` · `has_parking` · `has_valet` · `no_busy_street_nearby` · `large_group_table` · `corner_table` · `window_table` · `outdoor_covered_area` · `outdoor_open_area` · `wheelchair_accessible` · `baby_changing_station` · `large_groups_capacity`

**Atmosfera:**
`has_live_music` · `no_live_music` · `has_dj` · `has_dance_floor` · `romantic_vibe` · `young_crowd` · `family_friendly` · `quiet_vibe` · `loud_vibe` · `sophisticated_vibe` · `casual_vibe` · `pet_friendly` · `has_tv_sports`

**Comercial:**
`accepts_reservation` · `accepts_pre_order` (v2) · `closes_late` · `combo_family` · `happy_hour_active` · `promotion_active`

**Cardápio (booleanos de categoria):**
`serves_pizza` · `serves_sushi` · `serves_steak` · `serves_burger` · `serves_pasta` · `serves_italian` · `serves_brazilian` · `serves_arabic` · `serves_mexican` · `serves_cafeteria` · `serves_drinks` · `serves_wine` · `serves_craft_beer` · `has_kids_menu` · `has_vegetarian` · `has_vegan` · `has_gluten_free` · `has_lactose_free`

**Preço (enum):**
`price_range`: `up_to_30` | `30_to_60` | `60_to_100` | `100_to_180` | `above_180`

---

## 9. Lógica de score de compatibilidade

Cada estabelecimento recebe um score de 0-100 baseado nos filtros que o usuário aplicou + perfil aprendido.

### Pesos

| Critério | Peso máximo |
|---|---|
| Filtros marcados como obrigatórios pelo usuário | 40 pts |
| Filtros marcados como desejáveis (perfil aprendido) | 20 pts |
| Distância (até 5km do usuário) | 10 pts |
| Avaliação geral (4.0+) | 10 pts |
| Compatibilidade de preço | 10 pts |
| Tempo médio de espera baixo | 10 pts |
| **Total** | **100 pts** |

### Fórmula simplificada

```
score = 
  (atende_obrigatorios ? 40 : 0)
  + (filtros_desejaveis_atendidos / total_desejaveis * 20)
  + max(0, 10 - (distancia_km * 2))
  + ((rating - 3) * 5)  // 3.0 = 0pts, 5.0 = 10pts
  + (preco_compativel ? 10 : 0)
  + (tempo_espera_baixo ? 10 : 0)
```

### Regras de eliminação

- Se o usuário marca filtro como **obrigatório** e o lugar **não atende** → lugar é eliminado da lista (não aparece)
- Se o lugar está **fechado** e o filtro "aberto agora" está ativo → eliminado
- Se a distância > 15km da localização atual → eliminado (configurável)

### Exibição

- ≥ 90: badge "Match perfeito" — fundo mint forte
- 75-89: badge "Match alto" — fundo mint soft
- 60-74: badge numérico simples
- < 60: sem badge (aparece no fim da lista)

---

## 10. Schema de dados — MVP

Versão simplificada (10 tabelas) pra Supabase.

### `users`
```
id (uuid, PK)
name (text)
phone (text, unique)
email (text, nullable)
city (text, default 'Maringá')
avatar_url (text, nullable)
created_at (timestamp)
updated_at (timestamp)
```

### `user_preferences`
```
id (uuid, PK)
user_id (uuid, FK → users)
favorite_cuisines (text[])
ambiance_preferences (text[])  -- romantic, family, young, sophisticated, casual
typical_companion (text)        -- solo, couple, family, friends
preferred_price_range (text)    -- enum
has_children (boolean)
prefers_playground (boolean)
prefers_live_music (boolean)
prefers_quiet (boolean)
learned_beer_brand (text, nullable)  -- aprendido com uso
learned_avg_ticket (numeric, nullable)
created_at, updated_at
```

### `establishments`
```
id (uuid, PK)
name (text)
slug (text, unique)
description (text)
category (text)              -- pizzaria, sushi, bar, restaurante, café, balada
phone (text)
whatsapp (text)
address (text)
neighborhood (text)
city (text)
state (text)
latitude (numeric)
longitude (numeric)
average_ticket (numeric)
price_range (text)            -- enum
opening_hours (jsonb)         -- {mon: [{open: "18:00", close: "23:00"}], ...}
rating_overall (numeric)
rating_count (integer)
cover_image_url (text)
gallery_images (text[])
status (text)                 -- active, paused, pending
accepts_reservation (boolean)
created_at, updated_at
```

### `establishment_features`
Uma linha por estabelecimento. Todos os campos booleanos da taxonomia (Seção 8).

### `establishment_use_ratings`
Avaliações segmentadas por uso (diferencial do Pakas)
```
id, establishment_id, 
rating_for_date (numeric)
rating_for_family (numeric)
rating_for_friends (numeric)
rating_for_business (numeric)
rating_environment (numeric)
rating_food (numeric)
rating_service (numeric)
rating_noise_level (numeric)  -- 1=silencioso, 5=barulhento
rating_wait_time (numeric)
count_per_use (jsonb)
```

### `menus` e `menu_items`
Estrutura simples no MVP. Cardápio é por estabelecimento, sem padronização.

### `reservations`
```
id (uuid, PK)
user_id (FK → users)
establishment_id (FK)
reservation_date (date)
reservation_time (time)
adults_count (integer)
children_count (integer)
seat_preferences (text[])
notes (text, nullable)
status (text)                 -- pending, confirmed, cancelled, completed, no_show
confirmation_method (text)    -- whatsapp, panel, app_v2
restaurant_notified_at (timestamp)
confirmed_at (timestamp, nullable)
completed_at (timestamp, nullable)
created_at, updated_at
```

### `favorites`
```
id, user_id, establishment_id, created_at
unique(user_id, establishment_id)
```

### `user_history`
Lugares visitados/avaliados/clicados pra alimentar recomendações.
```
id, user_id, establishment_id, 
action (text)                 -- viewed, clicked, reserved, completed, reviewed
context (jsonb, nullable)     -- filtros usados na busca, etc
created_at
```

### `reviews`
```
id, user_id, establishment_id, reservation_id
rating_general, rating_food, rating_service, rating_environment, rating_noise
good_for_date, good_for_family, good_for_friends, good_for_business (booleans)
comment (text)
created_at
```

---

## 11. Estados-padrão (loading / empty / error / success)

### Loading
- Skeletons com shimmer suave (não spinners). Cor `--warm-gray` com gradient.
- Em telas de resultado, mostrar 3-4 skeleton cards.

### Empty
- Ícone outline (Lucide) de 64px
- Headline curta ("Nada por aqui ainda")
- Subtitle explicativo
- CTA óbvio quando aplicável ("Ver todos os lugares")

### Error
- Ícone alert (em accent-pink, não vermelho agressivo)
- Headline: "Algo travou aqui"
- Subtitle: "Tenta de novo? Se persistir, fala com a gente."
- Botão "Tentar de novo"

### Success
- Check grande em mint, animação leve (scale-up + fade)
- Headline curta com 1-2 emojis no máximo
- Pode ter ação seguinte óbvia

---

## 12. Microcopy guide

### Princípios
1. **Direto.** Sem "Por favor" ou "Gostaríamos que".
2. **Coloquial.** "Tá afim" > "Está com vontade de".
3. **Brasileiro.** "Rolê", "boteco", "agito" são bem-vindos.
4. **Curto.** Nenhuma frase com mais de 12 palavras se evitável.

### Vocabulário Pakas (use)
- "Lugar" (não "estabelecimento" na UI; só usar em painel admin)
- "Reservar mesa" (não "fazer reserva")
- "Pra família", "pra date", "pra rolê" (não "para")
- "Tá afim", "tá em busca", "tá na vibe"
- "Match" (anglicismo aceito)
- "Confirmar reserva" (não "submeter")

### Vocabulário a evitar
- "Experiência gastronômica" → use "comer fora"
- "Curadoria premium" → use "lugares bons"
- "Plataforma" → use "Pakas" ou "o app"
- "Estabelecimento" → use "lugar"
- "Usuário" → use "você" (sempre 2ª pessoa)

### Erros & avisos (tom)
- ❌ "Erro ao processar sua requisição"
- ✅ "Travou aqui. Tenta de novo?"

- ❌ "Campo obrigatório"
- ✅ "Falta o seu nome"

- ❌ "Selecione uma opção"
- ✅ "Escolhe uma"

---

## 13. Fora do escopo (v2 e além)

Lista explícita do que NÃO entra no MVP. Isso protege foco.

**V2 (próximos 6 meses pós-MVP):**
- Pagamento integrado (pré-pagamento de reserva ou comanda)
- Comanda digital no app
- Pedido antecipado
- Padronização do cardápio entre estabelecimentos
- Painel restaurante completo (analytics, gestão de mesas)
- Integração com PDV/sistema de caixa
- Programa de fidelidade (Pakas Pontos)
- Push notifications inteligentes ("Sua reserva é em 1h")

**V3 (12 meses pós-MVP):**
- Mapa de mesas em tempo real
- Fila de espera virtual
- Assinatura Pakas Plus (usuário premium)
- Eventos privados / lounge / experiências
- Expansão pra outras cidades
- Marketplace de mídia (destaques patrocinados)

---

## 14. Métricas de sucesso do MVP

O MVP é bem-sucedido se, em 90 dias após launch em Maringá:

| Métrica | Meta |
|---|---|
| Usuários cadastrados | ≥ 3.000 |
| Usuários ativos mensais (MAU) | ≥ 1.500 |
| Reservas confirmadas/mês | ≥ 400 |
| Restaurantes ativos no painel | ≥ 60 |
| Retenção D30 | ≥ 35% |
| NPS de usuário | ≥ 55 |
| NPS de restaurante | ≥ 50 |
| Tempo médio de decisão dentro do app | ≤ 90s |
| Taxa de no-show | ≤ 12% |

Se essas métricas baterem, partimos pra v2 (pagamento + comanda).
Se não baterem, pivotamos antes de escalar.

---

## 15. Riscos do MVP e mitigações

| Risco | Mitigação |
|---|---|
| Restaurante não responde no WhatsApp → reserva fica pendente | Equipe Pakas faz follow-up manual em 30min; restaurante que não responde 3x vai pra "modo manual" (Pakas ativa por telefone) |
| Usuário acha que quiz é chato | Opção "Pular" sempre visível; quiz pode ser feito depois |
| Filtros muitos confundem | Tela de Filtros agrupada por seções colapsáveis; filtros mais usados no topo |
| Score parece arbitrário | Página do lugar mostra "Por que 94%?" expandível listando os critérios |
| Cidade de Maringá tem poucos restaurantes premium | MVP foca cobertura ampla, não premium; oferta é segmentada por persona, não por luxo |

---

*Fim do PRD MVP v1.0. Próximo documento: Prompts prontos pro Lovable.*