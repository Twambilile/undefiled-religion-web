import { Link } from 'react-router-dom'
import Ledger from '../sections/Ledger'
import Breakdown from '../sections/Breakdown'
import { Reveal } from '../lib/motion'
import { completeFrom, lastUpdated, monthLabel } from '../data/ledger'

export default function LedgerPage() {
  return (
    <main id="main">
      <Ledger />
      <Breakdown />
      <section className="section surface--dark">
        <p className="eyebrow">About this record</p>
        <Reveal as="p" className="lead">
          From {monthLabel(completeFrom)} onwards, every line here is the exact amount we
          sent. The earlier entries we pieced back together from years of messages, so
          they are missing a lot: the real totals for the early days are higher than what
          you see. We would rather show the gap than fill it with guesses.
        </Reveal>
        <Reveal as="p" className="dim">
          One payment usually covers several families at once, so we keep the record by
          payment rather than by person. Everything is in kwacha, which is what we send.
          The pound view is rough, converted at roughly the rate for each year.
        </Reveal>
        <Reveal as="p" className="dim">
          Last updated {lastUpdated}. <Link to="/">Back to the beginning</Link>.
        </Reveal>
      </section>
    </main>
  )
}
