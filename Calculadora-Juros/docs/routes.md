# Rotas

## Objetivo da navegação

A navegação deve ser curta, previsível e pensada para polegar no mobile.

## Rotas principais

### `/`

Entrada da aplicação.

* mostra visão geral
* exibe atalhos para os simuladores principais
* destaca último cenário salvo
* mostra resultados resumidos

### `/simulacoes`

Hub de simulações.

* lista todos os simuladores
* permite abrir por categoria
* permite favoritar ou fixar cenários

### `/simulacoes/financiamento`

Simulador de financiamento.

* valor do bem
* entrada
* prazo
* taxa
* parcela estimada
* total pago
* total de juros

### `/simulacoes/amortizacao`

Simulador de amortização.

* saldo devedor
* parcela atual
* amortização extra
* impacto no prazo
* impacto na parcela

### `/simulacoes/juros-compostos`

Simulador de capitalização.

* aporte inicial
* aporte recorrente
* taxa
* prazo
* valor futuro

### `/simulacoes/comprar-versus-juntar`

Comparador de compra agora versus juntar dinheiro.

* preço alvo
* prazo de espera
* taxa de investimento
* custo do crédito

### `/simulacoes/patrimonio`

Formação de patrimônio e renda gerada.

* capital atual
* aportes
* taxa
* meta de renda

### `/simulacoes/capacidade-financiamento`

Capacidade máxima de financiamento.

* renda
* comprometimento
* taxa
* prazo

### `/cenarios`

Lista de cenários salvos.

### `/cenarios/:id`

Detalhe do cenário.

* resumo
* premissas
* comparação
* exportação

### `/historico`

Histórico de simulações feitas no dispositivo.

### `/configuracoes`

Preferências gerais.

* moeda
* idioma
* defaults numéricos
* tema
* comportamento de gráficos

### `/ajuda`

Centro de orientação.

* glossário
* perguntas frequentes
* explicação dos indicadores

## Navegação mobile

Barra inferior com cinco entradas:

* Início
* Simulações
* Cenários
* Histórico
* Configurações

## Regras de rota

* nenhuma rota principal deve exigir mais de dois toques para chegar
* a rota ativa deve estar sempre clara
* telas de detalhe devem ter ação de voltar visível
* parâmetros de cenário devem ser compartilháveis por URL quando fizer sentido

