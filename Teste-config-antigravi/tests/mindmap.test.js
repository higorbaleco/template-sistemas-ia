const { nosConceituais, obterNo, obterTodasChaves } = require("../src/js/mindmap");

describe("Testes Unitários - Módulo Mindmap Core", () => {
  
  test("Deve conter exatamente 8 conceitos mapeados no ecossistema", () => {
    const chaves = obterTodasChaves();
    expect(chaves.length).toBe(8);
    expect(chaves).toContain("agentes");
    expect(chaves).toContain("codigos");
    expect(chaves).toContain("rules");
    expect(chaves).toContain("mcps");
    expect(chaves).toContain("stacks");
    expect(chaves).toContain("bancos");
    expect(chaves).toContain("rls");
    expect(chaves).toContain("cybersecurity");
  });

  test("Cada conceito deve possuir a estrutura de dados completa exigida", () => {
    const chaves = obterTodasChaves();
    
    chaves.forEach(chave => {
      const conceito = nosConceituais[chave];
      
      expect(conceito).toHaveProperty("titulo");
      expect(conceito).toHaveProperty("subtitulo");
      expect(conceito).toHaveProperty("descricao");
      expect(conceito).toHaveProperty("exemplo");
      expect(conceito).toHaveProperty("codigo");
      expect(conceito).toHaveProperty("boasPraticas");
      
      // Validações de tipo
      expect(typeof conceito.titulo).toBe("string");
      expect(typeof conceito.subtitulo).toBe("string");
      expect(typeof conceito.descricao).toBe("string");
      expect(typeof conceito.exemplo).toBe("string");
      expect(typeof conceito.codigo).toBe("string");
      expect(Array.isArray(conceito.boasPraticas)).toBe(true);
      expect(conceito.boasPraticas.length).toBeGreaterThan(0);
    });
  });

  test("obterNo deve retornar o conceito correto se a chave for válida", () => {
    const agentes = obterNo("agentes");
    expect(agentes.titulo).toBe("Agentes de IA Cognitivos");
    
    const rls = obterNo("rls");
    expect(rls.titulo).toBe("Row Level Security (RLS)");
  });

  test("obterNo deve lançar um erro apropriado se a chave for inválida", () => {
    expect(() => {
      obterNo("chave_inexistente");
    }).toThrow('Conceito "chave_inexistente" não encontrado no ecossistema Antigravity.');
  });
});
