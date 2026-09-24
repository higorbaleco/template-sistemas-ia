const DEFAULT_URL = "http://127.0.0.1:5050";

function normalizeUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return DEFAULT_URL;

  const withProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : `http://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return DEFAULT_URL;
    }
    parsed.hash = "";
    parsed.search = "";
    return parsed.toString().replace(/\/+$/, "");
  } catch (_) {
    return DEFAULT_URL;
  }
}

async function getBackendUrl() {
  const data = await chrome.storage.sync.get({ backendUrl: DEFAULT_URL });
  return normalizeUrl(data.backendUrl || DEFAULT_URL);
}

function setStatus(isOnline, statsText = "") {
  const statusEl = document.getElementById("status-text");
  const statsEl = document.getElementById("stats-text");

  statusEl.textContent = isOnline ? "Online" : "Offline";
  statusEl.classList.remove("online", "offline");
  statusEl.classList.add(isOnline ? "online" : "offline");
  statsEl.textContent = statsText || (isOnline ? "Conectado." : "Sem conexão com o backend.");
}

async function checkStatus() {
  const baseUrl = await getBackendUrl();
  document.getElementById("backend-url").textContent = baseUrl;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  try {
    const response = await fetch(`${baseUrl}/stats`, {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const stats = await response.json();
    setStatus(
      true,
      `Buscas: ${stats.searches || 0} | Links: ${stats.links_found || 0} | Válidos: ${stats.valid || 0}`,
    );
  } catch (error) {
    if (error && error.name === "AbortError") {
      setStatus(false, "Backend sem resposta (timeout). Inicie o app local.");
    } else {
      setStatus(false, "Backend não respondeu. Inicie o app local.");
    }
  } finally {
    clearTimeout(timeout);
  }
}

async function openPanel() {
  const baseUrl = await getBackendUrl();
  await chrome.tabs.create({ url: baseUrl });
}

function openOptionsPage() {
  chrome.runtime.openOptionsPage();
}

document.getElementById("btn-open").addEventListener("click", openPanel);
document.getElementById("btn-refresh").addEventListener("click", checkStatus);
document.getElementById("btn-options").addEventListener("click", openOptionsPage);

checkStatus();
