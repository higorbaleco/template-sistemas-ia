# Guia - Painel SVP Disparos WhatsApp

- Caminho: `Painel SVP Disparos WhatsApp`
- Criticidade: `crítica`, `ativo protegido`
- Tamanho atual: `~0.73 GB`
- Estrutura principal:
  - `avraham-spark`
  - `sendpanel-avraham`

## Snapshot Git
- `avraham-spark`: branch `agent/fase-2-campaigns-svp-base`, `dirty`, `origin/...`, `0/0`
- `sendpanel-avraham`: branch `main`, `clean`, `origin/main`, `0/0`
- Risco principal: há um app limpo e outro com trabalho local não consolidado.

## Setup Base
```bash
cd "Painel SVP Disparos WhatsApp/avraham-spark"
bun install
bun run dev

cd "../sendpanel-avraham"
bun install
bun run dev
```

## Política De Limpeza
- Não mexer em código-fonte nem trocar branch sem revisar `avraham-spark`.
- `node_modules` e `.output` são regeneráveis nos dois apps.
- Como projeto protegido, limpeza só após snapshot do app `dirty`.

## Próximos Passos
1. Consolidar o estado do `avraham-spark`.
2. Confirmar se a branch agent deve continuar viva ou ser mergeada.
3. Limpar só artefatos recriáveis.
