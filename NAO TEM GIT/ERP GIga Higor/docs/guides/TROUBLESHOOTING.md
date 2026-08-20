# Troubleshooting — Solução de Problemas

**Diagnóstico e soluções para problemas comuns**

---

## 🔧 Problemas de Instalação

### Problema: Instalador não funciona

**Solução 1: Verificar espaço em disco**
```bash
Windows: Propriedades da unidade C:
macOS: Sobre este Mac → Armazenamento
Linux: df -h
```
Precisa de 500 MB livre mínimo.

**Solução 2: Desabilitar antivírus temporariamente**
Alguns antivírus bloqueiam instaladores. Teste desativando.

**Solução 3: Rodar como administrador**
Windows: Click direito → "Executar como administrador"

**Solução 4: Baixar novamente**
Arquivo pode estar corrompido. Delete e baixe de novo.

### Problema: Erro "arquivo não encontrado"

Significa instalação incompleta. Desinstale e reinstale.

---

## 🔐 Problemas de Autenticação

### Problema: Não consigo logar

**Checklist:**
- [ ] Caps Lock está ON?
- [ ] Digitou corretamente? (sensível a maiúsculas)
- [ ] Digitou 8+ caracteres?
- [ ] Aguardou 15+ minutos se bloqueado?

**Teste:** Digite a senha em um editor de texto para verificar digitação.

### Problema: Conta bloqueada

Após 5 tentativas erradas, sistema bloqueia por 15 minutos.

**Solução:** Aguarde 15 minutos e tente novamente.

**Dica:** Anote a senha em lugar seguro para não esquecer.

### Problema: Esqueci minha senha

Não há recuperação. Opções:

**Opção 1: Restaurar backup anterior**
1. Menu → Configurações → Backup
2. Escolha backup de quando lembrava a senha
3. Sistema restaura (com pergunta: "Tem certeza?")
4. Reinicie e use senha antiga

**Opção 2: Novo setup**
1. Desinstale o programa
2. Reinstale
3. Novo setup solicitará nova senha
4. ⚠️ Perderá dados atuais

---

## 💾 Problemas de Dados

### Problema: Dados desapareceram

Não entrar em pânico! Provavelmente em backup.

**Solução:**
1. Menu → Configurações → Backup
2. Escolha backup recente
3. [Restaurar]
4. Reinicie
5. Dados voltaram!

### Problema: Não consigo salvar cliente

**Verifique:**
- [ ] CPF/CNPJ duplicado? (sistema não permite)
- [ ] Preencheu campos obrigatórios? (Nome, Tipo)
- [ ] Espaço em disco? (Menu → Configurações)

**Se persistir:**
1. Reinicie o aplicativo
2. Tente novamente

### Problema: Dados ficam lentamente lentamente lentamente

Possíveis causas:

**Causa 1: Muitos registros**
- Milhares de clientes/vendas
- Solução: Arquive dados antigos (Phase 5)

**Causa 2: Disco cheio**
- Sistema lento quando HD próximo de 100%
- Solução: Limpe arquivos desnecessários

**Causa 3: Memory leak**
- Bug raro
- Solução: Reinicie o aplicativo

---

## ⚠️ Erros Técnicos

### Erro: "Database locked"

Significa que o banco está sendo acessado por dois processos.

**Solução:**
1. Feche o programa
2. Aguarde 10 segundos
3. Abra novamente

### Erro: "Permission denied"

Aplicação não tem permissão para acessar arquivo.

**Solução:**
- Windows: Rodar como administrador
- macOS: System Preferences → Security → Allow
- Linux: `chmod +rx` no arquivo da app

### Erro: "Out of memory"

Aplicação consumiu muita RAM.

**Solução:**
1. Feche abas/windows não usadas
2. Reinicie o programa
3. Reinicie o computador se persistir

### Erro: "Cannot write to dados/empresa.db"

Banco corrompido ou sem espaço.

