# Catálogo dos 12 flows centrais

Contrato comum: [eventos e integrações](CONTRACTS.md). Transições e travas: [dados e estados](DATA_STATES.md). Cada saída persistida gera evento; falhas seguem CORE-12. Dados desconhecidos permanecem desconhecidos.

## CORE-01 · Campanhas

- **Gatilho:** criação, edição ou habilitação por operador.
- **Entradas:** ALA, ICP, segmento, região, fontes, canais, sequência com intervalos, janela de execução, limites por canal, oferta, CTA, início/fim e versões de script/prompt.
- **Decisões:** validar campos, playbook e capacidades disponíveis. Só habilitar canais com adaptador configurado. Campanha sem limite, responsável de passagem ou oferta definida permanece em rascunho.
- **Saídas:** versão imutável de campanha habilitada; alterações geram nova versão para novas participações. Pausa impede novas ações e aquisições.
- **Falhas:** erro de configuração vira pendência operacional; não assumir preços, horários ou capacidade.

## CORE-02 · Descoberta

- **Gatilho:** execução programada de campanha habilitada ou importação solicitada.
- **Entradas:** filtros de busca, fonte, cursor de paginação e orçamento de coleta.
- **Decisões:** coletar apenas campos disponíveis; manter referência e data de coleta. Repetir a coleta não torna uma empresa já conhecida uma nova conta.
- **Saídas:** candidatos com `candidate_id`, nome, localização, identificadores disponíveis e proveniência para CORE-03.
- **Falhas:** salvar progresso por página; indisponibilidade de fonte é recuperável. Resultado vazio é sucesso sem candidatos, não erro.

## CORE-03 · Identidade

- **Gatilho:** candidato descoberto ou novo identificador recebido.
- **Entradas:** candidato, CNPJ, domínio, contatos, origem e possíveis correspondências.
- **Decisões:** normalizar identificadores e aplicar regras de identidade; conflito entre identificadores suspende fusão e abordagem para revisão. Admitir até 50 contas novas/dia; reencontros apenas enriquecem proveniência.
- **Saídas:** `account_id` canônico, vínculos de contatos e fontes; evento de criação ou atualização. Encaminhar conta nova ou informação nova ao CORE-04.
- **Falhas:** concorrência de criação deve retornar conta canônica; ausência de chave confiável mantém candidato pendente, sem aproximação automática por nome.

## CORE-04 · Enriquecimento

- **Gatilho:** conta identificada com informação nova ou atualização de pesquisa solicitada.
- **Entradas:** conta, fontes públicas e perguntas necessárias ao ICP.
- **Decisões:** guardar evidência, URL/origem, data e natureza de cada achado: observado, declarado ou hipótese. Não converter estimativa de demanda em certeza.
- **Saídas:** perfil, sinais, lacunas e status de pesquisa; dados suficientes seguem CORE-05.
- **Falhas:** uma fonte indisponível não apaga dados anteriores. Pesquisa insuficiente fica pendente; resposta inválida da IA segue recuperação.

## CORE-05 · ICP e roteamento

- **Gatilho:** enriquecimento concluído ou reavaliação solicitada.
- **Entradas:** perfil, evidências, regras de ICP versionadas e campanhas habilitadas.
- **Decisões:** IA recomenda ALA primária, secundárias e justificativa; regras validam ICP, não contato e disponibilidade. Intenção explícita do contato prevalece sobre hipótese. Empate sem intenção clara vai para revisão, sem disparar múltiplas ALAs.
- **Saídas:** elegibilidade e participação proposta na campanha, ou nutrição/pendência com motivo. CORE-06 adquire exclusividade antes de ativar a participação.
- **Falhas:** produto inexistente, justificativa sem evidência ou dados insuficientes não habilitam abordagem.

## CORE-06 · Cadência

- **Gatilho:** participação elegível, ação vencendo ou retomada explícita.
- **Entradas:** conta, sequência versionada, canais disponíveis, limites, janela e controle da conta.
- **Decisões:** adquirir trava de abordagem; calcular próxima ação; verificar resposta, pausa, bloqueio e limite imediatamente antes de reservar envio. Canal ausente só é pulado se a sequência o permitir; caso contrário, pendência.
- **Saídas:** ação reservada com ID estável e horário; fim da sequência sem resposta encerra participação e coloca conta em nutrição com data definida pela campanha.
- **Falhas:** disputa pela conta deixa participação pendente. Indisponibilidade temporária remarca respeitando janela, sem consumir outro passo.

## CORE-07 · Canais

