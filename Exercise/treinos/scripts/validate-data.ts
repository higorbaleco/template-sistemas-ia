import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface ValidationError {
  type: 'orphan_exercise' | 'missing_field' | 'invalid_type' | 'duplicate_id'
  message: string
  file: string
  location?: string
}

function validateData(): ValidationError[] {
  const errors: ValidationError[] = []

  // Load exercises
  const exercisesPath = path.join(__dirname, '../src/data/exercises.json')
  if (!fs.existsSync(exercisesPath)) {
    errors.push({
      type: 'missing_field',
      message: 'exercises.json file not found',
      file: exercisesPath
    })
    return errors
  }

  const exercises = JSON.parse(fs.readFileSync(exercisesPath, 'utf-8'))
  const exerciseIds = new Set(exercises.map((e: any) => e.id))

  // Validate exercises structure
  exercises.forEach((ex: any, idx: number) => {
    // Check required fields
    if (!ex.id || typeof ex.id !== 'string') {
      errors.push({
        type: 'missing_field',
        message: `Exercise ${idx} missing or invalid required field: id (must be string)`,
        file: exercisesPath,
        location: `exercises[${idx}].id`
      })
    }

    if (!ex.nome || typeof ex.nome !== 'string') {
      errors.push({
        type: 'missing_field',
        message: `Exercise ${idx} missing or invalid required field: nome (must be string)`,
        file: exercisesPath,
        location: `exercises[${idx}].nome`
      })
    }

    if (!ex.categorias || !Array.isArray(ex.categorias)) {
      errors.push({
        type: 'missing_field',
        message: `Exercise ${idx} missing or invalid required field: categorias (must be array)`,
        file: exercisesPath,
        location: `exercises[${idx}].categorias`
      })
    }
  })

  // Check for duplicate exercise IDs
  const idCounts: { [key: string]: number } = {}
  exercises.forEach((ex: any) => {
    if (ex.id) {
      idCounts[ex.id] = (idCounts[ex.id] || 0) + 1
    }
  })

  Object.entries(idCounts).forEach(([id, count]) => {
    if (count > 1) {
      errors.push({
        type: 'duplicate_id',
        message: `Exercise id "${id}" appears ${count} times in exercises.json`,
        file: exercisesPath
      })
    }
  })

  // Load all workouts (from individual files in workouts/ directory)
  const workoutsDir = path.join(__dirname, '../src/data/workouts')
  if (!fs.existsSync(workoutsDir)) {
    console.warn('⚠️  Workouts directory not found, skipping workout validation')
    return errors
  }

  const workoutFiles = fs.readdirSync(workoutsDir)
    .filter(f => f.endsWith('.json'))
    .filter(f => !f.startsWith('parsed-')) // Exclude temporary merged files

  // Also check for consolidated workouts.json
  const consolidatedPath = path.join(__dirname, '../src/data/workouts.json')
  if (fs.existsSync(consolidatedPath)) {
    workoutFiles.push('workouts.json')
  }

  if (workoutFiles.length === 0) {
    console.warn('⚠️  No workout files found')
    return errors
  }

  // Validate each workout file
  workoutFiles.forEach((file) => {
    const filePath = file === 'workouts.json'
      ? consolidatedPath
      : path.join(workoutsDir, file)

    try {
      const workoutData = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      const workouts = Array.isArray(workoutData) ? workoutData : [workoutData]

      workouts.forEach((workout: any, wIdx: number) => {
        const workoutPrefix = `${file}${Array.isArray(workoutData) ? `[${wIdx}]` : ''}`

        // Validate aquecimento
        if (workout.aquecimento && Array.isArray(workout.aquecimento)) {
          workout.aquecimento.forEach((item: any, idx: number) => {
            if (item.exercise_id && !exerciseIds.has(item.exercise_id)) {
              errors.push({
                type: 'orphan_exercise',
                message: `Workout "${workout.id}" aquecimento[${idx}] references non-existent exercise_id "${item.exercise_id}"`,
                file: filePath,
                location: `${workoutPrefix}.aquecimento[${idx}].exercise_id`
              })
            }
          })
        }

        // Validate exercicios
        if (workout.exercicios && Array.isArray(workout.exercicios)) {
          workout.exercicios.forEach((item: any, idx: number) => {
            if (item.exercise_id && !exerciseIds.has(item.exercise_id)) {
              errors.push({
                type: 'orphan_exercise',
                message: `Workout "${workout.id}" exercicios[${idx}] references non-existent exercise_id "${item.exercise_id}"`,
                file: filePath,
                location: `${workoutPrefix}.exercicios[${idx}].exercise_id`
              })
            }
          })
        }

        // Validate finalizacao
        if (workout.finalizacao && Array.isArray(workout.finalizacao)) {
          workout.finalizacao.forEach((item: any, idx: number) => {
            if (item.exercise_id && !exerciseIds.has(item.exercise_id)) {
              errors.push({
                type: 'orphan_exercise',
                message: `Workout "${workout.id}" finalizacao[${idx}] references non-existent exercise_id "${item.exercise_id}"`,
                file: filePath,
                location: `${workoutPrefix}.finalizacao[${idx}].exercise_id`
              })
            }
          })
        }
      })
    } catch (e) {
      errors.push({
        type: 'invalid_type',
        message: `Failed to parse ${file}: ${e instanceof Error ? e.message : String(e)}`,
        file: filePath
      })
    }
  })

  return errors
}

// Run validation
const errors = validateData()

if (errors.length > 0) {
  console.error(`\n❌ Data validation failed with ${errors.length} error(s):\n`)
  errors.forEach((err) => {
    console.error(`  [${err.type.toUpperCase()}] ${err.message}`)
    if (err.location) console.error(`    at ${err.location}`)
  })
  console.error()
  process.exit(1)
} else {
  const exercisesPath = path.join(__dirname, '../src/data/exercises.json')
  const exercises = JSON.parse(fs.readFileSync(exercisesPath, 'utf-8'))
  const workoutsDir = path.join(__dirname, '../src/data/workouts')

  let workoutCount = 0
  const consolidatedPath = path.join(__dirname, '../src/data/workouts.json')
  if (fs.existsSync(consolidatedPath)) {
    const data = JSON.parse(fs.readFileSync(consolidatedPath, 'utf-8'))
    workoutCount = Array.isArray(data) ? data.length : 1
  } else if (fs.existsSync(workoutsDir)) {
    const files = fs.readdirSync(workoutsDir)
      .filter(f => f.endsWith('.json'))
      .filter(f => !f.startsWith('parsed-'))
    workoutCount = files.length
  }

  console.log(`✅ Data validation passed`)
  console.log(`   • ${exercises.length} exercises validated`)
  console.log(`   • ${workoutCount} workout(s) validated`)
  console.log(`   • No orphan references, duplicates, or missing fields\n`)
  process.exit(0)
}
