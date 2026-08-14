# 09. Filas e workers

Referência: §25 e `CLAUDE.md`, regra 10.

## 1. Critério de enfileiramento

Toda operação que não precisa de resposta síncrona imediata vai para fila: enriquecimento de dado, geração de relatório, envio em lote, chamada a API externa lenta, qualquer processamento pesado. Nunca acoplar isso ao ciclo de request.

Referência: §25, o exemplo concreto: pedido de enriquecimento de dado vai para fila, um worker processa, o worker é escalável independente da rota que originou o pedido.

## 2. Escala

Padrão inicial: três workers por fila. Referência: §25.

| Situação | Ação |
|---|---|
| Fila normal | Três workers |
| Fila degradando (crescendo mais rápido que o processamento) | Escalar para cinco, seis, dez ou vinte, conforme a demanda observada no painel |
| Evento grande previsto (ex.: campanha, lançamento) | Escalar antes do evento, não durante |
| Fim do evento | Reduzir de volta ao padrão |

Não escalar preventivamente sem previsão concreta de pico: encarece sem benefício (§25).

## 3. Painel de filas

Todo projeto com fila tem um painel de observação que mostra:

- Todas as filas ativas.
- O que está sendo processado em cada uma.
- Profundidade da fila (quantos itens aguardando).
- Taxa de processamento (itens por minuto).

Referência: §25, cenário concreto: uma consulta que gera cinco mil requisições aparece na fila, e o painel permite verificar se o processamento está degradado e decidir escalar. Sem painel de fila não existe diagnóstico de degradação, existe suposição. Quando o cliente reclama de lentidão, a resposta correta vem do painel, não de inspeção manual de log.

O agente responsável por esta camada é o `queue-architect` (`.claude/agents/queue-architect.md`).

## 4. Antipadrão

Acoplar processamento pesado à rota que recebeu o pedido é o erro mais comum aqui: o request fica esperando o processamento terminar, a experiência do usuário degrada, e não existe visibilidade separada do que está represado. Regra 10 do `CLAUDE.md` existe exatamente para bloquear esse padrão de projeto em diante.

## 5. Retry e idempotência

- Todo job de worker é idempotente: reprocessar o mesmo item não duplica efeito colateral (cobrança dupla, mensagem duplicada, e-mail duplicado).
- Falha de job entra em retry com backoff, até um limite definido por tipo de job; depois do limite, vai para fila de mortos (`dead-letter`) e gera alerta, não desaparece silenciosamente.

## 6. O que este documento não cobre

- Instrumentação e formato de log dentro do worker: `docs/10-observabilidade.md`.
- Modelo de dados da fila em si (se persistida): `docs/08-banco-de-dados.md`.
