import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function toPortugueseTitle(slugText: string): string {
  return slugText
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
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
  }
  if (name.includes('farmer') || name.includes('carry') || name.includes('caminhada')) {
    musculos.add('antebraços')
    musculos.add('trapézio')
  }
  if (name.includes('barra') || name.includes('dips')) {
    musculos.add('tríceps')
    musculos.add('peito')
  }

  if (musculos.size === 0) {
    musculos.add('geral')
  }

  return Array.from(musculos)
}

function inferMovimentos(exerciseName: string): string[] {
  const name = exerciseName.toLowerCase()
  const movimentos = new Set<string>()

  if (name.includes('puxada') || name.includes('remada')) {
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
  if (name.includes('prancha') || name.includes('core')) {
    movimentos.add('isometria')
  }
  if (name.includes('carry') || name.includes('farmer')) {
    movimentos.add('carregar')
  }
  if (name.includes('dips')) {
    movimentos.add('empurrar')
  }

  if (movimentos.size === 0) {
    movimentos.add('força')
  }

  return Array.from(movimentos)
}

function inferCategorias(exerciseName: string): string[] {
  const name = exerciseName.toLowerCase()
  const categorias = new Set<string>()

  if (name.includes('corpo-livre') || name.includes('flexão') || name.includes('dips')) {
    categorias.add('corpo-livre')
  }
  if (name.includes('halter') || name.includes('goblet') || name.includes('kettlebell')) {
    categorias.add('forca')
  }
  if (name.includes('máquina') || name.includes('máquina') || name.includes('leg-press')) {
    categorias.add('academia')
  }
  if (name.includes('sandbag') || name.includes('carry') || name.includes('farmer')) {
    categorias.add('forca-util')
  }

  if (categorias.size === 0) {
    categorias.add('forca')
  }

  return Array.from(categorias)
}

function main() {
  try {
    const exercises = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/exercises.json'), 'utf-8'))
    const workouts = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/workouts.json'), 'utf-8'))

    const existingIds = new Set(exercises.map(e => e.id))
    const missingIds = new Set<string>()

    // Collect all missing exercise_ids from workouts
    workouts.forEach(workout => {
      ;['aquecimento', 'exercicios', 'finalizacao'].forEach(section => {
        if (Array.isArray(workout[section])) {
          workout[section].forEach(item => {
            if (!existingIds.has(item.exercise_id)) {
              missingIds.add(item.exercise_id)
            }
          })
        }
      })
    })

    console.log(`Found ${missingIds.size} missing exercises`)

    // Create missing exercises
    const newExercises = Array.from(missingIds).map(id => ({
      id,
      nome: toPortugueseTitle(id),
      descricao: `Exercício de treinamento`,
      categorias: inferCategorias(id),
      musculos: inferMusculos(id),
      movimentos: inferMovimentos(id),
      equipamentos: [],
      dificuldade: 'intermediário' as const,
      como_fazer: ['Ver instrução completa'],
      erros_comuns: []
    }))

    // Merge with existing
    const merged = [...exercises, ...newExercises]

    // Sort
    merged.sort((a, b) => {
      const catA = a.categorias?.[0] || ''
      const catB = b.categorias?.[0] || ''
      if (catA !== catB) return catA.localeCompare(catB)
      return a.nome.localeCompare(b.nome)
    })

    // Write back
    fs.writeFileSync(
      path.join(__dirname, '../src/data/exercises.json'),
      JSON.stringify(merged, null, 2)
    )

    console.log(`✓ Created ${newExercises.length} missing exercises`)
    console.log(`✓ Total exercises: ${merged.length}`)
  } catch (error) {
    console.error('✗ Error:', error)
    process.exit(1)
  }
}

main()
