const storageKey = "instaScrapCentral:v2";

const categories = [
  { id: "all", label: "Tudo" },
  { id: "ia", label: "IA" },
  { id: "automation", label: "Automações" },
  { id: "education", label: "Educação" },
  { id: "business", label: "Business" },
  { id: "lifestyle", label: "Lifestyle" },
];

const statuses = [
  { id: "all", label: "Todos" },
  { id: "available", label: "Disponíveis" },
  { id: "partial", label: "Parciais" },
];

const patterns = [
  { code: "A", title: "POV + Absurdo + Crítica", stars: 5, setup: "5-10 min", summary: "Hook claro, escalada e crítica social." },
  { code: "B", title: "Validação + Sátira + Insight", stars: 4, setup: "10-20 min", summary: "Dor real, humor e conclusão útil." },
  { code: "C", title: "Meme Técnico + Desconstrução", stars: 5, setup: "5-15 min", summary: "Mito técnico convertido em demonstração." },
  { code: "D", title: "Análise de Dados + Sátira", stars: 3, setup: "15-30 min", summary: "Número real com comentário e ironia." },
  { code: "E", title: "Absurdo + Religião/Fé", stars: 2, setup: "5-10 min", summary: "Mais específico, mas memorável quando encaixa." },
];

const profiles = [
  { handle: "@igormelloeu", niche: "Venda consultiva", status: "complete", note: "Perfil base para conteúdo de venda." },
  { handle: "@perissejul.ia", niche: "IA & Claude Code", status: "partial", note: "Aplicações práticas de IA." },
  { handle: "@nardini.vaipramais", niche: "Rotina saudável + IA", status: "partial", note: "Rotina e posicionamento." },
  { handle: "@leocostacomediante", niche: "Sátira coach", status: "partial", note: "Crítica à motivação exagerada." },
  { handle: "@rafa.grandi", niche: "Novidades Claude Code", status: "partial", note: "Radar de updates e ferramentas." },
  { handle: "@rodvincenzi", niche: "Perfil referência", status: "partial", note: "Criador de referência para acompanhar." },
  { handle: "@jefprogramador", niche: "Sátira dev + Claude", status: "partial", note: "Humor de desenvolvimento e IA." },
  { handle: "@lucasmendes.cf", niche: "Wellness + pressão", status: "complete", note: "Muito impacto e alto engajamento." },
  { handle: "@umantoniodasilva", niche: "Empresariado real", status: "partial", note: "Empreendedorismo genuíno e direto." },
  { handle: "@davibraga", niche: "Business", status: "complete", note: "2x Best-seller, Forbes Under 30, 5 exits." },
  { handle: "@fred_farialima", niche: "Sátira corporativa", status: "partial", note: "POVs e humor de mercado." },
  { handle: "@brunofragaoficial", niche: "Business", status: "partial", note: "Mais um perfil de referência." },
  { handle: "@arthurpadrao", niche: "Business", status: "partial", note: "Business e posicionamento." },
];

