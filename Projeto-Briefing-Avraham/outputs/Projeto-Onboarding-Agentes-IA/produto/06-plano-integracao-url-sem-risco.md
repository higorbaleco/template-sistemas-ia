# Plano de Integracao com a URL sem Risco

## Decisao recomendada

Usar a URL da Avraham, mas separar as responsabilidades:

- `avrahamdigital.com.br`: site principal, vitrine e autoridade.
- `avrahamdigital.com.br/calculadora-ia`: calculadora publica simples para captacao.
- `studio.avrahamdigital.com.br`: app interno completo para vendas, briefing, proposta, onboarding e ROI.
- `cliente.avrahamdigital.com.br`: portal do cliente em uma fase posterior.

## Por que nao colocar tudo direto no site principal

O site principal tem funcao de aquisicao e posicionamento. O gerador de agentes tem funcao operacional e vai lidar com dados de clientes, precificacao, propostas, onboarding e ROI.

Misturar tudo no mesmo fluxo aumenta o risco de:

- quebrar a pagina principal;
- expor dados internos;
- atrasar evolucao do produto;
- transformar o site em um sistema pesado;
- dificultar testes e deploy.

## Estrategia segura

### Fase 1: Produto separado

Criar o `Gerador de Agentes IA` como app separado, fora do site principal.

URL sugerida:

```text
studio.avrahamdigital.com.br
```

Uso:

- interno;
- com login;
- sem indexacao publica;
- com banco proprio;
- com deploy separado.

### Fase 2: Calculadora publica no site

Depois que a logica estiver validada, criar uma versao publica leve no site.

URL sugerida:

```text
avrahamdigital.com.br/calculadora-ia
```

Ela nao precisa ter todos os dados internos. Deve apenas:

- fazer algumas perguntas;
- estimar potencial;
- gerar lead;
- chamar para diagnostico;
- mandar dados para o time comercial.

### Fase 3: Portal do cliente

Quando onboarding e ROI estiverem maduros, criar area para o cliente.

URL sugerida:

```text
cliente.avrahamdigital.com.br
```

Uso:

- pendencias;
- upload de materiais;
- status de implementacao;
- plano aprovado;
- resultados mensais.

## O que observei no site atual

O projeto principal parece estar em:

```text
/Users/higorplens/Antigravity Software/TEM GIT/SITE AVRAHAM 2026/avraham-lp-verde
```

Pontos importantes:

- O app usa TanStack Start, React, Vite e Cloudflare.
- Existe Supabase no projeto.
- O projeto interno `avraham-lp-verde` esta limpo no Git no momento da checagem.
- O repositorio pai tem alteracoes locais e arquivos nao rastreados.
- As instrucoes do projeto pedem mudancas cirurgicas e cuidado com producao.

## Regra de seguranca

Nao mexer direto no site principal para construir o gerador.

Antes de qualquer alteracao no site:

1. Confirmar branch atual.
2. Criar branch nova ou worktree.
3. Rodar build atual sem alteracao.
4. Fazer mudanca isolada.
5. Rodar lint/build/test.
6. Revisar diff.
7. So entao pensar em merge/deploy.

## Caminho tecnico recomendado

### Para o app interno

Criar um projeto separado em:

```text
/Users/higorplens/Antigravity Software/Projeto-Briefing-Avraham/app
```

Stack possivel:

- React ou Next.js;
- Supabase;
- Tailwind;
- shadcn/Radix;
- OpenAI para geracao de proposta, plano e relatorio.

Deploy:

- subdominio `studio.avrahamdigital.com.br`;
- protegido por login;
- sem misturar com o site institucional.

### Para a calculadora publica

Depois criar apenas uma rota no site:

```text
/calculadora-ia
```

Essa rota pode reaproveitar:

- visual da Avraham;
- componentes existentes;
- formulario curto;
- resultado simplificado;
- CTA para conversa.

## O que entra no site principal

No site principal, no primeiro momento, entraria apenas:

- CTA: `Calcule o potencial da sua operacao`;
- pagina simples de calculadora;
- formulario de captura;
- link para falar com o time.

## O que nao entra no site principal

Nao deve entrar no site principal:

- dashboard interno;
- precificacao completa;
- parametros de margem;
- custo interno;
- propostas detalhadas;
- briefing completo;
- dados sensiveis do cliente;
- ROI interno.

## Plano de execucao seguro

1. Criar prototipo visual fora do site.
2. Validar fluxo e telas.
3. Criar app separado.
4. Colocar login.
5. Validar com oportunidades reais.
6. Criar calculadora publica pequena no site.
7. Conectar capturas da calculadora ao app interno.
8. Criar portal do cliente somente quando o processo estiver rodando.

## Conclusao

A URL da Avraham deve ser usada, mas com separacao clara:

- site para atrair;
- calculadora para captar;
- studio para operar;
- portal para reter e provar valor.

Essa arquitetura reduz risco e deixa o produto crescer sem comprometer o site atual.
