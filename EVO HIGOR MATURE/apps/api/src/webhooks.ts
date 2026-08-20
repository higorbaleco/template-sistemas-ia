import type { MetricSnapshot, WebhookDelivery, WebhookEventType, WebhookSubscription } from "../../../packages/contracts/src/index.js";
import type { PlatformStore } from "../../../packages/contracts/src/store.js";

export interface WebhookDeliveryRequest {
  subscriptionId: string;
  eventType: WebhookEventType;
  payload: Record<string, unknown>;
}

export class WebhookService {
  constructor(private readonly store: PlatformStore) {}

  registerSubscription(subscription: WebhookSubscription): WebhookSubscription {
    const saved = this.store.upsertWebhookSubscription(subscription);
    return saved;
  }

  queueDelivery(request: WebhookDeliveryRequest): WebhookDelivery {
    const now = new Date().toISOString();
    const delivery: WebhookDelivery = {
      id: `wh_${Date.now()}`,
      subscriptionId: request.subscriptionId,
      eventType: request.eventType,
      payload: request.payload,
      status: "pending",
      attempts: 0,
      lastAttemptAt: null,
      nextRetryAt: null,
      createdAt: now,
      updatedAt: now
    };

    this.store.upsertWebhookDelivery(delivery);
    return delivery;
  }

  markDelivered(deliveryId: string): WebhookDelivery {
    const delivery = this.store.webhookDeliveries.find((entry) => entry.id === deliveryId);

    if (!delivery) {
      throw new Error(`webhook_delivery_not_found:${deliveryId}`);
    }

    const updated: WebhookDelivery = {
      ...delivery,
      status: "delivered",
      attempts: delivery.attempts + 1,
      lastAttemptAt: new Date().toISOString(),
      nextRetryAt: null,
      updatedAt: new Date().toISOString()
    };

    this.store.upsertWebhookDelivery(updated);
    return updated;
  }

  listSubscriptions(): WebhookSubscription[] {
    return this.store.webhookSubscriptions;
  }
}

export function buildMetricSnapshot(scopeType: MetricSnapshot["scopeType"], scopeId: string, metricKey: string, metricValue: number): MetricSnapshot {
  const now = new Date().toISOString();

  return {
    id: `metric_${Date.now()}`,
    scopeType,
    scopeId,
    metricKey,
    metricValue,
    periodStart: now,
    periodEnd: now,
    createdAt: now
  };
}
