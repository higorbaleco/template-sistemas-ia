# 10. Observabilidade

Referência: §28, §29, §30, §31. Este é o documento que evita repetir o erro mais caro observado no método: mandar o modelo caçar padrão em log bruto.

## 1. O antipadrão e o custo real

Referência: §28. Um caso relatado gastou seis mil dólares em uma noite mandando o modelo ler log bruto de produção procurando padrão, sem resolver o problema. Um caso paralelo, em operação de meio de pagamento de altíssimo volume, repetia o mesmo erro e gastava mil dólares por dia. A analogia usada: mandar procurar padrão em log bruto de volume massivo é mandar procurar uma pessoa específica num palheiro, tarefa que uma família inteira levaria tempo para fazer manualmente.

Isso está fixado como regra inviolável em `CLAUDE.md`, regra 7: nunca ler log bruto de produção dentro da janela principal.

## 2. Formato de log

Todo log é estruturado, em JSON, com correlation id obrigatório em toda linha:

```json
{
  "timestamp": "[ISO 8601]",
  "level": "info | warn | error",
  "event": "[nome do evento, ex: payment.attempt]",
  "correlation_id": "[id da requisicao ou transacao]",
  "tenant_id": "[quando aplicavel]",
  "message": "[descricao curta]",
  "context": { "...": "..." }
}
```

Campo mínimo para um alerta ser acionável: evento, equipamento ou tenant, mensagem e identificador de correlação (§31).

## 3. Instrumentar antes de depurar

Instrumentação não é polimento final de projeto maduro, é pré-requisito para que qualquer diagnóstico de bug intermitente seja possível. Bug que ocorre raramente (§30, aproximadamente uma vez por semana) não se resolve olhando a tela; se resolve com log recortado do período certo.

## 4. Protocolo de depuração assistida

Referência: §29. Este é o protocolo obrigatório, e é o que a regra 7 do `CLAUDE.md` está protegendo:

1. **Instrumentar.** Adicionar log em todo o caminho relevante do fluxo sob investigação, cobrindo decisão e falha, não apenas sucesso.
2. **Deixar rodar.** A aplicação instrumentada roda em produção real por um período suficiente para capturar a ocorrência (um dia, uma semana, conforme a frequência estimada do problema).
3. **Exportar recorte.** Extrair o log do período e do recurso específico relevante (ex.: um equipamento, um tenant, uma janela de tempo), nunca o volume total do sistema.
4. **Entregar com contexto.** Anexar o recorte ao subagente `observability-agent` junto com o resumo do problema que já vinha sendo discutido, não o arquivo sozinho sem referência.

O `observability-agent` (`.claude/agents/observability-agent.md`) não pode ler log bruto sem recorte; seu escopo de leitura é sempre o caminho já instrumentado mais o recorte fornecido.

## 5. Caso de referência: cartão não apresentado

Referência: §30. Bug real diagnosticado por este protocolo: cliente selecionava débito, não apresentava o cartão, ia embora, e o sistema travava. Não havia tratamento para o caso de a transação ser cortada por esgotamento de tempo sem apresentação, e o evento ocorria cerca de uma vez por semana. Recorte de log de um dia específico de um equipamento específico, entregue com contexto, resultou em diagnóstico e correção (mensagem de tempo esgotado, retorno à tela inicial) sem varredura manual.

## 6. Alertas

- Alerta por nível (`error` no mínimo) chega ativamente, sem exigir consulta manual.
- Todo alerta identifica o recurso afetado (equipamento, tenant, rota) e a mensagem, nunca apenas um código genérico.

## 7. O que este documento não cobre

- Painel de fila especificamente: `docs/09-filas-e-workers.md`.
- Deploy, rollback e ambiente: `docs/13-deploy-e-ambientes.md`.
