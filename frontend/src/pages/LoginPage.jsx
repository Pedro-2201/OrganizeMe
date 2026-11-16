import { useState } from 'react'
import Icon from '../components/Icon'
import ThemeToggle from '../components/ThemeToggle'

function LoginPage({ onLogin, onNavigate }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')

    const cleanEmail = email.trim()
    if (!cleanEmail || !password) {
      setErrorMessage('Por favor, preencha o email e a senha.')
      return
    }

    setIsLoading(true)

    try {
      if (onLogin) {
        await onLogin({ email: cleanEmail, password, rememberMe })
      }
    } catch (err) {
      setErrorMessage(err.message || 'Erro ao realizar login. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-theme-toggle">
        <ThemeToggle />
      </div>
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
          <h1>Bem-vindo de volta</h1>
          <p className="subtitle">Entre para gerenciar suas tarefas e objetivos.</p>
        </header>

        {errorMessage && (
          <div className="request-error login-error" role="alert">
            {errorMessage}
          </div>
        )}

        <form className="login-form" method="post" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <span id="login-email-hint" className="field-hint">
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
              autoFocus
              aria-describedby="login-email-hint"
              aria-errormessage="login-email-error"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
            />
            <div id="login-email-error" className="field-error-msg">
              <span aria-hidden="true">⚠</span> Informe um endereço de email válido.
            </div>
          </div>

          <div className="input-group">
            <div className="password-label-row">
              <label htmlFor="current-password">Senha</label>
            </div>
            <div className="password-input-wrapper">
              <input
                id="current-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                enterKeyHint="done"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
              />
              <button
                type="button"
                className="password-toggle-btn"
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Icon name="eye-off" /> : <Icon name="eye" />}
              </button>
            </div>
          </div>

          <div className="remember-me-row">
            <label className="checkbox-label" htmlFor="remember-me">
              <input
                type="checkbox"
                id="remember-me"
                name="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Manter conectado neste navegador</span>
            </label>
          </div>

          <button
            type="submit"
            className="primary-button login-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar no Workspace'}
          </button>
        </form>

        <footer className="login-footer">
          <p>
            Não tem uma conta?{' '}
            <a
              href="#cadastro"
              onClick={(e) => {
                e.preventDefault()
                if (onNavigate) onNavigate('register')
              }}
            >
              Cadastre-se gratuitamente
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}

export default LoginPage
