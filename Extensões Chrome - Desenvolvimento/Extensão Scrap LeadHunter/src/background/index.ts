import type { RuntimeMessage, RuntimeResponse } from "../core/messages";
import { createLead } from "../core/lead";
import { normalizeEmail } from "../core/normalize";
import { normalizePhoneBR } from "../core/phone";
import { leadsToCsv } from "../core/csv";
import { clampConfidence, computeScore } from "../core/score";
import {
  addQueueUrls,
  deleteLeads,
  getLeads,
  getQueue,
  getQueueState,
  getSettings,
  repairQueueAfterRestart,
  resetErroredQueueItems,
  setQueueState,
  setQueueStatus,
  setSettings,
  updateLead,
  updateQueueItem,
  upsertLeads,
} from "../core/storage";
import {
  MAX_QUEUE_ATTEMPTS,
  markQueueError,
  markQueueProcessed,
  markQueueRunning,
  selectNextQueueItem,
} from "../core/queue";

const QUEUE_READY_TIMEOUT_MS = 20_000;
const QUEUE_CAPTURE_TIMEOUT_MS = 20_000;
const QUEUE_STEP_DELAY_MS = 650;
const QUEUE_ALARM_NAME = "lh-queue-process";

class QueueStoppedError extends Error {
  constructor() {
    super("Queue processing stopped.");
  }
}

let queueLoopPromise: Promise<void> | null = null;
let stopRequested = false;

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function buildQueueUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    url.searchParams.set("lhQueue", "1");
    url.hash = "";
    return url.toString();
  } catch {
    return rawUrl;
  }
}

async function getActiveTabId(): Promise<number | null> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab?.id ?? null;
}

async function broadcastAutoCapture(enabled: boolean): Promise<void> {
  const tabs = await chrome.tabs.query({});
  await Promise.all(
    tabs
      .filter((t) => typeof t.id === "number")
      .map((t) =>
        chrome.tabs
          .sendMessage(t.id!, { type: "CONTENT_SET_AUTO_CAPTURE", enabled } satisfies RuntimeMessage)
          .catch(() => undefined),
      ),
  );
}

async function removeTabSafe(tabId?: number): Promise<void> {
  if (typeof tabId !== "number") return;
  try {
    await chrome.tabs.remove(tabId);
  } catch {
    // ignore
  }
}

async function waitForTabReady(tabId: number): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < QUEUE_READY_TIMEOUT_MS) {
    if (stopRequested) throw new QueueStoppedError();
    try {
      const tab = await chrome.tabs.get(tabId);
      if (tab.status === "complete") return;
    } catch {
      // ignore transient tab errors while loading
    }
    await sleep(300);
  }
  throw new Error("Timed out waiting for the page to finish loading.");
}

async function captureWithRetry(tabId: number): Promise<number> {
  const start = Date.now();
  let lastError: string | undefined;
  while (Date.now() - start < QUEUE_CAPTURE_TIMEOUT_MS) {
    if (stopRequested) throw new QueueStoppedError();
    try {
      const res: any = await chrome.tabs.sendMessage(tabId, {
        type: "CONTENT_CAPTURE_NOW",
      } satisfies RuntimeMessage);
      if (res?.ok) return Number(res.count || 0);
      lastError = res?.error || "Capture failed.";
    } catch (e: any) {
      lastError = e?.message || String(e);
    }
    await sleep(700);
  }
  throw new Error(lastError || "Timed out while capturing the page.");
}

async function processQueueItem(queueItemId: string, rawUrl: string): Promise<number> {
  const tab = await chrome.tabs.create({
    url: buildQueueUrl(rawUrl),
    active: false,
  });
  if (typeof tab.id !== "number") {
    throw new Error("Unable to open a processing tab.");
  }

  try {
    await setQueueState({
      isRunning: true,
      currentQueueId: queueItemId,
      currentTabId: tab.id,
      startedAt: (await getQueueState()).startedAt || new Date().toISOString(),
    });
    await waitForTabReady(tab.id);
    await sleep(QUEUE_STEP_DELAY_MS);
    return await captureWithRetry(tab.id);
  } finally {
    await removeTabSafe(tab.id);
    await setQueueState({ currentTabId: undefined });
  }
}

