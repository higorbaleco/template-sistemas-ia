/**
 * Google Apps Script para Catálogo WhatsApp + Google Sheets
 * Cole este código em Extensões > Apps Script dentro da planilha.
 */

const CONFIG = {
  SPREADSHEET_ID: '', // Opcional. Se o script estiver dentro da planilha, pode deixar vazio.
  PRODUCTS_SHEET: 'Produtos',
  ORDERS_SHEET: 'Pedidos',
  ORDER_ITEMS_SHEET: 'ItensPedido',
  MAX_TEXT_LENGTH: 500,
  MAX_ITEMS_PER_ORDER: 100,
};

const ORDER_HEADERS = [
  'pedido_id',
  'data_criacao',
  'cliente_id',
  'cliente_nome',
  'telefone',
  'tipo_atendimento',
  'status',
  'subtotal',
  'taxa_entrega',
  'desconto',
  'total',
  'observacoes',
  'cep',
  'rua',
  'numero',
  'complemento',
  'bairro',
  'cidade',
  'referencia',
  'chave_idempotencia',
];

const ORDER_ITEM_HEADERS = [
  'item_id',
  'pedido_id',
  'produto_id',
  'nome_produto',
  'quantidade',
  'preco_unitario',
  'subtotal',
  'observacoes',
  'status',
  'setor_producao',
];

function doGet(e) {
  const action = String(e && e.parameter && e.parameter.action || '').toLowerCase();

  if (action === 'produtos') {
    return jsonResponse({ ok: true, produtos: getProducts() });
  }

  return jsonResponse({
    ok: true,
    message: 'API do catálogo ativa. Use ?action=produtos para listar produtos.',
  });
}

function doPost(e) {
  const action = String(e && e.parameter && e.parameter.action || '').toLowerCase();

  if (action === 'pedido') {
    const payload = parseRequestBody(e);
    const saved = saveOrder(payload);
    return jsonResponse({ ok: true, pedido_id: saved.pedido_id, pedido: saved, duplicated: Boolean(saved.duplicated) });
  }

  return jsonResponse({ ok: false, error: 'Ação inválida.' });
}

function getSpreadsheet() {
  if (CONFIG.SPREADSHEET_ID) {
    return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getProducts(includeInactive) {
  const sheet = getSpreadsheet().getSheetByName(CONFIG.PRODUCTS_SHEET);
  if (!sheet) throw new Error(`Aba ${CONFIG.PRODUCTS_SHEET} não encontrada.`);

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = values[0].map(normalizeHeader);
  const rows = values.slice(1);

  return rows
    .filter((row) => row.some((cell) => cell !== ''))
    .map((row) => {
      const item = {};
      headers.forEach((header, index) => {
        item[header] = row[index];
      });
      return {
        id: String(item.id || ''),
        nome: String(item.nome || ''),
        descricao: String(item.descricao || ''),
        categoria: String(item.categoria || ''),
        preco: parseMoney(item.preco || item.preço || 0),
        imagem: String(item.imagem || ''),
        ativo: toBoolean(item.ativo),
      };
    })
    .filter((item) => includeInactive ? true : item.ativo);
}

function saveOrder(payload) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const ordersSheet = getOrCreateSheet(CONFIG.ORDERS_SHEET, ORDER_HEADERS);
    const itemsSheet = getOrCreateSheet(CONFIG.ORDER_ITEMS_SHEET, ORDER_ITEM_HEADERS);
    const productsById = getProducts(true).reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {});

    const normalized = normalizeOrderInput(payload, productsById);
    const existing = findOrderByIdempotencyKey(ordersSheet, itemsSheet, normalized.chave_idempotencia);
    if (existing) {
      return {
        ...existing,
        duplicated: true,
      };
    }

    ordersSheet.appendRow([
      normalized.pedido_id,
      normalized.data_criacao,
      normalized.cliente_id,
      normalized.cliente_nome,
      normalized.telefone,
      normalized.tipo_atendimento,
      normalized.status,
      normalized.subtotal,
      normalized.taxa_entrega,
      normalized.desconto,
      normalized.total,
      normalized.observacoes,
      normalized.endereco.cep,
      normalized.endereco.rua,
      normalized.endereco.numero,
      normalized.endereco.complemento,
      normalized.endereco.bairro,
      normalized.endereco.cidade,
      normalized.endereco.referencia,
      normalized.chave_idempotencia,
    ]);

    if (normalized.itens.length) {
      const itemRows = normalized.itens.map((item) => ([
        item.item_id,
        normalized.pedido_id,
        item.produto_id,
        item.nome_produto,
        item.quantidade,
        item.preco_unitario,
        item.subtotal,
        item.observacoes,
        item.status,
        item.setor_producao,
      ]));
      itemsSheet.getRange(itemsSheet.getLastRow() + 1, 1, itemRows.length, ORDER_ITEM_HEADERS.length).setValues(itemRows);
    }

    return normalized;
  } finally {
    lock.releaseLock();
  }
}

