# Insta-Scrap Central

Interface web da central única do Insta-Scrap, com composer para inserir vídeos, referências e disparar extração de salvos enquanto a automação roda em segundo plano.

## O que ela mostra

- Visão geral da base
- Composer central para vídeos, referências e extração
- Fila de jobs com status em tempo real
- Posts e reels com filtros
- Painel de detalhe do item selecionado
- Padrões virais
- Perfis de referência
- Theme toggle dark/light

## Como abrir

Você pode abrir `index.html` diretamente no navegador ou servir a pasta com um servidor simples:

```bash
python3 -m http.server 8080
```

Depois acesse `http://localhost:8080`.

## App instalável

Um bundle macOS já foi gerado em:

- `desktop/Insta-Scrap.app`
- `release/Insta-Scrap-1.0.0.dmg`

Como usar:

1. Abra `desktop/`.
2. Arraste `Insta-Scrap.app` para a pasta `Applications` do macOS.
3. Dê duplo clique no app para abrir a central.

Ou, para instalar via imagem:

1. Abra `release/Insta-Scrap-1.0.0.dmg`
2. Arraste `Insta-Scrap.app` para `Applications`
3. Abra o app a partir de `Applications`

Se você alterar os arquivos da UI, rode:

```bash
sh scripts/package-macos-app.sh
```

Para gerar o pacote completo novamente:

```bash
sh scripts/package-release.sh
```

## Fontes de dados

- `README-COLETA-2026-08-04.md`
- `INDEX-COLETA-PERFIS.md`
- `CHEAT-SHEET-PADROES.md`
- `TEMPLATE-PERFIL-CRIADOR.md`
- `instagram-salvos/INDEX.md`
- `instagram-salvos/salvos.json`

## Operação

- Use a aba de vídeo para inserir um link único e mandar para a fila.
- Use a aba de referência para registrar perfis e contextos internos.
- Use a aba de extração para disparar a coleta dos salvos sem sair do painel.
