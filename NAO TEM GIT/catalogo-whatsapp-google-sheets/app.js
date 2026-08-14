/*
  Catálogo com WhatsApp + Google Sheets
  Arquivo: app.js
  Ajuste apenas o bloco CONFIG abaixo.
*/

const CONFIG = {
  ENVIRONMENT: 'development',
  STORE_ID: 'default-store',
  UNIT_ID: 'main',
  STORE_NAME: 'Minha Loja',
  STORE_SUBTITLE: 'Catálogo digital com pedido direto pelo WhatsApp',
  WHATSAPP_NUMBER: '5544999999999',
  APPS_SCRIPT_URL: 'COLE_AQUI_A_URL_DO_APPS_SCRIPT',
  CURRENCY: 'BRL',
  LOCALE: 'pt-BR',
  ONBOARD_STORAGE_KEY: 'catalogo_whatsapp_onboard_v1',
  FALLBACK_IMAGE: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=900&auto=format&fit=crop',
  ENABLE_DEMO_PRODUCTS: true,
};

const state = {
  products: [],
  filteredProducts: [],
  cart: loadCart(),
  selectedCategory: 'Todos',
  searchTerm: '',
  loading: true,
  error: '',
  cartOpen: false,
  checkoutOpen: false,
  orderLoading: false,
  toast: '',
  orderSuccess: null,
};

const demoProducts = [
  {
    id: '1',
    nome: 'X-Burger Artesanal',
    descricao: 'Pão brioche, burger bovino, queijo, alface, tomate e molho da casa.',
    categoria: 'Lanches',
    preco: 24.9,
    imagem: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=900&auto=format&fit=crop',
    ativo: true,
  },
  {
    id: '2',
    nome: 'Batata Frita Grande',
    descricao: 'Batata crocante com sal especial. Serve até duas pessoas.',
    categoria: 'Porções',
    preco: 19.9,
    imagem: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=900&auto=format&fit=crop',
    ativo: true,
  },
  {
    id: '3',
    nome: 'Refrigerante Lata',
    descricao: 'Lata 350ml gelada.',
    categoria: 'Bebidas',
    preco: 6.5,
    imagem: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=900&auto=format&fit=crop',
    ativo: true,
  },
  {
    id: '4',
    nome: 'Brownie da Casa',
    descricao: 'Brownie macio com cobertura de chocolate.',
    categoria: 'Sobremesas',
    preco: 14.9,
    imagem: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=900&auto=format&fit=crop',
    ativo: true,
  },
];

const $app = document.querySelector('#app');

function money(value) {
  const number = Number(value || 0);
  return new Intl.NumberFormat(CONFIG.LOCALE, {
    style: 'currency',
    currency: CONFIG.CURRENCY,
  }).format(number);
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function parsePrice(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;

  const raw = String(value ?? '').trim();
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
  return Number.isFinite(parsed) ? parsed : 0;
}

function isActive(value) {
  if (typeof value === 'boolean') return value;
  const clean = normalizeText(value);
  return ['true', 'sim', 'ativo', '1', 'yes'].includes(clean);
}

function cartStorageKey() {
  return `catalogo_cart:${CONFIG.STORE_ID}:${CONFIG.UNIT_ID}`;
}

function onboardStorageKey() {
  return `catalogo_onboard:${CONFIG.STORE_ID}:${CONFIG.UNIT_ID}`;
}

function isConfigured() {
  return Boolean(CONFIG.APPS_SCRIPT_URL && !CONFIG.APPS_SCRIPT_URL.includes('COLE_AQUI'));
}

function canUseDemoProducts() {
  return CONFIG.ENVIRONMENT !== 'production' && CONFIG.ENABLE_DEMO_PRODUCTS;
}

function sanitizeProduct(product, index) {
  return {
    id: String(product.id || product.ID || index + 1),
    nome: String(product.nome || product.Nome || 'Produto sem nome'),
    descricao: String(product.descricao || product.descrição || product.Descricao || product.Descrição || ''),
    categoria: String(product.categoria || product.Categoria || 'Outros'),
    preco: parsePrice(product.preco || product.preço || product.Preco || product.Preço),
    imagem: String(product.imagem || product.Imagem || CONFIG.FALLBACK_IMAGE),
    ativo: isActive(product.ativo ?? product.Ativo ?? true),
  };
}

function cartItems() {
  return Object.values(state.cart);
}

function cartCount() {
  return cartItems().reduce((sum, item) => sum + item.quantidade, 0);
}

function cartTotal() {
  return cartItems().reduce((sum, item) => sum + item.preco * item.quantidade, 0);
}

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(cartStorageKey()) || '{}');
  } catch (_) {
    return {};
  }
}

