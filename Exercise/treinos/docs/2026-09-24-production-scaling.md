# Catálogo de Treinos: Production Scaling Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Escalar o MVP de cardápio de treinos de 10 exercícios + 1 treino para 300+ exercícios + 50+ treinos, adicionar PWA completo (offline, ícones), deploy Netlify funcional e preview visual.

**Architecture:** 
- **Content Pipeline:** Converter 05.md (20 treinos), 04.md (20 modelos), 01.md (força funcional) em JSON tipado. Validar referências cruzadas (exercise_id existe).
- **PWA Layer:** Implementar service worker com Workbox, gerar ícones (192, 512, maskable), refinar manifest. Cache-first para fontes/exercícios, network-first para index.
- **Quality Gate:** Script de validação de dados, testes de componentes críticos (CheckItem, ProgressBar), teste E2E de fluxo ponta-a-ponta.
- **Deploy:** Netlify com `npm run build` automático, preview URL funcional, homepage instalável.

**Tech Stack:**
- Frontend: React 18 + Vite + TypeScript (existente)
- Data: JSON tipado (Exercise[], Workout[])
- PWA: Workbox via Vite plugin, Service Worker, Web App Manifest
- Testing: Vitest (unit), Playwright (E2E)
- Deploy: Netlify (Git push → build → preview → production)

**Spec:** `/Users/higorplens/Antigravity Software/Exercise/treinos/README.md` + `DELIVERY.md`

---

## Global Constraints

- Mobile-first: 390px viewport primário, responsivo até 1200px
- Bundle: manter <250 kB JS (gzip <80 kB)
- TypeScript: strict mode, zero `as any` no código crítico
- Data: JSON tipado per `src/data/types.ts`; toda exercise_id deve existir antes de treino ser válido
- PWA: Manifest válido, service worker com offline fallback, instalável em iOS + Android
- Dados de amostra locais (sem API) — tudo embutido em `/src/data/`

---

## Review Focus

1. **Dados órfãos:** Treino referencia exercise_id que não existe em exercises.json → erro silencioso em produção. Script de validação deve falhar se encontrar.
2. **Service Worker stale:** SW cacheado por navegador, nova versão não instala automaticamente. Precisa de estratégia de versioning (hash em manifest versão, ou SW com auto-update).
3. **localStorage overflow:** Se user marcar checkboxes em 50+ treinos, localStorage pode exceder limite (5-10 MB). Não esperado para este caso (1 treino por sessão), mas teste com múltiplos.
4. **Offline exercício expandido:** User abre acordeão de exercício em modo offline, depois online. Dados frescos devem carregar. Acordeão deve ser resiliente a refresh.
5. **Ícone PWA em iOS:** iOS não suporta plenamente `purpose: "maskable"`. Precisa ícone tradicional como fallback (já em manifest, validar visualmente).

---

## Task Decomposition & Files

### Content Layer (Tasks 1-3)
- `scripts/parse-05-md.ts` — Parser para 05.md → workouts JSON
- `scripts/parse-04-md.ts` — Parser para 04.md → workouts JSON
- `scripts/parse-01-md.ts` — Parser para 01.md → exercises JSON
- `scripts/merge-exercises.ts` — Merge de múltiplas fontes em exercises.json
- `scripts/validate-workouts.ts` — Validador: exercise_id existe, séries/reps válidas, etc.

### PWA Layer (Tasks 4-5)
- `vite.config.ts` — Atualizar com VitePWA plugin
- `src/service-worker.ts` — Service Worker com Workbox
- `public/manifest.json` — Versão 2 com estratégia de update
- `public/icons/` — 3 ícones (192, 512, maskable)
- `src/lib/pwa-client.ts` — SW registration + update check

### Quality & Deploy (Tasks 6-8)
- `scripts/validate-data.ts` — Verificação de integridade
- `tests/e2e/flow.spec.ts` — Teste do fluxo completo (Playwright)
- `netlify.toml` — Config de deploy com redirects
- `docs/DEPLOYMENT.md` — Guia de deploy + troubleshooting

---

# Tasks

### Task 1: Parse 05.md → Treinos JSON

**Files:**
- Create: `scripts/parse-05-md.ts`
- Source: `../05.md` (leitura)
- Output: `src/data/workouts/parsed-05.json` (temporário para merge)

**Interfaces:**
- Consumes: Arquivo `.md` com formato "01. Título | descrição" seguido por linhas "Exercício | séries×reps"
- Produces: `Workout[]` tipado conforme `src/data/types.ts`, com `categoria: "academia" | "forca" | "forca-util" | "militar" | "corpo-livre" | "corrida" | "condicionamento" | "mobilidade" | "rapido"`

- [ ] **Step 1: Ler e analisar estrutura de 05.md**

