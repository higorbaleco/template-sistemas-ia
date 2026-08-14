# Subir Extensão (v1.1.0)

## Arquivo para upload (Chrome Web Store)
- `dist/FerramentaConsulta_v1.1.0.zip`

O ZIP já está no formato exigido: `manifest.json` na raiz.

## Gerar novamente
- `./package-extension.sh`

## Notas
- O `manifest.json` mantém `host_permissions` só para `localhost/127.0.0.1`.
- Para backend em IP da rede (ex.: `http://192.168.x.x:5050`), a extensão pede permissão via `optional_host_permissions` quando você salvar a URL ou usar o popup.

