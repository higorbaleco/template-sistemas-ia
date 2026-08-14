# Arquitetura e Camadas (ARCHITECTURE)

## 1. Separação de Camadas
Apesar de ser uma aplicação estática, a divisão lógica segue o padrão MVC adaptado para cliente:
- **Infraestrutura/Hospedagem:** Configurado pelo `netlify.toml` para roteamento e servidão estática otimizada.
- **Banco de Dados (Storage):** O LocalStorage do navegador e os JSONs de suporte atuam como base de dados não relacional local (key-value storage).
- **Back-end (Lógica de Domínio):** O módulo em JavaScript cuida do processamento local (filtros, CRUD em LocalStorage), operando na camada do cliente sem chamadas de rede. Funções de domínio não devem se misturar à manipulação da interface (DOM).
- **Front-end (UI/DOM):** HTML semântico com classes que consomem o design system (CSS puro / CSS Variables). Toda mudança visual é controlada por event listeners.

## 2. Esqueleto do Projeto (Pastas)
```text
avraham_prompt_library_html/
├── assets/
│   └── icons/         # Ícones em formato SVG
├── docs/              # Especificações, arquitetura, design tokens, critérios
├── data/
│   └── prompts.json   # Backup/catálogo estático no formato JSON raw
├── js/
│   ├── app.js         # Lógica da camada visual (View e Controllers)
│   ├── core.js        # Lógica de domínio e negócios puros (Desacoplado)
│   └── prompts.js     # Objeto em JS com os dados iniciais
├── tests/
│   └── core.test.js   # Testes unitários focados nas regras de negócio/core
├── index.html         # Ponto de entrada (esqueleto da UI)
├── styles.css         # Regras de estilo conectadas ao design-tokens
├── design-tokens.json # Fonte de verdade visual (cores, espaçamentos)
└── netlify.toml       # Configuração de Infraestrutura e Build
```