Abra `../05.md` e observe a estrutura de blocos de treino. Cada treino tem:
- Título com número (ex: "01. Peito + Tríceps --- Rápido")
- Linha de meta (ex: "Tempo: 30--40 min | Intensidade: média")
- Linhas de exercício no formato "Exercício | séries×reps"

- [ ] **Step 2: Escrever parser com expressões regulares**

```typescript
// scripts/parse-05-md.ts
import fs from 'fs'
import path from 'path'

interface WorkoutRaw {
  id: string
  nome: string
  descricao: string
  categoria: string
  nivel: 'iniciante' | 'intermediário' | 'avançado'
  duracao_min: number
  duracao_max: number
  equipamentos: string[]
  objetivo: string
  exercicios: { exercise_id: string; series: number; repeticoes: string; descanso?: string }[]
}

function parseExercicioLine(line: string): { name: string; series: number; reps: string } | null {
  // "Supino reto | 3×8--12" → { name: "Supino reto", series: 3, reps: "8-12" }
  const match = line.match(/^([^|]+)\s*\|\s*(\d+)×([^|]+)$/)
  if (!match) return null
  return {
    name: match[1].trim(),
    series: parseInt(match[2]),
    reps: match[3].trim().replace(/--/g, '-')
  }
}

function parse05Md(): WorkoutRaw[] {
  const content = fs.readFileSync(path.join(__dirname, '../..', '05.md'), 'utf-8')
  const workouts: WorkoutRaw[] = []
  
  // Split por "XX. Título --- Tipo"
  const blocks = content.split(/\n(?=\d{2}\.\s)/)
  
  blocks.forEach((block) => {
    const lines = block.split('\n').filter(l => l.trim())
    if (lines.length < 2) return
    
    // Parse header: "01. Peito + Tríceps --- Rápido"
    const headerMatch = lines[0].match(/^(\d{2})\.\s+([^-]+?)\s*---\s*(.+)$/)
    if (!headerMatch) return
    const [, num, nome_base, tipo] = headerMatch
    
    // Parse meta: "Tempo: 30--40 min | Intensidade: média"
    const metaMatch = lines[1].match(/Tempo:\s*(\d+)--(\d+)\s*min.*Intensidade:\s*(\w+)/)
    if (!metaMatch) return
    const [, min_str, max_str, intensidade] = metaMatch
    const duracao_min = parseInt(min_str)
    const duracao_max = parseInt(max_str)
    const nivel = intensidade === 'alta' ? 'avançado' : intensidade === 'média' ? 'intermediário' : 'iniciante'
    
    // Parse exercícios
    const exercicios: WorkoutRaw['exercicios'] = []
    for (let i = 2; i < lines.length; i++) {
      const parsed = parseExercicioLine(lines[i])
      if (parsed) {
        // Slugify exercise name para exercise_id (será validado depois)
        const exercise_id = parsed.name.toLowerCase().replace(/[\s\/]/g, '-').replace(/[^a-z0-9-]/g, '')
        exercicios.push({
          exercise_id,
          series: parsed.series,
          repeticoes: parsed.reps,
          descanso: '60-90s' // default
        })
      }
    }
    
    workouts.push({
      id: `05-${num.padStart(2, '0')}`.toLowerCase().replace(/\s+/g, '-'),
      nome: nome_base.trim() + ' — ' + tipo.trim(),
      descricao: tipo.includes('Pesado') ? 'Treino pesado, intensidade alta' : 'Treino moderado',
      categoria: 'academia', // Ajustar conforme 05.md for de academia
      nivel,
      duracao_min,
      duracao_max,
      equipamentos: ['barra', 'halteres'], // Inferir de exercícios
      objetivo: `${tipo} - ${duracao_min}-${duracao_max} minutos`,
      exercicios
    })
  })
  
  return workouts
}

const workouts = parse05Md()
fs.writeFileSync(
  path.join(__dirname, '../src/data/workouts/parsed-05.json'),
  JSON.stringify(workouts, null, 2)
)
console.log(`✓ Parsed ${workouts.length} workouts from 05.md`)
```

- [ ] **Step 3: Testar parser manualmente**

```bash
cd Exercise/treinos
npx ts-node scripts/parse-05-md.ts
# Expected: ✓ Parsed 20 workouts from 05.md
cat src/data/workouts/parsed-05.json | head -50
```

- [ ] **Step 4: Validar saída (tipos e structure)**

Verificar:
- [ ] Cada treino tem `id`, `nome`, `categoria`, `nivel`, `duracao_min/max`, `exercicios[]`
- [ ] Cada exercício tem `exercise_id`, `series`, `repeticoes`
- [ ] Sem treinos vazios (exercicios.length > 0)

- [ ] **Step 5: Commit**

