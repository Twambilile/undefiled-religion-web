import { MaskedLines, Plane, Reveal } from '../lib/motion'
import { familiesSupportedNow } from '../data/ledger'

const beats = [
  {
    when: '10 October 2022',
    what: 'It began with one child, and the school fees he could not pay.',
    note: 'A student in Standard 7. He is not named here, and never will be.',
  },
  {
    when: 'A week later',
    what: 'Two.',
    note: 'Nothing was set up in between. Someone asked, and the answer was yes.',
  },
  {
    when: 'Since then',
    what:
      'No organisation, no name on a door, no launch. A commitment held month after month, out of two salaries.',
    note:
      'It is not a registered charity and it does not ask anyone for money. It is paid for privately.',
  },
  {
    when: 'Today',
    what: `Around ${familiesSupportedNow} families, and a record of every payment made.`,
    note:
      'Some support runs every month. Some is one payment, once, because a person asked for help.',
  },
]

export default function Story() {
  return (
    <section className="section surface--paper story">
      <div className="planes">
        <Plane
          speed={0.18}
          className="plane"
          style={{ backgroundImage: 'var(--img-paper)', opacity: 0.5 }}
        />
      </div>

      <p className="eyebrow">How it started</p>
      <MaskedLines as="h2" text="One decision, kept." className="h2" />

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
