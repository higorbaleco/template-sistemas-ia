# ICP por sinais públicos

## Problema

O ICP deste projeto não pode depender apenas de CNAE, porte e número de funcionários. O que importa é inferir, com evidência, se a empresa:

- tem capacidade econômica mínima;
- depende do WhatsApp;
- recebe volume relevante de contatos;
- possui um processo de atendimento que pode ser melhorado;
- se parece com cases já vencidos.

## Regra central

Nenhum sinal isolado define o ICP. O sistema trabalha com evidências acumuladas e nível de confiança.

## Categorias de sinais

### Capacidade econômica

- múltiplas unidades;
- preços/ticket visíveis;
- volume de reviews;
- vagas abertas;
- equipe pública;
- presença de mídia paga;
- atividade digital;
- catálogo amplo;
- localização e estrutura física;
- porte cadastral quando existir.

### Dependência do WhatsApp

- `wa.me`;
- botão no site;
- CTA na bio;
- link de anúncio para WhatsApp;
- ausência de checkout;
- vendas consultivas;
- catálogo no WhatsApp;
- telefone/WhatsApp destacado em Google Business.

### Volume operacional

- reviews recentes;
- comentários/perguntas;
- quantidade de unidades;
- fluxo de conteúdo;
- volume aparente de produtos/serviços;
- horários extensos;
- múltiplos atendentes públicos.

### Maturidade de atendimento

Antes de interação, apenas sinais públicos. Depois de interação permitida, medir:

- velocidade;
- automação;
- qualificação;
- follow-up;
- condução;
- agendamento.

## Campo de evidência

Todo score deve armazenar:

```json
{
  "dimension": "whatsapp_dependency",
  "score": 90,
  "confidence": 0.93,
  "evidence": [
    {"source": "website", "fact": "botão de WhatsApp em todas as páginas"},
    {"source": "instagram", "fact": "CTA na bio direciona para wa.me"}
  ],
  "rule_version": "icp-v1"
}
```

## Princípio de calibração

Começar com pesos manuais. Após amostra suficiente, comparar cada sinal contra:

- resposta;
- reunião;
- proposta;
- venda;
- receita.

Sinais que não predizem resultado devem perder peso.
