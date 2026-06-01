import { useState, useEffect } from 'react'
import type { Task, Category, Priority } from '../types'

const STORAGE_KEY = 'task-manager-tasks'

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  function addTask(data: {
    title: string
    description?: string
    category: Category
    priority: Priority
    dueDate?: string
  }) {
    const task: Task = {
      id: crypto.randomUUID(),
      completed: false,
      createdAt: Date.now(),
      ...data,
    }
    setTasks(prev => [task, ...prev])
  }

  function toggleTask(id: string) {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  function deleteTask(id: string) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  function editTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates } : t))
    )
  }

  return { tasks, addTask, toggleTask, deleteTask, editTask }
}
