#!/usr/bin/env python3
"""
Script de catalogação inteligente de salvos do Instagram.
Filtra, categoriza e organiza posts em pastas por tema.
"""

import json
import os
import re
from pathlib import Path

# Temas-chave para detectar automaticamente
TEMAS = {
    "ia": [
        "claude", "ia", "inteligencia artificial", "ai", "agent", "automation",
        "chatgpt", "gpt", "modelo", "machine learning", "nlp", "llm",
        "código", "programação", "developer", "dev", "tech"
    ],
    "whatsapp": [
        "whatsapp", "meta", "instagram", "facebook", "automação", "chatbot",
        "mensagem", "bot", "api", "manychat", "brevo"
    ],
    "empreendedorismo": [
        "empreendedor", "negócio", "startup", "vendas", "marketing", "crescimento",
        "revenue", "renda", "monetização", "lucro", "lançamento", "produto",
        "estratégia", "consistência", "algoritmo", "rede social"
    ],
    "vendas": [
        "venda", "vendedor", "vender", "sales", "saas", "B2B", "proposta",
        "cliente", "lead", "conversão", "pitch", "close"
    ],
    "automacoes": [
        "automação", "automated", "workflow", "zapier", "integrações",
        "ferramentas", "eficiência", "processos", "sistema"
    ],
    "tutorial_conteudo": [
        "tutorial", "como fazer", "passo a passo", "guia", "dica", "hack",
        "técnica", "edição", "produção", "criação", "conteúdo", "vídeo",
        "copywriting", "script", "roteiro", "camera", "iluminação", "som",
        "roteiro", "format", "estratégia de conteúdo"
    ]
}

def detectar_categoria(legenda, transcricao=""):
    """Detecta a categoria principal de um post."""
    texto_completo = (legenda + " " + transcricao).lower()

    scores = {}
    for tema, palavras_chave in TEMAS.items():
        score = sum(1 for palavra in palavras_chave if palavra in texto_completo)
        if score > 0:
            scores[tema] = score

    if scores:
        return max(scores, key=scores.get)
    return None

def criar_arquivo_post(post, categoria, pasta_destino):
    """Cria arquivo .md para um post catalogado."""
    shortcode = post["shortcode"]
    autor = post["autor"]
    url = post["url"]
    data = post["data_utc"][:10]
    legenda = post.get("legenda", "")
    transcricao = post.get("transcricao", "")
    tipo = post.get("tipo", "")

    # Título: primeira frase da legenda ou nome do autor
    titulo = legenda.split(".")[0][:60].strip() or f"Post de @{autor}"

    # Conteúdo do arquivo
    conteudo = f"""# {titulo}

- **Autor:** @{autor}
- **URL:** {url}
- **Data:** {data}
- **Tipo:** {tipo}
- **Tags:** #{categoria}

## Legenda

{legenda}

"""

    if transcricao:
        conteudo += f"""## Transcrição

{transcricao}
"""

    # Salvar arquivo
    arquivo = Path(pasta_destino) / f"{shortcode}.md"
    arquivo.write_text(conteudo, encoding="utf-8")
    print(f"✅ {shortcode} → {arquivo.name}")

    return {
        "titulo": titulo,
        "shortcode": shortcode,
        "autor": autor,
        "url": url,
        "categoria": categoria
    }

def main():
    # Ler salvos.json
    salvos_file = Path("salvos.json")
    if not salvos_file.exists():
        print("❌ salvos.json não encontrado!")
        return

    with open(salvos_file) as f:
        posts = json.load(f)

    print(f"\n📊 Catalogando {len(posts)} posts...\n")

    # Separar por categoria
    inspiracao = []
    tutorial = []
    ignorados = []

    for post in posts:
        categoria = detectar_categoria(
            post.get("legenda", ""),
            post.get("transcricao", "")
        )

        if not categoria:
            ignorados.append(post["shortcode"])
            continue

        # Decidir pasta
        if categoria == "tutorial_conteudo":
            pasta = Path("tutorial-conteudo")
            tutorial.append(post)
        else:
            pasta = Path("inspiracao-conteudos")
            inspiracao.append(post)

        # Criar arquivo
        try:
            criar_arquivo_post(post, categoria, pasta)
        except Exception as e:
            print(f"⚠️  Erro ao processar {post['shortcode']}: {e}")

    print(f"\n✅ Categorização completa!")
    print(f"   - Inspiração de conteúdos: {len(inspiracao)} posts")
    print(f"   - Tutorial de conteúdo: {len(tutorial)} posts")
    print(f"   - Ignorados: {len(ignorados)} posts")

    # Gerar INDEX files
    gerar_index("inspiracao-conteudos", inspiracao)
    gerar_index("tutorial-conteudo", tutorial)

def gerar_index(pasta, posts):
    """Gera INDEX.md para uma pasta."""
    if not posts:
        return

    index_content = f"""# Índice — {pasta}

"""

    # Agrupar por tema
    por_tema = {}
    for post in posts:
        categoria = detectar_categoria(
            post.get("legenda", ""),
            post.get("transcricao", "")
        )
        if categoria not in por_tema:
            por_tema[categoria] = []
        por_tema[categoria].append(post)

    # Escrever por tema
    for tema in sorted(por_tema.keys()):
        index_content += f"\n## {tema.replace('_', ' ').title()}\n\n"
        for post in por_tema[tema]:
            titulo = post.get("legenda", "").split(".")[0][:60].strip() or f"Post de @{post['autor']}"
            index_content += f"- [{titulo}]({pasta}/{post['shortcode']}.md) — @{post['autor']}\n"

    index_file = Path(pasta) / "INDEX.md"
    index_file.write_text(index_content, encoding="utf-8")
    print(f"\n📄 INDEX criado: {index_file}")

if __name__ == "__main__":
    main()
