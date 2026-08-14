import "../shared/styles.css";
import type { RuntimeMessage } from "../../core/messages";
import type { Lead, QueueItem, QueueRunState, Settings } from "../../core/types";
import { t } from "../../core/i18n";
import { summarizeQueue } from "../../core/queue";
import { waMeUrlFromE164 } from "../../core/phone";
import { detectPlatformFromUrl } from "../../content/platform";

async function send<T = any>(msg: RuntimeMessage): Promise<T> {
  return (await chrome.runtime.sendMessage(msg)) as T;
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  return node;
}

async function loadSettings(): Promise<Settings> {
  const res: any = await send({ type: "GET_SETTINGS" });
  return (res?.settings as Settings) || { autoCapture: false, lang: "pt-BR" };
}

async function loadLeads(): Promise<Lead[]> {
  const res: any = await send({ type: "GET_LEADS" });
  return (res?.leads as Lead[]) || [];
}

async function loadQueue(): Promise<QueueItem[]> {
  const res: any = await send({ type: "GET_QUEUE" });
  return (res?.queue as QueueItem[]) || [];
}

async function loadQueueState(): Promise<QueueRunState> {
  const res: any = await send({ type: "GET_QUEUE_STATE" });
  return (res?.queueState as QueueRunState) || { isRunning: false, updatedAt: new Date().toISOString() };
}

