# Conversation Hub

## Objetivo

Centralizar respostas vindas de todos os canais.

## Input

Mensagens recebidas de:
- WhatsApp;
- LinkedIn;
- Instagram.

## Processo V1

Classificar:

```text
POSITIVE
NEGATIVE
QUESTION
NOT_NOW
WRONG_CONTACT
ADMINISTRATIVE
OPT_OUT
UNKNOWN
```

## Output

Evento + atualização da Account.

## Regra

Ao receber qualquer resposta:

1. pausar cadência automática da Account;
2. registrar contexto;
3. classificar;
4. decidir se entra em qualificação;
5. liberar próxima ação somente depois da decisão.

## Evolução

V1:
- classificação;
- sugestão/resposta simples.

V2:
- conversa autônoma completa;
- contexto por produto;
- recuperação de objeções.
