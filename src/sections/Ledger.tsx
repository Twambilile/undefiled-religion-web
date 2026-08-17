import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MaskedLines, Plane, useGsap } from '../lib/motion'
import { useCurrency } from '../lib/currency'
import {
  byMonth,
  completeFrom,
  entries,
  entryMoney,
  familiesSupportedNow,
  isPlaceholder,
  show,
  monthLabel,
  monthsRunning,
  total,
  totalGbp,
} from '../data/ledger'

/** Cumulative totals at the end of each month, in scroll order, in both currencies. */
const cumulative = (() => {
  let mwk = 0
  let gbp = 0
  return byMonth.map((m) => {
    mwk += m.total
    gbp += m.totalGbp
    return { mwk, gbp }
  })
})()

export default function Ledger() {
  const ref = useRef<HTMLElement | null>(null)
  const runningRef = useRef<HTMLSpanElement | null>(null)
  const { view } = useCurrency()

  useGsap(({ el }) => {
    const q = gsap.utils.selector(el)

    q('.month').forEach((month) => {
      const rows = month.querySelectorAll('.row, .month__when')
      gsap.set(rows, { opacity: 0, y: 16 })
      gsap.to(rows, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.05,
        ease: 'power3.out',
        scrollTrigger: { trigger: month, start: 'top 90%', toggleActions: 'play none none reverse' },
      })
    })

    // the running total is the ledger reading itself back to you
    const value = runningRef.current
    if (value) {
      byMonth.forEach((_, i) => {
        ScrollTrigger.create({
          trigger: q('.month')[i],
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => {
            if (self.isActive) {
              value.textContent = show(view, cumulative[i].mwk, cumulative[i].gbp)
            }
          },
          onEnterBack: () => {
            const prev = i > 0 ? cumulative[i - 1] : { mwk: 0, gbp: 0 }
            value.textContent = show(view, prev.mwk, prev.gbp)
          },
        })
      })
    }

    const bar = q('.ledger__progress')[0]
    const years = q('.year')
    if (bar && years.length) {
      gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: years[0],
            endTrigger: years[years.length - 1],
            start: 'top 55%',
            end: 'bottom 55%',
            scrub: true,
          },
        },
      )
    }

    const coda = q('.coda')[0]
    if (coda) {
      const lines = coda.querySelectorAll('.coda__line')
      gsap.set(lines, { opacity: 0, y: 30 })
      gsap
        .timeline({
          scrollTrigger: { trigger: coda, start: 'top top', end: '+=120%', pin: true, scrub: 0.6 },
        })
        .to(lines, { opacity: 1, y: 0, stagger: 0.5, ease: 'power2.out' })
    }

    q('.year__rail').forEach((rail) => {
      gsap.fromTo(
        rail,
        { y: -90 },
        {
          y: 90,
          ease: 'none',
          scrollTrigger: {
            trigger: rail.parentElement!,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    })
  }, ref as React.RefObject<HTMLElement>)

  const years = [...new Set(byMonth.map((m) => m.year))]

  return (
    <section className="section surface--dark ledger" ref={ref}>
      <div className="planes">
        <Plane speed={0.08} src="/planes/cloth.webp" className="plane plane--cloth" scale={1.1} />
      </div>
      <div className="grain" aria-hidden="true" />

      <div className="ledger__head">
        <p className="eyebrow">The record</p>
        <MaskedLines as="h2" text="Every transfer, in order." className="h2" />
        <p className="dim" style={{ marginTop: '1rem' }}>
          Money reaches the families through two coordinators, and most transfers cover
          several households at once, so the record is kept by transfer rather than by
          child. Nobody here is named. Nothing here identifies a child.
          {isPlaceholder ? ' The rows below are placeholders.' : ''}
        </p>
      </div>

      <p className="ledger__running">
        <span className="ledger__running-label">Given by this point</span>
        <span className="ledger__running-value num" ref={runningRef}>
          {show(view, total, totalGbp)}
        </span>
        <span className="ledger__progress" aria-hidden="true" />
      </p>

      {years.map((y) => (
        <div className="year" key={y}>
          <span className="year__rail num" aria-hidden="true">
            {y}
          </span>
          {byMonth
            .filter((m) => m.year === y)
            .map((m) => (
              <div className="month" key={m.month}>
                <p className="month__when">
                  {monthLabel(m.month)}
                  <span className="month__total num">{show(view, m.total, m.totalGbp)}</span>
                  {m.month < completeFrom ? (
                    <span className="month__flag">partial record</span>
                  ) : null}
                </p>
                <ul className="rows">
                  {m.entries.map((e, i) => (
                    <li className="row" key={`${m.month}-${i}`}>
                      <span className="row__what">
                        <span className="row__ref num">{e.ref}</span>
                        <span className="row__cat">{e.category}</span>
                        {e.note ? <span className="row__note">{e.note}</span> : null}
                      </span>
                      <span className="row__leader" aria-hidden="true" />
                      <span className="row__amount num">{entryMoney(e, view)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      ))}

      <div className="coda">
        <p className="coda__line coda__line--big num">{show(view, total, totalGbp)}</p>
        <p className="coda__line">given across {entries.length} transfers, one at a time.</p>
        <p className="coda__line">
          {monthsRunning} months. Around {familiesSupportedNow} families today.
        </p>
      </div>
    </section>
  )
}
