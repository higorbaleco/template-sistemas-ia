# Catálogo de Treinos

Um cardápio de treinos e exercícios mobile-first, PWA-ready, para Higor e Brenda.

## Conceito

- ✅ Simples: escolher perfil → categoria → treino → marcar checkboxes
- ✅ Mobile-first: otimizado para 390px, toque com uma mão
- ✅ Sem login, sem banco, sem servidor
- ✅ Instalável como PWA
- ✅ Biblioteca de 300+ exercícios e 50+ treinos (meta)

## Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Roteamento**: React Router v6
- **State**: Zustand (perfil + checkboxes em localStorage)
- **Design**: CSS inline (tema grafite/verde)
- **Build**: Vite → dist (estático para Netlify)

## Estrutura

```
src/
  data/
    types.ts           # Tipos TypeScript
    categories.json    # Categorias (9)
    exercises.json     # Exercícios (amostra 10)
    workouts/          # Treinos por categoria (amostra 1)
  lib/
    store.ts           # Zustand: perfil + checks
  pages/
    Home.tsx           # Escolher perfil → categorias
    Categoria.tsx      # Lista de treinos por categoria
    Treino.tsx         # Execução do treino com checkboxes
    Exercicios.tsx     # Biblioteca pesquisável
  components/
    CheckItem.tsx      # Checkbox estilizado
    ExerciseAccordion.tsx  # Detalhes do exercício (expande inline)
    ProgressBar.tsx    # Barra de progresso
    ConfirmDialog.tsx   # Diálogo de confirmação
    BottomNav.tsx      # Navegação inferior (3 tabs)
  App.tsx             # Router
  main.tsx            # Entrada React
```

## Desenvolvimento

```bash
# Instalar
npm install

# Dev (hot reload)
npm run dev

# Build
npm run build

# Preview da build
npm run preview
```

## Status (MVP)

### Implementado ✅
- [x] Scaffold Vite + React + TS
- [x] Store Zustand (perfil + checks localStorage)
- [x] Componentes base (CheckItem, Acordeão, ProgressBar, Diálogo)
- [x] Páginas principais (Home, Categoria, Treino, Exercícios)
- [x] Navegação inferior (Início, Treinos, Exercícios)
- [x] Dados de amostra (10 exercícios, 1 treino completo)
- [x] Tema (grafite + verde, Plus Jakarta Sans)
- [x] Build funcional (194 kB gzip)

### Próximos passos
1. Validação do fluxo completo (screenshots + teste manual)
2. Expandir dados (30+ exercícios, 10+ treinos de amostra)
3. Adicionar conversão de dados de `05.md`, `04.md`, `01.md`
4. Implementar filtros avançados
5. PWA e offline (manifest + SW básico)
6. Deploy Netlify

## Fluxo do Usuário

1. **Home** → Escolhe Higor ou Brenda (salvo em localStorage)
2. **Home (após perfil)** → Clica em categoria (ex. "Academia")
3. **Categoria** → Vê lista de treinos; clica em um (ex. "Peito + Tríceps — Rápido")
4. **Treino** → Vê 3 seções (Aquecimento, Principal, Finalização)
5. Marca cada exercício com checkbox (grande, fácil de tocar)
6. Toca no nome do exercício → Acordeão expande (Como fazer, Erros, Versões)
7. **Barra de progresso** atualiza em tempo real
8. **Botão "Limpar marcações"** → Confirmação obrigatória
9. **Aba "Exercícios"** → Pesquisa + filtros por categoria

## Dados

### Exercício (`Exercise`)
```json
{
  "id": "supino-reto",
  "nome": "Supino Reto",
  "nome_secundario": "Bench Press",
  "descricao": "...",
  "categorias": ["academia", "forca"],
  "musculos": ["peito", "tríceps", "ombros"],
  "movimentos": ["empurrar"],
  "equipamentos": ["barra", "banco"],
  "dificuldade": "iniciante",
  "como_fazer": ["Passo 1...", "Passo 2..."],
  "erros_comuns": ["Erro 1...", "Erro 2..."],
  "versao_facil": "...",
  "versao_dificil": "..."
}
```

### Treino (`Workout`)
```json
{
  "id": "academia-peito-triceps-rapido",
  "nome": "Peito + Tríceps — Rápido",
  "categoria": "academia",
  "nivel": "intermediário",
  "duracao_min": 30,
  "duracao_max": 40,
  "objetivo": "Hipertrofia e força...",
  "aquecimento": [{ "exercise_id": "flexao-apoiada", "series": 1, "repeticoes": "10" }],
  "exercicios": [
    { "exercise_id": "supino-reto", "series": 3, "repeticoes": "8-12", "descanso": "60-90s" }
  ],
  "finalizacao": [{ "exercise_id": "prancha-frontal", "series": 2, "tempo": "30-45s" }]
}
```

## Tema Visual

- **Fundo**: #1a1a1a (preto/grafite)
- **Cards**: #2a2a2a
- **Texto**: #f5f5f5 (off-white)
- **Destaque**: #4CAF50 (verde)
- **Font**: Plus Jakarta Sans (Google Fonts)

## PWA (Roadmap)

```html
<!-- manifest.json (já em place) -->
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#1a1a1a" />
<meta name="apple-mobile-web-app-capable" content="yes" />
```

- [ ] Ícones (192x192, 512x512, maskable)
- [ ] Service Worker (offline)
- [ ] Instalação em tela inicial

## Deploy

```bash
# Netlify
npm run build
# Submeter dist/ para Netlify

# Ou usar netlify.toml (já pronto)
# Redirect /* → /index.html (SPA)
```

## Notas

- LocalStorage persiste checks por sessão (perfil + treino)
- Sem histórico ou gráficos (escopo final define: fora do MVP)
- Dados locais em `/src/data/` (sem API)
- TypeScript strict (noUncheckedIndexedAccess, etc.)
- Sem linting configurado (MVP rápido)

## Roadmap (após validação)

1. Conteúdo: escalar para 300+ exercícios e 50+ treinos
2. Filtros: tempo, local, objetivo, equipamentos
3. Conversão de `05.md`/`04.md` para JSON
4. Aba "Monte meu treino" (wizard simples)
5. Progressões (0 → primeira barra, etc.)
6. Tema light mode (toggle)
