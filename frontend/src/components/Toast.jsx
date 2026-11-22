import { useEffect, useState } from 'react'
import Icon from './Icon'

const toastIconNames = {
  success: 'check',
  error: 'alert-circle',
  info: 'info',
}

const supportsAriaNotify =
  typeof document !== 'undefined' && typeof document.ariaNotify === 'function'

function ToastItem({ toast, onDismiss }) {
  const [isPaused, setIsPaused] = useState(false)
  const duration = toast.duration || (toast.type === 'error' ? 6000 : 4000)

  useEffect(() => {
    if (supportsAriaNotify && toast.message) {
      document.ariaNotify(toast.message)
    }
  }, [toast.message])

  useEffect(() => {
    if (isPaused) return
    const timer = setTimeout(() => {
      onDismiss(toast.id)
    }, duration)
    return () => clearTimeout(timer)
  }, [toast.id, duration, isPaused, onDismiss])

  const iconName = toastIconNames[toast.type] || 'info'
  const liveRole = supportsAriaNotify
    ? undefined
    : toast.type === 'error'
      ? 'alert'
      : 'status'

  return (
    <div
      className={`toast toast-${toast.type || 'success'}`}
      role={liveRole}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false)
        }
      }}
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
  return (
    <div
      className="toast-region"
      role="region"
      aria-label="Notificações do sistema"
      aria-live={supportsAriaNotify ? undefined : 'polite'}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

export default Toast
