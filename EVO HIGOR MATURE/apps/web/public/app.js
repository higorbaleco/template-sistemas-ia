const state = {
  data: null
};

const $ = (selector) => document.querySelector(selector);

function metricCard(label, value, note) {
  return `
    <article class="metric-card">
      <div class="metric-label">${label}</div>
      <div class="metric-value">${value}</div>
      <div class="metric-note">${note}</div>
    </article>
  `;
}

function entityBlock(title, subtitle, meta, tags = []) {
  return `
    <div class="entity">
      <div class="entity-top">
        <div>
          <div class="entity-title">${title}</div>
          <div class="entity-subtitle">${subtitle}</div>
        </div>
      </div>
      <div class="entity-meta">${meta}</div>
      ${tags.length ? `<div class="tag-row">${tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>` : ""}
    </div>
  `;
}

function renderMetrics(data) {
  const metrics = [
    ["Active agents", data.agents.filter((agent) => agent.active).length, "Agents currently allowed to respond."],
    ["Running warming", data.warmingSessions.filter((session) => session.status === "running").length, "Sessions in warming or active ramp."],
    ["Blocked instances", data.instances.filter((instance) => instance.lifecycleStatus === "BLOCKED").length, "Numbers needing manual attention."],
    ["Messages today", data.instances.reduce((sum, instance) => sum + instance.messagesSentToday, 0), "Traffic already emitted today."]
  ];

  $("#metrics").innerHTML = metrics.map(([label, value, note]) => metricCard(label, value, note)).join("");
}

function renderAgents(data) {
  const list = $("#agents-list");
  $("#agents-count").textContent = String(data.agents.length);
  if (!data.agents.length) {
    list.innerHTML = `<div class="empty">No agents yet.</div>`;
    return;
  }

  list.innerHTML = data.agents.map((agent) => entityBlock(
    agent.name,
    `${agent.username} · ${agent.role ?? "no role"} · ${agent.llmProvider}/${agent.llmModel}`,
    `${agent.personality} · ${agent.active ? "active" : "paused"} · risk ${(agent.riskLevel * 100).toFixed(0)}%`,
    [agent.mentionOnlyMode ? "mention only" : "free reply", ...agent.tags]
  )).join("");
}

function renderInstances(data) {
  const list = $("#instances-list");
  $("#instances-count").textContent = String(data.instances.length);
  if (!data.instances.length) {
    list.innerHTML = `<div class="empty">No instances yet.</div>`;
    return;
  }

  list.innerHTML = data.instances.map((instance) => entityBlock(
    instance.label,
    `${instance.phoneNumber} · ${instance.connectionStatus}`,
    `${instance.lifecycleStatus} · ${instance.messagesSentToday}/${instance.dailyMessageLimitCurrent} today · risk ${(instance.riskScore * 100).toFixed(0)}%`,
    [instance.linkedAgentId ? `agent ${instance.linkedAgentId}` : "unlinked", instance.excludedFromGroupWarming ? "excluded from group warming" : "group warming enabled"]
  )).join("");
}

function renderWarming(data) {
  const list = $("#warming-list");
  $("#warming-count").textContent = String(data.warmingSessions.length);
  if (!data.warmingSessions.length) {
    list.innerHTML = `<div class="empty">No warming sessions yet.</div>`;
    return;
  }

  list.innerHTML = data.warmingSessions.map((session) => entityBlock(
    `${session.mode} session`,
    session.status,
    `${session.messagesExchangedCount} messages exchanged · ${session.participants.length} participants`,
    session.participants.map((participant) => participant.instanceId)
  )).join("");
}

function renderWebhooks(data) {
  const list = $("#webhooks-list");
  $("#webhooks-count").textContent = String(data.webhookSubscriptions.length);
  if (!data.webhookSubscriptions.length) {
    list.innerHTML = `<div class="empty">No webhook subscriptions yet.</div>`;
    return;
  }

  list.innerHTML = data.webhookSubscriptions.map((webhook) => entityBlock(
    webhook.url,
    webhook.active ? "active subscription" : "paused subscription",
    `${webhook.eventTypes.length} subscribed events`,
    webhook.eventTypes
  )).join("");
}

function renderActivity(data) {
  const messagesList = $("#messages-list");
  const eventsList = $("#events-list");

  if (!data.messages.length) {
    messagesList.innerHTML = `<div class="empty">No messages recorded.</div>`;
  } else {
    messagesList.innerHTML = [...data.messages]
      .slice(-6)
      .reverse()
      .map((message) => entityBlock(
        message.direction === "outbound" ? "Outbound" : "Inbound",
        message.contentPreview,
        `${message.conversationId} · ${message.sentAt}`,
        [message.agentId ?? "no agent", message.instanceId ?? "no instance"]
      )).join("");
  }

  if (!data.instanceBlockEvents.length) {
    eventsList.innerHTML = `<div class="empty">No block events recorded.</div>`;
  } else {
    eventsList.innerHTML = [...data.instanceBlockEvents]
      .slice(-6)
      .reverse()
      .map((event) => entityBlock(
        event.detectionSource,
        event.actionTaken,
        `${event.instanceId} · ${event.detectedAt}`,
        [event.notes ?? "no notes"]
      )).join("");
  }
}

function renderRuntime(data) {
  $("#runtime-status").textContent = `${data.agents.length} agents · ${data.instances.length} instances`;
}

async function refresh() {
  const response = await fetch("/state");
  const data = await response.json();
  state.data = data;
  renderRuntime(data);
  renderMetrics(data);
  renderAgents(data);
  renderInstances(data);
  renderWarming(data);
  renderWebhooks(data);
  renderActivity(data);
}

async function postJson(path, payload) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
}

