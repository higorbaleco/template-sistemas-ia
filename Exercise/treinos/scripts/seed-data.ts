/**
 * Script para popular os dados de exercícios e treinos a partir dos .md originais
 *
 * Uso: npx ts-node scripts/seed-data.ts
 *
 * Este script converte o conteúdo de 05.md, 04.md e 01.md em JSON tipado
 * para src/data/exercises.json e src/data/workouts/*.json
 */

import fs from 'fs'
import path from 'path'

// Tipos
interface Exercise {
  id: string
  nome: string
  nome_secundario?: string
  descricao: string
  categorias: string[]
  musculos: string[]
  movimentos: string[]
  equipamentos: string[]
  dificuldade: 'iniciante' | 'intermediário' | 'avançado'
  como_fazer: string[]
  erros_comuns: string[]
  versao_facil?: string
  versao_dificil?: string
  imagem?: string
}

interface WorkoutExercise {
  exercise_id: string
  series: number
  repeticoes?: number | string
  tempo?: string
  distancia?: string
  descanso?: string
  observacao?: string
}

interface Workout {
  id: string
  nome: string
  descricao: string
  categoria: string
  nivel: 'iniciante' | 'intermediário' | 'avançado'
  duracao_min: number
  duracao_max: number
  equipamentos: string[]
  objetivo: string
  aquecimento: WorkoutExercise[]
  exercicios: WorkoutExercise[]
  finalizacao?: WorkoutExercise[]
  perfil_recomendado?: 'higor' | 'brenda' | 'ambos'
}

// Exemplo simples de como usar este script
function seedSampleData() {
  console.log('🌱 Seeding sample data...')
  console.log('Este é um template. Para usar, implemente parsers para:')
  console.log('  - 05.md (20 templates de treino)')
  console.log('  - 04.md (20 modelos de treino)')
  console.log('  - 01 exercicio.md (plano funcional tático)')
  console.log('')
  console.log('Passos:')
  console.log('1. Ler arquivo .md')
  console.log('2. Parse de linhas (exercício | séries×reps)')
  console.log('3. Mapear para exercise_id (fuzzy match em exercises.json)')
  console.log('4. Gerar workout.json com estrutura tipada')
  console.log('5. Validar: toda exercise_id existe em exercises.json')
}

seedSampleData()
