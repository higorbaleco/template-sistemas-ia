# Auditoria de publicação

## Veredito curto

O projeto agora está bem mais perto de um **produto local publicável**: captura manual, auto capture, fila automática, exportação, edição e persistência local já estão funcionais.

Ainda existem pontos de acabamento e robustez antes de prometer “crawler perfeito”, mas a base principal de produto agora está implementada.

## O que já funciona

- Popup com toggle de captura automática e botão de captura manual.
- Content script que roda em todas as páginas.
- Detecção de plataforma para:
  - Google Search
  - Google Maps
  - LinkedIn
  - OLX
  - `directory`
  - `institutional`
  - modo genérico
- Extração de leads a partir do DOM visível.
- Normalização de telefone brasileiro.
- Normalização básica de e-mail.
- Score mais completo por completude e sinal de origem.
- Deduplicação por telefone, e-mail, LinkedIn, site ou fallback por origem.
- Dashboard com:
  - busca
  - filtro por origem
  - edição manual
  - exclusão
  - exportação CSV
  - abertura de WhatsApp e LinkedIn
- Fila automática em abas temporárias com retomada de estado local.
- Persistência local em `chrome.storage.local`.

## O que ainda precisa de refinamento

- A fila automática agora existe de verdade, mas ainda depende do DOM visível e pode falhar em páginas pesadas, dinâmicas ou protegidas.
- Os adaptadores de `directory` e `institutional` são úteis, mas ainda heurísticos.
- O adaptador genérico melhorou bastante, mas ainda pode gerar ruído em páginas muito abertas ou mal estruturadas.
- Ainda faltam testes de integração com `chrome.*` e do fluxo completo de fila.
- A política de privacidade e o texto base da Chrome Web Store já existem, mas ainda precisam de revisão final antes da publicação.

## Problemas de lógica e produto

### 1. Fila automática

A fila já existe de verdade, mas o próximo passo de qualidade é endurecer retry/timeout e validar a retomada em cenários reais.

### 2. Deduplicação

O fallback por origem ainda pode gerar duplicatas em cenários de captura parcial antes da captura completa.

Melhoria sugerida:

- chave composta com prioridade maior para dados normalizados
- união de múltiplas evidências por lead
- estratégia explícita para merges incompletos

### 3. Score

O score agora considera mais sinais do lead, mas ainda é uma heurística de completude, não um modelo de qualidade real.

Melhorias úteis:

- peso maior para telefone válido e e-mail válido
- peso por fonte confiável
- peso por completude de nome + empresa + cargo
- penalidade para dados repetidos ou muito genéricos

### 4. Auto capture

O `MutationObserver` ainda pode ficar ruidoso em páginas muito dinâmicas.

Melhoria sugerida:

- dedupe mais agressivo
- debounce por URL e por janela temporal
- desativar auto capture em páginas muito mutáveis quando necessário

### 5. Cobertura de plataforma

Google Search, Google Maps, LinkedIn, OLX, `directory` e `institutional` já têm tratamento.

O que falta agora é ampliar a precisão dos heurísticos em casos de borda.

## Já dá para usar?

Sim, **como MVP local com fila automática**.

Eu publicaria com a narrativa:

- captura local de leads
- fila automática dentro do Chrome
- suporte a páginas mais comuns
- exportação CSV
- edição e organização dos dados

Eu **não publicaria ainda** com a promessa de:

- coleta avançada em qualquer site sem revisão humana
- precisão perfeita em páginas dinâmicas ou protegidas

## O que eu recomendo antes de publicar

1. Revisar a política de privacidade e a copy da Chrome Web Store.
2. Adicionar uma tela curta de onboarding ou tooltip no popup.
3. Adicionar testes para:
   - adapters
   - storage merge
   - export CSV
   - background message handlers
   - fila automática
4. Incluir screenshots de uso real.

## Status para loja

- **Pronto como MVP interno:** sim
- **Pronto para Chrome Web Store com narrativa honesta:** quase
- **Pronto como produto automático completo:** ainda não
