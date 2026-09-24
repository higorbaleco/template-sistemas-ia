# Auditoria da pasta legada `Avraham Partner/`

Auditado em `2026-09-21`, comparando cada arquivo com a árvore canônica atual `AVRAHAM PARTNER NETWORK/` (referência: `00 - ESTRATÉGIA, REGRAS E DECISÕES/12 - Arquitetura canônica do Partner Network.md`).

## Método

- Todo arquivo `.md` de topo foi comparado byte a byte com seu equivalente renumerado em `00 - ESTRATÉGIA, REGRAS E DECISÕES/`.
- Todo arquivo em `materiais/*.html` foi comparado com o material correspondente em `99 - ARQUIVO DE VERSÕES ANTERIORES/` e com os materiais atuais (`index.html`, `materials.css`, `materials.js`).
- Foi feita busca cruzada por `Della`, `Z-API` e `Jogo Rápido` nas duas árvores para garantir que nenhuma referência ficaria órfã.

## Veredito por arquivo

### Documentos `.md` de topo — todos são duplicatas seguras para descarte

| Arquivo legado | Equivalente canônico | Situação |
|---|---|---|
| `00 - ÍNDICE E PLANO DE CONSTRUÇÃO.md` | `01 - Índice e plano de construção.md` | Idêntico + banner de status apontando para a arquitetura canônica |
| `01 - MODELO ECONÔMICO E REGRAS.md` | `02 - Modelo econômico e regras.md` | Byte a byte idêntico |
| `02 - DISTRIBUTION ENGINE - JOGO RÁPIDO.md` | `03 - Distribution Engine - Jogo Rápido.md` | Byte a byte idêntico |
| `03 - REVENUE KIT V1.md` | `04 - Revenue Kit V1.md` | Byte a byte idêntico |
| `04 - HIPÓTESES DE VALIDAÇÃO.md` | `05 - Hipóteses de validação.md` | Byte a byte idêntico |
| `AVRAHAM OPERAÇÃO AUTÔNOMA.md` | `06 - Avraham Operação Autônoma.md` | Byte a byte idêntico |
| `Arquitetura geral do Avraham Partner Network.md` | `07 - Arquitetura geral do Avraham Partner Network.md` | Idêntico + banner de status + 1 frase sobre Z-API reescrita para não usá-lo como comparação pública |
| `O Produto Final.md` | `08 - O Produto Final.md` | Byte a byte idêntico |
| `Plano Partner Avraham.md` | `09 - Plano Partner Avraham.md` | Idêntico + banner de status no topo |

**Nenhum destes 9 arquivos contém número, cliente ou ideia que não exista no arquivo canônico correspondente.** As únicas diferenças são banners de aviso adicionados na versão nova, orientando o leitor a tratar o conteúdo como histórico e a não usar Z-API/Della/Jogo Rápido como regra vigente — exatamente a correção de enquadramento que a Arquitetura Canônica pede na seção 9 (Regras de linguagem).

### Materiais HTML — todos já foram arquivados

Todos os 8 decks/templates de `materiais/` já têm cópia em `AVRAHAM PARTNER NETWORK/99 - ARQUIVO DE VERSÕES ANTERIORES/`:

| Arquivo legado | Cópia já arquivada | Diferença |
|---|---|---|
| `closing-deck.html` | `04-operacao-autonoma-deck.html` | Idêntico |
| `co-branded-jogo-rapido.html` | `05-partner-sales-kit.html` | Só caminhos relativos (`../materials.css`) e tema fixo light |
| `distribution-partner.html` | `03-distribution-deck.html` | Só caminhos relativos e link de rodapé atualizado |
| `executive-brief.html` | `04-executive-brief.html` | Só caminhos relativos e link de rodapé |
| `growth-proposal.html` | `03-growth-proposal.html` | Só caminhos relativos e links de rodapé |
| `partner-growth-calculator.html` | `03-calculator.html` | Só caminhos relativos e link de rodapé |
| `partner-pitch.html` | `02-partner-pitch.html` | Só caminhos relativos e links de rodapé |
| `proposta-base.html` | `04-proposal.html` | Só caminhos relativos e link de rodapé |

Nenhuma diferença de conteúdo, número ou copy — apenas ajustes de link para funcionar dentro da pasta de arquivo.

`index.html` (central de materiais) foi **totalmente reescrito** na árvore nova: a versão legada organizava os materiais por tipo de peça (marketing/comercial/operação) e ainda continha a lógica antiga de "categoria de Partner". A versão atual (`AVRAHAM PARTNER NETWORK/index.html`) organiza pela jornada oficial de 6 passos e usa a linguagem correta (perfis por ativo, não rótulo). A versão antiga foi propositalmente substituída, não apenas movida — é o exemplo mais claro de enquadramento desatualizado nesta pasta.

`materials.css` e `materials.js` na árvore nova são um **superconjunto** do legado: todas as classes antigas (`.field`, `.compact-deck`, `.proposal-cover`, `.phone-preview` etc.) continuam presentes; o novo arquivo apenas acrescenta componentes para o formulário de diagnóstico e a grade de perfis/pipeline. Nenhuma regra de estilo foi perdida.

## Framing desatualizado confirmado (não deve ser reaproveitado como referência)

Confirma-se no `index.html` legado e nos textos de topo:
- Comparação pública direta com Z-API como benchmark de categoria.
- Pizza do Gordo/Della/Jogo Rápido tratados como modelo universal, não como caso pontual.
- Estrutura de navegação por "tipo de material" em vez de por etapa da jornada do Partner.

Isso é exatamente o que a Arquitetura Canônica (seção 9) já instrui a não fazer — e a árvore nova já corrigiu isso em todo lugar.

## Conteúdo único encontrado

**Nenhum.** Toda referência a Della, Z-API, Jogo Rápido e Pizza do Gordo encontrada em `Avraham Partner/` tem par equivalente ou superior em `AVRAHAM PARTNER NETWORK/` (incluindo a pasta dedicada `REFERÊNCIAS Z-API/` e o caso `caso-jogo-rapido-della.html`, que não existiam nesta forma estruturada na pasta legada). Não há número, nome de cliente ou ideia estratégica nesta pasta que não esteja preservado — e em melhor forma — na árvore canônica.

## Recomendação

**Arquivar, não excluir.** Mover a pasta inteira `Avraham Partner/` (ou seu conteúdo) para `AVRAHAM PARTNER NETWORK/99 - ARQUIVO DE VERSÕES ANTERIORES/legado-avraham-partner/`, preservando-a como rastro histórico de como o programa evoluiu — mas fora do caminho principal de trabalho, já que:
1. Os 9 documentos de topo são puramente redundantes (bytes idênticos ou com banner a mais).
2. Os 8 materiais HTML já estão arquivados formalmente em `99 - ARQUIVO DE VERSÕES ANTERIORES/`.
3. `index.html`, `materials.css` e `materials.js` legados são versões estritamente anteriores e piores (framing desatualizado) do que os arquivos atuais na raiz de `AVRAHAM PARTNER NETWORK/`.

Não é necessário migrar nenhum conteúdo adicional antes do arquivamento — a auditoria não encontrou nada que exigisse isso. A exclusão definitiva (delete) só deveria ocorrer depois que o arquivamento acima for confirmado por quem decide, como segunda camada de segurança contra perda de histórico.
