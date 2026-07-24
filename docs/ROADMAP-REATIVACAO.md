# Roadmap de Reativacao

Data base: 24 de julho de 2026

## Meta

Reativar os projetos com maior peso e maior risco operacional primeiro, sem
misturar codigo-fonte com artefatos gerados.

## Fase 1. Blindagem do workspace

Objetivo: deixar a raiz pronta para versionamento sem inflar o repositorio.

- concluir o `.gitignore` umbrella
- manter `node_modules`, `.next`, `dist` e `.venv` fora do Git
- preservar apenas fonte, docs e configuracoes
- decidir destino dos `.zip` soltos da raiz

Saida esperada:

- workspace com indice central
- politica de versionamento definida
- base pronta para primeiro push da raiz

## Fase 2. Reativacao dos projetos pesados

Ordem recomendada:

1. `Gerador de Propostas | Avraham`
2. `SOCIAL-MEDIA-OLLEG`
3. `OUTBOUND | OLLEG`
4. `SITE AVRAHAM 2026`
5. `Painel SVP Disparos WhatsApp`
6. `smart-finance-central`
7. `Decide Aí Food`
8. `my-project`
9. `CRM Avraham ANTIGO FLOW`
10. `CALCULO MARGEM DISPAROS TOPSEND`
11. `Cardápio Online | Pizza do Gordo`

Checklist por projeto:

1. validar se existe `.env`, credencial ou banco local nao documentado
2. apagar apenas caches gerados, nunca fonte
3. reinstalar dependencias
4. subir localmente em `dev`
5. registrar porta, stack e bloqueios no README do proprio projeto
6. definir se o projeto fica ativo, legado ou arquivado

## Fase 3. Higiene de repositorios

Objetivo: parar de misturar repos validos, prototipos e materiais soltos.

- manter subrepositorios ativos com historico proprio
- usar a raiz como mapa operacional e backup organizado
- decidir quais projetos sem commits merecem repo dedicado
- transformar projetos legados em backlog documentado, nao em pasta esquecida

## Fase 4. Padrao minimo para todos os projetos ativos

Cada projeto ativo deve terminar com:

- `README.md` com setup e deploy
- `.gitignore` local coerente
- instrucoes de reativacao
- status claro: ativo, legado, prototipo ou arquivado
- dono ou proxima acao definida

## Backlog recomendado

### Curto prazo

- revisar os dirty repos antes de qualquer commit em massa
- revisar os projetos que ja estao `ahead` ou com mudancas locais importantes:
  `Gerador de Propostas | Avraham`, `smart-finance-central`,
  `SOCIAL-MEDIA-OLLEG` e `SITE AVRAHAM 2026`
- fazer primeiro commit dos projetos que ainda estao em `main` sem historico
- consolidar onde ficam backups `.zip`

### Medio prazo

- padronizar Node version por projeto
- documentar variaveis de ambiente
- registrar deploy atual ou ultimo deploy conhecido

### Longo prazo

- reduzir duplicidade entre CRMs, paineis e geradores
- avaliar consolidacao de projetos correlatos
- criar catalogo unico de sistemas com status e dono
