# Briefing Funcional do App

## Nome do projeto

Projeto-Briefing-Avraham

## Nome do produto

Gerador de Agentes IA

## Objetivo

Criar uma aplicacao web para centralizar o processo comercial e operacional de projetos de agentes de IA, desde a qualificacao do lead ate a prova mensal de ROI.

## Problema

Hoje o processo tende a ficar espalhado entre conversa, anotacoes, documentos, planilhas, proposta e execucao. Isso cria riscos:

- vender para cliente sem fit;
- subprecificar projeto;
- esquecer uma dor importante;
- criar agente sem contexto suficiente;
- nao provar valor depois da entrega;
- depender demais da memoria do vendedor ou implementador.

## Solucao

Um sistema unico que guia o time por perguntas, calcula fit, estima horas, sugere preco, gera proposta, conduz onboarding, cria plano do cliente e registra ROI mensal.

## Publico interno

- Pre-vendas.
- Closers.
- Implementadores.
- CS.
- Gestores.

## Principios de produto

- O vendedor deve conseguir usar durante uma ligacao.
- O resultado deve ser claro o suficiente para virar proposta.
- O implementador deve receber um plano sem precisar redescobrir tudo.
- O cliente deve perceber valor antes, durante e depois da implementacao.
- Tudo que vira preco precisa ter memoria de calculo.
- Tudo que vira promessa precisa virar entregavel ou metrica.

## Requisitos funcionais

### RF01: Criar oportunidade

O usuario deve poder criar uma oportunidade com dados basicos da empresa, contato, origem e problema inicial.

### RF02: Preencher descoberta

O usuario deve responder perguntas guiadas por blocos.

### RF03: Calcular fit score

O sistema deve calcular a nota da oportunidade e classificar como:

- Fit forte.
- Fit condicional.
- Sem fit agora.

### RF04: Registrar bloqueios

O sistema deve permitir marcar bloqueios criticos que afetam a recomendacao comercial.

### RF05: Calcular escopo

O sistema deve calcular horas de setup, preco minimo, preco sugerido, mensalidade e margem.

### RF06: Editar parametros comerciais

O usuario autorizado deve poder editar:

- custo interno por hora;
- taxa hora comercial;
- margem alvo;
- custo de tokens;
- markup;
- capacidade semanal;
- taxa de captura de valor.

### RF07: Gerar proposta

O sistema deve gerar proposta em texto editavel a partir da descoberta e da calculadora.

### RF08: Preencher onboarding

Depois do fechamento, o sistema deve liberar o briefing completo do cliente.

### RF09: Gerar plano do cliente

O sistema deve transformar respostas de onboarding em um plano estruturado.

### RF10: Acompanhar ROI mensal

O usuario deve registrar resultados mensais e o sistema deve calcular impacto, ROI e payback.

## Requisitos nao funcionais

- Interface responsiva para desktop e tablet.
- Salvamento automatico ou frequente.
- Campos editaveis antes de gerar documentos finais.
- Historico minimo de alteracoes importantes.
- Exportacao em markdown no MVP.
- Exportacao em PDF em fase posterior.

## Parametros iniciais

Usar os parametros da planilha atual como fonte inicial:

- custo interno hora;
- valor comercial hora;
- margem bruta alvo;
- capacidade semanal;
- custo por token;
- markup de infraestrutura;
- horas por componente.

## Dados sensiveis

O sistema pode conter dados comerciais de clientes. Portanto:

- evitar acesso publico;
- exigir login quando sair do prototipo local;
- limitar permissao por usuario;
- nao expor propostas ou planos por URL publica sem token seguro.

## Definicao de pronto do MVP

O MVP esta pronto quando uma oportunidade real consegue passar por este ciclo:

1. Cadastrada no sistema.
2. Descoberta respondida.
3. Fit calculado.
4. Escopo e preco sugeridos.
5. Proposta gerada.
6. Oportunidade marcada como fechada.
7. Onboarding preenchido.
8. Plano do cliente gerado.
9. Primeiro resultado mensal registrado.

