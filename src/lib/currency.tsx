import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Ccy } from '../data/ledger'

type Ctx = { view: Ccy; setView: (c: Ccy) => void }

const CurrencyContext = createContext<Ctx>({ view: 'MWK', setView: () => {} })

const KEY = 'ur-currency'

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<Ccy>('MWK')

  useEffect(() => {
    const saved = localStorage.getItem(KEY)
    if (saved === 'GBP' || saved === 'MWK') setView(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem(KEY, view)
  }, [view])

  const value = useMemo(() => ({ view, setView }), [view])
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export const useCurrency = () => useContext(CurrencyContext)

export function CurrencyToggle() {
  const { view, setView } = useCurrency()
  return (
    <div className="ccy" role="group" aria-label="Currency">
      <button
        type="button"
        className="ccy__btn"
        aria-pressed={view === 'MWK'}
        onClick={() => setView('MWK')}
      >
        Kwacha
      </button>
      <button
        type="button"
        className="ccy__btn"
        aria-pressed={view === 'GBP'}
        onClick={() => setView('GBP')}
      >
        Pounds
      </button>
    </div>
  )
}
