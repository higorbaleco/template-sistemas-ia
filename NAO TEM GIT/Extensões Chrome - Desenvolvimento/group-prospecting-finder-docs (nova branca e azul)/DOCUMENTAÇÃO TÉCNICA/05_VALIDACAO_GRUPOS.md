# Sistema de Validação de Grupos

## 1. Objetivo

Validar se um link de convite de grupo do WhatsApp ainda parece aceitar novos usuários.

A validação deve ser assistida, não invasiva e sem entrada automática no grupo.

## 2. Princípios

A ferramenta deve:

- Abrir o link de convite
- Analisar sinais visuais ou textuais da página
- Sugerir um status provável
- Pedir confirmação humana
- Nunca clicar automaticamente em “Entrar no grupo”
- Nunca coletar participantes
- Nunca enviar mensagem

## 3. Níveis de validação

### Nível 1 | Formato

Verifica se o link está no padrão:

```txt
https://chat.whatsapp.com/CODIGO
```

Status possíveis:

- `valid_format`
- `invalid_format`

### Nível 2 | Abertura

Abre o link em uma aba e verifica se a página carrega.

Status possíveis:

- `page_loaded`
- `page_not_loaded`
- `network_error`
- `unknown`

### Nível 3 | Estado do convite

O content script tenta identificar sinais da página.

Status possíveis:

- `join_available`
- `group_full`
- `invite_revoked`
- `unavailable`
- `manual_review_required`

### Nível 4 | Confirmação manual

O usuário valida:

- Válido
- Inválido
- Grupo cheio
- Link revogado
- Fora do nicho
- Entrei no grupo
- Não entrei
- Prioritário

## 4. Heurísticas de validação

### Possível link disponível

Sinais:

- Página de convite abriu
- Existe botão ou CTA semelhante a:
  - `Join Chat`
  - `Entrar no grupo`
  - `Entrar na conversa`
  - `Join group`
- Existe nome do grupo visível
- Não existe erro claro

Status sugerido:

```txt
join_available
```

### Possível grupo cheio

Sinais textuais:

- `group is full`
- `grupo está cheio`
- `este grupo está cheio`
- `can't join because this group is full`

Status sugerido:

```txt
group_full
```

### Possível link revogado ou inválido

Sinais textuais:

- `invite link was reset`
- `link de convite foi redefinido`
- `this invite link is no longer valid`
- `este link de convite não é mais válido`
- `link inválido`
- `grupo não existe`

Status sugerido:

```txt
invite_revoked
```

### Revisão manual necessária

Quando a página abre, mas a ferramenta não consegue determinar o estado.

Status sugerido:

```txt
manual_review_required
```

## 5. Fluxo de validação recomendado

```txt
1. Usuário clica em Validar
2. Extensão abre o link em nova aba
3. Aguarda carregamento
4. Injeta content-whatsapp.js
5. Lê textos e elementos da página
6. Classifica status provável
7. Retorna para o popup
8. Usuário confirma ou corrige
9. Sistema salva validação
```

## 6. Pseudocódigo

```js
async function validateGroupLink(linkId, url) {
  const tab = await openTab(url);
  await waitForTabLoad(tab.id);

  const result = await injectValidator(tab.id);

  const status = classifyWhatsAppInvitePage(result);

  await updateLink(linkId, {
    validation_status: status,
    last_checked_at: new Date().toISOString()
  });

  return status;
}
```

## 7. Content script de validação

O script deve coletar:

```js
{
  pageTitle: document.title,
  bodyText: document.body.innerText,
  buttons: [...document.querySelectorAll('button, a')].map(el => el.innerText),
  url: location.href
}
```

## 8. Classificador

```js
function classifyWhatsAppInvitePage(payload) {
  const text = `${payload.pageTitle} ${payload.bodyText} ${payload.buttons.join(' ')}`.toLowerCase();

  if (text.includes('group is full') || text.includes('grupo está cheio')) {
    return 'group_full';
  }

  if (
    text.includes('invite link') && text.includes('no longer valid') ||
    text.includes('link de convite') && text.includes('não é mais válido') ||
    text.includes('link inválido')
  ) {
    return 'invite_revoked';
  }

  if (
    text.includes('join chat') ||
    text.includes('join group') ||
    text.includes('entrar no grupo') ||
    text.includes('entrar na conversa')
  ) {
    return 'join_available';
  }

  return 'manual_review_required';
}
```

## 9. Limitações

A validação não deve ser tratada como verdade absoluta, porque:

- O WhatsApp pode alterar textos da página
- A página pode variar por idioma
- Pode haver limitação de sessão
- Alguns estados podem aparecer apenas após interação humana
- Alguns links podem abrir, mas o grupo ainda estar fora do nicho

## 10. Decisão de produto

A validação automática deve ser tratada como:

```txt
Status sugerido
```

E não como:

```txt
Status definitivo
```

O status definitivo deve ser confirmado pelo usuário.
