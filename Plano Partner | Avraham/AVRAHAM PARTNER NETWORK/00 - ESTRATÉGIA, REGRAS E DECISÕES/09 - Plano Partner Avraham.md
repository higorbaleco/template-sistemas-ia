# Memória de construção do Plano Partner Avraham

> **Status:** referência histórica extensa. As decisões atuais de arquitetura, nomenclatura e jornada estão em [Arquitetura canônica do Partner Network](12%20-%20Arquitetura%20can%C3%B4nica%20do%20Partner%20Network.md). Menções à Z-API, Della e categorias anteriores não devem ser tratadas como regra vigente.

A estrutura que faz mais sentido é separar **duas modalidades de parceria**, porque a lógica econômica é diferente: **indicação/comissionamento** e **revenda/preço parceiro**.

E existe uma terceira construção paralela, que considero essencial: transformar a implantação de IA em um produto de **implantação + operação recorrente**, para a receita não morrer depois do projeto inicial.

## 1. Modelo A: Parceiro de Indicação

Aqui o cliente é da Avraham. A Avraham faz contrato, cobrança, implantação, suporte e relacionamento. O parceiro é remunerado de acordo com o quanto efetivamente participou da venda.

Eu estruturaria assim:

|Categoria|Participação do parceiro|Comissão sugerida|
|---|---|---|
|**Indicação**|Apresenta o potencial cliente e abre a porta|**20%**|
|**Indicação Qualificada**|Faz a ponte, contextualiza necessidade, valida interesse e coloca decisores na conversa|**25%**|
|**Venda Pronta**|Cliente já entendeu solução, escopo, investimento e quer contratar|**30%**|

Isso resolve um problema importante: não pagar 30% para alguém que simplesmente enviou um telefone, mas também recompensar muito bem quem praticamente fez a venda por vocês.

E os 20% estão bastante alinhados ao mercado. Pesquisa recente com 556 programas encontrou mediana de 20% para referral, enquanto a Pipedrive trabalha atualmente com 20% no nível inicial e 30% em um nível superior.

Inclusive, a HubSpot informa participação de 20% para negócios originados por parceiros.

Então eu **não diminuiria os 20%**. É competitivo sem parecer algo fora da realidade.

### Só colocaria uma regra importante

A comissão não deveria ser calculada sobre qualquer dinheiro que transite na operação.

Criaria o conceito de:

> **Receita Elegível para Comissão**

Ou seja:

**Valor pago pelo cliente pelos serviços da Avraham**, descontando itens que simplesmente são repassados para terceiros, como mídia, créditos, licenças específicas, taxas, fornecedores e outros custos expressamente repassáveis.

Isso é particularmente importante em IA.

Se vocês vendem:

|Componente|Valor|
|---|---|
|Implantação IA|R$ 6.000|
|Créditos/ferramenta|R$ 500|
|Gestão mensal|R$ 2.000|

Não faz sentido pagar 30% sobre os R$ 500 se esse valor praticamente inteiro está indo para infraestrutura.

A comissão incide sobre aquilo em que existe margem real.

---

# 2. E eu adicionaria recorrência ao parceiro

Aqui começa a ficar mais interessante.

Hoje o parceiro pensa:

> "Indiquei. Ganhei. Acabou."

Quero que ele pense:

> "Quanto mais clientes eu colocar para dentro e quanto mais tempo eles ficarem, maior minha carteira."

Só que eu não pagaria necessariamente 20% ou 30% eternamente sobre uma operação de serviço.

Minha primeira arquitetura seria:

|Receita|Parceiro|
|---|---|
|Implantação|20%, 25% ou 30%|
|Mensalidade operacional|**10% durante 12 meses**|
|Expansões / novos projetos|Nova comissão conforme participação|

Exemplo:

**Cliente**

- Implantação: R$ 6.000
- Mensalidade: R$ 2.000
- Permanência: 12 meses

Parceiro que trouxe uma venda praticamente pronta:

**Implantação**

30% de R$ 6.000 = **R$ 1.800**

**Recorrência**

10% × R$ 2.000 × 12 = **R$ 2.400**

**Total potencial do parceiro naquele cliente: R$ 4.200.**

Agora imagine um parceiro construindo uma carteira de 10, 20, 30 empresas.

Começa a virar um canal de negócios de verdade.

---

# 3. Modelo B: Parceiro Revendedor

Aqui é completamente diferente.

Esse é exatamente o parceiro que diz:

> "Me passa o preço que é seu e eu coloco minha margem."

Nesse caso eu **não daria comissão**.

Ele recebe um **preço parceiro/atacado**.

Exemplo:

|Produto|Preço Parceiro|Preço sugerido|Margem potencial|
|---|---|---|---|
|Implantação IA|R$ 5.000|R$ 7.500|R$ 2.500|
|Operação IA|R$ 1.500/mês|R$ 2.500/mês|R$ 1.000/mês|
|Automação avançada|R$ 4.000|R$ 6.000|R$ 2.000|

O parceiro poderia vender:

**R$ 8.000, R$ 10.000, R$ 12.000...**

É problema dele.

A Avraham recebe os R$ 5.000 contratados e executa.

Esse modelo é especialmente forte para:

agências, consultorias, software houses, empresas de marketing, vendedores independentes, BPO comercial, integradores, empresas de CRM e pessoas que já possuem carteira de clientes.

### A diferença fundamental fica assim

||Indicação|Revenda|
|---|---|---|
|Quem define preço|Avraham|Parceiro|
|Quem fecha|Avraham|Parceiro|
|Quem cobra cliente|Avraham|Pode ser parceiro|
|Quem executa|Avraham|Avraham|
|Ganho parceiro|Comissão|Spread/margem|
|Pode aumentar preço|Não|Sim|
|Risco comercial|Avraham|Parceiro|
|Relacionamento|Avraham|Pode ser do parceiro|
|White label|Não necessariamente|Pode existir|

Eu chamaria algo como:

**Avraham Referral Partner**

e

**Avraham Reseller Partner**

Não precisa usar esses nomes comercialmente depois, mas conceitualmente essa separação precisa existir.

---

# 4. O maior problema atual não é o programa de parceiros

É o produto recorrente.

Esse ponto que você falou do GPT Maker é central.

Se vocês venderem:

> "Nossa IA custa R$ 2.000 por mês."

e o cliente descobrir que a licença da tecnologia custa R$ 200, R$ 300, R$ 500 ou qualquer coisa nessa linha, ele inevitavelmente vai perguntar:

> "Por que estou pagando R$ 2.000?"

A resposta **não pode ser porque a Avraham tem acesso ao GPT Maker**.

O GPT Maker precisa ser infraestrutura.

O produto de vocês deve ser outra coisa.

## Eu criaria uma camada chamada provisoriamente de:

# Operação Gerenciada de IA

A composição comercial passaria a ser:

|Camada|O que o cliente está comprando|
|---|---|
|**Implantação**|Construção da operação|
|**Infraestrutura**|Plataforma + consumo/créditos|
|**Operação Gerenciada**|Evolução contínua da IA|

Essa terceira camada é o que justifica a mensalidade.

---

# 5. O que existe dentro da mensalidade

A mensalidade precisa ter trabalho perceptível e mensurável.

Não pode ser:

> "Suporte da IA."

Isso soa como manutenção de algo que deveria funcionar.

Tem que ser algo semelhante a:

|Entregável recorrente|Função|
|---|---|
|Monitoramento das conversas|Identificar erros e oportunidades|
|Auditoria das respostas|Ver respostas inadequadas ou incompletas|
|Otimização dos prompts|Melhorar comportamento do agente|
|Atualização da base|Produtos, preços, políticas, informações|
|Treinamento contínuo|Incorporar novos cenários|
|Análise de objeções|Entender o que clientes estão perguntando|
|Otimização comercial|Melhorar qualificação e conversão|
|Novos fluxos|Adicionar comportamentos conforme necessidade|
|Integrações|Manter operação funcionando|
|Testes periódicos|Validar comportamento da IA|
|Relatórios|Apresentar volume, desempenho e oportunidades|
|Reunião de acompanhamento|Decidir próximos ajustes|
|SLA|Atendimento prioritário|
|Gestão de consumo|Controlar créditos e utilização|

Aí muda completamente a percepção.

O cliente não paga R$ 2.000 por um acesso que custa R$ 300.

Ele eventualmente paga:

**R$ 300 de infraestrutura**

**R$ 1.700 de operação especializada.**

É muito mais defensável.

---

# 6. E existe outra vantagem

Vocês não precisam esconder GPT Maker.

Eu evitaria construir a estratégia inteira em cima de:

> "Precisamos evitar que o cliente descubra quanto custa a ferramenta."

Isso cria fragilidade.

A melhor posição é:

> "Essa é uma das tecnologias que utilizamos. Nosso trabalho está na arquitetura, implementação, treinamento, integração, acompanhamento e evolução da sua operação."

Isso inclusive diminui o poder de comparação.

O cliente pode comprar a ferramenta diretamente? Pode.

Mas vai precisar construir tudo.

É semelhante a comprar um CRM e achar que comprou uma operação comercial pronta.

---

# 7. Como eu montaria o ecossistema inteiro

Aqui começa a aparecer uma estrutura de ecossistema inspirada em padrões estudados como referência histórica (ver [Referência histórica Z-API](11%20-%20Refer%C3%AAncia%20hist%C3%B3rica%20Z-API%20-%20Aprendizados.md)), adaptada ao desenho atual da Avraham.

### Entrada

**Parceiro escolhe sua modalidade**

**A. Quero apenas indicar clientes**

→ Referral Partner

**B. Quero vender a solução para meus próprios clientes**

→ Reseller Partner

### Referral

Lead → Registro da oportunidade → Classificação da participação → Avraham vende → Avraham entrega → Parceiro recebe comissão → Cliente entra na recorrência → Parceiro recebe participação recorrente.

### Reseller

Cliente do parceiro → Parceiro monta proposta → Compra Avraham pelo preço parceiro → Avraham executa → Parceiro cobra seu cliente → Parceiro fica com o spread → Receita recorrente para ambos.

---

# 8. Tem uma regra que eu considero obrigatória

Criaria **registro de oportunidade**.

O parceiro manda:

**Empresa + contato + oportunidade + data.**

A partir dali, aquele cliente fica protegido por um período, por exemplo 90 dias.

Isso evita:

"Eu indiquei primeiro."

"Esse cliente já estava falando com vocês."

"Foi minha indicação."

