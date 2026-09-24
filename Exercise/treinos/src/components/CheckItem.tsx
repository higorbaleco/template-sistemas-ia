import React from 'react'
import { useWorkoutStore } from '../lib/store'

interface CheckItemProps {
  id: string
  label: string
  description?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
}

export const CheckItem: React.FC<CheckItemProps> = ({
  id,
  label,
  description,
  checked: externalChecked,
  onChange
}) => {
  const { checks, toggleCheck } = useWorkoutStore()
  const isChecked = externalChecked ?? checks[id] ?? false

  const handleChange = () => {
    if (onChange) {
      onChange(!isChecked)
    } else {
      toggleCheck(id)
    }
  }

  return (
    <div
      onClick={handleChange}
      style={{
        padding: '12px 16px',
        marginBottom: '8px',
        borderRadius: '8px',
        backgroundColor: isChecked ? '#2d5a2d' : '#2a2a2a',
        border: isChecked ? '2px solid #4CAF50' : '2px solid #3a3a3a',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        opacity: isChecked ? 0.7 : 1
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '4px',
            backgroundColor: isChecked ? '#4CAF50' : '#404040',
            border: isChecked ? 'none' : '2px solid #555',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: '14px'
          }}
        >
          {isChecked && '✓'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500, fontSize: '16px', color: '#f5f5f5' }}>
            {label}
          </div>
          {description && (
            <div
              style={{
                fontSize: '13px',
                color: '#999',
                marginTop: '4px'
              }}
            >
              {description}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
