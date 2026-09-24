# Arquivar e retomar

Aplicar por projeto. Não remover original enquanto houver etapa incompleta. Registrar evidências em manifesto privado externo. Não executar scripts do projeto só para descobrir sua função.

## Estado e documentação

- Executar `inventory.py git-audit`; revisar status completo, HEAD, todas as refs, stashes, worktrees, submódulos, remotos e ignorados. O script não verifica backup remoto.
- Sem Git: inventariar e preparar novo repositório privado com arquivos selecionados, nunca inicializar na pasta pessoal inteira.
- Escrever `ARCHIVE.md` com objetivo, tecnologias/versões conhecidas, estado funcional, última atividade anterior ao arquivo, pendências, motivo da pausa, instalação, execução, validação e retomada. Incluir nomes de variáveis sem valores. Distinguir fatos de inferências.
- Manter caminhos pessoais e localização de dados sensíveis no manifesto privado. Não publicar detalhes privados desnecessários.
- Revisar e adicionar arquivos explicitamente, usando `--` antes dos nomes. Não usar `git add .` indiscriminado, `reset` ou `clean`. Preservar alterações staged/unstaged, conflitos, arquivos novos e exclusões intencionais.

## Cobertura

- Código/documentação: preservar snapshot das alterações, com branch de arquivo quando apropriado, sem sobrescrever branches existentes. Não abortar merge/rebase arbitrariamente.
- Listar SHA de todas as refs e preservar trabalho único em branches, tags e outras refs. HEAD destacado precisa de ref recuperável. Proibir push com `--mirror`, `--force`, `--prune` ou exclusão de refs remotas.
- Stashes: preservar cada entrada, conteúdo não rastreado quando existente e mapeamento/ordem. Bundle com `--all` não garante entradas antigas do reflog de stash. Criar refs para cada objeto relevante após revisão de segredos, ou preservar armazenamento Git completo em backup privado. Não fazer `stash pop` como backup.
- Reflogs/objetos soltos: identificar trabalho único e preservar refs explícitas ou backup completo de metadados. Bundle não inclui worktree, índice, reflogs e configuração.
- Ignorados/não rastreados: classificar individualmente ou em grupos justificados. Dependências reproduzíveis podem ser descartáveis; `.env`, chaves, certificados, SQLite, uploads, assets e documentos únicos precisam de cópia privada apropriada fora do alvo. Não enviar segredos ao Git, mesmo privado.
- Revisar segredos também no histórico/refs a enviar. Detector auxilia, mas não prova ausência. Credenciais encontradas bloqueiam o upload afetado; não reescrever histórico nem revogar credenciais automaticamente.
- Git LFS: preservar objetos reais, não só pointers. Submódulos/repos aninhados precisam de backup próprio, inclusive alterações locais. Worktrees e Git compartilhado exigem plano conjunto; não apagar common-dir de outro checkout. Remover worktrees por operação nativa após preservar conteúdo.
- Clones rasos, parciais, promisor e alternates: verificar recuperação sem depender de objetos ausentes ou pastas locais que serão apagadas.
- Bancos/volumes: obter exportação consistente. Dados sensíveis exigem destino privado criptografado conhecido, com chave recuperável fora do alvo. Não inventar criptografia nem copiar banco em escrita e chamar de backup consistente.

## Envio e restauração

1. Usar destino autorizado. Remoto configurado não implica autorização para publicação pública. Verificar visibilidade antes de enviar material novo; não alterar visibilidade de repositório existente sem pedido. Se necessário, criar arquivo privado no destino autorizado.
2. Enviar refs explícitas sem colisão, após revisar arquivos e histórico. Falha de rede, espaço, tamanho ou autenticação bloqueia remoção desse projeto.
3. Consultar remoto com `git ls-remote` e comparar SHA de cada ref necessária. `origin/*` local e “Everything up-to-date” não comprovam cobertura completa.
4. Recuperar numa nova pasta fora do alvo, sem `--shared`/alternates ou objetos locais compartilhados. Em testes com remoto local, usar `--no-local`. Verificar refs, `git fsck --full` e conteúdo do snapshot; recuperar e conferir LFS e submódulos separadamente. Não executar hooks/código sem revisão.
5. Dados externos: conferir lista de arquivos, tamanho, SHA-256 e extração/abertura. Não imprimir valores secretos. Testar recuperação de banco isoladamente quando necessário para comprovar integridade.
6. Bundle auxiliar: criar fora do alvo e testar restauração em repositório vazio; verificar apenas no original pode mascarar pré-requisitos. Bundle no mesmo disco não cumpre o objetivo de subir no Git.
7. Registrar backups, refs, hashes e evidências. Reexaminar após encerrar processos; preservar mudanças posteriores ao backup antes de liberar remoção.

Concluir somente quando todos os arquivos/estados relevantes estiverem recuperáveis fora da área a remover ou explicitamente classificados como descartáveis no plano autorizado. Bloquear apenas o projeto incompleto. Código remoto não prova preservação de dados locais.

Referências: [Git bundle](https://git-scm.com/docs/git-bundle) e [Git status](https://git-scm.com/docs/git-status). Consultar documentação da versão instalada se necessário.
