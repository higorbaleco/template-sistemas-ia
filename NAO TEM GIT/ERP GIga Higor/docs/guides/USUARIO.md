# Guia do Usuário — Central Empresarial Local

**Manual completo para usuários finais**

**Versão:** 1.0  
**Data:** 2026-08-19

---

## 📋 Sumário

1. [Começando](#começando)
2. [Dashboard](#dashboard)
3. [Clientes](#clientes)
4. [Vendas](#vendas)
5. [Financeiro](#financeiro)
6. [Relatórios](#relatórios)
7. [Backup](#backup)
8. [Configurações](#configurações)

---

## 🚀 Começando

### Instalação

1. **Download**: Acesse a página de releases
2. **Instale**: Duplo clique no instalador
3. **Crie senha**: Mínimo 8 caracteres
4. **Pronto**: Sistema está pronto para usar

### Primeiro Login

```
Tela: Central Empresarial

Senha: [Digite sua senha mestre]
[Entrar]
```

**Dica:** Guarde sua senha em local seguro. Ela não pode ser recuperada.

### Primeira Ação

Após login, você verá:

1. **Dashboard Vazio** — Sistema novo, sem dados ainda
2. **Menu Lateral** — Navegação principal
3. **Botão + (Novo)** — Criar registros rápido

Comece clicando em **Clientes** → **+ Novo Cliente**

---

## 📊 Dashboard

O Dashboard é seu ponto de partida. Mostra:

### Cards Principais

```
┌─────────────────────────────────────┐
│ 💰 Faturamento                      │
│ R$ 0,00                             │
├─────────────────────────────────────┤
│ 💸 Receita Recebida                 │
│ R$ 0,00                             │
├─────────────────────────────────────┤
│ 📈 Margem                           │
│ R$ 0,00 (0%)                        │
└─────────────────────────────────────┘
```

### Filtros

Na parte superior:

```
[Período ▼]  [Segmento ▼]  [Cliente ▼]  [Responsável ▼]
```

**Exemplo de uso:**
- Selecione "Agosto 2026"
- Ver apenas dados deste mês

### Gráfico Histórico

Linha mostrando evolução:
- **Receita** (azul)
- **Margem** (verde)
- **Resultado** (vermelho)

**Para usar:** Passe mouse sobre a linha para ver valores exatos.

---

## 👥 Clientes

Local onde você cadastra e gerencia clientes.

### Criar Novo Cliente

**Menu:** Clientes → + Novo Cliente

**Formulário:**

```
Tipo: [PJ ▼]              (PF = Pessoa Física, PJ = Empresa)
Razão Social: [________]  (Nome da empresa)
CNPJ: [00.000.000/0000-00]
Nome Fantasia: [________] (Opcional, usa razão se vazio)
Segmento: [Tecnologia ▼]
Cidade: [São Paulo]
Estado: [SP ▼]
[Salvar]
```

**Após salvar:**
- Cliente criado
- Timeline mostra: "LEAD_CREATED"
- Pode adicionar contatos

### Visualizar Cliente

Clique no cliente na lista para ver:

**Cabeçalho:**
```
📊 ACME Solutions Ltda
CPF/CNPJ: 12.345.678/0001-90
Tipo: PJ | Status: PROSPECT | Desde: 19/08/2026
```

**Abas:**
- **Visão geral** — Informações básicas
- **Contatos** — Pessoas de contato
- **Timeline** — Histórico de eventos
- **Vendas** — Vendas para este cliente
- **Documentos** — Arquivos relacionados

### Adicionar Contato

Aba "Contatos" → "+ Novo Contato"

```
Nome: [Maria Silva]
Cargo: [Diretora]
Email: [maria@acme.com]
Telefone: [(11) 9999-9999]
WhatsApp: [(11) 9999-9999]
☐ É decisor?
☐ É contato principal?
[Salvar]
```

### Status do Cliente

Mude o status clicando no dropdown "Status":

```
PROSPECT        → Potencial cliente
LEAD            → Contato confirmado
OPORTUNIDADE    → Mostrou interesse
CLIENTE_ATIVO   → Contrata regularmente
CLIENTE_INATIVO → Sem movimentação
EX_CLIENTE      → Cancelou
```

---

## 💼 Vendas (Phase 2 — Futuro)

*Esta funcionalidade será adicionada na Phase 2*

Quando disponível:

1. Registre vendas para cada cliente
2. Sistema calcula margem automaticamente
3. Rastreie de proposta até recebimento

---

## 💰 Financeiro (Phase 3 — Futuro)

*Esta funcionalidade será adicionada na Phase 3*

Quando disponível:

1. Registre contas a receber
2. Registre contas a pagar
3. Acompanhe fluxo de caixa
4. Controle impostos

---

## 📈 Relatórios (Phase 6 — Futuro)

*Esta funcionalidade será adicionada na Phase 6*

Quando disponível, gere relatórios sobre:
- Clientes
- Vendas
- Rentabilidade
- Histórico

---

## 💾 Backup

**O que é Backup:**
Cópia de segurança de todos seus dados.

### Backup Automático

O sistema faz backup automaticamente:
- Ao iniciar
- Ao fechar
- 1x por dia (à noite)

**Localização:** `dados/backups/`

### Fazer Backup Manual

Menu → Configurações → Backup

```
[Fazer Backup Agora]
```

Clique e aguarde conclusão. Está pronto.

### Restaurar do Backup

Menu → Configurações → Backup

```
Backups Disponíveis:
📋 empresa_2026-08-19_0800.db (12 MB)
📋 empresa_2026-08-18_1830.db (12 MB)
📋 empresa_2026-08-17_0800.db (12 MB)

[Restaurar]  [Deletar]
```

**Atenção:** Restaurar substitui dados atuais. Sistema cria backup automático do estado atual antes de restaurar.

---

## ⚙️ Configurações

Menu → Configurações

### Sistema

```
Nome da Empresa: [Minha Empresa]
CNPJ: [12.345.678/0001-90]
Início do Histórico: [01/01/2020]
```

### Interface

```
Tema: [Claro ▼]      (Claro ou Escuro)
Idioma: [Português ▼]
Data: [DD/MM/YYYY]
```

### Segurança

```
Bloquear após: [15 minutos ▼]
   Opções: 5min, 15min, 30min, 1h, Nunca

[Alterar Senha]  [Logout]
```

---

## ❓ Perguntas Frequentes

**P: Esqueci minha senha!**  
R: Não é possível recuperar. Você precisa reinstalar o sistema e criar nova senha.

**P: Como exportar dados?**  
R: Será adicionado em Phase 7. Por enquanto, pode fazer backup do arquivo `dados/empresa.db`

**P: Posso usar em múltiplos computadores?**  
R: Sim! Cada máquina tem seus próprios dados. Para compartilhar, copie `dados/empresa.db`

**P: E se der erro?**  
R: Veja a seção de Troubleshooting neste guia.

---

## 🆘 Troubleshooting

### "Aplicação não abre"

**Solução 1:** Reinicie o computador

**Solução 2:** Reinstale o aplicativo

**Solução 3:** Verifique espaço em disco (precisa de 500 MB)

### "Esqueci a senha"

Infelizmente não há recuperação. Opções:

1. Reinstale e crie nova senha
2. Restaure de backup anterior (se tiver)

### "Dados desapareceram"

Não se desespere! Dados estão em backup:

1. Menu → Configurações → Backup
2. Restaure o backup mais recente
3. Reinicie a aplicação

### "Está lento"

**Possível causa:** Muitos registros (milhares)

**Soluções:**
1. Arquive dados antigos (Phase 5)
2. Reinicie a aplicação
3. Verificar espaço em disco

### "Não consigo logar"

**Verifique:**
- Caps Lock está ativado?
- Digitou corretamente?
- Tentou 5+ vezes? (Sistema bloqueia por 15min)

Se bloqueado, aguarde 15 minutos e tente novamente.

---

## 📞 Suporte

Se o problema persistir:

1. Consulte [FAQ](./FAQ.md)
2. Verifique [Troubleshooting](./TROUBLESHOOTING.md)
3. Procure em `dados/logs/application.log`

---

*Última atualização: 2026-08-19*  
*Versão: 1.0*
