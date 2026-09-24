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
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card-elevated max-w-sm space-y-4"
      >
        <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-neutral-50">
          {title}
        </h3>
        {message && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {message}
          </p>
        )}
        <div className="flex gap-2 justify-end pt-2">
          <button
            onClick={onCancel}
            className="btn-secondary px-4 py-2"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 font-semibold rounded-lg text-white transition-colors ${
              isDangerous
                ? 'bg-danger hover:bg-danger/90 active:bg-danger/80'
                : 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
