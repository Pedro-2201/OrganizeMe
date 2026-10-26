import { useMemo, useState } from 'react'

const filters = [
  { value: 'todas', label: 'Todas' },
  { value: 'ativas', label: 'Ativas' },
  { value: 'concluidas', label: 'Concluídas' },
]

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

function GoalsPage({ goals, isLoading, error, onCreateGoal, onToggleGoal, todayDate }) {
  const [activeFilter, setActiveFilter] = useState('todas')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [newGoal, setNewGoal] = useState({ title: '', description: '', targetDate: '' })

  const completedGoals = goals.filter((g) => g.completed).length
  const activeGoals = goals.length - completedGoals
  const progressPercent = goals.length ? Math.round((completedGoals / goals.length) * 100) : 0

  const visibleGoals = useMemo(() => {
    if (activeFilter === 'ativas') return goals.filter((g) => !g.completed)
    if (activeFilter === 'concluidas') return goals.filter((g) => g.completed)
    return goals
  }, [activeFilter, goals])

  async function handleSubmit(event) {
    event.preventDefault()
    const title = newGoal.title.trim()
    if (!title) return

    setIsSaving(true)
    setFormError('')
    try {
      await onCreateGoal({
        title,
        description: newGoal.description.trim(),
        targetDate: newGoal.targetDate || null,
        completed: false,
      })
      setNewGoal({ title: '', description: '', targetDate: '' })
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
        <div className="breadcrumb">Workspace <span>/</span> Objetivos</div>
        <button className="notification" type="button" aria-label="Notificações">♢<i /></button>
      </header>

      <section className="page-heading">
        <div>
          <p className="eyebrow">{todayDate}</p>
          <h1>Objetivos</h1>
          <p className="subtitle">Defina suas grandes metas e acompanhe seu progresso.</p>
        </div>
        <button className="primary-button" type="button" onClick={() => setIsFormOpen(true)}>
          <span>+</span> Novo objetivo
        </button>
      </section>

      <section className="summary-grid" aria-label="Resumo dos objetivos">
        <article className="summary-card">
          <span className="summary-icon purple">◈</span>
          <div><span>Objetivos ativos</span><strong>{activeGoals}</strong></div>
          <small>em andamento</small>
        </article>
        <article className="summary-card">
          <span className="summary-icon green">✓</span>
          <div><span>Concluídos</span><strong>{completedGoals}</strong></div>
          <small>realizados</small>
        </article>
        <article className="summary-card">
          <span className="summary-icon orange">↗</span>
          <div><span>Taxa de conclusão</span><strong>{progressPercent}%</strong></div>
          <small>do total</small>
        </article>
      </section>

      <section className="tasks-section">
        {(error || formError) && <p className="request-error" role="alert">{error || formError}</p>}
        <div className="section-header">
          <div>
            <h2>Lista de objetivos <span>{goals.length}</span></h2>
            <p>Acompanhe suas metas de longo prazo.</p>
          </div>
          <div className="filters" role="group" aria-label="Filtrar objetivos">
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
            <div className="empty-state"><p>Carregando objetivos...</p></div>
          ) : visibleGoals.length ? (
            visibleGoals.map((goal) => (
              <article className={goal.completed ? 'task-card completed' : 'task-card'} key={goal.id}>
                <button
                  className="check-button"
                  type="button"
                  aria-label={goal.completed ? `Reabrir ${goal.title}` : `Concluir ${goal.title}`}
                  onClick={() => onToggleGoal(goal)}
                >
                  {goal.completed ? '✓' : ''}
                </button>
                <div className="task-info">
                  <div className="task-title-row">
                    <h3>{goal.title}</h3>
                    {goal.targetDate && (
                      <span className={`priority ${isOverdue(goal.targetDate) && !goal.completed ? 'high' : 'low'}`}>
                        {isOverdue(goal.targetDate) && !goal.completed ? '⚠ Atrasado' : `📅 ${formatDate(goal.targetDate)}`}
                      </span>
                    )}
                  </div>
                  {goal.description && <p>{goal.description}</p>}
                  <span className="due-date">
                    {goal.targetDate
                      ? `◷ Prazo: ${formatDate(goal.targetDate)}`
                      : '◷ Sem prazo definido'}
                  </span>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <span>◈</span>
              <h3>Nenhum objetivo por aqui</h3>
              <p>Adicione um novo objetivo ou altere o filtro selecionado.</p>
            </div>
          )}
        </div>
      </section>

      {isFormOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setIsFormOpen(false)}>
          <form className="task-form" onSubmit={handleSubmit} onMouseDown={(event) => event.stopPropagation()}>
            <div className="form-heading">
              <div><p className="eyebrow">NOVO OBJETIVO</p><h2>Qual é sua meta?</h2></div>
              <button type="button" className="close-button" onClick={() => setIsFormOpen(false)} aria-label="Fechar">×</button>
            </div>
            <label htmlFor="goal-title">Título</label>
            <input
              id="goal-title"
              autoFocus
              value={newGoal.title}
              onChange={(event) => setNewGoal({ ...newGoal, title: event.target.value })}
              placeholder="Ex.: Aprender TypeScript"
            />
            <label htmlFor="goal-description">Descrição <span>(opcional)</span></label>
            <textarea
              id="goal-description"
              rows="3"
              value={newGoal.description}
              onChange={(event) => setNewGoal({ ...newGoal, description: event.target.value })}
              placeholder="Descreva sua meta com mais detalhes..."
            />
            <label htmlFor="goal-targetDate">Prazo <span>(opcional)</span></label>
            <input
              id="goal-targetDate"
              type="date"
              value={newGoal.targetDate}
              onChange={(event) => setNewGoal({ ...newGoal, targetDate: event.target.value })}
            />
            <button className="primary-button form-submit" type="submit" disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Adicionar objetivo'}
            </button>
          </form>
        </div>
      )}
    </main>
  )
}

export default GoalsPage
