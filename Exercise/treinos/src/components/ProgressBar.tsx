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
    <div className="px-6 py-4 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
      <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
        {done} de {total} etapas · <span className="font-semibold text-primary-600 dark:text-primary-400">{percent}%</span>
      </div>
      <div className="w-full h-2 bg-neutral-300 dark:bg-neutral-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-primary rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
