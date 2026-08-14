# Transcrição Estruturada: Método de Desenvolvimento Assistido por IA

Documento de referência interna. Reorganização lógica de duas conversas gravadas, com preservação do conteúdo técnico e separação entre o que foi afirmado e o que é inferência de leitura.

Origem: Áudio 01 (conversa principal, demonstração ao vivo do ambiente de trabalho) e Áudio 02 (continuação, com foco em banco de dados, custo de infraestrutura e diagnóstico por log).

Marcação usada ao longo do documento:
- **[Afirmado]** conteúdo dito diretamente na gravação
- **[Inferido]** conclusão derivada do contexto, não dita com essas palavras
- **[Aplicação Avraham]** desdobramento para a nossa operação

---

# PARTE 1: ÁUDIO 01

## 1. O CLAUDE.md como ativo central

**[Afirmado]** O ponto de partida da conversa é a afirmação de que o `CLAUDE.md` é o arquivo mais importante do fluxo e o mais subestimado pelo mercado. É ele que informa ao modelo o que o projeto é, o que ele faz e como deve ser tratado.

**[Afirmado]** A crítica é direta: a maioria das pessoas não constrói esse arquivo direito. Sem ele, o modelo trabalha sem referência e o resultado é descrito como "sair codando na loucura da maluquice".

**[Afirmado]** A origem do conteúdo é mista. Parte foi criada manualmente, parte foi puxada da própria biblioteca de recursos da ferramenta, e parte veio de iteração e discussão ao longo do uso.

**[Aplicação Avraham]** Todo projeto novo nasce com esse arquivo preenchido antes da primeira linha de código. Ele não é documentação de apoio, é o contrato de funcionamento do projeto.

---

## 2. Documentação de infraestrutura e arquitetura

**[Afirmado]** Além do `CLAUDE.md`, existe um segundo conjunto documental igualmente crítico: os arquivos de infraestrutura e arquitetura. A frase usada foi que ali está "toda a estrutura de infra, arquitetura, tá tudo aqui, ele sabe tudo que ele tem que fazer".

**[Afirmado]** A conclusão explícita: o modelo precisa ter os documentos e ter as coisas definidas. Não é opcional.

**[Inferido]** A separação de responsabilidade entre os dois arquivos é: `CLAUDE.md` define regras de conduta e governança, os arquivos de arquitetura definem o desenho técnico do sistema.

---

## 3. Agentes especializados

**[Afirmado]** O projeto tem agentes próprios, específicos, definidos dentro dele.

**[Afirmado]** Existe um comando de setup na ferramenta que lê o projeto e sugere quais agentes fazem sentido para aquele contexto. O modelo analisa e recomenda.

**[Afirmado]** Exemplo real citado: um projeto tem um agente especialista financeiro, cuja função é garantir que as cobranças estejam corretas.

**[Afirmado]** O benefício declarado do uso de agentes é a redução de consumo de token.

**[Aplicação Avraham]** O gatilho para criar um agente novo é a repetição de um tipo de erro. Quando o mesmo problema aparece pela terceira vez em projetos diferentes, ele vira agente.

---

## 4. Janela de contexto e economia real de token

**[Afirmado]** O problema apontado como central: "aquela janela aberta gigante que nunca fecha, cara, não funciona".

**[Afirmado]** Demonstração ao vivo com número. Durante a sessão, a janela principal já havia consumido 29 por cento do contexto executando o trabalho. O agente de revisão de código, rodando em outra janela e outro contexto, consumiu 1 por cento para revisar o mesmo trabalho.

**[Afirmado]** Os agentes rodam em janelas separadas, em contextos separados, mesmo compartilhando o mesmo projeto.

**[Inferido]** A conclusão econômica: toda tarefa que exige leitura pesada e produz saída curta deve rodar em subagente isolado. Revisão, auditoria, busca e análise se encaixam nesse perfil.

**[Afirmado]** A causa raiz do desperdício de token foi nomeada: "o problema de torrar os tokens é querer fazer um caminhão de uma vez, não adianta, não foi feito pra isso".

---

## 5. Travas e regras invioláveis

**[Afirmado]** Nenhum projeto permite commit direto na branch principal. A regra é absoluta. Ao ser instruído explicitamente a commitar na main, o modelo recusa e responde que suas regras não permitem.

**[Afirmado]** O `git push` é configurado como ponto de parada. A justificativa dada: quando o modelo chega no push, significa que ele está mandando para o servidor, portanto significa que o trabalho está pronto e precisa de inspeção humana antes de sair.

**[Afirmado]** Demonstração ao vivo: o modelo reporta que existe uma regra bloqueando o push e para.

