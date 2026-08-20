# FAQ — Central Empresarial Local

**Perguntas Frequentes**

---

## Instalação & Setup

**P: Qual é o requisito mínimo para rodar?**

R: Windows 7+, macOS 10.10+, ou Linux com 2GB RAM. Precisa de ~500MB de espaço.

**P: Como instalar?**

R: Download do arquivo .exe/.dmg/.AppImage e duplo clique. Sistema guia o resto.

**P: Qual navegador precisa?**

R: Nenhum! É aplicação desktop, não browser.

---

## Senha & Segurança

**P: Posso mudar minha senha?**

R: Sim. Menu → Configurações → Segurança → [Alterar Senha]

**P: Minha senha é armazenada em segurança?**

R: Sim. Usamos bcrypt com 12 rounds. Nunca em texto plano.

**P: Se alguém fisicamente pegar meu PC, vê meus dados?**

R: Sim, se souber a senha. Recomendamos criptografia de disco (BitLocker, FileVault).

**P: Posso criptografar o banco de dados?**

R: Será adicionado em Phase 1 (final). Por enquanto, use criptografia de disco do SO.

---

## Dados & Backups

**P: Meus dados ficam com vocês?**

R: Não! Tudo fica no seu computador. Zero cloud. 100% local.

**P: Como faço backup?**

R: Automático ao iniciar/fechar/diariamente. Ou manual: Menu → Configurações → Backup.

**P: Onde fica o backup?**

R: Pasta `dados/backups/` no mesmo local do programa.

**P: Posso restaurar do backup?**

R: Sim. Menu → Configurações → Backup → escolha arquivo → [Restaurar].

**P: Quantos backups são mantidos?**

R: 7 diários + 4 semanais + 12 mensais = 23 backups automáticos.

**P: Posso copiar dados para outro PC?**

R: Sim! Copie pasta `dados/` para outro computador com o programa instalado.

---

## Funcionalidades

**P: Quando sai a funcionalidade X?**

R: Veja o [Roadmap](../architecture/ARQUITETURA.md) para timeline de todas as fases.

| Fase | Funcionalidades | Quando? |
|------|-----------------|---------|
| 1 | Auth, Clientes, Backup | ✅ Agora |
| 2 | Vendas, Pipeline | Q4 2026 |
| 3 | Financeiro, Impostos | Q1 2027 |
| 4 | Projetos, Parceiros | Q2 2027 |
| 5 | Importação histórica | Q2 2027 |
| 6 | Dashboards, KPIs | Q3 2027 |
| 7 | Relatórios, Alertas | Q3 2027 |

**P: Posso usar agora mesmo com dados antigos?**

R: Parcialmente. Phase 1 (now) tem clientes. Phase 5 (Q2 2027) terá importação histórica.

**P: Quero resource que não tem. E agora?**

R: Abra issue no repositório ou envie email para feedback. Seus pedidos moldam o roadmap.

---

## Compatibilidade

**P: Funciona em Mac?**

R: Sim! Versão macOS disponível (Intel e Apple Silicon).

**P: E Linux?**

R: Sim! AppImage disponível para Debian/Ubuntu/Fedora/etc.

**P: Versão mobile?**

R: Não. Desktop only. (Pode vir em futuro distante)

**P: Cloud sync com múltiplos PCs?**

R: Não. Cada PC é independente. Mas pode copiar `dados/` manualmente.

---

## Performance & Limites

**P: Quanto dados o sistema aguenta?**

R: Milhões de registros. SQLite é otimizado para isso.

Referência:
- 100.000 clientes ✅
- 1 milhão de vendas ✅
- 30 anos de histórico ✅

**P: Tá lento. Que fazer?**

R: 1. Reinicie. 2. Verifique espaço em disco. 3. Veja logs em `dados/logs/`

**P: Qual é o tamanho do banco?**

R: Tipicamente 50-100 MB com 5 anos de dados. Backups comprimidos: ~15-30 MB.

---

## Múltiplos Usuários

**P: Posso compartilhar com meu time?**

R: Não oficialmente (Phase 1 é single-user). Workaround: copie `dados/` para outro PC.

**P: Quando vem multi-user?**

R: Já está no roadmap. Será estudado pós-Phase 1.

**P: Vários usuários no mesmo PC?**

R: Não. Um login por sessão de Windows/macOS/Linux.

---

## Problemas Comuns

**P: "Falha ao conectar" (erro)**

R: Sistema é 100% local. Não há conexão. Se ver este erro, é bug. Reporte.

**P: Dados duplicados**

R: Sistema detecta CPF/CNPJ duplicado. Se vê duplicados, confira CPF.

**P: Não posso logar**

R: Caps Lock? Senha correta? Bloqueado após 5 tentativas (aguarde 15min)?

**P: Perdi minha senha**

R: Não há recuperação. Opções:
1. Reinstale (novo setup)
2. Restaure backup (com senha anterior)

---

## Relatórios & Exportação

**P: Como exporto dados?**

R: Phase 7 (Q3 2027) terá exportação. Enquanto isso:
- Faça backup de `dados/empresa.db`
- Use ferramentas SQLite para acessar

**P: Posso gerar PDF?**

R: Phase 6 (Q3 2027). Por enquanto, screenshot + Print to PDF.

**P: Consigo integrar com Excel?**

R: Phase 7 terá exportação CSV. Enquanto isso, use ferramentas SQLite.

---

## Custos & Licença

**P: Custa quanto?**

R: Não, é de uso pessoal/empresarial. Propriedade de dados sua.

**P: Há versão gratuita e paga?**

R: Não. Uma versão só. Uso é livre.

**P: Posso usar para trabalho/negócio?**

R: Sim! Exatamente para isso foi criado.

---

## Documentação & Ajuda

**P: Há mais documentação?**

R: Sim! Leia:
- [Guia do Usuário](./USUARIO.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
- [README](../README.md)

**P: Como reporto um bug?**

R: Abra issue no repositório com:
1. O que aconteceu
2. Passos para reproduzir
3. Versão do SO

**P: Há comunidade ou forum?**

R: Não ainda. Discussões via GitHub Issues.

---

## Roadmap

**P: Qual é a ordem de desenvolvimento?**

R: Phase by phase:
1. ✅ Foundation (Auth, Clientes, Backup)
2. 🔄 Commercial (Leads, Pipeline, Vendas)
3. 💰 Financial (Contas, Fluxo, Impostos)
4. ⚙️ Operations (Projetos, Contratos, Parceiros)
5. 📊 Historical (Importação, Reconciliação)
6. 📈 Intelligence (Dashboards, KPIs, Rankings)
7. 🎨 Refinement (Reports, Alertas, Customização)

**P: Posso sugerir prioridade diferente?**

R: Sim! Feedback importante. Abra issue ou envie email.

---

*Última atualização: 2026-08-19*  
*Versão: 1.0*
