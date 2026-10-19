# BRIEF: A09 — Agente Segurança

**Versão 1.0** · 2026-10-11 · Status: Pronto para Execução

---

## Papel

**Guardião de segurança** da jornada P0. Responsável por vulnerabilidades, secrets management, RBAC, tenant isolation, compliance e auditoria. Valida que nenhum segredo vaza para client, logs ficam redatados, e guards bloqueiam cross-org.

**Dono:** A09 (você designa)

---

## Responsabilidades Principais

1. ✅ **Auditoria de Segurança & Vulnerabilidades**
   - Revisar código de A03-A07 contra OWASP Top 10 P0
   - Identificar pontos críticos de autenticação, autorização e isolamento
   - Executar secrets scanning (TruffleHog ou equivalente) em cada PR
   - Documentar achados em ADRs de segurança; bloquear P0

2. ✅ **Secrets Management & Vault**
   - Desenhar vault strategy (ambiente, CI/CD, local dev)
   - Validar que env vars nunca estão em .env commitado
   - Implementar vault docs em `/docs/vault-setup.md`
   - Testar que API_KEY, DB_PASSWORD, JWT_SECRET não aparecem em logs ou network
   - Validar rotação de segredos para produção

3. ✅ **RBAC & Tenant Guards**
   - Revisar tenant guards em A03-A07 (validação de `req.org`)
   - Testar cross-org isolation: usuário de org A não lê org B
   - Validar que mutations verificam `org_id` antes de alterar
   - Documentar RBAC matriz em `/docs/rbac-matrix.md`
   - Bloquear PRs que adicionam rota sem guard

4. ✅ **Compliance & Audit Logging**
   - Validar audit logs redatados (sem PII, credenciais, transcrição)
   - Implementar estrutura de log em `/docs/audit-log-schema.md`
   - Testar que `QA-009` passa (audit sem segredo)
   - Configurar retenção de logs conforme regulação (LGPD, GDPR)
   - Documentar compliance checklist em `/docs/compliance.md`

5. ✅ **Security Gates & Threat Modeling**
   - Validar G0 (zero segredo em client, CI scanning ativo)
   - Validar G1 (tenant guards funcionam, audit logging pronto)
   - Validar G5 (threat model revisado, mitigações documentadas)
   - Manter SECURITY-ADRs.md atualizado com decisões de risco
   - Participar de code review de A00 quando arquitetura muda

---

## Entrada Crítica

- ✅ Código de A03-A07 pronto para security review
- ✅ Critérios de segurança em `09-QUALIDADE.md` (P0/P1/P2 definidos)
- ✅ Stack aprovada com tecnologias de segurança (Next.js, Node.js, PostgreSQL, Drizzle)
- ✅ M0-M6-ROADMAP.md com issues de segurança (security-* labels)
- ✅ Acesso a repos A03-A07 para scanning

---

## Saída Esperada

**M0 (7 dias):**
- Security audit report de stack
- Vault setup docs completo
- RBAC matrix documentado
- Secrets scanning integrado em CI
- 3+ security ADRs congelados

**M1 (10 dias):**
- Tenant guards validados em QA-002
- Audit logging sem segredo em QA-009
- CI scanning verde (zero P0 aberto)
- `/docs/security-checklist.md` pronto

**M2-M6:**
- Zero bloqueadores de segurança em PRs
- Threat model atualizado a cada marco
- Compliance checklist sincronizado
- Alertas de secrets scanning monitorados

---

## Fase & Timeline

- **M0:** 7 dias (setup + audit inicial)
- **M1-M6:** Contínuo (code review + compliance) + 2-3 horas/semana

---

## Gate de Saída

✅ **Pré-M0 Kickoff:**
- [ ] Stack aprovada para segurança (autenticação, rate limit, TLS)
- [ ] Acesso concedido aos repos de A03-A07
- [ ] OWASP P0 criteria definido em `09-QUALIDADE.md`
- [ ] Vault strategy escolhida (Doppler, HashiCorp, ou env staging)
- [ ] Secrets scanning tool selecionado (TruffleHog)

✅ **Pós-M0 (fim 7 dias):**
- [ ] Zero segredo em client (auditor + coverage report)
- [ ] Logs redigidos de PII, credenciais, sensitive data
- [ ] Tenant guards implementados em A03-A04 com testes
- [ ] `/docs/vault-setup.md` + `/docs/rbac-matrix.md` + `/docs/compliance.md` prontos
- [ ] CI scanning roda em todo PR (TruffleHog ou equivalente)
- [ ] SECURITY-ADRs.md com 5+ decisões congeladas
- [ ] Zero achados OWASP P0 em audit inicial

---

## QAs Associados

- **QA-002:** RBAC guards validam `org_id` em mutations; cross-org isolation passa
- **QA-009:** Audit logs redatados — sem PII, sem credenciais, sem transcrição integral
- **NFR-002:** Segredos residem server-only; client nunca vê API keys

---

## Skills Necessários

1. **`security-review`** — Code review de vulnerabilidades
2. **OWASP Top 10** — P0 threat identification
3. **Secrets scanning** — TruffleHog, detect-secrets
4. **Threat modeling** — STRIDE ou similar
5. **Compliance frameworks** — LGPD, GDPR basics
6. **Vault/secrets management** — Doppler, HashiCorp, ou env-based

---

## Critério de Aceite

✅ **A09 terminou quando:**
- Nenhum P0 (OWASP) aberto em código de A03-A07
- Tenant guards bloqueiam cross-org access em 100% de testes
- Secrets scanning cobre 100% de PRs com zero false negatives
- Audit logging redigido em QA-009 ✅
- Documentação de segurança (vault, RBAC, compliance) sincronizada com código
- G0, G1, G5 passam checklist de segurança
- Nenhum agente fica bloqueado por A09 > 4 horas

---

## Risco & Escalation

| Risco | Severidade | Escalation |
|---|---|---|
| Vazamento de segredo em CI | 🔴 Crítica | **Bloqueia G0/G1/G5** — interromper deploy |
| P0 aberto em código | 🔴 Crítica | Notificar A00 — não avança de fase |
| Tenant guard falha | 🔴 Crítica | Bloqueia PR até fix; testar cross-org |
| Compliance requirement mudança | 🟡 Média | Atualizar `/docs/compliance.md`, executar audit novo |
| Secrets scanning false positive | 🟡 Média | Documentar em SECURITY-ADRs.md, ignorar com justificativa |

---

**Próximo passo:** Leia `09-QUALIDADE.md` + OWASP, escolha vault strategy, configure secrets scanning em CI, inicie security audit de A03-A07.

**Última atualização:** 2026-10-11 · **Owner:** A09 · **Status:** Pronto para Execução