**[Inferido]** O valor da trava não é impedir o modelo. É impedir o próprio dono do projeto de pular a inspeção sob pressão de prazo.

---

## 6. Revisão de código e confirmação de achados

**[Afirmado]** Sequência observada ao vivo: a revisão voltou com cinco achados. Os achados 1 e 2 foram confirmados no código. Em seguida foi feita verificação no front-end e os cinco foram confirmados.

**[Afirmado]** Exemplo de achado citado: normalizar um dado antes de carimbar. Existiam pontos implementados fora do padrão do projeto.

**[Afirmado]** O padrão contra o qual a revisão compara é o conjunto de especificações definidas nos documentos do projeto.

**[Afirmado]** Fechamento do ciclo relatado: "cinco achados eram legítimos, verifiquei cada um".

**[Inferido]** Regra operacional: achado de revisão é hipótese, não veredito. Confirmar no código antes de corrigir. Achado não confirmado é falso positivo e é descartado com justificativa.

---

## 7. Template de projeto

**[Afirmado]** Existe um projeto que funciona como template. O fluxo descrito: "quero criar um projeto novo a partir do template, vamos trabalhar".

**[Afirmado]** O template já rege tudo que precisa ser feito e como precisa ser feito.

**[Afirmado]** O template estava em desenvolvimento ativo no momento da conversa.

**[Afirmado, Áudio 02]** Surgiu a possibilidade de vender o template. A avaliação da Brenda foi contrária, com o seguinte raciocínio: vender entrega o dinheiro daquela venda uma vez, enquanto manter o template aumenta permanentemente a capacidade de execução. A ferramenta não veio para substituir o serviço, veio para aumentar a capacidade de produzir.

**[Aplicação Avraham]** O template é ativo estratégico, não produto. Ele é o que permite entrar em projeto novo com governança pronta no dia um.

---

## 8. Design e origem do sistema visual

**[Afirmado]** Para design, o fluxo usa a ferramenta de design da própria plataforma, não o Claude Code. Ali está a identidade visual da empresa e é ali que as propostas são feitas.

**[Afirmado]** O processo de criação do sistema visual não parte de referência visual enviada. O usuário descreve o sistema, a ferramenta faz uma sequência de perguntas, e o sistema visual é construído a partir dessa entrevista. Diálogo textual da gravação: a pergunta "você não manda referência?" recebeu como resposta que não, que a ferramenta pergunta um monte de coisa e o design nasce dali.

**[Afirmado]** A importação para o ambiente de desenvolvimento é feita por conexão direta. A ferramenta gera o prompt, abre a conexão MCP e traz todos os componentes para o repositório.

**[Afirmado]** A instrução dada é simples e direta: "lá no Claude Design foi feito toda a UX e UI, quero que você traga os componentes de lá pra cá".

**[Afirmado]** Ponto enfatizado com clareza: o que é trazido é componente real, não imagem. "Isso aqui é um componente, isso aqui não é uma imagem."

**[Afirmado]** Uma vez importado, aquilo vira o padrão de design do projeto. A frase de fechamento: "acabou, esquece, não precisa mais nada".

**[Aplicação Avraham]** Este é exatamente o modelo que já usamos no `avraham-design`, aplicado a produto de software em vez de material comercial. Vale replicar a lógica: uma fonte única, importada como código, e toda tela subsequente vira composição.

---

## 9. Caso prático: SaaS para lava jato

**[Afirmado]** Sistema desenvolvido para uma operação de lava jato, com fila de carros e serviços associados. O resultado foi descrito como tendo seguido corretamente todas as especificações.

**[Afirmado]** Foi construído um CMS interno que permite ao operador configurar a marca. A aplicação é white label.

**[Afirmado]** Modelo de negócio do cliente: ele tem uma empresa que vende aspiradores, produtos e sistema para lava jato, e tem um lava jato próprio operando. A operação é distribuidora em seis cidades. O plano é abrir franquia e vender o sistema white label para outros lava jatos.

**[Afirmado]** No CMS o operador pode trocar cor, logotipo e demais elementos de marca.

**[Afirmado]** O design system do sistema está inteiro documentado dentro do projeto, e o modelo segue esse padrão.

**[Afirmado]** Existe também um componente de hardware no escopo: uma caixa instalada no lava jato para controlar o tempo de uso do aspirador de pó, resolvendo o problema de clientes que ficavam duas horas usando o equipamento.

**[Aplicação Avraham]** Modelo replicável: sistema operacional de nicho, com camada de tema configurável, vendido em white label para a rede do próprio cliente. O cliente vira canal de distribuição.

---

## 10. Testes como trava

**[Afirmado]** Um dos sistemas em operação tem 2.200 testes unitários. A suíte completa leva nove minutos para rodar.

