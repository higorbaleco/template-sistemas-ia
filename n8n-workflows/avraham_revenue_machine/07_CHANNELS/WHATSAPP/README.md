# WhatsApp Worker

## Papel

Principal canal comercial da máquina.

## Responsabilidades

- receber tarefa;
- validar número;
- validar bloqueios;
- montar mensagem;
- enviar;
- registrar id externo;
- registrar status;
- capturar respostas;
- encaminhar respostas ao Conversation Hub.

## Não é responsabilidade

- decidir ICP;
- decidir produto;
- decidir se lead é qualificado;
- agendar outros canais.

## Estados

```text
READY
SENT
DELIVERED
READ
REPLIED
FAILED
OPTED_OUT
```

## Métricas

- enviados;
- entregues;
- falhas;
- respostas;
- respostas positivas;
- tempo até resposta.
