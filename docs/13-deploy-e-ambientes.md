# 13. Deploy e ambientes

Referência: `CLAUDE.md` seção 2 (stack travada, Docker mais docker compose), §22-23 (topologia de banco e latência), §32 (manutenção de fork próprio).

## 1. Ambientes

| Ambiente | Propósito | Deploy |
|---|---|---|
| Local | Desenvolvimento e execução da suíte | `docker compose up` |
| Staging | Validação antes de produção, com dado próximo do real | `[PREENCHER]` |
| Produção | Ambiente crítico, dado real de cliente | `[PREENCHER]` |

## 2. Pipeline

1. `/ship` gera o relatório e aguarda autorização humana (`docs/05-travas-e-quality-gates.md`).
2. Após autorização, merge na `main`.
3. Build da imagem Docker.
4. Deploy em staging primeiro, exceto quando o projeto ainda não tem staging configurado, situação que deve estar declarada como risco aberto em `docs/00-visao-e-escopo.md`.
5. Validação em staging.
6. Deploy em produção.

## 3. Localidade de infraestrutura

Referência: §22. A VPS de aplicação fica na mesma região do banco de dados. Isso não é detalhe de custo, é decisão de latência: consulta que atravessa continente entre aplicação e banco é imperceptível em volume baixo e vira gargalo em volume real. Toda decisão de provedor ou região nova confirma isso antes de ser adotada.

## 4. Migrations em produção

- Toda migration roda antes do deploy da aplicação que depende dela, nunca depois.
- Migration destrutiva (`DROP COLUMN`, `DROP TABLE`) só roda depois de um ciclo de deploy em que a aplicação já não depende mais da coluna ou tabela, para permitir rollback sem perda de dado.
- Migration sempre tem `downgrade` funcional testado (`docs/08-banco-de-dados.md`, `docs/11-testes.md`).

## 5. Rollback

- Rollback de aplicação: reverter para a imagem Docker anterior, mantida disponível por um período mínimo definido pelo projeto.
- Rollback de banco: aplicado apenas via `downgrade` de migration testado, nunca via edição manual de schema em produção.
- Todo rollback é registrado, com a causa, na issue ou no ADR correspondente.

## 6. Backup

| Item | Frequência | Retenção |
|---|---|---|
| Banco | `[PREENCHER]` | `[PREENCHER]` |
| Arquivo/storage | `[PREENCHER]` | `[PREENCHER]` |

Backup sem teste de restauração periódico não é backup confiável; o teste de restauração é parte do checklist de `/audit-project`.

## 7. Manutenção de dependência externa crítica (fork)

Referência: §32. Quando uma dependência externa crítica (ex.: biblioteca de integração) tem bug que trava a operação e o projeto upstream não corrige em tempo hábil, manter um fork próprio com a correção é uma decisão válida, registrada como ADR. Ao corrigir, verificar se já existe issue ou proposta de correção no repositório público antes de escrever do zero, e mesclar a melhor abordagem disponível em vez de descartar contribuição externa por completo.

## 8. O que este documento não cobre

- Formato e instrumentação de log: `docs/10-observabilidade.md`.
- Critério de autorização e segredo: `docs/12-seguranca.md`.
