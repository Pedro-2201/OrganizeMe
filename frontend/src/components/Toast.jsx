import { useEffect } from 'react'

// Notificação temporária (região aria-live, não rouba o foco).
function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [toast, onDismiss])

  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast && (
        <div className={`toast ${toast.type}`} key={toast.id}>
          <span>{toast.message}</span>
          <button type="button" aria-label="Fechar notificação" onClick={onDismiss}>
            ×
          </button>
        </div>
      )}
    </div>
  )
}

export default Toast
