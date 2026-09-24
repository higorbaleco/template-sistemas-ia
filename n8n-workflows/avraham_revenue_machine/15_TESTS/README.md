# Estratégia de Testes

## Regra

Cada módulo precisa ser testado isoladamente antes de integração.

## Teste 1 — Discovery

Validar:
- quantidade;
- campos;
- duplicidade;
- origem.

## Teste 2 — Account Database

Validar:
- criação;
- update;
- deduplicação;
- histórico.

## Teste 3 — Enrichment

Validar:
- dados corretos;
- campos ausentes;
- origem;
- não sobrescrever dado melhor.

## Teste 4 — ICP

Validar:
- regras;
- classificação;
- explicação.

## Teste 5 — Campaign

Validar:
- agenda;
- sequência;
- parada;
- troca de canal.

## Teste 6 — Channel Worker

Validar:
- envio;
- falha;
- retry;
- resposta;
- opt-out.

## Teste 7 — Conversation Hub

Validar:
- captura;
- classificação;
- pausa da campanha.

## Teste 8 — Qualification

Validar:
- perguntas;
- estado;
- saída.

## Teste 9 — Meeting

Validar:
- disponibilidade;
- criação;
- lembrete;
- no-show.

## Teste 10 — End-to-End

Executar uma Account desde Discovery até WON/LOST.

## Critério de estabilidade inicial

Antes de escalar:
- nenhuma duplicidade grave;
- nenhum envio fora de sequência;
- respostas capturadas;
- eventos auditáveis;
- falhas recuperáveis;
- atribuição de receita funcionando.
