# PAKAS — Prompts pra construir o MVP no Lovable

**Versão 1.0 · Maio 2026**

Sequência de prompts pra colar no Lovable, um por sprint. Cada sprint constrói uma parte do app. Não pule sprints e não combine — o Lovable trabalha melhor com escopo focado.

> **Antes de começar:** crie um projeto novo no Lovable, dê o nome **Pakas**, e tenha o PRD aberto pra consultar se precisar de detalhe.

---

## SPRINT 0 — Setup, design system e estrutura base

**Cole esse prompt primeiro. Ele estabelece a fundação.**

```
Vou construir um app chamado Pakas — uma plataforma de descoberta e reserva de restaurantes em Maringá. Mobile-first, React + Tailwind.

Antes de qualquer tela, configure a fundação do projeto:

1. FONTES — adicione via Google Fonts:
   - Bricolage Grotesque (display, pesos 500-800) — pra títulos e números grandes
   - Plus Jakarta Sans (body, pesos 400-700) — pra corpo e UI
   Configure no tailwind.config como `font-display` e `font-body`. Plus Jakarta Sans é a font padrão.

2. PALETA — adicione essas cores ao tailwind.config:
   - mint: #2DD4BF (primária — ações, match)
   - mintDark: #0F766E (hover, ícones)
   - mintSoft: #CCFBF1 (fundo de chip ativo)
   - ink: #0B1620 (fundo dark, CTA secundário)
   - inkSoft: #1E293B (texto principal)
   - paper: #FFFFFF
   - cream: #FAFAF7 (fundo principal do app)
   - warmGray: #F5F1EC
   - line: #E8E5DF
   - textSoft: #64748B
   - textFaint: #94A3B8

3. ESTRUTURA — crie a estrutura de pastas:
   /src/pages — telas (Home, Quiz, Results, Place, Reservation, Profile)
   /src/components/ui — componentes reutilizáveis (Button, Card, Chip, Counter, Input)
   /src/components/layouts — MobileLayout, AppLayout (com tabbar)
   /src/lib — utils, matching engine, mock data
   /src/data — restaurantes mock de Maringá

4. COMPONENTES BASE — crie esses componentes reutilizáveis:
   - Button (variantes: primary verde mint, secondary ink dark, ghost outline, com ícone opcional)
   - Card (radius 18px, padding 14-22px, fundo branco com border line)
   - Chip (radius 100px, variantes mint/ink/outline, com opção de close button)
   - Counter (botão − e + arredondados, valor centralizado)
   - Input (radius 14px, border line 1.5px, foco em mint)
   - Avatar (círculo, fundo gradient mint, iniciais brancas)

5. LAYOUT MOBILE — crie um MobileLayout que:
   - Tem max-width 430px (centraliza em desktop)
   - Background cream por padrão
   - Suporte a header customizado
   - Tabbar fixa no rodapé (Início, Explorar, Favoritos, Eu) — pode ser ocultada quando necessário

6. ROTEAMENTO — configure rotas:
   / → Splash (se não logado) ou Home
   /onboarding → Quiz
   /home → Home autenticada
   /explore → Resultados / Explorar
   /filters → Filtros avançados
   /place/:id → Página do lugar
   /place/:id/menu → Cardápio
   /place/:id/reserve → Formulário de reserva
   /reservations → Minhas reservas
   /reservations/success → Confirmação
   /profile → Perfil

Use react-router-dom. Por enquanto, todas as rotas podem renderizar placeholders simples — vou construir cada tela nas próximas sprints.

Confirme quando tiver tudo configurado.
```

---

## SPRINT 1 — Splash, Login e Quiz de Onboarding

