import type { Task } from '../types'
import { todayISO } from './date'

/**
 * Conclusão unificada.
 * - pessoal: campo `completed` (fixo).
 * - trabalho: feito SE concluído na data `iso` (default hoje). Reset diário
 *   automático — derivado na leitura, sem job de meia-noite.
 */
export function isDone(task: Task, iso: string = todayISO()): boolean {
  if (task.category === 'trabalho') {
    return task.completedDates?.includes(iso) ?? false
  }
  return task.completed
}