"Eu apresentei o cara seis meses atrás."

Também colocaria no regulamento que comissão é calculada **sobre valores efetivamente recebidos**, nunca simplesmente sobre contrato assinado.

Se o cliente parcelar R$ 10.000 em 5 vezes, o parceiro recebe sua proporção conforme a Avraham recebe.

---

# 9. Eu faria ainda uma pequena mudança no 20% / 25% / 30%

Não usaria volume para determinar esses três percentuais inicialmente.

Usaria **participação na oportunidade**.

Isso é mais justo:

**20% | Referral**

"Eu conheço alguém que precisa disso."

**25% | Qualified Referral**

"Falei com ele, sei do problema, ele quer conversar, já passei contexto e marquei a reunião."

**30% | Ready Deal**

"Conversei, apresentei, preço está alinhado e o cliente quer contratar."

Depois criamos outra dimensão separada chamada **Tier do parceiro**, baseada em performance.

Por exemplo:

|Tier|Critério hipotético|Benefício|
|---|---|---|
|Partner|Entrada|Condições padrão|
|Silver|3 vendas/trimestre|Materiais + prioridade|
|Gold|5 vendas/trimestre|Melhor condição|
|Black|10+ vendas/trimestre|Condição negociada|

Assim não confundimos **qualidade de uma oportunidade** com **importância daquele parceiro para o canal**.

Isso é exatamente parecido com programas maduros: Pipedrive, por exemplo, diferencia níveis de parceiros e hoje publica 20% e 30% conforme o nível e desempenho.

---

## A arquitetura que eu adotaria

**AVRAHAM PARTNER PROGRAM**

```
                         AVRAHAM PARTNER
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
          REFERRAL PARTNER             RESELLER PARTNER
                 │                           │
       Indica oportunidades           Vende sua própria oferta
                 │                           │
        20% | 25% | 30%              Preço parceiro Avraham
                 │                           │
       + recorrência opcional           + margem livre
                 │                           │
                 └─────────────┬─────────────┘
                               │
                      AVRAHAM ENTREGA
                               │
                               ▼
                  IMPLANTAÇÃO + OPERAÇÃO
                               │
                   ┌───────────┴──────────┐
                   │                      │
               SETUP                 RECORRÊNCIA
                   │                      │
            Receita pontual        Receita previsível
```

E eu considero esse último bloco o mais importante.

O programa de parceiros **resolve aquisição**.

A Operação Gerenciada de IA **resolve LTV e previsibilidade**.

Juntos, os dois transformam o modelo de:

**"conseguir projeto → implantar → procurar outro cliente"**

para:

**"parceiro traz carteira → implantamos → carteira gera MRR → parceiro continua trazendo → base cresce."**

Esse é o desenho que eu usaria como base para agora construirmos **as regras financeiras, preços de atacado, comissões, mensalidade, níveis de parceiro e unit economics**, porque antes de publicar 20%, 25% e 30%, precisamos garantir quanto sobra para a Avraham em cada combinação.


------

## Registro inicial — Programa de Partners Avraham

Estes são os **11 partners já definidos para participar do programa**:

|#|Partner|Status inicial|
|---|---|---|
|1|Datlo|Participante inicial|
|2|Carlinhos Speed|Participante inicial|
|3|João Felipe|Participante inicial|
|4|Will Machado|Participante inicial|
|5|Gabriel Mori|Participante inicial|
|6|Felipe Preciso|Participante inicial|
|7|Heitor|Participante inicial|
|8|Otoni|Participante inicial|
|9|Cleberson|Participante inicial|
|10|Jofran|Participante inicial|
|11|Lucas Muniz|Participante inicial|

**Samuel** fica registrado como um dos próximos nomes para inclusão após a validação inicial do modelo.

### Hipótese inicial do canal

A primeira meta de atividade fica:

**11 partners × 1 indicação qualificada/mês = 11 indicações/mês.**

Considerando conversão de aproximadamente **30%**:

**11 indicações × 30% = 3,3 vendas/mês.**

Com ticket médio de **R$ 4.000**:

- Conservador, arredondando para **3 vendas:** R$ 12.000/mês.
- Pela média matemática de **3,3 vendas:** R$ 13.200/mês.

Portanto, os **R$ 12 mil/mês** funcionam bem como uma primeira referência conservadora.

## Meta que realmente começa a mudar o jogo

A meta do canal deveria ser chegar a aproximadamente:

**10 vendas/mês × R$ 4.000 = R$ 40.000/mês.**

Se mantivermos conversão de **30%**, para gerar essas 10 vendas precisamos de aproximadamente:

**34 indicações qualificadas/mês.**

Isso mostra uma coisa importante: **não basta apenas aumentar a quantidade de partners**. Precisamos trabalhar duas alavancas simultaneamente:

**Mais partners ativos + mais indicações por partner.**

Com os 11 atuais, por exemplo, para chegar próximo das 34 oportunidades seriam necessárias cerca de **3 indicações por partner/mês**.

Então eu estruturaria as metas futuras em três níveis:

|Indicador|Inicial|Saudável|Meta|
|---|---|---|---|
|Partners ativos|11|20|30–35|
|Indicações/partner/mês|1|1–2|2–3|
|Indicações totais|11|20–30|34+|
|Conversão|30%|30%|30%+|
|Vendas|3|6–9|10+|
|Receita a R$4 mil|R$ 12 mil|R$ 24–36 mil|**R$ 40 mil+**|

E esse programa precisa ser tratado como **um canal comercial de verdade**, não apenas como uma lista de pessoas que eventualmente indicam: cada partner terá cadastro, meta, histórico de oportunidades, vendas originadas, comissão gerada, frequência de indicação e acompanhamento.

-----
## O programa precisa vender uma ideia muito simples

> **“Eu apresento uma empresa para o Higor. A equipe dele faz diagnóstico, reunião, proposta, fechamento, implantação e suporte. Eu não tenho dor de cabeça e ainda ganho dinheiro quando o negócio acontece.”**

Isso muda completamente a percepção de “afiliado”.

O partner não está vendendo um link. Ele está **monetizando a própria rede de relacionamento** utilizando a estrutura comercial e técnica da Avraham.

### A proposta de valor para o Partner

Eu usaria algo próximo disto como essência do programa:

**Você conecta. Nós fazemos o resto. Você participa da receita.**

Ele não precisa aprender GPT Maker, automação, IA, integrações, tráfego, listas ou nossos produtos. Não precisa montar proposta. Não precisa cobrar cliente. Não precisa fazer implantação. Não precisa prestar suporte.

O trabalho dele é basicamente perceber:

**“Esse empresário precisa falar com o Higor.”**

E fazer a introdução.

---

# 1. Não criaria apenas uma comissão. Criaria uma “Carteira Partner”

Esse é um dos elementos que pode tornar o programa realmente desejável.

Quando o partner indica uma empresa, aquela conta entra na **Carteira Partner dele** por determinado período.

Exemplo:

> Gabriel Mori indicou a empresa XPTO.

Ela começa contratando uma implementação de IA por **R$ 4.000**.

Mas quatro meses depois compra automação por R$ 3.000.

Depois contrata acompanhamento mensal.

Depois compra outro projeto.

O Gabriel não deveria pensar:

> “Ganhei uma comissão naquela venda.”

Ele deveria pensar:

> **“Essa empresa está na minha carteira Avraham.”**

Isso muda completamente o incentivo.

### Exemplo de proteção

**Conta protegida por 12 meses.**

Durante esse período, determinados novos projetos vendidos para aquela empresa continuam gerando participação para o partner.

A sensação passa a ser:

> “Quanto mais empresas boas eu colocar dentro da Avraham, maior vai ficando minha carteira.”

Aí começamos a criar o comportamento que queremos.

---

# 2. Modelo inicial de remuneração

Não fecharia os percentuais definitivos antes de cruzarmos isso com o DRE e margem de cada produto.

Mas, como estrutura inicial, gosto muito deste modelo:

|Nível|Requisito|Comissão inicial|Benefício recorrente|
|---|---|---|---|
|**Partner**|Entrou no programa|10%|Participação em novos projetos da conta|
|**Partner Pro**|3 oportunidades qualificadas/trimestre|15%|Carteira protegida + vantagens|
|**Partner Elite**|3+ vendas em 90 dias|**20%**|Carteira protegida + prioridade + benefícios exclusivos|

Então um parceiro começa pensando:

**1 venda de R$4.000 = R$400**

Mas rapidamente percebe:

**3 vendas de R$4.000 = R$1.800**, se estiver no nível de 15%.

No Elite:

**3 vendas de R$4.000 = R$2.400.**

E se ele tiver clientes comprando outros serviços posteriormente, existe potencial adicional.

É aí que nasce:

> **“Ser partner do Higor coloca dinheiro no meu bolso.”**

---

# 3. A recorrência do programa não pode depender apenas de boa vontade

Esse ponto é fundamental.

Não queremos 50 “partners cadastrados”.

Queremos **partners ativos**.

Por isso colocaria uma regra simples:

|Situação|Critério|
|---|---|
|Partner Ativo|Pelo menos 1 oportunidade qualificada/mês ou 3/trimestre|
|Partner Pro|3+ oportunidades qualificadas/trimestre|
|Partner Elite|3+ vendas nos últimos 90 dias|
|Partner Inativo|90 dias sem indicação|
|Reativação|Nova oportunidade qualificada|

Isso não significa expulsar ninguém.

Significa que algumas **vantagens exclusivas dependem de atividade**.

Com isso conseguimos cobrar sem parecer:

> “Cadê minha indicação?”

A conversa passa a ser:

> “Will, vi que você está a uma oportunidade de manter o Pro neste trimestre. Tem alguém da sua rede que faça sentido analisarmos?”

Completamente diferente.

---

# 4. O Partner precisa ter benefícios que dinheiro sozinho não entrega

Comissão é importante, mas não é suficiente.

Um partner forte deveria possuir acesso a coisas que um cliente ou conhecido comum não possui.

|Benefício|Partner comum|Pro|Elite|
|---|---|---|---|
|Comissão diferenciada|✓|✓|✓|
|Carteira de clientes protegida|✓|✓|✓|
|Canal direto com vocês|✓|✓|✓|
|Prioridade comercial para indicados||✓|✓|
|Diagnóstico gratuito para indicados||✓|✓|
|Condições especiais para clientes||✓|✓|
|Materiais comerciais exclusivos|✓|✓|✓|
|Participação em oportunidades conjuntas||✓|✓|
|Leads/oportunidades em parceria|||✓|
|Projetos white-label/co-branding|||✓|
|Acesso antecipado a novos produtos||✓|✓|
|Reuniões estratégicas privadas|||✓|

