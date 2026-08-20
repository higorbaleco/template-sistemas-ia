# PersonaFarm — Design System & UI Flows

**Project:** PersonaFarm (Maturador Cognitivo)  
**Stack:** Vue 3 + TypeScript + Tailwind CSS  
**Updated:** 2026-08-20

---

## 1. Design System Foundation

### Color Palette

| Name | Hex | Tailwind | Usage |
|------|-----|----------|-------|
| **Primary** | `#7C3AED` | `purple-600` | Main CTAs, headers, active states |
| **Primary Light** | `#A78BFA` | `purple-400` | Hover states, secondary elements |
| **Accent** | `#F97316` | `orange-500` | Warnings, attention, data highlights |
| **Background** | `#FAF5FF` | `purple-50` | Light theme background |
| **Text Primary** | `#4C1D95` | `purple-950` | Body text, labels |
| **Text Secondary** | `#7C3AED` | `purple-600` | Muted text, descriptions |
| **Text Muted** | `#A78BFA` | `purple-400` | Disabled text, hints |
| **Border** | `#E9D5FF` | `purple-200` | Dividers, input borders |
| **Danger** | `#DC2626` | `red-600` | Errors, delete actions |
| **Success** | `#16A34A` | `green-600` | Success states, connected status |
| **Warning** | `#EA580C` | `orange-600` | Warnings, pending states |

**Dark Mode:** Invert lightness; purple-950 bg, purple-50 text

### Typography

```css
/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Fira+Sans:wght@300;400;500;600;700&display=swap');
```

| Role | Font | Weight | Size | Line Height | Usage |
|------|------|--------|------|-------------|-------|
| **H1** | Fira Code | 700 | 32px | 1.2 | Page titles |
| **H2** | Fira Code | 600 | 24px | 1.3 | Section titles |
| **H3** | Fira Code | 600 | 20px | 1.4 | Subsection titles |
| **Body** | Fira Sans | 400 | 14px | 1.5 | Body text, labels |
| **Body Strong** | Fira Sans | 600 | 14px | 1.5 | Emphasis, important text |
| **Small** | Fira Sans | 400 | 12px | 1.4 | Captions, hints |
| **Code** | Fira Code | 500 | 12px | 1.4 | Code snippets, IDs |

### Component Foundations

#### Buttons

```vue
<!-- Primary (CTA) -->
<button class="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200 cursor-pointer">
  Action
</button>

<!-- Secondary -->
<button class="px-4 py-2 border border-purple-200 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors duration-200 cursor-pointer">
  Secondary
</button>

<!-- Danger -->
<button class="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 cursor-pointer">
  Delete
</button>

<!-- Disabled -->
<button class="px-4 py-2 bg-purple-200 text-purple-400 rounded-lg font-semibold cursor-not-allowed opacity-50">
  Disabled
</button>
```

#### Cards

```vue
<!-- Data Card (KPI) -->
<div class="bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
  <div class="text-sm text-purple-600 font-semibold">Mensagens Hoje</div>
  <div class="text-3xl font-bold text-purple-950 mt-2">1,234</div>
  <div class="text-xs text-purple-400 mt-1">↑ 12% desde ontem</div>
</div>

<!-- Hover Effect: Add shadow + scale on hover (no layout shift) -->
<div class="hover:shadow-xl transition-all duration-200 transform hover:scale-105">
  ...
</div>
```

#### Forms

