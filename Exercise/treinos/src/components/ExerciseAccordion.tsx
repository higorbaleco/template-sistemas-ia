import React, { useState } from 'react'
import { Exercise } from '../data/types'

interface ExerciseAccordionProps {
  exercise: Exercise
  label: string
  description?: string
  onExpand?: () => void
}

export const ExerciseAccordion: React.FC<ExerciseAccordionProps> = ({
  exercise,
  label,
  description,
  onExpand
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen && onExpand) {
      onExpand()
    }
  }

  return (
    <div style={{ marginBottom: '12px' }}>
      <div
        onClick={handleToggle}
        style={{
          padding: '12px 16px',
          backgroundColor: '#2a2a2a',
          borderRadius: '8px',
          border: '1px solid #3a3a3a',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'background-color 0.2s'
        }}
      >
        <div>
          <div style={{ fontWeight: 500, fontSize: '15px', color: '#f5f5f5' }}>
            {label}
          </div>
          {description && (
            <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
              {description}
            </div>
          )}
        </div>
        <div
          style={{
            fontSize: '18px',
            transition: 'transform 0.2s',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)'
          }}
        >
          ▼
        </div>
      </div>

      {isOpen && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#242424',
            borderRadius: '0 0 8px 8px',
            borderLeft: '1px solid #3a3a3a',
            borderRight: '1px solid #3a3a3a',
            borderBottom: '1px solid #3a3a3a',
            marginTop: '-4px'
          }}
        >
          <div style={{ marginBottom: '12px' }}>
            <h4 style={{ fontSize: '13px', color: '#4CAF50', marginBottom: '6px' }}>
              Como fazer
            </h4>
            <ol style={{ paddingLeft: '20px', color: '#ddd', fontSize: '13px', lineHeight: '1.6' }}>
              {exercise.como_fazer?.map((step, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {exercise.erros_comuns && exercise.erros_comuns.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <h4 style={{ fontSize: '13px', color: '#ff9800', marginBottom: '6px' }}>
                Erros comuns
              </h4>
              <ul style={{ paddingLeft: '20px', color: '#ddd', fontSize: '13px', lineHeight: '1.6' }}>
                {exercise.erros_comuns.map((error, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {exercise.versao_facil && (
            <div style={{ marginBottom: '8px', padding: '8px', backgroundColor: '#1a3a1a', borderRadius: '4px', fontSize: '13px', color: '#90EE90', borderLeft: '3px solid #4CAF50' }}>
              <strong>Mais fácil:</strong> {exercise.versao_facil}
            </div>
          )}

          {exercise.versao_dificil && (
            <div style={{ padding: '8px', backgroundColor: '#3a1a1a', borderRadius: '4px', fontSize: '13px', color: '#ff6b6b', borderLeft: '3px solid #ff9800' }}>
              <strong>Mais difícil:</strong> {exercise.versao_dificil}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
