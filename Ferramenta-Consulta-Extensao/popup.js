const DEFAULT_URL = "http://127.0.0.1:5050";

async function getBackendUrl() {
  const data = await chrome.storage.sync.get({ backendUrl: DEFAULT_URL });
  return String(data.backendUrl || DEFAULT_URL).trim().replace(/\/+$/, "");
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

  try {
    const response = await fetch(`${baseUrl}/stats`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const stats = await response.json();
    setStatus(
      true,
      `Buscas: ${stats.searches || 0} | Links: ${stats.links_found || 0} | Válidos: ${stats.valid || 0}`,
    );
  } catch (_) {
    setStatus(false, "Backend não respondeu. Inicie o app local.");
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
