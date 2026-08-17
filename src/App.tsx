import './sections/sections.css'
import { useEffect } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from './lib/motion'
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
  <svg className="nav__logo" viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
    <rect width="32" height="32" rx="9" fill="var(--ochre)" />
    <g stroke="#0e0b08" strokeWidth="2.2" strokeLinecap="round">
      <path d="M8 11h16M8 16h16M8 21h9" />
    </g>
  </svg>
)

function Nav() {
  const { pathname } = useLocation()
  const onLedger = pathname === '/ledger'
  return (
    <nav className="nav glass" aria-label="Main">
      <Link className="nav__brand" to="/">
        {mark}
        <span className="nav__name">Undefiled Religion</span>
      </Link>

      {!onLedger ? (
        <div className="nav__links">
          <a href="#how">How it works</a>
          <a href="#figures">The figures</a>
          <a href="#give">Give</a>
        </div>
      ) : (
        <div className="nav__links">
          <span className="nav__here">The record</span>
        </div>
      )}

      <div className="nav__right">
        <CurrencyToggle />
        <ThemeToggle />
        <Link className="glass nav__cta" to={onLedger ? '/' : '/ledger'}>
          {onLedger ? 'The project' : 'The ledger'}
        </Link>
      </div>
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