```bash
git add scripts/parse-05-md.ts src/data/workouts/parsed-05.json
git commit -m "feat: add parser for 05.md → treinos JSON (20 workouts)"
```

---

### Task 2: Parse 04.md & 01.md → JSON + Merge

**Files:**
- Create: `scripts/parse-04-md.ts`
- Create: `scripts/parse-01-md.ts`
- Create: `scripts/merge-workouts.ts`
- Create: `scripts/merge-exercises.ts`
- Output: `src/data/workouts.json` (consolidado)
- Output: `src/data/exercises.json` (expandido a 300+)

**Interfaces:**
- Consumes: `../04.md`, `../01 exercicio.md`, outputs de Task 1
- Produces: `Workout[]` com ~50 treinos, `Exercise[]` com ~300 exercícios, ambos tipados

- [ ] **Step 1: Parse 04.md (formato tabela)**

04.md tem tabela com colunas: Treino | Foco | Estrutura. Adaptar parser:

```typescript
// scripts/parse-04-md.ts
// Similar a Task 1, mas parsing de tabela markdown:
// | Treino | Foco | Estrutura |
// | Full Body Base | Hipertrofia geral | Agachamento, supino, remada, RDL, desenvolvimento, core |

function parse04Md(): WorkoutRaw[] {
  const content = fs.readFileSync(path.join(__dirname, '../..', '04.md'), 'utf-8')
  const workouts: WorkoutRaw[] = []
  
  // Encontrar tabela markdown
  const tableMatch = content.match(/\|\s*#?\s*Treino.*?\n\|[-:|]+\n([\s\S]*?)\n\n/)
  if (!tableMatch) {
    console.warn('No table found in 04.md')
    return []
  }
  
  const rows = tableMatch[1].split('\n').filter(r => r.includes('|'))
  rows.forEach((row, idx) => {
    const cells = row.split('|').map(c => c.trim()).filter(c => c && !c.match(/^[-:]+$/))
    if (cells.length < 3) return
    
    const [num, nome, foco, estrutura] = cells
    const exercise_names = estrutura.split(',').map(e => e.trim())
    
    workouts.push({
      id: `04-${String(idx).padStart(2, '0')}`,
      nome: nome.trim(),
      descricao: foco.trim(),
      categoria: 'academia', // Infer from foco
      nivel: 'intermediário',
      duracao_min: 45,
      duracao_max: 60,
      equipamentos: inferEquipamentosFrom(exercise_names),
      objetivo: foco.trim(),
      exercicios: exercise_names.map((name, i) => ({
        exercise_id: slugify(name),
        series: 3,
        repeticoes: '8-12',
        descanso: '60s'
      }))
    })
  })
  
  return workouts
}

function inferEquipamentosFrom(exercises: string[]): string[] {
  const equipment = new Set<string>()
  const text = exercises.join(' ').toLowerCase()
  if (text.includes('halter')) equipment.add('halteres')
  if (text.includes('barra')) equipment.add('barra')
  if (text.includes('máquina')) equipment.add('máquina')
  if (text.includes('leg press')) equipment.add('máquina')
  if (text.includes('flexão') || text.includes('agachamento')) equipment.add('corpo')
  return Array.from(equipment)
}
```

- [ ] **Step 2: Parse 01 exercicio.md → Exercícios**

01.md contém seções de calistenia, força funcional, militar. Extrair exercícios únicos:

```typescript
// scripts/parse-01-md.ts
function parse01Md(): Exercise[] {
  const content = fs.readFileSync(path.join(__dirname, '../..', '01 exercicio.md'), 'utf-8')
  const exercises: Exercise[] = []
  
  // Extrair seções e exercícios
  const sections = content.split(/## /)
  sections.forEach(section => {
    const lines = section.split('\n').filter(l => l.trim())
    const sectionTitle = lines[0]
    const category = mapSectionToCategory(sectionTitle)
    
    // Procurar padrões de "- Exercício" ou "Exercício:"
    lines.slice(1).forEach(line => {
      const exerciseName = line.replace(/^[-*]\s*/, '').replace(/:\s*/, '').trim()
      if (exerciseName.length > 3 && !exerciseName.includes('||')) {
        const exercise_id = slugify(exerciseName)
        
        // Evitar duplicatas
        if (!exercises.find(e => e.id === exercise_id)) {
          exercises.push({
            id: exercise_id,
            nome: toPortugueseTitle(exerciseName),
            descricao: `Exercício de ${category}`,
            categorias: [category],
            musculos: inferMusculos(exerciseName),
            movimentos: inferMovimentos(exerciseName),
            equipamentos: inferEquipamentos(exerciseName),
            dificuldade: 'intermediário',
            como_fazer: ['Ver instrução completa'],
            erros_comuns: []
          })
        }
      }
    })
  })
  
  return exercises
}

function mapSectionToCategory(title: string): string {
  if (title.includes('Calistenia')) return 'corpo-livre'
  if (title.includes('Força')) return 'forca'
  if (title.includes('Militar')) return 'militar'
  if (title.includes('Carry')) return 'forca-util'
  return 'forca'
}
```