Aí estamos criando **status + dinheiro + oportunidade**.

---

# 5. E o indicado também precisa ganhar

Essa parte é muito importante.

O partner precisa poder dizer:

> “Vou te apresentar o Higor porque você entra por mim e tem algumas condições diferentes.”

Não necessariamente desconto.

Inclusive, eu evitaria transformar isso em guerra de preço.

Criaria um pacote chamado, por exemplo:

### Partner Fast Track

Empresas indicadas por partners recebem:

**Diagnóstico Executivo de Atendimento e IA**, prioridade de agenda, reunião estratégica, desenho inicial da oportunidade e uma condição/benefício exclusivo caso o projeto avance.

Podemos criar algo tangível de alto valor percebido, por exemplo:

**Mapa de Oportunidades de IA e Automação**

Mostrando:

Atendimento atual → gargalos → tarefas automatizáveis → oportunidades de IA → integrações → estimativa de impacto → roadmap recomendado.

Isso pode ser vendido normalmente como um diagnóstico de, por exemplo, **R$1.500–R$3.000**, mas ser oferecido gratuitamente ou parcialmente como benefício das empresas indicadas pelos partners.

Então o parceiro não está dizendo:

> “Compra deles para eu ganhar comissão.”

Ele está dizendo:

> **“Tenho acesso a uma condição que normalmente você não teria.”**

Isso protege a confiança dele.

---

# 6. O processo precisa ser absurdamente fácil

Eu faria o partner ter praticamente **zero fricção**.

### Fluxo

**Partner identifica oportunidade**

↓

**Envia nome + empresa + telefone**

↓

**Faz uma introdução simples**

> “Fulano, estou te conectando com o Higor. Ele e o time trabalham justamente com essa parte de IA/automação que te comentei.”

↓

**Acabou o trabalho do partner.**

A Avraham assume:

**Diagnóstico → reunião → levantamento → proposta → follow-up → fechamento → implantação → suporte → cobrança.**

Partner acompanha apenas o status:

**Indicado → Reunião → Proposta → Fechado → Pago → Comissão disponível.**

---

# 7. Tem que existir transparência

Uma das maiores razões para programas de indicação morrerem é o parceiro não saber o que aconteceu.

Precisamos evitar:

> “E aquela empresa que indiquei?”

Por isso cada partner deveria ter uma espécie de extrato:

|Empresa|Status|Projeto|Receita|Comissão|
|---|---|---|---|---|
|Empresa A|Fechado|IA|R$4.000|R$600|
|Empresa B|Proposta|Automação|R$7.000|—|
|Empresa C|Reunião|IA|—|—|
|Empresa D|Fechado|Dados|R$2.500|R$375|

E mensalmente:

### Partner Statement

**Indicações:** 4  
**Vendas:** 2  
**Receita gerada:** R$11.000  
**Comissão:** R$1.650  
**Carteira ativa:** 7 empresas  
**Nível:** Partner Pro

Isso é muito mais poderoso que simplesmente fazer um PIX de vez em quando.

---

# 8. E eu criaria uma mecânica quase de “meta pessoal”

Não competição agressiva.

Mas progressão.

Por exemplo:

**Gabriel Mori — Partner Pro**

Meta do trimestre:

`████████░░ 8/10`

**8 oportunidades enviadas**  
**2 vendas realizadas**  
**R$1.800 acumulados**  
**Faltam 1 venda para Elite**

Isso ativa o pensamento:

> “Vou mandar mais uma empresa.”

É exatamente esse comportamento que queremos construir.

---

# 9. As regras também precisam proteger vocês

Algumas regras são indispensáveis:

|Regra|Política|
|---|---|
|Indicação válida|Empresa que não esteja em negociação ativa|
|Registro|Precisa ser registrada antes da abordagem comercial|
|Duplicidade|Vale o primeiro registro válido|
|Comissão|Calculada sobre valor efetivamente recebido|
|Cancelamento|Não existe comissão sobre valores devolvidos|
|Precificação|Somente Avraham pode negociar valores finais|
|Promessas|Partner não pode prometer funcionalidades/prazos|
|Entrega|Responsabilidade integral da Avraham|
|Suporte|Partner não é responsável pelo cliente|
|Proteção da conta|Ex.: 12 meses|
|Pagamento|Fechamento mensal, com data predefinida|

Isso evita uma quantidade enorme de problema depois.

---

# 10. O mais importante: mudar a linguagem

Eu não venderia:

> “Programa de indicação — ganhe até 20%.”

Isso soa como Hotmart.

Eu venderia:

# **Avraham Partner Network**

### Transforme relacionamentos em receita.

> Você conhece empresários que precisam vender mais, atender melhor ou automatizar processos.
> 
> Nós temos a estrutura para entregar.
> 
> Você faz a conexão.
> 
> **Nós cuidamos de todo o projeto e você participa da receita gerada.**

E Higor vira o rosto dessa relação:

> **“Meu objetivo é simples: se você colocar uma boa oportunidade na minha mesa, quero fazer você ganhar dinheiro e ainda sair bem com a pessoa que indicou.”**

Essa frase resume exatamente o programa.

---

## O efeito que precisamos provocar nesses 11

Depois de dois ou três meses, eu quero que Carlinhos, Gabriel, Will, João etc. pensem:

> **“Cara, tenho que lembrar do Higor quando converso com empresários. Toda vez que conecto alguém que precisa do que eles fazem, eles resolvem tudo e pinga dinheiro para mim.”**

Quando conseguirmos criar esse reflexo mental, deixamos de ter **11 pessoas que conhecem vocês** e começamos a ter **11 pequenos canais de aquisição distribuídos no mercado**.

E daí a meta deixa de ser simplesmente 1 indicação por partner.

Passa a ser construir uma base em que **30 partners ativos × 1–2 boas oportunidades/mês** produzam continuamente pipeline, vendas e recorrência.

------
E agora ficou muito claro: **o que estamos desenhando para a Avraham pode se inspirar na lógica documentada como referência histórica do Z-API Partner (ver documento 11) — adaptada a serviços, IA, automação e receita compartilhada, sem repetir nomes, categorias ou promessas de lá.**

No Z-API você não criou simplesmente “um programa de comissão”. Você estruturou **um canal comercial completo**. Existiam modelos diferentes de relacionamento — Internal Partner, Integrator e Partner Program — e o parceiro entendia exatamente **onde ele se encaixava, como ganhava dinheiro, quais eram suas responsabilidades e até onde podia escalar**.


Shoooww! O que nós precisamos criar agora na Avraham é um programa de Partner com o mesmo nível de ambição do que foi estudado como referência histórica no Z-API, mas desenhado para o nosso modelo... Então vamos ter que documentar todo esse conhecimento, modelos de sugestões de negócio, onde mexia no ego, onde mexia em status e percepção, onde mexia no bolso e onde mexia no relacionamento.


Eu sempre era lembrado pq o meu partner sempre recebia mimo, tinha vantagem, recebia presente de verdade e não brinde genérico. Recebia jantares vip, voucher, experiência, uma tábua personalizada foda pra churrasco, faca com teu próprio nome, ida e volta paga pra vir nos conhecer, experiência imersiva no Porto.... Coisas que geralmente as empresas não pensam... Era um relacionamento de amigo pra amigo. Mas a cobrança de Advogado pra cliente então sempre era muito bom


E havia outro componente que acho que precisamos literalmente trazer de volta:

> **jornada + metas + benefícios + progressão.**

O Partner não entrava e ficava abandonado. Existia um caminho: alinhamento → integração → acompanhamento técnico → validação → escala. Depois vinham metas de volume, prazos e evolução da parceria.

## O insight principal

No Z-API, o produto central era uma **API**.

Então a métrica que fazia sentido era:

**quantidade de instâncias.**

Na Avraham, nosso produto é diferente. Nós temos:

- Projetos de IA;
- agentes;
- automações;
- integrações;
- consultoria;
- implementação;
- acompanhamento recorrente;
- outros serviços complementares.

Logo, nossa “instância” agora precisa ser:

### **oportunidade / cliente / receita gerada.**

Essa é a equivalência de raciocínio, útil apenas como exercício de tradução — a tabela abaixo compara um padrão estudado como referência histórica (Z-API) com um rascunho de tradução para a Avraham; os nomes e a jornada vigentes da Avraham estão definidos na [Arquitetura canônica do Partner Network](12%20-%20Arquitetura%20can%C3%B4nica%20do%20Partner%20Network.md).

|Padrão histórico (Z-API)|Rascunho de tradução para a Avraham|
|---|---|
|Instância|Oportunidade qualificada|
|Instância ativa|Cliente fechado|
|Volume de instâncias|Receita originada|
|Desconto por escala|Comissão por nível|
|Token Partner|ID/Carteira Partner|
|Grupo com CTO/diretoria|Canal direto Avraham|
|Partner Silver etc.|Partner / Pro / Elite|
|Meta de crescimento|Meta trimestral|
|White-label|Co-branding / operação invisível|
|Monetização da API|Participação na receita|
|Cronograma de integração|Onboarding do Partner|

E tem uma coisa do material antigo que casa **perfeitamente** com o que estamos discutindo agora.

No Partner Program da Z-API, uma das grandes vantagens era permitir que o parceiro **monetizasse algo que antes era somente uma integração técnica**. O material literalmente separava quem apenas integrava de quem fazia parte do modelo Partner e poderia monetizar, trabalhar com condições diferenciadas e construir uma operação escalável.

É um padrão que podemos estudar para o desenho da Avraham, adaptado ao que já está definido na arquitetura canônica.

---

# Avraham Partner não pode ser “indique e ganhe 20%”

Esse seria o equivalente ao **Affiliate Partner** antigo.

É pequeno demais para o que queremos construir.

Quero que a estrutura tenha pelo menos **três formas de relacionamento**, igual fizemos naquela época:

### 01. Referral Partner

O cara conhece alguém.

Apresenta.

Sai da operação.

A Avraham vende, fecha, entrega, cobra e atende.

Ele recebe participação.

**Zero responsabilidade operacional.**

---

### 02. Solution Partner

Aqui começam agências, consultores, vendedores, software houses, especialistas etc.

Eles conseguem identificar oportunidades melhores.

Podem participar do diagnóstico ou da venda.

Podem colocar Avraham dentro de projetos próprios.

