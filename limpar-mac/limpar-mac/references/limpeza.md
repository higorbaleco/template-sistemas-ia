# Limpeza por categoria

## Caches

- Revisar entradas de `~/Library/Caches` e seu aplicativo proprietário; nunca apagar a raiz inteira. Nome/data não provam descarte.
- Confirmar aplicativo fechado e cache regenerável, sem downloads offline ou trabalho único. Preferir limpeza própria do aplicativo quando adequada ao escopo.
- Em projetos, revisar `node_modules`, `.venv`, `.next`, `.pytest_cache`, `__pycache__` e builds. Confirmar manifests, lockfiles e possibilidade de reinstalação; preservar código editado nessas pastas.
- Não tratar Application Support, Containers, Group Containers, Keychains, Mail, Messages, sessões de navegador, backups de dispositivos e volumes Docker como caches.
- Evitar limpezas globais de package managers, `docker system prune --volumes` e `sudo rm -rf`. Não desinstalar aplicativos nem alterar segurança.

## Vídeos

- Ordenar por tamanho/data e confirmar finalidade. Noventa dias é só filtro ajustável; data no nome não comprova idade.
- Distinguir originais pessoais, clientes, reuniões, exports reproduzíveis e downloads. Não descartar originais pela existência de cópia menor ou outro codec.
- Duplicados exatos: comparar tamanho e SHA-256 do conteúdo inteiro; hash igual não escolhe qual cópia descartar. Registrar original preservado e considerar sincronização/hardlinks.
- Não apagar mídia interna de bibliotecas Photos, iMovie, Final Cut ou pacotes de aplicativos; gerenciar pelo aplicativo.

## Remoção

1. Medir espaço livre no volume. Validar caminho absoluto e identidade do alvo, tipo e dispositivo/inode quando possível. Bloquear raiz do sistema, diretório pessoal inteiro, volumes e ancestrais amplos como `~/Library` e raiz de projetos. Não seguir links para fora do escopo nem cruzar mounts inesperados.
2. Vincular cada ação ao plano autorizado. Revalidar atividade/processos/backups. Usar argumentos como lista, caminhos citados e `--` quando suportado, sem globs ou interpolação de nomes em shell/AppleScript.
3. Usar API/ferramenta de Lixeira disponível ou Finder com argumentos escapados. Registrar origem e destino real para restauração; não presumir nomes ou sobrescrever colisões. Não mover cegamente para `~/.Trash`. Sem API, orientar Finder ou deixar pendente; não substituir por exclusão definitiva silenciosamente.
4. Exclusão definitiva exige autorização para caminhos concretos e backups verificados. Se já houver autorização válida, executar. Se cobrir apenas Lixeira, não esvaziá-la. Nunca esvaziar itens alheios nem configurar expurgo automático.
5. Verificar resultado e medir espaço novamente. Separar volume estimado, conteúdo na Lixeira e ganho observado. Não apagar snapshots do Time Machine para aproximar números.
6. Para desfazer, restaurar destino registrado ou backup verificado, resolvendo colisões antes. Preservar manifesto e instruções de retomada.

Referência: [Excluir arquivos e pastas no Mac, Apple](https://support.apple.com/guide/mac-help/delete-files-and-folders-on-mac-mchlp1093/mac).
