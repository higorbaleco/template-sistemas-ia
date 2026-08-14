import type { CaptureLog, Lead, QueueItem, QueueRunState, Settings } from "./types";
import { nowIso } from "./time";
import { mergeLead } from "./lead";
import { uid } from "./id";
import {
  markQueueError,
  markQueueProcessed,
  markQueueRunning,
  normalizeQueueItem,
  normalizeQueueState,
  resetErrorQueueItem,
  resetRunningQueueItem,
} from "./queue";

const DEFAULT_SETTINGS: Settings = {
  autoCapture: false,
  lang: "pt-BR",
};

function migrateLead(anyLead: any): Lead | null {
  if (!anyLead) return null;
  // New format
  if (typeof anyLead.origemUrl === "string") {
    return {
      id: String(anyLead.id || uid("lead")),
      origemUrl: anyLead.origemUrl,
      nome: anyLead.nome || undefined,
      empresa: anyLead.empresa || undefined,
      cargo: anyLead.cargo || undefined,
      localizacao: anyLead.localizacao || undefined,
      telefone: anyLead.telefone || undefined,
      email: anyLead.email || undefined,
      whatsappUrl: anyLead.whatsappUrl || undefined,
      linkedinUrl: anyLead.linkedinUrl || undefined,
      siteUrl: anyLead.siteUrl || undefined,
      origemTitulo: anyLead.origemTitulo || undefined,
      origemPlataforma: anyLead.origemPlataforma || undefined,
      score: Number(anyLead.score || 0),
      confidence: Number(anyLead.confidence || 0.6),
      status: (anyLead.status as any) || "new",
      tags: Array.isArray(anyLead.tags) ? anyLead.tags : [],
      lists: Array.isArray(anyLead.lists) ? anyLead.lists : [],
      dataCaptura: anyLead.dataCaptura || nowIso(),
      updatedAt: anyLead.updatedAt || nowIso(),
    };
  }

  // Old format
  if (typeof anyLead.origem_url === "string") {
    const now = nowIso();
    return {
      id: String(anyLead.id || uid("lead")),
      nome: anyLead.nome || undefined,
      empresa: anyLead.empresa || undefined,
      telefone: anyLead.telefone || undefined,
      origemUrl: anyLead.origem_url,
      origemTitulo: undefined,
      origemPlataforma: undefined,
      score: 0,
      confidence: 0.6,
      status: "new",
      tags: [],
      lists: [],
      dataCaptura: anyLead.data_captura || now,
      updatedAt: anyLead.updated_at || now,
    };
  }

  return null;
}

function migrateQueueItem(anyItem: any): QueueItem | null {
  return normalizeQueueItem(anyItem);
}

function storageGet<T>(keys: string[]): Promise<Record<string, T>> {
  return new Promise((resolve) => chrome.storage.local.get(keys, (items) => resolve(items as any)));
}

function storageSet(items: Record<string, unknown>): Promise<void> {
  return new Promise((resolve) => chrome.storage.local.set(items, () => resolve()));
}

export async function getSettings(): Promise<Settings> {
  const got = await storageGet<Settings>(["settings"]);
  return (got.settings as Settings) || DEFAULT_SETTINGS;
}

export async function setSettings(next: Partial<Settings>): Promise<Settings> {
  const cur = await getSettings();
  const merged: Settings = { ...cur, ...next };
  await storageSet({ settings: merged });
  return merged;
}

export async function getLeads(): Promise<Lead[]> {
  const got = await storageGet<Lead[]>(["leads"]);
  const raw = (got.leads as any[]) || [];
  const migrated = raw.map(migrateLead).filter(Boolean) as Lead[];
  if (migrated.length !== raw.length) {
    await storageSet({ leads: migrated });
  }
  return migrated;
}

function leadKey(lead: Lead): string {
  if (lead.telefone) return `phone:${lead.telefone}`;
  if (lead.email) return `email:${lead.email}`;
  if (lead.linkedinUrl) return `li:${lead.linkedinUrl}`;
  if (lead.siteUrl) return `site:${lead.siteUrl}`;
  return `src:${lead.origemUrl}:${lead.nome || ""}`.slice(0, 220);
}

export async function upsertLeads(input: Lead[], url: string): Promise<number> {
  const cur = await getLeads();
  const byKey = new Map<string, Lead>();
  for (const lead of cur) byKey.set(leadKey(lead), lead);

  let inserted = 0;
  for (const lead of input) {
    const key = leadKey(lead);
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, lead);
      inserted += 1;
    } else {
      byKey.set(key, mergeLead(existing, lead));
    }
  }

  const next = Array.from(byKey.values()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  await storageSet({ leads: next });
  await appendCaptureLog(url, inserted);
  return inserted;
}

