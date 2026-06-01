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
  /** true (default) = fixa, repete toda semana no weekday, check reseta a cada dia.
   *  false = avulsa, aparece de createdAt até dueDate, conclusão permanente. */
  fixa?: boolean
  /** Datas ISO em que a tarefa FIXA foi concluída. Reset diário derivado. */
  completedDates?: string[]
}
