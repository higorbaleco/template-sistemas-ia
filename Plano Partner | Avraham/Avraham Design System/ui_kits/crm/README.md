# CRM Command Center — UI kit

A navigable, high-fidelity recreation of the **Avraham CRM** — the operational command center clients use to capture, serve, qualify, sell to, and reactivate contacts at scale. Dark-first, glassmorphic, 60px command grid, cyan accent. Built entirely from the design-system component primitives (`window.AvrahamDesignSystem_609133`) and Lucide icons.

## Run
Open `index.html`. `data.js` holds coherent fictional pt-BR data (`window.DB`); `crm.jsx` is the whole app (shell + six screens) in one Babel scope.

## Screens (collapsible sidebar routes)
1. **Dashboard** — greeting, 4 operational KPIs (StatTile), the 5-step operation flow strip (Entrada → Atendimento IA → Qualificação → Agendamento → Vendedor), highlighted deals, and personal tasks.
2. **Funil de vendas** — 5-stage Kanban pipeline (KanbanCard) with funnel Tabs (Comercial / Reativação / Upsell), per-column totals, score rings.
3. **Conversas** — shared WhatsApp inbox: conversation list, live thread (ChatMessage with IA authoring), composer to take over from the AI, and a contact panel with ScoreRing + details.
4. **Instâncias WhatsApp** — official-API vs unofficial number fleet (DataTable), health/throughput stats, and a connect-number panel with QR + API-official toggle.
5. **Gamificação** — level/XP progression, monthly goals (ProgressBar), weekly challenges, achievement grid (AchievementBadge), and team leaderboard including the autonomous IA agent.
6. **Equipe e plano** — member management with roles/permissions + invites (DataTable), plan & payment cards, and profile editing. Internal support widget lives in the sidebar footer.

## Interactions wired
Sidebar navigation, collapse/expand, org switcher, dark/light theme toggle, funnel tabs, conversation selection, sending a message (appends to thread), settings sub-tabs.

## Notes
- Composes primitives only — Button, Badge, Card, StatTile, KanbanCard, ChatMessage, DataTable, Avatar, ScoreRing, ProgressBar, AchievementBadge, Tabs, Toggle, Input, Select, SidebarNav, IconButton, Eyebrow, IconTile. No component styling is re-implemented here.
- Repeated rows are abbreviated (a handful of leads/conversations stand in for the real volume) — this is a kit, not a data-complete app.
- Tagged as both a `@dsCard` (CRM group) and a `@startingPoint` so consumers can seed a project from it.
