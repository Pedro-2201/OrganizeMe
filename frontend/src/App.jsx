import { useEffect, useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import HomePage from './pages/HomePage'
import TasksPage from './pages/TasksPage'
import GoalsPage from './pages/GoalsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

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

// Lê o token salvo no localStorage
function getStoredToken() {
  return localStorage.getItem('organizeme_token')
}

// Lê os dados do usuário salvos no localStorage
function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('organizeme_user')) || null
  } catch {
    return null
  }
}

// Cria o header Authorization com o token Bearer para todas as chamadas autenticadas
function authHeaders() {
  const token = getStoredToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

// ─── App ─────────────────────────────────────────────────────────────────────

function App() {
  const [activePage, setActivePage] = useState(getInitialPage)
  const [user, setUser] = useState(getStoredUser)   // { name, email } do usuário logado
  const [tasks, setTasks] = useState([])
  const [goals, setGoals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingGoals, setIsLoadingGoals] = useState(true)
  const [error, setError] = useState('')
  const [goalsError, setGoalsError] = useState('')

  const todayDate = getTodayFormatted()
  const isAuthenticated = Boolean(getStoredToken())

  // Sincroniza a página com a hash da URL
  useEffect(() => {
    function handleHashChange() {
      setActivePage(getInitialPage())
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Carrega tasks quando autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false)
      return
    }
    async function loadTasks() {
      try {
        const response = await fetch('/tasks', { headers: authHeaders() })
        if (response.status === 401) { handleLogout(); return }
        if (!response.ok) throw new Error('Não foi possível carregar as tasks.')
        setTasks(await response.json())
      } catch (requestError) {
        setError(requestError.message)
      } finally {
        setIsLoading(false)
      }
    }
    loadTasks()
  }, [isAuthenticated])

  // Carrega goals quando autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoadingGoals(false)
      return
    }
    async function loadGoals() {
      try {
        const response = await fetch('/goals', { headers: authHeaders() })
        if (response.status === 401) { handleLogout(); return }
        if (!response.ok) throw new Error('Não foi possível carregar os objetivos.')
        setGoals(await response.json())
      } catch (requestError) {
        setGoalsError(requestError.message)
      } finally {
        setIsLoadingGoals(false)
      }
    }
    loadGoals()
  }, [isAuthenticated])

  // ─── Navegação ───────────────────────────────────────────────────────────

  function handleNavigate(page) {
    setActivePage(page)
    const hashMap = {
      home: '#inicio',
      tasks: '#tasks',
      goals: '#objetivos',
      login: '#login',
      register: '#cadastro',
    }
    window.location.hash = hashMap[page] || '#inicio'
  }

  // ─── Auth ────────────────────────────────────────────────────────────────

  // Chama POST /auth/login, salva token e dados do usuário no localStorage
  async function handleLogin(credentials) {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: credentials.email, password: credentials.password }),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.message || 'Email ou senha incorretos.')
    }

    const data = await response.json()
    localStorage.setItem('organizeme_token', data.token)
    localStorage.setItem('organizeme_user', JSON.stringify({ name: data.name, email: data.email }))
    setUser({ name: data.name, email: data.email })
    handleNavigate('home')
  }

  // Chama POST /auth/register, salva token e dados do usuário no localStorage
  async function handleRegister(userData) {
    const response = await fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: userData.name, email: userData.email, password: userData.password }),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.message || 'Não foi possível criar a conta. Tente novamente.')
    }

    const data = await response.json()
    localStorage.setItem('organizeme_token', data.token)
    localStorage.setItem('organizeme_user', JSON.stringify({ name: data.name, email: data.email }))
    setUser({ name: data.name, email: data.email })
    handleNavigate('home')
  }

  // Remove token e dados do usuário, redireciona para login
  function handleLogout() {
    localStorage.removeItem('organizeme_token')
    localStorage.removeItem('organizeme_user')
    setUser(null)
    setTasks([])
    setGoals([])
    handleNavigate('login')
  }

  // ─── Tasks ───────────────────────────────────────────────────────────────

  async function handleToggleTask(task) {
    const updatedTask = { ...task, completed: !task.completed }
    try {
      const response = await fetch('/tasks', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(updatedTask),
      })
      if (response.status === 401) { handleLogout(); return }
      if (!response.ok) throw new Error('Não foi possível atualizar a task.')
      const savedTask = await response.json()
      setTasks((current) => current.map((item) => (item.id === savedTask.id ? savedTask : item)))
      setError('')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function handleCreateTask(taskData) {
    const response = await fetch('/tasks', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(taskData),
    })
    if (response.status === 401) { handleLogout(); return }
    if (!response.ok) throw new Error('Não foi possível criar a task.')
    const savedTask = await response.json()
    setTasks((current) => [savedTask, ...current])
    setError('')
  }

  // ─── Goals ───────────────────────────────────────────────────────────────

  async function handleCreateGoal(goalData) {
    const response = await fetch('/goals', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(goalData),
    })
    if (response.status === 401) { handleLogout(); return }
    if (!response.ok) throw new Error('Não foi possível criar o objetivo.')
    const savedGoal = await response.json()
    setGoals((current) => [savedGoal, ...current])
    setGoalsError('')
  }

  async function handleToggleGoal(goal) {
    const updatedGoal = { ...goal, completed: !goal.completed }
    try {
      const response = await fetch('/goals', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(updatedGoal),
      })
      if (response.status === 401) { handleLogout(); return }
      if (!response.ok) throw new Error('Não foi possível atualizar o objetivo.')
      const savedGoal = await response.json()
      setGoals((current) => current.map((item) => (item.id === savedGoal.id ? savedGoal : item)))
      setGoalsError('')
    } catch (requestError) {
      setGoalsError(requestError.message)
    }
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  if (activePage === 'login') {
    return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />
  }

  if (activePage === 'register') {
    return <RegisterPage onNavigate={handleNavigate} onRegister={handleRegister} />
  }

  // Redireciona para login se não autenticado ao tentar acessar páginas protegidas
  if (!isAuthenticated) {
    return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} user={user} onLogout={handleLogout} />

      {activePage === 'home' && (
        <HomePage
          tasks={tasks}
          isLoading={isLoading}
          error={error}
          onToggleTask={handleToggleTask}
          onNavigate={handleNavigate}
          todayDate={todayDate}
        />
      )}

      {activePage === 'tasks' && (
        <TasksPage
          tasks={tasks}
          isLoading={isLoading}
          error={error}
          onToggleTask={handleToggleTask}
          onCreateTask={handleCreateTask}
          todayDate={todayDate}
        />
      )}

      {activePage === 'goals' && (
        <GoalsPage
          goals={goals}
          isLoading={isLoadingGoals}
          error={goalsError}
          onCreateGoal={handleCreateGoal}
          onToggleGoal={handleToggleGoal}
          todayDate={todayDate}
        />
      )}
    </div>
  )
}

export default App
