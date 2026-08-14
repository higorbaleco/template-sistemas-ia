Role: Act as a World-Class Senior Creative Technologist and Lead Frontend Engineer.
Objective: Architect a high-fidelity, cinematic "1:1 Pixel Perfect" landing page for AVRAHAM Digital.
Aesthetic Identity: "Spatial Tech / Cosmic Agency." The site must feel like a mission control center meets a luxury tech agency — dark, deep, precise, alive.

---

1. CORE DESIGN SYSTEM (STRICT)

Palette:
  Preto Espacial (Background): #000000
  Roxo Profundo (Secondary BG): #1A0A2E
  Roxo Médio (Cards): #3D1F6E
  Roxo Neon (Borders/Glow): #7B2FBE
  Roxo Brilhante (Accent/Glow principal): #9B5CF6
  Lilás Claro (Labels/Tags): #C4A1FF
  Rosa Magenta (Contraste secundário): #E040FB
  Branco Puro (Títulos): #FFFFFF
  Branco 80% (Corpo): rgba(255,255,255,0.8)
  Branco 60% (Legendas): rgba(255,255,255,0.6)

Glassmorphism System (elemento central de identidade — aplicar em TODOS os cards):
  background: rgba(30,10,80,0.4–0.7)
  border: 1px solid rgba(255,255,255,0.12)
  border-radius: 20–32px
  backdrop-filter: blur(12–20px)
  box-shadow: 0 0 40px rgba(107,33,200,0.3)

Ticket Format (containers principais):
  border-radius: 24px nos cantos
  Entalhes laterais: semicírculos recortados (clip-path ou SVG) nos lados esquerdo e direito, posicionados no centro vertical, diâmetro ~22px
  Usado em: cards de serviço, cards de preço, hero container

Typography:
  Títulos Principais: "Space Grotesk" ou "Syne" — peso 800–900, caixa baixa com destaque em branco
  Títulos Secundários: mesma fonte — peso 400–500, letter-spacing: 0.15em, branco 60%
  Corpo: "Inter" — 400, legível, neutro
  Labels/Tags: "Inter" — 300–400, itálico às vezes, branco 80%
  Dados/Números: Monospace — bold, roxo brilhante #9B5CF6

Glow Light System:
  Sempre presente em pelo menos um canto da composição
  Superior esquerdo (70% das seções): radial-gradient(ellipse at top-left, rgba(155,92,246,0.4), transparent 60%)
  Superior direito (variação): radial-gradient(ellipse at top-right, rgba(224,64,251,0.3), transparent 60%)
  Cor alternativa: branco puro para lens flare decorativo

Visual Texture:
  CSS Noise overlay global: SVG turbulence em 0.03 opacity, mistura "overlay" — para eliminar flat digital
  Partículas/estrelas: canvas com ~80 pontos brancos animados (parallax leve no scroll)

---

2. COMPONENT ARCHITECTURE & BEHAVIOR

A. NAVBAR (A Cápsula Flutuante)

  Fixed, pill-shaped container centralizado.
  Morphing Logic:
    - No topo do hero: transparente, texto branco, sem border
    - Ao scrollar: background rgba(10,0,30,0.8), backdrop-blur(20px), border 1px solid rgba(155,92,246,0.3), box-shadow 0 0 30px rgba(155,92,246,0.15)
  Links: AVRAHAM (logo + ícone ▶ roxo), Serviços, Metodologia, Clientes, Preços
  CTA Button: "Falar com a equipe" — fundo #9B5CF6, hover: scale(1.04) + glow roxo
  Micro-interação: cada link tem uma linha inferior que desliza da esquerda ao hover (transform: scaleX)

