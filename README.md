# Template de Projeto: operacao assistida por IA

Base documental e operacional para iniciar qualquer projeto de software com governanca definida desde o primeiro commit.

O ativo deste repositorio nao e codigo. E a camada de regras que existe antes de qualquer prompt. Ela e o que determina se a ferramenta multiplica resultado ou multiplica problema.

---

## Como usar

### Projeto novo

```bash
git clone [este-repositorio] meu-projeto
cd meu-projeto
rm -rf .git && git init
bash scripts/bootstrap.sh
```

Depois, dentro do Claude Code:

```
/kickoff
```

O comando conduz o interrogatorio de abertura, preenche o `CLAUDE.md`, produz visao, arquitetura e a primeira fila de issues. Ele para antes de escrever codigo.

### Projeto existente

1. Copiar `CLAUDE.md`, `.claude/` e `docs/` para a raiz do projeto
2. Preencher as secoes 1 e 2 do `CLAUDE.md`
3. Rodar `/audit-project` para levantar a divida existente
4. Tratar os achados bloqueantes antes de abrir novas frentes

---

## Ciclo de trabalho

```
/plan          Opus     demanda bruta vira especificacao e issues
   |
   |  parada humana: aprovacao do plano
   v
/work-issue N  Sonnet   uma issue por janela limpa
   |
   v
test-runner    Sonnet   suite verde obrigatoria
   |
   v
/review        Sonnet   revisao em contexto isolado
   |
   v
/ship                   relatorio e parada humana
   |
   |  autorizacao explicita
   v
merge
```

Comandos auxiliares: `/context-check` a cada sessenta por cento de janela, `/debug-log` para bug intermitente, `/audit-project` semanalmente.

---

## Indice documental

| Documento | Conteudo |
|---|---|
| `CLAUDE.md` | Constituicao do projeto. Lido em toda sessao. |
| `docs/00-visao-e-escopo.md` | Problema, metrica, atores, volume, fora de escopo |
| `docs/01-stack-oficial.md` | Stack travada e criterio de desvio |
| `docs/02-arquitetura.md` | Camadas, rotas, filas, modelo de dados |
| `docs/03-orquestracao-de-agentes.md` | Roteamento de modelo, subagentes, janelas, economia |
| `docs/04-fluxo-operacional.md` | Ciclo completo da demanda ao merge |
| `docs/05-travas-e-quality-gates.md` | Travas mecanicas, suite, revisao, paradas humanas |
| `docs/06-economia-de-contexto-e-tokens.md` | Custo real, antipadroes, expectativa de ganho |
| `docs/07-design-system.md` | Fonte unica de UI, tokens, white label |
| `docs/08-banco-de-dados.md` | Topologia, criterio de plataforma, indices, migrations |
| `docs/09-filas-e-workers.md` | Criterio de enfileiramento, escala, painel, antipadroes |
| `docs/10-observabilidade.md` | Instrumentacao, formato, protocolo de depuracao assistida |
| `docs/11-testes.md` | Piramide, regras, cobertura, desempenho da suite |
| `docs/12-seguranca.md` | Autorizacao por recurso, segredos, superficie, release |
| `docs/13-deploy-e-ambientes.md` | Pipeline, migrations em producao, rollback, backup |
| `docs/14-checklist-pre-projeto.md` | Dez blocos obrigatorios antes da primeira linha |
| `docs/15-integracao-superclaude.md` | Criterio de adocao de agentes/comandos do SuperClaude Framework |

Referencia do metodo: `docs/referencia/metodo-transcricao-estruturada.md`.

---

## Subagentes

| Agente | Funcao | Modelo |
|---|---|---|
| `planner` | Demanda bruta vira especificacao | Opus |
| `executor` | Implementa issue no escopo exato | Sonnet |
| `test-runner` | Roda e interpreta a suite | Sonnet |
| `code-reviewer` | Revisa diff em contexto isolado | Sonnet |
| `db-guardian` | Schema, query, indice, migration | Sonnet |
| `queue-architect` | Processamento assincrono | Sonnet |
| `observability-agent` | Instrumentacao e depuracao | Sonnet |
| `design-keeper` | UI a partir do design system | Sonnet |
| `security-auditor` | Superficie, autorizacao, segredo | Sonnet |
| `finance-validator` | Cobranca e recorrencia | Sonnet |
| `system-architect` | Decisao de arquitetura de alto nivel | Opus |
| `performance-engineer` | Gargalo de performance, metrica de saturacao | Sonnet |
| `root-cause-analyst` | Bug complexo ou intermitente | Sonnet |
| `devops-architect` | Pipeline de deploy e rollback | Sonnet |

Os quatro ultimos vem do SuperClaude Framework, adaptados. Ver `docs/15-integracao-superclaude.md`.

---

## Comandos

Alem do ciclo principal (`/plan`, `/work-issue`, `/review`, `/ship`), `/paralelizar` analisa a fila de issues e agrupa em lotes paralelizaveis vs cadeia sequencial, por dependencia real de arquivo e dado, sem executar nada sozinho.

---

## Os dez principios

1. A camada documental e o produto. Codigo e consequencia.
2. Opus planeja, Sonnet executa. Erro de planejamento se propaga, erro de execucao se corrige.
3. Uma janela por unidade de trabalho. Janela permanente e o antipadrao mais caro.
4. Subagente roda em contexto proprio. Leitura pesada com saida curta sempre vai para subagente.
5. Token de saida e o que custa. Prompt denso nao e prompt prolixo.
6. Trava mecanica vale mais que disciplina. Se pode ser suspensa por pressa, nao e trava.
7. `git push` e parada humana obrigatoria. E o ultimo lugar barato para achar um erro.
8. Suite vermelha bloqueia tudo, inclusive urgencia.
9. Observabilidade antes de depuracao. Instrumentar, deixar rodar, recortar, correlacionar.
10. O multiplicador tem sinal. Sobre fundacao correta multiplica resultado. Sobre deficit tecnico multiplica problema.

---

## Convencoes

Sem emoji em codigo, commit, documento, log ou interface. Sem travessao em texto estruturado. Codigo em ingles, documento em portugues. Commit convencional e imperativo.
