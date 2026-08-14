# Critérios de Aceite - Landing Page Antigravity

Este documento lista os critérios necessários para considerar o projeto da Landing Page concluído com sucesso.

## 1. Interface e Experiência do Usuário (UI/UX)
- [ ] O visual utiliza o tema escuro moderno com cores hexadecimais documentadas no arquivo `design-tokens.json`.
- [ ] O contraste mínimo entre texto e fundo atende à especificação WCAG AA (proporção mínima de 4.5:1).
- [ ] Não há emojis inseridos na interface ou documentação técnica, sendo usados apenas ícones vetoriais em formato SVG.
- [ ] Todas as seções principais (Hero, Mindmap, Painel de Detalhes, Segurança e Rodapé) carregam corretamente e são responsivas em dispositivos móveis, tablets e computadores.

## 2. Funcionalidade do Mindmap Interativo
- [ ] O Mindmap renderiza todos os pilares essenciais: Agentes, Códigos, Rules, MCPs, Stacks, Bancos de Dados, RLS e Cybersecurity.
- [ ] Ao clicar em um nó do mindmap, o painel de detalhes é atualizado instantaneamente com o conteúdo correspondente.
- [ ] A interação com os nós do mindmap é acessível por teclado (utilizando a tecla Tab para navegar e as teclas Enter ou Espaço para selecionar).
- [ ] Leitores de tela anunciam as mudanças de conteúdo no painel dinâmico por meio de marcações ARIA (`aria-live="polite"`).

## 3. Qualidade do Código e Testes
- [ ] A lógica de negócio está desacoplada em módulos JS (`src/js/mindmap.js` e `src/js/main.js`).
- [ ] Os testes unitários estão localizados na pasta `tests/` e cobrem pelo menos 80% das linhas de lógica de dados e navegação do mindmap.
- [ ] O código segue os padrões do SOLID e não contém variáveis globais desnecessárias ou acoplamentos de componentes.
- [ ] Não existem senhas, segredos ou chaves de API expostas no código.

## 4. Conformidade de Escrita
- [ ] Não há ocorrências do caractere de travessão longo no meio de frases nas documentações, comentários ou código da aplicação.
- [ ] Todos os textos e documentações estão escritos exclusivamente em Português do Brasil (pt-BR).
