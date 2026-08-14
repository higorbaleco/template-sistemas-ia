const FC = globalThis.FerramentaConsulta;
const SOURCE_CATALOG = globalThis.FerramentaConsultaSources.SOURCE_CATALOG;

let currentSettings = FC.defaultSettingsFromSources(SOURCE_CATALOG);
let currentScan = null;
let currentView = "list";

const els = {
  statusBadge: document.getElementById("status-badge"),
  statusText: document.getElementById("status-text"),
  sourceCount: document.getElementById("source-count"),
  metricTotal: document.getElementById("metric-total"),
  metricSources: document.getElementById("metric-sources"),
  toggleCurrentTab: document.getElementById("toggle-current-tab"),
  toggleWhatsapp: document.getElementById("toggle-whatsapp"),
  toggleTelegram: document.getElementById("toggle-telegram"),
  toggleAdult: document.getElementById("toggle-adult"),
  searchKeyword: document.getElementById("search-keyword"),
  searchCategory: document.getElementById("search-category"),
  btnScan: document.getElementById("btn-scan"),
  btnCopy: document.getElementById("btn-copy"),
  btnExport: document.getElementById("btn-export"),
  btnRefresh: document.getElementById("btn-refresh"),
  btnOptions: document.getElementById("btn-options"),
  btnViewList: document.getElementById("view-list"),
  btnViewClean: document.getElementById("view-clean"),
  btnViewCopy: document.getElementById("view-copy"),
  btnCopyLinks: document.getElementById("btn-copy-links"),
  btnCopyRefresh: document.getElementById("btn-copy-refresh"),
  progressLog: document.getElementById("progress-log"),
  resultsList: document.getElementById("results-list"),
  resultsCount: document.getElementById("results-count"),
  lastRun: document.getElementById("last-run"),
  listPanel: document.getElementById("list-panel"),
  copyPanel: document.getElementById("copy-panel"),
  copyOutput: document.getElementById("copy-output"),
  copyCount: document.getElementById("copy-count"),
};

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

function setLog(lines) {
  const text = Array.isArray(lines) ? lines.join("\n") : String(lines || "");
  els.progressLog.textContent = text || "Sem mensagens.";
}

function appendLog(line) {
  const current = els.progressLog.textContent.trim();
  els.progressLog.textContent = current ? `${current}\n${line}` : line;
}

function setStatus(message, online = true) {
  els.statusText.textContent = message;
  els.statusBadge.classList.remove("online", "offline");
  els.statusBadge.classList.add(online ? "online" : "offline");
}

function populateCategories() {
  els.searchCategory.innerHTML = "";
  for (const option of FC.getCategoryOptions()) {
    const el = document.createElement("option");
    el.value = option.value;
    el.textContent = option.label;
    els.searchCategory.appendChild(el);
  }
}

function setViewMode(mode) {
  currentView = mode === "copy" ? "copy" : mode === "clean" ? "clean" : "list";
  els.btnViewList.classList.toggle("active", currentView === "list");
  els.btnViewClean.classList.toggle("active", currentView === "clean");
  els.btnViewCopy.classList.toggle("active", currentView === "copy");
  els.listPanel.style.display = currentView === "copy" ? "none" : "";
  els.copyPanel.style.display = currentView === "copy" ? "" : "none";
  if (currentScan) {
    renderCurrentResults();
  }
}

function getRawResults() {
  if (Array.isArray(currentScan?.rawResults)) {
    return currentScan.rawResults;
  }
  if (Array.isArray(currentScan?.results)) {
    return currentScan.results;
  }
  return [];
}

function getQualityBuckets() {
  const rawResults = getRawResults();
  if (!rawResults.length) {
    return {
      all: [],
      clean: [],
      suspect: [],
      rejected: [],
      visible: [],
    };
  }

  const searchAwareResults = FC.filterEntriesBySearch(rawResults, currentSettings);
  const quality = FC.filterEntriesByQuality(searchAwareResults, currentSettings, "all");
  const visible = currentView === "clean" || currentView === "copy" ? quality.clean : quality.all;
  return {
    ...quality,
    visible,
  };
}

function formatMemberCount(value) {
  if (!Number.isFinite(value) || value <= 0) {
    return "";
  }
  return value >= 1000 ? `${Math.round(value / 100) / 10}k membros` : `${value} membros`;
}

function getQualityLabel(result) {
  if (result.qualityState === "rejected") {
    return "Descartado";
  }
  if (result.qualityState === "suspect") {
    return "Suspeito";
  }
  return "Limpo";
}

