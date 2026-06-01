import { useState } from 'react'
import { Check, Trash2, Pencil, ChevronDown, ChevronUp, Calendar } from 'lucide-react'
import type { Task } from '../types'

interface Props {
  task: Task
  onToggle: () => void
  onDelete: () => void
  onEdit: () => void
}

const PRIORITY_STYLES = {
  baixa: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
  media: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
  alta: 'bg-red-500/10 text-red-400 ring-red-500/20',
}

const PRIORITY_LABELS = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
}

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

function isOverdue(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const due = new Date(y, m - 1, d)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return due < today
}

export function TaskCard({ task, onToggle, onDelete, onEdit }: Props) {
  const [expanded, setExpanded] = useState(false)
  const overdue = task.dueDate && !task.completed && isOverdue(task.dueDate)

  return (
    <div
      className={`bg-neutral-900 rounded-2xl p-4 transition-opacity ${
        task.completed ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          className={`mt-0.5 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            task.completed
              ? 'bg-indigo-600 border-indigo-600'
              : 'border-neutral-600 hover:border-indigo-500'
          }`}
        >
          {task.completed && <Check size={13} strokeWidth={3} className="text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium leading-snug break-words ${
              task.completed ? 'line-through text-neutral-500' : 'text-neutral-100'
            }`}
          >
            {task.title}
          </p>

          {task.description && expanded && (
            <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed break-words">
              {task.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className={`text-xs px-2 py-0.5 rounded-full ring-1 font-medium ${PRIORITY_STYLES[task.priority]}`}>
              {PRIORITY_LABELS[task.priority]}
            </span>

            {task.dueDate && (
              <span
                className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ring-1 font-medium ${
                  overdue
                    ? 'bg-red-500/10 text-red-400 ring-red-500/20'
                    : 'bg-neutral-700/50 text-neutral-400 ring-neutral-700'
                }`}
              >
                <Calendar size={10} />
                {formatDate(task.dueDate)}
                {overdue && ' · atrasada'}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {task.description && (
            <button
              onClick={() => setExpanded(v => !v)}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          )}
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
