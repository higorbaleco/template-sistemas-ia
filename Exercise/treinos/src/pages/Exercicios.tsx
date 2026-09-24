import React, { useState, useMemo } from 'react'
import exercisesData from '../data/exercises.json'
import { Exercise } from '../data/types'
import { ExerciseAccordion } from '../components/ExerciseAccordion'

export const Exercicios: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = useMemo((): string[] => {
    const cats = new Set<string>()
    ;(exercisesData as any[]).forEach((ex: any) => {
      ex.categorias?.forEach((cat: string) => cats.add(cat))
    })
    return Array.from(cats).sort()
  }, [])

  const filteredExercises: Exercise[] = useMemo(() => {
    return (exercisesData as any[]).filter((ex) => {
      const matchesSearch =
        ex.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.nome_secundario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.descricao.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory =
        !selectedCategory || ex.categorias.includes(selectedCategory)

      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#1a1a1a',
        paddingBottom: '60px'
      }}
    >
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #2a2a2a' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '12px' }}>
          Biblioteca de Exercícios
        </h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Buscar exercício..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            backgroundColor: '#2a2a2a',
            border: '1px solid #3a3a3a',
            borderRadius: '6px',
            color: '#f5f5f5',
            fontSize: '14px',
            marginBottom: '12px'
          }}
        />

        {/* Filter by category */}
        <div style={{ overflowX: 'auto', paddingBottom: '4px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedCategory(null)}
              style={{
                padding: '6px 12px',
                backgroundColor:
                  !selectedCategory ? '#4CAF50' : '#404040',
                color: !selectedCategory ? '#1a1a1a' : '#999',
                border: 'none',
                borderRadius: '16px',
                fontSize: '12px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              Todas
            </button>
            {categories.map((cat: string) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as string | null)}
                style={{
                  padding: '6px 12px',
                  backgroundColor:
                    selectedCategory === cat ? '#4CAF50' : '#404040',
                  color: selectedCategory === cat ? '#1a1a1a' : '#999',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {filteredExercises.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              color: '#666',
              paddingTop: '40px'
            }}
          >
            <p>Nenhum exercício encontrado</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '8px' }}>
            {filteredExercises.map((ex) => (
              <ExerciseAccordion
                key={ex.id}
                exercise={ex}
                label={ex.nome}
                description={ex.nome_secundario || ex.descricao}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