const posts = [
  {
    id: "DbbO8FjtMk3",
    title: "Como transformar seus salvos do Instagram em memória para IA",
    author: "@dfolloni",
    category: "ia",
    status: "available",
    type: "GraphVideo",
    date: "2026-07-30",
    likes: 691,
    comments: 422,
    tags: ["Claude", "instaloader", "whisper"],
    excerpt: "Os salvos viram memória consultável quando o fluxo baixa, transcreve e organiza o conteúdo.",
    transcript: "É assim que você transforma todos os posts que você salvou no seu Instagram em memória para o Claude.",
    accent: "linear-gradient(135deg, #1d4ed8 0%, #0f766e 100%)",
  },
  {
    id: "Dbl3aOspMag",
    title: "Melhores sites de efeitos e componentes prontos para web",
    author: "@itsdavixavier",
    category: "ia",
    status: "available",
    type: "GraphVideo",
    date: "2026-08-03",
    likes: 184,
    comments: 116,
    tags: ["gsap", "anime.js", "components"],
    excerpt: "Lista de sites para copiar efeitos e componentes com menos atrito.",
    transcript: "Eu cansei de ver a gente postando sites assim, mas nunca falar onde a gente pega os efeitos...",
    accent: "linear-gradient(135deg, #2563eb 0%, #0284c7 100%)",
  },
  {
    id: "DbmIuGRy7T8",
    title: "Meta Business Suite: automações gratuitas sem ManyChat",
    author: "@nathocley",
    category: "automation",
    status: "available",
    type: "GraphVideo",
    date: "2026-08-03",
    likes: 450,
    comments: 186,
    tags: ["Meta", "DM", "lead capture"],
    excerpt: "Mostra como resolver automações básicas sem depender de ferramenta paga.",
    transcript: "Ó, já pode parar de usar a manchete. Desculpe um jeito gratuito de fazer isso...",
    accent: "linear-gradient(135deg, #0f766e 0%, #2563eb 100%)",
  },
  {
    id: "Da6IczaBo5T",
    title: "Demorei anos pra aprender...",
    author: "@englishwlulu",
    category: "education",
    status: "available",
    type: "GraphVideo",
    date: "2026-07-17",
    likes: 6570,
    comments: 29,
    tags: ["English", "didática", "learning"],
    excerpt: "Educação leve com explicações curtas, exemplos e sensação de ganho rápido.",
    transcript: "No final de palavras em inglês, se você adiciona full, é com e less...",
    accent: "linear-gradient(135deg, #4338ca 0%, #2563eb 100%)",
  },
  {
    id: "Dbea-qUAFVO",
    title: "Marinada simples para Setinho",
    author: "@primo_gordo",
    category: "lifestyle",
    status: "available",
    type: "GraphVideo",
    date: "2026-07-31",
    likes: 11208,
    comments: 140,
    tags: ["receita", "tradição", "comunidade"],
    excerpt: "Conteúdo culinário com memória cultural e apelo emocional.",
    transcript: "Esse aqui é o verdadeiro churrasco de igreja na marinada sulista...",
    accent: "linear-gradient(135deg, #0f172a 0%, #3b82f6 100%)",
  },
  {
    id: "DbgHH9NEcel",
    title: "Quer receber os repositórios de todas essas skills?",
    author: "@obrunookamoto",
    category: "ia",
    status: "available",
    type: "GraphSidecar",
    date: "2026-08-01",
    likes: 449,
    comments: 443,
    tags: ["Claude", "skills", "designer"],
    excerpt: "Chamada curta com forte intenção de conversão por comentário.",
    transcript: "Sidecar com CTA para receber repositórios.",
    accent: "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)",
  },
  {
    id: "DYunAdShAgx",
    title: "Boca suja do c4r@L#0",
    author: "@teacher.brunofernandes",
    category: "education",
    status: "available",
    type: "GraphVideo",
    date: "2026-05-24",
    likes: 2603,
    comments: 43,
    tags: ["linguística", "pronúncia", "humor"],
    excerpt: "Ensino de idioma com humor e repetição sonora para memorizar melhor.",
    transcript: "Vai se f*****! Tá ligado? Imagina que você tem uma amiga chamada Nali...",
    accent: "linear-gradient(135deg, #1e40af 0%, #38bdf8 100%)",
  },
  {
    id: "DbZEhvGpLVf",
    title: "Nomes de menina que eu acho lindíssimos",
    author: "@elainezanol_",
    category: "lifestyle",
    status: "available",
    type: "GraphVideo",
    date: "2026-07-29",
    likes: 28497,
    comments: 575,
    tags: ["storytelling", "maternidade", "lista"],
    excerpt: "Storytelling forte com repertório afetivo e estética de lista aspiracional.",
    transcript: "Nomes lindíssimos que eu cogitei dar pra minha filha parte 2...",
    accent: "linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)",
  },
  {
    id: "DalESeEkSjr",
    title: "A maior habilidade que você pode desenvolver",
    author: "@socialmediadeelite",
    category: "business",
    status: "available",
    type: "GraphSidecar",
    date: "2026-07-09",
    likes: 8330,
    comments: 4664,
    tags: ["consistência", "redes sociais", "reset"],
    excerpt: "Padrão de validação com insight de consistência e resiliência.",
    transcript: "Quem cresce na internet não é quem acerta sempre...",
    accent: "linear-gradient(135deg, #0f172a 0%, #2563eb 100%)",
  },
  {
    id: "DbJkvGvJ6R1",
    title: "Jarvis Agent: dashboard inteligente com Claude Code + MCPs",
    author: "@99hud",
    category: "ia",
    status: "available",
    type: "GraphVideo",
    date: "2026-07-23",
    likes: 152,
    comments: 250,
    tags: ["Claude Code", "MCP", "dashboard"],
    excerpt: "Demonstra um sistema multi-agente com várias integrações úteis.",
    transcript: "Hey, Jarvis. Wake up, daddy's home...",
    accent: "linear-gradient(135deg, #1d4ed8 0%, #22d3ee 100%)",
  },
  {
    id: "DbWbhCAHwd9",
    title: "Agent Reach: open source que dá acesso real à web para Claude",
    author: "@maxcarrau.ia",
    category: "ia",
    status: "available",
    type: "GraphVideo",
    date: "2026-07-28",
    likes: 1238,
    comments: 1052,
    tags: ["open source", "web access", "claude code"],
    excerpt: "Bom exemplo de CTA forte com promessa técnica clara e curiosidade alta.",
    transcript: "O Claude tem um ponto cego gigante. Só que um repositório open source acabou de resolver isso.",
    accent: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
  },
  {
    id: "DbWhEEOK7PJ",
    title: "Vc tá precisando melhorar o que na sua vida?",
    author: "@menuccimatheus",
    category: "business",
    status: "available",
    type: "GraphVideo",
    date: "2026-07-28",
    likes: 12228,
    comments: 125,
    tags: ["hábitos", "caderno", "organização"],
    excerpt: "Puxa valor com um objeto simples e traduz necessidade em ação concreta.",
    transcript: "Se você precisa melhorar seus hábitos, faz um Habit Tracker...",
    accent: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)",
  },
  {
    id: "DYDcu0TOvUW",
    title: "Como economizei nas passagens para Europa?",
    author: "@vanessasanches_",
    category: "lifestyle",
    status: "partial",
    type: "GraphVideo",
    date: "2026-05-07",
    likes: null,
    comments: null,
    tags: ["milhas", "Europa", "pontos"],
    excerpt: "Registro parcial da estratégia com Livelo + LATAM; dados ainda incompletos na base.",
    transcript: "EP. 2: Como economizei nas passagens para Europa?",
    accent: "linear-gradient(135deg, #1e40af 0%, #60a5fa 100%)",
  },
];