**[Afirmado]** A observação de que nove minutos parece muito foi respondida com a explicação de que o processo sobe toda a stack e executa teste local real.

**[Afirmado]** Os testes não são verificação superficial. Eles executam ciclo completo: incluir dado, excluir, colocar de novo, consultar. A descrição usada foi que é como se o sistema estivesse atacando a si mesmo.

**[Afirmado]** Se a suíte não passar, nada avança até o problema ser resolvido. O modelo reporta o problema encontrado e propõe a correção.

**[Aplicação Avraham]** Nove minutos é o preço de saber, antes de subir, que nada quebrou. É o melhor negócio disponível em engenharia. Suíte vermelha bloqueia toda a fila, inclusive tarefa urgente.

---

## 11. Ciclo de trabalho por issue

**[Afirmado]** No momento da conversa havia sete issues abertas em um dos projetos, representando sete frentes de trabalho identificadas.

**[Afirmado]** O ciclo funciona assim: quando o modelo encontra um problema, ele descreve tudo em detalhe e abre a issue. O problema é deixado quieto naquele momento, não interrompe a tarefa corrente.

**[Afirmado]** Depois, em uma janela de contexto limpa e zerada, a instrução é "vamos trabalhar na issue 20". O modelo lê a issue, lê apenas o pedaço de código que precisa ler, declara que já sabe o que fazer e executa.

**[Afirmado]** A frase de fechamento: "aí é o mesmo processo, acabou".

**[Aplicação Avraham]** Uma issue por janela. Issue aberta precisa ter descrição suficiente para ser executada sem consultar a conversa em que nasceu. Issue de uma linha vaga não é backlog, é dívida.

---

## 12. Automação de correção de bug

**[Afirmado]** Existe um fluxo em desenvolvimento, já construído mas ainda não validado em produção, com a seguinte cadeia: capturar os logs de erro, processar, catalogar, abrir tarefa no GitHub automaticamente, o modelo executa o fluxo completo de correção, comenta o que fez, e o humano apenas valida se está correto.

**[Afirmado]** A descrição do resultado esperado: "literalmente o cara corrige bug em produção sozinho".

**[Afirmado]** Status declarado: está pronto, mas precisa de teste controlado. A frase foi que é preciso gerar um erro proposital, observar tudo que acontece e identificar onde é necessário colocar trava e onde não é.

**[Inferido]** Este é o estágio seguinte da maturidade do método: o humano sai da execução e sai também da detecção, ficando apenas na validação.

---

## 13. Perfil técnico e custo de token: o caso Juliano

**[Afirmado]** Descrição do parceiro técnico: extremamente inteligente, muito mais do que o interlocutor na avaliação dele próprio, com domínio profundo de fundamento. Lê os papers que precisa ler. Constrói base e fundação com qualidade absurda.

**[Afirmado]** Limitação apontada: não consegue explicar o que faz. Foi enfatizado que não é falta de vontade de compartilhar, é incapacidade de articular. E não é o perfil adequado para demanda urgente, porque é sistemático demais.

**[Afirmado]** Descoberta relevante: os dois passaram dois meses discutindo por que os tokens dele eram consumidos muito mais rápido que os do interlocutor.

**[Afirmado]** A causa encontrada: por ser muito técnico, ele escreve prompts extremamente detalhados. O modelo responde no mesmo registro e detalha demais. A conclusão textual foi: "o que é caro é a saída. Quanto mais ele escrever pra você, mais caro fica, mais token gasta".

**[Afirmado]** A solução aplicada foi cortar trechos e frases dos prompts dele.

**[Afirmado]** Resultado após o ajuste: ambos usam a ferramenta o dia inteiro e não esgotam o limite. Não conseguem terminar a sessão de cinco horas.

**[Aplicação Avraham]** Regra permanente. Prompt denso não é prompt prolixo. O `CLAUDE.md` precisa conter regra explícita de saída: entregar resultado, não narração de processo. Não repetir código já escrito. Não resumir o que acabou de ser dito.

---

## 14. Caso prático: reconhecimento de placa em Raspberry Pi

**[Afirmado]** O parceiro técnico construiu um sistema de reconhecimento de placa descrito como absurdo em qualidade. Não funcionou em campo.

**[Afirmado]** Causa: ele testou em ambiente controlado e não foi validar na rua. O hardware real era diferente do hardware de teste, e o modelo escolhido não roda em Raspberry Pi.

**[Afirmado]** Faltava também uma camada de API que era necessária.

**[Afirmado]** A solução foi ir a campo, rodando em Raspberry Pi, e resolver com apoio do modelo em duas horas. O modelo apontou o que precisava ser feito, o modelo foi trocado, a camada foi criada, e o sistema subiu funcionando.

