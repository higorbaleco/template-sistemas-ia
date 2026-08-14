# Extensão Chrome (Base)

Esta pasta contém a base da extensão para abrir e monitorar o app local.

## Instalação (modo desenvolvedor)

1. Abra `chrome://extensions`
2. Ative **Modo do desenvolvedor**
3. Clique em **Carregar sem compactação**
4. Selecione esta pasta: `chrome-extension`

## O que a extensão já faz

- Abre o painel local da ferramenta.
- Verifica status do backend local em `/stats`.
- Permite configurar a URL do backend (Options).

## URL padrão do backend

- `http://127.0.0.1:5050`

## Observação

A extensão depende do app local estar iniciado (atalho `Abrir Ferramenta.command`).
