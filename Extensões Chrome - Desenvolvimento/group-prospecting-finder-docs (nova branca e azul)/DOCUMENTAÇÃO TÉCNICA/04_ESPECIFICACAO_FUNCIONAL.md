# Especificação Funcional

## 1. Tela principal

A extensão deve abrir um popup com abas:

- Nova busca
- Resultados
- Campanhas
- Configurações

## 2. Nova busca

### Campos

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| Nome da campanha | Texto | Sim | Nome interno da busca |
| Palavra-chave principal | Texto | Sim | Termo principal |
| Termos adicionais | Textarea | Não | Um termo por linha ou separado por vírgula |
| Região | Texto | Não | Cidade, estado, país ou região |
| Fontes | Checkbox | Sim | Google, Facebook, YouTube, TikTok, Reddit, Instagram, LinkedIn, X |
| Páginas por fonte | Número | Sim | Mínimo 1, máximo 50 |
| Profundidade | Select | Sim | Rápida, média, profunda |

## 3. Fontes

### Google geral

```txt
"{keyword}" "{region}" "chat.whatsapp.com"
```

### Facebook

```txt
site:facebook.com "{keyword}" "{region}" "chat.whatsapp.com"
```

### YouTube

```txt
site:youtube.com "{keyword}" "{region}" "chat.whatsapp.com"
```

### TikTok

```txt
site:tiktok.com "{keyword}" "{region}" "chat.whatsapp.com"
```

### Reddit

```txt
site:reddit.com "{keyword}" "{region}" "chat.whatsapp.com"
```

### Instagram

```txt
site:instagram.com "{keyword}" "{region}" "chat.whatsapp.com"
```

### LinkedIn

```txt
site:linkedin.com "{keyword}" "{region}" "chat.whatsapp.com"
```

### X/Twitter

```txt
(site:x.com OR site:twitter.com) "{keyword}" "{region}" "chat.whatsapp.com"
```

## 4. Termos adicionais

Se o usuário informar:

```txt
imobiliária
corretores
investidores imobiliários
```

E região:

```txt
Maringá
```

A ferramenta deve gerar buscas separadas:

```txt
"imobiliária" "Maringá" "chat.whatsapp.com"
"corretores" "Maringá" "chat.whatsapp.com"
"investidores imobiliários" "Maringá" "chat.whatsapp.com"
```

## 5. Padrões de WhatsApp

A extensão deve testar variações:

```txt
"chat.whatsapp.com"
"https://chat.whatsapp.com"
"grupo whatsapp"
"grupos whatsapp"
"link de grupo"
```

No MVP, usar prioritariamente:

```txt
"chat.whatsapp.com"
```

Para evitar excesso de queries.

## 6. Profundidade

### Rápida

- Usa apenas palavra-chave principal
- Usa apenas `chat.whatsapp.com`
- Menos páginas

### Média

- Usa palavra-chave principal
- Usa termos adicionais
- Usa região
- Usa fontes selecionadas

### Profunda

- Usa palavra-chave principal
- Usa termos adicionais
- Usa variações de padrões
- Usa todas as fontes selecionadas
- Usa mais páginas

## 7. Resultados

Cada resultado deve mostrar:

- Link do grupo
- Fonte
- Query original
- Campanha
- Status
- Data de coleta
- Data de validação
- Botões de ação

## 8. Ações por resultado

- Abrir
- Copiar
- Validar
- Marcar como válido
- Marcar como inválido
- Marcar como grupo cheio
- Marcar como fora do nicho
- Remover
- Adicionar observação

## 9. Ações em massa

- Copiar todos
- Exportar CSV
- Exportar JSON
- Marcar selecionados como válidos
- Marcar selecionados como inválidos
- Remover duplicados
- Limpar campanha

## 10. Filtros

- Status
- Fonte
- Campanha
- Palavra-chave
- Região
- Data
- Texto livre

## 11. Configurações

- Máximo de abas abertas simultaneamente
- Delay entre buscas
- Fechar abas após coleta
- Validar links em nova aba
- Exportar apenas válidos
- Exportar apenas pendentes
