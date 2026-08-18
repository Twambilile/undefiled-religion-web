import { MaskedLines, Plane, Reveal } from '../lib/motion'

const steps = [
  {
    k: 'Now',
    v: 'Rented houses, spread out. Everything has to be carried to each one: the flour, the fees, the trip to the school gate, the visit when somebody is ill.',
  },
  {
    k: 'What we want',
    v: 'One place of our own. Somewhere more of them can live, eat and go to school from, with the food arriving once instead of five times.',
  },
  {
    k: 'Why',
    v: 'It costs less to run one place than five. It is easier to keep an eye on, easier to staff properly, and it means a child is not moved again the next time a landlord puts the rent up.',
  },
]

export default function Vision() {
  return (
    <section className="section surface--dark vision" id="vision">
      <div className="planes">
        <Plane speed={0.1} src="/planes/sky.webp" className="plane plane--sky" scale={1.12} />
        <Plane speed={0.55} className="plane wash wash--earth" />
      </div>
      <div className="grain" aria-hidden="true" />

      <p className="eyebrow">Where this is going</p>
      <MaskedLines
        as="h2"
        text="One place, instead of a house here and a house there."
        className="h2"
      />

      <Reveal as="p" className="lead">
        We rent at the moment, and the families are scattered. What we would like, in
        time, is a place of our own: a compound where more of them can be housed, fed and
        schooled from one spot, and where one delivery feeds everybody.
      </Reveal>

      <dl className="facts">
        {steps.map((s) => (
          <Reveal className="fact" key={s.k}>
            <dt className="fact__k">{s.k}</dt>
            <dd className="fact__v">{s.v}</dd>
          </Reveal>
        ))}
      </dl>

      <Reveal as="p" className="dim vision__note">
        We are not collecting for it and there is no target on this page. It is years off
        and it may not happen. We are saying it out loud because if you are going to help,
        you should know what we are eventually trying to build.
      </Reveal>
    </section>
  )
}
