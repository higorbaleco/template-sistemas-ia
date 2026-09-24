import type { Settings } from "./types";

export type I18nKey =
  | "app_name"
  | "auto_capture"
  | "capture_now"
  | "open_dashboard"
  | "leads_found"
  | "status_on"
  | "status_off"
  | "dashboard_title"
  | "tab_leads"
  | "tab_queue"
  | "search_placeholder"
  | "filter_origin"
  | "export_csv"
  | "delete_selected"
  | "open_whatsapp"
  | "open_linkedin"
  | "edit_lead"
  | "save"
  | "cancel"
  | "field_name"
  | "field_company"
  | "field_role"
  | "field_location"
  | "field_phone"
  | "field_email"
  | "field_tags"
  | "field_status"
  | "queue_add_urls"
  | "queue_placeholder"
  | "queue_status"
  | "queue_open"
  | "queue_start"
  | "queue_stop"
  | "queue_retry_failed"
  | "queue_running"
  | "queue_idle"
  | "queue_summary"
  | "queue_current"
  | "queue_attempts"
  | "onboarding_title"
  | "onboarding_body"
  | "select_all"
  | "no_leads";

const PT: Record<I18nKey, string> = {
  app_name: "LeadHunter",
  auto_capture: "Captura automática",
  capture_now: "Capturar desta página",
  open_dashboard: "Abrir painel",
  leads_found: "Leads capturados",
  status_on: "Ligado",
  status_off: "Desligado",
  dashboard_title: "Gestão de Leads",
  tab_leads: "Leads",
  tab_queue: "Fila",
  search_placeholder: "Procurar por nome, telefone ou origem...",
  filter_origin: "Filtrar por origem",
  export_csv: "Exportar CSV",
  delete_selected: "Excluir selecionados",
  open_whatsapp: "Abrir WhatsApp",
  open_linkedin: "Abrir LinkedIn",
  edit_lead: "Editar",
  save: "Salvar",
  cancel: "Cancelar",
  field_name: "Nome",
  field_company: "Empresa",
  field_role: "Cargo",
  field_location: "Localização",
  field_phone: "Telefone",
  field_email: "E-mail",
  field_tags: "Tags (vírgula)",
  field_status: "Status",
  queue_add_urls: "Adicionar URLs",
  queue_placeholder: "Cole URLs (uma por linha)...",
  queue_status: "Status",
  queue_open: "Abrir",
  queue_start: "Iniciar fila",
  queue_stop: "Parar fila",
  queue_retry_failed: "Repetir erros",
  queue_running: "Fila em execução",
  queue_idle: "Fila parada",
  queue_summary: "Resumo da fila",
  queue_current: "Atual",
  queue_attempts: "Tentativas",
  onboarding_title: "Como usar",
  onboarding_body:
    "Capture manualmente uma página ou adicione URLs na fila. Quando a fila estiver ativa, a extensão abre cada URL, captura os contatos visíveis e salva localmente.",
  select_all: "Selecionar tudo",
  no_leads: "Nenhum lead salvo ainda.",
};

const EN: Record<I18nKey, string> = {
  app_name: "LeadHunter",
  auto_capture: "Auto capture",
  capture_now: "Capture this page",
  open_dashboard: "Open dashboard",
  leads_found: "Leads captured",
  status_on: "On",
  status_off: "Off",
  dashboard_title: "Lead Management",
  tab_leads: "Leads",
  tab_queue: "Queue",
  search_placeholder: "Search name, phone or origin...",
  filter_origin: "Filter by origin",
  export_csv: "Export CSV",
  delete_selected: "Delete selected",
  open_whatsapp: "Open WhatsApp",
  open_linkedin: "Open LinkedIn",
  edit_lead: "Edit",
  save: "Save",
  cancel: "Cancel",
  field_name: "Name",
  field_company: "Company",
  field_role: "Role",
  field_location: "Location",
  field_phone: "Phone",
  field_email: "Email",
  field_tags: "Tags (comma)",
  field_status: "Status",
  queue_add_urls: "Add URLs",
  queue_placeholder: "Paste URLs (one per line)...",
  queue_status: "Status",
  queue_open: "Open",
  queue_start: "Start queue",
  queue_stop: "Stop queue",
  queue_retry_failed: "Retry errors",
  queue_running: "Queue running",
  queue_idle: "Queue idle",
  queue_summary: "Queue summary",
  queue_current: "Current",
  queue_attempts: "Attempts",
  onboarding_title: "How to use",
  onboarding_body:
    "Capture a page manually or add URLs to the queue. When the queue is active, the extension opens each URL, captures visible contact data, and saves it locally.",
  select_all: "Select all",
  no_leads: "No leads saved yet.",
};

export function t(lang: Settings["lang"], key: I18nKey): string {
  return (lang === "pt-BR" ? PT : EN)[key];
}