- **Gatilho:** comando de envio de CORE-06/08 ou webhook do provedor.
- **Entradas:** ação, destinatário, conteúdo, contexto e IDs; no retorno, evento e identificação do provedor.
- **Decisões:** autenticar entrada, deduplicar e resolver conta. Revalidar versão do controle antes de enviar. Aceitação pelo provedor não significa entrega. Opt-out atualiza bloqueio antes de qualquer resposta automática.
- **Saídas:** IDs de mensagem, status de transporte e mensagem recebida normalizada. Resposta pausa cadência atomicamente antes de encaminhar ao CORE-08.
- **Falhas:** timeout após envio produz resultado incerto e reconciliação. Webhook sem conta identificável fica em quarentena. Não responder a recibos de entrega como se fossem mensagens.

## CORE-08 · Conversação

- **Gatilho:** mensagem recebida e vinculada à conta.
- **Entradas:** histórico compartilhado, ALA ativa, playbook versionado, evidências e responsável atual.
- **Decisões:** não contato e humano ativo bloqueiam resposta automática. Interpretar intenção, executar uma etapa da ALA, coletar lacunas sem repetir perguntas já respondidas. Mudança de produto encerra participação anterior antes de outra ser ativada.
- **Saídas:** resposta proposta para CORE-07, dados de qualificação ou solicitação ao CORE-09. Toda resposta passa novamente pelas travas do canal.
- **Falhas:** contexto contraditório, pedido fora do playbook ou falha persistente da IA gera tarefa humana; não inventar promessa, preço ou case.

## CORE-09 · Qualificação e passagem

- **Gatilho:** critérios coletados, pedido de humano ou necessidade de escalonamento.
- **Entradas:** matriz da ALA, dados com origem, resumo, próximo passo e destino de atendimento.
- **Decisões:** campos obrigatórios completos permitem marcar qualificado; pedido de humano pode passar incompleto, com lacunas explícitas. Agenda só é confirmada após reserva bem-sucedida.
- **Saídas:** pacote de passagem, pausa humana e solicitação idempotente ao CRM. Comercial recebe oportunidades; parcerias recebe candidatos a parceiro; compras recebe avaliações de fornecedor.
- **Falhas:** sem responsável disponível, manter fila humana e automação pausada. Conflito de agenda exige oferecer outro horário, sem registrar reunião confirmada.

## CORE-10 · CRM

- **Gatilho:** atualização de conta, atividade, passagem ou evento recebido do CRM.
- **Entradas:** operações lógicas de sincronização e mapeamento de IDs.
- **Decisões:** núcleo controla cadência; CRM controla proprietário e etapas comerciais. Atualização antiga não sobrescreve versão nova. Parceiros e fornecedores usam registros próprios, sem virar venda artificial.
- **Saídas:** IDs externos, confirmação de sincronização, eventos comerciais/financeiros para CORE-11 e mudanças de controle quando explicitamente solicitadas.
- **Falhas:** indisponibilidade mantém fila durável. Timeout na criação exige consulta por referência externa antes de repetir. Mudança de etapa não libera automaticamente a IA.

## CORE-11 · Métricas

- **Gatilho:** novos eventos/resultados e consolidação diária.
- **Entradas:** contas, participações, mensagens, reuniões, oportunidades e lançamentos financeiros.
- **Decisões:** deduplicar, usar campanhas de origem e separar coortes de aquisição de caixa por período. Custos ausentes impedem lucro definitivo.
- **Saídas:** indicadores consolidados e por ALA, fonte e campanha; recomendações de alocação para operador.
- **Falhas:** eventos incompletos entram em pendência de dados; métricas mostram cobertura. Não estimar zero para custos ausentes nem executar alteração de volume.

## CORE-12 · Recuperação

- **Gatilho:** falha de qualquer bloco, resultado externo incerto ou item pendente de reconciliação.
- **Entradas:** operação original, chave idempotente, tentativas, erro classificado e contexto mínimo.
- **Decisões:** falha transitória conhecida permite até três novas tentativas em 1, 5 e 30 minutos, respeitando janela e indicação de espera do provedor. Falha permanente vira tarefa. Resultado incerto exige consulta externa antes de qualquer repetição.
- **Saídas:** reexecução com mesmos IDs, resolução registrada ou fila operacional com responsável. Replay preserva bloqueios atuais, mesmo se o evento original era elegível.
- **Falhas:** consulta sem capacidade de confirmar resultado mantém pendência humana; exceder tentativas não descarta o item. Registrar falha da própria recuperação em fila operacional persistente.
