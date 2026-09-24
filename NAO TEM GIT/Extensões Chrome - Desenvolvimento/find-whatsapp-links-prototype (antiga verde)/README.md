# Find WhatsApp Links - Prototype

Extensão Chrome para extrair links públicos de grupos de WhatsApp da página atual.

## O que esta versão faz

1. Escaneia a página atual.
2. Encontra links `chat.whatsapp.com/...`.
3. Filtra por palavra-chave.
4. Remove links duplicados.
5. Permite copiar, exportar TXT e exportar CSV.

## O que ainda não faz

1. Não valida se o grupo está expirado.
2. Não vê quantidade de membros.
3. Não entra no grupo.
4. Não usa WhatsApp Web logado.

Essas funções entram na próxima camada: validador via WhatsApp Web/Puppeteer.

## Como instalar

1. Abra `chrome://extensions/`.
2. Ative `Modo do desenvolvedor`.
3. Clique em `Carregar sem compactação`.
4. Selecione esta pasta.
5. Acesse um site com links de grupos.
6. Clique na extensão e use `Escanear página`.

## Próxima versão recomendada

- Botão `Validar no WhatsApp Web`.
- Status: ativo, expirado, cheio, indisponível.
- Extração de nome do grupo e quantidade de participantes.
- Histórico local de links já verificados.