**[Afirmado]** Avaliação final da divisão de trabalho: "a parte difícil você fez, arrumar um detalhe aqui o Claude faz, não precisa ser você. Eu preciso de você pra construir a base". E ainda: "ele fez cinco por cento do problema, mas tá no ar, e é isso que importa".

**[Inferido]** Lição de divisão de papéis. Existe o perfil de fundação, que constrói a base correta e não pode ser substituído. E existe o perfil de desenrolar, que faz o último quilômetro em campo. São competências diferentes e ambas necessárias.

---

## 15. Escalonamento de modelo: o caso da permissão USB

**[Afirmado]** Problema persistente por vários dias. Ao ligar um totem, o Android passou a pedir confirmação de permissão de USB. Uma mudança anterior fez com que a permissão passasse a exigir confirmação manual, quando antes não exigia. Havia também um bug que removia a tela.

**[Afirmado]** Foram feitas 33 tentativas com o fluxo padrão de trabalho. Nenhuma resolveu.

**[Afirmado]** A decisão foi escalar para um modelo de maior capacidade, com acesso direto à máquina e ao Android, com carta branca de atuação. A instrução foi para descobrir o problema com liberdade total.

**[Afirmado]** Resultado: dois problemas encontrados em dez minutos, incluindo a causa da permissão de USB, já comentados e resolvidos. Além disso foi identificado um bug adicional de abertura duplicada de aplicação que o fluxo anterior não tinha encontrado.

**[Aplicação Avraham]** Regra dos três ciclos. Se o mesmo problema sobreviveu a três tentativas no modelo de execução, para. Trinta e três tentativas no caminho errado custam mais que uma tentativa no caminho certo. Escalar capacidade, dar acesso ao ambiente real, ou mudar a estratégia de diagnóstico.

---

## 16. Processo criativo: da ideia ao comando

**[Afirmado]** O fluxo de entrada de ideia descrito passo a passo:

1. A ideia surge e é capturada em áudio no momento, porque é o meio mais rápido
2. O áudio vai para uma ferramenta que transcreve bem
3. A transcrição é levada ao ambiente de desenvolvimento
4. É solicitado o planejamento
5. O modelo planeja e inicia a execução

**[Afirmado]** Foi observado que o Claude aceita áudio, mas a transcrição de outra ferramenta é melhor, e por isso a transcrição é feita fora.

**[Afirmado]** Foi citado que outro membro do time trabalha da mesma forma: grava tudo em áudio e depois envia o resumo.

**[Afirmado]** Limitação reconhecida no fluxo atual: o modelo faz o planejamento e executa, mas não faz sozinho a orquestração completa, essa camada ainda é humana.

---

## 17. Expectativa realista de ganho

**[Afirmado]** O ponto foi feito com clareza. O ganho real é de compressão de prazo. Tarefa que levaria dois dias passa a levar uma hora e meia ou duas.

**[Afirmado]** O multiplicador é de aproximadamente dez vezes. Isso não significa que tudo acontece em cinco minutos, e não significa faturar dez mil reais no dia seguinte com um SaaS improvisado.

**[Afirmado]** A frase que resume a crítica ao discurso corrente: "é isso que a galera não entendeu".

**[Afirmado]** O raciocínio da Brenda validado na conversa: quanto mais detalhado o planejamento, menos erro acontece, mais o modelo acerta e menor a chance de retrabalho.

**[Afirmado]** O maior problema observado no mercado foi nomeado: retrabalho. E a causa foi ilustrada com a analogia de quem chega dizendo apenas "eu quero almoçar", sem especificar nada, e depois se frustra com o resultado.

**[Aplicação Avraham]** Retrabalho é o custo dominante, acima de token e acima de tempo de execução. Uma hora a mais no planejamento economiza ciclos inteiros de execução.

---

## 18. Custo de aprendizado

**[Afirmado]** A pergunta sobre quanto foi gasto em dólares para aprender a usar a ferramenta foi respondida com naturalidade, tratando o valor como investimento de aprendizado, não como desperdício.

**[Afirmado, contexto complementar]** O mesmo raciocínio foi aplicado ao problema de ferramenta pneumática no galpão. Gastou-se um valor em uma ferramenta, ela quebrou, será necessário gastar mais em outra. A conclusão dita foi: "é o custo do aprendizado e é isso aí".

**[Inferido]** Postura consistente. Custo de aprendizado é linha de investimento, não de prejuízo, desde que o aprendizado seja capturado e vire regra no template.

---

# PARTE 2: ÁUDIO 02

## 19. Compactação de contexto

