import { useMemo, useState } from 'react'

const filters = [
  { value: 'todas', label: 'Todas' },
  { value: 'pendentes', label: 'Pendentes' },
  { value: 'concluidas', label: 'Concluídas' },
]

const priorityLabels = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
}

function TasksPage({
  tasks,
  isLoading,
  error,
  onToggleTask,
  onCreateTask,
  todayDate,
}) {
  const [activeFilter, setActiveFilter] = useState('todas')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    estimatedMinutes: '',
  })

  const visibleTasks = useMemo(() => {
    if (activeFilter === 'pendentes') return tasks.filter((task) => !task.completed)
    if (activeFilter === 'concluidas') return tasks.filter((task) => task.completed)
    return tasks
  }, [activeFilter, tasks])

  const completedTasks = tasks.filter((task) => task.completed).length
  const pendingTasks = tasks.length - completedTasks
  const progressPercent = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0

  async function handleSubmit(event) {
    event.preventDefault()
    const title = newTask.title.trim()
    if (!title) return

    setIsSaving(true)
    setFormError('')
    try {
      await onCreateTask({
        title,
        description: newTask.description.trim(),
        completed: false,
        priority: newTask.priority || 'MEDIUM',
        estimatedMinutes: Number(newTask.estimatedMinutes) || 0,
        spentMinutes: 0,
      })
      setNewTask({
        title: '',
        description: '',
        priority: 'MEDIUM',
        estimatedMinutes: '',
      })
      setIsFormOpen(false)
    } catch (submitError) {
      setFormError(submitError.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="content" id="tasks">
      <header className="topbar">
        <div className="breadcrumb">Workspace <span>/</span> Tasks</div>
        <button className="notification" type="button" aria-label="Notificações">♢<i /></button>
      </header>

      <section className="page-heading">
        <div>
          <p className="eyebrow">{todayDate}</p>
          <h1>Minhas tasks</h1>
          <p className="subtitle">Um passo de cada vez. Você está indo bem.</p>
        </div>
        <button className="primary-button" type="button" onClick={() => setIsFormOpen(true)}>
          <span>+</span> Nova task
        </button>
      </section>

      <section className="summary-grid" aria-label="Resumo das tasks">
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
        {(error || formError) && <p className="request-error" role="alert">{error || formError}</p>}
        <div className="section-header">
          <div>
            <h2>Lista de tasks <span>{tasks.length}</span></h2>
            <p>Cuide do que precisa ser feito hoje.</p>
          </div>
          <div className="filters" role="group" aria-label="Filtrar tasks">
            {filters.map((filter) => (
              <button
                className={activeFilter === filter.value ? 'filter active' : 'filter'}
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="task-list">
          {isLoading ? (
            <div className="empty-state"><p>Carregando tasks...</p></div>
          ) : visibleTasks.length ? (
            visibleTasks.map((task) => (
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
              <h3>Nenhuma task por aqui</h3>
              <p>Adicione uma nova task ou altere o filtro selecionado.</p>
            </div>
          )}
        </div>
      </section>

      {isFormOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setIsFormOpen(false)}>
          <form className="task-form" onSubmit={handleSubmit} onMouseDown={(event) => event.stopPropagation()}>
            <div className="form-heading">
              <div><p className="eyebrow">NOVA TASK</p><h2>O que precisa ser feito?</h2></div>
              <button type="button" className="close-button" onClick={() => setIsFormOpen(false)} aria-label="Fechar">×</button>
            </div>
            <label htmlFor="title">Título</label>
            <input
              id="title"
              autoFocus
              value={newTask.title}
              onChange={(event) => setNewTask({ ...newTask, title: event.target.value })}
              placeholder="Ex.: Preparar apresentação"
            />
            <label htmlFor="description">Descrição <span>(opcional)</span></label>
            <textarea
              id="description"
              rows="3"
              value={newTask.description}
              onChange={(event) => setNewTask({ ...newTask, description: event.target.value })}
              placeholder="Adicione mais detalhes..."
            />
            <div className="form-row">
              <div>
                <label htmlFor="priority">Prioridade</label>
                <select
                  id="priority"
                  value={newTask.priority}
                  onChange={(event) => setNewTask({ ...newTask, priority: event.target.value })}
                >
                  <option value="LOW">Baixa</option>
                  <option value="MEDIUM">Média</option>
                  <option value="HIGH">Alta</option>
                </select>
              </div>
              <div>
                <label htmlFor="estimatedMinutes">Estimativa <span>(minutos)</span></label>
                <input
                  id="estimatedMinutes"
                  type="number"
                  min="0"
                  value={newTask.estimatedMinutes}
                  onChange={(event) => setNewTask({ ...newTask, estimatedMinutes: event.target.value })}
                  placeholder="Ex.: 30"
                />
              </div>
            </div>
            <button className="primary-button form-submit" type="submit" disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Adicionar task'}
            </button>
          </form>
        </div>
      )}
    </main>
  )
}

export default TasksPage

