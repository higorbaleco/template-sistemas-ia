# Cadence Logic

## Objetivo

Evitar três canais trabalhando de forma descoordenada.

## Estado por conta

A Account precisa saber:

```text
current_sequence_step
next_action_at
last_channel
last_contact_at
has_replied
stop_reason
```

## Fluxo

```text
Account entra na Sequence
↓
Passo 1 agendado
↓
Channel Worker executa
↓
Resultado registrado
↓
Campaign Engine avalia condição
↓
Agenda próximo passo OU encerra
```

## Regras

1. Uma resposta em qualquer canal pausa os demais passos.
2. Opt-out em qualquer canal bloqueia futuras tentativas conforme regra aplicável.
3. Mensagem não entregue pode gerar troca de canal.
4. Canal indisponível deve ser pulado sem quebrar a sequence.
5. Cadência deve ser configurável por produto e ICP.
