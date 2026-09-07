# Setup de Credenciais — Evolution API

Este guia explica como configurar a credencial da Evolution API no n8n uma única vez, reutilizável em todos os workflows.

## Por que uma credencial?

- **Segurança**: API key fica armazenada no cofre do n8n, nunca exposta em arquivos JSON no git
- **Reutilização**: todos os workflows compartilham a mesma credencial
- **Facilidade**: alterar a chave depois é só um lugar

## Passo a Passo

### 1. Abra n8n

```
http://localhost:5678
```

Faça login se necessário.

### 2. Vá para Credenciais

No menu esquerdo, clique em **Credentials** (ícone de chave 🔑).

### 3. Crie uma Nova Credencial

Clique em **+ New** (ou **Create new credential**).

### 4. Selecione o Tipo

Na caixa de seleção "Credential type", procure por **"Header Auth"** (ou **"Generic Http Basic Auth"** — ambas funcionam para este caso).

Se não achar, use **"Generic Http Basic Auth"** ou até mesmo um **Custom** node com headers manuais.

Selecione **"Header Auth"** → clique **Create**.

### 5. Preencha os Dados

Na tela que abre, você verá campos como:

| Campo | Valor |
|-------|-------|
| **Name** | `Evolution API` (ou outro nome que preferir) |
| **Header Name** | `apikey` |
| **Header Value** | `w1tNrBnMiunsN24` (sua chave da Evolution API) |

Exemplo de preenchimento:

```
Name: Evolution API
Header Name: apikey
Header Value: w1tNrBnMiunsN24
```

> ⚠️ **Nunca** compartilhe ou comita esta chave. Está registrada apenas no cofre do n8n.

### 6. Salve

Clique em **Save** (botão no canto inferior direito).

Você verá uma mensagem de confirmação: "Credentials created successfully."

---

## Usar a Credencial num Workflow

Quando abrir qualquer workflow `.json` desta biblioteca:

1. Procure por um node **HTTP Request** (ex: "GET /instance/fetchInstances")
2. Clique no node
3. No painel à direita, procure por **"Authentication"** ou **"Headers"**
4. Selecione **"Header Auth"** (ou o nome que você deu acima)
5. Uma caixa dropdown ou campo de seleção mostrará **"Evolution API"** (ou o nome salvo)
6. Selecione e o workflow automaticamente injetará a header `apikey: ...`

Pronto! Não precisa repetir em cada node — n8n reutiliza a credencial.

---

## Verificar se Funcionou

1. Abra `00-Setup/Verificar Conexão Evolution API.json`
2. Certifique-se de que o node HTTP Request tem a credencial selecionada
3. Clique em **Test** (ícone de "play" ao lado do nome do node) ou execute o workflow
4. Deve retornar **200 OK** e listar as instâncias (pode estar vazio se nenhuma foi criada)

Se retornar **401 Unauthorized** ou **403 Forbidden**:
- Verifique a chave (copiou corretamente?)
- Verifique se o **Header Name** é `apikey` (case-sensitive)
- Tente atualizar a credencial

---

## Segurança: Não Versionem a Chave

Se o repositório `n8n-workflows` for público ou compartilhado:

1. A chave **nunca** aparece nos arquivos `.json` (fica no cofre do n8n)
2. Mesmo assim, **revise o `.gitignore`** para garantir:

```bash
# Não versionarem:
.env
.env.local
.env.*.local
credentials.json
secrets.json
```

Se por acaso a chave vazar:
1. Gere uma **nova chave** no painel da Evolution API
2. Atualize aqui (`00-Setup/CREDENCIAIS.md` no `Header Value`)
3. Reconfigure no n8n

---

## Próximos Passos

✅ Credencial configurada e salva  
→ Teste com `00-Setup/Verificar Conexão Evolution API.json`  
→ Proceda para `01-Gestao-de-Instancias/`
