# Segurança e Row Level Security (RLS)

No Antigravity, a segurança não é um adendo, mas sim a fundação. Utilizamos Row Level Security (RLS) diretamente no banco de dados para garantir o máximo isolamento de dados.

## O Conceito de RLS
RLS permite definir políticas granulares de acesso a dados diretamente nas tabelas do banco de dados (ex: PostgreSQL). Isso significa que, independentemente de como a aplicação backend ou o agente acesse o banco, as regras de segurança são forçadas no nível da query.

## Benefícios
- **Isolamento Multi-tenant**: Dados de um cliente jamais vazam para outro.
- **Prevenção de Injeções**: Mesmo se um agente for induzido a fazer uma query maliciosa (Prompt Injection gerando SQL Injection), o RLS bloqueia o acesso indevido.
- **Auditoria Simplificada**: Todas as regras de acesso ficam centralizadas no banco.
