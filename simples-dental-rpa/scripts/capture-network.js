import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { openContext, saveSession } from '../src/browser.js';
import { saveRawCapture } from '../src/storage/db.js';

/**
 * Roda em modo visível (HEADLESS=false), loga (ou reaproveita sessão) e deixa
 * você navegar NORMALMENTE pelo Simples Dental: abrir a agenda, abrir um
 * prontuário, confirmar uma consulta, etc.
 *
 * Toda chamada XHR/fetch que o próprio app faz é gravada:
 *   - em data/simples-dental.db (tabela raw_captures)
 *   - em data/network-capture/*.json (um arquivo por request, fácil de grep)
 *
 * Isso é o que vai nos dizer se existe uma API interna reaproveitável por trás
 * da interface (mais rápida e confiável que clicar na tela toda vez).
 *
 * Uso: npm run capture
 * Depois: Ctrl+C para parar, ou feche a janela do navegador.
 */

const BASE_URL = process.env.SIMPLESDENTAL_BASE_URL ?? 'https://app.simplesdental.com';
const OUT_DIR = path.resolve('data/network-capture');
fs.mkdirSync(OUT_DIR, { recursive: true });

async function main() {
  if (process.env.HEADLESS === 'true') {
    console.warn('Aviso: rode com HEADLESS=false no .env pra poder navegar manualmente.');
  }

  const { browser, context } = await openContext();
  const page = await context.newPage();

  let seq = 0;

  page.on('response', async (response) => {
    const url = response.url();
    if (!url.includes('simplesdental.com')) return;

    const request = response.request();
    const resourceType = request.resourceType();
    if (!['xhr', 'fetch'].includes(resourceType)) return;

    let requestBody = null;
    try {
      requestBody = request.postData();
    } catch {
      // ignore
    }

    let responseBody = null;
    try {
      responseBody = await response.text();
    } catch {
      // resposta binária ou já consumida, ignora
    }

    const entry = {
      method: request.method(),
      url,
      status: response.status(),
      request_body: requestBody,
      response_body: responseBody,
    };

    saveRawCapture(entry);

    seq += 1;
    const safeName = `${String(seq).padStart(4, '0')}-${request.method()}-${Date.now()}.json`;
    fs.writeFileSync(path.join(OUT_DIR, safeName), JSON.stringify(entry, null, 2));
  });

  await page.goto(BASE_URL);
  console.log('Navegue normalmente pelo Simples Dental nesta janela.');
  console.log('Capturando chamadas de API em data/network-capture/ ...');
  console.log('Feche o navegador quando terminar.');

  await page.waitForEvent('close', { timeout: 0 }).catch(() => {});
  await saveSession(context).catch(() => {});
  await browser.close();
}

main();