function saveCart() {
  localStorage.setItem(cartStorageKey(), JSON.stringify(state.cart));
}

function toast(message) {
  state.toast = message;
  render();
  window.clearTimeout(window.__toastTimer);
  window.__toastTimer = window.setTimeout(() => {
    state.toast = '';
    render();
  }, 2200);
}

async function fetchProducts() {
  state.loading = true;
  state.error = '';
  render();

  try {
    if (!isConfigured()) {
      throw new Error('API não configurada');
    }

    const response = await fetch(`${CONFIG.APPS_SCRIPT_URL}?action=produtos`, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('servidor indisponível');
    }

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      throw new Error('Resposta inválida do servidor.');
    }
    const products = Array.isArray(data) ? data : data.produtos || [];
    state.products = products.map(sanitizeProduct).filter((product) => product.ativo);

    if (!state.products.length) {
      if (canUseDemoProducts()) {
        state.products = demoProducts;
        state.error = 'Cardápio vazio na planilha. Exibindo produtos de demonstração para desenvolvimento.';
      } else {
        state.error = 'Não foi possível carregar o cardápio. Tente novamente em alguns instantes.';
      }
    }
  } catch (error) {
    console.warn(error);

    if (!isConfigured()) {
      state.error = canUseDemoProducts()
        ? 'API não configurada. Exibindo produtos de demonstração para desenvolvimento.'
        : 'API não configurada. Defina a URL do Apps Script em CONFIG.APPS_SCRIPT_URL.';
      state.products = canUseDemoProducts() ? demoProducts : [];
    } else {
      state.error = error && error.message === 'Failed to fetch'
        ? 'Falha de conexão ao carregar o cardápio. Verifique sua internet e tente novamente.'
        : error && error.message === 'Resposta inválida do servidor.'
          ? 'Resposta inválida ao carregar o cardápio.'
          : 'Não foi possível carregar o cardápio. Tente novamente em alguns instantes.';
      state.products = canUseDemoProducts() ? demoProducts : [];
    }

    if (!state.products.length && !canUseDemoProducts()) {
      state.error = 'Não foi possível carregar o cardápio. Tente novamente em alguns instantes.';
    }
  } finally {
    state.loading = false;
    applyFilters();
    render();
    maybeStartOnboarding();
  }
}

function categories() {
  const list = state.products.map((product) => product.categoria).filter(Boolean);
  return ['Todos', ...Array.from(new Set(list))];
}

function applyFilters() {
  const search = normalizeText(state.searchTerm);
  state.filteredProducts = state.products.filter((product) => {
    const matchesCategory = state.selectedCategory === 'Todos' || product.categoria === state.selectedCategory;
    const matchesSearch = !search || normalizeText(`${product.nome} ${product.descricao} ${product.categoria}`).includes(search);
    return matchesCategory && matchesSearch;
  });
}

function refreshCatalogView({ refreshCategories = false } = {}) {
  applyFilters();

  const gridHost = document.querySelector('[data-product-grid-host]');
  if (gridHost) {
    gridHost.innerHTML = productGridMarkup();
  }

  if (refreshCategories) {
    const categoryHost = document.querySelector('[data-category-filter]');
    if (categoryHost) {
      categoryHost.innerHTML = categoryButtonsMarkup();
    }
  }
}

function setSearch(value) {
  state.searchTerm = value;
  refreshCatalogView();
}

function setCategory(category) {
  state.selectedCategory = category;
  refreshCatalogView({ refreshCategories: true });
}

