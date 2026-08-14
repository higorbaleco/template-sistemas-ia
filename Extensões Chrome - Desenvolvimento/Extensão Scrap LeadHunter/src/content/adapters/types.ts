import type { Platform } from "../platform";

export type ExtractedLead = {
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
};

export type AdapterResult = {
  platform: Platform;
  leads: ExtractedLead[];
};

export type Adapter = () => AdapterResult;

