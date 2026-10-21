import { useEffect, useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import HomePage from './pages/HomePage'
import TasksPage from './pages/TasksPage'
import GoalsPage from './pages/GoalsPage'

function getInitialPage() {
  const hash = window.location.hash
  if (hash === '#tasks') return 'tasks'
  if (hash === '#objetivos') return 'goals'
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
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

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

  function handleNavigate(page) {
    setActivePage(page)
    const hashMap = {
      home: '#inicio',
      tasks: '#tasks',
      goals: '#objetivos',
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
          todayDate={todayDate}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  )
}

export default App
