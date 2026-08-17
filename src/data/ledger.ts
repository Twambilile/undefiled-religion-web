import csv from '../../data/ledger.csv?raw'
import meta from '../../data/ledger.meta.json'

export type Entry = {
  month: string // YYYY-MM
  year: number
  ref: string
  category: string
  amount: number
  note: string
}

export const isPlaceholder: boolean = meta.placeholder === true
export const currency: string = meta.currency || 'GBP'
export const startDate: string = meta.startDate
export const familiesSupportedNow: number = meta.familiesSupportedNow

function splitRow(line: string): string[] {
  // minimal CSV: supports quoted fields containing commas
  const out: string[] = []
  let cur = ''
  let quoted = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (quoted) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++ }
      else if (c === '"') quoted = false
      else cur += c
    } else if (c === '"') quoted = true
    else if (c === ',') { out.push(cur); cur = '' }
    else cur += c
  }
  out.push(cur)
  return out.map((s) => s.trim())
}

export const entries: Entry[] = csv
  .split(/\r?\n/)
  .slice(1)
  .filter((l) => l.trim().length > 0)
  .map((line) => {
    const [month, ref, category, amount, note] = splitRow(line)
    return {
      month,
      year: Number(month.slice(0, 4)),
      ref,
      category,
      amount: Number(amount) || 0,
      note: note || '',
    }
  })
  .sort((a, b) => (a.month < b.month ? -1 : a.month > b.month ? 1 : 0))

const sum = (xs: Entry[]) => xs.reduce((t, e) => t + e.amount, 0)

export const total = sum(entries)

export type MonthGroup = { month: string; year: number; total: number; entries: Entry[] }

export const byMonth: MonthGroup[] = (() => {
  const map = new Map<string, Entry[]>()
  for (const e of entries) {
    const list = map.get(e.month)
    if (list) list.push(e)
    else map.set(e.month, [e])
  }
  return [...map.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([month, list]) => ({
      month,
      year: Number(month.slice(0, 4)),
      total: sum(list),
      entries: list,
    }))
})()

export type Split = { key: string; total: number; count: number; share: number }

function split(keyOf: (e: Entry) => string): Split[] {
  const map = new Map<string, { total: number; count: number }>()
  for (const e of entries) {
    const k = keyOf(e)
    const cur = map.get(k) || { total: 0, count: 0 }
    cur.total += e.amount
    cur.count += 1
    map.set(k, cur)
  }
  const grand = total || 1
  return [...map.entries()]
    .map(([key, v]) => ({ key, total: v.total, count: v.count, share: v.total / grand }))
    .sort((a, b) => b.total - a.total || b.count - a.count)
}

export const byCategory: Split[] = split((e) => e.category)

export const byYear: Split[] = split((e) => String(e.year)).sort((a, b) =>
  a.key < b.key ? -1 : 1,
)

/** Distinct families that appear anywhere in the record. */
export const familiesInRecord: number = new Set(entries.map((e) => e.ref)).size

/** Months between the first entry and the most recent one, inclusive. */
export const monthsRunning: number = (() => {
  if (!byMonth.length) return 0
  const [a, b] = [byMonth[0].month, byMonth[byMonth.length - 1].month]
  const [ay, am] = a.split('-').map(Number)
  const [by, bm] = b.split('-').map(Number)
  return (by - ay) * 12 + (bm - am) + 1
})()

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function monthLabel(month: string): string {
  const [y, m] = month.split('-').map(Number)
  return `${monthNames[m - 1]} ${y}`
}

export function shortMonth(month: string): string {
  const [, m] = month.split('-').map(Number)
  return monthNames[m - 1].slice(0, 3)
}

const nf = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency,
  maximumFractionDigits: 0,
})

export function money(n: number): string {
  return nf.format(n)
}

export const symbol: string =
  nf.formatToParts(0).find((p) => p.type === 'currency')?.value ?? '£'
