import { useState } from 'react'
import { X } from 'lucide-react'
import type { Category, Priority, Task, Weekday, Period } from '../types'

interface Props {
  onSubmit: (data: {
    title: string
    description?: string
    category: Category
    priority: Priority
    dueDate?: string
    weekday?: Weekday
    period?: Period
  }) => void
  onClose: () => void
  initial?: Task
  defaultCategory?: Category
  defaultWeekday?: Weekday
  defaultPeriod?: Period
}

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'pessoal', label: 'Pessoal' },
  { value: 'trabalho', label: 'Trabalho' },
]

const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'baixa', label: 'Baixa', color: 'text-emerald-400' },
  { value: 'media', label: 'Média', color: 'text-amber-400' },
  { value: 'alta', label: 'Alta', color: 'text-red-400' },
]

const WEEKDAYS: { value: Weekday; label: string }[] = [
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

export function TaskForm({ onSubmit, onClose, initial, defaultCategory, defaultWeekday, defaultPeriod }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [category, setCategory] = useState<Category>(initial?.category ?? defaultCategory ?? 'pessoal')
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'media')
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '')
  const [weekday, setWeekday] = useState<Weekday | undefined>(initial?.weekday ?? defaultWeekday)
  const [period, setPeriod] = useState<Period | undefined>(initial?.period ?? defaultPeriod)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      priority,
      dueDate: category === 'pessoal' ? (dueDate || undefined) : undefined,
      weekday: category === 'trabalho' ? weekday : undefined,
      period: category === 'trabalho' ? period : undefined,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative w-full sm:max-w-md bg-neutral-900 rounded-t-2xl sm:rounded-2xl p-6 flex flex-col gap-4 shadow-2xl max-h-[92vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {initial ? 'Editar tarefa' : 'Nova tarefa'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <input
          autoFocus
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Título da tarefa"
          className="w-full bg-neutral-800 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Descrição (opcional)"
          rows={2}
          className="w-full bg-neutral-800 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />

        {/* Categoria */}
        <div>
          <label className="text-xs text-neutral-400 mb-1.5 block">Categoria</label>
          <div className="flex gap-2">
            {CATEGORIES.map(c => (
              <button
                key={c.value}
                type="button"
                onClick={() => setCategory(c.value)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                  category === c.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Prioridade */}
        <div>
          <label className="text-xs text-neutral-400 mb-1.5 block">Prioridade</label>
          <div className="flex gap-2">
            {PRIORITIES.map(p => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                  priority === p.value
                    ? 'bg-neutral-700 ring-2 ring-indigo-500 ' + p.color
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Campos específicos por categoria */}
        {category === 'pessoal' && (
          <div>
            <label className="text-xs text-neutral-400 mb-1.5 block">Data limite (opcional)</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full bg-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500 [color-scheme:dark]"
            />
          </div>
        )}

        {category === 'trabalho' && (
          <>
            <div>
              <label className="text-xs text-neutral-400 mb-1.5 block">Dia da semana</label>
              <div className="flex gap-1.5">
                {WEEKDAYS.map(d => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setWeekday(d.value)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                      weekday === d.value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-neutral-400 mb-1.5 block">Período</label>
              <div className="flex gap-2">
                {PERIODS.map(p => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPeriod(p.value)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                      period === p.value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all"
        >
          {initial ? 'Salvar' : 'Adicionar'}
        </button>
      </form>
    </div>
  )
}
