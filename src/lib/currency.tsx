import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { currencies, type Ccy } from '../data/ledger'

type Ctx = { view: Ccy; setView: (c: Ccy) => void }

const CurrencyContext = createContext<Ctx>({ view: 'MWK', setView: () => {} })

const KEY = 'ur-currency'
const codes = currencies.map((c) => c.code)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<Ccy>('MWK')

  useEffect(() => {
    const saved = localStorage.getItem(KEY)
    if (saved && codes.includes(saved)) setView(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem(KEY, view)
  }, [view])

  const value = useMemo(() => ({ view, setView }), [view])
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export const useCurrency = () => useContext(CurrencyContext)

/** A real select, so it works with a keyboard and on a phone without any fuss. */
export function CurrencyToggle() {
  const { view, setView } = useCurrency()
  return (
    <span className="ccy">
      <select
        className="ccy__select"
        value={view}
        onChange={(e) => setView(e.target.value)}
        aria-label="Show amounts in"
      >
        {currencies.map((c) => (
          <option key={c.code} value={c.code}>
            {c.code}
          </option>
        ))}
      </select>
      <svg viewBox="0 0 12 8" width="9" height="6" aria-hidden="true" className="ccy__chev">
        <path d="M1 1.5 6 6.5l5-5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </span>
  )
}
