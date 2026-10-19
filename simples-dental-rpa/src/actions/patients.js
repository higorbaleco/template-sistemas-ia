/**
 * Ações para gerenciar pacientes no Simples Dental
 */

const API_URL = 'https://api.simplesdental.com';

/**
 * Lista pacientes com busca e paginação
 * @param {object} context - Playwright context com cookies de autenticação
 * @param {string} query - Busca opcional por nome (ex: 'João')
 * @param {number} pageNumber - Número da página (padrão 1)
 * @param {number} pageSize - Itens por página (padrão 20)
 * @returns {Promise<object>} Lista de pacientes
 */
export async function listPatients(context, query = null, pageNumber = 1, pageSize = 20) {
  const cookies = await context.cookies();
  const cookieString = cookies.map((c) => `${c.name}=${c.value}`).join('; ');

  const url = new URL(`${API_URL}/pacientesresumidos`);
  url.searchParams.append('pageSize', pageSize);
  url.searchParams.append('pageNumber', pageNumber);
  url.searchParams.append('orderBy', 'nome');
  url.searchParams.append('direction', 'asc');

  if (query) {
    url.searchParams.append('q', query);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Cookie: cookieString,
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    },
  });

  if (!response.ok) {
    throw new Error(`Falha ao listar pacientes: ${response.status}`);
  }

  return response.json();
}

/**
 * Obtém dados completos de um paciente específico
 * @param {object} context - Playwright context com cookies
 * @param {number} patientId - ID do paciente
 * @returns {Promise<object>} Dados do paciente com plano, perfil, etc
 */
export async function getPatient(context, patientId) {
  const cookies = await context.cookies();
  const cookieString = cookies.map((c) => `${c.name}=${c.value}`).join('; ');

  const url = new URL(`${API_URL}/pacientes/${patientId}`);
  url.searchParams.append('includes', 'plano,perfil,codigoApp,origem,analiseCredito,indicacaoPaciente');

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Cookie: cookieString,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Falha ao obter paciente ${patientId}: ${response.status}`);
  }

  return response.json();
}

/**
 * Obtém histórico de consultas de um paciente
 * @param {object} context - Playwright context com cookies
 * @param {number} patientId - ID do paciente
 * @param {number} pageNumber - Página (padrão 1)
 * @param {number} pageSize - Itens por página (padrão 5)
 * @returns {Promise<object>} Histórico de consultas
 */
export async function getPatientAppointments(context, patientId, pageNumber = 1, pageSize = 5) {
  const cookies = await context.cookies();
  const cookieString = cookies.map((c) => `${c.name}=${c.value}`).join('; ');

  const url = new URL(`${API_URL}/pacientes/${patientId}/consultas`);
  url.searchParams.append('pageNumber', pageNumber);
  url.searchParams.append('pageSize', pageSize);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Cookie: cookieString,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Falha ao obter consultas do paciente: ${response.status}`);
  }

  return response.json();
}

/**
 * Obtém evolução clínica de um paciente
 * @param {object} context - Playwright context com cookies
 * @param {number} patientId - ID do paciente
 * @param {number} pageNumber - Página (padrão 1)
 * @param {number} pageSize - Itens por página (padrão 8)
 * @returns {Promise<object>} Histórico de evoluções
 */
export async function getPatientEvolutions(context, patientId, pageNumber = 1, pageSize = 8) {
  const cookies = await context.cookies();
  const cookieString = cookies.map((c) => `${c.name}=${c.value}`).join('; ');

  const url = new URL(`${API_URL}/pacientes/${patientId}/evolucoes`);
  url.searchParams.append('pageSize', pageSize);
  url.searchParams.append('pageNumber', pageNumber);
  url.searchParams.append('verHtml', 'true');

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Cookie: cookieString,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Falha ao obter evoluções: ${response.status}`);
  }

  return response.json();
}

/**
 * Obtém última evolução clínica
 * @param {object} context - Playwright context com cookies
 * @param {number} patientId - ID do paciente
 * @returns {Promise<object>} Última evolução
 */
export async function getPatientLastEvolution(context, patientId) {
  const cookies = await context.cookies();
  const cookieString = cookies.map((c) => `${c.name}=${c.value}`).join('; ');

  const response = await fetch(`${API_URL}/pacientes/${patientId}/evolucoes/ultima`, {
    method: 'GET',
    headers: {
      Cookie: cookieString,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Falha ao obter última evolução: ${response.status}`);
  }

  return response.json();
}

/**
 * Obtém tratamentos de um paciente
 * @param {object} context - Playwright context com cookies
 * @param {number} patientId - ID do paciente
 * @param {number} pageNumber - Página (padrão 1)
 * @param {number} pageSize - Itens por página (padrão 20)
 * @param {boolean} onlyActive - Apenas tratamentos não finalizados (padrão true)
 * @returns {Promise<object>} Tratamentos
 */
