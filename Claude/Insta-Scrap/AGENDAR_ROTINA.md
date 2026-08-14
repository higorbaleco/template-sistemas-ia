# 🤖 Agendar Rotina Diária de Sincronização

Esta guia explica como fazer a extração rodar **automaticamente todo dia**.

---

## 🎯 O Que A Rotina Faz

```
Todo dia (horário que você escolher):
1. ✅ Baixa até 30 novos salvos do Instagram
2. ✅ Cataloga automaticamente
3. ✅ Renomeia com título + @autor
4. ✅ Registra em log o que foi adicionado
```

**Tempo estimado:** 5-10 minutos por dia

---

## 📋 Opção 1: macOS (RECOMENDADO)

### Passo 1: Criar Launch Agent

```bash
mkdir -p ~/Library/LaunchAgents

# Criar arquivo de configuração
cat > ~/Library/LaunchAgents/com.instagram.salvos.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.instagram.salvos</string>
    
    <key>ProgramArguments</key>
    <array>
        <string>/usr/bin/python3</string>
        <string>/Users/higorplens/Antigravity Software/Claude/Insta-Scrap/instagram-salvos/rotina_diaria.py</string>
    </array>
    
    <!-- Rodar todo dia às 8:00 da manhã -->
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>8</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>
    
    <!-- Executar mesmo se a máquina tiver dormindo -->
    <key>StartInterval</key>
    <integer>86400</integer>
    
    <!-- Log de saída -->
    <key>StandardOutPath</key>
    <string>/Users/higorplens/Antigravity Software/Claude/Insta-Scrap/logs/rotina.log</string>
    
    <key>StandardErrorPath</key>
    <string>/Users/higorplens/Antigravity Software/Claude/Insta-Scrap/logs/rotina_erro.log</string>
    
    <!-- Working directory -->
    <key>WorkingDirectory</key>
    <string>/Users/higorplens/Antigravity Software/Claude/Insta-Scrap/instagram-salvos</string>
</dict>
</plist>
EOF
```

### Passo 2: Criar pasta de logs

```bash
mkdir -p /Users/higorplens/Antigravity\ Software/Claude/Insta-Scrap/logs
```

### Passo 3: Carregar o Launch Agent

```bash
launchctl load ~/Library/LaunchAgents/com.instagram.salvos.plist
```

### Verificar se está ativo

```bash
launchctl list | grep instagram.salvos
```

### Desativar (se necessário)

```bash
launchctl unload ~/Library/LaunchAgents/com.instagram.salvos.plist
```

---

## 📋 Opção 2: Linux/WSL (cron)

### Passo 1: Criar arquivo de script

```bash
cat > /Users/higorplens/Antigravity\ Software/Claude/Insta-Scrap/rotina_diaria.sh << 'EOF'
#!/bin/bash
cd "/Users/higorplens/Antigravity Software/Claude/Insta-Scrap/instagram-salvos"
python3 rotina_diaria.py >> ../logs/rotina.log 2>&1
EOF

chmod +x /Users/higorplens/Antigravity\ Software/Claude/Insta-Scrap/rotina_diaria.sh
```

### Passo 2: Adicionar ao crontab

```bash
crontab -e

# Adicionar esta linha (rodar todo dia às 8:00)
0 8 * * * /Users/higorplens/Antigravity\ Software/Claude/Insta-Scrap/rotina_diaria.sh
```

---

## 🔧 Customizar Horário

### Alterar hora de execução no macOS

Edite `~/Library/LaunchAgents/com.instagram.salvos.plist`:

```xml
<!-- Altere estas linhas para seu horário preferido -->
<key>Hour</key>
<integer>8</integer>      <!-- 0-23 (8 = 8:00 AM) -->
<key>Minute</key>
<integer>0</integer>      <!-- 0-59 -->
```

