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

const emptyFormState = {
  id: null,
  title: '',
  description: '',
  priority: 'MEDIUM',
  estimatedMinutes: '',
  spentMinutes: '',
  goalId: '',
  completed: false,
}

function TasksPage({
  tasks,
  goals = [],
  isLoading,
  error,
  onToggleTask,
  onCreateTask,
  onDeleteTask,
  todayDate,
}) {
  const [activeFilter, setActiveFilter] = useState('todas')
  const [searchQuery, setSearchQuery] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [taskForm, setTaskForm] = useState(emptyFormState)

  const visibleTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (activeFilter === 'pendentes' && task.completed) return false
      if (activeFilter === 'concluidas' && !task.completed) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = (task.title || '').toLowerCase().includes(q)
        const matchDesc = (task.description || '').toLowerCase().includes(q)
        const matchGoal = (task.goal?.title || '').toLowerCase().includes(q)
        if (!matchTitle && !matchDesc && !matchGoal) return false
      }
      return true
    })
  }, [activeFilter, searchQuery, tasks])

  const completedTasks = tasks.filter((task) => task.completed).length
  const pendingTasks = tasks.length - completedTasks
  const progressPercent = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0

  function openNewTaskModal() {
    setTaskForm(emptyFormState)
    setFormError('')
    setIsFormOpen(true)
  }

  function openEditTaskModal(task) {
    setTaskForm({
      id: task.id,
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'MEDIUM',
      estimatedMinutes: task.estimatedMinutes ? String(task.estimatedMinutes) : '',
      spentMinutes: task.spentMinutes ? String(task.spentMinutes) : '',
      goalId: task.goal?.id ? String(task.goal.id) : '',
      completed: Boolean(task.completed),
    })
    setFormError('')
    setIsFormOpen(true)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const title = taskForm.title.trim()
    if (!title) return

    setIsSaving(true)
    setFormError('')
    try {
      const payload = {
        ...(taskForm.id ? { id: taskForm.id } : {}),
        title,
        description: taskForm.description.trim(),
        completed: taskForm.completed,
        priority: taskForm.priority || 'MEDIUM',
        estimatedMinutes: Number(taskForm.estimatedMinutes) || 0,
        spentMinutes: Number(taskForm.spentMinutes) || 0,
        goal: taskForm.goalId ? { id: Number(taskForm.goalId) } : null,
      }
      await onCreateTask(payload)
      setTaskForm(emptyFormState)
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
        <div className="breadcrumb">
          Workspace <span>/</span> <strong>Minhas tasks</strong>
        </div>
      </header>

      <section className="page-heading">
        <div>
          <p className="eyebrow">{todayDate}</p>
          <h1>Minhas tasks</h1>
          <p className="subtitle">
            Organize suas atividades diárias, vincule a objetivos e acompanhe seu tempo.
          </p>
        </div>
        <button
          className="primary-button"
          type="button"
          onClick={openNewTaskModal}
        >
          <span>+</span> Nova task
        </button>
      </section>

      <section className="summary-grid" aria-label="Resumo das tasks">
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
            <span>Concluídas</span>
            <strong>{completedTasks}</strong>
          </div>
          <small>finalizadas</small>
        </article>
        <article className="summary-card">
          <span className="summary-icon amber">↗</span>
          <div className="summary-progress-col">
            <span>Progresso geral</span>
            <strong>{progressPercent}%</strong>
            <div className="mini-progress-track" aria-hidden="true">
              <div
                className="mini-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <small>concluído</small>
        </article>
      </section>

      <section className="tasks-section">
        {(error || formError) && (
          <p className="request-error" role="alert">
            {error || formError}
          </p>
        )}

        <div className="section-header">
          <div>
            <h2>
              Lista de tasks <span>{visibleTasks.length}</span>
            </h2>
            <p>Clique no check para concluir ou nos botões ao lado para editar/excluir.</p>
          </div>

          <div className="toolbar-controls">
            <div className="search-box">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar task ou objetivo..."
                aria-label="Buscar tasks"
              />
            </div>
            <div className="filters" role="group" aria-label="Filtrar tasks">
              {filters.map((filter) => (
                <button
                  className={
                    activeFilter === filter.value ? 'filter active' : 'filter'
                  }
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="task-list">
          {isLoading ? (
            <div className="empty-state">
              <p>Carregando tasks...</p>
            </div>
          ) : visibleTasks.length ? (
            visibleTasks.map((task) => (
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

                <div className="card-actions">
                  <button
                    className="icon-action-btn"
                    type="button"
                    title="Editar task"
                    aria-label={`Editar ${task.title}`}
                    onClick={() => openEditTaskModal(task)}
                  >
                    ✎
                  </button>
                  {onDeleteTask && (
                    <button
                      className="icon-action-btn danger"
                      type="button"
                      title="Excluir task"
                      aria-label={`Excluir ${task.title}`}
                      onClick={() => onDeleteTask(task.id)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <span className="empty-icon">✓</span>
              <h3>Nenhuma task encontrada</h3>
              <p>
                Adicione uma nova task no botão acima ou ajuste sua busca/filtro.
              </p>
            </div>
          )}
        </div>
      </section>

      {isFormOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={() => setIsFormOpen(false)}
        >
          <form
            className="task-form"
            onSubmit={handleSubmit}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="form-heading">
              <div>
                <p className="eyebrow">
                  {taskForm.id ? 'EDITAR TASK' : 'NOVA TASK'}
                </p>
                <h2>
                  {taskForm.id
                    ? 'Atualizar detalhes da task'
                    : 'O que precisa ser feito?'}
                </h2>
              </div>
              <button
                type="button"
                className="close-button"
                onClick={() => setIsFormOpen(false)}
                aria-label="Fechar"
              >
                ×
              </button>
            </div>

            <label htmlFor="title">Título</label>
            <input
              id="title"
              autoFocus
              required
              value={taskForm.title}
              onChange={(event) =>
                setTaskForm({ ...taskForm, title: event.target.value })
              }
              placeholder="Ex.: Preparar apresentação do projeto"
            />

            <label htmlFor="description">
              Descrição <span>(opcional)</span>
            </label>
            <textarea
              id="description"
              rows="3"
              value={taskForm.description}
              onChange={(event) =>
                setTaskForm({ ...taskForm, description: event.target.value })
              }
              placeholder="Adicione notas, links ou passos importantes..."
            />

            <div className="form-row">
              <div>
                <label htmlFor="priority">Prioridade</label>
                <select
                  id="priority"
                  value={taskForm.priority}
                  onChange={(event) =>
                    setTaskForm({ ...taskForm, priority: event.target.value })
                  }
                >
                  <option value="LOW">Baixa</option>
                  <option value="MEDIUM">Média</option>
                  <option value="HIGH">Alta</option>
                </select>
              </div>

              <div>
                <label htmlFor="goalId">
                  Objetivo vinculado <span>(opcional)</span>
                </label>
                <select
                  id="goalId"
                  value={taskForm.goalId}
                  onChange={(event) =>
                    setTaskForm({ ...taskForm, goalId: event.target.value })
                  }
                >
                  <option value="">Sem vínculo</option>
                  {goals.map((goal) => (
                    <option key={goal.id} value={goal.id}>
                      {goal.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div>
                <label htmlFor="estimatedMinutes">
                  Estimativa <span>(min)</span>
                </label>
                <input
                  id="estimatedMinutes"
                  type="number"
                  min="0"
                  value={taskForm.estimatedMinutes}
                  onChange={(event) =>
                    setTaskForm({
                      ...taskForm,
                      estimatedMinutes: event.target.value,
                    })
                  }
                  placeholder="Ex.: 45"
                />
              </div>

              <div>
                <label htmlFor="spentMinutes">
                  Tempo dedicado <span>(min)</span>
                </label>
                <input
                  id="spentMinutes"
                  type="number"
                  min="0"
                  value={taskForm.spentMinutes}
                  onChange={(event) =>
                    setTaskForm({
                      ...taskForm,
                      spentMinutes: event.target.value,
                    })
                  }
                  placeholder="Ex.: 20"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setIsFormOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="primary-button"
                type="submit"
                disabled={isSaving}
              >
                {isSaving
                  ? 'Salvando...'
                  : taskForm.id
                    ? 'Salvar alterações'
                    : 'Adicionar task'}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  )
}

export default TasksPage
