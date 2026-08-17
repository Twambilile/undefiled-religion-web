import { useRef } from 'react'
import gsap from 'gsap'
import { Counter, MaskedLines, useGsap } from '../lib/motion'
import { byCategory, byYear, money } from '../data/ledger'

const pct = (n: number) => `${Math.round(n * 100)}%`

export default function Breakdown() {
  const ref = useRef<HTMLElement | null>(null)

  useGsap(({ el }) => {
    const q = gsap.utils.selector(el)
    q('.bar').forEach((bar) => {
      const fill = bar.querySelector('.bar__fill') as HTMLElement | null
      if (!fill) return
      const share = Number(fill.dataset.share || 0)
      gsap.set(fill, { scaleX: 0 })
      gsap.to(fill, {
        scaleX: share,
        duration: 1.3,
        ease: 'power3.out',
        scrollTrigger: { trigger: bar, start: 'top 88%', toggleActions: 'play none none reverse' },
      })
    })
  }, ref as React.RefObject<HTMLElement>)

  return (
    <section className="section surface--paper" ref={ref}>
      <p className="eyebrow">Where it went</p>
      <MaskedLines as="h2" text="By category, and by year." className="beat__what" />

      <ul className="bars" style={{ marginTop: 'clamp(3rem, 8vh, 5rem)' }}>
        {byCategory.map((c) => (
          <li className="bar" key={c.key}>
            <span className="bar__top">
              <span className="bar__key">{c.key}</span>
              <span className="bar__figs">
                <span className="num">{c.count} payments</span>
                <span className="bar__amount num">{money(c.total)}</span>
              </span>
            </span>
            <span className="bar__track">
              <span className="bar__fill" data-share={c.share} />
            </span>
            <span className="dim num" style={{ fontSize: '0.8rem' }}>
              {pct(c.share)} of everything given
            </span>
          </li>
        ))}
      </ul>

      <div className="years">
        {byYear.map((y) => (
          <p className="yearstat" key={y.key}>
            <span className="yearstat__key num">{y.key}</span>
            <span className="yearstat__value num">
              <Counter value={y.total} format={(n) => money(n)} />
            </span>
            <span className="dim num" style={{ fontSize: '0.8rem' }}>
              {y.count} payments
            </span>
          </p>
        ))}
      </div>
    </section>
  )
}
