import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function mergeWorkouts() {
  try {
    // Read parsed workouts
    const workouts04Path = path.join(__dirname, '../src/data/workouts/parsed-04.json')
    const workouts05Path = path.join(__dirname, '../src/data/workouts/parsed-05.json')

    if (!fs.existsSync(workouts04Path)) {
      console.warn(`⚠️  ${workouts04Path} not found`)
      return
    }

    const workouts04 = JSON.parse(fs.readFileSync(workouts04Path, 'utf-8'))
    const workouts05 = fs.existsSync(workouts05Path)
      ? JSON.parse(fs.readFileSync(workouts05Path, 'utf-8'))
      : []

    // Merge with deduplication
    const seen = new Set<string>()
    const merged = []

    ;[workouts04, workouts05].forEach(list => {
      if (!Array.isArray(list)) return

      list.forEach(w => {
        if (!w.id) return

        if (!seen.has(w.id)) {
          seen.add(w.id)
          merged.push(w)
        }
      })
    })

    // Sort by id for consistency
    merged.sort((a, b) => a.id.localeCompare(b.id))

    // Write merged workouts
    fs.writeFileSync(
      path.join(__dirname, '../src/data/workouts.json'),
      JSON.stringify(merged, null, 2)
    )

    console.log(`✓ Merged ${merged.length} unique workouts`)
    console.log(`  - From 04.md: ${workouts04.length}`)
    console.log(`  - From 05.md: ${workouts05.length}`)
  } catch (error) {
    console.error('✗ Error merging workouts:', error)
    process.exit(1)
  }
}

mergeWorkouts()
