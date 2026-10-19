# Checklist Antes de Construir

## Decisoes que ja temos

- O produto sera separado do site principal no inicio.
- A URL ideal para o app interno e `studio.avrahamdigital.com.br`.
- A calculadora publica pode entrar depois em `avrahamdigital.com.br/calculadora-ia`.
- O app completo nao deve ficar publico.
- A pasta oficial e `Projeto-Briefing-Avraham`.
- O site atual nao deve ser alterado sem branch/worktree e build validado.

## Decisoes pendentes

### Nome final

Opcoes:

- Avraham Agent Studio.
- Gerador de Agentes IA.
- Agent Studio.
- Avraham Studio.

Recomendacao:

```text
Avraham Agent Studio
```

### Stack do app separado

Opcoes:

- React + Vite.
- TanStack Start.
- Next.js.

Recomendacao inicial:

```text
React + Vite para prototipo rapido, ou TanStack Start se quisermos manter parentesco com o site.
```

### Banco

Recomendacao:

```text
Supabase
```

### Primeiro escopo codado

Recomendacao:

```text
Dashboard + Nova Oportunidade + Discovery + Fit Score + Calculadora.
```

## Perguntas internas para responder

- Quem vai usar primeiro: pre-venda, closer ou implementador?
- O primeiro uso sera com lead real ou dados ficticios?
- Quem aprova precificacao?
- Qual custo interno por hora oficial?
- Qual margem minima aceitavel?
- Qual CRM a Avraham quer usar como fonte final?
- Qual stack de WhatsApp deve ser considerada padrao?
- A proposta precisa sair em PDF ja no MVP?
- O app precisa de login no primeiro prototipo?

## Checklist de qualidade do prototipo

- A tela inicial ja mostra oportunidades e proximas acoes.
- O vendedor consegue usar a discovery durante uma ligacao.
- O fit score e explicavel.
- A calculadora mostra memoria de calculo.
- A proposta gerada usa dores reais do cliente.
- O onboarding nao repete perguntas ja respondidas.
- O plano do cliente sai estruturado.
- O ROI mensal mostra valor em dinheiro.

## Checklist visual

- Usa identidade Avraham.
- Nao parece landing page.
- Nao parece planilha pura.
- Tem boa leitura em tela grande.
- Tem fluxo utilizavel em notebook.
- Botoes e inputs tem contraste.
- Tabelas nao ficam confusas.
- Cards nao ficam empilhados dentro de cards.
- A nota do projeto fica visualmente clara.
- Status e alertas tem hierarquia.

## Checklist tecnico

- App separado do site.
- Git limpo antes de mexer.
- Branch ou worktree antes de integrar.
- Build rodando.
- Dados mockados antes de banco.
- Calculos testaveis.
- Variaveis sensiveis fora do codigo.
- Sem dados reais em ambiente publico.

## Proximo passo pratico

Criar a pasta:

```text
/Users/higorplens/Antigravity Software/Projeto-Briefing-Avraham/app
```

E iniciar o prototipo visual com dados mockados.