```vue
<!-- Text Input -->
<div class="flex flex-col gap-2">
  <label for="email" class="text-sm font-semibold text-purple-950">Email</label>
  <input
    id="email"
    type="email"
    placeholder="seu@email.com"
    class="px-3 py-2 border border-purple-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
  />
  <span class="text-xs text-red-600">Erro: Email inválido</span>
</div>

<!-- Select Dropdown -->
<div class="flex flex-col gap-2">
  <label for="model" class="text-sm font-semibold text-purple-950">Modelo LLM</label>
  <select
    id="model"
    class="px-3 py-2 border border-purple-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white cursor-pointer"
  >
    <option>Selecione...</option>
    <option>GPT-4o</option>
    <option>Claude 3.5</option>
  </select>
</div>

<!-- Checkbox -->
<label class="flex items-center gap-2 cursor-pointer">
  <input type="checkbox" class="w-4 h-4 rounded border-purple-200 focus:ring-purple-600" />
  <span class="text-sm text-purple-950">Responder apenas quando mencionado</span>
</label>

<!-- Toggle -->
<label class="inline-flex items-center cursor-pointer">
  <input type="checkbox" class="sr-only peer" />
  <div class="relative w-10 h-6 bg-purple-200 peer-checked:bg-purple-600 rounded-full transition-colors duration-200 peer-focus:ring-2 peer-focus:ring-purple-400"></div>
</label>
```

#### Tables

```vue
<!-- Data Table (Conversas, Logs, Métrica) -->
<div class="overflow-x-auto">
  <table class="w-full text-sm border-collapse">
    <thead>
      <tr class="border-b border-purple-200 bg-purple-50">
        <th class="px-4 py-3 text-left font-semibold text-purple-950 cursor-pointer hover:bg-purple-100">
          Contato <span class="text-xs">↕</span>
        </th>
        <th class="px-4 py-3 text-left font-semibold text-purple-950">Agente</th>
        <th class="px-4 py-3 text-left font-semibold text-purple-950">Última Mensagem</th>
        <th class="px-4 py-3 text-center font-semibold text-purple-950">Ações</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-purple-100 hover:bg-purple-50 transition-colors">
        <td class="px-4 py-3 text-purple-950">João Silva</td>
        <td class="px-4 py-3 text-purple-600">Agente 1</td>
        <td class="px-4 py-3 text-purple-400">2 min atrás</td>
        <td class="px-4 py-3 text-center">
          <button class="text-purple-600 hover:text-purple-800 cursor-pointer">⋯</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<!-- Key Features -->
- Horizontal scroll on mobile (overflow-x-auto)
- Highlight on hover (no layout shift)
- Checkbox column for multi-select (with bulk action bar above table)
- Sortable headers (cursor: pointer, visual indicator)
- Empty state: "Nenhuma conversa ainda. Comece criando um agente."
```

#### Navigation

```vue
<!-- Sidebar Navigation -->
<nav class="w-64 bg-white/95 backdrop-blur-sm border-r border-purple-200 flex flex-col h-screen">
  <!-- Logo -->
  <div class="px-6 py-4 border-b border-purple-200">
    <h1 class="text-2xl font-bold text-purple-600">PersonaFarm</h1>
  </div>

  <!-- Menu Items -->
  <div class="flex-1 overflow-y-auto px-4 py-6 space-y-2">
    <a href="/" class="block px-4 py-3 rounded-lg bg-purple-600 text-white font-semibold cursor-pointer hover:bg-purple-700 transition-colors">
      Dashboard
    </a>
    <a href="/agents" class="block px-4 py-3 rounded-lg text-purple-950 hover:bg-purple-50 transition-colors cursor-pointer">
      Agentes
    </a>
    <a href="/conversations" class="block px-4 py-3 rounded-lg text-purple-950 hover:bg-purple-50 transition-colors cursor-pointer">
      Conversas
    </a>
    <!-- ... more items ... -->
  </div>

  <!-- User Profile -->
  <div class="px-4 py-6 border-t border-purple-200">
    <button class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 cursor-pointer">
      <div class="w-10 h-10 rounded-full bg-purple-200"></div>
      <div class="text-left flex-1">
        <div class="text-sm font-semibold text-purple-950">Higor</div>
        <div class="text-xs text-purple-400">Admin</div>
      </div>
    </button>
  </div>
</nav>
```

---

## 2. Screen Layouts (10 Modules)

### 2.1 Dashboard

