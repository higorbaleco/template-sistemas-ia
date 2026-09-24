# Iniciar a limpeza no VS Code

Abrir a pasta no VS Code mostra os arquivos. Para executar a limpeza, usar o chat de um agente que consiga ler arquivos e executar comandos no terminal do próprio Mac.

1. Abrir a pasta que contém `SKILL.md` no VS Code.
2. Abrir o chat do agente local disponível no editor e habilitar seu modo de execução de ferramentas, conforme a interface instalada. Não colar o prompt abaixo no terminal.
3. Colar o texto abaixo no chat. O agente deve começar executando o diagnóstico, preparar o lote de limpeza e realizar as ações autorizadas.

## Prompt pronto

```text
Leia o SKILL.md da pasta aberta e suas referências. Use essa skill para executar a limpeza do meu Mac com acesso ao terminal local. Não fique apenas explicando o procedimento.

Primeiro confirme que está no macOS local. Execute scripts/diagnose_mac.py, se existir, e depois o inventário. Descubra as pastas existentes sem exigir que eu preencha caminhos que você consegue identificar. Se faltar Python, use comandos nativos para fazer o diagnóstico e me informe a dependência ausente.

Priorize o espaço efetivamente ocupado por Docker, caches de aplicativos, dependências/builds, instaladores e vídeos. Se encontrar Docker.raw, compare tamanho lógico com blocos alocados; não o apague diretamente. Verifique que o contexto Docker aponta para este Mac antes de consultar containers, imagens, cache e volumes. Não inicie serviços nem consulte servidores remotos automaticamente.

Prepare uma tabela com os caminhos ou IDs exatos, espaço recuperável estimado, motivo e impacto. Quero executar a limpeza, não apenas receber um relatório. Antes da exclusão, apresente o lote concreto e peça somente a autorização que ainda faltar. Depois que eu aprovar, execute o lote até concluir e me mostre o espaço livre antes e depois. Não volte a pedir a mesma autorização.

Para projetos sem atividade há mais de 14 dias, documente a retomada, preserve alterações locais, branches, stashes e dados ignorados, envie o código ao meu destino Git privado autorizado e teste a recuperação antes de remover a cópia local. Prepare tudo que puder antes de perguntar por algum destino que estiver faltando.

Preserve bancos, volumes Docker, credenciais, fotos, documentos e trabalhos de clientes. Não trate vídeo antigo, PSD parecido, container parado ou arquivo chamado cache como prova suficiente de descarte. Apresente esses casos separadamente para decisão.

Se houver pouco espaço, não duplique projetos grandes no mesmo SSD. Priorize primeiro os itens regeneráveis aprovados. Ao finalizar, diferencie espaço realmente liberado, itens na Lixeira e pendências com seus motivos. Se não tiver terminal local, explique exatamente qual acesso falta e pare sem simular execução.
```

## Diagnóstico sem agente

No terminal integrado, estando dentro desta pasta, executar:

```bash
python3 scripts/diagnose_mac.py
```

Este comando não apaga nada. Ele mostra a capacidade, o espaço livre e o tamanho lógico/alocado dos arquivos Docker conhecidos. Enviar o resultado ao agente para continuar. Ausência de Docker nos caminhos padrão não comprova ausência de instalação; a localização pode ter sido alterada.

Se aparecer “python3: command not found”, enviar a mensagem ao agente. Se aparecer “No such file”, confirmar que o terminal está na pasta que contém `SKILL.md`. Não desabilitar proteções do macOS para abrir este material.
