import { Link } from 'react-router-dom'
import { Counter, MaskedLines, Reveal } from '../lib/motion'
import { useCurrency } from '../lib/currency'
import {
  byCategory,
  byYear,
  completeFrom,
  entries,
  familiesSupportedNow,
  show,
  monthLabel,
  monthsRunning,
  total,
  totalGbp,
} from '../data/ledger'

export default function Glance() {
  const { view } = useCurrency()
  const top = byCategory.slice(0, 4)

  return (
    <section className="section surface--paper">
      <p className="eyebrow">The figures</p>
      <MaskedLines as="h2" text="Four years, in four numbers." className="h2" />

      <div className="glance">
        <Reveal className="stat">
          <span className="stat__k">Given since 2022</span>
          <span className="stat__v num">
            <Counter
              value={view === 'GBP' ? totalGbp : total}
              format={(n) => show(view, n, n)}
            />
          </span>
        </Reveal>
        <Reveal className="stat">
          <span className="stat__k">Transfers recorded</span>
          <span className="stat__v num">
            <Counter value={entries.length} format={(n) => String(Math.round(n))} />
          </span>
        </Reveal>
        <Reveal className="stat">
          <span className="stat__k">Months running</span>
          <span className="stat__v num">
            <Counter value={monthsRunning} format={(n) => String(Math.round(n))} />
          </span>
        </Reveal>
        <Reveal className="stat">
          <span className="stat__k">Families supported now</span>
          <span className="stat__v num">
            <Counter value={familiesSupportedNow} format={(n) => String(Math.round(n))} />
          </span>
        </Reveal>
      </div>

      <div className="glance__split">
        <div>
          <p className="eyebrow">How it goes out</p>
          <ul className="minibars">
            {top.map((c) => (
              <Reveal as="li" className="minibar" key={c.key}>
                <span className="minibar__k">{c.key}</span>
                <span className="minibar__v num">{Math.round(c.share * 100)}%</span>
                <span className="minibar__track">
                  <span
                    className="minibar__fill"
                    style={{ transform: `scaleX(${c.share})` }}
                  />
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow">And it grew</p>
          <ul className="minibars">
            {byYear.map((y) => (
              <Reveal as="li" className="minibar" key={y.key}>
                <span className="minibar__k num">{y.key}</span>
                <span className="minibar__v num">{show(view, y.total, y.totalGbp)}</span>
                <span className="minibar__track">
                  <span
                    className="minibar__fill"
                    style={{
                      transform: `scaleX(${y.total / Math.max(...byYear.map((x) => x.total))})`,
                    }}
                  />
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>

      <Reveal as="p" className="dim glance__note">
        Most of it goes out as a pooled transfer: one payment covering fees, flour, oil,
        soap and whatever else that month's list held, for several households at once. It
        is not split into categories here because it was never split at the bank, and
        inventing a breakdown would be the opposite of the point.
      </Reveal>

      <Reveal as="p" className="dim glance__note">
        Every transfer from {monthLabel(completeFrom)} onwards has a receipt behind it.
        The entries before that were reconstructed from four years of messages and are
        partial, so the real total for the early years is higher than the figure above.
        Nothing has been estimated to fill the gap.
      </Reveal>

      <Reveal className="glance__cta">
        <Link className="bigline" to="/ledger">
          Read every payment
        </Link>
      </Reveal>
    </section>
  )
}
