# Guia de UI/UX - Group Prospecting Finder

## Objetivo
Este documento consolida a identidade visual e os padroes de interface do projeto atual da extensao Chrome.

A ideia e manter uma experiencia:
- limpa
- moderna
- clara
- com boa leitura
- com feedback rapido
- sem excesso visual

O produto precisa parecer uma ferramenta profissional, confiavel e facil de operar mesmo para quem nao tem conhecimento tecnico.

## Direcao Visual
### Sensacao geral
- visual leve e contemporaneo
- fundo claro, com contraste bem controlado
- cards bem definidos
- interacoes discretas, mas perceptiveis
- foco em legibilidade e confianca

### Personalidade
- utilitaria, nao "enfeitada"
- moderna, nao pesada
- elegante, mas simples
- tecnica o suficiente para passar seriedade

### Referencia de estilo
- base clean slate
- azul/indigo como cor principal
- superfies claras
- bordas suaves
- sombras leves
- tipografia sans-serif moderna

## Paleta de Cores
### Cor principal
- `#6366f1`

Uso:
- botoes primarios
- destaque de abas ativas
- estados selecionados
- links e focos importantes

### Cores de base
- `--background: #f8fafc`
- `--foreground: #1e293b`
- `--card: #ffffff`
- `--card-foreground: #1e293b`
- `--popover: #ffffff`
- `--popover-foreground: #1e293b`

### Cores secundarias
- `--secondary: #e5e7eb`
- `--secondary-foreground: #374151`
- `--muted: #f3f4f6`
- `--muted-foreground: #6b7280`

### Cores de interface
- `--border: #d1d5db`
- `--input: #d1d5db`
- `--ring: #6366f1`
- `--accent: #e0e7ff`
- `--accent-foreground: #374151`

### Feedback
- `--destructive: #ef4444`
- `--destructive-foreground: #ffffff`

### Regras de uso
- nao usar roxo escuro pesado como cor dominante
- nao usar gradientes excessivos
- nao misturar muitas cores de destaque
- usar `#6366f1` como assinatura visual principal

## Tipografia
### Familia principal
- `Inter`

### Regra geral
- sem serifa
- forte legibilidade em tamanhos pequenos
- peso equilibrado entre 400, 500, 600 e 700
- evitar fontes decorativas ou serifadas

### Hierarquia
- titulo principal: 20px a 24px, 700
- titulo de card: 14px a 16px, 600
- texto normal: 13px a 14px, 400 ou 500
- legenda e metadados: 12px, 400

### Espacamento tipografico
- tracking neutro
- line-height confortavel
- evitar textos muito apertados

### Regras
- priorizar leitura antes de estilo
- nao usar tudo em maiusculo, exceto labels pequenas quando fizer sentido
- evitar serifas em qualquer parte da interface

## Bordas, Raio e Sombras
### Bordas
- espessura padrao: `1px`
- cor padrao: `#d1d5db`

### Raio
- cards: `12px` a `16px`
- inputs e botoes: `10px` a `12px`
- chips e tags: `9999px` quando necessario

### Sombras
- sutis
- sem contraste pesado
- usar para destacar cards e modais, nao para decorar

Exemplo:
```css
box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
```

## Espacamento e Layout
### Regra de espacamento
- usar sistema consistente de 4px ou 8px
- manter respiro suficiente entre blocos
- evitar telas "apertadas"

### Container
- largura responsiva
- popup compacto, mas com conteudo organizado
- cards com area interna generosa

### Grid
- listas em colunas bem definidas
- metadados alinhados com consistencia
- usar separadores visuais leves quando necessario

### Densidade
- media
- sem poluicao
- sem excesso de linhas decorativas

## Componentes
### Botao primario
- fundo `#6366f1`
- texto branco
- raio suave
- hover levemente mais escuro
- foco visivel

### Botao secundario
- fundo claro
- borda discreta
- texto em tom neutro

