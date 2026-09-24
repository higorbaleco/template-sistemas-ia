const NS = window.AvrahamDesignSystem_609133;
const { Badge, Button, Card, Eyebrow, Icon, IconButton, IconTile, Pill, SectionHeading,
  Avatar, AvatarGroup, DataTable, ProgressBar, ScoreRing, StatTile,
  Input, Select, Tabs, Toggle, AchievementBadge, ChatMessage, ChecklistItem,
  KanbanCard, NumberedCard, SidebarNav } = NS;
const DB = window.DB;
const { useState } = React;

const relucide = () => { if (window.lucide) window.lucide.createIcons({ nameAttr: "data-lucide" }); };

const NAV = [
  { section: "Operação" },
  { value: "dashboard", label: "Dashboard", icon: "layout-dashboard" },
  { value: "funil", label: "Funil de vendas", icon: "kanban", count: 62 },
  { value: "conversas", label: "Conversas", icon: "messages-square", count: 3 },
  { value: "instancias", label: "Instâncias WhatsApp", icon: "smartphone" },
  { section: "Engajamento" },
  { value: "gamificacao", label: "Gamificação", icon: "trophy" },
  { value: "config", label: "Equipe e plano", icon: "settings" },
];

function Panel({ title, action, children, style, pad = 22 }) {
  return (
    <div className="glass" style={{ borderRadius: "var(--rc)", padding: pad, display: "flex", flexDirection: "column", gap: 16, ...style }}>
      {title ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-.01em", margin: 0 }}>{title}</h3>
          {action}
        </div>
      ) : null}
      {children}
    </div>
  );
}

