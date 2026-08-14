# PAKAS — Identidade Visual

**Guia completo de marca · Baseado no logo oficial**

---

## 1. Análise do Logo

O logo do Pakas é composto por dois elementos que funcionam juntos:

**Símbolo:** Um hexágono/círculo em verde água (#2DD4BF) contendo a letra P estilizada em escuro (verde-teal, ~#0F766E). A forma é geométrica, moderna, contemporânea. O P é construído com proporções balanceadas, rememorando tecnologia mas mantendo humanidade.

**Wordmark:** "PAKAS" em verde água puro (#2DD4BF), tipografia geométrica sem serifa, letras largas com espaçamento generoso. Não há diferença de espessura entre as letras (não é distressed nem varia em peso). É sólido, legível, marcante.

**Fundo:** Preto ou muito escuro (#0B1620 / #000000) — o logo é pensado pra destacar contra fundo escuro, transmitindo contraste e modernidade.

**Essência visual:** Jovem, direto, tech, acessível, brasileiro. Sem ornamentação desnecessária. Cada elemento tem função.

---

## 2. Paleta de cores do Pakas

### Cor primária

**Verde água (mint)**
- Valor: `#2DD4BF`
- Uso: ações, CTAs, match, destaque, interação
- No contexto do logo: cor do símbolo e wordmark

### Cor secundária

**Verde-teal escuro**
- Valor: `#0F766E`
- Uso: hover, ícones, fundo de elementos highlights, tom mais profundo
- No contexto do logo: cor do P dentro do símbolo

### Neutros

**Preto/Dark base**
- Valor: `#0B1620` (dark navy quase preto) ou `#000000` (preto puro)
- Uso: backgrounds dark, texto em fundos light, CTAs secundários
- No contexto do logo: fundo de apresentação do logo

**Branco / Paper**
- Valor: `#FFFFFF`
- Uso: fundos claros, cartas, inputs, contrast contra dark

**Cream (fundo aplicação)**
- Valor: `#FAFAF7`
- Uso: fundo principal do app (light mas não branco puro, mais quente)
- Transmite approachability, não estéril

**Cinza quente**
- Valor: `#F5F1EC` (warm gray, para chips inativos, separadores)
- Valor: `#E8E5DF` (linha/border padrão)
- Uso: linhas, bordas, backgrounds secundários

**Cinza de texto**
- Valor: `#64748B` (textSoft, textos secundários)
- Valor: `#94A3B8` (textFaint, placeholders, hints)

### Cores de contexto (não abusivas)

Use com moderação, apenas em casos específicos:

**Rosa/Pink:** `#FF6B6B` — tags de "romantic" / "date" (não pra erros)
**Amarelo/Gold:** `#FFD166` — tags de "family" / "celebration"

---

## 3. Tipografia

### Display font: Bricolage Grotesque

**Quando usar:** Títulos grandes (≥22px), números grandes, headings, hero cards, splash screen, qualquer coisa que precisa "gritar".

**Características:** Geométrica, moderninha, com bastante character. Lembra o DNA do logo (formas limpas, sem floreios).

**Pesos:** 500, 600, 700, 800
- 700/800: títulos principais
- 600: subtítulos
- 500: raramente

**Letter-spacing:** -0.02em a -0.04em (títulos são compactos, não airosos)

**Exemplos:**
- Splash "Pakas" → Bricolage 48px, 700, -0.04em
- Home título "Do que você tá afim hoje?" → Bricolage 22px, 700, -0.02em
- Card título lugar → Bricolage 17px, 700

### Body font: Plus Jakarta Sans

**Quando usar:** Tudo que não é display. Corpo do texto, inputs, labels, CTAs pequenas, tabbar, tudo.

**Características:** Geométrica mas humana. Legível em tamanhos pequenos. Peso visível em 600+, mas não grita.

**Pesos:** 400, 500, 600, 700

**Line-height:** 1.4 (corpo), 1.2 (labels), 1 (números/badges)

**Exemplos:**
- Corpo de texto → Plus Jakarta 14px, 400, line-height 1.4
- Label de campo → Plus Jakarta 12px, 600, uppercase, letter-spacing 0.08em
- Botão CTA → Plus Jakarta 15px, 700
- Tabbar item → Plus Jakarta 10px, 600

### Escala tipográfica completa

| Uso | Fonte | Tamanho | Peso | Letter-spacing |
|---|---|---|---|---|
| Splash principal | Bricolage | 48px | 700 | -0.04em |
| Home title | Bricolage | 26px | 700 | -0.02em |
| Seção title | Bricolage | 18px | 700 | -0.01em |
| Card title | Bricolage | 17px | 700 | 0 |
| Match number | Bricolage | 36px | 800 | 0 |
| Body padrão | Plus Jakarta | 14px | 400 | 0 |
| Label campo | Plus Jakarta | 12px | 600 | 0.08em |
| CTA button | Plus Jakarta | 15px | 700 | 0 |
| Tabbar | Plus Jakarta | 10px | 600 | 0 |
| Caption | Plus Jakarta | 11px | 500 | 0 |

---

## 4. Ícones

Use **Lucide React** como biblioteca de ícones. Nunca use emojis genéricos pra interface.

### Stroke width padrão

- Ícones em tabbar: `stroke-width: 2.2`
- Ícones em botões: `stroke-width: 2`
- Ícones pequenos (16-18px): `stroke-width: 2`
- Ícones grandes (24-32px): `stroke-width: 2`

### Mapeamento de ícones por contexto

**Navegação tabbar:**
- Início: `Home` (Lucide)
- Explorar: `Search` (Lucide)
- Favoritos: `Heart` (Lucide, filled quando ativo)
- Perfil: `User` (Lucide)

**CTAs e ações:**
- Voltar: `ChevronLeft` (Lucide)
- Próximo/Avançar: `ChevronRight` (Lucide)
- Fechar: `X` (Lucide)
- Favoritar: `Heart` (Lucide, outline inativo, filled quando ativo)
- Menu: `Menu` (Lucide)

**Busca e filtros:**
- Busca: `Search` (Lucide)
- Filtro: `SlidersHorizontal` (Lucide)
- Localização: `MapPin` (Lucide)

**Contexto de lugar/reserva:**
- Endereço: `MapPin` (Lucide)
- Telefone: `Phone` (Lucide)
- Horário: `Clock` (Lucide)
- Pessoas: `Users` (Lucide)
- Estacionamento: `ParkingCircle` (Lucide)
- Playground: `Lightbulb` (Lucide) — alternativa `LayoutDashboard` se não gostar
- Musica ao vivo: `Music` (Lucide)
- Rating: use ★ (Unicode, não ícone)
- Check: `Check` (Lucide)
- Alert: `AlertCircle` (Lucide) — cor #FF6B6B (pinkish), nunca vermelho gritante

**Ocasiões (no quiz):**
Não usar emojis. Usar Lucide ou descrição clara. Exemplos:

1. "Com quem você costuma sair?" → usar `User` / `Users` / `Home`
2. "Que tipo de ocasião marca seus rolês?" → usar `Calendar` / `Wine` / `Lightbulb`
3. "Como você quer o ambiente?" → usar `Heart` / `Music` / `Smile` / `Sparkles`
4. "Qual faixa de preço?" → usar `DollarSign`
5. "Que tipos de comida?" → usar `UtensilsCrossed`

---

## 5. Componentes visuais aplicando a identidade

### Botão primário

- Fundo: verde água `#2DD4BF`
- Texto: preto escuro `#0B1620`
- Padding: 18px vertical, 16px horizontal (mínimo 44px height)
- Radius: 16px
- Font: Plus Jakarta 15px, peso 700
- Border: nenhuma
- Hover: fundo escurece levemente para `#25B9A7` (mint-dark)
- Estado ativo: scale 0.98 (feedback tátil)

### Botão secundário (ghost/outline)

- Fundo: transparente ou white `#FFFFFF`
- Texto: `#0B1620`
- Border: 1.5px sólida `#E8E5DF`
- Padding: 18px vertical, 16px horizontal
- Radius: 16px
- Font: Plus Jakarta 15px, peso 700
- Hover: fundo light `#FAFAF7`, border `#0B1620`

### Card padrão

- Fundo: branco `#FFFFFF`
- Border: 1px sólida `#E8E5DF`
- Radius: 18px
- Padding: 14-22px (depende da tela)
- Sombra: muito sutil ou nenhuma (not material design heavy)
- Hover: border mais definida `#0B1620`

### Chip / Pill

- Radius: 100px (máximo rounded)
- Padding: 6px vertical, 12px horizontal
- Font: Plus Jakarta 11px, peso 600
- Ativo: fundo mint `#2DD4BF`, texto `#0B1620`
- Inativo: fundo warm-gray `#F5F1EC`, texto `#0B1620`
- Com close (×): adicionar ícone pequenininho à direita

### Input / Textarea

- Fundo: branco `#FFFFFF`
- Border: 1.5px sólida `#E8E5DF`
- Radius: 14px
- Padding: 14px
- Font: Plus Jakarta 14px, peso 500
- Focus: border mint `#2DD4BF`, sem outline distrator
- Placeholder: cor `#94A3B8` (textFaint)

### Header/seção title

- Font: Bricolage Grotesque 18px, peso 700
- Cor: `#0B1620` (ink)
- Margin-bottom: 14-16px
- Sem underscore ou decoração

### Match badge

- Shape: pill arredondado
- Fundo: branco `#FFFFFF`
- Border: nenhuma
- Padding: 6px vertical, 10px horizontal
- Font: Plus Jakarta 11px, peso 800
- Texto: mint-dark `#0F766E`
- Ícone check Lucide antes do número (5px gap)
- Sombra: muito leve 0 2px 8px rgba(0,0,0,0.1)

### Avatar circular

- Shape: círculo
- Size: 42px (tabbar), 80px (perfil), 36px (cards pequenos)
- Fundo: gradiente mint `#2DD4BF` → mint-dark `#0F766E`
- Texto: branco, Bricolage, bold
- Iniciais (2 caracteres) centralizadas

### Counter (incrementar/decrementar)

- Botão −: width/height 30px, radius 50%, fundo warm-gray `#F5F1EC`, texto `#0B1620`, peso 700, size 16px
- Valor: Plus Jakarta, peso 800, size 16px, text-align center
- Botão +: mesmo do −

---

## 6. Paleta em contexto: Tela por tela

### Splash

- Background: gradiente `#0B1620` (top) → `#0F766E` (bottom)
- Efeito decorativo: 2 círculos radiais mint `#2DD4BF` com blur 8-10px e opacity 0.3-0.4
- Logo: quadrado 110x110, radius 28px, fundo mint, P em `#0B1620`
- Texto: branco
- Botões: primário mint, ghost white

### Home

- Background: cream `#FAFAF7`
- Header saudação: Bricolage título, Plus Jakarta body
- Hero card: fundo ink `#0B1620`, texto branco, efeito mint gradient blur corner
- Cards de ocasião: branco, border line, cada um com ícone Lucide + fundo circle suave

### Resultados

- Background: cream
- Search pill: branco border line
- Filter button: fundo ink, ícone mint
- Active filters chips: ink background, white text (prioritários em mint)
- Place cards: foto + match badge mint, heart outline branco, tags overlay dark-semitransparent

### Página do lugar

- Cover: foto full-bleed + gradient overlay
- Quick info: branco cards, border line
- Match card: mint gradient bold
- Features: white tags com check mint
- CTA button: ink fundo, mint preço destaque

### Reserva

- Background: cream
- Inputs: white border mint 1.5px quando focused
- Time pills: white border, selected = ink background white text
- Counter: white border, botões gray suave
- Footer CTA: mint bright, high contrast

### Perfil

- Background: cream
- Avatar: mint gradient large
- Cards acesso: white border, Lucide icons em quadrado mint-bg
- Settings list: white, chevron right, hover = background light

---

## 7. Composição e espaçamento

**Margins e padding padrão (múltiplos de 4):**
- 4px: gap mínimo entre elementos muito próximos
- 8px: gap padrão entre chips, ícones
- 12px: gap entre seções pequenas
- 16px: padding dentro de cards, espaço entre linhas
- 20px: padding lateral de telas (mobile)
- 24px: espaço vertical entre seções grandes

**Border radius padrão:**
- 12px: inputs, small buttons, avatars pequenos
- 14px: cards pequenos, pills
- 16px: buttons, cards médios
- 18px: cards grandes
- 28px: símbolo logo splash
- 100px: pills/chips (radius máximo)

**Sombras:** Use com parcimônia. Apenas em:
- Hero cards
- CTA fixos (rodapé sticky)
- Match badge
- Overlay gradients

**Nunca use:** Material Design heavy shadows, glassmorphism excessivo, 3D effects

---

## 8. O que NÃO fazer com a marca

**Tipografia:**
- ❌ Não usar Inter, Roboto, Arial, system fonts
- ❌ Não misturar Bricolage com Plus Jakarta em proporções 50/50 (Display deve ser raro)
- ❌ Não usar letra-spacing positivo em títulos (Bricolage é compacta)
- ❌ Não aumentar o peso de Plus Jakarta além de 700 pra body text

**Cores:**
- ❌ Não usar vermelho puro (`#FF0000`) para avisos ou erros — usar `#FF6B6B` (soft pink) ou manter mint como cor de feedback
- ❌ Não inverter o logo (mint no fundo escuro é OK, mas não fazer mint fundo com P branco)
- ❌ Não saturar a paleta com muitas cores ao mesmo tempo — mint é a protagonista
- ❌ Não usar gradientes sem propósito (apenas em hero cards e destaques)

**Ícones:**
- ❌ Não usar emojis em interface (UI)
- ❌ Não misturar bibliotecas de ícones (usar só Lucide)
- ❌ Não aumentar stroke-width além de 2.2 para ícones normais
- ❌ Não colorir ícones aleatoriamente — seguir o mapeamento do PRD

**Componentes:**
- ❌ Não usar radius <12px pra nada no MVP
- ❌ Não criar botões com bordas muito finas (<1.5px)
- ❌ Não fazer cards com shadow > 0 16px 48px (é muito heavy pra UI mobile)
- ❌ Não deixar texto sem contrast suficiente (mínimo WCAG AA 4.5:1 pra body text)

**Tone visual:**
- ❌ Não parecer corporativo ou formal
- ❌ Não parecer "generic AI aesthetic" (Inter + roxa + white space)
- ❌ Não usar elementos 3D ou skeuomorphism
- ❌ Não fazer UI muito densa (menos é mais)

---

## 9. Aplicação no MVP Lovable

Ao implementar no Lovable, configure Tailwind assim:

```js
// tailwind.config.js

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        display: ['Bricolage Grotesque', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        mint: '#2DD4BF',
        'mint-dark': '#0F766E',
        'mint-soft': '#CCFBF1',
        ink: '#0B1620',
        'ink-soft': '#1E293B',
        paper: '#FFFFFF',
        cream: '#FAFAF7',
        'warm-gray': '#F5F1EC',
        line: '#E8E5DF',
        'text-soft': '#64748B',
        'text-faint': '#94A3B8',
        accent: {
          pink: '#FF6B6B',
          yellow: '#FFD166',
        },
      },
      borderRadius: {
        '3xl': '28px',
        '2xl': '22px',
        'pill': '100px',
      },
    },
  },
}
```

Cada componente React deve usar essas classes. Exemplo:

```jsx
// Button primário
<button className="bg-mint text-ink font-display font-bold text-base px-4 py-[18px] rounded-[16px] hover:bg-mint-dark active:scale-98">
  Começar
</button>

// Chip ativo
<span className="bg-ink text-white font-body font-semibold text-xs px-3 py-1.5 rounded-full">
  Playground
</span>

// Card
<div className="bg-paper border border-line rounded-[18px] p-6">
  {/* conteúdo */}
</div>
```

---

## 10. Referências visuais finais

**Essência:** O Pakas é jovem, direto, moderno e acessível. A paleta mint + ink + cream transmite tecnologia mas mantém humanidade. Nada de ornamentação desnecessária. Cada pixel tem função.

**Diferenciação:** Não é Google Maps (chato), não é iFood (cluttered), não é TheFork (europeu). Pakas é brasileiro, rápido, pensado em pessoas, não em algoritmos.

**Movimento esperado:** O app deve parecer leve, rápido, responsivo. Animações suaves (200-300ms), feedback tátil imediato, sem loading screens desnecessários.

**Acessibilidade:** Contrast ratio mínimo 4.5:1 em todos os textos. Toque mínimo 44x44px. Ícones com label. Sem conteúdo que dependa só de cor.

---

*Identidade Visual completa. Pronta pra implementação no MVP Lovable.*