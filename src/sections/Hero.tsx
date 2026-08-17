import { useRef } from 'react'
import gsap from 'gsap'
import { Link } from 'react-router-dom'
import { Counter, MaskedLines, Plane, useGsap } from '../lib/motion'
import { useCurrency } from '../lib/currency'
import { entries, familiesSupportedNow, show, total, totalGbp } from '../data/ledger'

export default function Hero() {
  const ref = useRef<HTMLElement | null>(null)
  const { view } = useCurrency()

  useGsap(({ el }) => {
    const q = gsap.utils.selector(el)
    gsap.set(q('[data-hero-fade]'), { opacity: 0, y: 22 })
    gsap.timeline({ delay: 0.15 }).to(q('[data-hero-fade]'), {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.12,
      ease: 'power3.out',
    })
    gsap.to(q('.hero__title'), {
      yPercent: -14,
      opacity: 0.35,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
    })
  }, ref as React.RefObject<HTMLElement>)

  return (
    <section className="section surface--dark hero" ref={ref}>
      <div className="planes">
        <Plane speed={0.05} src="/planes/sky.webp" className="plane plane--sky" scale={1.12} />
        <Plane speed={0.16} className="plane wash wash--sky" />
        <Plane speed={0.42} src="/planes/dust.webp" className="plane plane--dust" scale={1.18} />
        <Plane speed={0.8} className="plane wash wash--earth" />
      </div>
      <div className="grain" aria-hidden="true" />

      <p className="eyebrow" data-hero-fade>
        Malawi, since 10 October 2022
      </p>

      <MaskedLines
        as="h1"
        text="Undefiled Religion"
        className="hero__title"
        start="top 100%"
      />

      <div className="hero__foot">
        <p className="lead hero__lead" data-hero-fade>
          School fees, food, supplies and clothing for orphans and families in need in
          Malawi. Funded by one family for four years, published down to the last
          transfer, and now opening up to others who want to help.
        </p>

        <p className="total" data-hero-fade>
          <span className="total__label">Given since 2022</span>
          <span className="total__value num">
            <Counter
              value={view === 'GBP' ? totalGbp : total}
              format={(n) => show(view, n, n)}
            />
          </span>
          <span className="total__sub num">
            {entries.length} transfers, around {familiesSupportedNow} families
          </span>
        </p>
      </div>

      <p className="hero__scroll" data-hero-fade>
        <Link to="/ledger">Read the whole record</Link>
      </p>
    </section>
  )
}
