import { MaskedLines, Plane, Reveal } from '../lib/motion'

export default function Verse() {
  return (
    <section className="section surface--dark verse">
      <div className="planes">
        <Plane speed={0.1} className="plane wash wash--sky" />
        <Plane speed={0.45} src="/planes/ink.webp" className="plane plane--ink" scale={1.2} />
      </div>
      <div className="grain" aria-hidden="true" />

      <div className="verse__inner">
        <p className="eyebrow">Where the name comes from</p>
        <blockquote style={{ margin: 0 }}>
          <span className="verse__cap" aria-hidden="true">
            P
          </span>
          <MaskedLines
            as="p"
            text="ure religion and undefiled before God and the Father is this, To visit the fatherless and widows in their affliction."
            label="Pure religion and undefiled before God and the Father is this, To visit the fatherless and widows in their affliction."
            className="verse__text"
            stagger={0.035}
          />
          <cite className="verse__cite">James 1:27, King James Version</cite>
        </blockquote>
        <Reveal as="p" className="verse__gloss">
          That verse is where the name comes from, and it is the whole brief. It sets a
          plain test: whether anyone was actually helped, and whether anything actually
          changed for them. Fees paid, flour delivered, a hospital bill covered. What
          follows is who we are, how it works, and every kwacha of it.
        </Reveal>
      </div>
    </section>
  )
}
