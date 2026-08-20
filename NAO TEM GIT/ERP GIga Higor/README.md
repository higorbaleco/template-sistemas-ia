# Central Empresarial Local

**Um sistema completo de gestão empresarial, totalmente offline, sem depender de nuvem ou internet.**

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)]()
[![Versão](https://img.shields.io/badge/vers%C3%A3o-0.1.0-blue)]()
[![Licença](https://img.shields.io/badge/licen%C3%A7a-propriet%C3%A1ria-red)]()

---

## 📋 Sobre

A **Central Empresarial Local** é uma aplicação desktop que centraliza toda a operação de um negócio em um único lugar, sem necessidade de conexão com internet ou plataformas SaaS.

### Por que foi criada?

Muitas empresas precisam de um sistema que:
- Funcione localmente, sem depender de internet
- Integre histórico desde 2020
- Responda questões sobre margem, esforço e rentabilidade
- Seja simples de usar, mas poderoso em análise

### O que oferece?

```
Prospecção → Leads → Pipeline → Vendas → Contratos → Projetos
            ↓
        Faturamento → Recebimento → Custos → Comissões → Margem → Resultado
```

Além disso:
- Dashboard executivo com KPIs em tempo real
- Análise de rentabilidade por cliente, produto, parceiro
- Detecção de riscos e inadimplência
- Relatórios completos e rankings
- Histórico íntegro desde 2020
- Backup automático

---

## 🚀 Começando

### Requisitos

- **Sistema Operacional:** Windows, macOS ou Linux
- **Espaço em Disco:** ~500 MB para instalação + dados
- **Memória:** 2 GB RAM mínimo (4 GB recomendado)

### Instalação Rápida

```bash
# 1. Download da versão mais recente
# https://github.com/seu-repo/releases

# 2. Descompacte o arquivo
# Windows: duplo clique em Central-Empresarial-1.0.0.exe
# Mac: duplo clique em Central-Empresarial-1.0.0.dmg
# Linux: chmod +x Central-Empresarial-1.0.0.AppImage

# 3. Crie sua senha mestre (mínimo 8 caracteres)
# 4. Comece a cadastrar seus dados
```

### Primeiros Passos

Após instalar:

1. **Login** → Crie sua senha mestre de 8+ caracteres
2. **Dashboard** → Veja o panorama geral
3. **Clientes** → Cadastre seus principais clientes
4. **Vendas** → Registre histórico comercial
5. **Financeiro** → Controle recebimentos e pagamentos
6. **Relatórios** → Analise tendências e KPIs

---

## 📚 Documentação

### Para Usuários Finais

- **[Guia do Usuário](docs/guides/USUARIO.md)** — Como usar o sistema
- **[FAQ](docs/guides/FAQ.md)** — Perguntas frequentes
- **[Troubleshooting](docs/guides/TROUBLESHOOTING.md)** — Solução de problemas

### Para Desenvolvedores

- **[CLAUDE.md](CLAUDE.md)** — Guia de desenvolvimento
- **[Arquitetura](docs/architecture/ARQUITETURA.md)** — Design técnico
- **[Database Schema](docs/database/SCHEMA.md)** — Estrutura do banco
- **[Especificação Completa](ESPECIFICACAO.md)** — Requisitos detalhados
- **[Plano de Implementação](docs/superpowers/plans/2026-08-19-central-empresarial-phase-1.md)** — Roadmap técnico

### Estrutura de Pastas

```
central-empresarial/
├── frontend/              # React + Electron UI
│   └── src/
│       ├── pages/        # Páginas (Login, Dashboard, Clientes, etc)
│       ├── components/   # Componentes reutilizáveis
│       └── services/     # Serviços (IPC, cache)
├── backend/              # Python Flask backend
│   ├── src/
│   │   ├── models/       # SQLAlchemy models
│   │   ├── services/     # Lógica de negócio
│   │   └── api/          # Handlers IPC
│   └── tests/            # Testes unitários
├── docs/                 # Documentação
│   ├── architecture/     # Design técnico
│   ├── database/         # Schema e queries
│   ├── guides/           # Guias de uso
│   └── superpowers/plans/ # Roadmaps
├── dados/                # Arquivos de dados
│   ├── empresa.db        # Banco SQLite
│   ├── backups/          # Backups automáticos
│   ├── documentos/       # Documentos arquivados
│   └── configuracoes/    # Preferências de usuário
├── main.js               # Electron main process
├── CLAUDE.md             # Guia de dev
├── README.md             # Este arquivo
└── ESPECIFICACAO.md      # Requisitos completos
```

---

## 🎯 Funcionalidades por Fase

### ✅ Fase 1 — Fundação (Atual)

- ✓ Autenticação local com senha mestre
- ✓ Cadastro de clientes (PF e PJ)
- ✓ Gestão de contatos
- ✓ Timeline de eventos por cliente
- ✓ Backup automático
- ✓ Restauração de banco

### 🔄 Fase 2 — Comercial

- Leads e prospecção
- Pipeline de vendas
- Oportunidades
- Propostas
- Vendas
- Contratos

### 💰 Fase 3 — Financeiro

- Contas a receber
- Contas a pagar
- Movimentações financeiras
- Fluxo de caixa
- Impostos
- PF vs PJ

### ⚙️ Fase 4 — Operação

- Produtos e serviços
- Custos e histórico
- Parceiros
- Fornecedores
- Projetos
- Cases de sucesso

### 📊 Fase 5 — Histórico

- Importação de dados 2020-2026
- Reconciliação
- Qualidade de dados
- Detecção de duplicatas

### 📈 Fase 6 — Inteligência

- Dashboards executivos
- KPIs em tempo real
- Rankings (clientes, produtos, parceiros)
- Análise de margem e esforço
- Detecção de riscos
- Cohorts de retenção

### 🎨 Fase 7 — Refinamento

- Relatórios personalizáveis
- Exportações (CSV, PDF, Excel)
- Alertas automáticos
- Atalhos de teclado
- Customização de interface

---

## 🔐 Segurança

### Autenticação

- **Senha Mestra** — Hashed com bcrypt (12 rounds)
- **Lockout** — Bloqueio após 5 tentativas erradas
- **Auto-logout** — Após inatividade configurável
- **Suporta Múltiplos Usuários** — Com roles e permissões

### Proteção de Dados

- **Nível 1:** Senha da aplicação (padrão)
- **Nível 2:** Proteção do SO (Windows BitLocker, macOS FileVault)
- **Nível 3:** Criptografia de banco (opcional)

### Backups

- **Automático:** Startup, shutdown, 1x diário
- **Retenção:** 7 diários + 4 semanais + 12 mensais
- **Restauração:** 1-clique com safety backup prévio

---

## 📊 Exemplo de Uso

### Cadastrando um Cliente

```
Dashboard → Clientes → Nova Cliente
  ├── Tipo: PJ
  ├── Razão Social: Acme Solutions Ltda
  ├── CNPJ: 12.345.678/0001-90
  ├── Segmento: Tecnologia
  ├── Cidade: São Paulo
  └── [Salvar]

→ Cliente criado
→ Timeline mostra: "LEAD_CREATED - Cliente Acme Solutions Ltda criado"
```

### Registrando uma Venda

```
Dashboard → Vendas → Nova Venda
  ├── Cliente: Acme Solutions
  ├── Data: 15/08/2026
  ├── Valor Bruto: R$ 50.000
  ├── Desconto: R$ 5.000
  ├── Valor Líquido: R$ 45.000
  ├── Custo Direto: R$ 15.000
  ├── Custo Operacional: R$ 8.000
  ├── Impostos: R$ 6.000
  └── [Salvar]

→ Venda criada
→ Margem calculada: R$ 16.000 (35,6%)
→ Timeline atualizada para cliente
→ Oportunidade marcada como ganha
```

### Analisando Rentabilidade

```
Dashboard → Inteligência → Rentabilidade

Clientes por Margem:
1. Acme Solutions     | R$ 16.000  | 35,6%
2. Beta Corp          | R$ 12.000  | 32,4%
3. Gamma Inc          | R$ 8.500   | 28,9%

Produtos por Margem/Hora:
1. Consultoria        | R$ 1.200/h
2. Desenvolvimento    | R$ 950/h
3. Suporte            | R$ 650/h

Parceiros por Conversão:
1. João Silva         | 45% (9/20)
2. Maria Santos       | 38% (8/21)
3. Pedro Oliveira     | 25% (5/20)
```

---

## 🛠️ Desenvolvendo

### Instalar Dependências

```bash
# Backend
pip install -r backend/requirements.txt

# Frontend
cd frontend && npm install && cd ..
```

### Rodar em Desenvolvimento

```bash
# Ambos backend e frontend
npm run dev

# Apenas backend
python backend/src/main.py

# Apenas frontend
cd frontend && npm run dev
```

### Rodar Testes

```bash
# Todos os testes
npm test

# Apenas backend
pytest backend/tests -v

# Com coverage
pytest backend/tests --cov=backend/src
```

### Build para Produção

```bash
npm run build
```

Gera executáveis em:
- `dist/Central-Empresarial-1.0.0.exe` (Windows)
- `dist/Central-Empresarial-1.0.0.dmg` (macOS)
- `dist/Central-Empresarial-1.0.0.AppImage` (Linux)

---

## 📞 Suporte

### Documentação

- **[CLAUDE.md](CLAUDE.md)** — Guia técnico completo
- **[Arquitetura](docs/architecture/ARQUITETURA.md)** — Como funciona
- **[FAQ](docs/guides/FAQ.md)** — Respostas rápidas

### Reportar Problemas

1. Verifique [FAQ](docs/guides/FAQ.md)
2. Procure em [Troubleshooting](docs/guides/TROUBLESHOOTING.md)
3. Verifique os logs em `dados/logs/`
4. Crie uma issue no repositório

### Solicitações de Features

Abra uma issue descrevendo:
- O que você quer fazer
- Por que é importante
- Como isso ajudaria seu negócio

---

## 📝 Licença

Este projeto é **proprietário**. Uso e distribuição restrita.

---

## 🙏 Créditos

Desenvolvido com foco em:
- ✨ Simplicidade de uso
- 🔒 Segurança local
- 📊 Análise profunda
- 🚀 Performance
- 📚 Documentação

---

## 📈 Roadmap

**v0.1.0** (Atual)
- ✅ Fase 1: Foundation (auth, clientes, backup)

**v0.2.0** (Q4 2026)
- Commercial module (leads, pipeline, vendas)

**v0.3.0** (Q1 2027)
- Financial module (contas, fluxo, impostos)

**v0.4.0** (Q2 2027)
- Operations (produtos, contratos, projetos)

**v1.0.0** (Q3 2027)
- Intelligence (dashboards, KPIs, rankings)

---

## ❓ Perguntas Frequentes

**P: Funciona sem internet?**
R: Sim! 100% offline. Nenhum acesso à internet necessário.

**P: E se meu disco quebrar?**
R: Faça backup dos arquivos em `dados/`. Você pode restaurar em outra máquina.

**P: Posso compartilhar com outros usuários?**
R: Sim! O sistema suporta múltiplos usuários locais com diferentes permissões.

**P: Como fazer backup?**
R: Automático ao iniciar/fechar. Manual via Settings → Backup.

**P: Quando sai a versão completa?**
R: Fases progressivas até Q3 2027. Versão 1.0 terá todas as funcionalidades.

---

## 🤝 Contribuindo

Este é um projeto proprietário. Contribuições sob autorização apenas.

Para sugestões:
1. Documente a ideia
2. Explique o impacto
3. Sugira a implementação
4. Envie para review

---

**Última atualização:** 2026-08-19  
**Versão:** 0.1.0  
**Status:** Em desenvolvimento

Feito com ❤️ para empresas que querem controlar seus dados.
