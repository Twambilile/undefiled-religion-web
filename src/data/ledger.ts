import csv from '../../data/ledger.csv?raw'
import meta from '../../data/ledger.meta.json'
import rates from '../../data/rates.json'

export type Ccy = 'MWK' | 'GBP'

export type Entry = {
  month: string // YYYY-MM
  year: number
  ref: string
  category: string
  /** The amount as it was actually sent, in its own currency. */
  amount: number
  currency: Ccy
  note: string
  /** The same payment expressed in kwacha, converted at its own year's rate. */
  mwk: number
  /** And in pounds, again at its own year's rate. */
  gbp: number
}

export const isPlaceholder: boolean = meta.placeholder === true
export const startDate: string = meta.startDate
export const familiesSupportedNow: number = meta.familiesSupportedNow
export const completeFrom: string = meta.completeFrom
export const lastUpdated: string = meta.lastUpdated

const gbpToMwk = rates.gbpToMwk as Record<string, number>
const fallbackRate = 2600

export function rateFor(year: number | string): number {
  return gbpToMwk[String(year)] ?? fallbackRate
}

function splitRow(line: string): string[] {
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
    const [month, ref, category, amount, currency, note] = splitRow(line)
    const year = Number(month.slice(0, 4))
    const value = Number(amount) || 0
    const ccy = (currency === 'GBP' ? 'GBP' : 'MWK') as Ccy
    return {
      month,
      year,
      ref,
      category,
      amount: value,
      currency: ccy,
      note: note || '',
      mwk: ccy === 'GBP' ? value * rateFor(year) : value,
      gbp: ccy === 'GBP' ? value : value / rateFor(year),
    }
  })
  .sort((a, b) => (a.month < b.month ? -1 : a.month > b.month ? 1 : 0))

const sum = (xs: Entry[]) => xs.reduce((t, e) => t + e.mwk, 0)
const sumGbp = (xs: Entry[]) => xs.reduce((t, e) => t + e.gbp, 0)

/**
 * Kwacha is the currency of the record. The pound figure is not a conversion of
 * the kwacha total at today's rate, which would be wrong by a long way: it is the
 * sum of each entry converted at the rate for its own year.
 */
export const total = sum(entries)
export const totalGbp = sumGbp(entries)

export type MonthGroup = {
  month: string
  year: number
  total: number
  totalGbp: number
  entries: Entry[]
}

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
      totalGbp: sumGbp(list),
      entries: list,
    }))
})()

export type Split = { key: string; total: number; totalGbp: number; count: number; share: number }

function split(keyOf: (e: Entry) => string): Split[] {
  const map = new Map<string, { total: number; totalGbp: number; count: number }>()
  for (const e of entries) {
    const k = keyOf(e)
    const cur = map.get(k) || { total: 0, totalGbp: 0, count: 0 }
    cur.total += e.mwk
    cur.totalGbp += e.gbp
    cur.count += 1
    map.set(k, cur)
  }
  const grand = total || 1
  return [...map.entries()]
    .map(([key, v]) => ({ ...v, key, share: v.total / grand }))
    .sort((a, b) => b.total - a.total || b.count - a.count)
}

export const byCategory: Split[] = split((e) => e.category)

export const byYear: Split[] = split((e) => String(e.year)).sort((a, b) =>
  a.key < b.key ? -1 : 1,
)

export const routesInRecord: number = new Set(entries.map((e) => e.ref)).size

export const monthsRunning: number = (() => {
  if (!byMonth.length) return 0
  const [y0, m0] = startDate.split('-').map(Number)
  const [y1, m1] = byMonth[byMonth.length - 1].month.split('-').map(Number)
  return (y1 - y0) * 12 + (m1 - m0) + 1
})()

/** Entries before the receipts began, which are known to be partial. */
export const partialBefore: MonthGroup[] = byMonth.filter((m) => m.month < completeFrom)

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function monthLabel(month: string): string {
  const [y, m] = month.split('-').map(Number)
  return `${monthNames[m - 1]} ${y}`
}

/* -------------------------------------------------------------------- money */

const mwkFmt = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 })
const gbpFmt = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
})

/** Kwacha is the currency of the record. Pounds are the second view of it. */
export function money(mwk: number, view: Ccy = 'MWK', year?: number): string {
  if (view === 'GBP') return gbpFmt.format(mwk / rateFor(year ?? 2026))
  return `MK ${mwkFmt.format(mwk)}`
}

/** Shows a figure that already carries both sides, so nothing is reconverted. */
export function show(view: Ccy, mwk: number, gbp: number): string {
  return view === 'GBP' ? gbpFmt.format(gbp) : `MK ${mwkFmt.format(mwk)}`
}

/** For an entry, shows the amount as it was actually sent when it was a pound. */
export function entryMoney(e: Entry, view: Ccy): string {
  return show(view, e.mwk, e.gbp)
}
