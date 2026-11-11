import { useCallback, useEffect, useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import HomePage from './pages/HomePage'
import TasksPage from './pages/TasksPage'
import GoalsPage from './pages/GoalsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Toast from './components/Toast'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './hooks/useAuth'
import { apiFetch } from './services/api'

// ─── Helpers ────────────────────────────────────────────────────────────────

function getInitialPage() {
  const hash = window.location.hash
  if (hash === '#tasks') return 'tasks'
  if (hash === '#objetivos') return 'goals'
  if (hash === '#login') return 'login'
  if (hash === '#cadastro') return 'register'
  return 'home'
}

function getTodayFormatted() {
  return new Date()
    .toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })
    .toUpperCase()
}

// ─── Conteúdo Principal ─────────────────────────────────────────────────────

function AppContent({ activePage, onNavigate, toasts, notify, dismissToast }) {
  const { user, isAuthenticated, isCheckingAuth, login, register, logout } = useAuth()
  const [tasks, setTasks] = useState([])
  const [goals, setGoals] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingGoals, setIsLoadingGoals] = useState(false)
  const [error, setError] = useState('')
  const [goalsError, setGoalsError] = useState('')

  const todayDate = getTodayFormatted()

  // Carrega tasks quando autenticado
  useEffect(() => {
    if (!isAuthenticated) return
    let active = true
    async function loadTasks() {
      setIsLoading(true)
      try {
        const data = await apiFetch('/tasks', {
          defaultErrorMessage: 'Não foi possível carregar as tasks.',
        })
        if (active && data) {
          setTasks(data)
          setError('')
        }
      } catch (requestError) {
        if (active && !requestError.isAuthError) {
          setError(requestError.message)
        }
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }
    loadTasks()
    return () => {
      active = false
    }
  }, [isAuthenticated, user?.email])

  // Carrega goals quando autenticado
  useEffect(() => {
    if (!isAuthenticated) return
    let active = true
    async function loadGoals() {
      setIsLoadingGoals(true)
      try {
        const data = await apiFetch('/goals', {
          defaultErrorMessage: 'Não foi possível carregar os objetivos.',
        })
        if (active && data) {
          setGoals(data)
          setGoalsError('')
        }
      } catch (requestError) {
        if (active && !requestError.isAuthError) {
          setGoalsError(requestError.message)
        }
      } finally {
        if (active) {
          setIsLoadingGoals(false)
        }
      }
    }
    loadGoals()
    return () => {
      active = false
    }
  }, [isAuthenticated, user?.email])

  // ─── Auth ────────────────────────────────────────────────────────────────

  async function handleLogin(credentials) {
    try {
      const userData = await login(credentials)
      notify(`Bem-vindo de volta, ${userData.name.split(' ')[0]}!`, 'success')
      onNavigate('home')
    } catch (err) {
      notify(err.message, 'error')
      throw err
    }
  }

  async function handleRegister(userInfo) {
    try {
      await register(userInfo)
      notify('Conta criada com sucesso! Aproveite o OrganizeMe.', 'success')
      onNavigate('home')
    } catch (err) {
      notify(err.message, 'error')
      throw err
    }
  }

  async function handleLogout() {
    setTasks([])
    setGoals([])
    await logout()
    notify('Você saiu da sua conta.', 'info')
  }

  // ─── Tasks ───────────────────────────────────────────────────────────────

  async function handleToggleTask(task) {
    const nextCompleted = !task.completed
    try {
      const savedTask = await apiFetch(`/tasks/${task.id}/toggle`, {
        method: 'PATCH',
        defaultErrorMessage: 'Não foi possível atualizar a task.',
      })
      setTasks((current) => current.map((item) => (item.id === savedTask.id ? savedTask : item)))
      setError('')
      notify(
        nextCompleted
          ? `✓ "${task.title}" marcada como concluída!`
          : `Task "${task.title}" reaberta.`,
        'success'
      )
    } catch (requestError) {
      if (requestError.isAuthError) return
      setError(requestError.message)
      notify(requestError.message, 'error')
    }
  }

  async function handleSaveTask(taskData) {
    const isEdit = Boolean(taskData.id)
    const endpoint = isEdit ? `/tasks/${taskData.id}` : '/tasks'
    const method = isEdit ? 'PUT' : 'POST'
    try {
      const savedTask = await apiFetch(endpoint, {
        method,
        body: JSON.stringify(taskData),
        defaultErrorMessage: 'Não foi possível salvar a task.',
      })
      setTasks((current) => {
        const exists = current.some((item) => item.id === savedTask.id)
        return exists
          ? current.map((item) => (item.id === savedTask.id ? savedTask : item))
          : [savedTask, ...current]
      })
      setError('')
      notify(
        isEdit ? `Task "${savedTask.title}" atualizada!` : `Task "${savedTask.title}" criada com sucesso!`,
        'success'
      )
    } catch (requestError) {
      if (!requestError.isAuthError) {
        notify(requestError.message, 'error')
      }
      throw requestError
    }
  }

  async function handleDeleteTask(taskId) {
    const taskToDelete = tasks.find((t) => t.id === taskId)
    try {
      await apiFetch(`/tasks/${taskId}`, {
        method: 'DELETE',
        defaultErrorMessage: 'Não foi possível excluir a task.',
      })
      setTasks((current) => current.filter((item) => item.id !== taskId))
      setError('')
      notify(
        taskToDelete ? `Task "${taskToDelete.title}" excluída.` : 'Task excluída com sucesso.',
        'info'
      )
    } catch (requestError) {
      if (requestError.isAuthError) return
      setError(requestError.message)
      notify(requestError.message, 'error')
    }
  }

  // ─── Goals ───────────────────────────────────────────────────────────────

  async function handleSaveGoal(goalData) {
    const isEdit = Boolean(goalData.id)
    const endpoint = isEdit ? `/goals/${goalData.id}` : '/goals'
    const method = isEdit ? 'PUT' : 'POST'
    try {
      const savedGoal = await apiFetch(endpoint, {
        method,
        body: JSON.stringify(goalData),
        defaultErrorMessage: 'Não foi possível salvar o objetivo.',
      })
      setGoals((current) => {
        const exists = current.some((item) => item.id === savedGoal.id)
        return exists
          ? current.map((item) => (item.id === savedGoal.id ? savedGoal : item))
          : [savedGoal, ...current]
      })
      setGoalsError('')
      notify(
        isEdit ? `Objetivo "${savedGoal.title}" atualizado!` : `Objetivo "${savedGoal.title}" criado com sucesso!`,
        'success'
      )
    } catch (requestError) {
      if (!requestError.isAuthError) {
        notify(requestError.message, 'error')
      }
      throw requestError
    }
  }

  async function handleToggleGoal(goal) {
    const nextCompleted = !goal.completed
    try {
      const savedGoal = await apiFetch(`/goals/${goal.id}/toggle`, {
        method: 'PATCH',
        defaultErrorMessage: 'Não foi possível atualizar o objetivo.',
      })
      setGoals((current) => current.map((item) => (item.id === savedGoal.id ? savedGoal : item)))
      setGoalsError('')
      notify(
        nextCompleted
          ? `🎉 Parabéns! Objetivo "${goal.title}" concluído!`
          : `Objetivo "${goal.title}" reativado.`,
        'success'
      )
    } catch (requestError) {
      if (requestError.isAuthError) return
      setGoalsError(requestError.message)
      notify(requestError.message, 'error')
    }
  }

  async function handleDeleteGoal(goalId) {
    const goalToDelete = goals.find((g) => g.id === goalId)
    try {
      await apiFetch(`/goals/${goalId}`, {
        method: 'DELETE',
        defaultErrorMessage: 'Não foi possível excluir o objetivo.',
      })
      setGoals((current) => current.filter((item) => item.id !== goalId))
      setTasks((current) =>
        current.map((t) => (t.goal?.id === goalId ? { ...t, goal: null } : t))
      )
      setGoalsError('')
      notify(
        goalToDelete ? `Objetivo "${goalToDelete.title}" excluído.` : 'Objetivo excluído.',
        'info'
      )
    } catch (requestError) {
      if (requestError.isAuthError) return
      setGoalsError(requestError.message)
      notify(requestError.message, 'error')
    }
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  if (activePage === 'login') {
    return (
      <>
        <LoginPage onNavigate={onNavigate} onLogin={handleLogin} />
        <Toast toasts={toasts} onDismiss={dismissToast} />
      </>
    )
  }

  if (activePage === 'register') {
    return (
      <>
        <RegisterPage onNavigate={onNavigate} onRegister={handleRegister} />
        <Toast toasts={toasts} onDismiss={dismissToast} />
      </>
    )
  }

  if (isCheckingAuth) {
    return (
      <div className="login-wrapper">
        <div className="empty-state">
          <p>Verificando sessão...</p>
        </div>
      </div>
    )
  }

  // Redireciona para login se não autenticado ao tentar acessar páginas protegidas
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage onNavigate={onNavigate} onLogin={handleLogin} />
        <Toast toasts={toasts} onDismiss={dismissToast} />
      </>
    )
  }

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        user={user}
        onLogout={handleLogout}
        pendingTasksCount={tasks.filter((t) => !t.completed).length}
        activeGoalsCount={goals.filter((g) => !g.completed).length}
      />

      {activePage === 'home' && (
        <HomePage
          user={user}
          tasks={tasks}
          goals={goals}
          isLoading={isLoading}
          error={error}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onNavigate={onNavigate}
          todayDate={todayDate}
        />
      )}

      {activePage === 'tasks' && (
        <TasksPage
          tasks={tasks}
          goals={goals}
          isLoading={isLoading}
          error={error}
          onToggleTask={handleToggleTask}
          onCreateTask={handleSaveTask}
          onDeleteTask={handleDeleteTask}
          todayDate={todayDate}
        />
      )}

      {activePage === 'goals' && (
        <GoalsPage
          goals={goals}
          tasks={tasks}
          isLoading={isLoadingGoals}
          error={goalsError}
          onCreateGoal={handleSaveGoal}
          onToggleGoal={handleToggleGoal}
          onDeleteGoal={handleDeleteGoal}
          todayDate={todayDate}
        />
      )}

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────

function App() {
  const [activePage, setActivePage] = useState(getInitialPage)
  const [toasts, setToasts] = useState([])

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id))
  }, [])

  const notify = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).slice(2, 6)
    setToasts((current) => [...current.slice(-4), { id, message, type, duration }])
  }, [])

  const handleNavigate = useCallback((page) => {
    setActivePage(page)
    const hashMap = {
      home: '#inicio',
      tasks: '#tasks',
      goals: '#objetivos',
      login: '#login',
      register: '#cadastro',
    }
    window.location.hash = hashMap[page] || '#inicio'
  }, [])

  const handleSessionExpired = useCallback((reason) => {
    notify(reason, 'info')
  }, [notify])

  // Sincroniza a página com a hash da URL
  useEffect(() => {
    function handleHashChange() {
      setActivePage(getInitialPage())
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return (
    <AuthProvider onSessionExpired={handleSessionExpired} onNavigate={handleNavigate}>
      <AppContent
        activePage={activePage}
        onNavigate={handleNavigate}
        toasts={toasts}
        notify={notify}
        dismissToast={dismissToast}
      />
    </AuthProvider>
  )
}

export default App
