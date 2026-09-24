# Execução no computador

A skill é uma pasta de instruções e scripts para um agente com terminal local. Criá-la no ChatGPT não instala um daemon nem concede acesso ao Mac. Não agendar limpeza ou abrir acesso remoto em consequência da criação.

1. Obter a pasta completa pela interface disponível de exportação/download de skills. Se não houver exportação, preparar pacote apenas quando solicitado. Não inventar URL de download.
2. Colocar a pasta `limpar-mac` no diretório de skills suportado pelo agente local. Para Codex, verificar a instalação/instruções locais antes de indicar o caminho. Não pressupor sincronização automática com o ChatGPT. Em outro agente, carregar `SKILL.md` preservando acesso às referências relativas.
3. Preservar `SKILL.md`, `agents/openai.yaml`, `scripts/` e `references/`. Verificar `python3 --version` e `git --version`. Scripts usam somente a biblioteca padrão do Python, sem servidor, MCP ou token embutido.
4. Criar diretório privado para relatórios fora dos alvos, acessível apenas ao usuário. Configurar raízes e destino Git na sessão local, utilizando autenticação existente; não escrever tokens nos relatórios.

Pedido inicial: “Use $limpar-mac para analisar meu Mac. Considere projetos sem atividade há mais de 14 dias como candidatos a arquivamento. Identifique caches dispensáveis e vídeos antigos. Prepare o inventário e os backups antes da limpeza e mostre o plano com os caminhos exatos.”

Registrar no manifesto: pastas de projetos/vídeos, exclusões, limiar de vídeos (inicialmente 90 dias), destino de backup e ação autorizada: inventariar, arquivar, Lixeira ou exclusão definitiva de itens determinados. Autorização concreta continua válida na sessão; não inventar autorização permanente para futuras execuções.
