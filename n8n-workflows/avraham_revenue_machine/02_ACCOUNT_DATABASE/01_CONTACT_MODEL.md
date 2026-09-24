# Contact Model

Uma Account pode possuir vários contatos.

## Campos

```text
contact_id
account_id
name
role
seniority
email
phone
linkedin_url
instagram_handle
is_decision_maker
is_primary
status
```

## Regra

Contato e empresa são entidades diferentes.

Uma empresa pode:
- responder pelo WhatsApp institucional;
- ter sócio no LinkedIn;
- ter Instagram comercial;
- possuir gerente de atendimento.

O histórico precisa convergir para a Account.
