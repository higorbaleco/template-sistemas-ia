# 📚 Índice de Documentação — Central Empresarial Local

**Navegação completa de toda a documentação do projeto**

---

## 🎯 Para Começar

### Novos Desenvolvedores
1. **[README.md](../README.md)** — Visão geral do projeto
2. **[CLAUDE.md](../CLAUDE.md)** — Guia de desenvolvimento
3. **[docs/ESTRUTURA_PROJETO.md](./ESTRUTURA_PROJETO.md)** — Organização de arquivos
4. **[docs/guides/SETUP_LOCAL.md](./guides/SETUP_LOCAL.md)** — Configurar ambiente

### Usuários Finais
1. **[README.md](../README.md)** — O que é o sistema
2. **[docs/guides/USUARIO.md](./guides/USUARIO.md)** — Como usar
3. **[docs/guides/FAQ.md](./guides/FAQ.md)** — Perguntas frequentes
4. **[docs/guides/TROUBLESHOOTING.md](./guides/TROUBLESHOOTING.md)** — Solução de problemas

### Arquitetos/Tech Leads
1. **[docs/architecture/ARQUITETURA.md](./architecture/ARQUITETURA.md)** — Design técnico
2. **[docs/database/SCHEMA.md](./database/SCHEMA.md)** — Database schema
3. **[ESPECIFICACAO.md](../ESPECIFICACAO.md)** — Requisitos completos
4. **[docs/superpowers/plans/](./superpowers/plans/)** — Roadmaps de implementação

---

## 📖 Documentação por Tópico

### 🏗️ Arquitetura & Design

| Documento | Descrição | Público |
|-----------|-----------|---------|
| [ARQUITETURA.md](./architecture/ARQUITETURA.md) | Design técnico, componentes, fluxos | Devs, Tech Leads |
| [ESTRUTURA_PROJETO.md](./ESTRUTURA_PROJETO.md) | Organização de pastas e arquivos | Devs |
| [ESPECIFICACAO.md](../ESPECIFICACAO.md) | 62 seções com requisitos completos | Todos |

### 💾 Database

| Documento | Descrição | Público |
|-----------|-----------|---------|
| [SCHEMA.md](./database/SCHEMA.md) | SQL schema detalhado, índices | Devs Backend |
| [MIGRATIONS.md](./database/MIGRATIONS.md) | Guia de versionamento de schema | Devs Backend |
| [QUERIES.md](./database/QUERIES.md) | Queries importantes e otimizadas | Devs Backend |

### 📚 Guias

| Documento | Descrição | Público |
|-----------|-----------|---------|
| [USUARIO.md](./guides/USUARIO.md) | Manual de uso para usuários finais | Usuários |
| [DESENVOLVEDOR.md](./guides/DESENVOLVEDOR.md) | Guia completo de desenvolvimento | Devs |
| [SETUP_LOCAL.md](./guides/SETUP_LOCAL.md) | Configurar ambiente de dev | Devs |
| [FAQ.md](./guides/FAQ.md) | Perguntas frequentes | Todos |
| [TROUBLESHOOTING.md](./guides/TROUBLESHOOTING.md) | Solução de problemas | Usuarios, Devs |

### 📋 Roadmaps & Planos

| Documento | Descrição | Status |
|-----------|-----------|--------|
| [2026-08-19-central-empresarial-phase-1.md](./superpowers/plans/2026-08-19-central-empresarial-phase-1.md) | Phase 1: Foundation (Auth, Clientes, Backup) | 🟡 Em Andamento |
| [2026-XX-XX-central-empresarial-phase-2.md](./superpowers/plans/) | Phase 2: Commercial (Leads, Pipeline, Vendas) | 🔴 Planejado |
| [2026-XX-XX-central-empresarial-phase-3.md](./superpowers/plans/) | Phase 3: Financial (Contas, Fluxo, Impostos) | 🔴 Planejado |

### 🔧 Implementação

