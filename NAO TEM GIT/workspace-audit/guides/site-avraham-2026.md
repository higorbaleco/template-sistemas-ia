# Guia - SITE AVRAHAM 2026

- Caminhos:
  - `SITE AVRAHAM 2026`
  - `SITE AVRAHAM 2026/avraham-lp-verde`
- Criticidade: `crítica`, `ativo protegido`
- Tamanho atual: `~0.63 GB`
- Peso regenerável principal: `avraham-lp-verde/node_modules ~0.58 GB`

## Snapshot Git
- Repositório raiz: `dirty`, `origin/main`, `behind=1`
- App `avraham-lp-verde`: `clean`, `origin/main`, `behind=1`
- Risco principal: há mudança local na raiz e o remoto já avançou.

## Setup Base
```bash
cd "SITE AVRAHAM 2026/avraham-lp-verde"
bun install
bun run dev
```

## Política De Limpeza
- Não limpar nada destrutivo antes de reconciliar o `behind=1`.
- Se precisar espaço rápido, `node_modules`, `dist` e `.output` são recriáveis.
- Como projeto protegido, manter o app pronto para reativação rápida.

## Próximos Passos
1. Comparar a raiz com o commit remoto pendente.
2. Validar se a raiz e o app devem continuar em repositórios separados.
3. Depois disso, decidir se vale purgar artefatos locais.
