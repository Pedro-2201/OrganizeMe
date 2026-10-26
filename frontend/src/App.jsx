import { useEffect, useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import HomePage from './pages/HomePage'
import TasksPage from './pages/TasksPage'
import GoalsPage from './pages/GoalsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function getInitialPage() {
  const hash = window.location.hash
  if (hash === '#tasks') return 'tasks'
  if (hash === '#objetivos') return 'goals'
  if (hash === '#login') return 'login'
  if (hash === '#cadastro') return 'register'
  return 'home'
}

function getTodayFormatted() {
  const date = new Date()
  return date
    .toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    })
    .toUpperCase()
}

function App() {
  const [activePage, setActivePage] = useState(getInitialPage)
  const [tasks, setTasks] = useState([])
  const [goals, setGoals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingGoals, setIsLoadingGoals] = useState(true)
  const [error, setError] = useState('')
  const [goalsError, setGoalsError] = useState('')

  const todayDate = getTodayFormatted()

  useEffect(() => {
    function handleHashChange() {
      setActivePage(getInitialPage())
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

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

  useEffect(() => {
    async function loadGoals() {
      try {
        const response = await fetch('/goals')
        if (!response.ok) throw new Error('Não foi possível carregar os objetivos.')
        setGoals(await response.json())
      } catch (requestError) {
        setGoalsError(requestError.message)
      } finally {
        setIsLoadingGoals(false)
      }
    }

    loadGoals()
  }, [])

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

  async function handleToggleTask(task) {
    const updatedTask = { ...task, completed: !task.completed }

    try {
      const response = await fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      })
      if (!response.ok) throw new Error('Não foi possível atualizar a task.')
      const savedTask = await response.json()
      setTasks((currentTasks) =>
        currentTasks.map((item) => (item.id === savedTask.id ? savedTask : item)),
      )
      setError('')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function handleCreateTask(taskData) {
    const response = await fetch('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    })

    if (!response.ok) throw new Error('Não foi possível criar a task.')
    const savedTask = await response.json()
    setTasks((currentTasks) => [savedTask, ...currentTasks])
    setError('')
  }

  async function handleCreateGoal(goalData) {
    const response = await fetch('/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goalData),
    })

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedGoal),
      })
      if (!response.ok) throw new Error('Não foi possível atualizar o objetivo.')
      const savedGoal = await response.json()
      setGoals((current) => current.map((item) => (item.id === savedGoal.id ? savedGoal : item)))
      setGoalsError('')
    } catch (requestError) {
      setGoalsError(requestError.message)
    }
  }

  if (activePage === 'login') {
    return (
      <LoginPage
        onNavigate={handleNavigate}
        onLogin={async (credentials) => {
          // Mock de sucesso na autenticação
          await new Promise((resolve) => setTimeout(resolve, 500))
          handleNavigate('home')
        }}
      />
    )
  }

  if (activePage === 'register') {
    return (
      <RegisterPage
        onNavigate={handleNavigate}
        onRegister={async (userData) => {
          // Mock de sucesso no cadastro
          await new Promise((resolve) => setTimeout(resolve, 500))
          handleNavigate('home')
        }}
      />
    )
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />

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
