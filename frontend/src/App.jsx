import { useEffect, useMemo, useState } from 'react'
import './App.css'

const filters = [
  { value: 'todas', label: 'Todas' },
  { value: 'pendentes', label: 'Pendentes' },
  { value: 'concluidas', label: 'Concluídas' },
]

function App() {
  const [tasks, setTasks] = useState([])
  const [activeFilter, setActiveFilter] = useState('todas')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [newTask, setNewTask] = useState({ titulo: '', descricao: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch('/tasks')
        if (!response.ok) throw new Error('Não foi possível carregar as tasks.')
        setTasks(await response.json())
      } catch (requestError) {
        setError(requestError.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [])

  const visibleTasks = useMemo(() => {
    if (activeFilter === 'pendentes') return tasks.filter((task) => !task.concluida)
    if (activeFilter === 'concluidas') return tasks.filter((task) => task.concluida)
    return tasks
  }, [activeFilter, tasks])

  const completedTasks = tasks.filter((task) => task.concluida).length
  const pendingTasks = tasks.length - completedTasks

  async function toggleTask(task) {
    const updatedTask = { ...task, concluida: !task.concluida }

    try {
      const response = await fetch(`/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      })
      if (!response.ok) throw new Error('Não foi possível atualizar a task.')
      const savedTask = await response.json()
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) => currentTask.id === savedTask.id ? savedTask : currentTask),
      )
      setError('')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const titulo = newTask.titulo.trim()
    if (!titulo) return

    setIsSaving(true)
    try {
      const response = await fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          descricao: newTask.descricao.trim(),
          concluida: false,
        }),
      })
      if (!response.ok) throw new Error('Não foi possível criar a task.')
      const savedTask = await response.json()
      setTasks((currentTasks) => [savedTask, ...currentTasks])
      setNewTask({ titulo: '', descricao: '' })
      setIsFormOpen(false)
      setError('')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">O</span>
          <span>Organize<span className="brand-accent">Me</span></span>
        </div>

        <nav className="main-nav" aria-label="Navegação principal">
          <a className="nav-item" href="#inicio"><span>⌂</span> Visão geral</a>
          <a className="nav-item active" href="#tasks"><span>✓</span> Minhas tasks</a>
          <a className="nav-item" href="#objetivos"><span>◈</span> Objetivos</a>
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

      <main className="content" id="tasks">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> Tasks</div>
          <button className="notification" type="button" aria-label="Notificações">♢<i /></button>
        </header>

        <section className="page-heading">
          <div>
            <p className="eyebrow">SEGUNDA-FEIRA, 05 DE OUTUBRO</p>
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
            <div><span>Progresso semanal</span><strong>{tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0}%</strong></div>
            <small>meta alcançada</small>
          </article>
        </section>

        <section className="tasks-section">
          {error && <p className="request-error" role="alert">{error}</p>}
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
            ) : visibleTasks.length ? visibleTasks.map((task) => (
              <article className={task.concluida ? 'task-card completed' : 'task-card'} key={task.id}>
                <button
                  className="check-button"
                  type="button"
                  aria-label={task.concluida ? `Reabrir ${task.titulo}` : `Concluir ${task.titulo}`}
                  onClick={() => toggleTask(task)}
                >
                  {task.concluida ? '✓' : ''}
                </button>
                <div className="task-info">
                  <div className="task-title-row">
                    <h3>{task.titulo}</h3>
                    <span className="priority média">Task</span>
                  </div>
                  <p>{task.descricao}</p>
                  <span className="due-date">◷ Sem prazo</span>
                </div>
                <button className="more-button" type="button" aria-label={`Mais opções para ${task.titulo}`}>•••</button>
              </article>
            )) : (
              <div className="empty-state">
                <span>✓</span>
                <h3>Nenhuma task por aqui</h3>
                <p>Adicione uma nova task ou altere o filtro selecionado.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {isFormOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setIsFormOpen(false)}>
          <form className="task-form" onSubmit={handleSubmit} onMouseDown={(event) => event.stopPropagation()}>
            <div className="form-heading">
              <div><p className="eyebrow">NOVA TASK</p><h2>O que precisa ser feito?</h2></div>
              <button type="button" className="close-button" onClick={() => setIsFormOpen(false)} aria-label="Fechar">×</button>
            </div>
            <label htmlFor="title">Título</label>
            <input id="title" autoFocus value={newTask.titulo} onChange={(event) => setNewTask({ ...newTask, titulo: event.target.value })} placeholder="Ex.: Preparar apresentação" />
            <label htmlFor="description">Descrição <span>(opcional)</span></label>
            <textarea id="description" rows="3" value={newTask.descricao} onChange={(event) => setNewTask({ ...newTask, descricao: event.target.value })} placeholder="Adicione mais detalhes..." />
            <button className="primary-button form-submit" type="submit" disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Adicionar task'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default App
