# PAKAS — COMPLEMENTO DA ESPECIFICAÇÃO COMPLETA

**Continuação do documento principal com telas adicionais, roadmap v2-v3 completo e fluxos detalhados**

---

## TELAS ADICIONAIS (continuação)

### Tela 11: Histórico de Visitações

**Path:** `/profile/history`

**Estrutura:**

Background: cream

**A. Header**
- Título: Bricolage 28px "Histórico"
- Subtítulo: Plus Jakarta 13px text-soft "Lugares que você visitou"

**B. Timeline/Lista**

Cada item (card branco border line radius 14 padding 12):
- Data grande: Bricolage 16px "21 de maio"
- Lugar card: foto 40x40, nome 13px, tipo de visita "Reserva confirmada"/"Visualizado", hora "19:30"
- Clickable → /place/:id
- Pode remover com X button

**C. Filtros** (optional)
- Por período (Este mês, Últimos 3 meses, Tudo)
- Por tipo (Reservas, Visualizações, Pesquisas)

**D. Empty State**
"Seu histórico aparece aqui quando você explorar lugares"

---

### Tela 12: Detalhes da Reserva (Modal/Sheet)

**Conteúdo:**
- Foto do lugar (grande 200px)
- Nome + categoria
- Data/hora grandes (Bricolage 20px)
- Status badge: "✓ Confirmada" / "⏳ Pendente"
- Breakdown: "4 adultos + 2 crianças", preferência mesa, obs
- Endereço + botão "Como chegar" (Google Maps)
- Botão "Ligar restaurante" (tel:)
- Botão "Cancelar reserva" (destructive red)
  - Modal confirmar → DELETE reservation, status = "cancelled"

---

### Tela 13: Editar Perfil (Modal)

**Campos:**
- Nome (input, editar)
- E-mail (input, editar)
- Telefone (display only)
- Preferência notificações (toggles):
  - Reservas confirmadas
  - Dicas semanais
  - Ofertas especiais

**Botão:** "Salvar" (mint primary) → PATCH /api/users/:id

---

### Tela 14: Login Modal

**Conteúdo:**
- Título: "Bem-vindo de volta"
- Input: telefone com máscara
- Botão: "Entrar"

**Comportamento:**
- Valida phone em `users` table
- Se existe: salva user_id, vai /home
- Se não: mostra erro com link "Cadastra aqui"

---

### Tela 15: Seletor de Localização (Modal)

**Conteúdo:**
- Título: "Onde você está?"
- Localização atual: "📍 Centro, Maringá (detectado)"
- Botão "Usar essa"
- Divider: "Ou escolha outra"
- Input busca com autocomplete (cidades, bairros, CEPs)
- Botão "Usar GPS" ou "Cancelar"

**Comportamento:**
- Seleciona → salva em user_locations
- Refaz query de restaurantes

---

### Tela 16: Quiz Rápido (Modal)

**Fluxo:** 3 perguntas

1. **Ocasião** (single-select)
2. **Ambiente** (multi-select até 3)
3. **Preço** (single-select ranges)

**Botões:** "Anterior", "Próxima" / "Ver resultados"

**Comportamento:**
- Resultado: naviga /explore?occasion=...&environment=...&price=...
- Fecha modal

---

### Tela 17: Avaliação (Modal)

**Conteúdo:**

1. **Nota Geral** (5 stars clicáveis)
2. **Para que você veio?** (single-select: date, família, amigos, reunião, sozinho)
3. **Aspectos** (cada um com 5 stars):
   - Comida, atmosfera, atendimento, limpeza, preço, ruído
4. **Comentário** (textarea max 500 chars, optional)
5. **Tags** (checkboxes):
   - Gostou: "Comida deliciosa", "Ambiente aconchegante", "Atendimento atencioso"
   - Pontos melhora: "Demora", "Caro", "Barulhento"

**Botões:**
- "Cancelar" (ghost)
- "Enviar avaliação" (mint primary)

