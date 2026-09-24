import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

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
  aquecimento: { exercise_id: string; series: number; repeticoes: string; descanso?: string }[]
  exercicios: { exercise_id: string; series: number; repeticoes: string; descanso?: string }[]
  finalizacao?: { exercise_id: string; series: number; repeticoes: string; descanso?: string }[]
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[()]/g, '')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-')
}

function inferEquipamentos(exercises: string[]): string[] {
  const equipment = new Set<string>()
  const text = exercises.join(' ').toLowerCase()

  if (text.includes('halter')) equipment.add('halteres')
  if (text.includes('barra')) equipment.add('barra')
  if (text.includes('máquina')) equipment.add('máquina')
  if (text.includes('leg press')) equipment.add('máquina')
  if (text.includes('flexão') || text.includes('agachamento')) equipment.add('corpo-livre')
  if (text.includes('banco')) equipment.add('banco')
  if (text.includes('cabo') || text.includes('polia')) equipment.add('polia')

  return Array.from(equipment)
}

function inferCategoria(foco: string): string {
  const focus = foco.toLowerCase()
  if (focus.includes('hipertrofia')) return 'hipertrofia'
  if (focus.includes('força')) return 'forca'
  if (focus.includes('academia')) return 'academia'
  if (focus.includes('livre')) return 'corpo-livre'
  if (focus.includes('estabilidade')) return 'estabilidade'
  return 'academia'
}

function parse04Md(): WorkoutRaw[] {
  const content = fs.readFileSync(path.join(__dirname, '../..', '04.md'), 'utf-8')
  const workouts: WorkoutRaw[] = []

  // Split by lines and parse tab-separated values
  const lines = content.split('\n')

  // Find header line
  let headerIdx = -1
  lines.forEach((line, idx) => {
    if (line.includes('Treino') && line.includes('Foco') && line.includes('Estrutura')) {
      headerIdx = idx
    }
  })

  if (headerIdx === -1) {
    console.warn('⚠️  No header found in 04.md')
    return []
  }

  // Process data lines after header
  let workoutCount = 0
  for (let i = headerIdx + 1; i < lines.length; i++) {
    const line = lines[i].trim()

    // Stop if we hit an empty line or non-data section
    if (!line || line.startsWith('#') || line.startsWith('Mas') || line.includes('arquétipos')) {
      break
    }

    // Split by tabs
    const parts = line.split('\t').map(p => p.trim())

    if (parts.length < 4) continue

    const [num, nome, foco, estrutura] = parts

    if (!nome || !estrutura) continue

    const exercise_names = estrutura
      .split(',')
      .map(e => e.trim())
      .filter(e => e.length > 0)

    if (exercise_names.length === 0) continue

    workoutCount++

    workouts.push({
      id: `04-${num.padStart(2, '0')}`,
      nome: nome.trim(),
      descricao: foco.trim(),
      categoria: inferCategoria(foco),
      nivel: 'intermediário',
      duracao_min: 45,
      duracao_max: 60,
      equipamentos: inferEquipamentos(exercise_names),
      objetivo: foco.trim(),
      aquecimento: [],
      exercicios: exercise_names.map((name, i) => ({
        exercise_id: slugify(name),
        series: 3,
        repeticoes: '8-12',
        descanso: '60-90s'
      })),
      finalizacao: []
    })
  }

  return workouts
}

function main() {
  try {
    const workouts = parse04Md()

    // Ensure output directory exists
    const outputDir = path.join(__dirname, '../src/data/workouts')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    fs.writeFileSync(
      path.join(outputDir, 'parsed-04.json'),
      JSON.stringify(workouts, null, 2)
    )

    console.log(`✓ Parsed ${workouts.length} workouts from 04.md`)
    if (workouts.length > 0) {
      console.log(`  Sample: "${workouts[0].nome}" (${workouts[0].exercicios.length} exercises)`)
    }
  } catch (error) {
    console.error('✗ Error parsing 04.md:', error)
    process.exit(1)
  }
}

main()
