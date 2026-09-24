# Avraham Digital — Design System

Official design system for **Avraham Digital**, an intelligence-operations consultancy that builds sales, service, and relationship infrastructure using WhatsApp, Artificial Intelligence, and automation. The brand's visual language follows the **live site**: a **light, off-white command surface** with an **emerald-teal primary** (`#0BBCA2`, sampled from the live buttons/links), a **bright mint accent** (`#00eed0`, reserved for glow/live-status only), a **lavender-purple secondary** (`#7C5C9E`, deepening to `#4b227a`), and a **neutral near-black command context** (`#111114`) for the dark variant. Near-black text, pill buttons, white cards with soft shadows and soft emerald/lavender radial glows. Precision, authority, intelligence, calm and legibility.

## Sources of truth
- **Official visual palette** — neutral dark `#111114`, deep lavender `#4b227a`, emerald-teal `#0BBCA2`, bright mint `#00eed0`, neutral black `#222221` and white `#ffffff`.
- **Official brand assets** — logomark and icon files (PNG: white on dark, black on light, emerald accent on dark).
- **Company brief** — provided in chat: four service fronts (AI & commercial automation; WhatsApp & infrastructure; base acquisition/activation/reactivation; bespoke commercial projects).

> **Theme hierarchy (per user decision):** LIGHT is the canonical default for everything, including the CRM. DARK is an optional command-center mode toggled via `[data-theme="dark"]`.

> No logo/brand-mark file was supplied. The system renders the brand name in display type wherever a mark belongs (see ICONOGRAPHY) — no logo was drawn or reconstructed.

---

## CONTENT FUNDAMENTALS
- **Language:** Brazilian Portuguese (pt-BR). UI labels, copy, and sample data are all in Portuguese.
- **Tone:** technical authority without arrogance. Confident, clear, result-oriented. Voice of an operations center, not a marketing pitch.
- **Person:** speaks to the client as "você / sua operação"; positions Avraham as "nós / a Avraham". States capability, not hype.
- **Casing:** sentence case for headlines and titles. UPPERCASE only for eyebrows, labels, and table headers (tracked `0.12em`).
- **Metrics-led:** copy leans on concrete numbers — "5 mil leads/mês", "3x mais rápido", "200 mil clientes na base". Numbers use tabular figures (`.num`).
- **CTAs:** action verbs — "Agendar diagnóstico", "Ver soluções", "Reativar base".
- **The sales distinction (core message):** *what we sell* = AI, WhatsApp, automation, infrastructure, campaigns; *what we deliver* = capacity to serve more, sell more, and operate at scale without growing headcount proportionally.
- **No emoji as icons** (use the icon system). **No em dash** in copy — use "-" or restructure. Emoji never appear in the interface.
- **Examples:** *"A Avraham cria infraestrutura de vendas, atendimento e relacionamento usando WhatsApp, Inteligência Artificial e automação."* · eyebrow: *"COMO ENTREGAMOS"* · pill: *"IA 24/7 para não deixar lead sem resposta."*

## VISUAL FOUNDATIONS
- **Colors:** off-white page `--bg #F7F6F5`; white cards `--bg2 #FFFFFF`; sunken `--surface-deep #EFEEEC`. **Emerald `#0BBCA2` is primary** (CTAs, links and icon accents); **bright mint `#00eed0` is reserved for glow/live-status**, never buttons; **lavender `#7C5C9E` / deep purple `#4b227a` are secondary**; neutral dark `#111114` is the command context; neutral text `#222221`. Amber `#E8A13A` warning, coral `#F0555B` alert. Text tones `--t1 #111114` (near-black) → `--t4 #A9AAB0`. Dark command-center variant under `[data-theme="dark"]` uses neutral near-black surfaces with mint and lavender accents. The `--cyan-*` variable names are historical compatibility aliases for the emerald scale.
- **Type:** Plus Jakarta Sans (300–800) for everything — display, UI, body, buttons, labels — matching the live site (one geometric-humanist sans at different weights). Display/headlines run heavy (800). Numbers use tabular figures. Scale classes: `.h-disp .h1 .h2 .h3 .body-lg .body-md .label .eyebrow`.
- **Spacing:** strict 8px base (`--sp-1`…`--sp-16`), `--sp-section 120px` between sections. Never arbitrary pixels.
- **Backgrounds:** the public brand uses soft **emerald/purple radial glows** (`--grad-command`, `--grad-halo`) on off-white — not a grid. The **60px command grid** (`.grid-bg`) is an opt-in motif reserved for the dark command-center mode. No hand-drawn illustration — real design or placeholders only.
- **Cards:** white (`--surface-card`) with a soft downward shadow (`--shadow-card`) and 1px hairline (`--gbo`), radius `--rc 20px`. Hover lifts `-4px` / raises the shadow. Tinted variants: mint (`--gradient-card-emerald`, emerald border) and lavender (`--gradient-card-lavender`, purple border) for metrics/methodology. `.glass` is a white acrylic (translucent + blur) used for nav/topbar overlays.
- **Bracket accent:** a floating pill bar inset from the card edges (`.bracket`) replaces the legacy straight `border-left` accent. Never use a plain colored left border.
- **Gradients:** the five-step sequence flows **emerald → bright mint → purple** (`--grad-step-1..5`) for methodology/journey/process; `--grad-flow` is the continuous emerald-to-purple version.
- **Motion:** `--ease-out: cubic-bezier(.22,1,.36,1)`; durations 200/220/300/700ms. Subtle: fades, `-4px` card lifts, `pulse-dot` on live status. No bounce, no spin. Honors `prefers-reduced-motion`.
- **Hover / press:** hover lifts `-4px` or deepens to `--cyan-600` (emerald hover); press nudges `translateY(1px)`; focus rings use the emerald glow token.
- **Borders & shadows:** 1px glass borders; downward diffuse shadows (`--shadow-card`, `--shadow-raised`); emerald glow on primary/active. `1px` emerald glow-line dividers.
- **Radii:** `--rc 20px` cards, `--rb 12px` buttons/inputs, `--r-pill 999px` chips/round buttons.
- **Transparency & blur:** used on nav, cards, and overlays via `backdrop-filter`; reserved for elevated glass surfaces, not body text.
- **Imagery vibe:** clean, bright, technical — emerald/mint and lavender on off-white. The dark mode reads as a cool greenish command center.