```
Agora vamos construir o fluxo de entrada do app. Três telas: Splash, Cadastro, Quiz.

== TELA 1: SPLASH ==

Rota: /
Layout: tela cheia, sem tabbar.

Background: gradiente de #0B1620 (top) para #0F766E (bottom).
Efeitos: dois círculos radiais com mint #2DD4BF e blur, um no canto superior direito e outro no inferior esquerdo, opacidade 0.3-0.4 — pra criar atmosfera.

Conteúdo centralizado:
- Logo do Pakas: um quadrado de 110x110px, radius 28px, fundo mint #2DD4BF, com a letra "P" em Bricolage Grotesque 56px, peso 800, cor #0B1620. O quadrado é levemente rotacionado (-3deg) e tem shadow forte (0 16px 48px rgba(45,212,191,0.4)).
- Abaixo, texto "Pakas" em Bricolage Grotesque 48px, peso 700, branco, letter-spacing -0.04em.
- Abaixo, tagline em Plus Jakarta Sans 17px, opacidade 0.7, max-width 280px, centralizado:
  "Sair pra comer, beber ou curtir a cidade do jeito que você quer ficou simples Pakas."

Rodapé (absoluto, bottom 60px, padding lateral 28px):
- Botão primário "Começar" (fundo mint, texto ink, full width, padding 18px, radius 16px, peso 700)
- Botão ghost "Já tenho conta" (transparente, texto branco, border 1.5px rgba(255,255,255,0.2), full width)

Comportamento: "Começar" leva pra /onboarding (cadastro + quiz). "Já tenho conta" mostra modal de login simples.

== TELA 2: CADASTRO (parte do onboarding) ==

Antes do quiz, mostra cadastro simples em uma tela:

Background cream.
Header: botão voltar.
Título grande em Bricolage Grotesque: "Vamos começar?"
Subtítulo em textSoft: "Só pedimos seu nome e telefone. Sem senha, sem complicação."

Campos:
- Nome (input, label "Seu nome")
- Telefone (input com máscara BR, label "Telefone com DDD")
- E-mail (opcional, label "E-mail (opcional)")

Termos: checkbox pequeno com texto "Concordo com os termos e política de privacidade"

Botão "Continuar" (mint, full width, sticky no rodapé).

Após preencher, salva localmente (localStorage por enquanto) e vai pro Quiz.

== TELA 3: QUIZ ==

Rota: /onboarding (após cadastro)
Layout: cream, sem tabbar.

Header:
- Botão voltar (40x40, radius 12, branco, border line)
- Barra de progresso (flex-1, height 6px, fundo warmGray, fill mint, radius pill)
- Texto progresso "1/5", "2/5", etc.

Conteúdo:
- Pequeno label em mintDark, 12px peso 700, uppercase, letter-spacing 0.1em: "Pergunta X de 5"
- Pergunta em Bricolage Grotesque 26px, peso 700, ink, line-height 1.2
- Subtítulo opcional em textSoft 14px ("Pode escolher mais de um")

Opções (lista vertical, gap 10px):
Cada opção é um card:
- Fundo branco, border 1.5px line, radius 16px, padding 16x18px
- Layout horizontal: emoji 24px à esquerda, conteúdo no meio (nome em 15px peso 700, sub em 12px textSoft), círculo de check à direita (22x22, border line)
- Quando selecionada: border mint, fundo mintSoft, círculo preenchido em mint com ícone de check branco

Botão "Próxima" sticky no rodapé (dark/ink, full width). Na última pergunta vira "Encontrar lugares" (mint).

AS 5 PERGUNTAS (carregar dinâmicamente):

1. "Com quem você costuma sair?" (multi-select)
   - Sozinho (emoji 👤)
   - Casal / date (💗)
   - Família com crianças (👨‍👩‍👧)
   - Amigos (👯)
   - Colegas de trabalho (💼)

2. "Que tipo de ocasião marca seus rolês?" (multi-select)
   - Almoço casual (🍽️)
   - Jantar romântico (🕯️)
   - Comemoração (🎉)
   - Reunião (☕)
   - Pra desestressar (😌)
   - Saída com kids (🎈)

3. "Como você quer o ambiente?" (multi-select)
   - Romântico e tranquilo (💗) — "Pouco barulho, mesa íntima"
   - Animado com música (🎵) — "Som ao vivo, agitação"
   - Familiar (⭐) — "Pra ir com crianças"
   - Sofisticado (✨) — "Pra ocasião especial"
   - Despojado / boteco (🍻) — "Casual, descontraído"

4. "Qual faixa de preço cabe melhor?" (single-select)
   - Até R$40 por pessoa
   - R$40 a R$80
   - R$80 a R$150
   - Acima de R$150
   - Depende da ocasião

5. "Que tipos de comida você curte?" (multi-select, mínimo 2)
   - Pizza, Sushi/japonês, Churrasco/carnes, Italiano/massas, Hambúrguer, Petiscos/boteco, Comida brasileira, Árabe, Mexicano, Vegetariano/vegano

Salva todas as respostas no perfil do usuário (localStorage por enquanto). Após a última, vai pra /home.

Link discreto no header das perguntas: "Pular por agora" (textSoft, pequeno) — caso o usuário queira pular tudo.

Confirme quando as três telas estiverem prontas e funcionando.
```

---

## SPRINT 2 — Home e Navegação Tabbar

