import React from 'react'
import { Check } from 'lucide-react'
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
      className={`
        p-3 mb-2 rounded-lg
        transition-all duration-200 cursor-pointer
        ${isChecked
          ? 'bg-success/20 border-2 border-success dark:bg-success/10'
          : 'bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-700'
        }
        ${isChecked ? 'opacity-70' : 'opacity-100 hover:opacity-90'}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div
          className={`
            w-5 h-5 rounded-md flex-shrink-0
            flex items-center justify-center
            transition-all duration-200
            ${isChecked
              ? 'bg-success dark:bg-success/80'
              : 'bg-neutral-300 dark:bg-neutral-600 border border-neutral-400 dark:border-neutral-500'
            }
          `}
        >
          {isChecked && <Check size={16} className="text-white" strokeWidth={3} />}
        </div>

        {/* Label and description */}
        <div className="flex-1">
          <div className="font-semibold text-neutral-900 dark:text-neutral-50">
            {label}
          </div>
          {description && (
            <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {description}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
