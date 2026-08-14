# 📚 MEMÓRIA: Projeto Instagram Salvos → Base de Conhecimento

**Última atualização:** 2026-08-04
**Status:** Sistema funcional, pronto para agendamento

---

## 📍 Localização Base do Projeto

```
/Users/higorplens/Antigravity Software/Claude/Insta-Scrap/instagram-salvos/
```

---

## 🎯 O Que Este Projeto Faz

1. **Baixa posts salvos do Instagram** (seu perfil: @omagodowhats)
2. **Transcreve vídeos** com Whisper (local, 100% privado)
3. **Categoriza automaticamente** por tema (IA, WhatsApp, Empreendedorismo, etc)
4. **Renomeia com títulos descritivos** (formato: `Titulo-do-Video_do_@autor.md`)
5. **Organiza em pastas** (inspiracao-conteudos / tutorial-conteudo)
6. **Cria índices** para buscar sem ler tudo

---

## 📊 Status Atual

```
Total de posts: 51
✅ Inspiração de conteúdos: 35 posts (IA, WhatsApp, Vendas, Automações, Empreendedorismo)
✅ Tutorial de conteúdo: 7 posts (como criar conteúdo)
⏭️ Ignorados: 9 posts (temas aleatórios, não processados)
```

**Perfil:** @omagodowhats
**Sessão salva em:** `/Users/higorplens/.config/instaloader/session-omagodowhats`

---

## 🛠️ Ferramentas Instaladas

```
Ambiente virtual: .venv-instagram-salvos/
Dependências:
  - instaloader (baixar posts do Instagram)
  - browser_cookie3 (reaproveitar sessão do navegador)
  - yt-dlp (baixar vídeos anonimamente)
  - faster-whisper (transcrever vídeos localmente)
  - ffmpeg (processar áudio/vídeo)
```

---

## 📁 Arquivos Principais do Projeto

### Scripts Python
- **catalogar.py** — Lê salvos.json, categoriza posts por tema, cria arquivos .md
- **renomear.py** — Renomeia arquivos com título + @autor
- **baixar_por_url.py** — Adiciona posts individuais por URL do Instagram
- **rotina_diaria.py** — Roda automaticamente todo dia (baixa, cataloga, renomeia)

### Arquivos de Referência (Guias)
- **GUIA_RAPIDO.md** — Guia completo (troubleshooting, estrutura, prompts)
- **PROMPTS.txt** — 5 prompts prontos para copiar/colar no Claude
- **COMANDOS.sh** — Script com atalhos shell
- **AGENDAR_ROTINA.md** — Como configurar automação diária
- **MEMORIA.md** — Este arquivo (contexto completo)

### Dados
- **salvos.json** — Base bruta com metadados de todos os 51 posts
- **INDEX.md** — Índice geral (1 linha por post)

