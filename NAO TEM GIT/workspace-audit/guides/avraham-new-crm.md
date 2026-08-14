# Guia - Avraham New CRM

- Caminhos:
  - `Avraham New CRM`
  - `Avraham New CRM/avraham-hub`
- Categoria: `ativo`
- Tamanho atual: `~0.41 GB`

## Snapshot Git
- Raiz `Avraham New CRM`: `dirty`, sem `origin`
- `avraham-hub`: `dirty`, `origin/main`, `behind=1,ahead=2`
- Risco principal: mistura de wrapper local-only com app divergente do remoto.

## Política De Limpeza
- Bloqueado para limpeza destrutiva até resolver a divergência do `avraham-hub`.
- `node_modules` e `.output` do app são regeneráveis depois da reconciliação.

## Próximos Passos
1. Comparar os `2` commits locais com o `1` commit faltante do remoto.
2. Definir se a pasta raiz precisa virar repo separado.
3. Só depois limpar artefatos.