**[Afirmado]** Ao chegar em consumo alto de contexto, o comando de compactação processa tudo o que foi feito, mantém apenas o que presta e devolve a janela próxima de cem por cento de disponibilidade, dentro da mesma conversa.

**[Afirmado]** O critério de uso: quando a conversa está muito grande e já produziu muita coisa, compacta.

**[Afirmado]** Reconhecimento de limite: tem coisa que não dá para preservar na compactação.

**[Inferido]** Compactar serve para continuar a mesma tarefa. Não substitui abrir janela nova para começar outra.

---

## 20. Padronização de stack

**[Afirmado]** A stack foi padronizada deliberadamente. Todo projeto usa:

- Backend em Python
- Banco PostgreSQL
- Frontend em Next.js

**[Afirmado]** O raciocínio da padronização foi explicado com honestidade técnica. Existem situações em que outra linguagem seria melhor. Go seria melhor em certos cenários, Java em outros. Mas o critério é o volume real, não o volume imaginado.

**[Afirmado]** Exemplo numérico dado: um dos sistemas em operação processa por volta de mil e poucos pedidos por dia. Rodam duas instâncias de backend e ainda sobra capacidade. Portanto não existe justificativa para trocar de linguagem.

**[Afirmado]** Referência usada: o Uber teve esse problema real e migrou de Python para Go. A conclusão foi que a operação atual está muito longe desse ponto.

**[Aplicação Avraham]** A pergunta correta antes de trocar tecnologia não é qual é mais rápida. É qual métrica de saturação existe hoje que justifica a troca. Sem métrica, é chute.

---

## 21. Dor com ferramenta de CRM

**[Afirmado]** Relato de experiência ruim com CRM contratado. Os problemas listados:

- Não aceita áudio
- Não integra com WhatsApp
- Encerrou o período de teste sem aviso
- Cancelou a conta e bloqueou o acesso a todos os dados que haviam sido inseridos

**[Afirmado]** A alternativa anterior também já não tinha os dados por decurso de tempo.

**[Afirmado]** Tentativa de resolver construindo um CRM próprio rapidamente em ferramenta de prototipagem. Resultado insatisfatório: sem automação, sem integração real.

**[Inferido]** Duas lições. Primeira, dependência de plataforma sem plano de saída é risco operacional concreto. Segunda, prototipagem rápida resolve interface, não resolve integração e automação, que é onde está o valor.

---

## 22. Avaliação de plataforma de banco gerenciado

Este é um dos blocos mais densos e mais aplicáveis dos dois áudios.

**[Afirmado]** A avaliação começou desarmando a crítica comum. Foi dito que a objeção de segurança que circula não é o problema real, e que segurança é questão de saber usar.

**[Afirmado]** **Problema real número 1: latência.** A pergunta feita foi onde está a VPS e onde está o banco. Se a aplicação roda em uma região e o banco em outra, cada consulta paga a viagem de ida e volta. Foi dado o exemplo de aplicação em um continente consultando banco em outro.

**[Afirmado]** Quando o banco é pequeno, isso é imperceptível. Quando tem volume, vira o gargalo.

**[Afirmado]** **Problema real número 2: degrau de custo.** O salto de plano gratuito para o primeiro plano pago foi considerado aceitável. O problema é o degrau seguinte. Foi dito textualmente que o salto é muito longo e que não há nível intermediário quando o plano pago inicial deixa de dar conta.

**[Afirmado]** Caso concreto citado: um conhecido chegou no limite do plano pago inicial e ficou sem alternativa intermediária, avaliando migrar para outra infraestrutura.

**[Afirmado]** **Problema real número 3: topologia.** A plataforma foi descrita como tendo instância única, sem réplica.

**[Afirmado]** Conclusão equilibrada e explícita: a plataforma é uma solução muito boa. O problema não é plataforma, é custo em escala e latência.

---

## 23. Topologia de banco em produção

**[Afirmado]** A arquitetura descrita, explicada inclusive para um terceiro na conversa:

- Três instâncias PostgreSQL
- Um proxy na frente
- Um master e duas réplicas de leitura
- Consumo de memória na casa dos 8 GB de RAM

**[Afirmado]** O benefício declarado: é possível desligar uma máquina e o banco continua respondendo.

**[Afirmado]** Reconhecimento de custo: "eu gasto isso, só que eu preciso disso".

**[Aplicação Avraham]** Esse é o padrão de referência para qualquer sistema que a Avraham colocar em produção com volume. A conta de RAM não é desperdício, é o preço de sobreviver à queda de uma máquina.

---

## 24. Mercado de resgate de sistemas mal construídos

