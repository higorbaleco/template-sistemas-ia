# Evolução da Lógica de Decisão e Recomendação da Calculadora de Custos IA

Este plano detalha a evolução incremental da lógica de decisão e recomendação da calculadora de créditos de IA existente. Mantemos toda a interface visual e campos atuais, adicionando uma camada matemática determinística e templates de recomendação para resolver as dúvidas do usuário sobre a viabilidade econômica do seu plano.

## User Review Required

> [!IMPORTANT]
> Toda a computação monetária será realizada internamente em centavos para evitar imprecisões de ponto flutuante, em conformidade com as diretrizes. A estrutura de dados de planos em `src/lib/avraham-data.ts` será refatorada para centralizar a configuração em centavos, gerando o array legado `plans` dinamicamente para preservar a compatibilidade de todos os componentes da interface.

> [!NOTE]
> Não adicionaremos nenhum campo de entrada para agentes. A verificação de agentes ("AGENT_LIMIT_EXCEEDED") será omitida pois a calculadora atual não possui input para quantidade de agentes.

## Open Questions

Não há dúvidas que necessitem de bloqueio. O comportamento da calculadora será determinístico e totalmente alinhado aos casos de teste fornecidos.

## Proposed Changes

### Centralização de Fórmulas e Constantes

#### [MODIFY] [avraham-data.ts](file:///Users/higorplens/Antigravity%20Software/Calculadora-custos-ia/calculadora-custos-ia/src/lib/avraham-data.ts)
- Adicionar a configuração centralizada em centavos `PLANS` e `EXTRA_CREDIT_PRICE_CENTS`.
- Adicionar definições de tipos para `RecommendationResult`, `RecommendationAction`, `RecommendationReasonCode` e `RecommendationData`.
- Implementar as funções auxiliares puras em TypeScript:
  - `calculateMonthlyAttendances`
  - `calculateConsumedCredits`
  - `calculatePlanCostInCents`
  - `calculateBreakEvenCredits`
  - `calculateCreditBalance`
  - `calculateAttendanceCapacity`
  - `calculateRecommendation`
  - `buildRecommendationSummary`
  - `calculateAutomaticGrowthProjection`
- Manter e derivar dinamicamente o array `plans` existente para não quebrar nenhuma referência visual externa.

### Integração com a UI e sessionStorage

#### [MODIFY] [index.tsx](file:///Users/higorplens/Antigravity%20Software/Calculadora-custos-ia/calculadora-custos-ia/src/routes/index.tsx)
- Integrar os estados da calculadora com o `sessionStorage` sob a chave `ai-credit-calculator:v2`.
- Atualizar a função `compute()` para chamar a nova lógica baseada em centavos.
- Adicionar o botão "Nova Simulação" no componente `ResultGrid` ao lado de "Copiar resumo" para limpar o estado e o `sessionStorage`.
- Atualizar o componente `Recommendation` para renderizar o resultado detalhado gerado pela nova engine (consumo, excedentes, comparação de custos, economia, ponto de equilíbrio e cenários de crescimento).

---

## Verification Plan

### Automated Tests
- Executaremos um script de teste simples para validar os 10 casos de teste listados na especificação. O script rodará no próprio terminal de desenvolvimento usando `bun`.

### Manual Verification
- Testar a interface no navegador para garantir que o comportamento em tempo real foi preservado, o `sessionStorage` salva os dados corretamente ao recarregar a página, e a limpeza de estado funciona.