export async function getPatientTreatments(context, patientId, pageNumber = 1, pageSize = 20, onlyActive = true) {
  const cookies = await context.cookies();
  const cookieString = cookies.map((c) => `${c.name}=${c.value}`).join('; ');

  const url = new URL(`${API_URL}/pacientes/${patientId}/tratamentos`);
  const fields = [
    'audCriadoData', 'ordem', 'dataAgrupar', 'faces', 'finalizado', 'id', 'nomeDente',
    'valor', 'quantidadePlacas', 'numeroAtualPlaca', 'tempoEstimadoDiasPlaca',
    'statusTratamentoAlinhadores', 'consultasTratamentos(tratamento(id),consulta(id))',
    'procedimento(nome,plano(nome,pagoPeloConvenio),aceitaHarmonizacao,tuss,tipo)',
    'codigoRepeticao', 'tratamentoRepeticao(id,vencimento,finalizado,recebimento(valor),tratamento(numeroDaRepeticao))',
    'numeroDaRepeticao', 'numeroDeRepeticoes', 'profissional(nome)', 'regiaoHof', 'uiml',
    'tratamentosCronogramas(dataInicio)',
  ];
  url.searchParams.append('fields', fields.join(','));
  if (onlyActive) {
    url.searchParams.append('filters', 'finalizado:eq:false');
  }
  url.searchParams.append('pageNumber', pageNumber);
  url.searchParams.append('pageSize', pageSize);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Cookie: cookieString,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Falha ao obter tratamentos: ${response.status}`);
  }

  return response.json();
}

/**
 * Obtém odontograma (mapa dental) de um paciente
 * @param {object} context - Playwright context com cookies
 * @param {number} patientId - ID do paciente
 * @returns {Promise<object>} Dados do odontograma
 */
export async function getPatientOdontogram(context, patientId) {
  const cookies = await context.cookies();
  const cookieString = cookies.map((c) => `${c.name}=${c.value}`).join('; ');

  const response = await fetch(`${API_URL}/pacientes/${patientId}/tratamentos/odontograma`, {
    method: 'GET',
    headers: {
      Cookie: cookieString,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Falha ao obter odontograma: ${response.status}`);
  }

  return response.json();
}

/**
 * Obtém orçamentos de um paciente
 * @param {object} context - Playwright context com cookies
 * @param {number} patientId - ID do paciente
 * @param {number} pageNumber - Página (padrão 1)
 * @param {number} pageSize - Itens por página (padrão 30)
 * @returns {Promise<object>} Orçamentos
 */
export async function getPatientBudgets(context, patientId, pageNumber = 1, pageSize = 30) {
  const cookies = await context.cookies();
  const cookieString = cookies.map((c) => `${c.name}=${c.value}`).join('; ');

  const url = new URL(`${API_URL}/pacientes/${patientId}/orcamentos`);
  url.searchParams.append('pageNumber', pageNumber);
  url.searchParams.append('pageSize', pageSize);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Cookie: cookieString,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Falha ao obter orçamentos: ${response.status}`);
  }

  return response.json();
}

/**
 * Obtém recebimentos/pagamentos de um paciente
 * @param {object} context - Playwright context com cookies
 * @param {number} patientId - ID do paciente
 * @param {number} pageNumber - Página (padrão 1)
 * @param {number} pageSize - Itens por página (padrão 30)
 * @param {boolean} includePayments - Incluir recebimentos pagos (padrão true)
 * @returns {Promise<object>} Recebimentos/pagamentos
 */
export async function getPatientPayments(context, patientId, pageNumber = 1, pageSize = 30, includePayments = true) {
  const cookies = await context.cookies();
  const cookieString = cookies.map((c) => `${c.name}=${c.value}`).join('; ');

  const url = new URL(`${API_URL}/pacientes/${patientId}/recebimentos`);
  url.searchParams.append('considerarRecebimentosPagos', includePayments ? 'true' : 'false');
  url.searchParams.append('orderBy', 'dataVencimento');
  url.searchParams.append('direction', 'asc');
  url.searchParams.append('pageNumber', pageNumber);
  url.searchParams.append('pageSize', pageSize);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Cookie: cookieString,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Falha ao obter pagamentos: ${response.status}`);
  }

  return response.json();
}

/**
 * Obtém alertas de retorno para um paciente
 * @param {object} context - Playwright context com cookies
 * @param {number} patientId - ID do paciente
 * @returns {Promise<object>} Dados de alerta
 */
export async function getPatientAlert(context, patientId) {
  const cookies = await context.cookies();
  const cookieString = cookies.map((c) => `${c.name}=${c.value}`).join('; ');

  const response = await fetch(`${API_URL}/pacientes/${patientId}/alerta`, {
    method: 'GET',
    headers: {
      Cookie: cookieString,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Falha ao obter alerta: ${response.status}`);
  }

  return response.json();
}
