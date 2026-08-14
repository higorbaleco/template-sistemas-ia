# Sessão de Refactor — Pakas App
> Registro completo de tudo que foi pedido, decidido e executado

---

## 🗂️ Contexto do Projeto

- **App**: Pakas — descoberta e reserva de restaurantes/bares em Maringá (PT-BR)
- **Stack**: React 19 + Vite + TypeScript + Tailwind v4 + Zustand + React Router v7 + mock API
- **Design**: Mint (#2DD4BF) + Ink (#0B1620) + Cream (#FAFAF7), fontes Bricolage Grotesque (display) + Plus Jakarta Sans (body)
- **Shell mobile**: `max-width: 430px` centralizado, `body` com fundo `#0B1620`
- **Guia visual**: `REF's/Regras visuais.md` — fonte da verdade para cores, tipografia, espaçamento

---

## ✅ O QUE FOI PEDIDO E EXECUTADO

### 1. Refatorar o front-end (planejamento estratégico)

**Pedido:** "Vamos refatorar o front-end"

**Exploração feita:**
- Mapeamento completo da estrutura: páginas, componentes, stores, serviços
- Identificação de 10 problemas de arquitetura e design

**Resultado:** Plano salvo em `/Users/higorplens/.claude/plans/vamos-refatorar-o-front-end-inherited-petal.md` para execução futura (ver seção de pendências abaixo).

---

### 2. UI/UX imediato — margens e dimensionamento

**Pedido:** "Vamos começar só refatorando o UI/UX, colocar margem, dimensionar corretamente o app. Salva o plano para executarmos depois."

**Executado:**

#### `index.html`
- `lang="en"` → `lang="pt-BR"`
- Adicionado `viewport-fit=cover` no viewport meta (sem isso `env(safe-area-inset-*)` não funciona em iOS)

#### `src/index.css`
- Adicionado ao `:root`:
  ```css
  --sat: env(safe-area-inset-top, 0px);
  --sab: env(safe-area-inset-bottom, 0px);
  ```

#### Safe area top em todas as páginas com header
| Página | Antes | Depois |
|--------|-------|--------|
| `Home.tsx` | `pt-6` | `style={{ paddingTop: 'calc(var(--sat) + 24px)' }}` |
| `Explore.tsx` | `pt-4` (sticky) | `style={{ paddingTop: 'calc(var(--sat) + 16px)' }}` |
| `Favorites.tsx` | `pt-6` | `style={{ paddingTop: 'calc(var(--sat) + 24px)' }}` |
| `Profile.tsx` | `pt-6` | `style={{ paddingTop: 'calc(var(--sat) + 24px)' }}` |
| `Reserve.tsx` | `pt-5` | `style={{ paddingTop: 'calc(var(--sat) + 20px)' }}` |

#### `Place.tsx`
- Cover image: `h-[240px]` → `height: calc(240px + var(--sat))` (preenche atrás da notch)
- Nav buttons: `top-3` → `top: calc(var(--sat) + 12px)`
- Botões back/heart: `w-[38px] h-[38px]` → `w-11 h-11` (44px — mínimo de toque)

#### `Splash.tsx`
- Adicionado `paddingTop: 'var(--sat)', paddingBottom: 'var(--sab)'` no wrapper principal

---

### 3. Preview do app

**Pedido:** "Ok executa um novo preview para eu ver tudo que foi ajustado"

**Executado:**
- `npm run dev` iniciado em `http://localhost:5173`
- Aberto no Chrome via `open -a "Google Chrome"`
- Instrução para usar DevTools → Modo mobile → iPhone 14 Pro

---

### 4. Fix crítico do Step1Profile (screenshot mostrando visual péssimo)

**Pedido:** "Olha como ainda está péssimo! /frontend-design /ui-ux-pro-max" (screenshot do step-1)

**Diagnóstico:**
- `Step1Profile.tsx` era o **único** step do onboarding que NÃO usava `OnboardingLayout`
- Faltava: barra de progresso, botão voltar, contador "1 de 9", footer padronizado
- 201 linhas com ~80 linhas duplicando estrutura que o `OnboardingLayout` já entrega
- Botão "Detectar" era outline tímido, city pills sem distinção visual, checkbox nativo browser
- `OnboardingLayout` também não tinha safe-area-top no header sticky

**Executado:**

#### `src/components/onboarding/OnboardingLayout.tsx`
- Header sticky: `pt-4` → `paddingTop: 'calc(var(--sat) + 16px)'`
- Padding lateral: `px-5` → `px-6` (24px) — header, content e footer
- Content area: `pb-32` → `pb-28` (menos espaço morto)
- Back button: `w-10 h-10` → `w-11 h-11` (44px touch target)
- Footer bottom: `max(24px, ...)` → `max(28px, ...)`

#### `src/pages/onboarding/Step1Profile.tsx` — reescrito completo
- Agora usa `<OnboardingLayout step={1} totalSteps={9} ...>`
- Removidos: wrapper manual, header manual, footer manual (80 linhas eliminadas)
- Inputs: `py-3.5` → `py-4` (~56px altura), classe `inputClass` compartilhada para consistência
- Botão "Detectar localização": outline → fundo mint sólido `#2DD4BF`, `py-4`, ícone `size={18}`
- Divisor "ou escolha a cidade" com linha horizontal entre botão e pills
- City pills: `px-3 py-1.5` → `px-5 py-3` (44px+ toque), `text-[14px]`
- Estado "locationSet": card verde com ícone Check `w-8 h-8` e botão "Trocar"
- Checkbox: browser nativo → custom div `w-6 h-6` com Check lucide ao marcar
- Área clicável do checkbox: `py-1` no wrapper button

---

### 5. Segundo preview

**Pedido:** "Atualizou toda doc? Roda novamente o preview"

**Executado:**
- Confirmado dev server rodando (PID 52695 na porta 5173)
- Aberto `http://localhost:5173/onboarding/step-1` no Chrome

---

## 🚧 PENDENTE — Refactor Estratégico (salvo para depois)

### Fase A — Design System / Tokens no Tailwind v4

**O que é:** Hoje as cores e fontes estão como CSS custom properties em `:root` mas **não estão wired no `@theme`** do Tailwind v4. Resultado: componentes usam hex hardcoded (`#2DD4BF`, `#0B1620`, etc.) e `style={{ fontFamily: 'var(--font-display)' }}` inline em vez de classes Tailwind.

**O que fazer:**
- Adicionar bloco `@theme` em `src/index.css` com todos os tokens
- Isso gera utilities: `bg-mint`, `text-ink`, `font-display`, `border-line`, etc.
- Substituir todos os hex hardcoded e inline styles pelas classes geradas
- Deletar `src/App.css` (arquivo vazio)

**Arquivos afetados:** Home, Place, Reserve, PlaceCard, Button, todos os steps de onboarding

---

### Fase B — Primitivas UI Faltantes

Criar em `src/components/ui/`:

| Componente | Propósito |
|------------|-----------|
| `Input.tsx` | Campo com label, placeholder, estado de erro — padroniza os 3 inputs do Step1Profile e outros |
| `Chip.tsx` | Tag clicável selecionado/não selecionado — substitui padrão repetido em filtros e onboarding |
| `Card.tsx` | Wrapper com borda `border-line`, bg cream, radius padrão |

---

### Fase C — Arquitetura de Páginas

#### Home.tsx (165 linhas → orquestrador < 60)
Extrair:
- `src/components/home/HomeHeader.tsx` — avatar, saudação, localização
- `src/components/home/OccasionGrid.tsx` — grid de 6 ocasiões
- `src/components/home/TrendingGrid.tsx` — cards trending 2x2
- `src/components/home/MatchSection.tsx` — seção de melhor match

#### Place.tsx (198 linhas → orquestrador)
Extrair:
- `src/components/place/PlaceHero.tsx` — cover image, badge match, nav buttons
- `src/components/place/PlaceInfo.tsx` — nome, categoria, rating, endereço
- `src/components/place/PlaceActions.tsx` — reservar, favorito, menu
- `src/components/place/PlaceFeatures.tsx` — chips de infraestrutura

#### Onboarding: config-driven (9 steps → 1 componente)
- Criar `src/pages/onboarding/steps.config.ts` — array com definição de cada step (title, field, type, options)
- Criar `src/pages/onboarding/StepPage.tsx` — componente genérico que lê a config e renderiza
- Manter `Step9Summary.tsx` separado (tela de revisão tem lógica própria)
- Deletar `Step1Profile.tsx` … `Step8Time.tsx` após migração

---

### Fase D — Guards e Layout

**`src/App.tsx`:**
- `TabBar` condicional: não renderizar em `/` e `/onboarding/*`
- `ProtectedRoute`: redirecionar para `/onboarding/step-1` se `!isOnboarded`

---

## 📁 Mapa de Arquivos Modificados Nesta Sessão

| Arquivo | O que mudou |
|---------|-------------|
| `index.html` | `lang="pt-BR"`, `viewport-fit=cover` |
| `src/index.css` | `--sat`, `--sab` em `:root` |
| `src/pages/Home.tsx` | Safe area top no header |
| `src/pages/Explore.tsx` | Safe area top no sticky header |
| `src/pages/Favorites.tsx` | Safe area top no header |
| `src/pages/Profile.tsx` | Safe area top no header |
| `src/pages/Reserve.tsx` | Safe area top no header |
| `src/pages/Place.tsx` | Cover height + nav buttons safe area + touch target 44px |
| `src/pages/Splash.tsx` | paddingTop/Bottom com safe area |
| `src/components/onboarding/OnboardingLayout.tsx` | Safe area, px-5→px-6, pb-32→pb-28, back button 44px |
| `src/pages/onboarding/Step1Profile.tsx` | Reescrito: usa OnboardingLayout, polish visual completo |

---

## 🔍 Verificação Rápida

```bash
cd "/Users/higorplens/Antigravity Software/pakas-app/pakas"

# Build limpo
npm run build

# Dev server
npm run dev
# http://localhost:5173/onboarding/step-1 — ver Step 1 igual ao Step 2 visualmente
# DevTools → Cmd+Shift+M → iPhone 14 Pro

# Checar se sobrou hex hardcoded (pendente do refactor estratégico)
grep -rn "#2DD4BF\|#0B1620\|#FAFAF7\|#E8E5DF\|#64748B" src/ --include="*.tsx"

# Checar inline fontFamily (pendente)
grep -rn "fontFamily.*var(--font" src/ --include="*.tsx"
```
