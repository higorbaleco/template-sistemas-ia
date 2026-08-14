# 08. Banco de dados

Referência: §22 e §23.

## 1. Topologia padrão

| Componente | Papel |
|---|---|
| Master | Escrita |
| Réplica 1 | Leitura |
| Réplica 2 | Leitura |
| Proxy | Roteia escrita para master, leitura para réplica; permite desligar uma instância sem derrubar o banco |

Referência: §23, a arquitetura de três instâncias PostgreSQL com proxy na frente, um master e duas réplicas, consumo declarado na casa de 8 GB de RAM. O benefício é poder desligar uma máquina e o banco continuar respondendo. O custo de RAM é reconhecido e aceito: "eu gasto isso, só que eu preciso disso". A conta de RAM não é desperdício, é o preço de sobreviver à queda de uma máquina.

Esta topologia é o padrão de referência para qualquer projeto com volume real de produção. Projeto em estágio inicial, sem volume validado, pode operar com instância única mais backup, mas a migração para master/réplica deve estar prevista no ADR quando o volume se aproximar do limite medido (`docs/00-visao-e-escopo.md`, seção 4).

## 2. Critério de escolha de plataforma

Referência: §22. A objeção de segurança que circula sobre plataforma de banco gerenciado não é o problema real; segurança é questão de saber usar. Os três problemas reais a avaliar antes de escolher plataforma:

1. **Latência.** Onde está a aplicação e onde está o banco. Se rodam em regiões diferentes, cada consulta paga a viagem de ida e volta. Imperceptível em banco pequeno, vira gargalo com volume.
2. **Degrau de custo.** O salto do plano gratuito para o primeiro plano pago costuma ser aceitável. O problema é o degrau seguinte: se não existe nível intermediário quando o plano pago inicial satura, a migração forçada custa mais que ter planejado a topologia própria desde o início.
3. **Topologia.** Instância única sem réplica é um risco de disponibilidade, não apenas um limite de performance.

Nenhum desses três é motivo para descartar plataforma gerenciada por padrão. É motivo para medir antes de assumir que ela resolve o projeto até o fim.

## 3. Migrations

Toda mudança de schema passa por migration Alembic versionada e reversível (`CLAUDE.md`, regra 5). Migration sem `downgrade` funcional não é aceita. O agente responsável é o `db-guardian`.

## 4. Índices

- Toda coluna usada em filtro (`WHERE`), junção (`JOIN`) ou ordenação (`ORDER BY`) frequente tem índice correspondente, decidido pelo `db-guardian` no momento da query, não retroativamente.
- Índice composto segue a ordem de seletividade da query real, não a ordem alfabética das colunas.
- Nenhum índice é adicionado sem justificativa de query que o usa; índice não utilizado é custo de escrita sem benefício de leitura.

## 5. Multi-tenant

Se `docs/02-arquitetura.md` define isolamento por `tenant_id`, essa coluna é obrigatória e indexada em toda tabela de domínio, e toda query passa pelo `db-guardian` para confirmar o filtro de tenant antes de chegar a produção. Vazamento de dado entre tenant é tratado como incidente de segurança, não como bug comum (`docs/12-seguranca.md`).

## 6. O que este documento não cobre

- Modelo conceitual de entidade: `docs/02-arquitetura.md`.
- Backup e rollback em produção: `docs/13-deploy-e-ambientes.md`.
