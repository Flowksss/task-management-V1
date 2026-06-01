import { Plus, Check } from 'lucide-react'
import type { Task, Weekday, Period } from '../types'
import { isDone, activeOnDate, isFixa } from '../lib/tasks'
import { weekDates, toISO, todayISO } from '../lib/date'

interface Props {
  tasks: Task[]
  onToggleDone: (task: Task, iso: string) => void
  onEdit: (task: Task) => void
  onAdd: (weekday: Weekday, period: Period) => void
}

const DAYS: { value: Weekday; label: string }[] = [
  { value: 'seg', label: 'Seg' },
  { value: 'ter', label: 'Ter' },
  { value: 'qua', label: 'Qua' },
  { value: 'qui', label: 'Qui' },
  { value: 'sex', label: 'Sex' },
]

const PERIODS: { value: Period; label: string }[] = [
  { value: 'manha', label: 'Manhã' },
  { value: 'tarde', label: 'Tarde' },
]

const PRIORITY_COLORS = {
  baixa: 'border-l-emerald-500',
  media: 'border-l-amber-500',
  alta: 'border-l-red-500',
}

const PRIORITY_BG = {
  baixa: 'bg-emerald-500/10',
  media: 'bg-amber-500/10',
  alta: 'bg-red-500/10',
}

export function WeekView({ tasks, onToggleDone, onEdit, onAdd }: Props) {
  const today = todayISO()
  const dates = weekDates() // Seg→Sex reais da semana atual

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="overflow-x-auto flex-1">
        <div className="min-w-[760px] h-full flex flex-col px-3 py-4 gap-4">
          {PERIODS.map(period => (
            <div key={period.value} className="flex flex-col gap-2">
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-1">
                {period.label}
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {DAYS.map((day, i) => {
                  const colDate = dates[i]
                  const colISO = toISO(colDate)
                  const isToday = colISO === today

                  const cell = tasks
                    .filter(t => t.period === period.value && activeOnDate(t, colDate))
                    .sort((a, b) => {
                      const order = { alta: 0, media: 1, baixa: 2 }
                      return order[a.priority] - order[b.priority]
                    })

                  return (
                    <div
                      key={day.value}
                      className={`rounded-xl p-2 flex flex-col gap-1.5 min-h-[120px] ${
                        isToday ? 'bg-indigo-950/40 ring-1 ring-indigo-700/50' : 'bg-neutral-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-sm font-bold ${isToday ? 'text-indigo-400' : 'text-neutral-500'}`}>
                          {day.label}
                        </span>
                        <button
                          onClick={() => onAdd(day.value, period.value)}
                          className="text-neutral-600 hover:text-indigo-400 transition-colors"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {cell.map(task => {
                        const done = isDone(task, colISO)
                        const avulsa = !isFixa(task)
                        return (
                          <div
                            key={task.id}
                            className={`flex items-start gap-1.5 rounded-lg px-2 py-2 border-l-2 transition-opacity ${
                              PRIORITY_COLORS[task.priority]
                            } ${PRIORITY_BG[task.priority]} ${avulsa ? 'border-dashed border-y border-r border-y-neutral-700/60 border-r-neutral-700/60' : ''} ${done ? 'opacity-40' : ''}`}
                          >
                            <button
                              onClick={() => onToggleDone(task, colISO)}
                              className={`mt-0.5 shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                                done
                                  ? 'bg-indigo-600 border-indigo-600'
                                  : 'border-neutral-600 hover:border-indigo-500'
                              }`}
                            >
                              {done && <Check size={10} strokeWidth={3} className="text-white" />}
                            </button>
                            <div onClick={() => onEdit(task)} className="flex-1 cursor-pointer">
                              <p className={`text-sm leading-snug break-words ${done ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                                {task.title}
                              </p>
                              {avulsa && task.dueDate && (
                                <span className="text-[10px] text-neutral-500">
                                  até {new Date(task.dueDate + 'T00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      })}

                      {cell.length === 0 && (
                        <button
                          onClick={() => onAdd(day.value, period.value)}
                          className="flex-1 flex items-center justify-center text-neutral-700 hover:text-neutral-500 transition-colors rounded-lg border border-dashed border-neutral-800 hover:border-neutral-700 min-h-[56px]"
                        >
                          <Plus size={14} />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
