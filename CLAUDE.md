# CLAUDE.md

Constituicao operacional deste projeto. Este arquivo e lido em toda sessao. Ele tem precedencia sobre qualquer instrucao dada em prompt isolado, exceto ordem explicita do owner que contradiga uma regra e cite o item que esta sendo suspenso.

Se uma instrucao de prompt conflitar com este documento, a resposta correta e recusar e citar a regra.

---

## 1. Identidade do projeto

| Campo | Valor |
|---|---|
| Nome | `[PREENCHER]` |
| Owner tecnico | `[PREENCHER]` |
| Cliente | `[PREENCHER]` |
| Tipo | `SaaS multi-tenant` / `sistema interno` / `integracao` / `automacao` |
| Ambiente critico | `sim` / `nao` |
| Data de inicio | `[PREENCHER]` |

Descricao em uma frase do que o sistema faz, escrita em linguagem de negocio, nao de codigo:

`[PREENCHER]`

Fora de escopo declarado (o que o sistema explicitamente nao faz):

`[PREENCHER]`

---

## 2. Stack travada

Nao existe negociacao de stack dentro do ciclo de execucao. Mudanca de stack exige ADR aprovado em `docs/adr/`.

| Camada | Tecnologia | Observacao |
|---|---|---|
| Backend | Python 3.12 (FastAPI) | Padrao unico. Async por default. |
| Banco | PostgreSQL 16 | Master mais replicas. Ver `docs/08-banco-de-dados.md`. |
| Cache e fila | Redis 7 | Fila com worker pool escalavel. |
| Frontend | Next.js 15 (App Router), TypeScript | Server Components por default. |
| UI | Tailwind mais design system proprio | Ver `docs/07-design-system.md`. |
| ORM | SQLAlchemy 2.x mais Alembic | Migration versionada obrigatoria. |
| Testes | pytest, pytest-asyncio, httpx | Suite bloqueante. |
| Observabilidade | Log estruturado JSON mais correlation id | Ver `docs/10-observabilidade.md`. |
| Deploy | Docker mais docker compose | VPS na mesma regiao do banco. |
| Versionamento | Git mais GitHub Issues | Uma issue por unidade de trabalho. |

Regra de decisao de tecnologia: a escolha e feita pelo volume real medido, nao pelo volume imaginado. Trocar de linguagem por performance so entra em pauta quando existe metrica de saturacao documentada em `docs/10-observabilidade.md`.

---

## 3. Roteamento de modelo

| Fase | Modelo | Justificativa |
|---|---|---|
| Descoberta e especificacao | Opus | Ambiguidade alta, custo de erro alto. |
| Planejamento e arquitetura | Opus | Decisao estrutural, nao reversivel barato. |
| Quebra em issues | Opus | Define o contrato que o executor vai seguir. |
| Execucao de codigo | Sonnet | Contrato ja fechado, tarefa determinada. |
| Revisao de codigo | Sonnet em subagente isolado | Contexto proprio, custo baixo. |
| Testes e correcao de falha | Sonnet | Ciclo curto e repetitivo. |
| Depuracao que ja falhou mais de tres vezes | Escalar para Opus ou modelo de maior capacidade com acesso direto ao ambiente | Insistir no mesmo caminho e o desperdicio, nao a troca. |
| Documentacao e ADR | Opus | Documento e ativo permanente. |

Regra de escalonamento: se o mesmo problema sobreviveu a tres ciclos de tentativa no modelo de execucao, para. Nao tenta uma quarta vez igual. Escala de modelo, ou muda de estrategia de diagnostico, ou abre issue e sai da janela.

---

## 4. Regras invioláveis

Estas regras existem para segurar erro do executor e tambem erro do owner. Elas nao sao suspensas por pressa.

1. Nunca commitar direto na branch `main`. Toda alteracao passa por branch `feat/`, `fix/`, `chore/` ou `refactor/`.
2. Nunca executar `git push` sem parada humana. `git push` e ponto de stop obrigatorio. Ao chegar nele, apresentar o resumo do que foi feito e aguardar validacao.
3. Nunca seguir adiante com suite de teste vermelha. Falha de teste bloqueia toda a fila de trabalho ate ser resolvida.
4. Nunca instalar dependencia nova sem registrar ADR curto em `docs/adr/`.
5. Nunca alterar schema de banco sem migration Alembic versionada e reversivel.
6. Nunca gravar segredo em codigo, em log ou em arquivo versionado. Somente variavel de ambiente.
7. Nunca ler log bruto de producao dentro da janela principal. Ver protocolo em `docs/10-observabilidade.md`, secao 4.
8. Nunca criar arquivo fora da estrutura declarada na secao 6 sem justificar.
9. Nunca duplicar componente de UI. Se o componente nao existe no design system, ele e criado no design system primeiro.
10. Nunca acoplar processamento pesado ao ciclo de request. Vai para fila. Ver `docs/09-filas-e-workers.md`.

---

## 5. Protocolo de comunicacao com o modelo

O custo de operacao e dominado por token de saida. Prompt tecnico demais induz resposta longa demais, e resposta longa e o que queima orcamento. Portanto:

