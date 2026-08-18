import { Link } from 'react-router-dom'
import { MaskedLines, Plane, Reveal } from '../lib/motion'
import Mark from '../components/Mark'
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
        <Reveal className="signoff signoff--lead">
          <Link to="/" className="signoff__link" aria-label="Undefiled Religion, home">
            <Mark size={84} />
          </Link>
        </Reveal>

        <MaskedLines
          as="h2"
          text="That is the whole thing."
          className="close__line"
        />
        <Reveal as="p" className="dim">
          For years it was just the two of us, and nobody had any reason to trust that the
          money did what we said it did. Now that other people might help, the least we can
          do is show exactly where all of it has gone. That is what this site is.
        </Reveal>

        <div className="colophon">
          <p style={{ margin: 0 }}>
            Undefiled Religion. Malawi. Running for {monthsRunning} months and counting.
          </p>
          <p style={{ margin: 0 }}>
            Not a registered charity. Started and paid for by the two of us. Two unpaid
            coordinators in Malawi, and one housemother we pay.
          </p>
          <p style={{ margin: 0 }}>
            No names, no schools, no places. We keep the people we help out of it.
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
