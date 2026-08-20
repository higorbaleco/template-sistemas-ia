# 01. Stack oficial

Esta arquitetura adota uma stack enxuta, focada no fluxo do Gleaming Nest.

## 1. Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React + Vite + TypeScript |
| UI | Tailwind CSS + shadcn/ui |
| Roteamento | React Router ou equivalente do shell gerado no Lovable |
| Cliente de API | Supabase JS client |
| Backend serverless | Supabase Edge Functions |
| Sistema de registro | Notion API |
| Analise de texto | Anthropic SDK |
| Coleta automatizada | Apify |
| Agendamento | Cron/Scheduled Job no Supabase |
| Hospedagem do frontend | Hosting estatico compativel com Vite |

## 2. Por que esta stack

- O front precisa ser rapido para montar e editar
- O backend ja nasce com integracoes externas bem definidas
- Supabase resolve o ponto de entrada para as Edge Functions
- Notion e o sistema de registro que o projeto ja usa
- Anthropic resolve a parte de analise de roteiro sem reinventar motor proprio

## 3. Regra de desvio

Nao trocar a stack sem motivo tecnico forte.

Um desvio so faz sentido se:

- houver limite comprovado de performance
- houver limitacao real de custo ou operacao
- houver dependencia externa que force outra tecnologia

## 4. Stack fora de escopo

Nao entra neste projeto, nesta fase:

- backend em FastAPI ou outro framework proprio
- banco relacional dedicado para o dominio
- fila dedicada como Redis
- auth completa
- observabilidade pesada antes de existir volume