| Documento | Descrição | Link |
|-----------|-----------|------|
| Phase 1 Tasks | 6 tarefas de implementação | [Ver Plan](./superpowers/plans/2026-08-19-central-empresarial-phase-1.md) |
| Database Setup | Criar schema SQLite | Task 2 do Plan |
| Authentication | Login com bcrypt | Task 3 do Plan |
| Client Management | CRUD de clientes | Task 4 do Plan |
| Backups | Backup automático | Task 5 do Plan |
| IPC Bridge | Comunicação Electron-Python | Task 6 do Plan |

---

## 🗂️ Estrutura de Arquivos

### Arquivos Principais
```
central-empresarial/
├── README.md                    ← LEIA PRIMEIRO
├── CLAUDE.md                    ← Guia de Dev
├── ESPECIFICACAO.md             ← Requisitos (62 seções)
└── docs/INDEX.md                ← Este arquivo
```

### Documentação Técnica
```
docs/
├── architecture/ARQUITETURA.md  ← Design, componentes, fluxos
├── database/SCHEMA.md           ← Tables, índices, relationships
├── database/MIGRATIONS.md       ← Versionamento de schema
└── database/QUERIES.md          ← Queries otimizadas
```

### Guias Práticos
```
docs/guides/
├── USUARIO.md                   ← Manual para usuários finais
├── DESENVOLVEDOR.md             ← Guia completo de dev
├── SETUP_LOCAL.md               ← Ambiente de desenvolvimento
├── FAQ.md                        ← Perguntas frequentes
└── TROUBLESHOOTING.md           ← Solução de problemas
```

### Implementação
```
docs/superpowers/plans/
├── 2026-08-19-central-empresarial-phase-1.md
├── 2026-XX-XX-central-empresarial-phase-2.md
└── 2026-XX-XX-central-empresarial-phase-3.md
```

---

## 🔍 Buscar por Tópico

### Autenticação & Segurança
- [CLAUDE.md](../CLAUDE.md) → Seção "Authentication & Security"
- [ARQUITETURA.md](./architecture/ARQUITETURA.md) → Seção 7 "Segurança"
- [ESPECIFICACAO.md](../ESPECIFICACAO.md) → Seções 8-10
- [Phase 1 Plan](./superpowers/plans/2026-08-19-central-empresarial-phase-1.md) → Task 3

### Database & Persistência
- [SCHEMA.md](./database/SCHEMA.md) → Schema completo (10 seções)
- [ARQUITETURA.md](./architecture/ARQUITETURA.md) → Seção 4.5 "Database"
- [Phase 1 Plan](./superpowers/plans/2026-08-19-central-empresarial-phase-1.md) → Task 2

### Frontend & UI
- [ESTRUTURA_PROJETO.md](./ESTRUTURA_PROJETO.md) → Seção "frontend/"
- [CLAUDE.md](../CLAUDE.md) → Seção "Code Conventions"
- [Phase 1 Plan](./superpowers/plans/2026-08-19-central-empresarial-phase-1.md) → Task 6

### Backend & Serviços
- [ESTRUTURA_PROJETO.md](./ESTRUTURA_PROJETO.md) → Seção "backend/"
- [ARQUITETURA.md](./architecture/ARQUITETURA.md) → Seção 4.4 "Backend"
- [Phase 1 Plan](./superpowers/plans/2026-08-19-central-empresarial-phase-1.md) → Tasks 2-5

### Clientes & CRM
- [ESPECIFICACAO.md](../ESPECIFICACAO.md) → Seções 15-23
- [SCHEMA.md](./database/SCHEMA.md) → Seção 2 "Tabelas de Clientes"
- [Phase 1 Plan](./superpowers/plans/2026-08-19-central-empresarial-phase-1.md) → Task 4

### Vendas (Phase 2)
- [ESPECIFICACAO.md](../ESPECIFICACAO.md) → Seções 21-35
- [SCHEMA.md](./database/SCHEMA.md) → Seção 4 "Tabelas de Vendas"

### Financeiro (Phase 3)
- [ESPECIFICACAO.md](../ESPECIFICACAO.md) → Seções 33-48
- [SCHEMA.md](./database/SCHEMA.md) → Seção 6 "Tabelas Financeiras"

