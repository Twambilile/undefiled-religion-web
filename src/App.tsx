import './sections/sections.css'
import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scrollToId, useLenis } from './lib/motion'
import { CurrencyProvider, CurrencyToggle } from './lib/currency'
import { ThemeProvider, ThemeToggle } from './lib/theme'
import { isPlaceholder } from './data/ledger'
import Home from './pages/Home'
import LedgerPage from './pages/LedgerPage'

/** New page, top of the page, and every trigger measured again. */
function ResetScroll() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    ScrollTrigger.refresh()
  }, [pathname])
  return null
}

const mark = (
  <svg className="nav__logo" viewBox="0 0 32 32" width="22" height="22" aria-hidden="true">
    <rect width="32" height="32" rx="10" fill="var(--ochre)" />
    <g stroke="#0e0b08" strokeWidth="2.4" strokeLinecap="round">
      <path d="M9 11h14M9 16h14M9 21h8" />
    </g>
  </svg>
)

const links = [
  { id: 'route', label: 'The route' },
  { id: 'figures', label: 'The figures' },
  { id: 'give', label: 'Give' },
]

function Nav() {
  const { pathname } = useLocation()
  const onLedger = pathname === '/ledger'
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [pathname])

  return (
    <nav className={`island${open ? ' is-open' : ''}`} aria-label="Main">
      <Link className="island__brand" to="/" aria-label="Undefiled Religion, home">
        {mark}
        <span className="island__name">Undefiled Religion</span>
      </Link>

      {!onLedger ? (
        <div className="island__links">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToId(l.id)
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
      ) : (
        <span className="island__here">The record</span>
      )}

      <span className="island__tools">
        <CurrencyToggle />
        <ThemeToggle />
      </span>

      <Link className="island__cta" to={onLedger ? '/' : '/ledger'}>
        {onLedger ? 'The project' : 'The ledger'}
      </Link>

      <button
        type="button"
        className="island__burger"
        aria-expanded={open}
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((o) => !o)}
      >
        <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true">
          {open ? (
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          ) : (
            <path d="M3.5 6.5h13M3.5 13.5h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          )}
        </svg>
      </button>

      {open ? (
        <div className="island__sheet">
          {!onLedger &&
            links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  setOpen(false)
                  scrollToId(l.id)
                }}
              >
                {l.label}
              </a>
            ))}
          <Link className="island__cta" to={onLedger ? '/' : '/ledger'}>
            {onLedger ? 'The project' : 'The ledger'}
          </Link>
        </div>
      ) : null}
    </nav>
  )
}

export default function App() {
  useLenis()

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ThemeProvider>
        <CurrencyProvider>
          <ResetScroll />
          <a className="skip" href="#main">
            Skip to the content
          </a>
          {isPlaceholder ? (
            <p className="notice">
              Placeholder data. Every figure on this page is a stand-in for the real
              record, which has not been published yet.
            </p>
          ) : null}
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ledger" element={<LedgerPage />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </CurrencyProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
