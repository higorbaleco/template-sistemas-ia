# Extensao Chrome - Ferramenta Consulta

Extensao para abrir e monitorar o backend local da Ferramenta Consulta.

## Inicio rapido (2 minutos)

1. Inicie o backend com `Abrir Ferramenta.command`
2. Execute `Instalar Extensao Chrome.command`
3. No Chrome, ative **Modo do desenvolvedor**
4. Clique em **Carregar sem compactacao**
5. Selecione a pasta `chrome-extension`
6. Abra a extensao e clique em **Abrir painel**

## O que a extensao faz

- Abre o painel local da ferramenta
- Verifica status do backend em `/stats`
- Exibe estatisticas basicas da sessao
- Permite configurar a URL do backend em **Configurar URL**

## URL padrao

- `http://127.0.0.1:5050`

## Configuracao de URL

- Voce pode informar `127.0.0.1:5050` (a extensao adiciona `http://` automaticamente)
- URLs invalidas sao bloqueadas com mensagem de erro

## Solucao rapida de problemas

- **Status Offline:** confirme que `Abrir Ferramenta.command` esta rodando
- **Sem resposta do backend:** confirme porta `5050` livre e backend ativo
- **URL errada:** abra **Configurar URL** e salve novamente
