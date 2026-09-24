import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function mergeExercises() {
  try {
    // Read existing and new exercises
    const existingPath = path.join(__dirname, '../src/data/exercises.json')
    const newPath = path.join(__dirname, '../src/data/temp-01-exercises.json')

    const existentes = JSON.parse(fs.readFileSync(existingPath, 'utf-8'))

    if (!fs.existsSync(newPath)) {
      console.warn(`⚠️  ${newPath} not found, skipping merge`)
      return
    }

    const novas = JSON.parse(fs.readFileSync(newPath, 'utf-8'))

    // Merge with deduplication
    const seen = new Set<string>(existentes.map(e => e.id))
    const merged = [...existentes]

    let addedCount = 0

    novas.forEach(ex => {
      if (!seen.has(ex.id)) {
        seen.add(ex.id)
        merged.push(ex)
        addedCount++
      }
    })

    // Sort by categoria then nome for easier review
    merged.sort((a, b) => {
      const catA = a.categorias?.[0] || ''
      const catB = b.categorias?.[0] || ''
      if (catA !== catB) return catA.localeCompare(catB)
      return a.nome.localeCompare(b.nome)
    })

    // Write merged exercises
    fs.writeFileSync(existingPath, JSON.stringify(merged, null, 2))

    console.log(`✓ Merged exercises to ${merged.length} total`)
    console.log(`  - Existing: ${existentes.length}`)
    console.log(`  - Added from 01.md: ${addedCount}`)

    // Clean up temp file
    if (fs.existsSync(newPath)) {
      fs.unlinkSync(newPath)
    }
  } catch (error) {
    console.error('✗ Error merging exercises:', error)
    process.exit(1)
  }
}

mergeExercises()
