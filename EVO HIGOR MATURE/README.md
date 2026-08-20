# EVO HIGOR MATURE

Base de trabalho para a plataforma de agentes WhatsApp e o modulo de aquecimento.

## Estrutura inicial

- `spec.md`: visão de produto
- `requirements.md`: requisitos fechados
- `warming-module-design.md`: design do modulo de aquecimento
- `execution/`: frentes paralelas de trabalho
- `apps/`: futuros servicos
- `packages/`: contratos compartilhados

## Estado atual

O repositório agora tem:

- documentos de produto
- plano de execucao paralelo
- contratos compartilhados
- esqueleto de monorepo TypeScript

## Proximo passo

Implementar o schema persistente e o fluxo do orquestrador de aquecimento a partir de `packages/contracts`.

## Preview local

1. Rodar `npm run dev:api`
2. Abrir `http://127.0.0.1:3000`
3. Ver o painel com os dados demo e as ações de warming
