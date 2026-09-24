# Especificações Técnicas — Sistema de Catalogação Semi-Automática do Macbook

**Data**: 2026-08-23  
**Versão**: 2.0 (Fase 2 — escopo completo 241 GB)  
**Última atualização**: Fase 2 com inclusão de ~/Library, /Applications, Dados do Sistema

---

## 1. Objetivo e Scope

**Objetivo**: Catalogar **100% do espaço ocupado no Mac** (241 GB de 245 GB usados) de forma semi-automática, categorizar cada arquivo/pasta para decisão do usuário, sem **nunca apagar ou mover** nada até aprovação manual.

**Scope completo**:
- ✅ `$HOME` (Documents, Downloads, Antigravity Software, OpenWa Teste, Desktop, etc.) — ~69.52 GB
- ✅ `~/Library` (agregado por subpasta de topo) — ~73 GB
- ✅ `/Applications` (apps instalados) — ~53.28 GB
- ✅ "Dados do Sistema" (Xcode, Caches, Containers, Time Machine) — ~77.09 GB
- ✅ 18 repositórios Git encontrados
- ✅ Duplicados por SHA256
- ✅ Artefatos regeneráveis (node_modules, .venv, caches, etc.)

**Fora de scope**:
- ❌ `/System`, `/Applications/` do sistema operacional — não se toca
- ❌ Xcode `/Applications/Xcode.app` em si (só Developer/DerivedData)
- ❌ Snapshots de Time Machine na partição real (só os locais em APFS)
- ❌ Dados de volumes montados diferentes de `$HOME`

---

## 2. Fluxo de Dados

```
[Mac Filesystem] 
    ↓
[scan_inventory.py] + [scan_applications.py] + [scan_system_data.py]
    ↓ (JSONL + JSON)
[catalog/inventory.jsonl] [catalog/applications.json] [catalog/system_data.json]
    ↓
[scan_regenerable.py] [scan_git_repos.py] [scan_duplicates.py]
    ↓ (JSON)
[catalog/regenerable.json] [catalog/git_repos.json] [catalog/duplicates.json]
    ↓
[Sub-agentes de classificação] (6 agentes em paralelo, via Agent tool)
    ↓ (JSON)
[catalog/classification.json]
    ↓
[scan_drive_overlap.py] (MCP Google Drive, leitura)
    ↓ (JSON)
[catalog/drive_overlap.json]
    ↓
[build_catalog.py] (consolidação)
    ↓ (CSV + MD + JSON)
[catalog/catalog.csv] [catalog/RELATORIO.md] [catalog/dashboard_data.json]
    ↓
[dashboard.html] (Artifact, visualização interativa)
```

---

## 3. Especificação de Dados

### 3.1 `inventory.jsonl` (varredura do $HOME + ~/Library)

**Entrada**: `os.walk($HOME, excludes=Library)` + `du -sh` em subpastas de `~/Library`

**Formato por linha**:
```json
{
  "path": "/Users/higorplens/Antigravity Software/projeto-x",
  "size_bytes": 1234567890,
  "mtime": 1692000000.0,
  "mtime_iso": "2023-08-14T10:00:00",
  "ext": "dir",
  "top_level_dir": "Antigravity Software",
  "type": "dir" | "file"
}
```

**Para ~/Library** (agregado):
```json
{
  "path": "/Users/higorplens/Library/Caches",
  "size_bytes": 50000000000,
  "mtime_iso": "2026-08-23T08:00:00",
  "ext": "dir",
  "top_level_dir": "Library",
  "type": "dir_aggregate"
}
```

**Contagem esperada**: ~30k+ items em `$HOME`, ~20+ registros agregados em `~/Library`.

---

### 3.2 `applications.json` (catálogo de /Applications)

**Entrada**: `os.listdir(/Applications)`, `du -sh`, `mdls kMDItemLastUsedDate`

**Formato por app**:
```json
{
  "path": "/Applications/Xcode.app",
  "name": "Xcode.app",
  "size_bytes": 50000000000,
  "mtime": 1692000000.0,
  "mtime_iso": "2023-08-14T10:00:00",
  "last_used": "2026-08-20 14:30:00 +0000",
  "is_system_app": false,
  "type": "application"
}
```

**Contagem esperada**: 100-200 apps.

---

### 3.3 `system_data.json` (Dados do Sistema)

**Entrada**: `du -sh` em Xcode DerivedData, Caches, Containers, MobileSync, `tmutil listlocalsnapshots`

**Formato**:
```json
{
  "timestamp": "2026-08-23T08:00:00",
  "categories": {
    "xcode_derived_data": {
      "path": "/Users/higorplens/Library/Developer/Xcode/DerivedData",
      "size_bytes": 50000000000,
      "size_gb": 50.0,
      "description": "Xcode build artifacts (100% regenerável)",
      "regenerable": true
    },
    "ios_simulators": { ... },
    "general_caches": { ... },
    "containers": { ... },
    "group_containers": { ... },
    "application_support": { ... },
    "mobile_backups": { ... },
    "time_machine_snapshots": {
      "count": 5,
      "snapshots": ["com.apple.TimeMachine.2026-08-23-100000.local", ...],
      "note": "Remoção via tmutil deletelocalsnapshots (requer admin)"
    }
  },
  "total_size_bytes": 200000000000,
  "total_size_gb": 200.0
}
```

