---
description: Levanta a divida tecnica de um projeto existente antes de abrir novas frentes. Rodar semanalmente ou ao adotar o template em projeto ja em producao.
---

Audite este projeto contra `CLAUDE.md` e `docs/`. Para cada item abaixo, reporte conforme ou achado com localização exata:

1. Commit direto na `main` no histórico recente.
2. Segredo em código, log ou arquivo versionado.
3. Rota exposta sem verificação de autorização por recurso no servidor.
4. Camada de arquitetura violada: `api` importando `repositories`, `domain` com IO direto.
5. Mudança de schema sem migration reversível.
6. Processamento pesado acoplado ao ciclo de request, sem fila.
7. Componente de UI duplicado fora do design system.
8. Cobertura de teste ausente em caminho crítico de negócio.
9. Log não estruturado ou sem correlation id em caminho relevante.
10. Backup sem teste de restauração recente.

Classifique cada achado como bloqueante ou não bloqueante. Achado bloqueante é tratado antes de qualquer frente nova ser aberta (`docs/04-fluxo-operacional.md`, seção 7).
