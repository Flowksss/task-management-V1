import type { Task } from '../types'
import { todayISO, toISO, weekdayOf } from './date'

/** Tarefa de trabalho fixa? (default true — retrocompat com tarefas sem o campo). */
export function isFixa(task: Task): boolean {
  return task.fixa !== false
}

/** Dia ISO de criação da tarefa (para range da avulsa). */
function startISO(task: Task): string {
  return toISO(new Date(task.createdAt))
}

/**
 * Conclusão unificada.
 * - pessoal: `completed` fixo.
 * - trabalho FIXA: concluída na data `iso` (reset diário derivado).
 * - trabalho AVULSA: `completed` permanente (não reseta).
 */
export function isDone(task: Task, iso: string = todayISO()): boolean {
  if (task.category === 'trabalho' && isFixa(task)) {
    return task.completedDates?.includes(iso) ?? false
  }
  return task.completed
}

/**
 * A tarefa de trabalho deve aparecer nesta data?
 * - FIXA: no weekday correspondente, toda semana.
 * - AVULSA: de createdAt até dueDate (prazo), só enquanto não concluída.
 */
export function activeOnDate(task: Task, date: Date, includeCompleted = false): boolean {
  if (task.category !== 'trabalho') return false
  if (isFixa(task)) {
    return task.weekday === weekdayOf(date)
  }
  if (task.completed && !includeCompleted) return false
  const iso = toISO(date)
  const start = startISO(task)
  const end = task.dueDate ?? start
  return iso >= start && iso <= end
}