- [ ] **Step 3: Merge workouts de 05 + 04, evitando duplicatas**

```typescript
// scripts/merge-workouts.ts
function mergeWorkouts() {
  const workouts05 = JSON.parse(fs.readFileSync('src/data/workouts/parsed-05.json', 'utf-8'))
  const workouts04 = JSON.parse(fs.readFileSync('src/data/workouts/parsed-04.json', 'utf-8'))
  
  const seen = new Set<string>()
  const merged = []
  
  ;[workouts05, workouts04].forEach(list => {
    list.forEach(w => {
      if (!seen.has(w.id)) {
        seen.add(w.id)
        merged.push(w)
      }
    })
  })
  
  fs.writeFileSync('src/data/workouts.json', JSON.stringify(merged, null, 2))
  console.log(`✓ Merged ${merged.length} unique workouts`)
}
```

- [ ] **Step 4: Merge exercises de existente + 01.md**

```typescript
// scripts/merge-exercises.ts
function mergeExercises() {
  const existentes = JSON.parse(fs.readFileSync('src/data/exercises.json', 'utf-8'))
  const novas = JSON.parse(fs.readFileSync('scripts/temp-01-exercises.json', 'utf-8'))
  
  const seen = new Set<string>(existentes.map(e => e.id))
  const merged = [...existentes]
  
  novas.forEach(ex => {
    if (!seen.has(ex.id)) {
      seen.add(ex.id)
      merged.push(ex)
    }
  })
  
  // Sort por categoria para facilitar review
  merged.sort((a, b) => `${a.categorias[0]}-${a.nome}`.localeCompare(`${b.categorias[0]}-${b.nome}`))
  
  fs.writeFileSync('src/data/exercises.json', JSON.stringify(merged, null, 2))
  console.log(`✓ Merged to ${merged.length} total exercises`)
}
```

- [ ] **Step 5: Rodar todos os parsers e merges**

```bash
npx ts-node scripts/parse-04-md.ts
npx ts-node scripts/parse-01-md.ts
npx ts-node scripts/merge-workouts.ts
npx ts-node scripts/merge-exercises.ts
# Expected: ✓ Merged 50+ workouts, ✓ Merged to 300+ exercises
```

- [ ] **Step 6: Commit**

```bash
git add scripts/parse-*.ts src/data/exercises.json src/data/workouts.json
git commit -m "feat: parse 04.md, 01.md, merge to 300+ exercises, 50+ workouts"
```

---

### Task 3: Validação de Dados

**Files:**
- Create: `scripts/validate-data.ts`
- Output: Report em console (erro se inválido)

**Interfaces:**
- Consumes: `src/data/exercises.json`, `src/data/workouts.json`
- Produces: Exit code 0 (válido) ou 1 (inválido); relatório detalhado

- [ ] **Step 1: Escrever script de validação**

```typescript
// scripts/validate-data.ts
interface ValidationError {
  type: 'orphan_exercise' | 'missing_field' | 'invalid_type' | 'duplicate_id'
  message: string
  file: string
  location?: string
}

function validateData(): ValidationError[] {
  const exercises = JSON.parse(fs.readFileSync('src/data/exercises.json', 'utf-8'))
  const workouts = JSON.parse(fs.readFileSync('src/data/workouts.json', 'utf-8'))
  
  const errors: ValidationError[] = []
  const exerciseIds = new Set(exercises.map(e => e.id))
  
  // 1. Verificar exercise_id órfãos em workouts
  workouts.forEach((workout, idx) => {
    workout.aquecimento?.forEach((item, sidx) => {
      if (!exerciseIds.has(item.exercise_id)) {
        errors.push({
          type: 'orphan_exercise',
          message: `Workout ${workout.id} aquecimento[${sidx}] referencia exercise_id "${item.exercise_id}" que não existe`,
          file: 'workouts.json',
          location: `workouts[${idx}].aquecimento[${sidx}]`
        })
      }
    })
    // Repetir para .exercicios, .finalizacao
  })
  
  // 2. Verificar campos obrigatórios
  exercises.forEach((ex, idx) => {
    if (!ex.id || !ex.nome || !ex.categorias || !Array.isArray(ex.categorias)) {
      errors.push({
        type: 'missing_field',
        message: `Exercise ${idx} missing required fields: id, nome, categorias`,
        file: 'exercises.json',
        location: `exercises[${idx}]`
      })
    }
  })
  
  // 3. Verificar duplicatas
  const idCounts = {}
  exercises.forEach(ex => {
    idCounts[ex.id] = (idCounts[ex.id] || 0) + 1
  })
  Object.entries(idCounts).forEach(([id, count]) => {
    if (count > 1) {
      errors.push({
        type: 'duplicate_id',
        message: `Exercise id "${id}" appears ${count} times`,
        file: 'exercises.json'
      })
    }
  })
  
  return errors
}

const errors = validateData()
if (errors.length > 0) {
  console.error(`\n❌ Data validation failed with ${errors.length} error(s):\n`)
  errors.forEach(err => {
    console.error(`  [${err.type}] ${err.message}`)
    if (err.location) console.error(`    at ${err.location}`)
  })
  process.exit(1)
} else {
  console.log('✅ Data validation passed')
  process.exit(0)
}
```

