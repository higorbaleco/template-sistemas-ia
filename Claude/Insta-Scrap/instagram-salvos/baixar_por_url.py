#!/usr/bin/env python3
"""
Script para baixar posts do Instagram a partir de URLs.
"""

import json
import re
import sys
from pathlib import Path
from datetime import datetime

# Importar instaloader diretamente
sys.path.insert(0, "/Users/higorplens/Antigravity Software/Claude/Insta-Scrap/.venv-instagram-salvos/lib/python3.13/site-packages")

try:
    import instaloader
except ImportError:
    print("❌ Instaloader não encontrado. Instale com: pip install instaloader")
    sys.exit(1)

def extrair_shortcode(url):
    """Extrai o shortcode de uma URL do Instagram."""
    patterns = [
        r'instagram\.com/(?:p|reels?)/([A-Za-z0-9_-]+)',
        r'(?:p|reels?)/([A-Za-z0-9_-]+)',
    ]

    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)

    return None

def obter_post(shortcode):
    """Obtém os dados de um post específico."""
    try:
        loader = instaloader.Instaloader()
        # Tenta usar a sessão salva
        try:
            loader.load_session_from_file("omagodowhats", filename="/Users/higorplens/.config/instaloader/session-omagodowhats")
        except:
            print("⚠️  Não consegui carregar sessão, tentando sem autenticação...")

        post = instaloader.Post.from_shortcode(loader.context, shortcode)

        metadados = {
            "shortcode": post.shortcode,
            "url": f"https://www.instagram.com/p/{post.shortcode}/",
            "autor": post.owner_username,
            "legenda": post.caption or "",
            "data_utc": post.date_utc.isoformat(),
            "tipo": "GraphVideo" if post.is_video else "GraphSidecar" if post.is_carousel else "GraphImage",
            "eh_video": post.is_video,
            "likes": post.likes,
            "comentarios": post.comments,
            "hashtags": list(post.caption_hashtags) if post.caption else [],
            "mencoes": list(post.caption_mentions) if post.caption else [],
            "transcricao": ""  # Será preenchido se houver transcrição
        }

        return metadados

    except Exception as e:
        print(f"❌ Erro ao obter post: {e}")
        return None

def main():
    if len(sys.argv) < 2:
        print("❌ Uso: python3 baixar_por_url.py <url_do_instagram>")
        print("Exemplo: python3 baixar_por_url.py https://www.instagram.com/reels/Da3Z0zLpRlU/")
        sys.exit(1)

    url = sys.argv[1]

    print(f"\n🔗 Processando URL: {url}\n")

    # Extrair shortcode
    shortcode = extrair_shortcode(url)
    if not shortcode:
        print("❌ Não consegui extrair o shortcode da URL")
        sys.exit(1)

    print(f"📌 Shortcode encontrado: {shortcode}\n")

    # Obter metadados
    print("📥 Obtendo metadados do post...")
    metadados = obter_post(shortcode)

    if not metadados:
        print("❌ Falha ao obter metadados")
        sys.exit(1)

    print(f"✅ Post de @{metadados['autor']}")
    print(f"   Tipo: {metadados['tipo']}")
    print(f"   Legenda: {metadados['legenda'][:80]}...\n")

    # Adicionar ao salvos.json
    salvos_file = Path("salvos.json")

    if salvos_file.exists():
        with open(salvos_file) as f:
            salvos = json.load(f)
    else:
        salvos = []

    # Verificar se já existe
    if any(p['shortcode'] == shortcode for p in salvos):
        print(f"⚠️  Post {shortcode} já existe em salvos.json")
    else:
        salvos.append(metadados)

        with open(salvos_file, 'w') as f:
            json.dump(salvos, f, indent=2, ensure_ascii=False)

        print(f"✅ Post adicionado a salvos.json\n")
        print(f"Total de posts: {len(salvos)}\n")

        # Rodar catalogação e renomeação
        print("🔄 Catalogando e renomeando...\n")
        import subprocess
        subprocess.run(["python3", "catalogar.py"], check=False)
        subprocess.run(["python3", "renomear.py"], check=False)

    print("\n✅ Concluído! Post processado e catalogado.")

if __name__ == "__main__":
    main()