function addToCart(productId) {
  const product = state.products.find((item) => item.id === String(productId));
  if (!product) return;

  const current = state.cart[product.id];
  state.cart[product.id] = {
    id: product.id,
    nome: product.nome,
    preco: product.preco,
    imagem: product.imagem,
    quantidade: current ? current.quantidade + 1 : 1,
  };
  saveCart();
  toast('Produto adicionado ao carrinho.');
}

function incrementItem(productId) {
  const item = state.cart[productId];
  if (!item) return;
  item.quantidade += 1;
  saveCart();
  render();
}

function decrementItem(productId) {
  const item = state.cart[productId];
  if (!item) return;
  item.quantidade -= 1;
  if (item.quantidade <= 0) delete state.cart[productId];
  saveCart();
  render();
}

function removeItem(productId) {
  delete state.cart[productId];
  saveCart();
  render();
}

function clearCart() {
  state.cart = {};
  saveCart();
  render();
}

function clearCartSilently() {
  state.cart = {};
  saveCart();
}

function openCart() {
  state.cartOpen = true;
  state.checkoutOpen = false;
  render();
}

function closeCart() {
  state.cartOpen = false;
  state.checkoutOpen = false;
  render();
}

function openCheckout() {
  if (!cartCount()) {
    toast('Adicione pelo menos um produto ao carrinho.');
    return;
  }
  state.checkoutOpen = true;
  render();
  window.requestAnimationFrame(renderAddressField);
}

function closeCheckout() {
  state.checkoutOpen = false;
  render();
}

