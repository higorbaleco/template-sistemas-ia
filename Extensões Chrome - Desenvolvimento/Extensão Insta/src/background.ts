import type { ExportPayload } from './shared/types';

type Message =
  | { type: 'EXPORT_JSON'; payload: ExportPayload; filenameBase?: string }
  | { type: 'STORE_RESULT'; payload: ExportPayload }
  | { type: 'GET_LAST_RESULT' }
  | { type: 'PING' };

const STORAGE_KEY = 'igci:last_result';

chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
  void (async () => {
    try {
      if (message?.type === 'PING') {
        sendResponse({ ok: true });
        return;
      }

      if (message?.type === 'STORE_RESULT') {
        await chrome.storage.local.set({ [STORAGE_KEY]: message.payload });
        sendResponse({ ok: true });
        return;
      }

      if (message?.type === 'GET_LAST_RESULT') {
        const data = await chrome.storage.local.get(STORAGE_KEY);
        sendResponse({ ok: true, payload: data[STORAGE_KEY] ?? null });
        return;
      }

      if (message?.type === 'EXPORT_JSON') {
        const json = JSON.stringify(message.payload, null, 2);
        const filename =
          (message.filenameBase?.trim() || defaultFilenameBase(message.payload.profile)) + '.json';

        // MV3-safe approach: use a data URL.
        const url = `data:application/json;charset=utf-8,${encodeURIComponent(json)}`;
        const id = await chrome.downloads.download({
          url,
          filename,
          saveAs: true,
        });
        sendResponse({ ok: true, downloadId: id });
        return;
      }

      sendResponse({ ok: false, error: 'unknown_message' });
    } catch (err) {
      sendResponse({ ok: false, error: String(err) });
    }
  })();

  return true; // keep the message channel open for async responses
});

function defaultFilenameBase(profile: string): string {
  const safeProfile = (profile || 'profile').replace(/[^a-z0-9_-]+/gi, '-');
  const stamp = new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\..*$/, '')
    .replace('T', '-');
  return `ig-content-${safeProfile}-${stamp}`;
}