function renderResultsList(results = []) {
  els.resultsList.innerHTML = "";
  if (!results.length) {
    const message = currentView === "clean"
      ? "Nenhum resultado passou na limpeza com os filtros atuais."
      : "Nenhum resultado encontrado ainda. Rode uma busca para começar.";
    els.resultsList.innerHTML = `<div class="empty">${message}</div>`;
    return;
  }

  const limit = 50;
  const visible = results.slice(0, limit);
  for (const result of visible) {
    const card = document.createElement("article");
    card.className = "result";

    const sourceLabel = Array.isArray(result.sources) && result.sources.length
      ? result.sources.join(", ")
      : result.source || "Fonte desconhecida";

    const badges = document.createElement("div");
    badges.className = "result-badges";

    const typeBadge = document.createElement("span");
    typeBadge.className = "badge";
    typeBadge.textContent = result.typeLabel || result.type || "Link";
    badges.appendChild(typeBadge);

    const qualityBadge = document.createElement("span");
    qualityBadge.className = `badge ${result.qualityState || "clean"}`;
    qualityBadge.textContent = getQualityLabel(result);
    badges.appendChild(qualityBadge);

    const memberLabel = formatMemberCount(result.memberCount);
    if (memberLabel) {
      const memberBadge = document.createElement("span");
      memberBadge.className = "badge";
      memberBadge.textContent = memberLabel;
      badges.appendChild(memberBadge);
    }

    const urlEl = document.createElement("div");
    urlEl.className = "result-url";
    urlEl.textContent = result.url || "";

    const metaEl = document.createElement("div");
    metaEl.className = "result-meta";
    const parts = [
      `${sourceLabel}`,
      result.title || "",
      result.context || "",
    ].filter(Boolean);
    metaEl.textContent = parts.join("\n");

    card.appendChild(badges);
    card.appendChild(urlEl);
    card.appendChild(metaEl);
    els.resultsList.appendChild(card);
  }

  if (results.length > limit) {
    const note = document.createElement("div");
    note.className = "empty";
    note.textContent = `Mostrando ${limit} de ${results.length} resultados.`;
    els.resultsList.appendChild(note);
  }
}

function updateCopyPanel(results = []) {
  const copyText = FC.entriesToUrlList(results);
  els.copyOutput.value = copyText || "";
  const count = copyText ? copyText.split("\n").filter(Boolean).length : 0;
  els.copyCount.textContent = `${count} link${count === 1 ? "" : "s"}`;
  els.btnCopyLinks.disabled = !count;
  return copyText;
}

function updateRenderedResults() {
  const buckets = getQualityBuckets();
  renderResultsList(buckets.visible);
  updateCopyPanel(buckets.clean);
  els.metricTotal.textContent = String(buckets.visible.length || 0);
  els.metricSources.textContent = String(currentScan?.summary?.sourcesScanned || 0);
  els.resultsCount.textContent = currentView === "clean"
    ? `${buckets.clean.length} limpos`
    : `${buckets.visible.length} item(ns)`;
  return buckets;
}

function formatDateTime(value) {
  if (!value) return "Sem execução ainda";
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "medium",
    }).format(new Date(value));
  } catch (_) {
    return String(value);
  }
}

function syncInputsFromSettings() {
  els.searchKeyword.value = currentSettings.keyword || "";
  els.searchCategory.value = currentSettings.category || "all";
  els.toggleCurrentTab.checked = currentSettings.includeCurrentTab !== false;
  els.toggleWhatsapp.checked = currentSettings.channels?.whatsapp !== false;
  els.toggleTelegram.checked = currentSettings.channels?.telegram !== false;
  els.toggleAdult.checked = currentSettings.adultMode === true;
  els.sourceCount.textContent = `${FC.countEnabledSources(currentSettings)} fontes ativas`;
}

function readSettingsFromControls() {
  return {
    ...currentSettings,
    keyword: els.searchKeyword.value.trim(),
    category: els.searchCategory.value,
    includeCurrentTab: els.toggleCurrentTab.checked,
    channels: {
      whatsapp: els.toggleWhatsapp.checked,
      telegram: els.toggleTelegram.checked,
    },
    adultMode: els.toggleAdult.checked,
  };
}

async function loadSettings() {
  const response = await sendMessage({ type: "FC_LOAD_SETTINGS" });
  if (response && response.ok && response.settings) {
    currentSettings = response.settings;
  }
  syncInputsFromSettings();
  if (currentScan) {
    renderCurrentResults();
  }
}

async function saveQuickSettings() {
  currentSettings = FC.normalizeSettings(readSettingsFromControls(), SOURCE_CATALOG);
  const response = await sendMessage({
    type: "FC_SAVE_SETTINGS",
    settings: currentSettings,
  });

  if (!response || !response.ok) {
    throw new Error(response?.error || "Não foi possível salvar as opções.");
  }

  syncInputsFromSettings();
  if (currentScan) {
    renderCurrentResults();
  }
  return currentSettings;
}

function renderScan(payload) {
  currentScan = payload || null;
  if (!payload) {
    currentScan = null;
    updateRenderedResults();
    setLog("Clique em Buscar para iniciar.");
    els.lastRun.textContent = "Sem execução ainda";
    els.btnExport.disabled = true;
    els.btnCopy.disabled = true;
    return;
  }

  els.lastRun.textContent = formatDateTime(payload.scannedAt);
  const buckets = updateRenderedResults();
  const summary = payload.summary || {};
  setLog([
    `Executado em ${formatDateTime(payload.scannedAt)}`,
    `Busca suave: ${summary.searchMatchedTotal ?? buckets.visible.length} item(ns) em destaque dentro de ${summary.rawTotal || buckets.visible.length} encontrados.`,
    `Limpeza: ${summary.cleanTotal || buckets.clean.length} limpos, ${summary.suspectTotal || buckets.suspect.length} suspeitos, ${summary.rejectedTotal || buckets.rejected.length} descartados.`,
    ...(payload.progress || []),
  ]);
  els.btnExport.disabled = !buckets.clean.length;
  els.btnCopy.disabled = !buckets.clean.length;
}