### Inteligência & KPIs (Phase 6)
- [ESPECIFICACAO.md](../ESPECIFICACAO.md) → Seções 49-60
- [ARQUITETURA.md](./architecture/ARQUITETURA.md) → Seção 8 "Performance"

### Testes
- [CLAUDE.md](../CLAUDE.md) → Seção "Testing Strategy"
- [Phase 1 Plan](./superpowers/plans/2026-08-19-central-empresarial-phase-1.md) → Todas as tasks incluem testes

### Deployment & Build
- [CLAUDE.md](../CLAUDE.md) → Seção "Deployment Notes"
- [ESTRUTURA_PROJETO.md](./ESTRUTURA_PROJETO.md) → Seção "Deployment"
- [SETUP_LOCAL.md](./guides/SETUP_LOCAL.md) → Seção "Build para Produção"

---

## 🎓 Caminhos de Aprendizado

### Path 1: "Quero Entender o Projeto"
1. [README.md](../README.md) (5 min)
2. [ESPECIFICACAO.md](../ESPECIFICACAO.md) → Visão geral (15 min)
3. [ARQUITETURA.md](./architecture/ARQUITETURA.md) → Visão Geral (10 min)
4. [ESTRUTURA_PROJETO.md](./ESTRUTURA_PROJETO.md) (10 min)

**Tempo total:** ~40 minutos

### Path 2: "Quero Começar a Desenvolver"
1. [CLAUDE.md](../CLAUDE.md) (20 min)
2. [SETUP_LOCAL.md](./guides/SETUP_LOCAL.md) (15 min)
3. [ESTRUTURA_PROJETO.md](./ESTRUTURA_PROJETO.md) (10 min)
4. [DESENVOLVEDOR.md](./guides/DESENVOLVEDOR.md) (20 min)
5. [Phase 1 Plan](./superpowers/plans/2026-08-19-central-empresarial-phase-1.md) → Task 1 (30 min)

**Tempo total:** ~95 minutos

### Path 3: "Quero Trabalhar com Database"
1. [SCHEMA.md](./database/SCHEMA.md) (30 min)
2. [ARQUITETURA.md](./architecture/ARQUITETURA.md) → Seção 4.5 (10 min)
3. [Phase 1 Plan](./superpowers/plans/2026-08-19-central-empresarial-phase-1.md) → Task 2 (60 min)
4. [MIGRATIONS.md](./database/MIGRATIONS.md) (15 min)

**Tempo total:** ~115 minutos

### Path 4: "Sou Usuário e Preciso de Ajuda"
1. [README.md](../README.md) → Seção "Começando" (5 min)
2. [USUARIO.md](./guides/USUARIO.md) (30 min)
3. [FAQ.md](./guides/FAQ.md) (10 min)
4. [TROUBLESHOOTING.md](./guides/TROUBLESHOOTING.md) (conforme necessário)

**Tempo total:** ~45 minutos

---

## 📞 Preciso de Help Com...

### "Como fago X?"
→ Procure em [FAQ.md](./guides/FAQ.md) ou [TROUBLESHOOTING.md](./guides/TROUBLESHOOTING.md)

### "Qual é a arquitetura?"
→ Leia [ARQUITETURA.md](./architecture/ARQUITETURA.md)

### "Qual é o schema do banco?"
→ Consulte [SCHEMA.md](./database/SCHEMA.md)

### "Como implementar feature Y?"
→ Veja a especificação em [ESPECIFICACAO.md](../ESPECIFICACAO.md) + plano relevante em `docs/superpowers/plans/`

### "Como desenvolver?"
→ Siga [DESENVOLVEDOR.md](./guides/DESENVOLVEDOR.md) + [SETUP_LOCAL.md](./guides/SETUP_LOCAL.md)

### "Qual é o requisito Z?"
→ Busque em [ESPECIFICACAO.md](../ESPECIFICACAO.md) (Ctrl+F)

