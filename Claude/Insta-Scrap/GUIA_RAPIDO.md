# 📱 Guia Rápido: Instagram Salvos → Base de Conhecimento

Este é o seu guia de referência. Use para iniciar novos chats sem perder contexto.

---

## 🚀 Prompts Rápidos Para Claude

### Extrair Salvos do Instagram
```
Vou usar a skill instagram-salvos para baixar meus posts salvos do Instagram.
Quero baixar [NÚMERO] posts e:
1. Transcrever apenas os que forem sobre: [TEMAS - ex: IA, WhatsApp, Empreendedorismo]
2. Ignorar os irrelevantes (sem processar)
3. Catalogar em pasta: inspiracao-conteudos/ e tutorial-conteudo/
4. Renomear com formato: Titulo-do-Video_do_@autor.md

Use os scripts que já estão em instagram-salvos/:
- catalogar.py
- renomear.py

Depois me mostra o resumo final com quantos posts ficaram em cada pasta.
```

### Adicionar Posts Por URL
```
Vou passar algumas URLs do Instagram para você adicionar à minha base.
Para cada uma:
1. Use o script baixar_por_url.py
2. Extraia o shortcode
3. Baixe os metadados
4. Adicione ao salvos.json (evite duplicatas)
5. Recatalogge e renomeie automaticamente

URLs:
[URL 1]
[URL 2]
[URL 3]

Use: python3 baixar_por_url.py "URL"
```

### Buscar na Base Existente
```
Que posts eu salvei sobre [TEMA]?

Consulte: instagram-salvos/INDEX.md e as pastas:
- inspiracao-conteudos/
- tutorial-conteudo/
```

---

## 💻 Comandos Shell

### Baixar Novos Salvos (até 50 de uma vez)
```bash
cd /Users/higorplens/Antigravity\ Software/Claude/Insta-Scrap/instagram-salvos

# Baixar 50 posts
.venv-instagram-salvos/bin/python .claude/skills/instagram-salvos/scripts/baixar_salvos.py \
  baixar --perfil omagodowhats --confirmo-perfil omagodowhats --max 50 --pausa 3
```

### Adicionar Posts Por URL
```bash
cd /Users/higorplens/Antigravity\ Software/Claude/Insta-Scrap/instagram-salvos
python3 baixar_por_url.py "https://www.instagram.com/reels/SHORTCODE/"
```

### Recatalogar Tudo
```bash
cd /Users/higorplens/Antigravity\ Software/Claude/Insta-Scrap/instagram-salvos
python3 catalogar.py
python3 renomear.py
```

### Ver Quantos Posts Tem
```bash
cd /Users/higorplens/Antigravity\ Software/Claude/Insta-Scrap/instagram-salvos
python3 -c "import json; print(f'Total: {len(json.load(open(\"salvos.json\")))}')"
```

---

## 📁 Estrutura de Pastas

```
instagram-salvos/
├── salvos.json                 # Base bruta (todos os posts)
├── INDEX.md                    # Índice geral
├── catalogar.py                # Script de categorização
├── renomear.py                 # Script de renomeação
├── baixar_por_url.py           # Script para adicionar por URL
│
├── inspiracao-conteudos/       # Posts sobre IA, WhatsApp, etc
│   ├── INDEX.md
│   ├── Skill-Claude-Sites-Animados_do_@itsdavixavier.md
│   ├── Comenta-JARVIS-que-eu-te-mando-o-guia-completo_do_@99hud.md
│   └── ... (mais posts)
│
├── tutorial-conteudo/          # Dicas de como criar conteúdo
│   ├── INDEX.md
│   ├── Como-planejar-1-mês-de-conteúdo-em-30-min_do_@lucureau.md
│   └── ... (mais posts)
│
└── posts/                      # Cópias dos posts originais (7 posts)
    └── ... (posts principais)
```

---

## 🎯 Temas Para Filtrar