function normalizeOrderInput(payload, productsById) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const chaveIdempotencia = sanitizeText(source.chave_idempotencia || source.idempotency_key || '', 120);
  if (!chaveIdempotencia) {
    throw new Error('chave_idempotencia é obrigatória.');
  }

  const clienteNome = sanitizeText(source.cliente_nome || source.cliente || '', 120);
  const telefone = sanitizeText(source.telefone || '', 30);
  const tipoAtendimento = sanitizeText(source.tipo_atendimento || source.tipo_entrega || 'Retirada', 30);
  const observacoes = sanitizeText(source.observacoes || '', CONFIG.MAX_TEXT_LENGTH);
  const taxaEntrega = parseMoney(source.taxa_entrega || 0);
  const desconto = parseMoney(source.desconto || 0);
  const endereco = normalizeAddress(source.endereco || {});
  const rawItems = normalizeIncomingItems(source.itens || source.items || []);

  if (!clienteNome) throw new Error('cliente_nome é obrigatório.');
  if (!telefone) throw new Error('telefone é obrigatório.');
  if (!['Retirada', 'Entrega'].includes(tipoAtendimento)) {
    throw new Error('tipo_atendimento inválido.');
  }
  if (!rawItems.length) throw new Error('Nenhum item enviado.');
  if (rawItems.length > CONFIG.MAX_ITEMS_PER_ORDER) throw new Error('Pedido com muitos itens.');

  const pedidoId = sanitizeText(source.pedido_id || generatePedidoId(), 120);
  const dataCriacao = sanitizeText(source.data_criacao || formatDateTime(new Date()), 40);
  const clienteId = sanitizeText(source.cliente_id || buildClienteId(telefone, clienteNome), 120);

  let subtotal = 0;
  const items = rawItems.map((item, index) => {
    const product = productsById[item.produto_id];
    if (!product) {
      throw new Error(`Produto não encontrado: ${item.produto_id}`);
    }
    if (!product.ativo) {
      throw new Error(`Produto indisponível: ${product.nome}`);
    }

    const quantidade = item.quantidade;
    const precoUnitario = parseMoney(product.preco);
    const itemSubtotal = roundMoney(precoUnitario * quantidade);
    subtotal = roundMoney(subtotal + itemSubtotal);

    return {
      item_id: generateItemId(index),
      produto_id: sanitizeText(product.id, 80),
      nome_produto: sanitizeText(product.nome, 200),
      quantidade,
      preco_unitario: precoUnitario,
      subtotal: itemSubtotal,
      observacoes: sanitizeText(item.observacoes || '', CONFIG.MAX_TEXT_LENGTH),
      status: 'Novo',
      setor_producao: '',
    };
  });

  const total = roundMoney(subtotal + taxaEntrega - desconto);
  if (total < 0) {
    throw new Error('Total inválido.');
  }

  return {
    pedido_id: pedidoId,
    data_criacao: dataCriacao,
    cliente_id: clienteId,
    cliente_nome: clienteNome,
    telefone,
    tipo_atendimento: tipoAtendimento,
    status: 'Novo',
    subtotal,
    taxa_entrega: taxaEntrega,
    desconto,
    total,
    observacoes,
    endereco,
    chave_idempotencia: chaveIdempotencia,
    itens: items,
    endereco_texto: formatAddress(endereco),
  };
}