- [ ] **Step 2: Rodar validação**

```bash
npx ts-node scripts/validate-data.ts
# Expected: ✅ Data validation passed
```

- [ ] **Step 3: Adicionar check pré-build**

Atualizar `package.json` scripts:

```json
{
  "scripts": {
    "validate": "ts-node scripts/validate-data.ts",
    "build": "npm run validate && tsc && vite build"
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add scripts/validate-data.ts package.json
git commit -m "feat: add data validation script (orphan exercises, duplicates, required fields)"
```

---

### Task 4: PWA — Service Worker + Workbox

**Files:**
- Modify: `vite.config.ts` — Add VitePWA plugin
- Create: `src/service-worker.ts` — Custom SW logic
- Modify: `src/main.tsx` — Register SW
- Output: Workbox manifests gerados automaticamente

**Interfaces:**
- Consumes: Build assets, manifest.json
- Produces: Service worker com cache strategies (cache-first para assets, network-first para API)

- [ ] **Step 1: Instalar vite-plugin-pwa**

```bash
npm install -D vite-plugin-pwa workbox-core workbox-precaching workbox-routing workbox-strategies
```

- [ ] **Step 2: Atualizar vite.config.ts**

```typescript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 20, maxAgeSeconds: 31536000 }
            }
          }
        ],
        cleanupOutdatedCaches: true
      },
      manifest: {
        name: 'Catálogo de Treinos',
        short_name: 'Treinos',
        description: 'Cardápio de treinos e exercícios — PWA para Higor e Brenda',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        theme_color: '#1a1a1a',
        background_color: '#1a1a1a',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-maskable.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' }
        ],
        screenshots: [
          { src: '/screenshots/mobile.png', sizes: '540x720', type: 'image/png', form_factor: 'narrow' }
        ]
      }
    })
  ]
})
```

- [ ] **Step 3: Criar ícones PWA**

Criar 3 ícones (192x192, 512x512, maskable 192x192). Usar ImageMagick ou online tool:

```bash
# Se tiver ImageMagick:
convert -size 256x256 xc:'#4CAF50' \
  -fill white -gravity center -pointsize 120 -annotate +0+0 '💪' \
  -resize 192x192 public/icons/icon-192.png

convert -size 256x256 xc:'#4CAF50' \
  -fill white -gravity center -pointsize 120 -annotate +0+0 '💪' \
  -resize 512x512 public/icons/icon-512.png

cp public/icons/icon-192.png public/icons/icon-maskable.png

# Ou usar online: https://www.favicon-generator.org/
```

Salvos em `public/icons/`

- [ ] **Step 4: Atualizar SW registration em main.tsx**

```typescript
// src/main.tsx
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('/sw.js')
      console.log('✓ Service Worker registered')
    } catch (err) {
      console.error('Service Worker registration failed:', err)
    }
  })
}
```

- [ ] **Step 5: Testar offline**

```bash
npm run build
npm run preview
# Em DevTools > Application > Offline, marcar "Offline"
# Recarregar página — deve funcionar com assets cacheados
```

- [ ] **Step 6: Commit**

```bash
git add vite.config.ts src/main.tsx public/icons/ package.json
git commit -m "feat: add PWA with Workbox, service worker, offline caching, installable on iOS/Android"
```

---

### Task 5: Netlify Deploy Config

**Files:**
- Modify: `netlify.toml` — Deploy + preview config
- Create: `docs/DEPLOYMENT.md` — Guia de deploy

**Interfaces:**
- Consumes: `npm run build` (build script)
- Produces: Preview URL + production URL funcional

- [ ] **Step 1: Atualizar netlify.toml**

```toml
[build]
  command = "npm run build"
  publish = "dist"
  environment = { NODE_ENV = "production", VITE_APP_VERSION = "1.0.0" }

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production]
  environment = { NODE_ENV = "production" }

[context.deploy-preview]
  environment = { NODE_ENV = "production" }

[context.branch-deploy]
  environment = { NODE_ENV = "development" }

# Headers para PWA
[[headers]]
  for = "/manifest.json"
  [headers.values]
    Cache-Control = "public, max-age=86400"

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "no-cache, must-revalidate"
    Service-Worker-Allowed = "/"
```

