# Antigravity Software Workspace Guide

Atualizado em `2026-07-22`.

## Objetivo
- Orquestrar a pasta `Antigravity Software` como uma macro-pasta de operação.
- Proteger os projetos críticos.
- Reduzir risco de perda local antes de qualquer limpeza.
- Liberar espaço primeiro com artefatos regeneráveis e depois com arquivamento controlado.

## Estado Atual
- Tamanho atual da pasta: `~9.53 GB`
- Artefatos regeneráveis detectados: `~8.38 GB`
- Liberação imediata sem tocar nos projetos protegidos: `~5.75 GB`
- Liberação máxima aqui, se limpar todos os artefatos regeneráveis: `~8.38 GB`
- Gap restante para a meta de `40 GB`, mesmo após limpar tudo aqui: `~31.62 GB`

## Projetos Protegidos
- `Catalogo Car Systema`
- `SITE AVRAHAM 2026`
- `Gerador de Propostas | Avraham`
- `Painel SVP Disparos WhatsApp`
- `Cardápio Online | Pizza do Gordo`

## Regras Operacionais
1. Nenhum projeto protegido entra em limpeza agressiva.
2. Projeto `dirty`, `ahead`, `behind` ou sem `origin` fica bloqueado para limpeza destrutiva.
3. Onda 1 sempre ataca só `node_modules`, `.venv`, `.next`, `.output`, `dist` e caches recriáveis.
4. Projeto local-only deve ser versionado ou documentado antes de qualquer remoção local.
5. Tudo que for frio, sincronizado e recriável pode sair da pasta principal depois da triagem.

## Documentos Deste Workspace
- [Inventário mestre](workspace-audit/INVENTARIO.md)
- [Fase 2: auditoria ampla do Mac](workspace-audit/FASE-2-MAC.md)
- [Onda 1 de limpeza segura](workspace-audit/ONDA-1-LIMPEZA.md)
- [Índice de guias](workspace-audit/GUIAS.md)

## Leitura Rápida
- O maior risco hoje não é só espaço: é `estado Git inconsistente`.
- Os casos mais sensíveis são:
  - `Catalogo Car Systema`: `ahead=88`
  - `Avraham New CRM/avraham-hub`: `behind=1,ahead=2`
  - `SITE AVRAHAM 2026`: raiz `dirty` e repositórios `behind=1`
  - Vários projetos locais sem remoto: `App da Bíblia`, `Cardápio Online | Pizza do Gordo`, `CALCULO MARGEM DISPAROS TOPSEND`, `my-project`
- A pasta atual não entrega `40 GB` sozinha; a Fase 2 já aponta candidatos fortes fora dela.

## Fluxo Recomendado
1. Ler o inventário e validar se a classificação `ativo / morno / frio` continua fazendo sentido.
2. Tratar primeiro os guias dos projetos protegidos.
3. Resolver todos os casos `dirty`, `ahead`, `behind` e `sem origin`.
4. Executar limpeza de artefatos por ondas, começando pelos projetos não protegidos.
5. Atacar a Fase 2 fora desta pasta para fechar a meta de espaço.

## Saída Esperada Das Próximas Execuções
- Workspace com documentação centralizada.
- Projetos críticos com playbook próprio.
- Lista clara do que sincronizar antes de apagar qualquer coisa.
- Plano prático de espaço em duas fases, com foco em baixo risco primeiro.