```
Agora a Home — coração do app.

== TELA: HOME ==

Rota: /home
Layout: MobileLayout com tabbar visível, fundo cream.

Header (não sticky, parte do scroll):
- Linha 1 (greeting):
  - Esquerda: texto pequeno textSoft "Bom dia," (varia: bom dia até 12h, boa tarde 12-18h, boa noite depois) + nome em Bricolage Grotesque 28px peso 700 ink
  - Direita: avatar circular 42x42, fundo gradient mint-mintDark, iniciais brancas
- Linha 2: pill de localização (inline-flex, padding 6x12, branco, border line, radius 100px):
  - Ícone de pin pequeno + "Centro, Maringá" + chevron pequeno
  - Clicável (abre modal pra trocar — placeholder por enquanto)

HERO CARD (CTA principal):
- Card grande com fundo ink #0B1620, radius 22px, padding 22px, color branco
- Efeito decorativo: círculo radial mint atrás-direita-baixo, opacidade 0.5, blur
- Título em Bricolage Grotesque 22px peso 700:
  "Do que você tá <span class='text-mint'>afim hoje?</span>"
- Subtítulo branco 70% opacidade, 13px: "Responde 5 perguntas rápidas e a gente acha o lugar certo."
- Botão inline (não full width): texto "Começar" + ícone seta, fundo mint, texto ink, padding 10x16, radius pill, peso 700
- Onclick: leva pra /onboarding/express (versão rápida do quiz com só 3 perguntas: companhia, vibe, faixa de preço)

SEÇÃO "Por ocasião":
- Título em Bricolage Grotesque 18px peso 700
- Grid 2 colunas, gap 10px
- Cards (branco, border line, radius 16, padding 14px):
  - Quadrado de ícone 36x36, radius 10, fundo colorido suave + ícone na cor escura matching
  - Nome em 13px peso 700 ink
  - Sub em 11px textSoft

Cards (4):
- Date romântico (icon pink #FFE4E4 + ♥ accent-pink) — "Ambiente íntimo"
- Família (icon yellow #FFF4D6 + ⭐ amarelo escuro) — "Com playground"
- Música ao vivo (icon mintSoft + ♪ mintDark) — "Rolê agitado"
- Reunião (icon ink + ● mint) — "Mesa pra grupo"

Onclick em cada card: vai pra /explore com filtros pré-aplicados.

SEÇÃO "Por tipo de comida" (scroll horizontal):
- Título em Bricolage Grotesque 18px
- Lista horizontal scrollável de pills:
  - 🍕 Pizza | 🍣 Sushi | 🥩 Churrasco | 🍝 Italiana | 🍔 Hambúrguer | 🍻 Boteco | 🇧🇷 Brasileira
- Cada pill: branco, border line, radius pill, padding 8x14, peso 600, gap 6 com emoji

SEÇÃO "Pra você" (carrossel horizontal):
- Título "Pra você"
- 3-4 mini cards horizontais (largura 200px cada):
  - Foto pequena (170x100, radius 14)
  - Nome do lugar
  - Match badge (X%)
  
Use mock data por enquanto — 3 lugares fictícios.

== TABBAR ==

Crie a tabbar como componente reutilizável:
- Fixa no rodapé, height 80px, background branco, border-top 1px line
- 4 itens, distribuídos uniformemente:
  - Início (ícone Lucide "Home")
  - Explorar (ícone Lucide "Search")
  - Favoritos (ícone Lucide "Heart")
  - Eu (ícone Lucide "User")
- Cada item: ícone 22px + label 10px peso 600
- Item ativo: cor mintDark, ícone com stroke-width 2.2
- Item inativo: cor textFaint, stroke-width 2
- Padding bottom 16px (pra safe area)
- Onclick em cada item: navegar pra rota correspondente

Confirme quando a Home estiver funcionando e navegável.
```

---

## SPRINT 3 — Resultados e Filtros Avançados

