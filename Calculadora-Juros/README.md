# Simulador Financeiro

Central de simulações financeiras em React, TypeScript e PWA, pensada primeiro para mobile e depois para desktop.

## Objetivo

Transformar matemática financeira complexa em uma experiência simples, rápida e confiável para:

* financiamentos
* empréstimos
* juros compostos
* amortização
* antecipação de pagamentos
* formação de patrimônio
* custo de oportunidade
* comparação de cenários
* análise de capacidade de financiamento
* alavancagem financeira

## Princípios

* Nada de valores financeiros hardcoded na interface.
* Cálculo isolado em `financial-core`.
* Estado e formulário em hooks e stores.
* UI responsiva com prioridade total para mobile.
* Formatação monetária consistente em todo o produto.

## Formatação financeira

* Moeda padrão: `R$ 10.000,00`
* Casas decimais: sempre duas
* Separador de milhar: ponto
* Separador decimal: vírgula
* Percentuais: `12,50% a.m.`, `0,85% a.m.`

## Documentação

* [Índice da documentação](docs/README.md)
* [Arquitetura](docs/architecture.md)
* [Rotas](docs/routes.md)
* [PWA e mobile first](docs/pwa-mobile.md)
* [Design system](docs/design-system.md)
* [Core financeiro](docs/financial-core.md)
* [Prototipação](docs/prototyping.md)
* [Modelo de dados](docs/data-model.md)

## Estrutura base

* `src/app`: bootstrap da aplicação, providers e rotas
* `src/components`: componentes reutilizáveis
* `src/layouts`: layouts de navegação e contexto
* `src/modules`: features por domínio
* `src/financial`: motor matemático
* `src/hooks`: integração entre UI e cálculo
* `src/services`: persistência, exportação e integrações
* `src/config`: defaults e catálogos
* `src/types`: tipos compartilhados
* `src/utils`: utilitários puros

## Regras de UX

* Mobile first em todas as telas
* Bottom navigation no fluxo principal
* Inputs monetários com máscara e validação imediata
* Resultados com destaque visual e leitura rápida
* Gráficos sempre secundários, nunca substituindo os números

