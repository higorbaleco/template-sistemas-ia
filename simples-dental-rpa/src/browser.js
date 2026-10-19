import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config';

const SESSION_PATH = path.resolve('data/session.json');
const HEADLESS = process.env.HEADLESS !== 'false';

/**
 * Abre um browser/contexto reaproveitando a sessão salva (evita logar toda hora
 * e reduz a chance de disparar verificações anti-bot / 2FA repetidas).
 */
export async function openContext() {
  const browser = await chromium.launch({ headless: HEADLESS });
  const hasSession = fs.existsSync(SESSION_PATH);

  const context = await browser.newContext(
    hasSession ? { storageState: SESSION_PATH } : {}
  );

  return { browser, context };
}

export async function saveSession(context) {
  fs.mkdirSync(path.dirname(SESSION_PATH), { recursive: true });
  await context.storageState({ path: SESSION_PATH });
}

export function hasSavedSession() {
  return fs.existsSync(SESSION_PATH);
}
