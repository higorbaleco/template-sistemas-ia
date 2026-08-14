# Arquitetura de Agentes no Antigravity

A arquitetura de agentes no ecossistema Antigravity é desenhada para promover autonomia, escalabilidade e segurança.

## Componentes Principais
1. **Percepção (Sensores)**: Módulos que captam informações do ambiente, requisições de usuários e eventos do sistema.
2. **Cognição (Core LLM)**: O cérebro do agente, onde o modelo de linguagem processa os dados e toma decisões baseadas nas regras de negócio (Rules).
3. **Ação (Atuadores/Ferramentas)**: Funções que o agente pode invocar, como chamadas de API, execução de scripts e operações em banco de dados.

## Fluxo de Decisão
- O agente recebe um input.
- Consulta seu contexto e as políticas RLS.
- Avalia as Rules.
- Executa a ação apropriada através de MCPs.
