import { useState, useEffect } from 'react'
import type { Task, Category, Priority, Weekday, Period } from '../types'
import { todayISO } from '../lib/date'

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
    weekday?: Weekday
    period?: Period
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

  /** Conclusão de tarefa de trabalho na data `iso` (default hoje). Toggle no histórico. */
  function toggleWorkDone(id: string, iso: string = todayISO()) {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== id) return t
        const dates = t.completedDates ?? []
        const next = dates.includes(iso)
          ? dates.filter(d => d !== iso)
          : [...dates, iso]
        return { ...t, completedDates: next }
      })
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

  return { tasks, addTask, toggleTask, toggleWorkDone, deleteTask, editTask }
}
