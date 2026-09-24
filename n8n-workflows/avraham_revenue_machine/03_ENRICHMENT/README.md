# Enrichment Engine

## Objetivo

Completar os dados necessários para qualificação e abordagem omnichannel.

## Input

Account descoberta.

## Dados buscados

- site;
- WhatsApp;
- Instagram;
- LinkedIn;
- decisores;
- porte;
- descrição do negócio;
- presença digital;
- sinais de demanda;
- tecnologias quando disponíveis.

## Processo

```text
Account
↓
Verificar campos ausentes
↓
Buscar fontes permitidas
↓
Validar
↓
Atualizar somente dados confiáveis
↓
Registrar origem por campo
↓
Enviar para ICP
```

## Output

Account enriquecida com `ENRICHED`.

## Regra

Nunca inventar dado ausente.
Campo desconhecido permanece desconhecido.
