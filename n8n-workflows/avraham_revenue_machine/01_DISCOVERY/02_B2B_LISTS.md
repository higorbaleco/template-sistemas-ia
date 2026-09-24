# Listas B2B

## Objetivo

Importar e processar listas de empresas sem criar duplicidade.

## Campos possíveis

- CNPJ;
- razão social;
- nome fantasia;
- CNAE;
- cidade;
- UF;
- telefone;
- domínio;
- email;
- LinkedIn;
- Instagram;
- porte;
- número de funcionários;
- decisor.

## Fluxo

```text
Upload/API
↓
Mapear colunas
↓
Normalizar
↓
Deduplicar
↓
Criar ou enriquecer Account
```

Uma lista nunca deve sobrescrever silenciosamente informação melhor já existente.
