# Landing Page Antigravity

Esta é uma landing page conceitual, interativa e explicativa sobre o ecossistema Antigravity para desenvolvimento de agentes, práticas recomendadas de segurança, Model Context Protocol (MCP), Row Level Security (RLS) e arquiteturas de banco de dados robustas.

## Pré-requisitos

Para executar o servidor de desenvolvimento local e rodar a suíte de testes unitários, você precisará de:
- **Node.js**: Versão 18.0.0 ou superior instalada localmente.
- **NPM**: Gerenciador de pacotes padrão do Node.js.

## Instruções de Instalação

Siga os passos abaixo para preparar o ambiente de desenvolvimento local:

1. Instale as dependências de desenvolvimento do projeto:
   ```bash
   npm install
   ```

2. Para iniciar o servidor de desenvolvimento local com recarregamento em tempo real:
   ```bash
   npm run dev
   ```
   O projeto estará acessível no endereço http://127.0.0.1:8080/

3. Para executar a suíte de testes unitários:
   ```bash
   npm run test
   ```

## Exemplo de Uso

Ao abrir a landing page:
1. Navegue pelas seções conceituais que descrevem agentes, regras e a arquitetura segura.
2. Interaja com o **Mindmap Conceitual** na seção interativa clicando nos nós do gráfico (como MCP, RLS, Cibersegurança).
3. O painel dinâmico atualizará automaticamente o conteúdo explicativo, trechos de código de exemplo e boas práticas recomendadas para o pilar selecionado.

## Estrutura de Pastas

A organização de diretórios do projeto segue a estrutura abaixo:

```text
├── docs/                      # Documentação de especificação e Rationales
│   ├── prd.md                 # Product Requirements Document
│   ├── pre.md                 # Technical/Product Rationale
│   ├── specs.md               # Especificações técnicas e de fluxos
│   └── criterios_aceite.md    # Checklist de aceitação do projeto
├── src/                       # Arquivos fonte do frontend
│   ├── css/
│   │   └── index.css          # Estilos vanilla estruturados
│   ├── js/
│   │   ├── main.js            # Inicialização e eventos de UI
│   │   └── mindmap.js         # Lógica core e dados dos nós conceituais
│   └── index.html             # Documento HTML principal
├── tests/                     # Testes automatizados do projeto
│   └── mindmap.test.js        # Testes de unidade da lógica do mindmap
├── design-tokens.json         # Tokens de design do sistema visual
├── package.json               # Dependências do projeto
├── .gitignore                 # Arquivos ignorados pelo Git
└── README.md                  # Documentação do projeto
```

## Licença

Este projeto está licenciado sob a licença ISC.
