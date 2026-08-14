#!/bin/bash
# Script para ativar agendamento automático (macOS)

echo "🤖 ATIVANDO AUTOMAÇÃO DIÁRIA"
echo "============================"
echo ""

# Criar pasta de logs
mkdir -p ~/Library/LaunchAgents
mkdir -p "/Users/higorplens/Antigravity Software/Claude/Insta-Scrap/logs"

echo "✅ Pastas criadas"
echo ""

# Criar plist
cat > ~/Library/LaunchAgents/com.instagram.salvos.plist << 'PLIST'
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
    
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>8</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>
    
    <key>StandardOutPath</key>
    <string>/Users/higorplens/Antigravity Software/Claude/Insta-Scrap/logs/rotina.log</string>
    
    <key>StandardErrorPath</key>
    <string>/Users/higorplens/Antigravity Software/Claude/Insta-Scrap/logs/rotina_erro.log</string>
    
    <key>WorkingDirectory</key>
    <string>/Users/higorplens/Antigravity Software/Claude/Insta-Scrap/instagram-salvos</string>
</dict>
</plist>
PLIST

echo "✅ Launch Agent criado"
echo ""

# Carregar
launchctl load ~/Library/LaunchAgents/com.instagram.salvos.plist 2>/dev/null

if launchctl list | grep -q com.instagram.salvos; then
    echo "✅ Launch Agent ATIVADO!"
    echo ""
    echo "🎯 Rotina agora executa:"
    echo "   ⏰ Todos os dias às 8:00 AM"
    echo "   📥 Baixa 30 novos posts"
    echo "   🏷️ Cataloga automaticamente"
    echo "   📝 Renomeia com título + @autor"
    echo ""
    echo "📊 Logs salvos em:"
    echo "   /Users/higorplens/Antigravity Software/Claude/Insta-Scrap/logs/"
else
    echo "❌ Erro ao ativar. Tente manualmente:"
    echo "   launchctl load ~/Library/LaunchAgents/com.instagram.salvos.plist"
fi

echo ""
echo "============================"
