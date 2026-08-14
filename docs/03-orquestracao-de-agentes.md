# 03. Orquestracao de agentes

Este e o documento central do metodo. Ele descreve como o trabalho e distribuido entre modelos, janelas e subagentes.

## 1. Premissa

O modelo nao e um executor unico que recebe tudo. Ele e um conjunto de papeis, cada um rodando em contexto proprio, com escopo estreito e permissao limitada. O humano nao codifica, orquestra.

A metrica que prova o ponto: em um mesmo ciclo de trabalho, a janela principal consome dezenas de pontos percentuais de contexto executando a implementacao, enquanto um subagente de revisao rodando isolado consome um unico ponto percentual para revisar o mesmo trabalho. O subagente nao precisa da conversa inteira. Precisa do diff e das regras.

Corolario: a janela unica, gigante e permanentemente aberta e o antipadrao mais caro da operacao. Ela carrega ruido de exploracao antiga em toda nova mensagem.

## 2. Roteamento de modelo

| Fase | Modelo | Motivo |
|---|---|---|
| Descoberta e especificacao | Opus | Ambiguidade alta. Erro aqui se propaga por todo o projeto. |
| Arquitetura e modelo de dados | Opus | Decisao cara de reverter. |
| Quebra em issues | Opus | Define o contrato que o executor seguira cegamente. |
| Implementacao | Sonnet | Contrato fechado, tarefa determinada, ciclo repetitivo. |
| Testes e correcao | Sonnet | Iteracao curta. |
| Revisao de codigo | Sonnet, subagente isolado | Escopo minimo, custo minimo. |
| Documentacao e ADR | Opus | Ativo permanente. |
| Bug que resistiu a tres ciclos | Escalar capacidade, com acesso direto ao ambiente | Insistir e o desperdicio, nao a troca. |

**Regra dos tres ciclos**: se o mesmo problema sobreviveu a tres tentativas no modelo de execucao, para. Trinta tentativas no mesmo caminho custam mais que uma tentativa no caminho certo. Escala o modelo, da acesso ao ambiente real, ou muda a estrategia de diagnostico.

## 3. Catalogo de subagentes

| Agente | Gatilho | Escopo de leitura | Nao pode |
|---|---|---|---|
| `planner` | Toda demanda nova | Input bruto mais docs | Escrever codigo |
| `executor` | Issue especificada | Issue mais arquivos citados | Sair do escopo, dar push |
| `test-runner` | Apos implementacao | Saida da suite mais arquivos falhos | Deletar ou pular teste |
| `code-reviewer` | Antes de todo push | Diff mais CLAUDE.md mais issue | Editar codigo de producao |
| `db-guardian` | Mudanca de schema ou query | Models, migrations, queries | Aplicar migration em producao |
| `queue-architect` | Processamento assincrono | Workers e config de fila | Acoplar processamento a rota |
| `observability-agent` | Instrumentacao e bug intermitente | Caminho instrumentado mais recorte de log | Ler log bruto sem recorte |
| `design-keeper` | Toda tarefa de UI | components/ui mais tokens | Criar estilo fora do sistema |
| `security-auditor` | Rota nova e pre release | Rotas, auth, config | Aprovar bloqueante |
| `finance-validator` | Projeto com cobranca | Modulo financeiro | Alterar valor em producao |

Um subagente pode ser adicionado quando um tipo de erro se repete. O gatilho para criar agente novo e a terceira ocorrencia do mesmo erro em projetos diferentes.

## 4. Fluxo de orquestracao completo

```
DEMANDA BRUTA (audio, transcricao, conversa)
        |
        v
[Opus] planner ---------> especificacao + fila de issues
        |
        |  parada humana: validacao do plano
        v
[Sonnet] executor  <---- uma janela limpa por issue
        |
        v
[Sonnet] test-runner ---> suite verde obrigatoria
        |
        v
[Sonnet] code-reviewer --> achados numerados, em contexto isolado
        |
        v
CONFIRMACAO NO CODIGO ----> falso positivo descartado com justificativa
        |
        v
[trava] git push bloqueado ---> /ship apresenta o relatorio
        |
        |  parada humana: autorizacao explicita
        v
MERGE
```

## 5. Higiene de janela

| Situacao | Acao |
|---|---|
| Tarefa concluida | Encerrar a janela. Nao emendar outra tarefa. |
| Contexto acima de sessenta por cento com tarefa em andamento | Compactar preservando decisao, arquivos tocados e proximo passo |
| Muito ruido de exploracao | Registrar estado na issue e reabrir limpo |
| Nova issue | Sempre janela nova |

O ciclo canonico de trabalho por issue: janela limpa, o agente le a issue, le apenas o recorte de codigo necessario, declara o que vai fazer, executa, revisa, para. Encerra. Proxima issue, proxima janela.

Isso permite manter varias issues abertas simultaneamente como backlog paralelizavel, sem que uma contamine o contexto da outra.

## 6. Economia de token

O custo e dominado por token de saida. Duas consequencias praticas:

**Prompt tecnico demais produz resposta longa demais.** Descricao excessivamente detalhada induz o modelo a responder no mesmo registro, e a resposta e o que custa. Prompt denso nao e prompt prolixo. Especifique o alvo e o criterio de aceite, nao a enciclopedia do dominio.

**Proibir narracao.** O modelo nao repete o codigo que acabou de escrever, nao resume o que acabou de fazer, nao explica processo. Entrega arquivos, decisao e risco. Isso esta codificado na secao 5 do `CLAUDE.md`.

Antipadroes que quebram orcamento, em ordem de gravidade:
1. Mandar o modelo ler log bruto de producao procurando padrao
2. Manter uma unica janela aberta por dias
3. Empilhar cinco tarefas em um comando
4. Colar a base de codigo inteira quando o recorte bastaria
5. Insistir no mesmo caminho de diagnostico apos varias falhas

## 7. Divisao de papeis: Maker Builder e Builder

| Papel | Responsabilidade | Perfil |
|---|---|---|
| Maker Builder | Define template, arquitetura, regras, travas e quality gates | Arquiteto, engenheiro senior |
| Builder | Executa dentro do cercado, monta features, entrega valor | Desenvolvedor pleno ou junior, ou o proprio modelo |

O Builder pode trabalhar com liberdade porque as regras do Maker Builder seguram o erro. O valor do template nao esta em impedir liberdade, esta em tornar o erro grave mecanicamente dificil.

A parte cognitiva permanece humana. O multiplicador da ferramenta e proporcional a competencia aplicada: sobre fundacao correta, multiplica o resultado. Sobre deficit tecnico, multiplica o problema, porque cada erro estrutural e replicado e propagado em velocidade.

## 8. Do audio bruto ao codigo

Fluxo real de entrada de ideia:

1. Ideia capturada em audio, no momento em que ocorre
2. Transcricao em ferramenta que aceite audio nativamente
3. Transcricao bruta entregue ao `planner` com o comando `/plan`
4. Interrogatorio: o agente aponta lacunas, o humano fecha
5. Especificacao gerada, validada e congelada
6. Fila de issues
7. Execucao issue a issue

A etapa 4 e onde o retrabalho e evitado. Quanto mais detalhado o planejamento, menor a chance de erro na execucao e menor o custo total. Retrabalho e o maior desperdicio observado, acima de token e acima de tempo de execucao.
