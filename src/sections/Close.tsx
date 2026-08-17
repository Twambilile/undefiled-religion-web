import { MaskedLines, Plane, Reveal } from '../lib/motion'
import { isPlaceholder, monthsRunning } from '../data/ledger'

export default function Close() {
  return (
    <section className="section surface--dark close">
      <div className="planes">
        <Plane speed={0.12} src="/planes/sky.webp" className="plane plane--sky" scale={1.1} />
        <Plane speed={0.5} src="/planes/maize.webp" className="plane plane--maize" scale={1.05} />
        <Plane speed={0.75} className="plane wash wash--earth" />
      </div>

      <div>
        <MaskedLines
          as="h2"
          text="There is nothing to click here."
          className="close__line"
        />
        <Reveal as="p" className="dim">
          No appeal, no total to help reach, no button. This is paid for privately and it
          is not asking for money. The record is here because a record kept privately is
          only a promise to yourself.
        </Reveal>

        <div className="colophon">
          <p style={{ margin: 0 }}>
            Undefiled Religion. Malawi. Running for {monthsRunning} months and counting.
          </p>
          <p style={{ margin: 0 }}>
            Not a registered charity. Not accepting donations. Funded by one family.
          </p>
          <p style={{ margin: 0 }}>
            Families appear as initials or pseudonyms. No names, no schools, no places.
          </p>
          <p style={{ margin: 0 }}>
            The record lives in one plain file in this site's repository, so every change
            to it is dated and public.
          </p>
          {isPlaceholder ? (
            <p style={{ margin: 0, color: 'var(--ochre)' }}>
              Placeholder data. The real record has not been published yet.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