B. HERO SECTION (O Universo é o Limite)

  Layout: 100dvh. Fundo preto com gradiente Cosmos:
    background: radial-gradient(ellipse at 70% 40%, #3D1F6E 0%, #000000 70%)
  Partículas: canvas com estrelas animadas em parallax suave
  Glow lateral esquerdo: roxo neon em radial-gradient

  Astronauta 3D:
    Posição: lado direito, ~55% da tela, grande, parcialmente cortado pela borda
    Animação: floating lento com CSS keyframes (translateY -16px → 16px, 6s ease-in-out infinite)
    Iluminação: filter drop-shadow(0 0 40px rgba(155,92,246,0.8))
    Usar imagem: https://images.unsplash.com/photo-1446776811953-b23d57bd21aa (cosmos de fundo)
    Sobrepor silhueta de astronauta via CSS masking ou usar: https://images.unsplash.com/photo-1614728894747-a83421e2b9c9

  Conteúdo (bottom-left, ~40% da largura):
    Tag pill: "Agência Digital" — fundo rgba(155,92,246,0.2), border #9B5CF6, texto lilás
    Headline: "Diagnosticamos." (Space Grotesk 900, ~7rem, branco)
                "Planejamos." (Space Grotesk 900, ~7rem, branco)
                "Expandimos." (Space Grotesk 900, ~7rem, #9B5CF6 com text-shadow glow)
    Subheadline: "Automação. IA. WhatsApp. Tráfego. Branding." — Inter, tracking largo, branco 60%
    Métricas inline: "R$ 42M+ gerados · 500+ clientes · 4+ países" — monospace, roxo claro
    CTA Primário: "Começar agora" — ticket pill, fundo #9B5CF6, overflow-hidden com sliding layer roxo escuro
    CTA Secundário: "Ver cases →" — ghost, border rgba(255,255,255,0.3)

  Animação GSAP:
    gsap.context() no useEffect
    Stagger fade-up (y: 40 → 0, opacity: 0 → 1, stagger: 0.12s) para tag, headline (cada linha), sub, métricas, CTAs
    Astronauta: fade-in + scale(0.92 → 1) com delay 0.6s

C. MARQUEE / CLIENTES (O Rastro da Missão)

  Faixa horizontal com scroll infinito (CSS animation: translateX loop).
  Dois itens intercalados:
    1. Logos de clientes em branco/cinza (opacity 0.5, hover: opacity 1 + scale 1.05):
       Neymar Jr. Edutech · Z-API · LOOVI · TFlow · GPT Maker · devz app · Suprema Gaming · Florida Rental Car · DaleÔ Cafeteria · Vem Brincar · Super Cacheta · Global Shift Grabber
    2. Separador: estrela ✦ em #9B5CF6
  Background: preto com linha superior/inferior em 1px solid rgba(255,255,255,0.06)
  Velocidade: 40s linear infinite (segunda fileira reversa)

D. SERVIÇOS (O Arsenal da Missão)

  Título da seção:
    Tag pill: "Serviços"
    "O que fazemos" (Space Grotesk 800, ~4rem, branco)
    "para você crescer" (Space Grotesk 400, tracking largo, branco 60%)

  Grid: 3 colunas × 2 linhas em desktop, 1 coluna em mobile

  Cada card = Ticket Glassmorphism com:
    Ícone Lucide React (color: #9B5CF6, size: 28)
    Tag pill no topo (ex: "Automação", "IA", "Tráfego")
    Título bold branco
    Descrição branco 60%, 14px
    Estrela decorativa ✦ no canto inferior direito (color: rgba(255,255,255,0.2))
    Hover: border-color → rgba(155,92,246,0.6) + box-shadow glow roxo

  Os 6 cards:
    1. WhatsApp em Escala — Ícone: MessageCircle — "Disparos oficiais e não-oficiais com infraestrutura de contingência. Até 1M+ mensagens com estabilidade total."
    2. Chatbots com IA — Ícone: Bot — "Fluxos conversacionais inteligentes que qualificam, vendem e atendem 24h sem intervenção humana."
    3. CRM & Automação — Ícone: Workflow — "Integração completa com seu CRM. Dados, segmentação, follow-up automático em cada etapa do funil."
    4. Tráfego Pago — Ícone: TrendingUp — "Google, Meta e plataformas nativas. Campanhas orientadas a dados com otimização contínua de ROAS."
    5. Branding Sensorial — Ícone: Sparkles — "Identidade visual que vai além do logo. Uma marca que cria memória, desejo e reconhecimento."
    6. Infraestrutura de Contingência — Ícone: Shield — "Nichos sensíveis. Operações de alto volume. Arquitetura resiliente que não cai quando mais importa."

  Animação: ScrollTrigger — cards entram com stagger fade-up (0.1s por card) quando seção entra no viewport

E. METODOLOGIA (O Protocolo de Missão)

  Background: roxo nebulosa escura — radial-gradient(ellipse at center, #1A0A2E 0%, #000000 80%)
  Glow: superior esquerdo roxo intenso

  Layout: timeline horizontal em desktop / vertical em mobile

  Título:
    "Como operamos" (Space Grotesk 800, branco, ~4rem)
    Subtítulo: "Do diagnóstico à expansão — sem atalhos." (branco 60%, tracking largo)

  4 etapas conectadas por linha pontilhada animada (SVG stroke-dashoffset → 0 com ScrollTrigger):

    Etapa 1 — Imersão
      Ícone: Radar (Lucide)
      Título: "Imersão e Entendimento"
      Itens: Operação atual · Volume real · Gargalos e riscos · Expectativa de crescimento

    Etapa 2 — Diagnóstico
      Ícone: Microscope
      Título: "Diagnóstico Estratégico"
      Itens: Limitações · Pontos de falha · Cenários de resolução

    Etapa 3 — Execução
      Ícone: Rocket
      Título: "Planejamento e Execução"
      Itens: Setup · Automações e IA · Testes e Treinamento

    Etapa 4 — Otimização
      Ícone: BarChart3
      Título: "Monitoramento e Dados"
      Itens: Coleta de dados · Ajustes recorrentes · Relatórios

  Cada card de etapa: ticket glassmorphism, número da etapa em monospace grande (color: rgba(155,92,246,0.2)) como watermark de fundo

  Footer da seção:
    Pills horizontais: "Diagnosticamos · Planejamos · Executamos · Acompanhamos · Otimizamos"
    Background: rgba(155,92,246,0.1), border #9B5CF6, border-radius: 999px

  Astronauta roxo neon flutuando no canto inferior direito (pequeno, decorativo)

F. MANIFESTO (A Filosofia da Expansão)

  Full-width, background #000000 com textura noise intensificada
  Glow lateral direito em rosa magenta #E040FB (20% opacidade)

  Layout centralizado, máximo 800px de largura:

  Tag pill: "Manifesto"

  Tipografia enorme com GSAP SplitText reveal:
    "A medicina moderna pergunta: O que está errado?"
    → "Nós perguntamos: O que está faltando para dominar?"

  Versão AVRAHAM:
    Linha 1: "Outros medem cliques." — Space Grotesk 400, ~3rem, branco 40%
    Linha 2: "Nós medimos" — Space Grotesk 400, ~3rem, branco
    Linha 3: "expansão." — Space Grotesk 900, ~6rem, gradient text: linear-gradient(135deg, #9B5CF6, #E040FB)

    Linha 4: "Outros entregam relatórios." — branco 40%
    Linha 5: "Nós entregamos" — branco
    Linha 6: "resultado." — gradient #9B5CF6 → #E040FB, tamanho enorme

  Animação GSAP:
    ScrollTrigger scrub
    Cada linha: clipPath reveal de baixo para cima (y: 100% → 0) com stagger

  Rodapé do manifesto: "R$ 42.000.000+ em resultados gerados para nossos clientes." — monospace, branco 60%, tracking largo

G. RESULTADOS / CASES (Stellar Archive)

  Sticky stacking cards — GSAP ScrollTrigger
  3 cards full-width (não full-screen, ~80vh cada)

  Stacking Logic: conforme novo card entra em view, o card anterior:
    scale: 0.94
    filter: blur(4px)
    opacity: 0.6
    border-color: rgba(255,255,255,0.04)

  Card 1 — E-commerce & Varejo:
    Background: nebulosa roxa densa
    Número destaque: "500+" — monospace, ~8rem, #9B5CF6 (opacity 0.15 como watermark) + "varejistas atendidos" — branco
    Artifact: grade animada de produtos (SVG grid com pontos que pulsam) — simula painel de métricas de e-commerce
    Descrição: "Em 2021 automatizamos o canal de vendas de 500+ lojas de moda, transformando WhatsApp em máquina previsível de receita."
    Clientes citados: pill badges — Suprema Gaming, DaleÔ Cafeteria, Vem Brincar

  Card 2 — Lançamentos & Infoprodutos:
    Background: preto com glow rosa magenta
    Número destaque: "22+" — "lançamentos em 2024"
    Artifact: EKG waveform SVG animado (path stroke-dashoffset animado, cor #E040FB) — simula pico de vendas
    Descrição: "22 lançamentos de infoprodutos orquestrados em 2024. Da captação ao pós-venda, cada etapa automatizada."
    Clientes: GPT Maker, TFlow, devz app

  Card 3 — Escala & Volume:
    Background: roxo profundo com chains decorativas nos cantos
    Número destaque: "25.000+" — "leads capturados para um único grupo de software"
    Artifact: scanning laser-grid — SVG com linhas horizontais que varrem uma grade de pontos (verde → roxo), simula captura de leads
    Descrição: "Em uma única operação, entregamos 25 mil leads qualificados via WhatsApp para um grupo de software em 2022."
    Clientes: Z-API, LOOVI, Neymar Jr. Edutech

H. PREÇOS (Tabela de Disparos)

  Background: preto com glow roxo superior esquerdo

  Título:
    Tag pill: "Infraestrutura"
    "Disparos Oficiais" (bold, branco, ~4rem)
    "API Oficial WhatsApp · Preços por volume" (branco 60%, tracking largo)

  Tabela em glassmorphism escuro (NÃO fundo branco):
    Container ticket: ~70% da largura, centralizado
    Header da tabela: "Volume" | "Preço por disparo" — branco bold, fundo rgba(155,92,246,0.15)
    Linhas alternadas: rgba(255,255,255,0.02) e rgba(255,255,255,0.05)
    Divisórias: 1px solid rgba(255,255,255,0.06)
    Texto: branco regular
    Coluna de preço: monospace, #9B5CF6, bold
    Linha hover: background rgba(155,92,246,0.1) com transição

  Dados reais:
    Até 10.000       → R$ 0,50
    10.000–30.000    → R$ 0,35
    30.000–100.000   → R$ 0,32
    100.000–300.000  → R$ 0,28
    300.000–500.000  → R$ 0,26
    500.000–1M       → R$ 0,25
    Acima de 1M      → R$ 0,21

  Destaque: última linha (Acima de 1M) com border-left 3px solid #9B5CF6 e badge "Melhor valor"
  Estrela ✦ decorativa: canto inferior direito do container

  Seção secundária abaixo: "BM's de API Oficial" — segunda tabela menor com os dados reais de parceiros

  CTA abaixo das tabelas: "Calcular meu volume →" — pill roxo com sliding layer

I. MEMBERSHIP / PLANOS (Missões Disponíveis)

  3 cards lado a lado (em ticket format)
  Card do meio ("Performance") em destaque: fundo nebulosa roxa, border glow #9B5CF6, scale(1.04) permanente

  Plano Starter (esquerda):
    Badge: "Starter"
    Preço: "Sob consulta"
    Inclui: WhatsApp automation básico · Chatbot simples · Relatório mensal
    Não inclui: Infraestrutura de contingência · Campanhas de tráfego
    CTA: "Solicitar proposta" — ghost border

  Plano Performance (centro — DESTAQUE):
    Badge: "Performance" — pill #9B5CF6
    Preço: "Sob consulta"
    Tag: "Mais escolhido" — rosa magenta
    Inclui: WhatsApp em escala · Chatbot IA · CRM integrado · Tráfego pago · Relatório semanal · Suporte prioritário
    CTA: "Falar com a equipe" — fundo #9B5CF6, hover: glow intenso

  Plano Enterprise (direita):
    Badge: "Enterprise"
    Preço: "Sob consulta"
    Inclui: Tudo do Performance · Infraestrutura de contingência · Equipe dedicada · SLA garantido · BM's de API oficial
    CTA: "Contato direto" — ghost border

J. FOOTER (Centro de Controle)

  Background: #000000 com rounded-t-[4rem], border-top: 1px solid rgba(155,92,246,0.2)
  Glow: superior central em roxo difuso

  Layout 4 colunas:
    Col 1 — Logo + tagline:
      Logo "AVRAHAM Digital" (bold + ícone ▶ roxo)
      "Diagnosticamos. Planejamos. Expandimos."
      Status indicator: "Sistema Operacional" com pulsing dot verde + "Uptime 99.9%"

    Col 2 — Serviços:
      WhatsApp em Escala, Chatbots IA, CRM & Automação, Tráfego Pago, Branding, Infraestrutura

    Col 3 — Empresa:
      Sobre, Cases, Metodologia, Clientes, Contato

    Col 4 — Contato:
      WhatsApp: +55 66 99215-0873
      Instagram: @avrahamdigital
      "Agendar reunião →" — link para calendly.com/higorplens
      CNPJ: 48.313.072/0001-15

  Bottom bar: linha divisória + "© 2024 AVRAHAM Digital. Todos os direitos reservados." + link do site
  Estrela ✦ decorativa: canto inferior direito

---

3. TECHNICAL REQUIREMENTS

Tech Stack: React 19, Tailwind CSS v4, GSAP 3 (com ScrollTrigger + SplitText), Lucide React

Animation Lifecycle:
  OBRIGATÓRIO: gsap.context() dentro de useEffect para todos os ScrollTriggers
  Cleanup: return () => ctx.revert() em todo useEffect com GSAP
  Canvas de partículas: useRef para o canvas, cleanup no unmount

Ticket Shape (clip-path para os entalhes laterais):
  Implementar via CSS clip-path polygon ou SVG foreignObject
  Alternativa: pseudo-elementos ::before/::after com background #000 e border-radius circular nos lados

Magnetic Buttons:
  onMouseMove: calcular offset relativo ao centro do botão
  transform: translate(x*0.3, y*0.3) no botão inteiro
  Sliding background: position absolute, transform: translateX(-100%) → translateX(0) no hover

Glassmorphism Cards:
  Garantir que o backdrop-filter funcione (parent não pode ter overflow:hidden sem ajuste)
  Fallback: background rgba(30,10,80,0.85) para browsers sem suporte

Estrela ✦ decorativa:
  Componente React puro: <span className="text-white/20 text-2xl select-none">✦</span>
  Posição: absolute, corner específico por seção

Code Quality:
  Sem placeholders. Dados reais de preço, clientes e métricas em todas as seções.
  Mobile-first Tailwind (sm:, md:, lg: breakpoints)
  Acessibilidade: aria-labels nos botões, alt em imagens, role="marquee" na faixa de clientes

---

4. EXECUTION DIRECTIVE

"Não construa um site. Construa uma plataforma de missão. Cada scroll deve parecer uma descida para a órbita — profundo, preciso, inevitável. Cada card de glassmorphism é uma janela para o cosmos da expansão digital. O roxo não é uma cor, é uma frequência. Erradique todo padrão genérico de agência digital. Este site deve fazer o visitante sentir que estão interagindo com a infraestrutura que move os maiores negócios do Brasil."