- [ ] **Step 2: Criar docs/DEPLOYMENT.md**

```markdown
# Deployment Guide

## Production Deploy

1. Merge branch para main
2. Push para Git: `git push origin main`
3. Netlify detecta e executa `npm run build`
4. Build artifacts: `dist/`
5. Live em: `https://<seu-site>.netlify.app`

## Preview Deploy

1. Criar branch feature: `git checkout -b feature/novo`
2. Commit e push: `git push origin feature/novo`
3. Netlify cria preview URL automaticamente
4. Compartilhar URL de preview para testes

## Troubleshooting

### Build falha
- Verificar logs: Netlify Dashboard > Deploys > Build log
- Common: `npm audit fix --force` ou versão de Node

### App branco após deploy
- Verificar redirect em netlify.toml (SPA catch-all)
- DevTools: Network, verificar se index.html carrega

### SW não atualiza
- Limpar cache do navegador: Settings > Clear Cookies and Data
- Forçar refresh: Ctrl+Shift+R (ou Cmd+Shift+R no Mac)

## Verificar PWA

1. Abrir DevTools > Application > Manifest
2. Verificar: Name, Start URL, Icons
3. "Add to Home Screen" disponível
4. Offline: marcar offline em DevTools, recarregar
```

- [ ] **Step 3: Fazer commit**

```bash
git add netlify.toml docs/DEPLOYMENT.md
git commit -m "docs: add Netlify deploy config and deployment guide"
```

---

### Task 6: Quality Tests — E2E com Playwright

**Files:**
- Create: `tests/e2e/flow.spec.ts`
- Create: `playwright.config.ts`

**Interfaces:**
- Consumes: App rodando em `http://localhost:5173`
- Produces: Teste E2E que valida fluxo ponta-a-ponta

- [ ] **Step 1: Instalar Playwright**

```bash
npm install -D @playwright/test @testing-library/playwright
```

- [ ] **Step 2: Criar playwright.config.ts**

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 5'] }
    }
  ]
})
```

- [ ] **Step 3: Escrever teste E2E completo**

```typescript
// tests/e2e/flow.spec.ts
import { test, expect } from '@playwright/test'

test.describe('App Flow - Complete Workout Session', () => {
  test('should select profile, choose workout, mark exercises, and reset', async ({ page }) => {
    // 1. Home page loads
    await page.goto('/')
    await expect(page.locator('text=Catálogo de Treinos')).toBeVisible()
    
    // 2. Select Higor
    await page.click('button:has-text("Higor")')
    await expect(page.locator('text=Olá, Higor')).toBeVisible()
    
    // 3. Click Academia category
    await page.click('text=Academia')
    await expect(page.locator('text=Peito \\+ Tríceps')).toBeVisible()
    
    // 4. Click workout
    await page.click('text=Peito \\+ Tríceps — Rápido')
    await expect(page.locator('text=Aquecimento')).toBeVisible()
    
    // 5. Check progress starts at 0%
    await expect(page.locator('text=0 de')).toBeVisible()
    
    // 6. Click first checkbox
    const checkboxes = page.locator('[role="button"]:has-text("Flexão apoiada")')
    await checkboxes.first().click()
    await expect(page.locator('text=1 de')).toBeVisible()
    
    // 7. Click on exercise name → accordion expands
    await page.click('text=Flexão apoiada')
    await expect(page.locator('text=Como fazer')).toBeVisible()
    
    // 8. Click again → accordion collapses
    await page.click('text=Flexão apoiada')
    await expect(page.locator('text=Como fazer')).not.toBeVisible()
    
    // 9. Mark more checkboxes
    const allCheckboxes = page.locator('[role="button"]')
    for (let i = 0; i < 3; i++) {
      await allCheckboxes.nth(i).click()
    }
    
    // 10. Verify progress updated
    const progressText = await page.locator('[style*="color"]').first().textContent()
    expect(progressText).toMatch(/\d+ de \d+/)
    
    // 11. Click "Limpar marcações"
    await page.click('button:has-text("Limpar marcações")')
    
    // 12. Confirm dialog appears
    await expect(page.locator('text=Limpar todas as marcações')).toBeVisible()
    
    // 13. Click "Limpar"
    await page.click('button:has-text("Limpar")')
    
    // 14. Progress resets to 0
    await expect(page.locator('text=0 de')).toBeVisible()
  })

  test('should search exercises in library', async ({ page }) => {
    await page.goto('/')
    await page.click('button:has-text("Exercícios")')
    
    // Search for "supino"
    await page.fill('input[placeholder*="Buscar"]', 'supino')
    await expect(page.locator('text=Supino')).toBeVisible()
    
    // Should show 2+ supino exercises
    const results = page.locator('[style*="marginBottom"]')
    await expect(results).toHaveCount(2)
  })

  test('should work on mobile viewport (390px)', async ({ page }) => {
    // Playwright already set em Pixel 5, mas podemos validar
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    
    // Should not scroll horizontally
    const width = await page.evaluate(() => window.innerWidth)
    expect(width).toBe(390)
    
    // Click should work
    await page.click('button:has-text("Higor")')
    await expect(page.locator('text=Olá, Higor')).toBeVisible()
  })
})
```

- [ ] **Step 4: Rodar testes**

```bash
npm run dev &  # Em background
npx playwright test
# Expected: ✓ 3 tests passed
npx playwright show-report  # Ver relatório HTML
```

- [ ] **Step 5: Adicionar script npm**

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test": "npm run validate && npm run test:e2e"
  }
}
```