Podem trabalhar co-branding.

E têm remuneração superior.

---

### 03. Strategic Partner

Essa é a versão Avraham inspirada no que foi estudado como referência histórica no **Partner Program Z-API**, não uma cópia dele.

Não é só indicação.

É alguém que está deliberadamente construindo negócio conosco.

Tem:

**carteira de contas + comissão superior + recorrência + projetos conjuntos + prioridade + condições especiais + acesso ao time + metas + benefícios exclusivos.**

Pode até chegar a situações em que:

> o cliente é dele e a Avraham opera o projeto por trás.

Isso começa a parecer muito com o modelo White Label que existia no Partner Z-API.

---

## E tem outra coisa que vale estudar como referência histórica do Z-API

### Um Partner não entra no programa. Ele percorre uma jornada.

Olha a diferença psicológica.

Não:

> “Valeu, você é nosso parceiro. Quando tiver alguém, indica.”

Mas:

> **Você entrou no Avraham Partner Network.**
> 
> Agora existe um plano para transformarmos sua rede em uma nova fonte de receita.

E começa:

**D0 — Welcome / Alinhamento**

↓

**D1 — Perfil e oportunidades**

↓

**D7 — Primeira introdução**

↓

**D30 — Primeira meta**

↓

**D90 — Avaliação de nível**

↓

**Partner → Pro → Elite**

Isso já existia conceitualmente no Z-API: havia um cronograma de integração, metas em 7, 15, 30, 45/60 e 90 dias e progressão baseada em escala.

Só precisamos substituir **“integração técnica” por “ativação comercial”.**

---

# E acho que encontrei a frase que define o que queremos construir

O Partner Z-API era:

> **“Integre nossa infraestrutura ao seu negócio e monetize.”**

O Avraham Partner deveria ser:

> **“Coloque nossa estrutura comercial e técnica por trás da sua rede e monetize.”**

Essa é a diferença.

O cara não está vendendo Avraham.

Ele está usando **nossa máquina**.

Ele traz relacionamento.

Nós colocamos:

**especialista + diagnóstico + estratégia + comercial + proposta + negociação + tecnologia + implementação + suporte + cobrança.**

E devolvemos dinheiro para ele.

---

## Portanto, eu mudaria um pouco nosso raciocínio anterior

Aquele modelo que fizemos de **Carteira Partner + até 20% + Partner/Pro/Elite** está correto.

Mas ele ainda é **uma parte**.

O que precisamos construir agora é um programa com a mesma completude do **Z-API Partner Program**, hoje estudado como referência histórica, mas com nomes, categorias e regras próprios da Avraham:

1. **Modelo comercial**
2. **Categorias de Partner**
3. **Requisitos de entrada**
4. **Jornada de ativação**
5. **Metas 30/60/90 dias**
6. **Progressão Partner → Pro → Elite**
7. **Carteira protegida**
8. **Regras de atribuição**
9. **Comissionamento**
10. **Recorrência**
11. **Benefício para o indicado**
12. **Benefício para o Partner**
13. **Materiais comerciais**
14. **Portal/área do Partner**
15. **Partner Statement**
16. **Pipeline compartilhado**
17. **Scripts de introdução**
18. **Treinamento mínimo**
19. **Co-branding / white-label**
20. **Regras de inatividade**
21. **Playbook operacional interno**
22. **Playbook do Partner**
23. **Dashboard de metas**
24. **Processo financeiro**
25. **Automação de todo o programa**

E depois entramos naquela parte que você comentou anteriormente:

----
E tem um ponto importante: **os PDFs antigos documentam muito bem a mecânica do programa — jornada, integração, metas, escalonamento, tipos de parceria, white-label, responsabilidades etc. — mas não documentam suficientemente a parte mais valiosa: a psicologia e o relacionamento que fazia o Partner funcionar.**

Essa parte precisa virar propriedade intelectual da Avraham.

# Avraham Partner OS

Eu criaria um documento-mãe, quase como o **sistema operacional do programa**, dividido em quatro grandes alavancas:

> **Ego + Status + Bolso + Relacionamento**

E uma quinta camada transversal:

> **Cobrança e compromisso.**

Porque o segredo não era “ser legal com o parceiro”.

Era:

> **Relacionamento quente. Operação fria.**

Amigo para amigo no relacionamento.

Advogado para cliente na cobrança.

---

# 1. Ego

Aqui não estamos falando de bajulação.

Estamos falando de fazer o parceiro perceber:

> **“Eu sou importante para essa empresa.”**

Isso muda completamente a relação.

Algumas coisas que mexem com ego positivamente:

- chamar o parceiro para uma conversa estratégica antes dos demais;
- pedir opinião dele sobre novos produtos;
- mostrar que determinada decisão foi influenciada por uma sugestão dele;
- reconhecer publicamente uma conquista;
- convidá-lo para participar de algo reservado;
- conversar diretamente com fundador/diretoria;
- fazê-lo perceber que não é “mais um afiliado”.

Exemplo:

> “Antes de lançarmos isso oficialmente, queria te mostrar porque você é um dos parceiros que mais entende esse perfil de cliente.”

Isso custa praticamente zero.

Mas vale muito.

---

# 2. Status e percepção

Essa talvez seja uma das coisas mais poderosas.

O Partner precisa sentir:

> **“Eu tenho acesso a coisas que outras pessoas não têm.”**

Não adianta chamar de Elite e entregar um grupo de WhatsApp.

Status precisa ser **visível e concreto**.

### Exemplos

**Partner**

- acesso ao programa;
- materiais;
- comissão;
- carteira protegida.

**Partner Pro**

- prioridade comercial;
- canal reservado;
- condições diferenciadas;
- eventos privados;
- materiais antecipados.

**Partner Elite**

- contato direto com liderança;
- experiências presenciais;
- viagens;
- encontros privados;
- oportunidades conjuntas;
- prioridade máxima;
- benefícios personalizados.

E podemos ter experiências que reforçam isso:

> **Partner Dinner**

> **Avraham Private Table**

> **Partner Day**

> **Founders Dinner**

> **Avraham Experience**

O parceiro precisa conseguir contar para alguém:

> “Cara, sou Partner da Avraham. Semana passada fui jantar com eles.”

Isso gera percepção.

---

# 3. Bolso

Essa é a parte racional.

O parceiro precisa conseguir fazer a conta muito rapidamente:

> **“Conhecer o Higor me gera dinheiro.”**

E não pode ser aquele negócio:

> “Indiquei uma vez e ganhei R$300.”

Tem que existir construção de patrimônio dentro do programa.

Por isso gosto muito da ideia da:

# Carteira Partner

Ele coloca empresas dentro da Avraham.

Essas contas permanecem vinculadas a ele por determinado período.

Depois começa a pensar:

> “Tenho 12 empresas na minha carteira.”

E não:

> “Já fiz quatro indicações.”

Isso muda tudo.

Podemos ter:

- comissão inicial;
- comissão recorrente;
- comissão sobre novos projetos;
- bônus por meta;
- aceleradores;
- campanhas;
- premiações;
- revenue share em alguns produtos.

O programa começa a parecer um **canal de receita pessoal**.

---

# 4. Relacionamento

Aqui está provavelmente a parte que mais fazia você ser lembrado.

A maioria das empresas pensa:

> Partner = e-mail + portal + comissão.

Você fazia:

> Partner = relacionamento.

E principalmente:

# presente de verdade.

Não:

- caneta;
- copo;
- camiseta;
- chaveiro;
- brinde com logo.

Mas coisas que alguém realmente gostaria de ganhar.

### Exemplos que você já usava

- jantar VIP;
- voucher;
- experiências;
- tábua personalizada para churrasco;
- faca personalizada com o nome;
- viagem paga;
- ida e volta para conhecer a empresa;
- imersão;
- experiência no Porto.

Isso cria uma diferença enorme.

Uma faca gravada:

> **“Gabriel Mori”**

é dele.

Uma faca escrita:

> **“Avraham Digital”**

é propaganda da Avraham.

Essa diferença parece pequena, mas psicologicamente é enorme.

---

# 5. A regra dos presentes

Eu transformaria isso em política interna.

## Não enviar brindes. Criar memórias.

Todo presente deveria passar por pelo menos um destes critérios:

### Personalização

Tem o nome, gosto, história ou personalidade daquela pessoa.

### Utilidade

É algo que ela realmente usaria.

### Experiência

Gera uma lembrança.

### Exclusividade

Não é algo entregue para 200 pessoas.

### Timing

Chega em um momento inesperado.

Essa última é muito importante.

Não mandar presente apenas no Natal.

Mandar porque:

> fechou a primeira venda.

> bateu R$10 mil em comissão.

> completou um ano conosco.

> indicou um cliente importante.

> teve um filho.

> inaugurou escritório.

> comentou numa conversa que gosta de churrasco.

Aí o relacionamento começa a parecer humano.

---

# 6. Sistema de inteligência do Partner

E aqui podemos ir muito além do que existia no Z-API.

Ter uma ficha interna de cada parceiro.

### Partner Profile

**Nome:** Gabriel Mori  
**Empresa:** X  
**Aniversário:** —  
**Família:** —  
**Hobbies:** churrasco / vinho / corrida  
**Time:** —  
**Cidade:** —  
**Restaurantes:** —  
**Viagens:** —  
**Preferências:** —  
**Último presente:** —  
**Último encontro:** —  
**Última indicação:** —  
**Comissão acumulada:** —  
**Carteira:** —  
**Nível:** Pro  
**Próxima ação:** jantar / ligação / presente / reunião

Isso vira quase um **CRM de relacionamento**, não apenas CRM comercial.

---

# 7. Surpresa é parte da estratégia

Tem uma coisa muito importante no que você descreveu.

Os melhores benefícios provavelmente não eram anunciados.

Porque quando anunciamos:

> “Ao chegar no Elite você ganhará uma faca personalizada.”

vira recompensa.

Quando o cara recebe inesperadamente:

> “Cara, chegou uma caixa aqui…”

vira memória.

Portanto teremos:

### Benefícios declarados

O que o programa promete.

E:

### Delight Budget

Uma verba interna destinada a surpreender parceiros.

Sem catálogo.

Sem promessa.

Sem pontos.

A Avraham escolhe quando usar.

Isso é muito forte.

---

# 8. Relacionamento não elimina cobrança

Aqui entra a outra metade do seu modelo.

Você poderia jantar com o cara na sexta-feira e na segunda mandar:

> “Você se comprometeu com isso até hoje. Onde estamos?”

