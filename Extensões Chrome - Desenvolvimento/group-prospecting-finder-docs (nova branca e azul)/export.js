function pad(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function escapeCsv(value) {
  const normalized = pad(value);

  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }

  return normalized;
}

function buildRows(links) {
  return links.map((link) => ({
    campaign: pad(link.campaign_name || link.campaign || ""),
    primary_keyword: pad(link.primary_keyword || ""),
    region: pad(link.region || ""),
    source: pad(link.source || ""),
    google_query: pad(link.google_query || ""),
    query: pad(link.search_query || link.query || ""),
    candidate_page_url: pad(link.candidate_page_url || link.page_url || ""),
    candidate_page_title: pad(link.candidate_page_title || link.page_title || ""),
    group_url_raw: pad(link.group_url_raw || link.raw_url || ""),
    group_url_normalized: pad(link.group_url_normalized || link.normalized_url || ""),
    extraction_status: pad(link.extraction_status || ""),
    page_url: pad(link.page_url || ""),
    raw_url: pad(link.raw_url || ""),
    normalized_url: pad(link.normalized_url || ""),
    status: pad(link.status || ""),
    validation_status: pad(link.validation_status || ""),
    manual_status: pad(link.manual_status || ""),
    notes: pad(link.notes || ""),
    created_at: pad(link.created_at || ""),
    last_checked_at: pad(link.last_checked_at || ""),
  }));
}

export function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportLinksToCsv(links, campaign = null) {
  const rows = buildRows(links);
  const headers = [
    "campaign",
    "primary_keyword",
    "region",
    "source",
    "google_query",
    "query",
    "candidate_page_url",
    "candidate_page_title",
    "group_url_raw",
    "group_url_normalized",
    "extraction_status",
    "page_url",
    "raw_url",
    "normalized_url",
    "status",
    "validation_status",
    "manual_status",
    "notes",
    "created_at",
    "last_checked_at",
  ];

  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(",")),
  ];

  const slug = pad(campaign?.name || "campaign")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return {
    filename: `${slug || "group-prospecting-finder"}.csv`,
    content: `${lines.join("\n")}\n`,
    mimeType: "text/csv;charset=utf-8",
  };
}

export function exportLinksToJson(links, campaign = null) {
  const slug = pad(campaign?.name || "campaign")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return {
    filename: `${slug || "group-prospecting-finder"}.json`,
    content: JSON.stringify(
      {
        campaign,
        exported_at: new Date().toISOString(),
        total: links.length,
        links,
      },
      null,
      2,
    ),
    mimeType: "application/json;charset=utf-8",
  };
}
