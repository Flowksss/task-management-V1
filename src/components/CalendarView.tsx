import { useState } from 'react'
import { ChevronLeft, ChevronRight, User, Briefcase } from 'lucide-react'
import type { Task, Category } from '../types'
import { toISO, weekdayOf } from '../lib/date'
import { isDone } from '../lib/tasks'

interface Props {
  tasks: Task[]
  onDayPress: (date: Date) => void
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const DAY_NAMES = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

/** Tarefas de uma categoria que caem numa data (pessoal: dueDate; trabalho: weekday). */
function tasksOnDate(tasks: Task[], date: Date, cat: Category): Task[] {
  if (cat === 'pessoal') {
    const iso = toISO(date)
    return tasks.filter(t => t.category === 'pessoal' && t.dueDate === iso)
  }
  const wd = weekdayOf(date)
  return wd ? tasks.filter(t => t.category === 'trabalho' && t.weekday === wd) : []
}

export function CalendarView({ tasks, onDayPress }: Props) {
  const today = new Date()
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [cat, setCat] = useState<Category>('pessoal')

  const year = current.getFullYear()
  const month = current.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ]

  function isToday(d: Date) {
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    )
  }

  const dotColor = cat === 'pessoal' ? 'bg-emerald-400' : 'bg-indigo-400'

  return (
    <div className="flex flex-col h-full">
      {/* Toggle Pessoal / Trabalho */}
      <div className="px-5 pb-3 flex gap-2">
        {([
          { value: 'pessoal' as const, label: 'Pessoal', icon: <User size={15} /> },
          { value: 'trabalho' as const, label: 'Trabalho', icon: <Briefcase size={15} /> },
        ]).map(opt => (
          <button
            key={opt.value}
            onClick={() => setCat(opt.value)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-colors ${
              cat === opt.value
                ? 'bg-indigo-600 text-white'
                : 'bg-neutral-900 text-neutral-400 hover:text-white'
            }`}
          >
            {opt.icon}
            {opt.label}
          </button>
        ))}
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between px-5 py-2">
        <button
          onClick={() => setCurrent(new Date(year, month - 1, 1))}
          className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-base font-semibold text-white">
          {MONTH_NAMES[month]} {year}
        </h2>
        <button
          onClick={() => setCurrent(new Date(year, month + 1, 1))}
          className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 px-3 mb-1">
        {DAY_NAMES.map((d, i) => (
          <div key={i} className="text-center text-xs font-medium text-neutral-500 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 px-3 gap-y-1 flex-1">
        {cells.map((date, i) => {
          if (!date) return <div key={i} />
          const dayTasks = tasksOnDate(tasks, date, cat)
          const pending = dayTasks.filter(t => !isDone(t, toISO(date))).length
          const today_ = isToday(date)

          return (
            <button
              key={i}
              onClick={() => onDayPress(date)}
              className={`flex flex-col items-center py-2 rounded-xl transition-colors ${
                today_ ? 'bg-indigo-600 text-white' : 'hover:bg-neutral-800 text-neutral-300'
              }`}
            >
              <span className="text-sm font-medium leading-none">{date.getDate()}</span>
              {dayTasks.length > 0 && (
                <div className="flex items-center gap-1 mt-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${today_ ? 'bg-white/80' : dotColor}`} />
                  {pending > 1 && (
                    <span className={`text-[9px] font-semibold leading-none ${today_ ? 'text-white/80' : 'text-neutral-500'}`}>
                      {pending}
                    </span>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div className="flex justify-center py-4 text-xs text-neutral-500">
        <span className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${dotColor}`} />
          {cat === 'pessoal' ? 'Tarefas pessoais' : 'Tarefas de trabalho'}
        </span>
      </div>
    </div>
  )
}
