# Lista de Pendências

Não houveram pendências técnicas cruciais baseadas no escopo original. Porém, foram identificados os seguintes itens para polimento futuro:

1. Acessibilidade de contraste das "tags" geradas dinamicamente:
   - A cor primária padrão (`--accent`) aplicada como badge tem bom contraste visual, mas o modo claro (`rgba`) precisará de validação automatizada de acessibilidade via Lighthouse.

2. Funcionalidade de Edição e Atualização de Prompts (CRUD completo):
   - Atualmente, prompts customizados podem ser criados, lidos, exportados, importados e excluídos, mas a funcionalidade de *atualizar/editar* um prompt existente não está implementada na UI.

3. Dados (Data Layer):
   - Avaliar a conversão do script assíncrono `js/prompts.js` para um `fetch('data/prompts.json')` real para melhorar a separação de base de dados estática do bundle JS.
