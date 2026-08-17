import { MaskedLines, Plane, Reveal } from '../lib/motion'
import { familiesSupportedNow } from '../data/ledger'

const beats = [
  {
    when: '10 October 2022',
    what: "One boy's school fees, for one term.",
    note: 'He was in Standard 7. He is not named here and will not be.',
  },
  {
    when: 'The following week',
    what: 'A second child, then a third.',
    note: 'There was nothing to join and no process to follow. Someone asked, and the fees were paid.',
  },
  {
    when: 'February 2023',
    what: 'A WhatsApp group, which is still where the work happens.',
    note: 'Budgets come in as lists with prices on them. Receipts and photographs go back the other way. That group is the reason there is a record to publish.',
  },
  {
    when: 'July 2024',
    what: 'Transfers started leaving a paper trail.',
    note: 'Every payment from then on carries a reference number, which is what makes the second half of this ledger exact.',
  },
  {
    when: 'Now',
    what: `Around ${familiesSupportedNow} families.`,
    note: 'Some are supported every month. Some were helped once, because they asked once.',
  },
]

export default function Story() {
  return (
    <section className="section surface--paper story">
      <div className="planes">
        <Plane speed={0.1} src="/planes/paper.webp" className="plane plane--paper" scale={1.1} />
      </div>

      <p className="eyebrow">How it started</p>
      <MaskedLines as="h2" text="With one term of school fees." className="h2" />

      <div className="story__grid" style={{ marginTop: 'clamp(3rem, 8vh, 6rem)' }}>
        {beats.map((b) => (
          <Reveal className="beat" key={b.when}>
            <p className="beat__when">{b.when}</p>
            <div>
              <p className="beat__what">{b.what}</p>
              <p className="beat__note">{b.note}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
