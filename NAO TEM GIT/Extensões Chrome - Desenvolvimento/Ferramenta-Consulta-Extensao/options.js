const DEFAULT_URL = "http://127.0.0.1:5050";

function normalizeUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return DEFAULT_URL;
  return trimmed.replace(/\/+$/, "");
}

async function loadSettings() {
  const data = await chrome.storage.sync.get({ backendUrl: DEFAULT_URL });
  document.getElementById("backend-url").value = normalizeUrl(data.backendUrl);
}

async function saveSettings() {
  const input = document.getElementById("backend-url");
  const backendUrl = normalizeUrl(input.value);
  await chrome.storage.sync.set({ backendUrl });
  input.value = backendUrl;

  const feedback = document.getElementById("feedback");
  feedback.textContent = "Configuração salva.";
  setTimeout(() => {
    feedback.textContent = "";
  }, 2200);
}

async function resetDefault() {
  document.getElementById("backend-url").value = DEFAULT_URL;
  await saveSettings();
}

document.getElementById("btn-save").addEventListener("click", saveSettings);
document.getElementById("btn-default").addEventListener("click", resetDefault);

loadSettings();
