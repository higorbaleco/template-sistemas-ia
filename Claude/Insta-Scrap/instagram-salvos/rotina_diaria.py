#!/usr/bin/env python3
"""
Rotina automática diária: baixa novos salvos, cataloga e renomeia.
Execute com: python3 rotina_diaria.py
"""

import json
import subprocess
from pathlib import Path
from datetime import datetime
import time

def log(msg):
    """Log com timestamp."""
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{ts}] {msg}")

def rodar_comando(cmd, descricao):
    """Executa comando e loga resultado."""
    log(f"🔄 {descricao}...")
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=600)
        if result.returncode == 0:
            log(f"✅ {descricao} — OK")
            return True
        else:
            log(f"❌ {descricao} — ERRO: {result.stderr[:100]}")
            return False
    except subprocess.TimeoutExpired:
        log(f"⏱️  {descricao} — TIMEOUT (muito tempo)")
        return False
    except Exception as e:
        log(f"❌ {descricao} — EXCEÇÃO: {e}")
        return False

def contar_posts():
    """Retorna stats da base."""
    try:
        salvos = json.load(open("salvos.json"))
        inspiracao = len(list(Path("inspiracao-conteudos").glob("*.md"))) - 1  # -1 para INDEX.md
        tutorial = len(list(Path("tutorial-conteudo").glob("*.md"))) - 1

        return {
            "total": len(salvos),
            "inspiracao": inspiracao,
            "tutorial": tutorial
        }
    except:
        return None

def main():
    log("="*60)
    log("ROTINA DIÁRIA: INSTAGRAM SALVOS")
    log("="*60)

    # Stats antes
    stats_antes = contar_posts()
    if stats_antes:
        log(f"📊 Antes: {stats_antes['total']} posts totais")

    # 1. Baixar novos salvos (máximo 30 para ser seguro)
    cmd_baixar = (
        ".venv-instagram-salvos/bin/python .claude/skills/instagram-salvos/scripts/baixar_salvos.py "
        "baixar --perfil omagodowhats --confirmo-perfil omagodowhats --max 30 --pausa 3"
    )
    if not rodar_comando(cmd_baixar, "Baixar novos salvos"):
        log("⚠️  Falha ao baixar, continuando mesmo assim...")

    time.sleep(2)

    # 2. Catalogar
    if not rodar_comando("python3 catalogar.py", "Catalogar posts"):
        log("⚠️  Falha ao catalogar, continuando...")

    time.sleep(2)

    # 3. Renomear
    if not rodar_comando("python3 renomear.py", "Renomear posts"):
        log("⚠️  Falha ao renomear, continuando...")

    # Stats depois
    log("")
    stats_depois = contar_posts()
    if stats_depois:
        log(f"📊 Depois: {stats_depois['total']} posts totais")
        if stats_antes:
            novos = stats_depois['total'] - stats_antes['total']
            log(f"🎉 Novos posts adicionados: {novos}")

    # Resumo
    if stats_depois:
        log("")
        log("📈 RESUMO FINAL:")
        log(f"   Total: {stats_depois['total']} posts")
        log(f"   Inspiração: {stats_depois['inspiracao']}")
        log(f"   Tutorial: {stats_depois['tutorial']}")

    log("="*60)
    log("✅ ROTINA CONCLUÍDA")
    log("="*60)

if __name__ == "__main__":
    main()
