# 13. Deploy e ambientes

## 1. Ambientes

| Ambiente | Propósito |
|---|---|
| Local | desenvolvimento do frontend e teste das Edge Functions |
| Preview | validacao de alteracoes antes de publicar |
| Producao | uso real do operador |

## 2. Frontend

O frontend e um app Vite, entao o deploy deve apontar para hospedagem estatico compativel com build frontend.

## 3. Supabase

No Supabase ficam:

- Edge Functions
- secrets
- agendamento do `daily-ingest`

## 4. Secrets

Variaveis esperadas:

- `NOTION_TOKEN`
- `ANTHROPIC_API_KEY`
- `APIFY_TOKEN`
- `INSTAGRAM_SESSION_COOKIE`

## 5. Ordem de deploy

1. atualizar codigo
2. validar localmente
3. publicar Edge Functions
4. publicar frontend
5. validar o fluxo de leitura e escrita no Notion

## 6. Rotina operacional

- `notion-proxy` deve estar disponivel antes das telas que leem ou escrevem no Notion
- `iada-analyze` precisa da chave da Anthropic
- `daily-ingest` depende dos secrets de coleta
- o cron so deve rodar depois que as integracoes estiverem validadas

