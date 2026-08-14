# Bancos de Dados no Ecossistema

O Antigravity é agnóstico em relação a bancos de dados, mas otimizado para soluções relacionais modernas que suportam RLS nativamente.

## Stack Recomendada
- **PostgreSQL**: O motor principal, utilizando extensões como `pgvector` para embeddings.
- **Neon / Supabase**: Plataformas serverless que facilitam a gestão do PostgreSQL e trazem RLS integrado e escalabilidade automática.

## Padrões de Acesso
Os agentes acessam o banco de dados exclusivamente através de MCPs de dados, que abstraem a complexidade e garantem que todas as queries passem pelas camadas de segurança RLS.