Sem problema.

Porque existia confiança.

Eu transformaria isso numa regra explícita:

# **Proximidade não diminui responsabilidade.**

Partner bom recebe:

- atenção;
- suporte;
- oportunidades;
- dinheiro;
- experiências;
- acesso.

Mas também recebe:

- meta;
- prazo;
- acompanhamento;
- cobrança;
- consequência.

Isso já aparecia no Z-API antigo: o material deixava claro que ausência de feedback e descumprimento do cronograma poderiam interromper a parceria.

Essa parte era correta.

---

# 9. Carinho proporcional ao comprometimento

Também não podemos tratar igual:

**Partner que manda 10 oportunidades**

e

**Partner que não fala conosco há oito meses.**

Quanto mais ele investe na relação, mais investimos nele.

Algo como:

### Partner

Reconhecimento.

### Pro

Relacionamento.

### Elite

Relacionamento personalizado.

### Strategic

Tratamento quase societário da parceria.

Isso cria desejo de subir.

---

# 10. Partner não é afiliado. É um clube de negócios.

Essa talvez seja a maior mudança de posicionamento.

Não quero que pareça:

> “Programa de afiliados da Avraham.”

Quero que pareça:

> **“Faço parte de um grupo privado de parceiros da Avraham.”**

Com:

**acesso + dinheiro + negócios + networking + experiências + relacionamento.**

A comissão é só uma parte.

---

# A equação do programa

Eu resumiria nossa filosofia assim:

### Ego

**“Eles me valorizam.”**

### Status

**“Eu tenho acesso.”**

### Bolso

**“Eu ganho dinheiro.”**

### Relacionamento

**“Eu gosto dessas pessoas.”**

### Compromisso

**“Eu preciso entregar minha parte.”**

Quando as cinco coisas acontecem simultaneamente, temos o que você tinha no Z-API:

> **o Partner lembra de você sem precisar receber mensagem pedindo indicação.**

---

# A frase interna que eu colocaria no Playbook

> **Nosso objetivo não é ter parceiros cadastrados.**
> 
> **Nosso objetivo é ocupar espaço na mente, no bolso e no círculo de relacionamento deles.**
> 
> Quando surgir uma empresa com um problema que sabemos resolver, o Partner deve pensar automaticamente:
> 
> **“Preciso apresentar isso para o Higor.”**

E a contrapartida é:

> Quando o Partner trouxer uma oportunidade para nós, ele precisa ter certeza de três coisas:
> 
> **vamos cuidar bem da indicação, vamos fazê-lo parecer bem por ter nos apresentado e vamos remunerá-lo corretamente.**

Isso precisa ser quase sagrado no programa.

---

## A documentação que eu montaria agora

O nosso **Guia de Operação do Partner** deveria ter estes capítulos:

1. **DNA e filosofia do programa**
2. **Psicologia do Partner**
3. **Perfis e modelos de parceria**
4. **Modelo financeiro**
5. **Carteira Partner**
6. **Níveis, status e progressão**
7. **Benefícios**
8. **Experiências, presentes e Delight Budget**
9. **CRM de relacionamento**
10. **Onboarding 30/60/90**
11. **Rotina de relacionamento**
12. **Rotina de cobrança**
13. **Metas e score do Partner**
14. **Regras comerciais**
15. **Indicação e atribuição**
16. **Co-selling**
17. **Co-branding e white-label**
18. **Partner Statement**
19. **Eventos e experiências**
20. **Playbook interno do Partner Manager**
21. **Scripts e comunicações**
22. **Tecnologia e automações**
23. **Métricas e gestão**
24. **Reativação e desligamento**

E aí tem uma última coisa que considero fundamental:

**não podemos documentar somente “o que fazer”.**

Precisamos documentar também os **porquês psicológicos**.

Por exemplo:

> “Nunca mandar brinde genérico.”

**Por quê?**

Porque estamos tentando gerar reciprocidade, memória, identificação e vínculo — não exposição de marca.

Esse tipo de conhecimento é exatamente o que fazia seu programa funcionar e que normalmente se perde quando outra pessoa assume a operação.

------
Maravilhaaaa estamos chegando lá...
Outra coisa importante nesse playbook está exemplificado nessa "proposta" pegamos essas empresas de tech para migrarem no Z-API. E aí eu fazia uma "antecipação" como se fosse um "financiamento/consórcio prévio". O cliente entrava pagando menos que o devido com um comprometimento mas seríssimo e era acompanhando.

Importante: O partner que a gente realmente dava importância era o que gerava mais receita... Embora o plano começava a partir de 25 instâncias de 89,99 ou seja 2.249,75 (recorrentes). O cliente que era VIP mesmo eram a partir de 100 instâncias x 79,99 já dava  8.000 de recorrência só desse. O ALVO sempre foi acima das 500. Pois esses nos geravam R$ 34.995 de mensalidade. Então falamos em 420.000 reais por ano praticamente, com 5 ou 10 desses ao longo do ano tínhamos uma monetização excepcional com um bommm retorno.

Nosso foco é estudar essa lógica como referência histórica e adaptá-la ao nosso negócio, com registro explícito de base, faixas, condições e prazos (ver documento 11). Importante também: 

Os clientes  (software house) que tinham uma carteira acima do alvo (+100/200) clientes e não sabiam "monetizar" isso ou "pra que serviria" a gente apresentava pra eles uma nova fonte de receita, ensinava o que ofertar, como vender, média de preço, dava uma meta de usuários, eles criavam a integração e a gente colocava pra derreter. Pq eu tinha pressa pra ele bater as metas de colocar clientes na base, se ele batia além de desconto eu colocava + $ no bolso dele.

Se já tinha uma base e monetizava isso davamos sugestão e clientes que "não via valor em ter WhatsApp no sistema" a gente apresentava um plano gradual de migração ele começava com 1 instância pra todos os clientes e iria vendendo a parte os módulos e produtizava até conseguir capitalizar dentro da própria base.

Dessa forma nós tiramos a plataforma de 1.000 usuários para +27.000 clientes pagantes em 14 meses. Ou seja meus +200 partners eram responsáveis por todo esse montante 


Esse parceiro que nos entrega 100, 300, 500 eu enxergo como "fraquias" ou negócios que já tem distribuição. Por exemplo um Consorciado Master Embracon/Ademicon pois já tem abaixo dele 300/500/600 outros negócios. Então fazendo algo para ele e que quem está abaixo dele também ganha, a gente monetiza na distribuição desses caras entende? 

 
 É esse tipo que procuramos, por exemplo. Dono de um ERP para autopeças, pq entrando na base deles vamos estar na ponta com muitoooo cliente! No entanto esse perfil de donos da área tech temos que ter uma cautela, pois como já é alguém técnico manja de IA, distribuição, eles enxerguem mais potencial no modelo comercial internalizaml usam a nossa estratégia monetizam e me cortam da operação. Aí isso é um perigo!! Tem que ser quem não tem ideia ou quem nem quer se preocupar com isso... Tipo, "Higor é uma espécie de sócio meu nisso ele faz tudo eu ganho junto e boa".
 
---


Exatamente. Isso aponta uma peça que vale estudar como referência histórica para o **DNA econômico** do Avraham Partner.

O Z-API não cresceu porque vocês simplesmente “davam desconto para software houses”. O mecanismo era muito mais sofisticado:

> **vocês identificavam capacidade futura de distribuição, antecipavam parte do benefício econômico dessa escala e transformavam essa antecipação em compromisso mensurável de crescimento.**

Na proposta da Poli isso fica explícito. Pela tabela normal, o preço de R$59,90 exigiria mais de 1.000 instâncias; vocês anteciparam essa faixa para a Poli antes que ela chegasse lá, mas condicionaram o benefício a **800 instâncias iniciais dentro do cronograma negociado**. Ou seja: não era desconto gratuito. Era uma aposta comercial contratada sobre crescimento futuro.

# Isso precisa virar um princípio do Avraham Partner

Eu chamaria internamente de:

## **Antecipação de Escala**

A lógica é:

> **Eu não te dou hoje o benefício que você merece hoje. Posso te dar hoje o benefício que você mereceria amanhã — se você assumir comigo o compromisso sério de chegar lá.**

Isso é completamente diferente de desconto.

É quase uma espécie de **crédito comercial de crescimento**.

---

## O que vocês faziam no Z-API

Pegando os números que você trouxe, fica muito fácil enxergar a lógica.

|Volume|Receita recorrente aproximada|Como enxergávamos|
|---|---|---|
|25 × R$89,99|R$2.249,75/mês|entrou no jogo|
|100 × R$79,99|~R$8 mil/mês|Partner relevante|
|500 × R$69,99|R$34.995/mês|alvo estratégico|
|500 anualizado|~R$420 mil/ano|conta extremamente valiosa|

Então existia uma verdade que precisamos deixar explícita no novo playbook:

> **Partner não tinha o mesmo valor econômico só porque possuía o mesmo título.**

O cara com 25 instâncias era Partner.

O cara com 500 também.

Mas economicamente eram relações completamente diferentes.

E portanto:

**atenção, acesso, concessões, relacionamento, benefícios e investimento também eram diferentes.**

Isso não é injustiça.

É gestão de canal.

---

# A Avraham precisa fazer exatamente isso

Só que nossa unidade de escala não será necessariamente “instância”.

Teremos que trabalhar com uma combinação de:

**MRR atribuído ao Partner + receita acumulada + potencial da carteira + velocidade de ativação + margem gerada.**

Isso muda inclusive como vamos classificar nossos 11 primeiros partners.

Não basta:

> “Gabriel indicou 3.”

Precisamos entender:

> “Gabriel controla acesso a qual ecossistema?”

Porque talvez um parceiro tenha 500 relacionamentos superficiais e outro tenha **80 clientes ativos sob gestão**.

O segundo pode ser infinitamente mais importante.

---

# Temos dois tipos completamente diferentes de ativo

Essa distinção que você fez é fundamental.

## Partner com relacionamentos

É aquele modelo que já estávamos desenhando:

**“Conheço alguém que precisa da Avraham.”**

Ele faz a conexão e recebe dinheiro.

Perfeito.

Mas existe um segundo tipo muito mais poderoso.

## Partner com base instalada

Esse cara já possui:

**clientes + confiança + distribuição + cobrança + audiência + ponto de contato recorrente.**

Ele pode ser:

software house, ERP, CRM, plataforma, agência, consultoria, escritório, associação, franquia, ecossistema etc.

