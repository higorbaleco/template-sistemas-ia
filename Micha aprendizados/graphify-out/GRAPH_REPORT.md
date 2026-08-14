# Knowledge Graph Report

## Summary

**Graph Statistics:**
- **Nodes:** 79 (token efficiency, architecture, projects, design system)
- **Edges:** 69 semantic relationships
- **Communities:** 6 clusters
- **Hyperedges:** 9 structured groups
- **Files analyzed:** 24 documents

---

## God Nodes (Highest Connectivity)

These nodes have the most connections and represent core concepts:

1. **token_efficiency_stack** (14 connections)
   - Central hub for token optimization features
   - Connects: RTK, context-mode, claude-mem, artifact-design, dataviz

2. **template_operacao_ia** (12 connections)
   - Foundation for AI-assisted project template
   - Connects: architecture docs, principles, agents

3. **tech_python312** (10 connections)
   - Backend technology hub
   - Connects: PostgreSQL, Redis, FastAPI, testing, deployment

4. **arch_api_layer** (9 connections)
   - API architecture central point
   - Connects: domain layer, services, schemas

5. **project_catalogo_car** (8 connections)
   - Protected project with active issues
   - Connects: cleanup rules, git state management

---

## Surprising Connections

**Strategic cross-domain bridges:**

### 1. Token Efficiency ↔ Project Architecture
- **Path:** token_efficiency_stack → economia_contexto_tokens → protocol_comunicacao
- **Insight:** Token savings strategy influences how the model communicates
- **Implication:** Efficiency is built into architecture decisions, not bolted on

### 2. Graphify Usage ↔ AI Superpowers
- **Path:** ai_assistant_superpowers → graphify (skill invoked)
- **Insight:** Knowledge graph mapping is part of the token efficiency workflow
- **Implication:** Structured knowledge retrieval enhances efficiency

### 3. Workspace Optimization ↔ Cleanup Strategy
- **Path:** workspace_goal (40GB) → cleanup_wave1 → cleanup_targets
- **Insight:** Cleanup strategy is directly tied to storage optimization objectives
- **Implication:** Phased, low-risk cleanup aligns with operational safety

---

## Community Breakdown

| Community | Focus | Cohesion | Key Nodes |
|-----------|-------|----------|-----------|
| **0** | Token Efficiency | 0.94 | RTK, context-mode, claude-mem |
| **1** | Project Template | 0.91 | template_operacao_ia, principles |
| **2** | Tech Stack (Frontend) | 0.89 | Next.js, Tailwind, TypeScript |
| **3** | Tech Stack (Backend) | 0.88 | Python, PostgreSQL, FastAPI |
| **4** | Architecture Layers | 0.87 | API, Domain, Services |
| **5** | Design & Workspace | 0.85 | Design system, Protected projects |

**Strongest Cluster:** Token Efficiency (0.94 cohesion)
- Core session focus: RTK + context-mode create tight semantic coupling

**Weakest Cluster:** Design & Workspace (0.85 cohesion)
- Expected: design system and project protection are separate concerns that intersect

---

## Suggested Questions for Exploration

1. **"How does the token efficiency stack integrate with architecture decisions?"**
   - Trace: token_efficiency_stack → economia_contexto_tokens → protocol_comunicacao
   - Reveals: efficiency constraints on communication protocol

2. **"What protects the critical projects from destructive cleanup?"**
   - Trace: project_catalogo_car → rule_no_aggressive_cleanup → cleanup_wave1
   - Reveals: multi-layer protection strategy

3. **"How do the agents orchestrate within the efficiency constraints?"**
   - Trace: planner_agent → model_routing → opus_model → token_efficiency_stack
   - Reveals: model selection drives efficiency

4. **"What design principles ensure the UI single source of truth?"**
   - Trace: design_single_source → design_no_duplication → design_tokens
   - Reveals: enforcement mechanism through tokens system

5. **"How does graphify fit into the token economy workflow?"**
   - Trace: graphify → ai_assistant_superpowers → token_efficiency_stack
   - Reveals: knowledge mapping as efficiency tool

---

## File Inventory

**Documents Analyzed:** 23 (1 code file)
- Template documentation: 11 files
- Workspace audit: 4 files  
- Project configuration: 2 files
- Session notes: 1 file
- Global instructions: 2 files  
- Sensitive files skipped: 1

---

## Token Economy

**Extraction Cost:**
- Semantic extraction: 88,201 tokens (2 subagents)
- Graph building: ~5,000 tokens (estimation)
- **Total:** ~93,201 tokens for comprehensive knowledge map

**Savings Enabled:**
- Context-mode: 4.9 MB indexed (~50,000 tokens saved)
- RTK integration: 56.2% per-command reduction
- Consolidated understanding: Eliminates repeated context loads

---

## Next Steps

1. **Query the graph** — Use `/graphify query` to answer cross-domain questions
2. **Trace paths** — Use `/graphify path` to understand dependencies
3. **Deep explain** — Use `/graphify explain` on specific nodes
4. **Automate updates** — Use `/graphify --update` when files change
5. **Watch for changes** — Use `/graphify --watch` for live rebuilds

---

*Graph generated: 2026-08-14*
*Method: Multi-agent semantic extraction + AST analysis + community detection*
