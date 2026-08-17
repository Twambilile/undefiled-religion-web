import { MaskedLines, Plane, Reveal } from '../lib/motion'
import { familiesSupportedNow } from '../data/ledger'

const beats = [
  {
    when: '10 October 2022',
    what: 'We paid one boy’s school fees for a term.',
    note: 'He was a Standard 7 student who was about to drop out. That was the whole plan, that one term.',
  },
  {
    when: 'The week after',
    what: 'We were helping two more.',
    note: 'Word got around that we would help, and more people asked. We kept saying yes.',
  },
  {
    when: 'From 2023',
    what: 'It settled into a monthly rhythm.',
    note: 'Budgets started coming to us every month. We would send the money, and everything on the list would get bought and delivered.',
  },
  {
    when: 'Now',
    what: `Around ${familiesSupportedNow} families, and others when they reach out.`,
    note: 'Some we support every month. Others come to us once, because they are stuck once, and we help with that.',
  },
]

export default function Story() {
  return (
    <section className="section surface--paper story">
      <div className="planes">
        <Plane speed={0.1} src="/planes/paper.webp" className="plane plane--paper" scale={1.1} />
      </div>

      <p className="eyebrow">How it started</p>
      <MaskedLines as="h2" text="It started with one boy and one term." className="h2" />

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
