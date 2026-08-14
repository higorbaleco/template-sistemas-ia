# PAKAS — Especificação Completa e Definitiva

**Documento Master de Produto, Engenharia e Roadmap**
Versão 1.0 | Maio 2026

---

## ÍNDICE EXECUTIVO

- [Visão](#visão)
- [1. Onboarding Completo](#1-onboarding-completo)
- [2. Telas Detalhadas](#2-telas-detalhadas)
- [3. Sistema de Localização](#3-sistema-de-localização)
- [4. Sistema de Filtros](#4-sistema-de-filtros)
- [5. Sistema de Avaliações](#5-sistema-de-avaliações)
- [6. Sistema de Recomendações](#6-sistema-de-recomendações)
- [7. Schema de Dados Completo](#7-schema-de-dados-completo)
- [8. Dependências e Fluxos](#8-dependências-e-fluxos)
- [9. Roadmap Completo](#9-roadmap-completo)

---

## VISÃO

**Pakas** é a plataforma de saída inteligente. Usuário entra, responde perguntas sobre o que quer, e o Pakas mostra os lugares certos. Sem busca genérica, sem algoritmo invisível. Tudo é baseado em **match contextual**: quanto aquele lugar bate com o que você pediu.

---

## 1. ONBOARDING COMPLETO

### Fluxo Linear: 10 Passos

Usuário entra em Splash → Cadastro → 8 Perguntas → Confirmação → Home

#### Passo 1: Splash + Login

**Tela: Splash**

Componentes:
- Logo Pakas (quadrado mint com P)
- Wordmark "PAKAS" (Bricolage, grande)
- Tagline: "Sair pra comer, beber ou curtir a cidade do jeito que você quer ficou simples Pakas"
- Botão "Começar" (mint, primary)
- Botão "Já tenho conta" (ghost, outline branco)

Comportamentos:
- "Começar" → NavLink(/onboarding/step-1)
- "Já tenho conta" → Abre modal de login (campo telefone, botão "Entrar")
- Modal login: busca usuário por phone em `users` table, se existe → seta user no Context/Store, vai pra /home

---

#### Passo 2: Cadastro

**Tela: /onboarding/step-1 - Seu Perfil**

Componentes:
- Título: "Vamos começar?"
- Subtítulo: "Só pedimos o essencial. Sem senha, sem complicação."

Campos:
1. **Nome**
   - Input type="text"
   - Label: "Seu nome"
   - Validação: min 2 chars, max 50 chars
   - Placeholder: "Ex: Maria"
   - Obrigatório

2. **Telefone**
   - Input type="tel" com máscara
   - Label: "Telefone com DDD"
   - Máscara: (XX) XXXXX-XXXX
   - Validação: 11 dígitos (após remover máscara)
   - Unique check: antes de avançar, valida se phone já existe em `users` table
   - Se existe: mostra erro "Esse telefone já tem cadastro, tenta login"
   - Obrigatório

3. **E-mail** (opcional)
   - Input type="email"
   - Label: "E-mail (opcional)"
   - Validação: regex email
   - Placeholder: "seu@email.com"
   - Opcional

4. **Localização Atual** (detectada ou manual)
   - Se primeiro acesso: pergunta "Usar localização atual?"
   - Botão: "Detectar localização" ou "Escolher manualmente"
   - Se permitir GPS: mostra "📍 Maringá, Paraná (detectado)" com opção trocar
   - Se negar: input de busca "Buscar cidade, bairro ou CEP"
   - Obrigatório pra continuar

Checkbox:
- "Concordo com termos de privacidade" (link pra policy)
- Obrigatório

Botão:
- "Próximo" (disabled até todos campos obrigatórios preenchidos)

Ao clicar "Próximo":
1. Valida todos os campos
2. Faz POST /api/users (cria novo user em Supabase)
3. Salva response (user object com id, name, phone, location)
4. Salva em Context/Store
5. NavLink(/onboarding/step-2)

Se error (ex: telefone duplicado após validação, problema Supabase):
- Mostra toast error
- Não avança

---

#### Passos 3-10: Perguntas (Quiz)

**Tela: /onboarding/step-2 até step-9**

Layout padrão pra todas:
- Header sticky: voltar + progress bar + "X de 8"
- Título da pergunta (grande, Bricolage display)
- Subtítulo/instrução (ex: "Pode escolher mais de um")
- Opções (cards ou pills, conforme tipo)
- Footer sticky: botão "Próximo" (disabled até responder)

---

##### Passo 3: Ocasião Primária (Single-Select)

**Pergunta**: "Qual é o seu principal motivo pra sair?"

Tipo: Single-select (apenas 1 resposta)

Opções (com ícone Lucide + descrição):
1. **Date romântico** (Heart)
   - "Noite especial com aquela pessoa"
   
2. **Família** (Users)
   - "Com crianças ou a galera toda"
   
3. **Amigos** (Users2)
   - "Rolê descontraído com os camaradas"
   
4. **Reunião/trabalho** (Briefcase)
   - "Cliente, colegas, networking"
   
5. **Sozinho** (User)
   - "Relax só pra mim"
   
6. **Comemoração** (PartyPopper)
   - "Aniversário, promoção, especial"

Comportamento:
- Seleciona uma → cor muda pra mint, check aparece
- Desselecionar: clica de novo → volta ao state vazio
- Botão "Próximo" ativa quando 1 opção selecionada

Salva em: `user_preferences.primary_occasion` (string enum)

---

##### Passo 4: Ambiente (Multi-Select até 3)

**Pergunta**: "Como você quer se sentir?"

Tipo: Multi-select (máximo 3 opções)

Opções (com ícone):
1. **Romântico** (Heart)
   - "Pouco barulho, mesa íntima, iluminação suave"
   
2. **Tranquilo** (Smile)
   - "Relaxante, música baixa ou silêncio"
   
3. **Agitado** (Music)
   - "Som alto, energia, movimento"
   
4. **Familiar** (Baby)
   - "Acolhedor, bom pra crianças"
   
5. **Sofisticado** (Sparkles)
   - "Elegante, design caprichado"
   
6. **Descontraído** (Beer)
   - "Casual, sem frescura, pura diversão"
   
7. **Ao ar livre** (Wind)
   - "Varanda, terraço, espaço aberto"
   
8. **Aconchegante** (Home)
   - "Intímista, apertadinho, clima quentinho"

Comportamento:
- Clica opção → adiciona (até 3)
- Se já tem 3 e clica outra → mostra toast "Máximo 3 escolhas"
- Pode remover clicando de novo
- Contador: "X de 3 selecionados"

Salva em: `user_preferences.ambiance_preferences` (array de strings)

---

##### Passo 5: Infraestrutura (Multi-Select, sem limite)

**Pergunta**: "O que é importante pra você?"

Tipo: Multi-select (sem limite)

Layout: 3 seções colapsáveis

**Seção 1: Pra Crianças**
- Playground estruturado
- Área kids/brinquedoteca
- Cadeira de refeição
- Fraldário/banheiro familiar
- Espaço seguro pra correr

**Seção 2: Conforto**
- Estacionamento
- Valet parking
- Acessibilidade/cadeira de rodas
- Wifi rápido
- Tomadas/carregador

**Seção 3: Experiência**
- Mesas externas
- Mesa reservada/privada
- Perto da música ao vivo
- Longe do som ao vivo
- Mesa de canto
- Mesa pra ver a rua

Comportamento:
- Checkbox pra cada item
- Contador: "X selecionados"
- Pode deixar vazio (vai pra próxima)

Salva em: `user_preferences.must_have_features` (array)

---

##### Passo 6: Comida & Restrições (Multi-Select)

**Pergunta 1**: "Que tipos de comida você curte?"

Tipo: Multi-select (sem limite, mas mín 1 recomendado)

Opções (com ícone contexto):
- Pizza (Pizza)
- Sushi/Japonês (Utensils)
- Churrasco (Flame)
- Massas (Pasta)
- Hambúrguer (Sandwich)
- Comida brasileira (Leaf)
- Árabe (UtensilsCrossed)
- Mexicano (Leaf)
- Vegetariano (Leaf)
- Vegano (Leaf)
- Comida de boteco (Beer)
- Cafeteria/Doces (Coffee)
- Frutos do mar (Fish)
- Tailandês (Utensils)
- Indiano (Utensils)
- Cervejaria (Wine)

**Pergunta 2**: "Tem alguma restrição?" (mesmo step, abaixo)

Tipo: Multi-select (sem limite)

Opções:
- Sem glúten
- Sem lactose
- Vegetariano
- Vegano
- Sem peixe
- Alergia a amendoim
- Alergia a frutos do mar
- Sem açúcar

Comportamento:
- Ambas as seções no mesmo step
- Pode deixar ambas vazias (vai pra próxima)
- Contador individual pra cada seção

Salva em:
- `user_preferences.favorite_cuisines` (array)
- `user_preferences.dietary_restrictions` (array)

---

##### Passo 7: Faixa de Preço (Single-Select + Custom)

**Pergunta**: "Quanto você quer gastar?"

Tipo: Radio button (seleciona 1) + toggle pra custom

**Opção 1: Ranges pré-definidos**
- ◯ Econômico: Até R$ 30
- ◯ Acessível: R$ 30-60
- ◯ Moderado: R$ 60-100
- ◯ Premium: R$ 100-180
- ◯ Luxo: Acima de R$ 180
- ◯ Não importa

**Opção 2: Custom (toggle)**

Se ativa toggle "Quero customizar":
- Mostra inputs: "De: R$ ___" e "Até: R$ ___"
- Validação: números, De <= Até
- Exemplo: R$ 50 até R$ 120

Comportamento:
- Ao selecionar range: desativa toggle custom
- Ao ativar toggle custom: desativa ranges
- Botão "Próximo" ativa quando qualquer opção selecionada

Salva em:
- `user_preferences.price_range` (string: "30-60" ou "custom")
- `user_preferences.price_min` (int, se custom)
- `user_preferences.price_max` (int, se custom)

---

##### Passo 8: Distância (Single-Select + Custom)

**Pergunta**: "Que distância você aceita?"

Tipo: Radio button + toggle custom

**Opção 1: Ranges**
- ◯ Pertinho: Até 1 km
- ◯ Próximo: 1-3 km
- ◯ Normal: 3-8 km
- ◯ Longe tudo bem: 8-15 km
- ◯ Não importa

**Opção 2: Custom (toggle)**

Se ativa:
- Mostra slider ou input: "Máximo: ___ km"
- Range: 0.5 km até 50 km
- Mostra no input: "Até X km de você"

Comportamento:
- Mesmo que preço (radio vs custom exclusivos)
- Botão "Próximo" ativa quando selecionado

Salva em:
- `user_preferences.max_distance` (string: "1" ou "custom")
- `user_preferences.max_distance_km` (float, se custom)

---

##### Passo 9: Horário (Single-Select + Optional)

**Pergunta**: "Quando você quer ir?"

Tipo: Radio button + optional time picker

**Opções:**
- ◯ Agora (próximas 2 horas)
- ◯ Hoje à noite (18h-23h)
- ◯ Amanhã
- ◯ Esta semana
- ◯ Não tenho data fixa

Se escolher "Amanhã" ou "Esta semana":
- Abre mini-calendar com próximos 14 dias
- Clica no dia → mostra dia selecionado

**Horário específico (optional):**
- Toggle: "Tem horário preferido?"
- Se ativa: input time picker (19:30)
- Ou deixa flexível

Comportamento:
- Radio button obrigatório
- Horário específico é nice-to-have
- Botão "Próximo" ativa ao selecionar data

Salva em:
- `user_preferences.time_preference` (string: "now", "tonight", "tomorrow", "this_week", "flexible")
- `user_preferences.preferred_date` (date, se specific)
- `user_preferences.preferred_time` (time, se specific)

---

#### Passo 10: Resumo & Confirmação

**Tela: /onboarding/step-10 - Vamos lá!**

Mostra resumo visual de TUDO que foi configurado:

Cards visualmente agradáveis com ícones:

```
📍 Maringá, Paraná
Localização

💗 Date romântico
Ocasião principal

🎵 Agitado, Ambiente familiar
Ambiance (até 3)

🎈 Playground, Mesa pra grupo, Estacionamento
Infraestrutura

🍕 Pizza, Sushi, Cerveja
Culinária

❌ Sem lactose
Restrições

💰 R$ 60-100
Faixa de preço

📏 Até 5 km
Distância

🕐 Hoje à noite
Horário
```

Cada card clicável leva pra editar aquele passo.

Botão grande "Explorar lugares agora" (mint, primary, 18px height):
- OnClick:
  1. Valida todos os campos (devem ter valores)
  2. Faz POST /api/preferences (cria/atualiza user_preferences)
  3. Salva em Context
  4. NavLink(/home)

---

## 2. TELAS DETALHADAS

### Tela 00: Splash (Revisitada)

**Path:** `/`

**Estrutura:**

- **Fundo:** Gradiente ink (#0B1620) → mint-dark (#0F766E) + 2 círculos mint blur nos cantos
- **Logo:** 110x110 mint square, P branco 56px, rotação -3deg, sombra forte
- **Wordmark:** "PAKAS" Bricolage 48px peso 700 branco, -0.04em tracking
- **Tagline:** Plus Jakarta 17px, branco 70% opacity, centered, 280px max-width
- **Buttons:**
  - Primário "Começar": mint bg, ink text, 18px altura, radius 16px, peso 700
  - Ghost "Já tenho conta": transparent, white 1.5px border, white text, 18px altura

**Comportamento:**
- "Começar" → naviga /onboarding/step-1
- "Já tenho conta" → abre modal overlay com login (telefone input + botão "Entrar")
  - Modal: white bg, radius 24px, padding 24px, centered
  - Input telefone com máscara
  - Botão "Entrar" mint
  - Se user existe: salva em Context, vai pra /home
  - Se não existe: mostra erro "Não encontramos esse telefone. Tenta cadastrar?"
  - Link "Voltar" fecha modal

---

### Tela 01: Home

**Path:** `/home`

**Estrutura:**

Background: cream (#FAFAF7)

**A. Header Customizado (não sticky)**

Padding: 20px

- Greeting dinâmico:
  - Se hora < 12: "Bom dia, Maria"
  - Se 12-18: "Boa tarde, Maria"
  - Se >18: "Boa noite, Maria"
  - Font: Plus Jakarta 14px color text-soft + Bricolage 28px peso 700 color ink

- Avatar à direita: 42x42, gradient mint, iniciais brancas, clickable → /profile

- Location pill abaixo (inline-flex):
  - MapPin icon 14px
  - "📍 Centro, Maringá"
  - Chevron down
  - Clickable → abre location picker modal

---

**B. Hero Card**

Margin-top: 20px
Padding: 22px
Border-radius: 22px
Background: ink (#0B1620)
Color: white

- Efeito decorativo: círculo radial mint canto bottom-right opacity 0.5

- Título (Bricolage 22px peso 700 -0.02em):
  "Do que você tá <span mint>afim hoje?</span>"

- Subtítulo (Plus Jakarta 13px opacity 0.7):
  "Responde 3 perguntas rápidas e a gente acha."

- Botão inline (mint bg, ink text, pill, peso 700):
  "Começar" + ChevronRight ícone
  - Onclick → abre modal/sheet com Quiz Rápido (3 perguntas: ocasião, ambiente, preço)

---

**C. Seção: Por Ocasião**

Margin-top: 24px
Título: Bricolage 18px peso 700 "Por ocasião"

Grid 2 colunas, gap 10px

Cards (branco, border line, radius 16px, padding 14px):
- Quadrado ícone 36x36 radius 10 (background colorido suave, ícone cor escura)
- Nome 13px peso 700
- Sub 11px text-soft

6 cards:
1. Date romântico (Heart, background #FFE4E4, icon accent-pink)
2. Família (Users, background #FFF4D6, icon #B07500)
3. Música ao vivo (Music, background mint-soft, icon mint-dark)
4. Amigos (Users2, background cream, icon ink)
5. Sozinho (User, background line, icon text-soft)
6. Comemoração (PartyPopper, background warm-gray, icon #FF9F1C)

Comportamento:
- Onclick card → `/explore?occasion=<occasion-id>`

---

**D. Seção: Mais Visitados (por você)**

Margin-top: 24px
Título: "Seus últimos" (só mostra se user tem histórico)

Carrossel horizontal (scroll), gap 10px

Cada mini-card (width 180px flex-shrink 0):
- Foto quadrada 160x160 radius 14
- Nome abaixo 13px peso 700
- Match % abaixo 11px color mint
- Rating ★ 11px

Exemplo: 5-8 cards

Comportamento:
- Onclick → /place/:id

Se vazio (primeira vez):
- Mostra: "Você ainda não visitou nenhum lugar. Comece a explorar!"

---

**E. Seção: Trending em [Cidade]**

Margin-top: 24px
Título: "Trending em Maringá"
Subtítulo: "Lugares em alta essa semana"

Grid 2 colunas, gap 10px (mobile), mais colunas em desktop

Cards (branco, border line, radius 18px, overflow hidden):
- Foto 130px de altura, gradient fallback
- Badge "🔥 Trending" absolute top-right (background rgba(0,0,0,0.7), white text, padding 6x10, radius 6)
- Info abaixo (padding 14px):
  - Nome 15px peso 700
  - Rating + count 12px
  - Tag "Novo em Maringá" ou "Mais visitado" (11px, mint bg, ink text)

Exemplo: 4-5 cards

Comportamento:
- Onclick → /place/:id

---

**F. Seção: Favoritos Rápido**

Margin-top: 24px

Se user tem favoritos (>0):
- Título: "Seus favoritos"
- Carrossel 3-4 primeiros
- Cada: foto 150x100 radius 14, nome, match%, heart filled

Se vazio:
- Mostra: "Favorite seus lugares preferidos pra acessar rápido. Clica no ❤️"

Comportamento:
- Onclick card → /place/:id
- Heart filled = já é favorito

---

**G. Tabbar Fixa (bottom)**

Height: 80px
Background: white
Border-top: 1px line
Padding-bottom: 16px (safe area)

4 itens, distribuídos uniformemente:
1. Home (House icon, ativo = mint-dark)
2. Explorar (Search icon)
3. Favoritos (Heart icon)
4. Perfil (User icon)

Comportamento:
- Ativo = cor mint-dark, stroke 2.2, label em peso mais forte
- Inativo = cor text-faint, stroke 2
- Onclick → navega pra rota correspondente

---

### Tela 02: Explorar (Resultados/Search)

**Path:** `/explore`

**Query Params:** `?occasion=date&environment=romantic,quiet&price=60-100&distance=5&cuisine=pizza,sushi`

**Estrutura:**

Background: cream

**A. Header Sticky (top)**

Padding: 20px, gap 12px

**Linha 1: Search + Filter**

- Search pill (flex-1):
  - Search icon 16px text-soft
  - Texto dinâmico: "Pra date romântico" (resumo dos filtros)
  - Chevron down
  - Onclick → abre /filters

- Filter button (44x44):
  - Background: ink
  - Icon: SlidersHorizontal mint 20px
  - Badge (absolute top-right): mint bg, ink text, 18x18, peso 800, número de filtros ativos
  - Onclick → /filters

**Linha 2: Active Filters Bar (scroll horizontal)**

Se houver filtros ativos:
- Chips horizontal, gap 6px
- Cada chip: background ink, text white, padding 6x12, radius pill, peso 600, 11px
- Chip com "×" à direita (removível)
- Onclick no ×: remove filtro, lista refaz query

Exemplo: "Date" | "Romântico" | "Quieto" | "R$60-100" | "Até 5km"

**Linha 3: Meta**

Font: Plus Jakarta 12px, text-soft
Texto: "<strong>12 lugares</strong> compatíveis em Maringá · ordenado por match"

Dropdown à direita (opcional): sort by (Match / Distância / Avaliação / Preço)

---

**B. Lista de Cards (scroll vertical)**

Padding: 20px, gap 14px

Cada card (branco, border line, radius 18px, overflow hidden):

**Foto (altura 130px):**
- Imagem full-bleed (Unsplash ou gradient fallback)

- Match badge (absolute top 10 left 10):
  - Branco bg, radius pill, padding 6x10
  - ✓ 94% match (font 11px peso 800, color mint-dark)
  - Sombra leve

- Heart button (absolute top 10 right 10):
  - 32x32, white 95% bg, radius 50%
  - Icon Heart ink (outline)
  - Onclick → toggle favorito
  - Se favorito: filled mint-dark

- Tags overlay (absolute bottom 10 left 10):
  - flex gap 4, flex-wrap, max-width 250px
  - Background: rgba(11,22,32,0.85) backdrop-blur 8px
  - Cada tag: white text 10px peso 600, padding 4x8, radius 6
  - Exemplo: "Playground" | "Mesa pra grupo" | "Estacionamento"

**Info (padding 14px):**

- Linha 1 (flex justify-between):
  - Nome: Bricolage 17px peso 700 ink
  - Rating: ★ 4.8 (Plus Jakarta 12px peso 700)

- Linha 2 (meta, 12px text-soft):
  - "Pizzaria · R$45/pessoa · 1,2 km"
  - Dots como unicode "·"

Comportamento:
- Onclick card → /place/:id
- Onclick heart → toggle favorito (salva em Supabase `favorites` table)

---

**C. Estados**

**Loading:**
- 3-4 skeleton cards com shimmer animation
- Cor warm-gray com gradient keyframe

**Empty (0 resultados):**
- Ícone AlertCircle outline 64px text-faint
- Headline Bricolage 22px ink: "Nada por aqui"
- Subtitle Plus Jakarta 14px text-soft max-width 280px:
  "Não achamos lugares que batam com tudo isso. Tente afrouxar algum filtro?"
- Botão "Editar filtros" (ghost mint text)

**Infinite Scroll:**
- Ao chegar perto do final, carrega mais 10 places
- Loading indicator (spinner suave)

---

### Tela 03: Filtros Avançados

**Path:** `/filters`

**Estrutura:**

Background: cream

**A. Header Sticky (top)**

Padding: 20px, display flex justify-between

- Botão Close (X icon) à esquerda
- Título "Filtros" (Bricolage 20px peso 700 ink) centralizado
- Link "Limpar tudo" (Plus Jakarta 13px text-soft underline) à direita

Comportamento:
- X → volta /explore
- "Limpar tudo" → limpa todos os filtros, vai /explore sem params

---

**B. Seções Colapsáveis (scroll vertical)**

Padding: 20px (lateral)

6 seções principais, todas expandidas por default:

#### Seção 1: OCASIÃO (Multi-Select)

Title: "Ocasião" (Bricolage 18px)
Ícone chevron (rotaciona ao collapse)

Grid pills (flex-wrap gap 6px):
- Date | Família | Amigos | Aniversário | Reunião | Almoço rápido | Happy hour | Comemoração | Pra conversar | Sozinho

Pill inativa: white border line
Pill ativa: ink bg white text

#### Seção 2: AMBIENTE (Multi-Select)

Title: "Ambiente"

Pills:
- Romântico | Tranquilo | Agitado | Familiar | Jovem | Sofisticado | Ao ar livre | Climatizado | Com música ao vivo | Sem música ao vivo | Com DJ | Pet friendly

---

#### Seção 3: ESTRUTURA (Multi-Select)

Title: "Estrutura"

Pills:
- Playground | Área kids | Estacionamento | Valet | Acessibilidade | Mesa externa | Mesa pra grupo | Mesa reservada | Mesa próxima ao playground | Banheiro familiar | Wifi

---

#### Seção 4: COMIDA (Multi-Select)

Title: "Comida"

Pills:
- Pizza | Sushi | Churrasco | Hambúrguer | Massas | Italiana | Brasileira | Árabe | Mexicana | Vegetariano | Vegano | Cafeteria | Frutos do mar | etc (15+)

---

#### Seção 5: PREÇO (Single-Select + Custom)

Title: "Faixa de preço"

Radio buttons:
- ◯ Até R$30
- ◯ R$30-60
- ◯ R$60-100
- ◯ R$100-180
- ◯ Acima de R$180
- ◯ Não importa

Toggle "Customizar":
- Se ativa: mostra inputs "De: R$ ___" e "Até: R$ ___"
- Validação: De <= Até
- Desativa radio buttons quando ativado

---

#### Seção 6: DISTÂNCIA (Single-Select + Custom)

Title: "Distância"

Radio buttons:
- ◯ Até 1 km
- ◯ 1-3 km
- ◯ 3-8 km
- ◯ 8-15 km
- ◯ Não importa

Toggle "Customizar":
- Se ativa: mostra slider (0.5-50km) ou input "Máximo: ___ km"
- Desativa radio buttons

---

#### Seção 7: HORÁRIO (Single-Select + Optional)

Title: "Horário"

Radio buttons:
- ◯ Agora
- ◯ Hoje à noite
- ◯ Amanhã
- ◯ Esta semana
- ◯ Flexível

Se escolher "Amanhã" ou "Esta semana":
- Mini calendar aparece (14 dias, clica pra selecionar)

Toggle "Horário específico":
- Se ativa: time picker (19:30)

---

**C. Footer Sticky (bottom)**

Padding: 16x20 bottom 28
Background: white
Border-top: 1px line

Botão grande "Ver X lugares" (mint primary):
- X atualiza em tempo real conforme usuário clica pills
- Exemplo: "Ver 12 lugares"
- Onclick → naviga /explore com query params de todos os filtros ativos

---

### Tela 04: Página do Lugar (Place Detail)

**Path:** `/place/:id`

**Estrutura:**

Background: cream (abaixo do cover)

**A. Cover Section (240px altura, relative)**

Imagem full-bleed
Gradient overlay (bottom): linear-gradient(transparent, rgba(11,22,32,0.6))

- Cover nav (absolute top 12 left 14 right 14):
  - Botão voltar: 38x38 white 95% circle, ChevronLeft ink
  - Botão heart: 38x38 white 95% circle, Heart ink
    - Se favorito: filled mint-dark

- Cover name (absolute bottom 14 left/right 16, color white, z-index 5):
  - Name: Bricolage 26px peso 700 -0.02em
  - Meta: Plus Jakarta 12px opacity 0.9
    - "★ 4.8 · 312 avaliações · Aberto agora"

---

**B. Quick Info Row (margin-top 16px, padding 0 20px)**

Grid 3 colunas, gap 10px

Cada item (white border line radius 14 padding 10x8 text-center):
- Value: Bricolage 14px peso 700 ink ("R$45")
- Label: Plus Jakarta 10px text-soft ("por pessoa")

Items:
1. Preço por pessoa
2. Tempo médio preparo (15min)
3. Distância de você (1,2km)

---

**C. Match Card (margin-top 16px, padding 20px)**

Background: linear-gradient(135deg, mint #2DD4BF, mint-dark #0F766E)
Border-radius: 16px
Color: white
Display: flex items-center gap 12px

- Left (flex-shrink 0):
  - Número: Bricolage 36px peso 800 white line-height 1 ("94%")

- Right (flex-1):
  - Headline: Plus Jakarta 14px peso 700 white margin-bottom 2px
    - "Bate com o que você quer"
  - Text: Plus Jakarta 12px opacity 0.95 line-height 1.3
    - "Playground, mesa pra grupo, estacionamento e ticket dentro da sua faixa."

Clickable: expande pra mostrar todos os critérios que contribuem pro score

---

**D. Seção: Estrutura (margin-top 20px)**

Title: Bricolage 18px peso 700 "Estrutura"

Grid 2 colunas gap 8px

Feature tags (white border line radius 12 padding 10x12):
- Check icon: 16x16 mint circle, Check branco
- Text: Plus Jakarta 12px peso 600 ink
- Exemplo: "Playground", "Mesa pra 10+", "Estacionamento"

(Mostra apenas features que o lugar tem = true)

---

**E. Seção: Ambiente (margin-top 20px)**

Title: "Ambiente"

Pills horizontais (flex-wrap gap 6px):
- white border line radius pill padding 8x12 font 12 weight 600
- Exemplo: "Familiar", "Climatizado", "Música ambiente"

---

**F. Seção: Comida (margin-top 20px)**

Pills: "Pizza", "Massas", "Petiscos"

---

**G. Seção: Avaliações por Uso (margin-top 20px)**

Title: "O que dizem por uso" (Bricolage 18px)

List vertical gap 12px

Cada linha (flex justify-between items-center):
- Left: Plus Jakarta 12px peso 600 ink + "★ " (unicode) + rating grande
  - Exemplo: "Bom pra família — ★ 4.9"
- Right: count (12px text-soft)
  - "(38 avaliações)"
- Barra de progresso embaixo: height 2px, fundo warm-gray, fill mint se >=4.5, warm-gray se <4.5

---

**H. Seção: Cardápio Preview (margin-top 20px)**

Title: "Cardápio"
Link à direita: "Ver tudo" (Plus Jakarta 12px peso 600 mint)

Carrossel horizontal (scroll), 4 items, width 150px each:

Mini-card:
- Foto 60x60 radius 10
- Nome abaixo (Plus Jakarta 13px peso 700 ink)
- Preço (Plus Jakarta 12px weight 700 mint)

Comportamento:
- Onclick "Ver tudo" → /place/:id/menu

---

**I. Seção: Localização (margin-top 20px)**

Title: "Onde fica"

- Mapa placeholder (width 100% height 120px radius 14, gradient mint suave)
  - (Integração real Supabase Geolocation fica pra v2)

- Endereço completo (Plus Jakarta 14px peso 600 ink)
  - "Rua das Flores, 123 - Centro, Maringá - PR, 87014-001"

- Botão "Como chegar" (ghost mint):
  - Ícone MapPin
  - Font: 12px peso 700
  - Onclick: window.open(`https://maps.google.com/?q=${lat},${long}`)

---

**J. Footer CTA Sticky (bottom)**

Position: fixed
Padding: 14x20 bottom 28
Background: linear-gradient(transparent, white 30%)

Botão grande "Reservar mesa" (mint primary, full-width):
- Display: flex justify-between
- Left: "Reservar mesa"
- Right: "R$45/pessoa" (color mint)
- Padding: 18px
- Font: Plus Jakarta 15px peso 700
- Onclick → /place/:id/reserve

---

### Tela 05: Cardápio

**Path:** `/place/:id/menu`

**Estrutura:**

Background: cream

**A. Header (sticky top)**

Padding: 20px, display flex items-center gap 12px

- Botão voltar (40x40 white border line)
- Título: Bricolage 18px peso 700 ink (center, flex-1)
  - Nome do lugar
- Ícone search: Search Lucide 20px (clicável pra filtrar cardápio, nice-to-have)

---

**B. Tabs Sticky (scroll horizontal)**

Border-bottom: 1px line
Gap: 12px
Padding: 0 20px

Cada tab: Plus Jakarta 13px peso 600 color text-soft
Ativo: color ink, border-bottom 2px mint

Categorias dinâmicas do cardápio:
- Entradas | Pratos | Bebidas | Sobremesas

Onclick tab → scroll smooth pra seção correspondente

---

**C. Items por Categoria (scroll vertical)**

Padding: 20px

Cada categoria tem um header (pequeno, uppercase, color text-faint) seguido de items.

Cada item:
- Layout: horizontal
- Left (flex-1):
  - Name: Plus Jakarta 15px peso 700 color ink
  - Description: Plus Jakarta 12px weight 400 color text-soft, max-lines 2, truncated
  - Price: Plus Jakarta 14px peso 700 color mint, margin-top 4px
    - "R$ 35,00"
- Right (flex-shrink 0):
  - Foto: 80x80 radius 12 (se houver)

Comportamento:
- Onclick item → mostra modal/sheet com detalhes completos (foto grande, descrição full, alérgenos, etc)

---

**D. Empty State**

Se sem cardápio:
- "Esse lugar ainda não cadastrou cardápio. Você pode pedir lá!"

---

### Tela 06: Reserva

**Path:** `/place/:id/reserve`

**Estrutura:**

Background: cream
Padding-bottom: 120px (space pra footer sticky)

**A. Header (não sticky, parte do scroll)**

Padding: 20px, margin-top 12px

- Botão voltar (40x40 white border line)
- Título: Bricolage 26px peso 700 ink: "Sua reserva"
- Sub: Plus Jakarta 13px text-soft: "A gente avisa o restaurante. Você só chega."

---

**B. Place Card Resumo (margin-top 18px)**

Card white border line radius 14 padding 12
Display: flex gap 12 items-center

- Foto: 48x48 radius 12 (cover)
- Content (flex-1):
  - Name: Plus Jakarta 14px peso 700 color ink
  - Meta: Plus Jakarta 11px text-soft: "Centro · 1,2km · ★ 4.8"

---

**C. Campos Formulário**

Padding: 0 20px, todos margin-top 20px

**Campo 1: QUANDO (Data)**

Label: "QUANDO" (uppercase 12px peso 600 letter-spacing 0.08em color ink)

Input: white border 1.5px line radius 14 padding 14px
- Font: Plus Jakarta 14px peso 600 color ink
- Conteúdo: "Hoje, qui · 21 mai"
- Focus: border mint
- Onclick: abre date picker (native ou custom calendar)
- Range: próximos 14 dias
- Default: today

---

**Campo 2: HORÁRIO (Time)**

Label: "HORÁRIO"

Grid 4 colunas gap 6px (mobile), mais em desktop

Time pills (cada uma):
- white border 1.5px line radius 12 padding 10px text-center
- Plus Jakarta 13px peso 700 color ink
- Exemplo: "19:00", "19:30", "20:00", "20:30"
- Slots: meia em meia hora (próximas 6h a partir agora)
- Selecionado: bg ink text white border ink

Default: próximo slot disponível
Comportamento: onclick → seleciona (visual feedback imediato)

---

**Campo 3: PESSOAS - ADULTOS**

Label: "PESSOAS"

Counter row (white border 1.5px line radius 14 padding 14px):
- Display: flex justify-between
- Left:
  - Main: Plus Jakarta 14px peso 700 color ink "Adultos"
  - Sub: Plus Jakarta 11px text-soft "13 anos ou mais"
- Right: counter horizontal
  - Button −: 30x30 warm-gray circle font 16px peso 700 ink, onclick decrement
  - Value: font 16px peso 800 center, min-width 18px
  - Button +: idem −

Default: 2
Min: 1, Max: 20

---

**Campo 4: CRIANÇAS**

Mesma estrutura:
- Label: "CRIANÇAS"
- Sub: "até 12 anos"
- Default: 0
- Min: 0, Max: 10

---

**Campo 5: PREFERÊNCIA DE MESA (opcional)**

Label: "PREFERÊNCIA DE MESA (opcional)" (opcional = 11px text-soft)

Chips multi-select horizontal scrollable:
- "Mesa de canto" | "Perto do playground" | "Longe do som ao vivo" | "Mesa externa" | "Acessível"

Chip inativo: white border line
Chip selecionado: ink bg white text
Radius: pill

Comportamento: onclick toggle

---

**Campo 6: OBSERVAÇÕES (opcional)**

Label: "OBSERVAÇÕES (opcional)"

Textarea:
- white border 1.5px line radius 14 padding 14px
- Plus Jakarta 13px weight 400 color ink
- Min-height: 80px
- Placeholder color: text-faint
- Placeholder: "Aniversário, primeira vez no lugar, alguma alergia... fica à vontade."

---

**D. Footer CTA Sticky (bottom)**

Position: fixed bottom 0 left 0 right 0
Padding: 16x20 bottom 28
Background: white
Border-top: 1px line

Summary line (margin-bottom 12px):
- Font: Plus Jakarta 13px weight 400 color text-soft
- Conteúdo: "Mesa pra <strong>X pessoas</strong> hoje às <strong>HH:MM</strong>"
- Strong: color ink peso 700 font 14px

Botão grande "Confirmar reserva" (mint primary full-width):
- Padding: 18px
- Font: Plus Jakarta 15px peso 700
- Radius: 16px

Comportamento:
- Onclick:
  1. Valida: data e horário obrigatórios
  2. Salva reservation em Supabase com status "pending"
  3. Envia notificação (push/email/SMS) pra restaurante via WhatsApp message simulado
  4. Mostra loading spinner sobre botão
  5. Naviga /reservations/success após 1.5s

---

### Tela 07: Confirmação de Sucesso

**Path:** `/reservations/success`

**Estrutura:**

Background: cream
Tela cheia, centered

**A. Check Animation**

Size: 80x80
Background: mint
Border-radius: 50%
Display: flex items-center justify-center
Ícone: Check Lucide 48px white

Animation:
- Entrada: scale(0) → scale(1) + fade (600ms ease-out)
- Efeito pulse suave

---

**B. Título**

Margin-top: 24px
Font: Bricolage 32px peso 700 color ink
Texto: "Quase lá!"

---

**C. Texto Descritivo**

Margin-top: 12px
Font: Plus Jakarta 15px weight 400 color text-soft
Max-width: 300px
Text-align: center

Texto dinâmico (baseado no lugar):
"A gente já avisou a [Nome do lugar]. Em até 15 minutos eles confirmam sua mesa via WhatsApp."

---

**D. Resumo Card**

Margin-top: 32px
Padding: 0 20px

Card branco border line radius 18 padding 18

- Foto do lugar: full-width 100px height radius 12

- Name: Bricolage 18px peso 700 color ink, margin-top 12px

- Details list (margin-top 12px, gap 8px):
  - Cada linha: font Plus Jakarta 13px peso 500 color ink, icon 14px mint
  
  Items:
  1. Calendar icon + "Hoje, 21 de maio"
  2. Clock icon + "19:30"
  3. Users icon + "4 adultos + 2 crianças"
  4. MapPin icon + "Centro, Maringá"

---

**E. Buttons**

Margin-top: 24px
Padding: 0 20px

- Primário: "Voltar pra Home" (ink primary full-width)
  - Onclick → /home

- Ghost: "Ver minhas reservas" (texto mint)
  - Onclick → /reservations

---

### Tela 08: Minhas Reservas

**Path:** `/reservations`

**Estrutura:**

Background: cream

**A. Header (padding 20px)**

Título: Bricolage 28px peso 700 color ink
"Minhas reservas"

**B. Tabs (margin-top 12px)**

Pills horizontais: "Próximas" | "Histórico"
- Inativo: white border line
- Ativo: mint bg ink text

Onclick → filtra lista

---

**C. Lista de Reservas (padding 20px)**

Cada card (white border line radius 18 padding 0 overflow hidden):

Display: horizontal (flex)

- Left (100x100 flex-shrink 0):
  - Foto do lugar (cover, height 100%)

- Right (flex-1 padding 14px):
  - Status badge (top, font 10 uppercase peso 800 letter 0.1em):
    - "Pendente" (BG #FFF4D6 color #B07500)
    - "Confirmada" (BG mint-soft color mint-dark)
    - "Cancelada" (BG warm-gray color text-soft)
    - "Realizada" (BG ink color mint)
    - "Não compareceu" (BG accent-pink color white)

  - Name: Bricolage 16px peso 700 color ink

  - Meta: Plus Jakarta 12px color text-soft, margin-top 2px
    - "Hoje · 19:30 · 4 pessoas"

  - Botão "Detalhes" (text-link mint font 12px peso 700)
    - Onclick → abre modal/sheet com dados completos
    - Modal contém: todas as infos da reserva + botão "Cancelar" (destructive red)

---

**D. Empty State**

Se nenhuma reserva:
- Ícone Calendar outline 64px text-faint
- Headline: "Nenhuma reserva ainda"
- Subtitle: "Que tal achar um lugar agora?"
- Botão: "Encontrar lugares" (mint ghost)
  - Onclick → /explore

---

### Tela 09: Favoritos

**Path:** `/favorites` (acessível via tabbar ou cards)

**Estrutura:**

Background: cream

**A. Header**

Título: Bricolage 28px "Favoritos"
Subtítulo: Plus Jakarta 13px text-soft "Lugares que você salvou"

---

**B. Grid de Cards**

2 colunas (mobile), mais em desktop, gap 10px

Cada card (branco border line radius 14):
- Foto quadrada 150x150 radius 14 (cover)
- Heart filled mint-dark absolute top-right
- Abaixo:
  - Nome 14px peso 700 color ink
  - Meta 11px text-soft: "★ 4.8 · 2,5 km"

Comportamento:
- Onclick card → /place/:id
- Heart: remover do favoritos (onclick)

---

**C. Empty State**

- Heart outline 64px text-faint
- "Nenhum favorito ainda"
- "Toque no ❤️ nos lugares que você curtir"
- Botão "Explorar lugares" (mint)

---

### Tela 10: Perfil

**Path:** `/profile`

**Estrutura:**

Background: cream
Padding: 20px

**A. Header Pessoal**

- Avatar grande: 80x80 gradient mint, iniciais brancas, font-display peso 700
- Nome: Bricolage 24px peso 700 color ink
- Cidade: Plus Jakarta 14px text-soft
- Botão "Editar" (pequeno, ghost): abre modal pra editar nome/email

---

**B. Cards de Acesso (grid 2x2, gap 10px)**

Cada card (white border line radius 16 padding 14 flex flex-col gap 8):
- Ícone Lucide 24px em quadrado 36x36 radius 10 (BG mint-soft, ícone mint-dark)
- Nome 14px peso 700 color ink
- Sub 11px text-soft

Cards:
1. Minhas reservas → /reservations (badge com count "3")
2. Favoritos → /favorites (badge com count "12")
3. Histórico → /profile/history (badge com count "8")
4. Refazer quiz → abre modal confirmar "Refazer quiz?" → /onboarding/step-2

---

**C. Seção: O que Sei Sobre Você**

Título: Bricolage 18px "O que sei sobre você"

List vertical (gap 6px):

Cada item (informativo, não editável):
- Ícone relevante 14px mint
- Texto: Plus Jakarta 13px weight 500 color ink
- Exemplo:
  - "🌙 Você prefere ambientes tranquilos"
  - "🍺 Cerveja: Heineken parece ser sua favorita"
  - "💰 Ticket médio que você escolhe: R$ 60"
  - "👨‍👩‍👧 Sai com a família com frequência"

Botão pequeno: "Resetar preferências" (text-link text-soft 11px)
- Onclick → modal confirmar "Deletar histórico e preferências?"

---

**D. Seção: Configurações**

Título: "Configurações"

List vertical (cada item = linha clickable justify-between):
- Ícone left + label left, chevron-right right
- Font: Plus Jakarta 14px peso 600 color ink

Items:
1. Notificações (Bell icon)
   - Onclick → toggle notification preferences
2. Localização (MapPin icon)
   - Onclick → mudar localização padrão
3. Privacidade (Shield icon)
   - Onclick → abre policy (external link)
4. Termos (FileText icon)
   - Onclick → abre terms (external link)
5. Ajuda (HelpCircle icon)
   - Onclick → mailto:support@pakas.com ou chat
6. Sair (LogOut icon)
   - Onclick → modal confirmar "Sair?" → deleta localStorage, vai /

---

## 3. SISTEMA DE LOCALIZAÇÃO

### Tipos de Localização

**1. Localização Atual (GPS)**
- Detecta automaticamente na primeira entrada (onboarding step 2)
- User permite ou nega
- Se permite: usa lat/long pra calcular distâncias
- Se nega: abre seletor manual

**2. Localização Buscada (Manual)**
- User seleciona cidade/bairro diferente da atual
- Input busca com autocomplete: "Buscar cidade, bairro ou CEP"
- Suggestions: cidades populares em PR/RS/SC
- Salva como `user_location.search_location`

**3. Raio de Busca**
- Padrão: cidade inteira (até 15km do centro)
- User pode customizar em Filtros
- Cálculo: distância reta Haversine formula (lat1, long1, lat2, long2)

### Schema

**Tabela: user_locations**
```
id (uuid, PK)
user_id (uuid, FK)
type (enum: 'current', 'searched')
city (string)
neighborhood (string, optional)
latitude (float)
longitude (float)
radius_km (float, default 15)
is_active (boolean, default true)
created_at (timestamp)
updated_at (timestamp)
```

### Comportamento

- Home mostra: "📍 Centro, Maringá" (localização ativa)
- Clica pill → modal seletor localização
  - Mostra: atual + 3 últimas buscadas + input nova busca
  - Seleciona → salva em user_locations, atualiza query de restaurantes

---

## 4. SISTEMA DE FILTROS

### Dimensões de Filtro (Completo)

#### Dimensão 1: OCASIÃO

Valores possíveis:
- date_romantic
- family_with_kids
- friends_group
- work_meeting
- alone
- celebration
- casual_lunch
- date_night_dinner
- business_event
- group_gathering

Tipo: multi-select (geralmente 1-2 marcadas)

#### Dimensão 2: AMBIENTE

Valores:
- romantic
- quiet
- loud_energetic
- family_friendly
- young_crowd
- sophisticated
- casual_boteco
- outdoor
- cozy
- party
- live_music_yes
- live_music_no
- dj
- dance_floor

Tipo: multi-select (até 3 recomendado)

#### Dimensão 3: INFRAESTRUTURA

Valores:
- playground
- kids_area
- high_chair
- changing_room
- parking
- valet_parking
- wheelchair_accessible
- wifi
- charger_outlets
- outdoor_seating
- reserved_table
- private_space
- no_kids_noise
- no_smoke
- smoking_area
- garden
- terrace
- corner_table
- window_view
- bar_seating

Tipo: multi-select (sem limite)

#### Dimensão 4: CULINÁRIA

Valores:
- pizza
- sushi_japanese
- steakhouse_bbq
- pasta_italian
- burger
- brazilian_food
- arab_levantine
- mexican
- thai
- indian
- vegetarian
- vegan
- seafood
- boteco_snacks
- caffeteria
- desserts
- brunch
- tapas
- fine_dining
- fusion
- korean
- portuguese
- spanish
- french

Tipo: multi-select (sem limite, min 1 recomendado)

#### Dimensão 5: RESTRIÇÕES ALIMENTARES

Valores:
- gluten_free
- lactose_free
- nut_free
- shellfish_free
- vegetarian
- vegan
- low_sugar
- kosher
- halal

Tipo: multi-select (sem limite)

#### Dimensão 6: FAIXA DE PREÇO

Valores (pré-definidos):
- budget: "Até R$ 30"
- affordable: "R$ 30-60"
- moderate: "R$ 60-100"
- premium: "R$ 100-180"
- luxury: ">R$ 180"

Ou custom:
- custom_min: float (R$ 0+)
- custom_max: float (R$ 0+)

Tipo: single-select + custom override

#### Dimensão 7: DISTÂNCIA

Valores (pré-definidos):
- very_close: "Até 1 km"
- close: "1-3 km"
- normal: "3-8 km"
- far: "8-15 km"
- any: "Sem limite"

Ou custom:
- custom_distance: float (km)

Tipo: single-select + custom override

#### Dimensão 8: HORÁRIO

Valores:
- now: "Agora (próximas 2h)"
- tonight: "Hoje à noite (18h-23h)"
- tomorrow: "Amanhã"
- this_week: "Esta semana"
- flexible: "Flexível"

Tipo: single-select

#### Dimensão 9: DISPONIBILIDADE DE RESERVA

Valores:
- accepts_reservation
- no_reservation_needed
- accepts_walk_in
- high_availability
- limited_tables

Tipo: multi-select

#### Dimensão 10: AVALIAÇÃO MÍNIMA

Valores:
- any: "Sem filtro"
- above_4: "Acima de 4.0 ⭐"
- above_4_5: "Acima de 4.5 ⭐"
- above_4_8: "Acima de 4.8 ⭐"

Tipo: single-select

### Schema

**Tabela: filter_configurations**
```
id (uuid, PK)
user_id (uuid, FK)
occasion (text[], default [])
environment (text[], default [])
infrastructure (text[], default [])
cuisines (text[], default [])
dietary_restrictions (text[], default [])
price_mode (enum: 'preset', 'custom')
price_preset (enum: 'budget', 'affordable', 'moderate', 'premium', 'luxury', 'any')
price_custom_min (float, nullable)
price_custom_max (float, nullable)
distance_mode (enum: 'preset', 'custom')
distance_preset (enum: 'very_close', 'close', 'normal', 'far', 'any')
distance_custom_km (float, nullable)
time_preference (enum: 'now', 'tonight', 'tomorrow', 'this_week', 'flexible')
min_rating (float, default 0)
created_at (timestamp)
updated_at (timestamp)
```

---

## 5. SISTEMA DE AVALIAÇÕES

### Dimensões de Avaliação

Cada lugar tem múltiplas avaliações, não apenas 1 nota genérica.

#### Rating Geral

Campo: `establishments.rating` (1-5.0)
Cálculo: média aritmética de todas as avaliações

#### Ratings por Contexto (Novidade!)

Tabela: `context_ratings`

Campos:
- establishment_id (FK)
- context (enum: 'for_date', 'for_family', 'for_friends', 'for_business', 'for_solo')
- rating (1-5.0)
- review_count (int)

Exemplo:
- Pizzaria Vila Verde:
  - Geral: 4.8 ⭐ (312 avaliações)
  - Date: 4.2 ⭐ (45 avaliações) — "Não é tão romântico"
  - Família: 4.9 ⭐ (128 avaliações) — "Crianças adoram o playground"
  - Amigos: 4.7 ⭐ (95 avaliações) — "Agitado, bom boteco"
  - Business: 3.5 ⭐ (8 avaliações) — "Barulhento pra reunião"
  - Solo: 4.1 ⭐ (36 avaliações)

Na tela de Lugar, mostra todas essas notas (seção "O que dizem por uso").

#### Ratings por Aspecto

Tabela: `aspect_ratings`

Campos:
- review_id (FK)
- aspect (enum: 'food', 'atmosphere', 'service', 'cleanliness', 'value', 'noise_level', 'pace')
- rating (1-5.0)

Usuário ao avaliar pode dar nota pra cada aspecto:
- Comida: ⭐⭐⭐⭐⭐ (5)
- Atmosfera: ⭐⭐⭐⭐ (4)
- Atendimento: ⭐⭐⭐⭐⭐ (5)
- Limpeza: ⭐⭐⭐⭐⭐ (5)
- Relação preço: ⭐⭐⭐ (3)
- Nível de ruído: ⭐⭐ (2) — "Barulhento demais"
- Ritmo: ⭐⭐⭐⭐ (4) — "Rápido/Lento"

### Schema

**Tabela: reviews**
```
id (uuid, PK)
user_id (uuid, FK)
establishment_id (uuid, FK)
reservation_id (uuid, FK, nullable) -- se foi via reserva
context (enum: 'for_date', 'for_family', 'for_friends', 'for_business', 'for_solo')
rating_overall (1-5.0)
rating_food (1-5.0, nullable)
rating_atmosphere (1-5.0, nullable)
rating_service (1-5.0, nullable)
rating_cleanliness (1-5.0, nullable)
rating_value (1-5.0, nullable)
rating_noise_level (1-5.0, nullable) -- 1=silencioso, 5=barulhento
comment (text, max 500)
would_return (boolean, nullable)
would_recommend (boolean, nullable)
likes (text[], nullable) -- ["food", "cozy", "kids_friendly"]
dislikes (text[], nullable) -- ["noisy", "slow_service", "expensive"]
created_at (timestamp)
verified_visit (boolean) -- true se via reserva confirmada
```

**Tabela: context_ratings** (aggregated)
```
id (uuid, PK)
establishment_id (uuid, FK)
context (enum)
rating_average (1-5.0)
review_count (int)
updated_at (timestamp)
```

---

## 6. SISTEMA DE RECOMENDAÇÕES

### Algoritmo de Recomendação

**Fase 1: Match Score**

Para cada lugar, calcula:
```
score = 
  (atende_ocasiao ? 35 : 0) +
  (atende_ambiente ? 25 : 0) +
  (atende_infraestrutura_count / total_infra_reqs * 20) +
  (distancia_score: max(0, 10 - dist*2)) +
  (rating_relevance: rating_para_seu_contexto * 10) +
  (price_compatibility ? 10 : 0) +
  (tempo_disponivel ? 5 : 0)
```

Total: 0-100

Exibição:
- Score >= 90: "Match perfeito 💯"
- 75-89: "Match alto ✓"
- 60-74: "Compatível"
- < 60: sem badge, aparece no final da lista

---

### Fase 2: Ranking Pessoal

Aplica boost em lugares que:
- User já visitou (já tem história)
- User favoritou (boost +10 pontos)
- Amigos estão reservando (se Social graph ativado)
- Está em Trending (boost +5 pontos)

---

### Fase 3: Seções de Discovery

**A. Mais Visitados (por você)**

Query: `SELECT * FROM establishments WHERE id IN (user_history.establishment_id) ORDER BY frequency DESC, last_visited DESC LIMIT 5`

Mostra: últimos 5-8 lugares que visitou.

Se vazio: mostra hint "Comece a explorar pra ver seus favoritos aqui"

---

**B. Trending em [Cidade]**

Query: `SELECT * FROM establishments WHERE city = 'Maringá' ORDER BY reservations_this_week DESC LIMIT 5`

Tabela: `trending_establishments`
```
id (uuid, PK)
establishment_id (uuid, FK)
city (string)
period (enum: 'day', 'week', 'month')
rank (int) -- 1-100
trend_score (0-100) -- baseado em reservas, views, reviews
updated_at (timestamp)
```

Boost: lugares com trend_score > 70 aparecem na seção Trending.

---

**C. Favoritos**

Query: `SELECT * FROM favorites WHERE user_id = ? LIMIT 20`

Mostra: favoritos do usuário, ordenados por data.

---

**D. Recomendado pra Você**

(Nice-to-have, Phase 2+)

Algoritmo collaborative filtering:
- Users com preferências similares → seus lugares favoritos → recomenda pra você

Query:
1. Encontra 10 users com preferences similares (Jaccard similarity > 0.7)
2. Pega establishments que eles favoritaram
3. Que você ainda não visitou
4. Ordena por match score + trending
5. Mostra top 5

---

## 7. SCHEMA DE DADOS COMPLETO

### Tabelas Essenciais

```sql
-- USERS E AUTENTICAÇÃO
TABLE users {
  id UUID PK
  name TEXT NOT NULL
  phone TEXT UNIQUE NOT NULL
  email TEXT UNIQUE NULLABLE
  city TEXT DEFAULT 'Maringá'
  auth_token TEXT NULLABLE -- pra login
  last_login TIMESTAMP NULLABLE
  created_at TIMESTAMP
  updated_at TIMESTAMP
}

-- PREFERÊNCIAS DO USUÁRIO
TABLE user_preferences {
  id UUID PK
  user_id UUID FK → users
  primary_occasion TEXT ENUM
  ambiance_preferences TEXT[] -- até 3
  must_have_features TEXT[]
  favorite_cuisines TEXT[]
  dietary_restrictions TEXT[]
  price_range TEXT ENUM ('budget', 'affordable', 'moderate', 'premium', 'luxury', 'any', 'custom')
  price_custom_min FLOAT NULLABLE
  price_custom_max FLOAT NULLABLE
  max_distance_km FLOAT
  preferred_time TEXT ENUM
  preferred_date DATE NULLABLE
  min_rating FLOAT DEFAULT 0
  created_at TIMESTAMP
  updated_at TIMESTAMP
  CONSTRAINT one_per_user UNIQUE(user_id)
}

-- LOCALIZAÇÃO DO USUÁRIO
TABLE user_locations {
  id UUID PK
  user_id UUID FK
  type TEXT ENUM ('current', 'searched')
  city TEXT
  neighborhood TEXT NULLABLE
  latitude FLOAT
  longitude FLOAT
  radius_km FLOAT DEFAULT 15
  is_active BOOLEAN DEFAULT true
  created_at TIMESTAMP
  updated_at TIMESTAMP
}

-- ESTABELECIMENTOS
TABLE establishments {
  id UUID PK
  name TEXT NOT NULL
  slug TEXT UNIQUE
  category TEXT -- 'pizzaria', 'sushi', 'bar', etc
  description TEXT NULLABLE
  phone TEXT
  whatsapp TEXT NULLABLE
  address TEXT
  neighborhood TEXT
  city TEXT
  state TEXT
  latitude FLOAT
  longitude FLOAT
  average_ticket FLOAT
  rating FLOAT -- agregado de todas as reviews
  rating_count INT DEFAULT 0
  image_url TEXT
  gallery_images TEXT[] NULLABLE
  status TEXT ENUM ('active', 'paused', 'closed')
  accepts_reservation BOOLEAN DEFAULT true
  created_at TIMESTAMP
  updated_at TIMESTAMP
  verified BOOLEAN DEFAULT false
}

-- FEATURES DO ESTABELECIMENTO
TABLE establishment_features {
  id UUID PK
  establishment_id UUID FK → establishments UNIQUE
  -- Infraestrutura
  has_playground BOOLEAN DEFAULT false
  has_kids_area BOOLEAN DEFAULT false
  has_changing_room BOOLEAN DEFAULT false
  has_high_chair BOOLEAN DEFAULT false
  has_parking BOOLEAN DEFAULT false
  has_valet BOOLEAN DEFAULT false
  wheelchair_accessible BOOLEAN DEFAULT false
  has_wifi BOOLEAN DEFAULT false
  has_chargers BOOLEAN DEFAULT false
  outdoor_seating BOOLEAN DEFAULT false
  reserved_table_available BOOLEAN DEFAULT false
  private_space BOOLEAN DEFAULT false
  corner_table BOOLEAN DEFAULT false
  window_view BOOLEAN DEFAULT false
  bar_seating BOOLEAN DEFAULT false
  -- Ambiente
  romantic_vibe BOOLEAN DEFAULT false
  quiet_vibe BOOLEAN DEFAULT false
  loud_energetic BOOLEAN DEFAULT false
  family_friendly BOOLEAN DEFAULT false
  young_crowd BOOLEAN DEFAULT false
  sophisticated_vibe BOOLEAN DEFAULT false
  casual_boteco BOOLEAN DEFAULT false
  has_outdoor_area BOOLEAN DEFAULT false
  cozy_atmosphere BOOLEAN DEFAULT false
  has_live_music BOOLEAN DEFAULT false
  no_live_music BOOLEAN DEFAULT false
  has_dj BOOLEAN DEFAULT false
  has_dance_floor BOOLEAN DEFAULT false
  pet_friendly BOOLEAN DEFAULT false
  smoking_allowed BOOLEAN DEFAULT false
  created_at TIMESTAMP
  updated_at TIMESTAMP
}

-- MENUS
TABLE menus {
  id UUID PK
  establishment_id UUID FK
  name TEXT
  category TEXT
  is_active BOOLEAN DEFAULT true
  created_at TIMESTAMP
}

-- ITENS DE MENU
TABLE menu_items {
  id UUID PK
  menu_id UUID FK
  name TEXT NOT NULL
  description TEXT NULLABLE
  price FLOAT NOT NULL
  category TEXT
  image_url TEXT NULLABLE
  is_available BOOLEAN DEFAULT true
  has_vegetarian BOOLEAN DEFAULT false
  has_vegan BOOLEAN DEFAULT false
  has_gluten_free BOOLEAN DEFAULT false
  allergens TEXT[] NULLABLE -- ['nuts', 'shellfish']
  created_at TIMESTAMP
  updated_at TIMESTAMP
}

-- RESERVAS
TABLE reservations {
  id UUID PK
  user_id UUID FK
  establishment_id UUID FK
  reservation_date DATE NOT NULL
  reservation_time TIME NOT NULL
  adults_count INT NOT NULL
  children_count INT DEFAULT 0
  seat_preferences TEXT[] NULLABLE
  notes TEXT NULLABLE
  status TEXT ENUM ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')
  status_updated_at TIMESTAMP NULLABLE
  restaurant_notified_at TIMESTAMP NULLABLE
  confirmed_at TIMESTAMP NULLABLE
  completed_at TIMESTAMP NULLABLE
  created_at TIMESTAMP
  updated_at TIMESTAMP
}

-- FAVORITOS
TABLE favorites {
  id UUID PK
  user_id UUID FK
  establishment_id UUID FK
  created_at TIMESTAMP
  CONSTRAINT unique_favorite UNIQUE(user_id, establishment_id)
}

-- REVIEWS E AVALIAÇÕES
TABLE reviews {
  id UUID PK
  user_id UUID FK
  establishment_id UUID FK
  reservation_id UUID FK NULLABLE
  context TEXT ENUM ('for_date', 'for_family', 'for_friends', 'for_business', 'for_solo')
  rating_overall FLOAT (1-5) NOT NULL
  rating_food FLOAT NULLABLE
  rating_atmosphere FLOAT NULLABLE
  rating_service FLOAT NULLABLE
  rating_cleanliness FLOAT NULLABLE
  rating_value FLOAT NULLABLE
  rating_noise_level FLOAT NULLABLE
  comment TEXT NULLABLE (max 500)
  would_return BOOLEAN NULLABLE
  would_recommend BOOLEAN NULLABLE
  likes TEXT[] NULLABLE
  dislikes TEXT[] NULLABLE
  verified_visit BOOLEAN DEFAULT false
  helpful_count INT DEFAULT 0
  created_at TIMESTAMP
  updated_at TIMESTAMP
}

-- RATINGS AGREGADOS POR CONTEXTO
TABLE context_ratings {
  id UUID PK
  establishment_id UUID FK UNIQUE
  context TEXT ENUM
  rating_average FLOAT (1-5)
  review_count INT
  updated_at TIMESTAMP
}

-- HISTÓRICO DO USUÁRIO
TABLE user_history {
  id UUID PK
  user_id UUID FK
  establishment_id UUID FK
  action TEXT ENUM ('viewed', 'clicked', 'reserved', 'completed', 'reviewed')
  context JSONB NULLABLE -- {filters_used: [...], timestamp: ...}
  created_at TIMESTAMP
  CONSTRAINT one_action_per_establishment_per_day UNIQUE(user_id, establishment_id, DATE(created_at), action)
}

-- TRENDING (ATUALIZADO DAILY)
TABLE trending_establishments {
  id UUID PK
  establishment_id UUID FK
  city TEXT
  period TEXT ENUM ('day', 'week', 'month')
  rank INT (1-100)
  trend_score FLOAT (0-100)
  reservations_count INT
  updated_at TIMESTAMP
}
```

---

## 8. DEPENDÊNCIAS E FLUXOS

### Dependências de Dados

```
users
  ├── user_preferences (1:1)
  ├── user_locations (1:many)
  ├── reservations (1:many)
  ├── favorites (1:many)
  ├── reviews (1:many)
  └── user_history (1:many)

establishments
  ├── establishment_features (1:1)
  ├── menus (1:many)
  ├── reservations (1:many)
  ├── reviews (1:many)
  ├── favorites (many:many)
  ├── context_ratings (aggregated)
  └── trending_establishments (aggregated)

menus
  └── menu_items (1:many)

reservations
  ├── reviews (optional 1:many)
  └── user_history (tracked)
```

### Fluxo: Splash → Onboarding → Explorar

```
Splash
  └─ Cadastro (step-1)
       └─ Localização (step-2)
            └─ Ocasião (step-3)
                 └─ Ambiente (step-4)
                      └─ Infraestrutura (step-5)
                           └─ Comida (step-6)
                                └─ Preço (step-7)
                                     └─ Distância (step-8)
                                          └─ Horário (step-9)
                                               └─ Confirmação (step-10)
                                                    └─ Home
                                                         └─ Explorar (com filtros iniciais)
                                                              └─ Lugar
                                                                   └─ Reserva
                                                                        └─ Sucesso
```

### Fluxo: Lugar → Reserva

```
Explorar (mostra lista de lugares)
  └─ Clica card
       └─ Lugar (detalhe completo)
            ├─ Pode favoritar
            ├─ Pode ver cardápio
            └─ Pode fazer reserva
                 └─ Reserva (formulário)
                      └─ Confirmação
                           └─ Sucesso (com ID da reserva)
                                └─ Restaurante recebe notificação WhatsApp
                                     └─ Status muda pra "confirmed" após restaurante responder
```

---

## 9. ROADMAP COMPLETO

### MVP v1 (Atual)

#### Core Features

**Onboarding**
- Splash + cadastro básico
- 8 perguntas de preferência
- Detecção de localização
- Salva preferences em Supabase

**Discovery**
- Home com hero card + seções por ocasião
- Quiz rápido (3 perguntas)
- Explorar com filtros
- Painel de filtros completo (10 dimensões)
- Trending em [cidade]
- Mais visitados (por você)
- Favoritos

**Lugar & Reserva**
- Página completa de lugar (cover, match, features, avaliações por contexto, cardápio, localização)
- Cardápio completo
- Formulário de reserva (data, hora, pessoas, obs)
- Confirmação com notificação WhatsApp simulada

**Perfil**
- Avatar + nome + cidade
- Cards de acesso (reservas, favoritos, histórico)
- Preferências aprendidas (read-only)
- Configurações básicas

**Técnico**
- React + React Router
- Supabase (auth, DB, API)
- Zustand (state)
- Tailwind CSS
- Responsive mobile-first
- localStorage backup

Dependências:
- Supabase project criado + schema deploy
- Google Fonts (Bricolage + Plus Jakarta)
- Lucide React icons
- npm packages (react-router-dom, zustand, @supabase/supabase-js)

---

### v2 (Pós-MVP)

#### Features Grandes

**Pagamento & Comanda**
- Integração Stripe/Mercado Pago
- Checkout no app
- Pagamento pré-reserva (optional)
- Comanda digital (pedidos no app)
- Split bill

Dependências:
- Stripe/MP SDK
- `payments` table (new)
- `orders` table (new)
- `order_items` table (new)

**Painel de Restaurante**
- Dashboard pra gerenciar
- Ver/confirmar/recusar reservas em tempo real
- Atualizar status da comanda
- Editar cardápio + imagens
- Analytics (reservas, clientes, revenue)
- Integração com PDV (Square, iFood, etc)

Dependências:
- `restaurant_accounts` table (new)
- `restaurant_admin_users` table (new)
- WebSocket pra real-time updates
- Role-based access control

**Aprendizado Automático**
- Recomendações personalizadas (collaborative filtering)
- Previsão de "você vai gostar disso"
- Trending em tempo real
- Histórico inteligente de clientes pro restaurante

Dependências:
- ML pipeline (pode ser externo, tipo Google Cloud ML)
- `recommendations` table (novo)
- Job scheduler pra atualizar rankings

**Social**
- Follow friends
- Ver reservas dos amigos
- Ratings de amigos (peso maior)
- Share lugar no WhatsApp/Instagram

Dependências:
- `user_follows` table
- `social_activities` table
- Share API integrations

---

### v3 (Long-term)

**Mapa Interativo**
- Mapa com pins de restaurantes
- Filtro por mapa (zoom → busca local)
- Google Maps/Mapbox integration

**Mesas em Tempo Real**
- Ver disponibilidade de mesa agora (via integração PDV)
- Fila de espera virtual
- "Chegar em X" e app avisa quando tem mesa

**Eventos & Experiências**
- Eventos especiais (happy hour, noite do cliente, live)
- Experiências (wine pairing, cooking class)
- Compra de convite/ticket

**Marketplace**
- Anúncios patrocinados (restaurante paga pra estar em destaque)
- Promoted content
- "Lugares em alta" pode ser pago

**Programa de Fidelidade**
- Pakas Points (acumula em cada reserva)
- Resgate em desconto
- Tier system (Bronze, Silver, Gold)

---

### Dependências Tecnológicas (MVP)

**Essencial**
- Supabase (schema deploy)
- Google Cloud (localização)
- WhatsApp Business API (notificações)
- SendGrid/Twilio (email/SMS de confirmação)

**Nice-to-have**
- Sentry (error tracking)
- Mixpanel/Segment (analytics)
- Firebase Hosting (deploy)

---

## 10. FLUXOS DETALHADOS (continuação)

[Documento continua com detalhes de cada fluxo, comportamentos específicos de UI, tratamento de erros, validações...]

```
