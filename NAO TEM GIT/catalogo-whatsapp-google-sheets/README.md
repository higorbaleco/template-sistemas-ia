# Catálogo WhatsApp com Google Sheets

Projeto em HTML + JavaScript puro + Google Apps Script + Google Sheets para catálogo, carrinho e geração de pedidos com confirmação real.

## Arquivos

- `index.html`: estrutura da página.
- `app.js`: catálogo, carrinho, checkout, confirmação de pedido e WhatsApp.
- `Code.gs`: API do Google Apps Script.
- `produtos_exemplo.csv`: modelo da aba `Produtos`.
- `pedidos_cabecalho.csv`: cabeçalho da aba `Pedidos`.
- `itens_pedido_cabecalho.csv`: cabeçalho da aba `ItensPedido`.

## Estrutura da planilha

Crie uma planilha com três abas.

### Aba `Produtos`

Colunas obrigatórias:

```text
id,nome,descricao,categoria,preco,imagem,ativo
```

Regras:

- `id`: identificador único do produto.
- `nome`: nome visível no catálogo.
- `descricao`: descrição curta.
- `categoria`: categoria usada no filtro.
- `preco`: número. Exemplo: `24.90`.
- `imagem`: URL pública da imagem.
- `ativo`: use `true` ou `false`.

### Aba `Pedidos`

Colunas:

```text
pedido_id,data_criacao,cliente_id,cliente_nome,telefone,tipo_atendimento,status,subtotal,taxa_entrega,desconto,total,observacoes,cep,rua,numero,complemento,bairro,cidade,referencia,chave_idempotencia
```

### Aba `ItensPedido`

Colunas:

```text
item_id,pedido_id,produto_id,nome_produto,quantidade,preco_unitario,subtotal,observacoes,status,setor_producao
```

Cada item precisa ocupar uma linha própria.

## Configuração do Google Apps Script

1. Abra a planilha.
2. Vá em `Extensões > Apps Script`.
3. Apague o código padrão.
4. Cole o conteúdo do arquivo `Code.gs`.
5. Salve o projeto.
6. Clique em `Implantar > Nova implantação`.
7. Selecione `Aplicativo da Web`.
8. Em `Executar como`, selecione `Eu`.
9. Em `Quem pode acessar`, selecione `Qualquer pessoa`.
10. Clique em `Implantar`.
11. Autorize as permissões.
12. Copie a URL gerada do Web App.

## Configuração do `app.js`

Abra `app.js` e ajuste o bloco `CONFIG`:

```js
const CONFIG = {
  ENVIRONMENT: 'development',
  STORE_ID: 'default-store',
  UNIT_ID: 'main',
  STORE_NAME: 'Minha Loja',
  STORE_SUBTITLE: 'Catálogo digital com pedido direto pelo WhatsApp',
  WHATSAPP_NUMBER: '5544999999999',
  APPS_SCRIPT_URL: 'COLE_AQUI_A_URL_DO_APPS_SCRIPT',
  ENABLE_DEMO_PRODUCTS: true,
};
```

Regras importantes:

- Em desenvolvimento, o app pode usar produtos de demonstração quando a API estiver vazia ou indisponível.
- Em produção, defina `ENVIRONMENT: 'production'` e `ENABLE_DEMO_PRODUCTS: false`.
- O carrinho usa uma chave por loja/unidade para evitar mistura futura de pedidos.

## Fluxo do pedido

1. Cliente acessa o catálogo.
2. Produtos são carregados da aba `Produtos`.
3. Cliente adiciona itens ao carrinho.
4. Cliente preenche nome, telefone, tipo de atendimento e endereço estruturado quando necessário.
5. O front envia apenas `produto_id` e `quantidade` para o servidor, junto com `chave_idempotencia`.
6. O Apps Script recalcula preço, subtotal e total a partir da planilha.
7. O pedido é gravado em `Pedidos` e cada item em `ItensPedido`.
8. O front mostra confirmação e libera o botão para abrir o WhatsApp.

## Comportamento de segurança

- O navegador não envia valores financeiros confiáveis.
- O servidor rejeita itens inexistentes ou inativos.
- O Apps Script evita pedidos duplicados pela `chave_idempotencia`.
- Textos externos são sanitizados antes de gravar na planilha.

## Teste local

Abra o `index.html` com Live Server no VS Code.

Sem URL do Apps Script, o sistema usa produtos de demonstração apenas fora de produção.

## Publicação

Pode publicar como site estático em Netlify, Vercel, Cloudflare Pages ou qualquer hospedagem que aceite HTML, CSS e JavaScript puro.

## Melhorias futuras

- Painel administrativo para cadastrar produtos sem abrir a planilha.
- Controle de taxa de entrega por bairro.
- Horário de funcionamento.
- Cupom de desconto.
- Status do pedido por etapa.
- Impressão automática na cozinha.
- Integração com pagamento via Pix.
