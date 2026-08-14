import type { RuntimeMessage } from "../core/messages";
import { debounce } from "../core/debounce";
import { detectPlatform } from "./platform";
import { runAdapter } from "./adapters";

let autoEnabled = false;
let observer: MutationObserver | null = null;
const isQueuePage = new URLSearchParams(location.search).get("lhQueue") === "1";

async function upsertToBackground(payload: { platform: string; title: string; leads: any[] }): Promise<number> {
  if (!payload.leads.length) return 0;
  try {
    const res: any = await chrome.runtime.sendMessage({
      type: "CONTENT_UPSERT_LEADS",
      url: location.href,
      platform: payload.platform,
      title: payload.title,
      leads: payload.leads,
    } satisfies RuntimeMessage);
    if (res?.ok) return Number(res.count || 0);
    return 0;
  } catch {
    return 0;
  }
}

async function captureNow(): Promise<number> {
  const platform = detectPlatform(location);
  const result = runAdapter(platform);
  return upsertToBackground({ platform: result.platform, title: document.title || "", leads: result.leads });
}

const debouncedCapture = debounce(async () => {
  if (!autoEnabled) return;
  await captureNow();
}, 900);

function startObserver(): void {
  if (observer) return;
  observer = new MutationObserver(() => debouncedCapture());
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
}

function stopObserver(): void {
  observer?.disconnect();
  observer = null;
}

async function initFromSettings(): Promise<void> {
  try {
    if (isQueuePage) {
      autoEnabled = false;
      return;
    }
    const res: any = await chrome.runtime.sendMessage({ type: "GET_SETTINGS" } satisfies RuntimeMessage);
    autoEnabled = Boolean(res?.settings?.autoCapture);
    if (autoEnabled) startObserver();
  } catch {
    // ignore
  }
}

chrome.runtime.onMessage.addListener((msg: RuntimeMessage, _sender, sendResponse) => {
  (async () => {
    if (msg.type === "CONTENT_CAPTURE_NOW") {
      const count = await captureNow();
      sendResponse({ ok: true, count });
      return;
    }
    if (msg.type === "CONTENT_SET_AUTO_CAPTURE") {
      if (isQueuePage) {
        autoEnabled = false;
        stopObserver();
        sendResponse({ ok: true });
        return;
      }
      autoEnabled = msg.enabled;
      if (autoEnabled) startObserver();
      else stopObserver();
      sendResponse({ ok: true });
      return;
    }
    sendResponse({ ok: false, error: "Unknown message." });
  })();
  return true;
});

initFromSettings();
