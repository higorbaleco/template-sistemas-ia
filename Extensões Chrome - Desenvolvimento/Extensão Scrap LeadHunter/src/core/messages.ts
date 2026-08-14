export type RuntimeMessage =
  | { type: "CAPTURE_CURRENT_PAGE" }
  | { type: "TOGGLE_AUTO_CAPTURE"; enabled: boolean }
  | { type: "GET_SETTINGS" }
  | { type: "SET_LANG"; lang: "pt-BR" | "en" }
  | { type: "GET_LEADS" }
  | { type: "UPDATE_LEAD"; id: string; patch: Record<string, unknown> }
  | { type: "DELETE_LEADS"; ids: string[] }
  | { type: "EXPORT_CSV" }
  | { type: "OPEN_DASHBOARD" }
  | { type: "GET_QUEUE" }
  | { type: "GET_QUEUE_STATE" }
  | { type: "QUEUE_ADD_URLS"; urls: string[] }
  | { type: "QUEUE_START_PROCESSING" }
  | { type: "QUEUE_STOP_PROCESSING" }
  | { type: "QUEUE_RETRY_ERRORS" }
  | {
      type: "QUEUE_SET_STATUS";
      id: string;
      status: "pending" | "running" | "processed" | "error";
      lastError?: string;
    }
  | { type: "CONTENT_CAPTURE_NOW" }
  | { type: "CONTENT_SET_AUTO_CAPTURE"; enabled: boolean }
  | {
      type: "CONTENT_UPSERT_LEADS";
      url: string;
      platform?: string;
      title?: string;
      leads: Array<{
        nome?: string;
        empresa?: string;
        cargo?: string;
        localizacao?: string;
        telefone?: string;
        email?: string;
        whatsappUrl?: string;
        linkedinUrl?: string;
        siteUrl?: string;
        confidence?: number;
      }>;
    };

export type RuntimeResponse =
  | { ok: true }
  | { ok: true; settings: unknown }
  | { ok: true; count: number }
  | { ok: true; leads: unknown[] }
  | { ok: true; csv: string }
  | { ok: true; queue: unknown[] }
  | { ok: true; queue: unknown[]; queueState: unknown }
  | { ok: true; queueState: unknown }
  | { ok: false; error: string };
