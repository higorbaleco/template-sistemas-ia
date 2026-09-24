# Product Router

## Objetivo

Escolher qual linha comercial deve assumir a Account.

## Produtos V1

```text
AI_BASIC
AI_ENTERPRISE
WHATSAPP_INFRA
DISPAROS
ATIVOS
PARTNERS
SUPPLIERS
```

## Input

Account aprovada pelo ICP.

## Processo

Utilizar:
- segmento;
- comportamento;
- porte;
- canal;
- descrição;
- sinais;
- decisor;
- contexto disponível.

## Output

```json
{
  "primary_product": "AI_BASIC",
  "secondary_products": ["WHATSAPP_INFRA"],
  "reason": "alto fluxo aparente de atendimento"
}
```

## Regra

Uma Account possui um produto primário por campanha.

Produtos secundários ficam registrados para futuras campanhas e cross-sell.

## Não fazer

O Product Router não envia mensagens.
