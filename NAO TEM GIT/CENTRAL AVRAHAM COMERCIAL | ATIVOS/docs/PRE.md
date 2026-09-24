# Product/Technical Rationale (PRE)

## 1. Justificativa Técnica
A decisão de manter o projeto como uma Single Page Application (SPA) vanilla (sem frameworks pesados) deve-se ao fato de ser uma biblioteca pessoal/rápida, cuja complexidade não demanda bibliotecas reativas como React, Vue ou Angular. O uso do JavaScript puro é suficiente para manter o tamanho do bundle mínimo, com máxima performance e independência de dependências complexas (zero bundle-phobia).

## 2. Alternativas Avaliadas
- **Utilizar um framework reativo (React/Next.js):** Ofereceria melhor gerenciamento de estado e ecossistema, mas introduziria complexidade desnecessária de build step, gerenciamento de pacotes (npm/yarn) e tamanho do projeto final para uma biblioteca focada em funcionar localmente ou via `file://`.
- **Backend com Banco de Dados:** Melhor persistência de dados e multi-dispositivo, mas exigiria infraestrutura contínua (ex: Vercel/Render + PostgreSQL). Adicionar um backend mataria a portabilidade offline. 

## 3. Trade-offs Assumidos
- **Persistência Local (LocalStorage):** Limita o uso ao dispositivo local (o usuário perde dados se limpar o cache do navegador), mas facilita o funcionamento estático. A funcionalidade de Importar/Exportar mitiga parcialmente esse problema, permitindo o backup manual.
- **Vanilla JS em vez de Typescript:** Para um projeto simples, manter o código legível em JS documentado (JSDoc) é suficiente. Menos ferramentas de transpilação.
