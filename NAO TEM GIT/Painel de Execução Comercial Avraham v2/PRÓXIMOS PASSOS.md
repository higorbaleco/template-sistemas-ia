# Próximos Passos — Painel Comercial Avraham

> Faça os 3 passos abaixo para o painel ficar 100% funcional.

---

## Passo 1 — Adicionar aba Pipeline na planilha

Abra a planilha:
**https://docs.google.com/spreadsheets/d/1TPsiy8sUbM_NPmkGl2EVX74DT92FmAhp7PkiI_mjGus/edit**

1. Clique no `+` no rodapé para criar uma nova aba
2. Renomeie para exatamente: `Pipeline`
3. Cole esses cabeçalhos na linha 1 (um por coluna):

| nome | empresa | cidade | numero | status | origem | data_contato | proximo_followup | observacao |
|------|---------|--------|--------|--------|--------|-------------|-----------------|-----------|

**Status válidos** (use exatamente assim):
- `Abordado`
- `Respondeu`
- `Agendado`
- `Reunião Feita`
- `Proposta Enviada`
- `Fechado`
- `Perdido`

**Formato de datas** (colunas `data_contato` e `proximo_followup`): `AAAA-MM-DD`
Exemplo: `2026-05-10`

---

## Passo 2 — Publicar a planilha na web ⚠️ obrigatório

Sem isso o painel não consegue ler os dados.

Na planilha:
1. `Arquivo` → `Compartilhar` → `Publicar na web`
2. Selecionar **Planilha inteira**
3. Clicar em `Publicar` → confirmar

---

## Passo 3 — Abrir o painel

Duplo clique no arquivo `Painel 1.html` — abre direto no Chrome.

Sem servidor, sem instalação, sem login.

---

## Rotina de uso

| Quem | O que faz |
|------|-----------|
| **Brenda** | Atualiza os leads na aba `Pipeline` conforme avançam no funil |
| **Higor** | Atualiza os KPIs na aba `KPIs` (reunioes_realizadas, propostas_enviadas, fechamentos, mrr_atual) |
| **Ambos** | Clicam em `↻ Atualizar` no painel para ver os dados mais recentes |

---

## Como saber que está funcionando

Ao abrir o `Painel 1.html` após os 3 passos:
- O **banner amarelo** de aviso some
- Os **KPIs** mostram os números reais da planilha
- O **pipeline** mostra os leads da aba Pipeline

---

*Painel construído em: 04/05/2026*
\