### "Como executar testes?"
→ Veja [CLAUDE.md](../CLAUDE.md) → Seção "Common Development Commands"

---

## 📊 Estatísticas da Documentação

```
Total de Documentos: 12+
Total de Seções: 150+
Especificação: 62 seções
Schema: 10 tabelas + índices
Planos de Implementação: 7 fases
Linhas de Código de Documentação: 10.000+
```

---

## 🔄 Manutenção da Documentação

### Quando Adicionar Documentação

- [ ] Novo módulo criado → Documentar em CLAUDE.md
- [ ] Schema alterado → Atualizar SCHEMA.md
- [ ] Arquitetura muda → Atualizar ARQUITETURA.md
- [ ] Nova feature → Adicionar à ESPECIFICACAO.md
- [ ] Bug/Solution comum → Adicionar a FAQ.md
- [ ] Novo processo → Adicionar a DESENVOLVEDOR.md

### Quando Revisar Documentação

- Depois de cada release
- Quando código diverge de docs
- Quando usuários fazem perguntas repetidas
- Mensalmente (no máximo)

### Versionamento

```
[ARQUIVO].md
├── v1.0 (2026-08-19) ← Initial
├── v1.1 (2026-08-25) ← Atualizações
└── v1.2 (2026-09-01) ← Mais atualizações
```

Atualizar "Última atualização" no rodapé de cada arquivo.

---

## 🌐 Links Rápidos

### Repositório & Recursos
- GitHub: [seu-repo-aqui]
- Releases: [https://github.com/seu-repo/releases]
- Issues: [https://github.com/seu-repo/issues]
- Discussions: [https://github.com/seu-repo/discussions]

### Padrões & Referências
- [SQLAlchemy Docs](https://docs.sqlalchemy.org/)
- [Flask Docs](https://flask.palletsprojects.com/)
- [React Docs](https://react.dev/)
- [Electron Docs](https://www.electronjs.org/docs)

### Ferramentas Recomendadas
- IDE: VS Code + extensões Python, React
- Database: SQLite Browser
- REST Client: Insomnia ou Postman
- Git: Git CLI + GitKraken

---

## 📝 Template para Novo Documento

Ao criar novo documento, seguir este template:

```markdown
# [Título do Documento]

**Versão:** 1.0  
**Data:** 2026-08-19  
**Autor:** [Nome]  
**Status:** Draft | In Review | Published

---

## Sumário Executivo

[1-2 sentenças sobre o que é]

---

## 1. [Primeira Seção]

[Conteúdo]

---

## [Última Seção]

[Conteúdo]

---

*Última atualização: 2026-08-19*  
*Versão: 1.0*
```

---

## 🎯 Próximas Documentações Planejadas

- [ ] USUARIO.md — Manual de usuário final
- [ ] DESENVOLVEDOR.md — Guia de desenvolvimento
- [ ] SETUP_LOCAL.md — Setup do ambiente
- [ ] MIGRATIONS.md — Guia de migrations
- [ ] QUERIES.md — Queries otimizadas
- [ ] TROUBLESHOOTING.md — Solução de problemas
- [ ] Phase 2 Plan — Commercial module
- [ ] Phase 3 Plan — Financial module
- [ ] Phase 4 Plan — Operations module

---

## ✅ Checklist de Leitura

Para novo membro do time:

- [ ] Leu [README.md](../README.md)
- [ ] Leu [CLAUDE.md](../CLAUDE.md)
- [ ] Leu [ESTRUTURA_PROJETO.md](./ESTRUTURA_PROJETO.md)
- [ ] Completou [SETUP_LOCAL.md](./guides/SETUP_LOCAL.md)
- [ ] Entendeu [ARQUITETURA.md](./architecture/ARQUITETURA.md)
- [ ] Consultou [SCHEMA.md](./database/SCHEMA.md)
- [ ] Assistiu demo do sistema
- [ ] Fez primeiro commit de teste

---

**Última atualização:** 2026-08-19  
**Versão:** 1.0  
**Status:** Published

📚 **Documentação é a base de código vivo. Mantenha-a atualizada.**
