import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { openContext, saveSession } from '../src/browser.js';
import { saveRawCapture } from '../src/storage/db.js';

/**
 * Captura com navegação manual.
 * Abre o navegador em modo visível (HEADLESS=false) para você navegar manualmente
 * enquanto o script captura TODAS as chamadas de API em background.
 *
 * Instruções:
 * 1. Navegue pela Agenda
 * 2. Clique em um agendamento
 * 3. Abra prontuários
 * 4. Clique em pacientes
 * 5. Abra confirmação de consulta
 * 6. Qualquer outra ação que precise ser automatizada
 *
 * Quando terminar, feche o navegador. Os dados foram gravados automaticamente.
 */

const BASE_URL = process.env.SIMPLESDENTAL_BASE_URL ?? 'https://app.simplesdental.com';
const OUT_DIR = path.resolve('data/network-capture');
fs.mkdirSync(OUT_DIR, { recursive: true });

let seq = 0;

function saveCapture(entry) {
  try {
    saveRawCapture(entry);
  } catch (err) {
    console.error('Erro ao salvar no DB:', err.message);
  }

  seq += 1;
  const safeName = `${String(seq).padStart(4, '0')}-${entry.method}-${Date.now()}.json`;
  fs.writeFileSync(path.join(OUT_DIR, safeName), JSON.stringify(entry, null, 2));
  console.log(`📡 ${entry.method.padEnd(4)} ${entry.status} ${entry.url.split('/').slice(-1)[0]}`);
}

async function main() {
  console.log('🎬 CAPTURA MANUAL - Navegue pela interface do Simples Dental');
  console.log('═'.repeat(60));
  console.log('');
  console.log('📋 O QUE FAZER:');
  console.log('  1. Abra a Agenda');
  console.log('  2. Clique em um agendamento/paciente');
  console.log('  3. Abra o prontuário');
  console.log('  4. Confirme uma consulta');
  console.log('  5. Navegue pelos menus (Financeiro, Pacientes, etc)');
  console.log('');
  console.log('⏹️  QUANDO TERMINAR: Feche o navegador');
  console.log('');
  console.log('═'.repeat(60));
  console.log('');

  const { browser, context } = await openContext();
  const page = await context.newPage();

  // Intercepta TODAS as respostas (não apenas XHR/fetch)
  page.on('response', async (response) => {
    const url = response.url();

    // Captura TUDO que vem de simplesdental.com
    if (!url.includes('simplesdental.com')) return;

    const request = response.request();
    const resourceType = request.resourceType();

    // Prioriza XHR/fetch, mas também captura outros tipos se forem da API
    const isApiCall = ['xhr', 'fetch'].includes(resourceType);
    const isApiUrl = url.includes('/api') || url.includes('/graphql');

    if (!isApiCall && !isApiUrl) return;

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
      // resposta binária ou já consumida
    }

    const entry = {
      method: request.method(),
      url,
      status: response.status(),
      request_body: requestBody,
      response_body: responseBody,
    };

    saveCapture(entry);
  });

  // Navega para o app
  console.log('⏳ Carregando Simples Dental...\n');
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });

  // Espera o usuário fechar o navegador
  console.log('✅ Navegador aberto. Aguardando sua navegação...\n');
  console.log('Captura em tempo real de requisições de API:\n');

  try {
    await page.waitForEvent('close', { timeout: 0 });
  } catch (err) {
    // timeout infinito, nunca vai dar erro aqui
  }

  console.log('\n');
  console.log('═'.repeat(60));
  console.log(`✅ Captura concluída! Total: ${seq} requisições`);
  console.log('═'.repeat(60));

  if (seq > 0) {
    console.log(`\n📁 Arquivos salvos em:\n   ${OUT_DIR}`);
    console.log(`\n💾 E também no banco de dados:\n   data/simples-dental.db (tabela raw_captures)`);

    // Mostra um resumo das APIs mais importantes
    console.log('\n📊 APIS CAPTURADAS:');
    const files = fs.readdirSync(OUT_DIR).sort();
    const apis = new Set();
    files.forEach((file) => {
      const content = JSON.parse(fs.readFileSync(path.join(OUT_DIR, file), 'utf8'));
      const urlParts = content.url.split('/');
      const endpoint = urlParts[urlParts.length - 1].split('?')[0];
      if (content.url.includes('/api/') || content.url.includes('api.simplesdental.com')) {
        apis.add(`${content.method} ${endpoint}`);
      }
    });
    if (apis.size > 0) {
      Array.from(apis).forEach((api) => console.log(`   - ${api}`));
    } else {
      console.log('   (Nenhuma chamada de API capturada - verifique se você navegou pela interface)');
    }
  } else {
    console.log('\n⚠️  NENHUMA REQUISIÇÃO FOI CAPTURADA!');
    console.log('   Verifique:');
    console.log('   - O navegador abriu?');
    console.log('   - Você navegou pela interface?');
    console.log('   - Há algum erro de conexão?');
  }

  await saveSession(context).catch(() => {});
  await browser.close();
}

main().catch(console.error);
