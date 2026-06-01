import { LayoutDashboard, List, Calendar, LayoutGrid } from 'lucide-react'

export type View = 'dashboard' | 'lista' | 'calendario' | 'semana'

interface Props {
  active: View
  onChange: (v: View) => void
}

const TABS: { value: View; label: string; icon: React.ReactNode }[] = [
  { value: 'dashboard', label: 'Início', icon: <LayoutDashboard size={20} /> },
  { value: 'lista', label: 'Lista', icon: <List size={20} /> },
  { value: 'calendario', label: 'Calendário', icon: <Calendar size={20} /> },
  { value: 'semana', label: 'Semana', icon: <LayoutGrid size={20} /> },
]

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/90 backdrop-blur border-t border-neutral-800">
      <div className="max-w-lg mx-auto flex">
        {TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
              active === tab.value
                ? 'text-indigo-400'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
