# Guia - Catalogo Car Systema

- Caminho: `Catalogo Car Systema/catalogo-car-system`
- Criticidade: `crítica`, `ativo protegido`
- Tamanho atual: `~0.40 GB`
- Peso regenerável principal: `node_modules ~0.39 GB`

## Snapshot Git
- Branch: `main`
- Status: `dirty`
- Remoto: `origin/main`
- Divergência: `ahead=88`
- Risco principal: existe bastante trabalho local potencialmente não publicado.

## Setup Base
```bash
cd "Catalogo Car Systema/catalogo-car-system"
bun install
bun run dev
```

## Política De Limpeza
- Não remover código-fonte.
- Só limpar `node_modules`, `.output` e `dist` depois de consolidar ou publicar os `88` commits locais.
- Como é projeto protegido, evitar qualquer limpeza que aumente tempo de retorno ao trabalho.

## Próximos Passos
1. Revisar `git status` e separar mudanças de produto vs. ruído local.
2. Planejar publicação dos commits locais ou snapshot seguro.
3. Só depois avaliar limpeza dos artefatos regeneráveis.