### Pastas
- **inspiracao-conteudos/** — 35 posts (IA, WhatsApp, etc) + INDEX.md
- **tutorial-conteudo/** — 7 posts (dicas de conteúdo) + INDEX.md
- **posts/** — 7 posts principais (backup/referência)
- **videos/** — Vídeos baixados (será deletado após transcrição)
- **logs/** — Logs das rotinas automáticas

---

## 🎯 Temas Reconhecidos Automaticamente

Quando você roda `catalogar.py`, o script detecta automaticamente:

| Tema | Palavras-chave | Pasta |
|------|------------------|-------|
| **#ia** | claude, ia, agent, api, código, programação | inspiracao-conteudos |
| **#whatsapp** | whatsapp, meta, bot, automação, manychat | inspiracao-conteudos |
| **#empreendedorismo** | negócio, startup, marketing, vendas, estratégia | inspiracao-conteudos |
| **#vendas** | venda, leads, conversão, pitch, saas | inspiracao-conteudos |
| **#automacoes** | automação, workflow, zapier, eficiência | inspiracao-conteudos |
| **#tutorial-conteudo** | tutorial, como fazer, edição, produção, copywriting | tutorial-conteudo |
| *Outros* | não identifica nenhum tema | (ignorado, não processa) |

---

## 📋 Comandos Mais Usados

### 1. Adicionar Posts Por URL (Individual)
```bash
cd /Users/higorplens/Antigravity\ Software/Claude/Insta-Scrap/instagram-salvos
python3 baixar_por_url.py "https://www.instagram.com/reels/SHORTCODE/"
```
**O que faz:** Extrai um post único, adiciona ao salvos.json, recataloga e renomeia tudo.

### 2. Baixar Novos Salvos (Em Massa)
```bash
cd /Users/higorplens/Antigravity\ Software/Claude/Insta-Scrap/instagram-salvos

# Testar com 100 posts primeiro
.venv-instagram-salvos/bin/python .claude/skills/instagram-salvos/scripts/baixar_salvos.py \
  baixar --perfil omagodowhats --confirmo-perfil omagodowhats --max 100 --pausa 3

# Se ok, aumentar gradualmente: 200, 300, 500, 1000...
```
**O que faz:** Baixa até N posts dos salvos, guarda em salvos.json (merge automático).

### 3. Recatalogar Tudo
```bash
cd /Users/higorplens/Antigravity\ Software/Claude/Insta-Scrap/instagram-salvos
python3 catalogar.py
python3 renomear.py
```
**O que faz:** Reprocessa salvos.json, recategoriza e renomeia todos os arquivos.

### 4. Rodar Rotina Diária (Manual)
```bash
cd /Users/higorplens/Antigravity\ Software/Claude/Insta-Scrap/instagram-salvos
python3 rotina_diaria.py
```
**O que faz:** Baixa 30 novos, cataloga, renomeia. Registra tudo em log.

### 5. Ver Quantos Posts Tem
```bash
cd /Users/higorplens/Antigravity\ Software/Claude/Insta-Scrap/instagram-salvos
python3 -c "import json; print(f'Total: {len(json.load(open(\"salvos.json\")))}')"
```

---

## 🤖 Agendamento Automático (TODO)

**Status:** Script criado (`rotina_diaria.py`), precisa ser ativado.

**Próximo passo:** Seguir `AGENDAR_ROTINA.md` para:
1. Criar Launch Agent (macOS) ou cron (Linux)
2. Definir horário (recomendado: 8:00 AM)
3. Ativar com `launchctl load`

**Depois:** Roda sozinho todo dia! ✅

---

## 📖 Como Buscar na Base

### Opção 1: Pelo INDEX.md
```bash
# Ver todos os posts
cat /Users/higorplens/Antigravity\ Software/Claude/Insta-Scrap/instagram-salvos/INDEX.md

# Ver inspiração de conteúdos
cat /Users/higorplens/Antigravity\ Software/Claude/Insta-Scrap/instagram-salvos/inspiracao-conteudos/INDEX.md

# Ver tutoriais
cat /Users/higorplens/Antigravity\ Software/Claude/Insta-Scrap/instagram-salvos/tutorial-conteudo/INDEX.md
```

### Opção 2: Pelo Claude (em qualquer chat)
```
Que posts eu salvei sobre [TEMA]?
Caminho: /Users/higorplens/Antigravity Software/Claude/Insta-Scrap/instagram-salvos/
```

Claude vai ler os INDEXs, encontrar posts relevantes e mostrar com links.

---

## 🚨 Limites do Instagram & Estratégia Segura

### Rate Limiting
- **100-200 posts/hora** — totalmente seguro (com pausas de 2-3 seg)
- **500-1000 posts/dia** — possível, mas requer comportamento "natural"
- **Acima de 1000/dia** — risco de rate limit

### Nossa Estratégia
- **Agora:** Varredura grande (300-500 posts) para capturar TUDO
- **Depois:** 30 posts/dia via rotina automática = 100% seguro

Com 30/dia: ~900 posts/mês, 10.800 posts/ano

---

## 🔧 Troubleshooting Comum

| Problema | Solução |
|----------|---------|
| Erro ao extrair URL | Pode ser post deletado/privado ou rate limit. Aguarde 30-60 min e tente outro. |
| Arquivo renomeado com `@desconhecido` | Verifique formato do autor no .md (`**Autor:** @nome`). Rode `renomear.py` novamente. |
| Rate limit ao baixar savos | Normal. Aguarde 30-60 min, não reinsista. |
| Transcrição vazia | Vídeo sem áudio (B-Roll/estático). Legenda já está salva, ok assim. |
| Arquivo duplicado | Scripts evitam duplicatas automaticamente (verificam shortcode). |
| Logs não aparecem | Verifique se `/logs/` existe e tem permissões de escrita. |

---

## 📝 Histórico do Projeto

**2026-08-04 — Conclusão da Fase 1:**
- ✅ Skill instagram-salvos instalada
- ✅ 50 posts baixados e catalogados
- ✅ Scripts criados: catalogar.py, renomear.py, baixar_por_url.py
- ✅ Rotina diária criada (rotina_diaria.py)
- ✅ Todos os guias de referência criados
- ✅ Estrutura de pastas finalizada

**Próximo:** Ativar agendamento automático + varredura inicial de TODOS os salvos

---

## 🎓 Como Usar Este Arquivo em Novo Chat

Quando iniciar um novo chat e quiser continuar o projeto:

1. **Copie e cole isto:**
```
Vou continuar meu projeto de sincronização de Instagram salvos.

Contexto completo em: /Users/higorplens/Antigravity Software/Claude/Insta-Scrap/MEMORIA.md

Próxima tarefa: [O QUE VOCÊ QUER FAZER]
```

2. **Ou, simplesmente peça:**
```
Baixa meus salvos do Instagram usando o script que já criamos.
Use: /Users/higorplens/Antigravity Software/Claude/Insta-Scrap/instagram-salvos/
```

Claude vai ler MEMORIA.md automaticamente e saberá exatamente o contexto!

---

## ✅ Checklist: Pronto Para Usar

- ✅ Scripts Python criados e testados
- ✅ Dependências instaladas
- ✅ Sessão do Instagram autenticada
- ✅ 51 posts catalogados
- ✅ Estrutura de pastas finalizada
- ✅ Índices criados
- ✅ Guias de referência completos
- ⏳ **TODO:** Ativar agendamento automático
- ⏳ **TODO:** Fazer varredura inicial de TODOS os salvos

---

## 🚀 Próximos Passos

1. **Hoje/Agora:**
   ```bash
   cd /Users/higorplens/Antigravity\ Software/Claude/Insta-Scrap/instagram-salvos
   
   # Testar com 100 posts
   .venv-instagram-salvos/bin/python .claude/skills/instagram-salvos/scripts/baixar_salvos.py \
     baixar --perfil omagodowhats --confirmo-perfil omagodowhats --max 100 --pausa 3
   ```

2. **Se funcionar, aumentar:**
   ```bash
   # Próximas rodadas: 200, 300, 500, etc
   # Até capturar TUDO que você tem salvado
   ```

3. **Depois:**
   ```bash
   # Ativar agendamento automático
   # Seguir: AGENDAR_ROTINA.md
   ```

4. **Resultado final:**
   - Base sempre sincronizada com salvos atuais
   - Sem você fazer nada (roda automaticamente)
   - Sempre pesquisável por tema/autor

---

**Este arquivo é sua boia de contexto. Sempre consulte-o antes de começar um novo chat!** 🎯
