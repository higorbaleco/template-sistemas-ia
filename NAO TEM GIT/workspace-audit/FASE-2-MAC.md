# Fase 2 - Auditoria Ampla do Mac

Atualizado em `2026-07-22`.

## Resumo
- A pasta `Antigravity Software` está em `~9.53 GB`.
- Mesmo limpando todos os artefatos regeneráveis nela, o ganho máximo local é `~8.38 GB`.
- Para atingir a meta de `40 GB`, o gap restante é de `~31.62 GB`.
- A segunda fase precisa olhar fora da pasta de projetos.

## Candidatos Fortes Fora Da Pasta

| Local | Tamanho | Observação | Prioridade |
| --- | ---: | --- | --- |
| `~/Library/Application Support/Code` | `~3.52 GB` | Muito peso em cache local do VS Code | Alta |
| `~/.cache` | `~2.96 GB` | Caches recriáveis de toolchain | Alta |
| `~/.npm` | `~1.79 GB` | Cache e execuções `npx` | Alta |
| `~/Downloads` | `~0.69 GB` | DMGs, zips e PDFs duplicáveis | Média |
| `~/Documents` | `~0.33 GB` | Materiais institucionais e propostas | Média |
| `~/Library/Application Support/Cursor` | `~0.04 GB` | Pequeno agora | Baixa |

## Subdiretórios Mais Pesados

### `~/Library/Application Support/Code`
- `WebStorage`: `~1.76 GB`
- `CachedExtensionVSIXs`: `~1.04 GB`
- `Partitions`: `~0.19 GB`
- `CachedData`: `~0.18 GB`
- `Cache`: `~0.13 GB`
- `logs`: `~0.09 GB`

### `~/.cache`
- `uv`: `~1.51 GB`
- `puppeteer`: `~1.03 GB`
- `chroma`: `~0.16 GB`
- `prisma`: `~0.14 GB`
- `opencode`: `~0.07 GB`

### `~/.npm`
- `_cacache`: `~1.04 GB`
- `_npx`: `~0.75 GB`

### `~/Downloads`
- `tor-browser-macos-15.0.18.dmg`: `~0.17 GB`
- Vários PDFs, zips e materiais institucionais com potencial de deduplicação.

### `~/Documents`
- `Avraham Group`: `~0.20 GB`
- `Propostas | Avraham`: `~0.13 GB`

## Onda Recomendada Fora Da Pasta
1. Limpar `~/.cache` e `~/.npm` primeiro.
2. Limpar os caches evidentes do VS Code:
   - `CachedExtensionVSIXs`
   - `CachedData`
   - `Cache`
   - `logs`
3. Revisar `WebStorage` do VS Code com cuidado, porque pode derrubar sessão de extensões e webviews.
4. Revisar `Downloads` para remover DMGs, zips e exportações duplicadas.
5. Se ainda faltar espaço, abrir auditoria dirigida em:
   - `~/Library`
   - backups locais
   - bibliotecas de mídia
   - imagens de VM/SDKs
   - clones fora desta macro-pasta

## Estimativa De Ganho
- Ganho externo de baixo risco bem claro: `~5.8 a 6.3 GB`
- Ganho externo com limpeza moderada, incluindo `WebStorage` e downloads: `~8 GB`
- Ganho combinado com a onda imediata desta pasta: `~11.5 a 14.5 GB`

## Limitações Desta Auditoria
- Alguns diretórios do macOS retornaram `Operation not permitted`.
- Portanto, a Fase 2 atual é um recorte confiável dos diretórios acessíveis, não uma varredura total do sistema.
- Para chegar em `40 GB`, ainda será preciso ampliar a busca em áreas protegidas do sistema ou em outras pastas de trabalho.
