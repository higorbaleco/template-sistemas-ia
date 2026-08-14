#!/usr/bin/env python3
"""
Script para renomear arquivos .md com base no título e autor.
Formato: Titulo-Do-Video_do_@autor.md
"""

import json
import re
from pathlib import Path

def limpar_titulo(titulo):
    """Limpa o título para ser um nome de arquivo válido."""
    # Remove caracteres especiais, mantém apenas letras, números e hífens
    titulo = titulo.strip()
    # Remove linhas vazias e caracteres especiais
    titulo = re.sub(r'[^\w\s\-áéíóúãõçñ]', '', titulo)
    # Substitui espaços por hífens
    titulo = re.sub(r'\s+', '-', titulo)
    # Remove hífens múltiplos
    titulo = re.sub(r'-+', '-', titulo)
    # Remove hífens no início e fim
    titulo = titulo.strip('-')
    # Limita a 60 caracteres
    return titulo[:60]

def processar_pasta(pasta_path):
    """Processa todos os arquivos .md de uma pasta."""
    pasta = Path(pasta_path)
    if not pasta.exists():
        print(f"❌ Pasta não encontrada: {pasta_path}")
        return

    print(f"\n📂 Processando: {pasta.name}")
    print("=" * 70)

    mapeamento = {}  # Para atualizar INDEX depois

    for arquivo_md in sorted(pasta.glob("*.md")):
        if arquivo_md.name == "INDEX.md":
            continue

        try:
            conteudo = arquivo_md.read_text(encoding="utf-8")

            # Extrair título (primeira linha com #)
            titulo_match = re.search(r'^#\s+(.+)$', conteudo, re.MULTILINE)
            titulo = titulo_match.group(1).strip() if titulo_match else "Sem-titulo"

            # Extrair autor (tenta vários padrões)
            autor_match = re.search(r'\*\*Autor:\*\*\s+@(\w+)', conteudo)
            if not autor_match:
                autor_match = re.search(r'Autor:\s+@(\w+)', conteudo)
            if not autor_match:
                autor_match = re.search(r'Autor:\s+(\w+)', conteudo)
            autor = autor_match.group(1) if autor_match else "desconhecido"

            # Gerar novo nome
            titulo_limpo = limpar_titulo(titulo)
            novo_nome = f"{titulo_limpo}_do_@{autor}.md"
            novo_path = arquivo_md.parent / novo_nome

            # Evitar duplicatas
            if novo_path.exists() and novo_path != arquivo_md:
                novo_nome = f"{titulo_limpo}_do_@{autor}_{arquivo_md.stem}.md"
                novo_path = arquivo_md.parent / novo_nome

            # Renomear
            arquivo_md.rename(novo_path)
            print(f"✅ {arquivo_md.name}")
            print(f"   → {novo_nome}\n")

            mapeamento[arquivo_md.name] = novo_nome

        except Exception as e:
            print(f"⚠️  Erro ao processar {arquivo_md.name}: {e}\n")

    # Atualizar INDEX.md
    atualizar_index(pasta, mapeamento)

def atualizar_index(pasta_path, mapeamento):
    """Atualiza os links no INDEX.md da pasta."""
    pasta = Path(pasta_path)
    index_file = pasta / "INDEX.md"

    if not index_file.exists() or not mapeamento:
        return

    conteudo = index_file.read_text(encoding="utf-8")

    # Atualizar links
    for antigo, novo in mapeamento.items():
        # Remove a extensão .md do antigo para o padrão de link
        antigo_sem_ext = antigo.replace(".md", "")
        conteudo = conteudo.replace(f"({pasta.name}/{antigo_sem_ext}.md)",
                                   f"({pasta.name}/{novo}")
        conteudo = conteudo.replace(f"({pasta.name}/{antigo})",
                                   f"({pasta.name}/{novo}")

    index_file.write_text(conteudo, encoding="utf-8")
    print(f"📄 INDEX.md atualizado: {index_file.name}\n")

def main():
    print("\n🔄 Iniciando renomeação de arquivos...\n")

    base_path = Path("/Users/higorplens/Antigravity Software/Claude/Insta-Scrap/instagram-salvos")

    # Processar as três pastas
    processar_pasta(base_path / "inspiracao-conteudos")
    processar_pasta(base_path / "tutorial-conteudo")
    processar_pasta(base_path / "posts")

    print("\n✅ Renomeação completa!")
    print("💡 Todos os arquivos foram renomeados com base no título e autor.\n")

if __name__ == "__main__":
    main()