Estes são os temas que o script `catalogar.py` reconhece automaticamente:

- **#ia** — Claude, IA agents, APIs, automação, código
- **#whatsapp** — WhatsApp, Meta, chatbots, automações
- **#empreendedorismo** — negócio, startups, vendas, marketing, estratégia
- **#vendas** — venda, leads, conversão, pitch
- **#automacoes** — automação, workflows, integrações, ferramentas
- **#tutorial-conteudo** — como criar conteúdo, produção, edição, copywriting

Conteúdo que não encaixa em nenhum tema → pasta `ignorados` (não processado)

---

## 📊 Status Atual (Última Atualização)

```
Total de posts: 51
✅ Inspiração de conteúdos: 35 posts
✅ Tutorial de conteúdo: 7 posts
⏭️ Ignorados: 9 posts

Último post adicionado: Da3Z0zLpRlU (@brubatistucci)
Data: 2026-08-04
```

---

## 🔑 Dicas Importantes

### Ao Adicionar Por URL
- O script detecta automaticamente duplicatas (não duplica)
- Funciona com: `/reels/`, `/p/`, qualquer variação
- Extrai metadados: autor, legenda, data, tipo (vídeo/imagem)
- Recataloga tudo automaticamente

### Ao Adicionar Salvos em Massa
- Máximo 50 posts por rodada (seguro contra rate limit do Instagram)
- Pausa de 2-3 segundos entre posts
- Se receber erro de rate limit, aguarde 30-60 min
- Rode `catalogar.py` e `renomear.py` depois

### Nomenclatura de Arquivos
Formato: `Titulo-Do-Video_do_@nomeusuario.md`
- Título: primeiras palavras do conteúdo (até 60 chars)
- Autor: nome do Instagram
- Automático: tudo em kebab-case

---

## ❓ Troubleshooting

| Problema | Solução |
|----------|---------|
| Script não encontra o shortcode | Verifique se a URL está completa (com `https://`) |
| Rate limit do Instagram | Aguarde 30-60 min, não reinsista |
| Arquivo com nome `@desconhecido` | Verifique se o autor está no formato `**Autor:** @nome` |
| Arquivo duplicado | `catalogar.py` e `renomear.py` já evitam duplicatas |
| Quer ver quantos posts tem | Use: `python3 -c "import json; print(len(json.load(open('salvos.json'))))"` |

---

## 🎓 Exemplo Completo: Do Zero Ao Processamento

### 1. Novo chat, sem contexto
Copie e cole no novo chat:

```
Vou usar minha base de conhecimento do Instagram salvos.

Caminho: /Users/higorplens/Antigravity Software/Claude/Insta-Scrap/instagram-salvos/

Quero:
1. Adicionar esta URL: https://www.instagram.com/reels/XXX/
2. Recatalogar tudo
3. Mostrar resumo

Use: python3 baixar_por_url.py "URL"
Depois: python3 catalogar.py && python3 renomear.py
```

### 2. Seu script faz tudo
O `baixar_por_url.py` automaticamente:
- ✅ Extrai shortcode
- ✅ Baixa metadados
- ✅ Adiciona ao salvos.json
- ✅ Roda catalogação
- ✅ Roda renomeação

Resultado: seu post já está em uma das pastas, com nome descritivo e categorizado.

---

## 📞 Referência Rápida

**Pasta base:**
```
/Users/higorplens/Antigravity Software/Claude/Insta-Scrap/instagram-salvos/
```

**Scripts principais:**
- `catalogar.py` — categoriza posts por tema
- `renomear.py` — renomeia com título + @autor
- `baixar_por_url.py` — adiciona posts por URL

**Perfil Instagram:**
```
omagodowhats
```

**Sessão salva em:**
```
/Users/higorplens/.config/instaloader/session-omagodowhats
```

---

**Pronto para usar! Copie este arquivo quando iniciar novo chat.** 🚀