function normalizeIncomingItems(items) {
  if (!Array.isArray(items)) return [];

  const merged = {};
  items.forEach((item) => {
    const produtoId = sanitizeText(item && (item.produto_id || item.id || item.product_id) || '', 80);
    const quantidade = normalizeQuantity(item && item.quantidade);
    if (!produtoId) {
      throw new Error('Item sem produto_id.');
    }
    if (quantidade <= 0) {
      throw new Error(`Quantidade inválida para o produto ${produtoId}.`);
    }
    merged[produtoId] = (merged[produtoId] || 0) + quantidade;
  });

  return Object.keys(merged).map((produtoId) => ({
    produto_id: produtoId,
    quantidade: merged[produtoId],
  }));
}

function normalizeQuantity(value) {
  const quantity = Number(value);
  return Number.isInteger(quantity) && quantity > 0 ? quantity : 0;
}

function normalizeAddress(address) {
  const source = address && typeof address === 'object' ? address : {};
  return {
    cep: sanitizeText(source.cep || '', 20),
    rua: sanitizeText(source.rua || '', 120),
    numero: sanitizeText(source.numero || '', 20),
    complemento: sanitizeText(source.complemento || '', 80),
    bairro: sanitizeText(source.bairro || '', 80),
    cidade: sanitizeText(source.cidade || '', 80),
    referencia: sanitizeText(source.referencia || '', 120),
  };
}

function findOrderByIdempotencyKey(ordersSheet, itemsSheet, key) {
  if (!key) return null;
  const values = ordersSheet.getDataRange().getValues();
  if (values.length < 2) return null;

  const headers = values[0].map(normalizeHeader);
  const keyIndex = headers.indexOf('chave_idempotencia');
  if (keyIndex === -1) return null;

  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    const row = values[rowIndex];
    if (String(row[keyIndex] || '') !== key) continue;
    const order = rowToOrder(values[0], row);
    return {
      ...order,
      itens: getItemsForOrder(itemsSheet, order.pedido_id),
    };
  }

  return null;
}

function getItemsForOrder(sheet, pedidoId) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = values[0].map(normalizeHeader);
  const orderIdIndex = headers.indexOf('pedido_id');
  if (orderIdIndex === -1) return [];

  return values.slice(1)
    .filter((row) => String(row[orderIdIndex] || '') === String(pedidoId || ''))
    .map((row) => {
      const get = (name) => {
        const index = headers.indexOf(name);
        return index >= 0 ? row[index] : '';
      };

      return {
        item_id: String(get('item_id') || ''),
        pedido_id: String(get('pedido_id') || ''),
        produto_id: String(get('produto_id') || ''),
        nome_produto: String(get('nome_produto') || ''),
        quantidade: Number(get('quantidade') || 0),
        preco_unitario: parseMoney(get('preco_unitario') || 0),
        subtotal: parseMoney(get('subtotal') || 0),
        observacoes: String(get('observacoes') || ''),
        status: String(get('status') || ''),
        setor_producao: String(get('setor_producao') || ''),
      };
    });
}

function rowToOrder(headerRow, row) {
  const headers = headerRow.map(normalizeHeader);
  const get = (name) => {
    const index = headers.indexOf(name);
    return index >= 0 ? row[index] : '';
  };

  return {
    pedido_id: String(get('pedido_id') || ''),
    data_criacao: String(get('data_criacao') || ''),
    cliente_id: String(get('cliente_id') || ''),
    cliente_nome: String(get('cliente_nome') || ''),
    telefone: String(get('telefone') || ''),
    tipo_atendimento: String(get('tipo_atendimento') || ''),
    status: String(get('status') || ''),
    subtotal: parseMoney(get('subtotal') || 0),
    taxa_entrega: parseMoney(get('taxa_entrega') || 0),
    desconto: parseMoney(get('desconto') || 0),
    total: parseMoney(get('total') || 0),
    observacoes: String(get('observacoes') || ''),
    endereco: {
      cep: String(get('cep') || ''),
      rua: String(get('rua') || ''),
      numero: String(get('numero') || ''),
      complemento: String(get('complemento') || ''),
      bairro: String(get('bairro') || ''),
      cidade: String(get('cidade') || ''),
      referencia: String(get('referencia') || ''),
    },
    chave_idempotencia: String(get('chave_idempotencia') || ''),
    endereco_texto: formatAddress({
      cep: String(get('cep') || ''),
      rua: String(get('rua') || ''),
      numero: String(get('numero') || ''),
      complemento: String(get('complemento') || ''),
      bairro: String(get('bairro') || ''),
      cidade: String(get('cidade') || ''),
      referencia: String(get('referencia') || ''),
    }),
  };
}

