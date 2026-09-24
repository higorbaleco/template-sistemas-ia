# Groups Hunter Advance

Extensão Chrome simples para coletar links de grupos WhatsApp e Telegram sem servidor local.

## O que ela faz

- Lê a aba atual e extrai links `chat.whatsapp.com` e `t.me`
- Vê uma lista fixa de fontes de grupos embutida na extensão
- Permite busca por palavra-chave opcional e categoria com relevância suave
- Tem filtro visível de fontes +18
- Deduplica os links encontrados
- Permite copiar só as URLs ou exportar CSV

## Estrutura do repositório

- `chrome-extension/` é a versão leve e instalável no Chrome
- O legado pesado foi arquivado fora deste repositório em `../GroupsHunterAdvance-Legado` para consulta posterior

## Como usar

1. Abra `chrome://extensions`
2. Ative **Modo do desenvolvedor**
3. Clique em **Carregar sem compactação**
4. Selecione a pasta `chrome-extension`
5. Abra o popup da extensão e clique em **Coletar links**

## Configurações

- `Opções` permite ativar/desativar fontes e controlar +18
- Também é possível ajustar:
  - inclusão da aba atual
  - profundidade do crawl nas fontes
  - filtros de WhatsApp e Telegram

## Observações

- Não existe mais backend local na versão principal
- Não há fila, SSE nem validação pesada no fluxo da extensão
- O legado pesado não entra no pacote da extensão e fica fora deste repo
