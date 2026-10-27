function Sidebar({ activePage, onNavigate, user, onLogout }) {
  // Gera as iniciais do nome do usuário para o avatar (ex: "Pedro Xavier" → "PX")
  const initials = user?.name
    ? user.name
        .split(' ')
        .slice(0, 2)
        .map((word) => word[0])
        .join('')
        .toUpperCase()
    : '?'

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">O</span>
        <span>Organize<span className="brand-accent">Me</span></span>
      </div>

      <nav className="main-nav" aria-label="Navegação principal">
        <a
          className={`nav-item ${activePage === 'home' ? 'active' : ''}`}
          href="#inicio"
          onClick={(event) => {
            event.preventDefault()
            onNavigate('home')
          }}
        >
          <span>⌂</span> Visão geral
        </a>
        <a
          className={`nav-item ${activePage === 'tasks' ? 'active' : ''}`}
          href="#tasks"
          onClick={(event) => {
            event.preventDefault()
            onNavigate('tasks')
          }}
        >
          <span>✓</span> Minhas tasks
        </a>
        <a
          className={`nav-item ${activePage === 'goals' ? 'active' : ''}`}
          href="#objetivos"
          onClick={(event) => {
            event.preventDefault()
            onNavigate('goals')
          }}
        >
          <span>◈</span> Objetivos
        </a>
      </nav>

      <div className="sidebar-footer">
        <div className="profile">
          <div className="avatar">{initials}</div>
          <div>
            <strong>{user?.name ?? 'Usuário'}</strong>
            <span>{user?.email ?? ''}</span>
          </div>
        </div>
        <button
          className="logout-button"
          type="button"
          aria-label="Sair da conta"
          title="Sair da conta"
          onClick={onLogout}
        >
          ↪
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
