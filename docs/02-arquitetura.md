# 02. Arquitetura

Este documento, junto com o `CLAUDE.md`, é o que permite ao modelo saber o que fazer sem sair codando sem direção. Referência: §2, "ele sabe tudo que ele tem que fazer" só é verdade quando a arquitetura está escrita antes da primeira linha de código.

## 1. Camadas

```
api/            rotas HTTP. Sem regra de negocio.
domain/         regra de negocio pura. Sem IO, sem chamada a banco, sem chamada a rede.
services/       orquestra dominio mais IO. E onde o caso de uso acontece.
repositories/   acesso a banco. Unico lugar que fala SQL ou ORM diretamente.
workers/        consumidores de fila. Processamento assincrono, fora do ciclo de request.
core/           config, log, seguranca, infraestrutura transversal.
schemas/        contrato de entrada e saida (Pydantic).
```

## 2. Direção de dependência

A regra está fixada em `CLAUDE.md`, seção 6: `api` não importa `repositories`. `domain` não importa nada de IO. A direção de dependência é sempre para dentro, em direção ao domínio.

Isso existe por causa de §24: dois clientes procuraram pedindo resgate de sistema construído com IA sem estrutura, e o diagnóstico foi que o problema não era a IA, era que "tem muita coisa junta que deveria estar separada". Acoplamento entre rota, banco e regra de negócio é o padrão de dívida mais caro de desfazer, porque ele se espalha antes de ser percebido. A camada existe para tornar esse tipo de erro mecanicamente difícil, na mesma lógica de `docs/03-orquestracao-de-agentes.md` seção 7: regra forte segura erro de execução, não depende de disciplina.

## 3. Rotas

Convenção de rota: `[PREENCHER]` (ex.: `/api/v1/{recurso}`).

Toda rota nova passa pelo `security-auditor` antes de release (`.claude/agents/security-auditor.md`), porque autorização por recurso é regra de segurança, não detalhe de implementação.

## 4. Modelo de dados

Descrever aqui as entidades centrais do domínio e a relação entre elas. O detalhamento de índice, migration e topologia de banco fica em `docs/08-banco-de-dados.md`; este documento descreve o modelo conceitual.

| Entidade | Descrição | Relações |
|---|---|---|
| `[PREENCHER]` | `[PREENCHER]` | `[PREENCHER]` |

Se o projeto é multi-tenant, a estratégia de isolamento (schema por tenant, coluna `tenant_id` com filtro obrigatório em toda query, ou banco por tenant) é decidida aqui e vira regra no `db-guardian`.

## 5. Processamento assíncrono

Toda operação pesada (enriquecimento de dado, geração de relatório, envio em lote, chamada a API externa lenta) vai para fila, nunca acoplada ao ciclo de request. Regra fixada em `CLAUDE.md`, regra 10. Detalhamento completo em `docs/09-filas-e-workers.md`.

## 6. O que este documento não cobre

- Critério de escolha de tecnologia: `docs/01-stack-oficial.md`.
- Fluxo de trabalho e ciclo de issue: `docs/04-fluxo-operacional.md`.
- Deploy e ambiente: `docs/13-deploy-e-ambientes.md`.

## 7. Ordem de leitura

Este documento é o segundo item na ordem de leitura de sessão nova definida em `CLAUDE.md`, seção 10. Ele deve estar completo e atualizado antes de qualquer `/plan` ser aceito para execução.
