const $ = (id) => document.getElementById(id);
const state = { links: [], rows: [] };

function setStatus(text) { $('statusBadge').textContent = text; }
function normalizeWhatsAppLink(url) {
  if (!url) return null;
  try {
    const decoded = decodeURIComponent(url.trim());
    const match = decoded.match(/https?:\/\/(?:chat\.whatsapp\.com|whatsapp\.com\/channel)\/[^\s"'<>?#]+/i);
    if (!match) return null;
    return match[0].replace(/\/$/, '');
  } catch { return null; }
}
function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
function render(payload) {
  state.rows = payload.rows || [];
  state.links = state.rows.map(r => r.url);
  $('results').value = state.links.join('\n');
  $('totalFound').textContent = payload.totalFound || 0;
  $('totalUnique').textContent = payload.totalUnique || 0;
  $('totalFiltered').textContent = state.links.length;
}
async function runScan(mode) {
  setStatus('Escaneando');
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const options = {
    keyword: $('keyword').value.trim(),
    onlyGroups: $('onlyGroups').checked,
    dedupe: $('dedupe').checked,
    mode
  };
  const [result] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: scanWhatsAppLinks,
    args: [options]
  });
  render(result?.result || { rows: [], totalFound: 0, totalUnique: 0 });
  setStatus('Concluído');
  await chrome.storage.local.set({ lastScan: result?.result || null, lastKeyword: options.keyword });
}

$('scanPage').addEventListener('click', () => runScan('page'));
$('scanSelection').addEventListener('click', () => runScan('selection'));
$('copy').addEventListener('click', async () => {
  await navigator.clipboard.writeText($('results').value);
  setStatus('Copiado');
});
$('clear').addEventListener('click', () => render({ rows: [], totalFound: 0, totalUnique: 0 }));
$('exportTxt').addEventListener('click', () => downloadFile('whatsapp-links.txt', $('results').value, 'text/plain;charset=utf-8'));
$('exportCsv').addEventListener('click', () => {
  const header = 'url,source_text,found_on,keyword_match\n';
  const lines = state.rows.map(r => [r.url, r.text, location.href, r.keywordMatch ? 'yes' : 'no']
    .map(v => `"${String(v || '').replaceAll('"', '""')}"`).join(','));
  downloadFile('whatsapp-links.csv', header + lines.join('\n'), 'text/csv;charset=utf-8');
});

chrome.storage.local.get(['lastScan', 'lastKeyword']).then(data => {
  if (data.lastKeyword) $('keyword').value = data.lastKeyword;
  if (data.lastScan) render(data.lastScan);
});

function scanWhatsAppLinks(options) {
  const root = options.mode === 'selection' && window.getSelection()?.rangeCount
    ? window.getSelection().getRangeAt(0).cloneContents()
    : document;
  const keyword = (options.keyword || '').toLowerCase();
  const candidates = [];

  const add = (rawUrl, text = '') => {
    const url = rawUrl ? String(rawUrl) : '';
    const finalUrl = options.onlyGroups ? normalizeWhatsAppLink(url) : url;
    if (!finalUrl) return;
    const haystack = `${finalUrl} ${text}`.toLowerCase();
    const keywordMatch = keyword ? haystack.includes(keyword) : true;
    if (!keywordMatch) return;
    candidates.push({ url: finalUrl, text: String(text || '').replace(/\s+/g, ' ').trim(), keywordMatch });
  };

  [...root.querySelectorAll('a[href]')].forEach(a => {
    add(a.href, `${a.innerText || ''} ${a.title || ''} ${a.getAttribute('aria-label') || ''}`);
  });

  const pageText = root.body ? root.body.innerText : root.textContent || '';
  const regex = /https?:\/\/(?:chat\.whatsapp\.com|whatsapp\.com\/channel)\/[^\s"'<>]+/gi;
  [...pageText.matchAll(regex)].forEach(m => add(m[0], 'texto da página'));

  const totalFound = candidates.length;
  let rows = candidates;
  if (options.dedupe) {
    const seen = new Set();
    rows = rows.filter(r => {
      if (seen.has(r.url)) return false;
      seen.add(r.url);
      return true;
    });
  }
  return { rows, totalFound, totalUnique: new Set(candidates.map(r => r.url)).size, pageUrl: location.href };
}
