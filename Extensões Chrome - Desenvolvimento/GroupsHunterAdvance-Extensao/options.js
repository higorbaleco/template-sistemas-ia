const FC = globalThis.FerramentaConsulta;
const SOURCE_CATALOG = globalThis.FerramentaConsultaSources.SOURCE_CATALOG;

let currentSettings = FC.defaultSettingsFromSources(SOURCE_CATALOG);

function sendMessage(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      const error = chrome.runtime.lastError;
      if (error) {
        reject(new Error(error.message));
        return;
      }
      resolve(response);
    });
  });
}

function setFeedback(message, type = "") {
  const feedback = document.getElementById("feedback");
  feedback.textContent = message;
  feedback.classList.remove("success", "error");
  if (type) {
    feedback.classList.add(type);
  }
}

function renderSourceList() {
  const list = document.getElementById("sources-list");
  list.innerHTML = "";

  for (const source of SOURCE_CATALOG) {
    const item = document.createElement("label");
    item.className = "source-item";
    item.dataset.sourceId = source.id;
    item.dataset.adult = source.adultOnly ? "true" : "false";

    if (source.adultOnly && !currentSettings.adultMode) {
      item.classList.add("disabled");
    }

    item.innerHTML = `
      <div>
        <strong>${source.label}</strong>
        <span>${source.description}</span>
      </div>
      <div class="badge">${source.adultOnly ? "+18" : "Fonte"}</div>
    `;

    const input = document.createElement("input");
    input.type = "checkbox";
    input.dataset.sourceId = source.id;
    input.checked = currentSettings.sources?.[source.id] !== false;
    input.disabled = source.adultOnly && !currentSettings.adultMode;
    item.appendChild(input);
    list.appendChild(item);
  }
}

function syncInputsFromSettings() {
  document.getElementById("adult-mode").checked = currentSettings.adultMode === true;
  document.getElementById("crawl-depth").value = currentSettings.crawlDepth || 2;
  document.getElementById("include-current-tab").checked = currentSettings.includeCurrentTab !== false;
  document.getElementById("channel-whatsapp").checked = currentSettings.channels?.whatsapp !== false;
  document.getElementById("channel-telegram").checked = currentSettings.channels?.telegram !== false;
  document.getElementById("sources-summary").textContent = `${FC.countEnabledSources(currentSettings)} ativas`;
}

function setAdultRowsVisibility() {
  const isAdultEnabled = document.getElementById("adult-mode").checked;
  document.querySelectorAll('[data-adult="true"]').forEach((row) => {
    row.classList.toggle("disabled", !isAdultEnabled);
    const checkbox = row.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.disabled = !isAdultEnabled;
    }
  });
}

function readSettingsFromForm() {
  const sourceInputs = document.querySelectorAll('[data-source-id]');
  const sources = {};
  sourceInputs.forEach((input) => {
    sources[input.dataset.sourceId] = Boolean(input.checked);
  });

  const crawlDepth = Number.parseInt(document.getElementById("crawl-depth").value, 10);
  const adultMode = document.getElementById("adult-mode").checked;

  return FC.normalizeSettings({
    includeCurrentTab: document.getElementById("include-current-tab").checked,
    crawlDepth,
    channels: {
      whatsapp: document.getElementById("channel-whatsapp").checked,
      telegram: document.getElementById("channel-telegram").checked,
    },
    adultMode,
    keyword: currentSettings.keyword,
    category: currentSettings.category,
    sources,
  }, SOURCE_CATALOG);
}

async function loadSettings() {
  const response = await sendMessage({ type: "FC_LOAD_SETTINGS" });
  if (response && response.ok && response.settings) {
    currentSettings = response.settings;
  }
  renderSourceList();
  syncInputsFromSettings();
  setAdultRowsVisibility();
}

async function saveSettings() {
  currentSettings = readSettingsFromForm();
  const response = await sendMessage({
    type: "FC_SAVE_SETTINGS",
    settings: currentSettings,
  });

  if (!response || !response.ok) {
    throw new Error(response?.error || "Não foi possível salvar.");
  }

  document.getElementById("sources-summary").textContent = `${FC.countEnabledSources(currentSettings)} ativas`;
  renderSourceList();
  syncInputsFromSettings();
  setAdultRowsVisibility();
  setFeedback("Configurações salvas.", "success");
  setTimeout(() => setFeedback(""), 1800);
}

async function resetDefaults() {
  currentSettings = FC.defaultSettingsFromSources(SOURCE_CATALOG);
  renderSourceList();
  syncInputsFromSettings();
  setAdultRowsVisibility();
  await saveSettings();
}

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "sync" || !changes[FC.STORAGE_KEYS.settings]) {
    return;
  }

  currentSettings = FC.normalizeSettings(changes[FC.STORAGE_KEYS.settings].newValue, SOURCE_CATALOG);
  renderSourceList();
  syncInputsFromSettings();
  setAdultRowsVisibility();
});

document.getElementById("btn-save").addEventListener("click", async () => {
  try {
    await saveSettings();
  } catch (error) {
    setFeedback(error.message, "error");
  }
});

document.getElementById("btn-defaults").addEventListener("click", async () => {
  try {
    await resetDefaults();
  } catch (error) {
    setFeedback(error.message, "error");
  }
});

document.getElementById("adult-mode").addEventListener("change", () => {
  setAdultRowsVisibility();
});

loadSettings().catch((error) => {
  setFeedback(`Falha ao carregar configurações: ${error.message}`, "error");
});