Esse Partner não nos entrega uma indicação.

Ele pode nos entregar **100, 300, 500 clientes de uma vez ao longo de uma curva de implantação.**

Aí estamos falando de outro jogo.

---

# E esse foi provavelmente o grande motor dos 27 mil

O material antigo mostra exatamente esse pensamento.

O Partner Program ensinava a software house não apenas a integrar. A documentação sugeria que ela estruturasse **features comercializáveis**, como disparo, automação em grupos e chats, e decidisse como monetizar: por função, número, usuário, limite de mensagens etc.

E o Plano de Parcerias ia ainda além. Depois dos primeiros testes, o “Projeto de Escala” previa **migração da base, plano de marketing, definição de modelo comercial e precificação, testes de volume, projeção de crescimento e acompanhamento periódico**.

Ou seja:

> vocês não vendiam API para a software house.

Vocês **ensinavam a software house a criar uma nova unidade de receita usando o Z-API por baixo.**

É uma diferença gigantesca.

---

# Isso precisa nascer novamente na Avraham

Só que agora podemos fazer isso com:

**Agentes de IA + automações + atendimento + dados + recuperação + integrações + serviços adjacentes.**

Imagine uma software house com 300 clientes.

Ela nunca vendeu IA.

Nossa conversa não deveria ser:

> “Quer indicar seus clientes para Avraham?”

Isso é pequeno.

Nossa conversa deveria ser:

> **“Você já possui 300 empresas pagando e confiando em você. Vamos transformar IA e automação em uma nova linha de receita dentro dessa base.”**

Aí fazemos o mesmo que vocês faziam.

---

# O Avraham Partner Growth Project

Esse deveria virar um método formal dentro do Partner Playbook.

Partner possui uma base de clientes.

Nós mapeamos a base.

Encontramos um produto simples para começar.

Definimos posicionamento e oferta.

Definimos quanto o Partner pode cobrar.

Definimos como a Avraham monetiza.

Construímos os materiais.

Fazemos piloto.

Validamos.

Começamos expansão.

Acompanhamos semanalmente a ativação.

Aumentamos a penetração.

E criamos uma curva como:

**Base total → base elegível → oferta → piloto → primeiros clientes → expansão → upsell.**

É literalmente o mesmo princípio que levou a operação anterior à escala.

---

# E existem dois cenários que você descreveu muito bem

### Cenário A — O Partner tem a base, mas nunca monetizou aquilo

Esse é talvez o mais gostoso.

Porque existe receita escondida.

Ele tem 200 empresas.

Nunca vendeu nada além do software.

Então entramos praticamente como consultores de monetização.

Mostramos:

> “Você possui 200 clientes. Se apenas 20% comprarem um produto de R$X, existe R$Y de nova receita recorrente aqui.”

Nós ajudamos a criar:

**produto + oferta + ticket + argumento + campanha + onboarding + entrega.**

Ele ganha dinheiro que antes não existia.

Nós ganhamos distribuição sem CAC tradicional.

Cliente ganha uma solução útil.

As três pontas ganham.

---

### Cenário B — Já existe monetização, mas há baixa adesão

Esse é outro método.

O software já vende um módulo de WhatsApp/IA.

Mas só 10% compra.

Então não tentamos arrancar 100% da base imediatamente.

Criamos uma **migração gradual**.

Essa sua ideia de:

> “coloca uma instância para todo mundo e depois vende módulos”

é muito boa porque reduz a barreira inicial.

Na Avraham poderíamos fazer equivalentes.

Por exemplo, oferecer uma camada básica de IA/automação como benefício incorporado ao plano principal e depois vender:

**mais canais, mais agentes, integrações, atendimento, recovery, inteligência comercial, capacidade, usuários, funcionalidades premium etc.**

Primeiro distribuímos.

Depois monetizamos profundamente.

---

# A grande diferença: distribuição primeiro, ARPU depois

Isso precisa estar escrito em letras grandes no playbook.

Em certos parceiros, não precisamos maximizar o ticket no primeiro dia.

Precisamos maximizar:

# **PENETRAÇÃO NA BASE**

Porque depois podemos monetizar em cima dela.

Essa lógica foi importantíssima no Z-API.

É muito mais valioso ter:

**300 clientes ativos com possibilidade de expansão**

do que tentar vender um pacote enorme para 8.

Dependendo dos nossos custos, claro.

---

# E aqui entra a antecipação econômica

Imagine um Partner com 500 clientes.

Nossa tabela normal diz:

> ele teria determinado benefício depois que chegasse a R$30 mil MRR conosco.

Mas olhamos aquela base, confiança, capacidade técnica e plano comercial e concluímos que existe probabilidade concreta de ele atingir isso.

Então podemos dizer:

> **“Vou te colocar desde já na condição comercial de um Partner de R$30 mil/mês. Em contrapartida, você assume um cronograma de crescimento conosco.”**

Por exemplo:

|Período|Compromisso|
|---|---|
|Start|piloto|
|30 dias|X clientes|
|60 dias|X|
|90 dias|X|
|180 dias|MRR alvo|

Se entrega:

**mantém a condição.**

Se supera:

**recebe acelerador.**

Se fica próximo:

**ajustamos.**

Se não executa:

**volta para a faixa econômica real.**

É exatamente a essência da Poli: a bonificação estava condicionada ao volume e ao cronograma, não simplesmente ao desejo de fechar negócio.

---

# E aqui aparece outra peça genial

## Não dar apenas desconto quando ele cresce.

Dar **mais dinheiro**.

Você descreveu uma coisa importantíssima:

> se o Partner batia a meta, além do preço melhor, você colocava mais dinheiro no bolso dele.

Isso cria duas forças simultâneas.

### Economia defensiva

Quanto mais cresce, menor seu custo.

### Economia ofensiva

Quanto mais cresce, mais dinheiro adicional recebe.

Então ele não pensa:

> “Tenho que vender mais porque o Higor quer.”

Ele pensa:

> **“Preciso acelerar porque estou deixando dinheiro na mesa.”**

Isso é muito mais forte.

---

# Para a Avraham isso pode virar “Accelerators”

Sem definir os percentuais finais antes de cruzar margem e DRE, o conceito pode ser:

|Performance|Economia|
|---|---|
|Faixa base|condição normal|
|Meta atingida|condição melhor|
|Supermeta|condição melhor + bônus|
|Crescimento recorrente|revenue share ampliado|
|Grande escala|modelo estratégico personalizado|

E aqui é importante uma regra:

> **percentual não pode ser a única moeda.**

Podemos mexer em:

preço wholesale, comissão, recorrência, bônus, verba de marketing, implementação subsidiada, créditos, equipe dedicada, eventos, presentes, oportunidades conjuntas.

Isso nos permite entregar muito valor sem destruir margem.

---

# O Partner mais importante não é necessariamente o que vendeu mais este mês

É o que tem maior **Enterprise Value para o canal**.

Eu criaria internamente algo parecido com um:

# Partner Economic Score

Uma nota baseada em quatro fatores:

|Dimensão|Pergunta|
|---|---|
|Receita atual|Quanto MRR/margem já gera?|
|Base potencial|Quantos clientes podemos acessar?|
|Velocidade|Quanto consegue ativar por mês?|
|Expansão|Quanto mais podemos vender dentro dessa carteira?|

Isso evita cometer um erro.

Um Partner pode gerar R$2 mil hoje, mas possuir uma base de 2.000 empresas e integração quase pronta.

Ele talvez mereça mais atenção do que alguém que gera R$10 mil, mas já chegou ao teto.

---

# Isso também muda completamente o ICP de Partner da Avraham

Não devemos procurar apenas:

> pessoas influentes que conhecem empresários.

Precisamos procurar também obsessivamente:

> **quem já possui distribuição pronta sobre o nosso ICP.**

Esse talvez seja o maior aprendizado reaproveitável de todos.

No Z-API vocês não adquiriram 27 mil empresas uma a uma.

Vocês adquiriram **distribuidores que já possuíam empresas.**

Um Partner com 500 clientes podia valer centenas de vendas individuais.

---

# Então eu colocaria uma nova seção no Playbook

## **Partner Distribution & Monetization Engine**

E dentro dela documentaremos um ciclo:

**Encontrar base → medir potencial → criar produto → desenhar monetização → antecipar condição → firmar compromisso → piloto → distribuição → acompanhar semanalmente → acelerar → upsell → premiar crescimento.**

Esse é um dos pilares centrais.

Porque daí o **Avraham Partner Network deixa de ser apenas canal de indicação**.

Passa a ter dois motores:

> **Referral Engine:** muitas pessoas trazendo boas oportunidades.

e

> **Distribution Engine:** poucas empresas capazes de colocar dezenas ou centenas de clientes dentro da nossa infraestrutura.

E eu colocaria uma prioridade interna muito clara:

# **10 Partners capazes de distribuir 100 clientes valem mais atenção estratégica do que 500 afiliados ocasionais.**

Foi basicamente esse princípio que vocês executaram no Z-API, hoje estudado como referência histórica. A jornada oficial já previa integração, migração da base, definição comercial, teste e escala; o que estamos fazendo agora é transformar o aprendizado que antes estava parcialmente espalhado nos materiais e na sua cabeça em um **método próprio e replicável da Avraham**, com nomes, jornada e regras definidos na arquitetura canônica.

E isso muda bastante o playbook que estamos montando: **não é só Partner Relationship. É Partner Economics + Partner Distribution + Partner Success + Partner Experience.**

---
Esse parceiro que nos entrega 100, 300, 500 eu enxergo como "fraquias" ou negócios que já tem distribuição. Por exemplo um Consorciado Master Embracon/Ademicon pois já tem abaixo dele 300/500/600 outros negócios. Então fazendo algo para ele e que quem está abaixo dele também ganha, a gente monetiza na distribuição desses caras entende? 

É esse tipo que procuramos, por exemplo. Dono de um ERP para autopeças, pq entrando na base deles vamos estar na ponta com muitoooo cliente! No entanto esse perfil de donos da área tech temos que ter uma cautela, pois como já é alguém técnico manja de IA, distribuição, eles enxerguem mais potencial no modelo comercial internalizaml usam a nossa estratégia monetizam e me cortam da operação. Aí isso é um perigo!! Tem que ser quem não tem ideia ou quem nem quer se preocupar com isso... Tipo, "Higor é uma espécie de sócio meu nisso ele faz tudo eu ganho junto e boa".

---
Aqui aparece um **ICP de Partner muito mais valioso** do que o simples “cara que conhece empresários”.