---

### 3.4 `regenerable.json` (artefatos regeneráveis)

**Marcadores procurados**: `node_modules`, `.venv`, `venv`, `.next`, `dist`, `build`, `__pycache__`, `.cache`, `Cache`, `CachedData`, `CachedExtensionVSIXs`, `.gradle`, `Pods`, e mais em `~/Library` (DerivedData, caches)

**Formato**:
```json
{
  "node_modules": {
    "count": 45,
    "size_bytes": 5000000000,
    "size_gb": 5.0,
    "paths": ["/Users/higorplens/project1/node_modules", ...]
  },
  "venv": {
    "count": 12,
    "size_bytes": 3000000000,
    "paths": [...]
  }
}
```

**Total esperado**: ~50-100 GB regenerável com segurança.

---

### 3.5 `git_repos.json` (18 repositórios encontrados)

**Entrada**: `git status --porcelain`, `git rev-list --left-right --count HEAD...@{upstream}`, `git config --get remote.origin.url`

**Formato por repo**:
```json
[
  {
    "path": "/Users/higorplens/Antigravity Software/TEM GIT/projeto-a",
    "git_status": "clean",
    "git_status_detail": "",
    "origin_url": "git@github.com:user/projeto-a.git",
    "ahead_behind": {
      "ahead": 2,
      "behind": 0
    },
    "last_commit": "2026-08-20"
  }
]
```

**Contagem**: 18 repos (9 em TEM GIT/, 9 em NAO TEM GIT/ com .git local).

---

### 3.6 `duplicates.json` (grupos de duplicados por SHA256)

**Entrada**: agrupa por `size_bytes`, calcula SHA256 para duplicados potenciais

**Formato**:
```json
{
  "sha256_abc123...": {
    "count": 3,
    "size_bytes": 10000000,
    "size_gb": 0.01,
    "paths": [
      "/Users/higorplens/projeto/file.zip",
      "/Users/higorplens/backup/file.zip",
      "/Users/higorplens/Desktop/file.zip"
    ]
  }
}
```

**Espaço recuperável**: 10-20 GB (estimado).

---

### 3.7 `classification.json` (saída dos sub-agentes)

**Entrada**: 6 sub-agentes (Documents, NAO TEM GIT/, Downloads, Desktop, OpenWa Teste, /Applications, ~/Library)

**Formato**:
```json
{
  "items": [
    {
      "path": "/Users/higorplens/Documents/Archived/old-project-2024",
      "acao_recomendada": "apagar-depois",
      "motivo": "Projeto de 2024, não há commits desde Jan 2024, caches regeneráveis",
      "risco": "baixo",
      "agent": "agent-documents-old"
    }
  ],
  "status": "completo",
  "agentes_rodados": [...]
}
```

---

### 3.8 `catalog.csv` (consolidação final — 1 linha por item)

**Colunas**:
- `path`: caminho completo
- `size_bytes`, `size_mb`, `size_gb`: tamanho em várias escalas
- `type`: `file` | `dir` | `dir_aggregate` | `application`
- `ext`: extensão (`.pdf`, `.app`, `dir`, etc.)
- `top_level`: pasta de topo (`Documents`, `Library`, `Antigravity Software`, etc.)
- `mtime`, `mtime_iso`: data de modificação
- `git_status`: `clean` | `dirty` | `ahead` | `behind` | (vazio se não é repo)
- `git_origin`: URL do remote (ex: `git@github.com:user/repo.git`)
- `git_ahead_behind`: ex: `ahead=2,behind=0`
- `duplicate_group`: ID do grupo de duplicados (vazio se único)
- `regenerable_type`: marcador regenerável (ex: `node_modules`, `Caches`, vazio)
- `acao_recomendada`: `drive` | `git-novo` | `git-atualizar` | `apagar-depois` | `documentar` | `manter`
- `motivo`: explicação curta
- `risco`: `baixo` | `médio` | `alto`

**Contagem esperada**: ~30k+ linhas de `$HOME` + ~20 agregadas de `~/Library` + ~100-200 de `/Applications`.

---

### 3.9 `RELATORIO.md` (resumo executivo)

**Seções**:
1. **Resumo por Ação Recomendada**: tabela com contagem e GB para cada `acao_recomendada`
2. **Distribuição por Categoria macOS Storage**: Documentos, Aplicativos, Dados do Sistema (com $ em GB)
3. **Top 20 Maiores Items**: path, tamanho, ação, risco
4. **Regenerável com Segurança**: breakdown por marcador (node_modules, DerivedData, etc.)
5. **Duplicados Encontrados**: grupos com espaço recuperável
6. **Repositórios Git**: status por repo (dirty/clean/ahead/behind)
7. **Próximas Ações Recomendadas**: ordem de limpeza segura

---

### 3.10 `dashboard.html` (Artifact interativo)

**Dados embutidos**: `dashboard_data.json` completo (13+ MB com ~30k items)

