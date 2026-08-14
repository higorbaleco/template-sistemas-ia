# 01. Stack oficial

A stack travada vive em `CLAUDE.md`, seção 2. Este documento explica o critério por trás dela e como propor um desvio. Referência: §20.

## 1. A stack

| Camada | Tecnologia |
|---|---|
| Backend | Python 3.12 (FastAPI) |
| Banco | PostgreSQL 16 (produção); SQLite permitido em teste local e desenvolvimento offline |
| Cache e fila | Redis 7 |
| Frontend | Next.js 15 (App Router), TypeScript |
| UI | Tailwind mais design system próprio |
| ORM | SQLAlchemy 2.x mais Alembic |
| Testes | pytest, pytest-asyncio, httpx |
| Observabilidade | Log estruturado JSON mais correlation id |
| Deploy | Docker mais docker compose |

Esta é a fonte da verdade. Se este documento e o `CLAUDE.md` divergirem, `CLAUDE.md` vence e este documento está desatualizado.

## 2. Por que uma stack única

Padronizar não é preferência estética. É reduzir o custo de decisão em cada projeto novo e reduzir a superfície de manutenção do template inteiro. Todo agente do catálogo em `docs/03-orquestracao-de-agentes.md` foi desenhado para esta stack. Trocar a stack por projeto significa reescrever o conhecimento de cada agente.

## 3. Critério de desvio

Existem cenários em que outra tecnologia é objetivamente melhor. Isso é reconhecido, não negado. A regra não é "nunca trocar", é "nunca trocar sem métrica".

**A escolha é feita pelo volume real medido, não pelo volume imaginado.** Referência: §20, exemplo do sistema que processa cerca de mil pedidos por dia com duas instâncias de backend e ainda sobra capacidade. Não há justificativa para trocar de linguagem nesse patamar. O caso citado como referência de quando a troca se justifica é o do Uber, que migrou de Python para Go diante de volume que a stack não suportava mais, comprovado por métrica de saturação, não por preferência.

Um desvio de stack exige:

1. Métrica de saturação documentada em `docs/10-observabilidade.md` (latência p95/p99, uso de CPU/memória sob carga real, taxa de erro sob concorrência).
2. ADR em `docs/adr/`, seguindo `docs/adr/0000-template-adr.md`, explicando o que satura, em que volume, e por que a stack oficial não resolve com otimização mais barata (índice, cache, escala horizontal de worker).
3. Aprovação explícita do owner técnico.

Sem os três itens, a resposta correta a um pedido de troca de stack é recusar e apontar esta seção.

## 4. O que não é motivo de desvio

- "Essa linguagem é mais rápida" sem número de saturação real do projeto.
- Preferência pessoal do executor do momento.
- Tendência de mercado ou hype de framework novo.
- Projeto pequeno que "pode ser diferente porque é simples". Projeto simples é exatamente onde a stack padrão paga o dividendo maior, porque o custo de setup e decisão cai a zero.
