# Technical Rationale (PRE) - Landing Page Antigravity

Este documento apresenta a justificativa técnica para as decisões de arquitetura e design da landing page do Antigravity.

## 1. Escolha da Arquitetura
Optou-se por construir a aplicação como uma **Single Page Application (SPA) estática**, utilizando HTML5 semântico, CSS Vanilla estruturado e JavaScript moderno (ES6+) sem empacotadores ou frameworks robustos (como React ou Next.js).

### Alternativas Avaliadas:
1. **Next.js ou React (SPA com Vite)**: Traria uma estrutura robusta de componentes, mas aumentaria desnecessariamente o tamanho final do pacote e a complexidade de implantação para uma landing page puramente informativa e interativa.
2. **HTML5, CSS Vanilla e JS Vanilla**: Fornece controle total sobre o desempenho, tempo de carregamento instantâneo, facilidade de hospedagem gratuita e conformidade estrita com acessibilidade e contraste.

**Decisão**: HTML5, CSS Vanilla e JS Vanilla devido ao desempenho superior, menor custo operacional e menor complexidade, atendendo perfeitamente ao requisito de "landing page simples e performática".

## 2. Decisão de Design e Visualizações
Para o mindmap e os gráficos interativos, foram avaliadas duas abordagens principais:
1. **Mermaid.js**: Excelente para rendering rápido a partir de texto, porém limitado em termos de estilização fina e animações CSS personalizadas para o tema premium do projeto.
2. **SVG Interativo Nativo**: Permite o uso de CSS para aplicar gradientes complexos, efeitos de hover avançados e micro-animações nas conexões entre os componentes. Também é totalmente compatível com leitores de tela quando anotado corretamente com atributos ARIA.

**Decisão**: Combinar uma interface estritamente estilizada em SVG interativo para o mindmap principal e usar CSS moderno para gerenciar estados ativos. Isso garante um visual premium que impressiona no primeiro olhar.

## 3. Segurança e Infraestrutura de Dados
No conteúdo da landing page, as seguintes soluções foram selecionadas para recomendação técnica devido à segurança e gratuidade:
- **Supabase**: Banco de dados relacional baseado em PostgreSQL com suporte nativo e simplificado a Row Level Security (RLS), facilitando a segurança de dados diretamente na borda.
- **Neon Postgres**: Banco de dados relacional serverless com excelente plano gratuito e suporte robusto a RLS e conexões seguras por SSL/TLS.

## 4. Trade-offs de Desempenho e Acessibilidade
- **Contraste de Cores**: Para alcançar o contraste mínimo de 4.5:1 exigido pela WCAG AA em um design com tema escuro (glassmorphism e gradientes), as fontes principais usam tons de cinza muito claro (#EEEEEE) e branco puro (#FFFFFF) sobre fundos escuros (#111118).
- **Sem Emojis**: O design utiliza exclusivamente ícones vetoriais SVG de tamanho consistente para evitar ruído visual e garantir uma navegação mais profissional.