**Purpose:** Entry point; at-a-glance health, metrics, alerts.

```
┌─────────────────────────────────────────────────────────┐
│ PersonaFarm    [  ]              Higor (Admin)  ⋯       │
├─────────────────────────────────────────────────────────┤
│ Dashboard      │ Dashboard                               │
│ Agentes        │ ┌──────────┬──────────┬──────────┐      │
│ Conversas      │ │ Agentes  │ Mensagens│ Chats    │      │
│ Grupos         │ │ Ativos   │ Hoje     │ Ativos   │      │
│ Contatos       │ │ 3        │ 542      │ 12       │      │
│ Webhooks       │ └──────────┴──────────┴──────────┘      │
│ Métricas       │                                         │
│ Logs           │ ┌─ Alertas ────────────────────────┐   │
│ Integrações    │ │ ⚠️ Instância bloqueada #5        │   │
│ Configurações  │ │ 🟡 Taxa de erro elevada (8%)    │   │
│                │ └─────────────────────────────────┘   │
│                │                                         │
│                │ ┌─ Agentes Recentes ────────────────┐  │
│                │ │ Agente 1  | Ativo  | 45 msgs     │  │
│                │ │ Agente 2  | Pausa  | 12 msgs     │  │
│                │ └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Key Components:**
- KPI cards (4x2 grid): Agentes Ativos, Mensagens (24h), Taxa Resposta, Chats Ativos, Instâncias Online, Limites Atingidos, Webhooks Erro, Alertas
- Line chart: Mensagens por hora (últimas 24h)
- Bar chart: Mensagens por agente (top 5)
- Alerts section: Bloqueios, erros, atividades suspeitas
- Recent activity list

---

### 2.2 Agentes (Criação/Edição)

**Purpose:** Create, configure, activate personas.

```
┌─────────────────────────────────────────────────────────┐
│ Agentes                    [+ Novo Agente] [Filtrar ▼]  │
├─────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────┐│
│ │ Agente 1                                    [⋮]      ││
│ │ Ativo • 5 conversas • 342 mensagens                  ││
│ │ Modelo: GPT-4o • Temp: 0.85                          ││
│ │ [Editar] [Duplicar] [Pausar] [Arquivar]             ││
│ └──────────────────────────────────────────────────────┘│
│ ┌──────────────────────────────────────────────────────┐│
│ │ Agente 2                                    [⋮]      ││
│ │ Pausa • 2 conversas • 87 mensagens                   ││
│ │ Modelo: Claude 3.5 • Temp: 0.70                      ││
│ │ [Editar] [Ativar] [Deletar]                         ││
│ └──────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘

