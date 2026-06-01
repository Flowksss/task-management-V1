import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Task, Weekday } from '../types'

interface Props {
  tasks: Task[]
  onDayPress: (date: Date) => void
}

const WEEKDAY_MAP: Record<number, Weekday> = {
  1: 'seg', 2: 'ter', 3: 'qua', 4: 'qui', 5: 'sex',
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const DAY_NAMES = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

function getTasksForDate(tasks: Task[], date: Date) {
  const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  const dayOfWeek = date.getDay()
  const weekday = WEEKDAY_MAP[dayOfWeek]

  const personal = tasks.filter(t => t.category === 'pessoal' && t.dueDate === iso)
  const work = weekday ? tasks.filter(t => t.category === 'trabalho' && t.weekday === weekday) : []
  return { personal, work, total: personal.length + work.length }
}

export function CalendarView({ tasks, onDayPress }: Props) {
  const today = new Date()
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

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

  return (
    <div className="flex flex-col h-full">
      {/* Month nav */}
      <div className="flex items-center justify-between px-5 py-4">
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
          const { personal, work, total } = getTasksForDate(tasks, date)
          const today_ = isToday(date)

          return (
            <button
              key={i}
              onClick={() => onDayPress(date)}
              className={`flex flex-col items-center py-2 rounded-xl transition-colors ${
                today_
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-neutral-800 text-neutral-300'
              }`}
            >
              <span className="text-sm font-medium leading-none">{date.getDate()}</span>
              {total > 0 && (
                <div className="flex gap-0.5 mt-1.5">
                  {personal.length > 0 && (
                    <span className={`w-1.5 h-1.5 rounded-full ${today_ ? 'bg-white/70' : 'bg-emerald-400'}`} />
                  )}
                  {work.length > 0 && (
                    <span className={`w-1.5 h-1.5 rounded-full ${today_ ? 'bg-white/70' : 'bg-indigo-400'}`} />
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 justify-center py-4 text-xs text-neutral-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" /> Pessoal
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-400" /> Trabalho
        </span>
      </div>
    </div>
  )
}