export async function deleteLeads(ids: string[]): Promise<number> {
  const cur = await getLeads();
  const keep = cur.filter((l) => !ids.includes(l.id));
  await storageSet({ leads: keep });
  return cur.length - keep.length;
}

export async function updateLead(id: string, patch: Partial<Lead>): Promise<Lead | null> {
  const cur = await getLeads();
  const idx = cur.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  const next = cur.slice();
  next[idx] = mergeLead(next[idx], patch);
  await storageSet({ leads: next });
  return next[idx];
}

export async function appendCaptureLog(url: string, inserted: number): Promise<void> {
  const got = await storageGet<CaptureLog[]>(["capture_logs"]);
  const logs = (got.capture_logs as CaptureLog[]) || [];
  logs.push({ id: uid("log"), url, quantidade_leads: inserted, data: nowIso() });
  await storageSet({ capture_logs: logs.slice(-200) });
}

export async function getQueue(): Promise<QueueItem[]> {
  const got = await storageGet<QueueItem[]>(["queue"]);
  const raw = (got.queue as any[]) || [];
  const normalized = raw.map(migrateQueueItem).filter(Boolean) as QueueItem[];
  const needsWriteBack =
    normalized.length !== raw.length ||
    raw.some((item, idx) => {
      const next = normalized[idx];
      return !next || next.url !== item?.url || next.status !== item?.status || next.attempts === undefined;
    });
  if (needsWriteBack) {
    await storageSet({ queue: normalized });
  }
  return normalized;
}

export async function getQueueState(): Promise<QueueRunState> {
  const got = await storageGet<QueueRunState>(["queue_state"]);
  return normalizeQueueState(got.queue_state);
}

export async function setQueueState(next: Partial<QueueRunState>): Promise<QueueRunState> {
  const cur = await getQueueState();
  const merged: QueueRunState = {
    ...cur,
    ...next,
    updatedAt: nowIso(),
    isRunning: Boolean(next.isRunning ?? cur.isRunning),
  };
  await storageSet({ queue_state: merged });
  return merged;
}

export async function addQueueUrls(urls: string[]): Promise<number> {
  const cur = await getQueue();
  const byUrl = new Map(cur.map((q) => [q.url, q]));
  let added = 0;
  for (const u of urls.map((x) => x.trim()).filter(Boolean)) {
    if (byUrl.has(u)) continue;
    const now = nowIso();
    byUrl.set(u, {
      id: uid("q"),
      url: u,
      status: "pending",
      extractedLeads: 0,
      attempts: 0,
      createdAt: now,
      updatedAt: now,
    });
    added += 1;
  }
  const next = Array.from(byUrl.values()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  await storageSet({ queue: next });
  return added;
}

export async function setQueueStatus(id: string, status: QueueItem["status"], lastError?: string): Promise<void> {
  const cur = await getQueue();
  const next = cur.map((q) => {
    if (q.id !== id) return q;
    if (status === "running") return markQueueRunning(q);
    if (status === "processed") return markQueueProcessed(q, q.extractedLeads || 0);
    if (status === "error") return markQueueError(q, lastError || "Unknown queue error.");
    return { ...q, status: "pending", lastError: undefined, updatedAt: nowIso() };
  });
  await storageSet({ queue: next });
}

export async function updateQueueItem(id: string, patch: Partial<QueueItem>): Promise<QueueItem | null> {
  const cur = await getQueue();
  const idx = cur.findIndex((item) => item.id === id);
  if (idx === -1) return null;
  const next = cur.slice();
  next[idx] = { ...next[idx], ...patch, updatedAt: nowIso() };
  await storageSet({ queue: next });
  return next[idx];
}

export async function repairQueueAfterRestart(): Promise<void> {
  const queue = await getQueue();
  const repaired = queue.map((item) => resetRunningQueueItem(item));
  if (repaired.some((item, idx) => item !== queue[idx])) {
    await storageSet({ queue: repaired });
  }

  const state = await getQueueState();
  if (state.isRunning) {
    await setQueueState({
      isRunning: true,
      currentQueueId: undefined,
      currentTabId: undefined,
      startedAt: state.startedAt || nowIso(),
    });
  } else if (state.currentQueueId || state.currentTabId) {
    await setQueueState({ isRunning: false, currentQueueId: undefined, currentTabId: undefined });
  }
}

export async function resetErroredQueueItems(): Promise<number> {
  const queue = await getQueue();
  let changed = 0;
  const next = queue.map((item) => {
    const reset = resetErrorQueueItem(item);
    if (reset !== item) changed += 1;
    return reset;
  });
  if (changed) await storageSet({ queue: next });
  return changed;
}