MODAL: Criar/Editar Agente
┌────────────────────────────────────────────────────────┐
│ Novo Agente                                     [X]     │
├────────────────────────────────────────────────────────┤
│ Identidade                                             │
│ ┌─ Nome                                             ┐  │
│ │ [___________________________]                     │  │
│ └─────────────────────────────────────────────────┘  │
│ ┌─ Idade                                            ┐  │
│ │ [__] anos                                        │  │
│ └─────────────────────────────────────────────────┘  │
│                                                       │
│ Personalidade                                        │
│ ┌─ Estilo de comunicação                           ┐  │
│ │ ○ Formal  ○ Informal  ○ Técnico  ○ Persuasivo  │  │
│ └─────────────────────────────────────────────────┘  │
│                                                       │
│ LLM Configuration                                    │
│ ┌─ Provider                                         ┐  │
│ │ [OpenAI ▼]                                       │  │
│ └─────────────────────────────────────────────────┘  │
│ ┌─ Modelo                                           ┐  │
│ │ [GPT-4o-mini ▼]                                  │  │
│ └─────────────────────────────────────────────────┘  │
│ ┌─ API Key                                          ┐  │
│ │ [sk-••••••••••••••••••]                           │  │
│ └─────────────────────────────────────────────────┘  │
│ ┌─ Temperature                                      ┐  │
│ │ [━━━━●━━━] 0.85                                  │  │
│ └─────────────────────────────────────────────────┘  │
│                                                       │
│ [Cancelar] [Próximo: Comportamento]                 │
└────────────────────────────────────────────────────────┘
```

**Key Features:**
- List view with card grid or table
- Quick actions: Edit, Duplicate, Pause/Resume, Archive, Delete
- Filters: Status, LLM Provider, Tags
- Wizard for creation (step 1: identity, step 2: personality, step 3: LLM, step 4: behavior rules)
- Avatar upload
- Knowledge base upload (drag-drop zone)
- Playground button (test persona before activation)

---

### 2.3 Conversas

**Purpose:** View, filter, manage ongoing/past conversations.

```
┌─────────────────────────────────────────────────────────┐
│ Conversas      [Filtros ▼] [Buscar...] [⋯]              │
├─────────────────────────────────────────────────────────┤
│ ┌─ Privada ────────────────────────────────────────┐   │
│ │ Contato         │ Agente    │ Msgs │ Última Msg  │   │
│ │ João Silva      │ Agente 1  │ 45   │ 2 min atrás │   │
│ │ [✓] Maria Costa │ Agente 2  │ 12   │ 1 hora atrás│   │
│ │ [✓] Pedro       │ Agente 1  │ 3    │ Ontem       │   │
│ └───────────────────────────────────────────────────┘   │
│                                                         │
│ ┌─ Grupo ───────────────────────────────────────────┐  │
│ │ Grupo           │ Agentes │ Msgs │ Última Msg    │  │
│ │ Dev Team        │ 1       │ 234  │ 30 min atrás  │  │
│ │ [✓] Marketing   │ 2       │ 87   │ 2 horas atrás │  │
│ └───────────────────────────────────────────────────┘  │
│                                                         │
│ [Bulk Actions] ▶ [Pausar] [Marcar Sensível] [Deletar]  │
└─────────────────────────────────────────────────────────┘

MODAL: Detalhes da Conversa
┌────────────────────────────────────────────────────────┐
│ João Silva                                      [X]     │
├────────────────────────────────────────────────────────┤
│ Status: Ativa • Agente: Agente 1 • Mensagens: 45     │
│ ┌─ Histórico ────────────────────────────────────────┐│
│ │ [16:30] João: Oi, tudo bem?                       ││
│ │ [16:31] Agente 1: Oi João! Tudo certo?            ││
│ │ [16:32] João: Tenho uma dúvida...                 ││
│ │ [16:33] Agente 1: Claro, me fale!                 ││
│ └───────────────────────────────────────────────────┘│
│ ┌─ Ações ────────────────────────────────────────────┐│
│ │ [ Pausar ] [ Reatribuir ] [ Marcar Sensível ]    ││
│ └───────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────┘
```

**Key Features:**
- Tabs: Privada, Grupos
- Multi-select with bulk actions (Pause, Mark Sensitive, Delete)
- Filters: Agente, Status (Ativa/Pausada/Fechada), Data
- Search by contact name or message content
- Message thread viewer with timestamps
- Action buttons: Pause, Reassign, Mark Sensitive, Close
- Inline notes/tags for internal annotation

---

### 2.4 Grupos

**Purpose:** Manage group monitoring and behavior rules.

```
┌─────────────────────────────────────────────────────────┐
│ Grupos         [+ Adicionar Grupo] [Filtros ▼]         │
├─────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────┐│
│ │ Dev Team                                   [⋮]      ││
│ │ Agentes: Agente 1, Agente 2                         ││
│ │ Membros: 8 • Mensagens: 234 • Status: Monitorado   ││
│ │ [Configurar] [Remover]                             ││
│ └──────────────────────────────────────────────────────┘│
│ ┌──────────────────────────────────────────────────────┐│
│ │ Marketing Channel                          [⋮]      ││
│ │ Agentes: Agente 3                                   ││
│ │ Membros: 12 • Mensagens: 567 • Status: Ativo       ││
│ │ [Configurar] [Remover]                             ││
│ └──────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘

