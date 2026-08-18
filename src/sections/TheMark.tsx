import { useRef } from 'react'
import { MaskedLines, Plane, Reveal, motionOff } from '../lib/motion'
import { useInViewClass } from '../lib/motion'
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
      <MaskedLines as="h2" text="Nine of them, and the ninth is smaller." className="h2" />

      <div className="themark__grid">
        <div className="themark__stage" ref={holder}>
          <Mark size={200} animated={!motionOff()} title="The Undefiled Religion mark: nine dots, the ninth smaller and lit" />
        </div>

        <div className="themark__body">
          <Reveal as="p" className="lead">
            Eight of the nine are drawn the same: same size, same ink. In a list of
            people that is what everybody looks like. The ninth is smaller, and it is
            the only one carrying any colour, so it is the one your eye goes to.
          </Reveal>

          <Reveal as="p">
            It goes there because it is the least, which is the argument the verse is
            making. Nothing joins the grid and nothing leaves it. The same nine are
            there at the end as at the beginning. All that moves is the attention.
          </Reveal>

          <Reveal>
            <blockquote className="themark__quote">
              <p className="themark__verse">
                Inasmuch as ye have done it unto one of the least of these my brethren,
                ye have done it unto me.
              </p>
              <cite className="verse__cite">Matthew 25:40, King James Version</cite>
            </blockquote>
          </Reveal>

          <Reveal as="p" className="dim">
            It is also the shape of the record. Most months are one more ordinary
            payment among many, and the one that matters is whichever family had the
            worst month.
          </Reveal>
        </div>
      </div>
    </section>
  )
}
