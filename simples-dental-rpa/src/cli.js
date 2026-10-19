import 'dotenv/config';
import { login } from './auth/login.js';
import { openContext } from './browser.js';
import { listAppointments } from './actions/appointments.js';
import { listPatients, getPatient } from './actions/patients.js';

const [, , command, ...args] = process.argv;

// Helper para gerar intervalos de data
function getTodayRange() {
  const today = new Date();
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  start.setHours(start.getHours() - 3); // Timezone adjustment for São Paulo

  const end = new Date(start);
  end.setDate(end.getDate() + 7); // 7 days range

  return {
    startDh: start.toISOString(),
    endDh: end.toISOString(),
  };
}

const commands = {
  async login() {
    await login();
  },

  async 'list-appointments'() {
    console.log('📅 Listando agendamentos...\n');
    const { browser, context } = await openContext();

    try {
      const { startDh, endDh } = getTodayRange();
      const result = await listAppointments(context, startDh, endDh);

      console.log(`Total: ${result.length || result.data?.length || 0} agendamentos\n`);
      console.log(JSON.stringify(result, null, 2));
    } finally {
      await browser.close();
    }
  },

  async 'list-patients'() {
    console.log('👥 Listando pacientes...\n');
    const { browser, context } = await openContext();

    try {
      const query = args[0] || null;
      const result = await listPatients(context, query, 1, 20);

      console.log(`Total: ${result.length || result.data?.length || 0} pacientes\n`);
      console.log(JSON.stringify(result, null, 2));
    } finally {
      await browser.close();
    }
  },

  async 'get-patient'() {
    const patientId = args[0];
    if (!patientId) {
      console.error('❌ Erro: forneça o ID do paciente');
      console.error('Uso: npm run get-patient <patientId>');
      process.exit(1);
    }

    console.log(`📋 Obtendo dados do paciente ${patientId}...\n`);
    const { browser, context } = await openContext();

    try {
      const result = await getPatient(context, patientId);
      console.log(JSON.stringify(result, null, 2));
    } finally {
      await browser.close();
    }
  },

  async 'create-appointment'() {
    console.log(
      '⚠️  Criar agendamento ainda não está implementado.\n' +
      'O endpoint exato para POST não foi identificado na captura.\n' +
      'Verifique API-REFERENCE.md para mais detalhes.'
    );
  },

  async help() {
    console.log(`
Comandos disponíveis:

  npm run login
    Faz login no Simples Dental e salva a sessão

  npm run list-appointments
    Lista agendamentos da próxima semana

  npm run list-patients [busca]
    Lista pacientes (opcional: filtra por nome)

  npm run get-patient <id>
    Obtém dados completos de um paciente

  npm run create-appointment
    (Ainda não implementado)

Exemplo:
  npm run get-patient 26926607
  npm run list-patients "João"
    `);
  },
};

const fn = commands[command];
if (!fn) {
  console.log(`❌ Comando desconhecido: ${command}`);
  console.log(`ℹ️  Digite: npm run help\n`);
  process.exit(1);
}

await fn().catch((err) => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