function downloadText(filename: string, text: string): void {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function uniqOrigins(leads: Lead[]): string[] {
  const set = new Set<string>();
  for (const l of leads) {
    try {
      set.add(new URL(l.origemUrl).hostname);
    } catch {
      // ignore
    }
  }
  return Array.from(set).sort();
}

type View = "leads" | "queue";
let currentView: View = "leads";
let refreshTimer: number | null = null;

function ensureRefreshLoop(root: HTMLElement, settings: Settings): void {
  if (refreshTimer !== null) return;
  refreshTimer = window.setInterval(async () => {
    if (document.visibilityState !== "visible" || currentView !== "queue") return;
    const active = document.activeElement as HTMLElement | null;
    if (active && ["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName)) return;
    const nextQueue = await loadQueue();
    const nextLeads = await loadLeads();
    const nextState = await loadQueueState();
    render(root, settings, nextLeads, nextQueue, nextState, "queue");
  }, 5000);
}

function render(
  root: HTMLElement,
  settings: Settings,
  leads: Lead[],
  queue: QueueItem[],
  queueState: QueueRunState,
  view: View,
): void {
  currentView = view;
  root.innerHTML = "";
  const shell = el("div", "lh-shell");

  const card = el("div", "lh-card");
  const header = el("div", "lh-header");
  const brand = el("div", "lh-brand");
  brand.appendChild(el("div", "lh-logo"));
  const title = el("div");
  const h = el("div", "lh-title");
  h.textContent = t(settings.lang, "dashboard_title");
  const sub = el("div", "lh-subtitle");
  sub.textContent = `${leads.length} leads • ${queue.length} queue`;
  title.appendChild(h);
  title.appendChild(sub);
  brand.appendChild(title);

  const tabs = el("div", "lh-tabs");
  const tabLeads = el("button", "lh-tab");
  tabLeads.textContent = t(settings.lang, "tab_leads");
  tabLeads.setAttribute("aria-selected", view === "leads" ? "true" : "false");
  tabLeads.addEventListener("click", async () => {
    const nextQueue = await loadQueue();
    const nextLeads = await loadLeads();
    const nextState = await loadQueueState();
    render(root, settings, nextLeads, nextQueue, nextState, "leads");
  });
  const tabQueue = el("button", "lh-tab");
  tabQueue.textContent = t(settings.lang, "tab_queue");
  tabQueue.setAttribute("aria-selected", view === "queue" ? "true" : "false");
  tabQueue.addEventListener("click", async () => {
    const nextQueue = await loadQueue();
    const nextLeads = await loadLeads();
    const nextState = await loadQueueState();
    render(root, settings, nextLeads, nextQueue, nextState, "queue");
  });
  tabs.appendChild(tabLeads);
  tabs.appendChild(tabQueue);

  const lang = el("select", "lh-select");
  lang.style.width = "110px";
  const optPt = el("option") as HTMLOptionElement;
  optPt.value = "pt-BR";
  optPt.textContent = "PT-BR";
  const optEn = el("option") as HTMLOptionElement;
  optEn.value = "en";
  optEn.textContent = "EN";
  lang.appendChild(optPt);
  lang.appendChild(optEn);
  lang.value = settings.lang;
  lang.addEventListener("change", async () => {
    const nextLang = (lang.value === "en" ? "en" : "pt-BR") as Settings["lang"];
    const res: any = await send({ type: "SET_LANG", lang: nextLang });
    settings.lang = (res?.settings?.lang as Settings["lang"]) || nextLang;
    const nextLeads = await loadLeads();
    const nextQueue = await loadQueue();
    const nextState = await loadQueueState();
    render(root, settings, nextLeads, nextQueue, nextState, view);
  });

  header.appendChild(brand);
  header.appendChild(tabs);
  header.appendChild(lang);

  const onboarding = el("div", "lh-onboarding");
  const onboardingTitle = el("div", "lh-onboarding-title");
  onboardingTitle.textContent = t(settings.lang, "onboarding_title");
  const onboardingBody = el("div", "lh-muted");
  onboardingBody.textContent = t(settings.lang, "onboarding_body");
  onboarding.appendChild(onboardingTitle);
  onboarding.appendChild(onboardingBody);

  if (view === "leads") {
    const controls = el("div", "lh-controls");
    const search = el("input", "lh-input") as HTMLInputElement;
    search.placeholder = t(settings.lang, "search_placeholder");

    const originSel = el("select", "lh-select") as HTMLSelectElement;
    const optAll = el("option") as HTMLOptionElement;
    optAll.value = "";
    optAll.textContent = `${t(settings.lang, "filter_origin")}: All`;
    originSel.appendChild(optAll);
    for (const host of uniqOrigins(leads)) {
      const opt = el("option") as HTMLOptionElement;
      opt.value = host;
      opt.textContent = host;
      originSel.appendChild(opt);
    }

    controls.appendChild(search);
    controls.appendChild(originSel);

    const actions = el("div", "lh-controls");
    actions.style.paddingTop = "0";

    const exportBtn = el("button", "lh-btn");
    exportBtn.textContent = t(settings.lang, "export_csv");
    exportBtn.addEventListener("click", async () => {
      const res: any = await send({ type: "EXPORT_CSV" });
      const csv = String(res?.csv || "");
      const day = new Date().toISOString().slice(0, 10);
      downloadText(`leadhunter-leads-${day}.csv`, csv);
    });

    const delBtn = el("button", "lh-btn lh-danger");
    delBtn.textContent = t(settings.lang, "delete_selected");
    delBtn.disabled = true;

    actions.appendChild(exportBtn);
    actions.appendChild(delBtn);

    const tableWrap = el("div");
    tableWrap.style.padding = "0 14px 14px";

    const table = el("table", "lh-table");
    const thead = el("thead");
    const trh = el("tr");
    const th0 = el("th");
    const selAll = el("input") as HTMLInputElement;
    selAll.type = "checkbox";
    th0.appendChild(selAll);
    trh.appendChild(th0);
    for (const label of ["Nome", "Empresa", "Contato", "Origem", "Score", "Status", "Ações"]) {
      const th = el("th");
      th.textContent = label;
      trh.appendChild(th);
    }
    thead.appendChild(trh);

    const tbody = el("tbody");

    const selected = new Set<string>();
    let currentFilteredIds: string[] = [];

    const openEditModal = (lead: Lead) => {
      const backdrop = el("div", "lh-modal-backdrop");
      const modal = el("div", "lh-modal");
      const mh = el("div", "lh-header");
      const mt = el("div", "lh-title");
      mt.textContent = t(settings.lang, "edit_lead");
      mh.appendChild(mt);
      modal.appendChild(mh);

      const body = el("div", "lh-modal-body");
      const makeField = (label: string, value: string) => {
        const wrap = el("div", "lh-field");
        const l = el("label");
        l.textContent = label;
        const i = el("input", "lh-input") as HTMLInputElement;
        i.value = value;
        wrap.appendChild(l);
        wrap.appendChild(i);
        return { wrap, input: i };
      };
      const fNome = makeField(t(settings.lang, "field_name"), lead.nome || "");
      const fEmp = makeField(t(settings.lang, "field_company"), lead.empresa || "");
      const fCargo = makeField(t(settings.lang, "field_role"), lead.cargo || "");
      const fLoc = makeField(t(settings.lang, "field_location"), lead.localizacao || "");
      const fTel = makeField(t(settings.lang, "field_phone"), lead.telefone || "");
      const fEmail = makeField(t(settings.lang, "field_email"), lead.email || "");
      const fTags = makeField(t(settings.lang, "field_tags"), (lead.tags || []).join(", "));

      const statusWrap = el("div", "lh-field");
      const sl = el("label");
      sl.textContent = t(settings.lang, "field_status");
      const statusSel = el("select", "lh-select") as HTMLSelectElement;
      for (const s of ["new", "contacted", "qualified", "discarded"]) {
        const opt = el("option") as HTMLOptionElement;
        opt.value = s;
        opt.textContent = s;
        statusSel.appendChild(opt);
      }
      statusSel.value = lead.status || "new";
      statusWrap.appendChild(sl);
      statusWrap.appendChild(statusSel);

      for (const f of [fNome, fEmp, fCargo, fLoc, fTel, fEmail, fTags]) body.appendChild(f.wrap);
      body.appendChild(statusWrap);
      modal.appendChild(body);

      const acts = el("div", "lh-modal-actions");
      const cancel = el("button", "lh-btn lh-secondary");
      cancel.textContent = t(settings.lang, "cancel");
      cancel.addEventListener("click", () => backdrop.remove());
      const save = el("button", "lh-btn");
      save.textContent = t(settings.lang, "save");
      save.addEventListener("click", async () => {
        const tags = fTags.input.value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        await send({
          type: "UPDATE_LEAD",
          id: lead.id,
          patch: {
            nome: fNome.input.value.trim() || undefined,
            empresa: fEmp.input.value.trim() || undefined,
            cargo: fCargo.input.value.trim() || undefined,
            localizacao: fLoc.input.value.trim() || undefined,
            telefone: fTel.input.value.trim() || undefined,
            email: fEmail.input.value.trim() || undefined,
            tags,
            status: statusSel.value,
          },
        });
        backdrop.remove();
        const next = await loadLeads();
        const nextQueue = await loadQueue();
        const nextState = await loadQueueState();
        render(root, settings, next, nextQueue, nextState, "leads");
      });
      acts.appendChild(cancel);
      acts.appendChild(save);
      modal.appendChild(acts);

      backdrop.appendChild(modal);
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) backdrop.remove();
      });
      document.body.appendChild(backdrop);
    };

    const applyFilter = () => {
      const q = search.value.trim().toLowerCase();
      const host = originSel.value;
      const filtered = leads.filter((l) => {
        if (host) {
          try {
            if (new URL(l.origemUrl).hostname !== host) return false;
          } catch {
            return false;
          }
        }
        if (!q) return true;
        const blob = [
          l.nome,
          l.empresa,
          l.telefone,
          l.email,
          l.origemUrl,
          l.origemPlataforma,
          l.linkedinUrl,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return blob.includes(q);
      });
      currentFilteredIds = filtered.map((l) => l.id);

      tbody.innerHTML = "";
      selected.clear();
      selAll.checked = false;
      delBtn.disabled = true;

      if (!filtered.length) {
        const tr = el("tr");
        const td = el("td");
        td.colSpan = 8;
        td.className = "lh-muted";
        td.style.padding = "18px 10px";
        td.textContent = t(settings.lang, "no_leads");
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
      }

      for (const lead of filtered) {
        const tr = el("tr");
        const tdSel = el("td");
        const cb = el("input") as HTMLInputElement;
        cb.type = "checkbox";
        cb.dataset.leadId = lead.id;
        cb.addEventListener("change", () => {
          if (cb.checked) selected.add(lead.id);
          else selected.delete(lead.id);
          delBtn.disabled = selected.size === 0;
          selAll.checked = selected.size > 0 && selected.size === filtered.length;
        });
        tdSel.appendChild(cb);
        tr.appendChild(tdSel);

        const tdNome = el("td");
        tdNome.textContent = lead.nome || "—";
        tr.appendChild(tdNome);

        const tdEmp = el("td");
        tdEmp.textContent = lead.empresa || "—";
        tr.appendChild(tdEmp);

        const tdContato = el("td");
        tdContato.textContent = lead.telefone || lead.email || "—";
        tr.appendChild(tdContato);

        const tdOri = el("td");
        tdOri.textContent = lead.origemPlataforma
          ? `${lead.origemPlataforma} • ${lead.origemUrl}`
          : lead.origemUrl;
        tr.appendChild(tdOri);

        const tdScore = el("td");
        tdScore.textContent = `${lead.score}/${Math.round((lead.confidence || 0) * 100)}%`;
        tr.appendChild(tdScore);

        const tdStatus = el("td");
        tdStatus.textContent = lead.status || "new";
        tr.appendChild(tdStatus);

        const tdAct = el("td");
        tdAct.style.whiteSpace = "nowrap";

        if (lead.telefone || lead.whatsappUrl) {
          const wa = el("button", "lh-btn lh-secondary");
          wa.style.padding = "8px 10px";
          wa.textContent = t(settings.lang, "open_whatsapp");
          const url = lead.whatsappUrl || (lead.telefone ? waMeUrlFromE164(lead.telefone) : "");
          wa.addEventListener("click", () => url && window.open(url, "_blank"));
          tdAct.appendChild(wa);
        }

        if (lead.linkedinUrl) {
          const li = el("button", "lh-btn lh-secondary");
          li.style.padding = "8px 10px";
          li.style.marginLeft = "8px";
          li.textContent = t(settings.lang, "open_linkedin");
          li.addEventListener("click", () => window.open(lead.linkedinUrl!, "_blank"));
          tdAct.appendChild(li);
        }

        const edit = el("button", "lh-btn lh-secondary");
        edit.style.padding = "8px 10px";
        edit.style.marginLeft = "8px";
        edit.textContent = t(settings.lang, "edit_lead");
        edit.addEventListener("click", () => openEditModal(lead));
        tdAct.appendChild(edit);

        tr.appendChild(tdAct);
        tbody.appendChild(tr);
      }
    };

    search.addEventListener("input", applyFilter);
    originSel.addEventListener("change", applyFilter);

    selAll.addEventListener("change", () => {
      const check = selAll.checked;
      const boxes = Array.from(tbody.querySelectorAll("input[type=checkbox]")) as HTMLInputElement[];
      for (const b of boxes) b.checked = check;
      selected.clear();
      if (check) {
        for (const id of currentFilteredIds) selected.add(id);
      }
      delBtn.disabled = selected.size === 0;
    });

    delBtn.addEventListener("click", async () => {
      if (!selected.size) return;
      delBtn.disabled = true;
      await send({ type: "DELETE_LEADS", ids: Array.from(selected) });
      const next = await loadLeads();
      const nextQueue = await loadQueue();
      const nextState = await loadQueueState();
      render(root, settings, next, nextQueue, nextState, "leads");
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    tableWrap.appendChild(table);

    card.appendChild(header);
    card.appendChild(onboarding);
    card.appendChild(controls);
    card.appendChild(actions);
    card.appendChild(tableWrap);
    shell.appendChild(card);
    root.appendChild(shell);

    applyFilter();
    return;
  }

  // Queue view
  const controls = el("div", "lh-controls");
  const ta = document.createElement("textarea");
  ta.className = "lh-input";
  ta.style.minHeight = "90px";
  ta.placeholder = t(settings.lang, "queue_placeholder");
  controls.appendChild(ta);
  const addBtn = el("button", "lh-btn");
  addBtn.textContent = t(settings.lang, "queue_add_urls");
  addBtn.addEventListener("click", async () => {
    const urls = ta.value
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!urls.length) return;
    await send({ type: "QUEUE_ADD_URLS", urls });
    ta.value = "";
    const nextQueue = await loadQueue();
    const nextLeads = await loadLeads();
    const nextState = await loadQueueState();
    render(root, settings, nextLeads, nextQueue, nextState, "queue");
  });
  const actions = el("div", "lh-controls");
  actions.style.paddingTop = "0";
  const startBtn = el("button", "lh-btn");
  startBtn.textContent = t(settings.lang, "queue_start");
  startBtn.disabled = queueState.isRunning;
  startBtn.addEventListener("click", async () => {
    await send({ type: "QUEUE_START_PROCESSING" });
    const nextQueue = await loadQueue();
    const nextLeads = await loadLeads();
    const nextState = await loadQueueState();
    render(root, settings, nextLeads, nextQueue, nextState, "queue");
  });

  const stopBtn = el("button", "lh-btn lh-secondary");
  stopBtn.textContent = t(settings.lang, "queue_stop");
  stopBtn.disabled = !queueState.isRunning;
  stopBtn.addEventListener("click", async () => {
    await send({ type: "QUEUE_STOP_PROCESSING" });
    const nextQueue = await loadQueue();
    const nextLeads = await loadLeads();
    const nextState = await loadQueueState();
    render(root, settings, nextLeads, nextQueue, nextState, "queue");
  });

  const retryBtn = el("button", "lh-btn lh-secondary");
  retryBtn.textContent = t(settings.lang, "queue_retry_failed");
  retryBtn.addEventListener("click", async () => {
    await send({ type: "QUEUE_RETRY_ERRORS" });
    const nextQueue = await loadQueue();
    const nextLeads = await loadLeads();
    const nextState = await loadQueueState();
    render(root, settings, nextLeads, nextQueue, nextState, "queue");
  });

  actions.appendChild(addBtn);
  actions.appendChild(startBtn);
  actions.appendChild(stopBtn);
  actions.appendChild(retryBtn);

  const summary = summarizeQueue(queue, queueState);
  const stateRow = el("div", "lh-row");
  const stateKv = el("div", "lh-kv");
  const stateLabel = el("div", "lh-k");
  stateLabel.textContent = t(settings.lang, "queue_summary");
  const stateValue = el("div", "lh-v");
  const pill = el(
    "span",
    `lh-pill ${queueState.isRunning ? "lh-lime" : ""}`,
  );
  pill.textContent = queueState.isRunning ? t(settings.lang, "queue_running") : t(settings.lang, "queue_idle");
  stateValue.appendChild(pill);
  const meta = el("div", "lh-muted");
  meta.style.marginTop = "6px";
  meta.textContent = `${summary.pending} pending • ${summary.running} running • ${summary.processed} processed • ${summary.error} error`;
  stateKv.appendChild(stateLabel);
  stateKv.appendChild(stateValue);
  stateKv.appendChild(meta);
  stateRow.appendChild(stateKv);

  if (queueState.currentQueueId) {
    const current = queue.find((item) => item.id === queueState.currentQueueId);
    if (current) {
      const currentBox = el("div", "lh-pill");
      currentBox.style.marginLeft = "auto";
      let host = current.url;
      try {
        host = new URL(current.url).hostname;
      } catch {
        // keep raw URL if parsing fails
      }
      currentBox.textContent = `${t(settings.lang, "queue_current")}: ${detectPlatformFromUrl(current.url)} • ${host}`;
      stateRow.appendChild(currentBox);
    }
  }

  const tableWrap = el("div");
  tableWrap.style.padding = "0 14px 14px";
  const table = el("table", "lh-table");
  const thead = el("thead");
  const trh = el("tr");
  for (const label of ["URL", t(settings.lang, "queue_status"), t(settings.lang, "queue_attempts"), "Leads", "Ações"]) {
    const th = el("th");
    th.textContent = label;
    trh.appendChild(th);
  }
  thead.appendChild(trh);
  const tbody = el("tbody");
  for (const item of queue) {
    const tr = el("tr");
    const tdUrl = el("td");
    tdUrl.textContent = `${detectPlatformFromUrl(item.url)} • ${item.url}`;
    tr.appendChild(tdUrl);
    const tdSt = el("td");
    tdSt.textContent = item.status;
    tr.appendChild(tdSt);
    const tdAtt = el("td");
    tdAtt.textContent = String(item.attempts || 0);
    tr.appendChild(tdAtt);
    const tdN = el("td");
    tdN.textContent = String(item.extractedLeads || 0);
    tr.appendChild(tdN);
    const tdA = el("td");
    const open = el("button", "lh-btn lh-secondary");
    open.style.padding = "8px 10px";
    open.textContent = t(settings.lang, "queue_open");
    open.addEventListener("click", () => window.open(item.url, "_blank"));
    tdA.appendChild(open);
    tr.appendChild(tdA);
    tbody.appendChild(tr);
  }
  table.appendChild(thead);
  table.appendChild(tbody);
  tableWrap.appendChild(table);

  card.appendChild(header);
  card.appendChild(onboarding);
  card.appendChild(stateRow);
  card.appendChild(controls);
  card.appendChild(actions);
  card.appendChild(tableWrap);
  shell.appendChild(card);
  root.appendChild(shell);
}

async function main(): Promise<void> {
  const root = document.getElementById("app");
  if (!root) return;
  const settings = await loadSettings();
  const leads = await loadLeads();
  const queue = await loadQueue();
  const queueState = await loadQueueState();
  render(root, settings, leads, queue, queueState, "leads");
  ensureRefreshLoop(root, settings);
}

main();
