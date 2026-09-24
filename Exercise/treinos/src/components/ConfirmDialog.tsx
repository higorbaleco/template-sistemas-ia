import React from 'react'

interface ConfirmDialogProps {
  title: string
  message?: string
  cancelText?: string
  confirmText?: string
  onCancel: () => void
  onConfirm: () => void
  isDangerous?: boolean
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  cancelText = 'Cancelar',
  confirmText = 'Confirmar',
  onCancel,
  onConfirm,
  isDangerous = false
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#2a2a2a',
          borderRadius: '12px',
          padding: '20px',
          maxWidth: '280px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)'
        }}
      >
        <h3 style={{ marginBottom: '8px', fontSize: '16px', fontWeight: 600 }}>
          {title}
        </h3>
        {message && (
          <p style={{ fontSize: '14px', color: '#999', marginBottom: '16px' }}>
            {message}
          </p>
        )}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 16px',
              backgroundColor: '#404040',
              color: '#f5f5f5',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#505050'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#404040'
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '10px 16px',
              backgroundColor: isDangerous ? '#d32f2f' : '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDangerous ? '#e53935' : '#66BB6A'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isDangerous ? '#d32f2f' : '#4CAF50'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
