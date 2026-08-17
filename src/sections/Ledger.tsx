import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MaskedLines, Plane, useGsap } from '../lib/motion'
import { byMonth, isPlaceholder, money, monthLabel, total } from '../data/ledger'

/** Cumulative total at the end of each month, in scroll order. */
const cumulative = (() => {
  let run = 0
  return byMonth.map((m) => (run += m.total))
})()

export default function Ledger() {
  const ref = useRef<HTMLElement | null>(null)
  const runningRef = useRef<HTMLSpanElement | null>(null)

  useGsap(({ el }) => {
    const q = gsap.utils.selector(el)

    // rows arrive as their month enters, and leave again on the way back up
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
            if (self.isActive) value.textContent = money(cumulative[i])
          },
          onEnterBack: () => {
            value.textContent = money(i > 0 ? cumulative[i - 1] : 0)
          },
        })
      })
    }

    // year numerals sit deep behind the rows and drift slowly
    q('.year__rail').forEach((rail) => {
      gsap.fromTo(
        rail,
        { yPercent: -30 },
        {
          yPercent: 30,
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

  // group months under their year
  const years = [...new Set(byMonth.map((m) => m.year))]

  return (
    <section className="section surface--dark ledger" ref={ref}>
      <div className="planes">
        <Plane speed={0.12} className="plane" style={{ backgroundImage: 'var(--img-cloth)' }} />
      </div>
      <div className="grain" aria-hidden="true" />

      <div className="ledger__head">
        <p className="eyebrow">The record</p>
        <MaskedLines as="h2" text="Every payment, since the first one." className="beat__what" />
        <p className="dim" style={{ marginTop: '1rem' }}>
          Four years, in order. Families appear as initials only. Nothing here identifies a
          child.
          {isPlaceholder ? ' The rows below are placeholders and every amount is zero.' : ''}
        </p>
      </div>

      <p className="ledger__running">
        <span className="ledger__running-label">Given by this point</span>
        <span className="ledger__running-value num" ref={runningRef}>
          {money(total)}
        </span>
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
                  <span className="month__total num">{money(m.total)}</span>
                </p>
                <ul className="rows">
                  {m.entries.map((e, i) => (
                    <li className="row" key={`${m.month}-${i}`}>
                      <span className="row__what">
                        <span className="row__ref num">{e.ref}</span>
                        <span className="row__cat">{e.category}</span>
                        {e.note ? <span className="row__note">{e.note}</span> : null}
                      </span>
                      <span className="row__amount num">{money(e.amount)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      ))}
    </section>
  )
}