**Comportamento:**
- Valida nota geral (obrigatória)
- POST /api/reviews
- Atualiza context_ratings agregadas
- Toast success
- Fecha modal

---

## ROADMAP COMPLETO

### FASE 1: MVP v1 (Atual - Lançamento Base)

#### Feature 1.1: Autenticação & Onboarding

**Descrição:** Fluxo completo entrada, cadastro, 8 perguntas de preferência.

**Componentes:**
- Splash screen
- Formulário cadastro (nome, phone, email, localização)
- 8 Steps quiz (ocasião, ambiente, estrutura, comida, preço, distância, horário, confirmação)
- Validações completas
- Supabase: users + user_preferences tables

**Dependências:**
- Supabase project
- Google Fonts (Bricolage + Plus Jakarta)
- Geolocation API (GPS ou reverse geocode)

**Critério de Sucesso:**
- User novo completa onboarding
- Dados salvos em Supabase
- User autenticado em /home

---

#### Feature 1.2: Discovery & Exploração

**Descrição:** Home, explorar restaurantes, filtros avançados, resultados com match score.

**Componentes:**
- Home (greeting, hero, seções por ocasião/trending/favoritos)
- Explorar com lista de lugares (match badge, foto, avaliação)
- Painel filtros 10 dimensões (ocasião, ambiente, estrutura, comida, preço, distância, horário, avaliação mín, etc)
- Sorting (match, distância, avaliação, preço)
- Infinity scroll
- Estados: loading, empty, error

**Dependências:**
- establishments + establishment_features tables
- filterEngine.ts (lógica match score)
- Mock data 30-50 restaurantes
- Supabase queries

**Critério de Sucesso:**
- User consegue explorar e filtrar lugares
- Match score exibido corretamente
- Resultados atualizados em tempo real ao mudar filtro

---

#### Feature 1.3: Página de Lugar & Cardápio

**Descrição:** Visualização completa de restaurante com detalhes, avaliações por contexto, cardápio.

**Componentes:**
- Cover foto + nav buttons
- Quick info (preço, tempo, distância)
- Match card com explicação
- Seções: estrutura (features grid), ambiente (pills), comida (pills)
- Avaliações por uso (date ★4.2, família ★4.9, etc)
- Cardápio preview (scroll) + "Ver tudo"
- Localização + "Como chegar"
- CTA sticky "Reservar"

**Dependências:**
- establishments + menus + reviews tables
- context_ratings agregadas
- Supabase PostGIS (opcional pra distância)

**Critério de Sucesso:**
- Todos dados do lugar renderizam
- Context ratings mostrados
- Cardápio funcional

---

#### Feature 1.4: Reserva & Confirmação

**Descrição:** Formulário de reserva e fluxo de confirmação com notificação WhatsApp simulada.

**Componentes:**
- Formulário: data, hora (pills), adultos/crianças (counters), preferência mesa, obs
- Defaults inteligentes (hoje, próximo slot, 2 adultos)
- Summary dinâmico footer
- Validações (data/hora obrigatórios)
- Tela sucesso com check animation
- Resumo da reserva

**Dependências:**
- reservations table
- WhatsApp API (simulado console.log v1)
- Toast notifications

**Critério de Sucesso:**
- User consegue fazer reserva
- Dados salvos em Supabase
- Confirmação exibida

---

#### Feature 1.5: Favoritos & Histórico

**Descrição:** Sistema de favoritos e rastreamento de visitações.

**Componentes:**
- Heart toggle em cada card
- Página favoritos (grid de lugares)
- Página histórico (timeline agrupada por data)
- Filtros histórico (período, tipo)

**Dependências:**
- favorites table
- user_history table
- localStorage sync

**Critério de Sucesso:**
- Favoritos toggleam
- Aparecem em /favorites
- Histórico registra ações
- Persist em localStorage + Supabase

---

#### Feature 1.6: Perfil & Configurações

**Descrição:** Página de perfil, preferências aprendidas, configurações.

