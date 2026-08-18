import { MaskedLines, Plane, Reveal } from '../lib/motion'
import { familiesSupportedNow } from '../data/ledger'

const facts = [
  ['Who we help', `Around ${familiesSupportedNow} families we support regularly, plus others who reach out when they are stuck. Someone needs school fees, or medicine, or food for the month, and we help where we can.`],
  ['What it pays for', 'School fees and exam fees, maize flour, cooking oil, eggs, soap, uniforms, school books, transport, and medical care when someone falls ill.'],
  ['How it is paid for', 'Out of our own pockets, the two of us, since 2022. We have never run an appeal or a fundraiser. We are only now letting other people help.'],
  ['Who does the work', 'Two coordinators in Malawi, and neither of them is paid. They are Christians who took it on because they wanted to. They collect the money, do the shopping, pay the schools, deliver everything and send back what they spent.'],
  ['The one person we pay', 'A housemother. She lives with one of the households, a family of young children, and looks after them day to day. She is the only wage in the whole thing, and it goes to the household that needed a grown up in it more than it needed anything else.'],
  ['What we want for them', 'Not only to be fed and in school. She is a committed Christian and the children have somebody steady to look up to, which matters to us as much as the flour does.'],
  ['How the money travels', 'A budget comes to us from Malawi. We send the money over. The people on the ground collect it, buy everything on the list, and send back what they spent.'],
]

export default function What() {
  return (
    <section className="section surface--paper">
      <div className="planes">
        <Plane speed={0.1} src="/planes/paper.webp" className="plane plane--paper" scale={1.1} />
      </div>

      <p className="eyebrow">What this is</p>
      <MaskedLines
        as="h2"
        text="Two of us, helping where we can, and keeping a record of it."
        className="h2"
      />

      <Reveal as="p" className="lead">
        We are not a charity and we do not have a name on a door. We started by helping one
        child with school fees, and it grew from there. What is unusual is not how much we
        give. It is that every kwacha is written down here, so anyone can check it.
      </Reveal>

      <dl className="facts">
        {facts.map(([k, v]) => (
          <Reveal className="fact" key={k}>
            <dt className="fact__k">{k}</dt>
            <dd className="fact__v">{v}</dd>
          </Reveal>
        ))}
      </dl>
    </section>
  )
}