async function processQueueLoop(): Promise<void> {
  if (queueLoopPromise) return queueLoopPromise;

  queueLoopPromise = (async () => {
    try {
      stopRequested = false;

      while (true) {
        const state = await getQueueState();
        if (!state.isRunning || stopRequested) break;

        const queue = await getQueue();
        const next = selectNextQueueItem(queue);
        if (!next) {
          await setQueueState({
            isRunning: false,
            currentQueueId: undefined,
            currentTabId: undefined,
          });
          break;
        }

        const running = markQueueRunning(next);
        await updateQueueItem(next.id, running);
        await setQueueState({
          isRunning: true,
          currentQueueId: next.id,
          currentTabId: undefined,
          startedAt: state.startedAt || new Date().toISOString(),
        });

        try {
          const count = await processQueueItem(next.id, next.url);
          const processed = markQueueProcessed(running, count);
          await updateQueueItem(next.id, processed);
        } catch (e: any) {
          if (e instanceof QueueStoppedError) {
            await updateQueueItem(next.id, {
              status: "pending",
              lastError: undefined,
              updatedAt: new Date().toISOString(),
            });
            break;
          }

          const failure = markQueueError(running, e?.message || String(e));
          await updateQueueItem(next.id, failure);
          if ((running.attempts || 0) >= MAX_QUEUE_ATTEMPTS) {
            await updateQueueItem(next.id, {
              status: "error",
              lastError: e?.message || String(e),
            });
          } else {
            await updateQueueItem(next.id, {
              status: "pending",
              lastError: e?.message || String(e),
            });
            await sleep(1000);
          }
        } finally {
          await setQueueState({
            isRunning: (await getQueueState()).isRunning && !stopRequested,
            currentQueueId: undefined,
            currentTabId: undefined,
          });
        }
      }
    } finally {
      queueLoopPromise = null;
      if (stopRequested) {
        stopRequested = false;
      }
    }
  })();

  return queueLoopPromise;
}

async function startQueueProcessing(): Promise<void> {
  const state = await getQueueState();
  await setQueueState({
    isRunning: true,
    currentQueueId: undefined,
    currentTabId: undefined,
    startedAt: state.startedAt || new Date().toISOString(),
  });
  chrome.alarms.create(QUEUE_ALARM_NAME, { periodInMinutes: 1 });
  void processQueueLoop();
}

async function stopQueueProcessing(): Promise<void> {
  stopRequested = true;
  await chrome.alarms.clear(QUEUE_ALARM_NAME);
  const state = await getQueueState();
  if (state.currentQueueId) {
    await updateQueueItem(state.currentQueueId, {
      status: "pending",
      lastError: undefined,
      updatedAt: new Date().toISOString(),
    });
  }
  await removeTabSafe(state.currentTabId);
  await setQueueState({
    isRunning: false,
    currentQueueId: undefined,
    currentTabId: undefined,
  });
}

async function retryErroredQueue(): Promise<number> {
  const count = await resetErroredQueueItems();
  const state = await getQueueState();
  if (state.isRunning) {
    void processQueueLoop();
  }
  return count;
}

async function bootstrapQueue(): Promise<void> {
  await repairQueueAfterRestart();
  const state = await getQueueState();
  if (state.isRunning) {
    chrome.alarms.create(QUEUE_ALARM_NAME, { periodInMinutes: 1 });
    void processQueueLoop();
  } else {
    await chrome.alarms.clear(QUEUE_ALARM_NAME);
  }
}

chrome.runtime.onStartup.addListener(() => {
  void bootstrapQueue();
});

chrome.runtime.onInstalled.addListener(() => {
  void bootstrapQueue();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== QUEUE_ALARM_NAME) return;
  if (queueLoopPromise) return;
  void bootstrapQueue();
});