**Componentes:**
- Avatar grande + nome + cidade
- Cards de acesso (reservas, favoritos, histórico, quiz)
- Preferências aprendidas (read-only)
- Configurações (notificações, localização, privacidade, termos, ajuda, sair)
- Modal editar perfil

**Dependências:**
- user_preferences, localStorage

**Critério de Sucesso:**
- Perfil renderiza com dados corretos
- Configurações funcionam
- Logout limpa session

---

#### Feature 1.7: Localização & Geolocalização

**Descrição:** Detecção GPS, localização manual, cálculo de distâncias.

**Componentes:**
- Geolocalização GPS (Onboarding step 2)
- Seletor localização manual (autocomplete)
- Cálculo distância Haversine
- Filtro distância customizável
- Ordenação por proximidade

**Dependências:**
- Geolocation API
- Reverse geocode (Google Maps ou PostGIS)
- user_locations table

**Critério de Sucesso:**
- GPS funciona ou fallback pra manual
- Distâncias calculadas
- Filtro distância funciona

---

#### Feature 1.8: Match Score & Recomendação

**Descrição:** Algoritmo de compatibilidade lugar-usuário.

**Componentes:**
- filterEngine.ts (calcula score 0-100)
- Exibição: badge visual por range
- Click expand: mostra breakdown dos critérios
- Usa context ratings + preferências user + distância + availability

**Dependências:**
- filterEngine.ts
- context_ratings
- user_preferences

**Critério de Sucesso:**
- Score calcula corretamente
- Exibição por range
- Breakdown detalha critérios

---

#### Feature 1.9: Tabbar & Navegação

**Descrição:** Navegação principal com tabbar 4 itens.

**Componentes:**
- Tabbar (Home, Explore, Favorites, Profile)
- React Router setup com todas as rotas
- Query params pra filtros
- Navegação persistente entre telas

**Dependências:**
- React Router v6
- Lucide icons

**Critério de Sucesso:**
- Todas rotas navegáveis
- Tabbar funciona
- Query params persistem

---

#### Feature 1.10: Visual & UX Completos

**Descrição:** Design system conforme identidade visual, animações, responsividade.

**Componentes:**
- Cores exatas (paleta Pakas)
- Tipografia (Bricolage + Plus Jakarta)
- Ícones Lucide (nunca emoji)
- Animações suaves (fade, slide 200-300ms)
- Responsivo mobile-first
- Estados (loading skeleton, empty, error)
- Toasts & modals

**Dependências:**
- Tailwind CSS
- Lucide React
- Toast library

**Critério de Sucesso:**
- App looks bonito conforme paleta
- Responsivo em mobile/tablet/desktop
- Animações suaves

---

### FASE 2: v2 Features (Pós-MVP)

#### Feature 2.1: Pagamento Integrado

**Descrição:** Checkout Stripe/Mercado Pago, pagamento pré-reserva, split bill.

**Componentes:**
- Tela checkout (/checkout/:reservation_id)
- Stripe Elements (card input)
- Payment Intent creation
- Webhook receiver pra callbacks
- Split bill (opcional)

**Dependências:**
- Stripe SDK
- payments table
- Webhook infrastructure

**Tarefas:**
- Setup Stripe account
- Create payments table
- Integrate SDK
- Webhook handler
- Split bill UI (nice-to-have)

---

#### Feature 2.2: Comanda Digital

**Descrição:** Pedidos no app, integração com PDV.

**Componentes:**
- Tela comanda (/reservations/:id/order)
- Seleção items, counter, observações
- Real-time updates (restaurante vê pedido, user vê status)
- Notificação "Seu pedido está pronto"

**Dependências:**
- orders + order_items tables
- WebSocket/Realtime (Supabase Realtime)
- PDV APIs (Square, iFood, etc - v2.5+)

**Tarefas:**
- Create orders schema
- Realtime subscription setup
- Order status flow
- Notification system
- PDV integration (later)

---