/* ---------------- Flow strip (5-step operation) ---------------- */
function FlowStrip() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
      {DB.flow.map((s, i) => (
        <div key={s.n} className="glass glass-hover" style={{ position: "relative", borderRadius: "var(--rc)", padding: "18px 16px", display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" }}>
          <span style={{ position: "absolute", inset: "0 0 auto 0", height: 3 }} className={s.grad} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className={s.grad} style={{ width: 40, height: 40, borderRadius: 12, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#04120e" }}>
              <Icon name={s.icon} size={19} color="#04120e" />
            </span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--t4)", letterSpacing: "-.02em" }}>{s.n}</span>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{s.label}</div>
            <div style={{ fontSize: 12, color: "var(--t3)", marginTop: 3, lineHeight: 1.4 }}>{s.detail}</div>
          </div>
          <div className="num" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-.01em", color: "var(--cyan)" }}>{s.metric}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Dashboard ---------------- */
function Dashboard({ go }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div>
        <Eyebrow>Centro de comando</Eyebrow>
        <h1 style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-.02em", margin: "10px 0 6px" }}>Bom dia, Marina.</h1>
        <p className="body" style={{ maxWidth: 560 }}>A operação está saudável. A IA respondeu 1.204 conversas nas últimas 24h e agendou 31 reuniões sem intervenção humana.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {DB.kpis.map(k => <StatTile key={k.label} {...k} />)}
      </div>

      <Panel title="Jornada da operação" action={<Badge tone="live" dot pulse>Em tempo real</Badge>}>
        <FlowStrip />
      </Panel>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16 }}>
        <Panel title="Negócios em destaque" action={<Button variant="ghost" size="sm" iconRight="arrow-right" onClick={() => go("funil")}>Ver funil</Button>}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {DB.leads.filter(l => ["reuniao", "proposta", "ganho"].includes(l.stage)).map((l, i, a) => (
              <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < a.length - 1 ? "1px solid var(--gbo)" : "none" }}>
                <Avatar name={l.title} size={38} tone={i % 2 ? "lavender" : "emerald"} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{l.title}</div>
                  <div style={{ fontSize: 12, color: "var(--t3)" }}>{l.company}</div>
                </div>
                <div className="num" style={{ fontSize: 15, fontWeight: 700 }}>{l.value}</div>
                <ScoreRing value={l.score} size={40} thickness={4} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Suas tarefas" action={<Badge tone="warn">{DB.tasks.filter(t => !t.done).length} abertas</Badge>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {DB.tasks.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < DB.tasks.length - 1 ? "1px solid var(--gbo)" : "none" }}>
                <span style={{ width: 20, height: 20, borderRadius: 6, flex: "0 0 auto", display: "inline-flex", alignItems: "center", justifyContent: "center", background: t.done ? "var(--surface-cyan)" : "transparent", border: `1px solid ${t.done ? "var(--border-cyan)" : "var(--border-strong)"}` }}>
                  {t.done ? <Icon name="check" size={12} color="var(--cyan)" strokeWidth={2.6} /> : null}
                </span>
                <span style={{ flex: 1, fontSize: 13, color: t.done ? "var(--t4)" : "var(--t2)", textDecoration: t.done ? "line-through" : "none" }}>{t.text}</span>
                <span className="num" style={{ fontSize: 11, color: t.tone === "warn" ? "var(--status-warn)" : "var(--t3)" }}>{t.due}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ---------------- Funil (Kanban) ---------------- */
function Funil() {
  const [funnel, setFunnel] = useState("comercial");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <Eyebrow>Pipeline</Eyebrow>
          <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-.02em", margin: "8px 0 0" }}>Funil de vendas</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Tabs tabs={[{ value: "comercial", label: "Comercial" }, { value: "reativacao", label: "Reativação" }, { value: "upsell", label: "Upsell" }]} value={funnel} onChange={setFunnel} />
          <Button size="sm" icon="plus" iconRight={null}>Novo negócio</Button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,minmax(220px,1fr))", gap: 14, overflowX: "auto", paddingBottom: 8, alignItems: "start" }}>
        {DB.stages.map(st => {
          const items = DB.leads.filter(l => l.stage === st.key);
          const total = items.reduce((s, l) => s + parseFloat(l.value.replace(/[^\d]/g, "")) / 1000, 0);
          return (
            <div key={st.key} style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 2px" }}>
                <span style={{ width: 8, height: 8, borderRadius: 3, background: st.tint }} />
                <span style={{ fontSize: 13, fontWeight: 700 }}>{st.label}</span>
                <span className="num" style={{ marginLeft: "auto", fontSize: 11, color: "var(--t3)" }}>{items.length} · R$ {total.toFixed(0)}k</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {items.map(l => <KanbanCard key={l.id} {...l} onClick={() => {}} />)}
                {!items.length ? <div style={{ fontSize: 12, color: "var(--t4)", padding: "18px 0", textAlign: "center", border: "1px dashed var(--gbo)", borderRadius: 12 }}>Sem negócios</div> : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Conversas ---------------- */
function Conversas() {
  const [active, setActive] = useState(1);
  const [draft, setDraft] = useState("");
  const [thread, setThread] = useState(DB.thread);
  const conv = DB.conversations.find(c => c.id === active);
  const send = () => { if (!draft.trim()) return; setThread(t => [...t, { from: "agent", author: "Você", time: "agora", status: "sent", text: draft }]); setDraft(""); };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "300px 1fr 280px", gap: 0, height: "100%", border: "1px solid var(--gbo)", borderRadius: "var(--rc)", overflow: "hidden", background: "var(--gb)", backdropFilter: "var(--glass-blur)" }}>
      {/* conversation list */}
      <div style={{ display: "flex", flexDirection: "column", borderRight: "1px solid var(--gbo)", minHeight: 0 }}>
        <div style={{ padding: 16, borderBottom: "1px solid var(--gbo)" }}>
          <Input icon="search" placeholder="Buscar conversa" />
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {DB.conversations.map(c => (
            <button key={c.id} onClick={() => setActive(c.id)} style={{ display: "flex", gap: 12, width: "100%", textAlign: "left", padding: "14px 16px", border: "none", borderBottom: "1px solid var(--gbo)", cursor: "pointer", background: c.id === active ? "var(--surface-cyan)" : "transparent" }}>
              <Avatar name={c.name} size={40} status={c.status} tone={c.id % 2 ? "lavender" : "emerald"} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: c.id === active ? "var(--cyan)" : "var(--t1)" }}>{c.name}</span>
                  <span className="num" style={{ fontSize: 10, color: "var(--t3)", flex: "0 0 auto" }}>{c.time}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--t3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 2 }}>{c.last}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 6, alignItems: "center" }}>
                  {c.ai ? <Badge tone="live" uppercase={false} style={{ fontSize: 9, padding: "2px 7px" }}>IA ativa</Badge> : <Badge tone="neutral" uppercase={false} style={{ fontSize: 9, padding: "2px 7px" }}>Humano</Badge>}
                  {c.unread ? <span className="num" style={{ marginLeft: "auto", background: "var(--cyan)", color: "var(--bg2)", borderRadius: 999, fontSize: 10, fontWeight: 700, padding: "1px 7px" }}>{c.unread}</span> : null}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* thread */}
      <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: "1px solid var(--gbo)" }}>
          <Avatar name={conv.name} size={38} status={conv.status} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{conv.name} · <span style={{ color: "var(--t3)", fontWeight: 500 }}>{conv.company}</span></div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 2 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--t3)" }}><Icon name="message-circle" size={12} color="#25D366" />{conv.channel}</span>
            </div>
          </div>
          <Badge tone="live" dot pulse>IA respondendo</Badge>
          <IconButton icon="phone" label="Ligar" variant="outline" size={36} />
          <IconButton icon="more-vertical" label="Mais" size={36} />
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ textAlign: "center" }}><span className="num" style={{ fontSize: 11, color: "var(--t4)", background: "var(--gb)", padding: "4px 12px", borderRadius: 999 }}>Hoje</span></div>
          {thread.map((m, i) => <ChatMessage key={i} from={m.from} agent={m.agent} author={m.author} time={m.time} status={m.status}>{m.text}</ChatMessage>)}
        </div>
        <div style={{ display: "flex", gap: 10, padding: 16, borderTop: "1px solid var(--gbo)", alignItems: "center" }}>
          <IconButton icon="paperclip" label="Anexar" size={40} />
          <div style={{ flex: 1 }}><Input placeholder="Assumir a conversa e responder..." value={draft} onChange={e => setDraft(e.target.value)} /></div>
          <Button icon="send" iconRight={null} onClick={send}>Enviar</Button>
        </div>
      </div>
      {/* contact panel */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18, padding: 20, borderLeft: "1px solid var(--gbo)", overflowY: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textAlign: "center" }}>
          <Avatar name={conv.name} size={64} tone="emerald" />
          <div><div style={{ fontSize: 15, fontWeight: 700 }}>{conv.name}</div><div style={{ fontSize: 12, color: "var(--t3)" }}>{conv.company}</div></div>
          <ScoreRing value={conv.score} size={72} label="Score" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Button variant="secondary" size="sm" icon="calendar-plus" iconRight={null}>Agendar</Button>
          <Button variant="outline" size="sm" icon="user-plus" iconRight={null}>Qualificar</Button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span className="label" style={{ color: "var(--t3)", fontSize: 11 }}>Detalhes</span>
          {[["Canal", conv.channel], ["Origem", "Anúncio - Meta"], ["Etapa", "Qualificação IA"], ["Responsável", conv.ai ? "IA Avraham" : "Marina D."]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}><span style={{ color: "var(--t3)" }}>{k}</span><span style={{ color: "var(--t1)", fontWeight: 600 }}>{v}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Instâncias WhatsApp ---------------- */
function Instancias() {
  const healthTone = h => h >= 85 ? "live" : h >= 55 ? "warn" : "danger";
  const cols = [
    { key: "label", label: "Instância", render: r => (<div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ width: 34, height: 34, borderRadius: 10, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(37,211,102,.12)", border: "1px solid rgba(37,211,102,.3)" }}><Icon name="message-circle" size={16} color="#25D366" /></span><div><div style={{ fontWeight: 700, fontSize: 13 }}>{r.label}</div><div className="num" style={{ fontSize: 11, color: "var(--t3)" }}>{r.number}</div></div></div>) },
    { key: "type", label: "Tipo", render: r => <Badge tone={r.type === "API oficial" ? "info" : "neutral"} uppercase={false}>{r.type}</Badge> },
    { key: "status", label: "Status", render: r => <Badge tone={r.status} dot pulse={r.status === "live"} uppercase={false}>{r.status === "live" ? "Conectada" : r.status === "warn" ? "Instável" : "Queda"}</Badge> },
    { key: "messages", label: "Msgs 24h", align: "right", mono: true },
    { key: "tps", label: "Throughput", align: "right", mono: true },
    { key: "health", label: "Saúde", align: "right", render: r => <span style={{ display: "inline-flex", justifyContent: "flex-end", width: "100%" }}><Badge tone={healthTone(r.health)} uppercase={false}>{r.health}%</Badge></span> },
  ];
  const live = DB.instances.filter(i => i.status === "live").length;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div><Eyebrow>Infraestrutura</Eyebrow><h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-.02em", margin: "8px 0 0" }}>Instâncias WhatsApp</h1></div>
        <Button icon="plus" iconRight={null}>Conectar número</Button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        <StatTile label="Números ativos" value={`${live}/5`} icon="smartphone" tone="emerald" sub="2 em contingência" />
        <StatTile label="API oficial" value="3" icon="badge-check" sub="80 msg/s cada" />
        <StatTile label="Msgs enviadas 24h" value="30,4k" icon="send" delta="+22%" deltaTone="up" />
        <StatTile label="Saúde média" value="72" unit="%" icon="activity" delta="-8%" deltaTone="down" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 16 }}>
        <Panel title="Todas as instâncias" pad={0} style={{ overflow: "hidden" }}>
          <DataTable columns={cols} rows={DB.instances} onRowClick={() => {}} />
        </Panel>
        <Panel title="Conectar novo número">
          <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center", textAlign: "center" }}>
            <div style={{ width: 150, height: 150, borderRadius: 16, background: "#fff", display: "grid", gridTemplateColumns: "repeat(9,1fr)", gap: 2, padding: 12 }}>
              {Array.from({ length: 81 }).map((_, i) => <span key={i} style={{ background: (i * 7 + (i % 5) * 3) % 3 ? "#0D0E11" : "transparent", borderRadius: 1 }} />)}
            </div>
            <p className="body" style={{ fontSize: 13 }}>Abra o WhatsApp no celular, toque em Aparelhos conectados e escaneie o código.</p>
            <Toggle checked label="API oficial (recomendado)" description="Alta disponibilidade, 80 msg/s, contingência automática" />
            <Button fullWidth icon="link" iconRight={null}>Gerar novo QR</Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ---------------- Gamificação ---------------- */
function Gamificacao() {
  const u = DB.user;
  const ranked = [...DB.team].sort((a, b) => b.points - a.points);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div><Eyebrow>Desempenho</Eyebrow><h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-.02em", margin: "8px 0 0" }}>Metas, desafios e conquistas</h1></div>

      <div className="glass" style={{ borderRadius: "var(--rc)", padding: 24, display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 24, alignItems: "center", position: "relative", overflow: "hidden" }}>
        <span style={{ position: "absolute", inset: 0, background: "var(--grad-command)", pointerEvents: "none" }} />
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ position: "relative" }}>
            <Avatar name={u.name} size={64} tone="emerald" />
            <span className="num g-flow" style={{ position: "absolute", right: -6, bottom: -6, width: 30, height: 30, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#04120e", border: "2px solid var(--bg)" }}>{u.level}</span>
          </div>
          <div><div style={{ fontSize: 17, fontWeight: 700 }}>{u.name}</div><div style={{ fontSize: 12, color: "var(--t3)" }}>{u.role}</div></div>
        </div>
        <div style={{ position: "relative", maxWidth: 460 }}>
          <ProgressBar value={u.xp} max={u.xpNext} tone="flow" label={`Nível ${u.level} · Especialista de Operação`} caption={`${u.xp.toLocaleString("pt-BR")} / ${u.xpNext.toLocaleString("pt-BR")} XP para o nível ${u.level + 1}`} />
        </div>
        <div style={{ position: "relative", display: "flex", gap: 22 }}>
          <div style={{ textAlign: "center" }}><div className="num" style={{ fontSize: 26, fontWeight: 700, color: "var(--cyan)" }}>{u.streak}</div><div style={{ fontSize: 11, color: "var(--t3)" }}>dias de ofensiva</div></div>
          <div style={{ textAlign: "center" }}><div className="num" style={{ fontSize: 26, fontWeight: 700 }}>#1</div><div style={{ fontSize: 11, color: "var(--t3)" }}>no ranking</div></div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Panel title="Metas do mês">
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {DB.goals.map(g => <ProgressBar key={g.label} value={g.value} max={g.max} tone={g.tone} label={g.label} caption={`${g.value.toLocaleString("pt-BR")} de ${g.max.toLocaleString("pt-BR")} ${g.unit}`} />)}
          </div>
        </Panel>
        <Panel title="Desafios ativos" action={<Badge tone="info">semana</Badge>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {DB.challenges.map(c => (
              <div key={c.title} style={{ display: "flex", gap: 14, alignItems: "center", padding: 14, borderRadius: 14, background: "var(--gb)", border: "1px solid var(--gbo)" }}>
                <IconTile icon={c.icon} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ fontSize: 13, fontWeight: 700 }}>{c.title}</span><span className="num" style={{ fontSize: 12, color: "var(--cyan)", fontWeight: 700 }}>{c.reward}</span></div>
                  <div style={{ fontSize: 12, color: "var(--t3)", margin: "2px 0 8px" }}>{c.detail}</div>
                  <ProgressBar value={c.progress} tone="emerald" height={6} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Conquistas">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {DB.achievements.map(a => <AchievementBadge key={a.title} {...a} />)}
        </div>
      </Panel>

      <Panel title="Ranking da equipe" action={<Tabs tabs={["Mês", "Semana", "Trimestre"]} value="Mês" onChange={() => {}} />}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {ranked.map((m, i) => (
            <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < ranked.length - 1 ? "1px solid var(--gbo)" : "none" }}>
              <span className="num" style={{ width: 24, fontSize: 15, fontWeight: 700, color: i === 0 ? "var(--cyan)" : "var(--t3)" }}>{i + 1}</span>
              <Avatar name={m.name} size={38} tone={m.ai ? "lavender" : i % 2 ? "lavender" : "emerald"} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>{m.name}{m.ai ? <Badge tone="live" uppercase={false} style={{ fontSize: 9, padding: "1px 7px" }}>IA</Badge> : null}{m.you ? <Badge tone="info" uppercase={false} style={{ fontSize: 9, padding: "1px 7px" }}>você</Badge> : null}</div>
                <div style={{ fontSize: 12, color: "var(--t3)" }}>{m.role} · nível {m.level}</div>
              </div>
              <div style={{ textAlign: "right" }}><div className="num" style={{ fontSize: 12, color: "var(--t3)" }}>{m.deals} negócios</div><div className="num" style={{ fontSize: 15, fontWeight: 700, color: "var(--cyan)" }}>{m.points.toLocaleString("pt-BR")} pts</div></div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* ---------------- Equipe e plano ---------------- */
function Config() {
  const [tab, setTab] = useState("equipe");
  const roleTone = { Admin: "info", Closer: "live", SDR: "neutral" };
  const cols = [
    { key: "name", label: "Membro", render: r => (<div style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar name={r.name} size={34} /><div><div style={{ fontWeight: 700, fontSize: 13 }}>{r.name}</div><div style={{ fontSize: 11, color: "var(--t3)" }}>{r.email}</div></div></div>) },
    { key: "role", label: "Papel", render: r => <Badge tone={roleTone[r.role] || "neutral"} uppercase={false}>{r.role}</Badge> },
    { key: "status", label: "Status", render: r => <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: r.status === "Ativo" ? "var(--t1)" : "var(--status-warn)" }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: r.status === "Ativo" ? "var(--green)" : "var(--status-warn)" }} />{r.status}</span> },
    { key: "act", label: "", align: "right", render: () => <IconButton icon="more-horizontal" label="Ações" size={32} /> },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div><Eyebrow>Administração</Eyebrow><h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-.02em", margin: "8px 0 0" }}>Equipe e plano</h1></div>
      <Tabs tabs={[{ value: "equipe", label: "Equipe", icon: "users" }, { value: "plano", label: "Plano e pagamento", icon: "credit-card" }, { value: "perfil", label: "Perfil", icon: "user" }]} value={tab} onChange={setTab} variant="underline" />
      {tab === "equipe" ? (
        <Panel title="Membros e permissões" action={<Button size="sm" icon="user-plus" iconRight={null}>Convidar</Button>} pad={0} style={{ overflow: "hidden" }}>
          <DataTable columns={cols} rows={DB.members} />
        </Panel>
      ) : null}
      {tab === "plano" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {[{ n: "Pro", p: "R$ 1.490", f: ["1 número API", "5 usuários", "10 mil msgs/mês"], on: false }, { n: "Growth", p: "R$ 3.900", f: ["3 números API", "15 usuários", "50 mil msgs/mês", "Campanhas"], on: false }, { n: "Scale", p: "R$ 9.800", f: ["Números ilimitados", "Usuários ilimitados", "Volume sob medida", "IA dedicada + SLA"], on: true }].map(pl => (
            <div key={pl.n} className="glass" style={{ borderRadius: "var(--rc)", padding: 24, display: "flex", flexDirection: "column", gap: 16, border: pl.on ? "1px solid var(--border-cyan)" : "1px solid var(--gbo)", background: pl.on ? "var(--surface-cyan)" : "var(--gb)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 15, fontWeight: 700 }}>{pl.n}</span>{pl.on ? <Badge tone="live" dot>Plano atual</Badge> : null}</div>
              <div><span className="num" style={{ fontSize: 30, fontWeight: 700 }}>{pl.p}</span><span style={{ color: "var(--t3)", fontSize: 13 }}> /mês</span></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{pl.f.map(f => <span key={f} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--t2)" }}><Icon name="check" size={15} color="var(--cyan)" />{f}</span>)}</div>
              <Button variant={pl.on ? "secondary" : "outline"} iconRight={null} fullWidth>{pl.on ? "Gerenciar pagamento" : "Fazer upgrade"}</Button>
            </div>
          ))}
        </div>
      ) : null}
      {tab === "perfil" ? (
        <Panel title="Editar perfil" style={{ maxWidth: 560 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 4 }}>
            <Avatar name={DB.user.name} size={64} />
            <Button variant="secondary" size="sm" icon="upload" iconRight={null}>Trocar foto</Button>
          </div>
          <Input label="Nome" value={DB.user.name} onChange={() => {}} />
          <Input label="E-mail" value="marina@avraham.co" icon="mail" onChange={() => {}} />
          <Select label="Fuso horário" options={["America/Sao_Paulo (GMT-3)", "America/Fortaleza (GMT-3)"]} onChange={() => {}} />
          <Toggle checked label="Notificações da IA no WhatsApp" description="Receba um resumo quando a IA agendar ou fechar" />
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}><Button iconRight={null}>Salvar alterações</Button><Button variant="ghost" iconRight={null}>Cancelar</Button></div>
        </Panel>
      ) : null}
    </div>
  );
}

const SCREENS = { dashboard: Dashboard, funil: Funil, conversas: Conversas, instancias: Instancias, gamificacao: Gamificacao, config: Config };

/* ---------------- App shell ---------------- */
function App() {
  const [screen, setScreen] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [org, setOrg] = useState(DB.orgs[0].id);
  const [theme, setTheme] = useState("light");
  React.useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);
  React.useEffect(() => { relucide(); const t = setTimeout(relucide, 120); return () => clearTimeout(t); }, [screen, collapsed, org]);
  const Screen = SCREENS[screen];
  const orgObj = DB.orgs.find(o => o.id === org);

  const brand = (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "6px 0 14px" : "6px 8px 14px", justifyContent: collapsed ? "center" : "flex-start" }}>
      <span className="g-flow" style={{ width: 34, height: 34, borderRadius: 10, display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto", boxShadow: "var(--glow-cyan-soft)" }}>
        <Icon name="command" size={19} color="#04120e" />
      </span>
      {!collapsed ? <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, letterSpacing: "-.02em" }}>Avraham</span> : null}
    </div>
  );

  const footer = collapsed ? (
    <IconButton icon="life-buoy" label="Suporte" variant="outline" />
  ) : (
    <div className="glass" style={{ borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700 }}><Icon name="life-buoy" size={15} color="var(--cyan)" />Suporte interno</div>
      <div style={{ fontSize: 11, color: "var(--t3)", lineHeight: 1.5 }}>Resposta média em 4 min. Especialista Avraham dedicado.</div>
      <Button size="sm" variant="outline" iconRight={null} icon="message-square">Abrir chamado</Button>
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <SidebarNav items={NAV} value={screen} onChange={setScreen} collapsed={collapsed} header={brand} footer={footer} style={{ background: "var(--gb)", backdropFilter: "var(--glass-blur)" }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* topbar */}
        <header style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 28px", borderBottom: "1px solid var(--gbo)", background: "var(--gb)", backdropFilter: "var(--glass-blur)", flex: "0 0 auto" }}>
          <IconButton icon={collapsed ? "panel-left-open" : "panel-left-close"} label="Menu" onClick={() => setCollapsed(c => !c)} />
          <div style={{ position: "relative" }}>
            <select value={org} onChange={e => setOrg(e.target.value)} style={{ appearance: "none", background: "var(--gb)", border: "1px solid var(--gbo)", borderRadius: 999, padding: "8px 34px 8px 14px", color: "var(--t1)", font: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              {DB.orgs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
            <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><Icon name="chevrons-up-down" size={15} color="var(--t3)" /></span>
          </div>
          <Badge tone="info" uppercase={false}>Plano {orgObj.plan}</Badge>
          <div style={{ flex: 1, maxWidth: 380 }}><Input icon="search" placeholder="Buscar contatos, negócios, conversas..." /></div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <IconButton icon={theme === "dark" ? "sun" : "moon"} label="Tema" variant="outline" onClick={() => setTheme(t => t === "dark" ? "light" : "dark")} />
            <IconButton icon="bell" label="Notificações" variant="outline" />
            <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 8, borderLeft: "1px solid var(--gbo)" }}>
              <Avatar name={DB.user.name} size={36} status="online" />
              <div style={{ lineHeight: 1.2 }}><div style={{ fontSize: 13, fontWeight: 700 }}>{DB.user.name}</div><div style={{ fontSize: 11, color: "var(--t3)" }}>Nível {DB.user.level} · #1</div></div>
            </div>
          </div>
        </header>
        <main style={{ flex: 1, overflowY: "auto", padding: 28, position: "relative" }}>
          <div style={{ position: "relative", zIndex: 1, height: screen === "conversas" ? "100%" : "auto" }}>
            <Screen go={setScreen} />
          </div>
        </main>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
