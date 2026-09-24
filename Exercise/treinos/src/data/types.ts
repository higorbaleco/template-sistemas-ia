export interface Exercise {
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

export interface WorkoutExercise {
  exercise_id: string
  series: number
  repeticoes?: number | string
  tempo?: string
  distancia?: string
  descanso?: string
  observacao?: string
}

export interface Workout {
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

export interface Category {
  id: string
  nome: string
  descricao: string
  icon?: string
  ordem: number
}

export interface Profile {
  id: 'higor' | 'brenda'
  nome: string
  cor?: string
}

export interface WorkoutSession {
  treino_id: string
  perfil_id: string
  checks: {
    [key: string]: boolean
  }
  timestamp: number
}
