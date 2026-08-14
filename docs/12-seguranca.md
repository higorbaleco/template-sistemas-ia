# 12. Segurança

Referência: `CLAUDE.md` regras 4, 6, 8, 9, e §24.

## 1. Autorização por recurso

Toda rota que expõe dado de tenant ou usuário verifica, no lado servidor, que o solicitante tem direito àquele recurso específico, nunca confiando em identificador enviado pelo cliente sem validação (`tenant_id`, `user_id` no payload não é fonte de verdade de autorização, é apenas referência a ser validada contra a sessão real).

Toda rota nova passa pelo `security-auditor` (`.claude/agents/security-auditor.md`) antes de release. O agente não pode aprovar achado bloqueante sozinho; achado bloqueante é decisão do owner.

## 2. Segredos

Fixado em `CLAUDE.md`, regra 6: nenhum segredo em código, log ou arquivo versionado. Apenas variável de ambiente, nunca commitada (ver `.gitignore` do projeto e `.env.example` como referência de forma, nunca de valor real).

Checklist de segredo antes de qualquer commit:

- Chave de API, token, senha, string de conexão: variável de ambiente.
- Log nunca imprime valor de campo sensível (senha, token, dado de cartão, documento de identificação completo). Mascarar ou omitir.
- Arquivo `.env` real nunca é versionado; apenas `.env.example` com chave sem valor.

## 3. Superfície de ataque

- Toda dependência nova exige ADR curto (`CLAUDE.md`, regra 4), o que também serve como ponto de checagem de superfície: dependência nova é superfície nova.
- Rota administrativa ou de alto privilégio fica isolada de rota pública, com autenticação e autorização mais estritas, nunca reaproveitando o mesmo middleware permissivo por conveniência.

## 4. Acoplamento como risco de segurança

Referência: §24. O diagnóstico recorrente em sistema mal construído não é falta de qualidade pontual, é acoplamento: regra de negócio, acesso a dado e apresentação misturados no mesmo lugar. Esse acoplamento é também um risco de segurança, porque torna impossível auditar autorização de forma centralizada. A separação de camada definida em `docs/02-arquitetura.md` é, entre outras coisas, um controle de segurança.

## 5. Release

Antes de todo release para produção:

- `security-auditor` roda sobre rotas novas ou alteradas desde o último release.
- Achado bloqueante impede o release até decisão explícita do owner.
- Checklist de segredo (seção 2) é revisado.

## 6. Projetos com cobrança

Se o projeto processa cobrança, plano ou recorrência, o `finance-validator` (`.claude/agents/finance-validator.md`) valida toda mudança que toca valor monetário antes de merge. Ele não tem permissão para alterar valor em produção; apenas valida.

## 7. O que este documento não cobre

- Migration e schema de banco: `docs/08-banco-de-dados.md`.
- Deploy, ambiente e rollback: `docs/13-deploy-e-ambientes.md`.
