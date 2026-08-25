# Mac Cleanup Catalog

Ferramentas read-only para catalogar o uso do disco no Mac e preparar uma limpeza manual segura.

## O que este projeto faz

- Varre `~/`, `~/Library`, `/Applications` e dados de sistema relevantes
- Identifica repositórios Git, artefatos regeneráveis e duplicatas
- Consolida tudo em `catalog/catalog.csv`, `catalog/RELATORIO.md` e `catalog/dashboard_data.json`
- Mantém qualquer decisão destrutiva fora desta fase

## O que voce precisa para executar

- macOS com `python3`
- Ferramentas padrao do sistema: `du`, `mdls`, `tmutil`, `git`
- Permissao de leitura para os caminhos do usuario
- Opcional: Full Disk Access para o terminal, se o macOS bloquear `~/Library` ou metadata do Finder
- Opcional: acesso ao Google Drive via MCP se quiser comparar overlap depois

## Como rodar

```bash
cd ~/mac-cleanup
python3 scripts/check_environment.py
python3 scripts/run_pipeline.py
```

## Painel local

```bash
cd ~/mac-cleanup
python3 scripts/app_server.py
```

Ou abra o atalho instalavel:

- `Open Mac Curator.command`
- `mac-curator.command`
- `dist/Mac Curator.app`

O painel abre no navegador local com a interface estilo app e os botoes de automacao.

## Saidas geradas

- `catalog/inventory.jsonl`
- `catalog/applications.json`
- `catalog/system_data.json`
- `catalog/git_repos.json`
- `catalog/regenerable.json`
- `catalog/duplicates.json`
- `catalog/classification.json`
- `catalog/drive_overlap.json`
- `catalog/catalog.csv`
- `catalog/RELATORIO.md`
- `catalog/dashboard_data.json`

## Regra de seguranca

Nada aqui apaga, move ou modifica arquivos do seu disco. A fase atual e apenas de catalogacao e classificacao.