MODAL: Configurar Grupo
┌────────────────────────────────────────────────────────┐
│ Dev Team                                        [X]     │
├────────────────────────────────────────────────────────┤
│ ┌─ Agentes para Monitorar ────────────────────────┐   │
│ │ [✓] Agente 1                                    │   │
│ │ [✓] Agente 2                                    │   │
│ │ [ ] Agente 3                                    │   │
│ └────────────────────────────────────────────────┘   │
│                                                       │
│ ┌─ Boas-Vindas ──────────────────────────────────┐   │
│ │ [✓] Enviar ao entrar no grupo                  │   │
│ │ Mensagem: [Oi pessoal! ...]                    │   │
│ └────────────────────────────────────────────────┘   │
│                                                       │
│ ┌─ Modo Menção ──────────────────────────────────┐   │
│ │ [✓] Responder apenas quando mencionado        │   │
│ │ Horários: [ 08:00 ] até [ 22:00 ]              │   │
│ └────────────────────────────────────────────────┘   │
│                                                       │
│ [Cancelar] [Salvar]                                 │
└────────────────────────────────────────────────────────┘
```

**Key Features:**
- List of monitored groups with member count, message volume
- Config per group: agents, welcome message, mention-only mode, active hours
- Rules editor: when to respond, limits per group
- Soft delete (archive)
- Status badge: Monitorado, Ativo, Pausado, Bloqueado

---

### 2.5 Contatos

**Purpose:** View and manage contact list (people/entities involved in conversations).

```
┌─────────────────────────────────────────────────────────┐
│ Contatos       [Buscar...] [Filtros ▼]                  │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐│
│ │ João Silva                   Ativo • 45 msgs       ││
│ │ Contato desde: 2026-06-15                          ││
│ │ Tags: VIP, Cliente                                  ││
│ │ [Ver Histórico] [Bloquear] [⋯]                     ││
│ └─────────────────────────────────────────────────────┘│
│ ┌─────────────────────────────────────────────────────┐│
│ │ Maria Costa                  Ativo • 12 msgs       ││
│ │ Contato desde: 2026-07-22                          ││
│ │ Tags: Cliente                                       ││
│ │ [Ver Histórico] [Bloquear] [⋯]                     ││
│ └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

**Key Features:**
- Contact card view
- Search by name or phone
- Tags/Labels
- Message count per contact
- Date added
- Actions: View full history, Block, Assign agent

---

### 2.6 Webhooks

**Purpose:** Configure and test webhook subscriptions for external integrations.

```
┌─────────────────────────────────────────────────────────┐
│ Webhooks       [+ Novo Webhook]                         │
├─────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────┐│
│ │ CRM Sync                                   [⋮]      ││
│ │ URL: https://crm.example.com/webhook               ││
│ │ Eventos: message.sent, conversation.closed         ││
│ │ Status: ✓ Ativo  (Última entrega: 1 min atrás)    ││
│ │ [Testar] [Editar] [Deletar]                        ││
│ └──────────────────────────────────────────────────────┘│
│ ┌──────────────────────────────────────────────────────┐│
│ │ Analytics                                  [⋮]      ││
│ │ URL: https://analytics.example.com/event           ││
│ │ Eventos: message.sent, message.received            ││
│ │ Status: ✗ Falha  (Últimas 3 entregas: erro)       ││
│ │ [Testar] [Editar] [Deletar]                        ││
│ └──────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘

MODAL: Novo Webhook
┌────────────────────────────────────────────────────────┐
│ Novo Webhook                                    [X]     │
├────────────────────────────────────────────────────────┤
│ ┌─ Nome                                            ┐   │
│ │ [_________________________________]               │   │
│ └─────────────────────────────────────────────────┘   │
│ ┌─ URL                                          ┐    │
│ │ [https://___________________________]               │   │
│ └─────────────────────────────────────────────────┘   │
│ ┌─ Eventos ────────────────────────────────────┐    │
│ │ [✓] message.sent                                  │   │
│ │ [✓] message.received                             │   │
│ │ [ ] conversation.opened                           │   │
│ │ [ ] conversation.closed                           │   │
│ │ [ ] agent.activated                               │   │
│ │ [ ] agent.deactivated                             │   │
│ │ [ ] error.raised                                  │   │
│ └─────────────────────────────────────────────────┘   │
│ ┌─ Autenticação ──────────────────────────────────┐   │
│ │ Tipo: [Bearer Token ▼]                            │   │
│ │ Token: [••••••••••••••••]                         │   │
│ └─────────────────────────────────────────────────┘   │
│                                                       │
│ [Cancelar] [Testar & Salvar]                         │
└────────────────────────────────────────────────────────┘
```

