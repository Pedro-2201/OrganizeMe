const priorityLabels = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
}

function HomePage({ tasks, isLoading, error, onToggleTask, onNavigate, todayDate }) {
  const completedTasks = tasks.filter((task) => task.completed).length
  const pendingTasks = tasks.length - completedTasks
  const progressPercent = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0
  const pendingList = tasks.filter((task) => !task.completed).slice(0, 4)

  return (
    <main className="content" id="inicio">
      <header className="topbar">
        <div className="breadcrumb">Workspace <span>/</span> Visão geral</div>
        <button className="notification" type="button" aria-label="Notificações">♢<i /></button>
      </header>

      <section className="page-heading">
        <div>
          <p className="eyebrow">{todayDate}</p>
          <h1>Visão geral</h1>
          <p className="subtitle">Bem-vindo de volta! Aqui está o resumo do seu dia.</p>
        </div>
        <button className="primary-button" type="button" onClick={() => onNavigate('tasks')}>
          <span>✓</span> Minhas tasks
        </button>
      </section>

      <section className="summary-grid" aria-label="Resumo geral">
        <article className="summary-card">
          <span className="summary-icon purple">◷</span>
          <div><span>Tasks pendentes</span><strong>{pendingTasks}</strong></div>
          <small>para concluir</small>
        </article>
        <article className="summary-card">
          <span className="summary-icon green">✓</span>
          <div><span>Concluídas</span><strong>{completedTasks}</strong></div>
          <small>nesta semana</small>
        </article>
        <article className="summary-card">
          <span className="summary-icon orange">↗</span>
          <div><span>Progresso semanal</span><strong>{progressPercent}%</strong></div>
          <small>meta alcançada</small>
        </article>
      </section>

      <section className="tasks-section">
        {error && <p className="request-error" role="alert">{error}</p>}
        <div className="section-header">
          <div>
            <h2>Tarefas em destaque <span>{pendingList.length}</span></h2>
            <p>Foque no que é prioridade para hoje.</p>
          </div>
          <button className="filter active" type="button" onClick={() => onNavigate('tasks')}>
            Ver todas as tasks →
          </button>
        </div>

        <div className="task-list">
          {isLoading ? (
            <div className="empty-state"><p>Carregando tasks...</p></div>
          ) : pendingList.length ? (
            pendingList.map((task) => (
              <article className={task.completed ? 'task-card completed' : 'task-card'} key={task.id}>
                <button
                  className="check-button"
                  type="button"
                  aria-label={task.completed ? `Reabrir ${task.title}` : `Concluir ${task.title}`}
                  onClick={() => onToggleTask(task)}
                >
                  {task.completed ? '✓' : ''}
                </button>
                <div className="task-info">
                  <div className="task-title-row">
                    <h3>{task.title}</h3>
                    <span className={`priority ${(task.priority || 'MEDIUM').toLowerCase()}`}>
                      {priorityLabels[task.priority] || 'Média'}
                    </span>
                  </div>
                  {task.description && <p>{task.description}</p>}
                  <span className="due-date">
                    {task.estimatedMinutes > 0
                      ? `◷ ${task.estimatedMinutes} min${task.spentMinutes > 0 ? ` (${task.spentMinutes} min gastos)` : ''}`
                      : '◷ Sem estimativa'}
                  </span>
                </div>
                <button className="more-button" type="button" aria-label={`Mais opções para ${task.title}`}>•••</button>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <span>✓</span>
              <h3>Tudo em dia!</h3>
              <p>Nenhuma task pendente. Aproveite para adicionar novas metas ou descansar.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default HomePage

