/**
 * Módulo de domínio puro da Avraham Prompt Library.
 * Responsável por gerenciar o estado, filtragem e persistência.
 * Sem acoplamento com o DOM.
 */

class PromptCore {
  constructor(initialData = []) {
    this.baseItems = initialData;
    this.storageKeys = {
      favorites: 'avraham.promptLibrary.favorites',
      custom: 'avraham.promptLibrary.custom',
      theme: 'avraham.promptLibrary.theme',
      view: 'avraham.promptLibrary.view'
    };
    this.memoryStore = {};
    
    // Estado interno
    this.state = {
      search: '',
      scope: 'all', // 'all', 'featured', 'favorites', 'custom'
      platform: '',
      application: '',
      type: '',
      sort: 'featured', // 'featured', 'az', 'type', 'platform'
      view: this.localGet(this.storageKeys.view) || 'grid',
      favorites: new Set(this.safeJSON(this.storageKeys.favorites, [])),
      custom: this.safeJSON(this.storageKeys.custom, []),
      selected: null
    };

    this.collator = new Intl.Collator('pt-BR', { sensitivity: 'base' });
  }

  // Abstração de persistência
  localGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return Object.prototype.hasOwnProperty.call(this.memoryStore, key) ? this.memoryStore[key] : null;
    }
  }

  localSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      this.memoryStore[key] = String(value);
    }
  }

  safeJSON(key, fallback) {
    try {
      return JSON.parse(this.localGet(key)) ?? fallback;
    } catch {
      return fallback;
    }
  }

  save() {
    this.localSet(this.storageKeys.favorites, JSON.stringify([...this.state.favorites]));
    this.localSet(this.storageKeys.custom, JSON.stringify(this.state.custom));
  }

  getAllItems() {
    return [...this.baseItems, ...this.state.custom];
  }

  normalizeString(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  getUniqueSortedProperty(items, prop) {
    return [...new Set(items.map(i => i[prop]).flat().filter(Boolean))].sort(this.collator.compare);
  }

  getFilteredItems() {
    const q = this.normalizeString(this.state.search);
    const result = this.getAllItems().filter(i => {
      const hay = this.normalizeString([
        i.title, i.description, i.type, 
        ...(i.platforms || []), ...(i.applications || []), 
        ...(i.tags || []), i.content
      ].join(' '));

      if (q && !hay.includes(q)) return false;
      if (this.state.platform && !(i.platforms || []).includes(this.state.platform)) return false;
      if (this.state.application && !(i.applications || []).includes(this.state.application)) return false;
      if (this.state.type && i.type !== this.state.type) return false;
      if (this.state.scope === 'featured' && !i.featured) return false;
      if (this.state.scope === 'favorites' && !this.state.favorites.has(i.id)) return false;
      if (this.state.scope === 'custom' && !i.custom) return false;
      
      return true;
    });

    const sorters = {
      featured: (a, b) => (Number(!!b.featured) - Number(!!a.featured)) || this.collator.compare(a.title, b.title),
      az: (a, b) => this.collator.compare(a.title, b.title),
      type: (a, b) => this.collator.compare(a.type, b.type) || this.collator.compare(a.title, b.title),
      platform: (a, b) => this.collator.compare((a.platforms || [])[0] || '', (b.platforms || [])[0] || '') || this.collator.compare(a.title, b.title)
    };

    return result.sort(sorters[this.state.sort] || sorters.featured);
  }

  toggleFavorite(id) {
    if (this.state.favorites.has(id)) {
      this.state.favorites.delete(id);
    } else {
      this.state.favorites.add(id);
    }
    this.save();
  }

  addCustomPrompt(item) {
    this.state.custom.unshift(item);
    this.save();
  }

  removeCustomPrompt(id) {
    this.state.custom = this.state.custom.filter(i => i.id !== id);
    this.state.favorites.delete(id);
    this.save();
  }

  importPrompts(dataArray) {
    if (!Array.isArray(dataArray)) throw new Error('Dados de importação inválidos');
    const imported = dataArray.map((i, n) => ({
      ...i, 
      id: i.id || `IMPORTED-${Date.now()}-${n}`, 
      custom: true
    }));
    this.state.custom = [...imported, ...this.state.custom];
    this.save();
    return imported.length;
  }
}
