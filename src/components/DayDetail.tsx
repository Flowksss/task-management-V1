import { X, Check, Trash2, Pencil } from 'lucide-react'
import type { Task } from '../types'
import { toISO } from '../lib/date'
import { isDone, activeOnDate } from '../lib/tasks'

interface Props {
  date: Date
  tasks: Task[]
  onClose: () => void
  onToggleDone: (task: Task, iso: string) => void
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
}

const PRIORITY_DOT = {
  baixa: 'bg-emerald-400',
  media: 'bg-amber-400',
  alta: 'bg-red-400',
}

const DAY_NAMES_FULL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const MONTH_SHORT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

export function DayDetail({ date, tasks, onClose, onToggleDone, onDelete, onEdit }: Props) {
  const iso = toISO(date)

  const personal = tasks.filter(t => t.category === 'pessoal' && t.dueDate === iso)
  // includeCompleted: avulsa concluída ainda aparece aqui (riscada) como undo
  const work = tasks.filter(t => t.category === 'trabalho' && activeOnDate(t, date, true))
  const all = [...personal, ...work]
  const pendingCount = all.filter(t => !isDone(t, iso)).length

  const dayLabel = `${DAY_NAMES_FULL[date.getDay()]}, ${date.getDate()} de ${MONTH_SHORT[date.getMonth()]}`

  function toggle(task: Task) {
    onToggleDone(task, iso)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-neutral-900 rounded-t-2xl max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
          <div>
            <h2 className="text-base font-semibold text-white capitalize">{dayLabel}</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {all.length === 0 ? 'Sem tarefas' : `${pendingCount} pendente${pendingCount !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-4 py-3 flex flex-col gap-2">
          {all.length === 0 ? (
            <p className="text-center text-neutral-600 text-sm py-8">Nenhuma tarefa neste dia.</p>
          ) : (
            all.map(task => {
              const done = isDone(task, iso)
              return (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 bg-neutral-800 rounded-xl px-3 py-3 transition-opacity ${done ? 'opacity-50' : ''}`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${PRIORITY_DOT[task.priority]}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${done ? 'line-through text-neutral-500' : 'text-neutral-100'}`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {task.category === 'trabalho' ? `Trabalho · ${task.period === 'manha' ? 'Manhã' : 'Tarde'}` : 'Pessoal'}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => toggle(task)} className={`p-1.5 rounded-lg transition-colors ${done ? 'text-indigo-400' : 'text-neutral-500 hover:text-indigo-400'}`}>
                      <Check size={15} />
                    </button>
                    <button onClick={() => onEdit(task)} className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-300 transition-colors">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => onDelete(task.id)} className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
