# 14. Checklist pré-projeto

Dez blocos obrigatórios antes da primeira linha de código. O `/kickoff` conduz este checklist; ele para antes de escrever código enquanto qualquer bloco estiver incompleto.

- [ ] **1. Identidade e escopo.** `CLAUDE.md` seções 1 e 2 preenchidas. `docs/00-visao-e-escopo.md` completo, com problema declarado em linguagem de negócio, não em sintoma vago (§17).
- [ ] **2. Métrica de sucesso.** Pelo menos uma métrica objetiva definida em `docs/00-visao-e-escopo.md`, seção 2.
- [ ] **3. Volume real estimado.** `docs/00-visao-e-escopo.md`, seção 4, preenchido com estimativa honesta, não com o melhor cenário imaginado (§20).
- [ ] **4. Stack confirmada.** `docs/01-stack-oficial.md` revisado; se há intenção de desvio, ADR já rascunhado em `docs/adr/` antes de iniciar.
- [ ] **5. Arquitetura e modelo de dados.** `docs/02-arquitetura.md` completo, com camadas e entidades centrais descritas, não apenas a estrutura de pasta copiada sem preenchimento (§2).
- [ ] **6. Ambiente crítico declarado.** `docs/00-visao-e-escopo.md`, seção 6, respondido explicitamente; se crítico, as travas de `docs/05-travas-e-quality-gates.md` foram lidas por quem vai operar o projeto.
- [ ] **7. Agentes do projeto confirmados.** Catálogo de `docs/03-orquestracao-de-agentes.md` revisado; se o projeto precisa de agente adicional (ex.: cobrança, hardware), ele está registrado antes de a terceira ocorrência do mesmo problema forçar a criação tardia (§3).
- [ ] **8. Design system definido.** `docs/07-design-system.md` preenchido, ou explicitamente marcado como "sem UI" quando o projeto não tem camada visual.
- [ ] **9. Observabilidade mínima planejada.** `docs/10-observabilidade.md` revisado; formato de log e correlation id decididos antes do primeiro endpoint, não adicionados depois do primeiro incidente.
- [ ] **10. Repositório e travas instaladas.** `scripts/bootstrap.sh` executado; hooks de `.claude/hooks/` confirmados ativos (`block-push`, `block-main-commit`, `suite-gate`).

Somente com os dez blocos marcados o `/plan` é aceito para gerar a primeira fila de issues.
