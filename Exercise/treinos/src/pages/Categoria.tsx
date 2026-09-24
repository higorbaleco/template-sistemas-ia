import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import categories from '../data/categories.json'

// Simulação de treinos por categoria
const treinesPorCategoria: Record<string, any[]> = {
  'academia': [
    {
      id: 'academia-peito-triceps-rapido',
      nome: 'Peito + Tríceps — Rápido',
      duracao_min: 30,
      duracao_max: 40,
      nivel: 'intermediário'
    }
  ],
  'forca': [
    {
      id: 'forca-completo',
      nome: 'Força Completo',
      duracao_min: 45,
      duracao_max: 60,
      nivel: 'avançado'
    }
  ],
  'forca-util': [],
  'militar': [],
  'corpo-livre': [],
  'corrida': [],
  'condicionamento': [],
  'mobilidade': [],
  'rapido': []
}

export const Categoria: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>()
  const navigate = useNavigate()

  const category = categories.find((c) => c.id === categoryId)
  const treinos = treinesPorCategoria[categoryId || ''] || []

  if (!category) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Categoria não encontrada</p>
        <button onClick={() => navigate('/')}>Voltar</button>
      </div>
    )
  }

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
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #2a2a2a' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            color: '#4CAF50',
            fontSize: '18px',
            cursor: 'pointer',
            marginBottom: '8px'
          }}
        >
          ← Voltar
        </button>
        <h1 style={{ fontSize: '24px', marginBottom: '4px' }}>{category.nome}</h1>
        <p style={{ fontSize: '13px', color: '#999' }}>{category.descricao}</p>
      </div>

      {treinos.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
            textAlign: 'center',
            padding: '20px'
          }}
        >
          <div>
            <p style={{ fontSize: '14px', marginBottom: '8px' }}>Nenhum treino adicionado ainda nesta categoria.</p>
            <p style={{ fontSize: '12px', color: '#555' }}>Em breve mais opções!</p>
          </div>
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 20px',
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '12px'
          }}
        >
          {treinos.map((treino) => (
            <div
              key={treino.id}
              onClick={() => navigate(`/treino/${treino.id}`)}
              style={{
                padding: '16px',
                backgroundColor: '#2a2a2a',
                borderRadius: '8px',
                border: '1px solid #3a3a3a',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#333'
                e.currentTarget.style.borderColor = '#4CAF50'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2a2a2a'
                e.currentTarget.style.borderColor = '#3a3a3a'
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
                {treino.nome}
              </h3>
              <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#999' }}>
                <span>⏱️ {treino.duracao_min}-{treino.duracao_max} min</span>
                <span>📊 {treino.nivel}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
