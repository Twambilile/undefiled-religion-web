import { MaskedLines, Plane, Reveal } from '../lib/motion'
import { useCurrency } from '../lib/currency'
import { rateFor, show } from '../data/ledger'

/**
 * Real costs, taken from the budgets in the record and rounded to a round
 * number. Stored in kwacha, the currency they were quoted in, and shown in
 * whichever view is active. The pound figure uses the current year's rate.
 */
const rate = rateFor(2026)
const covers = [
  { mwk: 40000, t: 'A 25kg bag of maize flour', b: 'The staple. It is the first line on almost every budget that comes in.' },
  { mwk: 60000, t: 'A month of food for one household', b: 'Cooking oil, eggs, sugar, soap and flour, the list a family sends when the cupboard is empty.' },
  { mwk: 55000, t: 'Exam fees for one student', b: 'The MSCE and JCE fees a family cannot always find, without which a child cannot sit the exam.' },
  { mwk: 90000, t: 'Half a term of secondary tuition', b: 'Fees are usually paid in two instalments. This is one of them, for one student.' },
  { mwk: 250000, t: "A month for one coordinator's families", b: 'A whole pooled budget: fees, food and transport for several households at once.' },
  { mwk: 290000, t: 'A term of boarding fees', b: 'A place kept at boarding school for one child for a full term.' },
]

export default function Covers() {
  const { view } = useCurrency()
  return (
    <section className="section surface--dark covers">
      <div className="planes">
        <Plane speed={0.1} src="/planes/maize.webp" className="plane plane--maize" scale={1.08} />
        <Plane speed={0.5} className="plane wash wash--earth" />
      </div>
      <div className="grain" aria-hidden="true" />

      <p className="eyebrow">If you want to help</p>
      <MaskedLines
        as="h2"
        text="Here is what an amount actually turns into."
        className="h2"
      />
      <Reveal as="p" className="lead">
        The project is opening up to others who want to give. There is no button yet, and
        nothing here is a suggested donation. It is simply the real prices from the
        record, so you can see what any amount does on the ground.
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
        Prices are what families quoted in the record, rounded. Kwacha is what actually
        gets spent. The pound figures convert at roughly {new Intl.NumberFormat('en-GB').format(rate)} kwacha
        to the pound, this year's rate, and move as the rate does.
      </Reveal>
    </section>
  )
}
