# 04. Fluxo operacional

Ciclo completo da demanda ao merge. Este documento descreve o "como", complementando o "quem roda em qual modelo" de `docs/03-orquestracao-de-agentes.md`.

## 1. Da ideia à especificação

Referência: §16 e §12.

1. A demanda nasce como ideia, muitas vezes capturada em áudio no momento em que ocorre, porque é o meio mais rápido de registrar sem perder o raciocínio.
2. A ideia é transcrita.
3. A transcrição bruta, sem edição, é entregue ao `planner` via `/plan`.
4. O `planner` conduz um interrogatório: aponta lacuna, ambiguidade, decisão não tomada. O humano fecha cada lacuna.
5. A especificação é gerada, revisada e congelada.
6. A especificação vira fila de issues, cada uma pequena o suficiente para caber em uma janela limpa.

A etapa 4 é onde o retrabalho é evitado. Referência: §17, planejamento detalhado reduz erro na execução e reduz o custo total; retrabalho é o maior desperdício observado, acima de token e acima de tempo de execução.

## 2. Parada humana: aprovação do plano

O plano gerado pelo `planner` não avança para execução sem validação explícita do owner. Isto não é burocracia, é o ponto em que um erro de especificação é corrigido antes de se propagar pela fila inteira de issues.

## 3. Uma issue por janela limpa

Referência: §11.

- Cada issue é trabalhada em uma janela de contexto nova, nunca emendada à tarefa anterior.
- O `executor` lê a issue e apenas o recorte de código citado nela, declara o que vai fazer, executa.
- Issue precisa ter descrição suficiente para ser executada sem consultar a conversa em que nasceu. Issue vaga não é backlog, é dívida.
- Múltiplas issues podem ficar abertas simultaneamente como backlog paralelizável, porque cada uma roda isolada e nenhuma contamina o contexto da outra.

## 4. Suíte e revisão

Após implementação: `test-runner` roda a suíte completa. Suíte vermelha bloqueia a fila inteira, sem exceção de urgência (`CLAUDE.md` regra 3). Só então o `code-reviewer` roda em contexto isolado sobre o diff.

Achado de revisão é hipótese, não veredito. Cada achado é confirmado no código antes de qualquer correção ser aplicada; achado não confirmado é descartado com justificativa registrada (§6).

## 5. Ship e parada final

`/ship` produz o relatório do que foi feito e apresenta o resumo para autorização explícita antes do `git push`. O `git push` em si é bloqueado mecanicamente (`.claude/hooks/block-push`), não apenas por convenção. Ver `docs/05-travas-e-quality-gates.md`.

## 6. Higiene de sessão

`/context-check` a cada aproximadamente sessenta por cento de consumo de janela, preservando decisão tomada, arquivos tocados e próximo passo. Ver `docs/06-economia-de-contexto-e-tokens.md`. Tarefa concluída encerra a janela; não se emenda tarefa nova na mesma janela.

## 7. Projeto existente

Para projeto que já existe e está recebendo o template:

1. Copiar `CLAUDE.md`, `.claude/` e `docs/` para a raiz.
2. Preencher `CLAUDE.md` seções 1 e 2.
3. Rodar `/audit-project` para levantar a dívida técnica existente.
4. Tratar achados bloqueantes (segredo exposto, ausência de teste em caminho crítico, acoplamento entre camadas) antes de abrir qualquer frente nova.
