import "../../ui/shared/styles.css";
import type { RuntimeMessage } from "../../core/messages";
import type { Settings } from "../../core/types";
import { t } from "../../core/i18n";

type SettingsResp = { ok: true; settings: Settings } | { ok: false; error: string };

async function send<T = any>(msg: RuntimeMessage): Promise<T> {
  return (await chrome.runtime.sendMessage(msg)) as T;
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  return node;
}

async function loadSettings(): Promise<Settings> {
  const res = (await send<SettingsResp>({ type: "GET_SETTINGS" })) as any;
  return (res?.settings as Settings) || { autoCapture: false, lang: "pt-BR" };
}

function render(root: HTMLElement, settings: Settings, lastCount: number | null): void {
  root.innerHTML = "";
  const shell = el("div", "lh-shell");
  const card = el("div", "lh-card");

  const header = el("div", "lh-header");
  const brand = el("div", "lh-brand");
  brand.appendChild(el("div", "lh-logo"));
  const brandText = el("div");
  const title = el("div", "lh-title");
  title.textContent = t(settings.lang, "app_name");
  const subtitle = el("div", "lh-subtitle");
  subtitle.textContent = "Local capture + queue";
  brandText.appendChild(title);
  brandText.appendChild(subtitle);
  brand.appendChild(brandText);

  const lang = el("select", "lh-select");
  lang.style.width = "110px";
  const optPt = el("option") as HTMLOptionElement;
  optPt.value = "pt-BR";
  optPt.textContent = "PT-BR";
  const optEn = el("option") as HTMLOptionElement;
  optEn.value = "en";
  optEn.textContent = "EN";
  lang.appendChild(optPt);
  lang.appendChild(optEn);
  lang.value = settings.lang;
  lang.addEventListener("change", async () => {
    const nextLang = (lang.value === "en" ? "en" : "pt-BR") as Settings["lang"];
    await send({ type: "SET_LANG", lang: nextLang });
    settings.lang = nextLang;
    render(root, settings, lastCount);
  });

  header.appendChild(brand);
  header.appendChild(lang);

  const row = el("div", "lh-row");
  const kv = el("div", "lh-kv");
  const k = el("div", "lh-k");
  k.textContent = t(settings.lang, "auto_capture");
  const v = el("div", "lh-v");
  const badge = el("span", `lh-badge ${settings.autoCapture ? "lh-on" : "lh-off"}`);
  badge.textContent = settings.autoCapture ? t(settings.lang, "status_on") : t(settings.lang, "status_off");
  v.appendChild(badge);
  kv.appendChild(k);
  kv.appendChild(v);

  const sw = el("div", "lh-switch");
  sw.setAttribute("role", "switch");
  sw.setAttribute("tabindex", "0");
  sw.dataset.on = settings.autoCapture ? "true" : "false";
  const toggle = async () => {
    const next = !settings.autoCapture;
    const res: any = await send({ type: "TOGGLE_AUTO_CAPTURE", enabled: next });
    settings.autoCapture = Boolean(res?.settings?.autoCapture);
    render(root, settings, lastCount);
  };
  sw.addEventListener("click", toggle);
  sw.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") toggle();
  });

  row.appendChild(kv);
  row.appendChild(sw);

  const controls = el("div", "lh-controls");
  const captureBtn = el("button", "lh-btn");
  captureBtn.textContent = t(settings.lang, "capture_now");
  captureBtn.addEventListener("click", async () => {
    captureBtn.setAttribute("disabled", "true");
    try {
      const res: any = await send({ type: "CAPTURE_CURRENT_PAGE" });
      lastCount = res?.ok ? Number(res.count || 0) : 0;
    } finally {
      captureBtn.removeAttribute("disabled");
      render(root, settings, lastCount);
    }
  });

  const dashBtn = el("button", "lh-btn lh-secondary");
  dashBtn.textContent = t(settings.lang, "open_dashboard");
  dashBtn.addEventListener("click", async () => {
    await send({ type: "OPEN_DASHBOARD" });
    window.close();
  });

  controls.appendChild(captureBtn);
  controls.appendChild(dashBtn);

  const onboarding = el("div", "lh-onboarding");
  const onboardingTitle = el("div", "lh-onboarding-title");
  onboardingTitle.textContent = t(settings.lang, "onboarding_title");
  const onboardingBody = el("div", "lh-muted");
  onboardingBody.textContent = t(settings.lang, "onboarding_body");
  onboarding.appendChild(onboardingTitle);
  onboarding.appendChild(onboardingBody);

  const row2 = el("div", "lh-row");
  const kv2 = el("div", "lh-kv");
  const k2 = el("div", "lh-k");
  k2.textContent = t(settings.lang, "leads_found");
  const v2 = el("div", "lh-v");
  v2.textContent = lastCount === null ? "—" : String(lastCount);
  kv2.appendChild(k2);
  kv2.appendChild(v2);
  row2.appendChild(kv2);

  const note = el("div");
  note.style.padding = "0 14px 14px";
  note.className = "lh-muted";
  note.style.fontSize = "12px";
  note.textContent =
    settings.lang === "pt-BR"
      ? "A fila abre URLs em abas temporárias, captura os dados visíveis e salva tudo localmente."
      : "The queue opens URLs in temporary tabs, captures visible data, and saves everything locally.";

  card.appendChild(header);
  card.appendChild(row);
  card.appendChild(controls);
  card.appendChild(onboarding);
  card.appendChild(row2);
  card.appendChild(note);
  shell.appendChild(card);
  root.appendChild(shell);
}

async function main(): Promise<void> {
  const root = document.getElementById("app");
  if (!root) return;
  const settings = await loadSettings();
  render(root, settings, null);
}

main();
