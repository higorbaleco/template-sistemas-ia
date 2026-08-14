# 11. Testes

Referência: §10.

## 1. Testes como trava, não como formalidade

Um dos sistemas de referência do método opera com 2.200 testes unitários, suíte completa em nove minutos, subindo toda a stack e executando o ciclo real: incluir dado, excluir, incluir de novo, consultar. A descrição usada foi que é como se o sistema estivesse atacando a si mesmo. Nove minutos é o preço de saber, antes de subir, que nada quebrou.

Se a suíte não passa, nada avança até o problema ser resolvido (`CLAUDE.md`, regra 3; `docs/05-travas-e-quality-gates.md`).

## 2. Pirâmide

| Camada | Ferramenta | O que cobre |
|---|---|---|
| Unitário | pytest | `domain/`, lógica pura, sem IO |
| Integração | pytest-asyncio, httpx | `services/`, `repositories/`, banco real ou de teste |
| Contrato de API | httpx contra a aplicação subida | `api/`, request/response real |
| Ponta a ponta (quando aplicável) | conforme stack do frontend | Fluxo crítico completo, cliente incluso |

## 3. Regras

- Toda issue implementada cobre caminho feliz e ao menos um caminho de erro (`CLAUDE.md`, seção 7).
- Teste não é pulado nem deletado para destravar prazo. Se um teste está incorreto, ele é corrigido, não removido silenciosamente; a correção é registrada na issue.
- Mudança de schema (`docs/08-banco-de-dados.md`) exige teste de migration, incluindo o caminho de `downgrade`.
- Fluxo assíncrono (`docs/09-filas-e-workers.md`) tem teste de idempotência: reprocessar o mesmo job não duplica efeito colateral.

## 4. Cobertura

Cobertura numérica isolada não é o critério de qualidade; caminho crítico de negócio sem teste é bloqueante independente do percentual global. O `test-runner` (`.claude/agents/test-runner.md`) interpreta falha e aponta a causa, não apenas reporta o número.

## 5. Desempenho da suíte

A suíte deve permanecer executável em minutos, não em dezenas de minutos, para que rodar antes de cada `/ship` continue sendo viável. Se a suíte começar a ultrapassar esse patamar de forma consistente, isso é sinal de arquitetura de teste a revisar (paralelização, fixture mais leve, isolamento de teste lento em suíte separada), registrado como ADR se envolver mudança estrutural.

## 6. Quando rodar

- Após toda implementação de issue, antes do `code-reviewer`.
- Antes de todo `/ship`.
- Em `/audit-project`, como parte do levantamento de dívida de projeto existente.

## 7. O que este documento não cobre

- Trava mecânica que impede avanço com suíte vermelha: `docs/05-travas-e-quality-gates.md`.
- Ambiente de CI e pipeline: `docs/13-deploy-e-ambientes.md`.
