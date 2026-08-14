# TROUBLESHOOTING - SOLUÇÕES RÁPIDAS
## Se algo não está funcionando durante o setup

---

## GOOGLE SHEETS

### Problema 1: "Não consigo compartilhar a planilha"
**Solução:**
1. Clique botão "Compartilhar" (canto superior direito)
2. Coloque seu email
3. Selecione permissão "Editor"
4. Clique "Compartilhar"

### Problema 2: "Não consigo formatar as colunas"
**Solução:**
1. Selecione a coluna (clique na letra: A, B, C...)
2. Clique direito → "Format"
3. Escolha cor, tamanho, negrito
4. Aplique

### Problema 3: "Fórmulas não tão funcionando"
**Solução:**
1. Se digitou `=`, mas não aparece fórmula
2. Clique duplo na célula
3. Aperte Enter
4. Deve funcionar

### Problema 4: "Não consigo deletar uma aba"
**Solução:**
1. Clique direito na aba (parte de baixo)
2. Selecione "Delete sheet"
3. Confirme

---

## ZAPIER

### Problema 1: "Não consigo conectar Gmail"
**Solução:**
1. Vá pra https://myaccount.google.com/security
2. Procure "Less secure apps" (apps menos seguros)
3. Ligue a opção
4. Volte pro Zapier, tente conectar de novo
5. Deve funcionar

**Se não funcionar:**
1. Crie uma "senha de app" no Google
2. Vá pra https://myaccount.google.com/apppasswords
3. Selecione "Mail" + "Windows Computer" (ou seu device)
4. Google vai gerar senha
5. Use essa senha no Zapier em vez da senha normal

### Problema 2: "Zap criado mas não tá ativo"
**Solução:**
1. Vá pra "My Zaps"
2. Procure o Zap
3. Se tiver ícone de play (▶) cinza → Clique pra ativar
4. Deve ficar azul = ativo

### Problema 3: "Teste do Zap tá dando erro"
**Solução:**
1. Clique no Zap
2. Clique "Edit"
3. Revise cada passo (Trigger + Action)
4. Reconecte a ferramenta (às vezes desconecta)
5. Teste de novo

### Problema 4: "Dados não tão chegando no Google Sheets"
**Solução:**
1. Vá pra seu Zap
2. Clique "View Runs" (histórico)
3. Veja se tá "Succeeded" (verde) ou "Failed" (vermelho)
4. Se Failed: clique pra ver erro exato
5. Corrija e teste de novo

### Problema 5: "Zapier tá pedindo pra reconectar"
**Solução:**
1. Clique "Reconnect"
2. Autorize a ferramenta de novo
3. Zap deve voltar a funcionar

---

## MAILCHIMP

### Problema 1: "Não consigo criar audience (lista)"
**Solução:**
1. Dashboard → "Audience"
2. Se não aparecer botão "Create", procure por "Audience List"
3. Clique em "Create Audience"
4. Preencha dados
5. Salve

### Problema 2: "Email está em rascunho e não consigo enviar"
**Solução:**
1. Abra a campaign
2. Vá pra "Design Email"
3. Termine o email (adicione conteúdo)
4. Clique "Save" (salve)
5. Volte pra campaign
6. Agora deve ter opção "Send" (enviar)
7. **Atencão:** Antes de enviar, faça teste (envie pra seu email)

### Problema 3: "Sequência de emails não tá saindo no tempo certo"
**Solução:**
1. Vá pra Campaign
2. Clique em "Delivery"
3. Veja se tá "Scheduled" (agendado)
4. Se tá "Draft" (rascunho): salve como rascunho
5. Se tá errado, clique "Change Schedule"
6. Refaça datas (Dia 0, 3, 7, 11, 14)

### Problema 4: "Contatos não tão chegando na lista"
**Solução:**
1. Você precisa adicionar emails manualmente
2. Audience → [sua lista] → "Manage Audience"
3. Clique "Import Contacts"
4. Upload CSV ou copie/cole emails
5. Selecione fonte (de onde vieram)
6. Envie confirmação (Mailchimp vai pedir)

### Problema 5: "Meus emails tão indo pra spam"
**Solução:**
1. É normal com contas novas
2. Faça isso:
   - Email "From": use seu email pessoal (ex: higor@seudominio.com)
   - Não use genérico (ex: support@mailchimp)
   - Assunto: não use SPAM TRIGGERS (MUY IMPORTANTE, GANHE $, etc)
3. Monitore "Spam Rate" em "Reports"
4. Se acima de 1%, ajuste conteúdo

---

## WHATSAPP BUSINESS

### Problema 1: "Não consigo gerar token WhatsApp Business"
**Solução:**
1. Você precisa ter WhatsApp Business instalado
2. Baixe: Google Play → "WhatsApp Business"
3. Configure conta
4. Vá pra Configurações → API
5. Gere token (copie e salve)

### Problema 2: "Não consigo conectar WhatsApp no Zapier"
**Solução:**
1. Zapier → "My Apps"
2. Procure "WhatsApp"
3. "Connect"
4. Coloque Token (copie do WhatsApp Business)
5. Teste → Clique pra autorizar
6. Deve funcionar

