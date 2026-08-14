# 07. Design system

Referência: §8 e §9.

## 1. Fonte única de UI

O design não nasce de referência visual solta enviada ao modelo. Referência: §8, ao ser perguntado se manda referência visual, a resposta foi que não, que a entrevista sobre o sistema é o que gera o design.

Processo:

1. Descrever o sistema (não a tela) para a ferramenta de design.
2. A ferramenta conduz uma entrevista, apontando decisão de UX/UI que precisa ser tomada.
3. O resultado é um sistema visual completo, não uma tela isolada.
4. A importação para o repositório é feita como componente real, via conexão direta (MCP ou equivalente), nunca como imagem de referência para o modelo reinterpretar. "Isso aqui é um componente, isso aqui não é uma imagem" (§8).
5. Uma vez importado, aquilo vira o padrão do projeto. Nenhuma tela nova é desenhada do zero; toda tela nova é composição dos componentes já existentes.

## 2. Regra de não duplicação

Fixada em `CLAUDE.md`, regra 9: nunca duplicar componente de UI. Se o componente não existe no design system, ele é criado no design system primeiro, não criado ad-hoc dentro da feature que precisa dele.

O agente responsável por essa disciplina é o `design-keeper` (`.claude/agents/design-keeper.md`): toda tarefa de UI passa por ele, e ele não pode criar estilo fora do sistema declarado em `frontend/components/ui/`.

## 3. Tokens

| Token | Valor | Uso |
|---|---|---|
| `[PREENCHER: cor primária]` | `[PREENCHER]` | `[PREENCHER]` |
| `[PREENCHER: cor de fundo]` | `[PREENCHER]` | `[PREENCHER]` |
| `[PREENCHER: fonte]` | `[PREENCHER]` | `[PREENCHER]` |
| `[PREENCHER: espaçamento base]` | `[PREENCHER]` | `[PREENCHER]` |

Tokens vivem em código (`frontend/components/ui/tokens`, ou equivalente do projeto), nunca apenas em documento. Documento aqui descreve, código é a fonte de verdade.

## 4. White label

Referência: §9, o caso do sistema de lava jato: aplicação multi-marca, com CMS interno permitindo ao operador trocar cor, logotipo e demais elementos de marca, vendida para a rede de distribuição do próprio cliente.

Quando o projeto exige white label:

- Todo token de marca (cor, logotipo, nome) é dado configurável por tenant, nunca hardcoded em componente.
- O design system continua único; o que varia por tenant é o valor do token, não o componente.
- A camada de configuração de marca é um domínio próprio (`domain/branding` ou equivalente), não um conjunto de `if` espalhado pela UI.

## 5. O que este documento não cobre

- Camada de dados e schema de tenant: `docs/08-banco-de-dados.md`.
- Fluxo de trabalho de uma tarefa de UI: `docs/04-fluxo-operacional.md`.
