import { useMemo, useState } from 'react'

const filters = [
  { value: 'todas', label: 'Todas' },
  { value: 'ativas', label: 'Ativas' },
  { value: 'concluidas', label: 'Concluídas' },
]

const emptyTaskDraft = {
  title: '',
  priority: 'MEDIUM',
  estimatedMinutes: '',
}

const emptyGoalState = {
  id: null,
  title: '',
  description: '',
  targetDate: '',
  completed: false,
  defaultGoal: false,
  newTasks: [{ ...emptyTaskDraft }],
}

function formatDate(dateStr) {
  if (!dateStr) return null
  const [year, month, day] = dateStr.split('-')
  return new Date(year, month - 1, day).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function isOverdue(dateStr) {
  if (!dateStr) return false
  const [year, month, day] = dateStr.split('-')
  return new Date(year, month - 1, day) < new Date(new Date().toDateString())
}

function GoalsPage({
  goals,
  tasks = [],
  isLoading,
  error,
  onCreateGoal,
  onToggleGoal,
  onDeleteGoal,
  todayDate,
}) {
  const [activeFilter, setActiveFilter] = useState('todas')
  const [searchQuery, setSearchQuery] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [goalForm, setGoalForm] = useState(emptyGoalState)

  const completedGoals = goals.filter((g) => g.completed).length
  const activeGoals = goals.length - completedGoals
  const progressPercent = goals.length
    ? Math.round((completedGoals / goals.length) * 100)
    : 0

  const visibleGoals = useMemo(() => {
    return goals.filter((goal) => {
      if (activeFilter === 'ativas' && goal.completed) return false
      if (activeFilter === 'concluidas' && !goal.completed) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = (goal.title || '').toLowerCase().includes(q)
        const matchDesc = (goal.description || '').toLowerCase().includes(q)
        if (!matchTitle && !matchDesc) return false
      }
      return true
    })
  }, [activeFilter, searchQuery, goals])

  function openNewGoalModal() {
    setGoalForm({
      ...emptyGoalState,
      newTasks: [{ ...emptyTaskDraft }],
    })
    setFormError('')
    setIsFormOpen(true)
  }

  function openEditGoalModal(goal) {
    setGoalForm({
      id: goal.id,
      title: goal.title || '',
      description: goal.description || '',
      targetDate: goal.targetDate || '',
      completed: Boolean(goal.completed),
      defaultGoal: Boolean(goal.defaultGoal),
      newTasks: [],
    })
    setFormError('')
    setIsFormOpen(true)
  }

  function handleAddDraftTask() {
    setGoalForm((prev) => ({
      ...prev,
      newTasks: [...prev.newTasks, { ...emptyTaskDraft }],
    }))
  }

  function handleRemoveDraftTask(index) {
    setGoalForm((prev) => ({
      ...prev,
      newTasks: prev.newTasks.filter((_, idx) => idx !== index),
    }))
  }

  function handleChangeDraftTask(index, field, value) {
    setGoalForm((prev) => ({
      ...prev,
      newTasks: prev.newTasks.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      ),
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const title = goalForm.title.trim()
    if (!title) return

    const preparedTasks = (goalForm.newTasks || [])
      .filter((t) => t.title && t.title.trim())
      .map((t) => ({
        title: t.title.trim(),
        priority: t.priority || 'MEDIUM',
        estimatedMinutes: Number(t.estimatedMinutes) || 0,
        spentMinutes: 0,
        completed: false,
      }))

    setIsSaving(true)
    setFormError('')
    try {
      await onCreateGoal({
        ...(goalForm.id ? { id: goalForm.id } : {}),
        title,
        description: goalForm.description.trim(),
        targetDate: goalForm.targetDate || null,
        completed: goalForm.completed,
        ...(preparedTasks.length > 0 ? { tasks: preparedTasks } : {}),
      })
      setGoalForm(emptyGoalState)
      setIsFormOpen(false)
    } catch (submitError) {
      setFormError(submitError.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="content" id="objetivos">
      <header className="topbar">
        <div className="breadcrumb">
          Workspace <span>/</span> <strong>Objetivos</strong>
        </div>
      </header>

      <section className="page-heading">
        <div>
          <p className="eyebrow">{todayDate}</p>
          <h1>Meus objetivos</h1>
          <p className="subtitle">
            Defina suas grandes metas e acompanhe a evolução das tasks vinculadas.
          </p>
        </div>
        <button
          className="primary-button"
          type="button"
          onClick={openNewGoalModal}
        >
          <span>+</span> Novo objetivo
        </button>
      </section>

      <section className="summary-grid" aria-label="Resumo dos objetivos">
        <article className="summary-card">
          <span className="summary-icon teal">◈</span>
          <div>
            <span>Objetivos ativos</span>
            <strong>{activeGoals}</strong>
          </div>
          <small>em andamento</small>
        </article>
        <article className="summary-card">
          <span className="summary-icon emerald">✓</span>
          <div>
            <span>Concluídos</span>
            <strong>{completedGoals}</strong>
          </div>
          <small>alcançados</small>
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
          <small>do total</small>
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
              Lista de objetivos <span>{visibleGoals.length}</span>
            </h2>
            <p>Acompanhe suas metas de médio e longo prazo.</p>
          </div>

          <div className="toolbar-controls">
            <div className="search-box">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar objetivo..."
                aria-label="Buscar objetivos"
              />
            </div>
            <div className="filters" role="group" aria-label="Filtrar objetivos">
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
              <p>Carregando objetivos...</p>
            </div>
          ) : visibleGoals.length ? (
            visibleGoals.map((goal) => {
              const linkedTasks = tasks.filter((t) => t.goal?.id === goal.id)
              const completedLinked = linkedTasks.filter((t) => t.completed).length
              const taskProgress = linkedTasks.length
                ? Math.round((completedLinked / linkedTasks.length) * 100)
                : goal.completed
                  ? 100
                  : 0

              return (
                <article
                  className={goal.completed ? 'task-card completed' : 'task-card'}
                  key={goal.id}
                >
                  <button
                    className="check-button"
                    type="button"
                    aria-label={
                      goal.completed
                        ? `Reabrir ${goal.title}`
                        : `Concluir ${goal.title}`
                    }
                    onClick={() => onToggleGoal(goal)}
                  >
                    {goal.completed ? '✓' : ''}
                  </button>

                  <div className="task-info">
                    <div className="task-title-row">
                      <h3>{goal.title}</h3>
                      {goal.defaultGoal && (
                        <span className="goal-tag" title="Meta padrão para tarefas avulsas">
                          📥 Inbox padrão
                        </span>
                      )}
                      {goal.targetDate && (
                        <span
                          className={`priority ${
                            isOverdue(goal.targetDate) && !goal.completed
                              ? 'high'
                              : 'low'
                          }`}
                        >
                          {isOverdue(goal.targetDate) && !goal.completed
                            ? '⚠ Atrasado'
                            : `📅 ${formatDate(goal.targetDate)}`}
                        </span>
                      )}
                      {linkedTasks.length > 0 && (
                        <span className="goal-tag">
                          ✓ {completedLinked}/{linkedTasks.length} tasks ({taskProgress}%)
                        </span>
                      )}
                    </div>
                    {goal.description && <p>{goal.description}</p>}
                    <div className="task-meta-row">
                      <span className="due-date">
                        {goal.defaultGoal
                          ? '◷ Agrupa automaticamente suas tarefas avulsas'
                          : goal.targetDate
                            ? `◷ Prazo final: ${formatDate(goal.targetDate)}`
                            : '◷ Sem prazo definido'}
                      </span>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      className="icon-action-btn"
                      type="button"
                      title="Editar objetivo"
                      aria-label={`Editar ${goal.title}`}
                      onClick={() => openEditGoalModal(goal)}
                    >
                      ✎
                    </button>
                    {onDeleteGoal && !goal.defaultGoal && (
                      <button
                        className="icon-action-btn danger"
                        type="button"
                        title="Excluir objetivo"
                        aria-label={`Excluir ${goal.title}`}
                        onClick={() => onDeleteGoal(goal.id)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </article>
              )
            })
          ) : (
            <div className="empty-state">
              <span className="empty-icon">◈</span>
              <h3>Nenhum objetivo encontrado</h3>
              <p>
                Adicione um novo objetivo no botão acima ou altere o filtro selecionado.
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
                  {goalForm.id ? 'EDITAR OBJETIVO' : 'NOVO OBJETIVO'}
                </p>
                <h2>
                  {goalForm.id ? 'Atualizar meta' : 'Qual é sua grande meta?'}
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

            <label htmlFor="goal-title">Título</label>
            <input
              id="goal-title"
              autoFocus
              required
              value={goalForm.title}
              onChange={(event) =>
                setGoalForm({ ...goalForm, title: event.target.value })
              }
              placeholder="Ex.: Dominar arquitetura de microsserviços"
            />

            <label htmlFor="goal-description">
              Descrição <span>(opcional)</span>
            </label>
            <textarea
              id="goal-description"
              rows="3"
              value={goalForm.description}
              onChange={(event) =>
                setGoalForm({ ...goalForm, description: event.target.value })
              }
              placeholder="Descreva o resultado esperado e sua motivação..."
            />

            <label htmlFor="goal-targetDate">
              Prazo limite <span>(opcional)</span>
            </label>
            <input
              id="goal-targetDate"
              type="date"
              value={goalForm.targetDate}
              onChange={(event) =>
                setGoalForm({ ...goalForm, targetDate: event.target.value })
              }
            />

            <div className="goal-tasks-builder">
              <div className="goal-tasks-builder-header">
                <label>
                  Tasks para atingir este objetivo <span>(opcional)</span>
                </label>
                <button
                  type="button"
                  className="link-action-btn"
                  onClick={handleAddDraftTask}
                >
                  + Adicionar task
                </button>
              </div>
              {goalForm.newTasks.length > 0 ? (
                <div className="goal-tasks-draft-list">
                  {goalForm.newTasks.map((draft, idx) => (
                    <div className="goal-task-draft-row" key={idx}>
                      <input
                        type="text"
                        placeholder={`Título da task #${idx + 1}`}
                        value={draft.title}
                        onChange={(e) =>
                          handleChangeDraftTask(idx, 'title', e.target.value)
                        }
                      />
                      <select
                        value={draft.priority}
                        aria-label="Prioridade da task"
                        onChange={(e) =>
                          handleChangeDraftTask(idx, 'priority', e.target.value)
                        }
                      >
                        <option value="LOW">Baixa</option>
                        <option value="MEDIUM">Média</option>
                        <option value="HIGH">Alta</option>
                      </select>
                      <input
                        type="number"
                        min="0"
                        placeholder="Min"
                        aria-label="Minutos estimados"
                        value={draft.estimatedMinutes}
                        onChange={(e) =>
                          handleChangeDraftTask(
                            idx,
                            'estimatedMinutes',
                            e.target.value
                          )
                        }
                      />
                      <button
                        type="button"
                        className="icon-action-btn danger"
                        title="Remover task"
                        aria-label="Remover task da lista"
                        onClick={() => handleRemoveDraftTask(idx)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <small className="field-hint">
                  Clique em &ldquo;+ Adicionar task&rdquo; para já cadastrar novas tarefas vinculadas a esta meta.
                </small>
              )}
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
                  : goalForm.id
                    ? 'Salvar alterações'
                    : 'Criar objetivo'}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  )
}

export default GoalsPage
