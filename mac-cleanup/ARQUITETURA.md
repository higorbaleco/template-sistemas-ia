# Sistema de Catalogação Semi-Automática do Mac — Arquitetura

## Overview

Sistema modular de scripts + agentes para auditar e catalogar arquivos do Mac, separando candidatos para:
- **Drive:** Documentos/mídia a arquivar em cloud
- **Git (novo):** Código sem versionamento
- **Git (atualizar):** Repos com changes não sincronizadas
- **Apagar depois:** Artefatos regeneráveis e duplicados
- **Documentar:** Pastas ambíguas que precisam de README
- **Manter:** Ativo, não precisa ação

## Componentes

### 1. Scripts Determinísticos (read-only)

#### `scan_inventory.py`
**Entrada:** Nenhuma  
**Saída:** `inventory.jsonl` (30k+ items)  
**O que faz:**
- `os.walk` recursivo a partir de `~`
- Coleta para cada arquivo/dir: path, size, mtime, ext, top_level_dir
- Pula: `.Trash`, `.git/objects`, pastas de sistema ocultas
- ~2-3 min de execução

**Output format:**
```json
{
  "path": "/Users/higorplens/Documents/Arquivo.pdf",
  "size_bytes": 1048576,
  "mtime": 1692460800.0,
  "mtime_iso": "2023-08-19T12:00:00",
  "ext": ".pdf",
  "top_level_dir": "Documents",
  "type": "file"
}
```

