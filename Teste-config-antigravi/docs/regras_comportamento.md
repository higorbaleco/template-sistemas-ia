# Rules: Direcionando o Comportamento da IA

As Rules (Regras) são os "trilhos" pelos quais os agentes do Antigravity trafegam. Elas garantem que a IA não sofra alucinações perigosas e siga estritamente os protocolos da empresa.

## Estrutura das Regras
- **Regras Globais**: Diretrizes que todos os agentes devem seguir (ex: "Nunca exponha senhas", "Sempre responda em Português").
- **Regras de Escopo (Skills)**: Regras ativadas apenas quando o agente está desempenhando uma tarefa específica (ex: "Ao revisar código, verifique vulnerabilidades OWASP").

## Implementação
As regras são injetadas no System Prompt do agente de forma dinâmica, dependendo do contexto identificado.
