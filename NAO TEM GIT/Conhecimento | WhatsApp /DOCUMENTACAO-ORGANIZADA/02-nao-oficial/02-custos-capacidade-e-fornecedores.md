# Nao Oficial - Custos, capacidade e fornecedores

## Objetivo

Organizar as informacoes comerciais citadas nas notas para apoiar decisao, precificacao e comparacao. Estes dados devem ser revisados antes de qualquer proposta, pois podem mudar rapidamente.

## Estrutura interna citada

Pontos observados nas anotacoes:

- custo aproximado de chip: R$ 23,00;
- custo de mao de obra/preparacao citado: cerca de 10 dias;
- operacao interna com baixa escala;
- capacidade citada por chip: cerca de 100 a 200 disparos em cenarios conservadores;
- intervalos longos entre mensagens e blocos;
- margem apertada quando o preco fica abaixo de R$ 0,30 por disparo.

Leitura comercial:

> Operacao interna nao oficial parece fazer sentido apenas para baixo volume, testes controlados ou demandas pontuais. Para escala, o custo de gestao e risco operacional consome a margem.

## Fornecedores citados nas notas

| Fornecedor | Tipo citado | Capacidade/SLA citado | Custo citado | Observacao |
| --- | --- | --- | --- | --- |
| GrowSoft.io | Nao oficial | Ate 24h; 500 disparos a cada 5 min em horario comercial; menor volume fora do horario | R$ 0,25 | Perfil mais restritivo em segmento |
| Guilherme Sisbratel | Nao oficial | Escala rapida e muitos chips | R$ 0,25 | Citado como instavel e dificil de lidar |
| Vinicius Nascimento | Oficial e nao oficial | 15 a 20 mil disparos/dia | R$ 0,22 acima de 5.000 | Brasil e internacional |
| Matheus Joviniano | API oficial / estrutura | Venda de BM pronta | R$ 6.000 para BM 100K citada | Nao faz disparos |
| Deivid | Oficial robusta | Disponivel fora do horario e noturno | R$ 0,56 | Estrutura robusta e pronta para rodar |

## Leitura de margem

Para qualquer fornecedor, separar:

- custo real de envio;
- custo de operacao;
- comissao;
- risco de suporte;
- risco de reexecucao;
- custo de oportunidade se falhar;
- SLA prometido;
- SLA historicamente entregue.

## Modelo de precificacao sugerido

Evitar vender apenas "preco por disparo". Pacotes devem combinar:

- volume;
- rota oficial ou nao oficial;
- prazo;
- segmento;
- risco;
- relatorio;
- suporte;
- pos-resposta ou atendimento;
- nivel de contingencia.

## Perguntas antes de contratar fornecedor

- Qual rota sera usada?
- O fornecedor aceita o segmento?
- Qual e o SLA real?
- Como sera comprovado o envio?
- Como serao tratados cliques, respostas e falhas?
- Existe contingencia se a rota cair?
- Quem assume reenvio?
- Quem assume reclamacao do cliente?

## Conclusao

A diferenca entre "barato" e "rentavel" esta no risco operacional. O fornecedor mais barato pode ser o mais caro se gerar retrabalho, suporte, bloqueio, atraso ou perda de cliente.
