function GoalsPage({ todayDate, onNavigate }) {
  return (
    <main className="content" id="objetivos">
      <header className="topbar">
        <div className="breadcrumb">Workspace <span>/</span> Objetivos</div>
        <button className="notification" type="button" aria-label="Notificações">♢<i /></button>
      </header>

      <section className="page-heading">
        <div>
          <p className="eyebrow">{todayDate}</p>
          <h1>Objetivos</h1>
          <p className="subtitle">Defina suas grandes metas e conecte suas tarefas ao seu propósito.</p>
        </div>
        <button className="primary-button" type="button" onClick={() => onNavigate('tasks')}>
          <span>✓</span> Ver tasks
        </button>
      </section>

      <section className="tasks-section">
        <div className="empty-state">
          <span>◈</span>
          <h3>Módulo de Objetivos em breve</h3>
          <p>Você poderá vincular suas tarefas diárias diretamente aos seus objetivos de longo prazo.</p>
        </div>
      </section>
    </main>
  )
}

export default GoalsPage

