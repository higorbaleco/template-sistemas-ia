# Docker e discos virtuais no Mac

## Medir antes de limpar

`Docker.raw` é um disco virtual usado pelo Docker Desktop; não é uma foto. Seu tamanho lógico pode representar a capacidade máxima, muito maior que os blocos ocupados no SSD. Um aplicativo que o classifica em imagens pode somar essa capacidade indevidamente. Não concluir que há centenas de GB recuperáveis a partir desse número.

Executar `scripts/diagnose_mac.py`. Ele consulta somente metadados locais e não abre conexão Docker. Opcionalmente passar `--docker-file /caminho/real/Docker.raw` se o arquivo estiver em outra localização. Comparar `logical_bytes`, `allocated_bytes` e espaço livre no volume. Blocos alocados ainda não são garantia de espaço recuperável, especialmente com snapshots/clones. Não ler ou copiar todo o arquivo apenas para medir tamanho.

Como alternativa nativa, usar `df -h "$HOME"` e `ls -klsh` com o caminho real do arquivo. No Docker Desktop, conferir em Settings, Resources, Advanced a localização e os valores exibidos, conforme a versão instalada.

## Contexto e inventário

Antes de comandos que consultam o daemon, conferir `DOCKER_HOST`, `DOCKER_CONTEXT` e endpoint do contexto por inspeção local. Verificar que o socket Unix pertence ao Docker Desktop deste Mac. Contexto SSH/TCP/remoto ou endpoint desconhecido bloqueia consultas ao daemon para esta tarefa local. Não mudar o contexto global para contornar isso. Não imprimir valores de autenticação.

Após confirmar o contexto local, consultar:

```bash
docker system df -v
docker container ls -a
docker image ls
docker volume ls
```

Se Docker não estiver rodando, continuar a análise do arquivo e dos demais itens. Iniciar Docker pode reiniciar serviços configurados para subir automaticamente, portanto requer decisão quando isso alterar o estado do computador.

## Plano de limpeza

- Relacionar imagens, cache de build e containers a projetos reais. Container parado pode conter dados únicos na camada gravável; volume sem container ativo também pode guardar banco valioso. “Unused” não significa dispensável.
- Remover apenas IDs/grupos identificados e autorizados, com comandos específicos e sem forçar dependências. Para cache de build, conferir o builder local, recursos regeneráveis e impacto antes de limpeza delimitada pela versão instalada.
- Não executar `docker system prune`, `docker system prune -a` ou prune de volumes como limpeza genérica. Não apagar `Docker.raw`, reduzir seu limite, resetar o Docker Desktop ou rodar container privilegiado de recuperação por iniciativa própria. Essas operações podem descartar dados ou ampliar o impacto.
- Preservar dados de aplicação antes de remover containers/volumes. Backup de código no Git não inclui esses dados.
- Depois de um lote aprovado, medir novamente blocos alocados e espaço livre no host. A recuperação pode ocorrer de forma assíncrona. Não prometer ganho igual ao tamanho máximo do arquivo ou ao total marcado como reclaimable.

Fonte: [Docker Desktop para Mac, armazenamento e recuperação de espaço](https://docs.docker.com/desktop/troubleshoot-and-support/faqs/macfaqs/).
