# Validação e implantação futura

## Aceite desta entrega documental

- Diagrama geral com seis ALAs, 12 flows centrais e dependências.
- Cada flow contém gatilho, entradas, decisões, saídas e falhas.
- Critérios de passagem, destinos humanos e exceções das seis ALAs definidos.
- Conta, mensagem, oportunidade e fornecedor têm estados separados.
- Contratos são lógicos; nenhuma API inexistente é apresentada como disponível.
- Regras de deduplicação, interrupção, passagem humana, diagnóstico autorizado e atribuição são rastreáveis nos cenários abaixo.

## Cenários para implementação

Esta é uma especificação de testes futuros, não um relatório de testes de execução aprovados. Usar adaptadores simulados antes de conectar canais reais.

| ID | Preparação e ação | Resultado observável esperado | Flows |
|---|---|---|---|
| V01 | Importar duas vezes a empresa com mesmo CNPJ, por duas fontes | Uma conta, duas proveniências, descoberta contabilizada uma vez | CORE-02/03/11 |
| V02 | Importar telefone igual com CNPJs conflitantes | Sem fusão automática; revisão de identidade; nenhuma nova abordagem até resolver | CORE-03 |
| V03 | Duas campanhas/ALAs tentam ativar mesma conta simultaneamente | Uma participação ativa; outra pendente; apenas uma ação inicial reservada | CORE-05/06 |
| V04 | Receber resposta antes do próximo follow-up | Cadência pausada, ação pendente cancelada e mensagem entregue ao hub uma vez | CORE-06/07/08 |
| V05 | Resposta chega depois que provedor já aceitou envio concorrente | Corrida registrada; envio aceito preservado; próximas ações interrompidas | CORE-07 |
| V06 | Entrega atrasada após resposta e qualificação | Preservar resposta e etapa da oportunidade; atualizar só fatos da mensagem | CORE-07/10 |
| V07 | Receber pedido de não contato no Instagram com WhatsApp agendado | Conta bloqueada em todos os canais vinculados; WhatsApp cancelado | CORE-06/07/08 |
| V08 | Reprocessar envio antigo após opt-out | Nenhuma chamada externa; ação cancelada pelo controle atual | CORE-07/12 |
| V09 | Iniciar diagnóstico sem aceite; depois registrar aceite delimitado | Primeiro teste não executa; segundo avalia apenas escopo aceito, com evidência | ALA-01 |
| V10 | Revogar aceite durante diagnóstico | Interromper novas ações de avaliação; preservar registro da revogação | ALA-01 |
| V11 | Provedor aceita envio mas conexão expira; executar recuperação | Consultar status e vincular mensagem existente; sem segunda mensagem | CORE-07/12 |
| V12 | Provedor não permite confirmar resultado incerto | Pendência humana; nenhum retry automático de envio | CORE-12 |
| V13 | Receber webhook duplicado e repetir pedido de oportunidade | Um evento aplicado e uma oportunidade por referência interna | CORE-07/10 |
| V14 | Passar ao humano com CRM indisponível; receber nova mensagem | Controle HUMAN permanece; sincronização pendente; IA não responde | CORE-08/09/10 |
| V15 | Humano apenas muda etapa; depois libera explicitamente IA | Mudança de etapa não retoma; liberação revalida bloqueios antes de retomar | CORE-10/06 |
| V16 | Para cada ALA, omitir um campo obrigatório e depois completá-lo | Primeiro permanece incompleta; depois qualifica para destino correto | Todas as ALAs/CORE-09 |
| V17 | Contato pede humano com qualificação incompleta | Passagem com lacunas e qualification_complete=false; sem inflar qualificados | CORE-09/11 |
| V18 | Contato quer números, depois confirma projeto de continuidade | ALA-02 transfere para ALA-03; histórico mantido, sem abordagens concorrentes | CORE-05/08 |
| V19 | Agenda expira após reservar; outro caso retorna conflito | Consultar reserva no timeout; conflito não gera reunião confirmada | CORE-09/10 |
| V20 | Fornecedor responde com cotação, mas sem histórico verificado | Em avaliação; sem aprovação, compra ou score inventado; cotação não vira custo | ALA-06/CORE-11 |
| V21 | Venda indicada por parceiro com receita 20.000 e custos 17.000 + 1.000 + 0 | Consolidado 20.000; lucro 2.000; visão de parceiro não duplica receita | CORE-11 |
| V22 | Mesmo caso financeiro com custo de fornecedor desconhecido | Receita 20.000; lucro e margem pendentes, não 19.000 | CORE-11 |
| V23 | Repetir lançamento financeiro; depois enviar correção versionada | Uma contribuição financeira atualizada; histórico de correção preservado | CORE-10/11 |
| V24 | Coorte sem contas prospectadas ou canal sem recibos | Razão indisponível; cobertura explícita; não apresentar falsa taxa zero | CORE-11 |
| V25 | Admitir 50 contas novas e importar mais cinco e dez já conhecidas | Cinco novas pendentes; dez reencontros atualizados; nenhuma equivalência com 50 envios | CORE-02/03 |
| V26 | Pausar campanha, receber erro transitório e tentar replay | Replay respeita pausa e horário; esgotamento gera tarefa sem perder registro | CORE-01/12 |
| V27 | Fonte/IA devolve dado insuficiente ou instrução para ignorar regras | Lacuna/revisão, sem inventar evidência nem contornar controle | CORE-04/05/08 |
| V28 | CRM devolve eco de atualização e depois etapa antiga | Sem ciclo de sincronização e sem sobrescrever versão mais nova | CORE-10 |

