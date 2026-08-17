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
          Every transfer from {monthLabel(completeFrom)} onwards is taken from its own
          transfer receipt. The entries before that were reconstructed from the messages
          the project has always run on, so the early years are partial and the true
          totals for them are higher than what is shown. Nothing has been estimated to
          close the gap, and no figure here is rounded up.
        </Reveal>
        <Reveal as="p" className="dim">
          Most transfers are pooled: one payment covers several families at once, which is
          why the record is kept by transfer rather than by child. Amounts are shown in
          kwacha, as they were received. The pound view converts each entry at the rate
          for its own year, which is an estimate and marked as one.
        </Reveal>
        <Reveal as="p" className="dim">
          Last updated {lastUpdated}. <Link to="/">Back to the beginning</Link>.
        </Reveal>
      </section>
    </main>
  )
}
