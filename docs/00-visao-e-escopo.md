# 00. Visão e escopo

Este documento é o primeiro a ser preenchido em um projeto novo, dentro do `/kickoff`. Ele existe porque nenhuma linha de código deve ser escrita antes de o problema estar declarado sem ambiguidade. Ver `docs/referencia/metodo-transcricao-estruturada.md`, §2 e §17.

## 1. Problema

Descrição do problema real que o sistema resolve, em linguagem de negócio:

`[PREENCHER]`

Sintoma vago não é problema. "Quero um sistema para X" não é problema, é intenção. O `planner` deve recusar avançar enquanto esta seção não descrever a dor concreta, com exemplo real. Referência: §17, o caso de quem pede apenas "quero almoçar" sem especificar nada e depois se frustra com o resultado.

## 2. Métrica de sucesso

Como se mede se o sistema está funcionando:

| Métrica | Valor alvo | Como medir |
|---|---|---|
| `[PREENCHER]` | `[PREENCHER]` | `[PREENCHER]` |

Sem métrica declarada aqui, não existe critério objetivo de "pronto" no nível de produto, só no nível de tarefa (`CLAUDE.md` seção 7).

## 3. Atores

| Ator | Papel | O que ele faz no sistema |
|---|---|---|
| `[PREENCHER]` | `[PREENCHER]` | `[PREENCHER]` |

## 4. Volume esperado

Estimativa de volume real no primeiro trimestre de operação, não o volume imaginado no melhor cenário:

- Requisições ou transações por dia: `[PREENCHER]`
- Usuários ou tenants ativos: `[PREENCHER]`
- Pico esperado: `[PREENCHER]`

Este número alimenta `docs/01-stack-oficial.md` e `docs/08-banco-de-dados.md`. A decisão de topologia e a decisão de escala de fila são derivadas daqui, não de suposição. Referência: §20, o exemplo de mil e poucos pedidos por dia rodando em duas instâncias com sobra de capacidade, e a citação do caso Uber como o patamar em que trocar de stack passaria a fazer sentido.

## 5. Fora de escopo

O que o sistema explicitamente não faz, para evitar que a fila de issues absorva demanda que não pertence a este projeto:

`[PREENCHER]`

## 6. Ambiente crítico

Se este projeto processa dinheiro, dado pessoal sensível ou está em caminho de produção com cliente pagante, ele é ambiente crítico e as travas de `docs/05-travas-e-quality-gates.md` não são negociáveis em nenhuma hipótese, nem sob prazo.

`[PREENCHER: sim / não, e por quê]`