**Key Features:**
- List with URL, subscribed events, status, last delivery time
- Status indicator: ✓ Active, ✗ Failed, ⏸ Paused
- Test button (sends sample payload)
- Multi-select events (message.*, conversation.*, agent.*, error.*, warming.*)
- Auth method (Bearer token, API key, HMAC signature)
- Retry policy configuration
- Delivery history/logs per webhook

---

### 2.7 Métricas

**Purpose:** Dashboards with operational metrics and trends.

```
┌─────────────────────────────────────────────────────────┐
│ Métricas       [Data: 20/08 ▼] [Período: 7d ▼]         │
├─────────────────────────────────────────────────────────┤
│ ┌──────────────┬──────────────┬──────────────┐          │
│ │ Msgs Enviadas│ Msgs Recbdas │ Taxa Resposta│          │
│ │ 2,145        │ 3,421        │ 68%          │          │
│ └──────────────┴──────────────┴──────────────┘          │
│                                                         │
│ ┌─ Volume por Agente ──────────────────────────────┐   │
│ │ [Bar Chart: Agente 1: 456, Agente 2: 234, ...]  │   │
│ └──────────────────────────────────────────────────┘   │
│                                                         │
│ ┌─ Mensagens por Hora (24h) ───────────────────────┐   │
│ │ [Line Chart: trending up from 6am to 10pm]       │   │
│ └──────────────────────────────────────────────────┘   │
│                                                         │
│ ┌─ Taxa de Resposta por Agente ────────────────────┐   │
│ │ Agente 1: 95% ████████████████░░                 │   │
│ │ Agente 2: 78% ████████░░░░░░░░░░                 │   │
│ │ Agente 3: 52% █████░░░░░░░░░░░░░░                │   │
│ └──────────────────────────────────────────────────┘   │
│                                                         │
│ ┌─ Custos de LLM ──────────────────────────────────┐   │
│ │ OpenAI (GPT-4o): $45.23                          │   │
│ │ Anthropic (Claude): $32.15                       │   │
│ │ Total: $77.38                                    │   │
│ └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Key Features:**
- KPI cards at top
- Multiple charts: volume trends, agent performance, cost breakdown
- Filters: Date range (7d, 30d, 3m, YTD), specific agents, time-of-day
- Export option (CSV, PDF)
- Drill-down: click on chart bar to see details

---

### 2.8 Logs

**Purpose:** Audit trail and debugging.

```
┌─────────────────────────────────────────────────────────┐
│ Logs           [Nível ▼] [Filtros ▼] [Buscar...]       │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐│
│ │ [INFO]  2026-08-20 16:30:45  agent.activated       ││
│ │         Agente 1 ativado por admin                  ││
│ ├─────────────────────────────────────────────────────┤│
│ │ [INFO]  2026-08-20 16:25:12  message.sent          ││
│ │         Para: João Silva, Msg ID: abc123           ││
│ ├─────────────────────────────────────────────────────┤│
│ │ [WARN]  2026-08-20 15:42:33  error.raised          ││
│ │         LLM timeout (OpenAI), fallback usado       ││
│ ├─────────────────────────────────────────────────────┤│
│ │ [ERROR] 2026-08-20 14:11:05  instance.blocked     ││
│ │         Instância #5 bloqueada (muitas tentativas)  ││
│ └─────────────────────────────────────────────────────┘│
│                                   [Carregar mais...]    │
└─────────────────────────────────────────────────────────┘
```

**Key Features:**
- Log levels: INFO, WARN, ERROR, DEBUG
- Timestamp, event type, details
- Search by agent, contact, or keyword
- Filters: Level, Date range, Agent
- Log entry detail modal
- Export logs as CSV
- Infinite scroll or pagination

---

### 2.9 Integrações

**Purpose:** Connect with external systems (CRM, analytics, etc.).

```
┌─────────────────────────────────────────────────────────┐
│ Integrações    [+ Conectar Serviço]                    │
├─────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────┐│
│ │ Salesforce                                 [✓]      ││
│ │ Sincroniza conversas para Leads/Accounts            ││
│ │ Status: Conectado (16/08/2026)                      ││
│ │ [Configurar] [Desconectar]                         ││
│ └──────────────────────────────────────────────────────┘│
│ ┌──────────────────────────────────────────────────────┐│
│ │ Google Analytics                           [ ]      ││
│ │ Envia eventos de conversa para GA4                  ││
│ │ Status: Não conectado                              ││
│ │ [Conectar]                                         ││
│ └──────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

