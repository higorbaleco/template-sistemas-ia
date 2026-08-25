# Status do Projeto

Atualizado em 23 de agosto de 2026.

## Resumo

O projeto está em preview funcional, com base visual, rotas principais, núcleo financeiro formal e persistência local já encaminhados. Ainda existem frentes importantes para fechar a especificação completa, mas a fundação atual já saiu do estado de protótipo solto e entrou em uma arquitetura mais consistente.

## O que já está funcionando

* App em Vite com React e TypeScript
* Navegação principal por rotas
* Shell mobile first com bottom navigation
* Tema claro e escuro com persistência local
* Fonte principal padronizada em Plus Jakarta Sans
* PWA base com manifest e metadata
* Formatação de moeda e percentuais em pt-BR
* Simulações funcionais para:
  * financiamento
  * amortização simplificada
  * juros compostos
  * comprar versus juntar
* Telas base para:
  * home
  * simulações
  * cenários
  * histórico
  * configurações
* Layout mobile first com foco em leitura rápida e transparência no modo light
* Build de produção validado com sucesso

## O que existe hoje no núcleo financeiro

* Core financeiro formal em `src/financial`
* Cálculo PRICE com cronograma em `src/financial/price.ts`
* Cálculo SAC em `src/financial/sac.ts`
* Amortização simples em `src/financial/amortization.ts`
* Crescimento composto em `src/financial/compoundInterest.ts`
* Conversões de taxa em `src/financial/rateConversion.ts`
* Cálculos de patrimônio, alavancagem, capacidade, valor presente e valor futuro
* Wrapper de compatibilidade em `src/utils/finance.ts`
* Formatação de moeda e parsing em `src/utils/formatters.ts`

## O que ainda está pendente

* Refinar os cronogramas detalhados nas telas de simulação
* Evoluir comparações de cenários com mais contexto visual
* Adicionar exportação de dados e relatórios
* Cobrir o core financeiro com testes automatizados
* Completar gráficos e tabelas financeiras nas telas de análise
* Consolidar a experiência PWA com mais comportamento offline
* Revisar o design final para ficar mais próximo do preset visual desejado

## Estado da arquitetura

* Estrutura de pastas já alinhada com a especificação
* `src/app` isolado para composição e rotas
* `src/modules` organizado por domínio
* `src/components` com base reutilizável
* `src/config` com defaults e navegação
* `src/hooks` com estados compartilhados, tema e hooks de domínio
* `src/types` centralizando contratos do domínio
* `src/services` com persistência local e comparação
* `src/styles/app.css` com tokens, tema e layout

## Observações de design

* O projeto está com foco mobile first
* O modo light já foi ajustado para transparência e legibilidade
* A tipografia principal está consolidada em Plus Jakarta Sans
* O visual ainda pode ser refinado em direção ao preset shadcn escolhido
* Os cards e rotas já caminham para uma leitura mais premium e consistente

## Próximos passos recomendados

1. Terminar a visualização de cronogramas e detalhes de parcelas
2. Expandir os gráficos e tabelas financeiras
3. Adicionar testes unitários do core financeiro
4. Refinar exportação e persistência avançada
5. Ajustar a camada visual final para o padrão de design alvo

## Critério de pronto para a próxima fase

O projeto estará pronto para avançar de preview para produto quando:

* os cálculos principais estiverem centralizados em um core puro
* o histórico e os cenários tiverem persistência real
* as simulações principais exibirem cronogramas completos
* os testes cobrirem os cenários financeiros críticos
