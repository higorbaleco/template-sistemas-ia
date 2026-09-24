# Mensuração e atribuição

## Unidades e períodos

- Conta descoberta: conta canônica criada após deduplicação; reimportação não conta de novo.
- Conta aprovada: conta com decisão positiva de ICP registrada; produto secundário não conta como nova aprovação global.
- Conta prospectada: conta com ao menos uma mensagem de abordagem aceita pelo provedor. Ação apenas agendada ou visita social não conta.
- Contato automatizado: cada mensagem de saída automática aceita pelo provedor, incluindo respostas da IA. Não é sinônimo de pessoa única.
- Resposta: mensagem recebida de pessoa, excluindo recibos e respostas automáticas identificadas; respostas ambíguas ficam pendentes de classificação.
- Qualificado: critérios mínimos completos da ALA. Passagem incompleta ao humano não conta como qualificação.

Painéis de aquisição usam coorte de entrada na campanha e mostram data de corte dos resultados. Consolidado global deduplica contas: a soma de contagens de campanhas pode diferir do total global. Painel financeiro por período usa data do lançamento, claramente separado da receita atribuída às coortes.

## Indicadores

| Indicador | Definição |
|---|---|
| Qualification Yield | Contas únicas aprovadas da coorte ÷ contas únicas descobertas da coorte |
| Taxa de entrega | Mensagens entregues confirmadas ÷ mensagens enviadas; informar cobertura de recibos do canal |
| Reply Rate | Contas prospectadas com resposta ÷ contas prospectadas |
| Positive Reply Rate | Contas prospectadas com resposta positiva ÷ contas prospectadas |
| Taxa de qualificação | Contas qualificadas ÷ contas prospectadas |
| Taxa de agendamento | Oportunidades com reunião marcada ÷ oportunidades qualificadas destinadas a reunião |
| Show Rate | Reuniões realizadas ÷ reuniões com resultado conhecido (realizada ou ausência); mostrar pendências separadas |
| Win Rate | Oportunidades ganhas ÷ oportunidades encerradas (ganhas + perdidas) |
| Receita / 100 contas prospectadas | Receita atribuída à coorte ÷ contas únicas prospectadas × 100 |
| Lucro bruto / 100 contas prospectadas | Lucro bruto atribuível completo ÷ contas únicas prospectadas × 100 |
| Receita / 1.000 contas descobertas | Receita atribuída à coorte de descoberta ÷ contas descobertas × 1.000 |
| Lucro bruto / 100 contatos automatizados | Lucro bruto atribuível completo ÷ mensagens automáticas enviadas na mesma coorte × 100 |
| Ticket médio | Receita das oportunidades ganhas ÷ oportunidades ganhas com receita registrada |

Divisão por zero retorna “não disponível”. Eventos atrasados atualizam o resultado da coorte sem mudar sua origem. Mensagens/reuniões com status desconhecido não são convertidas em falha ou sucesso. Métricas de fornecedores são capacidade, cotação, SLA, evidência e homologação, separadas do funil comercial.

## Financeiro

Manter por lançamento: ID externo único, oportunidade, campanha de origem, data, moeda, GMV, receita reconhecida informada, custo de fornecedor, comissão/intermediação, outros custos diretos e status de completude dos custos. Não inferir receita reconhecida a partir do GMV; receber esse valor explicitamente do registro financeiro validado.

`lucro_bruto = receita − custo_fornecedor − comissão − outros_custos_diretos`, somente quando todos os componentes forem conhecidos. Zero exige confirmação; nulo significa desconhecido. `margem = lucro_bruto / receita`, se receita positiva.

Exemplo ilustrativo em que receita registrada = R$20.000: fornecedor R$17.000, intermediador R$1.000, demais custos confirmados R$0 → lucro bruto R$2.000 e margem 10%. Se a receita registrada tiver outra base, recalcular a partir dela; GMV não substitui receita.

Sem custos completos, mostrar receita normalmente e lucro “pendente”, com valor/quantidade de operações sem cobertura. Pode-se exibir subtotal de lucro conhecido, claramente parcial, mas não classificá-lo como lucro total nem usá-lo para ranking de alocação. Não somar moedas diferentes sem conversão explícita documentada.

## Atribuição e parceiros

Fixar `origin_campaign_id` quando a oportunidade é criada, usando a participação que gerou a qualificação. Guardar separadamente fonte inicial da conta, canal de primeira abordagem e canal da conversa. Mudança posterior de produto não reescreve silenciosamente a origem; correção exige registro auditável.

Oportunidade indicada pode ter `partner_id` além da campanha originadora. A receita aparece uma vez no consolidado e no produto vendido; “receita gerada por parceiros” é uma visão filtrada dessas mesmas oportunidades, não uma parcela a somar novamente. Candidato a parceiro, por si só, não gera receita.

Lançamento repetido mantém um único resultado. Correção referencia o lançamento e sua versão; estorno reduz o resultado correspondente. Cotação de fornecedor não é custo realizado. Ganhar oportunidade sem lançamento financeiro não presume recebimento ou receita.

## Dashboard e recomendações

Visões: consolidado, ALA, campanha, segmento, fonte e canal. Mostrar aquisição, respostas, qualificações, reuniões, propostas, vendas, receita e lucro com cobertura dos dados. Parceiros têm visão de indicação; fornecedores têm visão operacional.

A consolidação diária apresenta tamanho da amostra, período, maturidade e lacunas junto às recomendações de volume. V1 não redistribui capacidade automaticamente. CAC/ROI dependem de custos completos de aquisição ainda não especificados: permanecerão indisponíveis até integração desses dados, sem cálculo aproximado disfarçado de realizado.
