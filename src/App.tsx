import { useState } from 'react'
import { Plus, User, ListTodo } from 'lucide-react'
import { useTasks } from './hooks/useTasks'
import { TaskCard } from './components/TaskCard'
import { TaskForm } from './components/TaskForm'
import { BottomNav } from './components/BottomNav'
import { CalendarView } from './components/CalendarView'
import { WeekView } from './components/WeekView'
import { DayDetail } from './components/DayDetail'
import type { Task, Weekday, Period } from './types'
import type { View } from './components/BottomNav'

export default function App() {
  const { tasks, addTask, toggleTask, deleteTask, editTask } = useTasks()
  const [view, setView] = useState<View>('lista')
  const [listFilter, setListFilter] = useState<'todas' | 'pessoal'>('todas')
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formDefaults, setFormDefaults] = useState<{ weekday?: Weekday; period?: Period }>({})
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

  const pendingCount = tasks.filter(t => !t.completed).length

  function handleEdit(task: Task) {
    setEditingTask(task)
    setFormDefaults({})
    setShowForm(true)
  }

  function handleFormClose() {
    setShowForm(false)
    setEditingTask(null)
    setFormDefaults({})
  }

  function handleFormSubmit(data: Parameters<typeof addTask>[0]) {
    if (editingTask) {
      editTask(editingTask.id, data)
    } else {
      addTask(data)
    }
  }

  function handleWeekAdd(weekday: Weekday, period: Period) {
    setEditingTask(null)
    setFormDefaults({ weekday, period })
    setShowForm(true)
  }

  // Lista view — só pessoal + todas (sem trabalho dedicado, ele está na aba Semana)
  const listTasks = tasks.filter(t =>
    listFilter === 'todas' ? t.category === 'pessoal' : t.category === 'pessoal'
  )
  const workTasks = tasks.filter(t => t.category === 'trabalho')
  const pending = listTasks.filter(t => !t.completed)
  const done = listTasks.filter(t => t.completed)

  return (
    <div className="min-h-svh bg-[#0a0a0a] flex flex-col max-w-lg mx-auto">
      {/* ── LISTA ── */}
      {view === 'lista' && (
        <>
          <div className="px-5 pt-12 pb-4">
            <h1 className="text-2xl font-bold text-white tracking-tight">Minhas Tarefas</h1>
            <p className="text-sm text-neutral-500 mt-0.5">
              {pendingCount === 0 ? 'Tudo em dia!' : `${pendingCount} pendente${pendingCount !== 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="px-5 flex gap-2">
            {[
              { value: 'todas' as const, label: 'Pessoal', icon: <User size={16} /> },
            ].map(f => (
              <button
                key={f.value}
                onClick={() => setListFilter(f.value)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-indigo-600 text-white"
              >
                {f.icon}
                {f.label}
                {pending.length > 0 && (
                  <span className="text-xs rounded-full px-1.5 py-0.5 font-semibold bg-white/20 text-white">
                    {pending.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 px-5 py-4 flex flex-col gap-6 overflow-y-auto pb-28">
            {listTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-neutral-900 flex items-center justify-center mb-4">
                  <ListTodo size={28} className="text-neutral-600" />
                </div>
                <p className="text-neutral-500 text-sm">Nenhuma tarefa pessoal.</p>
                <p className="text-neutral-600 text-xs mt-1">Toque no + para adicionar.</p>
              </div>
            ) : (
              <>
                {pending.length > 0 && (
                  <section>
                    <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                      Pendentes · {pending.length}
                    </h3>
                    <div className="flex flex-col gap-2">
                      {pending.map(task => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onToggle={() => toggleTask(task.id)}
                          onDelete={() => deleteTask(task.id)}
                          onEdit={() => handleEdit(task)}
                        />
                      ))}
                    </div>
                  </section>
                )}
                {done.length > 0 && (
                  <section>
                    <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                      Concluídas · {done.length}
                    </h3>
                    <div className="flex flex-col gap-2">
                      {done.map(task => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onToggle={() => toggleTask(task.id)}
                          onDelete={() => deleteTask(task.id)}
                          onEdit={() => handleEdit(task)}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>

          {/* FAB */}
          <div className="fixed bottom-20 right-5 pointer-events-none max-w-lg w-full" style={{ right: 'max(1.25rem, calc(50% - 32rem + 1.25rem))' }}>
            <button
              onClick={() => { setFormDefaults({}); setShowForm(true) }}
              className="pointer-events-auto flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold px-5 py-3.5 rounded-2xl shadow-lg shadow-indigo-900/40 transition-all ml-auto"
            >
              <Plus size={20} strokeWidth={2.5} />
              Nova tarefa
            </button>
          </div>
        </>
      )}

      {/* ── CALENDÁRIO ── */}
      {view === 'calendario' && (
        <div className="flex flex-col flex-1 pb-16">
          <div className="px-5 pt-12 pb-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Calendário</h1>
          </div>
          <CalendarView tasks={tasks} onDayPress={setSelectedDay} />
        </div>
      )}

      {/* ── SEMANA ── */}
      {view === 'semana' && (
        <div className="flex flex-col flex-1 pb-16 overflow-hidden">
          <div className="px-5 pt-12 pb-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Semana de Trabalho</h1>
            <p className="text-sm text-neutral-500 mt-0.5">
              {workTasks.filter(t => !t.completed).length} tarefa{workTasks.filter(t => !t.completed).length !== 1 ? 's' : ''} pendente{workTasks.filter(t => !t.completed).length !== 1 ? 's' : ''}
            </p>
          </div>
          <WeekView
            tasks={workTasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onEdit={handleEdit}
            onAdd={handleWeekAdd}
          />
        </div>
      )}

      {/* Bottom nav */}
      <BottomNav active={view} onChange={setView} />

      {/* Day detail modal */}
      {selectedDay && (
        <DayDetail
          date={selectedDay}
          tasks={tasks}
          onClose={() => setSelectedDay(null)}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={t => { setSelectedDay(null); handleEdit(t) }}
        />
      )}

      {/* Task form */}
      {showForm && (
        <TaskForm
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
          initial={editingTask ?? undefined}
          defaultCategory={formDefaults.weekday ? 'trabalho' : 'pessoal'}
          defaultWeekday={formDefaults.weekday}
          defaultPeriod={formDefaults.period}
        />
      )}
    </div>
  )
}
