import './sections/sections.css'
import { useEffect } from 'react'
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

  return (
    <nav className="island" aria-label="Main">
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
    </nav>
  )
}

export default function App() {
  useLenis()

  return (
    <BrowserRouter>
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
          <div className="bezel" aria-hidden="true" />
          <Nav />
          <div className="frame">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/ledger" element={<LedgerPage />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </div>
        </CurrencyProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
