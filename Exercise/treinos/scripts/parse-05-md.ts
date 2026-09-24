import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
  aquecimento: Array<{
    exercise_id: string
    series: number
    repeticoes: string
    descanso?: string
  }>
  exercicios: Array<{
    exercise_id: string
    series: number
    repeticoes: string
    descanso?: string
  }>
  finalizacao?: Array<{
    exercise_id: string
    series: number
    repeticoes: string
    descanso?: string
  }>
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\/]/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function parseExercicioLine(line: string): { name: string; series: number; reps: string } | null {
  // "Supino reto | 3×8--12" → { name: "Supino reto", series: 3, reps: "8-12" }
  // Also handle "máximo técnico" and "30--60 s" formats
  const match = line.match(/^([^|]+)\s*\|\s*(\d+)×([^|]+)$/)
  if (!match) return null

  return {
    name: match[1].trim(),
    series: parseInt(match[2], 10),
    reps: match[3].trim().replace(/--/g, '-'),
  }
}

function mapIntensityToNivel(
  intensidade: string
): 'iniciante' | 'intermediário' | 'avançado' {
  const lower = intensidade.toLowerCase().trim()
  if (lower.includes('alta')) return 'avançado'
  if (lower.includes('leve')) return 'iniciante'
  return 'intermediário' // default to medium
}

function inferEquipamentos(exerciseNames: string[]): string[] {
  const equipment = new Set<string>()
  const text = exerciseNames.join(' ').toLowerCase()

  if (text.includes('halter')) equipment.add('halteres')
  if (text.includes('barra')) equipment.add('barra')
  if (text.includes('máquina') || text.includes('press') || text.includes('extensora') || text.includes('flexora') || text.includes('polia') || text.includes('abdutora')) equipment.add('máquina')
  if (text.includes('corda')) equipment.add('corda')
  if (text.includes('piso') || text.includes('livre')) equipment.add('peso corporal')
  if (text.includes('bike') || text.includes('esteira')) equipment.add('cardio')

  return Array.from(equipment)
}

function mapCategoryFromTitle(title: string): string {
  const lower = title.toLowerCase()
  if (lower.includes('peito') || lower.includes('perna') || lower.includes('costas') || lower.includes('ombro') || lower.includes('quadríceps') || lower.includes('posterior') || lower.includes('glúteo')) {
    return 'academia'
  }
  if (lower.includes('força') || lower.includes('militar') || lower.includes('corporal') || lower.includes('corpo livre')) {
    return 'forca'
  }
  if (lower.includes('metabólico') || lower.includes('cardio')) {
    return 'condicionamento'
  }
  return 'academia'
}

function parse05Md(): WorkoutRaw[] {
  const mdPath = path.join(__dirname, '..', '..', '05.md')
  const content = fs.readFileSync(mdPath, 'utf-8')
  const workouts: WorkoutRaw[] = []

  // Split by "XX. Título --- Tipo" pattern
  // Look for lines that start with digits followed by a period
  const blocks = content.split(/\n(?=\d{2}\.\s)/)

  blocks.forEach((block) => {
    const lines = block.split('\n').filter((l) => l.trim())
    if (lines.length < 2) return

    // Parse header: "01. Peito + Tríceps --- Rápido" OR "07. Posterior + Glúteos"
    // Try format with "---" first
    let headerMatch = lines[0].match(/^(\d{2})\.\s+([^-]+?)\s*---\s*(.+)$/)
    let num: string
    let nomeBase: string
    let tipo: string
    let titulo: string

    if (headerMatch) {
      [, num, nomeBase, tipo] = headerMatch
      titulo = `${nomeBase.trim()} --- ${tipo.trim()}`
    } else {
      // Try format without "---"
      headerMatch = lines[0].match(/^(\d{2})\.\s+(.+)$/)
      if (!headerMatch) return

      [, num, nomeBase] = headerMatch
      titulo = nomeBase.trim()
      tipo = ''
    }

    // Parse meta: "Tempo: 30--40 min | Intensidade: média" or "Tempo: 30 min | Intensidade: média"
    let metaMatch = lines[1].match(/Tempo:\s*(\d+)--(\d+)\s*min.*Intensidade:\s*(.+)/)
    let duracao_min: number
    let duracao_max: number
    let intensidade: string

    if (metaMatch) {
      const [, minStr, maxStr, intens] = metaMatch
      duracao_min = parseInt(minStr, 10)
      duracao_max = parseInt(maxStr, 10)
      intensidade = intens
    } else {
      // Try single value format
      metaMatch = lines[1].match(/Tempo:\s*(\d+)\s*min.*Intensidade:\s*(.+)/)
      if (!metaMatch) return
      const [, minStr, intens] = metaMatch
      duracao_min = parseInt(minStr, 10)
      duracao_max = duracao_min
      intensidade = intens
    }

    const nivel = mapIntensityToNivel(intensidade)

    // Parse exercícios (start from line 2 onwards)
    const exercicios: WorkoutRaw['exercicios'] = []
    const exerciseNames: string[] = []

    for (let i = 2; i < lines.length; i++) {
      const parsed = parseExercicioLine(lines[i])
      if (parsed) {
        exerciseNames.push(parsed.name)
        const exercise_id = slugify(parsed.name)
        exercicios.push({
          exercise_id,
          series: parsed.series,
          repeticoes: parsed.reps,
          descanso: duracao_max > 60 ? '90-120s' : '60-90s',
        })
      }
    }

    if (exercicios.length === 0) return

    const categoria = mapCategoryFromTitle(titulo)
    const equipamentos = inferEquipamentos(exerciseNames)
    const tipoOrDefault = tipo || titulo

    workouts.push({
      id: `05-${num.padStart(2, '0')}`,
      nome: titulo,
      descricao: `Treino de ${titulo} com intensidade ${intensidade.toLowerCase()}`,
      categoria,
      nivel,
      duracao_min,
      duracao_max,
      equipamentos,
      objetivo: `${tipoOrDefault} - ${duracao_min}-${duracao_max} minutos`,
      aquecimento: [],
      exercicios,
    })
  })

  return workouts
}

// Main execution
try {
  const workouts = parse05Md()
  const outputDir = path.join(__dirname, '../src/data/workouts')

  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const outputPath = path.join(outputDir, 'parsed-05.json')
  fs.writeFileSync(outputPath, JSON.stringify(workouts, null, 2))

  console.log(`✓ Parsed ${workouts.length} workouts from 05.md`)
  console.log(`✓ Output saved to ${outputPath}`)

  // Print summary
  console.log('\nWorkout Summary:')
  workouts.forEach((w) => {
    console.log(
      `  - ${w.id}: ${w.nome} (${w.duracao_min}-${w.duracao_max} min, ${w.exercicios.length} exercises)`
    )
  })
} catch (error) {
  console.error('Error parsing 05.md:', error)
  process.exit(1)
}