```
Agora as telas de busca: Resultados e Filtros avançados. Essas duas são o coração funcional do Pakas.

== TELA: RESULTADOS ==

Rota: /explore (ou /explore?filters=...)
Layout: MobileLayout com tabbar visível, fundo cream.

Header (sticky):
- Linha 1:
  - Esquerda: search pill (flex-1, branco, border line, radius 14, padding 12x14):
    - Ícone lupa pequeno + texto da busca atual ("Pra família com playground" — varia conforme filtros) + chevron
    - Clicável: abre /filters
  - Direita: botão filtro (44x44, radius 14, fundo ink, ícone mint):
    - Ícone Lucide "SlidersHorizontal"
    - Badge no canto superior direito mostrando número de filtros ativos: 18px circular, mint, número ink peso 800

- Linha 2 (active filters bar, scroll horizontal):
  - Pills horizontais com cada filtro aplicado:
    - Filtros prioritários: fundo mint, texto ink
    - Filtros normais: fundo ink, texto branco
  - Cada pill: padding 6x12, radius pill, peso 600, font-size 11px, gap 6 com "×" pra remover
  - Se nenhum filtro ativo, esconde essa linha

- Linha 3 (meta):
  - Texto 12px textSoft: "<strong>X lugares</strong> compatíveis em Maringá · ordenado por match"
  - Toggle pequeno à direita: "Match ▾" (clicável, abre dropdown com Match / Distância / Avaliação / Preço)

LISTA DE CARDS (scroll vertical, gap 14px):

Cada card:
- Card branco, radius 18, border line, overflow hidden, margin-bottom 14px

PARTE 1: FOTO (altura 130px)
- Imagem full-bleed (use unsplash com query relevante: pizzaria, sushi, bar etc — ou gradiente de fallback)
- Match badge: position absolute top 10, left 10, fundo branco, padding 6x10, radius pill, font-size 11 peso 800, color mintDark, com ícone check pequeno antes do "94% match"
- Heart button: position absolute top 10, right 10, 32x32, fundo branco 95%, radius circle, ícone Heart Lucide 16px stroke ink
- Tags overlay: position absolute bottom 10 left 10, display flex gap 4 flex-wrap, max-width 250px
  - Cada tag: fundo rgba(11,22,32,0.85), backdrop-blur 8px, texto branco, padding 4x8, radius 6, font-size 10 peso 600

PARTE 2: INFO (padding 14px)
- Linha 1 (flex, justify-between):
  - Nome em Bricolage Grotesque 17px peso 700 ink
  - Rating à direita: ★ 4.8 — flex gap 4, font-size 12 peso 700 ink
- Linha 2 (meta, font-size 12 textSoft):
  - "Pizzaria <span class='dot'>•</span> R$45/pessoa <span class='dot'>•</span> 1,2 km"
  - Dots como elemento 3x3 circle textFaint

ESTADO VAZIO:
Se 0 lugares:
- Ícone outline grande (Lucide SearchX, 64px, textFaint)
- Headline em Bricolage 22px: "Nada por aqui"
- Subtitle em textSoft: "Não achamos lugares que batam com tudo isso. Tente afrouxar algum filtro?"
- Botão "Editar filtros" (ghost, texto mintDark)

LOADING: skeleton com 3 cards shimmer (warmGray com gradient).

== TELA: FILTROS AVANÇADOS ==

Rota: /filters
Layout: MobileLayout, sem tabbar.

Header (sticky):
- Linha 1: botão fechar (X) à esquerda + título "Filtros" centralizado em Bricolage 20px peso 700 + "Limpar tudo" à direita (texto-link textSoft, font-size 13)

Conteúdo (scroll vertical):

Seções colapsáveis (todas expandidas por default). Cada seção:
- Title em Bricolage 18px peso 700, com chevron à direita
- Grid de pills horizontais (flex-wrap, gap 6):
  - Pill inativa: fundo branco, border line, padding 8x14, radius pill, peso 600, font-size 12, ink
  - Pill ativa: fundo ink, texto branco
- Pode ter ícone antes do texto em algumas

SEÇÕES (na ordem):

1. OCASIÃO (multi-select):
Date, Família, Amigos, Aniversário, Reunião casual, Almoço rápido, Happy hour, Comemoração, Pra conversar, Sozinho

2. AMBIENTE (multi-select):
Romântico, Tranquilo, Agitado, Familiar, Jovem, Sofisticado, Ao ar livre, Climatizado, Com música ao vivo, Sem música ao vivo, Com DJ, Pet friendly

3. ESTRUTURA (multi-select):
Playground, Área kids, Estacionamento, Valet, Acessibilidade, Mesa externa, Mesa pra grupo, Mesa reservada, Mesa próxima ao playground, Banheiro familiar

4. COMIDA (multi-select):
Pizza, Sushi, Churrasco, Hambúrguer, Espeto, Massas, Japonesa, Italiana, Brasileira, Árabe, Mexicana, Cafeteria, Doces, Porções, Vinhos, Drinks, Cerveja, Infantil, Vegetariano, Vegano, Sem glúten, Sem lactose

5. PREÇO (single-select):
Até R$30, R$30-60, R$60-100, R$100-180, Acima de R$180, Promoção ativa, Rodízio, Happy hour

6. OPERAÇÃO (multi-select):
Aberto agora, Fecha tarde, Aceita reserva, Pouca fila, Mesa agora

Footer fixo (sticky bottom):
- Padding 16x20px, background branco, border-top line
- Botão verde grande "Ver X lugares" (mint, full width, padding 18, peso 700) — X atualiza em tempo real conforme filtros mudam

== MOCK DATA ==

Crie /src/data/mockEstablishments.ts com 15 restaurantes fictícios de Maringá. Para cada um:
- id, name (nomes plausíveis brasileiros: "Pizzaria Vila Verde", "Quintal do Lima", "Sushi Hayashi", "La Pasta Bella", "Empório Maringá", "Boteco do Centro", "Café Aurora", "Vovó Linda", "Bar do Lima", "Vegana Verde", "Bistrô 47", "Churrasco do Tio", "Sushi Sakura", "Garage Burger", "Pizzaria Forno Velho")
- category (pizzaria/sushi/bar/restaurante/café/churrascaria/etc)
- coverImage (use unsplash.com com query relevante: "italian restaurant", "japanese sushi", "burger" etc — ou cores gradient se preferir)
- rating (4.0-4.9)
- averageTicket (numérico)
- distance (em km — fictício, 0.5-8.5)
- features (objeto com booleans: hasPlayground, hasParking, hasLiveMusic, isRomantic, isFamilyFriendly, isYoungCrowd, isQuiet, hasKidsArea, etc)
- tags (array de strings que aparecem na foto)
- matchScore (calculado dinamicamente — placeholder com valor entre 65-95)

== LÓGICA DE FILTROS ==

Crie /src/lib/filterEngine.ts que:
- Recebe lista de estabelecimentos + filtros ativos
- Retorna lista filtrada e ordenada
- Calcula score de compatibilidade conforme fórmula do PRD:
  - 40pts se atende obrigatórios
  - 20pts proporcional a desejáveis
  - 10pts distância (max(0, 10 - dist*2))
  - 10pts rating ((rating-3)*5)
  - 10pts preço compatível
  - 10pts tempo de espera (mock 5 ou 10 por enquanto)
- Elimina lugares fechados se filtro "aberto agora" ativo
- Elimina lugares >15km

Confirme quando Resultados e Filtros estiverem funcionando com mock data e filtros aplicáveis.
```

---

## SPRINT 4 — Página do Lugar e Cardápio

