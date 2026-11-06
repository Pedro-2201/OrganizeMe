import Modal from './Modal'

// Confirmação antes de ações destrutivas (alertdialog).
function ConfirmDialog({ title, message, confirmLabel = 'Excluir', onConfirm, onCancel }) {
  return (
    <Modal onClose={onCancel} labelledBy="confirm-title" role="alertdialog">
      <div className="task-form confirm-dialog">
        <h2 id="confirm-title">{title}</h2>
        <p>{message}</p>
        <div className="form-actions">
          <button type="button" className="secondary-button" data-autofocus onClick={onCancel}>
            Cancelar
          </button>
          <button type="button" className="primary-button danger-button" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
