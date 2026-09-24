---
name: "source-command-kickoff"
description: "Interrogatorio de abertura de projeto novo. Preenche AGENTS.md, produz visao, arquitetura e a primeira fila de issues. Para antes de escrever codigo."
---

# source-command-kickoff

Use this skill when the user asks to run the migrated source command `kickoff`.

## Command Template

Conduza o interrogatorio de abertura deste projeto, seguindo `docs/14-checklist-pre-projeto.md` bloco a bloco.

Para cada bloco incompleto, pergunte ao owner o que falta. Nao assuma resposta.

Ao final:
1. `AGENTS.md` seções 1 e 2 preenchidas.
2. `docs/00-visao-e-escopo.md` completo.
3. `docs/02-arquitetura.md` com camadas e entidades centrais.
4. `docs/07-design-system.md` preenchido ou marcado como "sem UI".
5. Catálogo de agentes revisado; agente adicional registrado se o projeto pedir.

Pare aqui. Não escreva código. Não abra fila de issues ainda, isso é `/plan`.
