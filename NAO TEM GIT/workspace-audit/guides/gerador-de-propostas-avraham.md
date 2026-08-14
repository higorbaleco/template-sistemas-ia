# Guia - Gerador de Propostas | Avraham

- Caminho: `Gerador de Propostas | Avraham`
- Criticidade: `crítica`, `ativo protegido`
- Tamanho atual: `~1.12 GB`
- Peso regenerável principal:
  - `node_modules ~0.53 GB`
  - `avraham-panel/.venv ~0.17 GB`
  - `apps/studio/.next ~0.13 GB`

## Snapshot Git
- Branch: `main`
- Status: `dirty`
- Remoto: `origin/main`
- Divergência: `behind=0,ahead=0`
- Risco principal: o repo está versionado, mas há alteração local não consolidada.

## Setup Base
```bash
cd "Gerador de Propostas | Avraham"
npm install

cd "apps/studio"
npm install

cd "../../avraham-panel"
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Política De Limpeza
- Protegido: não remover material pronto nem conteúdo de biblioteca.
- `node_modules`, `.venv`, `.next` e caches são limpáveis depois de snapshot do estado atual.
- Se o espaço apertar, este é um dos maiores ganhos locais.

## Próximos Passos
1. Capturar `git status` e identificar mudanças que precisam virar commit.
2. Separar o que é código, o que é material pronto e o que é build/cache.
3. Só então executar limpeza de artefatos regeneráveis.
