# 05. Travas e quality gates

Referência: §5, §6, §10, §15, §28-29 e o princípio "trava mecânica vale mais que disciplina" (README, princípio 6).

## 1. Por que trava mecânica, não disciplina

Disciplina se rompe sob prazo. Uma regra que pode ser suspensa por pressa não é trava, é sugestão. As travas abaixo são implementadas como hook (`.claude/hooks/`), não como item de checklist que depende de lembrança.

## 2. As três travas mecânicas

| Trava | Implementação | O que bloqueia |
|---|---|---|
| Sem commit direto na `main` | `.claude/hooks/block-main-commit` | Qualquer commit fora de branch `feat/`, `fix/`, `chore/`, `refactor/` |
| `git push` é parada humana | `.claude/hooks/block-push` | Push automático sem apresentação de resumo e autorização explícita |
| Suíte vermelha bloqueia a fila | `.claude/hooks/suite-gate` | Avanço de qualquer issue nova enquanto a suíte não está verde |

Detalhamento técnico de cada hook: `.claude/hooks/`.

## 3. Git push como o último lugar barato

Referência: §5. Quando o fluxo chega no `git push`, significa que o trabalho está pronto para o servidor. Esse é o último ponto em que um erro custa uma revisão de cinco minutos em vez de um incidente em produção. O valor da trava não é impedir o modelo, é impedir o próprio owner de pular a inspeção sob pressão de prazo.

## 4. Revisão em contexto isolado

O `code-reviewer` roda sempre em subagente isolado, nunca na janela que executou a implementação (`docs/03-orquestracao-de-agentes.md`, seção 1). Cada achado é numerado e precisa ser confirmado no código antes de virar correção. Achado não confirmado é descartado com justificativa registrada, nunca aceito por confiança (§6).

## 5. Suíte como trava real, não checklist

Referência: §10. Suíte vermelha bloqueia toda a fila de trabalho, inclusive tarefa marcada como urgente. Não existe exceção por prioridade de negócio. Critério de desempenho e cobertura da suíte: `docs/11-testes.md`.

## 6. Regra dos três ciclos como trava de tempo

Referência: §15 e §28. Se o mesmo problema sobreviveu a três tentativas no modelo de execução, a janela para. Não se tenta uma quarta vez igual. As opções são: escalar para modelo de maior capacidade com acesso direto ao ambiente, mudar a estratégia de diagnóstico, ou abrir issue e sair da janela. O caso de referência negativa são as 33 tentativas no mesmo caminho antes do escalonamento (§15); o caso de referência do custo de ignorar essa regra é o gasto de seis mil dólares em uma noite tentando resolver via leitura de log bruto sem recorte (§28).

## 7. Definição de pronto

A lista completa de condição de pronto está em `CLAUDE.md`, seção 7, e é a mesma para toda issue, sem exceção de tamanho ou urgência. Nenhum dos itens dessa lista é opcional para issue considerada concluída.

## 8. Paradas humanas no ciclo

| Ponto | O que exige do owner |
|---|---|
| Fim do `/plan` | Aprovação explícita do plano antes de abrir a fila de issues |
| `git push` | Leitura do relatório do `/ship` e autorização explícita |
| Desvio de stack | Aprovação de ADR (`docs/01-stack-oficial.md`) |
| Achado de segurança bloqueante | Decisão do owner antes de release (`docs/12-seguranca.md`) |
