# Guia - Cardápio Online | Pizza do Gordo

- Caminho: `Cardápio Online | Pizza do Gordo`
- Criticidade: `crítica`, `ativo protegido`
- Tamanho atual: `~0.12 GB`
- Peso regenerável principal: `node_modules ~0.11 GB`

## Snapshot Git
- Branch: `main`
- Status: `dirty`
- Remoto: inexistente
- Risco principal: projeto protegido, mas ainda local-only.

## Setup Base
```bash
cd "Cardápio Online | Pizza do Gordo"
npm install
npm run dev
```

## Política De Limpeza
- Não remover o clone local enquanto não existir remoto ou backup confiável.
- `node_modules` pode sair depois que o estado local estiver documentado.
- Como está sem `origin`, a primeira defesa aqui é versionamento.

## Próximos Passos
1. Criar remoto e subir o estado atual.
2. Registrar como projeto oficialmente protegido.
3. Só então limpar artefatos regeneráveis.