#### Feature 2.3: Painel de Restaurante

**Descrição:** Dashboard para restaurantes gerenciarem reservas, pedidos, cardápio, analytics.

**Componentes:**
- Admin auth (restaurant_accounts + JWT)
- Dashboard overview
- Reservas (confirm/recuse)
- Comanda (pendente/pronto)
- Cardápio (CRUD)
- Analytics (gráficos)

**Dependências:**
- restaurant_accounts table
- role-based access
- JWT auth
- Admin dashboard UI
- WebSocket pra real-time notifs

**Tarefas:**
- Separate admin app ou admin routes
- Role-based middleware
- Dashboard components
- CRUD cardápio
- Analytics charts

---

#### Feature 2.4: Recomendações Inteligentes

**Descrição:** Collaborative filtering + trending algoritmo.

**Componentes:**
- Seção "Recomendado pra você" em Home
- Algoritmo: usuarios similares → seus favoritos → recomenda
- Trending: contagem de reservas/reviews por lugar

**Dependências:**
- recommendations table
- trending_establishments table
- ML pipeline (externo ou custom)
- Job scheduler (pra calcular daily/weekly)

**Tarefas:**
- Create recommendations schema
- ML algorithm (Python script ou Google Cloud ML)
- Job scheduler setup (cron ou GitHub Actions)
- Home UI component

---

#### Feature 2.5: Social Graph

**Descrição:** Seguir amigos, ver atividades, compartilhar lugares.

**Componentes:**
- Follow/unfollow users
- Feed de atividades (Maria reservou em X)
- Share lugar (WhatsApp, Instagram, copiar link)
- Weighted reviews (amigos têm peso maior)

**Dependências:**
- user_follows table
- social_activities table
- Share APIs

**Tarefas:**
- Follow/unfollow logic
- Activity feed UI
- Share button + deeplinks
- Feed algo (weight friend reviews)

---

#### Feature 2.6: Programa de Fidelidade

**Descrição:** Pakas Points, resgate em desconto, tiers (Bronze/Silver/Gold).

**Componentes:**
- Points acumulation (1 ponto por R$10)
- Resgate (100 pontos = R$10 desconto)
- Tier system (3 tiers com bonuses)
- Perfil mostra balance + tier

**Dependências:**
- user_points table
- Pontos calculation em reserva confirmada

**Tarefas:**
- Create user_points schema
- Points logic (add/subtract)
- Tier calculation
- Resgate flow
- UI em perfil + checkout

---

### FASE 3: v3 Features (Long-term)

#### Feature 3.1: Mapa Interativo

**Descrição:** Mapa com pins de restaurantes, filtro por zoom.

**Componentes:**
- Full-screen map (Mapbox/Google Maps)
- User location (azul pin)
- Restaurante pins (mint com ícone categoria)
- Click pin → mini card
- Zoom → busca restaurantes naquele raio
- Filtro overlay (ocasião, distância, preço)

**Dependências:**
- Mapbox SDK
- PostGIS (Supabase extensão)
- Geospatial queries

**Tarefas:**
- Mapbox integration
- PostGIS queries setup
- Map component
- Pin clustering (muitos pins)
- Filter integration

---

#### Feature 3.2: Mesas em Tempo Real

**Descrição:** Ver disponibilidade agora, fila virtual, notificação quando tem mesa.

**Componentes:**
- PDV sync (Square, Toast, etc)
- "Walk-in agora" option na reserva
- "Disponível agora!" notificação
- Fila virtual (join queue)
- SMS/push "Mesa pronta"

**Dependências:**
- table_availability table
- PDV APIs (Square, Toast)
- Push notifications
- Job scheduler (sync a cada 5min)

**Tarefas:**
- PDV integrations
- Table availability schema
- Walk-in flow
- Queue logic
- Notifications

---

#### Feature 3.3: Eventos & Experiências

**Descrição:** Happy hours, eventos especiais, experiências premium (wine pairing, cooking class).

