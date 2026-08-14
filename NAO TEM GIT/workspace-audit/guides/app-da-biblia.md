# Guia - App da Bíblia

- Caminho: `App da Bíblia`
- Categoria: `ativo`
- Tamanho atual: `~0.69 GB`
- Peso regenerável principal:
  - `node_modules ~0.46 GB`
  - `.next ~0.23 GB`

## Snapshot Git
- Branch: `main`
- Status: `dirty`
- Remoto: inexistente
- Risco principal: projeto relativamente grande com trabalho local sem proteção remota.

## Política De Limpeza
- Prioridade é criar `origin` ou gerar snapshot confiável antes de qualquer remoção local.
- `node_modules` e `.next` são ganhos grandes de espaço depois disso.

## Próximos Passos
1. Decidir se o projeto vira repo próprio ou entra em monorepo.
2. Publicar o estado atual.
3. Limpar artefatos regeneráveis.
