import { useEffect, useRef } from 'react'

// Modal acessível baseado no <dialog> nativo: focus trap, aria-modal, Esc e
// devolução do foco ao elemento de origem são tratados pelo navegador.
function Modal({ onClose, labelledBy, role = 'dialog', children }) {
  const dialogRef = useRef(null)
  const pressedOnBackdrop = useRef(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog.open) dialog.showModal()
    // O foco inicial vai para o campo marcado com data-autofocus (ou o primeiro focável)
    dialog.querySelector('[data-autofocus]')?.focus()
    return () => {
      if (dialog.open) dialog.close()
    }
  }, [])

  // Só fecha se o clique começou E terminou no backdrop, evitando perder dados
  // ao arrastar uma seleção de texto para fora do formulário.
  return (
    <dialog
      ref={dialogRef}
      className="modal-dialog"
      role={role}
      aria-labelledby={labelledBy}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onMouseDown={(event) => {
        pressedOnBackdrop.current = event.target === dialogRef.current
      }}
      onClick={(event) => {
        if (pressedOnBackdrop.current && event.target === dialogRef.current) onClose()
        pressedOnBackdrop.current = false
      }}
    >
      {children}
    </dialog>
  )
}

export default Modal