### Inputs
- fundo branco
- borda clara
- foco com ring em `#6366f1`
- placeholder discreto

### Tabs
- tab ativa destacada com fundo claro e outline sutil
- tab inativa neutra
- feedback rapido ao clicar

### Cards
- fundo branco
- borda sutil
- raio medio
- titulo claro
- conteudo com separacao visual

### Badges e status
- sucesso, alerta, erro e pendente devem ser rapidos de entender
- cores devem ser suaves, nao gritantes
- texto sempre legivel sobre o fundo

### Tabelas e listas
- linhas com respiro
- badges compactos
- acoes visiveis, mas sem competir com o conteudo

### Modais e drawers
- fundo branco
- overlay escuro suave
- foco no conteudo principal

## Estados de Interacao
### Hover
- leve elevacao visual
- fundo levemente mais escuro ou borda mais visivel

### Focus
- anel em `#6366f1`
- sempre visivel para acessibilidade

### Active
- reforcar estado selecionado sem exagero

### Loading
- mostrar feedback imediato
- evitar tela parada sem sinal de progresso

### Empty state
- explicar o que o usuario pode fazer
- nao deixar a tela vazia e silenciosa

### Error state
- mensagem curta
- orientacao clara
- visualmente distinguivel sem agressividade

## Conteudo e Microcopy
### Tom de voz
- simples
- direto
- orientado a acao
- sem jargao tecnico desnecessario

### Regras
- dizer o que esta acontecendo
- dizer o que o usuario pode fazer agora
- evitar mensagens vagas
- evitar tom robotico

### Exemplos de mensagens boas
- "Nenhum resultado encontrado ainda"
- "Buscando novas paginas candidatas"
- "Copiado para a area de transferencia"
- "Validacao manual recomendada"

## Popups e Extensao Chrome
### Estrutura ideal
- cabecalho com identidade do app
- abas principais visiveis
- area de status/progresso
- lista de resultados
- acoes por item

### Prioridades
- carregar rapido
- responder rapido
- deixar claro o que esta sendo feito
- nao sobrecarregar a pequena area do popup

### Regras especificas
- usar contrastes altos o suficiente para uso em janela pequena
- nao depender de hover para informacoes criticas
- acomodar texto longo sem quebrar a interface

## CSS Tokens Recomendados
```css
:root {
  --background: #f8fafc;
  --foreground: #1e293b;
  --card: #ffffff;
  --card-foreground: #1e293b;
  --popover: #ffffff;
  --popover-foreground: #1e293b;
  --primary: #6366f1;
  --primary-foreground: #ffffff;
  --secondary: #e5e7eb;
  --secondary-foreground: #374151;
  --muted: #f3f4f6;
  --muted-foreground: #6b7280;
  --accent: #e0e7ff;
  --accent-foreground: #374151;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --border: #d1d5db;
  --input: #d1d5db;
  --ring: #6366f1;
  --radius: 0.75rem;
  --font-sans: "Inter", sans-serif;
}
```

## Padrões do que evitar
- serifas
- roxo saturado demais
- excesso de sombras
- excesso de gradientes
- bordas muito grossas
- cards apertados
- mensagens longas demais
- layouts genéricos e sem hierarquia

## Checklist de Qualidade Visual
- a interface parece moderna e limpa
- a leitura funciona bem em popup pequeno
- a cor `#6366f1` aparece como assinatura do produto
- o texto usa Inter ou uma sans moderna equivalente
- bordas, cards e inputs seguem a mesma linguagem
- o usuario entende o status da ferramenta em poucos segundos
- os estados vazios, loading e erro sao claros

## Resumo Final
Se precisar resumir a identidade do projeto em uma frase:

**Extensao Chrome clara, leve e profissional, com base clean slate, tipografia Inter, azul-indigo `#6366f1`, bordas suaves e foco absoluto em leitura, contraste e rapidez de uso.**