```
Agora a página individual do lugar — onde a decisão final acontece.

== TELA: PÁGINA DO LUGAR ==

Rota: /place/:id
Layout: tela cheia, sem tabbar, com CTA fixo no rodapé.

COVER (top, 240px de altura):
- Imagem full-bleed do lugar
- Gradient overlay no rodapé: linear-gradient(transparent → rgba(11,22,32,0.6))
- Cover nav (absolute top 12, left/right 14): 
  - Esquerda: botão voltar 38x38 branco 95% circle, ícone chevron-left ink
  - Direita: botão heart 38x38 branco 95% circle, ícone Heart ink (preenchido se favorito)
- Cover name (absolute bottom 14, left/right 16, color branco, z-index 5):
  - Nome em Bricolage Grotesque 26px peso 700, letter-spacing -0.02em
  - Meta line abaixo (12px, opacity 0.9): "★ 4.8 · 312 avaliações <dot> Aberto agora"

CONTEÚDO (background cream, padding lateral 20px, padding-bottom 100px):

QUICK INFO ROW (logo abaixo do cover, margin-top 16px):
- Grid 3 colunas, gap 10px
- Cada item (branco, border line, radius 14, padding 10x8, text-align center):
  - Valor em Bricolage 14px peso 700 ink: "R$45" | "15min" | "1,2km"
  - Label em 10px textSoft: "por pessoa" | "preparo" | "de você"

MATCH CARD (margin-top 16):
- Background gradient mint → mintDark
- Radius 16, padding 14
- Layout horizontal: flex gap 12
- Esquerda: número grande "94%" em Bricolage 36px peso 800, color branco, line-height 1
- Direita: texto 12px branco 95% opacity, line-height 1.3:
  - Linha 1 (peso 700, 14px): "Bate com o que você quer"
  - Linha 2: explicação curta dos filtros atendidos ("Playground, mesa pra grupo, estacionamento e ticket dentro da sua faixa.")
- Clicável: expande pra mostrar detalhe de quais critérios contribuíram pro score

SEÇÃO: ESTRUTURA (margin-top 20):
- Título seção em Bricolage 18px peso 700
- Grid 2 colunas, gap 8:
  - Cada feature tag: branco, border line, radius 12, padding 10x12
  - Layout: check verde + texto
  - Check: 16x16 mint circle com ícone check branco
  - Texto: 12px peso 600 ink
- Mostra apenas features que o lugar tem (true)

SEÇÃO: AMBIENTE (margin-top 20):
- Título "Ambiente"
- Pills horizontais (radius pill, fundo warmGray, peso 600, font 12):
  - Lista as vibes do lugar: "Familiar", "Climatizado", "Música ambiente", etc

SEÇÃO: TIPO DE COMIDA:
- Pills: "Pizza", "Massas", "Petiscos"

SEÇÃO: AVALIAÇÕES POR USO (DIFERENCIAL):
- Título "O que dizem por uso"
- Lista vertical, cada linha:
  - Esquerda: nome do uso + estrelas pequenas
  - "Bom pra família — 4.9 ★ (38)"
  - "Bom pra date — 4.2 ★ (12)"
  - "Bom pra grupo — 4.7 ★ (24)"
- Cada linha tem barra de progresso fina mostrando a nota (mint pra ≥4.5, warmGray pra <4.5)

SEÇÃO: CARDÁPIO (preview):
- Título "Cardápio" + link "Ver tudo" à direita
- Lista horizontal de 4 itens:
  - Mini card: foto pequena (60x60 radius 10) + nome + preço
- Onclick em "Ver tudo": leva pra /place/:id/menu

SEÇÃO: LOCALIZAÇÃO:
- Título "Onde fica"
- Mini mapa estático (placeholder com gradient mint suave ou Google Static Maps)
- Endereço completo abaixo
- Botão "Como chegar" (ghost com ícone, abre Google Maps em nova aba)

FOOTER FIXO (sticky bottom):
- Padding 14x20 bottom 28, background com gradient white 30% pra transparente acima
- Botão "Reservar mesa" — fundo ink, texto branco, full width, padding 18, radius 16, peso 700:
  - Layout flex justify-between: texto "Reservar mesa" à esquerda, "R$45/pessoa" em mint à direita
- Onclick: leva pra /place/:id/reserve

== TELA: CARDÁPIO ==

Rota: /place/:id/menu
Layout: MobileLayout, sem tabbar.

Header:
- Botão voltar à esquerda + nome do lugar centralizado (Bricolage 18px) + botão de busca à direita

Conteúdo:
- Categorias como sticky tabs no topo (Entradas, Pratos, Bebidas, Sobremesas — scroll horizontal)
- Lista vertical de itens, separados por seção
- Cada item:
  - Layout horizontal, branco, border-bottom line
  - Esquerda (flex-1): nome (15px peso 700) + descrição (12px textSoft, 2 linhas truncated) + preço (14px peso 700 ink)
  - Direita: foto 80x80 radius 12 (se houver)

Estado vazio: "Esse lugar ainda não cadastrou cardápio. Você pode pedir lá."

Use mock data — pra cada restaurante mock, crie um cardápio com 8-12 itens distribuídos em categorias.

Confirme quando ambas as telas estiverem funcionando.
```

---

## SPRINT 5 — Reserva e Confirmação

