const fs = require('fs');
const path = require('path');

// Carregar o código core.js usando eval no contexto de teste
const coreCode = fs.readFileSync(path.join(__dirname, '../js/core.js'), 'utf8');

// Como o código do core.js não exporta via module.exports para rodar direto no Node,
// nós o executamos neste contexto:
let PromptCore;
eval(coreCode.replace('class PromptCore', 'PromptCore = class'));

describe('PromptCore (Regras de Negócio)', () => {
  let core;

  const mockData = [
    {
      id: '1',
      title: 'Prompt de Teste',
      description: 'Descrição de teste',
      type: 'Prompt',
      platforms: ['ChatGPT'],
      applications: ['Geral'],
      content: 'Este é um teste',
      featured: true
    },
    {
      id: '2',
      title: 'Agente de Vendas',
      description: 'Descrição de vendas',
      type: 'Agente',
      platforms: ['Claude'],
      applications: ['Comercial'],
      content: 'Você é um vendedor',
      featured: false
    }
  ];

  beforeEach(() => {
    // Mock simples de localStorage
    const store = {};
    global.window = {
      localStorage: {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
        removeItem: jest.fn(key => { delete store[key]; })
      }
    };
    
    core = new PromptCore(mockData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('deve inicializar com os dados base', () => {
    expect(core.getAllItems()).toHaveLength(2);
    expect(core.getAllItems()[0].title).toBe('Prompt de Teste');
  });

  test('deve filtrar itens por plataforma', () => {
    core.state.platform = 'Claude';
    const filtered = core.getFilteredItems();
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('Agente de Vendas');
  });

  test('deve buscar por texto e ignorar acentos', () => {
    core.state.search = 'vendas';
    const filtered = core.getFilteredItems();
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('Agente de Vendas');
  });

  test('deve alternar favoritos e salvar no localStorage', () => {
    core.toggleFavorite('1');
    expect(core.state.favorites.has('1')).toBe(true);
    expect(window.localStorage.setItem).toHaveBeenCalledWith(core.storageKeys.favorites, JSON.stringify(['1']));
    
    core.toggleFavorite('1');
    expect(core.state.favorites.has('1')).toBe(false);
  });

  test('deve adicionar um prompt customizado', () => {
    const newItem = {
      id: 'CUSTOM-123',
      title: 'Novo Custom',
      description: 'Desc',
      content: 'Conteúdo',
      custom: true
    };
    core.addCustomPrompt(newItem);
    expect(core.getAllItems()).toHaveLength(3);
    expect(core.state.custom).toHaveLength(1);
    expect(window.localStorage.setItem).toHaveBeenCalled();
  });

  test('deve excluir um prompt customizado', () => {
    const newItem = { id: 'CUSTOM-123', title: 'Novo Custom', custom: true };
    core.addCustomPrompt(newItem);
    core.removeCustomPrompt('CUSTOM-123');
    expect(core.state.custom).toHaveLength(0);
    expect(core.getAllItems()).toHaveLength(2);
  });
});