const defaultState = {
  theme: "dark",
  activePanel: "dashboard",
  activeTab: "video",
  query: "",
  category: "all",
  status: "all",
  selectedId: posts[0].id,
  inbox: [
    {
      id: "seed-1",
      title: "omagodowhats / salvos",
      kind: "extract",
      status: "done",
      body: "Base atual pronta para extração e reprocessamento.",
      meta: "50 itens, pausa 3s",
      time: "agora",
    },
  ],
  jobs: [
    {
      id: "job-seed",
      kind: "sync",
      title: "Sincronização base",
      body: "Painel inicial carregado com dados do repositório.",
      status: "done",
      time: "agora",
    },
  ],
};

const state = loadState();

const els = {
  root: document.documentElement,
  themeToggle: document.getElementById("themeToggle"),
  quickRunBtn: document.getElementById("quickRunBtn"),
  pageTitle: document.getElementById("pageTitle"),
  pageSubtitle: document.getElementById("pageSubtitle"),
  automationForm: document.getElementById("automationForm"),
  submitAutomation: document.getElementById("submitAutomation"),
  resetForm: document.getElementById("resetForm"),
  navItems: Array.from(document.querySelectorAll(".nav-item")),
  composerTabs: Array.from(document.querySelectorAll(".composer-tab")),
  composerPanels: Array.from(document.querySelectorAll(".composer-panel")),
  mainPanels: Array.from(document.querySelectorAll(".main-content .panel")),
  kpis: document.getElementById("kpis"),
  jobList: document.getElementById("jobList"),
  queueCount: document.getElementById("queueCount"),
  searchInput: document.getElementById("searchInput"),
  globalSearch: document.getElementById("globalSearch"),
  categoryChips: document.getElementById("categoryChips"),
  statusChips: document.getElementById("statusChips"),
  postGrid: document.getElementById("postGrid"),
  postCount: document.getElementById("postCount"),
  detailCard: document.getElementById("detailCard"),
  inboxList: document.getElementById("inboxList"),
  patternGrid: document.getElementById("patternGrid"),
  profileGrid: document.getElementById("profileGrid"),
};

