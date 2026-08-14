# Model Context Protocol (MCP) e Integrações

O MCP é a espinha dorsal de conectividade no ecossistema Antigravity, permitindo que os agentes acessem sistemas de arquivos, APIs externas e bancos de dados de maneira padronizada e segura.

## O que é o MCP?
O Model Context Protocol estabelece um contrato universal entre o agente (cliente) e os recursos (servidores). Isso elimina a necessidade de construir integrações customizadas ad-hoc para cada nova ferramenta.

## Vantagens no Antigravity
- **Modularidade**: Ferramentas podem ser conectadas e desconectadas sem alterar o código core do agente.
- **Segurança**: O agente só acessa o que o servidor MCP expõe, garantindo isolamento.
- **Descoberta Automática**: Agentes conseguem inspecionar as capacidades de um MCP em tempo de execução.
