import React from 'react'

interface ProgressBarProps {
  done: number
  total: number
  percent: number
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  done,
  total,
  percent
}) => {
  return (
    <div style={{ padding: '16px', backgroundColor: '#2a2a2a', marginBottom: '16px' }}>
      <div
        style={{
          marginBottom: '8px',
          fontSize: '14px',
          color: '#999'
        }}
      >
        {done} de {total} etapas · {percent}%
      </div>
      <div
        style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#404040',
          borderRadius: '4px',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            height: '100%',
            backgroundColor: '#4CAF50',
            width: `${percent}%`,
            transition: 'width 0.3s ease'
          }}
        />
      </div>
    </div>
  )
}
