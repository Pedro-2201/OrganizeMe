const priorityLabels = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
}

function HomePage({
  user,
  tasks,
  goals = [],
  isLoading,
  error,
  onToggleTask,
  onDeleteTask,
  onNavigate,
  todayDate,
}) {
  const completedTasks = tasks.filter((task) => task.completed).length
  const pendingTasks = tasks.length - completedTasks
  const progressPercent = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0
  const pendingList = tasks
    .filter((task) => !task.completed)
    .sort((a, b) => {
      const order = { HIGH: 0, MEDIUM: 1, LOW: 2 }
      return (order[a.priority] ?? 1) - (order[b.priority] ?? 1)
    })
    .slice(0, 4)

  const activeGoalsList = goals.filter((goal) => !goal.completed).slice(0, 3)
  const firstName = user?.name ? user.name.split(' ')[0] : 'Bem-vindo'

  return (
    <main className="content" id="inicio">
      <header className="topbar">
        <div className="breadcrumb">
          Workspace <span>/</span> <strong>Visão geral</strong>
        </div>
        <div className="topbar-actions">
          <button
            className="ghost-action-button"
            type="button"
            onClick={() => onNavigate('goals')}
          >
            ◈ Ver objetivos
          </button>
        </div>
      </header>

      <section className="page-heading">
        <div>
          <p className="eyebrow">{todayDate}</p>
          <h1>Olá, {firstName} 👋</h1>
          <p className="subtitle">
            Aqui está o panorama do seu dia. Mantenha o ritmo nas prioridades!
          </p>
        </div>
        <div className="heading-actions">
          <button
            className="primary-button"
            type="button"
            onClick={() => onNavigate('tasks')}
          >
            <span>+</span> Gerenciar tasks
          </button>
        </div>
      </section>

      <section className="summary-grid" aria-label="Resumo geral">
        <article className="summary-card">
          <span className="summary-icon teal">◷</span>
          <div>
            <span>Tasks pendentes</span>
            <strong>{pendingTasks}</strong>
          </div>
          <small>para concluir</small>
        </article>

        <article className="summary-card">
          <span className="summary-icon emerald">✓</span>
          <div>
            <span>Tasks concluídas</span>
            <strong>{completedTasks}</strong>
          </div>
          <small>finalizadas</small>
        </article>

        <article className="summary-card">
          <span className="summary-icon amber">↗</span>
          <div className="summary-progress-col">
            <span>Taxa de conclusão</span>
            <strong>{progressPercent}%</strong>
            <div className="mini-progress-track" aria-hidden="true">
              <div
                className="mini-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <small>{goals.length} objetivos</small>
        </article>
      </section>

      <div className="dashboard-columns">
        <section className="tasks-section">
          {error && (
            <p className="request-error" role="alert">
              {error}
            </p>
          )}
          <div className="section-header">
            <div>
              <h2>
                Prioridades do dia <span>{pendingList.length}</span>
              </h2>
              <p>Ordenadas pela urgência para você focar agora.</p>
            </div>
            <button
              className="link-action-btn"
              type="button"
              onClick={() => onNavigate('tasks')}
            >
              Ver todas →
            </button>
          </div>

          <div className="task-list">
            {isLoading ? (
              <div className="empty-state">
                <p>Carregando suas tasks...</p>
              </div>
            ) : pendingList.length ? (
              pendingList.map((task) => (
                <article
                  className={task.completed ? 'task-card completed' : 'task-card'}
                  key={task.id}
                >
                  <button
                    className="check-button"
                    type="button"
                    aria-label={
                      task.completed
                        ? `Reabrir ${task.title}`
                        : `Concluir ${task.title}`
                    }
                    onClick={() => onToggleTask(task)}
                  >
                    {task.completed ? '✓' : ''}
                  </button>
                  <div className="task-info">
                    <div className="task-title-row">
                      <h3>{task.title}</h3>
                      <span
                        className={`priority ${(task.priority || 'MEDIUM').toLowerCase()}`}
                      >
                        {priorityLabels[task.priority] || 'Média'}
                      </span>
                      {task.goal && (
                        <span className="goal-tag" title="Objetivo vinculado">
                          ◈ {task.goal.title}
                        </span>
                      )}
                    </div>
                    {task.description && <p>{task.description}</p>}
                    <div className="task-meta-row">
                      <span className="due-date">
                        {task.estimatedMinutes > 0
                          ? `◷ ${task.estimatedMinutes} min estimados${
                              task.spentMinutes > 0
                                ? ` • ${task.spentMinutes} min gastos`
                                : ''
                            }`
                          : '◷ Sem estimativa'}
                      </span>
                    </div>
                  </div>
                  {onDeleteTask && (
                    <div className="card-actions">
                      <button
                        className="icon-action-btn danger"
                        type="button"
                        title="Excluir task"
                        aria-label={`Excluir ${task.title}`}
                        onClick={() => onDeleteTask(task.id)}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </article>
              ))
            ) : (
              <div className="empty-state">
                <span className="empty-icon">✓</span>
                <h3>Tudo em dia por aqui!</h3>
                <p>
                  Nenhuma task pendente no momento. Aproveite para criar novas
                  metas ou descansar.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="tasks-section side-panel">
          <div className="section-header">
            <div>
              <h2>
                Objetivos ativos <span>{activeGoalsList.length}</span>
              </h2>
              <p>Suas metas de médio e longo prazo.</p>
            </div>
            <button
              className="link-action-btn"
              type="button"
              onClick={() => onNavigate('goals')}
            >
              Gerenciar →
            </button>
          </div>

          <div className="goal-mini-list">
            {activeGoalsList.length ? (
              activeGoalsList.map((goal) => {
                const goalTasks = tasks.filter((t) => t.goal?.id === goal.id)
                const goalCompleted = goalTasks.filter((t) => t.completed).length
                const goalPct = goalTasks.length
                  ? Math.round((goalCompleted / goalTasks.length) * 100)
                  : goal.completed
                    ? 100
                    : 0

                return (
                  <article className="goal-mini-card" key={goal.id}>
                    <div className="goal-mini-top">
                      <h4>{goal.title}</h4>
                      <span className="goal-mini-pct">{goalPct}%</span>
                    </div>
                    {goal.description && <p>{goal.description}</p>}
                    <div className="mini-progress-track">
                      <div
                        className="mini-progress-fill"
                        style={{ width: `${goalPct}%` }}
                      />
                    </div>
                    <small className="goal-mini-meta">
                      {goalTasks.length > 0
                        ? `${goalCompleted}/${goalTasks.length} tasks concluídas`
                        : 'Nenhuma task vinculada ainda'}
                    </small>
                  </article>
                )
              })
            ) : (
              <div className="empty-state compact">
                <span className="empty-icon">◈</span>
                <h3>Sem objetivos ativos</h3>
                <p>Defina objetivos para conectar suas tarefas diárias.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

export default HomePage
