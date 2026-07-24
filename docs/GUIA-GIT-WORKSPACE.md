# Guia de Subida para Git

Data base: 24 de julho de 2026

## Recomendacao

Usar esta raiz como repositorio umbrella de organizacao e memoria operacional.

Status atual: a raiz ja foi inicializada em Git na branch `main` em 24 de julho
de 2026. Falta apenas decidir o que sera incluido no primeiro commit da raiz.

Isso permite:

- salvar a estrutura inteira da pasta
- versionar documentacao, mapas e scripts de apoio
- evitar subir dependencias e builds gigantes
- preservar os subrepositorios que ja existem

## O que entra no Git da raiz

- documentacao da raiz
- scripts de auditoria
- fontes dos projetos que ainda nao possuem repo maduro, se voces quiserem usar a raiz como backup umbrella

## O que nao deve entrar no Git da raiz

- `node_modules`
- `.next`
- `dist`
- `.venv` e `venv`
- caches, logs e `coverage`
- `.DS_Store`
- backups `.zip` soltos da raiz

## Ponto de decisao importante

Existem 12 subrepositorios dentro desta pasta. Antes do push remoto da raiz,
vale alinhar qual destes caminhos voces querem seguir:

1. raiz como inventario e backup umbrella, mantendo os subrepositorios vivos
2. migracao futura para um monorepo de verdade
3. separar somente os projetos ativos e arquivar o resto

Recomendacao de hoje: seguir pela opcao 1 primeiro. E a forma mais segura de
salvar tudo sem quebrar historicos locais.

## Fluxo sugerido

Fluxo sugerido a partir do estado atual:

```bash
git add .gitignore README.md docs scripts
git commit -m "chore: estrutura inicial do workspace umbrella"
git remote add origin <url-do-repositorio>
git push -u origin main
```

Depois, avaliar com calma se voces querem incluir os fontes de todos os projetos
na raiz ou se preferem deixar alguns somente nos repos proprios.