**Componentes:**
- Events listing (com datas, descrição, preço)
- Experiences premium (compra adiantada)
- Badge visual (🎉 Happy hour)
- Notificações 1h antes

**Dependências:**
- events table
- experiences table
- Calendar API

**Tarefas:**
- Create events/experiences schema
- Event listing page
- Booking flow
- Notification scheduling

---

#### Feature 3.4: Marketplace & Publicidade

**Descrição:** Anúncios patrocinados, restaurantes pagam pra estar em destaque.

**Componentes:**
- Sponsored listings ("⭐ Promovido")
- Featured ads (Home)
- Restaurante dashboard (analytics, ROI)

**Dependências:**
- advertisements table
- Stripe pra cobrança
- Analytics dashboard

**Tarefas:**
- Advertisements schema
- Sponsored logic (appear top of results)
- Featured placement
- Analytics dashboard
- Stripe integration

---

#### Feature 3.5: Integrações Externas

**Descrição:** iFood, Uber Eats, Google My Business, delivery sync.

**Componentes:**
- iFood deeplinks ou cardápio sync
- Uber Eats integration
- Google My Business sync (fotos, horário, reviews)
- Delivery badge ("Entrega por iFood")

**Dependências:**
- iFood API
- Uber Eats API
- Google My Business API
- Jobs pra sync

**Tarefas:**
- API integrations
- Deeplink generation
- Delivery badge logic
- Sync jobs (daily)

---

## FLUXOS DETALHADOS DE INTERAÇÃO

### Fluxo A: User Novo (First-Time)

```
1. Abre app → Splash
2. Clica "Começar"
3. Preenche cadastro (nome, phone, email)
   └─ Validações (phone unique check)
   └─ Clica "Próximo"
4. POST /api/users → Supabase
5. Localização (GPS ou manual)
   └─ Clica "Próximo"
6. Responde 8 perguntas (ocasião, ambiente, estrutura, comida, preço, distância, horário, confirmação)
   └─ Cada pergunta salva em state
7. Resumo (editável)
   └─ Clica "Explorar"
8. POST /api/user_preferences → Supabase
9. Salva user_id + preferences em Context/localStorage
10. NavLink(/home)
11. Home renderiza com Trending, Por ocasião, Favoritos
```

---

### Fluxo B: User Existente (Login)

```
1. Splash → "Já tenho conta"
2. Modal login
   └─ Input telefone
   └─ Clica "Entrar"
3. GET /api/users?phone={phone}
   ├─ Se existe: salva user_id, busca preferences, vai /home
   └─ Se não: erro com link "Cadastra aqui"
```

---

### Fluxo C: Explorar & Filtrar

```
1. Home → clica "Por ocasião: Date romântico"
2. NavLink(/explore?occasion=date_romantic)
3. GET /api/establishments?filters={} → lista
4. filterEngine calcula match score pra cada lugar
5. Header mostra: "Date romântico" em chip
6. Clica botão filtro
7. NavLink(/filters)
8. Adiciona filtros: "Tranquilo" + "Mesa íntima" + "R$60-100"
9. Footer: "Ver 8 lugares" (dinâmico)
10. Clica botão
11. NavLink(/explore?occasion=date&environment=quiet&price=60-100)
12. Lista refaz com novos filtros
13. Clica em lugar
14. NavLink(/place/123456)
```

---

### Fluxo D: Reserva Completa

```
1. /place/:id → clica "Reservar mesa"
2. /place/:id/reserve
3. Formulário renderiza com defaults
   └─ Quando: "Hoje" (default)
   └─ Horário: "19:30" (próximo slot, default)
   └─ Adultos: 2 (default), Crianças: 0
4. User ajusta
   └─ Horário: "20:00"
   └─ Crianças: +2 = total 4 pessoas
   └─ Preferência: "Mesa de canto"
   └─ Obs: "Aniversário da pequena!"
5. Summary footer: "Mesa pra 4 pessoas hoje às 20:00"
6. Clica "Confirmar reserva"
7. Validações passam (horário + pessoas ✓)
8. POST /api/reservations → cria com status "pending"
9. Simula WhatsApp (v1): console.log + toast
10. NavLink(/reservations/success)
11. Check animation + resumo
12. Clica "Voltar pra Home"
13. NavLink(/home)
```

