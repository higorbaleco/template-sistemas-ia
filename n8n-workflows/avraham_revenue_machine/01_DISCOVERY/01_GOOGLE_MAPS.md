# Google Maps Discovery

## Objetivo

Gerar contas B2B de empresas locais e regionais.

## Busca

Combinação:

```text
{segmento} + {cidade}
```

Exemplos:

```text
clínica estética Maringá
imobiliária Londrina
concessionária Curitiba
energia solar Paraná
```

## Dados desejados

- nome;
- categoria;
- telefone;
- site;
- endereço;
- cidade;
- avaliação;
- quantidade de avaliações;
- horário;
- URL Google Maps.

## Heurísticas iniciais

Quantidade de avaliações pode ser usada futuramente como proxy de demanda, mas não deve reprovar automaticamente uma conta na V1.

## Output

`account_discovered`

Fonte:
`GOOGLE_MAPS`
