# Setup da máquina de captação

Guia de montagem: extensão do Claude, Google Sheets e Zapier.

Tempo total: cerca de 2 horas. Depois disso a operação roda em 30 minutos de manhã.

---

## 1. Google Sheets

### Criar a planilha

Crie uma planilha chamada `Operação Comercial Avraham` com cinco abas:

`LEADS` · `FILA_HOJE` · `PIPELINE` · `METRICAS` · `ICP_REF`

### Importar os dados base

Na aba `LEADS`, importe `sheets/LEADS.csv` (Arquivo, Importar, Substituir planilha atual).
Na aba `ICP_REF`, importe `sheets/ICP_REF.csv`.

Apague as três linhas de exemplo da aba `LEADS` depois de conferir que as colunas ficaram na ordem certa.

### Colunas da aba LEADS

```
A id                 H site              O sinal
B data_captura       I segmento          P sinal_data
C origem             J porte             Q score
D nome               K localizacao       R faixa_ticket
E cargo              L telefone          S status
F empresa            M whatsapp          T proximo_toque
G linkedin_url       N email             U notas
```

### Validação de dados

Selecione a coluna, vá em Dados, Validação de dados, e aponte para o intervalo do `ICP_REF`.

| Coluna | Intervalo de origem |
|---|---|
| I (segmento) | `ICP_REF!B2:B19` filtrado por bloco `segmento` |
| S (status) | `ICP_REF` bloco `status_valido` |
| C (origem) | `ICP_REF` bloco `origem_valida` |

Marque "Rejeitar entrada" para que nenhum valor fora da lista entre na base.

### Fórmulas

**Score automático** (cole em `V2` se quiser calcular a partir de critérios manuais):

```
=IF(I2="";"";MIN(100;
  IF(COUNTIF(ICP_REF!$B:$B;I2)>0;30;10)
+ IFS(REGEXMATCH(LOWER(E2);"fundador|ceo|sócio|socio|diretor");30;
      REGEXMATCH(LOWER(E2);"head|gerente|coordenador");25;
      REGEXMATCH(LOWER(E2);"analista|assistente");10;
      TRUE;15)
+ IF(OR(M2<>"";REGEXMATCH(LOWER(U2);"whatsapp"));25;10)
+ IF(J2<>"";15;5)))
```

**Próximo toque sugerido** (cole em `W2`):

```
=IF(Q2="";"";
 IFS(Q2>=80;TODAY();
     Q2>=60;TODAY()+2;
     Q2>=40;TODAY()+14;
     TRUE;""))
```

**Dias parado** (na aba `PIPELINE`):

```
=IF(data_ultima_interacao="";"";TODAY()-data_ultima_interacao)
```

**Valor ponderado** (na aba `PIPELINE`):

```
=IF(OR(valor_estimado="";probabilidade="");"";valor_estimado*probabilidade/100)
```

### Aba FILA_HOJE

Cole em `A1`:

```
=QUERY(LEADS!A:U;
 "select A,D,E,F,G,I,L,O,Q,S,T
  where (T <= date '"&TEXT(TODAY();"yyyy-mm-dd")&"' or S = 'NOVO')
    and Q >= 60
    and S <> 'DESCARTADO'
    and S <> 'FECHADO'
    and S <> 'PERDIDO'
  order by Q desc";1)
```

### Aba METRICAS

```
Leads na base        =COUNTA(LEADS!A2:A)
Score 60 ou mais     =COUNTIFS(LEADS!Q2:Q;">=60")
Abordados            =COUNTIFS(LEADS!S2:S;"<>NOVO")-COUNTIFS(LEADS!S2:S;"DESCARTADO")
Responderam          =COUNTIFS(LEADS!S2:S;"RESPONDEU")+COUNTIFS(LEADS!S2:S;"QUALIFICANDO")
Calls agendadas      =COUNTIFS(LEADS!S2:S;"CALL_AGENDADA")
Propostas            =COUNTIFS(LEADS!S2:S;"PROPOSTA")
Fechados no mês      =COUNTIFS(LEADS!S2:S;"FECHADO";LEADS!B2:B;">="&EOMONTH(TODAY();-1)+1)
Taxa de resposta     =IFERROR(Responderam/Abordados;0)
```