**[Afirmado]** Dois clientes procuraram espontaneamente pedindo socorro em sistemas construídos com IA sem estrutura.

**[Afirmado]** Piso de preço estabelecido: abaixo de quarenta mil reais não compensa, porque exige refazer.

**[Afirmado]** O diagnóstico técnico foi feito com precisão e merece registro literal em ideia: o problema não é ter sido feito com IA. O problema é que tem muita coisa junta que deveria estar separada.

**[Afirmado]** A menção a um sistema específico analisado reforçou o ponto. A qualidade do que foi construído não era o problema. O acoplamento era.

**[Aplicação Avraham]** Linha de serviço com demanda crescente e concorrência despreparada. Diagnóstico de acoplamento e replataforma de sistema construído sem arquitetura. Ticket mínimo alto porque é refação, não conserto.

---

## 25. Filas, workers e observabilidade de processamento

**[Afirmado]** Exemplo concreto de arquitetura desacoplada mostrado ao vivo. Quando um usuário solicita enriquecimento de dado, a requisição vai para uma fila e um worker processa. Esse worker é escalável.

**[Afirmado]** Foi construído um painel de filas para permitir monitoramento. No painel é possível ver todas as filas e o que está sendo processado.

**[Afirmado]** Cenário de uso: se alguém faz uma consulta que gera cinco mil requisições, isso aparece na fila. É possível verificar se o processamento está degradado e escalar.

**[Afirmado]** Política de escala declarada: o padrão é três workers. Se três não dão conta, é possível subir para cinco, seis, dez ou vinte. Se há evento grande previsto, sobe antes.

**[Afirmado]** Justificativa de não subir preventivamente: encarece.

**[Aplicação Avraham]** Sem painel de fila não existe diagnóstico de degradação, existe suposição. Quando o cliente reclama de lentidão, a resposta vem do painel em segundos.

---

## 26. Maker Builder e Builder

Esta é a formulação conceitual mais importante do Áudio 02.

**[Afirmado]** O termo foi encontrado em leitura recente e adotado imediatamente.

**[Afirmado]** A definição dada:

| Papel | Função |
|---|---|
| Maker Builder | Constrói o template, define a arquitetura, cria as regras e as travas. Deixa tudo pronto. |
| Builder | Trabalha dentro do cercado. Cria telas, monta funcionalidades, entrega valor. |

**[Afirmado]** A frase que sintetiza o mecanismo: "as minhas regras são tão fortes que seguram suas cagadas, e você pode fazer o que quiser no código".

**[Afirmado]** Ou seja, o Builder pode ter suas maluquices, criar suas coisas no projeto, e mesmo sem saber o que está fazendo não vai conseguir causar dano estrutural, porque as regras não deixam.

**[Afirmado]** Mapeamento de senioridade proposto:

- Vibe coder, júnior e pleno correspondem ao Builder
- Sênior, engenheiro e arquiteto de software correspondem ao Maker Builder

**[Afirmado]** O ponto sobre o que a ferramenta não substitui: a parte cognitiva continua sendo humana. Foi dado o exemplo de um engenheiro civil que coloca o conhecimento de engenharia civil na ferramenta e manda executar o que ele não sabe executar. A ferramenta executa, mas precisa da parte cognitiva vinda de alguém.

---

## 27. O multiplicador tem sinal

**[Afirmado]** A referência citada foi a formulação de que a ferramenta multiplica por dez.

**[Afirmado]** A correção feita: isso só vale para o lado positivo. Quando existe déficit técnico, o multiplicador é de menos dez.

**[Afirmado]** O mecanismo explicado: quem não sabe o que está fazendo vai construir muita coisa errada, cada erro será replicado, e a bola de neve de problemas vai aumentar. A ferramenta duplica o erro e segue propagando aquele erro para frente.

**[Afirmado]** Conclusão: se você sabe o que está fazendo, é dez vezes. Fácil.

**[Aplicação Avraham]** Este é o argumento comercial central para vender governança e não apenas execução. O cliente que quer velocidade sem estrutura está comprando aceleração de erro.

---

## 28. O caso dos seis mil dólares

**[Afirmado]** Relato de um conhecido que gastou seis mil dólares em uma única noite tentando resolver um problema, e não resolveu.

**[Afirmado]** A avaliação foi enfática: não é burrice, foi teste. Mas o método estava errado.

**[Afirmado]** A causa identificada: ele mandou o modelo ler log bruto procurando padrão.

**[Afirmado]** Caso paralelo citado: o irmão dessa pessoa, que trabalha em operação de meio de pagamento de altíssimo volume, fazia a mesma coisa e gastava mil dólares por dia.

