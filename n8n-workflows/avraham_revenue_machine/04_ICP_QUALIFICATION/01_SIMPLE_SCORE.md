# Simple ICP Score V1

A V1 pode utilizar pontos simples.

| Critério | Pontos |
|---|---:|
| Segmento prioritário | +30 |
| WhatsApp disponível | +20 |
| Presença digital ativa | +15 |
| Sinais aparentes de demanda | +20 |
| Decisor identificado | +10 |
| Dados incompletos | -10 |
| Evidência de conta inativa | -30 |

Exemplo de regra:

```text
>= 50 → APPROVED
30-49 → REVIEW
<30 → REJECTED
```

Os pesos devem ser configuráveis.

Não tratar esses valores como verdade permanente.
