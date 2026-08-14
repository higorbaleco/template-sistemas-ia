(() => {
  // Instancia o core da aplicação passando os dados base
  const core = new PromptCore(Array.isArray(window.PROMPT_LIBRARY) ? window.PROMPT_LIBRARY : []);

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const escapeHTML = str => String(str).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  const els = {
    cards: $('#cards-grid'), empty: $('#empty-state'), search: $('#search-input'), resultTitle: $('#result-title'), resultCount: $('#result-count'),
    platformNav: $('#platform-nav'), appNav: $('#application-nav'), typeNav: $('#type-nav'), activeFilters: $('#active-filters'), sort: $('#sort-select'),
    promptDialog: $('#prompt-dialog'), dialogTitle: $('#dialog-title'), dialogDescription: $('#dialog-description'), dialogContent: $('#dialog-content'),
    dialogBadges: $('#dialog-badges'), dialogMeta: $('#dialog-meta'), dialogFavorite: $('#dialog-favorite'), dialogDelete: $('#dialog-delete'), dialogCopy: $('#dialog-copy'),
    editor: $('#editor-dialog'), editorForm: $('#editor-form'), toast: $('#toast'), sidebar: $('#sidebar'), overlay: $('#sidebar-overlay')
  };

  let toastTimer;
  const toast = msg => { 
    els.toast.textContent = msg; 
    els.toast.classList.add('show'); 
    clearTimeout(toastTimer); 
    toastTimer = setTimeout(() => els.toast.classList.remove('show'), 1800); 
  };

  function countsFor(field, value) {
    return core.getAllItems().filter(i => (i[field] || []).includes ? i[field].includes(value) : i[field] === value).length;
  }

  function navButton(group, value, count) {
    const active = core.state[group] === value ? ' active' : '';
    return `<button class="nav-item${active}" data-filter-group="${group}" data-filter-value="${escapeHTML(value)}"><span>${escapeHTML(value)}</span><b>${count}</b></button>`;
  }

  function renderNavigation() {
    const items = core.getAllItems();
    const platforms = core.getUniqueSortedProperty(items, 'platforms');
    const apps = core.getUniqueSortedProperty(items, 'applications');
    const types = core.getUniqueSortedProperty(items, 'type');
    
    els.platformNav.innerHTML = platforms.map(v => navButton('platform', v, countsFor('platforms', v))).join('');
    els.appNav.innerHTML = apps.map(v => navButton('application', v, countsFor('applications', v))).join('');
    els.typeNav.innerHTML = types.map(v => navButton('type', v, items.filter(i => i.type === v).length)).join('');
    
    $('#count-all').textContent = items.length;
    $('#count-featured').textContent = items.filter(i => i.featured).length;
    $('#count-favorites').textContent = items.filter(i => core.state.favorites.has(i.id)).length;
    $('#count-custom').textContent = core.state.custom.length;
    $('#stat-total').textContent = items.length;
    $('#stat-platforms').textContent = platforms.length;
    $('#stat-apps').textContent = apps.length;
    
    $$('[data-filter-group="scope"]').forEach(b => b.classList.toggle('active', b.dataset.filterValue === core.state.scope));
  }

  function card(item) {
    const fav = core.state.favorites.has(item.id);
    const tags = (item.tags || []).slice(0, 4).map(t => `<span class="tag">${escapeHTML(t)}</span>`).join('');
    const platforms = (item.platforms || ['Universal']).slice(0, 2).map(p => `<span class="badge platform">${escapeHTML(p)}</span>`).join('');
    
    // Ícone de favorito (SVG ao invés de emoji/caractere)
    const favIcon = fav 
      ? `<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`
      : `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;

    return `<article class="prompt-card" data-id="${escapeHTML(item.id)}" tabindex="0">
      <div class="card-top">
        <div class="badges">${platforms}<span class="badge type">${escapeHTML(item.type)}</span></div>
        <button class="favorite-btn${fav ? ' active' : ''}" data-favorite="${escapeHTML(item.id)}" aria-label="Favoritar">${favIcon}</button>
      </div>
      <div class="card-copy"><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.description)}</p></div>
      <div class="card-bottom"><div class="tag-list">${tags}</div><span class="open-link">Abrir</span></div>
    </article>`;
  }

  function renderActiveFilters() {
    const filters = [];
    if(core.state.platform) filters.push(['platform', core.state.platform]);
    if(core.state.application) filters.push(['application', core.state.application]);
    if(core.state.type) filters.push(['type', core.state.type]);
    els.activeFilters.innerHTML = filters.map(([g, v]) => `<button class="filter-chip" data-remove-filter="${g}">${escapeHTML(v)} &times;</button>`).join('');
  }

  function render() {
    renderNavigation(); 
    renderActiveFilters();
    
    const items = core.getFilteredItems();
    els.cards.classList.toggle('list-view', core.state.view === 'list');
    els.cards.innerHTML = items.map(card).join('');
    els.empty.classList.toggle('hidden', items.length > 0);
    els.resultCount.textContent = `${items.length} ${items.length === 1 ? 'resultado' : 'resultados'}`;
    
    const titles = { all: 'Todos os ativos', featured: 'Em destaque', favorites: 'Favoritos', custom: 'Meus prompts' };
    els.resultTitle.textContent = core.state.search ? `Resultados para "${core.state.search}"` : titles[core.state.scope];
    
    $$('.view-toggle').forEach(b => b.classList.toggle('active', b.dataset.view === core.state.view));
  }

  function setFilter(group, value) {
    core.state[group] = core.state[group] === value && group !== 'scope' ? '' : value;
    render(); 
    closeSidebar();
  }

  function updateDialogFavorite() {
    const active = core.state.selected && core.state.favorites.has(core.state.selected.id);
    els.dialogFavorite.textContent = active ? 'Remover favorito' : 'Favoritar';
  }

  function toggleFavoriteUI(id) {
    core.toggleFavorite(id);
    render();
    if(core.state.selected?.id === id) updateDialogFavorite();
  }

  function openItem(id) {
    const item = core.getAllItems().find(i => i.id === id); 
    if(!item) return;
    
    core.state.selected = item;
    els.dialogTitle.textContent = item.title;
    els.dialogDescription.textContent = item.description;
    els.dialogContent.textContent = item.content;
    els.dialogBadges.innerHTML = [...(item.platforms || []).map(p => `<span class="badge platform">${escapeHTML(p)}</span>`), `<span class="badge type">${escapeHTML(item.type)}</span>`].join('');
    els.dialogMeta.innerHTML = `<span>ID: ${escapeHTML(item.id)}</span><span>Versão: ${escapeHTML(item.version || '1.0.0')}</span><span>Aplicações: ${escapeHTML((item.applications || []).join(' &middot; '))}</span>`;
    els.dialogDelete.classList.toggle('hidden', !item.custom);
    updateDialogFavorite();
    els.promptDialog.showModal();
  }

  async function copyText(text) {
    try { 
      await navigator.clipboard.writeText(text); 
    } catch { 
      const ta = document.createElement('textarea'); 
      ta.value = text; 
      ta.style.position = 'fixed'; 
      ta.style.opacity = '0'; 
      document.body.appendChild(ta); 
      ta.select(); 
      document.execCommand('copy'); 
      ta.remove(); 
    }
    toast('Conteúdo copiado');
  }

  function resetFilters() { 
    Object.assign(core.state, { search: '', scope: 'all', platform: '', application: '', type: '' }); 
    els.search.value = ''; 
    render(); 
  }

  function openSidebar() { els.sidebar.classList.add('open'); els.overlay.classList.add('show'); }
  function closeSidebar() { els.sidebar.classList.remove('open'); els.overlay.classList.remove('show'); }

  // Event Listeners
  document.addEventListener('click', e => {
    const filter = e.target.closest('[data-filter-group]'); 
    if(filter) { setFilter(filter.dataset.filterGroup, filter.dataset.filterValue); return; }
    
    const clear = e.target.closest('[data-clear]'); 
    if(clear) { core.state[clear.dataset.clear] = ''; render(); return; }
    
    const remove = e.target.closest('[data-remove-filter]'); 
    if(remove) { core.state[remove.dataset.removeFilter] = ''; render(); return; }
    
    const fav = e.target.closest('[data-favorite]'); 
    if(fav) { e.stopPropagation(); toggleFavoriteUI(fav.dataset.favorite); return; }
    
    const cardEl = e.target.closest('.prompt-card'); 
    if(cardEl) { openItem(cardEl.dataset.id); return; }
    
    const view = e.target.closest('[data-view]'); 
    if(view) { 
      core.state.view = view.dataset.view; 
      core.localSet(core.storageKeys.view, core.state.view); 
      render(); 
      return; 
    }
  });

  els.cards.addEventListener('keydown', e => { 
    if((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('prompt-card')) {
      e.preventDefault();
      openItem(e.target.dataset.id);
    } 
  });

  els.search.addEventListener('input', e => { core.state.search = e.target.value.trim(); render(); });
  els.sort.addEventListener('change', e => { core.state.sort = e.target.value; render(); });
  $('#reset-filters').addEventListener('click', resetFilters);
  $('[data-close-dialog]').addEventListener('click', () => els.promptDialog.close());
  $$('[data-close-editor]').forEach(b => b.addEventListener('click', () => els.editor.close()));
  $('#add-btn').addEventListener('click', () => els.editor.showModal());
  els.dialogFavorite.addEventListener('click', () => core.state.selected && toggleFavoriteUI(core.state.selected.id));
  els.dialogCopy.addEventListener('click', () => core.state.selected && copyText(core.state.selected.content));
  
  els.dialogDelete.addEventListener('click', () => {
    if(!core.state.selected?.custom) return;
    if(!confirm('Excluir este prompt personalizado?')) return;
    core.removeCustomPrompt(core.state.selected.id);
    els.promptDialog.close(); 
    render(); 
    toast('Prompt excluído');
  });

  els.editorForm.addEventListener('submit', e => {
    e.preventDefault(); 
    const fd = new FormData(e.currentTarget); 
    const now = Date.now();
    
    const item = {
      id: `CUSTOM-${now}`,
      title: fd.get('title').trim(),
      description: fd.get('description').trim(),
      type: fd.get('type'),
      platforms: [fd.get('platform')],
      applications: [fd.get('application')],
      tags: fd.get('tags').split(',').map(s => s.trim()).filter(Boolean),
      version: '1.0.0',
      source: 'localStorage',
      content: fd.get('content').trim(),
      custom: true,
      featured: false
    };
    
    core.addCustomPrompt(item); 
    e.currentTarget.reset(); 
    els.editor.close(); 
    core.state.scope = 'custom'; 
    render(); 
    toast('Prompt salvo');
  });

  $('#theme-btn').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; 
    document.documentElement.dataset.theme = next; 
    core.localSet(core.storageKeys.theme, next);
  });

  $('#menu-btn').addEventListener('click', openSidebar); 
  els.overlay.addEventListener('click', closeSidebar);
  
  document.addEventListener('keydown', e => { 
    if(e.key === '/' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      els.search.focus();
    } 
    if(e.key === 'Escape') closeSidebar(); 
  });

  $('#export-btn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(core.state.custom, null, 2)], {type: 'application/json'}); 
    const a = document.createElement('a'); 
    a.href = URL.createObjectURL(blob); 
    a.download = 'avraham-prompts-personalizados.json'; 
    a.click(); 
    URL.revokeObjectURL(a.href); 
    toast('Arquivo exportado');
  });

  $('#import-input').addEventListener('change', async e => {
    const file = e.target.files[0]; 
    if(!file) return;
    try { 
      const data = JSON.parse(await file.text()); 
      const count = core.importPrompts(data);
      render(); 
      toast(`${count} itens importados`); 
    } catch { 
      toast('JSON inválido'); 
    }
    e.target.value = '';
  });

  const theme = core.localGet(core.storageKeys.theme); 
  if(theme) document.documentElement.dataset.theme = theme;
  
  render();
})();