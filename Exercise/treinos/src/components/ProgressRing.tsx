import React from 'react'

interface ProgressRingProps {
  radius?: number
  circumference?: number
  strokeWidth?: number
  percentage: number
  color?: string
  className?: string
  children?: React.ReactNode
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  radius = 45,
  circumference = 283,
  strokeWidth = 4,
  percentage,
  color = '#7c5ce7',
  className = '',
  children,
}) => {
  const offset = circumference - (percentage / 100) * circumference
  const size = radius * 2 + strokeWidth

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        height={size}
        width={size}
        className="progress-ring"
      >
        {/* Background circle */}
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className="text-neutral-200 dark:text-neutral-700"
        />
        {/* Progress circle */}
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className="progress-ring__circle"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}
