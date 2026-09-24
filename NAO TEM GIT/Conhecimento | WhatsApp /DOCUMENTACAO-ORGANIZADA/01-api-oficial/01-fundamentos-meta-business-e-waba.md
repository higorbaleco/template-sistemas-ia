# API Oficial - Fundamentos de Meta Business e WABA

## Tese central

A API Oficial do WhatsApp nao deve ser entendida como "um numero que dispara mensagem". Ela e uma infraestrutura empresarial composta por identidade, ativos Meta, conta de WhatsApp Business, numero, templates, qualidade, limites e integracoes.

Quando a operacao e relevante para vendas, atendimento ou relacionamento, a pergunta correta deixa de ser "temos WhatsApp?" e passa a ser:

> Temos uma estrutura empresarial confiavel para sustentar o WhatsApp como canal de negocio?

## O que o mercado chama de BM

No uso comum, "BM" costuma ser usado para falar do ambiente empresarial da Meta. O nome mais atual e Meta Business Portfolio.

Esse ambiente concentra ativos como:

- pessoas e administradores;
- parceiros;
- dominio;
- paginas e contas sociais;
- contas de anuncios;
- aplicativos;
- WhatsApp Business Accounts.

## O que e WABA

WABA significa WhatsApp Business Account.

Ela e o ativo especifico da operacao de WhatsApp Business Platform. Dentro dela ficam:

- numeros;
- nomes de exibicao;
- templates;
- qualidade;
- limites de mensageria;
- configuracoes e integracoes.

Uma BM pode existir sem uma WABA madura. Uma WABA pode estar funcional, mas com qualidade ruim. Esses pontos precisam ser analisados separadamente.

## Estrutura recomendada

Uma estrutura profissional deve seguir esta ordem:

```text
Empresa
  -> Meta Business Portfolio
    -> WhatsApp Business Account
      -> Numero
        -> Templates
          -> Integracao
            -> Atendimento, CRM, automacao e relatorios
```

## Dados necessarios antes de criar a estrutura

Antes de configurar a API Oficial, reunir:

- razao social;
- nome fantasia;
- CNPJ ou registro empresarial;
- endereco;
- telefone;
- dominio;
- site ativo;
- e-mail corporativo;
- politica de privacidade;
- responsaveis administrativos;
- autenticacao de dois fatores;
- numero que sera usado;
- nome de exibicao pretendido;
- categoria empresarial.

## Consistencia das informacoes

A Meta precisa conseguir reconhecer que documento, site, Business Portfolio, e-mail e telefone representam a mesma empresa.

Exemplo de consistencia:

```text
Razao social: Avraham Digital Tecnologia Ltda.
Business Portfolio: Avraham Digital Tecnologia Ltda.
Site: avrahamdigital.com.br
E-mail: contato@avrahamdigital.com.br
Rodape do site: razao social, CNPJ e canais de contato.
```

Exemplo de risco:

```text
Business Portfolio: XPTO Marketing
Documento: ABC Tecnologia Ltda.
Site: empresaXYZ.com.br
E-mail: empresaxpto@gmail.com
Telefone: ligado a outro negocio
```

Uma divergencia isolada pode ser explicavel. Varias divergencias juntas tornam a verificacao e a operacao mais frageis.

## Conclusao

API Oficial e infraestrutura, nao atalho. Quanto mais claro for o vinculo entre empresa, ativos, numero e finalidade de uso, maior a chance de operar com previsibilidade.