**[Afirmado]** A analogia usada foi direta: mandar procurar padrão em log bruto de volume massivo é mandar procurar uma pessoa específica em um palheiro, algo que uma família inteira levaria tempo para fazer manualmente.

**[Afirmado]** Reconhecimento de nuance importante: existe caso legítimo em que é necessário varrer log para achar padrão. Mas existe forma melhor de fazer.

---

## 29. Protocolo correto de depuração por log

Este bloco é o contraponto direto ao item anterior e é o método validado.

**[Afirmado]** As etapas descritas na prática:

**Etapa 1: instrumentar.** A instrução dada ao modelo foi encher a aplicação de log, colocar log em todo o caminho da produção de cartão, mapear tudo.

**Etapa 2: deixar rodar.** A aplicação instrumentada roda por um dia inteiro em produção real.

**Etapa 3: exportar recorte.** O log do dia de um PDV específico é exportado. Foi usada a função de compartilhar e gerar relatório CSV, que produziu um arquivo de texto de vários megabytes.

**Etapa 4: entregar com contexto.** O arquivo foi colocado dentro do projeto e a instrução foi acompanhada de contexto: "lembra do problema que a gente estava conversando? Então, aqui está o log que você pediu".

**[Afirmado]** Resultado: o modelo encontrou o problema e explicou a condição exata em que ele ocorre.

**[Afirmado]** A diferença de método foi resumida assim: ele não precisa ficar procurando log, você já pega todos e entrega o recorte.

---

## 30. O bug encontrado: cartão não apresentado

**[Afirmado]** O problema real diagnosticado por esse método:

- O cliente chegava no terminal
- Selecionava débito
- Não apresentava o cartão
- Ia embora
- O sistema travava

**[Afirmado]** Por que era invisível: não havia tratamento para o caso de a transação de cartão ser cortada por esgotamento de tempo sem apresentação. E acontecia aproximadamente uma vez por semana, o que torna a reprodução manual inviável.

**[Afirmado]** A reflexão feita: "como que eu ia descobrir uma coisa dessas? Se eu estivesse lá vendo o dia inteiro talvez eu pegasse, mas acontecia uma vez na semana".

**[Afirmado]** Correção implementada: agora o sistema exibe mensagem de tempo esgotado e cartão não apresentado, encerra a apresentação e retorna à tela inicial.

**[Aplicação Avraham]** Bug intermitente não se resolve olhando a tela. Instrumentação não é polimento final, é pré-requisito para que o diagnóstico seja possível.

---

## 31. Alertas por nível

**[Afirmado]** Existe configuração de alerta por nível de log. Foi mostrado ao vivo um filtro por nível de erro.

**[Afirmado]** O alerta recebido contém identificação do equipamento e a mensagem, no exemplo "transação abortada".

**[Afirmado]** A notificação chega ativamente, sem necessidade de consulta.

**[Inferido]** O conjunto mínimo de campos para que um alerta seja acionável: evento, equipamento ou tenant, mensagem e identificador de correlação.

---

## 32. Fork da Evolution API

**[Afirmado]** Existe um fork próprio da Evolution API, com quatro correções de bug feitas internamente. A versão padrão não é mais usada.

**[Afirmado]** Bug principal corrigido: quando chegava um arquivo ou documento e a mensagem era enviada para o storage, ocorria falha.

**[Afirmado]** O processo de correção foi relatado em detalhe:

1. O modelo foi instruído a resolver
2. Encontrou o problema e propôs a correção
3. Verificou o repositório público e identificou que já existia uma issue aberta sobre o mesmo bug, não corrigida
4. Identificou que alguém havia proposto uma correção que não foi aceita
5. Comparou as duas abordagens e concluiu que parte da solução externa era melhor
6. Mesclou as duas abordagens

**[Afirmado]** Resultado: subiu e nunca mais deu problema.

**[Afirmado]** Segundo caso resolvido no mesmo fork: o problema de desconexão associado à solicitação de código de bloqueio por PIN. Foi implementada solução, com reconhecimento de que envolveu contorno técnico, mas funcionou.

**[Afirmado]** Avaliação final: "coisa que é impossível você resolver sozinho na mão, ele resolve, é absurdo".

**[Aplicação Avraham]** Diretamente aplicável à nossa infraestrutura de WhatsApp. Manter fork próprio com correções internas é vantagem competitiva real e reduz dependência de terceiro.

---

# PARTE 3: GESTÃO OPERACIONAL

Bloco extraído da conversa paralela sobre a operação física. Contém princípios de gestão que se aplicam integralmente à operação comercial e de projetos.

## 33. O que não está registrado não existe

**[Afirmado]** Situação relatada: um colaborador combina algo verbalmente, não registra, e depois cobra o resultado como se estivesse acordado.

