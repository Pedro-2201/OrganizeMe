import { useState } from 'react'

function RegisterPage({ onRegister, onNavigate }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')

    const cleanName = name.trim()
    const cleanEmail = email.trim()

    if (!cleanName || !cleanEmail || !password) {
      setErrorMessage('Por favor, preencha todos os campos.')
      return
    }

    if (password.length < 6) {
      setErrorMessage('A senha deve conter no mínimo 6 caracteres.')
      return
    }

    setIsLoading(true)

    try {
      if (onRegister) {
        await onRegister({ name: cleanName, email: cleanEmail, password })
      }
    } catch (err) {
      setErrorMessage(err.message || 'Erro ao criar conta. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <header className="login-header">
          <div className="brand login-brand">
            <span className="brand-mark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </span>
            <span>Organize<span className="brand-accent">Me</span></span>
          </div>
          <h1>Crie sua conta</h1>
          <p className="subtitle">
            Comece em segundos. Tudo o que você precisa para organizar sua rotina.
          </p>
        </header>

        {errorMessage && (
          <div className="request-error login-error" role="alert">
            {errorMessage}
          </div>
        )}

        <form className="login-form" method="post" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Nome completo</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              enterKeyHint="next"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Pedro Xavier"
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <span id="reg-email-hint" className="field-hint">
              Formato: voce@exemplo.com
            </span>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              spellCheck="false"
              required
              enterKeyHint="next"
              aria-describedby="reg-email-hint"
              aria-errormessage="reg-email-error"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
            />
            <div id="reg-email-error" className="field-error-msg">
              <span aria-hidden="true">⚠</span> Informe um endereço de email válido.
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="new-password">Senha</label>
            <span id="reg-password-hint" className="field-hint">
              Mínimo de 6 caracteres
            </span>
            <div className="password-input-wrapper">
              <input
                id="new-password"
                name="new-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                minLength={6}
                enterKeyHint="done"
                aria-describedby="reg-password-hint"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Crie uma senha segura"
              />
              <button
                type="button"
                className="password-toggle-btn"
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="primary-button login-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Criando conta...' : 'Criar conta gratuita'}
          </button>
        </form>

        <footer className="login-footer">
          <p>
            Já tem uma conta?{' '}
            <a
              href="#login"
              onClick={(e) => {
                e.preventDefault()
                if (onNavigate) onNavigate('login')
              }}
            >
              Fazer login
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}

export default RegisterPage
