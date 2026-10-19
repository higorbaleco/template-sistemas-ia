# BRIEF: A10 — Agente DevOps

**Versão 1.0** · 2026-10-11 · Status: Pronto para Execução

---

## Papel

**Engenheiro de confiabilidade** da jornada P0. Responsável por CI/CD pipeline, deploy automation, observabilidade, alertas e runbooks. Valida que código passa por gates (lint, build, testes), deploy é seguro e reproducível, e operação é transparente.

**Dono:** A10 (você designa)

---

## Responsabilidades Principais

1. ✅ **CI/CD Pipeline Setup**
   - Desenhar e implementar GitHub Actions workflow (`.github/workflows/main.yml`)
   - Configurar jobs: lint → build → test → coverage → deploy
   - Integrar security scanning (A09 TruffleHog), code quality (ESLint, Prettier)
   - Validar que pipeline roda em < 5 minutos (paralelize jobs)
   - Documentar pipeline em `/docs/ci-cd-pipeline.md`
   - Testar retry logic e failure handling para transientes

2. ✅ **Deploy Automation & Environments**
   - Desenhar deploy stages: staging (automático) → production (manual com approvals)
   - Implementar Docker build e push para registry (ECR, Docker Hub)
   - Criar `docker-compose.yml` para staging/local com PostgreSQL, Redis
   - Implementar database migrations automáticas (Drizzle zero-downtime)
   - Documentar deploy playbook em `/docs/deploy-playbook.md`
   - Validar rollback strategy e disaster recovery

3. ✅ **Infrastructure & Observability Stack**
   - Escolher e configurar observabilidade (Datadog, New Relic, ou self-hosted)
   - Implementar APM, logs centralizados, métricas por org (tenant-aware)
   - Configurar alarmes: latência P95, error rate, database connections
   - Validar que observabilidade não vaza dados de org (QA-019)
   - Documentar observability setup em `/docs/observability-stack.md`
   - Testar que dashboards mostram saúde por tenant

4. ✅ **Runbooks & Alerting**
   - Criar runbooks: `rb-high-error-rate.md`, `rb-database-down.md`, `rb-deploy-rollback.md`
   - Configurar alertas em Slack/PagerDuty com contexto e escalation
   - Implementar health check endpoint (`GET /health`)
   - Testar failover e auto-recovery para componentes críticos
   - Documentar SLA/SLO em `/docs/slos.md`
   - Validar que alerts incluem owner de agente (A03-A07)

5. ✅ **Documentation & Knowledge Transfer**
   - Manter `/docs/ci-cd-pipeline.md` sincronizado com `.github/workflows/*`
   - Documentar secrets rotation, backup restore, capacity planning
   - Criar checklist de pré-deploy em `/docs/pre-deploy-checklist.md`
   - Participar de war room planning com A00 antes de G0/G1
   - Manter runbooks atualizados conforme incidentes

---

## Entrada Crítica

- ✅ Código de A03-A07 pronto para deploy (build passando, testes 100%)
- ✅ Repo GitHub criado e autorizado (PEND-002 resolvido)
- ✅ Hospedagem escolhida (Vercel, AWS ECS, Render, ou self-hosted) — PEND-003
- ✅ M0-M6-ROADMAP.md com issues devops (ci-*, deploy-*, ops-* labels)
- ✅ Stack aprovada (Node.js + Next.js + PostgreSQL + Docker)

---

## Saída Esperada

**M0 (7 dias):**
- GitHub Actions pipeline completo (.github/workflows/main.yml)
- Docker build + push funcionando
- docker-compose.yml para staging com todos componentes
- Database migrations automáticas configuradas
- CI verde em 100% de PRs (lint + build + test)
- 3+ documentos de operação iniciados

**M1 (10 dias):**
- Deploy staging automático em todo merge para main
- Observabilidade ligada (APM, logs, métricas)
- Alertas testados (Slack/email notificando)
- Health check endpoint funcionando
- `/docs/ci-cd-pipeline.md` + `/docs/deploy-playbook.md` prontos

**M2-M6:**
- Deployment cadence: weekly ou on-demand
- Observabilidade por org sem vazamento (QA-019)
- Runbooks validados em simulações (fire drills)
- SLA/SLO documentados e monitorados
- Zero downtime deployments

---

## Fase & Timeline

- **M0:** 3-4 dias (setup + testing)
- **M1-M6:** Contínuo (manutenção + otimização) + 4-5 horas/semana

---

## Gate de Saída

✅ **Pré-M0 Kickoff:**
- [ ] Hospedagem decidida e acesso concedido (PEND-003 resolvido)
- [ ] Repo GitHub criado com secrets (PEND-002 resolvido)
- [ ] Docker registry disponível (ECR, Docker Hub, ou self-hosted)
- [ ] Observability vendor selecionado (ou self-hosted stack decidido)
- [ ] Database backup strategy definida

✅ **Pós-M0 (fim 3-4 dias):**
- [ ] CI pipeline verde em todos PRs (lint + build + test < 5 min)
- [ ] Docker build reproducível e pushando para registry
- [ ] docker-compose.yml roda em local dev com todos componentes
- [ ] Database migrations automáticas (Drizzle) testadas
- [ ] GitHub Actions secrets configurados (vault strategy alinhado com A09)
- [ ] `/docs/ci-cd-pipeline.md` documentado
- [ ] Rollback strategy definido e testado

---

## QAs Associados

- **QA-019:** Observabilidade (logs, métricas, APM) sem conteúdo excessivo — sem PII, sem tenant data exposta

---

## Skills Necessários

1. **GitHub Actions** — Workflow syntax, secrets, artifacts
2. **Docker** — Build, push, compose, multi-stage builds
3. **PostgreSQL ops** — Migrations, backups, replication
4. **Observability tools** — Datadog, New Relic, ou Prometheus/Grafana
5. **Alerting** — Slack integration, PagerDuty, thresholds
6. **Linux/DevOps** — Scripting, debugging, infrastructure

---

## Critério de Aceite

✅ **A10 terminou quando:**
- CI pipeline roda em < 5 minutos, 0 flaky tests
- Deploy staging automático roda em todo merge, sem manual steps
- Observabilidade ligada com dashboards por org (zero vazamento QA-019)
- Alertas funciona em Slack/email com contexto útil
- Health check endpoint responde corretamente
- Rollback pode ser executado < 5 minutos
- Documentação (CI/CD, deploy, ops) sincronizada com infraestrutura
- Nenhum agente fica bloqueado por A10 > 2 horas

---

## Risco & Escalation

| Risco | Severidade | Escalation |
|---|---|---|
| CI pipeline lento (> 10 min) | 🟡 Média | Paralelizar jobs, cachear dependencies |
| Deploy falha em staging | 🔴 Alta | Investigar com A03-A07, rollback automático ativa |
| Observabilidade vaza dados | 🔴 Crítica | **Bloqueia G1** — A09 deve revisar |
| Database migration problema | 🔴 Alta | Rollback manual, backup restore, A04 envolvido |
| Hospedagem não disponível (PEND-003) | 🔴 Alta | Notificar A00 — bloqueia deploy |

---

**Próximo passo:** Escolha observability vendor, crie GitHub Actions workflow base, configure docker-compose.yml, inicie integração com A09 para secrets CI.

**Última atualização:** 2026-10-11 · **Owner:** A10 · **Status:** Pronto para Execução
