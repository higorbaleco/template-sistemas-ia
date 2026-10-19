import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { openContext, saveSession } from '../src/browser.js';
import { saveRawCapture } from '../src/storage/db.js';

/**
 * Script de auto-navegação que captura a API interna automaticamente.
 * Percorre a interface do Simples Dental clicando em elementos chave
 * para gerar requisições de API que precisamos documentar.
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
  console.log(`  ✓ Capturado: ${entry.method} ${entry.url.split('/').slice(-2).join('/')}`);
}

async function main() {
  console.log('🚀 Iniciando captura automática de API...\n');

  const { browser, context } = await openContext();
  const page = await context.newPage();

  // Intercepta respostas de rede
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

  try {
    console.log('📍 Navegando para dashboard...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Tenta encontrar e clicar em "Agenda"
    console.log('\n📅 Procurando Agenda...');
    const agendaSelectors = [
      'a[href*="agenda"]',
      'button:has-text("Agenda")',
      '[data-testid="agenda"]',
      'nav a:has-text("Agenda")',
    ];
    for (const selector of agendaSelectors) {
      try {
        const el = await page.$(selector);
        if (el) {
          await el.click();
          await page.waitForTimeout(2000);
          console.log('  ✓ Clicou em Agenda');
          break;
        }
      } catch {
        // selector não encontrado
      }
    }

    // Tenta expandir lista de pacientes/agendamentos
    console.log('\n👥 Procurando lista de agendamentos...');
    const listSelectors = [
      '[data-testid="appointments-list"]',
      'table tbody tr',
      '.appointments',
      '[class*="appointment"]',
    ];
    for (const selector of listSelectors) {
      try {
        const el = await page.$(selector);
        if (el) {
          console.log('  ✓ Encontrou elemento de agendamentos');
          break;
        }
      } catch {
        // ignore
      }
    }

    // Tenta clicar em um paciente/agendamento
    console.log('\n👤 Clicando em primeiro agendamento...');
    const appointmentSelectors = [
      'table tbody tr:first-child',
      '[data-testid="appointment-item"]:first-child',
      '.appointment-row:first-child',
      'li[class*="appointment"]:first-child',
    ];
    for (const selector of appointmentSelectors) {
      try {
        const el = await page.$(selector);
        if (el) {
          await el.click();
          await page.waitForTimeout(2000);
          console.log('  ✓ Clicou em agendamento');
          break;
        }
      } catch {
        // ignore
      }
    }

    // Tenta abrir prontuário
    console.log('\n📋 Procurando prontuário...');
    const recordSelectors = [
      'a[href*="prontuario"]',
      'a[href*="paciente"]',
      'button:has-text("Prontuário")',
      'button:has-text("Paciente")',
      '[data-testid="patient-record"]',
    ];
    for (const selector of recordSelectors) {
      try {
        const el = await page.$(selector);
        if (el) {
          await el.click();
          await page.waitForTimeout(2000);
          console.log('  ✓ Clicou em prontuário');
          break;
        }
      } catch {
        // ignore
      }
    }

    // Tenta encontrar e clicar em "Financeiro" ou "Pacientes"
    console.log('\n💰 Procurando seção de Financeiro/Pacientes...');
    const financeSelectors = [
      'a[href*="financeiro"]',
      'a[href*="pacientes"]',
      'button:has-text("Financeiro")',
      'button:has-text("Pacientes")',
    ];
    for (const selector of financeSelectors) {
      try {
        const el = await page.$(selector);
        if (el) {
          await el.click();
          await page.waitForTimeout(2000);
          console.log('  ✓ Clicou em seção financeira');
          break;
        }
      } catch {
        // ignore
      }
    }

    // Scroll pela página para carregar mais dados
    console.log('\n⬇️ Fazendo scroll...');
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 3));
    await page.waitForTimeout(1500);

    // Tenta voltar à agenda
    console.log('\n🔄 Voltando à Agenda...');
    const backSelectors = [
      'a[href*="agenda"]',
      'button:has-text("Agenda")',
    ];
    for (const selector of backSelectors) {
      try {
        const el = await page.$(selector);
        if (el) {
          await el.click();
          await page.waitForTimeout(2000);
          console.log('  ✓ Voltou à Agenda');
          break;
        }
      } catch {
        // ignore
      }
    }

    await page.waitForTimeout(2000);

  } catch (err) {
    console.error('❌ Erro durante navegação:', err.message);
  }

  console.log('\n✅ Captura concluída!');
  console.log(`📊 Total de requisições capturadas: ${seq}`);
  console.log(`📁 Arquivos salvos em: ${OUT_DIR}`);
  console.log(`💾 E também em: data/simples-dental.db (tabela raw_captures)`);

  await saveSession(context).catch(() => {});
  await browser.close();
}

main().catch(console.error);
