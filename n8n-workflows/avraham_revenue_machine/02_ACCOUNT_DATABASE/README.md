# Account Database

## Objetivo

Ser a fonte única de verdade da máquina.

## Entidades mínimas

### Account
Empresa.

### Contact
Pessoa/decisor.

### Channel Identity
WhatsApp, Instagram, LinkedIn etc.

### Campaign
Campanha comercial.

### Interaction
Mensagem ou interação.

### Opportunity
Oportunidade comercial.

### Meeting
Reunião.

### Revenue
Venda/receita.

## Campos essenciais de Account

```text
account_id
company_name
legal_name
segment
city
state
country
website
google_maps_url
source
status
icp_status
primary_product
secondary_products
owner
created_at
updated_at
do_not_contact
```

## Chaves de deduplicação

Possíveis:
- CNPJ;
- domínio;
- telefone normalizado;
- Google Maps place id;
- combinação nome + cidade.

Nunca depender de uma única chave quando ela não existir.
