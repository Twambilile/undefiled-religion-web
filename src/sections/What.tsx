import { MaskedLines, Plane, Reveal } from '../lib/motion'
import { familiesSupportedNow } from '../data/ledger'

const facts = [
  ['Who it is for', `Orphans and families in need in Malawi, around ${familiesSupportedNow} of them at the moment. Some have been supported since the first year.`],
  ['What it pays for', 'School fees and exam fees, maize flour and cooking oil and eggs, soap, uniforms, school books, transport, and medical care when someone falls ill.'],
  ['How it has been funded', 'Privately, by one family, since the start. It has never run an appeal or held a fundraiser, and it is only now opening up to others who want to help.'],
  ['Who runs it', 'Two coordinators in Malawi who buy, deliver and account for everything, and who send the receipts back.'],
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
        text="A small, private, unglamorous arrangement that has not missed a month."
        className="h2"
      />

      <Reveal as="p" className="lead" >
        There is no office and no staff. Money leaves a bank account in London, arrives in
        Malawi the same day, and turns into flour, fees and shoes within the week. What
        makes it unusual is not the scale. It is that all of it is written down and none of
        it is hidden.
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
