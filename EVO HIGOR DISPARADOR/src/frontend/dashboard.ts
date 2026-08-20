export function renderDashboardHtml(): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>WhatsApp Disparador</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #ffffff;
      --surface: #f9fafb;
      --surface-dark: #f3f4f6;
      --text: #1f2937;
      --text-secondary: #6b7280;
      --border: #e5e7eb;
      --accent: #0066cc;
      --accent-light: #dbeafe;
      --danger: #dc2626;
      --success: #16a34a;
      --warning: #ea580c;
      --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
      --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
      --radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
    }

    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
    }

    body {
      color: var(--text);
      background: var(--bg);
      display: grid;
      grid-template-columns: 240px 1fr;
      grid-template-rows: 1fr;
      font-size: 14px;
      line-height: 1.5;
    }

    /* Sidebar Navigation */
    .sidebar {
      background: #2c3e50;
      color: #ecf0f1;
      padding: 0;
      display: flex;
      flex-direction: column;
      border-right: 1px solid rgba(0, 0, 0, 0.1);
      height: 100vh;
      overflow-y: auto;
      position: fixed;
      left: 0;
      top: 0;
      width: 240px;
    }

    .sidebar-header {
      padding: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      font-weight: 700;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .sidebar-nav {
      flex: 1;
      padding: 12px 0;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .nav-item {
      padding: 12px 16px;
      cursor: pointer;
      transition: all 0.2s ease;
      border-left: 3px solid transparent;
      position: relative;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.7);
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #ecf0f1;
    }

    .nav-item.active {
      background: rgba(0, 102, 204, 0.15);
      border-left-color: var(--accent);
      color: #ecf0f1;
      font-weight: 600;
    }

    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 12px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
    }

    .status-dot.online { background: #10b981; }
    .status-dot.offline { background: #ef4444; }

    /* Main Content */
    .main-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      margin-left: 240px;
      background: var(--surface);
    }

    .header {
      background: var(--bg);
      border-bottom: 1px solid var(--border);
      padding: 20px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: var(--shadow-sm);
    }

    .header-title {
      font-size: 20px;
      font-weight: 700;
      margin: 0;
    }

    .header-status {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13px;
      color: var(--text-secondary);
    }

    .content-wrapper {
      flex: 1;
      overflow-y: auto;
      padding: 28px;
    }

    .tab-section {
      display: none;
    }

    .tab-section.active {
      display: block;
    }

    .section-header {
      margin-bottom: 24px;
    }

    .section-header h2 {
      margin: 0 0 8px;
      font-size: 18px;
      font-weight: 700;
      color: var(--text);
    }

    .section-header p {
      margin: 0;
      font-size: 13px;
      color: var(--text-secondary);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }

    .card {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 20px;
      box-shadow: var(--shadow-sm);
    }

    .card h3 {
      margin: 0 0 12px;
      font-size: 14px;
      font-weight: 700;
      color: var(--text);
    }

    .card p.helper {
      margin: 0 0 16px;
      font-size: 12px;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .form {
      display: grid;
      gap: 14px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .form-row.full {
      grid-template-columns: 1fr;
    }

    label {
      display: grid;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text);
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    input, textarea, select {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--bg);
      color: var(--text);
      font: inherit;
      font-size: 13px;
      outline: none;
      transition: all 0.2s ease;
    }

    input:focus, textarea:focus, select:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-light);
    }

    textarea {
      min-height: 100px;
      resize: vertical;
      font-family: inherit;
    }

    .button {
      padding: 10px 16px;
      border: none;
      border-radius: var(--radius);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      outline: none;
    }

    .button-primary {
      background: var(--accent);
      color: white;
    }

    .button-primary:hover {
      background: #0052a3;
      box-shadow: var(--shadow);
    }

    .button-secondary {
      background: var(--surface-dark);
      color: var(--text);
      border: 1px solid var(--border);
    }

    .button-secondary:hover {
      background: var(--border);
    }

    .button-group {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .table-wrapper {
      overflow-x: auto;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      margin-bottom: 20px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    thead {
      background: var(--surface-dark);
      border-bottom: 2px solid var(--border);
      position: sticky;
      top: 0;
    }

    th {
      padding: 12px 16px;
      text-align: left;
      font-weight: 700;
      color: var(--text);
      text-transform: uppercase;
      letter-spacing: 0.3px;
      font-size: 11px;
    }

    td {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border);
      color: var(--text-secondary);
    }

    tbody tr:hover {
      background: var(--surface);
    }

    .list {
      display: grid;
      gap: 12px;
    }

    .list-item {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .list-item-main {
      flex: 1;
    }

    .list-item-title {
      font-weight: 600;
      color: var(--text);
      margin-bottom: 4px;
    }

    .list-item-meta {
      font-size: 12px;
      color: var(--text-secondary);
      margin-bottom: 2px;
    }

    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      white-space: nowrap;
    }

    .badge-success {
      background: rgba(22, 163, 74, 0.1);
      color: var(--success);
    }

    .badge-error {
      background: rgba(220, 38, 38, 0.1);
      color: var(--danger);
    }

    .badge-warning {
      background: rgba(234, 88, 12, 0.1);
      color: var(--warning);
    }

    .badge-info {
      background: rgba(0, 102, 204, 0.1);
      color: var(--accent);
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: var(--text-secondary);
    }

    .empty-state-icon {
      font-size: 48px;
      margin-bottom: 12px;
      opacity: 0.5;
    }

    .empty-state p {
      margin: 0;
      font-size: 13px;
    }

    .alert {
      padding: 12px 16px;
      border-radius: var(--radius);
      font-size: 13px;
      margin-bottom: 16px;
    }

    .alert-error {
      background: rgba(220, 38, 38, 0.1);
      color: var(--danger);
      border: 1px solid rgba(220, 38, 38, 0.2);
    }

    .alert-success {
      background: rgba(22, 163, 74, 0.1);
      color: var(--success);
      border: 1px solid rgba(22, 163, 74, 0.2);
    }

    .alert-info {
      background: rgba(0, 102, 204, 0.1);
      color: var(--accent);
      border: 1px solid rgba(0, 102, 204, 0.2);
    }

    .spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(0, 0, 0, 0.1);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .hidden {
      display: none !important;
    }

    @media (max-width: 768px) {
      body {
        grid-template-columns: 1fr;
      }
      .sidebar {
        position: fixed;
        left: -240px;
        z-index: 1000;
        transition: left 0.3s ease;
      }
      .sidebar.open {
        left: 0;
      }
      .main-container {
        margin-left: 0;
      }
      .grid {
        grid-template-columns: 1fr;
      }
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <aside class="sidebar">
    <div class="sidebar-header">WhatsApp</div>
    <nav class="sidebar-nav">
      <div class="nav-item active" data-tab="setup">
        <span>⚙️</span>
        <span>Setup</span>
      </div>
      <div class="nav-item" data-tab="instances">
        <span>📱</span>
        <span>Instances</span>
      </div>
      <div class="nav-item" data-tab="messages">
        <span>💬</span>
        <span>Messages</span>
      </div>
      <div class="nav-item" data-tab="logs">
        <span>📋</span>
        <span>Logs</span>
      </div>
    </nav>
    <div class="sidebar-footer">
      <div style="margin-bottom: 8px;">Status</div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span class="status-dot offline" id="statusDot"></span>
        <span id="statusText">Offline</span>
      </div>
    </div>
  </aside>

  <div class="main-container">
    <header class="header">
      <h1 class="header-title" id="pageTitle">Setup</h1>
      <div class="header-status" id="headerStatus">Ready</div>
    </header>

    <div class="content-wrapper">
      <!-- Setup Tab -->
      <div class="tab-section active" id="setup-tab">
        <div class="section-header">
          <h2>Setup & Configuration</h2>
          <p>Create an organization and configure your API connection</p>
        </div>

        <div id="setupAlert"></div>

        <div class="grid">
          <div class="card">
            <h3>Bootstrap Organization</h3>
            <p class="helper">Create the first organization with a setup token and receive an API key.</p>
            <form class="form" onsubmit="return handleCreateOrg(event)">
              <label>
                Setup Token
                <input id="setupTokenInput" type="password" placeholder="SETUP_TOKEN" required />
              </label>
              <label>
                Organization Name
                <input id="orgNameInput" type="text" placeholder="Acme Ltda" />
              </label>
              <button type="submit" class="button button-primary">Create Organization</button>
              <div id="createOrgResult"></div>
            </form>
          </div>

          <div class="card">
            <h3>Connect API Key</h3>
            <p class="helper">Paste your organization API key to authenticate and load data.</p>
            <form class="form" onsubmit="return handleSaveApiKey(event)">
              <label>
                API Key
                <input id="apiKeyInput" type="password" placeholder="api_key_..." required />
              </label>
              <div class="button-group">
                <button type="submit" class="button button-primary">Save Key</button>
                <button type="button" class="button button-secondary" onclick="handleClearApiKey()">Clear</button>
              </div>
              <div id="connectionResult"></div>
            </form>
          </div>
        </div>

        <div class="card">
          <h3>API Settings</h3>
          <p class="helper">Optional: Store Evolution API credentials locally for convenience.</p>
          <form class="form" onsubmit="return handleSaveSettings(event)">
            <div class="form-row">
              <label>
                Evolution API Key
                <input id="evolutionApiKeyInput" type="password" placeholder="EVOLUTION_API_KEY" />
              </label>
              <label>
                Evolution API URL
                <input id="evolutionApiUrlInput" type="text" placeholder="https://api.evolution.com" />
              </label>
            </div>
            <div class="form-row">
              <label>
                Webhook Secret
                <input id="webhookSecretInput" type="password" placeholder="WEBHOOK_SECRET" />
              </label>
              <label>
                Maturador API Key
                <input id="maturadorApiKeyInput" type="password" placeholder="MATURADOR_API_KEY" />
              </label>
            </div>
            <div class="button-group">
              <button type="submit" class="button button-primary">Save Settings</button>
              <button type="button" class="button button-secondary" onclick="handleClearSettings()">Clear All</button>
            </div>
            <div id="settingsResult"></div>
          </form>
        </div>
      </div>

      <!-- Instances Tab -->
      <div class="tab-section" id="instances-tab">
        <div class="section-header">
          <h2>WhatsApp Instances</h2>
          <p>Manage connected WhatsApp instances</p>
        </div>

        <div id="instancesAlert"></div>

        <div class="card">
          <h3>Create New Instance</h3>
          <p class="helper">Set up a new WhatsApp instance with the Evolution API.</p>
          <form class="form" onsubmit="return handleCreateInstance(event)">
            <div class="form-row">
              <label>
                Display Name
                <input id="instanceNameInput" type="text" placeholder="Vendas" required />
              </label>
              <label>
                Instance ID
                <input id="instanceSlugInput" type="text" placeholder="vendas" required />
              </label>
            </div>
            <label>
              Phone Number (optional)
              <input id="instancePhoneInput" type="text" placeholder="+5511999999999" />
            </label>
            <button type="submit" class="button button-primary">Create Instance</button>
            <div id="createInstanceResult"></div>
          </form>
        </div>

        <div class="card">
          <h3>Active Instances</h3>
          <div id="instancesList" class="list"></div>
        </div>
      </div>

      <!-- Messages Tab -->
      <div class="tab-section" id="messages-tab">
        <div class="section-header">
          <h2>Message Queue</h2>
          <p>Send and manage scheduled messages</p>
        </div>

        <div id="messagesAlert"></div>

        <div class="card">
          <h3>Queue New Message</h3>
          <p class="helper">Send a message to a recipient. Scheduling is optional.</p>
          <form class="form" onsubmit="return handleSendMessage(event)">
            <div class="form-row">
              <label>
                Instance Name
                <input id="messageInstanceInput" type="text" placeholder="vendas" required />
              </label>
              <label>
                Recipient Phone
                <input id="recipientInput" type="text" placeholder="+5511999999999" required />
              </label>
            </div>
            <label>
              Message Text
              <textarea id="messageTextInput" placeholder="Hello! This is a test message." required></textarea>
            </label>
            <label>
              Schedule (optional ISO datetime)
              <input id="scheduledAtInput" type="datetime-local" />
            </label>
            <button type="submit" class="button button-primary">Queue Message</button>
            <div id="sendMessageResult"></div>
          </form>
        </div>

        <div class="card">
          <h3>Pending Messages</h3>
          <div id="messagesList" class="list"></div>
        </div>
      </div>

      <!-- Logs Tab -->
      <div class="tab-section" id="logs-tab">
        <div class="section-header">
          <h2>Activity Logs</h2>
          <p>Recent events and webhook logs</p>
        </div>

        <div class="card">
          <h3>Recent Events</h3>
          <div id="logsList" class="list"></div>
        </div>
      </div>
    </div>
  </div>

  <script>
    const state = {
      apiKey: localStorage.getItem('whatsapp-disparador.apiKey') || '',
      setupToken: localStorage.getItem('whatsapp-disparador.setupToken') || '',
      evolutionApiKey: localStorage.getItem('whatsapp-disparador.evolutionApiKey') || '',
      evolutionApiUrl: localStorage.getItem('whatsapp-disparador.evolutionApiUrl') || '',
      webhookSecret: localStorage.getItem('whatsapp-disparador.webhookSecret') || '',
      maturadorApiUrl: localStorage.getItem('whatsapp-disparador.maturadorApiUrl') || '',
      maturadorApiKey: localStorage.getItem('whatsapp-disparador.maturadorApiKey') || '',
    };

    const $ = (id) => document.getElementById(id);
    const tabs = ['setup', 'instances', 'messages', 'logs'];
    const tabTitles = { setup: 'Setup', instances: 'Instances', messages: 'Messages', logs: 'Logs' };

    function authHeaders(extra = {}) {
      return {
        'content-type': 'application/json',
        ...(state.apiKey ? { authorization: 'Bearer ' + state.apiKey } : {}),
        ...extra,
      };
    }

    async function apiFetch(path, options = {}) {
      const response = await fetch(path, {
        ...options,
        headers: authHeaders(options.headers || {}),
      });
      const text = await response.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (error) {
        data = text;
      }
      if (!response.ok) {
        throw new Error(data?.error || 'Request failed');
      }
      return data;
    }

    function showAlert(tabName, message, type = 'error') {
      const container = $(tabName + '-tab').querySelector('[id*="Alert"]');
      if (container) {
        container.innerHTML = '<div class="alert alert-' + type + '">' + message + '</div>';
      }
    }

    function clearAlert(tabName) {
      const container = $(tabName + '-tab').querySelector('[id*="Alert"]');
      if (container) {
        container.innerHTML = '';
      }
    }

    function updateStatus() {
      const statusDot = $('statusDot');
      const statusText = $('statusText');
      if (state.apiKey) {
        statusDot.className = 'status-dot online';
        statusText.textContent = 'Connected';
      } else {
        statusDot.className = 'status-dot offline';
        statusText.textContent = 'Offline';
      }
    }

    function switchTab(tabName) {
      tabs.forEach(t => {
        $(t + '-tab').classList.remove('active');
        document.querySelector('[data-tab="' + t + '"]').classList.remove('active');
      });
      $(tabName + '-tab').classList.add('active');
      document.querySelector('[data-tab="' + tabName + '"]').classList.add('active');
      $('pageTitle').textContent = tabTitles[tabName];
      loadTabData(tabName);
    }

    function statusBadge(status) {
      const badgeClass =
        status === 'connected' || status === 'sent' ? 'badge-success' :
        status === 'failed' || status === 'error' ? 'badge-error' :
        status === 'pending' ? 'badge-warning' : 'badge-info';
      return '<span class="badge ' + badgeClass + '">' + (status || 'unknown').toUpperCase() + '</span>';
    }

    function renderInstances(items) {
      const container = $('instancesList');
      if (!items || !items.length) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📱</div><p>No instances yet. Create one to get started.</p></div>';
        return;
      }
      container.innerHTML = items.map(item =>
        '<div class="list-item">' +
          '<div class="list-item-main">' +
            '<div class="list-item-title">' + item.name + '</div>' +
            '<div class="list-item-meta">ID: ' + item.instanceName + '</div>' +
            '<div class="list-item-meta">Phone: ' + (item.phoneNumber || '-') + '</div>' +
          '</div>' +
          '<div>' + statusBadge(item.status) + '</div>' +
        '</div>'
      ).join('');
    }

    function renderMessages(items) {
      const container = $('messagesList');
      if (!items || !items.length) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">💬</div><p>Queue is empty. Send a message to get started.</p></div>';
        return;
      }
      container.innerHTML = items.map(item =>
        '<div class="list-item">' +
          '<div class="list-item-main">' +
            '<div class="list-item-title">' + item.messageText.slice(0, 50) + (item.messageText.length > 50 ? '...' : '') + '</div>' +
            '<div class="list-item-meta">To: ' + item.recipientPhone + '</div>' +
            '<div class="list-item-meta">Scheduled: ' + new Date(item.scheduledAt).toLocaleString() + '</div>' +
          '</div>' +
          '<div>' + statusBadge(item.status) + '</div>' +
        '</div>'
      ).join('');
    }

    function renderLogs(data) {
      const container = $('logsList');
      const items = []
        .concat((data?.messageLogs || []).map(item => ({
          title: item.event,
          subtitle: item.messageQueue?.recipientPhone || 'Message event',
          time: item.timestamp,
        })))
        .concat((data?.webhookLogs || []).map(item => ({
          title: item.eventType,
          subtitle: 'Webhook: ' + item.instanceId,
          time: item.receivedAt,
        })));

      if (!items.length) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No events yet.</p></div>';
        return;
      }

      container.innerHTML = items.slice(0, 20).map(item =>
        '<div class="list-item">' +
          '<div class="list-item-main">' +
            '<div class="list-item-title">' + item.title + '</div>' +
            '<div class="list-item-meta">' + item.subtitle + '</div>' +
            '<div class="list-item-meta" style="color: #999; font-size: 11px;">' + new Date(item.time).toLocaleString() + '</div>' +
          '</div>' +
        '</div>'
      ).join('');
    }

    async function loadTabData(tabName) {
      if (!state.apiKey && tabName !== 'setup') {
        showAlert(tabName, 'Save an API key in Setup to load data.', 'info');
        return;
      }

      try {
        if (tabName === 'instances') {
          clearAlert(tabName);
          const data = await apiFetch('/api/v1/instances');
          renderInstances(data?.items || []);
        } else if (tabName === 'messages') {
          clearAlert(tabName);
          const data = await apiFetch('/api/v1/messages?limit=20');
          renderMessages(data?.items || []);
        } else if (tabName === 'logs') {
          clearAlert(tabName);
          const data = await apiFetch('/api/v1/logs');
          renderLogs(data);
        }
      } catch (error) {
        showAlert(tabName, error.message, 'error');
      }
    }

    function handleCreateOrg(event) {
      event.preventDefault();
      const setupToken = $('setupTokenInput').value.trim();
      const name = $('orgNameInput').value.trim() || 'Default Organization';
      const resultEl = $('createOrgResult');
      resultEl.innerHTML = '<div class="spinner" style="display: inline-block;"></div> Creating...';

      fetch('/setup/organizations', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-setup-token': setupToken },
        body: JSON.stringify({ name: name }),
      })
      .then(r => r.json().then(d => ({ ok: r.ok, data: d })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data?.error || 'Failed');
        state.apiKey = data.api_key;
        state.setupToken = setupToken;
        localStorage.setItem('whatsapp-disparador.apiKey', data.api_key);
        localStorage.setItem('whatsapp-disparador.setupToken', setupToken);
        $('apiKeyInput').value = data.api_key;
        resultEl.innerHTML = '<div class="alert alert-success">✓ Organization created. API key saved.</div>';
        updateStatus();
        setTimeout(() => switchTab('instances'), 1000);
      })
      .catch(err => {
        resultEl.innerHTML = '<div class="alert alert-error">Error: ' + err.message + '</div>';
      });
      return false;
    }

    function handleSaveApiKey(event) {
      event.preventDefault();
      const apiKey = $('apiKeyInput').value.trim();
      state.apiKey = apiKey;
      localStorage.setItem('whatsapp-disparador.apiKey', apiKey);
      $('connectionResult').innerHTML = '<div class="alert alert-success">✓ API key saved.</div>';
      updateStatus();
      loadTabData('instances');
      return false;
    }

    function handleClearApiKey() {
      state.apiKey = '';
      localStorage.removeItem('whatsapp-disparador.apiKey');
      $('apiKeyInput').value = '';
      $('connectionResult').innerHTML = '<div class="alert alert-success">✓ API key cleared.</div>';
      updateStatus();
    }

    function handleSaveSettings(event) {
      event.preventDefault();
      state.evolutionApiKey = $('evolutionApiKeyInput').value.trim();
      state.evolutionApiUrl = $('evolutionApiUrlInput').value.trim();
      state.webhookSecret = $('webhookSecretInput').value.trim();
      state.maturadorApiKey = $('maturadorApiKeyInput').value.trim();

      localStorage.setItem('whatsapp-disparador.evolutionApiKey', state.evolutionApiKey);
      localStorage.setItem('whatsapp-disparador.evolutionApiUrl', state.evolutionApiUrl);
      localStorage.setItem('whatsapp-disparador.webhookSecret', state.webhookSecret);
      localStorage.setItem('whatsapp-disparador.maturadorApiKey', state.maturadorApiKey);

      $('settingsResult').innerHTML = '<div class="alert alert-success">✓ Settings saved.</div>';
      return false;
    }

    function handleClearSettings() {
      state.evolutionApiKey = '';
      state.evolutionApiUrl = '';
      state.webhookSecret = '';
      state.maturadorApiKey = '';

      localStorage.removeItem('whatsapp-disparador.evolutionApiKey');
      localStorage.removeItem('whatsapp-disparador.evolutionApiUrl');
      localStorage.removeItem('whatsapp-disparador.webhookSecret');
      localStorage.removeItem('whatsapp-disparador.maturadorApiKey');

      $('evolutionApiKeyInput').value = '';
      $('evolutionApiUrlInput').value = '';
      $('webhookSecretInput').value = '';
      $('maturadorApiKeyInput').value = '';
      $('settingsResult').innerHTML = '<div class="alert alert-success">✓ Settings cleared.</div>';
    }

    function handleCreateInstance(event) {
      event.preventDefault();
      if (!state.apiKey) {
        showAlert('instances', 'Save an API key in Setup first.', 'error');
        return false;
      }

      const payload = {
        name: $('instanceNameInput').value.trim(),
        instanceName: $('instanceSlugInput').value.trim(),
        phoneNumber: $('instancePhoneInput').value.trim() || undefined,
      };

      const resultEl = $('createInstanceResult');
      resultEl.innerHTML = '<div class="spinner" style="display: inline-block;"></div> Creating...';

      apiFetch('/api/v1/instances', { method: 'POST', body: JSON.stringify(payload) })
        .then(data => {
          $('instanceNameInput').value = '';
          $('instanceSlugInput').value = '';
          $('instancePhoneInput').value = '';
          resultEl.innerHTML = '<div class="alert alert-success">✓ Instance created: ' + data.instance_name + '</div>';
          loadTabData('instances');
        })
        .catch(err => {
          resultEl.innerHTML = '<div class="alert alert-error">Error: ' + err.message + '</div>';
        });
      return false;
    }

    function handleSendMessage(event) {
      event.preventDefault();
      if (!state.apiKey) {
        showAlert('messages', 'Save an API key in Setup first.', 'error');
        return false;
      }

      const payload = {
        instanceName: $('messageInstanceInput').value.trim(),
        recipientPhone: $('recipientInput').value.trim(),
        messageText: $('messageTextInput').value.trim(),
        scheduledAt: $('scheduledAtInput').value ? new Date($('scheduledAtInput').value).toISOString() : undefined,
      };

      const resultEl = $('sendMessageResult');
      resultEl.innerHTML = '<div class="spinner" style="display: inline-block;"></div> Queueing...';

      apiFetch('/api/v1/messages', { method: 'POST', body: JSON.stringify(payload) })
        .then(data => {
          $('messageInstanceInput').value = '';
          $('recipientInput').value = '';
          $('messageTextInput').value = '';
          $('scheduledAtInput').value = '';
          resultEl.innerHTML = '<div class="alert alert-success">✓ Message queued: ' + data.id + '</div>';
          loadTabData('messages');
        })
        .catch(err => {
          resultEl.innerHTML = '<div class="alert alert-error">Error: ' + err.message + '</div>';
        });
      return false;
    }

    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => switchTab(item.dataset.tab));
    });

    updateStatus();
    switchTab('setup');
    setInterval(() => {
      if (state.apiKey && document.querySelector('.tab-section.active').id !== 'setup-tab') {
        loadTabData(document.querySelector('.nav-item.active').dataset.tab);
      }
    }, 15000);
  </script>
</body>
</html>`;
}
