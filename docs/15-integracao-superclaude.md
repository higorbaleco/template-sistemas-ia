# 15. Integração SuperClaude Framework

Registro da decisão de mesclar parte do SuperClaude Framework (instalado globalmente via `npm install -g @bifrost_inc/superclaude`, disponível em `~/.claude/agents/` e `~/.claude/commands/sc/`) a este template, mantendo as travas mecânicas e a doutrina de economia de token como critério de corte.

## Critério de adoção

Um agente ou comando do SuperClaude só entra no catálogo deste template se:

1. Não duplicar um dos 10 agentes ou 8 comandos já existentes (`docs/03-orquestracao-de-agentes.md`, seção 3; `README.md`).
2. For adaptado ao estilo enxuto deste template: system prompt curto, em português, referenciando os documentos existentes, nunca copiado no formato original (que é verboso: seções "Triggers / Behavioral Mindset / Focus Areas / Key Actions / Outputs / Boundaries" em inglês, o que viola `docs/06-economia-de-contexto-e-tokens.md`).
3. Respeitar as travas mecânicas (`.claude/hooks/`); nenhum comando adotado pode induzir bypass de `git push` ou commit na `main`.

## Agentes adotados

| Agente | Origem | Por que entrou | Modelo |
|---|---|---|---|
| `system-architect` | SuperClaude `system-architect` | Decisão de arquitetura de alto nível não tinha agente próprio; complementa `planner` na fase de especificação e `docs/02-arquitetura.md` | Opus |
| `performance-engineer` | SuperClaude `performance-engineer` | É a fonte da métrica de saturação exigida em `docs/01-stack-oficial.md` para justificar desvio de stack; sem medição real não havia quem preenchesse essa lacuna | Sonnet |
| `root-cause-analyst` | SuperClaude `root-cause-analyst` | Complementa `observability-agent`: um instrumenta e recorta, o outro forma e testa hipótese sobre o recorte, sem repetir a leitura de log bruto | Sonnet |
| `devops-architect` | SuperClaude `devops-architect` | `docs/13-deploy-e-ambientes.md` não tinha agente dedicado a pipeline e rollback | Sonnet |

## Comando adotado

| Comando | Origem | Adaptação | Por que |
|---|---|---|---|
| `/paralelizar` | Adaptado de `/sc:spawn` | Reescrito do zero, sem o formato de orquestração autônoma do original. Só analisa dependência entre issues e sugere lotes; nunca executa, nunca abre janela sozinho. | O original produzia hierarquia Epic/Story/Task e linguagem de orquestração automática, incompatível com a doutrina de que o humano decide quando abrir janela nova (`docs/06`, seção 4). A necessidade real (agrupar issues paralelizáveis por dependência de arquivo) foi extraída e reescrita enxuta. |

## Não adotado, e por quê

| Item do SuperClaude | Motivo de não adotar |
|---|---|
| `backend-architect`, `frontend-architect`, `python-expert` | Sobreposição com `executor` já escopado pela stack travada de `CLAUDE.md`, seção 2; adicionar um agente genérico de "escrever bom código" não cobre lacuna real |
| `security-engineer`, `quality-engineer`, `self-review`, `requirements-analyst` | Sobreposição direta com `security-auditor`, `test-runner`, `code-reviewer`, `planner` já existentes |
| `pm-agent` | Arquivo de 22 KB de system prompt; contradiz a doutrina de token de saída enxuto. A função de gestão de fila já é coberta por `docs/04-fluxo-operacional.md` |
| `business-panel-experts`, `deep-research`, `deep-research-agent` | Fora do escopo de engenharia deste template; pertencem a fase de descoberta de negócio, não à orquestração técnica |
| `learning-guide`, `socratic-mentor` | Perfil pedagógico, não de execução de projeto |
| `refactoring-expert`, `technical-writer`, `repo-index` | Utilidade real, mas sem lacuna urgente hoje. Ficam candidatos: se o mesmo tipo de necessidade aparecer pela terceira vez em projeto diferente, entram pelo gatilho normal de criação de agente (`docs/referencia/metodo-transcricao-estruturada.md`, §3) |
| `/sc:brainstorm` | Sobreposição funcional com `/plan`, que já conduz o interrogatório de lacuna sobre a demanda bruta (§16). Duas etapas de descoberta em sequência é o antipadrão de empilhar tarefa (`CLAUDE.md`, seção 5) |
| `/sc:implement`, `/sc:build`, `/sc:test`, `/sc:task`, `/sc:pm` | Concorrem diretamente com `/work-issue` + `test-runner`, que já são o caminho canônico de execução escopada por issue. Usar os dois cria ambiguidade sobre qual comando é a fonte de verdade |
| Demais comandos `/sc:*` (analyze, explain, troubleshoot, improve, cleanup, design, document, estimate, git, help, index, index-repo, load, save, reflect, recommend, select-tool, business-panel, spec-panel, workflow, sc) | Ferramentas de uso pontual, não de fluxo obrigatório. Permanecem disponíveis globalmente via `/sc:*` para uso ad-hoc fora do ciclo formal, mas não entram no catálogo deste template |

## Onde os comandos `/sc:*` continuam disponíveis

A instalação global do SuperClaude não foi removida. Os 30 comandos `/sc:*` e os 20 agentes originais continuam acessíveis em qualquer projeto, inclusive este. Este documento define apenas o que foi promovido ao catálogo oficial do template (`CLAUDE.md`, seção 8), não uma remoção de acesso.
