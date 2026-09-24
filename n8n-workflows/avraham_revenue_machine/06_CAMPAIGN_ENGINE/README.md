# Campaign Engine

## Objetivo

Transformar uma Account aprovada em uma sequência coordenada de ações omnichannel.

## Entidade Campaign

Campos mínimos:

```text
campaign_id
name
product
segment
region
offer
sequence_id
start_date
end_date
status
```

## Entidade Sequence

Define:
- canais;
- ordem;
- delay;
- template;
- condição de parada;
- condição de mudança de canal.

## Exemplo

```text
D0 → LinkedIn conexão
D1 → Instagram interação/DM
D2 → WhatsApp abordagem
D4 → LinkedIn follow-up
D6 → WhatsApp follow-up
D9 → Instagram follow-up
```

Esse exemplo é configurável.

## Regras de parada

Parar cadência quando:
- respondeu;
- pediu remoção;
- reunião foi marcada;
- conta foi bloqueada;
- campanha foi pausada;
- oportunidade foi criada;
- atingiu limite máximo.

## Regra central

O Campaign Engine agenda.

Os Channel Workers executam.
