const nosConceituais = {
  agentes: {
    titulo: "Agentes de IA Cognitivos",
    subtitulo: "Entidades de computação autônomas com capacidade de decisão baseada em contexto.",
    descricao: "Agentes operam recebendo inputs do usuário, acessando memórias e executando ações por meio de ferramentas externas. O Antigravity estrutura o ciclo de vida do agente para garantir que ele atue dentro de limites seguros de execução e com objetivos claros.",
    exemplo: "Implementação de loop de raciocínio ReAct (Reasoning and Acting) com limite estrito de iterações para evitar loops infinitos.",
    codigo: "const executarAgente = async (prompt) => {\n  let memoria = carregarContexto();\n  for (let i = 0; i < MAX_ITERACOES; i++) {\n    const decisao = await consultarLLM(prompt, memoria);\n    if (decisao.tipo === 'resposta') return decisao.conteudo;\n    const resultadoTool = await executarFerramenta(decisao.tool, decisao.args);\n    memoria.push({ tool: decisao.tool, resultado: resultadoTool });\n  }\n  throw new Error('Limite de iterações atingido');\n};",
    boasPraticas: [
      "Sempre defina um limite máximo de execução (timeout e iterações).",
      "Mantenha logs detalhados e estruturados de todas as ações executadas pelos agentes.",
      "Nunca conceda permissões de escrita em banco ou execução de comandos sem validação intermediária."
    ]
  },
  codigos: {
    titulo: "Código Fonte Estruturado",
    subtitulo: "Desenvolvimento baseado nos princípios SOLID e arquitetura limpa.",
    descricao: "O ecossistema prega que o código fonte deve ser autodocumentado, legível e modularizado. A lógica central de negócios (Core) deve ser totalmente desacoplada de bibliotecas externas e frameworks para maximizar a testabilidade e o reuso de código.",
    exemplo: "Princípio de Responsabilidade Única (SRP) e Inversão de Dependências (DIP) aplicados a serviços de persistência.",
    codigo: "// Interface de abstração\nclass RepositorioDados {\n  salvar(dados) { throw new Error('Não implementado'); }\n}\n\n// Implementação concreta independente\nclass RepositorioPostgres extends RepositorioDados {\n  async salvar(dados) {\n    return await db.insert(dados);\n  }\n}",
    boasPraticas: [
      "Mantenha funções e classes pequenas com escopo único de atuação.",
      "Separe a interface de usuário da lógica de regras de negócio.",
      "Escreva testes de unidade cobrindo caminhos felizes e exceções."
    ]
  },
  rules: {
    titulo: "Diretrizes e Regras (Rules)",
    subtitulo: "Restrições de comportamento e formatação controladas por arquivos de configuração.",
    descricao: "As diretrizes servem como barreiras de segurança (guardrails) para os agentes e desenvolvedores. Definidas em arquivos de marcação (como .agents ou AGENTS.md), garantem formatação estrita, restrições ortográficas e comportamentais.",
    exemplo: "Regra para evitar emojis e uso do caractere travessão longo nas comunicações técnicas.",
    codigo: "# Regras de Escrita do Projeto\n\n- Todas as saídas devem ser em Português do Brasil.\n- Não utilize emojis nas interfaces ou códigos.\n- Use apenas pontuação padrão. Nunca utilize travessão longo no meio de frases.",
    boasPraticas: [
      "Registre todas as restrições comportamentais do projeto em um arquivo centralizado na raiz.",
      "Revise periodicamente as regras e audite se os agentes as estão seguindo de forma rigorosa.",
      "Mapeie dívidas técnicas em arquivos específicos como TECH_DEBT.md."
    ]
  },
  mcps: {
    titulo: "Model Context Protocol (MCP)",
    subtitulo: "Protocolo aberto de conexão entre modelos de linguagem e fontes de dados externas.",
    descricao: "O MCP padroniza a comunicação entre as LLMs e as ferramentas do ecossistema local ou serviços externos. Ele permite que o agente consulte bancos de dados, chame APIs, gerencie arquivos ou execute buscas de forma totalmente controlada por esquemas (JSON Schema).",
    exemplo: "Estrutura de ferramenta (tool) exposta por um servidor MCP de banco de dados.",
    codigo: "{\n  \"name\": \"executar_consulta\",\n  \"description\": \"Executa uma query SELECT segura no banco de dados\",\n  \"input_schema\": {\n    \"type\": \"object\",\n    \"properties\": {\n      \"query\": { \"type\": \"string\" }\n    },\n    \"required\": [\"query\"]\n  }\n}",
    boasPraticas: [
      "Exponha apenas as ferramentas necessárias para a execução da tarefa do agente.",
      "Valide e higienize estritamente os parâmetros de entrada definidos no schema do MCP.",
      "Utilize servidores de contexto isolados em contêineres se requererem execução de comandos."
    ]
  },
  stacks: {
    titulo: "Arquitetura e Stacks Modernas",
    subtitulo: "Organização estrutural e escolha tecnológica em camadas independentes.",
    descricao: "Uma stack de sucesso separa claramente as camadas de apresentação, controle e banco de dados. Utilizar tecnologias com tipagem estática e empacotamento simplificado reduz a fricção e o risco de falhas em tempo de execução.",
    exemplo: "Esqueleto de camadas frontend e backend com barreira de tipos e validação estrita.",
    codigo: "// Camada de Aplicação (Backend) - Validação com Zod\nimport { z } from 'zod';\n\nconst EsquemaUsuario = z.object({\n  id: z.string().uuid(),\n  email: z.string().email(),\n  idade: z.number().min(18)\n});\n\nexport const criarUsuario = (req, res) => {\n  const dadosValidados = EsquemaUsuario.parse(req.body);\n  // Salva no banco de dados...\n};",
    boasPraticas: [
      "Fixe sempre versões explícitas de bibliotecas no package.json ou requirements.txt.",
      "Utilize ferramentas de validação de esquemas em tempo de execução nas bordas da API.",
      "Adote um Design System consistente baseado em design tokens."
    ]
  },
  bancos: {
    titulo: "Bancos de Dados Gratuitos e Seguros",
    subtitulo: "Alternativas baseadas em nuvem com alto desempenho e segurança nativa.",
    descricao: "Bancos relacionais modernos na nuvem oferecem camadas gratuitas generosas para desenvolvimento. A segurança deve ser focada na encriptação de dados em trânsito (SSL/TLS) e criptografia de chaves sensíveis em repouso por meio de variáveis de ambiente.",
    exemplo: "Conexão segura utilizando o cliente Postgres em Node.js com SSL obrigatório.",
    codigo: "import pg from 'pg';\n\nconst pool = new pg.Pool({\n  connectionString: process.env.DATABASE_URL,\n  ssl: {\n    rejectUnauthorized: true, // Garante que a autoridade certificadora é válida\n    ca: process.env.DATABASE_CA_CERT\n  }\n});",
    boasPraticas: [
      "Nunca exponha credenciais de bancos de dados no repositório de códigos.",
      "Utilize bancos serverless como Supabase ou Neon para escalabilidade automatizada.",
      "Configure rotinas periódicas de backup criptografado."
    ]
  },
  rls: {
    titulo: "Row Level Security (RLS)",
    subtitulo: "Controle de acesso granular diretamente na camada de persistência do PostgreSQL.",
    descricao: "Políticas de RLS garantem que consultas SQL executadas por usuários restrinjam o retorno apenas às linhas que pertencem a eles. Isso impede falhas graves de autorização que poderiam vazar dados de outros clientes de forma silenciosa.",
    exemplo: "Criação de política RLS no PostgreSQL vinculando registros ao ID do usuário autenticado.",
    codigo: "-- Ativa a segurança em nível de linha na tabela\nALTER TABLE projetos ENABLE ROW LEVEL SECURITY;\n\n-- Cria política restringindo leitura apenas ao dono do registro\nCREATE POLICY ler_proprios_projetos ON projetos\n  FOR SELECT\n  USING (usuario_id = auth.uid());",
    boasPraticas: [
      "Ative RLS por padrão em todas as tabelas contendo dados de usuários.",
      "Teste suas políticas RLS com diferentes usuários para garantir que não existam brechas.",
      "Não confie apenas na filtragem de queries no backend. Delegue a segurança ao banco."
    ]
  },
  cybersecurity: {
    titulo: "Boas Práticas de Cibersegurança",
    subtitulo: "Garantindo a confidencialidade, integridade e disponibilidade de web apps.",
    descricao: "A segurança de web apps exige proteção em múltiplas camadas. É fundamental higienizar inputs de usuários para prevenir Cross-Site Scripting (XSS), utilizar cabeçalhos HTTP de segurança e implementar auditorias regulares para identificar e mitigar vulnerabilidades e dívidas técnicas.",
    exemplo: "Configuração de cabeçalhos de segurança (Helmet) no Express e higienização de HTML.",
    codigo: "import helmet from 'helmet';\nimport DOMPurify from 'dompurify';\nimport { JSDOM } from 'jsdom';\n\napp.use(helmet()); // Configura cabeçalhos HTTP como CSP, HSTS e X-Frame-Options\n\nconst limparEntrada = (entradaSuja) => {\n  const window = new JSDOM('').window;\n  const purify = DOMPurify(window);\n  return purify.sanitize(entradaSuja);\n};",
    boasPraticas: [
      "Implemente Content Security Policy (CSP) estrito para restringir fontes de script autorizadas.",
      "Use cookies com as flags Secure, HttpOnly e SameSite=Strict.",
      "Realize auditorias frequentes de dependências vulneráveis usando npm audit."
    ]
  }
};

// Funções de apoio lógico para manipulação do Mindmap (Core)
const obterNo = (chave) => {
  if (!nosConceituais[chave]) {
    throw new Error(`Conceito "${chave}" não encontrado no ecossistema Antigravity.`);
  }
  return nosConceituais[chave];
};

const obterTodasChaves = () => {
  return Object.keys(nosConceituais);
};

// Exportação compatível com navegador e Node.js (Jest)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    nosConceituais,
    obterNo,
    obterTodasChaves
  };
}