**Regras de saida do modelo**
- Responder com o resultado, nao com narracao do processo.
- Nao repetir o codigo que ja foi mostrado no arquivo.
- Nao produzir resumo do que acabou de ser dito.
- Diff e nome de arquivo bastam. Explicacao apenas quando houver decisao nao obvia.
- Ao concluir tarefa, entregar: arquivos tocados, decisao tomada, risco aberto. Nada alem disso.

**Regras de entrada do owner**
- Uma tarefa por comando. Nao empilhar cinco pedidos em uma mensagem.
- Especificar o alvo (arquivo, modulo, endpoint), nao o sintoma vago.
- Anexar o recorte relevante, nao a base inteira.
- Se a demanda tem mais de tres partes, ela e um plano, nao uma tarefa. Vai para `/plan`.

---

## 6. Estrutura de pastas

```
.
├── CLAUDE.md
├── .claude/
│   ├── settings.json
│   ├── agents/          # subagentes com contexto isolado
│   ├── commands/        # comandos de fluxo
│   └── hooks/           # travas mecanicas
├── docs/                # base documental do projeto
│   ├── adr/             # decisoes de arquitetura
│   └── specs/           # especificacao por feature
├── backend/
│   ├── app/
│   │   ├── api/         # rotas, sem regra de negocio
│   │   ├── domain/      # regra de negocio pura, sem IO
│   │   ├── services/    # orquestracao de dominio mais IO
│   │   ├── repositories/# acesso a banco
│   │   ├── workers/     # consumidores de fila
│   │   ├── core/        # config, log, seguranca
│   │   └── schemas/     # pydantic in e out
│   ├── migrations/
│   └── tests/
├── frontend/
│   ├── app/
│   ├── components/
│   │   ├── ui/          # design system, fonte unica
│   │   └── features/
│   └── lib/
├── infra/
│   ├── docker/
│   └── compose/
├── scripts/
└── templates/
```

Regra de camada: `api` nao importa `repositories`. `domain` nao importa nada de IO. A direcao de dependencia e sempre para dentro.

---

## 7. Definicao de pronto

Uma tarefa so esta pronta quando todos os itens abaixo sao verdadeiros:

- [ ] Codigo implementado no escopo exato da issue, sem extras nao pedidos
- [ ] Migration criada e reversivel, se houve mudanca de schema
- [ ] Teste unitario cobrindo caminho feliz e ao menos um caminho de erro
- [ ] Suite completa verde
- [ ] Log estruturado adicionado nos pontos de decisao e de falha
- [ ] Componente de UI vindo do design system, sem estilo inline improvisado
- [ ] Revisao de codigo executada pelo subagente `code-reviewer`
- [ ] Achados da revisao confirmados no codigo, nao aceitos por confianca
- [ ] Nenhum segredo exposto
- [ ] Issue atualizada com o que mudou e o que ficou aberto

---

## 8. Agentes disponiveis

| Agente | Quando invocar | Modelo |
|---|---|---|
| `planner` | Antes de escrever qualquer linha de codigo | Opus |
| `executor` | Implementacao de issue ja especificada | Sonnet |
| `code-reviewer` | Antes de todo push | Sonnet |
| `test-runner` | Apos implementacao e antes do review | Sonnet |
| `db-guardian` | Toda mudanca de schema, query ou indice | Sonnet |
| `queue-architect` | Toda tarefa que envolve processamento assincrono | Sonnet |
| `observability-agent` | Instrumentacao e analise de log | Sonnet |
| `design-keeper` | Toda tarefa de UI | Sonnet |
| `security-auditor` | Antes de release e em toda rota nova exposta | Sonnet |
| `finance-validator` | Projetos com cobranca, plano ou recorrencia | Sonnet |
| `system-architect` | Decisao de arquitetura de alto nivel, antes de mudanca estrutural cara de reverter | Opus |
| `performance-engineer` | Gargalo de performance ou metrica de saturacao para justificar desvio de stack | Sonnet |
| `root-cause-analyst` | Bug complexo ou intermitente, em conjunto com observability-agent | Sonnet |
| `devops-architect` | Definir ou revisar pipeline de deploy e estrategia de rollback | Sonnet |

Os quatro ultimos vieram do SuperClaude Framework, adaptados ao padrao deste template. Criterio de adocao e lista do que nao entrou: `docs/15-integracao-superclaude.md`.

Detalhamento em `.claude/agents/`.

---

## 9. Convencoes de escrita

- Sem emoji em codigo, commit, documento, log ou interface.
- Sem travessao em texto estruturado.
- Commit em portugues, imperativo, prefixo convencional: `feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`.
- Nome de variavel, funcao, tabela e coluna em ingles. Comentario e documento em portugues.
- Toda funcao publica com docstring de uma linha declarando contrato, nao implementacao.

---

## 10. Ordem de leitura para uma sessao nova

1. Este arquivo
2. `docs/02-arquitetura.md`
3. `docs/01-stack-oficial.md`
4. A issue especifica que sera trabalhada

Nao carregar mais que isso na abertura. Contexto extra e carregado sob demanda pelo subagente responsavel.
