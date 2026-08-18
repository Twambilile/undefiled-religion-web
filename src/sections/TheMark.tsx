import { useRef } from 'react'
import { MaskedLines, Plane, Reveal, motionOff, useInViewClass } from '../lib/motion'
import Mark from '../components/Mark'

export default function TheMark() {
  const holder = useRef<HTMLDivElement | null>(null)
  useInViewClass(holder, 'top 78%')

  return (
    <section className="section surface--paper themark" id="mark">
      <div className="planes">
        <Plane speed={0.1} src="/planes/paper.webp" className="plane plane--paper" scale={1.1} />
      </div>

      <p className="eyebrow">The mark</p>
      <MaskedLines as="h2" text="Nine shapes, no two the same, on one grid." className="h2" />

      <div className="themark__grid">
        <div className="themark__stage" ref={holder}>
          <Mark
            size={220}
            animated={!motionOff()}
            title="The Undefiled Religion mark: nine different shapes arranged on one grid"
          />
        </div>

        <div className="themark__body">
          <Reveal as="p" className="lead">
            A circle, a square, a diamond, an arch. Different shapes because we are
            different members with different places in the body of Christ, and none of us
            is a copy of anybody else.
          </Reveal>

          <Reveal as="p">
            What holds it together is the grid. Every shape sits on its own point, none
            of them touch, and it still reads as one thing.
          </Reveal>

          <Reveal>
            <blockquote className="themark__quote">
              <p className="themark__verse">
                For as the body is one, and hath many members, and all the members of
                that one body, being many, are one body.
              </p>
              <cite className="verse__cite">1 Corinthians 12:12, King James Version</cite>
            </blockquote>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