function maskPhone(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function onlyDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

function generateIdempotencyKey() {
  const random = window.crypto && typeof window.crypto.randomUUID === 'function'
    ? window.crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `ORDREQ-${random}`;
}

function generateClientId(phoneDigits, clientName) {
  if (phoneDigits) return `CLI-${phoneDigits}`;
  const cleanName = normalizeText(clientName).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `CLI-${cleanName || Date.now().toString(36)}`;
}

function buildAddressPayload(form) {
  return {
    cep: String(form.get('cep') || '').trim(),
    rua: String(form.get('rua') || '').trim(),
    numero: String(form.get('numero') || '').trim(),
    complemento: String(form.get('complemento') || '').trim(),
    bairro: String(form.get('bairro') || '').trim(),
    cidade: String(form.get('cidade') || '').trim(),
    referencia: String(form.get('referencia') || '').trim(),
  };
}

function formatAddress(address) {
  if (!address || Object.values(address).every((value) => !String(value || '').trim())) {
    return '';
  }

  const firstLine = [address.rua, address.numero, address.complemento].filter(Boolean).join(', ');
  const secondLine = [address.bairro, address.cidade, address.cep].filter(Boolean).join(' - ');
  const parts = [firstLine, secondLine, address.referencia].filter(Boolean);
  return parts.join('\n');
}

function buildWhatsAppMessage(order) {
  const items = order.itens
    .map((item) => `• ${item.quantidade}x ${item.nome_produto} | ${money(item.subtotal)}`)
    .join('\n');

  return `*Novo Pedido*\n\n` +
    `*Pedido:* ${order.pedido_id}\n` +
    `*Cliente:* ${order.cliente_nome}\n` +
    `*Telefone:* ${order.telefone}\n` +
    `*Entrega:* ${order.tipo_atendimento}\n` +
    `${order.tipo_atendimento === 'Entrega' && order.endereco_texto ? `*Endereço:*\n${order.endereco_texto}\n` : ''}` +
    `${order.observacoes ? `*Observações:* ${order.observacoes}\n` : ''}` +
    `\n*Itens:*\n${items}\n\n` +
    `*Subtotal:* ${money(order.subtotal)}\n` +
    `${Number(order.taxa_entrega || 0) ? `*Taxa de entrega:* ${money(order.taxa_entrega)}\n` : ''}` +
    `${Number(order.desconto || 0) ? `*Desconto:* ${money(order.desconto)}\n` : ''}` +
    `*Total:* ${money(order.total)}\n\n` +
    `Pedido gerado pelo catálogo digital.`;
}

async function submitOrder(event) {
  event.preventDefault();

  if (!cartCount()) {
    toast('Carrinho vazio.');
    return;
  }

  const form = new FormData(event.currentTarget);
  const clienteNome = String(form.get('cliente_nome') || '').trim();
  const telefone = String(form.get('telefone') || '').trim();
  const tipoAtendimento = String(form.get('tipo_atendimento') || 'Retirada');
  const endereco = buildAddressPayload(form);
  const observacoes = String(form.get('observacoes') || '').trim();
  const phoneDigits = onlyDigits(telefone);

  if (!clienteNome) return toast('Informe o nome do cliente.');
  if (phoneDigits.length < 10) return toast('Informe um telefone válido.');
  if (tipoAtendimento === 'Entrega' && (!endereco.rua || !endereco.numero || !endereco.bairro || !endereco.cidade)) {
    return toast('Preencha os dados de endereço para entrega.');
  }

  const orderDraft = {
    chave_idempotencia: generateIdempotencyKey(),
    cliente_nome: clienteNome,
    cliente_id: generateClientId(phoneDigits, clienteNome),
    telefone,
    tipo_atendimento: tipoAtendimento,
    endereco,
    observacoes,
    taxa_entrega: 0,
    desconto: 0,
    itens: cartItems().map((item) => ({
      produto_id: item.id,
      quantidade: item.quantidade,
    })),
  };

  state.orderLoading = true;
  render();

  if (!isConfigured()) {
    state.orderLoading = false;
    render();
    toast('API não configurada.');
    return;
  }

  try {
    const response = await fetch(`${CONFIG.APPS_SCRIPT_URL}?action=pedido`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(orderDraft),
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      throw new Error('Resposta inválida do servidor.');
    }

    if (!response.ok || !data || !data.ok) {
      throw new Error((data && data.error) || 'Servidor indisponível.');
    }

    const order = data.pedido || {};
    const whatsappOrder = {
      pedido_id: data.pedido_id || order.pedido_id || orderDraft.chave_idempotencia,
      cliente_nome: order.cliente_nome || clienteNome,
      telefone: order.telefone || telefone,
      tipo_atendimento: order.tipo_atendimento || tipoAtendimento,
      endereco_texto: order.endereco_texto || formatAddress(endereco),
      observacoes: order.observacoes || observacoes,
      itens: Array.isArray(order.itens) ? order.itens : [],
      subtotal: Number(order.subtotal || 0),
      taxa_entrega: Number(order.taxa_entrega || 0),
      desconto: Number(order.desconto || 0),
      total: Number(order.total || 0),
    };

    state.orderSuccess = {
      pedido_id: whatsappOrder.pedido_id,
      total: whatsappOrder.total,
      whatsappUrl: `https://wa.me/${CONFIG.WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(buildWhatsAppMessage(whatsappOrder))}`,
    };

    clearCartSilently();
    state.orderLoading = false;
    state.checkoutOpen = false;
    state.cartOpen = false;
    render();
  } catch (error) {
    console.warn(error);
    state.orderLoading = false;
    render();

    const message = String(error && error.message ? error.message : 'Não foi possível concluir o pedido.');
    if (message.includes('Resposta inválida')) {
      toast('Resposta inválida do servidor.');
    } else if (message.includes('Servidor indisponível')) {
      toast('Servidor indisponível. Tente novamente em alguns instantes.');
    } else {
      toast(message);
    }
  }
}

function openSuccessWhatsApp() {
  if (!state.orderSuccess) return;
  window.open(state.orderSuccess.whatsappUrl, '_blank', 'noopener,noreferrer');
}

function closeSuccess() {
  state.orderSuccess = null;
  render();
}

function productCard(product) {
  return `
    <article class="group overflow-hidden rounded-[28px] bg-white shadow-soft ring-1 ring-slate-200/70" data-product-card>
      <div class="relative h-40 overflow-hidden bg-slate-100">
        <img src="${escapeHtml(product.imagem || CONFIG.FALLBACK_IMAGE)}" alt="${escapeHtml(product.nome)}" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" onerror="this.src='${CONFIG.FALLBACK_IMAGE}'" />
        <span class="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 backdrop-blur">${escapeHtml(product.categoria)}</span>
      </div>
      <div class="space-y-3 p-4">
        <div>
          <h3 class="line-clamp-1 text-base font-bold text-slate-950">${escapeHtml(product.nome)}</h3>
          <p class="mt-1 line-clamp-2 min-h-[40px] text-sm leading-5 text-slate-500">${escapeHtml(product.descricao || 'Produto disponível para pedido.')}</p>
        </div>
        <div class="flex items-center justify-between gap-3">
          <strong class="text-lg font-black text-emerald-700">${money(product.preco)}</strong>
          <button onclick="addToCart('${escapeJs(product.id)}')" class="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700 active:scale-95" data-add-button>
            Adicionar
          </button>
        </div>
      </div>
    </article>
  `;
}

function categoryButtonsMarkup() {
  return categories().map((category) => `
    <button onclick="setCategory('${escapeJs(category)}')" class="shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${state.selectedCategory === category ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}">
      ${escapeHtml(category)}
    </button>
  `).join('');
}

function productGridMarkup() {
  if (state.loading) {
    return `
      <section class="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 pb-28 sm:grid-cols-2 lg:grid-cols-3">
        ${Array.from({ length: 6 }).map(() => `
          <div class="h-72 animate-pulse rounded-[28px] bg-white shadow-sm ring-1 ring-slate-200">
            <div class="h-40 rounded-t-[28px] bg-slate-200"></div>
            <div class="space-y-3 p-4"><div class="h-5 rounded bg-slate-200"></div><div class="h-4 rounded bg-slate-200"></div><div class="h-10 rounded bg-slate-200"></div></div>
          </div>
        `).join('')}
      </section>
    `;
  }

  if (!state.filteredProducts.length) {
    return `
      <section class="mx-auto max-w-6xl px-4 pb-28">
        <div class="rounded-[28px] bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <h3 class="text-lg font-black text-slate-950">Nenhum produto encontrado</h3>
          <p class="mt-1 text-sm text-slate-500">Tente buscar por outro nome ou categoria.</p>
        </div>
      </section>
    `;
  }

  return `
    <section class="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 pb-28 sm:grid-cols-2 lg:grid-cols-3" data-product-grid>
      ${state.filteredProducts.map(productCard).join('')}
    </section>
  `;
}

function cartDrawer() {
  const items = cartItems();
  if (!state.cartOpen) return '';

  return `
    <div class="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm" onclick="closeCart()"></div>
    <aside class="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[88vh] max-w-xl overflow-hidden rounded-t-[32px] bg-white shadow-2xl" data-cart-drawer>
      <div class="flex items-center justify-between border-b border-slate-100 p-5">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Carrinho</p>
          <h2 class="text-xl font-black text-slate-950">Seu pedido</h2>
        </div>
        <button onclick="closeCart()" class="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700">✕</button>
      </div>

      ${items.length ? `
        <div class="max-h-[42vh] space-y-3 overflow-y-auto p-5">
          ${items.map((item) => `
            <div class="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">
              <img src="${escapeHtml(item.imagem || CONFIG.FALLBACK_IMAGE)}" class="h-16 w-16 rounded-xl object-cover" alt="${escapeHtml(item.nome)}" onerror="this.src='${CONFIG.FALLBACK_IMAGE}'" />
              <div class="min-w-0 flex-1">
                <div class="flex justify-between gap-2">
                  <h3 class="line-clamp-1 font-bold text-slate-900">${escapeHtml(item.nome)}</h3>
                  <button onclick="removeItem('${escapeJs(item.id)}')" class="text-sm font-bold text-red-500">Remover</button>
                </div>
                <p class="mt-1 text-sm text-slate-500">${money(item.preco)} un.</p>
                <div class="mt-3 flex items-center justify-between">
                  <div class="flex items-center gap-2 rounded-full bg-white p-1 ring-1 ring-slate-200">
                    <button onclick="decrementItem('${escapeJs(item.id)}')" class="grid h-8 w-8 place-items-center rounded-full bg-slate-100 font-bold">−</button>
                    <span class="min-w-6 text-center text-sm font-black">${item.quantidade}</span>
                    <button onclick="incrementItem('${escapeJs(item.id)}')" class="grid h-8 w-8 place-items-center rounded-full bg-slate-950 font-bold text-white">+</button>
                  </div>
                  <strong class="font-black text-slate-950">${money(item.preco * item.quantidade)}</strong>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="safe-bottom border-t border-slate-100 p-5">
          <div class="mb-4 flex items-center justify-between">
            <span class="text-sm font-semibold text-slate-500">Total geral</span>
            <strong class="text-2xl font-black text-slate-950">${money(cartTotal())}</strong>
          </div>
          <div class="grid grid-cols-[1fr_1.7fr] gap-3">
            <button onclick="clearCart()" class="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700">Limpar</button>
            <button onclick="openCheckout()" class="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-600/20">Finalizar pedido</button>
          </div>
        </div>
      ` : `
        <div class="p-8 text-center">
          <div class="mx-auto grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-2xl">🛒</div>
          <h3 class="mt-4 text-lg font-black text-slate-950">Carrinho vazio</h3>
          <p class="mt-1 text-sm text-slate-500">Adicione produtos para iniciar seu pedido.</p>
        </div>
      `}

      ${checkoutForm()}
    </aside>
  `;
}

function checkoutForm() {
  if (!state.checkoutOpen) return '';

  return `
    <div class="absolute inset-0 z-10 overflow-y-auto bg-white p-5 safe-bottom">
      <div class="mb-5 flex items-center justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Checkout</p>
          <h2 class="text-xl font-black text-slate-950">Dados do pedido</h2>
        </div>
        <button onclick="closeCheckout()" class="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700">←</button>
      </div>

      <form onsubmit="submitOrder(event)" class="space-y-4">
        <label class="block">
          <span class="mb-1 block text-sm font-bold text-slate-700">Nome do cliente</span>
          <input name="cliente_nome" required placeholder="Ex.: João Silva" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
        </label>

        <label class="block">
          <span class="mb-1 block text-sm font-bold text-slate-700">Telefone</span>
          <input name="telefone" required inputmode="numeric" maxlength="15" placeholder="(44) 99999-9999" oninput="this.value = maskPhone(this.value)" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
        </label>

        <fieldset class="grid grid-cols-2 gap-3">
          <label class="cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 p-4 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50">
            <input type="radio" name="tipo_atendimento" value="Retirada" checked class="mr-2" onchange="renderAddressField()" />
            <span class="font-bold">Retirada</span>
          </label>
          <label class="cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 p-4 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50">
            <input type="radio" name="tipo_atendimento" value="Entrega" class="mr-2" onchange="renderAddressField()" />
            <span class="font-bold">Entrega</span>
          </label>
        </fieldset>

        <div id="addressField" class="hidden space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label class="block">
              <span class="mb-1 block text-sm font-bold text-slate-700">CEP</span>
              <input name="cep" inputmode="numeric" placeholder="00000-000" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
            </label>
            <label class="block">
              <span class="mb-1 block text-sm font-bold text-slate-700">Cidade</span>
              <input name="cidade" placeholder="Ex.: Maringá" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
            </label>
          </div>
          <label class="block">
            <span class="mb-1 block text-sm font-bold text-slate-700">Rua</span>
            <input name="rua" placeholder="Rua, avenida..." class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
          </label>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-[140px_1fr]">
            <label class="block">
              <span class="mb-1 block text-sm font-bold text-slate-700">Número</span>
              <input name="numero" placeholder="123" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
            </label>
            <label class="block">
              <span class="mb-1 block text-sm font-bold text-slate-700">Complemento</span>
              <input name="complemento" placeholder="Apto, casa, bloco..." class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
            </label>
          </div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label class="block">
              <span class="mb-1 block text-sm font-bold text-slate-700">Bairro</span>
              <input name="bairro" placeholder="Ex.: Centro" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
            </label>
            <label class="block">
              <span class="mb-1 block text-sm font-bold text-slate-700">Referência</span>
              <input name="referencia" placeholder="Próximo à..." class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
            </label>
          </div>
        </div>

        <label class="block">
          <span class="mb-1 block text-sm font-bold text-slate-700">Observações</span>
          <textarea name="observacoes" rows="3" placeholder="Ex.: sem cebola, troco para R$ 100..." class="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"></textarea>
        </label>

        <div class="rounded-2xl bg-slate-950 p-4 text-white">
          <div class="flex justify-between text-sm text-slate-300"><span>Itens</span><span>${cartCount()}</span></div>
          <div class="mt-2 flex justify-between text-lg font-black"><span>Total</span><span>${money(cartTotal())}</span></div>
        </div>

        <button ${state.orderLoading ? 'disabled' : ''} class="w-full rounded-2xl bg-emerald-600 px-4 py-4 text-sm font-black text-white shadow-lg shadow-emerald-600/20 disabled:opacity-60">
          ${state.orderLoading ? 'Confirmando pedido...' : 'Confirmar pedido'}
        </button>
      </form>
    </div>
  `;
}

function successOverlay() {
  if (!state.orderSuccess) return '';

  return `
    <div class="fixed inset-0 z-[90] grid place-items-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div class="w-full max-w-lg rounded-[32px] bg-white p-6 shadow-2xl ring-1 ring-slate-200">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Pedido confirmado</p>
            <h2 class="mt-2 text-2xl font-black text-slate-950">Pedido #${escapeHtml(state.orderSuccess.pedido_id)}</h2>
            <p class="mt-2 text-sm text-slate-600">Seu pedido foi gravado com sucesso. Agora você pode abrir o WhatsApp para enviar a confirmação para a loja.</p>
          </div>
          <button onclick="closeSuccess()" class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-700">✕</button>
        </div>

        <div class="mt-5 rounded-[24px] bg-slate-50 p-4">
          <div class="flex items-center justify-between text-sm text-slate-500">
            <span>Total confirmado</span>
            <strong class="text-lg font-black text-slate-950">${money(state.orderSuccess.total)}</strong>
          </div>
        </div>

        <div class="mt-5 grid gap-3 sm:grid-cols-2">
          <button onclick="openSuccessWhatsApp()" class="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-600/20">Abrir WhatsApp</button>
          <button onclick="closeSuccess()" class="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700">Novo pedido</button>
        </div>
      </div>
    </div>
  `;
}

function renderAddressField() {
  const selected = document.querySelector('input[name="tipo_atendimento"]:checked')?.value;
  const field = document.querySelector('#addressField');
  if (!field) return;
  field.classList.toggle('hidden', selected !== 'Entrega');
}

function floatingCartButton() {
  if (!cartCount()) return '';
  return `
    <button onclick="openCart()" class="fixed inset-x-4 bottom-4 z-30 mx-auto flex max-w-xl items-center justify-between rounded-[22px] bg-slate-950 px-5 py-4 text-white shadow-2xl active:scale-[0.99]" data-floating-cart>
      <span class="flex items-center gap-3">
        <span class="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-sm font-black">${cartCount()}</span>
        <span class="text-left">
          <span class="block text-xs text-slate-300">Carrinho</span>
          <span class="block text-sm font-black">Finalizar pedido</span>
        </span>
      </span>
      <strong>${money(cartTotal())}</strong>
    </button>
  `;
}

function header() {
  return `
    <header class="sticky top-0 z-20 border-b border-slate-200/70 bg-slate-50/90 backdrop-blur-xl">
      <div class="mx-auto max-w-6xl px-4 py-4">
        <div class="flex items-center justify-between gap-4">
          <div class="flex min-w-0 items-center gap-3">
            <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-600 font-black text-white shadow-lg shadow-emerald-600/20">${escapeHtml(CONFIG.STORE_NAME.slice(0, 1).toUpperCase())}</div>
            <div class="min-w-0">
              <h1 class="line-clamp-1 text-lg font-black text-slate-950">${escapeHtml(CONFIG.STORE_NAME)}</h1>
              <p class="line-clamp-1 text-xs font-medium text-slate-500">${escapeHtml(CONFIG.STORE_SUBTITLE)}</p>
            </div>
          </div>
          <button onclick="openCart()" class="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200" data-cart-button>
            <span class="text-xl">🛒</span>
            ${cartCount() ? `<span class="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-emerald-600 px-1 text-xs font-black text-white">${cartCount()}</span>` : ''}
          </button>
        </div>
      </div>
    </header>
  `;
}

function hero() {
  return `
    <section class="mx-auto max-w-6xl px-4 pb-4 pt-6">
      <div class="overflow-hidden rounded-[34px] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 text-white shadow-soft">
        <div class="max-w-2xl">
          <p class="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">Pedido rápido</p>
          <h2 class="mt-3 text-3xl font-black tracking-tight md:text-5xl">Escolha seus produtos e confirme o pedido com segurança.</h2>
          <p class="mt-3 max-w-xl text-sm leading-6 text-slate-300">O servidor recalcula os valores, registra o pedido em linhas separadas e só depois libera o atalho para o WhatsApp.</p>
        </div>
      </div>
    </section>
  `;
}

function filters() {
  return `
    <section class="mx-auto max-w-6xl px-4 pb-5">
      <div class="rounded-[28px] bg-white p-3 shadow-sm ring-1 ring-slate-200/80">
        <label class="relative block" data-search-field>
          <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
          <input value="${escapeHtml(state.searchTerm)}" oninput="setSearch(this.value)" placeholder="Buscar produto..." class="w-full rounded-2xl bg-slate-50 py-4 pl-10 pr-4 text-sm font-semibold outline-none ring-1 ring-transparent focus:ring-emerald-500" />
        </label>
        <div class="scrollbar-hide mt-3 flex gap-2 overflow-x-auto" data-category-filter>
          ${categoryButtonsMarkup()}
        </div>
      </div>
    </section>
  `;
}

function productGridHost() {
  return `
    <div data-product-grid-host>
      ${productGridMarkup()}
    </div>
  `;
}

function render() {
  $app.innerHTML = `
    ${header()}
    ${hero()}
    ${state.error ? `<div class="mx-auto max-w-6xl px-4 pb-4"><div class="rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-800 ring-1 ring-amber-200">${escapeHtml(state.error)}</div></div>` : ''}
    ${filters()}
    ${productGridHost()}
    ${floatingCartButton()}
    ${cartDrawer()}
    ${successOverlay()}
    ${state.toast ? `<div class="fixed left-1/2 top-4 z-[80] -translate-x-1/2 rounded-full bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-2xl">${escapeHtml(state.toast)}</div>` : ''}
  `;
}

function maybeStartOnboarding() {
  const seen = localStorage.getItem(onboardStorageKey());
  if (seen || typeof introJs === 'undefined') return;
  window.setTimeout(() => {
    introJs()
      .setOptions({
        nextLabel: 'Próximo',
        prevLabel: 'Voltar',
        doneLabel: 'Começar',
        skipLabel: 'Pular',
        showProgress: true,
        steps: [
          { element: document.querySelector('[data-search-field]'), intro: 'Busque produtos pelo nome, descrição ou categoria.' },
          { element: document.querySelector('[data-category-filter]'), intro: 'Filtre rapidamente por categoria.' },
          { element: document.querySelector('[data-product-card]'), intro: 'Veja imagem, descrição, preço e adicione ao carrinho.' },
          { element: document.querySelector('[data-cart-button]'), intro: 'Acompanhe a quantidade de itens no carrinho.' },
        ].filter((step) => step.element),
      })
      .oncomplete(() => localStorage.setItem(onboardStorageKey(), 'true'))
      .onexit(() => localStorage.setItem(onboardStorageKey(), 'true'))
      .start();
  }, 650);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeJs(value) {
  return String(value ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

window.setSearch = setSearch;
window.setCategory = setCategory;
window.addToCart = addToCart;
window.incrementItem = incrementItem;
window.decrementItem = decrementItem;
window.removeItem = removeItem;
window.clearCart = clearCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.openCheckout = openCheckout;
window.closeCheckout = closeCheckout;
window.submitOrder = submitOrder;
window.maskPhone = maskPhone;
window.renderAddressField = renderAddressField;
window.openSuccessWhatsApp = openSuccessWhatsApp;
window.closeSuccess = closeSuccess;

fetchProducts();
