function Sidebar({ activePage, onNavigate }) {
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
          <div className="avatar">PC</div>
          <div>
            <strong>Teste User</strong>
            <span>Meu espaço</span>
          </div>
        </div>
        <button className="logout-button" type="button" aria-label="Sair">↪</button>
      </div>
    </aside>
  )
}

export default Sidebar

