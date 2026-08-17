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
          text="Nothing here is asking you for anything."
          className="close__line"
        />
        <Reveal as="p" className="dim">
          It is paid for out of two salaries and it does not take donations, so there is
          no appeal and no target to help reach. The record is public because publishing
          it is the only way anyone could check it.
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