let jobTimer = 0;

function loadState() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return structuredClone(defaultState);
    return { ...structuredClone(defaultState), ...JSON.parse(raw) };
  } catch {
    return structuredClone(defaultState);
  }
}

function persistState() {
  try {
    localStorage.setItem(storageKey, JSON.stringify({
      theme: state.theme,
      activePanel: state.activePanel,
      activeTab: state.activeTab,
      query: state.query,
      category: state.category,
      status: state.status,
      selectedId: state.selectedId,
      inbox: state.inbox,
      jobs: state.jobs,
    }));
  } catch {
    // Ignore storage failures.
  }
}

function categoryLabel(id) {
  return categories.find((item) => item.id === id)?.label || id;
}

function formatCompact(value) {
  if (value == null) return "N/D";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)}K`;
  return String(value);
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function setTheme(theme) {
  state.theme = theme;
  els.root.setAttribute("data-theme", theme);
  persistState();
}

const panelTitles = {
  dashboard: { title: "Dashboard", subtitle: "Visão geral da operação" },
  composer: { title: "Composer", subtitle: "Inserir vídeos, referências e extrair salvos" },
  library: { title: "Biblioteca", subtitle: "Posts e reels analisados" },
  patterns: { title: "Padrões", subtitle: "5 padrões virais testados" },
  profiles: { title: "Perfis", subtitle: "13 criadores de referência" },
};

function openMainPanel(panelId) {
  state.activePanel = panelId || "dashboard";
  els.mainPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panel === state.activePanel);
  });
  els.navItems.forEach((nav) => {
    nav.classList.toggle("is-active", nav.dataset.nav === state.activePanel);
  });

  const panelInfo = panelTitles[state.activePanel] || panelTitles.dashboard;
  els.pageTitle.textContent = panelInfo.title;
  els.pageSubtitle.textContent = panelInfo.subtitle;

  persistState();
}

function openComposerTab(tabId) {
  state.activeTab = tabId;
  els.composerTabs.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === tabId);
  });
  els.composerPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panel === tabId);
  });
  persistState();
}

function matchesFilters(post) {
  const query = state.query.trim().toLowerCase();
  const matchesQuery =
    !query ||
    [post.title, post.author, post.excerpt, ...(post.tags || [])]
      .join(" ")
      .toLowerCase()
      .includes(query);
  const matchesCategory = state.category === "all" || post.category === state.category;
  const matchesStatus = state.status === "all" || post.status === state.status;
  return matchesQuery && matchesCategory && matchesStatus;
}

function renderKpis() {
  const counts = {
    posts: posts.length,
    available: posts.filter((post) => post.status === "available").length,
    partial: posts.filter((post) => post.status === "partial").length,
    jobs: state.jobs.length,
    profiles: profiles.length,
    queues: state.inbox.length,
  };

  const cards = [
    { label: "Base local", value: `${counts.posts}`, meta: "posts e reels catalogados" },
    { label: "Disponíveis", value: `${counts.available}`, meta: "itens prontos para análise" },
    { label: "Pendentes", value: `${counts.partial}`, meta: "itens com revisão manual" },
    { label: "Fila", value: `${counts.jobs}`, meta: "jobs vivos no painel" },
  ];

  els.kpis.innerHTML = cards
    .map(
      (item) => `
        <article class="stat-card">
          <p class="eyebrow">${item.label}</p>
          <strong>${item.value}</strong>
          <p>${item.meta}</p>
        </article>
      `,
    )
    .join("");
}

function renderChips(container, items, activeId, onSelect) {
  container.innerHTML = items
    .map(
      (item) => `
        <button class="chip ${item.id === activeId ? "is-active" : ""}" type="button" data-id="${item.id}">
          ${item.label}
        </button>
      `,
    )
    .join("");
  container.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => onSelect(button.dataset.id));
  });
}

function renderPosts() {
  const filtered = posts.filter(matchesFilters);
  els.postCount.textContent = `${filtered.length} item${filtered.length === 1 ? "" : "s"}`;

  els.postGrid.innerHTML =
    filtered.length > 0
      ? filtered
          .map((post) => {
            const selected = post.id === state.selectedId ? "is-selected" : "";
            const badgeLabel = post.status === "partial" ? "Dados parciais" : post.type;
            const commentLabel = post.comments == null ? "N/D" : formatCompact(post.comments);
            return `
              <button class="post-card ${selected}" type="button" data-id="${post.id}">
                <div class="post-card__media" style="background:${post.accent}">
                  <span class="post-card__badge ${post.status === "partial" ? "post-card__badge--partial" : ""}">
                    ${badgeLabel}
                  </span>
                  <div class="post-card__metric">
                    <div class="metric__value">${formatCompact(post.likes)}</div>
                    <div class="metric__label">likes</div>
                  </div>
                </div>
                <div class="post-card__body">
                  <h4 class="post-card__title">${post.title}</h4>
                  <p class="post-card__author">${post.author} • ${formatDate(post.date)}</p>
                  <div class="post-card__stats">
                    <span>Comentários ${commentLabel}</span>
                    <span>${categoryLabel(post.category)}</span>
                  </div>
                  <p class="post-card__excerpt">${post.excerpt}</p>
                  <div class="post-card__footer">
                    ${post.tags.map((tag) => `<span class="mini-tag">${tag}</span>`).join("")}
                  </div>
                </div>
              </button>
            `;
          })
          .join("")
      : `<div class="empty-state">Nenhum post encontrado com os filtros atuais.</div>`;

  els.postGrid.querySelectorAll(".post-card").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedId = button.dataset.id;
      renderAll();
      persistState();
    });
  });
}

function renderDetail() {
  const post = posts.find((item) => item.id === state.selectedId) || posts[0];
  els.detailCard.innerHTML = `
    <article class="detail-hero" style="background:${post.accent}">
      <span class="pill">${categoryLabel(post.category)}</span>
      <h4 class="detail-hero__title">${post.title}</h4>
      <div class="detail-hero__meta">
        <span>${post.author}</span>
        <span>${post.type}</span>
        <span>${formatDate(post.date)}</span>
      </div>
    </article>

    <section class="detail-section">
      <h4>Resumo</h4>
      <p class="detail-copy">${post.excerpt}</p>
    </section>

    <section class="detail-section">
      <h4>Métricas</h4>
      <div class="detail-grid">
        <div class="detail-stat">
          <span>Curtidas</span>
          <strong>${formatCompact(post.likes)}</strong>
        </div>
        <div class="detail-stat">
          <span>Comentários</span>
          <strong>${formatCompact(post.comments)}</strong>
        </div>
        <div class="detail-stat">
          <span>Status</span>
          <strong>${post.status === "partial" ? "Parcial" : "Disponível"}</strong>
        </div>
        <div class="detail-stat">
          <span>Categoria</span>
          <strong>${categoryLabel(post.category)}</strong>
        </div>
      </div>
    </section>

    <section class="detail-section">
      <h4>Transcrição</h4>
      <p class="detail-copy">${post.transcript}</p>
    </section>

    <section class="detail-section">
      <h4>Tags</h4>
      <div class="detail-tags">
        ${post.tags.map((tag) => `<span class="profile-chip">${tag}</span>`).join("")}
      </div>
    </section>

    <div class="button-row">
      <button class="ghost-btn focus-outline" type="button" data-action="queue-video">Mandar para fila</button>
      <button class="ghost-btn focus-outline" type="button" data-action="open-ref">Abrir como referência</button>
    </div>
  `;

  els.detailCard.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.action === "queue-video") {
        enqueueJob("video", `Revisar ${post.author}`, post.title, "Manda este post para o fluxo de análise.");
      }
      if (button.dataset.action === "open-ref") {
        addInboxEntry({
          title: `${post.author} / referência`,
          kind: "reference",
          status: "queued",
          body: post.title,
          meta: categoryLabel(post.category),
        });
      }
    });
  });
}

function renderPatterns() {
  els.patternGrid.innerHTML = patterns
    .map(
      (pattern) => `
        <article class="pattern-card">
          <div class="pattern-card__top">
            <div>
              <div class="pattern-card__code">${pattern.code}</div>
              <h4>${pattern.title}</h4>
            </div>
            <div class="rating">${"★".repeat(pattern.stars)}${"☆".repeat(5 - pattern.stars)}</div>
          </div>
          <p>${pattern.summary}</p>
          <div class="detail-tags">
            <span class="profile-chip">Setup ${pattern.setup}</span>
            <span class="profile-chip">Replicabilidade ${pattern.stars}/5</span>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderProfiles() {
  els.profileGrid.innerHTML = profiles
    .map(
      (profile) => `
        <article class="profile-card">
          <div class="profile-card__top">
            <div>
              <div class="profile-card__handle">${profile.handle}</div>
              <h4>${profile.niche}</h4>
            </div>
            <span class="pill">${profile.status === "complete" ? "Completo" : "Parcial"}</span>
          </div>
          <p>${profile.note}</p>
          <div class="detail-tags">
            <span class="profile-chip ${profile.status === "complete" ? "is-active" : ""}">
              ${profile.status === "complete" ? "Consolidado" : "Revisar"}
            </span>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderInbox() {
  els.inboxList.innerHTML =
    state.inbox.length > 0
      ? state.inbox
          .map(
            (item) => `
              <article class="inbox-card">
                <div class="inbox-card__top">
                  <div class="inbox-card__title">${item.title}</div>
                  <span class="queue-state">${item.kind}</span>
                </div>
                <div class="inbox-card__meta">${item.meta || ""}</div>
                <div class="inbox-card__body">${item.body || ""}</div>
              </article>
            `,
          )
          .join("")
      : `<div class="empty-state">Nada na inbox ainda.</div>`;
}

function renderJobs() {
  els.queueCount.textContent = `${state.jobs.length} job${state.jobs.length === 1 ? "" : "s"}`;
  els.jobList.innerHTML =
    state.jobs.length > 0
      ? state.jobs
          .map(
            (job) => `
              <article class="queue-item is-${job.status}">
                <div class="queue-item__top">
                  <div>
                    <div class="queue-item__title">${job.title}</div>
                    <div class="queue-item__meta">${job.kind}</div>
                  </div>
                  <span class="pill">${job.status}</span>
                </div>
                <div class="queue-item__body">${job.body}</div>
                <div class="queue-item__time">${job.time}</div>
              </article>
            `,
          )
          .join("")
      : `<div class="empty-state">Nenhum job ativo.</div>`;
}

function addInboxEntry(entry) {
  state.inbox.unshift({
    id: crypto.randomUUID?.() || `inbox-${Date.now()}`,
    time: "agora",
    ...entry,
  });
  state.inbox = state.inbox.slice(0, 8);
  renderInbox();
  persistState();
}

function enqueueJob(kind, title, body, meta = "") {
  const id = crypto.randomUUID?.() || `job-${Date.now()}`;
  const job = {
    id,
    kind,
    title,
    body,
    meta,
    status: "waiting",
    time: "agora",
  };

  state.jobs.unshift(job);
  renderJobs();
  addInboxEntry({
    title,
    kind,
    status: "queued",
    body,
    meta,
  });
  persistState();

  clearTimeout(jobTimer);
  jobTimer = setTimeout(() => {
    updateJob(id, "running");
    jobTimer = setTimeout(() => {
      updateJob(id, "done");
      addInboxEntry({
        title: `${title} concluído`,
        kind,
        status: "done",
        body: "Job finalizado e pronto para revisão.",
        meta: meta || "automação",
      });
      persistState();
    }, 1200);
  }, 500);
}

function updateJob(id, status) {
  state.jobs = state.jobs.map((job) => (job.id === id ? { ...job, status } : job));
  renderJobs();
  persistState();
}

function submitAutomation(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);

  if (state.activeTab === "video") {
    const url = String(form.get("videoUrl") || "").trim();
    const title = String(form.get("videoTitle") || "").trim() || "Vídeo sem título";
    const category = String(form.get("videoCategory") || "ia");
    const note = String(form.get("videoNote") || "").trim();
    enqueueJob(
      "video",
      title,
      url || "Link pendente",
      `${categoryLabel(category)}${note ? ` • ${note}` : ""}`,
    );
  }

  if (state.activeTab === "reference") {
    const handle = String(form.get("refHandle") || "").trim() || "@referencia";
    const url = String(form.get("refUrl") || "").trim();
    const category = String(form.get("refCategory") || "ia");
    const note = String(form.get("refNote") || "").trim();
    enqueueJob(
      "reference",
      `${handle} salvo como referência`,
      url || "Perfil sem URL",
      `${categoryLabel(category)}${note ? ` • ${note}` : ""}`,
    );
  }

  if (state.activeTab === "extract") {
    const profile = String(form.get("extractProfile") || "omagodowhats").trim();
    const max = String(form.get("extractMax") || "50").trim();
    const pause = String(form.get("extractPause") || "3").trim();
    const confirm = String(form.get("extractConfirm") || "").trim();
    enqueueJob(
      "extract",
      `Extrair salvos de ${profile}`,
      `${max} itens com pausa de ${pause}s`,
      confirm || "confirmação pendente",
    );
  }
}

function resetForm() {
  const activePanel = document.querySelector(`.composer__panel[data-panel="${state.activeTab}"]`);
  if (!activePanel) return;
  activePanel.querySelectorAll("input").forEach((input) => {
    if (input.type === "number") return;
    input.value = input.defaultValue || "";
  });
}

function applyFilters() {
  renderPosts();
  renderDetail();
  persistState();
}

function renderAll() {
  setTheme(state.theme);
  openMainPanel(state.activePanel || "dashboard");
  if (state.activePanel === "composer") {
    openComposerTab(state.activeTab || "video");
  }
  renderKpis();
  renderJobs();
  renderInbox();
  renderPatterns();
  renderProfiles();
  renderPosts();
  renderDetail();
}

function bindEvents() {
  els.themeToggle.addEventListener("click", () => {
    setTheme(state.theme === "dark" ? "light" : "dark");
  });

  els.quickRunBtn.addEventListener("click", () => {
    enqueueJob("extract", "Rodar automação", "Execução geral do pipeline", "trigger rápido");
  });

  els.navItems.forEach((button) => {
    button.addEventListener("click", () => openMainPanel(button.dataset.nav));
  });

  els.composerTabs.forEach((button) => {
    button.addEventListener("click", () => openComposerTab(button.dataset.tab));
  });

  els.automationForm.addEventListener("submit", submitAutomation);
  els.resetForm.addEventListener("click", resetForm);
  els.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    applyFilters();
  });

  if (els.globalSearch) {
    els.globalSearch.addEventListener("input", (event) => {
      state.query = event.target.value;
      applyFilters();
    });
  }

  renderChips(els.categoryChips, categories, state.category, (id) => {
    state.category = id;
    applyFilters();
  });

  renderChips(els.statusChips, statuses, state.status, (id) => {
    state.status = id;
    applyFilters();
  });
}

function boot() {
  setTheme(state.theme);
  els.searchInput.value = state.query;
  renderAll();
  bindEvents();
}

boot();