```
Agora o coração transacional do MVP: formulário de reserva + confirmação.

== TELA: RESERVA ==

Rota: /place/:id/reserve
Layout: MobileLayout sem tabbar, com CTA sticky.

Header (não-sticky, parte do scroll):
- Botão voltar (40x40 branco border line)
- Título em Bricolage Grotesque 26px peso 700 ink: "Sua reserva"
- Sub em textSoft 13: "A gente avisa o restaurante. Você só chega."

CARD RESUMO DO LUGAR (margin-top 18):
- Card branco border line radius 14 padding 12
- Layout horizontal flex gap 12:
  - Foto 48x48 radius 12 (cover)
  - Direita: nome do lugar (14px peso 700) + meta (11px textSoft: "Centro · 1,2km · ★ 4.8")

CAMPOS (todos margin-top 20 entre eles):

CAMPO 1: QUANDO
- Label "QUANDO" (uppercase, 12px peso 700 ink, letter-spacing 0.08em, margin-bottom 8)
- Input grande, branco, border 1.5px mint (estado ativo) radius 14 padding 14
- Mostra data formatada: "Hoje, qui · 21 mai"
- Onclick abre date picker (componente nativo ou shadcn calendar)

CAMPO 2: HORÁRIO
- Label "HORÁRIO"
- Grid de pills (4 colunas, gap 6):
  - Cada pill: branco, border 1.5px line, radius 12, padding 10, text-align center, font-size 13 peso 700 ink
  - Selecionado: fundo ink, texto branco, border ink
- Slots de meia em meia hora (calcular slots disponíveis a partir da hora atual, próximas 6h por exemplo: 19:00, 19:30, 20:00, 20:30, 21:00, 21:30)
- Default: próximo slot livre (ex.: se são 18:42, default 19:00)

CAMPO 3: PESSOAS (ADULTOS)
- Label "PESSOAS"
- Counter row: branco border 1.5px line radius 14 padding 14, flex justify-between
  - Esquerda: "Adultos" (14px peso 700 ink) + small "13 anos ou mais" (11px textSoft)
  - Direita: counter horizontal:
    - Botão − (30x30 warmGray circle, peso 700 ink 16px)
    - Valor (peso 800 16px, min-width 18px center)
    - Botão + (idem)
- Default: 2

CAMPO 4: CRIANÇAS
- Mesma estrutura, label "CRIANÇAS", subtitle "até 12 anos", default 0

CAMPO 5: PREFERÊNCIA DE MESA (opcional)
- Label "PREFERÊNCIA DE MESA (opcional)"
- Chips multi-select horizontal scrollable:
  - "Mesa de canto", "Perto do playground", "Longe do som ao vivo", "Mesa externa", "Acessível"
- Selecionado: mint background, ink text. Inativo: warmGray bg, ink text.

CAMPO 6: OBSERVAÇÕES (opcional)
- Label "OBSERVAÇÕES (opcional)"
- Textarea grande: branco border 1.5px line radius 14 padding 14, min-height 80px, font 13
- Placeholder: "Aniversário, primeira vez no lugar, alguma alergia... fica à vontade."

FOOTER STICKY:
- Padding 16x20 bottom 28, background branco, border-top line
- Summary line acima (margin-bottom 12, font 13 textSoft):
  - "Mesa pra <strong>X pessoas</strong> hoje às <strong>HH:MM</strong>" — números em ink peso 700
- Botão grande "Confirmar reserva" — fundo mint, texto ink, full width, padding 18, radius 16, peso 700

COMPORTAMENTO AO CONFIRMAR:
- Mostra loading spinner sobre o botão
- Salva a reserva no localStorage (status: "pending")
- Em paralelo, simula envio de WhatsApp pro restaurante (mock — apenas console.log)
- Navega para /reservations/success após 1.5s

== TELA: SUCESSO ==

Rota: /reservations/success
Layout: tela cheia centralizada.

Background cream com efeito sutil (círculo mint blur no canto).

Conteúdo (centralizado):
- Animação de check em mint (scale-up + fade, dura 600ms):
  - Círculo 80x80 mint, ícone check branco grande dentro
- Título em Bricolage 32px peso 700 ink, margin-top 24: "Quase lá!"
- Texto em textSoft 15px, max-width 300, margin-top 12, center:
  "A gente já avisou a [Nome do lugar]. Em até 15 minutos eles confirmam sua mesa via WhatsApp."

CARD DE RESUMO (margin-top 32, branco border line radius 18 padding 18):
- Layout vertical:
  - Foto do lugar (full width 100px height radius 12)
  - Nome em Bricolage 18 peso 700 ink margin-top 12
  - Lista de detalhes:
    - 📅 Hoje, 21 de maio
    - 🕐 19:30
    - 👥 4 adultos + 2 crianças
    - 📍 Centro, Maringá

BOTÕES (margin-top 24):
- Primário: "Voltar pra Home" (ink, full width)
- Ghost: "Ver minhas reservas" (texto mintDark)

== TELA: MINHAS RESERVAS ==

Rota: /reservations
Layout: MobileLayout com tabbar.

Header:
- Título em Bricolage 28 peso 700 ink: "Minhas reservas"
- Tabs: "Próximas" | "Histórico" (chips horizontais, ativa em mint)

Lista vertical de cards:
- Cada card (branco, radius 18, border line, padding 0, overflow hidden):
  - Layout horizontal:
    - Foto à esquerda 100x100 (radius border-left)
    - Conteúdo à direita (padding 14, flex-1):
      - Status badge no topo (font 10 peso 800 uppercase letter 0.1em):
        - "Pendente" (fundo #FFF4D6 texto #B07500)
        - "Confirmada" (fundo mintSoft texto mintDark)
        - "Cancelada" (fundo warmGray texto textSoft)
        - "Realizada" (fundo ink texto mint)
      - Nome do lugar (Bricolage 16 peso 700 ink)
      - Meta (12 textSoft): "Hoje · 19:30 · 4 pessoas"
      - Botão pequeno "Detalhes" (texto mintDark peso 700 12)

Estado vazio:
- Ícone outline Calendar
- "Nenhuma reserva ainda"
- "Que tal achar um lugar agora?" + botão "Encontrar lugares" (mint)

Confirme quando o fluxo de reserva completo (formulário → confirmação → minhas reservas) estiver funcionando.
```

