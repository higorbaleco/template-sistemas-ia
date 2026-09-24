# Princípios de Arquitetura

## 1. Modularidade

Todo fluxo precisa ter:
- input;
- processamento;
- output;
- log;
- status;
- retry;
- erro controlado.

## 2. Account First

A empresa é a entidade principal.

Nunca criar três leads independentes para a mesma empresa apenas porque ela apareceu no LinkedIn, Instagram e WhatsApp.

## 3. Idempotência

Executar o mesmo fluxo duas vezes não pode gerar:
- mensagens duplicadas;
- contatos duplicados;
- reuniões duplicadas;
- registros conflitantes.

## 4. Observabilidade

Todo bloco deve registrar:
- data/hora;
- account_id;
- campaign_id;
- ação;
- resultado;
- erro;
- próxima ação.

## 5. Sem dependência circular

Fluxos devem operar em esteira:

```text
A → B → C → D
```

Nunca:

```text
A → B → C → A
```

## 6. Configuração acima de duplicação

Produtos diferentes devem reutilizar o mesmo motor.

O que muda:
- ICP;
- oferta;
- copy;
- perguntas;
- CTA;
- regras;
- cadência.

## 7. Humano como exceção de alto valor

A máquina deve fazer o trabalho repetitivo.

Higor entra em:
- reunião qualificada;
- diagnóstico consultivo;
- negociação;
- proposta complexa;
- fechamento;
- relacionamento estratégico.

## 8. Compliance operacional

Todo canal deve possuir:
- lista de bloqueio;
- opt-out;
- controle de frequência;
- limites operacionais;
- prevenção de mensagens repetidas;
- rastreamento de origem do contato.