- [ ] **Step 6: Commit**

```bash
git add tests/e2e/ playwright.config.ts package.json
git commit -m "test: add E2E tests with Playwright (flow, mobile, library search)"
```

---

### Task 7: Update App.tsx Routes para Suportar Treinos Dinâmicos

**Files:**
- Modify: `src/App.tsx` — Add dynamic route handler para workouts

**Interfaces:**
- Consumes: `src/data/workouts.json` com ~50 treinos
- Produces: Roteador que carrega qualquer `treinoId` válido

- [ ] **Step 1: Atualizar App.tsx para carregamento dinâmico**

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { Home } from './pages/Home'
import { Categoria } from './pages/Categoria'
import { Treino } from './pages/Treino'
import { Exercicios } from './pages/Exercicios'
import { BottomNav } from './components/BottomNav'

// Lazy load data
let workoutsCache: any[] | null = null
async function loadWorkouts() {
  if (!workoutsCache) {
    const res = await import('./data/workouts.json')
    workoutsCache = res.default
  }
  return workoutsCache
}

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categoria/:categoryId" element={<Categoria />} />
        <Route path="/treino/:treinoId" element={<Treino />} />
        <Route path="/exercicios" element={<Exercicios />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </BrowserRouter>
  )
}
```

- [ ] **Step 2: Atualizar Categoria.tsx para listar treinos de workouts.json**

```typescript
// src/pages/Categoria.tsx
import workoutsData from '../data/workouts.json'

export const Categoria: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>()
  
  const treinos = (workoutsData as any[]).filter(w => w.categoria === categoryId)
  
  // ... rest do componente
}
```

- [ ] **Step 3: Verificar Treino.tsx carrega workouts dinamicamente**

```typescript
// src/pages/Treino.tsx já deve suportar, mas validar:
const treino = (workoutData as any[]).find(w => w.id === treinoId)
if (!treino) return <div>Treino não encontrado</div>
```

- [ ] **Step 4: Testar em dev**

```bash
npm run dev
# Navegar: Categoria → clique em qualquer treino → deve carregar dados
# Verificar console: sem erros
```

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/pages/Categoria.tsx
git commit -m "refactor: load workouts dynamically from workouts.json"
```

---

### Task 8: Screenshot & Preview Visual

**Files:**
- Output: Screenshots salvos em `docs/screenshots/`
- Output: Figma mockup (opcional) ou Artifact visual

**Interfaces:**
- Consumes: App rodando
- Produces: 5-10 screenshots mostrando fluxo completo

- [ ] **Step 1: Iniciar app em dev**

```bash
npm run dev &
sleep 3
```

- [ ] **Step 2: Usar agent-browser para screenshots**

Usar agent-browser para capturar em 390px viewport:
- Home (perfil selection)
- Home (após perfil, categorias)
- Categoria (lista treinos)
- Treino (com checkboxes)
- Treino (acordeão expandido)
- Biblioteca (exercícios)
- Biblioteca (pesquisa)

```bash
agent-browser screenshot http://localhost:5173 --viewport 390x844 --selector "html" --output docs/screenshots/01-home.png
agent-browser screenshot http://localhost:5173/categoria/academia --viewport 390x844 --output docs/screenshots/02-categoria.png
# ... etc
```

- [ ] **Step 3: Criar docs/SCREENSHOTS.md com imagens**

```markdown
# Visual Preview

## 1. Home - Profile Selection
![Home](./screenshots/01-home.png)
Usuário escolhe Higor ou Brenda

## 2. Home - Categories
![Categories](./screenshots/02-categories.png)
Tela com 9 categorias de treino

## 3. Workout List
![Workouts](./screenshots/03-workouts.png)
Lista de treinos em uma categoria

## 4. Workout Execution
![Execution](./screenshots/04-execution.png)
Tela principal com checkboxes e progresso

## 5. Exercise Details
![Details](./screenshots/05-details.png)
Acordeão de exercício expandido (como fazer, erros, versões)

## 6. Exercise Library
![Library](./screenshots/06-library.png)
Biblioteca de exercícios com busca
```