function bindForms() {
  $("#seed-btn").addEventListener("click", async () => {
    await postJson("/seed/demo", {});
    await refresh();
  });

  $("#agent-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    await postJson("/agents", {
      ...payload,
      mentionOnlyMode: true,
      active: true,
      role: "persona",
      temperature: 0.45,
      maxTokens: 320,
      memoryWindow: 20,
      allowedChannels: ["private", "group"],
      blockedChannels: [],
      knowledgeSources: [],
      greetingTemplates: [],
      fallbackTemplates: [],
      tags: []
    });
    form.reset();
    await refresh();
  });

  $("#instance-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    await postJson("/instances", {
      ...payload,
      sessionRef: `session:${Date.now()}`,
      dailyMessageLimitTarget: 30,
      dailyMessageLimitCurrent: payload.lifecycleStatus === "WARMING" ? 10 : 30,
      messagesSentToday: 0,
      messagesSentTotal: 0,
      lastResetAt: new Date().toISOString().slice(0, 10),
      excludedFromGroupWarming: false,
      riskScore: 0.2
    });
    form.reset();
    await refresh();
  });

  $("#profile-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    await postJson("/warming/profiles", {
      name: payload.name || "Custom profile",
      steps: [
        { stepOrder: 0, dayOffset: 0, maxMessagesPerDay: 5, minIntervalSeconds: 30, maxIntervalSeconds: 120 },
        { stepOrder: 1, dayOffset: 2, maxMessagesPerDay: 10, minIntervalSeconds: 30, maxIntervalSeconds: 120 },
        { stepOrder: 2, dayOffset: 4, maxMessagesPerDay: 20, minIntervalSeconds: 30, maxIntervalSeconds: 120 }
      ],
      promoteToReadyCriteria: "days",
      promoteToReadyDays: 7,
      promoteToReadyTotalMessages: 80,
      switchPartnerAfterNMessages: 10,
      stopAfterNMessages: 50,
      useLlmContent: true,
      templateMessages: ["Tudo certo por aqui.", "Seguimos na area.", "Passando so pra manter o ritmo."],
      minIntervalSeconds: 30,
      maxIntervalSeconds: 120
    });
    form.reset();
    await refresh();
  });

  $("#warming-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    await postJson("/warming/sessions", {
      mode: payload.mode || "private"
    });
    await refresh();
  });

  $("#turn-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    const session = state.data?.warmingSessions?.at?.(-1);
    const fromInstanceId = state.data?.instances?.[0]?.id;
    const toInstanceId = state.data?.instances?.[1]?.id ?? null;

    if (!session || !fromInstanceId) {
      return;
    }

    await postJson(`/warming/sessions/${session.id}/turn`, {
      content: payload.content || "Tudo certo por aqui?",
      fromInstanceId,
      toInstanceId
    });
    await refresh();
  });
}

refresh().catch(() => {
  $("#runtime-status").textContent = "offline";
});
bindForms();