---

## SPRINT 6 — Perfil, Favoritos e Histórico

```
Telas pessoais do usuário.

== TELA: PERFIL ==

Rota: /profile
Layout: MobileLayout com tabbar.

Header pessoal:
- Avatar grande 80x80 (gradient mint, iniciais brancas)
- Nome em Bricolage 24 peso 700 ink (centralizado)
- Cidade em textSoft 14
- Botão pequeno "Editar perfil" (ghost com border line)

CARDS DE ACESSO (grid 2x2, margin-top 24, gap 10):
Cada card (branco, border line, radius 16, padding 14, flex column gap 8):
- Ícone Lucide 24px em quadrado 36x36 radius 10 (fundo mintSoft, ícone mintDark)
- Nome (14 peso 700 ink): "Minhas reservas" | "Favoritos" | "Histórico" | "Refazer quiz"
- Sub (11 textSoft): "3 ativas" | "12 lugares" | "8 visitados" | "Atualizar preferências"

SEÇÃO: PREFERÊNCIAS APRENDIDAS:
- Título "O que sei sobre você" em Bricolage 18 peso 700
- Lista vertical de chips informativos (não interativos):
  - "🌙 Você prefere ambientes tranquilos"
  - "🍺 Cerveja: Heineken parece ser sua favorita"
  - "💰 Ticket médio que você escolhe: R$60 por pessoa"
  - "👨‍👩‍👧 Sai com a família com frequência"
- Botão pequeno textSoft "Resetar preferências"

SEÇÃO: CONFIGURAÇÕES:
- Lista vertical, cada item linha clicável (justify-between, font 14 peso 600 ink, chevron right):
  - 🔔 Notificações
  - 📍 Localização
  - 🔒 Política de privacidade
  - 📄 Termos de uso
  - 🆘 Ajuda e suporte
  - 🚪 Sair

== TELA: FAVORITOS ==

Rota: /favorites
Layout: MobileLayout com tabbar.

Header:
- Título "Favoritos" em Bricolage 28
- Sub textSoft: "Lugares que você salvou pra voltar"

Grid de cards 2 colunas (gap 10):
- Cada card menor que na lista de resultados:
  - Foto quadrada 150x150 radius 14
  - Heart ativo (preenchido mint) no canto
  - Abaixo: nome (14 peso 700) + meta pequena (11 textSoft)

Estado vazio:
- Ícone Heart outline 64px textFaint
- "Nada salvo ainda"
- "Toque no coração nos lugares que você curtir"
- Botão "Explorar lugares" mint

== TELA: HISTÓRICO ==

Rota: /profile/history
Layout: MobileLayout sem tabbar (sub-tela do perfil).

Header:
- Botão voltar + título "Histórico"
- Sub: "Lugares que você visitou ou reservou"

Lista vertical (estilo timeline):
- Agrupada por mês ("Maio 2026", "Abril 2026")
- Cada item:
  - Linha vertical fina à esquerda (timeline visual)
  - Foto pequena (50x50 radius 10) + info:
    - Nome
    - "Visitado em 18 mai · 19:30 · 4 pessoas"
    - Botão "Reservar de novo" (texto pequeno mintDark)

Confirme quando essas três telas estiverem funcionando.
```

---

## SPRINT 7 — Mock Data Robusto, Estados e Polimento

