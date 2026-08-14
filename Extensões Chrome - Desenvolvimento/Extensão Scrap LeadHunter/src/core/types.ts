export type ISODateString = string;

export type Lead = {
  id: string;
  nome?: string;
  empresa?: string;
  cargo?: string;
  localizacao?: string;
  telefone?: string; // E.164 BR (+55...) when possible
  email?: string;
  whatsappUrl?: string;
  linkedinUrl?: string;
  siteUrl?: string;
  origemUrl: string;
  origemTitulo?: string;
  origemPlataforma?: string;
  score: number;
  confidence: number; // 0..1
  status: "new" | "contacted" | "qualified" | "discarded";
  tags: string[];
  lists: string[];
  dataCaptura: ISODateString;
  updatedAt: ISODateString;
};

export type CaptureLog = {
  id: string;
  url: string;
  quantidade_leads: number;
  data: ISODateString;
};

export type Settings = {
  autoCapture: boolean;
  lang: "pt-BR" | "en";
};

export type QueueItem = {
  id: string;
  url: string;
  platform?: string;
  status: "pending" | "running" | "processed" | "error";
  lastError?: string;
  extractedLeads: number;
  attempts: number;
  startedAt?: ISODateString;
  processedAt?: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type QueueRunState = {
  isRunning: boolean;
  currentQueueId?: string;
  currentTabId?: number;
  startedAt?: ISODateString;
  updatedAt: ISODateString;
};

export type LeadList = {
  id: string;
  name: string;
  leadIds: string[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
};