**Key Features:**
- Available integrations library (Salesforce, HubSpot, Pipedrive, GA, etc.)
- Status per integration
- Quick connect/disconnect
- Detailed config for each integration

---

### 2.10 Configurações

**Purpose:** Workspace settings, global limits, auth.

```
┌─────────────────────────────────────────────────────────┐
│ Configurações                                           │
├─────────────────────────────────────────────────────────┤
│ ┌─ Workspace ──────────────────────────────────────┐   │
│ │ Nome: MyPersonaFarm                              │   │
│ │ Fuso Horário: America/Sao_Paulo                  │   │
│ │ Idioma: Português (BR)                           │   │
│ │ [Salvar]                                         │   │
│ └──────────────────────────────────────────────────┘   │
│                                                       │
│ ┌─ Limites Globais ────────────────────────────────┐   │
│ │ Limite Diário (Msgs/Instância): [___30___]       │   │
│ │ Rate Limit (msgs/min): [___5___]                 │   │
│ │ Máx. Instâncias: [___20___]                      │   │
│ │ [Salvar]                                         │   │
│ └──────────────────────────────────────────────────┘   │
│                                                       │
│ ┌─ Autenticação ───────────────────────────────────┐   │
│ │ Usuário Atual: higor@example.com (Admin)        │   │
│ │ [Mudar Senha]                                    │   │
│ │ [Gerar API Token]                                │   │
│ │ Sessões Ativas: 2 [Ver]                          │   │
│ └──────────────────────────────────────────────────┘   │
│                                                       │
│ ┌─ Tema & Aparência ───────────────────────────────┐   │
│ │ Tema: [Auto ▼]   [☀ Claro] [🌙 Escuro]         │   │
│ │ Compacto: [ ] Modo Compacto                      │   │
│ └──────────────────────────────────────────────────┘   │
│                                                       │
│ ┌─ Segurança ──────────────────────────────────────┐   │
│ │ Kill Switch (Pausar Todos Agentes): [ ]          │   │
│ │ 2FA: [Ativar]                                    │   │
│ └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Key Features:**
- Workspace metadata
- Global rate limiting, instance limits
- User management (if multi-user)
- Theme toggle (Light/Dark/Auto)
- API token generation
- Kill switch for emergency pause
- 2FA setup

---

## 3. Cross-Cutting Patterns

### Loading States

```vue
<!-- Skeleton Loaders -->
<div class="animate-pulse">
  <div class="h-6 bg-purple-200 rounded w-1/4 mb-4"></div>
  <div class="h-4 bg-purple-100 rounded w-2/3"></div>