**Exemplos:**
- `Hour: 6, Minute: 30` → 6:30 AM (de manhã cedo)
- `Hour: 18, Minute: 0` → 6:00 PM (fim de tarde)
- `Hour: 22, Minute: 0` → 10:00 PM (antes de dormir)

### Depois de alterar

```bash
launchctl unload ~/Library/LaunchAgents/com.instagram.salvos.plist
launchctl load ~/Library/LaunchAgents/com.instagram.salvos.plist
```

---

## 📊 Monitorar Logs

### Ver último log

```bash
tail -50 "/Users/higorplens/Antigravity Software/Claude/Insta-Scrap/logs/rotina.log"
```

### Ver erros

```bash
tail -50 "/Users/higorplens/Antigravity Software/Claude/Insta-Scrap/logs/rotina_erro.log"
```

### Watch em tempo real

```bash
tail -f "/Users/higorplens/Antigravity Software/Claude/Insta-Scrap/logs/rotina.log"
```

---

## ⚠️ Possíveis Problemas

| Problema | Solução |
|----------|---------|
| Rotina não executa | Verifique se launchctl listou corretamente: `launchctl list \| grep instagram` |
| "Permission denied" | Dê permissão: `chmod +x rotina_diaria.sh` |
| Arquivo não encontrado | Use caminhos absolutos (não `~/`) |
| Log vazio | Verifique se a pasta `logs/` existe |
| Rate limit | Script já para sozinho, tenta de novo amanhã |

---

## 🧪 Testar Manualmente

Antes de agendar, teste rodando manualmente:

```bash
cd /Users/higorplens/Antigravity\ Software/Claude/Insta-Scrap/instagram-salvos
python3 rotina_diaria.py
```

Se funcionar, agenda com confiança!

---

## 📈 Exemplo de Log

```
[2026-08-04 08:00:12] ============================================================
[2026-08-04 08:00:12] ROTINA DIÁRIA: INSTAGRAM SALVOS
[2026-08-04 08:00:12] ============================================================
[2026-08-04 08:00:12] 📊 Antes: 51 posts totais
[2026-08-04 08:00:15] 🔄 Baixar novos salvos...
[2026-08-04 08:01:30] ✅ Baixar novos salvos — OK
[2026-08-04 08:01:35] 🔄 Catalogar posts...
[2026-08-04 08:01:42] ✅ Catalogar posts — OK
[2026-08-04 08:01:47] 🔄 Renomear posts...
[2026-08-04 08:02:15] ✅ Renomear posts — OK
[2026-08-04 08:02:15]
[2026-08-04 08:02:15] 📊 Depois: 54 posts totais
[2026-08-04 08:02:15] 🎉 Novos posts adicionados: 3
[2026-08-04 08:02:15]
[2026-08-04 08:02:15] 📈 RESUMO FINAL:
[2026-08-04 08:02:15]    Total: 54 posts
[2026-08-04 08:02:15]    Inspiração: 38
[2026-08-04 08:02:15]    Tutorial: 7
[2026-08-04 08:02:15] ============================================================
[2026-08-04 08:02:15] ✅ ROTINA CONCLUÍDA
[2026-08-04 08:02:15] ============================================================
```

---

## ✅ Fluxo Completo

```
Dia 1: Você roda uma varredura grande (300-500 posts)
       ↓
Dia 2+: Rotina automática roda todo dia às 8:00 AM
        Baixa ~20-30 posts novos
        Cataloga e renomeia automaticamente
        ↓
Resultado final: Sua base sempre sincronizada com salvos atuais
```

---

## 🎯 Limite Seguro Recomendado

Para não correr risco nenhum de bloqueio:
- **Por rodada:** 30 posts máximo
- **Por dia:** 1 rotina
- **Pausa entre posts:** 3 segundos

Com isso você consegue:
- 30 posts/dia = 210 posts/semana
- ~900 posts/mês
- Totalmente seguro!

---

**Pronto! Sua base vai ficar sincronizada automaticamente.** 🚀
