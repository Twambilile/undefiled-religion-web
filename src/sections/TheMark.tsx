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
            A circle, a square, a triangle, a diamond, an arch, a capsule. Some large,
            some small, three of them carrying colour and the rest taking the ink of
            whatever they sit on. Nobody in this is interchangeable and the mark does not
            pretend otherwise.
          </Reveal>

          <Reveal as="p">
            What holds it together is the grid. Every shape sits on its own point, none
            of them touch, and it still reads as one object. That is the argument: the
            difference is the point, and so is the fact that it is one thing.
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

          <Reveal as="p" className="dim">
            There is an older line that fits this project more exactly. Psalm 68 says God
            sets the solitary in families. That is the thing we are actually trying to
            do, and it is why the shapes are a family rather than a logo of a hand or a
            heart.
          </Reveal>
        </div>
      </div>
    </section>
  )
}
