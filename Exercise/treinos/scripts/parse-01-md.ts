import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

interface ExerciseRaw {
  id: string
  nome: string
  descricao: string
  categorias: string[]
  musculos: string[]
  movimentos: string[]
  equipamentos: string[]
  dificuldade: 'iniciante' | 'intermediário' | 'avançado'
  como_fazer: string[]
  erros_comuns: string[]
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[()\/]/g, '')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-')
}

function toPortugueseTitle(text: string): string {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

function mapSectionToCategory(title: string): string {
  const lower = title.toLowerCase()
  if (lower.includes('calistenia')) return 'corpo-livre'
  if (lower.includes('força') || lower.includes('funcional')) return 'forca'
  if (lower.includes('militar') || lower.includes('tático')) return 'militar'
  if (lower.includes('carry')) return 'forca-util'
  if (lower.includes('corrida')) return 'cardio'
  if (lower.includes('corpo livre')) return 'corpo-livre'
  return 'forca'
}

function inferMusculos(exerciseName: string): string[] {
  const name = exerciseName.toLowerCase()
  const musculos = new Set<string>()

  if (name.includes('puxada') || name.includes('remada') || name.includes('pull')) {
    musculos.add('costas')
    musculos.add('bíceps')
  }
  if (name.includes('flexão') || name.includes('push')) {
    musculos.add('peito')
    musculos.add('tríceps')
  }
  if (name.includes('agachamento') || name.includes('leg')) {
    musculos.add('quadríceps')
    musculos.add('glúteos')
  }
  if (name.includes('terra') || name.includes('stiff') || name.includes('levant')) {
    musculos.add('glúteos')
    musculos.add('isquiotibiais')
    musculos.add('costas')
  }
  if (name.includes('supino')) {
    musculos.add('peito')
    musculos.add('tríceps')
    musculos.add('ombros')
  }
  if (name.includes('desenvolvimento') || name.includes('ombro')) {
    musculos.add('ombros')
  }
  if (name.includes('rosca') || name.includes('curl')) {
    musculos.add('bíceps')
  }
  if (name.includes('tríceps')) {
    musculos.add('tríceps')
  }
  if (name.includes('prancha') || name.includes('core') || name.includes('abdô')) {
    musculos.add('abdômen')
    musculos.add('core')
  }
  if (name.includes('farmer') || name.includes('carry') || name.includes('caminhada')) {
    musculos.add('antebraços')
    musculos.add('trapézio')
  }
  if (name.includes('barra') || name.includes('dead hang')) {
    musculos.add('antebraços')
    musculos.add('costas')
  }

  if (musculos.size === 0) {
    musculos.add('geral')
  }

  return Array.from(musculos)
}

function inferMovimentos(exerciseName: string): string[] {
  const name = exerciseName.toLowerCase()
  const movimentos = new Set<string>()

  if (name.includes('puxada') || name.includes('remada') || name.includes('pull')) {
    movimentos.add('puxar')
  }
  if (name.includes('flexão') || name.includes('push') || name.includes('supino')) {
    movimentos.add('empurrar')
  }
  if (name.includes('agachamento') || name.includes('squat')) {
    movimentos.add('agachar')
  }
  if (name.includes('terra') || name.includes('stiff') || name.includes('levant')) {
    movimentos.add('levantar')
  }
  if (name.includes('prancha') || name.includes('plank')) {
    movimentos.add('isometria')
  }
  if (name.includes('carry') || name.includes('farmer') || name.includes('caminhada')) {
    movimentos.add('carregar')
  }
  if (name.includes('barra') || name.includes('suspensão') || name.includes('dead hang')) {
    movimentos.add('pendurar')
  }
  if (name.includes('rosca') || name.includes('curl')) {
    movimentos.add('flexão')
  }
  if (name.includes('afundo') || name.includes('step')) {
    movimentos.add('locomoção')
  }

  if (movimentos.size === 0) {
    movimentos.add('força')
  }

  return Array.from(movimentos)
}

function inferEquipamentos(exerciseName: string): string[] {
  const name = exerciseName.toLowerCase()
  const equipamentos = new Set<string>()

  if (name.includes('halter')) equipamentos.add('halteres')
  if (name.includes('barra') && !name.includes('banda')) equipamentos.add('barra')
  if (name.includes('máquina')) equipamentos.add('máquina')
  if (name.includes('banco')) equipamentos.add('banco')
  if (name.includes('polia') || name.includes('cabo')) equipamentos.add('polia')
  if (name.includes('kettlebell')) equipamentos.add('kettlebell')
  if (name.includes('saco') || name.includes('sandbag')) equipamentos.add('sandbag')
  if (name.includes('mochila')) equipamentos.add('mochila')

  return Array.from(equipamentos)
}

function parse01Md(): ExerciseRaw[] {
  const content = fs.readFileSync(path.join(__dirname, '../..', '01 exercicio.md'), 'utf-8')
  const exercises: ExerciseRaw[] = []
  const seenIds = new Set<string>()

  // Extract exercise names from content
  // Look for patterns like:
  // - "Exercício --- " followed by "Objetivo: "
  // - Exercises listed with bullet points
  // - Exercises mentioned in training days with series×reps format

  const exercisePatterns = [
    /^(\w+(?:\s+\w+)*?)\s*---\s+/gm, // "Exercício --- "
    /^[-*]\s+([A-Z][^|]+?)(?:\s*\||$)/gm, // "- Exercício |"
    /^([A-Z][^|]*?)\s*\|\s*\d+×/gm // "Exercício | 3×"
  ]

  const allMatches = new Set<string>()

  // Extract from structured days
  const dayMatches = content.match(
    /Dia\s+\d+\s+---.*?(?=Dia\s+\d+|Progressão|$)/gis
  )
  if (dayMatches) {
    dayMatches.forEach(day => {
      const lines = day.split('\n')
      lines.forEach(line => {
        const exerciseMatch = line.match(/^([A-Z][^|—-]*?)\s*(?:---|—|\||$)/)
        if (exerciseMatch) {
          const name = exerciseMatch[1].trim()
          if (name.length > 3 && !name.includes('Dia') && !name.includes('Objetivo')) {
            allMatches.add(name)
          }
        }
      })
    })
  }

  // Also extract from the main template section in 05.md equivalent
  const templateMatches = content.match(/^([A-Z][^|]*?)\s*\|\s*\d+×[^|]*$/gm)
  if (templateMatches) {
    templateMatches.forEach(match => {
      const name = match.split('|')[0].trim()
      if (name.length > 3) allMatches.add(name)
    })
  }

  // Standard exercise list
  const standardExercises = [
    'Flexão',
    'Supino',
    'Desenvolvimento',
    'Puxada',
    'Remada',
    'Agachamento',
    'Levantamento terra',
    'Farmer carry',
    'Farmer walk',
    'Bear hug carry',
    'Suitcase carry',
    'Step-up',
    'Prancha',
    'Barra fixa',
    'Remada australiana',
    'Dead hang',
    'Remada unilateral',
    'Afundo',
    'Terra romeno',
    'Elevated leg press',
    'Leg press',
    'Mesa flexora',
    'Cadeira extensora',
    'Panturrilha',
    'Rosca direta',
    'Rosca martelo',
    'Tríceps corda',
    'Tríceps francês',
    'Crucifixo',
    'Elevação lateral',
    'Elevação frontal',
    'Puxador frontal',
    'Crossover',
    'Abdominal',
    'Caminhar engatinhando',
    'Bear crawl',
    'Elevação de joelho',
    'Flexão na parede',
    'Prancha lateral',
    'Mobilidade de ombros',
    'Agachamento goblet',
    'Afundo búlgaro',
    'Stiff'
  ]

  ;[...allMatches, ...standardExercises].forEach(exerciseName => {
    if (!exerciseName || exerciseName.length < 3) return

    const cleanName = exerciseName.trim()
    const exercise_id = slugify(cleanName)

    // Skip duplicates
    if (seenIds.has(exercise_id)) return

    seenIds.add(exercise_id)

    // Infer category from document context
    const categorias = [mapSectionToCategory('Força')]

    exercises.push({
      id: exercise_id,
      nome: toPortugueseTitle(cleanName),
      descricao: `Exercício de treinamento funcional e força`,
      categorias,
      musculos: inferMusculos(cleanName),
      movimentos: inferMovimentos(cleanName),
      equipamentos: inferEquipamentos(cleanName),
      dificuldade: 'intermediário',
      como_fazer: ['Ver instrução completa'],
      erros_comuns: []
    })
  })

  return exercises
}

function main() {
  try {
    const exercises = parse01Md()

    // Ensure output directory exists
    const outputDir = path.join(__dirname, '../src/data')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    fs.writeFileSync(
      path.join(outputDir, 'temp-01-exercises.json'),
      JSON.stringify(exercises, null, 2)
    )

    console.log(`✓ Parsed ${exercises.length} unique exercises from 01.md`)
    if (exercises.length > 0) {
      console.log(`  Sample: "${exercises[0].nome}" (${exercises[0].musculos.join(', ')})`)
    }
  } catch (error) {
    console.error('✗ Error parsing 01.md:', error)
    process.exit(1)
  }
}

main()
