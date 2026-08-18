import { useRef } from 'react'
import gsap from 'gsap'
import { MaskedLines, Plane, useGsap } from '../lib/motion'

const steps = [
  {
    n: '01',
    t: 'A budget comes in',
    b: 'Someone in Malawi sends us the month’s needs as a list, item by item, with prices. A term of fees, a bag of flour, cooking oil, soap, a hospital bill.',
  },
  {
    n: '02',
    t: 'We send the money',
    b: 'We send it over the same week, in kwacha. Usually the person can go and collect it as cash the same day.',
  },
  {
    n: '03',
    t: 'They buy everything',
    b: 'They collect it, pay the school, buy what is on the list, and deliver it to the family. Nobody keeps a cut.',
  },
  {
    n: '04',
    t: 'They send it back to us',
    b: 'Photos of the shopping, the school receipt, whatever is left over. That is what each line in the record is, and why we can publish it.',
  },
]

export default function Flow() {
  const ref = useRef<HTMLElement | null>(null)

  useGsap(({ el }) => {
    const q = gsap.utils.selector(el)
    const track = q('.flow__track')[0] as HTMLElement
    const stage = q('.flow__stage')[0] as HTMLElement
    if (!track || !stage) return

    // the horizontal run is desktop only; everywhere else it stays a plain column
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px)', () => {
      const distance = () => Math.max(0, track.scrollWidth - stage.clientWidth)
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: () => '+=' + distance(),
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
      return () => tween.kill()
    })

    // in the column layout each step arrives on its own; in the horizontal run the
    // scroll is already doing that work, so nothing else is needed there
    mm.add('(max-width: 899px)', () => {
      q('.step').forEach((s) => {
        const parts = s.querySelectorAll('.step__n, .step__t, .step__b')
        gsap.set(parts, { opacity: 0, y: 24 })
        gsap.to(parts, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: s, start: 'top 92%', toggleActions: 'play none none reverse' },
        })
      })
    })
  }, ref as React.RefObject<HTMLElement>)

  return (
    <section className="section surface--dark flow" id="route" ref={ref}>
      <div className="planes">
        <Plane speed={0.08} src="/planes/cloth.webp" className="plane plane--cloth" scale={1.1} />
      </div>
      <div className="grain" aria-hidden="true" />

      <p className="eyebrow">Ask to delivery</p>
      <MaskedLines as="h2" text="A budget in, the money out, the shopping done." className="h2" />

      <div className="flow__stage">
        <ol className="flow__track">
          {steps.map((s) => (
            <li className="step" key={s.n}>
              <p className="step__n num">{s.n}</p>
              <h3 className="step__t">{s.t}</h3>
              <p className="step__b">{s.b}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