**[Afirmado]** A postura adotada como padrão de gestão: pedir a prova. As perguntas feitas foram "cadê a prova que ele combinou", "onde você mandou essa mensagem", "deixa eu ver onde você combinou isso".

**[Afirmado]** O princípio declarado: ninguém tem bola de cristal e ninguém adivinha. Se não foi comunicado de forma verificável, a expectativa não é legítima.

**[Aplicação Avraham]** Vale integralmente para escopo de projeto, alteração de entrega e prazo com cliente. Acordo verbal em call vira registro escrito na mesma hora, ou não existe.

---

## 34. Escalonamento de problema para o responsável

**[Afirmado]** Postura descrita ao lidar com o problema da ferramenta pneumática quebrada em meio à produção: não parar a produção para resolver pessoalmente, e sim escalar para quem tem a responsabilidade, deixando a decisão explícita.

**[Afirmado]** A formulação da escolha entregue: ou você resolve isso, ou você fica aqui executando a tarefa manual e eu vou resolver. Escolha.

**[Afirmado]** Sequência de diagnóstico proposta, que é um bom exemplo de decomposição de problema:

1. Ligar para o fabricante da pistola e perguntar qual a pressão de trabalho especificada
2. Ligar para o fornecedor do compressor e perguntar em quantos bar ele está regulado
3. Confrontar os dois números
4. Se houver divergência, o compressor precisa ser regulado
5. Em paralelo, identificar onde é feita a manutenção da ferramenta

**[Inferido]** Método replicável: quando um componente falha repetidamente, o problema pode não estar no componente. Verificar o parâmetro de entrada antes de trocar a peça.

---

## 35. Praticidade em decisão de baixo valor

**[Afirmado]** Diante do impasse sobre consertar ou comprar, a decisão foi objetiva: pegar o cartão, comprar outra e resolver.

**[Afirmado]** O raciocínio: já se gastou um valor, será necessário gastar mais, e isso é custo de aprendizado.

**[Afirmado]** A conclusão sobre estilo de gestão com esse perfil de colaborador: "tem que ser prático com ele, não adianta".

**[Aplicação Avraham]** Decisão de baixo valor com produção parada não merece deliberação longa. O custo de parar supera o custo do item.

---

# PARTE 4: SÍNTESE APLICÁVEL

## Os quinze pontos para levar para dentro da operação

1. A camada documental é o ativo. O `CLAUDE.md` e os documentos de arquitetura definem tudo o que vem depois.
2. Template de projeto é ativo estratégico, não produto para venda.
3. Opus planeja e especifica. Sonnet executa. Erro de planejamento se propaga, erro de execução se corrige.
4. Subagente roda em contexto isolado. Revisão custou 1 por cento contra 29 por cento da janela principal.
5. Janela permanente é o antipadrão mais caro. Uma janela por unidade de trabalho.
6. Token de saída é o que custa. Prompt excessivamente detalhado induz resposta longa e queima orçamento.
7. Trava mecânica vale mais que disciplina. Sem commit na main, `git push` como ponto de parada humana.
8. Suíte de testes é trava real. 2.200 testes em nove minutos é o preço de saber que nada quebrou.
9. Achado de revisão é hipótese. Confirmar no código antes de corrigir.
10. Regra dos três ciclos. Se não resolveu em três tentativas, escala capacidade ou muda de estratégia. Não faz 33.
11. Design nasce de entrevista, vira componente real e vira fonte única. Não de referência visual solta.
12. Instrumentar, deixar rodar, recortar, correlacionar. Nunca entregar log bruto ao modelo.
13. Padronizar stack. Trocar tecnologia só com métrica de saturação documentada.
14. Avaliar plataforma gerenciada por latência, degrau de custo e topologia, não por marketing nem por medo.
15. O multiplicador tem sinal. Sobre fundação correta multiplica resultado. Sobre déficit técnico multiplica problema.

## Oportunidades comerciais identificadas nas duas conversas

| Oportunidade | Evidência na conversa | Ticket indicado |
|---|---|---|
| Resgate de sistema construído sem arquitetura | Dois clientes procuraram espontaneamente | Acima de R$40 mil |
| SaaS de nicho com white label para a rede do cliente | Caso lava jato com franquia e distribuição em seis cidades | Implantação mais recorrência |
| Diagnóstico de custo e latência de infraestrutura | Degrau de plano e latência geográfica | Consultoria pontual |
| Instrumentação e observabilidade de sistema em produção | Caso do cartão não apresentado | Projeto de curto prazo |
| Governança de desenvolvimento assistido por IA | Template, travas, agentes, quality gates | Consultoria mais implantação |