#### `scan_git_repos.py`
**Entrada:** Lista hardcoded de 18 repos `.git` encontrados  
**Saída:** `git_repos.json`  
**O que faz:**
- Para cada `.git`, roda: `git status`, `git rev-list`, `git log -1`
- Detecta: dirty (# modified files), ahead/behind vs origin, última atividade
- Classifica status: "dirty" | "clean"

**Output format:**
```json
{
  "path": "/Users/higorplens/Antigravity Software",
  "name": "Antigravity Software",
  "git_status": "dirty",
  "dirty_files": 5,
  "origin_url": "git@github.com:avraham/...",
  "current_branch": "main",
  "ahead_behind": {"ahead": 2, "behind": 1},
  "last_commit": "2026-08-22T15:30:00+00:00"
}
```

#### `scan_regenerable.py`
**Entrada:** `inventory.jsonl`  
**Saída:** `regenerable.json` (resumo por marcador)  
**O que faz:**
- Procura por marcadores conhecidos: `node_modules`, `.venv`, `.next`, `__pycache__`, caches, etc.
- Agrupa por tamanho total e contagem
- Exemplo de saída:
```json
{
  "node_modules": {
    "category": "npm dependencies",
    "total_size_gb": 0.15,
    "count": 2847,
    "examples": ["path1", "path2", "path3"]
  }
}
```

#### `scan_duplicates.py`
**Entrada:** `inventory.jsonl`  
**Saída:** `duplicates.json`  
**O que faz:**
- Agrupa arquivos por tamanho (fast check)
- Calcula SHA256 só para arquivos com tamanho repetido (economiza CPU)
- Produz grupos de duplicados reais + espaço recuperável por remover N-1 cópias
- **Lento:** ~5-10 min em 6.51 GB de dados
```json
{
  "dup-1": {
    "hash": "abc123...",
    "file_size_mb": 50.5,
    "count": 3,
    "recoverable_mb": 101.0,
    "paths": ["path1.pdf", "path2.pdf", "path3.pdf"]
  }
}
```

#### `scan_drive_overlap.py`
**Entrada:** `classification.json` (items marcados como `drive`)  
**Saída:** `drive_overlap.json`  
**O que faz:**
- Para cada candidato a `drive`, chama MCP `google_drive__search_files` por nome
- Retorna: "já existe no Drive?" | "novo upload?"
- **Nota:** Implementado como placeholder, rodará após sub-agentes classificarem

#### `build_catalog.py`
**Entrada:** inventory.jsonl + git_repos.json + regenerable.json + duplicates.json + classification.json  
**Saída:** catalog.csv + RELATORIO.md + dashboard_data.json  
**O que faz:**
- Merge de todas as análises
- Aplica heurísticas: se é regenerável e não foi classificado → `apagar-depois`
- Gera tabela CSV (uma linha por item, sortável em Excel)
- Gera relatório MD (resumo por ação, top 20 maiores)
- Gera JSON com dados embutidos para o dashboard HTML

### 2. Sub-agentes de Classificação

Um **agente independente por grande pasta/projeto**. Cada um recebe:
- Lista de items já catalogados com tamanho/mtime/git_status
- Instruções: "classifique como drive/git-novo/git-atualizar/documentar/manter"
- Retorna JSON: `{path, acao_recomendada, motivo, risco}`

**Exemplo de execução (ainda a fazer):**

```python
# Pseudo-code
for area in ["Documents", "Downloads", "Antigravity Software/NAO TEM GIT", ...]:
    items_in_area = inventory_filtered_by_top_level(area)
    result = agent(
        f"Classifique esses {len(items_in_area)} items de {area}...",
        schema=ClassificationSchema
    )
    # Merge result into classification.json
```

### 3. Dashboard Interativo

**Arquivo:** `dashboard.html` (13.2 MB com dados embutidos)  
**Dados:** `dashboard_data.json` embutido como JSON literal

**Features:**
- Stat-cards (total, GB, regenerável, duplicável)
- Gráficos (distribuição por ação, top 5 categorias)
- Tabela interativa (sort, filter por path/ação/risco)
- Tema claro/escuro automático
- ~30k linhas de dados, renderizadas sob demanda (primeiras 500 na tabela)

## Fluxo de Dados

```
~ (home directory)
    ↓
[scan_inventory.py] → inventory.jsonl (30k items raw)
    ↓
├─ [scan_git_repos.py] → git_repos.json (18 repos)
├─ [scan_regenerable.py] → regenerable.json (0.29 GB)
├─ [scan_duplicates.py] → duplicates.json (em progresso)
│
├─ [Sub-agentes] → classification.json (aguardando)
│   ├─ Agent 1: Documents/
│   ├─ Agent 2: Antigravity Software/NAO TEM GIT/
│   ├─ Agent 3: Downloads/
│   └─ Agent 4: OpenWa Teste/
│
└─ [build_catalog.py] → catálogo consolidado
   ├─ catalog.csv (para Excel)
   ├─ RELATORIO.md (resumo executivo)
   ├─ dashboard_data.json (para visualização)
   └─ dashboard.html (viz interativa)
```

## Como Estender

### Adicionar Nova Categoria de Ação
1. Editar `build_catalog.py`: adicionar novo valor em `acao_recomendada`
2. Atualizar sub-agentes: incluir nova categoria nas instruções
3. Atualizar dashboard: adicionar cor/estilo para nova categoria

### Adicionar Novo Marcador Regenerável
1. Editar `scan_regenerable.py`: adicionar à dict `REGENERABLE_MARKERS`
2. Re-rodar `scan_regenerable.py`
3. Re-rodar `build_catalog.py` (heurística automática marcará como `apagar-depois`)

### Incluir `~/Library` na Análise
1. Remover filtro de `Library` em `scan_inventory.py`
2. Aumentar limite de timeout (pode levar 10+ min)
3. Considerar: caches do VS Code (~3.5 GB) podem ser regenerados com segurança

## Performance

| Script | Tempo | Input | Output |
|--------|-------|-------|--------|
| scan_inventory | 2-3 min | ~ (6.5 GB explorados) | 7.8 MB JSONL |
| scan_git_repos | <5 sec | 18 repos | 7.2 KB JSON |
| scan_regenerable | <30 sec | inventory.jsonl | 1.3 KB JSON |
| scan_duplicates | 5-10 min | inventory.jsonl (6.5 GB) | ~? KB JSON |
| build_catalog | <10 sec | todos os JSON | 6.0 MB CSV |
| sub-agentes | varia | ~1-2GB por agente | 100s-1000s KB JSON |

**Total:** ~15-20 min (Serial: inventory → regenerable/git → duplicates → agentes → build)

## Estrutura de Diretórios

```
~/mac-cleanup/
├── scripts/
│   ├── scan_inventory.py        # 50 linhas
│   ├── scan_git_repos.py        # 80 linhas
│   ├── scan_regenerable.py      # 80 linhas
│   ├── scan_duplicates.py       # 100 linhas
│   ├── scan_drive_overlap.py    # 30 linhas (placeholder)
│   └── build_catalog.py         # 150 linhas
├── catalog/
│   ├── *.jsonl, *.json, *.csv
│   ├── RELATORIO.md
│   └── dashboard.html
├── logs/
│   └── scan-*.log
└── RESUMO_FASE_1.md, ARQUITETURA.md
```

## Notas de Segurança

- **Leitura-only:** Nenhum script modifica, deleta ou move arquivos
- **Sem dependências externas:** Python 3.10+ stdlib apenas (json, os, pathlib, subprocess)
- **Sem binários:** Usa `git` CLI (disponível em Mac) e Python nativo
- **Dados sensíveis:** Paths aparecem no CSV/JSON — guardar em `~/mac-cleanup` (não commitar)

## Roadmap (Fases 2-3)

- **Fase 2:** Rodar sub-agentes, consolidar, finalizar duplicates scan
- **Fase 3:** Upload para Drive (MCP), atualizar Git repos, remoção de artefatos regeneráveis
- **Fase 4:** Auditoria ampliada de `~/Library` e SDKs/caches de sistema

