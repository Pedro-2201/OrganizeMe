import Icon from './Icon'

function InlineAlert({
  message,
  variant = 'error',
  className = '',
  actionLabel,
  onAction,
  onDismiss,
}) {
  if (!message) return null

  const isError = variant === 'error'
  const iconName = isError ? 'alert-circle' : 'info'

  return (
    <div
      className={`inline-alert inline-alert-${variant} ${className}`.trim()}
      role={isError ? 'alert' : 'status'}
    >
      <span className="inline-alert-icon" aria-hidden="true">
        <Icon name={iconName} size={16} />
      </span>
      <span className="inline-alert-message">{message}</span>
      {(actionLabel && onAction) || onDismiss ? (
        <div className="inline-alert-actions">
          {actionLabel && onAction && (
            <button
              type="button"
              className="inline-alert-action"
              onClick={onAction}
            >
              {actionLabel}
            </button>
          )}
          {onDismiss && (
            <button
              type="button"
              className="inline-alert-close"
              aria-label="Fechar alerta"
              onClick={onDismiss}
            >
              <Icon name="close" size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>
      ) : null}
    </div>
  )
}

export default InlineAlert
