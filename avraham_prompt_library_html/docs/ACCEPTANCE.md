# Critérios de Aceite (ACCEPTANCE)

Este checklist serve de validação final. Só consideraremos a refatoração concluída se:

- [ ] Todas as documentações (`docs/`) existem e refletem as regras atuais.
- [ ] O `design-tokens.json` existe na raiz do projeto com as definições hexadecimais de cor documentadas.
- [ ] Todo o HTML possui hierarquia lógica (um único `<h1>`, tags main, nav, aside quando apropriado) e semântica (`aria-labels`).
- [ ] Zero uso de nomes genéricos de cores (red, blue) no CSS; todas as cores utilizam as variáveis root carregadas dos tokens, com contraste aferido de pelo menos 4.5:1.
- [ ] O JavaScript de manipulação de DOM (`app.js`) está separado da lógica pura de dados e filtros (`core.js`).
- [ ] A aplicação suporta o modo claro e o modo escuro (Dark/Light).
- [ ] Não existem mais emojis no código ou na interface final (apenas SVGs utilizados).
- [ ] Os testes unitários na pasta `tests/` executam com sucesso (cobrindo as funções da camada `core`).
- [ ] O arquivo `netlify.toml` está configurado corretamente.
- [ ] O idioma da interface e código foi totalmente portado para o formato pt-BR, removendo terminologias não-naturais.