Por segmento:

```
=QUERY(LEADS!A:U;"select I, count(A), avg(Q) where I is not null group by I order by count(A) desc label count(A) 'Leads', avg(Q) 'Score médio'";1)
```

### Formatação condicional

| Regra | Aplicar em | Formato |
|---|---|---|
| `=$Q2>=80` | A2:U | Fundo ciano suave |
| `=E($T2<>"";$T2<TODAY())` | A2:U | Fundo vermelho suave |
| `=$S2="FECHADO"` | A2:U | Fundo verde suave |
| `=$S2="DESCARTADO"` | A2:U | Texto cinza |

### Colunas a proteger

`A` (id), `Q` (score) e `T` (próximo toque) são calculadas. Proteja contra edição manual para não quebrar a consistência.

---

## 2. Extensão do Claude no Chrome

### Como usar

1. Abra a página de origem (busca do LinkedIn, post, perfil, empresa, Maps)
2. **Role até o fim antes de pedir qualquer coisa.** A extensão lê o que está renderizado. Página não rolada devolve metade dos perfis.
3. Abra a biblioteca de ativos, escolha o prompt de captação, copie
4. Cole na extensão
5. Copie o CSV devolvido e cole na aba `LEADS`

### Qual prompt usar em cada fonte

| Fonte aberta no navegador | Prompt |
|---|---|
| Resultados de busca do LinkedIn | Extrair lista de busca do LinkedIn |
| Post com comentários expandidos | Extrair quem engajou em um post |
| Perfil individual | Extrair perfil individual completo |
| Página de empresa | Extrair página de empresa |
| Grupo, evento ou webinar | Extrair de grupo ou evento |
| Google Maps, diretório, associação | Extrair do Google Maps e diretórios |
| Site ou Instagram da empresa | Encontrar o WhatsApp da empresa |

### Ordem que funciona

```
Extrair em lote  →  Normalizar e deduplicar  →  Classificar por ICP
      ↓
Perfil individual dos que passaram de 60
      ↓
Encontrar WhatsApp dos que vão receber abordagem direta
      ↓
Montar a fila do dia
```

### Limite de segurança

Teto sugerido: **40 a 60 perfis por dia**, distribuídos ao longo do dia.

O LinkedIn restringe conta que apresenta padrão automatizado, e o gatilho principal é volume alto em intervalo curto. Não vale arriscar a conta por um lote a mais.

---

## 3. Zapier

### Regra que manda em tudo

**Automatize lembrete. Nunca automatize julgamento.**

Automatizar: registro, cálculo, alerta, mudança de status por regra clara.
Não automatizar: primeira mensagem, resposta a objeção, proposta, qualquer texto que decida o rumo do deal.

Mensagem automática de prospecção pelo número pessoal é o caminho mais rápido para queimar o número.

### Ordem de implantação

Não crie todas de uma vez. Siga esta ordem e teste cada uma antes da próxima.

**Zap 1 · Novo lead entra**
- Gatilho: Google Sheets, New Spreadsheet Row, aba `LEADS`
- Filtro: coluna `score` preenchida
- Ação: Update Row, preenche `id` e `data_captura`, define `proximo_toque` conforme o score

**Zap 2 · Fila da manhã**
- Gatilho: Schedule by Zapier, todo dia útil às 8h30
- Ação: Google Sheets Lookup na `FILA_HOJE`, envia a lista consolidada para você
- Regra: **uma notificação por dia**, nunca uma por lead

