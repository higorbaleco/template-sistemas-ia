# Antigravity Software Workspace

Centro de controle da pasta de sistemas em 24 de julho de 2026.

Esta raiz agora serve como um workspace umbrella: ela organiza o que existe,
aponta prioridades por peso e prepara a subida para Git sem apagar projetos nem
mexer no historico dos subrepositorios que ja existem.

## Objetivo

- manter tudo salvo localmente
- reduzir o risco de subir lixo pesado para o Git
- priorizar a reativacao dos projetos mais pesados primeiro
- documentar o que cada projeto precisa para voltar a rodar

## Leitura rapida

- [Inventario do workspace](docs/INVENTARIO-WORKSPACE.md)
- [Roadmap de reativacao](docs/ROADMAP-REATIVACAO.md)
- [Guia de subida para Git](docs/GUIA-GIT-WORKSPACE.md)

## Itens mais pesados da raiz

| Ordem | Item | Peso aprox. | Observacao |
| --- | --- | ---: | --- |
| 1 | `Gerador de Propostas \| Avraham` | 1.18 GB | Workspace misto com Node, `.next` e `.venv` |
| 2 | `SOCIAL-MEDIA-OLLEG` | 858 MB | Next.js com `node_modules` e `.next` bem grandes |
| 3 | `Painel SVP Disparos WhatsApp` | 748 MB | Dois apps Vite com dependencias duplicadas |
| 4 | `OUTBOUND \| OLLEG` | 675 MB | Python + dashboard Vite, com `.venv` dominante |
| 5 | `SITE AVRAHAM 2026` | 642 MB | App com `node_modules` muito pesado |
| 6 | `Calculadora-custos-ia` | 510 MB | App Vite com `node_modules` dominante |
| 7 | `pakas-app` | 435 MB | App Vite e outro pacote auxiliar |
| 8 | `Avraham New CRM` | 425 MB | `node_modules` quase total |
| 9 | `GitHub` | 414 MB | workspace `avraham-reach` com dependencias grandes |
| 10 | `Catalogo Car Systema` | 413 MB | app Vite com `node_modules` dominante |

## Estado geral

- A raiz foi inicializada em Git na branch `main` em 24 de julho de 2026.
- Existem 12 subpastas com `.git` proprio.
- Os maiores pesos hoje estao em artefatos regeneraveis:
  `node_modules`, `.next`, `dist` e `.venv`.
- Existem tambem arquivos soltos na raiz que valem organizacao posterior,
  principalmente `.zip`.

## Prioridade operacional de reativacao

Mesmo com o ranking bruto acima, a ordem recomendada para reativacao e:

1. `Gerador de Propostas | Avraham`
2. `SOCIAL-MEDIA-OLLEG`
3. `OUTBOUND | OLLEG`
4. `SITE AVRAHAM 2026`
5. `Painel SVP Disparos WhatsApp`
6. `smart-finance-central`
7. `Decide Aí Food`

## Script util

Para repetir a auditoria no futuro:

```bash
bash scripts/auditar-workspace.sh
```