```
Sprint final pra deixar o MVP pronto pra ser apresentado.

== MOCK DATA ENRIQUECIDO ==

Expanda /src/data/mockEstablishments.ts pra ter:

- 25 restaurantes fictícios de Maringá com nomes plausíveis
- Distribuídos em categorias: 5 pizzarias, 4 sushis, 3 churrascarias, 3 bares, 4 italianos, 2 hambúrgueres, 2 cafés, 2 boteco, mais variados
- Cada um com:
  - Galeria de 3-5 fotos (use unsplash com queries específicas)
  - Features bem distribuídas (alguns com playground, outros românticos, outros jovens)
  - Endereços plausíveis em bairros de Maringá (Centro, Zona 7, Parque das Grevíleas, Jardim Aclimação, Zona Sul)
  - Coordenadas fictícias mas plausíveis
  - Cardápios com 8-15 itens cada
  - Avaliações por uso (good_for_date, good_for_family etc) com pesos diferentes — um lugar pode ser 4.9 pra família e 3.2 pra date, por exemplo

== ESTADOS GLOBAIS ==

Use zustand (ou Context simples) pra gerenciar:

1. UserStore:
   - user (nome, telefone, cidade)
   - preferences (do quiz)
   - learnedPreferences (cerveja favorita, ticket médio etc)
   - isOnboarded

2. FiltersStore:
   - activeFilters (array)
   - searchQuery (string)
   - sortBy ('match' | 'distance' | 'rating' | 'price')

3. ReservationsStore:
   - reservations (array com pending/confirmed/cancelled/completed)
   - addReservation, updateReservation, cancelReservation

4. FavoritesStore:
   - favorites (array de establishment ids)
   - toggleFavorite

Persistir tudo em localStorage.

== ESTADOS DE LOADING / EMPTY / ERROR ==

Em cada tela com listas, implemente os 3 estados:

LOADING:
- Componente Skeleton com shimmer animation (background gradient warmGray → line → warmGray, animação 1.5s loop)
- 3-4 skeleton cards na lista de resultados
- 1 skeleton hero na página do lugar

EMPTY:
- Componente EmptyState reutilizável (props: icon, title, subtitle, ctaText, ctaAction)
- Ícone Lucide outline 64px textFaint
- Title Bricolage 22 peso 700 ink
- Subtitle textSoft 14 max-width 280 center
- CTA opcional em mint

ERROR:
- Componente ErrorState reutilizável (props: title, subtitle, onRetry)
- Ícone AlertCircle accent-pink (não vermelho)
- "Travou aqui" / "Algo deu errado"
- "Tenta de novo? Se persistir, fala com a gente."
- Botão "Tentar de novo"

== ANIMAÇÕES E POLIMENTO ==

Adicione (use framer-motion):

1. Transições de página: fade + slide leve (200ms)
2. Cards de resultado: stagger fade-in (delay 50ms entre cards)
3. Modal de filtros: slide-up entrance
4. Botão de match badge: pulse sutil ao aparecer
5. Heart button: scale bounce ao favoritar (1 → 1.3 → 1)
6. Pills de filtro: fade entre estado ativo/inativo
7. Tela de sucesso: check scale animation + texto fade-in

== MICROCOPY FINAL ==

Revise toda a copy do app pra usar o tom Pakas:
- "Lugar" em vez de "estabelecimento"
- "Reservar mesa" em vez de "fazer reserva"
- "Tá afim", "rolê", "boteco" quando apropriado
- "Você" sempre em 2ª pessoa
- Erros descontraídos: "Travou aqui" em vez de "Erro 500"

== TOUCHES FINAIS ==

1. Favicon: gerar a partir do logo (P em quadrado mint)
2. Meta tags pro app (title: "Pakas — Sair ficou simples", description igual ao tagline)
3. Manifest.json para PWA (nome Pakas, theme color #2DD4BF, background #0B1620)
4. Splash screen pra quando instalar como PWA
5. Verifique que todas as imagens tem alt text
6. Verifique que todos os botões têm cursor pointer e estados hover

== TESTE DE FLUXO COMPLETO ==

Garanta que esse caminho funciona ponta a ponta:

1. Abrir o app pela primeira vez → Splash
2. Clicar "Começar" → Cadastro
3. Preencher dados → Quiz
4. Responder 5 perguntas → Home
5. Clicar em "Família" no card de ocasião → Resultados pré-filtrados
6. Abrir botão de filtros → Adicionar "Playground" e "Estacionamento" → Aplicar
7. Lista atualiza → Clicar em primeiro card
8. Página do lugar → Ver match + features + cardápio preview
9. Clicar "Reservar mesa" → Formulário
10. Selecionar horário + ajustar pessoas + adicionar observação → Confirmar
11. Tela de sucesso → "Ver minhas reservas"
12. Lista de reservas com status Pendente
13. Voltar pra home pelo tabbar
14. Abrir Perfil → Ver preferências aprendidas

Se tudo isso funciona, o MVP tá pronto pra demo.

Confirme quando o MVP estiver completo e o fluxo testável ponta a ponta.
```

---

## Dicas operacionais ao usar os prompts

1. **Não combine sprints.** Cole um por vez, espere o Lovable confirmar, teste, e só depois cole o próximo.

2. **Se algo sair errado em um sprint**, peça ajustes específicos antes de seguir. Exemplo: "O Hero card da Home tá com a cor errada — o gradient deve ser ink → mintDark, não mint puro."

3. **Use o mockup HTML como referência visual.** Se uma tela sair diferente do esperado, mostre pro Lovable o screenshot do mockup e peça pra alinhar.

4. **Mock data primeiro, backend depois.** O MVP inteiro vai funcionar com localStorage e mock data no Lovable. Quando estiver pronto, conectamos com Supabase numa etapa separada (Sprint 8 — Backend Real, fora deste documento).

5. **Não tente fazer pagamento, comanda ou padronização de cardápio agora.** Esses são V2. Se o Lovable sugerir, recuse e foque no escopo MVP.

6. **Print da tela vale mil palavras.** Quando algo não está alinhado com a visão, manda o print do mockup pro Lovable e descreve a diferença.

---

*Fim do documento de prompts. Próxima fase: Sprint 8 (backend Supabase) + Sprint 9 (deploy + testes com restaurantes piloto).*