**Zap 3 · Lead respondeu**
- Gatilho: Google Sheets, Updated Row, `status` muda para `RESPONDEU`
- Ações: notificação imediata, define `proximo_toque` para hoje
- Justificativa: é o único caso que justifica interromper você

**Zap 4 · Lead parado**
- Gatilho: Schedule diário
- Ações: acima de 7 dias parado, alerta; acima de 21 dias, muda status para `NUTRICAO`
- A mudança para `NUTRICAO` é automática. O alerta de 7 dias exige decisão sua.

**Zap 5 · Proposta enviada**
- Gatilho: `status` muda para `PROPOSTA`
- Ações: registra data e valor, agenda lembrete de cobrança para 4 dias depois

**Zap 6 · Call agendada**
- Gatilho: `status` muda para `CALL_AGENDADA`
- Ações: cria evento no calendário, lembrete de confirmação 24h antes

**Zap 7 · Resumo semanal**
- Gatilho: sexta às 17h
- Ação: consolida a aba `METRICAS` e envia

### Economia de tarefas

Zaps 2, 4 e 7 rodam por agendamento e leem a planilha inteira de uma vez, em vez de disparar por linha. Isso mantém o consumo baixo mesmo com a base crescendo.

---

## 4. Rotina diária

**Manhã, 30 minutos**

1. Abre a fila que o Zap 2 mandou
2. Roda o prompt `Montar a fila do dia` colando a `FILA_HOJE`
3. Executa: comentários no LinkedIn, mensagens diretas, WhatsApp de quem já interagiu
4. Atualiza `status` e `proximo_toque` na planilha

**Duas vezes por semana, 20 minutos**

Roda `Monitorar sinal de compra na base` para achar quem publicou algo que abre janela agora.

**Semanal, 40 minutos**

1. Extração nova, 40 a 60 perfis
2. `Normalizar e deduplicar lote`
3. `Classificar lote inteiro por ICP`
4. Cola o resultado na aba `LEADS`

**Mensal, 1 hora**

`Refinar o ICP com dados reais`. Depois de 100 abordagens você tem evidência suficiente para corrigir o perfil alvo e os pesos do score.

---

## 5. Capacidade e meta

Teto diário de toques novos: 25 a 35.

```
Comentários no LinkedIn      8 a 10
Mensagens diretas            5 a 8
WhatsApp (só quem interagiu) 10 a 15
Ligações                     3 a 5
```

Conta até a meta de 5 vendas por mês:

```
120 a 150 toques por semana
    ↓  taxa de resposta 20 a 40%
25 a 50 conversas iniciadas
    ↓  conversão para call 30 a 40%
8 a 15 calls por mês
    ↓  call para diagnóstico 50%
4 a 7 diagnósticos
    ↓  diagnóstico para proposta 70 a 90%
3 a 6 propostas
    ↓  fechamento 30 a 50%
1 a 3 vendas por mês
```

O número fecha com constância e com a taxa de resposta acima de 30%, que é exatamente o que a personalização dos prompts sustenta. Se a taxa de resposta cair abaixo de 20%, o problema é a abordagem, não o volume. Rode `Qual abordagem converte melhor` antes de aumentar a entrada.

---

## 6. Checklist de montagem

```
[ ] Planilha criada com as 5 abas
[ ] LEADS.csv importado, linhas de exemplo apagadas
[ ] ICP_REF.csv importado
[ ] Validação de dados nas colunas segmento, status e origem
[ ] Fórmula da FILA_HOJE colada
[ ] Fórmulas da METRICAS coladas
[ ] Formatação condicional aplicada
[ ] Colunas calculadas protegidas
[ ] Extensão do Claude ativa no Chrome
[ ] Primeira extração de teste feita e colada
[ ] Zap 1 criado e testado
[ ] Zap 2 criado e testado
[ ] Zaps 3 a 7 criados
```

Marque o Zap 1 e o Zap 2 como obrigatórios antes de começar. Os outros podem entrar na segunda semana.
