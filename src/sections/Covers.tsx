import { MaskedLines, Plane, Reveal } from '../lib/motion'
import { useCurrency } from '../lib/currency'
import { liveGbpToMwk, ratesUpdated, show } from '../data/ledger'

/**
 * Real costs, taken from the budgets in the record and rounded to a round
 * number. Stored in kwacha, the currency they were quoted in, and shown in
 * whichever view is active. The pound figure uses the current year's rate.
 */
const rate = liveGbpToMwk
const covers = [
  { mwk: 40000, t: 'A 25kg bag of maize flour', b: 'The staple. It is on almost every budget we get.' },
  { mwk: 60000, t: 'A month of food for a household', b: 'Flour, cooking oil, eggs, sugar and soap. The list a family sends when the cupboard is empty.' },
  { mwk: 55000, t: 'Exam fees for a student', b: 'Without these a child cannot sit the exam they have studied a year for.' },
  { mwk: 90000, t: 'Half a term of school fees', b: 'Fees are usually paid in two halves. This is one half, for one student.' },
  { mwk: 250000, t: 'A whole month for several families', b: 'A full budget: fees, food and transport for a group of households at once.' },
  { mwk: 290000, t: 'A term of boarding for one child', b: 'A place kept at boarding school for a full term.' },
]

export default function Covers() {
  const { view } = useCurrency()
  return (
    <section className="section surface--dark covers" id="give">
      <div className="planes">
        <Plane speed={0.1} src="/planes/maize.webp" className="plane plane--maize" scale={1.08} />
        <Plane speed={0.5} className="plane wash wash--earth" />
      </div>
      <div className="grain" aria-hidden="true" />

      <p className="eyebrow">If you want to help</p>
      <MaskedLines
        as="h2"
        text="This is what an amount actually buys."
        className="h2"
      />
      <Reveal as="p" className="lead">
        We are starting to let other people help too. There is no button yet, and none of
        these are asking amounts. They are just the real prices we pay, so you can see
        what any amount does.
      </Reveal>

      <ul className="covers__list">
        {covers.map((c) => (
          <Reveal as="li" className="cover" key={c.t}>
            <span className="cover__amount num">{show(view, c.mwk, c.mwk / rate)}</span>
            <span className="cover__body">
              <span className="cover__t">{c.t}</span>
              <span className="cover__b">{c.b}</span>
            </span>
          </Reveal>
        ))}
      </ul>

      <Reveal as="p" className="dim covers__note">
        These are prices from our own budgets, rounded off. Kwacha is what actually gets
        spent. Other currencies use the live rate, about{' '}
        {new Intl.NumberFormat('en-GB').format(rate)} kwacha to the pound
        {ratesUpdated ? `, last checked ${ratesUpdated}` : ''}.
      </Reveal>
    </section>
  )
}