chrome.runtime.onMessage.addListener((msg: RuntimeMessage, _sender, sendResponse) => {
  (async (): Promise<RuntimeResponse> => {
    try {
      switch (msg.type) {
        case "GET_SETTINGS": {
          const settings = await getSettings();
          return { ok: true, settings };
        }
        case "TOGGLE_AUTO_CAPTURE": {
          const settings = await setSettings({ autoCapture: msg.enabled });
          await broadcastAutoCapture(settings.autoCapture);
          return { ok: true, settings };
        }
        case "SET_LANG": {
          const settings = await setSettings({ lang: msg.lang });
          return { ok: true, settings };
        }
        case "OPEN_DASHBOARD": {
          const url = chrome.runtime.getURL("dashboard.html");
          await chrome.tabs.create({ url });
          return { ok: true };
        }
        case "CAPTURE_CURRENT_PAGE": {
          const tabId = await getActiveTabId();
          if (tabId === null) return { ok: false, error: "No active tab." };
          const res = (await chrome.tabs.sendMessage(tabId, {
            type: "CONTENT_CAPTURE_NOW",
          } satisfies RuntimeMessage)) as any;
          if (res?.ok) return { ok: true, count: Number(res.count || 0) };
          return { ok: false, error: res?.error || "Capture failed." };
        }
        case "CONTENT_UPSERT_LEADS": {
          const leads = msg.leads
            .map((l) => {
              const telefone = l.telefone ? normalizePhoneBR(l.telefone) || l.telefone : undefined;
              const email = normalizeEmail(l.email);
              const lead = createLead({
                origemUrl: msg.url,
                origemTitulo: msg.title,
                origemPlataforma: msg.platform,
                nome: l.nome,
                empresa: l.empresa,
                cargo: l.cargo,
                localizacao: l.localizacao,
                telefone,
                email,
                whatsappUrl: l.whatsappUrl,
                linkedinUrl: l.linkedinUrl,
                siteUrl: l.siteUrl,
                baseConfidence: clampConfidence(l.confidence, 0.6),
              });
              lead.score = computeScore(lead);
              return lead;
            })
            .filter((lead) => !!(lead.telefone || lead.email || lead.linkedinUrl || lead.siteUrl || lead.whatsappUrl));
          const inserted = await upsertLeads(leads, msg.url);
          return { ok: true, count: inserted };
        }
        case "GET_LEADS": {
          const leads = await getLeads();
          return { ok: true, leads };
        }
        case "UPDATE_LEAD": {
          const updated = await updateLead(msg.id, msg.patch as any);
          if (!updated) return { ok: false, error: "Lead not found." };
          return { ok: true };
        }
        case "DELETE_LEADS": {
          const count = await deleteLeads(msg.ids);
          return { ok: true, count };
        }
        case "EXPORT_CSV": {
          const leads = await getLeads();
          const csv = leadsToCsv(leads, ";");
          return { ok: true, csv };
        }
        case "GET_QUEUE": {
          const queue = await getQueue();
          return { ok: true, queue };
        }
        case "GET_QUEUE_STATE": {
          const queue = await getQueue();
          const queueState = await getQueueState();
          return { ok: true, queue, queueState };
        }
        case "QUEUE_ADD_URLS": {
          const count = await addQueueUrls(
            msg.urls.map((url) => url.replace(/\s+/g, " ").trim()).filter(Boolean),
          );
          const state = await getQueueState();
          if (state.isRunning) {
            void processQueueLoop();
          }
          return { ok: true, count };
        }
        case "QUEUE_START_PROCESSING": {
          await startQueueProcessing();
          return { ok: true };
        }
        case "QUEUE_STOP_PROCESSING": {
          await stopQueueProcessing();
          return { ok: true };
        }
        case "QUEUE_RETRY_ERRORS": {
          const count = await retryErroredQueue();
          return { ok: true, count };
        }
        case "QUEUE_SET_STATUS": {
          await setQueueStatus(msg.id, msg.status, msg.lastError);
          return { ok: true };
        }
        default:
          return { ok: false, error: "Unknown message." };
      }
    } catch (e: any) {
      return { ok: false, error: e?.message || String(e) };
    }
  })().then((res) => sendResponse(res));
  return true;
});

void bootstrapQueue();