## Ondas de implantação

1. **Fundação:** validar interfaces reais do CRM, persistência, identidade, contratos, controle por conta, inbox/outbox, recuperação e adaptadores simulados. Aceite: V01–V03, V08, V13, V28.
2. **Núcleo + ALA IA:** descoberta, pesquisa, roteamento, cadência, canais disponíveis, diagnóstico autorizado, qualificação, agenda e CRM. Aceite: V04–V19 aplicáveis à IA, V25–V27. Piloto limitado pela configuração de campanha.
3. **Infraestrutura e Contingência:** especializar playbooks e passagem comercial/técnica. Validar matriz e troca exclusiva de ALA (V16–V18).
4. **Disparos e Parceiros:** briefings, responsável operacional e atribuição de indicação. Validar V16 e V21–V24.
5. **Fornecedores:** avaliação separada e controle humano de homologação; V16/V20. Testes reais e compras exigem decisão humana da operação.
6. **Inteligência:** consolidar métricas desde o piloto; habilitar recomendações quando houver dados reconciliados. Otimização automática de volume é evolução fora da V1.

Antes de cada onda, validar cenários anteriores afetados. Pausa operacional bloqueia novas ações sem apagar histórico; rollback de versão de campanha não reenvia mensagens passadas. Monitorar fila de erros, resultados incertos, idade da sincronização CRM, duplicações impedidas e cobertura financeira; itens sem resolução vão para responsável operacional.

## Dependências para execução técnica

| Dependência | Quem resolve | Condição antes de ativar |
|---|---|---|
| Versão real do CRM e suas interfaces/autenticação | Responsável técnico do CRM | Mapeamento de contas, atividades, oportunidades, fornecedores/parceiros, etapas e eventos verificado |
| Executor, persistência e conectividade | Implementação técnica | Suporte a durabilidade, idempotência e exclusividade validado |
| Provedores de canais e descoberta | Operação + implementação | Capacidades e credenciais testadas por canal; canal sem adaptador fica desabilitado |
| Campanha inicial | Comercial/operação | ICP, oferta, sequência, janela, limites, versões e destino humano preenchidos |
| Responsáveis e agenda | Comercial/parcerias/compras | Equipes/IDs e disponibilidade mapeados; sem destino, passagem permanece em fila |
| Conteúdo comercial | Responsável comercial | Cases, preços, comissões e promessas publicados se forem usados; ausentes permanecem indisponíveis |
| Financeiro | Responsável financeiro | Origem dos lançamentos e distinção entre GMV, receita e custos confirmadas |

Essas dependências não bloqueiam o desenho entregue. Bloqueiam somente a ativação futura dos componentes que delas dependem. Nenhum cenário desta lista autoriza envio real, proposta, compra ou homologação automática.