async function refreshLastScan() {
  const response = await sendMessage({ type: "FC_GET_LAST_SCAN" });
  if (response && response.ok && response.payload) {
    renderScan(response.payload);
    return;
  }
  renderScan(null);
}

async function copyTextToClipboard(text) {
  if (!text) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (_) {
    const temp = document.createElement("textarea");
    temp.value = text;
    temp.style.position = "fixed";
    temp.style.left = "-9999px";
    document.body.appendChild(temp);
    temp.focus();
    temp.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(temp);
    return ok;
  }
}

async function copyCurrentLinks() {
  const buckets = getQualityBuckets();
  const text = FC.entriesToUrlList(buckets.clean);
  if (!text) {
    appendLog("Nenhum link limpo disponível para copiar.");
    return;
  }

  const ok = await copyTextToClipboard(text);
  if (ok) {
    appendLog("Links limpos copiados para a área de transferência.");
    setViewMode("copy");
  } else {
    appendLog("Não foi possível copiar automaticamente.");
  }
}

async function runScan() {
  setStatus("Buscando...", true);
  els.btnScan.disabled = true;
  els.btnCopy.disabled = true;
  els.btnExport.disabled = true;

  try {
    await saveQuickSettings();
    appendLog("Iniciando coleta...");
    const response = await sendMessage({
      type: "FC_START_SCAN",
      settings: currentSettings,
    });

    if (!response || !response.ok) {
      throw new Error(response?.error || "Falha ao iniciar a coleta.");
    }

    renderScan(response.payload);
    setStatus("Busca concluída", true);
    setViewMode("list");
  } catch (error) {
    setStatus("Falha na busca", false);
    appendLog(`Erro: ${error.message}`);
  } finally {
    els.btnScan.disabled = false;
    els.btnCopy.disabled = !(getQualityBuckets().clean.length);
  }
}

async function exportCsv() {
  const buckets = getQualityBuckets();
  if (!buckets.clean.length) {
    appendLog("Sem resultados limpos para exportar.");
    return;
  }

  const csv = FC.entriesToCsv(buckets.clean);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const fileName = `groups_hunter_advance_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`;

  chrome.downloads.download({
    url,
    filename: fileName,
    saveAs: true,
  }, () => {
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  });
}

function renderCurrentResults() {
  const buckets = updateRenderedResults();
  els.btnExport.disabled = !buckets.clean.length;
  els.btnCopy.disabled = !buckets.clean.length;
}

async function init() {
  populateCategories();
  setViewMode("list");
  setStatus("Pronto para buscar", true);
  setLog("Carregando configuração local...");
  await loadSettings();
  await refreshLastScan();
}

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "sync" || !changes[FC.STORAGE_KEYS.settings]) {
    return;
  }

  currentSettings = FC.normalizeSettings(changes[FC.STORAGE_KEYS.settings].newValue, SOURCE_CATALOG);
  syncInputsFromSettings();
  if (currentScan) {
    renderCurrentResults();
    appendLog("Configurações atualizadas na tela principal.");
  }
});

els.btnScan.addEventListener("click", runScan);
els.btnCopy.addEventListener("click", copyCurrentLinks);
els.btnCopyLinks.addEventListener("click", copyCurrentLinks);
els.btnCopyRefresh.addEventListener("click", () => {
  if (currentScan) {
    renderCurrentResults();
    appendLog("Vista de cópia atualizada.");
  }
});
els.btnExport.addEventListener("click", exportCsv);
els.btnRefresh.addEventListener("click", async () => {
  try {
    await loadSettings();
    await refreshLastScan();
    setStatus("Atualizado", true);
  } catch (error) {
    setStatus("Falha ao atualizar", false);
    appendLog(`Erro: ${error.message}`);
  }
});
els.btnOptions.addEventListener("click", () => chrome.runtime.openOptionsPage());
els.btnViewList.addEventListener("click", () => setViewMode("list"));
els.btnViewClean.addEventListener("click", () => setViewMode("clean"));
els.btnViewCopy.addEventListener("click", () => setViewMode("copy"));

[els.searchKeyword, els.searchCategory, els.toggleCurrentTab, els.toggleWhatsapp, els.toggleTelegram, els.toggleAdult]
  .forEach((input) => {
    input.addEventListener("change", () => {
      saveQuickSettings().catch((error) => {
        appendLog(`Erro ao salvar opções: ${error.message}`);
      });
    });
  });

els.searchKeyword.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    runScan();
  }
});

init().catch((error) => {
  setStatus("Falha ao iniciar", false);
  setLog(`Erro ao iniciar a extensão: ${error.message}`);
});
