# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Antigravity Software Workspace

Umbrella workspace com **~20+ projetos** (Node, React/Vite, Next.js, Python) em diferentes estados operacionais.

## Estrutura & Stacks

**Diretórios principais:**
- Subrepositorios (com `.git` próprio): `Gerador de Propostas | Avraham`, `SOCIAL-MEDIA-OLLEG`, `SITE AVRAHAM 2026`, `Avraham New CRM`, e outros
- Projetos sem versionamento: `Painel SVP Disparos WhatsApp` (2x Vite), `OUTBOUND | OLLEG` (Python + React), `Calculadora-custos-ia`, e ~8 mais
- Estrutura: cada projeto respeita seu próprio `.gitignore` local; raiz tem diretiva umbrella

**Stacks em uso:**
- **Node/npm**: workspaces monorepo, Turbo, Next.js
- **Frontend**: Vite, TanStack Query, TypeScript
- **Python**: backend em alguns projetos (backend + dashboard)
- **Build**: `.next`, `dist`, `node_modules`, `.venv` — **sempre regeneráveis, nunca commitados**

## Reativação de Projetos (Top 5 por peso)

### 1. Gerador de Propostas | Avraham (~1.18 GB)
```bash
cd "Gerador de Propostas | Avraham"
npm install
npm run dev          # Inicia workspace + dashboard
npm run build        # Full build
npm run validate     # Lint + tests
```
**Estado**: repo existente, dirty (alterações locais importantes). **Ação antes de push**: revisar diff, decidir se continua independente ou entra como pasta do workspace.

### 2. SOCIAL-MEDIA-OLLEG (~858 MB)
```bash
cd "SOCIAL-MEDIA-OLLEG/app"
npm install
npm run dev          # Next.js dev server
npm run build && npm run start  # Production
```
**Estado**: repo existente, dirty. **Bloqueia**: `.next` e `node_modules` fora do Git.

### 3. Painel SVP Disparos WhatsApp (~748 MB)
Dois apps Vite independentes — escolha o diretório e:
```bash
npm install
npm run dev
npm run build
```

### 4. OUTBOUND | OLLEG (~675 MB)
```bash
# Backend (Python)
cd "AI Outreach/AI-cold-outreach"
pip install -r requirements.txt
python main.py  # ou a entrada definida

# Dashboard (Vite)
cd "AI-cold-outreach/dashboard"
npm install && npm run dev
```

### 5. SITE AVRAHAM 2026 (~642 MB)
```bash
cd "SITE AVRAHAM 2026/avraham-lp-verde"
npm install
npm run dev
npm run build
```
**Estado**: repo existente, `ahead 1`, dirty. **Bloqueia**: `.next`, `node_modules` fora do Git.

---

## Antes de Fazer Push

**Checklist obrigatório:**
1. ✓ Rodar `git status` e verificar se há `.zip`, `node_modules`, `.next`, `.venv`, `dist` staged. **Nunca commitá-los.**
2. ✓ Se projeto é `ahead` ou `behind` remoto, revisar commits locais antes de push.
3. ✓ Projetos com alterações sensíveis (`.env`, credenciais): confirmar que não estão no stage.
4. ✓ Para projetos sem remoto configurado: documentar no README local antes de versionar.
5. ✓ Validar `.gitignore` local — deve estar sincronizado com `.gitignore` umbrella da raiz.

**Projetos bloqueados para operações destrutivas (sem revisão manual):**
- `Catalogo Car Systema` (ahead=88)
- `Avraham New CRM` (behind=1, ahead=2)
- `SITE AVRAHAM 2026` (dirty + behind=1 em subrepo)
- Qualquer projeto com `dirty` ou sem origin configurado

---

## Documentação de Suporte

Leia em ordem:
1. **[README.md](./README.md)** — visão geral do workspace
2. **[docs/INVENTARIO-WORKSPACE.md](docs/INVENTARIO-WORKSPACE.md)** — estado de todos os projetos, peso, stack, comando de reativação
3. **[docs/ROADMAP-REATIVACAO.md](docs/ROADMAP-REATIVACAO.md)** — fases de blindagem, ordem de reativação, checklist por projeto
4. **[docs/GUIA-GIT-WORKSPACE.md](docs/GUIA-GIT-WORKSPACE.md)** — politica de versionamento e estrutura umbrella

---

## Regras de Ouro

1. **Nenhum artefato regenerável entra no Git**: `.gitignore` umbrella bloqueia `node_modules`, `.venv`, `.next`, `.output`, `dist`, `.turbo`, `.cache`.
2. **Projeto "protegido" = nenhuma operação destrutiva sem revisão**. Sempre verificar estado Git (`ahead`, `behind`, `dirty`) antes de ações em massa.
3. **Subrepositorios mantêm histórico próprio**: a raiz é mapa operacional, não agregador de código-fonte.
4. **Antes de limpar, documentar**: projetos sem commits ou sem remoto devem ter README local explicando propósito e status (ativo/legado/arquivado).
5. **Espaço**: a pasta atual cabe em ~8 GB se limpar artefatos regeneráveis; targets além disso estão em fases de limpeza fora desta pasta.
