import 'dotenv/config';
import { openContext, saveSession } from '../browser.js';

const BASE_URL = process.env.SIMPLESDENTAL_BASE_URL ?? 'https://app.simplesdental.com';

/**
 * Loga no Simples Dental e persiste a sessão em data/session.json.
 *
 * IMPORTANTE: os seletores abaixo usam texto/label (mais resistentes a redesign
 * do que classes CSS), mas foram escritos sem acesso à tela real de login —
 * rode com HEADLESS=false na primeira vez e ajuste os TODOs se algo não bater.
 */
export async function login() {
  const email = process.env.SIMPLESDENTAL_EMAIL;
  const password = process.env.SIMPLESDENTAL_PASSWORD;
  if (!email || !password) {
    throw new Error('Defina SIMPLESDENTAL_EMAIL e SIMPLESDENTAL_PASSWORD no .env');
  }

  const { browser, context } = await openContext();
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/login`);

  // TODO: confirmar se a rota de login é mesmo /login (pode redirecionar sozinho).
  await page.getByLabel(/e-?mail/i).fill(email);
  await page.getByLabel(/senha/i).fill(password);
  await page.getByRole('button', { name: /entrar|login/i }).click();

  // Espera algo que só aparece logado (ex: a agenda). Ajustar se o painel
  // inicial pós-login não for a agenda.
  await page.waitForURL(/\/simples\//, { timeout: 30_000 });

  await saveSession(context);
  await browser.close();

  console.log('Login ok, sessão salva em data/session.json');
}