O que você está procurando é alguém que já seja **dono de distribuição**.

Não necessariamente alguém com audiência. Não necessariamente alguém famoso. Mas alguém que tenha uma **rede econômica abaixo dele**.

## O perfil ideal

Exemplos claros:

- master de consórcio com 300–600 operações abaixo;
- franqueadora;
- rede de clínicas;
- associação empresarial;
- escritório contábil com centenas de CNPJs;
- ERP verticalizado;
- software de gestão para autopeças;
- plataforma para imobiliárias;
- sistema para oficinas;
- SaaS para escolas;
- software para distribuidores;
- consultoria que gerencia dezenas de empresas;
- operador que já controla um ecossistema.

Esse cara não vale pela indicação individual.

Ele vale porque pode nos dar **distribuição em cascata**.

---

# O modelo não é “Partner”

É quase um **Channel Partner / Distribution Partner**

A lógica fica:

> **Avraham cria a solução + operação + oferta + monetização.**
> 
> **O parceiro abre a distribuição.**
> 
> **Quem está abaixo dele também ganha.**
> 
> **A ponta recebe valor.**
> 
> **E todo mundo tem incentivo para fazer a máquina girar.**

Isso é muito mais forte.

## Exemplo simples

Imagine um Master com 400 escritórios abaixo dele.

Criamos uma solução de IA para atendimento e vendas.

### Master ganha

Uma participação sobre a receita da rede.

### Escritório abaixo dele ganha

Pode revender, incorporar ou receber comissão.

### Cliente final ganha

Implementação pronta e suporte.

### Avraham ganha

Centenas de possíveis contratos sem precisar adquirir um por um.

Esse é o tipo de estrutura que cria escala de verdade.

---

# E tem uma coisa importante: não pode parecer pirâmide

A estrutura econômica precisa ser simples e empresarial.

Não é:

> “Ganhe em vários níveis.”

É:

> **o distribuidor recebe um override comercial porque abriu e mantém o canal.**

E a unidade abaixo recebe sua própria participação quando vende ou ativa.

Por exemplo:

**Avraham**  
opera e entrega.

**Master**  
recebe participação pelo canal.

**Unidade / revendedor**  
recebe participação pela venda ou ativação.

**Cliente**  
paga pelo produto.

Isso é canal de distribuição tradicional.

---

# Agora, o risco que você levantou é real

E talvez seja o maior risco desse modelo.

O dono de um ERP pode pensar:

> “Entendi o modelo.”
> 
> “Entendi como ofertar.”
> 
> “Entendi como precificar.”
> 
> “Entendi como monetizar.”
> 
> “Tenho os clientes.”
> 
> “Tenho dev.”
> 
> “Por que eu ainda preciso do Higor?”

E pronto.

Você ensinou o cara a construir uma nova unidade de negócio e virou descartável.

Esse é um perigo enorme.

---

# Portanto, precisamos procurar uma combinação específica

## Alto poder de distribuição

## Baixo interesse em internalizar

## Alta dependência operacional positiva

Esse é o ouro.

O parceiro ideal pensa:

> “Eu poderia tentar montar isso internamente.”

Mas logo conclui:

> “Vai me dar trabalho, equipe, risco, gestão, suporte, tecnologia, treinamento e dor de cabeça. Melhor deixar o Higor tocar e eu ganhar junto.”

Esse é exatamente o posicionamento que precisamos criar.

---

# O Partner ideal não compra tecnologia

Ele compra uma nova linha de receita sem operação

Essa frase precisa entrar no playbook.

> **Nós não vendemos IA ao distribuidor.**
> 
> **Criamos uma nova linha de receita dentro da base dele e operamos por trás.**

Essa é a proposta.

Para ele, a sensação tem que ser:

> “Tenho 300 clientes e nunca monetizei IA.”
> 
> “Agora tenho uma nova receita.”
> 
> “Não precisei contratar ninguém.”
> 
> “Não precisei estudar IA.”
> 
> “Não precisei criar produto.”
> 
> “Não preciso atender suporte.”
> 
> “Só coloco minha distribuição para funcionar.”

Muito forte.

---

# E aí o Higor vira quase um sócio operacional externo

Esse é o posicionamento certo.

Não:

> “Fornecedor de IA.”

Mas:

> **“Sócio de crescimento da nova unidade.”**

Quase:

### Revenue Partner

ou

### Operating Partner

A ideia é:

> “Você tem a base. Eu tenho o modelo, produto, operação e know-how. Vamos monetizar juntos.”

---

# Para evitar ser cortado da operação, precisamos criar dependência legítima

Não dependência artificial.

Dependência por valor.

## 1. A Avraham precisa operar algo importante

Se entregarmos só:

- estratégia;
- playbook;
- script;
- precificação;

podemos ser copiados.

Mas se mantivermos sob nossa responsabilidade:

- implantação;
- IA;
- engenharia;
- otimização;
- suporte;
- treinamento;
- analytics;
- operação;
- evolução;
- novos módulos;

fica muito mais difícil nos remover.

---

# 2. Não entregar o cérebro inteiro

O Partner precisa saber vender.

Não precisa saber reproduzir toda a operação.

Esse é um princípio muito importante.

Ele recebe:

### O necessário para distribuir

- oferta;
- materiais;
- argumento;
- precificação;
- treinamento comercial;
- proposta;
- cases.

Mas não necessariamente:

### Todo o know-how operacional

- arquitetura completa;
- prompts internos;
- estrutura técnica;
- métodos de implantação;
- automações internas;
- processos proprietários;
- stack completa;
- playbooks de execução.

Separar:

> **Enablement comercial**

de

> **IP operacional.**

---

# 3. Modularizar a solução

Outra proteção boa.

O cliente pode enxergar:

**Produto Avraham / Powered by Avraham**

ou até white-label dependendo do modelo.

Mas o backend continua nosso.

O parceiro vende.

A Avraham provisiona.

A Avraham opera.

A Avraham atualiza.

Assim ele pode ganhar bastante sem precisar “possuir a fábrica”.

---

# 4. Quanto mais ele cresce, mais vantajoso fica permanecer conosco

Essa é talvez a proteção mais inteligente.

Não queremos prender o parceiro por contrato.

Queremos que sair seja economicamente burro.

Por exemplo:

Quanto mais ele cresce conosco:

- melhora margem;
- ganha bonus;
- aumenta comissão;
- recebe equipe dedicada;
- ganha verba conjunta;
- recebe prioridade;
- ganha exclusividade territorial/setorial;
- recebe condições antecipadas;
- ganha acesso a novos produtos.

Então ele pensa:

> “Internalizar isso vai me custar mais do que continuar com a Avraham.”

Perfeito.

---

# 5. Criar switching cost operacional

De novo: legítimo.

Não “travar” o cara.

Mas criar uma operação tão integrada que trocar dê trabalho.

Exemplos:

- onboarding consolidado;
- dashboard;
- faturamento;
- provisionamento;
- playbooks;
- relatórios;
- integrações;
- suporte;
- SLA;
- base de conhecimento;
- histórico de dados;
- gestão de usuários;
- treinamento;
- campanhas prontas.

Quanto mais infraestrutura entregamos, mais nos tornamos um **sistema**, não um prestador.

---

# 6. O Partner técnico exige contrato e arquitetura comercial diferentes

Aqui eu separaria os parceiros em dois grupos.

## Distribuidor não técnico

Exemplo:

Master de consórcio.

Ele tem:

**distribuição alta**  
**capacidade técnica baixa**  
**interesse em internalizar baixo**

Excelente.

Podemos abrir bastante.

---

## Distribuidor técnico

Exemplo:

ERP.

Ele tem:

**distribuição alta**  
**capacidade técnica alta**  
**capacidade de copiar alta**

Excelente economicamente, mas exige cuidado.

Nesse caso:

- contrato claro;
- regras de canal;
- propriedade intelectual definida;
- atribuição de contas;
- cláusulas de não-circunvenção quando juridicamente adequadas;
- escopo de white-label muito bem definido;
- acesso limitado à operação;
- economia desenhada para manter alinhamento.

E isso precisa passar por jurídico.

---

# O ICP mais valioso pode ser “não tecnológico”

Você matou uma questão importante.

Talvez o melhor parceiro não seja o cara que entende IA.

Talvez seja o cara que tenha:

**500 clientes e zero vontade de aprender IA.**

Porque aí ele pensa:

> “Eu não quero construir isso.”
> 
> “Só quero oferecer.”
> 
> “Se o Higor resolver tudo, perfeito.”

Esse cara pode ser fantástico.

---

# Então eu criaria uma matriz de seleção

|Tipo de Partner|Distribuição|Capacidade técnica|Risco de nos cortar|Prioridade|
|---|---|---|---|---|
|Master/franqueador|Alta|Baixa|Baixo|Altíssima|
|Associação|Alta|Baixa|Baixo|Altíssima|
|Consultoria vertical|Média/Alta|Média|Médio|Alta|
|ERP pequeno|Alta|Média|Médio|Alta|
|ERP robusto|Muito alta|Alta|Alto|Seletiva|
|SaaS com time forte|Muito alta|Alta|Alto|Estratégica|
|Influenciador B2B|Média|Baixa|Baixo|Média|
|Afiliado comum|Baixa|Baixa|Baixo|Baixa|

Isso já ajuda muito na prospecção.

---

# Uma frase que resume nosso Partner ideal

> **“Eu tenho os clientes. Você tem a operação. Vamos ganhar juntos.”**

E a frase que ele precisa sentir:

> **“Se eu tirar a Avraham, vou ter que montar uma empresa inteira para substituir.”**

Aí conseguimos escala com proteção.

---

# Eu criaria três classes de Partner na Avraham

### 1. Referral Partner

Traz oportunidades.

### 2. Distribution Partner

Tem uma base e distribui a oferta.

### 3. Strategic Embedded Partner

Integramos profundamente dentro do negócio dele.

Esse terceiro é o mais valioso e o mais perigoso.

Então é onde entram os maiores:

- benefícios;
- compromissos;
- contratos;
- metas;
- proteção comercial;
- arquitetura técnica.

---

# E o que você descreveu muda a nossa tese principal

A maior oportunidade da Avraham talvez não seja:

> “vender IA para muitas empresas.”

Pode ser:

> **“encontrar poucas empresas que já possuam muitas empresas.”**

É exatamente a lógica de alavancagem.

1 venda para um distribuidor pode abrir:

**50, 100, 300, 500 vendas potenciais.**

