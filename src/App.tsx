import './sections/sections.css'
import { useLenis } from './lib/motion'
import { isPlaceholder } from './data/ledger'
import Hero from './sections/Hero'
import Story from './sections/Story'
import Ledger from './sections/Ledger'
import Breakdown from './sections/Breakdown'
import Verse from './sections/Verse'
import Close from './sections/Close'

export default function App() {
  useLenis()

  return (
    <>
      <a className="skip" href="#main">
        Skip to the record
      </a>
      {isPlaceholder ? (
        <p className="notice">
          Placeholder data. Every figure on this page is a zero standing in for the real
          record, which has not been published yet.
        </p>
      ) : null}
      <main id="main">
        <Hero />
        <Story />
        <Ledger />
        <Breakdown />
        <Verse />
        <Close />
      </main>
    </>
  )
}
