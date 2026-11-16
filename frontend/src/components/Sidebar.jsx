import ThemeToggle from './ThemeToggle'

function Sidebar({
  activePage,
  onNavigate,
  user,
  onLogout,
  pendingTasksCount = 0,
  activeGoalsCount = 0,
}) {
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
        <span className="brand-mark">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </span>
        <span>Organize<span className="brand-accent">Me</span></span>
      </div>

      <div className="sidebar-section-label">MENU PRINCIPAL</div>

      <nav className="main-nav" aria-label="Navegação principal">
        <a
          className={`nav-item ${activePage === 'home' ? 'active' : ''}`}
          href="#inicio"
          onClick={(event) => {
            event.preventDefault()
            onNavigate('home')
          }}
        >
          <span className="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </span>
          <span className="nav-label">Visão geral</span>
        </a>

        <a
          className={`nav-item ${activePage === 'tasks' ? 'active' : ''}`}
          href="#tasks"
          onClick={(event) => {
            event.preventDefault()
            onNavigate('tasks')
          }}
        >
          <span className="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </span>
          <span className="nav-label">Minhas tasks</span>
          {pendingTasksCount > 0 && (
            <span className="nav-badge" title={`${pendingTasksCount} pendentes`}>
              {pendingTasksCount}
            </span>
          )}
        </a>

        <a
          className={`nav-item ${activePage === 'goals' ? 'active' : ''}`}
          href="#objetivos"
          onClick={(event) => {
            event.preventDefault()
            onNavigate('goals')
          }}
        >
          <span className="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </span>
          <span className="nav-label">Objetivos</span>
          {activeGoalsCount > 0 && (
            <span className="nav-badge" title={`${activeGoalsCount} ativos`}>
              {activeGoalsCount}
            </span>
          )}
        </a>
      </nav>

      <div className="sidebar-footer">
        <div className="profile">
          <div className="avatar">{initials}</div>
          <div className="profile-details">
            <strong>{user?.name ?? 'Usuário'}</strong>
            <span>{user?.email ?? ''}</span>
          </div>
        </div>
        <div className="sidebar-footer-actions">
          <ThemeToggle className="sidebar-theme-toggle" />
          <button
            className="logout-button"
            type="button"
            aria-label="Sair da conta"
            title="Sair da conta"
            onClick={onLogout}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
