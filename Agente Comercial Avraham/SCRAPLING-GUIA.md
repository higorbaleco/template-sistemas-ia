# Scrapling — Guia de Enriquecimento Automático

**Como usar web scraping para enriquecer dados de empresas** (telefone, Instagram, CNPJ, horários, etc)

---

## O que é Scrapling?

Tool de web scraping automático disponível como skill em Claude Code. Permite raspar dados públicos de:
- Google Maps (telefone, horários, avaliações, endereço)
- Diretórios públicos (Telelistas, Guia Fácil, Apontador, iFood)
- Instagram (follower count, atividade)
- Sites de empresas (contato, endereço)
- Bases de CNPJ (Brasil)

---

## Quando Usar Scrapling

### ✅ Use quando:
- Precisa enriquecer 10+ empresas de uma vez
- Quer múltiplos dados (telefone + Instagram + CNPJ + horários)
- Quer verificar várias cidades em paralelo
- Tem lista de nomes e precisa validar dados

### ❌ Evite quando:
- É só 1–2 empresas (busca manual é mais rápido)
- Dados são muito específicos/variáveis
- Site bloqueia scraping (respeitar robots.txt)

---

## Exemplo de Uso

### Entrada
```
Segmento: Pizzarias
Cidade: Maringá, PR
Quantidade: 10
Dados desejados: nome, endereço, telefone, WhatsApp, Instagram, horários, Google Maps link
```

### Processo
```
1. Scrapling busca: "pizzaria Maringá delivery"
2. Coleta de Google Maps: lista de resultados
3. Para cada resultado:
   - Extrai: nome, endereço, telefone, horários, link, avaliações
   - Busca WhatsApp em Google Meu Negócio
   - Busca Instagram em perfil (se público)
   - Valida dados
4. Compila em JSON estruturado
5. Marca "verificado" com data
```

### Saída
```json
[
  {
    "nome_comercial": "Don Boturi Pizzaria",
    "endereco": "Avenida Mandacaru, 3000, Maringá, PR",
    "telefone": "44 3222-5555",
    "whatsapp": "44 99999-1234",
    "instagram": "@donboturipizzaria",
    "google_maps": "https://maps.google.com/...",
    "horarios": {
      "segunda": "18:00-24:00",
      ...
    },
    "avaliacoes": "4.7 ⭐ (320 avaliações)",
    "fonte_scrapling": "Google Maps",
    "data_coleta": "2026-10-19"
  },
  ...
]
```

---

## Processo: Etapas

### Etapa 1: Preparar Input
```
Defina:
- Segmento (pizzaria, lanchonete, restaurante)
- Local (cidade, estado, país)
- Quantidade (10, 20, 50 empresas)
- Dados desejados (telefone, Instagram, CNPJ, horários)
- Plataforma principal (Google Maps, iFood, Yelp, etc)
```

### Etapa 2: Executar Scrapling
```
Comando sugerido:
"Use Scrapling para enriquecer dados: [SEGMENTO], [LOCAL], [QTD]"

Exemplo:
"Use Scrapling: pizzarias Maringá PR Brasil, 10 empresas, dados: telefone WhatsApp Instagram horários"
```

### Etapa 3: Validação Manual
```
Verificar:
- Dados extratos aparecem corretos?
- Telefones têm formatação consistente?
- Instagram confirmado (não é nome similar)?
- Horários fazem sentido para segmento?
- Google Maps link é válido?
```

### Etapa 4: Compilar em JSON
```
Estruturar conforme ESTRUTURA-DADOS.md
Marcar cada campo com:
- data_verificacao
- fonte (Google Maps, Instagram, etc)
- verificado (true/false)
```

---

## Exemplo Prático: Pizzarias Maringá

**Você quer**: 10 pizzarias de Maringá com telefone + WhatsApp + Instagram + CNPJ

**Comando**:
```
"Use Scrapling: pizzarias Maringá PR Brasil
Dados: telefone, WhatsApp, Instagram, CNPJ, horários, Google Maps
Quantidade: 10
Priorizar: delivery ativo, contato público"
```

**O que Scrapling faz**:
1. Busca "pizzaria delivery Maringá" no Google Maps
2. Extrai 10 primeiros resultados com endereço/telefone
3. Acessa cada um no Google Meu Negócio → coleta WhatsApp + horários
4. Busca Instagram (@[nome_pizzaria]) → segue conta se encontrar
5. Busca CNPJ em site público → valida razão social
6. Compila em JSON estruturado

**Tempo estimado**: 5–10 minutos para 10 empresas