**Features**:
- **Stat cards**: total GB, items, regenerável %, duplicados %
- **Gráficos**: distribuição por categoria, por tamanho (bins)
- **Tabela interativa**: sort/filter por path, tamanho, ação, risco, tipo
- **Filtros**: por `top_level_dir`, `acao_recomendada`, `type`
- **Tema automático**: claro/escuro conforme preferência do SO
- **Performance**: renderiza primeiros 500 items, lazy-load em scroll

---

## 4. Categorias de Ação

| Ação | Critério | Exemplo | Risco | Ação Futura |
|---|---|---|---|---|
| `drive` | Documento/mídia pesado, fora de repo git, não duplicado no Drive | PDFs, apresentações, zips de backup | Baixo | Upload manual para Google Drive |
| `git-novo` | Pasta com código-fonte, sem `.git` na raiz | pastas hoje em `NAO TEM GIT/` com código | Médio | Inicializar `.git` e fazer primeiro commit |
| `git-atualizar` | Repo `.git` existente com `dirty`/`ahead`/`behind` | projetos com mudanças não commitadas | Médio | Commit, push ou pull conforme status |
| `apagar-depois` | Artefato regenerável ou duplicata confirmada | `node_modules`, `.venv`, `DerivedData`, arquivo .zip duplicado | Baixo | Remover com segurança (serão recriados) |
| `documentar` | Pasta-contêiner ambígua, não vale mover nem apagar | `NAO TEM GIT/Comercial Avraham` (vazia), pastas com vários subprojetos | Médio | Criar README explicando conteúdo e decisão futura |
| `manter` | Ativo, protegido, sem ação necessária | projetos "ativo protegido" (INVENTARIO.md), apps em uso | Baixo | Nenhuma ação |

---

## 5. Segurança e Garantias

1. **Read-only**: Nenhum script toca no filesystem além de escrever JSONs em `~/mac-cleanup/catalog/`.
2. **Reproducibilidade**: Todos os scripts são determinísticos e podem ser re-rodados.
3. **Reversibilidade**: O catálogo é só informação; a remoção real fica para o usuário.
4. **Permissões**: Alguns caminhos requerem permissões (ex: `~/Library/...`); erros são logados, não interrompem o scan.
5. **Performance**: Inventário completo (~241 GB, 30k items) em ~2-3 min; duplicates (SHA256) em ~5-10 min.

---

## 6. Recursos Necessários

| Recurso | Usado | Requerimento |
|---|---|---|
| Espaço em disco (~/mac-cleanup/) | ~100-200 MB (JSONs + CSVs) | ✓ Disponível |
| Binários | `du`, `mdls`, `tmutil`, `git`, `python3` | ✓ Padrão macOS |
| Ferramentas externas | Nenhuma (sem fdupes/rmlint/md5deep) | ✓ Nenhuma |
| Permissões | Leitura em `~` (exceto alguns dirs ocultos) | ⚠ Pode pedir sudo para certas árvores |
| API MCP | `mcp__claude_ai_Google_Drive__search_files` | ⚠ Requer autorização (fase scan_drive_overlap) |
| Tempo | ~20-30 min total (inventory + apps + system_data + regenerable + git + duplicates) | ✓ Razoável |
| Agentes Claude | 6 sub-agentes em paralelo, ~10-20 tokens cada | ✓ Dentro do orçamento |

---

## 7. Roadmap

**✅ Fase 1** (concluída 2026-08-23 07:55): Catálogo incompleto (6.51 GB de 241 GB).

**🟡 Fase 2** (em andamento 2026-08-23 08:59):
1. ✅ Reescrever scan_inventory.py com ~/Library agregado
2. ✅ Criar scan_applications.py e scan_system_data.py
3. 🔄 Rodar todos os scans (em background, ~5-10 min)
4. 🔄 Re-rodar scan_regenerable.py, scan_git_repos.py, scan_duplicates.py
5. ⏳ Disparar 6 sub-agentes de classificação em paralelo
6. ⏳ Rodar scan_drive_overlap.py (requer confirmação do usuário)
7. ⏳ Rodar build_catalog.py e consolidar
8. ⏳ Republicar dashboard.html com dados completos (Artifact URL mantida)

**Fase 3** (futura, após aprovação do usuário): Executar limpeza real (remover/mover/upload).

---

## 8. Apêndice A — Marcos de Validação

- [ ] `catalog.csv`: total de tamanho ≈ 241 GB (±5%)
- [ ] Documentos: ~69.52 GB (✓ bater com macOS Storage)
- [ ] Aplicativos: ~53.28 GB (✓ bater com macOS Storage)
- [ ] Dados do Sistema: ~77.09 GB (✓ bater com macOS Storage)
- [ ] 18 repositórios Git aparecem em catalog.csv
- [ ] Regenerável identificado: 50-100 GB
- [ ] Duplicados: 10-20 GB
- [ ] Dashboard carrega em < 2 seg (com dados embutidos)
- [ ] Todos os 6 sub-agentes completaram classificação

---

**Próxima atualização**: Quando Fase 2 terminar.
