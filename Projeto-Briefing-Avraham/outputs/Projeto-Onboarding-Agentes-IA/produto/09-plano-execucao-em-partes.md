# Plano de Execucao em Partes

## Principio

Executar em partes, com entregas pequenas, testaveis e sem risco para o site principal.

Nada de mexer no site institucional antes de existir um prototipo ou app separado validado.

## Parte 1: Documentacao Mestre

Objetivo: deixar claro o que sera construido.

Entregas:

- mapa do produto;
- fluxos e telas;
- modelo de dados;
- backlog;
- briefing funcional;
- direcao de design;
- agentes, skills e ferramentas;
- plano de integracao sem risco.

Resultado esperado:

```text
Qualquer pessoa tecnica ou comercial consegue entender o projeto e continuar.
```

## Parte 2: Prototipo Visual

Objetivo: sentir o produto antes de codar pesado.

Entregas:

- tela de dashboard;
- tela de oportunidade;
- tela de discovery;
- tela de fit;
- tela de calculadora;
- tela de onboarding;
- tela de plano do cliente;
- tela de ROI.

Formato:

- prototipo em app local simples;
- ou Figma;
- ou HTML/React mockado.

Recomendacao:

```text
Fazer em React mockado ja com componentes reais.
```

Assim o prototipo vira base do app.

## Parte 3: App Base

Objetivo: criar a estrutura tecnica.

Entregas:

- projeto app;
- rotas;
- layout;
- tema;
- componentes base;
- navegacao;
- dados mockados;
- deploy local.

Sem banco ainda, se quisermos acelerar.

## Parte 4: Banco e Autenticacao

Objetivo: persistir dados com seguranca.

Entregas:

- Supabase;
- tabelas principais;
- usuarios;
- permissoes;
- storage;
- seeds de parametros.

## Parte 5: Modulo Comercial

Objetivo: vender melhor.

Entregas:

- oportunidade;
- discovery guiada;
- fit score;
- bloqueios;
- mapa da oportunidade;
- calculadora de escopo;
- proposta.

## Parte 6: Modulo Onboarding

Objetivo: transformar venda em execucao.

Entregas:

- briefing completo;
- upload/anexos;
- agentes propostos;
- checklist;
- plano do cliente;
- nota do projeto.

## Parte 7: Modulo ROI

Objetivo: provar valor todo mes.

Entregas:

- cadastro de resultados mensais;
- calculo de impacto;
- ROI;
- payback;
- relatorio;
- proximas melhorias.

## Parte 8: Calculadora Publica no Site

Objetivo: gerar leads a partir da URL principal.

Entregas:

- rota publica `/calculadora-ia`;
- diagnostico simples;
- captura de contato;
- resultado parcial;
- CTA para conversa;
- envio para o Studio.

Esta parte so vem depois que a logica interna estiver validada.

## Parte 9: Portal do Cliente

Objetivo: dar visibilidade para cliente fechado.

Entregas:

- login cliente;
- pendencias;
- documentos;
- plano aprovado;
- status de implementacao;
- ROI mensal.

## Controle de risco

Antes de qualquer mudanca no site principal:

- confirmar branch;
- garantir working tree limpo;
- criar branch ou worktree;
- rodar build atual;
- fazer mudanca isolada;
- rodar build/test;
- revisar diff;
- publicar apenas com preview validado.

## Primeira execucao recomendada

Comecar pela Parte 2:

```text
Prototipo visual em React mockado, dentro de Projeto-Briefing-Avraham/app.
```

Motivo:

- valida design;
- valida fluxo;
- nao mexe no site;
- vira base real do produto;
- permite mostrar para o time.