---

### Fluxo E: Avaliação

```
1. /reservations → clica em card com status "Realizada"
2. Modal avaliação abre
3. User seleciona:
   └─ ⭐⭐⭐⭐⭐ (5)
   └─ Ocasião: "Família"
   └─ Aspectos: comida 5, ambiente 4, atendimento 5, limpeza 5, preço 3, ruído 2
   └─ Tags: "Crianças adoraram", "Caro"
   └─ Comentário: "Maravilhoso"
4. Clica "Enviar avaliação"
5. POST /api/reviews → cria review
6. Calcula novos context_ratings agregados
7. INSERT/UPDATE em context_ratings table
8. Toast: "Obrigado!"
9. Fecha modal
10. /place/:id agora mostra nova avaliação em "O que dizem"
```

---

### Fluxo F: Favoritar

```
1. /explore → vê card
2. Clica heart (outline)
3. Imediatamente muda pra filled (feedback visual)
4. POST /api/favorites → INSERT
5. /favorites → lugar aparece
6. Clica heart filled de novo
7. DELETE /api/favorites
8. Heart volta outline
9. Favorito some de /favorites
```

---

## DEPENDÊNCIAS TÉCNICAS FINAIS

### Supabase Setup

**Extensões:**
- uuid-ossp (UUIDs)
- postgis (geospatial queries v3+)

**Autenticação:**
- v1: Manual (check phone)
- v2+: Supabase Auth (OTP/SMS)

**Realtime:**
- Supabase Realtime (WebSocket) pra updates live (v2+ comanda, reservas)

**Storage Buckets:**
- establishment-images (fotos dos lugares)
- menu-images (fotos dos pratos)
- user-avatars (fotos de perfil)

---

### APIs Externas

**v1:**
- Google Fonts (Bricolage, Plus Jakarta)
- Lucide React Icons
- Google Maps API (reverse geocode) ou PostGIS

**v2+:**
- Stripe / Mercado Pago (pagamento)
- WhatsApp Business API (notificações reais)
- SendGrid / Twilio (email/SMS)
- Google Cloud ML (recomendações)
- Sentry (error tracking)
- Mixpanel / Amplitude (analytics)

**v3:**
- Mapbox / Google Maps SDK (mapa)
- iFood API
- Uber Eats API
- Google My Business API
- Square / Toast API (PDV)

---

### NPM Packages

**Core:**
- react 18+
- react-router-dom 6+
- zustand
- @supabase/supabase-js
- lucide-react

**UI:**
- tailwindcss 3+
- date-fns
- react-calendar
- react-hot-toast

**Utils:**
- axios
- lodash
- classnames

**Build:**
- vite
- eslint / prettier

---

## CHECKLIST MVP v1 COMPLETO

✅ Splash renderiza bonito
✅ Cadastro valida, salva Supabase
✅ 8 steps quiz, progress bar
✅ Home com seções (ocasião, trending, favoritos)
✅ Explore com lista + match score
✅ Filtros funcionam (10 dimensões)
✅ Página lugar completa (cover, match, features, cardápio)
✅ Cardápio funcional
✅ Formulário reserva com defaults
✅ Confirmação + WhatsApp simulado
✅ Favoritos toggleam (localStorage + Supabase)
✅ Histórico registra ações
✅ Perfil + configurações
✅ Tabbar 4 itens navegando
✅ Localização (GPS ou manual)
✅ Match score calcula corretamente
✅ Context ratings em "O que dizem"
✅ Responsivo mobile
✅ Visual conforme paleta exata
✅ 30-50 restaurantes fictícios

---

**DOCUMENTO COMPLETO FINALIZADO**