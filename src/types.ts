export type Category = 'pessoal' | 'trabalho'
export type Priority = 'baixa' | 'media' | 'alta'
export type Weekday = 'seg' | 'ter' | 'qua' | 'qui' | 'sex'
export type Period = 'manha' | 'tarde'

export interface Task {
  id: string
  title: string
  description?: string
  category: Category
  priority: Priority
  completed: boolean
  createdAt: number
  // pessoal
  dueDate?: string
  // trabalho
  weekday?: Weekday
  period?: Period
  /** Datas ISO em que a tarefa de trabalho foi concluída. Reset diário derivado. */
  completedDates?: string[]
}
