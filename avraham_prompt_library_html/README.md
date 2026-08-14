# Avraham Prompt Library HTML

Mini biblioteca estática construída com HTML, CSS e JavaScript puro.

## Como abrir

Abra `index.html` no navegador.

Para testar por servidor local:

```bash
cd avraham_prompt_library_html
python3 -m http.server 8080
```

Depois abra `http://localhost:8080`.

## Recursos

- Busca textual.
- Filtros por plataforma, aplicação e tipo.
- Favoritos salvos no navegador.
- Modo grade e lista.
- Tema claro e escuro.
- Visualização e cópia do conteúdo.
- Criação de prompts personalizados.
- Importação e exportação de personalizados em JSON.
- Layout responsivo.
- Sem frameworks e sem dependências externas.

## Arquivos

- `index.html`: estrutura.
- `styles.css`: interface.
- `js/prompts.js`: catálogo embutido para funcionar via `file://`.
- `js/app.js`: busca, filtros, modal, favoritos e editor.
- `data/prompts.json`: cópia legível dos dados.

## Atualização da biblioteca

Edite os objetos em `js/prompts.js` e mantenha `data/prompts.json` sincronizado. Para uma próxima versão, a biblioteca pode receber um painel administrativo e backend, mas esta versão funciona integralmente offline.