## ICONOGRAPHY
- **React components** wrap the **Lucide** icon set via the CDN sprite (`Icon` component → `<i data-lucide="…">`). Stroke `1.75`. This is the icon system for all JSX components and UI kits.
- **Static HTML / marketing** foundations use **Material Symbols Rounded** (class `.mat`), loaded from Google Fonts and declared in `tokens/fonts.css`. Both are stroke/rounded systems that read consistently.
- **Never** emoji, and never hand-rolled decorative SVG for icons. WhatsApp is represented with its brand green `#25D366` behind a `message-circle` glyph.
- Logo assets uploaded as PNGs (white on dark, black on light, emerald accent). SVG files in `uploads/` were corrupt and discarded. Wherever a mark belongs, render the logo from the PNG or ask the user for vector SVGs to integrate directly.

---

## Components (`components/`, namespace `AvrahamDesignSystem_609133`)
25 reusable React primitives, grouped by concern. All consume CSS custom properties and Lucide icons; none re-implement each other's styling.

**core/** — `Badge`, `Button`, `Card`, `Eyebrow`, `Icon`, `IconButton`, `IconTile`, `Pill`, `SectionHeading`
**data/** — `Avatar`, `AvatarGroup`, `DataTable`, `ProgressBar`, `ScoreRing`, `StatTile`
**forms/** — `Input`, `Select`, `Tabs`, `Toggle`
**patterns/** — `AchievementBadge`, `ChatMessage`, `ChecklistItem`, `KanbanCard`, `NumberedCard`, `SidebarNav`, `SolutionCard`

Each directory carries a `<group>.card.html` specimen (tagged `@dsCard group="Components"`). Each component has a sibling `.d.ts` (props contract) and `.prompt.md` (what/when + usage).

## UI kits (`ui_kits/`)
- **crm/** — Avraham CRM command center: a navigable multi-screen recreation (Dashboard, Funil/pipeline, Conversas/shared inbox, Instâncias WhatsApp, Gamificação). See `ui_kits/crm/README.md`. `index.html` is the interactive click-through.

## Foundations (`foundation/`)
Specimen cards for the Design System tab — Colors (primary, surfaces, gradients, glass), Type (scale, labels), Spacing (base scale, radii/bracket), Brand (command grid, wordmark).

## Tokens (`tokens/`)
`styles.css` (root) imports, in order: `fonts.css`, `colors.css`, `typography.css`, `compat.css`, `spacing.css`, `radii.css`, `effects.css`, `motion.css`, `base.css`. `compat.css` maps the components' earlier token names onto the official Astraeus Command palette.

## Root index / manifest
- `styles.css` — consumer entry point (import lines only).
- `thumbnail.html` — homepage tile.
- `SKILL.md` — Agent-Skills front matter for Claude Code use.
- `readme.md` — this file.
- `tokens/`, `components/`, `foundation/`, `ui_kits/`, `assets/`, `uploads/`.

## Intentional additions
The full component inventory was inherited from the existing project (25 primitives) and matches the CRM's needs; no families were invented beyond it. `Icon` wraps Lucide for the glyph set. `AvatarGroup` ships in `Avatar.jsx` as a paired export.

## Caveats
- **No logo file** — the live site has an AVRAHAM wordmark + headset/robot mark, but no SVG was supplied. The system sets the brand name in type (`Avraham` with an emerald period) until assets arrive. **Please upload the official logo SVGs.**
- Fonts load from Google Fonts CDN (Plus Jakarta Sans + Material Symbols); no binaries vendored.
- Colors were **sampled directly from the live-site screenshots** (emerald `#0BBCA2`, off-white `#F7F6F5`, lavender `#7C5C9E`). Confirm exact brand hexes against your source of truth if you have them.
- Light is the tuned default; the dark command-center variant works but a few fixed status hexes (amber/coral) are optimized for light.
