# Preços e arquitetura comercial

**Status:** regra comercial interna v1, sujeita a validação de margem, conversão e retenção.

## Regra principal

Toda proposta deve separar três componentes:

1. **Implantação:** paga diagnóstico, configuração, conhecimento, integrações, testes e entrada em produção.
2. **Gestão & Evolução:** paga acompanhamento, manutenção, suporte, monitoramento, melhoria e gestão da operação.
3. **Capacidade de Operação:** paga volume de interações, créditos, modelos, APIs e infraestrutura variável.

O MRR é calculado assim:

> **MRR = Gestão & Evolução + Capacidade de Operação**

O setup não financia suporte futuro. Evoluções extraordinárias, novos canais, novas integrações e novos módulos devem ser tratados como projetos adicionais.

## Faixas da Operação Autônoma

| Plano | Perfil | Setup | Gestão & Evolução | Complexidade típica |
| --- | --- | ---: | ---: | --- |
| **Base** | Negócios pequenos e operações simples | R$1.500–3.500 | R$397–497/mês | 1 canal, regras simples e pouca integração |
| **Comercial** | Empresas com operação comercial estruturada | R$4.000–6.000 | R$597–797/mês | Qualificação, vendas, follow-up e webhook simples |
| **Integrada** | Empresas conectadas à infraestrutura digital | R$7.000–10.000 | R$997–1.297/mês | CRM, API Oficial, consultas, webhooks e escrita de dados |
| **Avançada** | Operações personalizadas e críticas | R$10.000–15.000 | R$1.497–1.997/mês | ERP, múltiplas integrações, unidades e departamentos |
| **Enterprise** | Operações de alta escala ou criticidade | R$15.000–20.000+ | R$2.500–5.000+/mês | Multicanal, SLA, governança, grande volume e roadmap dedicado |

O plano não é definido apenas pelo faturamento. A classificação considera **complexidade + integração + volume + criticidade**. Faturamento é apenas um sinal de capacidade de pagamento.

## Capacidade de Operação

O pacote inicial do GPT Maker tem 2.500 créditos. Para o cliente, apresentamos isso como interações mensais, sem transformar créditos em protagonista da proposta.

| Capacidade | Preço ao cliente | Custo Partner conhecido | Margem bruta da capacidade |
| ---: | ---: | ---: | ---: |
| Até 2.500 interações | R$147/mês | R$87/mês | R$60/mês |
| Até 5.000 interações | R$322/mês | R$162/mês | R$160/mês |
| Até 10.000 interações | R$672/mês | R$312/mês | R$360/mês |
| Até 25.000 interações | R$1.722/mês | R$762/mês | R$960/mês |
| Até 50.000 interações | R$3.472/mês | R$1.512/mês | R$1.960/mês |
| Acima de 50.000 | Personalizado | R$0,03 por interação adicional | Calcular individualmente |

**Premissas atuais:** custo Partner de R$87 por 2.500 créditos, preço de referência ao cliente de R$147 por 2.500 créditos, custo adicional de R$0,03 e repasse adicional de R$0,07 por interação.

Fórmula interna para faixas não tabeladas:

> **Capacidade do cliente = R$147 + (interações acima de 2.500 × R$0,07)**

Para uma melhor experiência comercial, recomendamos vender faixas. Excedentes pontuais podem ser cobrados; dois meses consecutivos acima da faixa podem gerar upgrade automático para a faixa seguinte.

## Como apresentar na proposta

```text
Implantação: R$ [valor único]
Gestão & Evolução: R$ [valor]/mês
Capacidade de Operação: até [faixa] interações por R$ [valor]/mês
Interações adicionais: R$0,07 por interação acima da capacidade contratada
Projetos adicionais: sob escopo e aprovação
```

## Exemplos de referência

### Pousada pequena

- Setup: R$1.500
- Gestão & Evolução: R$397/mês
- Capacidade até 2.500: R$147/mês
- MRR: **R$544/mês**

### Restaurante ou pizzaria

- Setup: R$3.500
- Gestão & Evolução: R$497/mês
- Capacidade até 5.000: R$322/mês
- MRR: **R$819/mês**
- Valor no primeiro ano: **R$13.328**

### Cliente Comercial

- Setup: R$4.500
- Gestão & Evolução: R$797/mês
- Capacidade até 10.000: R$672/mês
- MRR: **R$1.469/mês**
- Valor no primeiro ano: **R$22.128**

### Cliente Integrado

- Setup: R$8.000
- Gestão & Evolução: R$1.297/mês
- Capacidade até 25.000: R$1.722/mês
- MRR: **R$3.019/mês**
- Valor no primeiro ano: **R$44.228**

## Critério de negociação

O comercial pode negociar dentro das faixas, mas não deve inventar uma nova composição sem registrar a justificativa. Toda exceção precisa mostrar plano, complexidade, volume, margem e aprovação responsável.
