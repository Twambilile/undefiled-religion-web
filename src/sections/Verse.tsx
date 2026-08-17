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
          <MaskedLines
            as="p"
            text="Pure religion and undefiled before God and the Father is this, To visit the fatherless and widows in their affliction."
            className="verse__text"
            stagger={0.035}
          />
          <cite className="verse__cite">James 1:27, King James Version</cite>
        </blockquote>
        <Reveal as="p" className="verse__gloss">
          Undefiled means unmixed. The verse sets a fairly ordinary test: whether anyone
          was actually visited, and whether anything actually changed for them. School
          fees paid, flour delivered, a hospital bill covered. The rest of this site is
          just the arithmetic of that.
        </Reveal>
      </div>
    </section>
  )
}
