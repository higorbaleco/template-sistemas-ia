# Roadmap v2

Baseado nas entregas da v1 e nas pendências levantadas, o próximo ciclo do projeto focará em:

## Fase 1: Enriquecimento de Recursos
- [ ] Adicionar botão "Editar" ao dialog de visualização de prompt customizado.
- [ ] Popular o painel do editor com dados pré-existentes.
- [ ] Integrar chamada de validação automatizada de contraste no CI/CD.

## Fase 2: Otimização de Dados Estáticos
- [ ] Migrar estrutura base (`window.PROMPT_LIBRARY`) para chamada nativa via `fetch()` do arquivo `data/prompts.json` em background.
- [ ] Usar service workers para gerenciar o cache, tornando o PWA nativo 100% confiável offline.

## Fase 3: UI/UX Avançada
- [ ] Incluir micro-interações (Animações CSS com `transform`/`transition` baseadas no framework de design system atual).
- [ ] Permitir reordenação customizada ("Drag and drop") das pastas de favoritos.
