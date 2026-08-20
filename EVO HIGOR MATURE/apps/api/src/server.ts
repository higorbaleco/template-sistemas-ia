import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { readFile } from "node:fs/promises";
import { createPersistentApiServices } from "./index.js";
import type { Agent, WebhookSubscription, WhatsAppInstance, WarmingProfile } from "../../../packages/contracts/src/index.js";
import { summarizePlatformMetrics } from "./metrics.js";

interface ServerOptions {
  port?: number;
  host?: string;
  dataFilePath: string;
}

function sendJson(res: ServerResponse, statusCode: number, body: unknown) {
  res.statusCode = statusCode;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body, null, 2));
}

async function sendFile(res: ServerResponse, filePath: string, contentType: string) {
  const content = await readFile(filePath, { encoding: "utf8" });
  res.statusCode = 200;
  res.setHeader("content-type", `${contentType}; charset=utf-8`);
  res.end(content);
}

async function readJsonBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  const raw = await new Promise<string>((resolve) => {
    const collected: string[] = [];
    req.on("data", (piece) => collected.push(String(piece)));
    req.on("end", () => resolve(collected.join("")));
  });

  if (!raw.trim()) {
    return {};
  }

  return JSON.parse(raw) as Record<string, unknown>;
}

export async function startApiServer(options: ServerOptions): Promise<{ server: Server; services: Awaited<ReturnType<typeof createPersistentApiServices>> }> {
  const services = await createPersistentApiServices(options.dataFilePath);
  const { store, warmingService, webhookService } = services;

  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");
    const method = req.method ?? "GET";
    const pathname = url.pathname;

    try {
      if (method === "GET" && pathname === "/") {
        await sendFile(res, "apps/web/public/index.html", "text/html");
        return;
      }

      if (method === "GET" && pathname === "/styles.css") {
        await sendFile(res, "apps/web/public/styles.css", "text/css");
        return;
      }

      if (method === "GET" && pathname === "/app.js") {
        await sendFile(res, "apps/web/public/app.js", "application/javascript");
        return;
      }

      if (method === "GET" && pathname === "/health") {
        sendJson(res, 200, { ok: true });
        return;
      }

      if (method === "GET" && pathname === "/dashboard") {
        sendJson(res, 200, {
          counters: {
            activeAgents: store.agents.filter((agent) => agent.active).length,
            activeInstances: store.instances.filter((instance) => instance.lifecycleStatus !== "BLOCKED").length,
            runningWarmingSessions: store.warmingSessions.filter((session) => session.status === "running").length,
            messagesToday: store.instances.reduce((sum, instance) => sum + instance.messagesSentToday, 0)
          },
          agents: store.agents,
          instances: store.instances,
          conversations: store.conversations,
          warmingSessions: store.warmingSessions,
          webhooks: store.webhookSubscriptions,
          metrics: summarizePlatformMetrics(store)
        });
        return;
      }

      if (method === "GET" && pathname === "/state") {
        sendJson(res, 200, {
          agents: store.agents,
          instances: store.instances,
          conversations: store.conversations,
          messages: store.messages,
          warmingProfiles: store.warmingProfiles,
          warmingSessions: store.warmingSessions,
          warmingMessageLogs: store.warmingMessageLogs,
          instanceBlockEvents: store.instanceBlockEvents,
          webhookSubscriptions: store.webhookSubscriptions,
          webhookDeliveries: store.webhookDeliveries,
          metrics: store.metrics
        });
        return;
      }

      if (method === "POST" && pathname === "/seed/demo") {
        const { seedDemoState } = await import("./seed.js");
        const seeded = await seedDemoState(store);
        await store.flush();
        sendJson(res, 200, { ok: true, seeded });
        return;
      }

      if (method === "GET" && pathname === "/agents") {
        sendJson(res, 200, store.agents);
        return;
      }

      if (method === "POST" && pathname === "/agents") {
        const payload = await readJsonBody(req);
        const now = new Date().toISOString();
        const agent: Agent = {
          id: String(payload.id ?? `agent_${Date.now()}`),
          name: String(payload.name ?? "Novo agente"),
          username: String(payload.username ?? "agent"),
          avatar: (payload.avatar as string | null | undefined) ?? null,
          role: (payload.role as string | null | undefined) ?? null,
          personality: String(payload.personality ?? ""),
          tone: String(payload.tone ?? ""),
          writingStyle: String(payload.writingStyle ?? ""),
          responseLengthPolicy: String(payload.responseLengthPolicy ?? ""),
          language: String(payload.language ?? "pt-BR"),
          timezone: String(payload.timezone ?? "America/Sao_Paulo"),
          trainingBase: String(payload.trainingBase ?? ""),
          knowledgeSources: Array.isArray(payload.knowledgeSources) ? payload.knowledgeSources.map(String) : [],
          greetingTemplates: Array.isArray(payload.greetingTemplates) ? payload.greetingTemplates.map(String) : [],
          fallbackTemplates: Array.isArray(payload.fallbackTemplates) ? payload.fallbackTemplates.map(String) : [],
          groupBehaviorPolicy: String(payload.groupBehaviorPolicy ?? ""),
          privateChatPolicy: String(payload.privateChatPolicy ?? ""),
          mentionOnlyMode: Boolean(payload.mentionOnlyMode ?? false),
          active: Boolean(payload.active ?? false),
          riskLevel: Number(payload.riskLevel ?? 0),
          llmProvider: String(payload.llmProvider ?? "openai"),
          llmModel: String(payload.llmModel ?? "gpt-4o-mini"),
          llmApiKeyRef: String(payload.llmApiKeyRef ?? "env:OPENAI_API_KEY"),
          temperature: Number(payload.temperature ?? 0.4),
          maxTokens: Number(payload.maxTokens ?? 512),
          memoryWindow: Number(payload.memoryWindow ?? 20),
          memoryPolicy: String(payload.memoryPolicy ?? ""),
          allowedChannels: Array.isArray(payload.allowedChannels) ? payload.allowedChannels.map(String) as Agent["allowedChannels"] : ["private", "group"],
          blockedChannels: Array.isArray(payload.blockedChannels) ? payload.blockedChannels.map(String) as Agent["blockedChannels"] : [],
          tags: Array.isArray(payload.tags) ? payload.tags.map(String) : [],
          createdAt: now,
          updatedAt: now
        };

        store.upsertAgent(agent);
        await store.flush();
        sendJson(res, 201, agent);
        return;
      }

      if (method === "GET" && pathname === "/instances") {
        sendJson(res, 200, store.instances);
        return;
      }

      if (method === "POST" && pathname === "/instances") {
        const payload = await readJsonBody(req);
        const now = new Date().toISOString();
        const instance: WhatsAppInstance = {
          id: String(payload.id ?? `instance_${Date.now()}`),
          phoneNumber: String(payload.phoneNumber ?? ""),
          label: String(payload.label ?? "Instância"),
          sessionRef: String(payload.sessionRef ?? ""),
          connectionStatus: (payload.connectionStatus as WhatsAppInstance["connectionStatus"]) ?? "disconnected",
          connectionUpdatedAt: now,
          lifecycleStatus: (payload.lifecycleStatus as WhatsAppInstance["lifecycleStatus"]) ?? "CONNECTING",
          lifecycleUpdatedAt: now,
          linkedAgentId: (payload.linkedAgentId as string | null | undefined) ?? null,
          warmingProfileId: (payload.warmingProfileId as string | null | undefined) ?? null,
          warmingStartedAt: (payload.warmingStartedAt as string | null | undefined) ?? null,
          warmingCompletedAt: (payload.warmingCompletedAt as string | null | undefined) ?? null,
          dailyMessageLimitTarget: Number(payload.dailyMessageLimitTarget ?? 30),
          dailyMessageLimitCurrent: Number(payload.dailyMessageLimitCurrent ?? 5),
          messagesSentToday: Number(payload.messagesSentToday ?? 0),
          messagesSentTotal: Number(payload.messagesSentTotal ?? 0),
          lastResetAt: String(payload.lastResetAt ?? now.slice(0, 10)),
          excludedFromGroupWarming: Boolean(payload.excludedFromGroupWarming ?? false),
          riskScore: Number(payload.riskScore ?? 0),
          createdAt: now,
          createdByUserId: (payload.createdByUserId as string | null | undefined) ?? null,
          deletedAt: (payload.deletedAt as string | null | undefined) ?? null
        };

        store.upsertInstance(instance);
        await store.flush();
        sendJson(res, 201, instance);
        return;
      }

      if (method === "POST" && pathname === "/warming/sessions") {
        const payload = await readJsonBody(req);
        const mode = payload.mode === "group" ? "group" : "private";
        const session = warmingService.startSession(mode);
        await store.flush();
        sendJson(res, 201, session);
        return;
      }

      if (method === "GET" && pathname === "/warming/profiles") {
        sendJson(res, 200, store.warmingProfiles);
        return;
      }

      if (method === "POST" && pathname === "/warming/profiles") {
        const payload = await readJsonBody(req);
        const now = new Date().toISOString();
        const profile: WarmingProfile = {
          id: String(payload.id ?? `warming_profile_${Date.now()}`),
          name: String(payload.name ?? "Perfil de aquecimento"),
          workspaceId: String(payload.workspaceId ?? "default"),
          steps: Array.isArray(payload.steps)
            ? payload.steps.map((step: Record<string, unknown>) => ({
                stepOrder: Number(step.stepOrder ?? 0),
                dayOffset: Number(step.dayOffset ?? 0),
                maxMessagesPerDay: Number(step.maxMessagesPerDay ?? 5),
                minIntervalSeconds: step.minIntervalSeconds == null ? null : Number(step.minIntervalSeconds),
                maxIntervalSeconds: step.maxIntervalSeconds == null ? null : Number(step.maxIntervalSeconds)
              }))
            : [],
          promoteToReadyCriteria: (payload.promoteToReadyCriteria as WarmingProfile["promoteToReadyCriteria"]) ?? "days",
          promoteToReadyDays: Number(payload.promoteToReadyDays ?? 7),
          promoteToReadyTotalMessages: Number(payload.promoteToReadyTotalMessages ?? 80),
          switchPartnerAfterNMessages: Number(payload.switchPartnerAfterNMessages ?? 10),
          stopAfterNMessages: Number(payload.stopAfterNMessages ?? 50),
          useLlmContent: Boolean(payload.useLlmContent ?? true),
          templateMessages: Array.isArray(payload.templateMessages) ? payload.templateMessages.map(String) : [],
          minIntervalSeconds: Number(payload.minIntervalSeconds ?? 30),
          maxIntervalSeconds: Number(payload.maxIntervalSeconds ?? 120),
          createdAt: now,
          updatedAt: now
        };

        store.upsertWarmingProfile(profile);
        await store.flush();
        sendJson(res, 201, profile);
        return;
      }

      if (method === "POST" && pathname.startsWith("/warming/sessions/") && pathname.endsWith("/turn")) {
        const sessionId = pathname.split("/")[3];
        const payload = await readJsonBody(req);
        const result = warmingService.registerSyntheticTurn(
          sessionId,
          String(payload.content ?? ""),
          String(payload.fromInstanceId ?? ""),
          (payload.toInstanceId as string | null | undefined) ?? null
        );
        await store.flush();
        sendJson(res, 201, result);
        return;
      }

      if (method === "POST" && pathname === "/webhooks/test") {
        sendJson(res, 200, {
          ok: true,
          eventType: "webhook.delivery_failed"
        });
        return;
      }

      if (method === "GET" && pathname === "/webhooks/subscriptions") {
        sendJson(res, 200, webhookService.listSubscriptions());
        return;
      }

      if (method === "POST" && pathname === "/webhooks/subscriptions") {
        const payload = await readJsonBody(req);
        const now = new Date().toISOString();
        const subscription: WebhookSubscription = {
          id: String(payload.id ?? `webhook_${Date.now()}`),
          url: String(payload.url ?? ""),
          secretRef: String(payload.secretRef ?? "env:WEBHOOK_SECRET"),
          eventTypes: Array.isArray(payload.eventTypes) ? payload.eventTypes.map(String) as WebhookSubscription["eventTypes"] : [],
          active: Boolean(payload.active ?? true),
          createdAt: now,
          updatedAt: now
        };

        webhookService.registerSubscription(subscription);
        await store.flush();
        sendJson(res, 201, subscription);
        return;
      }

      if (method === "GET" && pathname === "/metrics") {
        sendJson(res, 200, summarizePlatformMetrics(store));
        return;
      }

      sendJson(res, 404, { error: "not_found", path: pathname });
    } catch (error) {
      sendJson(res, 500, {
        error: "internal_error",
        message: error instanceof Error ? error.message : String(error)
      });
    }
  });

  server.listen(options.port ?? 3000, options.host ?? "0.0.0.0");

  return { server, services };
}
