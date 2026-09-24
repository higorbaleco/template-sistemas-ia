import { DEPTH_OPTIONS, SOURCE_OPTIONS, DEFAULT_SETTINGS } from "./constants.js";
import { buildQueries } from "./query-builder.js";
import {
  loadState,
  getCampaignSummaries,
  listGroupLinks,
  updateGroupLink,
  deleteGroupLink,
  bulkUpdateGroupLinks,
  updateSettings,
  getSettings,
  ensureState,
  createCampaign,
  getActiveExecution,
} from "./storage.js";
import { downloadFile, exportLinksToCsv, exportLinksToJson } from "./export.js";
import { normalizeFreeText, normalizeWhatsAppLink } from "./normalizer.js";

const state = {
  loaded: false,
  campaigns: [],
  links: [],
  settings: DEFAULT_SETTINGS,
  previewQueries: [],
  activeExecution: null,
  filters: {
    campaignId: "",
    status: "",
    source: "",
    text: "",
  },
};

const els = {};

const SOURCE_LABELS = new Map(SOURCE_OPTIONS.map((source) => [source.value, source.label]));

function $(selector, root = document) {
  return root.querySelector(selector);
}

function $all(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

function formatDate(value) {
  if (!value) {
    return "Sem data";
  }

  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function toBoolean(value) {
  return value === true || value === "true" || value === 1 || value === "1";
}

function splitTerms(value) {
  return normalizeFreeText(value)
    .split(/[\n,]/g)
    .map((item) => normalizeFreeText(item))
    .filter(Boolean);
}

function readForm() {
  const form = els.campaignForm;
  const formData = new FormData(form);
  const sources = $all('input[name="sources"]:checked', form).map((input) => input.value);

  return {
    name: formData.get("name"),
    primaryKeyword: formData.get("primaryKeyword"),
    region: formData.get("region"),
    additionalTerms: splitTerms(formData.get("additionalTerms")),
    sources,
    pagesPerSource: Number(formData.get("pagesPerSource") || 1),
    depth: formData.get("depth") || "quick",
  };
}

function getSelectedCampaignId() {
  return els.resultsCampaignFilter.value || "";
}

function buildFilteredLinks() {
  let links = [...state.links];

  if (state.filters.campaignId) {
    links = links.filter((link) => link.campaign_id === state.filters.campaignId);
  }

  if (state.filters.status) {
    links = links.filter((link) => link.status === state.filters.status || link.manual_status === state.filters.status);
  }

  if (state.filters.source) {
    links = links.filter((link) => (link.source || "").toLowerCase() === state.filters.source.toLowerCase());
  }

  if (state.filters.text) {
    const query = state.filters.text.toLowerCase();
    links = links.filter((link) => {
      const haystack = [
        link.raw_url,
        link.normalized_url,
        link.group_url_raw,
        link.group_url_normalized,
        link.page_title,
        link.candidate_page_title,
        link.notes,
        link.source,
        link.primary_keyword,
        link.region,
        link.google_query,
        link.candidate_page_url,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }

  return links;
}

function badgeText(link) {
  return link.manual_status && link.manual_status !== "not_tested"
    ? link.manual_status
    : link.validation_status || link.status || "pending_validation";
}

function formatLaneStatus(lane) {
  if (!lane) {
    return "idle";
  }

  return lane.status || "idle";
}

function getSourceLabel(source) {
  return SOURCE_LABELS.get(String(source || "").toLowerCase()) || source || "-";
}

function normalizeLinkForCopy(link) {
  return link?.group_url_normalized || link?.normalized_url || link?.group_url_raw || link?.raw_url || "";
}

async function copyText(text) {
  if (!text) {
    return false;
  }

  await navigator.clipboard.writeText(text);
  return true;
}

function renderExecutionPanel() {
  const execution = state.activeExecution;
  const total = Number(execution?.totalQueries || 0);
  const completed = Number(execution?.completedQueries || 0);
  const linksFound = Number(execution?.linksFound || 0);
  const pending = Number(execution?.queueRemaining ?? Math.max(0, total - completed));
  const progress = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

  els.executionStatus.textContent = execution?.active
    ? `Rodando · ${execution?.currentSourceLabel || "aguardando"}`
    : "Sem execução";
  els.executionStatus.dataset.status = execution?.active ? "running" : "idle";
  els.executionSource.textContent = execution?.currentSourceLabel || "-";
  els.executionCompleted.textContent = String(completed);
  els.executionLinks.textContent = String(linksFound);
  els.executionPending.textContent = String(pending);
  els.executionProgressBar.style.width = `${progress}%`;

  if (!execution) {
    els.executionProgressBar.style.width = "0%";
    els.executionLanes.innerHTML = `
      <div class="lane-row">
        <div class="lane-row__top">
          <div class="lane-row__title">
            <strong>Nenhuma execução ativa</strong>
            <span>Quando você iniciar uma campanha, as duas lanes aparecem aqui.</span>
          </div>
          <span class="status-pill status-pill--neutral">Idle</span>
        </div>
      </div>
    `;
    return;
  }

  els.executionLanes.innerHTML = "";

  for (const lane of execution.lanes || []) {
    const row = document.createElement("div");
    row.className = "lane-row";
    row.innerHTML = `
      <div class="lane-row__top">
        <div class="lane-row__title">
          <strong>Lane ${lane.id + 1}</strong>
          <span>${lane.currentQueryLabel || "Aguardando próxima query"}</span>
        </div>
        <span class="status-pill" data-status="${formatLaneStatus(lane)}">${formatLaneStatus(lane)}</span>
      </div>
      <div class="lane-row__chips">
        <span class="stat">${lane.tabId ? `Tab ${lane.tabId}` : "Sem aba"}</span>
        <span class="stat">${lane.lastResultCount || 0} links</span>
      </div>
    `;
    els.executionLanes.appendChild(row);
  }
}

function renderQueryPreview(queries) {
  state.previewQueries = queries;
  els.queryCount.textContent = `${queries.length} query${queries.length === 1 ? "" : "s"}`;

  if (!queries.length) {
    els.queryPreview.classList.add("empty-state");
    els.queryPreview.textContent = "Preencha a busca e clique em \"Gerar preview\".";
    return;
  }

  els.queryPreview.classList.remove("empty-state");
  els.queryPreview.innerHTML = "";

  for (const query of queries.slice(0, 18)) {
    const wrapper = document.createElement("div");
    wrapper.className = "query-pill";
    wrapper.innerHTML = `
      <strong>${query.sourceLabel}</strong>
      <code>${query.query}</code>
      <span class="muted">Página ${query.pageIndex + 1} · start=${query.pageStart}</span>
    `;
    els.queryPreview.appendChild(wrapper);
  }

  if (queries.length > 18) {
    const more = document.createElement("div");
    more.className = "query-pill";
    more.innerHTML = `<strong>+${queries.length - 18} queries adicionais</strong><span class="muted">Abra os resultados para ver tudo.</span>`;
    els.queryPreview.appendChild(more);
  }
}

function renderResults() {
  const links = buildFilteredLinks();
  els.resultsCount.textContent = `${links.length} link${links.length === 1 ? "" : "s"}`;

  if (!links.length) {
    els.resultsList.className = "list empty-state";
    els.resultsList.textContent = "Nenhum link encontrado para os filtros atuais.";
    return;
  }

  els.resultsList.className = "list";
  els.resultsList.innerHTML = "";

  for (const link of links) {
    const template = els.resultTemplate.content.cloneNode(true);
    const item = template.querySelector(".result-item");
    const title = template.querySelector('[data-role="result-title"]');
    const meta = template.querySelector('[data-role="result-meta"]');
    const linkEl = template.querySelector('[data-role="result-link"]');
    const statusEl = template.querySelector('[data-role="result-status"]');
    const noteInput = template.querySelector('[data-role="result-note"]');
    const manualStatus = template.querySelector('[data-role="result-manual-status"]');
    const checkbox = template.querySelector('[data-role="select-result"]');

    item.dataset.id = link.id;
    title.textContent = link.page_title || link.primary_keyword || "Link de grupo";
    meta.textContent = `${link.source || "-"} · ${link.page_start != null ? `start=${link.page_start}` : ""} · ${formatDate(link.created_at)}`;
    linkEl.textContent = link.normalized_url || link.raw_url || "";
    statusEl.textContent = badgeText(link);
    statusEl.dataset.status = badgeText(link);
    noteInput.value = link.notes || "";
    manualStatus.value = link.manual_status || "not_tested";
    checkbox.checked = false;

    item.addEventListener("click", (event) => {
      const actionButton = event.target.closest("[data-action]");

      if (!actionButton) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      handleResultAction(actionButton.dataset.action, link, item);
    });

    noteInput.addEventListener("change", async () => {
      await updateGroupLink(link.id, { notes: noteInput.value });
      await refresh();
    });

    manualStatus.addEventListener("change", async () => {
      await updateGroupLink(link.id, { manual_status: manualStatus.value });
      await refresh();
    });

    els.resultsList.appendChild(template);
  }
}

function renderCampaigns() {
  if (!state.campaigns.length) {
    els.campaignList.className = "list empty-state";
    els.campaignList.textContent = "Nenhuma campanha criada ainda.";
    return;
  }

  els.campaignList.className = "list";
  els.campaignList.innerHTML = "";

  for (const campaign of state.campaigns) {
    const template = els.campaignTemplate.content.cloneNode(true);
    template.querySelector('[data-role="campaign-title"]').textContent = campaign.name;
    template.querySelector('[data-role="campaign-meta"]').textContent = [
      campaign.primary_keyword,
      campaign.region || "Sem região",
      `${campaign.depth}`,
      formatDate(campaign.created_at),
    ].join(" · ");
    template.querySelector('[data-role="campaign-links"]').textContent = `${campaign.link_count || 0} links`;
    template.querySelector('[data-role="campaign-queries"]').textContent = `${campaign.query_count || 0} queries`;
    els.campaignList.appendChild(template);
  }
}

function fillCampaignSelect() {
  const current = els.resultsCampaignFilter.value;
  els.resultsCampaignFilter.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "";
  allOption.textContent = "Todas";
  els.resultsCampaignFilter.appendChild(allOption);

  for (const campaign of state.campaigns) {
    const option = document.createElement("option");
    option.value = campaign.id;
    option.textContent = campaign.name;
    els.resultsCampaignFilter.appendChild(option);
  }

  if (state.campaigns.some((campaign) => campaign.id === current)) {
    els.resultsCampaignFilter.value = current;
  }
}

function fillSourceFilter() {
  const current = els.resultsSourceFilter.value;
  els.resultsSourceFilter.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "";
  allOption.textContent = "Todas";
  els.resultsSourceFilter.appendChild(allOption);

  for (const source of SOURCE_OPTIONS) {
    const option = document.createElement("option");
    option.value = source.value;
    option.textContent = source.label;
    els.resultsSourceFilter.appendChild(option);
  }

  els.resultsSourceFilter.value = current;
}

function syncSettingsForm() {
  const form = els.settingsForm;
  form.maxConcurrentTabs.value = String(state.settings.maxConcurrentTabs ?? DEFAULT_SETTINGS.maxConcurrentTabs);
  form.delayBetweenSearchesMs.value = String(state.settings.delayBetweenSearchesMs ?? DEFAULT_SETTINGS.delayBetweenSearchesMs);
  form.closeTabsAfterCollect.value = String(Boolean(state.settings.closeTabsAfterCollect));
  form.openValidationInNewTab.value = String(Boolean(state.settings.openValidationInNewTab));
  form.exportOnlyValid.value = String(Boolean(state.settings.exportOnlyValid));
  form.exportOnlyPending.value = String(Boolean(state.settings.exportOnlyPending));
}

function renderAll() {
  fillCampaignSelect();
  fillSourceFilter();
  renderQueryPreview(state.previewQueries);
  renderCampaigns();
  renderResults();
  renderExecutionPanel();
  syncSettingsForm();
}

async function refresh() {
  const summary = await getCampaignSummaries();
  const stateData = await loadState();
  const activeExecution = await getActiveExecution();
  state.campaigns = summary;
  state.links = await listGroupLinks({
    campaignId: state.filters.campaignId || "",
    status: state.filters.status || "",
    source: state.filters.source || "",
    text: state.filters.text || "",
  });
  state.activeExecution = activeExecution;
  state.settings = stateData.settings;
  state.loaded = true;
  renderAll();
}

function collectSourceValues() {
  return $all('input[name="sources"]:checked').map((input) => input.value);
}

function showTab(tabName) {
  for (const tab of $all(".tab")) {
    tab.classList.toggle("tab--active", tab.dataset.tab === tabName);
  }

  for (const panel of $all(".panel")) {
    panel.classList.toggle("panel--active", panel.dataset.panel === tabName);
  }
}

function setPreviewFromForm() {
  const input = readForm();
  const queries = buildQueries(input);
  renderQueryPreview(queries);
}

async function handleRunCampaign(event) {
  event.preventDefault();
  const input = readForm();

  if (!input.primaryKeyword || !input.name || !input.sources.length) {
    alert("Preencha nome, palavra-chave e ao menos uma fonte.");
    return;
  }

  const response = await chrome.runtime.sendMessage({
    type: "GPF_CREATE_AND_RUN_CAMPAIGN",
    payload: input,
  });

  if (!response?.ok && !response?.campaign) {
    alert(response?.error || "Não foi possível executar a busca.");
    return;
  }

  await refresh();
  showTab("search");
  state.filters.campaignId = response.campaign.id;
  els.resultsCampaignFilter.value = response.campaign.id;
  await refresh();
}

async function handleSaveDraft() {
  const input = readForm();
  const queries = buildQueries(input);
  renderQueryPreview(queries);
  await createCampaign({
    ...input,
    status: "draft",
  });
  await refresh();
  alert("Campanha salva como rascunho.");
  showTab("search");
}

async function handleResultAction(action, link, item) {
  if (action === "open") {
    await chrome.tabs.create({ url: normalizeLinkForCopy(link), active: true });
    return;
  }

  if (action === "copy") {
    const copied = await copyText(normalizeLinkForCopy(link));
    if (copied) {
      alert("Link copiado.");
    }
    return;
  }

  if (action === "validate") {
    const response = await chrome.runtime.sendMessage({
      type: "GPF_REQUEST_LINK_VALIDATION",
      payload: {
        linkId: link.id,
        linkUrl: link.normalized_url || link.raw_url,
      },
    });

    if (!response?.ok) {
      alert(response?.error || "Não foi possível validar o link.");
      return;
    }

    await refresh();
    return;
  }

  if (action === "save") {
    const noteInput = item.querySelector('[data-role="result-note"]');
    const manualStatus = item.querySelector('[data-role="result-manual-status"]');

    await updateGroupLink(link.id, {
      notes: noteInput.value,
      manual_status: manualStatus.value,
    });

    await refresh();
    return;
  }

  if (action === "delete") {
    if (!confirm("Remover este link da campanha?")) {
      return;
    }

    await deleteGroupLink(link.id);
    await refresh();
  }
}

function getSelectedResultIds() {
  return [...document.querySelectorAll('[data-role="select-result"]:checked')]
    .map((checkbox) => checkbox.closest(".result-item")?.dataset.id)
    .filter(Boolean);
}

async function handleBulkStatus(status) {
  const ids = getSelectedResultIds();

  if (!ids.length) {
    alert("Selecione pelo menos um link.");
    return;
  }

  await bulkUpdateGroupLinks(ids, {
    manual_status: status,
  });
  await refresh();
}

async function handleBulkDelete() {
  const ids = getSelectedResultIds();

  if (!ids.length) {
    alert("Selecione pelo menos um link.");
    return;
  }

  if (!confirm("Remover os links selecionados?")) {
    return;
  }

  for (const id of ids) {
    await deleteGroupLink(id);
  }

  await refresh();
}

async function handleCopyVisible() {
  const links = buildFilteredLinks();
  const urls = [...new Set(links.map((link) => normalizeLinkForCopy(link)).filter(Boolean))];

  if (!urls.length) {
    alert("Não há links visíveis para copiar.");
    return;
  }

  await copyText(urls.join("\n"));
  alert(`${urls.length} link${urls.length === 1 ? "" : "s"} copiado${urls.length === 1 ? "" : "s"}.`);
}

async function handleExport(kind) {
  let links = buildFilteredLinks();
  const selectedCampaign = state.campaigns.find((campaign) => campaign.id === state.filters.campaignId) || null;

  if (state.settings.exportOnlyValid) {
    links = links.filter((link) => link.manual_status === "valid" || link.status === "valid");
  }

  if (state.settings.exportOnlyPending) {
    links = links.filter((link) => link.validation_status === "not_checked" || link.status === "pending_validation");
  }

  const campaignById = new Map(state.campaigns.map((campaign) => [campaign.id, campaign.name]));
  const enrichedLinks = links.map((link) => ({
    ...link,
    campaign_name: campaignById.get(link.campaign_id) || selectedCampaign?.name || "",
  }));

  let exportData;

  if (kind === "csv") {
    exportData = exportLinksToCsv(enrichedLinks, selectedCampaign);
  } else {
    exportData = exportLinksToJson(enrichedLinks, selectedCampaign);
  }

  downloadFile(exportData.filename, exportData.content, exportData.mimeType);
}

function initSourceCheckboxes() {
  const container = els.sourceList;
  container.innerHTML = "";

  for (const option of SOURCE_OPTIONS) {
    const label = document.createElement("label");
    label.className = "source-chip";
    label.innerHTML = `
      <input type="checkbox" name="sources" value="${option.value}" ${option.value === "google" ? "checked" : ""} />
      <span>${option.label}</span>
    `;
    container.appendChild(label);
  }
}

function syncFiltersFromUI() {
  state.filters.campaignId = els.resultsCampaignFilter.value || "";
  state.filters.status = els.resultsStatusFilter.value || "";
  state.filters.source = els.resultsSourceFilter.value || "";
  state.filters.text = normalizeFreeText(els.resultsTextFilter.value || "");
}

async function initSettings() {
  const settings = await getSettings();
  state.settings = settings;
  syncSettingsForm();
}

function collectPreview() {
  const input = readForm();
  const queries = buildQueries(input);
  renderQueryPreview(queries);
}

function bindEvents() {
  els.tabs.forEach((tab) => {
    tab.addEventListener("click", () => showTab(tab.dataset.tab));
  });

  els.campaignForm.addEventListener("submit", handleRunCampaign);
  els.btnGenerateQueries.addEventListener("click", collectPreview);
  els.btnSaveDraft.addEventListener("click", handleSaveDraft);
  els.resultsCampaignFilter.addEventListener("change", async () => {
    syncFiltersFromUI();
    await refresh();
  });
  els.resultsStatusFilter.addEventListener("change", async () => {
    syncFiltersFromUI();
    await refresh();
  });
  els.resultsSourceFilter.addEventListener("change", async () => {
    syncFiltersFromUI();
    await refresh();
  });
  els.resultsTextFilter.addEventListener("input", async () => {
    syncFiltersFromUI();
    await refresh();
  });
  els.btnExportCsv.addEventListener("click", () => handleExport("csv"));
  els.btnExportJson.addEventListener("click", () => handleExport("json"));
  els.btnCopyVisible.addEventListener("click", handleCopyVisible);
  els.btnBulkValid.addEventListener("click", () => handleBulkStatus("valid"));
  els.btnBulkInvalid.addEventListener("click", () => handleBulkStatus("invalid"));
  els.btnBulkDelete.addEventListener("click", handleBulkDelete);
  els.btnRefreshCampaigns.addEventListener("click", refresh);
  els.settingsForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    const nextSettings = {
      maxConcurrentTabs: Math.min(2, Number(form.maxConcurrentTabs.value || DEFAULT_SETTINGS.maxConcurrentTabs)),
      delayBetweenSearchesMs: Number(form.delayBetweenSearchesMs.value || DEFAULT_SETTINGS.delayBetweenSearchesMs),
      closeTabsAfterCollect: toBoolean(form.closeTabsAfterCollect.value),
      openValidationInNewTab: toBoolean(form.openValidationInNewTab.value),
      exportOnlyValid: toBoolean(form.exportOnlyValid.value),
      exportOnlyPending: toBoolean(form.exportOnlyPending.value),
    };

    await updateSettings(nextSettings);
    await refresh();
    alert("Configurações salvas.");
  });
}

function cacheElements() {
  els.tabs = $all(".tab");
  els.campaignForm = $("#campaign-form");
  els.settingsForm = $("#settings-form");
  els.sourceList = $("#source-list");
  els.queryPreview = $("#query-preview");
  els.queryCount = $("#query-count");
  els.resultTemplate = $("#result-item-template");
  els.campaignTemplate = $("#campaign-item-template");
  els.resultsList = $("#results-list");
  els.campaignList = $("#campaign-list");
  els.resultsCount = $("#results-count");
  els.resultsCampaignFilter = $("#results-campaign-filter");
  els.resultsStatusFilter = $("#results-status-filter");
  els.resultsSourceFilter = $("#results-source-filter");
  els.resultsTextFilter = $("#results-text-filter");
  els.btnGenerateQueries = $("#btn-generate-queries");
  els.btnSaveDraft = $("#btn-save-draft");
  els.btnExportCsv = $("#btn-export-csv");
  els.btnExportJson = $("#btn-export-json");
  els.btnBulkValid = $("#btn-bulk-valid");
  els.btnBulkInvalid = $("#btn-bulk-invalid");
  els.btnBulkDelete = $("#btn-bulk-delete");
  els.btnRefreshCampaigns = $("#btn-refresh-campaigns");
  els.executionStatus = $("#execution-status");
  els.executionSource = $("#execution-source");
  els.executionCompleted = $("#execution-completed");
  els.executionLinks = $("#execution-links");
  els.executionPending = $("#execution-pending");
  els.executionProgressBar = $("#execution-progress-bar");
  els.executionLanes = $("#execution-lanes");
  els.btnCopyVisible = $("#btn-copy-visible");
}

async function boot() {
  cacheElements();
  initSourceCheckboxes();
  await ensureState();
  await initSettings();
  bindEvents();
  await refresh();
  renderQueryPreview([]);
  showTab("search");

  els.resultsCampaignFilter.value = "";
  els.resultsStatusFilter.value = "";
  els.resultsSourceFilter.value = "";
  els.resultsTextFilter.value = "";

  state.filters = {
    campaignId: "",
    status: "",
    source: "",
    text: "",
  };
  state.links = await listGroupLinks();
  renderResults();

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === "GPF_EXECUTION_UPDATED") {
      state.activeExecution = message.payload || null;
      renderExecutionPanel();
    }
  });

  window.setInterval(() => {
    refresh().catch(() => {});
  }, 2000);
}

boot().catch((error) => {
  console.error(error);
  document.body.innerHTML = `<pre style="white-space:pre-wrap;color:#b13b2c;padding:16px;">Falha ao iniciar a extensão: ${error?.message || error}</pre>`;
});