**Teste espaço:**
```bash
# Windows
wmic logicaldisk get name,size,freespace

# macOS/Linux
df -h
```

**Se corrompido:**
1. Restaure backup
2. Se nenhum backup: reinstale

---

## 🖥️ Problemas de Performance

### Aplicação está muito lenta

**Diagnóstico:**

**1. Verificar tamanho do banco**
```bash
# Windows
dir "%userprofile%\AppData\Local\CentralEmpresarial\dados\empresa.db"

# macOS
ls -lh ~/Library/Application\ Support/CentralEmpresarial/dados/empresa.db

# Linux
ls -lh ~/.local/share/CentralEmpresarial/dados/empresa.db
```

Se > 500 MB, banco está grande.

**2. Verificar espaço livre**
Se < 1 GB livre, sistema fica lento.

**3. Reiniciar aplicação**
Às vezes, memória se acumula.

**Soluções:**
- Arquive dados antigos
- Libere espaço em disco
- Reinicie programa/computador
- Reinstale aplicação

### Relatórios demoram para gerar

Normal com muitos dados. Exemplos:

- 10.000 clientes: ~1 segundo
- 100.000 clientes: ~10 segundos
- 1 milhão de clientes: ~60 segundos

**Solução:** Se demorar além disso, há outro problema.

---

## 📁 Problemas de Arquivos

### Não consigo acessar documentos

**Verifique:**
- [ ] Arquivo existe em `dados/documentos/`?
- [ ] Você tem permissão de leitura?
- [ ] Programa que abre arquivo está instalado?

**Solução:** Permissão em Windows/macOS/Linux deve ser reparada.

### Pasta dados sumiu

Significa que alguém deletou ou moveu `dados/`

**Opção 1: Restaurar**
- Se tiver backup em outra máquina, copie

**Opção 2: Recuperar**
- Use programa de recuperação de arquivos

**Opção 3: Começar novo**
- Reinicie a aplicação (criará novo `dados/`)

---

## 🔍 Investigando Logs

Muitos problemas deixam pistas em logs.

**Localização dos logs:**
```
dados/logs/application.log
dados/logs/backend.log
```

**Como ler:**
1. Abra arquivo em editor de texto
2. Procure por "ERROR" ou "CRITICAL"
3. Leia mensagem próxima

**Exemplo log:**
```
[2026-08-19 15:30:45] ERROR: Database connection failed
[2026-08-19 15:30:46] INFO: Retrying connection...
[2026-08-19 15:30:47] INFO: Connection succeeded
```

---

## 🚑 Emergências

### Perdi dados irretrievably

Se nem backup tem:

**Opção 1: Software de recuperação**
- Programas como Recuva, EaseUS, etc
- Recuperam arquivos deletados

**Opção 2: Backup em nuvem**
- Se usou OneDrive/iCloud/Google Drive
- Histórico de versões pode recuperar

**Opção 3: Começar novo**
- Infelizmente, pode ser última saída

### Aplicação crasheia ao abrir

**Solução:**
1. Desinstale
2. Reinicie computador
3. Reinstale
4. Se repetir, há dados corrompidos

**Alternativa:** Restaure backup anterior.

### Banco de dados corrompido

Sinal: Erros ao salvar, crash ao abrir.

**Solução:**
1. Não force fechar
2. Deixe recuperação automática fazer seu trabalho
3. Se não funcionar, restaure backup
4. Se nenhum backup, pode estar perdido

---

## 📞 Precisando de Mais Ajuda?

Se problema não está aqui:

1. **Procure em [FAQ](./FAQ.md)**
2. **Leia [Guia do Usuário](./USUARIO.md)**
3. **Verifique logs em `dados/logs/`**
4. **Abra issue no repositório** com:
   - Descrição do problema
   - Passos para reproduzir
   - Versão do SO
   - Versão da aplicação

---

*Última atualização: 2026-08-19*  
*Versão: 1.0*
