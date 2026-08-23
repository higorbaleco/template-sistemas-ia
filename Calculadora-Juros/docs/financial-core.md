# Core financeiro

## Diretriz

O core financeiro deve ser puro, determinístico e testável. Ele não conhece React, DOM, LocalStorage nem tema visual.

## Pasta prevista

* `src/financial`

## Módulos do core

* `price.ts`
* `sac.ts`
* `simpleInterest.ts`
* `compoundInterest.ts`
* `presentValue.ts`
* `futureValue.ts`
* `rateConversion.ts`
* `amortization.ts`
* `extraPayments.ts`
* `cashFlow.ts`
* `financingCapacity.ts`
* `debtCoverage.ts`
* `wealth.ts`
* `leverage.ts`
* `index.ts`

## Regras matemáticas

* funções recebem parâmetros explícitos
* nenhuma dependência de estado global
* nenhuma taxa ou prazo fixo escondido na interface
* resultados devem ser previsíveis para o mesmo input

## Padrão de entrada

Exemplo de conceitos esperados:

* valor principal
* taxa
* prazo
* aporte
* saldo devedor
* parcela alvo
* amortização extra
* valor futuro desejado

## Padrão de saída

Cada cálculo deve retornar objetos com:

* valor principal
* valor total
* juros totais
* parcelas
* cronograma quando aplicável
* indicadores derivados quando relevantes

## Validações

* taxas negativas devem ser tratadas conforme regra de domínio
* prazo zero deve ser bloqueado quando matematicamente inválido
* valores monetários devem ser normalizados antes do cálculo
* percentuais devem ter unidade explícita

