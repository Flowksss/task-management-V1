import { Check, Briefcase, User, TrendingUp, AlertCircle, CalendarClock, ChevronRight } from 'lucide-react'
import type { Task } from '../types'
import { toISO, todayISO, weekDates } from '../lib/date'
import { isDone, activeOnDate } from '../lib/tasks'
import type { View } from './BottomNav'

interface Props {
  tasks: Task[]
  onToggleDone: (task: Task, iso: string) => void
  onGoTo: (view: View) => void
}

const DAY_BARS = ['S', 'T', 'Q', 'Q', 'S']
const BAR_KEYS = ['seg', 'ter', 'qua', 'qui', 'sex'] as const

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

function fullDate(): string {
  const d = new Date()
  const days = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado']
  const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
  return `${days[d.getDay()]}, ${d.getDate()} de ${months[d.getMonth()]}`
}

export function Dashboard({ tasks, onToggleDone, onGoTo }: Props) {
  const iso = todayISO()
  const today = new Date()

  // Agenda de hoje (fixa por weekday + avulsa no range, ambas via activeOnDate)
  const todayWork = tasks.filter(t => t.category === 'trabalho' && activeOnDate(t, today, true))
  const todayPersonal = tasks.filter(t => t.category === 'pessoal' && t.dueDate === iso)
  const agenda = [...todayWork, ...todayPersonal]
  const agendaDone = agenda.filter(t => isDone(t, iso)).length
  const agendaPct = agenda.length > 0 ? Math.round((agendaDone / agenda.length) * 100) : 0

  // Métricas pessoais
  const personalPending = tasks.filter(t => t.category === 'pessoal' && !t.completed)
  // Atrasadas: pessoais + avulsa de trabalho com prazo vencido não concluída
  const overdueWork = tasks.filter(
    t => t.category === 'trabalho' && t.fixa === false && !t.completed && t.dueDate && t.dueDate < iso
  )
  const overdue = [...personalPending.filter(t => t.dueDate && t.dueDate < iso), ...overdueWork]
  const upcoming = personalPending
    .filter(t => t.dueDate && t.dueDate > iso)
    .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : 1))
    .slice(0, 3)

  // Conclusão da semana de trabalho (datas reais Seg→Sex)
  const dates = weekDates()
  const weekBars = BAR_KEYS.map((key, i) => {
    const d = dates[i]
    const dISO = toISO(d)
    const scheduled = tasks.filter(t => t.category === 'trabalho' && activeOnDate(t, d, true))
    const done = scheduled.filter(t => isDone(t, dISO)).length
    const pct = scheduled.length > 0 ? done / scheduled.length : 0
    return { key, pct, scheduled: scheduled.length, done, isToday: dISO === iso, isFuture: dISO > iso }
  })

  const weekScheduled = weekBars.reduce((s, b) => s + b.scheduled, 0)
  const weekDoneTotal = weekBars.reduce((s, b) => s + b.done, 0)
  const weekPct = weekScheduled > 0 ? Math.round((weekDoneTotal / weekScheduled) * 100) : 0

  function toggle(task: Task) {
    onToggleDone(task, iso)
  }

  return (
    <div className="flex-1 overflow-y-auto px-5 pt-12 pb-28 flex flex-col gap-6">
      {/* Saudação */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">{greeting()}, Miguel</h1>
        <p className="text-sm text-neutral-500 mt-0.5 capitalize">{fullDate()}</p>
      </div>

      {/* Progresso de hoje */}
      <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-900/10 rounded-2xl p-5 ring-1 ring-indigo-800/40">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-neutral-300">Progresso de hoje</span>
          <span className="text-2xl font-bold text-white">{agendaPct}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-neutral-800 overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${agendaPct}%` }}
          />
        </div>
        <p className="text-xs text-neutral-400 mt-2.5">
          {agenda.length === 0
            ? 'Nada agendado para hoje.'
            : `${agendaDone} de ${agenda.length} concluída${agenda.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Agenda de hoje */}
      {agenda.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Hoje</h2>
          {agenda.map(task => {
            const done = isDone(task, iso)
            return (
              <div
                key={task.id}
                className={`flex items-center gap-3 bg-neutral-900 rounded-xl px-3 py-3 transition-opacity ${done ? 'opacity-50' : ''}`}
              >
                <button
                  onClick={() => toggle(task)}
                  className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    done ? 'bg-indigo-600 border-indigo-600' : 'border-neutral-600 hover:border-indigo-500'
                  }`}
                >
                  {done && <Check size={13} strokeWidth={3} className="text-white" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${done ? 'line-through text-neutral-500' : 'text-neutral-100'}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1">
                    {task.category === 'trabalho' ? <Briefcase size={11} /> : <User size={11} />}
                    {task.category === 'trabalho' ? (task.period === 'manha' ? 'Manhã' : 'Tarde') : 'Pessoal'}
                  </p>
                </div>
              </div>
            )
          })}
        </section>
      )}

      {/* Atrasadas */}
      {overdue.length > 0 && (
        <button
          onClick={() => onGoTo('lista')}
          className="flex items-center gap-3 bg-red-500/10 ring-1 ring-red-500/20 rounded-2xl px-4 py-3.5 text-left"
        >
          <AlertCircle size={20} className="text-red-400 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-300">
              {overdue.length} tarefa{overdue.length !== 1 ? 's' : ''} atrasada{overdue.length !== 1 ? 's' : ''}
            </p>
            <p className="text-xs text-red-400/70">Toque para ver na lista</p>
          </div>
          <ChevronRight size={18} className="text-red-400/60" />
        </button>
      )}

      {/* Conclusão da semana de trabalho */}
      <section className="bg-neutral-900 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-neutral-300 flex items-center gap-1.5">
            <TrendingUp size={15} className="text-indigo-400" />
            Semana de trabalho
          </span>
          <span className="text-sm font-bold text-white">{weekPct}%</span>
        </div>
        <div className="flex items-end justify-between gap-2 h-24">
          {weekBars.map((bar, i) => (
            <div key={bar.key} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full flex-1 flex items-end">
                <div className="w-full bg-neutral-800 rounded-md overflow-hidden h-full flex items-end">
                  <div
                    className={`w-full rounded-md transition-all duration-500 ${
                      bar.isToday ? 'bg-indigo-400' : bar.isFuture ? 'bg-neutral-700' : 'bg-indigo-600'
                    }`}
                    style={{ height: `${bar.scheduled === 0 ? 0 : Math.max(bar.pct * 100, 6)}%` }}
                  />
                </div>
              </div>
              <span className={`text-xs font-medium ${bar.isToday ? 'text-indigo-400' : 'text-neutral-500'}`}>
                {DAY_BARS[i]}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-neutral-500 mt-3">
          {weekScheduled === 0
            ? 'Nenhuma tarefa de trabalho cadastrada.'
            : `${weekDoneTotal} de ${weekScheduled} conclusões nesta semana`}
        </p>
      </section>

      {/* Próximas pessoais */}
      {upcoming.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
            <CalendarClock size={13} />
            Próximas
          </h2>
          {upcoming.map(task => (
            <div key={task.id} className="flex items-center gap-3 bg-neutral-900 rounded-xl px-3 py-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <p className="flex-1 text-sm text-neutral-200 truncate">{task.title}</p>
              <span className="text-xs text-neutral-500">
                {task.dueDate && new Date(task.dueDate + 'T00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
              </span>
            </div>
          ))}
        </section>
      )}

      {/* Resumo numérico */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => onGoTo('lista')} className="bg-neutral-900 rounded-2xl p-4 text-left">
          <User size={18} className="text-emerald-400 mb-2" />
          <p className="text-2xl font-bold text-white">{personalPending.length}</p>
          <p className="text-xs text-neutral-500">pessoais pendentes</p>
        </button>
        <button onClick={() => onGoTo('semana')} className="bg-neutral-900 rounded-2xl p-4 text-left">
          <Briefcase size={18} className="text-indigo-400 mb-2" />
          <p className="text-2xl font-bold text-white">{todayWork.filter(t => !isDone(t, iso)).length}</p>
          <p className="text-xs text-neutral-500">de trabalho hoje</p>
        </button>
      </div>
    </div>
  )
}
