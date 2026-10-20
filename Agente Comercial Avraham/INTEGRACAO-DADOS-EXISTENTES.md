# Integração: Dados Existentes (Se Higor Tiver Lista)

**Se Higor já tem lista de contatos, como validar e integrar**

---

## Cenário: Higor tem lista de pizzarias

### Entrada (O que ele traz)

Higor pode trazer:
- ✅ CSV com nomes + endereços
- ✅ Excel com telefones
- ✅ Lista de contatos de CRM antigo
- ✅ Planilha de fornecedores
- ✅ Links de Google Maps salvos

### O Que Fazer

#### Passo 1: Validar Dados Existentes

```
Para cada linha da lista:
[ ] Nome/empresa existe? (não está em branco)
[ ] Endereço é válido? (tem rua, número, cidade)
[ ] Telefone tem formato correto? (11 dígitos Brasil)
[ ] Data da lista é recente? (menos de 3 meses)
[ ] Está ativa? (empresa não fechou)

Resultado:
  ✅ VÁLIDA: usar
  ⚠️ INCOMPLETA: enriquecer (buscar dados)
  ❌ DESATUALIZADA: descartar ou refazer
```

#### Passo 2: Enriquecer com Dados Faltantes

Se lista tiver:
- ✅ Nome + Endereço: Buscar telefone no Google Maps
- ✅ Nome + Telefone: Buscar endereço
- ✅ Nome apenas: Buscar tudo (Google Maps, Instagram)

Usar PROTOCOLO-VALIDACAO-DADOS.md

#### Passo 3: Compilar em Novo JSON

```json
{
  "origem": "lista_higor_2026-10",
  "data_compilacao": "2026-10-19",
  "total_empresas": 15,
  "empresas": [
    {
      "nome_original": "Pizzaria XYZ",
      "validacao": "enriquecida",
      "dados_originais": {
        "nome": "Pizzaria XYZ",
        "endereco": "Rua A, 123",
        "telefone": "44 3222-5555"
      },
      "dados_enriquecidos": {
        "google_maps": "https://maps.google.com/...",
        "whatsapp": "44 99999-1234",
        "instagram": "@pizzariaxyz",
        "horarios": "seg-dom 18h-24h"
      },
      "verificado": true,
      "data_validacao": "2026-10-19"
    }
  ]
}
```

#### Passo 4: Remover Duplicatas

Higor pode ter:
- Mesma empresa 2x (nome ligeiramente diferente)
- Filiais listadas como empresas separadas
- Empresas fechadas ou mergeadas

```
Script de deduplicação:

1. Agrupar por endereço (rua + número)
2. Agrupar por telefone
3. Agrupar por CNPJ (se tiver)
4. Se 2+ nomes = mesmo endereço/telefone → duplicata
5. Manter 1 oficial, descartar resto
```

---

## Exemplo: Integração de Lista

### Entrada (CSV de Higor)

```csv
Nome,Endereço,Telefone
Pizzaria Boa,Rua A 123,44-3222-1111
Pizzeria Bom,Avenida B 456,44-99999-2222
Casa de Pizza,Rua C 789,
Pizza Fast,Rua A 123,
```

### Problemas Identificados

```
1. Casa de Pizza: sem telefone (incompleta)
2. Pizza Fast: mesmo endereço que Pizzaria Boa (DUPLICATA)
3. Nomes são variações (Pizzaria vs Pizzeria) → possível duplicata
```

### Processo de Enriquecimento

```
1. Pizzaria Boa + Rua A 123
   → Buscar no Google Maps
   → Encontrar: Tel fixo, WhatsApp, horários, Instagram
   → Status: ENRIQUECIDA ✅

2. Pizzeria Bom + Avenida B 456
   → Buscar no Google Maps
   → Status: ENRIQUECIDA ✅

3. Casa de Pizza
   → Sem telefone, precisa pesquisa manual
   → Usar Scrapling ou Google Maps busca manual
   → Status: ENRIQUECIDA (ou descartada se não acha)

4. Pizza Fast + Rua A 123
   → Mesmo endereço que Pizzaria Boa
   → Ligação de teste: "Aqui é Pizza Fast ou Pizzaria Boa?"
   → Resultado: SÃO A MESMA (filial ou mudança nome)
   → Manter: Pizzaria Boa oficial, descartar Pizza Fast
```

### Saída (Compilada)

```json
{
  "origem": "lista_higor_original + enriquecimento",
  "total_original": 4,
  "total_final": 3,
  "duplicatas_removidas": 1,
  "dados": [
    {
      "id": 1,
      "nome": "Pizzaria Boa",
      "endereco": "Rua A, 123",
      "telefone": "44 3222-1111",
      "whatsapp": "44 99999-2222",
      "instagram": "@pizzariaboa",
      "google_maps": "https://...",
      "verificado": true,
      "origem": "lista_higor"
    },
    {
      "id": 2,
      "nome": "Pizzeria Bom",
      "endereco": "Avenida B, 456",
      "telefone": "44 99999-2222",
      "google_maps": "https://...",
      "verificado": true,
      "origem": "lista_higor"
    },
    {
      "id": 3,
      "nome": "Casa de Pizza",
      "endereco": "Rua C, 789",
      "telefone": "44 3333-4444",
      "verificado": true,
      "origem": "lista_higor + enriquecimento"
    }
  ]
}
```

---

## Checklist: Integração

- [ ] Lista recebida de Higor
- [ ] Formato validado (CSV, Excel, Google Sheets?)
- [ ] Total de linhas contado
- [ ] Duplicatas identificadas
- [ ] Dados faltantes anotados
- [ ] Enriquecimento executado (Scrapling ou manual)
- [ ] JSON compilado
- [ ] Verificação spot-check (conferir 5-10% dos dados)
- [ ] Pronto para usar

---

## Comando para Higor

```
"Tenho uma lista de [QTD] pizzarias que levantei. 
Posso passar pra vocês validarem e enriquecerem?"
```

**Resposta do agente**:
```
Sim! Pode mandar.
Vou:
1. Validar cada uma (Google Maps, telefone)
2. Enriquecer o que estiver faltando (Instagram, WhatsApp)
3. Remover duplicatas
4. Compilar em JSON pronto para usar
5. Entregar em 1-2 horas

Formato: CSV, Excel, Google Sheets ou lista com nomes?
```

---

## Integração com Outro CRM

Se Higor usar CRM externo (Pipedrive, Hubspot, Salesforce):

```
1. Exportar leads em CSV
2. Usar este protocolo para validar
3. Re-importar com dados enriquecidos
4. Marcar origem: "agente_comercial_avraham"
```

---

## Quando NÃO Integrar (Descartar)

❌ **Descartar lista se**:
- Mais de 50% dos dados estão vazios/inválidos
- Empresas não existem mais (pesquisa pública mostra)
- Lista é de >6 meses e não foi atualizada
- Nomes são genéricos demais (impossível validar)

✅ **Integrar mesmo se**:
- Faltam alguns dados (enriquecemos)
- Tem duplicatas (removemos)
- Formato é bagunçado (normalizamos)

---

**Versão**: 1.0 | **Data**: 19/10/2026 | **Uso**: Se Higor trazer lista própria