function getOrCreateSheet(name, headers) {
  const spreadsheet = getSpreadsheet();
  let sheet = spreadsheet.getSheetByName(name);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
  }

  ensureHeaders(sheet, headers);
  return sheet;
}

function ensureHeaders(sheet, headers) {
  const lastRow = sheet.getLastRow();
  const current = lastRow ? sheet.getRange(1, 1, 1, Math.max(headers.length, sheet.getLastColumn())).getValues()[0] : [];
  const currentNormalized = current.slice(0, headers.length).map(normalizeHeader);
  const expectedNormalized = headers.map(normalizeHeader);
  const needsUpdate = expectedNormalized.some((header, index) => currentNormalized[index] !== header);

  if (lastRow === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    return;
  }

  if (needsUpdate) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
}

function parseRequestBody(e) {
  if (!e || !e.postData || !e.postData.contents) return {};

  try {
    return JSON.parse(e.postData.contents);
  } catch (error) {
    const params = e.parameter || {};
    if (params.payload) {
      return JSON.parse(params.payload);
    }
    throw error;
  }
}

function normalizeHeader(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_');
}

function sanitizeText(value, maxLength) {
  const text = String(value == null ? '' : value).trim().slice(0, maxLength || CONFIG.MAX_TEXT_LENGTH);
  if (!text) return '';
  if (/^[=+\-@]/.test(text)) {
    return `'${text}`;
  }
  return text;
}

function parseMoney(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return roundMoney(value);
  }

  const raw = String(value == null ? '' : value).trim();
  if (!raw) return 0;

  let clean = raw
    .replace(/R\$/gi, '')
    .replace(/\s+/g, '')
    .replace(/[^\d,.-]/g, '');

  const hasComma = clean.includes(',');
  const hasDot = clean.includes('.');

  if (hasComma && hasDot) {
    const lastComma = clean.lastIndexOf(',');
    const lastDot = clean.lastIndexOf('.');
    if (lastComma > lastDot) {
      clean = clean.replace(/\./g, '').replace(',', '.');
    } else {
      clean = clean.replace(/,/g, '');
    }
  } else if (hasComma) {
    clean = clean.replace(/\./g, '').replace(',', '.');
  } else {
    clean = clean.replace(/,/g, '');
  }

  const parsed = Number(clean);
  return Number.isFinite(parsed) ? roundMoney(parsed) : 0;
}

function roundMoney(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function toBoolean(value) {
  if (typeof value === 'boolean') return value;
  const clean = normalizeHeader(value);
  return ['true', 'sim', 'ativo', '1', 'yes'].includes(clean);
}

function buildClienteId(telefone, nome) {
  const digits = String(telefone || '').replace(/\D/g, '');
  if (digits) return `CLI-${digits}`;
  const fallback = String(nome || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `CLI-${fallback || Date.now().toString(36)}`;
}

function generatePedidoId() {
  return `PED-${Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMddHHmmss')}-${Utilities.getUuid().slice(0, 8).toUpperCase()}`;
}

function generateItemId(seed) {
  return `ITM-${Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'HHmmss')}-${String(seed || 0).padStart(2, '0')}-${Utilities.getUuid().slice(0, 6).toUpperCase()}`;
}

function formatDateTime(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
}

function formatAddress(address) {
  const parts = [];
  const firstLine = [address.rua, address.numero, address.complemento].filter(Boolean).join(', ');
  const secondLine = [address.bairro, address.cidade, address.cep].filter(Boolean).join(' - ');
  if (firstLine) parts.push(firstLine);
  if (secondLine) parts.push(secondLine);
  if (address.referencia) parts.push(`Ref.: ${address.referencia}`);
  return parts.join(' | ');
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