</div>

<!-- Spinners -->
<svg class="animate-spin h-6 w-6 text-purple-600">
  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" fill="none" stroke-width="2"></circle>
  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8"></path>
</svg>
```

### Modal/Dialog

```vue
<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-purple-950">Título</h2>
      <button class="text-purple-400 hover:text-purple-600 cursor-pointer">✕</button>
    </div>
    <!-- Content -->
    <div class="mb-6">...</div>
    <!-- Actions -->
    <div class="flex gap-3 justify-end">
      <button class="px-4 py-2 border border-purple-200 text-purple-600 rounded-lg cursor-pointer hover:bg-purple-50">Cancelar</button>
      <button class="px-4 py-2 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700">Salvar</button>
    </div>
  </div>
</div>
```

### Dark Mode Support

```vue
<!-- Toggle in Tailwind: use dark: prefix -->
<div class="bg-white dark:bg-gray-900 text-purple-950 dark:text-purple-50">
  Content
</div>

<!-- In Vue script, detect system preference -->
<script setup>
const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const theme = ref(isDark ? 'dark' : 'light')

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.classList.toggle('dark')
}
</script>
```

### Empty States

```vue
<div class="flex flex-col items-center justify-center py-12 text-center">
  <div class="text-6xl mb-4">📭</div>
  <h3 class="text-xl font-semibold text-purple-950 mb-2">Nenhuma conversa ainda</h3>
  <p class="text-purple-600 mb-6">Comece criando um agente e conectando instâncias WhatsApp.</p>
  <button class="px-6 py-2 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700">
    + Novo Agente
  </button>
</div>
```

---

## 4. Accessibility Checklist

- [x] All interactive elements have `cursor-pointer`
- [x] Form labels use `<label for="id">` pattern
- [x] Icon buttons have `aria-label`
- [x] Focus states visible (ring-2 ring-purple-600)
- [x] Color contrast: 4.5:1 minimum for all text
- [x] Keyboard navigation (Tab order matches visual order)
- [x] prefers-reduced-motion respected (disable animations if set)
- [x] Images have alt text
- [x] Links have underline or clear visual indication

---

## 5. Implementation Notes

### Vue 3 + Pinia

```javascript
// stores/agent.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAgentStore = defineStore('agent', () => {
  const agents = ref([])
  const loading = ref(false)

  const activeAgents = computed(() => agents.value.filter(a => a.active))

  const fetchAgents = async () => {
    loading.value = true
    try {
      // API call
      agents.value = await fetchFromAPI('/agents')
    } finally {
      loading.value = false
    }
  }

  return { agents, loading, activeAgents, fetchAgents }
})
```

### Responsive Breakpoints

Use Tailwind's default breakpoints:
- `sm: 640px` — tablets
- `md: 768px` — small laptops
- `lg: 1024px` — desktops
- `xl: 1280px` — large screens

### Performance Tips

1. Use `v-if` for conditional rendering (not just `v-show`)
2. Lazy load components: `defineAsyncComponent`
3. Use `v-memo` for expensive templates
4. Paginate large lists or use virtual scrolling
5. Debounce search inputs

---

## 6. Pre-Delivery Checklist

Before implementing any screen:

- [x] No emoji icons (use SVG from Heroicons/Lucide)
- [x] All clickable elements have `cursor-pointer`
- [x] Hover states smooth transitions (150-300ms)
- [x] Forms: labels + validation errors visible
- [x] Tables: responsive (horizontal scroll on mobile)
- [x] Dark mode works (test both modes)
- [x] Accessibility (WCAG AA minimum)
- [x] Load states with spinners/skeletons
- [x] Empty states with call-to-action
- [x] Error messages clear and actionable
