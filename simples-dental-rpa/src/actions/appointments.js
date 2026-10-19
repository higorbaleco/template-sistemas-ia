/**
 * Ações para gerenciar consultas/agendamentos no Simples Dental
 */

import fetch from 'node-fetch';

const BASE_URL = process.env.SIMPLESDENTAL_BASE_URL ?? 'https://app.simplesdental.com';
const API_URL = 'https://api.simplesdental.com';

/**
 * Lista agendamentos em um período
 * @param {object} context - Playwright context com cookies de autenticação
 * @param {string} startDh - Data inicial (ISO 8601): '2026-10-19T03:00:00.000Z'
 * @param {string} endDh - Data final (ISO 8601): '2026-10-26T03:00:00.000Z'
 * @param {number} pageNumber - Página (padrão 1)
 * @param {number} pageSize - Itens por página (padrão 6)
 * @returns {Promise<object>} Objeto com consultas
 */
export async function listAppointments(context, startDh, endDh, pageNumber = 1, pageSize = 6) {
  const cookies = await context.cookies();
  const cookieString = cookies.map((c) => `${c.name}=${c.value}`).join('; ');

  const url = new URL(`${API_URL}/consultas`);
  url.searchParams.append('pageSize', pageSize);
  url.searchParams.append('pageNumber', pageNumber);
  url.searchParams.append('includes', 'perfil,profissional,paciente,cadeira');
  url.searchParams.append('orderBy', 'data');
  url.searchParams.append('direction', 'asc');
  url.searchParams.append('status', '6,5,10,12,7');
  url.searchParams.append('reagendada', 'false');
  url.searchParams.append('startDh', startDh);
  url.searchParams.append('endDh', endDh);
  url.searchParams.append('page', 'true');

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Cookie: cookieString,
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    },
  });

  if (!response.ok) {
    throw new Error(`Falha ao listar agendamentos: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Lista consultas de forma mínima (sem detalhes)
 * @param {object} context - Playwright context com cookies
 * @param {string} startDh - Data inicial
 * @param {string} endDh - Data final
 * @returns {Promise<object>} Consultas em formato mínimo
 */
export async function listAppointmentsMinimal(context, startDh, endDh) {
  const cookies = await context.cookies();
  const cookieString = cookies.map((c) => `${c.name}=${c.value}`).join('; ');

  const url = new URL(`${API_URL}/consultas`);
  url.searchParams.append('minimal', 'true');
  url.searchParams.append('startDh', startDh);
  url.searchParams.append('endDh', endDh);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Cookie: cookieString,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Falha ao listar agendamentos (minimal): ${response.status}`);
  }

  return response.json();
}

/**
 * Obtém detalhes completos de uma consulta específica
 * @param {object} context - Playwright context com cookies
 * @param {number} appointmentId - ID da consulta
 * @returns {Promise<object>} Dados da consulta
 */
export async function getAppointmentById(context, appointmentId) {
  const cookies = await context.cookies();
  const cookieString = cookies.map((c) => `${c.name}=${c.value}`).join('; ');

  const response = await fetch(`${API_URL}/consultas/${appointmentId}`, {
    method: 'GET',
    headers: {
      Cookie: cookieString,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Falha ao obter consulta ${appointmentId}: ${response.status}`);
  }

  return response.json();
}

/**
 * Exemplo: criar/agendar uma consulta
 * NOTA: Endpoint exato ainda não identificado na captura.
 * Provávelmente é POST para /consultas ou /agendamentos.
 * Ajustar conforme necessário após entender a estrutura da API.
 *
 * @param {object} context - Playwright context com cookies
 * @param {object} appointmentData - { pacienteId, profissionalId, data, hora, etc }
 * @returns {Promise<object>} Consulta criada
 */
export async function createAppointment(context, appointmentData) {
  const cookies = await context.cookies();
  const cookieString = cookies.map((c) => `${c.name}=${c.value}`).join('; ');

  // Ajustar conforme a API real
  const response = await fetch(`${API_URL}/consultas`, {
    method: 'POST',
    headers: {
      Cookie: cookieString,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(appointmentData),
  });

  if (!response.ok) {
    throw new Error(`Falha ao criar agendamento: ${response.status}`);
  }

  return response.json();
}