É aí que o Partner vira realmente canal.

-----
Show vamos lá... Por exemplo:

- O José da Jogo Rápido delivery, tem um sistema para gestão de delivery e um app estilo "ifood". Atende uma panificadora que tinha dificuldade de atender. Integramos com o ERP dele para a IA saber catálogo, preços, estoque e etc. Atendemos juntos a Della panificadora.
    

Mas ele tem +200 "Della's" dentro da base. Testamos com a Della o cliente pagou pra mim R$18.000 de setup e ele me ajudou fazer a integração, agora temos plenas chances de apresentar pra ele essa possibilidade e ganharmos em +200 clientes.

Chego e falo "Cara, sei que estão já te pedindo pra desenvolver algo de IA aí mas geralmente o cliente nem sabe o que precisa, como já temos a integração vamos criar uma linha de receita pro teu sistema dentro disso? Já está integrado, nós cobramos um setup junto pra criar cada agente, cobramos uma mensalidade para ajustar e etc igual teu sistema e cobramos em crédito pelo uso. Vamos separar por porte e por expectativa, supondo que a gente consiga monetizar +R$300,00 mensal de cada em cima disso nós aumentamos em R$3.600 de ARR por cliente teu na base, claro que nem a base toda vai topar mas colocando 30% só estamos falando de implantar 60 clientes nos próximos X meses e reter +12 meses de contrato, o que daria +216.000 anual pra vc. Bora criar isso?"

Esse pra mim é o cara pra gente bater no canal de distribuição que é tech

Exatamente. **O José é praticamente o arquétipo perfeito do nosso `Tech Distribution Partner`.**

O ativo principal dele não é a tecnologia. É isto:

> **Ele já possui +200 empresas dentro de uma infraestrutura que conversa com a Avraham.**

E nós já removemos a maior barreira: **existe integração funcionando e um cliente real pagando por ela.**

A Della deixa de ser apenas um cliente de R$18 mil. Ela passa a ser o **cliente-farol** que valida uma nova unidade de negócio para a Jogo Rápido.

## O que estamos oferecendo ao José

Não é:

> “José, me indique seus clientes.”

É:

> **“José, vamos criar uma nova linha de receita dentro da Jogo Rápido.”**

Essa frase muda completamente o jogo.

Hoje ele vende gestão de delivery.

Amanhã poderia vender:

**Jogo Rápido + Atendimento por IA**

com a operação da Avraham por trás.

Ele continua dono da relação e da distribuição.

Nós viramos a fábrica.

---

# O caso Della vira o protótipo

A lógica comercial é muito forte:

**Problema:** a panificadora tinha dificuldade para atender.

**Ativo do José:** ERP com catálogo, preços, estoque etc.

**Ativo Avraham:** inteligência, atendimento, agente e operação.

**Integração:** já foi realizada.

**Cliente piloto:** Della.

**Validação econômica:** cliente pagou R$18.000 pelo projeto inicial.

Agora já não precisamos chegar aos outros 200 falando:

> “Temos uma ideia de IA.”

Podemos chegar dizendo:

> **“Isso já funciona integrado ao sistema que você utiliza.”**

Essa diferença é brutal.

---

# A conta que interessa ao José

Base instalada:

**200 clientes**

Penetração conservadora:

**30%**

Resultado:

**60 clientes ativos**

Incremento de receita recorrente imaginado:

**R$300/mês por cliente**

Logo:

**60 × R$300 = R$18.000 de nova receita mensal**

e:

**R$18.000 × 12 = R$216.000 de ARR**

E isso sem colocar na conta:

- setup;
- consumo/créditos;
- módulos adicionais;
- aumento de ticket;
- expansão futura;
- novos clientes que entrarem na Jogo Rápido.

É importante só comunicar corretamente: os **R$216 mil são o valor bruto anual da nova linha**, antes de definirmos quanto fica com José, quanto fica com Avraham, custos e consumo.

Mas comercialmente a tese é:

> **Existe potencial de criar mais de R$200 mil/ano de receita nova utilizando uma base que ele já possui.**

Ele não precisa adquirir 60 empresas.

**Elas já estão lá.**

---

# E o mais poderoso: existem 3 receitas

Aqui eu não venderia apenas mensalidade.

Criaria três camadas.

### 1. Setup

Implantação e configuração do agente para aquela empresa.

É onde entrariam:

- levantamento;
- configuração;
- conhecimento;
- integrações;
- regras;
- testes;
- implementação.

Della foi um projeto mais personalizado e validou R$18 mil.

Na escala de 200 empresas provavelmente precisaremos **produtizar**, e não repetir 200 projetos artesanais iguais ao primeiro.

---

### 2. Mensalidade

Aqui está o ARR.

Por exemplo:

- ajustes;
- manutenção;
- acompanhamento;
- melhoria;
- suporte;
- relatórios;
- otimização.

Esse é o dinheiro previsível.

---

### 3. Consumo

Créditos / mensagens / tokens / utilização.

Quanto mais o cliente usa e obtém valor, maior pode ser o faturamento.

Então temos:

> **Setup + Subscription + Usage**

Isso é muito melhor do que uma venda única.

---

# O produto pode inclusive nascer dentro da marca dele

Algo como:

## Jogo Rápido IA

**Powered by Avraham**

Ou co-branding.

O cliente do José não precisa sentir:

> “Estou contratando uma consultoria aleatória de IA.”

Ele sente:

> **“Meu sistema agora possui atendimento inteligente totalmente conectado ao meu negócio.”**

E isso ainda aumenta o valor percebido do próprio ERP.

O José ganha duas vezes:

**nova receita + aumento de stickiness do sistema dele.**

Porque agora trocar de ERP começa a significar também perder toda uma operação de IA integrada.

---

# O argumento para o José ficaria muito parecido com isso

> “José, acho que temos uma oportunidade maior aqui do que simplesmente atender a Della.
> 
> Vocês já têm mais de 200 operações na base e agora nós já resolvemos a parte mais difícil: existe integração funcionando entre a Jogo Rápido e nossa estrutura de IA.
> 
> Em vez de cada cliente aparecer pedindo alguma coisa diferente de IA para vocês desenvolverem, vamos transformar isso em produto.
> 
> Nós cuidamos da estrutura do agente, implantação, IA, melhoria, suporte e evolução. Vocês continuam com o sistema e com a distribuição.
> 
> Criamos juntos os planos, o modelo comercial e colocamos isso para rodar na base.
> 
> Se de 200 clientes apenas 30% aderirem, estamos falando de 60 operações.
> 
> Imaginando apenas R$300 de receita recorrente adicional por operação, são R$18 mil novos por mês ou R$216 mil de ARR dentro de uma base que vocês já possuem — fora setup e consumo.
> 
> E você não precisa montar um departamento de IA para fazer isso.
> 
> A ideia é simples: você tem a distribuição, nós já temos a integração e a operação. Vamos transformar isso numa nova linha de receita para a Jogo Rápido.”

Esse é o pitch.

---

# Só que depois vem a parte que diferencia a Avraham

Eu não deixaria o José com:

> “Legal, vou pensar.”

A próxima pergunta é:

> **“Quantos colocamos nos próximos 90 dias?”**

E começa um plano de ativação inspirado no que você fazia no Z-API, adaptado ao ciclo atual da Avraham (ver documento 12).

### Semana 1

Produto e precificação.

### Semana 2

Materiais + treinamento comercial.

### Semana 3

Seleção dos primeiros clientes.

### 30 dias

Primeiro lote ativo.

### 60 dias

Segundo lote.

### 90 dias

Penetração X% da base.

E acompanhamos semanalmente.

Porque o objetivo não é assinar parceria.

É **derreter a base**.

---

# A antecipação também cabe perfeitamente

Suponha que nossa condição normal para determinado nível só existisse depois de 50 clientes.

Mas José tem:

- 200 clientes;
- integração pronta;
- case real;
- capacidade comercial;
- compromisso de ativar 60.

Eu posso dizer:

> **“Vou te dar desde o primeiro cliente a condição econômica que normalmente você teria aos 50. Em troca, fechamos um plano de crescimento para chegar aos 60 em X meses.”**

Se chega:

mantém.

Se supera:

ganha acelerador/bônus.

Se não chega:

volta para a condição correspondente ao volume real.

Esse é exatamente o mecanismo de **antecipação de escala** que precisamos recuperar.

---

# Mas esse Partner precisa de proteção contra desintermediação

Porque José é tech.

Então o desenho correto não é ensinar:

> “Como criar uma empresa de agentes de IA.”

É ensinar:

> **“Como vender o produto que nós vamos operar juntos.”**

A Jogo Rápido precisa dominar:

- para quem vender;
- qual dor resolve;
- quanto custa;
- como apresentar;
- como identificar oportunidade.

A Avraham mantém profundidade em:

- criação dos agentes;
- arquitetura;
- infraestrutura;
- otimização;
- qualidade;
- operação;
- monitoramento;
- evolução;
- suporte especializado.

Assim a conclusão dele é:

> “Eu conseguiria internalizar? Talvez. Mas para que vou contratar time, gerenciar IA, criar processo, suporte e infraestrutura se já tenho um sócio operacional fazendo tudo e dividindo o resultado comigo?”

Essa é a posição que queremos ocupar.

---

# Então documentaria esse caso no Playbook assim

## **Arquétipo 01 — Tech Distribution Partner**

**Exemplo:** Jogo Rápido.

**Ativo:** +200 clientes em uma plataforma vertical.

**Porta de entrada:** Della Panificadora.

**Prova:** integração real + cliente pagante.

**Oportunidade:** transformar solução pontual em produto replicável.

**Modelo:** Setup + Recorrência + Usage.

**Distribuição:** base própria do Partner.

**Objetivo Avraham:** penetrar progressivamente na carteira.

**Objetivo Partner:** nova fonte de receita sem criar nova operação.

**Risco:** internalização/desintermediação.

**Proteção:** Avraham permanece operador da infraestrutura, metodologia e ciclo de vida da solução.

**Métrica principal:** clientes ativos / MRR / penetração da base.

**Meta:** não “fechar José”. É **ativar a base do José**.

E eu acho que essa última frase é uma das mais importantes de todo o Playbook:

> # **No Distribution Partner, assinatura do contrato não é venda. Venda é penetração da base.**

Se a Jogo Rápido tem 200 clientes e depois de um ano temos 3 utilizando IA, fracassamos mesmo que José continue “Partner”.

Se temos 60, 100 ou 150, construímos um canal.

---
