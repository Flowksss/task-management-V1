import { Plus } from 'lucide-react'
import type { Task, Weekday, Period } from '../types'

interface Props {
  tasks: Task[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
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

function todayWeekday(): Weekday | null {
  const map: Record<number, Weekday> = { 1: 'seg', 2: 'ter', 3: 'qua', 4: 'qui', 5: 'sex' }
  return map[new Date().getDay()] ?? null
}

export function WeekView({ tasks, onToggle: _onToggle, onDelete: _onDelete, onEdit, onAdd }: Props) {
  const today = todayWeekday()

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Scrollable grid */}
      <div className="overflow-x-auto flex-1">
        <div className="min-w-[760px] h-full flex flex-col px-3 py-4 gap-4">
          {PERIODS.map(period => (
            <div key={period.value} className="flex flex-col gap-2">
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-1">
                {period.label}
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {DAYS.map(day => {
                  const cell = tasks.filter(
                    t => t.weekday === day.value && t.period === period.value
                  ).sort((a, b) => {
                    const order = { alta: 0, media: 1, baixa: 2 }
                    return order[a.priority] - order[b.priority]
                  })

                  const isToday = today === day.value

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

                      {cell.map(task => (
                        <div
                          key={task.id}
                          onClick={() => onEdit(task)}
                          className={`rounded-lg px-2.5 py-2 border-l-2 cursor-pointer transition-opacity ${
                            PRIORITY_COLORS[task.priority]
                          } ${PRIORITY_BG[task.priority]} ${task.completed ? 'opacity-40' : ''}`}
                        >
                          <p className={`text-sm leading-snug break-words ${task.completed ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                            {task.title}
                          </p>
                        </div>
                      ))}

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
