import './sections/sections.css'
import { useEffect } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from './lib/motion'
import { CurrencyProvider, CurrencyToggle } from './lib/currency'
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

function Nav() {
  const { pathname } = useLocation()
  return (
    <nav className="nav" aria-label="Main">
      <Link className="nav__mark" to="/">
        Undefiled Religion
      </Link>
      <div className="nav__right">
        <CurrencyToggle />
        <Link className="nav__link" to={pathname === '/ledger' ? '/' : '/ledger'}>
          {pathname === '/ledger' ? 'The project' : 'The ledger'}
        </Link>
      </div>
    </nav>
  )
}

export default function App() {
  useLenis()

  return (
    <BrowserRouter>
      <CurrencyProvider>
        <ResetScroll />
        <a className="skip" href="#main">
          Skip to the content
        </a>
        {isPlaceholder ? (
          <p className="notice">
            Placeholder data. Every figure on this page is a stand-in for the real record,
            which has not been published yet.
          </p>
        ) : null}
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ledger" element={<LedgerPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </CurrencyProvider>
    </BrowserRouter>
  )
}
