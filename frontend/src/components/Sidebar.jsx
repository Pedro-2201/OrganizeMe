import Icon from './Icon'
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
          <Icon name="layers" size={18} strokeWidth={2.5} />
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
            <Icon name="grid" size={18} />
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
            <Icon name="check-square" size={18} />
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
            <Icon name="target" size={18} />
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
            <Icon name="logout" size={17} />
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
