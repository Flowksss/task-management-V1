import type { Weekday } from '../types'

/** ISO local (YYYY-MM-DD) — nunca UTC, para não rolar a data no fuso BR. */
export function toISO(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function todayISO(): string {
  return toISO(new Date())
}

const WEEKDAY_BY_DAY: Record<number, Weekday> = {
  1: 'seg', 2: 'ter', 3: 'qua', 4: 'qui', 5: 'sex',
}

/** Weekday de uma data, ou null para sábado/domingo. */
export function weekdayOf(date: Date): Weekday | null {
  return WEEKDAY_BY_DAY[date.getDay()] ?? null
}

export function todayWeekday(): Weekday | null {
  return weekdayOf(new Date())
}

/** Segunda-feira da semana que contém `ref` (default hoje), zerada às 00h. */
export function mondayOf(ref: Date = new Date()): Date {
  const d = new Date(ref)
  d.setHours(0, 0, 0, 0)
  const dow = d.getDay()
  const diff = dow === 0 ? -6 : 1 - dow
  d.setDate(d.getDate() + diff)
  return d
}

/** Datas reais de Seg→Sex da semana atual, na ordem do grid. */
export function weekDates(ref: Date = new Date()): Date[] {
  const mon = mondayOf(ref)
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(mon)
    d.setDate(mon.getDate() + i)
    return d
  })
}