**Resultado**:
```json
{
  "data_coleta": "2026-10-19",
  "total_coletadas": 10,
  "empresas": [
    {
      "id": 1,
      "nome_comercial": "Don Boturi Pizzaria",
      "cnpj": "12.345.678/0001-90",
      "endereco": "Avenida Mandacaru, 3000",
      "telefone": "44 3222-5555",
      "whatsapp": "44 99999-1234",
      "instagram": "@donboturipizzaria",
      "google_maps_url": "https://maps.google.com/...",
      "horarios": { ... },
      "avaliacoes": "4.7 ⭐ (320)",
      "fonte_coleta": "Google Maps + Google Meu Negócio + Instagram",
      "data_verificacao": "2026-10-19",
      "verificado": true
    },
    ...
  ]
}
```

---

## Limitações e Boas Práticas

### Limitações
- Nem todo site permite scraping (respeitar robots.txt)
- Dados públicos só (Instagram privado não funciona)
- Qualidade depende de quanto a empresa preencheu no Google Meu Negócio
- Telefone pode ser antigo (dados de 2024 vs 2026)

### Boas Práticas
1. **Sempre validar dados manualmente** após scraping
2. **Marcar data de coleta** para rastreabilidade
3. **Verificar fonte** de cada dado (Google Maps vs Instagram vs CNPJ)
4. **Não confiar 100%** em um único campo
5. **Respeitar limites** das plataformas (não fazer spam)
6. **Verificar telefone** chamando antes de usar em produção

---

## Multi-País: Adaptações

### Brasil
```
Scrapling recomendado para:
- Google Maps (completo)
- Google Meu Negócio (completo)
- CNPJ em CNPJMe (completo)
- Instagram (completo)
- iFood (se delivery)

Limitações:
- Alguns dados estão desatualizados (2024 vs 2026)
- CNPJ pode ter múltiplas unidades
```

### USA
```
Scrapling recomendado para:
- Google Maps (completo)
- Yelp (completo)
- Yellow Pages (completo)
- Instagram (completo)

Limitações:
- EIN mais difícil de achar publicamente
```

### Portugal / Europa
```
Scrapling recomendado para:
- Google Maps (completo)
- Diretórios locais (variável)
- Instagram (completo)
- LinkedIn (para B2B)

Limitações:
- GDPR: cuidado com dados pessoais
- Registros podem estar em portais privados
```

---

## Fluxo Recomendado: Pesquisa → Enriquecimento

### Opção A: Manual (3–5 min/empresa)
```
1. Google Maps busca
2. Extrai manualmente: telefone, horários, endereço
3. Compila em JSON
```

**Melhor para**: 1–5 empresas

### Opção B: Semi-automático com Scrapling (5–10 min/10 empresas)
```
1. Define escopo (segmento, local, dados)
2. Executa Scrapling
3. Valida resultados manualmente
4. Compila em JSON
```

**Melhor para**: 10–100 empresas

### Opção C: Totalmente automático (10–30 min/100+ empresas)
```
1. Define escopo amplo
2. Executa Scrapling com múltiplas cidades
3. Valida amostra (10% dos resultados)
4. Compila todos em JSON
5. Aguarda feedback para refinamento
```

**Melhor para**: 100+ empresas, múltiplas cidades/países

---

## Exemplo de Comando para Higor

Quando Higor quiser ativar nova campanha com dados completos:

```
"Ative a campanha: restaurantes, São Paulo, Brasil
Use Scrapling para coletar:
- 20 restaurantes com delivery
- Dados: nome, endereço, CNPJ, telefone, WhatsApp, Instagram, Google Maps, horários
- Crie 3 fichas completas pronto para ligação
- Indique próxima ação"
```

Agente então:
1. Executa Scrapling
2. Enriquece dados coletados
3. Cria prospects em JSON
4. Gera 3 fichas
5. Indica quem ligar primeiro

---

## Troubleshooting

### "Scrapling não encontrou telefone"
- Checklist:
  - Empresa está aberta? (site pode estar offline)
  - Google Meu Negócio completamente preenchido?
  - Telefone pode estar no site da empresa?
  - Tentar busca manual em Google Maps

### "Instagram não encontrado"
- Possíveis razões:
  - Empresa não tem Instagram
  - Handle é diferente do nome (ex: "@pzz.donboturi" vs "@donboturi")
  - Conta é privada (Scrapling não funciona)
- Solução: busca manual ou marcar como "não encontrado"

### "CNPJ não validou"
- Possíveis razões:
  - CNPJ está incorreto
  - Empresa é MEI (não tem CNPJ)
  - Razão social é muito diferente
- Solução: Ignorar se não é essencial; validar na ligação

### "Horários parecem errados"
- Possíveis razões:
  - Google Meu Negócio desatualizado
  - Horários sazonais não refletidos
- Solução: Chamar e confirmar durante ligação

---

## Próximas Integrações

**Futuro**: Automação completa
```
Higor diz: "Ative segmento X, local Y"
         ↓
Agente executa Scrapling automáticamente
         ↓
Compila dados em JSON
         ↓
Gera fichas
         ↓
Enfileira para ligação
```

---

**Versão**: 1.0 | **Data**: 19/10/2026  
**Status**: Documentado, pronto para uso via Scrapling skill