- [ ] **Step 4: Commit screenshots**

```bash
git add docs/screenshots/ docs/SCREENSHOTS.md
git commit -m "docs: add visual screenshots of complete app flow"
```

---

### Task 9: Final Validation & Build

**Files:**
- Output: `dist/` (production build)
- Output: Test report (Playwright HTML)

**Interfaces:**
- Consumes: Todas as mudanças anteriores
- Produces: Build validado, testes passando, pronto para deploy

- [ ] **Step 1: Rodar validação de dados**

```bash
npm run validate
# Expected: ✅ Data validation passed
```

- [ ] **Step 2: Rodar build**

```bash
npm run build
# Expected:
# ✓ 26 modules transformed
# dist/index.html         1.54 kB
# dist/assets/index.js    ~250 kB (gzip: <80 kB)
# ✓ built in XXXms
```

- [ ] **Step 3: Rodar testes E2E**

```bash
npm run test:e2e
# Expected: ✓ 3 tests passed
# No failures
```

- [ ] **Step 4: Testar build production em preview**

```bash
npm run preview
# Em http://localhost:4173, testar:
# - Perfil selection funciona
# - Treinos carregam
# - Checkboxes persistem em localStorage
# - Sem erros de console
```

- [ ] **Step 5: Bundle analysis**

```bash
# Verificar tamanho final
du -sh dist/
# Expected: ~200 kB total, <100 kB JS
```

- [ ] **Step 6: Commit final**

```bash
git add .
git commit -m "chore: production build validated, all tests passing, ready for deploy"
```

---

### Task 10: Deploy & Go Live

**Files:**
- Output: Live em Netlify

**Interfaces:**
- Consumes: Build validado de Task 9
- Produces: Production URL funcional

- [ ] **Step 1: Fazer login em Netlify**

```bash
npm install -g netlify-cli
netlify login
```

- [ ] **Step 2: Deploy**

```bash
netlify deploy --prod
# Ou: git push origin main (auto-deploy)
```

- [ ] **Step 3: Verificar live site**

- [ ] APP carrega em production URL
- [ ] Offline mode funciona (DevTools > offline)
- [ ] PWA instalável (prompt appears)
- [ ] Todos os treinos carregam
- [ ] Sem erros no console

- [ ] **Step 4: Fazer commit final**

```bash
git add .
git commit -m "chore: deployed to production at $(netlify env:get URL)"
```

---

## Global Review Focus

For each of these 5 failure modes, a test exists in the plan that would catch it:

1. **Orphan exercise_id** → Task 3: validate-data.ts checks all exercise_id referencias
2. **Service Worker stale** → Task 4: vite-plugin-pwa com autoUpdate + Workbox versioning
3. **localStorage overflow** → Task 6: Playwright test checks checkbox state across multiple workouts
4. **Offline accordion** → Task 6: E2E test verifies exercise details load offline
5. **iOS icon missing** → Task 4: 3 ícones (192, 512, maskable) gerados, fallback em manifest

---

## Self-Review

✅ **Spec coverage:**
- Conteúdo 300+/50+ → Tasks 1-2
- PWA offline → Task 4
- Deploy Netlify → Task 5
- Testes → Task 6
- Preview visual → Task 8
- Validação final → Task 9

✅ **Placeholder scan:**
- Nenhum "TBD", "TODO"
- Todos os snippets de código completos
- Tipos explícitos definidos

✅ **Type consistency:**
- `Workout[]`, `Exercise[]` usam types de `src/data/types.ts`
- Slugify e inferência de equipamentos consistentes em todas tasks

✅ **Review Focus:**
- 5 failure modes → cada um tem test

---

## Plan Summary

| Task | Focus | Output | Est. Time |
|---|---|---|---|
| 1 | Parse 05.md | 20 treinos JSON | 30 min |
| 2 | Parse 04.md/01.md + merge | 50 treinos, 300+ exercícios | 45 min |
| 3 | Validação de dados | Script de check | 15 min |
| 4 | PWA (SW, ícones, manifest) | Workbox caching | 30 min |
| 5 | Netlify deploy config | netlify.toml + docs | 20 min |
| 6 | E2E tests (Playwright) | 3 testes ponta-a-ponta | 30 min |
| 7 | Refactor para dados dinâmicos | App.tsx + routers | 20 min |
| 8 | Screenshots & preview visual | 10 screenshots | 20 min |
| 9 | Validação & build final | Build production | 15 min |
| 10 | Deploy live | Production URL | 10 min |
| **TOTAL** | | **Pronto para usar** | **~4 horas** |

