import { useEffect } from 'react'
import Icon from './Icon'

const toastIconNames = {
  success: 'check',
  error: 'alert-circle',
  info: 'info',
}

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id)
    }, toast.duration || 4000)
    return () => clearTimeout(timer)
  }, [toast, onDismiss])

  const iconName = toastIconNames[toast.type] || 'info'

  return (
    <div
      className={`toast toast-${toast.type || 'success'}`}
      role="status"
    >
      <span className="toast-icon" aria-hidden="true">
        <Icon name={iconName} size={18} strokeWidth={2.5} />
      </span>
      <div className="toast-content">
        <span className="toast-message">{toast.message}</span>
      </div>
      <button
        type="button"
        className="toast-close"
        aria-label="Fechar notificação"
        onClick={() => onDismiss(toast.id)}
      >
        <Icon name="close" size={14} strokeWidth={2.5} />
      </button>
    </div>
  )
}

function Toast({ toasts = [], onDismiss }) {
  if (!toasts.length) return null

  return (
    <div
      className="toast-region"
      aria-label="Notificações do sistema"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

export default Toast
