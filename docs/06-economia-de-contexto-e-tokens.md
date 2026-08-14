# 06. Economia de contexto e tokens

Referência: §4, §13, §17, §19, §28-29. Este documento é a explicação econômica por trás da regra de saída definida em `CLAUDE.md`, seção 5.

## 1. O custo é dominado por token de saída

Não é o tamanho do prompt de entrada que queima orçamento, é o tamanho da resposta. Referência: §13, o caso Juliano. Dois meses de investigação levaram à conclusão de que prompts extremamente detalhados induzem o modelo a responder no mesmo registro, e a resposta longa é o que custa. A correção aplicada foi cortar trechos dos prompts, não reduzir a capacidade da tarefa.

**Prompt denso não é prompt prolixo.** Especificar o alvo (arquivo, módulo, endpoint) e o critério de aceite é denso e barato. Descrever a enciclopédia do domínio antes de pedir a tarefa é prolixo e caro, porque induz resposta igualmente prolixa.

## 2. Janela isolada é a alavanca mais barata

Referência: §4, o número concreto observado: a janela principal consumiu 29% do contexto executando implementação, enquanto o subagente de revisão, isolado, consumiu 1% para revisar o mesmo trabalho. A diferença não é o tamanho da tarefa, é que o subagente não carrega o histórico de exploração da janela principal, só o diff e a regra.

Regra prática: toda tarefa que exige leitura pesada e produz saída curta (revisão, auditoria, busca, análise de log recortado) vai para subagente isolado.

## 3. Antipadrões, em ordem de gravidade

Referência: §4 e §6 do documento de orquestração, mais §28.

1. Mandar o modelo ler log bruto de produção procurando padrão sem recorte. Ver o protocolo correto em `docs/10-observabilidade.md`.
2. Manter uma única janela aberta por dias, acumulando ruído de exploração antiga em cada nova mensagem.
3. Empilhar várias tarefas em um único comando, em vez de uma tarefa por comando (`CLAUDE.md`, seção 5).
4. Colar a base de código inteira quando o recorte relevante bastaria.
5. Insistir no mesmo caminho de diagnóstico depois de várias tentativas falhas, em vez de aplicar a regra dos três ciclos.

## 4. Higiene de janela

| Situação | Ação |
|---|---|
| Tarefa concluída | Encerrar a janela. Não emendar outra tarefa. |
| Contexto acima de ~60% com tarefa em andamento | `/context-check`: compactar preservando decisão tomada, arquivos tocados e próximo passo |
| Muito ruído de exploração acumulado | Registrar o estado na issue e reabrir janela limpa |
| Nova issue | Sempre janela nova, nunca continuação |

Compactação serve para continuar a mesma tarefa. Não substitui abrir janela nova para começar outra (§19).

## 5. Regras de saída, na prática

Já fixadas em `CLAUDE.md`, seção 5, repetidas aqui como critério de auditoria do próprio agente:

- Entregar o resultado, não a narração do processo que levou até ele.
- Não repetir código já mostrado no arquivo.
- Não produzir resumo do que acabou de ser feito.
- Ao concluir, entregar apenas: arquivos tocados, decisão tomada, risco aberto.

## 6. Expectativa realista de ganho

Referência: §17. O ganho real observado é compressão de prazo, da ordem de dez vezes: tarefa de dois dias passa a levar uma hora e meia a duas. Isso não significa entrega instantânea nem significa que o resultado dispensa validação. O maior desperdício observado no mercado não é token, é retrabalho, e retrabalho nasce de planejamento raso, não de execução lenta. Uma hora a mais de planejamento em `/plan` custa menos que um ciclo inteiro de execução refeito.
