const DEFAULT_URL = "http://127.0.0.1:5050";

function normalizeUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) {
    return { url: DEFAULT_URL, error: null };
  }

  const withProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : `http://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("unsupported_protocol");
    }
    parsed.hash = "";
    parsed.search = "";
    return { url: parsed.toString().replace(/\/+$/, ""), error: null };
  } catch (_) {
    return {
      url: null,
      error: "URL inválida. Use algo como http://127.0.0.1:5050",
    };
  }
}

function setFeedback(message, type = "success") {
  const feedback = document.getElementById("feedback");
  feedback.textContent = message;
  feedback.classList.remove("success", "error");
  feedback.classList.add(type);
}

async function loadSettings() {
  const data = await chrome.storage.sync.get({ backendUrl: DEFAULT_URL });
  const parsed = normalizeUrl(data.backendUrl);
  if (!parsed.error && parsed.url) {
    document.getElementById("backend-url").value = parsed.url;
    return;
  }
  document.getElementById("backend-url").value = DEFAULT_URL;
}

async function saveSettings() {
  const input = document.getElementById("backend-url");
  const parsed = normalizeUrl(input.value);
  if (parsed.error || !parsed.url) {
    setFeedback(parsed.error || "URL inválida.", "error");
    return;
  }

  const backendUrl = parsed.url;
  await chrome.storage.sync.set({ backendUrl });
  input.value = backendUrl;
  setFeedback("Configuração salva.", "success");
  setTimeout(() => {
    const feedback = document.getElementById("feedback");
    feedback.textContent = "";
    feedback.classList.remove("success", "error");
  }, 2200);
}

async function resetDefault() {
  document.getElementById("backend-url").value = DEFAULT_URL;
  await saveSettings();
}

document.getElementById("btn-save").addEventListener("click", saveSettings);
document.getElementById("btn-default").addEventListener("click", resetDefault);

loadSettings();