### Problema 3: "Mensagens não tão chegando no Zapier"
**Solução:**
1. WhatsApp Business precisa estar aberto/recebendo mensagens
2. Teste: mande um WhatsApp pra seu número
3. Vá pra Zapier, clique "Test" no Zap
4. Se receber mensagem, Zap deve capturar

---

## CALENDLY

### Problema 1: "Não consigo conectar Calendly no Zapier"
**Solução:**
1. Zapier → "My Apps"
2. Procure "Calendly"
3. "Connect"
4. Clique no link de autorização
5. Autorize Zapier acessar Calendly
6. Volte pro Zapier
7. Deve estar conectado

### Problema 2: "Não tô recebendo notificações quando alguém agenda"
**Solução:**
1. Vá pra seu Zap de Calendly
2. Clique "Edit"
3. Vá na parte de "Action" (envio de notificação)
4. Se for Slack:
   - Canal deve ser um que você segue
   - Salve e teste
5. Se for Email:
   - Email deve ser o seu
   - Salve e teste

### Problema 3: "Integração Calendly-Zapier desconectou"
**Solução:**
1. Vá pra Zapier
2. "My Apps"
3. Procure "Calendly"
4. Clique "Disconnect"
5. Reconecte (siga processo acima)

---

## LINKEDIN

### Problema 1: "LinkedIn bloqueou minha conta"
**Solução:**
1. LinkedIn às vezes bloqueia contas por "atividade suspeita"
2. Se recebeu aviso: siga instruções (confirmação)
3. Espere 24-48h
4. Depois pode prospecctar de novo (com cuidado)

**Prevenção:**
- Não envie muitas mensagens em 1 dia (máx 50/dia)
- Varie tipo de contato (mix de titles)
- Deixe alguns minutos entre mensagens

### Problema 2: "Não consigo encontrar contatos específicos"
**Solução:**
1. LinkedIn → "Search" (lupa)
2. Busque por: Título + Empresa (ex: "Gerente Comercial Imobiliária")
3. Use filtros:
   - Localização: sua região
   - Conexão: 3º grau (3rd degree)
4. Salve lista em Excel

### Problema 3: "Não consigo enviar mensagem (limite atingido)"
**Solução:**
1. LinkedIn limita ~50 mensagens/dia pra contas novas
2. Espere 24h
3. Continue amanhã
4. Conforme sua reputação sobe, limite aumenta

---

## MÚLTIPLAS FERRAMENTAS

### Problema: "Tudo parou de funcionar de repente"
**Solução (ordem):**
1. Atualize seu browser
2. Limpe cache (Ctrl+Shift+Delete)
3. Desconecte + reconecte todas as ferramentas
4. Teste cada Zap individualmente
5. Se falhar: vá pra "View Runs" pra ver erro

### Problema: "Estou criando dados duplicados"
**Solução:**
1. Alguns Zaps podem rodar 2x por erro
2. Vá pro Google Sheets
3. Procure linhas duplicadas
4. Delete manualmente (enquanto não temos deduplicação)
5. No futuro, Zap pode ter "Only trigger if..." para evitar

### Problema: "Estou gastando meu crédito Zapier muito rápido"
**Solução:**
1. Zapier cobra por "task" (cada ação)
2. Verifique quantos Zaps tá rodando
3. Desativa os que não precisa (clique pause)
4. Usa Zapier com moderação
5. Google Forms → Zapier → Sheets é mais barato que Email→Zapier

---

## SUPORTE EXTERNO (Se nada funciona)

### Google Sheets
→ https://support.google.com/docs/

### Zapier
→ https://zapier.com/help/ (excelente base de conhecimento)

### Mailchimp
→ https://mailchimp.com/help/

### Calendly
→ https://support.calendly.com/

### WhatsApp Business
→ https://www.whatsapp.com/business/help

### LinkedIn
→ https://www.linkedin.com/help/

---

## CHECKLIST: Se tá tudo quebrando

1. [ ] Atualizou browser?
2. [ ] Limpou cache?
3. [ ] Testou cada ferramenta isoladamente?
4. [ ] Reconectou contas no Zapier?
5. [ ] Viu o erro exato (View Runs)?
6. [ ] Procurou no Google: "[ferramenta] [erro]"?
7. [ ] Esperou alguns minutos (às vezes demora)?
8. [ ] Criou novo Zap (talvez o antigo tá quebrado)?

---

## ÚLTIMO RECURSO

Se realmente nada funciona:

1. **Pause todos os Zaps** (clique pause em cada)
2. **Desconecte todas as contas** (My Apps → disconnect)
3. **Reconecte tudo** (passo a passo, como no setup)
4. **Recrie os Zaps** (às vezes é mais rápido que debugar)
5. **Teste novamente**

**90% dos problemas resolvem com isso.**

---

**Você consegue! Se ficar preso, procure no Google + suporte das ferramentas. Normalmente tem tutorial pra tudo.**

